<?php
/**
* API parser
*
* This class parse input from API's page and returns relative content
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @version 1.0 13/05/2014
*/

class frontend_api {
	function __construct($input = array()) {
		require_once($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/classes/Parse_json.php");
		$this->interface_config = new Parse_json($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/interface/site.js");
		$this->input = $input;
		$this->debug = false;
		$this->external_definitions_url = "https://raw.githubusercontent.com/milko/OntologyWrapper/gh-pages/Library/definitions";

		$this->check_rsa();
	}

	/* PRIVATE FUNCTIONS */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

	private function check_rsa() {
		// Generate RSA keys if don't exits
		if(!file_exists($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_priv.pem")) {
			$this->gen_key();
		}
	}

	/**
	 * Generate RSA keys if don't exits
	 */
	private function gen_key() {
		$priv_pem = $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_priv.pem";
		$pub_pem = $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_pub.pem";

		// header("Content-type: text/plain");
		$config = array(
			"private_key_bits" => 2048,
			"private_key_type" => OPENSSL_KEYTYPE_RSA,
		);
		$res = openssl_pkey_new($config);

		// Extract the private key from $res to $privKey
		openssl_pkey_export($res, $privKey);

		// Extract the public key from $res to $pubKey
		$pubKey = openssl_pkey_get_details($res);
		$pubKey = $pubKey["key"];

		$fd = @fopen($priv_pem, "w+");
		if(!$fd){
			return false;
		}
		@fputs($fd, $privKey);
		@fclose($fd);
		// print_r($privKey);

		$fd = @fopen($pub_pem, "w+");
		if(!$fd){
			return false;
		}
		@fputs($fd, $pubKey);
		@fclose($fd);
		// print_r($pubKey);
	}

	public function browse($url) {
		// Set the user agent as "PGRD Request" if not exists
		$this->input["agent"] = (!isset($this->input["agent"]) || $this->input["agent"] == "" || $this->input["agent"] == null) ? "PGRD Request" : $this->input["agent"];
		// Set the request type as "GET" if not exists
		$this->input["type"] = (!isset($this->input["type"]) || $this->input["type"] == "" || $this->input["type"] == null) ? "GET" : $this->input["type"];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		if(strtolower($this->input["type"]) == "post") {
			if (!empty($options["post_params"])) {
				curl_setopt($ch, CURLOPT_POST, count($options["post_params"]));
				curl_setopt($ch, CURLOPT_POSTFIELDS, $this->compose_url($this->input["post_params"]));
			}
		}
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_VERBOSE, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_USERAGENT, $this->input["agent"]);

		$result = curl_exec($ch);
		curl_close($ch);

		return $result;
	}

	public function compose_url($params_array, $urlencode_value = "", $urlencode = true) {
		$url_composed = "";
		foreach($params_array as $key => $value) {
			if($key == $urlencode_value) {
				$params = json_decode($value, 1);
				if($this->debug) {
					$params["log-request"] = true;
				}
				if($urlencode) {
					$value = rawurlencode(json_encode($params));
				} else {
					$value = json_encode($params);
				}
			}
			$url_composed[] = $key . "=" . $value;
		}
		if(count($url_composed) == 1) {
			return $url_composed[0];
		} else {
			return implode("&", $url_composed);
		}
	}
	private function build_url_for_service($base64_url) {
		if(base64_decode($base64_url, true)) {
			$service_conf = parse_ini_file("../common/include/conf/service.ini");
			$service_url = $service_conf["url"] . "/Service.php";
			// $service_url = "../gateway.grinfo.private/Service.php";
			$url = str_replace("{SERVICE_URL}", $service_url, base64_decode(rawurldecode($base64_url)));
		} else {
			$url = $base64_url;
		}
		if($this->debug) {
			/**
			* Screen output
			*/
			print str_repeat("*", 50) . "\n";
			print "### DEBUG VERSION ###\n\n";
			print str_repeat("-", 50) . "\n";
			print "URL:			" . $url . "\n";
		}
		$url_exploded = parse_url($url);
		$url_first_part = str_replace($url_exploded["query"], "", $url);
		parse_str($url_exploded["query"], $parsed_query);
		$this->get_definitions("api", false, "obj");
		// print_r($definitions);
		// exit();

		$url_query = $this->compose_url($parsed_query, kAPI_REQUEST_PARAMETERS, true);
		/**
		* Screen output
		*/
		if($this->debug) {
			print "FIRST URL PART:		" . $url_first_part . "\n";
			print "URL QUERY:		" . $url_query . "\n";
			print "URL EXPLODED QUERY:\n";
			print_r($url_exploded);
			print "\n\n";
			print "BUILDED QUERY (UNENCODED):	" . $url_first_part . $this->compose_url($parsed_query, kAPI_REQUEST_PARAMETERS, false) . "\n";
			print "BUILDED QUERY (ENCODED):	" . $url_first_part . $this->compose_url($parsed_query, kAPI_REQUEST_PARAMETERS, true) . "\n";
			print "\n\n";
		}
		return $url_first_part . $url_query;
	}
	private function getUserDefinedConstants() {
		// Taken from http://stackoverflow.com/a/7538100
		$constants = get_defined_constants(true);
		return (isset($constants["user"]) ? $constants["user"] : array());
	}

	private function get_definition_file($type) {
		switch(strtolower($type)) {
			case "api":			$def_file = "Api.inc.php";			break;
			case "domains":			$def_file = "Domains.inc.php";			break;
			case "flags":			$def_file = "Flags.inc.php";			break;
			case "operators":		$def_file = "Operators.inc.php";		break;
			case "predicates":		$def_file = "Predicates.inc.php";		break;
			case "query":			$def_file = "Query.inc.php";			break;
			case "session":			$def_file = "Session.inc.php";			break;
			case "tags":			$def_file = "Tags.inc.php";			break;
			case "tokens":			$def_file = "Tokens.inc.php";			break;
			case "types":			$def_file = "Types.inc.php";			break;
		}
		return $def_file;
	}

	/* PUBLIC FUNCTIONS */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

	public function get_github_service_definitions($type) {
		$def_file = $this->get_definition_file($type);
		return $this->browse($this->external_definitions_url . DIRECTORY_SEPARATOR . $def_file);
	}

	/**
	 * Extract Service definitions print as javascript variables
	 *
	 * Example: Get all definition of types from Github repo and print condensed
	 * `.../API/?definitions=types&keep_update=true&type=all&condensed=true`
	 *
	 * Example: Get all definition of api directly from service and print in json (not condensed)
	 * `?definitions=api&type=json&condensed=false`
	 *
	 *
	 * @param {string}	$type		The Service define (also listed in @get_definition_file())
	 * @param {bool}	$keep_update	If true take the definition from Github repo
	 * @param {string}	$response_type	(string|array|json|obj|object|all) The type of the response. Default: "string"
	 * @param {bool}	$condensed	If true displayed results will be condensed (without spaces and break returns)
	 * @return {string|obj}
	 */
	public function get_definitions($type, $keep_update, $response_type = "string", $condensed = false) {
		$def_file = $this->get_definition_file($type);
		$global_constants = $this->getUserDefinedConstants();
		if($keep_update) {
			$milko_script = $this->browse($this->external_definitions_url . DIRECTORY_SEPARATOR . $def_file);
			preg_match_all("/\"([^\s+].*)\".*,.*\t([^\s].*)\s\)\;.*$/msU", $milko_script, $matches);

			for($i = 0; $i <= count($matches[0]); $i++) {
				$defined_constants[$matches[1][$i]] = trim($matches[2][$i], "'");
			}
			$script_constants = array_filter($defined_constants);
		} else {
			$interface = $this->interface_config->parse_js_config("config");
			$definitions_dir = $interface["service"]["definitions_dir"];

			include_once($definitions_dir . DIRECTORY_SEPARATOR . $def_file);

			$after_include_constants = $this->getUserDefinedConstants();

			$script_constants = array_diff_assoc($after_include_constants, $global_constants);
		}
		foreach($script_constants as $define => $value) {
			$k[$define] = $value;
			$d[] = $define . (($condensed) ? '="' : ' = "') . $value . '"';
		}
		$js = "";
		$jsj = "";
		if($response_type == "string" || $response_type == "all") {
			if($condensed) {
				$js .= "var " . implode(",", $d) . ";";
			} else {
				$js .= "var " . implode(",\n", $d) . ";";
			}
		}
		if($response_type == "json" || $response_type == "array" || $response_type == "all") {
			if($condensed) {
				$jsj .= "{" . implode(",", preg_replace("/^(\w+)\=/", '"$1":', $d)) . "}";
			} else {
				$jsj .= "{\n	" . implode(",\n	", preg_replace("/^(\w+)\ \=\ /", '"$1": ', $d)) . "\n}";
			}
			if($response_type == "all") { $js .= (($condensed) ? "\n" : "\n\n"); }
			$jsa = ($response_type != "json") ? "var k = " . $jsj . ";" : $jsj;
			$js .= $jsa;
		}

		// If included by PHP script do not print but return only the object
		if($response_type == "obj" || $response_type == "object") {
			return $script_constants;
		} else {
			print $js;
			exit();
		}
	}

	public function set_content_type($content_type) {
		switch($content_type) {
			case "json":
				header("Content-type: application/json");
				break;
			case "text":
			default:
				header("Content-type: text/plain");
				break;
		}
	}

	public function get_local_json($path){
		$f = file_get_contents("../common/include/" . rawurldecode($path));
		print "var roles = " . trim($f) . ";";
		exit();
	}

	public function debug() {
		$this->set_content_type("text");
		$this->debug = true;
	}

	public function ask_service($address) {
		$this->set_content_type("json");
		$url = $this->build_url_for_service($address);

		if($this->debug) {
			/**
			* Screen output
			*/
			print "URL: " . $url . "\n";

			/**
			* Screen output
			*/
			print str_repeat("-", 50) . "\n";
			print_r(json_decode($this->browse($url), 1));
			print "\n\n";
		} else {
			return $this->browse($url);
		}
	}

	public function force_download($file) {
		if (!file_exists($file)) {
			print "No file";
		} else {
			$splinfo = new SplFileInfo($file);

			header("Pragma: public"); // required
			header("Expires: 0"); // no cache
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			header("Last-Modified: " . gmdate("D, d M Y H:i:s", $splinfo->getMTime()) . " GMT");
			header("Cache-Control: private", false);
			header("Content-Type: " . mime_content_type($file));
			header("Content-disposition: attachment; filename=\"" . basename($splinfo->getFilename()) . "\"");
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: " . $splinfo->getSize()); // provide file size
			header("Connection: close");
			readfile($file);
		}
	}
	public function force_view($file) {
		if (!file_exists($file)) {
			print "No file";
		} else {
			$splinfo = new SplFileInfo($file);

			header("Pragma: public"); // required
			header("Expires: 0"); // no cache
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			header("Last-Modified: " . gmdate("D, d M Y H:i:s", $splinfo->getMTime()) . " GMT");
			header("Cache-Control: private", false);
			header("Content-Type: " . mime_content_type($file));
			//header("Content-disposition: attachment; filename=\"" . basename($splinfo->getFilename()) . "\"");
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: " . $splinfo->getSize()); // provide file size
			header("Connection: close");
			readfile($file);
		}
	}
}

?>
