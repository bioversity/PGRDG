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


/*=======================================================================================
*	EDIT USER
*======================================================================================*/

$.load_user_data_in_form = function() {
	var user_data = storage.get("pgrdg_user_cache.user_data");
	var ud = {};
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
		ud[kTAG_VERSION][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "static";
		ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Invited on";
		ud[kTAG_VERSION][kAPI_PARAM_DATA] = user_data[kTAG_VERSION];

		ud[kTAG_VERSION][kAPI_RESULT_ENUM_LABEL] = "Subscribed on";
		ud[kTAG_RECORD_CREATED][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "static";
		ud[kTAG_RECORD_CREATED][kAPI_PARAM_DATA] = user_data[kTAG_RECORD_CREATED];

		ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "read";
		ud[kTAG_ENTITY_AFFILIATION][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_AFFILIATION];

		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_FNAME];

		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_FNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_FNAME];

		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_LNAME][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_LNAME];

		ud[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_NAME][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_NAME][kAPI_PARAM_DATA] = user_data[kTAG_NAME];

		ud[kTAG_CONN_CODE][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_CONN_CODE][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_CONN_CODE][kAPI_RESULT_ENUM_LABEL] = "Username";
		ud[kTAG_CONN_CODE][kAPI_PARAM_DATA] = user_data[kTAG_CONN_CODE];

		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "read_edit";
		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_INPUT_TYPE] = "email";
		ud[kTAG_ENTITY_EMAIL][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_EMAIL];

		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "edit";
		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_INPUT_TYPE] = "text";
		ud[kTAG_ENTITY_PHONE][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_PHONE];

		ud[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_TYPE] = "hide";
		ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA] = user_data[kTAG_ENTITY_ICON];
	});

	var $super_row = $('<div class="row">'),
	$picture_col = $('<div class="col-lg-2 pull-left">'),
	$form_col = $('<div class="col-lg-10 pull-right">'),
	$picture_img = $('<img>').attr({
		"src": "./common/media/img/admin/" + ((ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME] == undefined) ? "user_rand_images/" : "user_images/") + ud[kTAG_ENTITY_ICON][kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP],
		"alt": "me"
	}),
	$picture_div = $('<div id="picture">'),
	$static_data = $('<small class="help-block">');
	$picture_div.append($picture_img);
	$picture_col.append($picture_div);

	$.each(ud, function(k, v){
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
		$plus_btn = $('<button class="btn btn-default-grey" type="button">');

		$super_row.prepend($picture_col);
		switch(v[kAPI_PARAM_RESPONSE_FRMT_TYPE]) {
			case "static":
				var $dl = $('<dl>'),
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
					$span.text(
						(v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""))
					);
					var $ul = $('<ul class="list-unstyled">');
					$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
						if($.is_obj(vv) || $.is_array(vv)) {
							$.each(vv, function(kkk, vvv) {
								$.each(vv, function(kkk, vvv) {
									d = $.linkify(vv[kkk], kkk);
								})
							});
							$ul.append('<li>' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + d + '</li>');
						} else {
							$ul.html('<li><i>none</i></li>');
						}
					});
					$span_col.html($ul);

					$form_group.append($span);
					$form_group.append($span_col);
				} else {
					$span.text(
						(v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""))
					);
					$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$form_group.append($span);
					$form_group.append($span_col);
				}

				$form_col.append($form_group);
				$super_row.append($form_col);
				break;

			case "read_edit":
				var d = "";
				if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
					$label.attr("for", "user_name");
					$label.text((v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME]));
					$form_group.append($label);

					$.each(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP], function(kk, vv) {
						$.each(vv, function(kkk, vvv) {
							$.each(vv, function(kkk, vvv) {
								$.each(vv, function(kkk, vvv) {
									d = vv[kkk];
								})
							});
						})
						$span_col0.attr("class", "col-sm-9 col-xs-12").append('<span class="help-block">' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + ": " + $.linkify(d) + '</span>');
					});
					// DEVE ESSERE UN CICLO
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
					$span_col.attr("class", "col-sm-2 col-xs-5").append($input);
					$span_col2.attr("class", "col-sm-3 col-xs-6 row");
					$plus_btn.addClass("add_" + v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_TYPE]).html('<span class="fa fa-plus">');
					$input_group_btn.append($plus_btn);
					$input_group.append($input2);
					$input_group.append($input_group_btn);
					$input_col.append($span_col);
					$input_col.append($span_col2);
					$span_col2.append($input_group);
					$form_group.append($span_col0).append($label_empty).append($span_col).append($span_col2);
					$form_col.append('<hr />');
				} else {
					$span.text(
						(v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Record ", ""))
					);
					$span_col.text($.right_date(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]));

					$form_group.append($span);
					$form_group.append($span_col);
				}

				$form_col.append($form_group);
				$super_row.append($form_col);
				break;
			case "edit":
				$label.addClass("col-xs-12").attr("for", "user_name");
				$label.text((v[kAPI_RESULT_ENUM_LABEL] !== undefined) ? v[kAPI_RESULT_ENUM_LABEL] : $.ucfirst(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME].replace("Entity ", "")));
				$form_group.append($label);

				if($.is_obj(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]) || $.is_array(v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP])) {
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
					$span_col.attr("class", "col-sm-2 col-xs-5").append($input);
					$span_col2.attr("class", "col-sm-3 col-xs-6 row");
					$plus_btn.addClass("add_" + v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_TYPE]).html('<span class="fa fa-plus">');
					$input_group_btn.append($plus_btn);
					$input_group.append($input2);
					$input_group.append($input_group_btn);
					$input_col.append($span_col);
					$input_col.append($span_col2);
					$span_col2.append($input_group);
					$form_group.append($span_col).append($span_col2);
					$form_col.append('<hr />');
				} else {
					$input.attr({
						"type": (v[kAPI_PARAM_INPUT_TYPE] != undefined) ? v[kAPI_PARAM_INPUT_TYPE] : "text",
						"class": "form-control",
						"id": "user_name",
						"name": "user_name",
						"placeholder": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_NAME],
						"value": v[kAPI_PARAM_DATA][kAPI_PARAM_RESPONSE_FRMT_DISP]
					});
					$input_col.attr("class", "col-sm-3 col-xs-12").append($input);
					$form_group.append($input_col);
				}

				$form_col.append($form_group);
				$super_row.append($form_col);
				break;
		}
		console.log(k, v);
	});
	// $super_row.append($form_col);
	$("#personal_data").append($super_row);

	$("#loader").hide();
};

/*======================================================================================*/

$(document).ready(function() {
	if(current_path == "Profile") {
		$("#loader").show();
		$.load_user_data_in_form();
	}
});
