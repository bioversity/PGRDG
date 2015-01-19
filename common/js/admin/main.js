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
$.require_password = function(callback) {
	var s = storage.get("pgrdg_user_cache.user_data"),
	username = s[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_DISP];
	apprise(i18n[lang].messages.insert_password.message, {
		title: i18n[lang].messages.insert_password.title,
		icon: "fa-lock",
		titleClass: "text-warning",
		input: true,
		input_type: "password"
	}, function(r) {
		if(r) {
			$("#loader").show();
			var data = {
				"username": username,
				"password": $.sha1(r),
			};
			$.cryptAjax({
				url: "API/",
				dataType: "json",
				crossDomain: true,
				type: "POST",
				timeout: 30000,
				data: {
					jCryption: $.jCryption.encrypt(jQuery.param(data), password),
					type: "login"
				},
				success: function(response) {
					$.log_activity("confirmed identity");
					$("#loader").hide();
					if($.obj_len(response) > 0) {
						if (typeof callback == "function") {
							callback.call(true);
						}
					} else {
						return false;
					}
				}
			});
		} else {
			return false;
		}
	});
}

/**
 * Calculate the storage occupied space and fill a panel with percentege
 * @param string 	label  		The label for percentage row
 * @param string 	storage		The storage to evaluate
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

$.fn.load_user_data = function(user_id) {
	var $item = $(this);

	if(user_id === undefined) {
		if($.storage_exists("pgrdg_user_cache.user_data")) {
			var ud = storage.get("pgrdg_user_cache.user_data");

			$.each(ud, function(user_id, user_data) {
				var $super_row = $('<div class="row">'),
				$picture_col = $('<div class="col-xs-12 col-sm-3 col-md-4 col-lg-2 pull-left">'),
				$form_col = $('<div class="col-xs-12 col-sm-9 col-md-8 col-lg-10 pull-right">'),
				$user_data_row = $('<h1 class="row">'),
				$user_data = $('<div class="col-xs-10 col-sm-7 col-sm-8 col-lg-8 pull-left">'),
				$user_data_right_btns = $('<div class="col-xs-2 col-sm-5 col-lg-4 pull-right">'),
				$title = $('<span class="text-left">'),
				$edit_profile_btn = $('<a>').attr({
					"class": "btn btn-default-white pull-right",
					"href": "./Profile#Edit",
					"title": i18n[lang].interface.btns.edit_profile,
					"data-toggle": "tooltip",
					"data-placement": "right"
				}).html('<span class="hidden-xs">' + i18n[lang].interface.btns.edit_profile + '&nbsp;</span><span class="fa fa-edit"></span>'),
				$picture_ex_upload_btn = $('<span>'),
				$picture_img = $('<img>').attr({
					"src": "./common/media/img/admin/" + ((user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_NAME] == undefined) ? "user_rand_images/" : "user_images/") + user_data[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_DISP],
					"alt": "me"
				}),
				$picture_div = $('<div id="picture">'),
				$static_data = $('<small class="help-block hidden-xs hidden-sm hidden-md">');
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
				$title.text(user_data[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP])
				// $user_data.append($title);
				$user_data_row.append($title);
				$user_data_row.append($edit_profile_btn);
				// $user_data_row.append($user_data_right_btns);
				$form_col.append($user_data_row);
				$super_row.append($form_col),
				$managed_scroller = $('<div id="managed_scroller">'),
				$invite_user_btn = $('<a>').attr({
					"href": "javascript:void(0);"
				}).text(i18n[lang].interface.btns.invite_an_user);

				// Place all in the section
				$item.addClass("container-fluid").html($super_row);

				/**
				 * Managed users display
				 */
				user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_DISP] = 5;
				if(parseInt(user_data[kTAG_MANAGED_COUNT][kAPI_PARAM_RESPONSE_FRMT_DISP]) == 0) {
					$managed_scroller.html('<p>' + i18n[lang].messages.no_active_users_yet + '</p>');
					/**
					 * Invite users button
					 */
					if($.inArray(kTYPE_ROLE_INVITE, user_data[kTAG_ROLES][kAPI_PARAM_RESPONSE_FRMT_VALUE]) > -1) {
						$managed_scroller.append('<br />')
						$managed_scroller.append($invite_user_btn);
					}
				} else {
					// for()
					// Load users pictures
				}
				if($("#managed_scroller").length === 0) {
					$managed_scroller.insertAfter($item);
				}

				$("#loader").hide();
			});
		}
	}
}

/*=======================================================================================
*	EDIT USER
*======================================================================================*/

/**
 * Generate form for manage user data
 */
$.fn.load_user_data_in_form = function() {
	var user_data = storage.get("pgrdg_user_cache.user_data");
	var ud = {},
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
		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_FNAME];

		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA_TYPE] = "edit";
		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_LNAME];

		ud[kTAG_NAME][kAPI_RESULT_ENUM_LABEL] = "Full name";
		ud[kTAG_NAME][kAPI_PARAM_DATA_TYPE] = "edit";
		ud[kTAG_NAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_NAME][kAPI_PARAM_DATA] = user_data[kTAG_NAME];

		ud[kTAG_CONN_CODE][kAPI_PARAM_DATA_TYPE] = "edit";
		ud[kTAG_CONN_CODE][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_CONN_CODE][kAPI_RESULT_ENUM_LABEL] = "Username";
		ud[kTAG_CONN_CODE][kAPI_PARAM_DATA] = user_data[kTAG_CONN_CODE];

		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA_TYPE] = "read_edit";
		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_INPUT_TYPE] = "email";
		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_EMAIL];

		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA_TYPE] = "edit";
		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_PHONE];

		ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA_TYPE] = "hide";
		ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_ICON];
	});

	var $super_row = $('<div class="row">'),
	$picture_col = $('<div class="col-xs-12 col-sm-4 col-lg-2 pull-left" id="picture_container">'),
	$form_col = $('<div class="col-xs-12 col-sm-8 col-lg-10 pull-right" id="user_data_container">'),
	$picture_shade = $('<div>'),
	$picture_shade_content = $('<span class="fa fa-pencil"></span>'),
	$picture_upload_btn = $('<a id="upload_btn" href="javascript:void(0);">'),
	$picture_upload_btn_input = $('<input style="display: none;" type="file" multiple="" class="upload_btn_input" href="javascript:void(0);">'),
	$picture_img = $('<img>').attr({
		"src": "./common/media/img/admin/" + ((ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME] == undefined) ? "user_rand_images/" : "user_images/") + ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP],
		"alt": "me"
	}),
	$picture_div = $('<div id="picture">'),
	$static_data = $('<small class="help-block">');
	$picture_shade.append($picture_shade_content);
	$picture_upload_btn.append($picture_shade);
	$picture_upload_btn.append($picture_img);
	$picture_div.append($picture_upload_btn);
	$picture_div.append($picture_upload_btn_input);
	$picture_col.append($picture_div);
	$(this).html("");

	$.each(ud, function(k, v){
		i++;
		var $row = $('<div class="row">'),
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
		$plus_btn = $('<a href="javascript:void(0);" class="btn btn-default-white">'),
		$submit = $('<a href="javascript:void(0);" onclick="$.save_user_data();" class="btn btn-default pull-right">' + i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span></a>');

		$super_row.prepend($picture_col);
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
				var d = "";
				if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
					var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
					$span.text(span_label);

					var $ul = $('<ul class="list-unstyled">');
					$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
						if($.is_obj(vv) || $.is_array(vv)) {
							$.each(vv, function(kkk, vvv) {
								$.each(vv, function(kkk, vvv) {
									d = $.linkify(vv[kkk]);
								})
							});
							$ul.append('<li>' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + d + '</li>');
						} else {
							$ul.html('<li><i>none</i></li>');
						}
					});
					$span_col.html($ul);

					$row.addClass($.md5(span_label));
					$row.append($span);
					$row.append($span_col);
					$form_group.append($row);
				} else {
					var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
					$span.text(span_label);
					$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$row.addClass($.md5(span_label));
					$form_group.append($span);
					$form_group.append($span_col);
				}

				$form_col.append($form_group);
				$super_row.append($form_col);
				break;
			case "read_edit":
				var d = "";
				if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
					var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME]);
					$label.attr("for", "user_name");
					$label.text(span_label);
					$row.append($label);

					$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
						$.each(vv, function(kkk, vvv) {
							$.each(vv, function(kkk, vvv) {
								d = vv[kAPI_PARAM_RESPONSE_FRMT_DISP]
							});
						})
						$span_col0.attr("class", "col-sm-9 col-xs-12").append('<span class="help-block">' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + $.linkify(d) + '</span>');
					});
					// MUST BE A CYCLE
					$input.attr({
						"type": "text",
						"class": "form-control",
						"id": "user_name",
						"name": "user_name",
						"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
						"value": ""
					});
					$input2.attr({
						"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
						"class": "form-control",
						"id": "user_name",
						"name": "user_name",
						"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
						"value": ""
					});
					console.log(v[kAPI_PARAM_DATA]);
					$row.addClass($.md5(span_label));
					$span_col.attr("class", "col-sm-2 col-xs-6 col-sm-offset-3").append($input);
					$span_col2.attr("class", "col-sm-3 col-xs-6 row");
					$plus_btn.addClass("add_typed").html('<span class="fa fa-plus text-center">');
					$input_group_btn.append($plus_btn);
					$input_group.append($input2);
					$input_group.append($input_group_btn);
					$input_col.append($span_col);
					$input_col.append($span_col2);
					$span_col2.append($input_group);
					$row.append($span_col0).append($span_col).append($span_col2);
					$form_group.append($row);
					// $form_col.append('<hr />');
				} else {
					var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""));
					$span.text(span_label);
					$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$row.addClass($.md5(span_label));
					$form_group.append($span);
					$form_group.append($span_col);
				}
				$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
				$form_col.append($form_group);
				$super_row.append($form_col);
				break;
			case "edit":
				var span_label = (v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", ""));
				$label.addClass("col-xs-12").attr("for", "user_name");
				$label.text(span_label);

				if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
					$row.append($label);
					$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
						if($.is_obj(vv) || $.is_array(vv)) {
							$.each(vv, function(kkk, vvv) {
								$input.attr({
									"type": "text",
									"class": "form-control",
									"id": "user_name",
									"name": "user_name",
									"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
									"value": vv[kAPI_PARAM_RESPONSE_FRMT_NAME]
								});
								$input2.attr({
									"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
									"class": "form-control",
									"id": "user_name",
									"name": "user_name",
									"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
									"value": vv[kkk]
								});
							});
						}
					});
					$span_col.attr("class", "col-sm-2 col-xs-6").append($input);
					$span_col2.attr("class", "col-sm-3 col-xs-6 row");
					$plus_btn.addClass("add_typed").html('<span class="fa fa-plus text-center">');
					$input_group_btn.append($plus_btn);
					$input_group.append($input2);
					$input_group.append($input_group_btn);
					$input_col.append($span_col);
					$input_col.append($span_col2);
					$span_col2.append($input_group);
					$row.append($span_col).append($span_col2);
					$form_group.append($row);
					// $form_col.append('<hr />');
				} else {
					$row.append($label);
					$input.attr({
						"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
						"class": "form-control",
						"id": "user_name",
						"name": "user_name",
						"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
						"value": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]
					});
					$input_col.attr("class", "col-sm-3 col-xs-12").append($input);
					$row.append($input_col);
				}

				$row.addClass($.md5(span_label));
				$form_group.addClass(v[kAPI_PARAM_DATA_TYPE] + "_item");
				$form_group.append($row);
				$form_col.append($form_group);
				$super_row.append($form_col);

				break;
		}

		if(i === $.obj_len(ud)) {
			$span_col.attr("class", "col-xs-12 col-sm-8 col-md-8 col-lg-8 row").append($submit);
			$row.append($span_col).append($span_col);
			$form_group.append($row);
			$form_col.append($form_group);
			$super_row.append($form_col);
		}
		// console.log(k, v);
	});
	// $super_row.append($form_col);
	$(this).html($super_row);

	$("#loader").hide();
	$("a.add_typed").on("click", function() {
		var $item = $(this).closest(".form-group"),
		form_group_type = $.trim($item.attr("class").replace("form-group", "")),
		cont = 0,

		$row = $('<div class="row">'),
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
		$plus_btn = $('<a href="javascript:void(0);" class="btn btn-default-white">');
		$span_col.attr("class", "col-sm-2 col-xs-5");
		$span_col2.attr("class", "col-sm-3 col-xs-6 row");

		$.each($item.find(".row:not(.col-xs-6) input"), function(i) {
			if($(this).val().length == 0) {
				cont++;
				$(this).focus();
				return false;
			}
		});
		if(cont == 0) {
			$input.attr({
				"type": "text",
				"class": "form-control",
				"id": "user_name",
				"name": "user_name",
				"placeholder": "Description text",
				"value": ""
			});
			$input2.attr({
				"type": "text",
				"class": "form-control",
				"id": "user_name",
				"name": "user_name",
				"placeholder": "Value",
				"value": ""
			});
			$span_col.append($input);
			$span_col2.append($input2);
			$row.append($label_empty).append($span_col).append($span_col2);
			$item.append('<br />').append($row);
			$row.find("input[value='']:not(:checkbox,:button):visible:first").focus();
			return false;
		}
	});
};

/**
 * Save the user data
 */
$.save_user_data = function() {
	$.require_password(function() {
		// $.log_activity("edit personal data");
		alert("ok");
	});
};

$.log_activity = function(action){
	var st = storage.get("pgrdg_user_cache.user_activity"),
	log = {};
	log[action] = $.now();
	st.push(log);

	storage.set("pgrdg_user_cache.user_activity", st);
	$("span.timeago").timeago();
}

/**
 * Load the last activity saved in log storage
 * @param  bool 	 	full 			If false or unset display only the date in "Y/m/d H:i:s" format
 * @return string		        Last logged activity
 */
$.last_activity = function(full) {
	full = (full === undefined) ? false : full,
	last_activity = "";

	if($.storage_exists("pgrdg_user_cache.user_activity")) {
		var last_activity = storage.get("pgrdg_user_cache.user_activity"),
		l = last_activity[last_activity.length-1];
		$.each(l, function(label, time) {
			if(full) {
				last_activity = $.ucfirst(label) + ": " + time;
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
 * Load profile form or interface depending on the hash
 */
$.load_profile = function() {
	if(document.location.hash !== undefined && document.location.hash == "#Edit") {
		alert("ok")
		$("#personal_data").load_user_data_in_form();
	} else {
		$("#personal_data").load_user_data();
	}
}
/*======================================================================================*/

$(document).ready(function() {
	if(current_path == "Profile") {
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


		$("#loader").show();
		$.load_profile();
		window.onhashchange = function() {
			$.load_profile();
		}

		$("span.timeago").attr("title", $.last_activity()).text($.last_activity(true)).timeago();

		$.add_storage_space_in_panel("Non-logged memory", "pgrdg_cache");
		$.add_storage_space_in_panel("User memory", "pgrdg_user_cache");

		$("#upload_btn").hover(function() {
			// console.log("hover");
			$("#upload_btn div").css("visibility", "visible");
		}, function() {
			// console.log("unhover");
			$("#upload_btn div").css("visibility", "hidden");
		});//.on("click", function() {
		// 	$("#upload_btn_input").trigger("click");
		// 	console.log("triggered");
		// }).fileupload({
		// 	url: url,
		// 	dataType: "json",
		// 	autoUpload: true,
		// 	acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		// 	maxFileSize: 3000000, // 3 MB
		// 	// Enable image resizing, except for Android and Opera,
		// 	// which actually support image resizing, but fail to
		// 	// send Blob objects via XHR requests:
		// 	disableImageResize: /Android(?!.*Chrome)|Opera/
		// 	.test(window.navigator.userAgent),
		// 	previewMaxWidth: 180,
		// 	previewMaxHeight: 180,
		// 	previewCrop: true,
		// 	add: function (e, data) {
		// 		data.context = $('<button/>').text('Upload')
		// 		.appendTo(document.body)
		// 		.click(function () {
		// 			data.context = $('<p/>').text('Uploading...').replaceAll($(this));
		// 			data.submit();
		// 		});
		// 	},
		// 	done: function (e, data) {
		// 		data.context.text('Upload finished.');
		// 	}
		// });
	}
});
