<?php
/**
 * Check if an user has right permissions to interview on a page
 * @todo   Transform this simple function to a class
 * @param  object               $user                   The user data object
 * @param  object               $page                   The page data object
 * @return boolean                                      True if the current user has permissions
 */
function has_permissions($user, $page) {
	$has_permissions = false;
	switch(strtolower($page->current)) {
		case "invite":
			if(in_array(kTYPE_ROLE_INVITE, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
				$has_permissions = true;
			}
			break;
		case "menu":
		case "pages":
			if(in_array(kTYPE_ROLE_EDIT, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
				$has_permissions = true;
			}
			break;
		case "upload":
			if(in_array(kTYPE_ROLE_UPLOAD, $user[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
				$has_permissions = true;
			}
			break;
                default:
                        $has_permissions = true;
                        break;
	}
        return $has_permissions;
}
?>
