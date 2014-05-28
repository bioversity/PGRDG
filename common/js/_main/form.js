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
	var dictionary = response[kAPI_RESULTS_DICTIONARY],
	collection = dictionary[kAPI_DICTIONARY_COLLECTION],
	ids = dictionary[kAPI_DICTIONARY_IDS],
	cluster = dictionary[kAPI_DICTIONARY_CLUSTER],
	tags = dictionary.tags,
	form = "",
	forms = {},
	html_form = "",
	get_form_data = function(counter, data) {
		var form_data = {};
		
		$.each(data, function(ik, iv) {
			if(ik == kTAG_DATA_TYPE) {
				form_data.type = iv;
			}
			if(ik == kTAG_DATA_KIND) {
				form_data.kind = iv;
			}
			if(ik == kTAG_LABEL) {
				form_data.label = iv;
			}
			if(ik == kTAG_DESCRIPTION) {
				form_data.description = iv;
			}
			if(ik == kTAG_DEFINITION) {
				form_data.definition = iv;
			}
		});
		return form_data;
	},
	generate_form = function() {
		$.each(cluster, function(term, id_arr) {
			$.each(id_arr, function(idk, idv) {
				// Creates an object with all the forms
				//forms[idk] = get_form_data(idk, response.results[collection][idv]);
				
				forms = get_form_data(idk, response.results[collection][idv]);
				//console.log(forms.type, idv);
				
				if(forms.type == kTYPE_ENUM || forms.type == kTYPE_SET) {
					var url = {op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}};
					//console.log("LA URL", url);
					$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}}, function(res) {
						console.log("OKAY", lang);
					});
				}
				
				switch(forms.type){
					case kTYPE_FLOAT:
					case kTYPE_INT:
						// RANGE
						form = $.add_range();
						/*
						for (kind = 0; kind < forms.kind.length; kind++) {
							switch(forms.kind[kind]) {
								case kTYPE_LIST: // List
									//form = $.addChosen();
									break;
								case kTYPE_CATEGORICAL: // Categorical
														form = "Autocomplete";
									break;
								case kTYPE_DISCRETE: // Discrete
									form = $.add_simple_input();
									break;
								case kTYPE_QUANTITATIVE: // Quantitative
									form = $.add_range();
									break;
								case kTYPE_ENUM: // Enum
								case kTYPE_SET: // Enum-set
									form = $.add_chosen({multiple: true, tree_checkbox: true});
									break;
								default:
									form = $.add_input();
									break;
							}
						}
						*/
						break;
					case kTYPE_URL: // URL
					case kTYPE_STRING: // String
						// STRING
						form = $.add_input();
						/*
						for (kind = 0; kind < forms.kind.length; kind++) {
							//console.log(forms.kind[kind]);
							switch(forms.kind[kind]) {
								case kTYPE_LIST: // List
									form = $.add_chosen();
									break;
								case kTYPE_CATEGORICAL: // Categorical
														form = "Autocomplete";
									break;
								case kTYPE_DISCRETE: // Discrete
									form = $.add_chosen();
									break;
								case kTYPE_QUANTITATIVE: // Quantitative
									form = $.add_range();
									break;
								case kTYPE_ENUM: // Enum
								case kTYPE_SET: // Enum-set
									form = $.add_chosen({multiple: true, tree_checkbox: true});
									break;
								default:
									form = $.add_input();
									//form = $.add_chosen({multiple: true});
									break;
							}
						}
						*/
						break;
					case kTYPE_ENUM: // Enum
					case kTYPE_SET: // Enum-set
						// CHOSEN
						form = $.add_multiselect({multiple: true, tree_checkbox: true}, function() {
							/*
							$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}}, function(res) {
								console.log("YEAH!", res);
							});
							*/						
						});
						break;
					default:
						form = $.add_simple_input();
						break;
				}
				var enable_disable_btn = '<a href="javascript:void(0);" onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="pull-right" title="Enable this item"><span class="fa fa-square-o"></span></a>';
				
				var help = '<small class="help-block" style="color: #999; margin-bottom: -3px;"><br />' + ((forms.description !== undefined && forms.description.length > 0) ? ((forms.description !== undefined && forms.description.length > 0) ? forms.description : "") : ((forms.definition !== undefined && forms.definition.length > 0) ? forms.definition : "")) + '</small>';
				html_form += '<div class="col-lg-3 col-md-6 col-sm-12 vcenter"><div onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="panel-mask"><span class="fa fa-check"></span><small>activate</small></div><div class="panel panel-success disabled" title="This item is disable"><div class="panel-heading">' + enable_disable_btn + '<h3 class="panel-title"><span class="disabled">' + forms.label + help + '</span></h3></div><div class="panel-body"><p><tt>' + forms.type + "</tt><br /><tt>" + forms.kind + '</tt></p>' + form + '</div></div></div>';
			});
		});
		
		return '<div class="row">' + html_form + '</div>';
	};
	
	return generate_form();
	/*
	for (i = 0; i < ids.length; i++) {
		// getTagEnumerations suggested by Milko
		$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {tag: ids[i]}}}, function(res) {
			console.log(res);
		});
	}
	*/
};

/**
/* Change behavior depending if form is checked
*/
$.toggle_form_item = function(item, enumeration) {
	var $this = item,
	data = [];
	if($this.hasClass("panel-mask")) {
		var $panel = $this.next(".panel"),
		$panel_mask = $this;
		
	} else {
		var $panel = $this.closest(".panel"),
		$panel_mask = $panel.prev(".panel-mask");
	}
	if($panel.find("a.pull-right span").hasClass("fa-square-o")) {
		$panel_mask.fadeOut(300);
		$("#breadcrumb").fadeIn(300);
		$("#content-body").animate({"margin-top": "50px"});
		
		$panel.find("a.pull-right").attr("data-original-title", "Disable this item").tooltip("hide").find("span").removeClass("fa-square-o").addClass("fa-check-square-o");
		//console.log(item, enumeration);
		$panel.removeClass("disabled").attr("data-original-title", "").tooltip("destroy").find(".panel-heading h3 > span, .panel-body").removeClass("disabled");
		$panel.find("input").attr("disabled", false).closest(".panel").find("input").first().focus();
		$panel.find("button").attr("disabled", false);
		
		if($panel.find(".chosen-select").length > 0){
			$panel.find(".chosen-select").prop("disabled", false).trigger("chosen:updated");
		}
		if($panel.find("select.multiselect").length > 0){
			$panel.find("select.multiselect").multiselect("enable");
			
			if($panel.find("select.multiselect option").length == 0) {
				// Get tag enumeration
				$.ask_to_service({loaderType: $panel.find("a.pull-right"), op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: enumeration}}}, function(res) {
					$.each(res.results, function(k, v) {
						//console.log(k, v);
						data.push({label: '<i>' + v.label + '</i>', value: v.term});
						//$panel.find("select.multiselect").append('<option value="' + v.term + '">' + v.label + '</option>');
					});
					//console.log(data);
					$panel.find("select.multiselect").multiselect("dataprovider", data);
					$panel.find("select.multiselect").multiselect("rebuild");
					$panel.find("ul.multiselect-container").find(".label_icon").addClass("fa fa-caret-right");
					$panel.find("button.multiselect").closest(".btn-group").addClass("open");
					$panel.find("button.multiselect").focus();
				});
			} else {
				$panel.find("select.multiselect").multiselect("rebuild");
			}
		}
	} else {
		$panel_mask.fadeIn(300);
		$panel.find("a.pull-right").attr("data-original-title", "Enable this item").tooltip("hide").find("span").removeClass("fa-check-square-o").addClass("fa-square-o");
		
		$panel.addClass("disabled").attr("data-original-title", "This item is disable").tooltip().find(".panel-heading h3 > span, .panel-body").addClass("disabled");
		$panel.find("input").attr("disabled", true);
		$panel.find("button").attr("disabled", true);
		
		if($panel.find(".chosen-select").length > 0){
			$panel.find(".chosen-select").prop("disabled", true).trigger("chosen:updated");
		}
		if($panel.find("select.multiselect").length > 0){
			$panel.find("select.multiselect").multiselect("disable");
		}
		if($(".breadcrumb").html() == "") {
			$("#breadcrumb").fadeOut(300);
			$("#content-body").animate({"margin-top": "0px"});
		}
		$panel.prev(".panel-mask").css("display: block");
	}
	$(".row span.disabled, .panel-body.disabled").on("click", function(e) {
		console.log(e);
		//return false;
	});
};

$.toggle_json_source = function(item) {
	var $this = item;
	$($this).parents(".panel-heading").next().find(".panel-body > pre").slideToggle();
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
			node_heading_title = $('<h4 class="panel-title row"><div class="col-md-1 text-right pull-right"><a title="Remove" href="javascript:void(0);" onclick="$.remove_search($(this));"><span class="fa fa-times" style="color: #666;"></span></a></div><div class="col-lg-6"><span class="' + options.icon + '"></span>&nbsp;&nbsp;<a data-toggle="collapse" data-parent="#accordion" href="#' + options.id + '">' + options.title + '</a></div><div class="col-sm-5"><a href="javascript:void(0);" onclick="$.toggle_json_source($(this));" class="text-info" title="Show/hide json source"><span class="fa fa-code"></span> json</div></h4>'),
		node_body_collapse = $('<div id="' + options.id + '" class="panel-collapse collapse in">'),
			node_body = $('<div class="panel-body">' + options.content + '</div>');
	
	
	node_heading_title.appendTo(node_heading);
	node_heading.appendTo(root_node);
	node_body.appendTo(node_body_collapse);
	node_body_collapse.appendTo(root_node);
	
	$(this).find("#accordion").append(root_node);
	$("#accordion a").tooltip({container: "body"});

	$("select.chosen-select").chosen();
	$("select.multiselect").multiselect({
		buttonClass: "form-control",
		maxHeight: 200,
		includeSelectAllDivider: true,
		enableFiltering: true,
		templates: {
			filter: '<div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div>',
			li: '<li><a href="javascript:void(0);"><label><span class="label_icon"></span></label></a></li>'
		},
		onChange: function(element, checked) {
			$("button.multiselect").attr("data-original-title", $("button.multiselect").attr("title"));
		}
	});
	$("select.multiselect").multiselect("disable");
	
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
				var state = "true&address=" + $.utf8_to_b64("http://pgrdg.grinfo.private/Service.php?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
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
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
		$.execTraitAutocomplete(kAPI, function(response) {
			var the_title = "";
			if(response.paging.affected > 0) {
				$("#content-head .content-title").text('Output for "' + $("#" + options.id).val() + '"');
				$.each(operators, function(ck, cv) {
					if(cv.key == kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR][0]) {
						if(cv.main) {
							the_title = cv.title;
						} else {
							the_title += " " + '<i style="color: #666;">' + cv.title + '</i>';
						}
					}
				});
				
				// Create forms
				var forms = $.create_form(response);
				
				$("#content-body .content-body").addCollapsible({title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre style="display: none;">' + JSON.stringify(response, null, "\t") + '</pre><br />' + forms});
				$("#content-body .panel").tooltip();
				$.resize_forms_mask();
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
			kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
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
					
					// Create forms
					var forms = $.create_form(response);
					$("#content-head .content-title").text('Output for "' + $("#" + options.id).val() + '"');
					$("#content").fadeIn(300);
					$("#content-body .content-body").addCollapsible({title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre style="display: none;">' + JSON.stringify(response, null, "\t") + '</pre><br />' + forms});
					$("#content-body .panel").tooltip();
					$(".tt-dropdown-menu").css("display", "none");
					$.resize_forms_mask();
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
		if($("#apprise.reset-all").length > 0) {
			$("#apprise.reset-all").modal("show");
		} else {
			apprise("Are you sure?", {title: "Warning", icon: "warning", class: "reset-all", confirm: true}, function(r) {
				if(r) {
					$("#content-head #right_btn").fadeOut(300, function() {
						$("#content-head .content-title").text("Output");
						$("#breadcrumb").fadeOut(300).find(".breadcrumb").html("");
						$("#content-body .content-body").html("");
						$("input.typeahead.tt-input").val("").focus();
					});
				}
			});
		}
	} else {
		$("#content-head #right_btn").fadeOut(300, function() {
			$("#content-head .content-title").text("Output");
			$("#breadcrumb").fadeOut(300).find(".breadcrumb").html("");
			$("#content-body .content-body").html("");
			$("input.typeahead.tt-input").val("").focus();
		});
	}
};
$.execTraitAutocomplete = function(kAPI, callback) {
	$.ask_to_service(kAPI, function(response) {
		if (typeof callback == "function") {
			if(response.paging.affected > 0) {
				$("#content-head #right_btn").html('<span class="ionicons ion-trash-b"></span> Reset all').fadeIn(300, function() {
					$("#content-head #right_btn").on("click", function() {
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
/* FORM GENERATION
*/


/**
/* Add input form with operators select on its side
*/
$.selected_form_menu = function(id, k, v) {
	var kk = k.replace("$", "");
	$("#" + id + "_operator").attr("class", "").addClass(kk).text(v);
	$("#autocomplete ul.dropdown-menu li").removeClass("active");
	$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
	$("#" + id).focus();
	console.log("AAA: ", id);
};
$.add_input = function(options) {
	var options = $.extend({
		id: $.makeid(),
		class: "form-control",
		placeholder: "Enter value...",
		type: "text",
		disabled: true
	}, options),
	op_btn_list = "";
	
	$.each(operators, function(k, v) {
		if(v.main) {
			if(v.main !== undefined) {
				if(v.type == "string") {
					if(v.selected){
						if(v.main) {
							selected_label_key = v.key;
							selected_label_value = v.label;
						}
						op_btn_list += '<li class="' + v.key.replace("$", "") + ' active"><a href="javascript:void(0);" onclick="$.selected_form_menu(\'' + options.id + '\', \'' + v.key+ '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					} else {
						op_btn_list += '<li class="' + v.key.replace("$", "") + '"><a href="javascript:void(0);" onclick="$.selected_form_menu(\'' + options.id + '\', \'' + v.key + '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					}
				}
			}
		}
	});
	return '<div class="input-group"><div class="input-group-btn"><button ' + ((options.disabled) ? 'disabled="disabled"' : " ") + ' data-toggle="dropdown" class="btn btn-default-white dropdown-toggle" type="button"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>';
};

/**
/* Add simple input form
*/
$.add_simple_input = function(options) {
	var options = $.extend({
		id: $.makeid(),
		class: "form-control",
		placeholder: "Enter value...",
		type: "text",
		disabled: true
	}, options);
	
	return '<input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/>';
};

/**
/* Add range input group form
*/
$.add_range = function(options) {
	var options = $.extend({
		id: [$.makeid(), $.makeid()],
		class: ["form-control", "form-control"],
		placeholder: [0, 0],
		disabled: true
	}, options);
	return '<div class="input-group"><span class="input-group-addon_white">From</span><input class="' + options.class[0] + '" type="number" id="' + options.id[0] + '" name="" placeholder="' + options.placeholder[0] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/><span class="input-group-addon_white">to</span><input class="' + options.class[1] + '" type="number" id="' + options.id[1] + '" name="" placeholder="' + options.placeholder[1] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>';
};

/**
/* Add Chosen autocomplete
*/
$.add_chosen = function(options, content) {
	if(content == undefined || content == "") {
		content = [{text: "Test", value: "ok"}, {text: "Test", value: "jkhsdgf"}]; // <----------------------------------- Waiting right data from Milko's Service...
	} else {
		console.log("Chosen: ", content);
	}
	var options = $.extend({
		id: $.makeid(),
		class: "",
		placeholder: "Choose...",
		no_results_text: "",
		multiple: false,
		allow_single_deselect: true,
		max_select: 1,
		tree_checkbox: false,
		rtl: 0,
		btn_menu: {},
		disabled: true
	}, options);
	
	var select = '<select id="' + options.id + '" class="chosen-select form-control' + ((options.rtl) ? " chosen-rtl" : "") + '" ' + ((options.multiple) ? " multiple " : "") + 'data-placeholder="' + options.placeholder + '" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '>';
	for (var c = 0; c < content.length; c++) {
		if(content[c].value !== undefined) {
			select += '<option val="' + content[c].value + '">' + content[c].text + '</option>';
		}
	}
	select += '</select>';
	
	return select;
};

/**
/* Add Multiselect autocomplete
*/
$.add_multiselect = function(options, callback) {
	if(content == undefined || content == "") {
		content = [{text: '<span class="fa fa-spin fa-spinner"></span> Wait...', value: ""}]; // <----------------------------------- Waiting right data from Milko's Service...
	}
	var options = $.extend({
		id: $.makeid(),
		class: "",
		placeholder: "Choose...",
		no_results_text: "",
		multiple: false,
		allow_single_deselect: true,
		max_select: 1,
		tree_checkbox: false,
		rtl: 0,
		btn_menu: {},
		disabled: true
	}, options);
	
	var select = '<select id="' + options.id + '" class="multiselect form-control' + ((options.rtl) ? " rtl" : "") + '" ' + ((options.multiple) ? " multiple " : "") + 'data-placeholder="' + options.placeholder + '" ' + '></select>';
	
	if (typeof callback == "function") {
		callback.call(this);
	}
	return select;
};

/**
/* Add a generic autocomplete form
/*
/* Plugin
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

/**
/* Add Chosen form (select with search engine)
/*
/* Plugin
*/
$.fn.addChosen = function(options, content, callback) {
	var options = $.extend({
		id: $.makeid(),
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
		}, "remote", function() {
			operators = operators;
		});
		$.left_panel("open", "", function() {
			$("#content-body").fadeIn(300);
		});
	});
}

$.check_cookie = function(cname, callback) {
	if(typeof(cname) == "string") {
		cname = new Array(cname);
	}
	for(var q = 0; q < cname.length; q++) {
		var name = cname[q];
		
		if($.browser_cookie_status()) {
			if($.cookie("pgrdg_cache_" + name) == undefined) {
				// http://pgrdg.grinfo.private/Service.php?op={name}
				$.ask_to_service(name, function(system_constants) {
					$.cookie("pgrdg_cache_" + name, $.utf8_to_b64(JSON.stringify(system_constants)), { expires: 7, path: '/' });
					$.get_operators_list(system_constants);
					
					if (typeof callback == "function") {
						callback.call(this);
					}
				});
			} else {
				$.get_operators_list($.b64_to_utf8($.cookie("pgrdg_cache_" + name)));
				if (typeof callback == "function") {
					callback.call(this);
				}
			}
		}
	}
}
$(document).ready(function() {
	$(window).resize(function () {
		$.resize_forms_mask();
	});
	$.check_cookie("list-constants", function() {
		//$.check_cookie(kAPI_OP_LIST_REF_COUNTS); // Remind that you can pass also an array
	});
	$("button.dropdown-toggle").on("click", function(e) {
		e.preventDefault();
		if($(this).closest(".input-group-btn").hasClass("open")) {
			$(this).closest(".input-group-btn").removeClass("open");
		} else {
			$(this).closest(".input-group-btn").addClass("open");
		}
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