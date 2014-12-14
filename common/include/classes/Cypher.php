<?php
// The GnuPG Binary file
define("GPG_BIN", "/usr/bin/gpg");
// The default parameters to use the GnuPG
define("GPG_PARAMS", " --no-tty --no-secmem-warning --home ");
// Where the users dir will be created
define("GPG_USER_DIR", getcwd() . ".gnupg");
// The minimum lenght accepted of the passphrase
define("GPG_PASS_LENGTH", 8);
// Generate or not logs in the HTTP log
define("GEN_HTTP_LOG", false);

define("GPG", "GPG");
define("RSA", "RSA");
// Defining log levels
define("E", "error");
define("W", "warn");
define("I", "info");
define("D", "debug");
define("T", "trace");


class Cypher {
        function __construct($user_data, $mode) {
                // The working path based on the script path
                chdir("../../");
                $this->gpg_path = getcwd() . DIRECTORY_SEPARATOR . ".gnupg";
                $this->user_data = $user_data;
                $this->user_path();

                switch($mode) {
                        case "PGP":     $this->mode = GPG;      break;
                        case "RSA":     $this->mode = RSA;      break;
                }
        }

        /**
         * Transform a mail address to path friendly
         * @param  string       $email          The email address
         * @return string                       Transformed email address
         */
        private function mail_path($email) {
                return preg_replace("[@]", "_", $email);
        }
        /**
         * Collect data
         * @param void          $key            The key of array. If is array will be parsed instead of $value
         * @param string        $value          The value of array. If $key is an array $value will be ignored
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
         * @param  array         $data           The array with data to filter
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
        * @param  string       $type           The log level
        * @param  string       $message        The message to log
        */
        private function log($type = E, $message) {
                $log_path = $this->gpg_path . DIRECTORY_SEPARATOR . "log";
                // Create the log dir if not exists
                if(!is_dir($log_path)) {
                        if(!mkdir($log_path, 0777)){
                                throw new Exception("Error: Cannot create the log path: " . $this->gpg_path);
                        } else {
                                chmod($log_path, 0777);
                        }
                }
                $log_file = $log_path . DIRECTORY_SEPARATOR . $this->mail_path($this->user_data["email"]) . ".log";
                $log_message = "[" . date("Y-m-d H:i:s.u") . "] [" . strtoupper($type) . "] " . $message . "\n";

                        // Open file and dump the plaintext contents into it
                        $fd = @fopen($log_file, "a");
                        if(!$fd){
                                // Integrate with your exception system
                                throw new Exception("Error: Canot create the log file");
                        }
                        @fputs($fd, $log_message);
                        @fclose($fd);
                        chmod($log_file, 0777);

                if($type == E) {
                        // Integrate with your exception system
                        throw new Exception("\n\n" . $log_message . "\n");
                }
        }

        /**
         * Transform a given email address to the full directory user path
         * @return string        The full directory user path
         */
        private function user_path() {
                // Create GnuPG working dir if not exists
                if(!is_dir($this->gpg_path)) {
                        if(!mkdir($this->gpg_path)){
                                $this->log(E, "Cannot create the working gpg path: " . $this->gpg_path);
                                return false;
                        } else {
                                chmod($this->gpg_path, 0777);
                        }
                }
                $this->user_conf = $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_path($this->user_data["email"]) . ".conf";
                if(!isset($this->user_data["fingerprint"])) {
                        $this->user_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->mail_path($this->user_data["email"]);
                } else {
                        $this->user_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->$user_data["fingerprint"];
                }
                // Store
                // $this->store("user_path", $this->user_path);
                // $this->store("user_conf", $this->user_conf);
        }

        /**
         * Check if the user dir exists.
         * If $create is set to true will try to create the dir if not exists
         * @param  bool         $create         Create the dir if not exists
         * @return bool                         True = The user dir exists | False = The user dir do not exists
         */
        private function check_user_path($create = false){
                if(!$create) {
                        return is_dir($this->user_path);
                } else {
                        if(!is_dir($this->user_path)) {
                                if(!file_exists($this->user_path) && !file_exists($this->user_conf)){
                                        if(!mkdir($this->user_path)){
                                                $this->log(E, "Cannot create a new user dir " . $this->user_path);
                                                return false;
                                        } else {
                                                chmod($this->user_path, 0777);
                                                return true;
                                        }
                                } else {
                                        $this->log(E, "This user already exist, please try another e-mail address");
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
                        $this->log(E, "Fingerprint is not defined");
                        return false;
                }

                $this->finger_path = $this->gpg_path . DIRECTORY_SEPARATOR . $this->user_data["fingerprint"][0];
                if(!rename($this->user_path, $this->finger_path)) {
                        $this->log(E, "Cannot rename the user path: " . $this->user_path . " to " . $this->finger_path);
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
        * Save config file for generate the user PGP key
        * @return string                               The full path of the config file
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
                $fd = @fopen($config_file, "w+");
                if(!$fd){
                        $this->log(E, "Cannot create the temporary config file");
                        return false;
                }
                @fputs($fd, $tmp_config);
                @fclose($fd);
                // $this->store("key", array("data" => $tmp_conf, "generated file" => $tmp_config));

                unset($tmp_config);

                return $config_file;
        }

        /**
        * Save user data for login
        * @return [type] [description]
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

                // WARNING:
                // This file must to be encrypted!
                // Use the JCryption RSA public key and decrypt it when you need
                // -------------------------------------------------------------
                $config_file = $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_path($this->user_data["email"]) . ".conf";
                // Open file and dump the plaintext contents into it
                $fd = @fopen($config_file, "w+");
                if(!$fd){
                        $this->log(E, "Cannot create the user conf file");
                        return false;
                }
                @fputs($fd, "[User]\n" . $tmp_config);
                @fclose($fd);
                // -------------------------------------------------------------
        }

        /**
         * Identify an user by email address
         * @return array                                An array with user data
         */
        public function identify() {
                $conf = $this->gpg_path . DIRECTORY_SEPARATOR . "." . $this->mail_path($this->user_data["email"]) . ".conf";
                if(file_exists($conf)) {
                        $p_conf = parse_ini_file($conf);
                        $this->store_user_data($p_conf);
                }
                print_r($this->repo);
        }

        /**
         * Display the fingerprint of a given email address
         * @param  string       $email          The email address of stored user
         * @param  bool         $with_spaces    Show with spaces or not
         * @return string                       The fingerprint of user
         */
        public function export_fingerprint($with_spaces = true) {
                $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) . " --batch --fingerprint";
                if(GEN_HTTP_LOG){
                        $command .= " 2>/dev/null &";
                }
                exec($command, $output, $error_code);
                if($error_code){
                        $this->log(E, "Cannot retrieve fingerprint from the key with command: " . $command . " error_code: " . $error_code);
                        return(false);
                }
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

        // /**
        //  * Return data about generate key
        //  * @param  string       $fingerprint           The key fingerprint
        //  * @return array                                An array of key data
        //  */
        // private function get_conf($fingerprint) {
        //         $finger_path = $this->finger_path($fingerprint);
        //         $conf = file($finger_path . DIRECTORY_SEPARATOR . ".key.conf");
        //
        //         foreach($conf as $k => $v) {
        //                 if(strstr($v, ": ")) {
        //                         $conf2 = explode(": ", $v);
        //
        //                         foreach($conf2 as $kk => $vv) {
        //                                 $config[strtolower(trim($conf2[0]))] = trim($conf2[1]);
        //                         }
        //                 }
        //         }
        //         return $config;
        // }

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
                                $this->log(E, "Cannot export the public key with command: " . $command . " error_code: " . $error_code);
                                return(false);
                        }
                        $this->public_key = implode("\n", $result);
                        if($save_file) {
                                $fd = @fopen($pubring_file, "w+");
                                if(!$fd){
                                        $this->log(E, "Cannot create the pubring file");
                                        return false;
                                }
                                @fputs($fd, $this->public_key);
                                @fclose($fd);
                        }
                } else {
                        $this->public_key = file_get_contents($pubring_file);
                }

                $this->store("public_key", $this->public_key);
                return $this->public_key;
        }

        /**
        * Export the public key to a given server
        * @param  string         $key_server              Target Key Server
        */
        public function export_key_to_server($key_server = "pgp.mit.edu") {

        }

        /**
         * Generate an asimmetric key-pair depending on the given mode
         */
        public function generate_key() {
                switch($this->mode) {
                        case "GPG":     $this->generate_pgp_key($this->user_data);      break;
                        case "RSA":                                                     break;
                        default:        print "no mode";                                break;
                }
        }

        /**
        * Generate GPG key-pair
        * @param  array        $user_data      The user data: [name, email, (comment), (passphrase)]
        * @return array                        An array with the fingerprint and the public key
        */
        public function generate_pgp_key() {
                if(empty($this->user_data["name"])){
                        $this->log(E, "The username is empty");
                        return false;
                }
                if(empty($this->user_data["email"])){
                        $this->log(E, "The email is empty");
                        return false;
                }
                if(empty($this->user_data["comment"])) {
                        $this->log(I, "The user '" . $this->user_data["email"] . "' has no comment for its key");
                }
                if($this->check_user_path(true)) {
                        if(!isset($this->user_data["passphrase"]) || empty($this->user_data["passphrase"])){
                                $this->user_data["passphrase"] = $this->generate_default_passphrase();
                        }
                        if(strlen(trim($this->user_data["passphrase"])) < GPG_PASS_LENGTH){
                                $this->log(E, "The passphrase is too short");
                                return false;
                        }
                        $this->store_user_data();
                        // Save the temporary config file
                        $config_file = $this->save_conf();
                        // invoque the GnuPG to generate the key
                        $command = GPG_BIN.GPG_PARAMS . escapeshellarg($this->user_path) ." --batch --no-random-seed-file --gen-key --armor " . escapeshellarg($config_file);
                        if(GEN_HTTP_LOG){
                                $command .= " 2> " . escapeshellarg($this->user_path) . DIRECTORY_SEPARATOR . "log.txt < /dev/null &";
                        } else {
                                $command .= " 2> /dev/null < /dev/null &";
                        }
                        exec($command, $output, $error_code);

                        if($error_code){
                                $this->log(E,  "Cannot generate the key with command: " . $command . " error_code: " . $error_code);
                                // Remove created dir
                                exec("rm -rf" . escapeshellarg($this->user_path));
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

                                print_r($this->repo);
                        }
                }
        }
}

// USAGE
header("Content-type: text/plain;");

$user_data = array(
        // "name" => "Antonio Rossi",
        "email" => "antonio.rossi@example.net"
        // "comment" => "",
        // "passphrase" => ""
);
$cypher = new Cypher($user_data, "PGP");
$cypher->identify();
?>
