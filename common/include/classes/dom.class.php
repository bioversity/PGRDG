<?php
//header("Content-type: text/plain");
/**
* PGRDG
*
* PHP Version 5.3
*
* @copyright 2013 Bioversity International (http://www.bioversityinternational.org/)
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRD
*/

/**
* A class for create rapidly html in descendant mode
*
* With this class you can create html with descendant objects instead of classic [DOMDocument](http://it1.php.net/manual/en/class.domdocument.php) class
*
* @package PGRDG
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRD/blob/master/common/include/classes/dom.class.php
*/

class dom {
	/**
	* Construct
	*
	* Initialize the class
	*
	* @param string $command The shell command to execute
	* @global string $this->command Command to execute
	* @return void
	*/
	public function __construct() {
		$this->dom = new DOMDocument();
	}
	
	/**
	* Create new child
	*
	* @param string $type The type of tag
	* @param array $attributes Attributes to set to tag
	* @access public
	* @see dom::__construct()
	* @return obj $this->tag Object of created dom tag
	*/
	public function tag($type, $attributes) {
		$tag = $this->dom->createElement($type);
		if(is_array($attributes)) {
			foreach($attributes as $ak => $av) {
				$tag->setAttribute($ak, $av);
			}
		}
		$this->dom->appendChild($tag);
	}
	
	public function generate() {
		return $this->dom->saveXML();
	}
}