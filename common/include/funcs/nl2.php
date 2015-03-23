<?php
function nl2p($string) {
	$paragraphs = "";
	foreach (explode("\n", $string) as $line) {
		if (trim($line)) {
			$paragraphs .= '<p>' . $line . '</p>';
		}
	}
	return $paragraphs;
}

function nl2section($string) {
	$paragraphs = "";
	foreach (explode("\n\n\n", $string) as $line) {
		if (trim($line)) {
			$paragraphs .= "<section>" . $line . "</section>";
		}
	}
	return $paragraphs;
}
?>