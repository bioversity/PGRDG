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
		$this->input = $input;
		$this->debug = false;

		$this->check_rsa();
	}

	/* PRIVATE FUNCTIONS */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

	private function check_rsa() {
		// Generates RSA keys if don't exits
		// See my gist for further documentation: https://gist.github.com/gubi/7532110
		if(!file_exists("../common/include/conf/.rsa_keys/rsa_2048_priv.pem")) {
			// You need openssl to generate these keys...
			shell_exec('openssl genrsa -out ../common/include/conf/.rsa_keys/rsa_2048_priv.pem 2048');
			if(!file_exists("../common/include/conf/.rsa_keys/rsa_2048_pub.pem")) {
				shell_exec('openssl rsa -pubout -in ../common/include/conf/.rsa_keys/rsa_2048_priv.pem -out common/include/conf/.rsa_keys/rsa_2048_pub.pem');
			}
		}
	}
	private function browse($url) {
		// Set the user agent as "PGRD Request" if not exists
		$this->input["agent"] = ($this->input["agent"] == "" || $this->input["agent"] == null) ? "PGRD Request" : $this->input["agent"];
		// Set the request type as "GET" if not exists
		$this->input["type"] = ($this->input["type"] == "" || $this->input["type"] == null) ? "GET" : $this->input["type"];

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
	private function compose_url($params_array, $urlencode_value = "", $urlencode = true) {
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
			// $service_url = "../pgrdg.grinfo.private/Service.php";
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
		$definitions = $this->get_definitions("api", true, "obj");

		$url_query = $this->compose_url($parsed_query, $definitions["kAPI_REQUEST_PARAMETERS"], true);
		/**
		* Screen output
		*/
		if($this->debug) {
			print "FIRST URL PART:		" . $url_first_part . "\n";
			print "URL QUERY:		" . $url_query . "\n";
			print "URL EXPLODED QUERY:\n";
			print_r($url_exploded);
			print "\n\n";
			print "BUILDED QUERY (UNENCODED):	" . $url_first_part . $this->compose_url($parsed_query, $definitions["kAPI_REQUEST_PARAMETERS"], false) . "\n";
			print "BUILDED QUERY (ENCODED):	" . $url_first_part . $this->compose_url($parsed_query, $definitions["kAPI_REQUEST_PARAMETERS"], true) . "\n";
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
		$definitions_url = "https://raw.githubusercontent.com/milko/OntologyWrapper/gh-pages/Library/definitions/" . $def_file;
		return $this->browse($definitions_url);
	}

	public function get_definitions($type, $keep_update, $response_type = "string") {
		$def_file = $this->get_definition_file($type);
		$global_constants = $this->getUserDefinedConstants();
		if($keep_update) {
			$definitions_url = "https://raw.githubusercontent.com/milko/OntologyWrapper/gh-pages/Library/definitions/" . $def_file;
			$milko_script = $this->browse($definitions_url);
			preg_match_all("/\"([^\s+].*)\".*,.*\t([^\s].*)\s\)\;.*$/msU", $milko_script, $matches);

			for($i = 0; $i <= count($matches[0]); $i++) {
				$defined_constants[$matches[1][$i]] = trim($matches[2][$i], "'");
			}
			$script_constants = array_filter($defined_constants);
		} else {
			$definitions_dir = "Service/Library/definitions/";
			include($definitions_dir . $def_file);
			$after_include_constants = $this->getUserDefinedConstants();

			$script_constants = array_diff_assoc($after_include_constants, $global_constants);
		}
		if($response_type == "string" || $response_type == "all") {
			foreach($script_constants as $define => $value) {
				$js .= "var " . $define . ' = "' . $value . '";' . "\n";
				$k[$define] = $value;
			}
		}
		if($response_type == "all") { $js .= "\n"; }
		if($response_type == "array" || $response_type == "all") {
			$js .= "var __ = {};\n";
			foreach($script_constants as $define => $value) {
				$js .= '__["' . $define . '"] = "' . $value . '";' . "\n";
			}
		}
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
		}
		if($this->debug) {
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
