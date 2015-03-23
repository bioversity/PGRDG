<?php
function starts_with($haystack, $needle, $case = true) {
	if($case) {
		return strpos($haystack, $needle, 0) === 0;
	} else {
		return stripos($haystack, $needle, 0) === 0;
	}
}

function ends_with($haystack, $needle, $case = true) {
	$expectedPosition = strlen($haystack) - strlen($needle);
	if($case) {
		return strrpos($haystack, $needle, 0) === $expectedPosition;
	} else {
		return strripos($haystack, $needle, 0) === $expectedPosition;

	}
}
?>