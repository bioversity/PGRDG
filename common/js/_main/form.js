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
/* Create the form
*/
$.create_form = function(response) {
	var dictionary = response.dictionary,
	collection = dictionary.collection,
	ids = dictionary[kAPI_DICTIONARY_IDS][0],
	tags = dictionary.tags;
	
	$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {tag: ids}}}, function(res) {
		console.log(res);
	});
	/*
	function get_definition_node(response) {
		$.each(response.results[collection][ids], function(ci_k, ci_v) {
			console.log(ci_k, ci_v);
			if(ci_k == kTAG_DATA_KIND) {
				var kind = ci_v;
			}
			get_keys(response);
		});
	}
	function get_keys(response) {
		$.each(tags, function(id, tag) {
			//console.log(id, tag);
		});
	}
	get_definition_node(response);sole.log("Dictionary:", dictionary);
	console.log("Collection:", collection);
	console.log("Ids:", ids);
	console.log("Tags:", tags);
	*/
};

/**
/* Add collapsible content
*/
$.fn.addCollapsible = function(options, callback) {
	var options = $.extend({
		title: "Collapsible panel",
		icon: "fa fa-search",
		content: "",
		id: $.makeid()
	}, options);
	
	if($("#accordion").length == 0) {
		$(this).append('<div class="panel-group" id="accordion">');
	} else {
		$(".collapse").collapse("hide");
	}
	
	var root_node = $('<div class="panel panel-default">'),
		node_heading = $('<div class="panel-heading">'),
			node_heading_title = $('<h4 class="panel-title"><span class="' + options.icon + '"></span>&nbsp;&nbsp;<a data-toggle="collapse" data-parent="#accordion" href="#' + options.id + '">' + options.title + '</a><a title="Remove" href="javascript:void(0);" onclick="$.remove_search($(this));" class="pull-right"><span class="fa fa-times" style="color: #666;"></span></a></h4>'),
		node_body_collapse = $('<div id="' + options.id + '" class="panel-collapse collapse in">'),
			node_body = $('<div class="panel-body">' + options.content + '</div>');
	
	
	node_heading_title.appendTo(node_heading);
	node_heading.appendTo(root_node);
	node_body.appendTo(node_body_collapse);
	node_body_collapse.appendTo(root_node);
	
	$(this).find("#accordion").append(root_node);
	$("#accordion a").tooltip();

	
	if (typeof callback == "function") {
		callback.call(this);
	}
};

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
	checkbox = "",
	user_input,
	is_autocompleted = false,
	selected_label_key = "",
	selected_label_value = "";
	
	$.selected_menu = function(k, v) {
		var kk = k.replace("$", "");
		$("#" + options.id + "_operator").attr("class", "").addClass(kk).text(v);
		$("#autocomplete ul.dropdown-menu li").removeClass("active");
		$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
		$("#" + options.id).focus();
	};
	$.each(options.op, function(k, v) {
		if(!v.main) {
			if(v.label !== undefined) {
				checkbox += '<div class="checkbox"><label title="' + ((v.title !== undefined) ? v.title : "") + '"><input type="checkbox" id="' + options.id + '_operator_' + v.key.replace("$", "") + '" ' + ((v.selected) ? 'checked="checked"' : "") + ' title="' + ((v.title !== undefined) ? v.title : "") + '" value="" /> ' + v.label + '</label></div>';
			}
		} else {
			if(v.main !== undefined) {
				if(v.type == "string") {
					if(v.selected){
						if(v.main) {
							selected_label_key = v.key;
							selected_label_value = v.label;
						}
						op_btn_list += '<li class="' + v.key.replace("$", "") + ' active"><a href="javascript:void(0);" onclick="$.selected_menu(\'' + v.key+ '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					} else {
						op_btn_list += '<li class="' + v.key.replace("$", "") + '"><a href="javascript:void(0);" onclick="$.selected_menu(\'' + v.key + '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					}
				}
			}
		}
	});
	$(this).append('<div id="autocomplete"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + checkbox + '</div>');
	
	remoteAutocomplete = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: service_url + "%QUERY",
			replace: function(url, query) {
				var state = "true&address=" + $.utf8_to_b64("http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&lang=" + lang + "&param=" + $.rawurlencode('{"limit":50,"' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
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
	}).on("typeahead:selected", function(){
		// Autocomplete
		var kAPI = new Object;
		kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
		kAPI["parameters"] = new Object;
		kAPI["parameters"][kAPI_REQUEST_LANGUAGE] = lang;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS] = new Object;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS]["log-request"] = "true";
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
		$.execTraitAutocomplete(kAPI, function(response) {
			var the_title = "";
			if(response.paging.affected > 0) {
				$("#content .content-title").text('Output for "' + $("#" + options.id).val() + '"');
				$.each(operators, function(ck, cv) {
					if(cv.key == kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR][0]) {
						if(cv.main) {
							the_title = cv.title;
						} else {
							the_title += " " + '<i style="color: #666;">' + cv.title + '</i>';
						}
					}
				});
				
				$("#content .content-body").addCollapsible({title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre>' + JSON.stringify(response, null, "\t") + '</pre>'});
				
				// Create forms
				$.create_form(response);
			}
		});
		is_autocompleted = true;
		return false;
	//}).on("keydown", "esc", function() {
	}).bind("keydown", "return", function(event) {
		$(this).trigger("typeahead:_changed");
		return false;
	}).on("typeahead:_changed", function(e) {
		// User input
		if(!is_autocompleted) {
			var kAPI = new Object;
			kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
			kAPI["parameters"] = new Object;
			kAPI["parameters"][kAPI_REQUEST_LANGUAGE] = lang;
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS] = new Object;
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS]["log-request"] = "true";
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class"), ($("#main_search_operator_i").is(":checked") ? '$i' : '"')];
			
			$.execTraitAutocomplete(kAPI, function(response) {
				var the_title = "";
				if(response.paging.affected > 0) {
					$.each(operators, function(ck, cv) {
						$.each(kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR], function(cck, ccv) {
							if(ccv == cv.key) {
								if(cv.main) {
									the_title = cv.title;
								} else {
									the_title += " " + '<i style="color: #666;">' + cv.title + '</i>';
								}
							}
						});
					});
					
					$("#content .content-title").text('Output for "' + $("#" + options.id).val() + '"');
					$("#content .content-body").addCollapsible({title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre>' + JSON.stringify(response, null, "\t") + '</pre>'});
					
					// Create forms
					$.create_form(response);
				}
			});
		}
		is_autocompleted = false;
		return false;
	}).bind("keydown", "alt+left", function(e) {
		$.left_panel("close", "", function() {
			$("#" + options.id).blur();
		});
		return false;
	}).bind("keydown", "alt+right", function(e) {
		$.left_panel("open");
		return false;
	});
	
	if (typeof callback == "function") {
		callback.call(this);
	}
};
$.remove_search = function(search) {
	$this = search;
	
	apprise("Are you sure to remove this search?", {title: "Warning", icon: "warning", confirm: true}, function(r) {
		if(r) {
			$($this).parents(".panel").fadeOut(300, function() {
				$(this).remove(); $("#main_search").focus();
				if($("#accordion .panel").length == 0) {
					$.reset_all_searches(false);
				}
			});
		}
	});
};
$.reset_all_searches = function(ask) {
	if(ask == undefined) {
		var ask = true;
	}
	var next = false;
	
	if(ask) {
		apprise("Are you sure?", {title: "Warning", icon: "warning", confirm: true}, function(r) {
			if(r) {
				$("#content #right_btn").fadeOut(300, function() {
					$("#content .content-title").text("Output");
					$("#content .content-body").html("");
					$("input.typeahead.tt-input").val("").focus();
				});
			}
		});
	} else {
		$("#content #right_btn").fadeOut(300, function() {
			$("#content .content-title").text("Output");
			$("#content .content-body").html("");
			$("input.typeahead.tt-input").val("").focus();
		});
	}
};
$.execTraitAutocomplete = function(kAPI, callback) {
	$.ask_to_service(kAPI, function(response) {
		if (typeof callback == "function") {
			if(response.paging.affected > 0) {
				$("#content #right_btn").html('<span class="ionicons ion-trash-b"></span> Reset all').fadeIn(300, function() {
					$("#content #right_btn").on("click", function() {
						$.reset_all_searches();
					});
				});
				callback.call(this, response);
			} else {
				apprise("Entered text has produced 0 results", {title: "No results", icon: "warning"}, function(r) {
					if(r) {
						$("#main_search").focus();
					}
				});
			}
		}
	});
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
	$(this).append('<div id="autocomplete">' + /*<span class="icomoon icon-spinner-2"></span> */ '<input type="text" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div>');
	
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


$.get_operators_list = function(system_constants) {
	if(typeof(system_constants) == "string") {
		system_constants = jQuery.parseJSON(system_constants);
	}
	
	$.ask_to_service(system_constants.results["kAPI_OP_LIST_OPERATORS"], function(oprts) {
		$.each(oprts.results, function(rx, rv) {
			if(rv.label !== undefined) {
				operators.push({"label": rv.label, "key": rv.key, "selected": rv.selected, "type": rv.type, "main": rv.main, "title": rv.title});
			} else {
				if(rx == "label") {
					operators.push({"label": rv});
				} else if(rx == "title") {
					operators.push({"title": rv});
				}
			}
		});
		$("#left_panel > .panel-body:first-child").after('<div class="panel-header"><h1>' + oprts.results.title + '</h1></div>')
		$("#left_panel > .panel-body:last-child").addTraitAutocomplete({
			id: "main_search",
			class: "",
			placeholder:  oprts.results.placeholder,
			op: operators
		}, "remote");
		$.left_panel("open", "", function() {
			$("#content").fadeIn(300);
		});
	});
}
$(document).ready(function() {
	if($.browser_cookie_status()) {
		if($.cookie("pgrdg_cache") == undefined) {
			// http://pgrdg.grinfo.private/Service.php?op=list-constants
			$.ask_to_service("list-constants", function(system_constants) {
				$.cookie("pgrdg_cache", $.utf8_to_b64(JSON.stringify(system_constants)), { expires: 7, path: '/' });
				$.get_operators_list(system_constants);
			});
		} else {
			$.get_operators_list($.b64_to_utf8($.cookie("pgrdg_cache")));
		}
	}
	/*
	$(this).find(".chosen-select").chosen({}).on("change", function(evt, params) {
		if (typeof callback == "function") {
			callback.call(this);
		}
	});
	$.update_chosen();
	*/
});