<?php
header("Content-type: text/plain;");

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
define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
define("INCLUDE_DIR", SYSTEM_ROOT . "common/include/");
define("CLASSES_DIR", INCLUDE_DIR . "classes/");
define("CONF_DIR", INCLUDE_DIR . "conf/interface/");

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
                $this->site_config = $this->get_site_config();
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
         * @param  array        $params                 The params to append to the url
         * @return string                               The Service response in json format
         */
        public function send_to_service($inviter, $params, $action) {
                switch($action) {
                        case "login":
                                $querystring = array(
                                        kAPI_REQUEST_OPERATION => kAPI_OP_GET_USER,
                                        kAPI_REQUEST_LANGUAGE => $this->site_config["site"]["default_language"]
                                        // kAPI_PARAM_ID => $inviter,
                                        // kAPI_PARAM_OBJECT => $encoder->publicEncode(json_encode($params), $sys_pub_key),
                                );
                                $params = array(
                                        kAPI_PARAM_LOG_REQUEST => true,
                                        kAPI_PARAM_LOG_TRACE => true,
                                        kAPI_PARAM_ID => $inviter,
                                        kAPI_PARAM_DATA => kAPI_RESULT_ENUM_DATA_FORMAT
                                );
                                $encoded = $this->encrypt_RSA($params);
                                $url = $this->site_config["service"]["url"] . $this->site_config["service"]["script"] . "?" . http_build_query($querystring) . "&" . kAPI_REQUEST_PARAMETERS . "=" . urlencode($encoded);
                                break;
                        default:
                                print "No action were specified";
                                return false;
                }
                return $this->receive_from_service($this->frontend->browse($url));
        }

        /**
         * Parse the Service response and decrypt its results
         * @param  string       $json                   The json Service response
         * @return array                                Parsed response
         */
        public function receive_from_service($json) {
                $service_response = json_decode($json);

                if($service_response->status->state == "ok") {
                        return $this->decrypt_RSA($service_response->results);
                }

        }
}

// USAGE
require_once(CLASSES_DIR . "Frontend.php");
$frontend = new frontend_api();
$frontend->get_definitions("api", false, "obj");
$frontend->get_definitions("tags", false, "obj");

/* -------------------------------------------------------------------------- */
// Test login
/* -------------------------------------------------------------------------- */
$se = new Service_exchange();
// $inviter = ":domain:individual://ITA406/pgrdiversity.bioversityinternational.org:gubi;";
$inviter = ":domain:individual://ITA406/pgrdiversity.bioversityinternational.org:milko;";
$params = array(
        kAPI_PARAM_LOG_REQUEST => true,
        kAPI_PARAM_LOG_TRACE => true,
        kAPI_PARAM_ID => $inviter,
        kAPI_PARAM_DATA => kAPI_RESULT_ENUM_DATA_FORMAT
);
$action = "login";
print_r($se->send_to_service($inviter, $params, $action));
?>
