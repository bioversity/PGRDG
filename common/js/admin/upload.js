/**
* Upload functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/


/**
 * Clean the file name for upload purposes
 * @param  string 			text 					The file name
 * @return string      								The cleaned file name
 */
$.clean_file_name = function(text) { text = text.replace(/\./g, ""); return text.replace(/\//g, "-").replace(/\:/g, "~").replace(/\s/g, "_"); };

/**
 * Get the current session id
 * @return string         							The current session id
 */
$.get_current_session_id = function() { if($.storage_exists("pgrdg_user_cache.user_data.current.last_upload_session_id")) { return storage.get("pgrdg_user_cache.user_data.current.last_upload_session_id"); } };

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
$.get_processed = function(session) { return ((session[kTAG_COUNTER_PROCESSED] !== undefined) ? session[kTAG_COUNTER_PROCESSED][kAPI_PARAM_RESPONSE_FRMT_VALUE] : 0); };

/**
 * Get the total of validated items
 * @param  object 			session 				The session object
 * @return int         								The number of total validated items
 */
$.get_validated = function(session) { return ((session[kTAG_COUNTER_VALIDATED] !== undefined) ? session[kTAG_COUNTER_VALIDATED][kAPI_PARAM_RESPONSE_FRMT_VALUE] : 0); };

/**
 * Get the total of skipped items
 * @param  object 			session 				The session object
 * @return int         								The number of total skipped items
 */
$.get_skipped = function(session) { return ((session[kTAG_COUNTER_SKIPPED] !== undefined) ? session[kTAG_COUNTER_SKIPPED][kAPI_PARAM_RESPONSE_FRMT_VALUE] : 0); };

/**
 * Get the total of rejected items
 * @param  object 			session 				The session object
 * @return int         								The number of total rejected items
 */
$.get_rejected = function(session) { return ((session[kTAG_COUNTER_REJECTED] !== undefined) ? session[kTAG_COUNTER_REJECTED][kAPI_PARAM_RESPONSE_FRMT_VALUE] : 0); };

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
$.get_processed_name = function(session) { return ((session[kTAG_COUNTER_PROCESSED] !== undefined) ? session[kTAG_COUNTER_PROCESSED][kAPI_PARAM_RESPONSE_FRMT_NAME] : ""); };

/**
 * Get the object name of the total validated items
 * @param  object 			session 				The session object
 * @return int         								The number of total validated items
 */
$.get_validated_name = function(session) { return ((session[kTAG_COUNTER_VALIDATED] !== undefined) ? session[kTAG_COUNTER_VALIDATED][kAPI_PARAM_RESPONSE_FRMT_NAME] : ""); };

/**
 * Get the object name of the total skipped items
 * @param  object 			session 				The session object
 * @return int         								The number of total skipped items
 */
$.get_skipped_name = function(session) { return ((session[kTAG_COUNTER_SKIPPED] !== undefined) ? session[kTAG_COUNTER_SKIPPED][kAPI_PARAM_RESPONSE_FRMT_NAME] : ""); };

/**
 * Get the object name of the total rejected items
 * @param  object 			session 				The session object
 * @return int         								The number of total rejected items
 */
$.get_rejected_name = function(session) { return ((session[kTAG_COUNTER_REJECTED] !== undefined) ? session[kTAG_COUNTER_REJECTED][kAPI_PARAM_RESPONSE_FRMT_NAME] : ""); };

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


$.force_download = function(file) {
	window.location = "API/?download=" + $.utf8_to_b64(file);
}
/**
 * Force the download of the file
 * @param  object 			file_data 				The object with files data
 */
$.download_last_uploaded_file = function(file_data) {
	// Check if was passed the file object or the session id
	if($.type(file_data) !== "object") {
		// Is the session id

	}
	var filename = file_data.filename[kAPI_PARAM_RESPONSE_FRMT_VALUE].split("/").pop(),
	extension = filename.split(".").pop().toLowerCase(),
	filename = $.trim($.clean_file_name(filename.replace(extension, ""))) + "." + extension;
	var file_path = $.get_current_user_id() + "/uploads/" + filename;
	file_content_type = file_data.contentType[kAPI_PARAM_RESPONSE_FRMT_VALUE],
	file_length = file_data.length[kAPI_PARAM_RESPONSE_FRMT_VALUE];

	window.location = "API/?download_template=" + $.utf8_to_b64(file_path);
};

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
		dictDefaultMessage: '<span class=\"fa fa-cloud-upload fa-5x text-muted\"></span><br /><br />' + i18n[lang].messages.drop_file_here,
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
		if(!$.storage_exists("pgrdg_user_cache.user_data.current.last_upload_session_id") || $.get_current_session_id() !== response[kAPI_SESSION_ID]) {
			storage.set("pgrdg_user_cache.user_data.current.last_upload_session_id", response["session-id"]);
		}

		if (typeof callback == "function") {
			callback.call(this, response);
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
 * Prepare the interface to display all scrollbars
 */
$.fn.added_file = function() {
	var $item = $(this),
	progress = 0,
	$h1 = $('<h1>'),
	$a_back = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.init_upload();",
		"class": "back_btn text-default",
		"title": i18n[lang].interface.btns.back_to_main_upload
	}).tooltip({placement: "bottom"}).text(i18n[lang].messages.template_upload);
	$info_row = $('<div class="row">'),
	$left_col = $('<div class="col-xs-6 col-sm-7 col-md-6 col-lg-10">'),
	$righ_col = $('<div class="col-xs-6 col-sm-5 col-md-4 col-lg-3 col-lg-2 text-right">'),
	$details_row = $('<div id="details_row" class="row hidden">'),

	$dl_left = $('<dl id="dl_left" class="dl-horizontal">'),
	$dl_right = $('<dl id="dl_right" class="dl-horizontal">'),
	// Creating progress bar
	$progress_supercontainer = $('<div id="progress_supercontainer">'),
	$progrtess_container_title = $('<h2>').text(i18n[lang].messages.template_upload),
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
	$h1.append($a_back);
	$item.append($h1).append($info_row).append($progress_supercontainer).append($details_row);
	$(".top_content_label").remove();
	$("#contents").removeClass("upload");
	$("#dropzone").remove();
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
		type: "upload_file",
		force_renew: true
	}, function(response) {
		var session_id = response[kAPI_SESSION_ID];
			storage.set("pgrdg_user_cache.user_data.current.last_upload_session_id", response[kAPI_SESSION_ID]);

		if (typeof callback == "function") {
			callback.call(this, session_id);
		}
	});
};

/**
 * Check transaction status and display result
 * @param  object   	           	options  				An object with query options
 */
$.group_transaction = function(options, callback) {
	var opt = $.extend({
		session_id: $.get_current_session_id(),
		user_id: $.get_current_user_id(),
		params: []
	}, options);

	var data = {};
	data[kAPI_REQUEST_USER] = opt.user_id;
	data[kAPI_PARAM_ID] = opt.session_id;
	if(opt.session_id !== undefined) {
		data[kAPI_PARAM_ID] = opt.session_id;
	}
	if($.obj_len(opt.params) > 0) {
		data[kAPI_PARAM_GROUP_TRANS] = opt.params;
	}
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
 * Append next error details list
 * @param  object   	           	options  				An object with query options
 */
$.fn.nest_collapsible = function(options, callback) {
	var opt = $.extend({
		id: $.makeid(),
		k: 0,
		v: {},
		string_class: "text-default",
		session_id: $.get_current_session_id(),
		params: {}
	}, options);

	var $item = $(this),
	container_id = opt.id,
	$li = $item.closest("li"),
	$a_nest = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "text-default",
		"data-target": "#" + opt.id,
		"title": opt.v[kAPI_PARAM_RESPONSE_FRMT_INFO]
	}).on("click", function() {
		if($("#" + opt.id).html().length === 0) {
			$("#" + opt.id).addClass("text-muted").html('<span class="fa fa-fw fa-refresh fa-spin"></span> ' + i18n[lang].messages.loading_session_status);
		}
		$("#" + opt.id).prev("h4").toggleClass("hidden");
		$("#" + opt.id).collapse("toggle");
		$li.find("span.fa-li:first").toggleClass("fa-caret-right fa-caret-down");
		if($("#" + opt.id).find("li").length == 0) {
			if(typeof callback == "function") {
				callback.call(this, opt);
			}
		}
	}).html($.highlight(opt.v[kAPI_PARAM_RESPONSE_FRMT_DOCU][opt.k][kAPI_PARAM_RESPONSE_FRMT_DISP]) + ' <sup class="' + opt.string_class + '"><b>' + opt.v[kAPI_PARAM_RESPONSE_FRMT_DOCU][opt.k][kAPI_PARAM_RESPONSE_COUNT] + '</b></sup>').tooltip({placement: "right"});

	var $uul = $('<ul id="' + opt.id +'" class="collapse fa-ul empty" aria-expanded="false">'),
	$li = $('<li>').html('<span class="fa fa-li fa-caret-right"></span>').append($a_nest).append($uul);
	$item.append($li);
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
 * Build main upload progress bars
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
		$.each(session[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, transaction) {
			var current_progress = ((transaction[kTAG_COUNTER_PROGRESS] !== undefined) ? parseInt(transaction[kTAG_COUNTER_PROGRESS][kAPI_PARAM_RESPONSE_FRMT_DISP]) : 100),
			progress_bar_class = "",
			icon_size = "fa-1_5x";
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
				var $clearfix = $('<div class="clearfix" id="finished_upload">'),
				$btn_group = $('<div class="btn-group pull-right">'),
				$btn_download = $('<a>').attr({
					"class": "btn btn-default-white",
					"href": "javascript:void(0)"
				}).on("click", function() {
					$.download_last_uploaded_file(response[kAPI_SESSION][kTAG_FILE][0]);
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
				$clearfix.append($btn_group).append($update_form);
				$("#upload").append($clearfix).append("<br /><br />");

				$("#finished_upload form").update_btn(session_id);
			} else {
				var $panel_footer = $('<div class="col-sm-12">'),
				$clearfix = $('<div class="clearfix">'),
				$btn_group = $('<div class="btn-group pull-right">'),
				$btn_download = $('<a>').attr({
					"class": "btn btn-default-white"
				}).html('Download the file <span class="fa fa-download"></span>'),
				$btn_errors = $('<a>').attr({
					"class": "btn btn-danger",
					"href": "javascript:void(0);",
					"onclick": "$.view_last_upload_errors('" + session_id + "');"
				}).html('View error details <span class="fa fa-times"></span>')
				$btn_group.append($btn_download).append($btn_errors);
				$panel_footer.append($btn_group).append($clearfix);
				$("#details_row").append($panel_footer);
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

/**
 * Load and display the list of all last upload errors
 * @param  string 			session_id 				The id of the interested session
 */
$.view_last_upload_errors = function(session_id) {
	var $a_back = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.init_upload();",
		"class": "back_btn",
		"title": i18n[lang].interface.btns.back_to_main_upload
	}).tooltip({placement: "bottom"});

	if($("#contents > .top_content_label").length === 0) {
		var $last_session_box = $('<div class="top_content_label">'),
		$last_session_box_title = $('<h1>').append($a_back).append(i18n[lang].messages.last_upload),
		$last_session_data_container = $('<div class="row">'),
		$last_session_data_col1 = $('<div class="col-xs-4" id="last_session_menu">'),
		$last_session_data_text = $('<span>');

		$last_session_box.append($last_session_box_title);
		$last_session_data_text.addClass("text-muted").html('<span class="fa fa-fw fa-refresh fa-spin"></span> ' + i18n[lang].messages.loading_session_status);
		$last_session_data_col1.append($last_session_data_text);
		$last_session_data_container.append($last_session_data_col1);
		$last_session_box.append($last_session_data_container);
		$("#contents").prepend($last_session_box);
	}
	// Get all transactions status
	var params = {};
	params[kTAG_TRANSACTION_STATUS] = null;
	$.group_transaction({
		session_id: session_id,
		params: params
	}, function(response) {
		// Build the errors summary interface
		var $div = $('<div id="errors_summary">'),
		status = "",
		status_string_class = "",
		status_icon = "",
		current_title = $(".top_content_label > h1");
		$a_back.append(i18n[lang].messages.last_upload + " " + response[kAPI_PARAM_RESPONSE_FRMT_NAME].toLowerCase());
		$(".top_content_label > h1").html("").append($a_back);
		$(".top_content_label > .row > .col-xs-4:last").html("");
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
			var $this_btn = $(this),
			$target = $("#" + $(this).attr("data-target")),
			status = $(this).attr("data-status"),
			string_class = $(this).attr("data-class"),
			$well = $target.find(".well"),
			$row = $('<div class="row">'),
			$col1 = $('<div id="worksheets_col" class="col-xs-12 col-sm-6 col-lg-4">');
			$row.append($col1)
			$well.append($row);

			$(".btn-details").find("span.fa").toggleClass("fa-caret-right fa-caret-down");
			if($.trim($("#worksheets_col").html()) === "") {
				$("#worksheets_col").html('<span class="text-muted"><span class="fa fa-refresh fa-spin fa-fw"></span> ' + i18n[lang].messages.loading_details + '</span>');
			}

			$target.collapse("toggle").on("show.bs.collapse", function () {
			}).on("shown.bs.collapse", function () {
				var $root_title = $('<h5>').attr({
					"class": "root-title",
				});

				if($("#worksheets_col > h5.root-title").length === 0) {
					/**
					* Show the list of affected worksheets
					*/
					var wpr = {};
					wpr[kTAG_TRANSACTION_STATUS] = status;
					wpr[kTAG_TRANSACTION_COLLECTION] = null;
					$.group_transaction({
						session_id: session_id,
						params: wpr
					}, function(res) {
						var $ul = $('<ul class="collapse fa-ul" id="upload_error_worksheets" aria-expanded="false" style="height: 0px;">');
						$.each(res[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
							/**
							* Show the list of affected aliases
							*/
							var cid = $.makeid(),
							apr = {};
							apr[kTAG_TRANSACTION_STATUS] = status;
							apr[kTAG_TRANSACTION_COLLECTION] = v[kAPI_PARAM_RESPONSE_FRMT_DISP];
							apr[kTAG_TRANSACTION_ALIAS] = null;
							$ul.nest_collapsible({
								id: cid,
								k: k,
								v: res,
								string_class: string_class,
								session_id: session_id,
								params: apr
							}, function(opt) {
								$.group_transaction({
									session_id: opt.session_id,
									params: opt.params
								}, function(ress) {
									if($.obj_len(ress[kAPI_PARAM_RESPONSE_FRMT_DOCU]) == 0) {
										$("#" + cid).removeClass("empty").html('<i class="text-muted">' + i18n[lang].messages.no_data + '</i>');
									} else {
										$('<h4 id="' + cid + '_title">').text(ress[kAPI_PARAM_RESPONSE_FRMT_NAME]).insertBefore($("#" + cid));
										$("#" + cid).html("");
										if(!$("#" + cid).hasClass("empty")) {
											$("#" + cid).collapse("toggle");
										} else {
											$("#" + cid).removeClass("empty");
											$.each(ress[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(kk, vv) {
												/**
												* Show the list of affected assesment level
												*/
												var ccid = $.makeid(),
												alpr = {};
												alpr[kTAG_TRANSACTION_STATUS] = status;
												alpr[kTAG_TRANSACTION_COLLECTION] = v[kAPI_PARAM_RESPONSE_FRMT_DISP];
												alpr[kTAG_TRANSACTION_ALIAS] = vv[kAPI_PARAM_RESPONSE_FRMT_DISP];
												alpr[kTAG_TRANSACTION_VALUE] = null;
												$("#" + cid).nest_collapsible({
													id: ccid,
													k: kk,
													v: ress,
													string_class: string_class,
													session_id: session_id,
													params: alpr
												}, function(optt) {
													$.group_transaction({
														session_id: opt.session_id,
														params: optt.params
													}, function(resss) {
														if($.obj_len(resss[kAPI_PARAM_RESPONSE_FRMT_DOCU]) == 0) {
															$("#" + ccid).removeClass("empty").html('<i class="text-muted">' + i18n[lang].messages.no_data + '</i>');
														} else {
															$('<h4 id="' + ccid + '_title">').text(resss[kAPI_PARAM_RESPONSE_FRMT_NAME]).insertBefore($("#" + ccid));
															$("#" + ccid).html("");
															if(!$("#" + ccid).hasClass("empty")) {
																$("#" + ccid).collapse("toggle");
															} else {
																$("#" + ccid).removeClass("empty");
																$.each(resss[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(kkk, vvv) {
																	/**
																	* Show the list of affected assesment level value
																	*/
																	var cccid = $.makeid(),
																	alvpr = {};
																	alvpr[kTAG_TRANSACTION_STATUS] = status;
																	alvpr[kTAG_TRANSACTION_COLLECTION] = v[kAPI_PARAM_RESPONSE_FRMT_DISP];
																	alvpr[kTAG_TRANSACTION_ALIAS] = vv[kAPI_PARAM_RESPONSE_FRMT_DISP];
																	alvpr[kTAG_TRANSACTION_VALUE] = vvv[kAPI_PARAM_RESPONSE_FRMT_DISP];
																	alvpr[kTAG_TRANSACTION_MESSAGE] = null;
																	$("#" + ccid).nest_collapsible({
																		id: cccid,
																		k: kkk,
																		v: resss,
																		string_class: string_class,
																		session_id: session_id,
																		params: alvpr
																	}, function(opttt) {
																		$.group_transaction({
																			session_id: opt.session_id,
																			params: opttt.params
																		}, function(ressss) {
																			if($.obj_len(ressss[kAPI_PARAM_RESPONSE_FRMT_DOCU]) == 0) {
																				$("#" + cccid).removeClass("empty").html('<i class="text-muted">' + i18n[lang].messages.no_data + '</i>');
																			} else {
																				$('<h4 id="' + cccid + '_title">').text(ressss[kAPI_PARAM_RESPONSE_FRMT_NAME]).insertBefore($("#" + cccid));
																				$("#" + cccid).html("");
																				if(!$("#" + cccid).hasClass("empty")) {
																					$("#" + cccid).collapse("toggle");
																				} else {
																					$("#" + cccid).removeClass("empty");
																					$.each(ressss[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(kkkk, vvvv) {
																						/**
																						* Show the list of affected assesment level error message
																						*/
																						var ccccid = $.makeid(),
																						alempr = {};
																						alempr[kTAG_TRANSACTION_STATUS] = status;
																						alempr[kTAG_TRANSACTION_COLLECTION] = v[kAPI_PARAM_RESPONSE_FRMT_DISP];
																						alempr[kTAG_TRANSACTION_ALIAS] = vv[kAPI_PARAM_RESPONSE_FRMT_DISP];
																						alempr[kTAG_TRANSACTION_VALUE] = vvv[kAPI_PARAM_RESPONSE_FRMT_DISP];
																						alempr[kTAG_TRANSACTION_MESSAGE] = vvvv[kAPI_PARAM_RESPONSE_FRMT_DISP];
																						alempr[kTAG_TRANSACTION_RECORD] = null;
																						$("#" + cccid).nest_collapsible({
																							id: ccccid,
																							k: kkkk,
																							v: ressss,
																							string_class: "text-danger",
																							session_id: session_id,
																							params: alempr
																						}, function(optttt) {
																							// "(N/A)" non ha il docu!
																							$.group_transaction({
																								session_id: opt.session_id,
																								params: optttt.params
																							}, function(ressss) {
																								$('<h4 id="' + ccccid + '_title">').text(ressss[kAPI_PARAM_RESPONSE_FRMT_NAME]).insertBefore($("#" + ccccid));
																								$("#" + ccccid).addClass("last_level").html("");

																								$.each(ressss[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(kkkkk, vvvvv) {
																									var $lim = $('<li>');
																									$lim.html(vvvvv[kAPI_PARAM_RESPONSE_FRMT_DISP]);
																									$("#" + ccccid).append($lim);
																								});
																							});
																						});
																					});
																				}
																			}
																		});
																	});
																});
															}
														}
													});
												});
											});
										}
									}
								});
							});
						});
						$root_title.html('<span class="fa fa-files-o fa-fw fa-2x"></span> ' + i18n[lang].messages.worksheets + ' <sup class="' + string_class + '"><small class="text-warning">' + $.obj_len(res[kAPI_PARAM_RESPONSE_FRMT_DOCU]) + '</small></sup>');
						$("#worksheets_col").html("").append($root_title).append($ul);
						// Collapse the worksheets list
						$("#upload_error_worksheets").collapse("show");
					});
				}
			});
		});
		// Expand details if there's only 1 listed operation
		if($.obj_len(response[kAPI_PARAM_RESPONSE_FRMT_DOCU]) === 1) {
			$(".btn-details").click();
		}
	});
};

/**
 * Build the interface summary for the last upload
 * @param string 			session_id 				The id of the last session
 */
$.fn.add_previous_upload_session = function(session_id) {
	/**
	 * Creating DOM
	 */
	var $item = $(this),
	$last_session_box = $('<div class="top_content_label">'),
	$last_session_box_title = $('<h1>').text(i18n[lang].messages.last_upload),
	$last_session_data_container = $('<div class="row">'),
	$last_session_data_col1 = $('<div class="col-xs-8" id="last_session_menu">'),
	$last_session_data_col2 = $('<div class="col-xs-4">'),
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
	}),
	$update_form = $('<form action="" class="dropzone hidden" id="dropzone"></form>'),
	/**
	 * Scrollbar error button
	 */
	$errors_btn = $('<a>').attr({
		"href": "javascript:void(0);",
		"title": i18n[lang].interface.btns.view_errors_summary
	}).on("click", function() {
		/**
		 * View upload errors
		 */
		$.view_last_upload_errors(session_id);
	}),
	/**
	 * #top_content_label update btn
	 */
	$link_update = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "btn btn-transparent btn-orange",
                "title": i18n[lang].interface.btns.update,
		"id": "update_btn"
	}).html(i18n[lang].interface.btns.update + ' <span class="fa fa-upload fa-fw"></span>'),
	/**
	 * #top_content_label delete btn
	 */
	$link_delete = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "btn btn-transparent btn-default-white disabled",
                "title": i18n[lang].interface.btns.delete
	}).html(i18n[lang].interface.btns.delete + ' <span class="fa fa-trash-o fa-fw"></span>');

	/**
	 * #top_content_label download btn
	 */
	$link_download = $('<a>').attr({
		"href": "javascript:void(0);",
		"class": "btn btn-transparent btn-default-white",
                "title": i18n[lang].interface.btns.download
	}).html('<span class="fa fa-download fa-fw"></span> ' + i18n[lang].interface.btns.download),
	/**
	 * #top_content_label download templates btn
	 */
	$link_download_template = $('<a>').attr({
		"href": "javascript:void(0)",
		"class": "btn btn-transparent btn-default dropdown-toggle",
		"data-toggle": "dropdown",
                "title": i18n[lang].interface.btns.download_template
	}).html('<span class="fa fa-download"></span> ' + i18n[lang].interface.btns.download_template + ' <span class="fa fa-caret-down"></span>'),
	$link_download_dropdown = $('<ul class="dropdown-menu pull-right">'),
	$li_checklist = $('<li>'),
	$li_inventory = $('<li>'),
	$btn_checklist = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.force_download('xls/CWR_Checklist_Template.xlsx')",
		"id": "cwr_checklist_btn",
	}).html('<span class="fa fa-file-excel-o text-success"></span><span class="text-default">CWR Checklist</span>'),
	$btn_inventory = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.force_download('xls/CWR_Inventory_Template.xlsx')",
		"id": "cwr_inventory_btn"
	}).html('<span class="fa fa-file-excel-o text-success"></span><span class="text-default">CWR Inventory</span>');
	$li_checklist.append($btn_checklist);
	$li_inventory.append($btn_inventory);
	$link_download_dropdown.append($li_checklist).append($li_inventory);


	/**
	 * Get the last session status and populate the scrollbar on the right
	 */
	$.get_session_status(session_id, function(response) {
		var status = "",
		status_icon = "",
		status_string = "",
		status_string_class = "",
		current_status_class = "",
		session = response[kAPI_SESSION],
		file_path = (session[kTAG_FILE] !== undefined) ? session[kTAG_FILE][0].filename[kAPI_PARAM_RESPONSE_FRMT_VALUE] : i18n[lang].messages.no_file_uploaded;
		$link_download.on("click", function() {
			$.download_last_uploaded_file(session[kTAG_FILE][0]);
		});

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

		$last_session_data.html('<span class="fa fa-file-excel-o fa-1_5x fa-fw text-success"></span>' + file_path.split("/").pop());
		$last_session_data.tooltip();
		$last_session_data_progress.attr({
			"aria-valuenow": $.get_progress(session),
			"style": "width: " + ((!$.get_progress(session) === 0) ? $.get_progress(session) : 100) + "%;"
		}).html($.get_progress(session) + "%");

		$last_session_data_progress_container.addClass("pull-left").attr("style", "width: 93%;");
		$last_session_data_col2.append(' <span class="fa ' + status_icon + " " + status_string_class + ' fa-1_5x pull-right"></span>');
			$last_session_data_progress.removeClass("active").removeClass("progress-bar-striped");
			$last_session_data_progress.removeClass("progress-bar-warning").addClass(session_status_class);
			if(session[kTAG_FILE] !== undefined) {
				$errors_btn.append($.get_processed(session) + " " + $.get_processed_name(session) + '<span class="fa fa-angle-right fa-fw"></span> ')
					   .append($.get_validated(session) + " " + $.get_validated_name(session) + ' - ')
					   .append('<b>' + $.get_skipped(session) + " " + $.get_skipped_name(session) + '</b> - ')
					   .append('<u><b>' + $.get_rejected(session) + " " + $.get_rejected_name(session) + '</b></u>');
			} else {
				$errors_btn.html(i18n[lang].messages.no_progress_for_this_session);
			}
			$errors_btn.tooltip();
			$last_session_data_progress.html($errors_btn);

                $last_session_data_btn_group.append($link_update)
                                            .append($link_delete)
					    .append($link_download)
					    .append($link_download_template)
					    .append($link_download_dropdown);

		$last_session_data_col1.html("").append($last_session_data).append($last_session_data_btn_group).append($update_form);
		$("#last_session_menu form").update_btn(session_id);
	});

	// Populate the upload interface
	// Title
	$last_session_box.append($last_session_box_title);
	$last_session_data_text.addClass("text-muted").html('<span class="fa fa-fw fa-refresh fa-spin"></span> ' + i18n[lang].messages.loading_session_status);
	$last_session_data_col1.append($last_session_data_text);
	$last_session_data_container.append($last_session_data_col1);
	// Progress bar
	$last_session_data_progress_container.append($last_session_data_progress);
	$last_session_data_col2.append($last_session_data_progress_container);
	$last_session_data_container.append($last_session_data_col2);
	$last_session_box.append($last_session_data_container);
	$item.prepend($last_session_box);
};

$.init_upload = function() {
	$.upload_user_status(function(status) {
		if($("#contents .top_content_label").length > 0) {
			$("#contents .top_content_label").remove();
		}
		if(status[kAPI_SESSION_RUNNING]) {
			$("#upload").added_file();

			$.build_interface(status[kAPI_SESSION_ID]);
		} else {
			var session_id = "";
			// Add previous upload session
			if(status[kAPI_SESSION_ID] !== undefined && status[kAPI_SESSION_ID] !== null && status[kAPI_SESSION_ID] !== "") {
				session_id = status[kAPI_SESSION_ID];
				$("#contents").add_previous_upload_session(status[kAPI_SESSION_ID]);
			}

			/**
			* Generate upload interface
			*/
			storage.remove("pgrdg_user_cache.user_data.undefined");

			// Generate upload form
			var $div = $('<div>'),
			$form = $('<form>').attr({"action": "", "class": "dropzone", "id": "dropzone"}),
			$input_user_id = $('<input>').attr({"type": "hidden", "name": "user_id", "value": $.get_current_user_id()});
			$form.append($input_user_id);
			$div.append($form);
			$("#upload").html($div.html());

			$("#upload form").dropzone({
				autoDiscover: false,
				sendingmultiple: false,
				acceptedFiles: ".xls,.xlsx,.ods",
				autoProcessQueue: true,
				clickable: true,
				dictDefaultMessage: '<span class=\"fa fa-cloud-upload fa-5x text-muted\"></span><br /><br />' + i18n[lang].messages.drop_file_here,
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
		}
	});
}
