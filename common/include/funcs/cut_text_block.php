<?php
/**
 * Cut out a part of text block
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 3.0 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_0.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @package	PGRDG
 * @author	Alessandro Gubitosi <gubi.ale@iod.io>
 * @link	http://iod.io
 */

function cut_text_block($string, $max_char = 500, $ellipses = " [...]", $separator = " "){
	if($ellipses == null){
		$ellipses = " [...]";
	}
	if (strlen($string) > $max_char){
		$cutted_string = substr($string, 0, $max_char);
		$last_space = (strrpos($cutted_string, $separator) > 0 ? strrpos($cutted_string, $separator) : strlen($cutted_string));
		$ok_string = substr($cutted_string, 0, $last_space);

		return $ok_string . $ellipses;
	} else {
		return $string;
	}
}

function extract_period($string, $init_char, $max_char){
	if (strlen($string) > $max_char){
		$cutted_string = substr($string, $init_char, $max_char);

		return "..." . $cutted_string . " [...]";
	} else {
		return $string;
	}
}
?>
