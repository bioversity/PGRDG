/**
* Invite users functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/

/**
* Generate the invite form
*/
$.generate_invite_form = function() {
	var $invite_div = ($("#invite_user").length > 0) ? $("#invite_user") : $('<div id="invite_user">'),
	$super_row = $('<div class="row">'),
	$btn_row = $('<div class="col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2">'),
	$send_btn = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.invite_user();",
		"class": "btn btn-default pull-right"
	}).html(i18n[lang].interface.btns.invite + ' <span class="fa fa-share"></span>'),
	$invite_container = $('<div id="invite_container">').addClass("col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2 well form"),
	$fieldset_pd = $('<fieldset>'),
	$legend_pd = $('<legend>').text("User personal data"),
	personal_data_form = [
		{
			"text": "Full name",
			"iput-type": "text",
			"id": "new_user_full_name",
			"placeholder": "Full name",
			"separated": false
		},{
			"text": "Work title",
			"iput-type": "text",
			"id": "new_user_work_title",
			"placeholder": "Work title",
			"separated": false
		},{
			"text": "E-mail address",
			"iput-type": "email",
			"id": "new_user_mail_address",
			"placeholder": "E-mail address",
			"separated": true
		}
	];

	$fieldset_pd.append($legend_pd);
	$.each(personal_data_form, function(k, v) {
		var $form_group = $('<div class="form-group">'),
		$row = $('<div class="row">'),
		$label = $('<label>').addClass("control-label col-sm-3 control-label col-xs-12").attr("for", v.id).text(v.text),
		$form_col = $('<div class="col-sm-9 col-xs-12 row">'),
		$field = $('<input>').attr({
			"type": v["iput-type"],
			"name": v.id,
			"id": v.id,
			"placeholder": v.placeholder,
			"value": ""
		}).addClass("form-control");

		$form_col.append($field);
		$row.append($label);
		$row.append($form_col);
		$form_group.append($row);
		if(v.separated) {
			$fieldset_pd.append("<br />");
		}
		$fieldset_pd.append($form_group);
	});


	$invite_container.append($fieldset_pd);
	// Append the roles manager box
	$invite_container.roles_manager_box();
	$btn_row.append($send_btn);
	$super_row.append($invite_container);
	$super_row.append($btn_row);
	$invite_div.html($super_row);
	$invite_div.append("<br /><br />");

	$.activate_roles_manager_box();
	$("#loader").hide();
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
 * Invite an user
 * @param  string 		user_id 		The user id to append the request
 * @param  function 		callback 		The function to execute when the request succeed
 */
$.invite_user = function(user_id, callback) {
	if($.trim($("#new_user_full_name").val()) === "") {
		$("#new_user_full_name").closest(".form-group").addClass("has-error");
		$("#new_user_full_name").focus();
	} else if($.trim($("#new_user_work_title").val()) === "") {
		$("#new_user_full_name").closest(".form-group").removeClass("has-error");

		$("#new_user_work_title").closest(".form-group").addClass("has-error");
		$("#new_user_work_title").focus();
	} else if($.trim($("#new_user_mail_address").val()) === "") {
		$("#new_user_full_name").closest(".form-group").removeClass("has-error");
		$("#new_user_work_title").closest(".form-group").removeClass("has-error");

		$("#new_user_mail_address").closest(".form-group").addClass("has-error");
		$("#new_user_mail_address").focus();
	} else {
		$("#loader").show();
		$("#new_user_full_name").closest(".form-group").removeClass("has-error");
		$("#new_user_work_title").closest(".form-group").removeClass("has-error");
		$("#new_user_mail_address").closest(".form-group").removeClass("has-error");

		var k = {};
		k[kAPI_REQUEST_USER] = (user_id === null || user_id === undefined || user_id === "") ? $.get_manager_id() : user_id;
		k[kTAG_NAME] = $.trim($("#new_user_full_name").val());
		k[kTAG_AUTHORITY] = "ITA046";
		k[kTAG_COLLECTION] = "pgrdiversity.bioversityinternational.org";
		k[kTAG_ENTITY_TITLE] = $.trim($("#new_user_work_title").val());
		k[kTAG_ENTITY_EMAIL] = $.trim($("#new_user_mail_address").val());
		k[kTAG_ROLES] = [];
		if($("#role-invite").is(":checked")) {
			k[kTAG_ROLES].push(kTYPE_ROLE_INVITE);
		} else {
			$.array_remove(k[kTAG_ROLES], kTYPE_ROLE_INVITE);
		}
		if($("#role-upload").is(":checked")) {
			k[kTAG_ROLES].push(kTYPE_ROLE_UPLOAD);
		} else {
			$.array_remove(k[kTAG_ROLES], kTYPE_ROLE_UPLOAD);
		}
		if($("#role-edit").is(":checked")) {
			k[kTAG_ROLES].push(kTYPE_ROLE_EDIT);
		} else {
			$.array_remove(k[kTAG_ROLES], kTYPE_ROLE_EDIT);
		}
		if($("#manage-users").is(":checked")) {
			k[kTAG_ROLES].push(kTYPE_ROLE_USERS);
		} else {
			$.array_remove(k[kTAG_ROLES], kTYPE_ROLE_USERS);
		}
		if($("#role-login").is(":checked")) {
			k[kTAG_ROLES].push(kTYPE_ROLE_LOGIN);
		} else {
			k[kTAG_ROLES] = [];
		}
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.user_data.invitations",
			data: k,
			type: "invite_user"
		}, function(response) {
			console.warn(response);
			if(typeof callback == "function") {
				$.each(response, function(id, ud) {
					// Log
					$.log_activity("Invited an user with id: " + $.get_user_id(ud));
				// 	storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
				// 	callback.call(this, ud);
				});
			}
			$("#loader").hide();
		});
	}
};

/**
* Delete an invitation
* @param  string 		invited_id 		The id of user invited
*/
$.delete_invitation = function(invited_id) {
	apprise(i18n[lang].messages.delete_invitation.message, {
		title: i18n[lang].messages.delete_invitation.title,
		icon: "warning",
		confirm: true,
		yesBtn: "Yes",
		noBtn: "No"
	}, function(r) {
		if(r) {
			// Log
			$.log_activity("Delete invitation for user " + invited_id);
			// I NEED THE SERVICE
		}
	});
};
