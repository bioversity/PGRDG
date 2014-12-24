<?php
// header("Content-type: text/plain; charset=utf-8;");

/**
* Service_exchange.php
*
* This file contains the {@link Service_exchange} class.
*
* @const SYSTEM_ROOT           The System root dir
* @const INCLUDE_DIR           Include dir
* @const CLASSES_DIR           Classes dir
* @const CONF_DIR              Conf dir
*/
if(!defined("SYSTEM_ROOT")) {
        define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}
if(!defined("INCLUDE_DIR")) {
        define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
}
if(!defined("CLASSES_DIR")) {
        define("CLASSES_DIR", INCLUDE_DIR . "classes/");
}
if(!defined("CONF_DIR")) {
        define("CONF_DIR", INCLUDE_DIR . "conf/interface/");
}

/*=======================================================================================
*																						*
*										PGP.php										*
*																						*
*======================================================================================*/

/**
* PGP object
*
* PHP Version 5.3
*
* @copyright 2013 Bioversity International (http://www.bioversityinternational.org/)
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRD
*
* This class can be used to ecncrypt and decrypt data, as well as to create user PGP keys and
* manage the relative data.
*
* Example:
* ```php
* $user_data = array(
* 	"name" => "John Doe",
*  	"email" => "john@example.net",
*   	"comment" => "",
*    	"passphrase" => ""
* );
* $pgp = new PGP($user_data);
* $pgp->generate_key();
*
* $txt = "Lorem ipsum dolor sit amet, nam ut omittam eleifend, eu facer labore oporteat his. Facete vituperata per ei. Pri causae vulputate pertinacia ea, alia facete dignissim ad sed. Eam ad mazim exerci pericula, pro ex malorum postulant. Ex unum nominavi nam, lorem propriae et sea. No vel denique dissentiunt definitionem, vis ne praesent postulant.";
*
* print "Encrypting...\n" . str_repeat("~", 70) . "\n";
* $enc = $pgp->encrypt_message($txt);
* print $enc . "\n\n";
* print "Decrypting encrypted text...\n" . str_repeat("~", 70) . "\n";
* $dec = $pgp->decrypt_message($enc);
* print $dec;
* ```
*
* The class features the following methods:
* * {@link Service_exchange::get_define_key()}               Display the define key of a given value
* * {@link Service_exchange::get_site_config()}              Get the site config
* * {@link Service_exchange::encrypt_RSA()}                  Encrypt data for service communication
* * {@link Service_exchange::decrypt_RSA()}                  Decrypt given data from Service
* * {@link Service_exchange::send_to_service()}              Send a GET request to the Service
* * {@link Service_exchange::receive_from_service()}         Parse the Service response and decrypt its results
*
*
* @package      PGRDG
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @version      1.00 12/2014
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @access       public
* @see          https://github.com/bioversity/PGRDG Project Main Page
*/
class Service_exchange {
        /**
         * Constructor
         *
         * @param  array        $user_data              An array with basic user data
         * @uses   Service_exchange::get_site_config()
         */
        function __construct() {
                require_once(CLASSES_DIR . "Frontend.php");
                $this->frontend = new frontend_api();
                $this->frontend->get_definitions("api", false, "obj");
                $this->frontend->get_definitions("tags", false, "obj");
                $this->frontend->get_definitions("types", false, "obj");
                $this->site_config = $this->get_site_config();
        }

        /**
         * Display the define key of a given value
         *
         * @param  string       $value                  The value to search
         * @return string                               The define key
         */
        private function get_define_key($value) {
                $defines = get_defined_constants(true);
                foreach($defines["user"] as $k => $v) {
                        if($value == $v) {
                                return $k;
                                break;
                        }
                }
        }


        /**
         * Include the parse_js_config.class.php and return the array of site.js
         *
         * @uses   Parse_json::parse_js_config()
         * @return array                                The site configs
         */
        public function get_site_config() {
                require_once(CLASSES_DIR . "Parse_json.php");

                $parse_json = new Parse_json(CONF_DIR . "site.js");
                return $parse_json->parse_js_config("config");
        }

        /**
         * Encrypt given data for Service
         *
         * @uses   Encoder::publicEncode()
         * @param  array         $data                  The data to encrypt
         * @return string                               Encrypted data
         */
        private function encrypt_RSA($data) {
                if(is_array($data)) {
                        require_once(CLASSES_DIR . "Encoder.php");
                        $rsa = new OntologyWrapper\Encoder();
                        $service_key = file_get_contents(SYSTEM_ROOT . $this->site_config["service"]["path"]["rsa"] . "service_pub.pem");

                        return $rsa->publicEncode(json_encode($data), $service_key);
                } else {
                        print "Provided data is not an array";
                        return false;
                }
        }

        /**
        * Decrypt given data from Service
        *
        * @uses   Encoder::privateDecode()
        * @param  array         $data                  The data to encrypt
        * @return string                               Decrypted data
        */
        private function decrypt_RSA($data) {
                if(!is_array($data)) {
                        require_once(CLASSES_DIR . "Encoder.php");
                        $rsa = new OntologyWrapper\Encoder();
                        $interface_key = file_get_contents(SYSTEM_ROOT . $this->site_config["service"]["path"]["rsa"] . "interface_priv.pem");

                        return json_decode($rsa->privateDecode($data, $interface_key));
                } else {
                        print "Provided data is not a json string";
                        return false;
                }
        }

        /**
         * Send a GET request to the Service
         *
         * @uses   Frontend::browse()
         * @uses   Service_exchange::encrypt_RSA()
         * @param  void        $data                    Data which perform request
         * @param  string      $action                  The action to execute
         * @return string                               The Service response in json format
         */
        public function send_to_service($data, $action) {
                switch($action) {
                        case "login":
                                $querystring = array(
                                        kAPI_REQUEST_OPERATION => kAPI_OP_GET_USER,
                                        kAPI_REQUEST_LANGUAGE => $this->site_config["site"]["default_language"]
                                );
                                $params = array(
                                        kAPI_PARAM_LOG_REQUEST => true,
                                        kAPI_PARAM_LOG_TRACE => true,
                                        kAPI_PARAM_ID => $data,
                                        kAPI_PARAM_DATA => kAPI_RESULT_ENUM_DATA_FORMAT
                                );
                                break;
                        case "invite_user":
                                if(empty($data["name"])) {
                                        print "No given name";
                                        return false;
                                }
                                if(empty($data["email"])) {
                                        print "No given email";
                                        return false;
                                }
                                if(empty($data["fingerprint"])) {
                                        print "No given fingerprint";
                                        return false;
                                }
                                if(empty($data["public_key"])) {
                                        print "No given PGP public key";
                                        return false;
                                }

                                // Perform request
                                $querystring = array(
                                        kAPI_REQUEST_OPERATION => kAPI_OP_INVITE_USER,
                                        kAPI_REQUEST_LANGUAGE => $this->site_config["site"]["default_language"]
                                );
                                $params = array(
                                        kAPI_PARAM_LOG_REQUEST => true,
                                        kAPI_PARAM_LOG_TRACE => true,
                                        kAPI_REQUEST_USER => $data["inviter"],
                                        kAPI_PARAM_OBJECT => array(
                                                kTAG_AUTHORITY => ((isset($data["authority"]) && strlen(trim($data["authority"])) > 0) ? $data["collection"] : "ITA406"),
                                                kTAG_COLLECTION => ((isset($data["collection"]) && strlen(trim($data["collection"])) > 0) ? $data["collection"] : "pgrdiversity.bioversityinternational.org"),
                                                kTAG_NAME => $data["name"],
                                                kTAG_ENTITY_EMAIL => $data["email"],
                                                kTAG_ROLES => array( kTYPE_ROLE_UPLOAD, kTYPE_ROLE_EDIT ), // ???
                                                kTAG_ENTITY_PGP_KEY => $data["public_key"],
                                                kTAG_ENTITY_PGP_FINGERPRINT => $data["fingerprint"],
                                        )
                                );
                                break;
                        case "activate_user":
                                $querystring = array(
                                        kAPI_REQUEST_OPERATION => kAPI_OP_USER_INVITE,
                                        kAPI_REQUEST_LANGUAGE => $this->site_config["site"]["default_language"]
                                );
                                $params = array(
                                        kAPI_PARAM_LOG_REQUEST => TRUE,
                                        kAPI_PARAM_LOG_TRACE => TRUE,
                                        kAPI_PARAM_DATA => kAPI_RESULT_ENUM_DATA_RECORD,
                                        kAPI_PARAM_ID => $data
                                );
                                break;
                        default:
                                print "No action were specified";
                                return false;
                }
                $encoded = $this->encrypt_RSA($params);
                $url = $this->site_config["service"]["url"] . $this->site_config["service"]["script"] . "?" . http_build_query($querystring) . "&" . kAPI_REQUEST_PARAMETERS . "=" . urlencode($encoded);
                return $this->receive_from_service($this->frontend->browse($url));
        }

        /**
         * Parse the Service response and decrypt its results
         *
         * @param  string       $json                   The json Service response
         * @return array                                Parsed response
         */
        public function receive_from_service($json) {
                $service_response = json_decode($json, 1);

                if($service_response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
                        if(isset($service_response[kAPI_RESPONSE_RESULTS]) && count($service_response[kAPI_RESPONSE_RESULTS]) > 0) {
                                $results = $this->decrypt_RSA($service_response[kAPI_RESPONSE_RESULTS]);

                                foreach(json_decode(json_encode($results), 1) as $user_id => $v) {
                                        foreach($v as $k => $vv) {
                                                if(!is_array($vv)) {
                                                        $res[$k] = $vv;
                                                } else {
                                                        if($k !== kTAG_CONN_PASS) {
                                                                $res[$k] = $vv;
                                                        }
                                                }
                                        }
                                        $service_response[kAPI_RESPONSE_RESULTS] = $res;
                                }
                                return json_encode($service_response);
                        } else {
                                return json_encode($service_response);
                        }
                }

        }
}
?>
