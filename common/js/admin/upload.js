/**
* Upload functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/


/**
 * Get the total of records
 * @param  object 			session 				The session object
 * @return int         								The number of total records
 */
$.get_records = function(session) { return session[kTAG_COUNTER_RECORDS][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Get the total of processed items
 * @param  object 			session 				The session object
 * @return int         								The number of total processed items
 */
$.get_processed = function(session) { return session[kTAG_COUNTER_PROCESSED][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Get the total of validated items
 * @param  object 			session 				The session object
 * @return int         								The number of total validated items
 */
$.get_validated = function(session) { return session[kTAG_COUNTER_VALIDATED][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Get the total of skipped items
 * @param  object 			session 				The session object
 * @return int         								The number of total skipped items
 */
$.get_skipped = function(session) { return session[kTAG_COUNTER_SKIPPED][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Get the total of rejected items
 * @param  object 			session 				The session object
 * @return int         								The number of total rejected items
 */
$.get_rejected = function(session) { return session[kTAG_COUNTER_REJECTED][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Get the records object name
 * @param  object 			session 				The session object
 * @return int         								The number of total records
 */
$.get_records_name = function(session) { return session[kTAG_COUNTER_RECORDS][kAPI_PARAM_RESPONSE_FRMT_NAME]; };

/**
 * Get the object name of the total processed items
 * @param  object 			session 				The session object
 * @return int         								The number of total processed items
 */
$.get_processed_name = function(session) { return session[kTAG_COUNTER_PROCESSED][kAPI_PARAM_RESPONSE_FRMT_NAME]; };

/**
 * Get the object name of the total validated items
 * @param  object 			session 				The session object
 * @return int         								The number of total validated items
 */
$.get_validated_name = function(session) { return session[kTAG_COUNTER_VALIDATED][kAPI_PARAM_RESPONSE_FRMT_NAME]; };

/**
 * Get the object name of the total skipped items
 * @param  object 			session 				The session object
 * @return int         								The number of total skipped items
 */
$.get_skipped_name = function(session) { return session[kTAG_COUNTER_SKIPPED][kAPI_PARAM_RESPONSE_FRMT_NAME]; };

/**
 * Get the object name of the total rejected items
 * @param  object 			session 				The session object
 * @return int         								The number of total rejected items
 */
$.get_rejected_name = function(session) { return session[kTAG_COUNTER_REJECTED][kAPI_PARAM_RESPONSE_FRMT_NAME]; };

/**
 * Get the current progress value
 * @param  object 			session 				The session object
 * @return int  		        					The number of the current progress
 */
$.get_progress = function(session) { return session[kTAG_COUNTER_PROGRESS][kAPI_PARAM_RESPONSE_FRMT_VALUE]; };

/**
 * Check if current session has validated items
 * @param  object  			session             			The session object
 * @return bool
 */
$.has_validated = function(session) { return ($.get_validated(session) > 0) ? true : false; };

/**
 * Check if current session has skipped items
 * @param  object  			session             			The session object
 * @return bool
 */
$.has_skipped = function(session) { return ($.get_skipped(session) > 0) ? true : false; };

/**
 * Check if current session has rejected items
 * @param  object  			session             			The session object
 * @return bool
 */
$.has_rejected = function(session) { return ($.get_rejected(session) > 0) ? true : false; };

/**
 * Activate dropzone js and allow button to open file browser dialog
 * @param  string 			session_id 				The id of the session
 */
$.fn.update_btn = function(session_id) {
	$(this).dropzone({
		autoDiscover: false,
		sendingmultiple: false,
		acceptedFiles: ".xls,.xlsx,.ods",
		autoProcessQueue: true,
		clickable: "#update_btn",
		dictDefaultMessage: '<span class=\"fa fa-cloud-upload fa-5x text-muted\"></span><br /><br />Drop file here to upload',
		init: function() {
			this.on("processing", function(file) {
				var extension = file.name.split(".").pop().toLowerCase(),
				filename = $.trim($.clean_file_name(file.name.replace(extension, ""))) + "." + extension;
				this.options.url = "/API/?upload=" + filename;
			});
		},
		addedfile: function() {
			$("#upload").added_file();
		},
		uploadprogress: function(file, progress) {
			$.set_progress_bar(progress);
		},
		success: function(file, status){
			var extension = file.name.split(".").pop().toLowerCase(),
			filename = $.trim($.clean_file_name(file.name.replace(extension, ""))) + "." + extension,
			file_path = "/var/www/pgrdg/" + config.service.path.gpg + $.get_current_user_id() + "/uploads/" + filename;

			$.set_progress_bar("pending");
			$.inform_upload_was_done(file_path, function(session_id) {
				$.build_interface(session_id);
			});
		}
	});
};

/**
 * Ask the Service for the user upload status
 */
$.upload_user_status = function(callback) {
	var data = {};
	data[kAPI_REQUEST_USER] = $.get_current_user_id(),
	$.ask_cyphered_to_service({
		data: data,
		type: "upload_user_status",
		force_renew: true
	}, function(response) {
		// var session_id = response["session-id"];
		if (typeof callback == "function") {
			callback.call(this, response);
		}
	});
};

/**
 * Prepare the interface to display all scrollbars
 */
$.fn.added_file = function() {
	var $item = $(this),
	progress = 0,
	$h1 = $('<h1>').text("Template upload"),
	$info_row = $('<div class="row">'),
	$left_col = $('<div class="col-xs-6 col-sm-7 col-md-6 col-lg-10">'),
	$righ_col = $('<div class="col-xs-6 col-sm-5 col-md-4 col-lg-3 col-lg-2 text-right">'),
	$details_row = $('<div id="details_row" class="row hidden">'),

	$dl_left = $('<dl id="dl_left" class="dl-horizontal">'),
	$dl_right = $('<dl id="dl_right" class="dl-horizontal">'),
	// Creating progress bar
	$progress_supercontainer = $('<div id="progress_supercontainer">'),
	$progrtess_container_title = $('<h2>').text("Template upload"),
	$progress_container = $('<div id="progress_container" class="progress">'),
	$progress_bar = $('<div>').attr({
		"style": "width: 100%;",
		"aria-valuemax": "100",
		"aria-valuemin": "0",
		"aria-valuenow": "100",
		"role": "progressbar",
		"class": "progress-bar progress-bar-warning progress-bar-striped active",
		"id": "progress_bar"
	}).text("Processing file..."),
	// Creating detail link
	$detail_link_col = $('<div class="col-sm-12">'),
	$detail_col = $('<div id="transactions" class="col-sm-12 panel-collapse collapse in">'),
	$detail_link = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$(this).collapse_details();",
		"id": "details_btn"
	}).html('Details'),
	// Creating transaction container
	$transaction_content = $('<div class="panel-body">'),
	$detail_list_group = $('<div id="detail_list_group" class="list-group">');

	$detail_link_col.append('<span class="fa fa-fw fa-caret-down"></span> ').append($detail_link);
	// Progress bar
	$progress_container.append($progress_bar);
	$progress_supercontainer.append($progrtess_container_title);
	$progress_supercontainer.append($progress_container);
	$left_col.append($dl_left);
	$righ_col.append($dl_right);
	$info_row.append($left_col);
	$info_row.append($righ_col);
	$info_row.append($left_col);
	$info_row.append($righ_col);
	$transaction_content.append($detail_list_group);

	$detail_col.append($transaction_content);
	$details_row.append($detail_link_col);
	$details_row.append($detail_col);

	$item.html("");
	$item.append($h1).append($info_row).append($progress_supercontainer).append($details_row);
	$(".top_content_label").remove();
	$("#contents").removeClass("upload");
	$("#dropzone").remove();
};

/**
 * Set the progress bar
 * @param int|string			progress 				The progress status to set
 * @param string			class 				        The class of the scrollbar
 */
$.set_progress_bar = function(progress, progress_class) {
	if(progress_class === null || progress_class === undefined || progress_class === "") {
		progress_class = "progress-bar-info";
	}
	if(progress == "pending") {
		$("#progress_bar").attr("class", "progress-bar progress-bar-striped progress-bar-warning active").css("width", "100%").attr("aria-valuenow", 100).text("Processing file...");
	} else {
		$("#progress_bar").addClass("active").switchClass("progress-bar-warning", progress_class).css("width", progress + "%").attr("aria-valuenow", progress).text(progress + "%");
	}
};

/**
 * Inform the Service the upload was done
 * @param  string			file_path 				The full path of the file
 */
$.inform_upload_was_done = function(file_path, callback) {
	var data = {};
	data[kAPI_REQUEST_USER] = $.get_current_user_id(),
	data[kAPI_PARAM_FILE_PATH] = file_path;
	$.ask_cyphered_to_service({
		data: data,
		type: "upload_file"
	}, function(response) {
		console.warn(response);
		var session_id = response[kAPI_SESSION_ID];
		if (typeof callback == "function") {
			callback.call(this, session_id);
		}
	});
};

/**
 * Ask the Service and parse the upload transaction status
 * @param  string 			session_id 				The ID of the upload session
 */
$.get_session_status = function(session_id, callback) {
	var data = {};
	data[kAPI_REQUEST_USER] = $.get_current_user_id(),
	data[kAPI_PARAM_ID] = session_id;
	console.log("mmmh", data);
	$.ask_cyphered_to_service({
		data: data,
		type: "upload_session_status",
		force_renew: true
	}, function(response) {
		// Show the iteration status interface
		if (typeof callback == "function") {
			callback.call(this, response);
		}
		// callback.call(response);
	});
};

/**
 * Check transaction status and display result error
 * @param  object   	           	options  				An object with request options
 */
$.get_errors = function(options, callback) {
	var opt = $.extend({
		session_id: null,
		user_id: $.get_current_user_id()
	}, options);

	var data = {};
	data[kAPI_REQUEST_USER] = opt.user_id,
	data[kAPI_PARAM_ID] = opt.session_id;
	$.ask_cyphered_to_service({
		data: data,
		type: "upload_group_transaction",
		force_renew: true
	}, function(response) {
		if (typeof callback == "function") {
			callback.call(this, response);
		}
	});
};

/**
 * Check transaction status and display result error message
 * @param  object   	           	options  				An object with request options
 */
$.get_errors_message = function(options, callback) {
	var opt = $.extend({
		session_id: null,
		user_id: $.get_current_user_id(),
		status_type: null
	}, options);

	var data = {};
	data[kAPI_REQUEST_USER] = opt.user_id,
	data[kAPI_PARAM_ID] = opt.session_id,
	data[kAPI_RESPONSE_STATUS] = opt.status_type;
	console.warn(data);
	$.ask_cyphered_to_service({
		data: data,
		type: "upload_group_transaction_message",
		force_renew: true
	}, function(response) {
		if (typeof callback == "function") {
			callback.call(this, response);
		}
	});
};

/**
 * Toggle transactions progress visibility
 */
$.fn.collapse_details = function() {
	var $item = $(this);
	if(!$item.hasClass("disabled")) {
		$item.prev().toggleClass("fa-caret-right fa-caret-down");
		$("#transactions").collapse("toggle");
	}
};

/**
 * Build the progress bars
 * @param  string 			session_id 				The id of the current session
 */
$.build_interface = function(session_id) {
	var status = "",
	status_icon = "",
	status_string = "",
	status_string_class = "",
	current_status = "",
	current_status_class = "",
	current_status_icon = "";
	$.get_session_status(session_id, function(response) {
		var session = response[kAPI_SESSION];
		switch($.trim(session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
			case kTYPE_STATUS_FAILED:
			case kTYPE_STATUS_ERROR:
			case kTYPE_STATUS_FATAL:
			case kTYPE_STATUS_EXCEPTION:
				session_status_class = "progress-bar-danger";
				status_icon = "fa-times fa-1_5x";
				status_string_class = "text-danger";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "danger";
				break;
			case kTYPE_STATUS_EXECUTING:
				session_status_class = "progress-bar-info";
				status_icon = "fa-refresh fa-spin";
				status_string_class = "text-muted";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP] + "...";
				status = "";
				break;
			case kTYPE_STATUS_OK:
				session_status_class = "progress-bar-success";
				status_icon = "fa-check";
				status_string_class = "text-success";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "success";
				break;
			case kTYPE_STATUS_MESSAGE:
				session_status_class = "progress-bar-info";
				status_icon = "fa-info fa-1_5x";
				status_string_class = "text-info ";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "info";
				break;
			case kTYPE_STATUS_WARNING:
				session_status_class = "progress-bar-warning";
				status_icon = "fa-warning";
				status_string_class = "text-warning";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "warning";
				break;
		}
		$("#details_row").removeClass("hidden");
		/**
		 * General summary
		 */
		/**
		 * Left column
		 */
		// Start date
		var sud = new Date(session[kTAG_SESSION_START][kAPI_PARAM_RESPONSE_FRMT_VALUE].sec*1000),
		$dt_start = $("<dt>").text(session[kTAG_SESSION_START][kAPI_PARAM_RESPONSE_FRMT_NAME]),
		$dd_start = $('<dd>').text($.epoch2locale(sud));
		// End date
		var $dt_end = $("<dt>"),
		$dd_end = $('<dd>');
		if($.obj_len(session[kTAG_SESSION_END]) > 0) {
			var eud = new Date(session[kTAG_SESSION_END][kAPI_PARAM_RESPONSE_FRMT_VALUE].sec*1000);
			$dt_end.text(session[kTAG_SESSION_END][kAPI_PARAM_RESPONSE_FRMT_NAME]);
			$dd_end.text($.epoch2locale(eud));
		}
		// Status
		var $dt_status = $("<dt>").text(session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_NAME]);
		$dd_status = $('<dd>').html('<b class="' + status_string_class + '"><span class="fa ' + status_icon + '"></span> ' + status_string + '</b>');

		$("#dl_left").html($dt_start).append($dd_start);
		if($.obj_len(session[kTAG_SESSION_END]) > 0) {
			$("#dl_left").append($dt_end).append($dd_end);
		}
		$("#dl_left").append('<br />').append($dt_status).append($dd_status);

		/**
		 * Right column
		 */
		// Processed
		if($.obj_len(session[kTAG_COUNTER_PROCESSED]) > 0) {
			var $dt_processed = $('<dt class="text-muted">').text(i18n[lang].messages.upload.summary.total.replace("%", $.get_processed_name(session))),
			$dd_processed = $('<dd class="text-muted">').text($.get_processed(session));
			$("#dl_right").html($dt_processed).append($dd_processed);
		}
		// Validated
		if($.obj_len(session[kTAG_COUNTER_VALIDATED]) > 0) {
			$dt_validated = $('<dt class="text-success">').text(i18n[lang].messages.upload.summary.total.replace("%", $.get_validated_name(session))),
			$dd_validated = $('<dd class="text-success">').text($.get_validated(session));
			$("#dl_right").append($dt_validated).append($dd_validated);
		}
		// Rejected
		if($.obj_len(session[kTAG_COUNTER_REJECTED]) > 0) {
			$dt_rejected = $('<dt class="text-danger">').text(i18n[lang].messages.upload.summary.total.replace("%", $.get_rejected_name(session))),
			$dd_rejected = $('<dd class="text-danger">').text($.get_rejected(session));
			$("#dl_right").append($dt_rejected).append($dd_rejected);
		}
		// Skipped
		if($.obj_len(session[kTAG_COUNTER_SKIPPED]) > 0) {
			$dt_skipped = $('<dt class="text-warning">').text(i18n[lang].messages.upload.summary.total.replace("%", $.get_skipped_name(session))),
			$dd_skipped = $('<dd class="text-warning">').text($.get_skipped(session));
			$("#dl_right").append($dt_skipped).append($dd_skipped);
		}
		// Records
		if($.obj_len(session[kTAG_COUNTER_RECORDS]) > 0) {
			$dt_records = $('<dt class="total">').text(i18n[lang].messages.upload.summary.total.replace("%", $.get_records_name(session))),
			$dd_records = $('<dd class="total">').text($.get_records(session));
			$("#dl_right").append('<hr />').append($dt_records).append($dd_records);
		}

		// Progress bar
		var progress = ((session[kTAG_COUNTER_PROGRESS] !== undefined) ? parseInt(session[kTAG_COUNTER_PROGRESS][kAPI_PARAM_RESPONSE_FRMT_DISP]) : 100);
		$.set_progress_bar(progress, session_status_class);
		console.warn(response);
		$.each(session[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, transaction) {
			console.info(k, transaction);

			var current_progress = ((transaction[kTAG_COUNTER_PROGRESS] !== undefined) ? parseInt(transaction[kTAG_COUNTER_PROGRESS][kAPI_PARAM_RESPONSE_FRMT_DISP]) : 100),
			progress_bar_class = "",
			icon_size = "fa-2x";
			switch($.trim(transaction[kTAG_TRANSACTION_STATUS][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
				case kTYPE_STATUS_FAILED:
				case kTYPE_STATUS_ERROR:
				case kTYPE_STATUS_FATAL:
				case kTYPE_STATUS_EXCEPTION:
					current_status_class = "list-group-item-danger";
					current_status = "danger";
					current_status_icon = "fa-times";
					break;
				case kTYPE_STATUS_EXECUTING:
					current_status_class = "";
					// current_status = "";
					current_status_icon = "fa-refresh fa-spin text-muted";
					break;
				case kTYPE_STATUS_OK:
					current_status_class = "list-group-item-success";
					current_status = "success";
					current_status_icon = "fa-check";
					break;
				case kTYPE_STATUS_MESSAGE:
					current_status_class = "list-group-item-info";
					current_status = "info";
					current_status_icon = "fa-info";
					break;
				case kTYPE_STATUS_WARNING:
					current_status_class = "list-group-item-warning";
					current_status = "warning";
					current_status_icon = "fa-exclamation-triangle";
					break;
			}

			var $item;
			if($.obj_len(transaction[kTAG_COUNTER_SKIPPED]) > 0) {
				current_status_class = "list-group-item-warning";
				progress_bar_class = "progress-bar-warning";
				current_status_icon = "fa-exclamation-triangle";
				icon_size = "fa-1_5x";
			}
			if($.obj_len(transaction[kTAG_COUNTER_REJECTED]) > 0) {
				current_status_class = "list-group-item-danger";
				progress_bar_class = "progress-bar-danger";
				current_status_icon = "fa-times";
			}
			if($("#" + $.md5(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP])).length === 0) {
				// console.warn(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP], "no");
				$item = $('<div id="' + $.md5(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP]) + '">');
			} else {
				// console.warn(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP], "yes");
				$item = $("#" + $.md5(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP]));
			}
			$item.attr("class", "list-group-item" + ((current_status_class !== "") ? " " + current_status_class : ""));
			// Date
			var ssec = new Date(transaction[kTAG_TRANSACTION_START][kAPI_PARAM_RESPONSE_FRMT_VALUE].sec*1000),
			esec,
			processed = 0,
			processed_text = "",
			validated = 0,
			validated_text = "",
			rejected = 0,
			rejected_text = "",
			skipped = 0,
			skipped_text = "",
			records = 0,
			records_text = "";
			if($.obj_len(transaction[kTAG_TRANSACTION_END]) > 0) {
				esec = new Date(transaction[kTAG_TRANSACTION_END][kAPI_PARAM_RESPONSE_FRMT_VALUE].sec*1000);
			}
			if($.obj_len(transaction[kTAG_COUNTER_PROCESSED])) {
				processed = $.get_processed(transaction);
				processed_text = $.get_processed_name(transaction);
			}
			if($.obj_len(transaction[kTAG_COUNTER_VALIDATED])) {
				validated = $.get_validated(transaction);
				validated_text = $.get_validated_name(transaction);
			}
			if($.obj_len(transaction[kTAG_COUNTER_REJECTED])) {
				rejected = $.get_rejected(transaction);
				rejected_text = $.get_rejected_name(transaction);
			}
			if($.obj_len(transaction[kTAG_COUNTER_SKIPPED])) {
				skipped = $.get_skipped(transaction);
				skipped_text = $.get_skipped_name(transaction);
			}
			if($.obj_len(transaction[kTAG_COUNTER_RECORDS])) {
				records = $.get_records(transaction);
				records_text = $.get_records_name(transaction);
			}
			var progressbar_style = (current_progress >= 100) ? ((progress_bar_class !== "") ? progress_bar_class : "progress-bar-success") : ((status == "danger") ? "progress-bar-danger" : "progress-bar-info progress-bar-striped active");
			$item_row_container = $('<div>'),
			$item_row = $('<div class="row">'),
			$item_col1 = $('<div class="col-sm-1">'),
			$item_col2 = $('<div class="col-sm-4">'),
			$item_col2a = $('<div class="col-sm-2 text-right">'),
			$item_col2b = $('<div class="col-sm-2 text-right text-muted">'),
			$item_col3 = $('<div class="col-sm-3">'),
			$item_title = $('<h4 class="list-group-item-heading">').text(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP]),
			$item_processed = $('<p class="text-muted" title="' + i18n[lang].messages.upload.summary.processed + '">').html('<span class="fa fa-cogs"></span> ' + processed + " " + processed_text),
			$item_validated = $('<p class="text-success" title="' + i18n[lang].messages.upload.summary.validated + '">').html('<span class="fa fa-fw fa-check-circle-o"></span> ' + validated + " " + validated_text),
			$item_rejected = $('<p class="text-danger" title="' + i18n[lang].messages.upload.summary.rejected + '">').html('<span class="fa fa-fw fa-times-circle"></span> ' + rejected + " " + rejected_text),
			$item_skipped = $('<p class="text-warning" title="' + i18n[lang].messages.upload.summary.skipped + '">').html('<span class="fa fa-fw fa-exclamation-circle"></span> ' + skipped + " " + skipped_text),
			$item_records = $('<p class="total" title="' + i18n[lang].messages.upload.summary.records + '">').html('<span class="fa fa-fw fa-list-alt"></span> ' + records + " " + records_text),
			$item_status = $('<small>'),
			$item_time_data = $('<small>').html('<span title="Start date"><span class="fa fa-clock-o"></span> ' + $.epoch2locale(ssec) + "</span><br />");
			// return false;

			if($.obj_len(transaction[kTAG_TRANSACTION_END]) > 0) {
				$item_time_data.append('<span title="End date"><span class="fa fa-clock-o"></span> ' + esec.toLocaleString() + '</span>');
			}
			// $item_description = $('<p class="list-group-item-text text-muted">').text(transaction[kTAG_TRANSACTION_TYPE][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_INFO]),
			var $item_progress_container = $('<div class="progress">'),
			$item_progress_bar = $('<div style="width: ' + current_progress + '%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="' + current_progress + '" role="progressbar" class="progress-bar ' + progressbar_style + '">').text(current_progress + "%");
			$item_col1.append('<span class="fa ' + current_status_icon + ' ' + icon_size + '"></span>');
			$item_col1.find("span").addClass("");
			// Contents
			$item_col2.append($item_title);//.append($item_description);
			if($.obj_len(transaction[kTAG_COUNTER_PROCESSED])) {
				$item_status.append($item_processed);
			}
			if($.obj_len(transaction[kTAG_COUNTER_VALIDATED])) {
				$item_status.append($item_validated);
			}
			if($.obj_len(transaction[kTAG_COUNTER_REJECTED])) {
				$item_status.append($item_rejected);
			}
			if($.obj_len(transaction[kTAG_COUNTER_SKIPPED])) {
				$item_status.append($item_skipped);
			}
			if($.obj_len(transaction[kTAG_COUNTER_RECORDS])) {
				$item_status.append('<hr />').append($item_records);
			}
			$item_col2a.append($item_status);
			$item_col2b.append($item_time_data);
			// Progress bar
			$item_progress_container.append($item_progress_bar);
			$item_col3.append($item_progress_container);
			$item_row.append($item_col1);
			$item_row.append($item_col2);
			$item_row.append($item_col2a);
			$item_row.append($item_col2b);
			$item_row.append($item_col3);
			$item_row_container.append($item_row);
			$item.html($item_row_container.html());
			$("#detail_list_group").append($item);

			// Behaviours
			if($("#transactions").hasClass("in")) {
				// $("#content").scrollTo("100%", 300);
			}
		});

		// Cycle
		if(progress < 100 && status !== "danger") {
			setTimeout(function() {
				$.build_interface(session_id);
			}, 1000);
		} else {
			$("#progress_bar").removeClass("progress-bar-striped").removeClass("progress-bar-info").removeClass("active").addClass("progress-bar-success");
			if(status == "success") {
				$("#details_btn").collapse_details();
				// Append buttons to end of page
				var $btn_group = $('<div class="btn-group pull-right">'),
				$btn_download = $('<a>').attr({
					"class": "btn btn-default-white",
					"href": "javascript:void(0)",
					"onclick": ""
				}).html(i18n[lang].interface.btns.download + ' <span class="fa fa-download"></span>'),
				$btn_update = $('<a>').attr({
					"class": "btn btn-orange",
					"href": "javascript:void(0)",
					"id": "update_btn"
				}).html(i18n[lang].interface.btns.update + ' <span class="fa fa-upload"></span>'),
				$btn_publish = $('<a>').attr({
					"class": "btn btn-success",
					"href": "javascript:void(0)",
				}).html(i18n[lang].interface.btns.publish + '<sup>' + $.get_validated(session) + '</sup> <span class="fa fa-chevron-right"></span>'),
				$update_form = $('<form action="" class="dropzone hidden" id="dropzone"></form>');

				// Append buttons to the bottom of page
				$btn_group.append($btn_download);
				if($.has_rejected(session) || $.has_skipped(session)) {
					$btn_group.append($btn_update);
					$btn_publish.attr("disabled", "disabled");
				} else {
				}
				$btn_group.append($btn_publish);
				// $("#upload form").update_btn(session_id);

				$("#upload").append($btn_group).append($update_form);
			}
		}
	});

	// Block the progress bar position on scroll
	if($("#progress_supercontainer").length > 0) {
		var $obj = $("#progress_supercontainer");
		var top = $obj.offset().top - parseFloat($obj.css("marginTop").replace(/auto/, 0)) - 70;
		$("#content").scroll(function(event) {
			// The y position of the scroll
			var y = $(this).scrollTop();

			if (y >= top) {
				// if so, ad the fixed class
				$obj.addClass("fixed");
			} else {
				// otherwise remove it
				$obj.removeClass("fixed");
			}
		});
	}
};


$.fn.add_previous_upload_session = function(session_id) {
	var $item = $(this),
	$last_session_box = $('<div class="top_content_label">'),
	$last_session_box_title = $('<h1>').text(i18n[lang].messages.last_upload),
	$last_session_data_container = $('<div class="row">'),
	$last_session_data_col1 = $('<div class="col-xs-4" id="last_session_menu">'),
	$last_session_data_col2 = $('<div class="col-xs-4">'),
	$last_session_data_col3 = $('<div class="col-xs-4">'),
	$last_session_data_progress_container = $('<div class="progress">'),
	$last_session_data_text = $('<span>'),
	$last_session_data_progress = $('<div>').attr({
		"class": "progress-bar progress-bar-striped progress-bar-warning active",
		"role": "progressbar",
		"aria-valuenow": "100",
		"aria-valuemin": "0",
		"aria-valuemax": "100",
		"style": "width: 100%;"
	}),
	$last_session_data_btn_group = $('<div class="btn-group">'),
	$last_session_data = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$(\"#upload\").added_file(); $.build_interface('" + session_id + "');",
		"title": i18n[lang].interface.btns.view_status
		// "class": "dropdown-toggle btn btn-default-white",
		// "data-toggle": "dropdown"
	}),
	$update_form = $('<form action="" class="dropzone hidden" id="dropzone"></form>'),
	// $dropdown_ul = $('<ul>').addClass("dropdown-menu dropdown-menu-right"),
	// $dropdown_li_divider = $('<li class="divider"></li>'),
	// $dropdown_li_view = $("<li>"),
	// $dropdown_li_download = $("<li>").addClass("disabled"),
	// $dropdown_li_update = $("<li>"),
	// $dropdown_li_delete = $("<li>").addClass("disabled"),
	// $link_view = $('<a>').attr({
	// 	"href": "javascript:void(0);",
	// 	// "onclick": "$(\"#upload\").added_file(); $.build_interface('" + session_id + "');",
        //         "title": i18n[lang].interface.btns.view_status
	// }).html("move"),
	$link_download = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "btn btn-default-white disabled",
                "title": i18n[lang].interface.btns.download
	}).html('<span class="fa fa-download fa-fw"></span>'),
	$errors_btn = $('<a>').attr({
		"href": "javascript:void(0);",
		"title": i18n[lang].interface.btns.view_errors_summary
	}).on("click", function() {
		$.get_errors({
			"session_id": session_id
		}, function(response) {
			var $div = $('<div id="errors_summary">'),
			status = "",
			status_string_class = "",
			status_icon = "";

			$(".top_content_label > h1").text(response[kAPI_PARAM_RESPONSE_FRMT_NAME]);
			$("#last_session_menu").html('<span class="text-muted">' + response[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</span>');

			$.each(response[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
				switch($.trim(v[kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
					case kTYPE_STATUS_FAILED:
					case kTYPE_STATUS_ERROR:
					case kTYPE_STATUS_FATAL:
					case kTYPE_STATUS_EXCEPTION:
						status_icon = "fa-times";
						status_string_class = "text-danger";
						status = "danger";
						break;
					case kTYPE_STATUS_EXECUTING:
						status_icon = "fa-refresh fa-spin";
						status_string_class = "text-muted";
						status = "";
						break;
					case kTYPE_STATUS_OK:
						status_icon = "fa-check";
						status_string_class = "text-success";
						status = "success";
						break;
					case kTYPE_STATUS_MESSAGE:
						status_icon = "fa-info";
						status_string_class = "text-info";
						status = "info";
						break;
					case kTYPE_STATUS_WARNING:
						status_icon = "fa-warning";
						status_string_class = "text-warning";
						status = "warning";
						break;
				}
				var $h4 = $('<h4 class="' + status_string_class + '">'),
				$left_span = $('<span class="fa pull-left fa-3x ' + status_icon + '"></span>'),
				$details_btn = $('<a>').attr({
					"href": "javascript:void(0);",
					"data-target": "details_" + k,
					"data-status": v[kAPI_PARAM_RESPONSE_FRMT_VALUE],
					"data-class": status_string_class,
					"class": "btn-link btn-details"
				}).html(i18n[lang].interface.btns.details + ' <span class="fa fa-caret-right"></span>'),
				$title = $('<p class="help-block">').append(v[kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_INFO] + "&emsp;").append($details_btn),
				$right_span = $('<span class="pull-left">').append(v[kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_NAME])
									   .append(' <sup><b>' + v[kAPI_PARAM_RESPONSE_COUNT] + '</b></sup>')
									   .append($title),
				$clearfix = $('<div class="clearfix">'),
				$collapse = $('<div class="collapse" id="details_' + k + '">'),
				$collapsed = $('<div class="well">');

				$collapse.append($collapsed);
				$h4.append($left_span).append($right_span);
				$div.append($h4).append($clearfix).append($collapse);

			});
			$("#contents").removeClass("upload");
			$("#upload").html("").append($div);
			$(".btn-details").on("click", function() {
				var $target = $("#" + $(this).attr("data-target")),
				status = $(this).attr("data-status"),
				string_class = $(this).attr("data-class")
				$well = $target.find(".well");

				$(".btn-details").find("span.fa").switchClass("fa-caret-right", "fa-caret-down");
				if($.trim($well.html()) == "") {
					$well.html('<span class="text-muted"><span class="fa fa-refresh fa-spin fa-fw"></span> ' + i18n[lang].messages.loading_details + '</span>');
				}

				$(".collapse").collapse("toggle").on("show.bs.collapse", function () {
					if($.trim($well.html()) == "") {
						$(".btn-details").find("span.fa").switchClass("fa-caret-right", "fa-caret-down");
						$well.html('<span class="text-muted"><span class="fa fa-refresh fa-spin fa-fw"></span> ' + i18n[lang].messages.loading_details + '</span>');
					}
				}).on("shown.bs.collapse", function () {
					$.get_errors_message({
						"session_id": session_id,
						"status_type": status
					}, function(res) {
						var $ul = $('<ul>');
						$.each(res[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
							var $li = $('<li class="' + string_class + '">').html(v[kAPI_PARAM_RESPONSE_FRMT_DISP] + ' <sup><b>' + v[kAPI_PARAM_RESPONSE_COUNT] + '</b></sup>');
							$ul.append($li);
						});
						$well.html("<h4>Messages <sup></sup></h4>").append($ul);
						console.info(res);
					});
				}).on("hide.bs.collapse", function () {
					$(".btn-details").find("span.fa").switchClass("fa-caret-down", "fa-caret-right");
				});
			});
		});
	}),
	// $link_update = $('<a>').attr({
	// 	"href": "javascript:void(0);",
	// 	"class": "disabled",
	// 	"id": "update_btn"
	// }).text(i18n[lang].interface.btns.update),
	$link_delete = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "btn btn-default-white disabled",
                "title": i18n[lang].interface.btns.delete
	}).html('<span class="fa fa-trash-o fa-fw"></span>');

	$.get_session_status(session_id, function(response) {
		console.info(response);
		var status = "",
		status_icon = "",
		status_string = "",
		status_string_class = "",
		current_status_class = "",
		session = response.session,
		file_path = session[kTAG_FILE][0].filename[kAPI_PARAM_RESPONSE_FRMT_VALUE];

		switch($.trim(session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_VALUE])) {
			case kTYPE_STATUS_FAILED:
			case kTYPE_STATUS_ERROR:
			case kTYPE_STATUS_FATAL:
			case kTYPE_STATUS_EXCEPTION:
				session_status_class = "progress-bar-danger";
				status_icon = "fa-times fa-1_5x";
				status_string_class = "text-danger";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "danger";
				break;
			case kTYPE_STATUS_EXECUTING:
				session_status_class = "progress-bar-info";
				status_icon = "fa-refresh fa-spin";
				status_string_class = "text-muted";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP] + "...";
				status = "";
				break;
			case kTYPE_STATUS_OK:
				session_status_class = "progress-bar-success";
				status_icon = "fa-check";
				status_string_class = "text-success";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "success";
				break;
			case kTYPE_STATUS_MESSAGE:
				current_status_class = "list-group-item-info";
				status_icon = "fa-info fa-1_5x";
				status_string_class = "text-info";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "info";
				break;
			case kTYPE_STATUS_WARNING:
				session_status_class = "progress-bar-warning";
				status_icon = "fa-warning";
				status_string_class = "text-warning";
				status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
				status = "warning";
				break;
		}
		if($.has_skipped(session)) {
			session_status_class = "progress-bar-warning";
			status_icon = "fa-warning";
			status_string_class = "text-warning";
			status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
			status = "warning";
		}
		if($.has_rejected(session)) {
			session_status_class = "progress-bar-danger";
			status_icon = "fa-times";
			status_string_class = "text-danger";
			status_string = session[kTAG_SESSION_STATUS][kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
			status = "danger";
		}

		$last_session_data.html('<span class="fa fa-file-excel-o fa-fw text-success"></span>' + file_path.split("/").pop());
		$last_session_data.tooltip();
		$last_session_data_progress.attr({
			"aria-valuenow": $.get_progress(session),
			"style": "width: " + $.get_progress(session) + "%;"
		}).html($.get_progress(session) + "%");

		$last_session_data_progress_container.addClass("pull-left").attr("style", "width: 93%;");
		$last_session_data_col3.append(' <span class="fa ' + status_icon + " " + status_string_class + ' fa-1_5x pull-right"></span>');
			$last_session_data_progress.removeClass("active").removeClass("progress-bar-striped");
			$last_session_data_progress.removeClass("progress-bar-warning").addClass(session_status_class);
			$errors_btn.append($.get_processed(session) + " " + $.get_processed_name(session) + '<span class="fa fa-angle-right fa-fw"></span> ')
				   .append($.get_validated(session) + " " + $.get_validated_name(session) + ' - ')
				   .append('<b>' + $.get_skipped(session) + " " + $.get_skipped_name(session) + '</b> - ')
				   .append('<u><b>' + $.get_rejected(session) + " " + $.get_rejected_name(session) + '</b></u>');
			$errors_btn.tooltip();
			$last_session_data_progress.html($errors_btn);

		// $dropdown_li_view.append($link_view);
		// $dropdown_li_download.append($link_download);
		// $dropdown_li_update.append($link_update);
		// $dropdown_li_delete.append($link_delete);
		// $dropdown_ul.append($dropdown_li_view)
		// 	    .append($dropdown_li_download)
		// 	    .append($dropdown_li_divider)
		// 	    .append($dropdown_li_update)
		// 	    .append($dropdown_li_delete);
                $last_session_data_btn_group.append($link_download)
                                        //     .append($link_update)
                                            .append($link_delete);

		// $last_session_data_btn_group.append($dropdown_ul);
		$last_session_data_col1.html("").append($last_session_data).append($last_session_data_btn_group).append($update_form);
		// $("#last_session_menu form").update_btn(session_id);
		console.warn("OK", session, $.has_skipped(session));
		// $.get_errors(function(errors) {
		// 	console.log(errors);
		// });
		// $last_session_data_col1.html($last_session_data_text);
	});

	// Prepend all to upload interface
		// Title
		$last_session_box.append($last_session_box_title);
		$last_session_data_text.addClass("text-muted").html('<span class="fa fa-fw fa-refresh fa-spin"></span> ' + i18n[lang].messages.loading_session_status);
		$last_session_data_col1.append($last_session_data_text);
		$last_session_data_container.append($last_session_data_col1);
		// Statistics
		$last_session_data_container.append($last_session_data_col2);
		// Progress bar
		$last_session_data_progress_container.append($last_session_data_progress);
		$last_session_data_col3.append($last_session_data_progress_container);
		$last_session_data_container.append($last_session_data_col3);
	$last_session_box.append($last_session_data_container);
	$item.prepend($last_session_box);
};
