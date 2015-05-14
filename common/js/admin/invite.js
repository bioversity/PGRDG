/*jshint scripturl:true*/
/*jshint -W030 */

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
	/**
	 * Check if the inserted email address is valid
	 * @return bool
	 */
	$.fn.check_valid_email = function() {
		var $field = $(this),
		$form_group = $field.closest(".form-group"),
		$checker = $form_group.find("p.checker"),
		$checker_icon = $checker.find("span.fa"),
		email_address = $field.val(),
		regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		if($.trim(email_address).length > 5) {
			$checker_icon.addClass("fa-refresh fa-spin text-muted");
			$form_group.removeClass("has-error");
			$checker.removeClass("hidden");
			if(regex.test(email_address)) {
				$checker_icon.removeClass("fa-times text-danger");
				$checker_icon.removeClass("fa-refresh fa-spin text-muted").addClass("fa-check text-success");
				$form_group.addClass("has-success");
				$("#invite_btn").removeClass("disabled");
			} else {
				$checker_icon.removeClass("fa-refresh fa-spin text-muted").addClass("fa-times text-danger");
				$form_group.addClass("has-error");
				$("#invite_btn").addClass("disabled");
			}
		} else {
			$checker_icon.removeClass("fa-refresh fa-spin text-muted").addClass("fa-times text-danger");
			$form_group.addClass("has-error");
			$("#invite_btn").addClass("disabled");
		}

	};
	/**
	 * Check if an input field is empty
	 * @return bool
	 */
	$.fn.check_empty = function() {
		var $field = $(this),
		$form_group = $field.closest(".form-group"),
		$checker = $form_group.find("p.checker"),
		$checker_icon = $checker.find("span.fa"),
		field_value = $field.val();

		$checker_icon.addClass("fa-refresh fa-spin text-muted");
		$form_group.removeClass("has-error");
		$checker.removeClass("hidden");
		if($.trim(field_value).length > 0) {
			$checker_icon.removeClass("fa-times text-danger");
			$checker_icon.removeClass("fa-refresh fa-spin text-muted").addClass("fa-check text-success");
			$form_group.addClass("has-success");
			// $("#invite_btn").removeClass("disabled");
		} else {
			$checker_icon.removeClass("fa-refresh fa-spin text-muted").addClass("fa-times text-danger");
			$form_group.addClass("has-error");
			// $("#invite_btn").addClass("disabled");
		}
		$.check_all_empty();
	};

	$.check_all_empty = function() {
		var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		empty = [];
		$.each($("#user_personal_data input"), function() {
			if($.trim($(this).val()).length > 0) {
				if($(this).attr("id") == "new_user_mail_address") {
					if($.trim($(this).val()).length > 5 && regex.test($(this).val())) {
						empty.push(false);
					} else {
						empty.push(true);
					}
				} else {
					empty.push(false);
				}
			} else {
				empty.push(true);
			}
		});
		if($.inArray(true, empty) !== -1) {
			$("#invite_btn").addClass("disabled");
		} else {
			$("#invite_btn").removeClass("disabled");
		}
	};

	var $invite_div = ($("#invite_user").length > 0) ? $("#invite_user") : $('<div id="invite_user">'),
	$super_row = $('<div class="row">'),
	$btn_row = $('<div class="col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2">'),
	$send_btn = $('<a>').attr({
		"href": "javascript:void(0);",
		"id": "invite_btn",
		"onclick": "$.invite_user();",
		"class": "btn btn-default pull-right disabled"
	}).html(i18n[lang].interface.btns.invite + ' <span class="fa fa-angle-right"></span>'),
	$invite_container = $('<div id="invite_container">').addClass("col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2 well form"),
	$fieldset_pd = $('<fieldset id="user_personal_data">'),
	$legend_pd = $('<legend>').text("User personal data"),
	personal_data_form = [
		{
			"text": i18n[lang].interface.forms.full_name,
			"iput-type": "text",
			"id": "new_user_full_name",
			"placeholder": i18n[lang].interface.forms.full_name,
			"check": "empty",
			"separated": false
		},{
			"text": i18n[lang].interface.forms.work_title,
			"iput-type": "text",
			"id": "new_user_work_title",
			"placeholder": i18n[lang].interface.forms.work_title,
			"check": "empty",
			"separated": false
		},{
			"text": i18n[lang].interface.forms.email_address,
			"iput-type": "email",
			"id": "new_user_mail_address",
			"placeholder": i18n[lang].interface.forms.email_address,
			"check": "email",
			"separated": true
		}
	];
	$fieldset_pd.append($legend_pd);
	$.each(personal_data_form, function(k, v) {
		var $form_group = $('<div class="form-group">'),
		$row = $('<div class="row">'),
		$label = $('<label>').addClass("control-label col-sm-3 control-label col-xs-12").attr("for", v.id).text(v.text),
		$form_col = $('<div class="col-sm-9 col-xs-12 row">'),
		$checker_col = $('<div class="col-xs-1">'),
		$p_checker = $('<p class="checker form-control-static hidden">'),
		$span_icon = $('<span class="fa fa-refresh fa-spin text-muted fa-1_5x">'),
		$field = $('<input>').attr({
			"type": v["iput-type"],
			"name": v.id,
			"id": v.id,
			"placeholder": v.placeholder,
			"value": ""
		}).addClass("form-control");
		if(v.check !== "") {
			$field.on("keyup blur", function() {
				if(v.check == "email") {
					$(this).check_valid_email();
				} else {
					$(this).check_empty();
				}
			});
		}

		$p_checker.append($span_icon);
		$checker_col.append($p_checker);
		if(v.check !== "") {
			$form_col.removeClass("col-sm-9 col-xs-12").addClass("col-sm-8 col-xs-11");
		}
		$form_col.append($field);
		$row.append($label);
		$row.append($form_col);
		if(v.check !== "") {
			$row.append($checker_col);
		}
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

	$.activate_roles_manager_box();
	$("#loader").hide();
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
		k[kTAG_ROLES].push(kTYPE_ROLE_LOGIN);

		$.require_password(function() {
			$("#loader").show();
			$.ask_cyphered_to_service({
				storage_group: "pgrdg_user_cache.user_data.invitations",
				data: k,
				dataType: "text",
				timeout: 15000,
				type: "invite_user"
			}, function(response) {
				$("#loader").hide();
				if(response == "The user already exists") {
					apprise(i18n[lang].messages.the_user_already_exists.message, {
						title: i18n[lang].messages.the_user_already_exists.title,
						titleClass: "text-danger",
						icon: "fa-times"
					}, function(r) {
						$("#new_user_mail_address").focus();
					});
					return false;
				}
			});

			// Log
			$.log_activity("Invited the user " + $("#new_user_full_name").val());
			apprise(i18n[lang].messages.user_invited.message.replace("{X}", $("#new_user_full_name").val()), {
				title: i18n[lang].messages.user_invited.title,
				icon: "success"
			}, function(r) {
				if(r) {
					document.location.reload();
				}
			});
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
