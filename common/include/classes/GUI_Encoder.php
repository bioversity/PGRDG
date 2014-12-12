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

class Cypher {
        function __construct() {
                // The working path based on the script path
                chdir("../../");
                $this->gpg_path = getcwd() . DIRECTORY_SEPARATOR . ".gnupg";
        }

        /**
         * Transform an email address to the full directory user path
         * @param  string $email Email address
         * @return string        The full directory user path
         */
        private function user_path($email) {
                // Create GnuPG working dir if not exists
                if(!is_dir($this->gpg_path)) {
                        if(!mkdir($this->gpg_path)){
                                $this->error = "Error: Can't create the working gpg path: " . $this->gpg_path;
                                return false;
                        } else {
                                chmod($this->gpg_path, 0777);
                        }
                }

                return $this->gpg_path . DIRECTORY_SEPARATOR . preg_replace("[@]", "_", $email) . "_tmp";
        }

        /**
        * Return the full address for a given fingerprint
        * @param  string        $fingerprint    Fingerprint
        * @return string                        The full directory user path
        */
        private function finger_path($fingerprint) {
                return $this->gpg_path . DIRECTORY_SEPARATOR . $fingerprint;
        }

        /**
         * Check if the user dir exists.
         * If $create is set to true will try to create the dir if not exists
         * @param  string       $email          The user email address
         * @param  bool         $create         Create the dir if not exists
         * @return bool                         True = The user dir exists | False = The user dir do not exists
         */
        private function check_user_path($email, $create = false){
                $user_path = $this->user_path($email);
                if(!$create) {
                        return is_dir($user_path);
                } else {
                        if(!is_dir($user_path)) {
                                if(!file_exists($user_path)){
                                        if(!mkdir($user_path)){
                                                $this->error = "Error: Can't create a new user dir. (in function gen_key - 6) " . $this->gpg_path;
                                                return false;
                                        } else {
                                                chmod($user_path, 0777);
                                                return true;
                                        }
                                } else {
                                        $this->error = "Error: The user dir exist, please try another name. (in function gen_key - 8)";
                                        return false;
                                }
                        } else {
                                return false;
                        }
                }
        }

        /**
         * Rename the user temp folder with its fingerprint
         * @param  string       $email          The user email address
         * @return void                         False if error | The readable fingerprint if true
         */
        public function rename_user_path($email) {
                $user_fingerprint = $this->export_fingerprint($email, false);

                if(!rename($this->user_path($email), $this->gpg_path . DIRECTORY_SEPARATOR . $user_fingerprint)) {
                        $this->error = "Error: Can't rename the user path: " . $this->gpg_path . DIRECTORY_SEPARATOR . $user_fingerprint;
                        return false;
                } else {
                        return $this->finger_path($user_fingerprint);
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
         * Generate GPG key-pair
         * @param  [array] $user_data The user data: [name, email, (comment), (passphrase)]
         * @return [type]             [description]
         */
        private function generate_pgp_key($user_data) {
                // the utf8.php includes is necessary, because to generate the key is needed to
                // enter the characters in the UTF-8 form :-/
                // include("utf8.php");
                // verify the variables
                if(empty($user_data["name"])){
                        $this->error = "Error: The username is empty. (in function gen_key - 1)";
                        return false;
                }
                if(empty($user_data["email"])){
                        $this->error = "Error: The email is empty. (in function gen_key - 2)";
                        return false;
                }
                if($this->check_user_path($user_data["email"], true)) {
                        if(!isset($user_data["passphrase"]) || empty($user_data["passphrase"])){
                                $passphrase = $this->generate_default_passphrase();
                        } else {
                                $passphrase = $user_data["passphrase"];
                        }
                        if(strlen(trim($passphrase)) < GPG_PASS_LENGTH){
                                $this->error = "Error: The passphrase is too short. (in function gen_key - 4)".count(trim($passphrase));
                                return false;
                        }

                        // prepares the temporary config file
                        // $tmp_config = "Key-Type: DSA\r\nKey-Length: 1024\r\nSubkey-Type: ELG-E\r\nSubkey-Length: 2048\r\n";
                        $tmp_config = "Key-Type: RSA\r\nKey-Length: 2048\r\nSubkey-Type: ELG-E\r\nSubkey-Length: 2048\r\n";
                        $tmp_config .= "Name-Real: " . utf8_decode($user_data["name"]) . "\r\n";
                        if (!empty($comment)){
                                $tmp_config .= "Name-Comment: " . utf8_decode($comment) . "\r\n";
                        }
                        $tmp_config .= "Name-Email: " . $user_data["email"] . "\r\nExpire-Date: 0\r\nPassphrase: " . $passphrase . "\r\n";
                        $tmp_config .= "%commit\r\n";
                        // generate token for unique filenames
                        $tmp_token = md5(uniqid(rand()));
                        // create vars to hold paths and filenames
                        $tmp_config_file = $this->user_path($user_data["email"]) . "/." . $tmp_token . ".conf";
                        // open .data file and dump the plaintext contents into this
                        $fd = @fopen($tmp_config_file, "w+");
                        if(!$fd){
                                $this->error = "Error: Can't create the temporary config file. Verify if you have write permission on the dir.(in function gen_key - 9)";
                                return false;
                        }
                        @fputs($fd, $tmp_config);
                        @fclose($fd);
                        unset($tmp_config);
                        // invoque the GnuPG to generate the key
                        $home = $this->user_path($user_data["email"]);
                        $command = GPG_BIN.GPG_PARAMS . escapeshellcmd($home) ." --batch --gen-key -a " . escapeshellcmd($tmp_config_file);
                        if(GEN_HTTP_LOG){
                                $command .= " 2> " . escapeshellcmd($home) . "/log.txt < /dev/null &";
                        } else {
                                $command .= " 2> /dev/null < /dev/null &";
                        }
                        exec($command, $output, $error_code);

                        if(trim($user_data["passphrase"]) !== "") {
                                @unlink($tmp_config_file);
                        }
                        if($error_code){
                                $this->error = "Error: Can't generate the key. (in function encrypt - 10) ~ " . $command . "\n<br />" . $home;
                                // $this->RmdirR($home);
                                return false;
                        } else {
                                $finger_path = $this->rename_user_path($user_data["email"]);
                                chmod($finger_path, 0600);

                                return $this->export_fingerprint($user_data["email"]);
                        }
                }
        }

        /**
         * Display the fingerprint of a given email address
         * @param  string       $email          The email address of stored user
         * @param  bool         $with_spaces    Show with spaces or not
         * @return string                       The fingerprint of user
         */
        public function export_fingerprint($email, $with_spaces = true) {
                $user_path = $this->user_path($email);

                $command = GPG_BIN.GPG_PARAMS . $user_path . " --fingerprint";
                if(GEN_HTTP_LOG){
                        $command .= " 2>/dev/null &";
                }
                exec($command, $output, $error_code);
                if($error_code){
                        $this->error = "Error: Can't list the keys. (in function list_keys - 1)";
                        return(false);
                }
                if($with_spaces) {
                        return str_replace("Key fingerprint = ", "", trim($output[3]));
                } else {
                        return preg_replace("[ ]", "", str_replace("Key fingerprint = ", "", trim($output[3])));
                }
        }

        /**
         * Export the owner public key in asc armored format.
         * @return bool False if failed
         */
        // public  function export_key(){ // TODO: option to make an file to attachment
        //         if(!$this->check_all()){
        //                 return(false);
        //         }
        //         // first check if the key is on the keyring
        //         if (!$this->check_keyID($this->recipientEmail)){
        //                 return(false);
        //         }
        //         $priv_path = $this->gpg_path.ereg_replace("[@]","_",$this->userEmail)."/.gnupg";
        //         $command = GPG_BIN.GPG_PARAMS.$priv_path." --batch --armor --export '".$this->userEmail."'";
        //         if(GEN_HTTP_LOG){
        //                 $command .= " 2>/dev/null";
        //         }
        //         exec($command, $result, $errorcode);
        //         if($errorcode){
        //                 $this->error = "Error: Can't export the public key. (in function export_key - 1)";
        //                 return(false);
        //         }
        //         $this->public_key = implode("\n",$result);
        //         return(true);
        // }

        public function set_mode($mode) {
                switch($mode) {
                        case "PGP":
                                $this->mode = GPG;
                                break;
                        case "RSA":
                                $this->mode = RSA;
                                break;
                }
                return $this->mode;
        }

        /**
         * Generate an asimmetric key-pair depending on the given mode
         * @param  [array] $user_data The user data: [name, email, (comment), (passphrase)]
         * @return [type]            [description]
         */
        public function generate_key($user_data) {
                switch($this->mode) {
                        case "GPG":
                                $this->generate_pgp_key($user_data);
                                break;
                        case "RSA":

                                break;
                        default:
                                print "no mode";
                                break;
                }
        }
}

// USAGE
// header("Content-type: text/plain;");
//
// $cypher = new Cypher();
// $cypher->set_mode("PGP");
// $user_data = array(
//         "name" => "Antonio Rossi",
//         "email" => "antonio.rossi@example.net",
//         "comment" => "",
//         "passphrase" => ""
// );
// print $cypher->generate_key($user_data);
?>
