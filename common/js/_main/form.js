/**
/* Manage chosen form
/* Functions to be called inside the $.addChosen() plugin
*/
$.update_chosen = function() { $(this).trigger("chosen:updated"); };
$.focus_chosen = function() { $(this).trigger("chosen:activate"); };
$.open_chosen = function() { $(this).trigger("chosen:open"); };
$.close_chosen = function() { $(this).trigger("chosen:close"); };
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
$.get_title = function(v) {
	return ((v.description !== undefined && v.description.length > 0) ? ((v.description !== undefined && v.description.length > 0) ? v.description : "") : ((v.definition !== undefined && v.definition.length > 0) ? v.definition : ""))
};

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
			if(ik == kTAG_UNIT_COUNT) {
				form_data.count = iv;
			}
			if(ik == kTAG_MIN_VAL) {
				form_data.min = iv;
			}
			if(ik == kTAG_MAX_VAL) {
				form_data.max = iv;
			}
		});
		return form_data;
	},
	is_kind_quantitative = function() {
		return ($.inArray(kTYPE_QUANTITATIVE, forms.kind) == 0) ? true : false;
	},
	generate_form = function() {
		$.each(cluster, function(term, id_arr) {
			$.each(id_arr, function(idk, idv) {
				// Creates an object with all the forms
				//forms[idk] = get_form_data(idk, response.results[collection][idv]);
				
				forms = get_form_data(idk, response.results[collection][idv]);
				
				/* DEPRECATED
				if(forms.type == kTYPE_ENUM || forms.type == kTYPE_SET) {
					var url = {op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}};
					//console.log("LA URL", url);
					$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}}, function(res) {
						console.log("OKAY", lang);
					});
				}
				*/
				forms.size = "single";
				
				if(is_kind_quantitative()) {
					form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max});
					forms.size = "double";
				} else {
					switch(forms.type){
						case kTYPE_FLOAT:
						case kTYPE_INT:
							// RANGE
							form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max});
							forms.size = "double";
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
										form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max});
										forms.size = "double";
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
										form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max});
										forms.size = "double";
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
							form = $.add_multiselect({tree_checkbox: true}, function() {
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
				}
				switch(forms.size) {
					case "double":
						var form_size = "col-lg-6 col-md-9 col-sm-12";
						break;
					case "single":
					default:
						var form_size = "col-lg-3 col-md-6 col-sm-12";
						break;
				}
				var enable_disable_btn = '<a href="javascript:void(0);" onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="pull-left" title="Enable this item"><span class="fa fa-square-o"></span></a>',
				badge = '<span class="badge pull-right">' + ((forms.count !== undefined && forms.count > 0) ? forms.count : 0) + '</span>',
				mask = ((forms.count !== undefined && forms.count > 0) ? '<div onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="panel-mask"><span class="fa fa-check"></span><small>activate</small></div>' : '<div class="panel-mask unselectable"></div>');
				//mask = '<div onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="panel-mask"><span class="fa fa-check"></span><small>activate</small></div>';
				
				var help = '<small class="help-block" style="color: #999; margin-bottom: -3px;"><br />' + $.get_title(forms) + '</small>',
				secret_input = '<input type="hidden" name="type" value="' + forms.type + '" /><input type="hidden" name="kind" value="' + forms.kind + '" /><input type="hidden" name="tags" value="' + idv + '" />';
				html_form += '<div class="' + form_size + " " + $.md5(idv) + ' vcenter">' + mask + '<div class="panel panel-success disabled" title="This item is disable"><div class="panel-heading">' + enable_disable_btn + '<h3 class="panel-title"><span class="disabled">' + forms.label + badge + help + '</span></h3></div><div class="panel-body"><p><tt>' + forms.type + "</tt><br /><tt>" + forms.kind + '</tt></p><form onsubmit="false">' + secret_input + form + '</form></div></div></div>';
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
$.toggle_form_item = function(item, tag) {
	var $this = item,
	data = [];
	if($this.hasClass("panel-mask")) {
		var $panel = $this.next(".panel"),
		$panel_mask = $this;
	} else {
		var $panel = $this.closest(".panel"),
		$panel_mask = $panel.prev(".panel-mask");
	}
	if($panel.find("a.pull-left span, a.pull-right span").hasClass("fa-square-o")) {
		// Disable other items with same tag
		$("." + $.md5(tag) + " > div.panel-mask").addClass("unselectable").attr("noclick", $("." + $.md5(tag) + " > div.panel-mask").attr("onclick")).attr("onclick", "");
		$this.closest("vcenter").removeClass("unselectable").attr("onclick", $("." + $.md5(tag) + " > div.panel-mask").attr("noclick")).attr("noclick", "");
		
		$panel.find("a.pull-left, a.pull-right").attr("data-original-title", "Disable this item").tooltip("hide").find("span").removeClass("fa-square-o").addClass("fa-check-square-o");
		$panel.removeClass("disabled").attr("data-original-title", "").tooltip("destroy").find(".panel-heading h3 > span, .panel-body").removeClass("disabled");
		$panel.find("input").attr("disabled", false).closest(".panel").find("input:not([type=hidden])").first().focus();
		$panel.find("button").attr("disabled", false);
		
		if($panel.find(".chosen-select").length > 0){
			$panel.find(".chosen-select").prop("disabled", false).trigger("chosen:updated");
		}
		// Treeselect
		if($panel.find("a.treeselect").length > 0){
			$panel.find("a.treeselect").addClass("disabled");
			var treeselect_id = $panel.find("a.treeselect").attr("id");
			var treeselect_content = '<div style="overflow-y: auto; overflow-x: hidden; height: 200px; margin: 0 -10px;"><ul class="list-unstyled">';
			
			$.ask_to_service({loaderType: $panel.find("a.pull-left, a.pull-right"), op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: tag}}}, function(res) {
				$panel.find("a.treeselect").removeClass("disabled");
				$.each(res.results, function(k, v) {
					treeselect_content += $.create_tree(v, $panel);
				});
				treeselect_content += '</ul>';
			});
			if($("body > .popover").length > 0) {
				console.log("exists");
				if(!$("body > .popover").hasClass("in")) {
				console.log("visible");
					$("body > .popover").addClass("in");
				} else {
				console.log("not visible");
					$("body > .popover").removeClass("in");
				}
			} else {
				$panel.find("a.treeselect").popover({
					html: true,
					placement: "auto",
					title: '<div class="input-group"><input type="text" class="form-control" placeholder="Filter" /><span class="input-group-addon"><span class="fa fa-search"></span></span></div>',
					content: function() {
						treeselect_content += '</ul></li></ul></div>';
						return treeselect_content;
					},
					container: "body"
				}).on("shown.bs.popover", function(e) {
					$.check_treeselect($panel);
					$(".popover-title input").keyup( function() {
						var that = this;
						// affect all table rows on in systems table
						var tableBody = $(".popover-content > div");
						var tableRowsClass = $(".popover-content > div li");
						
						tableRowsClass.each(function(i, val) {
							//Lower text for case insensitive
							var rowText = $(val).text().toLowerCase();
							var inputText = $(that).val().toLowerCase();
							
							if(rowText.indexOf( inputText ) == -1) {
								//hide rows
								tableRowsClass.eq(i).hide();
							} else {
								$(".search-sf").remove();
								tableRowsClass.eq(i).show();
							}
						});
						//all tr elements are hidden
						if(tableRowsClass.children(":visible").length == 0) {
							if(tableBody.find(".search-sf").length == 0) {
								tableBody.prepend('<div class="search-sf"><span class="text-muted">No entries found.</span></div>');
							}
						}
					}).focus();
					$(".popover-body li").tooltip();
					$("body").on("click", function (e) {
						$('[data-toggle="popover"]').each(function () {
							if (!$(this).is(e.target)) {
								if($(this).has(e.target).length === 0 && $(".popover").has(e.target).length === 0) {
									$(this).popover("hide");
								}
							} else {
								$(this).popover("show");
							}
						});
					});
				});
			}
		}
		$panel_mask.fadeOut(300);
		$(".save_btn").removeClass("disabled");
	} else {
		// Anable all items with same tag
		$("." + $.md5(tag) + " > div.panel-mask").removeClass("unselectable").attr("onclick", $("." + $.md5(tag) + " > div.panel-mask").attr("noclick")).attr("noclick", "");
		
		var forms_count = 0;
		$panel_mask.fadeIn(300);
		$panel.find("a.pull-left, a.pull-right").attr("data-original-title", "Enable this item").tooltip("hide").find("span").removeClass("fa-check-square-o").addClass("fa-square-o");
		
		$panel.addClass("disabled").attr("data-original-title", "This item is disable").tooltip().find(".panel-heading h3 > span, .panel-body").addClass("disabled");
		$panel.find("input").attr("disabled", true);
		$panel.find("button").attr("disabled", true);
		
		if($panel.find(".chosen-select").length > 0){
			$panel.find(".chosen-select").prop("disabled", true).trigger("chosen:updated");
		}
		// Treeselect
		if($panel.find("a.treeselect").length > 0){
			$panel.find("a.treeselect").addClass("disabled");
		}
		$.each($("#accordion > div.panel-default"), function(k, v) {
			$.each($(this).find("div.panel-success:not(.disabled)"), function(i, v) {
				forms_count++;
			});
		});
		if(forms_count == 0) {
			$(".save_btn").addClass("disabled");
		}
		$panel.prev(".panel-mask").css("display: block");
	}
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
	
	var root_node = $('<div id="' + options.id + '" class="panel panel-default">'),
		node_heading = $('<div class="panel-heading">'),
			node_heading_title = $('<h4 class="panel-title row"><div class="col-md-1 text-right pull-right"><a title="Remove" href="javascript:void(0);" onclick="$.remove_search($(this));"><span class="fa fa-times" style="color: #666;"></span></a></div><div class="col-lg-6"><span class="' + options.icon + '"></span>&nbsp;&nbsp;<a data-toggle="collapse" data-parent="#accordion" href="#' + options.id + '_collapse">' + options.title + '</a></div><div class="col-sm-5"><a href="javascript:void(0);" onclick="$(\'#' + options.id + '_collapse > .panel-body > pre\').slideToggle()" class="text-info" title="Show/hide json source"><span class="fa fa-file-code-o"></span> json</div></h4>'),
		node_body_collapse = $('<div id="' + options.id + '_collapse" class="panel-collapse collapse in">'),
			node_body = $('<div class="panel-body">' + options.content + '</div>');
	
	
	node_heading_title.appendTo(node_heading);
	node_heading.appendTo(root_node);
	node_body.appendTo(node_body_collapse);
	node_body_collapse.appendTo(root_node);
	
	$(this).find("#accordion").append(root_node);
	$("#accordion a").tooltip({container: "body"});

	$("select.chosen-select").chosen();
	/*
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
	*/
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
				var state = "true&address=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '":"' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
				//var state = "true&address=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '": "' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
				return url.replace("%QUERY", state);
			},
			filter: function (parsedResponse) {
				var res = [];
				$.each(parsedResponse, function(respType, v) {
					if(parsedResponse["status"].state == "ok" && parsedResponse["paging"].affected > 0) {
						if(respType == "results") {
							for (i = 0; i < parsedResponse["paging"]["affected"]; i++) {
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
		//source: ((data == "remote") ? remoteAutocomplete.ttAdapter() : data)
		source: remoteAutocomplete.ttAdapter()
	}).on("typeahead:selected", function(){
		// Autocomplete
		$.manage_url("Forms");
		
		var kAPI = new Object;
		kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
		kAPI["parameters"] = new Object;
		kAPI["parameters"][kAPI_REQUEST_LANGUAGE] = lang;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS] = new Object;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
		kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
		$.execTraitAutocomplete(kAPI, function(response) {
			if($("#accordion > #" + response.id).length == 0) {
				var the_title = "";
				if(response.paging.affected > 0) {
					$("#forms-head .content-title").html('Output for "' + $("#" + options.id).val() + '"');
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
					
					$("#forms-body .content-body").addCollapsible({id: response.id, title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre style="display: none;">' + JSON.stringify(response, null, "\t") + '</pre><br />' + forms});
					$("#forms-body .panel").tooltip();
					$.resize_forms_mask();
					$("#autocomplete .typeahead").trigger("blur");
				}
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
		if($("#" + options.id).val().length >= 3) { 
			if(!is_autocompleted) {
				$.manage_url("Forms");
				
				var kAPI = new Object;
				kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
				kAPI["parameters"] = new Object;
				kAPI["parameters"][kAPI_REQUEST_LANGUAGE] = lang;
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS] = new Object;
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
				kAPI["parameters"][kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class"), ($("#main_search_operator_i").is(":checked") ? '$i' : '"')];
				
				$.execTraitAutocomplete(kAPI, function(response) {
					if($("#accordion > #" + response.id).length == 0) {
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
							$("#forms-head .content-title").html('Output for "' + $("#" + options.id).val() + '"');
							$("#forms").fadeIn(300);
							$("#forms-body .content-body").addCollapsible({id: response.id, title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre style="display: none;">' + JSON.stringify(response, null, "\t") + '</pre><br />' + forms});
							$("#forms-body .panel").tooltip();
							$(".tt-dropdown-menu").css("display", "none");
							$.resize_forms_mask();
							$("#autocomplete .typeahead").trigger("blur");
						}
					}
				});
			}
			is_autocompleted = false;
		}
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
	$this = search,
	search_id = $this.closest(".panel").attr("id");
	
	apprise("Are you sure to remove this search?<br />", {title: "Warning", icon: "warning", confirm: true}, function(r) {
		if(r) {
			$($this).parents(".panel").fadeOut(300, function() {
				storage.remove("pgrdg_cache.ask." + search_id);
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
	
	console.log($("#accordion > div.panel"));
	if(ask) {
		if($("#apprise.reset-all").length > 0) {
			$("#apprise.reset-all").modal("show");
		} else {
			apprise("Are you sure?", {title: "Warning", icon: "warning", class: "reset-all", confirm: true}, function(r) {
				if(r) {
					$("#forms-head #right_btn, #forms-head .save_btn").fadeOut(300, function() {
						$("#forms-head .content-title").text("");
						$("#forms-body .content-body").html("");
						$("input.typeahead.tt-input").val("").focus();
					});
				}
			});
		}
	} else {
		$("#forms-head #right_btn, #forms-head .save_btn").fadeOut(300, function() {
			$("#forms-head .content-title").text("Output");
			$("#forms-body .content-body").html("");
			$("input.typeahead.tt-input").val("").focus();
		});
	}
};
$.execTraitAutocomplete = function(kAPI, callback) {
	if($("#breadcrumb").css("display") == "none") {
		$("#breadcrumb").fadeIn(200);
	}
	$.ask_to_service(kAPI, function(response) {
		if (typeof callback == "function") {
			if(response.paging.affected > 0) {
				var selected_forms = {}, form_data = {};
				$("#forms-head #right_btn").html('<span class="ionicons ion-trash-b"></span> Reset all').fadeIn(300, function() {
					$("#forms-head #right_btn").on("click", function() {
						$.reset_all_searches();
					});
				});
				$("section.container").animate({"padding-top": "39px"});
				$("#breadcrumb").animate({"top": "110px"});
				if($("#forms-head .btn-group a.save_btn").length == 0) {
					$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn disabled" style="display: none;">Search <span class="fa fa-chevron-right"></span></a>');
				}
				$("#forms").fadeIn(300);
				$("#forms-head .btn-group a.save_btn").fadeIn(300, function() {
					var active_forms = {};
					$(this).on("click", function() {
						form_data.history = storage.get("pgrdg_cache.ask");
						$.each($("#accordion > div.panel-default"), function(k, v) {
							frm_keys = $(this).attr("id");
							selected_forms[frm_keys] = {}
							selected_forms[frm_keys].request = storage.get("pgrdg_cache.ask." + frm_keys);
							selected_forms[frm_keys].key = $(this).attr("id");
							selected_forms[frm_keys].forms = [];
								
							$.each($(this).find("div.panel-success:not(.disabled)"), function(i, v) {
								var af_obj = $(this).find("form").serializeObject();
								
								switch(af_obj["input-type"]) {
									case kAPI_PARAM_INPUT_ENUM:
										var rt = {};
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										rt[kAPI_RESULT_ENUM_TERM] = af_obj.term.split(",");
										active_forms[af_obj.tags] = rt;
										break;
									case kAPI_PARAM_INPUT_RANGE:
										var rt = {};
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										rt[kAPI_PARAM_RANGE_MIN] = af_obj.from;
										rt[kAPI_PARAM_RANGE_MAX] = af_obj.to;
										rt[kAPI_PARAM_OPERATOR] = [af_obj.operator];
										active_forms[af_obj.tags] = rt;
										break;
									case kAPI_PARAM_INPUT_STRING:
										var rt = {};
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										rt[kAPI_PARAM_PATTERN] = af_obj.stringselect;
										rt[kAPI_PARAM_OPERATOR] = [af_obj.operator, af_obj.case_sensitive];
										active_forms[af_obj.tags] = rt;
										break;
								}
								selected_forms[frm_keys].forms.push($(this).find("form").serializeObject());
							});
						});
						form_data.form = selected_forms;
						
						$.show_summary(active_forms);
						//console.log(operators);
						//console.log(JSON.stringify(form_data));
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
$.activate_panel = function(type, options) {
	var options = $.extend({
		res: ""
	}, options)
	
	$.manage_url($.ucfirst(type));

	//console.log(type);
	if(type !== "map") {
		$("#" + type + "-head .content-title").html("Search " + type.toLowerCase());
		
		$("#" + type + "-body .content-body").html("");
		if(type !== "results") {
			$.each(options.res.results, function(domain, values) {
				$("#" + type + "-body .content-body").append('<div class="panel panel-success"><div class="panel-heading"><h4 class="list-group-item-heading">' + values[kTAG_LABEL] + ' <span class="badge pull-right">' + values[kAPI_PARAM_RESPONSE_COUNT] + '</span></h4></div><div class="panel-body"><div class="btn-group pull-right"><a class="btn btn-default-white" href="javascript: void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + domain + '\')">View raw data <span class="fa fa-th"></span></a><a onclick="$.show_data_on_map(\'' + options.res.id + '\', \'' + domain + '\')" class="btn btn-default">View on map <span class="ionicons ion-map"></a></div>' + values[kTAG_DEFINITION] + '</div></div>');
			});
		} else {
			console.log(options.res);
			var collection = options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_COLLECTION],
			dictionary = options.res[kAPI_RESULTS_DICTIONARY];
			$("#" + type + "-body .content-body").append('<table id="' + options.res.id + '" class="table table-striped table-hover table-responsive"></table>');
				var cols, cells, tag_codes = [], column = [];
				
				////////////////////////////////////////////////////////////////////////////// CREATE SERVICE DATA MANAGEMENT FUNCTION
				$.each(dictionary[kAPI_DICTIONARY_LIST_COLS], function(c, tag_code) {
					var tag_id = dictionary[kAPI_DICTIONARY_TAGS][tag_code];
					tag_codes.push(tag_code);
					column.push({
						label: options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id][kTAG_LABEL],
						description: options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id][kTAG_DESCRIPTION],
						type: options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id][kTAG_DATA_TYPE]
					});
					// Fare le popover per le description
					cols += '<th>' + options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id][kTAG_LABEL] + '</th>';
				});
				
				$("table#" + options.res.id).html('<thead><tr>' + cols + '</tr></thead><tbody></tbody>');
					console.dir(column);
				$.each(dictionary[kAPI_DICTIONARY_IDS], function(c, id) {
					cells = "";
					$.each(tag_codes, function(i, tag_c) {
						//console.log(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG], tag_c);
						var type = options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][dictionary[kAPI_DICTIONARY_TAGS][tag_c]][kTAG_DATA_TYPE];
						if(type == kTYPE_ENUM || type == kTYPE_SET) {
							cells +=  '<td>' + options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][options.res[kAPI_RESPONSE_RESULTS][collection][id][tag_c]][kTAG_LABEL] + '</td>';
						} else {
							cells +=  '<td>' + options.res[kAPI_RESPONSE_RESULTS][collection][id][tag_c] + '</td>';
						}
					});
					$("table#" + options.res.id + " tbody").append('<tr>' + cells + '</tr>');
				});
				
				
				var actual = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_ACTUAL],
				affected = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED],
				limit = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_LIMIT],
				skipped = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_SKIP],
				
				////////////////////////////////////////////////////////////////////////////// CREATE PAGING FUNCTION
				page_count = Math.ceil(affected / limit),
				current_page = Math.ceil(page_count - (affected / ((skipped + 1) * limit))),
				first_page = 0,
				previous_page = ((skipped - limit) > 0) ? skipped - limit : 0,
				next_page = skipped + limit,
				previous_skip = skipped - limit,
				next_skip = skipped + limit,
				last_skip = (page_count - 1) * limit,
				last_page = page_count * limit;
				
				page_btns = '<div class="form-group">';
					page_btns += '<a href="javascript:void(0);" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="First page"><span class="fa fa fa-angle-double-left"></a>';
				page_btns += '</div>&nbsp;';
				page_btns += '<div class="form-group">';
					page_btns += '<div class="input-group">';
						page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + previous_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="Previous page"><span class="fa fa-angle-left"></a></span>';
						page_btns += '<span class="input-group-addon">Page</span>';
						page_btns += '<input type="number" min="1" max="' + page_count + '" class="form-control" style="width: 75px;" placeholder="Current page" value="' + current_page + '" />';
						page_btns += '<span class="input-group-addon">of ' + page_count + '</span>';
						page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + next_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((last_page == 1) ? ' disabled' : '') + '" title="Nex page"><span class="fa fa-angle-right"></a></span>';
					page_btns += '</div>';
				page_btns += '</div>&nbsp;';
				page_btns += '<div class="btn-group">';
					page_btns += '<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + last_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((last_page == 1) ? ' disabled' : '') + '" title="Last page"><span class="fa fa-angle-double-right"></a>';
				page_btns += '</div>';
				//////////////////////////////////////////////////////////////////////////////
				
				$("table#" + options.res.id).append('<tfoot><tr><td colspan="4"><form class="form-inline text-center" role="form">' + page_btns + '</form></td></tr></tfoot>');
		}
		$("#contents #" + type + "").fadeIn(300);
	} else {
		if($("#pgrdg_map").children().length == 0) {
			$.init_map();
		}
		$("#pgrdg_map").fadeIn(600);
		$.each(options.res, function(k, v) {
			if(v[options.shape].type == "Point") {
				//console.warn(options.res);
				$.add_marker({
					uuid: $.md5(v["_id"]),
					type: "marker",
					size: "0.75em",
					lon: v[options.shape].coordinates[0],
					lat: v[options.shape].coordinates[1],
					cloud: false
				});
			}
		});
	}
};
$.show_summary = function(active_forms) {
	$.ask_to_service({
		op: kAPI_OP_MATCH_UNITS,
		parameters: {
			lang: lang,
			param: {
				limit: 300,
				criteria: active_forms,
				grouping: []
			}
		}
	}, function(res) {
		$.activate_panel("summary", {res: res});
	});
};
$.show_raw_data = function(id, domain, skip, limit) {
	if(skip == undefined || skip == null || skip == "") { var skip = 0; }
	if(limit == undefined || limit == null || limit == "") { var limit = 50; }
	
	var summaries_data = storage.get("pgrdg_cache.ask." + id),
	objp = new Object;
		objp[kAPI_PAGING_LIMIT] = limit;
		objp[kAPI_PAGING_SKIP] = skip;
		objp[kAPI_PARAM_LOG_REQUEST] = "true";
		objp[kAPI_PARAM_CRITERIA] = summaries_data.query.obj.params.criteria;
		objp[kAPI_PARAM_DOMAIN] = domain;
		objp[kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_RECORD;
	$.ask_to_service({
		op: kAPI_OP_MATCH_UNITS,
		parameters: {
			lang: lang,
			param: objp
		}
	}, function(res) {
		$.activate_panel("results", {domain: domain, res: res});
	});
	/*
	if(type == "map") {
		$.activate_panel("map", {res: decrypted_data});
	} else {
		$.activate_panel("results", {res: decrypted_data});
	}
	*/
};
$.show_data_on_map = function(id, domain) {
	//console.log(id, domain);
	var summaries_data = storage.get("pgrdg_cache.ask." + id),
	geometry = [],
	arr = $.get_current_bbox_pgrdg(default_bbox);
	geometry.push(arr),
	objp = new Object;
		objp[kAPI_PAGING_LIMIT] = 1000;
		objp[kAPI_PARAM_LOG_REQUEST] = "true";
		objp[kAPI_PARAM_CRITERIA] = summaries_data.query.obj.params.criteria;
		objp[kAPI_PARAM_DOMAIN] = domain;
		objp[kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_MARKER;
		objp[kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
		objp[kAPI_PARAM_SHAPE] = new Object;
		objp[kAPI_PARAM_SHAPE][kTAG_TYPE] = "Polygon";
		objp[kAPI_PARAM_SHAPE][kTAG_GEOMETRY] = geometry;
	$.ask_to_service({
		op: kAPI_OP_MATCH_UNITS,
		parameters: {
			lang: lang,
			param: objp
		}
	}, function(res) {
			console.log(res);
		if(res.paging.affected > 0) {
			var map_data = [];
			
			//console.log(res.results);
			$.each(res.results, function(i, k) {
				map_data.push(k);
			});
			$.activate_panel("map", {res: map_data, shape: kTAG_GEO_SHAPE});
		} else {
			alert("No results");
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
	if(id == "main_search") {
		$("#autocomplete ul.dropdown-menu li").removeClass("active");
		$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
	} else {
		$("#" + id + "_operator_type_ul li").removeClass("active");
		$("#" + id + "_operator_type_ul li." + kk).addClass("active");
		$("#" + id + "_operator_type").val(k);
	}
	$("#" + id).focus();
	//console.log("AAA: ", id);
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
		if(!v.main) {
			if(v.label !== undefined) {
				checkbox += '<div class="checkbox"><label title="' + ((v.title !== undefined) ? v.title : "") + '"><input type="checkbox" id="' + options.id[0] + '_operator_' + v.key.replace("$", "") + '" ' + ((v.selected) ? 'checked="checked"' : "") + ' title="' + ((v.title !== undefined) ? v.title : "") + '" name="case_sensitive" value="" /> ' + v.label + '</label></div>';
			}
		} else {
			checkbox = "";
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
	return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_STRING + '" /><input id="' + options.id + '_operator_type" type="hidden" name="operator" value="' + selected_label_key + '" /><div class="input-group"><div class="input-group-btn"><button ' + ((options.disabled) ? 'disabled="disabled"' : " ") + ' data-toggle="dropdown" class="btn btn-default-white dropdown-toggle" type="button"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="stringselect" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>' + checkbox + '';
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
	
	return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_DEFAULT + '" /><input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="' + options.id + '" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/>';
};

/**
/* Add range input group form
*/
$.check_range_value = function(item) {
	var $this = item;
	$this.val(($this.val() == "" ) ? $this.attr("placeholder") : $this.val());
};
$.add_range = function(options) {
	var options = $.extend({
		id: [$.makeid(), $.makeid()],
		class: ["form-control", "form-control"],
		placeholder: [0, 0],
		min: 0,
		max: 0,
		type: "",
		disabled: true
	}, options),
	op_btn_list = "",
	checkbox = "";
	input_type = (options.type == kTYPE_INT || options.type == kTYPE_FLOAT) ? "number" : "text",
	placeholder = [(options.placeholder[0] !== undefined) ? options.placeholder[0] : 0, (options.placeholder[1] !== undefined) ? options.placeholder[1] : 0],
	min = (options.min !== undefined) ? options.min : options.placeholder[0],
	max = (options.max !== undefined) ? options.max : options.placeholder[1];
	$.each(operators, function(k, v) {
		if(v.main) {
			if(v.main !== undefined) {
				if(v.type == "range") {
					if(v.selected){
						if(v.main) {
							selected_label_key = v.key;
							selected_label_value = v.label;
						}
						op_btn_list += '<li class="' + v.key.replace("$", "") + ' active"><a href="javascript:void(0);" onclick="$.selected_form_menu(\'' + options.id[0] + '\', \'' + v.key+ '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					} else {
						op_btn_list += '<li class="' + v.key.replace("$", "") + '"><a href="javascript:void(0);" onclick="$.selected_form_menu(\'' + options.id[0] + '\', \'' + v.key + '\',\'' + v.label + '\')">' + v.label + '</a></li>';
					}
				}
			}
		}
	});
	return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_RANGE + '" /><div class="input-group"><input id="' + options.id[0] + '_operator_type" type="hidden" name="operator" value="' + selected_label_key + '" /><div class="input-group-btn"><button ' + ((options.disabled) ? 'disabled="disabled"' : " ") + ' data-toggle="dropdown" class="btn btn-default-white dropdown-toggle" type="button"><span id="' + options.id[0] + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu" id="' + options.id[0] + '_operator_type_ul">' + op_btn_list + '</ul></div><span class="input-group-addon_white">From</span><input class="' + options.class[0] + '" type="' + input_type + '" id="' + options.id[0] + '" onblur="$.check_range_value($(this))" name="from" min="' + min + '" max="' + max + '" placeholder="' + placeholder[0] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/><span class="input-group-addon_white">to</span><input class="' + options.class[1] + '" type="' + input_type + '" id="' + options.id[1] + '" name="to" min="' + min + '" max="' + max + '" placeholder="' + placeholder[1] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>';
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
$.create_tree = function(v, item) {
	$.get_node = function(node) {
		$param = item;
		if(!$("#node_" + node).hasClass("open")) {
			$("#" + node + "_toggler").find("span").removeClass("fa-caret-right").addClass("fa-caret-down");
			
			if($("#node_" + node).html() == "") {
				$("#node_" + node).show().html('<span class="fa fa-refresh fa-spin"></span> Retriving data...');
				$.ask_to_service({loaderType: $panel.find("a.pull-left, a.pull-right"), op: kAPI_OP_GET_NODE_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, node: node}}}, function(res) {	
					//$("#" + node + "_toggler").find("span").removeClass("fa-caret-right").addClass("fa-caret-down");
					$("#node_" + node).html("").css("display", "none");
					$.each(res.results, function(k, v) {
						$("#node_" + node).append($.create_tree(v, $panel)).addClass("open");
						//data.push({label: '<i>' + v.label + '</i>', value: v.term});
					});
					$("#node_" + node).slideDown(300);
					$.check_treeselect($panel);
				});
			} else {
				$("#node_" + node).addClass("open").slideDown(300);
			}
		} else {
			$("#" + node + "_toggler").find("span").removeClass("fa-caret-down").addClass("fa-caret-right");
			$("#node_" + node).slideUp(300).removeClass("open");
		}
	}
	var $panel = item,
	panel_input_term_id = $panel.find('input[name="term"]').attr("id");
	content = "",
	triangle = '<a class="tree-toggler text-muted" onclick="$.get_node(\'' + v.node + '\');" id="' + v.node + '_toggler" href="javascript: void(0);"><span class="fa fa-fw fa-caret-right"></a>',
	checkbox = '<div class="checkbox"><label><input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" /> {LABEL}</label></div>';
	checkbox_inline = '<div class="checkbox-inline"><label><input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" /> {LABEL}</label></div>';
	
	if (v.children !== undefined && v.children > 0) {
		content += '<li class="list-group-item-heading">' + triangle + '<span title="' + $.get_title(v) + '">' + ((v.value !== undefined && v.value == true) ? checkbox_inline.replace("{LABEL}", v.label) : '<a class="btn-text" href="javascript: void(0);">' + v.label + '</a>') + '</span>' + '<ul id="node_' + v.node + '" style="display: none;" class="nav nav-list tree"></ul>';
	} else {
		content += '<li class="list-group-item" value="' + v.term + '" title="' + $.get_title(v) + '">' + ((v.value !== undefined && v.value == true) ? checkbox.replace("{LABEL}", v.label) : '<a class="btn-text" href="javascript: void(0);">' + v.label + '</a>') + '</li>';
	}
	return content;
};
$.manage_tree_checkbox = function(term, label, item) {
	var selected_enums = [],
	selected_enums_terms = [],
	id = item.replace("_term", ""),
	$item_val = $("#" + item).val(),
	$item_label_val = $("#" + item.replace("_term", "_label")).val();
	
	if($item_val !== "") { selected_enums = $item_val.split(","); }
	if($item_label_val !== "") { selected_enums_terms = $item_label_val.split(","); }
	if($("#" + $.md5(term) + "_checkbox").is(":checked")) {
		selected_enums.push(term);
		selected_enums_terms.push(label);
	} else {
		selected_enums.splice($.inArray(term, selected_enums), 1);
		selected_enums_terms.splice($.inArray(label, selected_enums_terms), 1);
	}
	$("#" + item).val(selected_enums);
	$("#" + item.replace("_term", "_label")).val(selected_enums_terms);
	$("#" + id).attr("title", selected_enums.join(", ")).attr("data-title", selected_enums.join(", ")).tooltip();
	$("#" +id + " span:first-child").text(((selected_enums_terms.length > 1) ? selected_enums_terms.length + " items selected" : ((selected_enums_terms.length == 0) ? "Choose..." : selected_enums_terms.join(", "))));
};
$.check_treeselect = function(item) {
	var $panel = item,
	selected_checkboxes = $("#" + $panel.find("a.treeselect").attr("id") + "_term").val();
	if(selected_checkboxes !== undefined) {
		var selected_checkboxes_arr = selected_checkboxes.split(",");
		for (var i = 0; i < selected_checkboxes_arr.length; i++) {
			$("#" + $.md5(selected_checkboxes_arr[i]) + "_checkbox").attr("checked", true);
		}
	}
}
$.add_multiselect = function(options, callback) {
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
	
	//var select = '<select id="' + options.id + '" class="multiselect form-control' + ((options.rtl) ? " rtl" : "") + '" ' + ((options.multiple) ? " multiple " : "") + 'data-placeholder="' + options.placeholder + '" ' + '></select>';
	//var select = '<ul class="nav nav-pills"><li id="' + options.id + '" class="dropdown"><a data-toggle="dropdown" href="#">' + options.placeholder + '</a><ul class="dropdown-menu multiselect" role="menu" aria-labelledby="dLabel"></ul></li></ul>';
	var select = '<a href="javascript: void(0);" class="btn btn-default-white form-control treeselect disabled" data-toggle="popover" id="' + options.id + '"><span>' + options.placeholder + '</span> <span class="caret"></a>';
	if (typeof callback == "function") {
		callback.call(this);
	}
	return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_ENUM + '" /><input type="hidden" id="' + options.id + '_label" value="" /><input id="' + options.id + '_term" type="hidden" name="' + kAPI_RESULT_ENUM_TERM + '" value="" />' + select;
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
		minLength: 1,
		limit: 50
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
			$("#forms-body").fadeIn(300);
		});
	});
}

$.check_storage = function(cname, callback) {
	if(typeof(cname) == "string") {
		cname = new Array(cname);
	}
	for(var q = 0; q < cname.length; q++) {
		var name = cname[q];
		
		if($.browser_cookie_status()) {
			if(storage.isEmpty("pgrdg_cache.take." + $.md5(name))) {
				// http://pgrdg.grinfo.private/Service.php?op={name}
				$.ask_to_service(name, function(system_constants) {
					storage.set("pgrdg_cache.take." + $.md5(name), {"query": name, "response": $.utf8_to_b64(JSON.stringify(system_constants))});
					$.get_operators_list(system_constants);
					
					if (typeof callback == "function") {
						callback.call(this);
					}
				});
			} else {
				$.get_operators_list($.b64_to_utf8(storage.get("pgrdg_cache.take." + $.md5(name) + ".response")));
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
	$.check_storage("list-constants", function() {
		//$.check_storage(kAPI_OP_LIST_REF_COUNTS); // Remember that you can pass also an array
	});
	$("button.dropdown-toggle").on("click", function(e) {
		if($(this).closest(".input-group").hasClass("open")) {
			$(this).closest(".input-group").removeClass("open");
		} else {
			$(this).closest(".input-group").addClass("open");
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