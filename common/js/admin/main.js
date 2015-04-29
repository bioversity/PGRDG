/*jshint scripturl:true*/
/*jshint -W030 */

/**
* Main admin functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/

/*=======================================================================================
*	MAIN ADMIN FUNCTIONS
*======================================================================================*/

/**
 * Display a password requiring dialog before save data
 * @param  function		callback	 	A function to execute if password is correct
 */
$.require_password = function(options, callback) {
	if($.type(options) == "function") {
		callback = options;
	}
	var opt = $.extend({
		current_attempt: 1,
		status: ""
	}, options);

	var username = $.get_user_username($.get_current_user_data()),
	max_attempts = 3;

	if($.cookie("iv") === undefined || $.cookie("iv") === null) {
		apprise(i18n[lang].messages.insert_password.message + opt.status, {
			title: i18n[lang].messages.insert_password.title,
			icon: "fa-lock",
			titleClass: "text-warning",
			input: true,
			input_type: "password"
		}, function(r) {
			if(r) {
				if($.md5($.sha1(r)) == $.cookie("m")){
					// Set 10 minutes cookie
					var date = new Date();
					date.setTime(date.getTime() + (10 * 60 * 1000));
					$.cookie("iv", $.md5($.now()), { expires: date });

					if($.type(callback) == "function") {
						callback.call(this);
					}
				} else {
					if(opt.current_attempt < max_attempts){
						opt.current_attempt++;
						var o = {
							current_attempt: opt.current_attempt,
							status: "wrong_password"
						}
						$.require_password(o, callback);
					}
				}
			}
		});
	} else {
		if($.type(callback) == "function") {
			callback.call(this);
		}
	}
};

/**
 * Calculate the storage occupied space and fill a panel with percentege
 * @param  string 		label  			The label for percentage row
 * @param  string 		storage			The storage to evaluate
 */
$.add_storage_space_in_panel = function(label, storage) {
	/**
	 * Calculate the occupied space of given storage
	 * @param  string key The local storage to evaluate
	 * @return string     The occupied space in verbose mode
	 */
	$.get_localstorage_space = function(key){
		var allStrings = '';
		for(var keys in window.localStorage){
			// console.log(keys);
			if(window.localStorage.hasOwnProperty(keys)){
				allStrings += window.localStorage[key];
			}
		}
		return allStrings ? 3 + (Math.round(((allStrings.length*16)/(8*1024)) * 100) / 100) + " Kb" : "0 Kb";
	};

	var occupied_space_mb = $.get_localstorage_space(storage),
	occupied_space = parseInt($.get_localstorage_space(storage)),
	free_space = 1000 - occupied_space,
	percentage = (occupied_space * 100) / 1000,
	bar_colour = "progress-bar-success",
	text_colour = "txt-color-darken";

	if(percentage > 33) {
		bar_colour = "progress-bar-warning";
		text_colour = "text-warning";
	} else if(percentage > 66) {
		bar_colour = "progress-bar-danger";
		text_colour = "text-danger";
	}

	var $li = $('<li>'),
	$padding5 = $('<div class="padding-5">'),
	$p = $('<p class="' + text_colour + ' font-sm no-margin">'),
	$progress = $('<div class="progress progress-micro no-margin">'),
	$progress_bar = $('<div class="progress-bar ' + bar_colour + '" style="width: ' + percentage + '%">');


	$p.html("<b>" + label + ":</b><br /><small>" + occupied_space_mb + "</small>");
	$progress.append($progress_bar);
	$padding5.append($p).append($progress);
	$li.append($padding5);
	$("#local_storage_space").append($li);
};

/**
 * Extract the user's data from given user identifier
 * @param  string   		user_id  		The user Identifier
 * @param  bool   		force_renew  		Force the request to Service and renew the storage
 * @param  function 		callback 		The function to execute when data are available
 */
$.get_user = function(user_id, force_renew, callback) {
	/**
	 * Execute the request
	 * @param  string   		user_id  		The user Identifier
	 * @param  bool   		force	  		Force the request to Service and renew the storage
	 * @param  function 		callback 		The function to execute when data are available
	 */
	$.ask_user = function(user_id, force, callback) {
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.user_data.all",
			data: {
				"user_id": (user_id === null || user_id === undefined || user_id === "") ? $.get_manager_id() : user_id,
				"manager_id": $.get_manager_id()
			},
			type: "get_user",
			force_renew: force
		}, function(response) {
			if(typeof callback == "function") {
				$.each(response, function(id, ud) {
					storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
					if(user_id == $.get_manager_id()) {
						storage.set("pgrdg_user_cache.user_data.current." + $.get_user_id(ud), ud);
						storage.set("pgrdg_user_cache.user_data.current.id", $.get_user_id(ud));
					}
					callback.call(this, ud);
				});
			}
		});
	};

	$("#loader").show();
	if(force_renew === undefined || force_renew === null || force_renew === "") {
		force_renew = false;
	}

	if(force_renew) {
		$.ask_user(user_id, true, callback);
	} else {
		if($.storage_exists("pgrdg_user_cache.user_data.all." + user_id)) {
			callback.call(this, storage.get("pgrdg_user_cache.user_data.all." + user_id));
			// console.log(storage.get("pgrdg_user_cache.user_data.all." + user_id));
		} else {
			if($.storage_exists("pgrdg_user_cache.user_data.current")) {
				$.ask_user(user_id, false, callback);
			} else {
				$.cookie("l", null, {path: "/"});
				document.location = "./Signin";
			}
		}
	}
};

/**
* Extract all managed users of a given user identifier
* @param  string   		user_id  		The user Identifier
* @param  function 		callback 		The function to execute when data are available
*/
$.get_managed_users = function(user_id, callback) {
	if($.storage_exists("pgrdg_user_cache.user_data.managed." + user_id)) {
		callback.call(this, storage.get("pgrdg_user_cache.user_data.managed." + user_id));
	} else {
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.user_data.managed",
			data: {
				"user_id": (user_id === null || user_id === undefined || user_id === "") ? $.get_manager_id() : user_id,
				"manager_id": $.get_manager_id()
			},
			type: "get_managed_users"
		}, function(response) {
			if(typeof callback == "function") {
				var managed = {};
				$.each(response, function(id, ud) {
					if($.storage_exists("pgrdg_user_cache.user_data.all." + $.get_user_id(ud))) {
						storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
					}
					managed[$.get_user_id(ud)] = ud;
				});
				callback.call(this, managed);
			}
			$("#loader").hide();
		});
	}
};


/*=======================================================================================
*	INPUT TOOLS
*======================================================================================*/

/**
* Collect input attributes in an object
* @return object 					All input attributes
*/
$.fn.getAttributes = function () {
	var elem = this,
	attr = {};

	if(elem && elem.length) {
		$.each(elem.get(0).attributes, function(v,n) {
			n = n.nodeName||n.name;
			v = elem.attr(n); // relay on $.fn.attr, it makes some filtering and checks
			if(v !== undefined && v !== false) {
				attr[n] = v;
			}
		});
	}

	return attr;
};

/**
* Check if an input is valid
* @return void						Callback function if true, false if fail
*/
$.fn.check_input = function(callback) {
	$.fn.isWrong = function() { $(this).closest("div.line").addClass("has-error"); $(this).focus(); };
	$.fn.isRight = function() { $(this).closest("div.line").removeClass("has-error"); };

	$input = $(this);
	if($input.prop("required")) {
		if($.trim($input.val()) === "") {
			$input.isWrong();
			// Callback
			if(jQuery.type(callback) == "function") {
				callback.call(this, $input, false);
			}
		} else {
			$input.isRight();
			// Callback
			if(jQuery.type(callback) == "function") {
				callback.call(this, $input, true);
			}
		}
	} else {
		$input.isRight();
		// Callback
		if(jQuery.type(callback) == "function") {
			callback.call(this, $input, true);
		}
	}
};


/*=======================================================================================
*	USER DATA EXTRACTION
*======================================================================================*/

/**
 * Extract current user data from storage
 * @param  object		user_data		The user data object
 */
$.get_current_user_data = function() { return storage.get("pgrdg_user_cache.user_data.current." + $.get_current_user_id()); };

/**
 * Extract object data for a given user id
 * @param  string		user_id 		The user ID string
 */
$.get_user_data = function(user_id) {
	if($.storage_exists("pgrdg_user_cache.user_data.current." + user_id)) {
		$.each(storage.get("pgrdg_user_cache.user_data.current." + user_id), function(k, v) {
			if($.type(v) == "object") {
				return v;
			}
		})
	}
};

/**
 * Extract the user identifier from a given user data object
 * @param  object		user_data		The user data object
 * @return string 			   		The user identifier
 */
$.get_user_id = function(user_data) { return user_data[kTAG_IDENTIFIER][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the current (logged) user identifier from the storage
* @param  bool 			return_data 		If true return the manager (logged) user data instead of its identifier
* @return void 			        		(string) The manager (logged) user identifier | (object) The manager (logged) user data
*/
$.get_current_user_id = function() {
	var user_id = "",
	i = 0;
	if($.storage_exists("pgrdg_user_cache.user_data.current.id")) {
		user_id = storage.get("pgrdg_user_cache.user_data.current.id");
	} else {
		$.each(storage.get("pgrdg_user_cache.user_data.current"), function(mid, mdata) {
			if(i == 0) {
				user_id = $.get_user_id(mdata);
				storage.set("pgrdg_user_cache.user_data.current.id", user_id);
			}
			i++;
		});
	}
	return user_id;
};

/**
* Extract the manager (logged) user identifier from the storage
* @param  bool 			return_data 		If true return the manager (logged) user data instead of its identifier
* @return void 			        		(string) The manager (logged) user identifier | (object) The manager (logged) user data
*/
$.get_manager_id = function() {
	return $.get_current_user_id();
};

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_database = function(user_data) { return user_data[kTAG_CONN_BASE][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_authority = function(user_data) { return user_data[kTAG_AUTHORITY][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_full_name = function(user_data) { return user_data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_username = function(user_data) { return user_data[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_name = function(user_data) { return user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user last name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_last_name = function(user_data) { return user_data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user last name from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_pgp_fingerprint = function(user_data) { return user_data[kTAG_ENTITY_PGP_FINGERPRINT][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user full name from a given user data object
* @param  object		user_data 		The user data object
* @param  bool			show_authority 		Display or not the authority name
* @return string 				        The user full name
*/
$.fn.get_user_work_position = function(user_data, show_authority) {
	var $item = $(this);
	sha = (show_authority === undefined) ? true : show_authority;

	$.get_authority(user_data[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_VALUE][0][kTAG_UNIT_REF], function(authority) {
		var item_data = user_data[kTAG_ENTITY_TITLE][kAPI_PARAM_RESPONSE_FRMT_DISP];
		if(sha) {
			item_data += " at " + authority;
		}
		$item.html(item_data);
	});
};

/**
* Extract the user default e-mail address from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user full name
*/
$.get_user_email = function(user_data) { return user_data[kTAG_ENTITY_EMAIL][kAPI_PARAM_RESPONSE_FRMT_DISP][0][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user image path from a given user data object
* @param  object		user_data 		The user data object
* @return string 				        The user image source
*/
$.get_user_img_src = function(user_data) { return "./common/media/img/admin/" + ((user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_NAME] === undefined) ? "user_rand_images/" : "user_images/") + user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_DISP]; };

/**
* Extract the user roles from a given user data object
* @param  object		user_data 		The user data object
* @return object 				        The user roles
*/
$.get_user_roles = function(user_data) { return user_data[kTAG_ROLES]; }

/**
 * Extract all user permissions and list in verbose mode from a given user data object
 * @param  object 		user_data 		The user data object
 * @return string           				A verbose string of user permissions
 */
$.get_user_roles_list = function(user_data) {
	var list = [];
	$.each(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
		list.push(v[kAPI_PARAM_RESPONSE_FRMT_DISP]);
	});
	return list.join(", ");
};

/**
* Extract the count of user's managed users from a given user data object
* @param  object		user_data 		The user data object
* @return number 				        The count of managed users
*/
$.get_managed_users_count = function(user_data) { return parseInt(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_DISP]); };

/**
* Extract the count of user's invites from a given user data object
* @param  object		user_data 		The user data object
* @return number 				        The count of invited users
*/
$.get_invited_users_count = function(user_data) { return (user_data[kTAG_INVITES] === undefined) ? 0 : $.obj_len(user_data[kTAG_INVITES][kAPI_PARAM_RESPONSE_FRMT_DOCU]); };

/**
* Load profile form or interface depending on the hash
*/
$.load_profile = function() {
	var $hash = $.url().fsegment();
	if($hash.length > 0) {
		if($hash[0] === "Edit") {
			$.get_user($hash[1], false, function(){
				$("#personal_data").load_user_data_in_form($hash[1]);
				if($("#managed_scroller_title").length > 0) {
					$("#managed_scroller_title").hide();
				}
				if($("#managed_scroller").length > 0) {
					$("#managed_scroller").hide();
				}
				if($("#invited_box_title").length > 0) {
					$("#invited_box_title").hide();
				}
				if($("#data_box").length > 0) {
					$("#data_box").hide();
				}
			});
		} else {
			var user_id = ($hash[0].length > 0 ? $hash[0] : "");
			$("#personal_data").load_user_data(user_id);
			if($("#managed_scroller_title").length > 0) {
				$("#managed_scroller_title").show();
			}
			if($("#managed_scroller").length > 0) {
				$("#managed_scroller").show();
			}
			if($("#invited_box_title").length > 0) {
				$("#invited_box_title").show();
			}
			if($("#data_box").length > 0) {
				$("#data_box").show();
			}
		}
	} else {
		$("#personal_data").load_user_data();
	}
};


/*=======================================================================================
*	CONTENT GENERATION
*======================================================================================*/

/**
* Generate the manager top box
* @param  object		manager_data 		The user manager data object
*/
$.fn.generate_manager_profile = function(manager_data) {
	var $item = $(this),
	$managers_box = $('<div id="managers" class="top_content_label">'),
	$managers_box_title = $('<h1>').text(i18n[lang].messages.managed_by),
	$manager_box = $('<div class="manager">'),
	$manager_box_name = $('<h2>'),
	$manager_box_name_link = $('<a>').attr({
		"href": "./Profile#" + $.get_user_id(manager_data)
	}),
	$manager_box_name_position = $('<small class="help-block">').html(i18n[lang].messages.loading_profile),
	$manager_picture_img = $('<img>').attr({
		"src": $.get_user_img_src(manager_data),
		"alt": "me"
	});
	$manager_box_name_position.get_user_work_position(manager_data, false);
	$manager_box_name_link.append($manager_picture_img);
	$manager_box_name_link.append($.get_user_full_name(manager_data));
	$manager_box_name_link.append($manager_box_name_position);
	if($.get_user_id(manager_data) == $.get_manager_id()) {
		$manager_box_name_link.attr("title", i18n[lang].interface.btns.back_to_your_profile);
	}
	$manager_box_name.append($manager_box_name_link);
	$manager_box.append($manager_box_name);
	$managers_box.append($managers_box_title);
	$managers_box.append($manager_box);
	if($("#managers").length === 0) {
		$item.prepend($managers_box);
	}
};

/**
 * Generate the profile of a given user
 * @param  object 		user_data 		The user data object
 */
$.fn.generate_profile = function(user_data) {
	/**
	 * Format a given type of user contact
	 * @param  string 	item      		The kTAG of the contavt item to display
	 * @param  object 	user_data 		The user data object
	 */
	$.fn.display_contact = function(item, user_data) {
		var $item = $(this);
		if(user_data[item] !== undefined) {
			var $root_dt = $('<dt>' + $.ucfirst(user_data[item][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", "")) + ':</dt>'),
			$root_dd = $('<dd>'),
			$dl_contact = $('<dl class="dl-horizontal">');
			$.each(user_data[item][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
				var $cdt = $('<dt>').text(v[kAPI_PARAM_RESPONSE_FRMT_NAME]),
				$cdd = $('<dd>').html($.linkify(v[kAPI_PARAM_RESPONSE_FRMT_DISP]));
				$dl_contact.append($cdt);
				$dl_contact.append($cdd);
			});
			$root_dd.append($dl_contact);
			$item.append($root_dt);
			$item.append($root_dd);
		}
	};

	/**
	 * List formatted roles from given user data
	 * @param  object 	user_data 		The user data object
	 */
	$.fn.display_roles = function(user_data) {
		var $item = $(this),
		$roles_dl = $('<dl class="dl-horizontal roles">');
		$.each(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
			var $roles_dt = $('<dt>'),
			$roles_dd = $('<dd>'),
			icon = "";

			switch(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE][k]) {
				case kTYPE_ROLE_LOGIN:
					icon = "fa fa-fw fa-sign-in";
					break;
				case kTYPE_ROLE_INVITE:
					icon = "fa fa-fw fa-certificate";
					break;
				case kTYPE_ROLE_UPLOAD:
					icon = "fa fa-fw fa-upload";
					break;
				case kTYPE_ROLE_EDIT:
					icon = "fa fa-fw fa-file-text-o";
					break;
				case kTYPE_ROLE_USERS:
					icon = "fa fa-fw fa-group";
					break;
			}
			$roles_dt.html('<span class="' + icon + ' fa-3x text-success"></span>');
			$roles_dd.html(v[kAPI_PARAM_RESPONSE_FRMT_DISP] + '<i class="help-block">' + v[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</i>');
			$roles_dl.append($roles_dt);
			$roles_dl.append($roles_dd);
		});
		$item.append($roles_dl);
	};

	var $item = $(this);
	if($.storage_exists("pgrdg_user_cache.user_data.current")) {
		if($.get_manager_id() !== $.get_user_id(user_data)) {
			// Managed user profile
			if($.storage_exists("pgrdg_user_cache.user_data.current")) {
				$.each(storage.get("pgrdg_user_cache.user_data.current"), function(mid, manager_data) {
					$("#contents").generate_manager_profile(manager_data);
				});
			}
		} else {
			$("#managers").remove();
		}
	}
	var $super_row = $('<div class="row">'),
	$picture_col = $('<div class="col-xs-12 col-sm-3 col-md-4 col-lg-2 pull-left">'),
	$form_col = $('<div class="col-xs-12 col-sm-9 col-md-8 col-lg-9 pull-right">'),
	$content_left_col = $('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">'),
	$content_right_col = $('<div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">'),
	$user_data_title_row = $('<h1>'),
	$user_data = $('<div class="col-xs-10 col-sm-7 col-sm-8 col-lg-8 pull-left">'),
	$user_data_right_btns = $('<div class="col-xs-2 col-sm-5 col-lg-4 pull-right">'),
	$title = $('<span class="text-left">'),
	$contact_title = $('<h3>').text(i18n[lang].messages.contacts),
	$roles_title = $('<h3>').text((($.get_manager_id() !== $.get_user_id(user_data)) ? i18n[lang].messages.user_permissions : i18n[lang].messages.you_can) + ":"),
	$contact_div = $('<div class="user_data">'),
	$roles_div = $('<div class="user_data">'),
	$edit_profile_btn = $('<a>').attr({
		"class": "btn btn-default-white pull-right",
		"href": "./Profile#Edit/" + $.get_user_id(user_data),
		"title": i18n[lang].interface.btns.edit_profile,
		"data-toggle": "tooltip",
		"data-placement": "right"
	}).html('<span class="hidden-xs">' + i18n[lang].interface.btns.edit_profile + '&nbsp;</span><span class="fa fa-edit"></span>'),
	$work_position = $('<h2>'),
	$picture_ex_upload_btn = $('<span>'),
	$picture_img = $('<img>').attr({
		"src": $.get_user_img_src(user_data),
		"alt": "me"
	}),
	$picture_div = $('<div id="picture">'),
	$static_data = $('<small class="help-block hidden-xs hidden-sm">');
	$picture_col.append($picture_div);
	var data_labels = [
		{"label": "invited on","value": $.right_date(user_data[kTAG_VERSION][kAPI_PARAM_RESPONSE_FRMT_DISP])},
		{"label": "Subscribed on","value": $.right_date(user_data[kTAG_RECORD_CREATED][kAPI_PARAM_RESPONSE_FRMT_DISP])},
	];
	for (i = 0; i < 2; i++) {
		var $dl = $('<dl>'),
		$dt = $('<dt>'),
		$dd = $('<dd>');
		$dt.text(data_labels[i].label);
		$dd.text(data_labels[i].value);
		$dl.append($dt);
		$dl.append($dd);
		$static_data.append($dl);
	}

	$picture_col.append($static_data);
	$picture_ex_upload_btn.append($picture_img);
	$picture_div.append($picture_ex_upload_btn);
	$super_row.append($picture_col);
	$title.text($.get_user_full_name(user_data));
	if(user_data[kTAG_ENTITY_TITLE] !== undefined) {
		$work_position.get_user_work_position(user_data, true);
	}
	// Title row
		// User full name
		$user_data_title_row.append($title);
		// Edit button
		$user_data_title_row.append($edit_profile_btn);

		$form_col.append($user_data_title_row);
	// Work position
	$form_col.append($work_position);
	// Contacts
		// Contact title
		$content_left_col.append($contact_title);
		// Contact list
		var $root_dl = $('<dl>');
		$root_dl.display_contact(kTAG_ENTITY_PHONE, user_data);
		$root_dl.display_contact(kTAG_ENTITY_FAX, user_data);
		$root_dl.display_contact(kTAG_ENTITY_EMAIL, user_data);

		$contact_div.append($root_dl);
		$content_left_col.append($contact_div);
	$form_col.append($content_left_col);
	// Roles
		// Roles title
		$content_right_col.append($roles_title);
		// Roles list
		$roles_div.display_roles(user_data);
		$content_right_col.append($roles_div);
	$form_col.append($content_right_col);

	// Separator
	$form_col.append('<hr />');
	// Append all to body content
	$super_row.append($form_col);

	// Place all in the section
	$item.addClass("container-fluid").html($super_row);

	/**
	* Managed users display
	*/
	$item.load_active_users(user_data);

	/**
	 * Invited users display
	 */
	$("#managed_scroller").load_invited_users(user_data);

	$("#loader").hide();
};

/**
* Call the user profile generation depending if data of a given user_id is stored or not in the local storage
* @param  string		user_id 		The user ID string
*/
$.fn.load_user_data = function(user_id) {
	var $item = $(this);
	if(user_id === undefined || user_id === null || user_id === "") {
		if($.storage_exists("pgrdg_user_cache.user_data.current")) {
			window.location.hash = $.get_manager_id();
			$item.generate_profile(storage.get("pgrdg_user_cache.user_data.current." + $.get_manager_id()));
		}
	} else {
		$.get_user(user_id, false, function(ud){
			$item.generate_profile(ud);
		});
	}
};

/**
* Load all managed users and generate a btns scroll of a given user data manager
* @param  void 			user_data 		The object of user data.
*/
$.fn.load_active_users = function(user_data){
	$.empty_scroller = function(user_data) {
		var $p = $('<p>'),
		$invite_user_btn = $('<a>').attr({
			"href": "./Invite#" + $.get_current_user_id()
		}).text(i18n[lang].interface.btns.invite_an_user);

		/**
		* Invite users button
		*/
		if($.inArray(kTYPE_ROLE_INVITE, user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE]) !== -1) {
			$p.html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_active_users_yet);
			$p.append('<br />');
			$p.append($invite_user_btn);
		} else {
			$p.html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_created_users);
		}
		return $p;
	};

	var $item = $(this),
	$managed_scroller = ($("#managed_scroller").length === 0) ? $('<div id="managed_scroller">') : $("#managed_scroller"),
	$managed_scroller_title_count_data = $('<small class="text-info">').text($.get_managed_users_count(user_data)),
	$managed_scroller_title_count = $('<sup>').append($managed_scroller_title_count_data),
	$managed_scroller_title = ($("#managed_scroller_title").length === 0) ? $('<h2 id="managed_scroller_title">') : $("#managed_scroller_title"),
	user_id = $.get_user_id(user_data);
	// Fill the managed users title
	$managed_scroller_title.html(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_NAME] + " ");
	$managed_scroller_title.append($managed_scroller_title_count);
	// Check if current user has managed accounts
	if($.get_managed_users_count(user_data) === 0) {
		// There's no managed accounts, load empty scroll
		$managed_scroller.removeClass("has_data").html($.empty_scroller(user_data));
		if(user_id !== $.get_manager_id()) {
			$managed_scroller.find("p").html('<span class="fa fa-times fa-2x"></span><br />' + i18n[lang].messages.no_created_users);
		}
	} else {
		$managed_scroller.html("");
		// Load managed users in scroll
		$managed_scroller.addClass("has_data");
		$.get_managed_users($.get_user_id(user_data), function(managed_data) {
			var $hash = $.url().fsegment(),
			$managed_picture = $('<ul class="managed_picture list-inline">'),
			$li = $('<li>');
			console.log(managed_data);
			$.each(managed_data, function(uid, ud) {
				var $h1 = $('<h1>'),
				$a = $('<a>').attr({
					"href": "./Profile#" + $.get_user_id(ud)
				});
				$span = $('<span>'),
				$user_img = $('<img>').attr({
					"src": $.get_user_img_src(ud),
					"alt": $.get_user_full_name(ud)
				});
				$span.text($.get_user_full_name(ud));
				$a.append($user_img).append($span);
				$h1.append($a);
				$li.attr("maged-user-id", $.get_user_id(ud)).append($h1);
				$managed_picture.append($li);
			});
			if($managed_scroller.find("ul.managed_picture").length === 0) {
				$managed_scroller.append($managed_picture);
			}
			if($hash[0] !== "Edit") {
				$managed_scroller.fadeIn(300);
			}
		});
	}
	$managed_scroller.insertAfter($item);
	$managed_scroller_title.insertBefore($managed_scroller);
};

/**
* Load all invites of a given user data
* @param  void 			user_data 		The object of user data.
*/
$.fn.load_invited_users = function(user_data) {
	$.fn.load_invited_roles_icon = function(user_data) {
		var $item = $(this);
		$.each(user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE], function(k, v) {
			var $span = $('<span class="fa fa-fw text-info">&nbsp;');
			switch(v) {
				case kTYPE_ROLE_LOGIN:
					$span.addClass("fa-sign-in");
					break;
				case kTYPE_ROLE_INVITE:
					$span.addClass("fa-certificate");
					break;
				case kTYPE_ROLE_UPLOAD:
					$span.addClass("fa-upload");
					break;
				case kTYPE_ROLE_EDIT:
					$span.addClass("fa-edit");
					break;
				case kTYPE_ROLE_USERS:
					$span.addClass("fa-group");
					break;
			}
			$item.append($span);
		});
	};

	var $item = $(this),
	user_id = $.get_user_id(user_data),
	$invited_box = ($("#data_box").length === 0) ? $('<div id="data_box">') : $("#data_box"),
	$invited_box_title_count_data = $('<small class="text-info">').text($.get_invited_users_count(user_data)),
	$invited_box_title_count = $('<sup>').append($invited_box_title_count_data),
	$invited_box_title = ($("#invited_box_title").length === 0) ? $('<h2 id="invited_box_title">') : $("#invited_box_title"),
	$invited_ul = $('<ul class="list-group">'),
	$invited_box_col = ($("#invited_box").length === 0) ? $('<div id="invited_box" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">') : $("#invited_box"),
	$invite_user_btn = $('<a>').attr({
		"href": "./Invite#" + user_id,
		"class": "btn btn-default pull-right"
	});
	if(user_id == $.get_manager_id()) {
		$invite_user_btn.html(i18n[lang].interface.btns.invite_an_user + ' <span class="fa fa-plus"></span>');
	} else {
		$invite_user_btn.html(i18n[lang].interface.btns.invite_an_user_as.replace("{X}", $.get_user_name(user_data)) + ' <span class="fa fa-plus"></span>');
	}

	// Fill the managed users title
		// Title provided by Service, replace when Milko come back to work
		// $invited_box_title.html(user_data[kTAG_INVITES][kAPI_PARAM_RESPONSE_FRMT_NAME] + " ");
	$invited_box_title.html(i18n[lang].messages.invited_users + " ");
	$invited_box_title.append($invited_box_title_count);

	if($.get_invited_users_count(user_data) > 0) {
		// Proceed with invites extraction
		$.each(user_data[kTAG_INVITES][kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
			var invited_user_name = $.get_user_full_name(v[kAPI_PARAM_RESPONSE_FRMT_DOCU]),
			invited_user_email = $.get_user_email(v[kAPI_PARAM_RESPONSE_FRMT_DOCU]),
			$li = $('<li class="list-group-item">'),
			$div_row = $('<div class="row">'),
			$div_col_left = $('<div class="col-xs-7">'),
			$div_col_center = $('<div class="col-xs-3">'),
			$div_col_right = $('<div class="col-xs-2 text-right">'),
			$a = $('<a>').attr({
				"href": "mailto:" + invited_user_name
			}),
			$p = $('<p>'),
			$p_roles = $('<p>');
			$a.text(invited_user_name);
			$p.html('<span class="fa fa-user-secret fa-fw text-muted"></span> ');
			$p.append($a);
			$div_col_left.html($p);

			$p_roles.attr("title", i18n[lang].messages.this_user_will_be_able_to + " " + $.get_user_roles_list(v[kAPI_PARAM_RESPONSE_FRMT_DOCU]));
			$p_roles.load_invited_roles_icon(v[kAPI_PARAM_RESPONSE_FRMT_DOCU]);
			$p_roles.tooltip();
			$div_col_center.html($p_roles);
			$div_col_right.html('<a class="btn btn-default-white" href="javascript:void(0);" onclick="$.delete_invitation(\'' + $.get_user_pgp_fingerprint(v[kAPI_PARAM_RESPONSE_FRMT_DOCU]) + '\')"><span class="fa fa-trash"></span></span>');

			$div_row.append($div_col_left).append($div_col_center).append($div_col_right);
			$li.append($div_row);
			$invited_ul.append($li);
		});
		$invited_box_col.html($invited_ul);
		$invited_box_col.append($invite_user_btn);
		$invited_box.html($invited_box_col);
	} else {
		$invited_box_col.html('<p class="pull-left text-muted"><i>' + i18n[lang].messages.no_invited_users_yet + "</i></p>").append($invite_user_btn);
		$invited_box.append($invited_box_col);
	}

	$invited_box.addClass("row").insertAfter($item);
	$invited_box_title.insertBefore($invited_box);
};


/*=======================================================================================
*	EDIT USER
*======================================================================================*/

/**
 * Display dialog and come back to user profile
 */
$.cancel_user_editing = function() {
	apprise(i18n[lang].messages.undo_user_profile.message, {
		title: i18n[lang].messages.undo_user_profile.title,
		icon: "fa-warning",
		titleClass: "text-warning",
		confirm: true,
	}, function(r) {
		if(r) {
			var $hash = $.url().fsegment();
			document.location = "./Profile#" + $hash[1];
		}
	});
};

/**
* Generate the roles manager box
* @param  string 		user_id 		The user id to append the request
* @param  string 		user_roles 		The full user roles object (user_data[kTAG_ROLES])
*/
$.fn.roles_manager_box = function(user_id, user_roles) {
	if(user_id === undefined || user_id === null) {
		if(user_roles === undefined) {
			var user_data = $.get_current_user_data();
			user_id = $.get_user_id(user_data);
			user_roles = $.get_user_roles(user_data);
		} else {
			user_id = "";
		}
	}
	var $item = $(this),
	$fieldset_r = $('<fieldset>'),
	$legend_r = $('<legend>').text("Roles"),
	$ul = $('<ul>').addClass("list-group roles"),
	roles = [
		{
			"text": "Active",
			"icon": "fa-lock",
			"description": "The ability to login.",
			"id": "role-login",
			"value": kTYPE_ROLE_LOGIN,
			"data-type": kTYPE_ROLE_LOGIN,
			"checked": ($.inArray(kTYPE_ROLE_LOGIN, user_roles[kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) ? "checked" : "",
			"danger": true,
			"data-content": "If this field is set to off, the user will be unable to login"
		},{
			"text": "Invite users",
			"icon": "fa-user-plus",
			"description": "The ability to compile a user profile and send an invitation.",
			"id": "role-invite",
			"value": kTYPE_ROLE_INVITE,
			"data-type": kTYPE_ROLE_INVITE,
			"checked": ($.inArray(kTYPE_ROLE_INVITE, user_roles[kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) ? "checked" : "",
			"danger": false
		},{
			"text": "Upload data",
			"icon": "fa-upload",
			"description": "The ability to upload data templates.",
			"id": "role-upload",
			"value": kTYPE_ROLE_UPLOAD,
			"data-type": kTYPE_ROLE_UPLOAD,
			"checked": ($.inArray(kTYPE_ROLE_UPLOAD, user_roles[kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) ? "checked" : "",
			"danger": false
		},{
			"text": "Edit pages",
			"icon": "fa-file-text-o",
			"description": "The ability to login.",
			"id": "role-edit",
			"value": kTYPE_ROLE_EDIT,
			"data-type": kTYPE_ROLE_EDIT,
			"checked": ($.inArray(kTYPE_ROLE_EDIT, user_roles[kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) ? "checked" : "",
			"danger": false
		},{
			"text": "Manage users",
			"icon": "fa-group",
			"description": "The ability to login.",
			"id": "manage-users",
			"value": kTYPE_ROLE_USERS,
			"checked": ($.inArray(kTYPE_ROLE_USERS, user_roles[kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) ? "checked" : "",
			"danger": false
		}
	];

	$.each(roles, function(kk, vv) {
		var $li = $('<li class="list-group-item">'),
		$dd = $('<div class="pull-right">'),
		$checkbox = $('<input>').attr({
			"type": "checkbox",
			"data-type": vv.value,
			"id": vv.id,
			"value": vv.value
		}),
		$label = $('<label>').attr("for", vv.id).addClass("text-left"),
		$label_h3 = $('<h3>'),
		$label_text = $('<p>').addClass("list-group-item-text").text(vv.description),
		$label_icon = $('<span>').addClass("fa fa-fw text-muted " + vv.icon);

		$label_h3.append($label_icon).append(vv.text).addClass("list-group-item-heading");
		$label.append($label_h3);
		$label.append($label_text);

		if(vv.checked !== undefined && vv.checked !== "" && vv.checked == "checked") {
			$li.addClass("list-group-item-success");
			$checkbox.attr("checked", vv.checked);
		} else {
			$checkbox.attr("checked", false);
		}
		if(vv.danger) {
			$checkbox.attr({
				"data-off-color": "danger",
				"data-content": vv.title
			});
			$label_h3.append(' <sup><small class="fa fa-exclamation-triangle text-warning" style="font-size: 12px;"></small></sup>');
			$li.popover({
				placement: "top",
				trigger: "hover",
				title: '<span class="text-warning"><span class="fa fa-exclamation-triangle"></span> Warning</span>',
				html: true,
				content: vv["data-content"],
				viewport: "#invite_user"
			});
		}
		$li.append($label);
		$dd.append($checkbox);
		$li.append($dd);
		if(vv.value == kTYPE_ROLE_LOGIN) {
			if(user_id !== $.get_manager_id()) {
				$ul.append($li);
			}
		} else {
			$ul.append($li);
		}
	});

	$fieldset_r.append($legend_r);
	$fieldset_r.append($ul);
	$item.append($fieldset_r);
};

/**
* Activate the bootstrapSwitch feature on roles manager form
*/
$.activate_roles_manager_box = function() {
	$("[type='checkbox']").bootstrapSwitch({
		size: "small",
		labelText: "⋮",
		onText: "Yes",
		offText: "No"
	}).on('switchChange.bootstrapSwitch', function(event, state) {
		if(event.target.id == "role-login") {
			var $items = $("#role-invite, #role-upload, #role-edit, #manage-users"),
			$items_li = $items.closest("li.list-group-item");

			if(!state) {
				$(this).closest("li.list-group-item").addClass("list-group-item-danger");
				$items_li.addClass("disabled");
				$.each($items_li, function(kl, vl) {
					if($(this).hasClass("list-group-item-success")) {
						$(this).switchClass("list-group-item-success", "list-group-item-not-success");
					}
				});
				$items.bootstrapSwitch("toggleIndeterminate", true);
				$items.bootstrapSwitch("toggleDisabled", true);
			} else {
				$(this).closest("li.list-group-item").removeClass("list-group-item-danger");
				$items_li.removeClass("disabled");
				$.each($items_li, function(kl, vl) {
					if($(this).hasClass("list-group-item-not-success")) {
						$(this).switchClass("list-group-item-not-success", "list-group-item-success");
					}
				});
				$items.bootstrapSwitch("toggleIndeterminate", false);
				$items.bootstrapSwitch("toggleDisabled", false);
			}
		} else {
			if(state) {
				$(this).attr("checked", true);
				$(this).closest("li.list-group-item").addClass("list-group-item-success");
			} else {
				$(this).attr("checked", false);
				$(this).closest("li.list-group-item").removeClass("list-group-item-success");
			}
		}
	});
};

/**
 * Generate form for manage user data
 */
$.fn.load_user_data_in_form = function(user_id) {
	/**
	 * Add forms for edit typed lists
	 */
	$.fn.add_typed = function() {
		var $item = $(this).closest(".form-group"),
		$items = $item.find("div.line"),
		form_group_type = $.trim($item.attr("class").replace("form-group", "")),
		placeholder = "",
		dataitem = "",
		datatype = "",
		datatag = "",
		mid = "",
		cont = 0,
		f = 0,
		// DOM
		$row = $('<div class="line clearfix">'),
		$form_group = $('<div class="form-group">'),
		$input_col = $('<div class="col-sm-5">'),
		$input_group = $('<div class="input-group">'),
		$input_group_btn = $('<div class="input-group-btn">'),
		$span_col0 = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$span_col = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$span_col2 = $('<div class="col-sm-5 control-label text-muted text-left">'),
		$label = $('<label class="col-sm-3 control-label">'),
		$label_empty = $('<label class="col-sm-3 control-label">'),
		$span = $('<div class="col-sm-3 control-label text-muted">'),
		$input = $('<input>'),
		$input2 = $('<input>'),
		$plus_btn = $('<a>').attr({
			"href": "javascript:void(0);",
			"onclick": "$(this).add_typed();",
			"class": "btn btn-default-white"
		}),
		$minus_btn = $('<a>').attr({
			"href": "javascript:void(0);",
			"onclick": "$(this).remove_typed();",
			"class": "btn btn-default-white"
		}).html('<span class="fa fa-minus text-center">');
		$span_col.attr("class", "col-sm-4 col-xs-6");
		$span_col2.attr("class", "col-sm-4 col-xs-6 row");

		$.each($item.find("input"), function(i) {
			if($(this).val().length === 0) {
				cont++;
				$(this).focus();
				return false;
			}
		});
		if(cont === 0) {
			$input.attr({
				"type": "text",
				"class": "form-control",
				"required": "required",
				"data-item": $item.find("input:first").attr("data-item"),
				"data-tag": $item.find("input:first").attr("data-tag"),
				"data-type": $item.find("input:first").attr("data-type"),
				"data-struct": "k",
				"data-count": $items.length,
				"id": $item.find("input:first").attr("data-item"),
				"name": $item.find("input:first").attr("data-item"),
				"placeholder": $item.find("input:first").attr("placeholder"),
				"value": ""
			});
			$input2.attr({
				"type": "text",
				"class": "form-control",
				"required": "required",
				"data-item": $item.find("input:first").attr("data-item"),
				"data-tag": $item.find("input:first").attr("data-tag"),
				"data-type": $item.find("input:first").attr("data-type"),
				"data-struct": "v",
				"data-count": $items.length,
				"id": $item.find("input:first").attr("data-item"),
				"name": $item.find("input:first").attr("data-item"),
				"placeholder": $item.find("input:last").attr("placeholder"),
				"value": ""
			});
			$span_col.append($input);
			$input_group.append($input2);
			$input_group_btn.append($minus_btn);
			$input_group.append($input_group_btn);
			$span_col2.append($input_group);
			$row.append($label_empty).append($span_col).append($span_col2);
			$item.append($row);
			$row.find("input[value='']:not(:checkbox,:button):visible:first").focus();
			return false;
		}
	};

	/**
	 * Remove the typed list line previously added
	 */
	$.fn.remove_typed = function() {
		var $item = $(this).closest(".line");
		$item.fadeOut(300, function() {
			$item.remove();
		});
	};

	if(user_id === undefined || user_id === null || user_id === "") {
		user_id = $.get_manager_id();
	}
	if($.storage_exists("pgrdg_user_cache.user_data.current")) {
		if($.get_manager_id() !== user_id) {
			// Managed user profile
			if($.storage_exists("pgrdg_user_cache.user_data.current")) {
				$.each(storage.get("pgrdg_user_cache.user_data.current"), function(mid, manager_data) {
					$("#contents").generate_manager_profile(manager_data);
				});
			}
		} else {
			$("#managers").remove();
		}
	}

	var $item = $(this),
	ud = {},
	i = 0;
	ud[kTAG_RECORD_CREATED] = {};
	ud[kTAG_VERSION] = {};
	ud[kTAG_ENTITY_AFFILIATION] = {};
	ud[kTAG_ENTITY_FNAME] = {};
	ud[kTAG_ENTITY_FNAME] = {};
	ud[kTAG_ENTITY_LNAME] = {};
	ud[kTAG_NAME] = {};
	ud[kTAG_CONN_CODE] = {};
	ud[kTAG_ENTITY_EMAIL] = {};
	ud[kTAG_ENTITY_PHONE] = {};
	ud[kTAG_ENTITY_ICON] = {};
	$.get_user(user_id, false, function(user_data) {
		$.each(user_data, function(k, v){
			ud[kTAG_VERSION][kAPI_PARAM_DATA_TYPE] = "static";
			ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Invited on";
			ud[kTAG_VERSION][kAPI_PARAM_DATA] = user_data[kTAG_VERSION];

			ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Subscribed on";
			ud[kTAG_RECORD_CREATED][kAPI_PARAM_DATA_TYPE] = "static";
			ud[kTAG_RECORD_CREATED][kAPI_PARAM_DATA] = user_data[kTAG_RECORD_CREATED];

			ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_DATA_TYPE] = "read";
			ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_AFFILIATION];

			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA_KIND] = "required";
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_FNAME];

			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA_KIND] = "required";
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_LNAME];

			ud[kTAG_NAME][kAPI_RESULT_ENUM_LABEL] = "Full name";
			ud[kTAG_NAME][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_NAME][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_NAME][kAPI_PARAM_DATA_KIND] = "required";
			ud[kTAG_NAME][kAPI_PARAM_ID] = user_data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_NAME][kAPI_PARAM_DATA] = user_data[kTAG_NAME];

			ud[kTAG_CONN_CODE][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_CONN_CODE][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_CONN_CODE][kAPI_PARAM_DATA_KIND] = "required";
			ud[kTAG_CONN_CODE][kAPI_RESULT_ENUM_LABEL] = "Username";
			ud[kTAG_CONN_CODE][kAPI_PARAM_ID] = user_data[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_CONN_CODE][kAPI_PARAM_DATA] = user_data[kTAG_CONN_CODE];

			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA_TYPE] = "read_edit";
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_INPUT_TYPE] = "email";
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_EMAIL][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_EMAIL];

			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA_TYPE] = "edit";
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_INPUT_TYPE] = "text";
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_ID] = user_data[kTAG_ENTITY_PHONE][kAPI_PARAM_RESPONSE_FRMT_NAME].replace(/\s+/g, "_").toLowerCase();
			ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_PHONE];

			ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA_TYPE] = "hide";
			ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_ICON];
		});

		var $super_row = $('<div class="row">'),
		$picture_col = $('<div class="col-xs-12 col-sm-3 col-lg-2 pull-left" id="picture_container">'),
		$form_col = $('<div class="col-xs-12 col-sm-8 col-lg-6 well form" id="user_data_container">'),
		$fieldset_pd = $('<fieldset>'),
		$legend_pd = $('<legend>').text("Personal data"),
		$picture_upload_btn = $('<a id="upload_btn" href="javascript:void(0);">'),
		$picture_upload_btn_form = $('<form action="" class="dropzone hidden" id="dropzone"></form>'),
		$picture_img = $('<img>').attr({
			"src": $.get_user_img_src(user_data),
			"alt": "me"
		}),
		$picture_div = $('<div id="picture">'),
		$static_data = $('<small class="help-block">');
		$picture_upload_btn.append($picture_img);
		$picture_div.append($picture_upload_btn);
		$picture_div.append($picture_upload_btn_form);
		$picture_col.append($picture_div);
		$fieldset_pd.append($legend_pd);
		$item.html("");

		$.each(ud, function(k, v){
			i++;
			var $row = $('<div class="line clearfix">'),
			$form_group = $('<div class="form-group">'),
			$input_col = $('<div class="col-sm-5">'),
			$input_group = $('<div class="input-group">'),
			$input_group_btn = $('<div class="input-group-btn">'),
			$span_col0 = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$span_col = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$span_col2 = $('<div class="col-sm-5 control-label text-muted text-left">'),
			$label = $('<label class="col-sm-3 control-label">'),
			$label_empty = $('<label class="col-sm-3 control-label">'),
			span_label = "",
			$span = $('<div class="col-sm-3 control-label text-muted">'),
			$input = $('<input>'),
			$input2 = $('<input>'),
			$plus_btn = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$(this).add_typed();",
				"class": "btn btn-default-white"
			}),
			$cancel_btn = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$.cancel_user_editing();",
				"class": "btn btn-default-white pull-left"
			}).html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
			$submit = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$.save_user_data('" + user_id + "');",
				"class": "btn btn-default pull-right"
			}).html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>');

			$super_row.prepend($picture_col);
			var d = "";
			switch(v[kAPI_PARAM_DATA_TYPE]) {
				case "static":
					var $dl = $('<dl class="visible-sm visible-md visible-lg">'),
					$dt = $('<dt>'),
					$dd = $('<dd>');

					$dt.text(
						(v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""))
					);
					$dd.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$dl.append($dt);
					$dl.append($dd);
					$static_data.append($dl);

					$picture_col.append($static_data);
					break;
				case "read":
					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);

						var $ul = $('<ul class="list-unstyled">');
						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_VALUE], function(kk, vv) {
							if($.is_obj(vv) || $.is_array(vv)) {
								if(kTAG_UNIT_REF in vv) {
									$ul.append('<li id="' + $.trim(vv[kTAG_TYPE]) + '"><i>Loading...</li>');
									$.get_authority(vv[kTAG_UNIT_REF], function(authority) {
										$('#' + $.trim(vv[kTAG_TYPE])).html(authority);
									});
								}
							} else {
								$ul.html('<li><i>none</i></li>');
							}
						});
						$span_col.html($ul);

						$row.addClass($.md5(span_label));
						$row.append($span);
						$row.append($span_col);
						$fieldset_pd.append($row);
					} else {
						span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);
						$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

						$row.addClass($.md5(span_label));
						$form_group.append($span);
						$form_group.append($span_col);
					}

					$fieldset_pd.append($form_group);
					$form_col.append($fieldset_pd);
					$super_row.append($form_col);
					break;
				case "read_edit":
					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME]);
						$label.attr("for", v[kAPI_PARAM_ID]);
						$label.text(span_label);
						$row.append($label);

						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
							$.each(vv, function(kkk, vvv) {
								$.each(vv, function(kkk, vvv) {
									d = vv[kAPI_PARAM_RESPONSE_FRMT_DISP];
								});
							});
							$span_col0.attr("class", "col-sm-9 col-xs-12").append('<span class="help-block">' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + $.linkify(d) + '</span>');
							$input.attr({
								"type": "text",
								"class": "form-control typed_key",
								"data-item": v[kAPI_PARAM_ID],
								"data-tag": k,
								"data-type": v.data[kAPI_PARAM_DATA_TYPE],
								"data-struct": "k",
								"data-count": 0,
								"id": v[kAPI_PARAM_ID] + "_k",
								"name": v[kAPI_PARAM_ID] + "_k",
								"placeholder": $.ucfirst(kAPI_RESULT_ENUM_LABEL),
								"value": ""
							});
							$input2.attr({
								"type": (v[kAPI_PARAM_INPUT_TYPE] !== undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
								"class": "form-control typed_value",
								"data-item": v[kAPI_PARAM_ID],
								"data-tag": k,
								"data-type": v.data[kAPI_PARAM_DATA_TYPE],
								"data-struct": "v",
								"data-count": 0,
								"id": v[kAPI_PARAM_ID] + "_v",
								"name": v[kAPI_PARAM_ID] + "_v",
								"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
								"value": ""
							});
							$row.addClass($.md5(span_label));
							$span_col.attr("class", "col-sm-4 col-xs-6 col-sm-offset-3").append($input);
							$span_col2.attr("class", "col-sm-4 col-xs-6 row");
							$plus_btn.html('<span class="fa fa-plus text-center">');
							$input_group_btn.append($plus_btn);
							$input_group.append($input2);
						});
						$input_group.append($input_group_btn);
						$input_col.append($span_col);
						$input_col.append($span_col2);
						$span_col2.append($input_group);
						$row.append($span_col0).append($span_col).append($span_col2);
						$form_group.append($row);
						// $form_col.append('<hr />');
					} else {
						span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
						$span.text(span_label);
						$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));
						// console.warn($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));
						$input.attr({
							"type": "hidden",
							"class": "form-control",
							"data-item": v[kAPI_PARAM_ID],
							"data-tag": k,
							"data-type": v.data[kAPI_PARAM_DATA_TYPE],
							"data-struct": "v",
							"data-count": 0,
							"id": v[kAPI_PARAM_ID] + "_k",
							"name": v[kAPI_PARAM_ID] + "_k",
							"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
							"value": ""
						});
						$row.addClass($.md5(span_label));
						$form_group.append($span);
						$form_group.append($span_col);
					}
					$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
					$fieldset_pd.append($form_group);
					$form_col.append($fieldset_pd);
					$super_row.append($form_col);
					break;
				case "edit":
					span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", ""));
					$label.addClass("col-xs-12").attr("for", v[kAPI_PARAM_ID]);
					$label.text(span_label);

					if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						$row.append($label);
						$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
							if($.is_obj(vv) || $.is_array(vv)) {
								$.each(vv, function(kkk, vvv) {
									$input.attr({
										"type": "text",
										"class": "form-control",
										"data-item": v[kAPI_PARAM_ID],
										"data-tag": k,
										"data-type": v.data[kAPI_PARAM_DATA_TYPE],
										"data-struct": "k",
										"data-count": 0,
										"id": v[kAPI_PARAM_ID] + "_k",
										"name": v[kAPI_PARAM_ID] + "_k",
										"placeholder": $.ucfirst(kAPI_RESULT_ENUM_LABEL),
										"value": vv[kAPI_PARAM_RESPONSE_FRMT_NAME]
									});
									$input2.attr({
										"type": (v[kAPI_PARAM_INPUT_TYPE] !== undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
										"class": "form-control",
										"data-item": v[kAPI_PARAM_ID],
										"data-tag": k,
										"data-type": v.data[kAPI_PARAM_DATA_TYPE],
										"data-struct": "v",
										"data-count": 0,
										"id": v[kAPI_PARAM_ID] + "_v",
										"name": v[kAPI_PARAM_ID] + "_v",
										"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
										"value": vv[kkk]
									});
									$span_col.attr("class", "col-sm-4 col-xs-6").append($input);
									$span_col2.attr("class", "col-sm-4 col-xs-6 row");
									$plus_btn.html('<span class="fa fa-plus text-center">');
									$input_group_btn.append($plus_btn);
									$input_group.append($input2);
								});
							}
						});
						$input_group.append($input_group_btn);
						$input_col.append($span_col);
						$input_col.append($span_col2);
						$span_col2.append($input_group);
						$row.append($span_col).append($span_col2);
						$form_group.append($row);
					} else {
						$row.append($label);
						$input.attr({
							"type": (v[kAPI_PARAM_INPUT_TYPE] !== undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
							"class": "form-control",
							"id": v[kAPI_PARAM_ID],
							"name": v[kAPI_PARAM_ID],
							"data-tag": k,
							"data-type": v.data[kAPI_PARAM_DATA_TYPE],
							"data-struct": "k",
							"data-count": 0,
							"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
							"value": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]
						});
						if(v[kAPI_PARAM_DATA_KIND] == "required") {
							$input.attr("required", "required");
						}
						$input_col.attr("class", "col-sm-5 col-xs-12").append($input);
						$row.append($input_col);
					}

					$row.addClass($.md5(span_label));
					$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
					if(v[kAPI_PARAM_DATA_KIND] == "required") {
						$form_group.addClass("required");
					}
					$form_group.append($row);
					$fieldset_pd.append($form_group);
					$form_col.append($fieldset_pd);
					$super_row.append($form_col);

					break;
			}

			if(i === $.obj_len(ud)) {
				$span_col.attr("class", "col-xs-12 col-sm-8 col-md-8 col-lg-6 col-xs-offest-3 col-sm-offset-3 col-lg-offset-2").append($cancel_btn).append($submit);
				$row.append($span_col);
				$form_group.addClass("btns-group");
				$form_col.append($fieldset_pd);
				// Append the roles manager box
				$form_col.roles_manager_box(user_id, user_data[kTAG_ROLES]);
				$super_row.append($form_col);
				$super_row.append($row);
			}
		});
		$item.html($super_row);

		$.activate_roles_manager_box();
		$("#loader").hide();
		var filename;
		$("#upload_btn").on("click", function() {
			// Ask the password
			$.require_password(function() {
				// Attach Dropzone instance
				if($("#picture_container .dz-message").length > 0) {
					Dropzone.forElement("#picture_container form").destroy();
				}
				$("#picture_container form").dropzone({
					previewTemplate: document.querySelector("#picture #upload_btn").innerHTML,
					autoDiscover: false,
					sendingmultiple: false,
					acceptedFiles: ".jpg,.jpeg,.png",
					autoProcessQueue: true,
					maxFilesize: 2, // Mb
					clickable: true,
					dictDefaultMessage: '<span class=\"fa fa-cloud-upload fa-5x text-muted\"></span><br /><br />' + i18n[lang].messages.drop_file_here,
					init: function() {
						var theDropzone = this;
						this.on("processing", function(file) {
							var extension = file.name.split(".").pop().toLowerCase();
							filename = user_id + "." + extension;
							this.options.url = "/API/?upload_image=" + filename;
						});
						// Append additional data to the form
						this.on("sending", function(file, xhr, formData) {
							formData.append("user_id", $.get_current_user_id());
						});
						// Open file browser
						$("#picture_container form").click();
					},
					addedfile: function(file) {
						$("#picture").removeClass("error").tooltip("destroy");
						$("#picture").addClass("loading");
						file.previewElement = Dropzone.createElement(this.options.previewTemplate);
					},
					thumbnail: function(file, dataUrl) {
						$("#picture #upload_btn img").attr("src", dataUrl);
						$("#left-panel .login-info a > img").attr("src", dataUrl);
					},
					success: function(file, status){
						$.save_user_image(user_id, filename, function() {
							$("#picture").removeClass("loading");
							$.log_activity({
								action: "Changed personal picture",
								icon: "fa-picture-o"
							});
						});
					},
					error: function(file, message) {
						$("#picture").addClass("error")
						     .attr("data-original-title", message)
						     .tooltip({
							placement: "right",
							trigger: "click"
							})
						     .tooltip("show");
					}
				});
			});
		});
	});
};

/**
 * Save the user image
 */
$.save_user_image = function(user_id, image, callback) {
	var k = {};
	k[kAPI_REQUEST_USER] = $.get_manager_id();
	k[kAPI_PARAM_ID] = user_id;
	k[kAPI_PARAM_OBJECT] = {};
	k[kAPI_PARAM_OBJECT][kTAG_ENTITY_ICON] = image;
	$.ask_cyphered_to_service({
		data: k,
		type: "save_user_image"
	}, function(response) {
		if(typeof callback == "function") {
			if($.obj_len(response) > 0 && response[kAPI_STATUS_STATE] == "ok") {
				callback.call(this);
			}
		}
	});
};

/**
 * Save the user data
 */
$.save_user_data = function(user_id) {
	var o = {},
	k = {},
	tag = "",
	errors = 0;
	o[kTAG_ROLES] = [];
	$.each($('.well.form :input'), function(k, v) {
		$(v).check_input(function($input, status) {
			if(!status) {
				errors++;
				return false;
			} else {
				var $va = $input.getAttributes();
				tag = $va["data-tag"];
				if($.trim($(v).val()) !== "") {
					switch($va["data-type"]) {
					 	case kTYPE_TYPED_LIST:
							var jj = [];
							$.each($input.closest("div.form-group").find("div.line"), function(line_no, l) {
								var j = {};
								var serialized = $(l).find('input').serializeArray();
								o[tag] = [];
								o[tag][line_no] = {};
								$.each(serialized, function(a, b) {
									// console.log(a, b, serialized);
									j[kTAG_TYPE] = serialized[0].value;
									j[kTAG_TEXT] = serialized[1].value;
								});
								if(serialized.length > 0) {
									jj[line_no] = j;
								}
							});
							o[tag] = jj;
							break;
						case kTYPE_ROLE_LOGIN:
						case kTYPE_ROLE_INVITE:
						case kTYPE_ROLE_UPLOAD:
						case kTYPE_ROLE_EDIT:
						case kTYPE_ROLE_USERS:
							if($input.is(":checked")) {
								o[kTAG_ROLES].push($va.value);
							}
							break;
						default:
							o[tag] = $va.value;
							break;
					}
				}
			}
		});
	});

	k[kAPI_PARAM_OBJECT] = o;
	if(errors === 0) {
		$.require_password(function() {
			$("#loader").show();
			k[kAPI_REQUEST_USER] = $.get_manager_id();
			k[kAPI_PARAM_ID] = user_id;

			$.ask_cyphered_to_service({
				storage_group: "pgrdg_user_cache.user_data.all." + user_id,
				data: k,
				type: "save_user_data"
			}, function(response) {
				if($.obj_len(response) > 0 && response[kAPI_STATUS_STATE] == "ok") {
					// Log
					$.log_activity({
						action: "Updated user data",
						icon: "fa-tasks"
					});

					// if(user_id == $.get_manager_id()) {
					// 	storage.set("pgrdg_user_cache.user_data.current." + user_id, )
					// }
					$.get_user(user_id, true, function(user_data) {
						// console.log(user_data);
						$("#loader").hide();
						apprise(i18n[lang].messages.data_saved.message, {
							title: i18n[lang].messages.data_saved.title,
							icon: "fa-check",
							titleClass: "text-success",
						}, function(r) {
							if(r) {
								var $hash = $.url().fsegment();
								document.location = "./Profile#" + $hash[1];
							}
						});
					});
				} else {
					$("#loader").hide();

					apprise(i18n[lang].messages.errors.theres_an_error.message, {
						title: i18n[lang].messages.errors.theres_an_error.title,
						icon: "fa-times",
						titleClass: "text-danger",
					});
				}
			});
		});
	}
};


/*=======================================================================================
*	HISTORY FUNCTIONS
*======================================================================================*/

$.load_history_page = function() {
	var $timeline = $('<div class="timeline">'),
	$timeline_body = $('<div class="row">'),
	$h2_history = $('<h2>').html('<span class="fa fa-clock-o"></span> History'),
	$h1_no_activity = $('<h1 unselectable="on">').html('<span class="fa fa-times"></span> ' + i18n[lang].messages.no_history_yet);

	if($.storage_exists("pgrdg_user_cache.user_activity")) {
		$timeline.append($h2_history);

		$.each(storage.get("pgrdg_user_cache.user_activity"), function(k, v) {
			var $timeline_item = $('<div class="row timeline_item">'),
			$timeline_icon = $('<div class="col-sm-1">'),
			$timeline_body = $('<div class="col-sm-5 well">');
			$.each(v, function(type, data) {
				// console.log(type, data);
				$timeline_icon.html('<span class="fa ' + v.icon + ' fa-2x text-info"></span>');
				$timeline_body.html('<h2>' + v.action + '</h2><small class="help-block"><span class="fa fa-clock-o"></span>' + v.date + '</small><p class="lead">' + v.body + '</p>');
			});
			$timeline_item.append($timeline_icon).append($timeline_body);
			$timeline.append($timeline_item);
		});
	} else {
		$timeline.append($h1_no_activity);
	}

	$("#personal_data").html("").append($timeline);
};

/*=======================================================================================
*	COMMON FUNCTIONS
*======================================================================================*/

/**
 * Load the last activity saved in log storage
 * @param  bool 	 	full 			If false or unset display only the date in "Y/m/d H:i:s" format
 * @return string		        		Last logged activity
 */
$.last_activity = function(full) {
	full = (full === undefined) ? false : full;
	var last_activity = "";

	if($.storage_exists("pgrdg_user_cache.user_activity")) {
		last_activity = storage.get("pgrdg_user_cache.user_activity");
		var l = last_activity[last_activity.length-1];
		$.each(l, function(time, label) {
			if(full) {
				last_activity = $.ucfirst(label) + "<br />on " + time;
			} else {
				last_activity = time;
			}
		});
	} else {
		if(full) {
			last_activity = "Loaded page (no registered previous data): " + $.now();
		} else {
			last_activity = $.now();
		}
	}
	return last_activity;
};

/**
 * Cyclate $.last_activity ad update its status on the page
 */
$.update_last_activity = function() {
	jQuery.timeago.settings.refreshMillis = 0;
	$("span.timeago").attr("data-original-title", $.last_activity(true))
			 .text($.timeago($.last_activity()))
			 .tooltip({
				placement: "top",
				html: true
			 });
	setTimeout(function(){
		$.update_last_activity();
	}, 2000);
}

/**
 * Generate the breadcrumb content
 */
$.set_breadcrumb = function() {
	// console.log($.get_page_config());
	$.fn.set_user_name = function(user_data) {
		$(this).text($.get_user_full_name(user_data));
	};

	var $hash = $.url().fsegment(),
	user_name = "",
	$ol = ($("#ribbon > ol.breadcrum").length === 0) ? $('<ol class="breadcrumb">') : $("#ribbon > ol.breadcrum"),
	$li_home = $('<li>').addClass("home"),
	$li_home_link = (current_path == "Profile") ? $('<a href="./Profile#' + $.get_manager_id() + '">') : $('<a href="./' + current_path + '">'),
	$li = $('<li>');

	$("#ribbon > ol.breadcrum").remove();
	$li_home_link.text(current_path);
	$li_home.html($li_home_link);
	$ol.html($li_home);
	$.each($hash, function(k, v) {
		if(v.length == 40) {
			if(!$.storage_exists("pgrdg_user_cache.user_data.all." + v)) {
				$.get_user(v, false, function(user_data) {
					$li.set_user_name(user_data);
				});
			} else {
				$li.set_user_name(storage.get("pgrdg_user_cache.user_data.all." + v));
			}
			if($hash[1] !== undefined && $hash[1].length == 40) {
				hash_title = $hash[1];
			}
			$ol.append($li);
		}
	});
	$("#ribbon").html($ol);
};


/*======================================================================================*/

$(document).ready(function() {
	$.set_breadcrumb();
	$(window).on("hashchange", function(e) {
		$.set_breadcrumb();
	}).trigger("hashchange");
	$.update_last_activity();

	// $("img[data-url]").each(function() {
	// 	$.ajax({
	// 		url: "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + $(this).data("url") + "&screenshot=true",
	// 		context: this,
	// 		type: "GET",
	// 		dataType: "json",
	// 		success: function(data) {
	// 			data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
	// 			$(this).attr('src', 'data:image/jpeg;base64,' + data);
	// 		}
	// 	});
	// });

	switch(current_path) {
		case "Profile":
			var url = "",
			uploadButton = $('<button/>')
			.addClass('btn btn-primary')
			.prop('disabled', true)
			.text('Processing...')
			.on('click', function () {
				var $this = $(this),
				data = $this.data();
				$this
				.off('click')
				.text('Abort')
				.on('click', function () {
					$this.remove();
					data.abort();
				});
				data.submit().always(function () {
					$this.remove();
				});
			});

			$("#loader").addClass("decrypt").show();
			$.load_profile();
			$(window).on("hashchange", function(e) {
				$.load_profile();
			}).trigger("hashchange");

			$.add_storage_space_in_panel("Non-logged memory", "pgrdg_cache");
			$.add_storage_space_in_panel("User memory", "pgrdg_user_cache");
			break;
		case "History":
			$.load_history_page();
			break;
		case "Invite":
			$("#loader").show();
			$.generate_invite_form();
			break;
		case "Menu":
			// var i = 0;

			// $("body").on("click", function(e) {
			// 	$(".edit_menu_btn").each(function() {
			// 		if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $(".popover").has(e.target).length === 0) {
			// 			$(this).popover("hide");
			// 			$(this).popover("destroy");
			// 			$(this).removeClass("active");
			// 		}
			// 	});
			// }).on("hidden.bs.popover", function() {
			// 	var popover = $(".popover").not(".in");
			// 	if(popover) {
			// 		popover.remove();
			// 	}
			// });
			// $(".list-group-item").sortable({
			// 	// connectWith: ".list-group",
			// 	containment: "parent",
			// 	axis: "y",
			// 	handle: ".move-handle"
			// }).disableSelection();
			break;
		case "Pages":
			$.fn.cyclate_pages = function(page_data, root, parent) {
				$.random_colour = function() {
					return (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 156)) + "," + (Math.floor(Math.random() * 156));
				};

				var info;
				if(storage.isSet("pgrdg_cache.local.info")) {
					info = storage.get("pgrdg_cache.local.info");
				}
				if(root === undefined || root === null || root === "") {
					root = false;
				}
				if(parent === undefined || parent === null || parent === "") {
					parent = "";
				}

				if($.obj_len(page_data.subpages) > 0) {
					colour = $.random_colour();
				}
				var $item = $(this),
				$col = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">'),
				$link = $('<a>').attr({
					"href": "javascript:void(0);",
					"onclick": "$.edit_page('" + JSON.stringify(page_data) + "', '" + JSON.stringify(info) + "');",
					"class": "big_btn",
					"data-content": "",
					"style": function() {
						if($.obj_len(page_data.subpages) > 0) {
							return "box-shadow: 0 0 9px rgb(" + colour + ") inset;";
						} else if(!root) {
							return "box-shadow: 0 0 9px rgba(" + colour + ", 0.35) inset;";
						} else {
							return "";
						}
					},
					"title": "Edit this page"
				}),

				$folded = $('<div class="folded">'),
				$img = $('<img>').attr({
					"src": "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
				}),

				$big_btn_title = $('<div class="big_btn_title">'),
				$fittext = $('<span class="title fittext">').html(page_data.title + ((!root) ? "<small>subpage of " + parent + "</small>" : "")).fitText(1.2, {
			                minFontSize: "20px",
			                maxFontSize: "40px"
			        }),

				$icons_list = $('<div class="icons_list">'),
					$icon_login = $('<span class="fa fa-' + ((page_data.need_login) ? "lock" : "unlock") + '">'),
					$icon_visible = $('<span class="fa fa-' + ((page_data.is_visible) ? "eye" : "eye-slash") + '">'),
					$icon_subpages = $('<span class="fa fa-' + ((page_data.subpages) ? "files-o" : "file-o") + '">');

					$icons_list.append($icon_login);
					$icons_list.append($icon_visible);
					if(!root) {
						$icons_list.append('<span class="fa fa-indent"></span>');
					}
					$icons_list.append($icon_subpages);


				$big_btn_title.append($fittext);
				$big_btn_title.append($icons_list);
				$folded.append($img);
				$link.append($folded);
				$link.append($big_btn_title);
				$col.append($link);

				$item.append($col);
				if($.obj_len(page_data.subpages) > 0) {
			                $.each(page_data.subpages, function(kk, vv) {
						$item.cyclate_pages(vv, false, page_data.title);
			                });
			        }

				$.ajax({
					url: "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=http://pgrdiversity.bioversityinternational.org/" + page_data.address + "&screenshot=true",
					context: this,
					type: "GET",
					dataType: "json",
					success: function(data) {
						data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
						$img.attr("src", "data:image/jpeg;base64," + data);
					}
				});
				// $folded.popover({
				// 	container: "#page_management",
				// 	title: "<h1>Page data</h1>",
				// 	content: function() {
				// 		// var data_content = "";
				// 		// $.each(page_data, function(k, v) {
				// 		// 	if($.type(v) !== "object") {
				// 		// 		if(k == "subpages") {
				// 		// 			data_content += "<b>" + $.ucfirst(k.replace(/\_/g, " ")) + "</b>: 0<br />";
				// 		// 		} else {
				// 		// 			data_content += "<b>" + $.ucfirst(k.replace(/\_/g, " ")) + "</b>: " + $.linkify((v === true) ? "true" : ((v === false) ? "false" : ((v == "") ? '""' : v))) + "<br />";
				// 		// 		}
				// 		// 	} else {
				// 		// 		data_content += "<b>" + $.ucfirst(k.replace(/\_/g, " ")) + "</b>: " + $.obj_len(v) + "<br />";
				// 		// 	}
				// 		// });
				// 		// return data_content;
				// 	},
				// 	html: true,
				// 	trigger: "hover",
				// 	placement: "auto left"
				// });
			}

			$.get_all_pages_config(function(page_config) {
				var $row = $('<div class="row">');

				$.each(page_config.pages, function(page_name, page_data) {
					if(page_data.is_backend !== undefined && !page_data.is_backend) {
						$row.cyclate_pages(page_data, true);
						$("#page_management").html($row);
					}
				});
			});
			break;
		case "Upload":
			$.init_upload();
			break;
	}
});
