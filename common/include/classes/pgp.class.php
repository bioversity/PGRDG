<?php

// The GnuPG Binary file
define("GPG_BIN", "/usr/bin/gpg");
// The System root dir
define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
// The include dir
define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
// The classes dir
define("CLASSES_DIR", INCLUDE_DIR . "classes/");
// The conf dir
define("CONF_DIR", INCLUDE_DIR . "conf/interface/");

// The default parameters to use the GnuPG
define("GPG_PARAMS", " --no-tty --no-secmem-warning --home ");
// Where the users dir will be created
define("GPG_USER_DIR", getcwd() . ".gnupg");
// The minimum lenght accepted of the passphrase
define("GPG_PASS_LENGTH", 8);
// Generate or not logs in the HTTP log
define("GEN_HTTP_LOG", false);

require_once(CLASSES_DIR . "frontend_api.class.php");

class PGP {
        const GPG = "GPG";
        // Log levels
        const E = "error";
        const W = "warn";
        const I = "info";
        const D = "debug";
        const T = "trace";

        function __construct($user_data) {
                // The absolute working path
                chdir(SYSTEM_ROOT . "common/");
                $this->gpg_path = getcwd() . DIRECTORY_SEPARATOR . ".gnupg";
                $this->user_data = $user_data;
                $this->repo = array();
                $this->check_user_data();
                $this->user_path();
                $this->site_config = $this->get_site_config();
        }

        /**
         * Include the parse_js_config.class.php and return the array of site.js
         * @return array                                The site configs
         */
        public function get_site_config() {
                require_once(CLASSES_DIR . "parse_json_config.class.php");

                $parse_json_config = new parse_json_config(CONF_DIR . "site.js");
                return $parse_json_config->parse_js_config("config");
        }

        /**
         * Check if required data was passed to the class
         * If $item will not be passed will check only for email address
         * @param  string       $item                   The item to check
         * @param  bool         $display_message        Display the error message?
         * @return bool
         */
        private function check_user_data($item = "", $display_message = true) {
                if(is_array($this->user_data)) {
                        if($item == "") {
                                $item = "email";
                        }
                        if(isset($this->user_data[$item]) && trim($this->user_data[$item]) !== "") {
                                return true;
                        } else {
                                if($display_message) {
                                        $this->log(self::E, "The " . $item . " is empty", false);
                                }
                                return false;
                        }
                } else {
                        $this->log(self::E, "No user data passed in the class", false);
                        return false;
                }
        }

        /**
         * Transform a mail address to path friendly
         * @param  string       $email                  The email address
         * @return string                               Transformed email address
         */
        private function mail_to_path($email) { return preg_replace("[@]", "_", $email); }

        /**
         * Collect data
         * @param  void         $key                    The key of array. If is array will be parsed instead of $value
         * @param  string       $value                  The value of array. If $key is an array $value will be ignored
         */
        private function store($key, $value = "") {
                if(is_array($key)) {
                        foreach($key as $k => $v) {
                                $this->repo[$k] = $v;
                        }
                } else {
                        $this->repo[$key] = $value;
                }
        }


        /**
         * Store selected user data
         * @param  array        $data                   The array with data to filter
         */
        private function store_user_data($data = array()) {
                if(count($data) == 0) {
                        $data = $this->user_data;
                }
                foreach($data as $k => $v) {
                        if($k == "name" ||  $k == "email" || $k == "fingerprint" || $k == "public_key") {
                                $store_user_data[$k] = $data[$k];
                        }
                }

                $this->store($store_user_data);
        }

        /**
        * Log error messages in user dir
        * @param   string       $type                   The log level
        * @param   string       $message                The message to log
        * @param   bool         $log                    Save in log file?
        */
        private function log($type = E, $message, $log = true) {
                $log_path = $this->gpg_path . DIRECTORY_SEPARATOR . "log";
                // Create the log dir if not exists
                if(!is_dir($log_path)) {
                        if(!mkdir($log_path, 0777)){
                                throw new Exception("Error: Cannot create the log path: " . $this->gpg_path);
                        } else {
                                chmod($log_path, 0777);
                        }
                }
                $log_file = $log_path . DIRECTORY_SEPARATOR . $this->mail_to_path($this->user_data["email"]) . ".log";
                $log_message = "[" . date("Y-m-d H:i:s.u") . "] [" . strtoupper($type) . "] " . $message . "\n";

                if($log) {
                        // Open file and dump the plaintext contents into it
                        $this->save_to_file($log_file, $log_message, "a");
                        chmod($log_file, 0777);
                }
                if($type == self::E) {
                        // Integrate with your exception system
                        throw new Exception("\n\n" . $log_message . "\n");
                }
        }

        /**
         * Transform a given email address to the full directory user path
         * @return string                               The full directory user path
         */
        private function user_path() {
                // Create GnuPG working dir if not exists
                if(!is_dir($this->gpg_path)) {
                        if(!mkdir($this->gpg_path)){
                                $this->log(self::E, "Cannot create the working gpg path: " . $this->gpg_path);
                                return false;
                        } else {
                                chmod($this->gpg_path, 0777);
                        }
                }

                $this->user_conf = $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_to_path($this->user_data["email"]) . ".conf";
                if(is_dir($this->gpg_path . DIRECTORY_SEPARATOR . $this->mail_to_path($this->user_data["email"]))) {
                        $this->user_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->mail_to_path($this->user_data["email"]);
                } else {
                        $fingerprint = "";
                        if(!$this->check_user_data("fingerprint", false)) {
                                $identify = $this->identify();
                                if(count($identify) == 0) {
                                        $fingerprint = "";
                                } else {
                                        $fingerprint = $identify["fingerprint"];
                                }
                        } else {
                                $fingerprint = $this->$user_data["fingerprint"];
                        }
                        if(empty($fingerprint)) {
                                $this->user_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->mail_to_path($this->user_data["email"]);
                        } else {
                                $this->user_path = $this->gpg_path . DIRECTORY_SEPARATOR . $fingerprint;
                        }

                }
                // Store
                $this->store("user_path", $this->user_path);
                $this->store("user_conf", $this->user_conf);
        }

        /**
         * Check if the user dir exists.
         * If $create is set to true will try to create the dir if not exists
         * @param  bool         $create                 Create the dir if not exists
         * @return bool                                 True = The user dir exists | False = The user dir do not exists
         */
        private function check_user_path($create = false){
                if(!$create) {
                        return is_dir($this->user_path);
                } else {
                        if(!is_dir($this->user_path)) {
                                if(!file_exists($this->user_path) && !file_exists($this->user_conf)){
                                        if(!mkdir($this->user_path)){
                                                $this->log(self::E, "Cannot create a new user dir " . $this->user_path);
                                                return false;
                                        } else {
                                                chmod($this->user_path, 0777);
                                                return true;
                                        }
                                } else {
                                        $this->log(self::E, "This user already exist, please try another e-mail address");
                                        return false;
                                }
                        } else {
                                return false;
                        }
                }
        }

        /**
         * Rename the user temp folder with its fingerprint
         * @return bool
         */
        private function rename_user_path() {
                if(!isset($this->user_data["fingerprint"]) || empty($this->user_data["fingerprint"][0])) {
                        $this->log(self::E, "Fingerprint is not defined");
                        return false;
                }

                $this->finger_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->user_data["fingerprint"][0];
                if(!rename($this->user_path, $this->finger_path)) {
                        $this->log(self::E, "Cannot rename the user path: " . $this->user_path . " to " . $this->finger_path);
                        return false;
                } else {
                        $this->store("user_path", $this->finger_path);
                        $this->user_path = $this->finger_path;

                        return true;
                }
        }

        /**
         * Generate a random passphrase
         * @return string The passphrase
         */
        private function generate_default_passphrase() {
                $bytes = openssl_random_pseudo_bytes(rand(100, 300));
                return bin2hex($bytes);
        }

        /**
         * Create a temporary file with given content
         * @param  string       $file                   The file name (including full path)
         * @param  string       $content                The content to put inside the file
         * @param  string       $mode                   The access mode, default is "w+"
         */
        private function save_to_file($file, $content, $mode = "w+") {
                chmod($this->user_path, 0777);

                $fd = @fopen($file, "w+");
                if(!$fd){
                        $this->log(self::E, "Cannot create temp file");
                        return false;
                }
                @fputs($fd, $content);
                @fclose($fd);
        }

        /**
        * Save config file for generate the user PGP key
        * @return  string                               The full path of the config file
        */
        private function save_conf() {
                $tmp_conf["Key-Type"] = "RSA";
                $tmp_conf["Key-Length"] = 2048;
                // $tmp_conf["Subkey-Type"] = "ELG-E";
                // $tmp_conf["Subkey-Length"] = 2048;
                $tmp_conf["Name-Real"] = utf8_decode($this->user_data["name"]);
                if (!empty($this->user_data["comment"])){
                        $this->user_data["Name-Comment"] = utf8_decode($this->user_data["comment"]);
                }
                $tmp_conf["Name-Email"] = $this->user_data["email"];
                $tmp_conf["Expire-Date"] = 0;
                $tmp_conf["Passphrase"] = $this->user_data["passphrase"];
                $tmp_conf["%commit"] = "";

                $tmp_config = implode("\n", array_map(function($v, $k) {
                        return $k . (($k[0] !== "%") ? ": " . $v : "");
                }, $tmp_conf, array_keys($tmp_conf)));

                // Generate token for unique filenames
                $tmp_token = md5(uniqid(rand()));
                // Create vars to hold paths and filenames
                $config_file = $this->user_path . DIRECTORY_SEPARATOR . ".key.conf";
                // Open file and dump the plaintext contents into it
                $this->save_to_file($config_file, $tmp_config);
                // $this->store("key", array("data" => $tmp_conf, "generated file" => $tmp_config));

                unset($tmp_config);

                return $config_file;
        }

        /**
        * Save user data for login
        */
        private function save_user_data() {
                $data["name"] = $this->user_data["name"];
                $data["email"] = $this->user_data["email"];
                $data["passphrase"] = $this->user_data["passphrase"];
                $data["fingerprint"] = $this->fingerprint;
                $data["public_key"] = $this->public_key;

                $tmp_config = implode("\n", array_map(function($v, $k) {
                        return $k . " = " . '"' . $v . '"';
                }, $data, array_keys($data)));

                $config_file = $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_to_path($this->user_data["email"]) . ".conf";
                // Open file and dump the plaintext contents into it
                $this->save_to_file($config_file, $tmp_config);
                chmod($config_file, 0600);
        }

        /**
        * Return data about generate key
        * @param  bool          $object                Return as object?
        * @return array                                An array of key data
        */
        private function get_conf($object = false) {
                if($object) {
                        return json_decode(json_encode(parse_ini_file($this->user_conf)));
                } else {
                        return parse_ini_file($this->user_conf);
                }
        }

        /**
         * Identify an user by email address
         * @return array                                An array with user data
         */
        public function identify() {
                $p_conf = $this->get_conf();
                $this->store_user_data($p_conf);

                return $this->repo;
        }

        /**
         * Display the fingerprint of a given email address
         * @param  bool         $with_spaces            Show with spaces or not
         * @return string                               The fingerprint of user
         */
        public function export_fingerprint($with_spaces = true) {
                $sfingerprint = str_replace("Key fingerprint = ", "", trim($output[3]));
                $fingerprint = preg_replace("[ ]", "", str_replace("Key fingerprint = ", "", trim($output[3])));
                $this->user_data["fingerprint"] = array($fingerprint, $sfingerprint);
                $this->store("fingerprint", array($fingerprint, $sfingerprint));

                if($with_spaces) {
                        return $sfingerprint;
                } else {
                        return $fingerprint;
                }
        }

        /**
         * Export the public key in ascii armored format
         * @param  bool         $save_file              If true save the key in a file
         * @return bool         False if failed
         */
        public function export_key($save_file = false){
                $pubring_file = $this->user_path . DIRECTORY_SEPARATOR . "pubring.asc";
                if(!file_exists($pubring_file)) {
                        $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) . " --batch --armor --export '" . $this->user_data["email"] . "'";
                        if(GEN_HTTP_LOG){
                                $command .= " 2>/dev/null &";
                        }
                        exec($command, $result, $error_code);
                        if($error_code){
                                $this->log(self::E, "Cannot export the public key with command: " . $command . " error_code: " . $error_code);
                                return(false);
                        }
                        $this->public_key = implode("\n", $result);
                        if($save_file) {
                                $this->save_to_file($pubring_file, $this->public_key);
                        }
                } else {
                        $this->public_key = file_get_contents($pubring_file);
                }

                $this->store("public_key", $this->public_key);
                return $this->public_key;
        }

        /**
        * Export the public key to a given server
        * @param   string       $key_server             Target Key Server
        */
        public function export_key_to_server($key_server = "pgp.mit.edu") {
                print "This function must be developed!";
                exit();
        }

        /**
        * Generate GPG key-pair
        * @return  array                                An array with the fingerprint and the public key
        */
        public function generate_key() {
                $this->check_user_data("name");
                $this->check_user_data("email");
                if(!isset($this->user_data["comment"]) || empty($this->user_data["comment"])) {
                        $this->log(self::I, "The user '" . $this->user_data["email"] . "' has no comment for its key");
                }

                if($this->check_user_path(true)) {
                        if(!isset($this->user_data["passphrase"]) || empty($this->user_data["passphrase"])){
                                $this->user_data["passphrase"] = $this->generate_default_passphrase();
                        }
                        if(strlen(trim($this->user_data["passphrase"])) < GPG_PASS_LENGTH){
                                $this->log(self::E, "The passphrase is too short");
                                return false;
                        }
                        $this->store_user_data();
                        // Save the temporary config file
                        $config_file = $this->save_conf();
                        // invoque the GnuPG to generate the key
                        $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) . " --batch --no-random-seed-file --gen-key --armor " . escapeshellarg($config_file);
                        if(GEN_HTTP_LOG){
                                $command .= " 2> " . escapeshellarg($this->user_path) . DIRECTORY_SEPARATOR . "log.txt < /dev/null &";
                        } else {
                                $command .= " 2> /dev/null < /dev/null &";
                        }
                        exec($command, $output, $error_code);
                        if($error_code){
                                $this->log(self::E,  "Cannot generate the key with command: " . $command . " error_code: " . $error_code);
                                // Remove created dir
                                $this->remove_key();
                                return false;
                        } else {
                                // Set the array to export
                                $this->fingerprint = $this->export_fingerprint(false);
                                // Rename temp user dir with its fingerprint
                                $this->rename_user_path();
                                $this->public_key = $this->export_key(true);
                                $this->save_user_data();

                                // Clean unused files
                                @unlink($this->user_path . DIRECTORY_SEPARATOR . ".key.conf");
                                @unlink($this->user_path . DIRECTORY_SEPARATOR . "pubring.gpg~");
                                chmod($this->user_path, 0600);

                                // Send everything to the Service
                                return $this->send_to_service($this->repo);
                        }
                }
        }

        /**
         * Remove a stored Key.
         * Search for a config file of a given email address and remove its key.
         * If no email will be passed directly will acquire from the class params
         * @param  string       $email                  An email address
         * @return bool                                 If passed
         */
        public function remove_key($email = "") {
                if($email == "") {
                        if(file_exists($this->user_path)) {
                                $must_identify = false;
                                $user_path = $this->user_path;
                                // The key is not yet well-created, clean...
                                exec("rm -rf" . escapeshellarg($this->user_path));
                        } else {
                                $must_identify = true;
                        }
                } else {
                        $must_identify = true;
                }
                if($must_identify) {
                        $identify = $this->identify($this->user_data["email"]);
                        if(!@chmod($this->gpg_path . DIRECTORY_SEPARATOR . $identify["fingerprint"], 0600)) {
                                $this->log(self::E, "Cannot change permission to dir '" . $this->gpg_path . DIRECTORY_SEPARATOR . $identify["fingerprint"] . "', seems do not exists");
                        }
                        if(!@exec("rm -rf " . $this->gpg_path . DIRECTORY_SEPARATOR . $identify["fingerprint"])) {
                                $this->log(self::E, "Cannot remove directory '" . $this->gpg_path . DIRECTORY_SEPARATOR . $identify["fingerprint"] . "', seems do not exists");
                        }
                        if(!@exec("rm " . $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_to_path($identify["email"]) . ".conf")) {
                                $this->log(self::E, "Cannot remove user conf dir: '" . $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_to_path($identify["email"]) . "'. seems do not exists");
                        }

                        return true;
                }

        }

        /**
         * Encrypt a given message
         * @param  string       $message                The message to encrypt
         * @return string                               The encrypted message
         */
        public function encrypt_message($message) {
                $token = md5(uniqid(rand()));

                $temp_file = $this->user_path . DIRECTORY_SEPARATOR . $token . "_message";
                $this->save_to_file($temp_file, $message);

                $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) . " --batch --encrypt --armor -r " . escapeshellarg($this->user_data["email"]) . " " . $temp_file;

                if(GEN_HTTP_LOG){
                        $command .= " 2> " . escapeshellarg($this->user_path) . DIRECTORY_SEPARATOR . "log.txt < /dev/null &";
                } else {
                        $command .= " 2> /dev/null < /dev/null &";
                }
                exec($command, $output, $error_code);

                if($error_code){
                        $this->log(self::E,  "Cannot encrypt the message", false);
                        return false;
                } else {
                        chmod($temp_file . ".asc", 0777);
                        $encrypted = file_get_contents($temp_file . ".asc");
                        // Clean
                        unlink($temp_file);
                        unlink($temp_file . ".asc");

                        return $encrypted;
                }
                chmod($this->user_path, 0600);
        }

        /**
        * Decrypt a given crypted message
        * @param  string       $message                The crypted message to decrypt
        * @return string                               The decrypted message
        */
        public function decrypt_message($message) {
                $token = md5(uniqid(rand()));

                $temp_file = $this->user_path . DIRECTORY_SEPARATOR . $token . "_message";
                $this->save_to_file($temp_file, $message);

                $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) . " --batch --passphrase '" . $this->get_conf(true)->passphrase . "' -d " . $temp_file;

                if(GEN_HTTP_LOG){
                        $command .= " 2> " . escapeshellarg($this->user_path) . DIRECTORY_SEPARATOR . "log.txt < /dev/null &";
                } else {
                        $command .= " 2> /dev/null < /dev/null &";
                }
                exec($command, $output, $error_code);

                if($error_code){
                        $this->log(self::E,  "Cannot decrypt the message", false);
                        return false;
                } else {
                        // Clean
                        unlink($temp_file);
                        return $output[0];
                }
                chmod($this->user_path, 0600);
        }

        /**
         * Send a GET request to the Service
         * @param  array        $params                 The params to append to the url
         */
        public function send_to_service($inviter, $params) {
                require_once(CLASSES_DIR . "Encoder.php");
                print_r($this->site_config);
                exit();
                $system_rsa_path = SYSTEM_ROOT . $interface["service"]["path"]["rsa"];
                print $system_rsa_path;
                $sys_pub_key = file_get_contents($system_rsa_path . "service_pub.pem");

                $frontend = new frontend_api();
                $encoder = new OntologyWrapper\Encoder();

                $querystring = array(
                        kAPI_REQUEST_OPERATION => kAPI_OP_INVITE_USER,
                        kAPI_REQUEST_LANGUAGE => $interface["site"]["default_language"],
                        kAPI_REQUEST_USER => $inviter,
                        kAPI_PARAM_OBJECT => $encoder->publicEncode(json_encode($params), $sys_pub_key)
                );
                $url = $interface["service"]["url"] . $interface["service"]["script"] . "?" . http_build_query($querystring);

                return $frontend->browse($url);
        }
}

?>
