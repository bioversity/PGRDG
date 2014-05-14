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
	}
	
	/* PRIVATE FUNCTIONS */
	
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
		return implode("&", $url_composed);
	}
	private function build_url_for_service($base64_url) {
		$url = base64_decode(rawurldecode($base64_url));
		if($this->debug) {
			print "### DEBUG VERSION ###\n\n";
			print str_repeat("-", 100) . "\n";
			print "URL:			" . $url . "\n";
		}
		
		$url_exploded = parse_url($url);
		$url_first_part = str_replace($url_exploded["query"], "", $url);
		parse_str($url_exploded["query"], $parsed_query);
		$url_query = $this->compose_url($parsed_query, "param", true);
		if($this->debug) {
			print "FIRST URL PART:		" . $url_first_part . "\n";
			print "URL QUERY:		" . $url_query . "\n";
			print "URL EXPLODED QUERY:\n";
			print_r($url_exploded);
			print "\n\n";
			print "BUILDED QUERY (UNENCODED):	" . $url_first_part . $this->compose_url($parsed_query, "param", false) . "\n";
			print "BUILDED QUERY (ENCODED):	" . $url_first_part . $this->compose_url($parsed_query, "param", true) . "\n";
			print "\n\n";
		}
		return $url_first_part . $url_query;
	}
	
	/* PUBLIC FUNCTIONS */
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
			print "URL: " . $url . "\n";
		}
		if($this->debug) {
			print str_repeat("-", 200) . "\n";
			return json_decode($this->browse($url), 1);
		} else {
			return $this->browse($url);
		}
	}
}

?>