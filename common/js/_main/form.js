/**
/* Add Chosen form (select with search engine)
*/
$.fn.addChosen = function(options, content, callback) {
	var options = $.extend({
		id: "",
		class: "",
		placeholder: "Choose...",
		no_results_text: "",
		multiple: false,
		allow_single_deselect: true,
		max_select: 1,
		rtl: 0,
		btn_menu: {}
	}, options);
	
	var select = '<select id="' + options.id + '" class="chosen-select form-control' + ((options.rtl) ? " chosen-rtl" : "") + '" ' + ((options.multiple) ? " multiple " : "") + 'data-placeholder="' + options.placeholder + '">';
	$.each(content, function(text, attributes) {
		select += '<option val="' + attributes.val + '">' + text + '</option>';
	});
	$(this).append(select);
	
	$(this).find(".chosen-select").chosen({
		id: "content",
		max_selected_options: options.max_select,
		allow_single_deselect: options.allow_single_deselect,
		no_results_text: options.no_results_text
	}).on("change", function(evt, params) {
		if (typeof callback == "function") {
			callback.call(this);
		}
	});
};
/**
/* Manage chosen form
/* Functions to be called inside the $.addChosen() plugin
*/
$.update_chosen = function() { $(this).trigger("chosen:updated"); };
$.focus_chosen = function() { $(this).trigger("chosen:activate"); };
$.open_chosen = function() { $(this).trigger("chosen:open"); };
$.close_chosen = function() { $(this).trigger("chosen:close"); };
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/**
/* Add the main trait form
*/
$.fn.addTraitAutocomplete = function(options, data, callback) {
	// GET REQUEST URL: http://pgrdg.grinfo.private/Service.php?op=ping
	
	var options = $.extend({
		id: "",
		class: "",
		placeholder: "Choose..."
	}, options);
	var op_btn_list = "",
	selected_label = "Operator",
	radio = "";
	
	$.selected_menu = function(k, v) {
		var kk = k.replace("$", "");
		$("#" + options.id + "_operator").attr("class", "").addClass(kk).text(v);
		$("#autocomplete ul.dropdown-menu li").removeClass("active");
		$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
		$("#" + options.id).focus();
	};
	$.each(options.op, function(k, v) {
		if(v.key == "$i") {
			radio += '<div class="checkbox"><label><input type="checkbox" id="' + options.id + '_operator_i" ' + ((v.selected) ? 'checked="checked"' : "") + ' value="" /> ' + v.label + '</label></div>';
		} else {
			if(v.title == undefined) {
				if(v.selected){
					selected_label_key = v.key;
					selected_label_value = v.label;
					op_btn_list += '<li class="' + v.key.replace("$", "") + ' active"><a href="javascript:void(0);" onclick="$.selected_menu(\'' + v.key+ '\',\'' + v.label + '\')">' + v.label + '</a></li>';
				} else {
					op_btn_list += '<li class="' + v.key.replace("$", "") + '"><a href="javascript:void(0);" onclick="$.selected_menu(\'' + v.key + '\',\'' + v.label + '\')">' + v.label + '</a></li>';
				}
			}
		}
	});
	$(this).append('<div id="autocomplete"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + radio + '</div>');
	
	remoteAutocomplete = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: "http://192.168.20.208/API/?type=service&proxy=%QUERY",
			replace: function(url, query) {
				var state = "true&address=" + $.utf8_to_b64(service_dns + "Service.php?op=matchTermLabels&lang=en&param=" + $.rawurlencode('{"limit":50,"' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
				return url.replace("%QUERY", state);
			},
			filter: function (parsedResponse) {
				var res = [];
				$.each(parsedResponse, function(respType, v) {
					if(parsedResponse["status"].state == "ok" && parsedResponse["paging"].affected > 0) {
						if(respType == "results") {
							for (i = 0; i < v.length; i++) {
								var re = [];
								re["value"] = v[i];
								res.push(re);
							}
						}
					}
				});
				return res;
			}
		}
	});
	remoteAutocomplete.clearPrefetchCache();
	remoteAutocomplete.initialize();
	
	$("#" + options.id).typeahead({
		hint: true,
		highlight: true,
		minLength: 3,
		limit: 50
	}, {
		displayKey: "value",
		source: ((data == "remote") ? remoteAutocomplete.ttAdapter() : data)
	}).bind("keydown", "return", function(e) {
		if($.trim($(this).val()) !== "") {
			// ADD FUNCTION HERE (USER PRESS ENTER KEY)
			alert("ok");
		}
	});
	
	if (typeof callback == "function") {
		callback.call(this);
	}
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/**
/* Add a generic autocomplete form
*/
$.fn.addAutocomplete = function(options, data, callback) {
	var options = $.extend({
		id: "",
		class: "",
		placeholder: "Choose..."
	}, options);
	$(this).append('<div id="autocomplete"><input type="text" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div>');
	
	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			// an array that will be populated with substring matches
			matches = [];
			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');
			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					// the typeahead jQuery plugin expects suggestions to a
					// JavaScript object, refer to typeahead docs for more info
					matches.push({ value: str });
				}
			});
			cb(matches);
		};
	};
	$(this).find(".typeahead").typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'data',
		displayKey: 'value',
		source: substringMatcher(data)
	});
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */



$(document).ready(function() {
	$.ask_to_service("list-constants", function(system_constants) {
		$.ask_to_service(system_constants["kAPI_OP_LIST_OPERATORS"], function(r) {
			$.each(r, function(rx, rv) {
				if(rv.label !== undefined) {
					operators.push({"label": rv.label, "key": rv.key, "selected": rv.selected});
				} else {
					if(rx == "label") {
						operators.push({"label": rv});
					} else if(rx == "title") {
						operators.push({"title": rv});
					}
				}
			});
			$("#left_panel > .panel-body:first-child").after('<div class="panel-header"><h1>' + r["title"] + '</h1></div>')
			$("#left_panel > .panel-body:last-child").addTraitAutocomplete({
				id: "main_search",
				class: "",
				placeholder: r["placeholder"],
				op: operators
			}, "remote");
		});
	});
	/*
	$(this).find(".chosen-select").chosen({}).on("change", function(evt, params) {
		if (typeof callback == "function") {
			callback.call(this);
		}
	});
	$.update_chosen();
	*/
});