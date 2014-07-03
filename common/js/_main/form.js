/**
* Form functions
*
* @author Alessandro Gubitosi <gubi.ale@iod.io>
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/bioversity/PGRDG/
*/


/*=======================================================================================
*	COMMON FUNCTIONS
*======================================================================================*/

	/**
	* Extract title from giving object
	* @param  {object} v The object with description
	* @return {string}   The title string
	*/
	$.get_title = function(v) {
		return ((v.description !== undefined && v.description.length > 0) ? ((v.description !== undefined && v.description.length > 0) ? v.description : "") : ((v.definition !== undefined && v.definition.length > 0) ? v.definition : ""));
	};

	/**
	* Check if local storage is allowed
	*/
	$.check_storage = function(cname, callback) {
		if(jQuery.type(cname) == "string") {
			cname = new Array(cname);
		}
		for(var q = 0; q < cname.length; q++) {
			var name = cname[q];

			if($.browser_cookie_status()) {
				if(storage.isEmpty("pgrdg_cache.local." + $.md5(name))) {
					// http://pgrdg.grinfo.private/Service.php?op={name}
					$.ask_to_service(name, function(system_constants) {
						storage.set("pgrdg_cache.local." + $.md5(name), {"date": {"utc": new Date(), "timestamp": $.now()}, "query": name, "response": system_constants});
						$.get_operators_list(system_constants);

						if (jQuery.type(callback) == "function") {
							callback.call(system_constants);
						}
					});
				} else {
					$.get_operators_list(storage.get("pgrdg_cache.local." + $.md5(name) + ".response"));
					if (jQuery.type(callback) == "function") {
						callback.call(cname);
					}
				}
			}
		}
	};

/*=======================================================================================
*	CORE FORM FUNCTIONS
*======================================================================================*/

	/**
	* Create the form
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
			return ($.inArray(kTYPE_QUANTITATIVE, forms.kind) === 0) ? true : false;
		},
		generate_form = function() {
			var form_size;

			$.each(cluster, function(term, id_arr) {
				$.each(id_arr, function(idk, idv) {
					// Creates an object with all the forms
					forms = get_form_data(idk, response.results[collection][idv]);
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

					// Set the size of form boxes
					// REMINDER LEGEND:
					// 	Full with is 12, 6 is middle screen and 3 is quarter
					// 	'col-lg' -> Large displays
					// 	'col-md' -> Medium displays (eg. Tablet)
					// 	'col-sm' -> Small displays (eg. Smartphones)
					switch(forms.size) {
						case "double":
							form_size = "col-lg-6 col-md-9 col-sm-12";
							break;
						case "single":
							form_size = "col-lg-3 col-md-6 col-sm-12";
							break;
						default:
							form_size = "col-lg-3 col-md-6 col-sm-12";
							break;
					}
					var enable_disable_btn = '<a href="javascript:void(0);" onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="pull-left" title="Enable this item"><span class="fa fa-square-o"></span></a>',
					badge = '<span class="badge pull-right">' + ((forms.count !== undefined && forms.count > 0) ? forms.count : 0) + '</span>',
					mask = ((forms.count !== undefined && forms.count > 0) ? '<div onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="panel-mask"><span class="fa fa-check"></span><small>activate</small></div>' : '<div class="panel-mask unselectable"></div>');
					//mask = '<div onclick="$.toggle_form_item($(this), \'' + idv + '\');" class="panel-mask"><span class="fa fa-check"></span><small>activate</small></div>';

					var help = '<small class="help-block" style="color: #999; margin-bottom: -3px;"><br />' + $.get_title(forms) + '</small>',
					secret_input = '<input type="hidden" name="type" value="' + forms.type + '" /><input type="hidden" name="kind" value="' + forms.kind + '" /><input type="hidden" name="tags" value="' + idv + '" />';
					html_form += '<div class="' + form_size + " " + $.md5(idv) + ' vcenter">' + mask + '<div class="panel panel-success disabled" title="This item is disable"><div class="panel-heading">' + enable_disable_btn + '<h3 class="panel-title"><span class="disabled">' + forms.label + badge + help + '</span></h3></div><div class="panel-body">' /*'<p><tt>' + forms.type + "</tt><br /><tt>" + forms.kind + '</tt></p>' */ + '<form onsubmit="false">' + secret_input + form + '</form></div></div></div>';
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
		data = [],
		$panel, $panel_mask;

		if($this.hasClass("panel-mask")) {
			$panel = $this.next(".panel");
			$panel_mask = $this;
		} else {
			$panel = $this.closest(".panel");
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
			//
			if($panel.find("a.treeselect").length > 0){
				var $item = $panel.find("a.treeselect"),
				$form = $item.closest("form"),
				treeselect_id = $panel.find("a.treeselect").attr("id"),
				treeselect_title = '<div class="dropdown-header"><div class="input-group"><input type="text" class="form-control" placeholder="Filter" /><span class="input-group-addon"><span class="fa fa-search"></span></span></div></div>',
				//treeselect_content = '<div class="dropdown-content"><ul></ul></div>';
				treeselect_content = '<div class="dropdown-content"><ul></ul></div>';

				$item.addClass("disabled");
				$form.find(".dropdown-menu").html(treeselect_title + treeselect_content);

				var kapi_obj = {};
				kapi_obj.storage_group = "forms";
				kapi_obj.loaderType = $panel.find("a.pull-left, a.pull-right");
				kapi_obj[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_TAG_ENUMERATIONS;
				kapi_obj.parameters = {};
				kapi_obj.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS] = {};
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_TAG] = tag;

				$.ask_to_service(kapi_obj, function(res) {
					$.each(res.results, function(k, v) {
						$form.find(".dropdown-menu .dropdown-content > ul").append($.create_tree(v, $panel));
					});
					$item.removeClass("disabled");
				});

				$form.find(".dropdown-menu > *").click(function(e) {
					e.stopPropagation();
				});
				$form.on("shown.bs.dropdown", function () {
					$form.find(".dropdown-menu .dropdown-header input.form-control").focus();
					$form.find(".dropdown-menu .dropdown-header input.form-control").keyup(function() {
						var that = this;
						// affect all table rows on in systems table
						var tableBody = $form.find(".dropdown-menu .dropdown-content > ul");
						var tableRowsClass = $form.find(".dropdown-menu .dropdown-content > ul li");

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
						if(tableRowsClass.children(":visible").length === 0) {
							if(tableBody.find(".search-sf").length === 0) {
								tableBody.prepend('<div class="search-sf"><span class="text-muted">No entries found.</span></div>');
							}
						}
					});
				});
				/*
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
							if(tableRowsClass.children(":visible").length === 0) {
								if(tableBody.find(".search-sf").length === 0) {
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
				*/
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
			if(forms_count === 0) {
				$(".save_btn").addClass("disabled");
			}
			$panel.prev(".panel-mask").css("display: block");
		}
	};

	/**
	* Select a form block
	* @param  {[type]} id Search id
	* @param  {[type]} k
	* @param  {[type]} v
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
	};

	/**
	* Get the list of Service operators
	*/
	$.get_operators_list = function(system_constants) {
		if(jQuery.type(system_constants) == "string") {
			system_constants = jQuery.parseJSON(system_constants);
		}
		if(system_constants.results.kAPI_OP_LIST_OPERATORS !== undefined) {
			$.ask_to_service(system_constants.results.kAPI_OP_LIST_OPERATORS, function(oprts) {
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
				$("#left_panel > .panel-body:first-child").after('<div class="panel-header"><h1>' + oprts.results.title + '</h1></div>');
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
	};


/*=======================================================================================
*	SEARCH PAGE ELEMENTS
*======================================================================================*/

	/**
	* Add the main trait autocomplete form
	* @param {object}   options  Autocomplete html attributes (id, class, placeholder)
	* @param {string}   data     type of query
	* @param {Function} callback
	*/
	$.fn.addTraitAutocomplete = function(options, data, callback) {
		options = $.extend({
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
					var state = "true&query=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '":"' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					//var state = "true&address=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '": "' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					return url.replace("%QUERY", state);
				},
				filter: function (parsedResponse) {
					var res = [];
					$.each(parsedResponse, function(respType, v) {
						if(parsedResponse.status.state == "ok" && parsedResponse.paging.affected > 0) {
							if(respType == "results") {
								for (i = 0; i < parsedResponse.paging.affected; i++) {
									var re = [];
									re.value = v[i];
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

		var form_help_text = "Click on the green rectangle to activate the field: if you press the search button the system will select all data <em>containing</em> the selected field, regardless of its value.<br />To search for specific field values, fill the field search value or select the provided options.";
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

			var kAPI = {};
			kAPI.storage_group = "forms",
			kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
			kAPI.parameters = {};
			kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
			$.execTraitAutocomplete(kAPI, function(response) {
				if($("#accordion > #" + response.id).length === 0) {
					var the_title = "";
					if(response.paging.affected > 0) {
						$("#forms-head .content-title").html('Output for "' + $("#" + options.id).val() + '"');
						if($("#forms-head").length === 0) {
							$("#forms-head").append('<div class="help-block">' + form_help_text + '</div>');
						}
						$.each(operators, function(ck, cv) {
							if(cv.key == kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR][0]) {
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

					var kAPI = {};
					kAPI.storage_group = "forms",
					kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
					kAPI.parameters = {};
					kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
					kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class"), ($("#main_search_operator_i").is(":checked") ? '$i' : '"')];

					$.execTraitAutocomplete(kAPI, function(response) {
						if($("#accordion > #" + response.id).length === 0) {
							var the_title = "";
							if(response.paging.affected > 0) {
								$.each(operators, function(ck, cv) {
									$.each(kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR], function(cck, ccv) {
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
								if($("#forms-head").length === 0) {
									$("#forms-head").append('<div class="help-block">' + form_help_text + '</div>');
								}
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

		if (jQuery.type(callback) == "function") {
			callback.call(this);
		}
	};

	/**
	* Execute autocomplete (or simple user's input) search
	* @param {object}   kAPI
	* @param {Function} callback
	*/
	$.execTraitAutocomplete = function(kAPI, callback) {
		if($("#breadcrumb").css("display") == "none") {
			$("#breadcrumb").fadeIn(200);
		}
		$.ask_to_service(kAPI, function(response) {
			if (jQuery.type(callback) == "function") {
				if(response.paging.affected > 0) {
					var selected_forms = {}, form_data = {};
					$("#forms-head #right_btn").html('<span class="ionicons ion-trash-b"></span> Reset all').fadeIn(300, function() {
						$("#forms-head #right_btn").on("click", function() {
							$.reset_all_searches();
						});
					});
					$("section.container").animate({"padding-top": "149px"});
					$("#breadcrumb").animate({"top": "110px"});
					if($("#forms-head .btn-group a.save_btn").length === 0) {
						$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn disabled" style="display: none;">Search <span class="fa fa-chevron-right"></span></a>');
					}
					$("#forms").fadeIn(300);
					$("#forms-head .btn-group a.save_btn").fadeIn(300, function() {
						var active_forms = {};
						$(this).on("click", function() {
							form_data.history = storage.get("pgrdg_cache.forms");
							$.each($("#accordion > div.panel-default"), function(k, v) {
								frm_keys = $(this).attr("id");
								selected_forms[frm_keys] = {};
								selected_forms[frm_keys].request = storage.get("pgrdg_cache.forms." + frm_keys);
								selected_forms[frm_keys].key = $(this).attr("id");
								selected_forms[frm_keys].forms = [];

								$.each($(this).find("div.panel-success:not(.disabled)"), function(i, v) {
									var af_obj = $(this).find("form").serializeObject(),
									rt = {};

									switch(af_obj["input-type"]) {
										case kAPI_PARAM_INPUT_ENUM:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											rt[kAPI_RESULT_ENUM_TERM] = af_obj.term.split(",");
											rt[kAPI_PARAM_GROUP] = [kTAG_DOMAIN];
											active_forms[af_obj.tags] = rt;
											break;
										case kAPI_PARAM_INPUT_RANGE:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											rt[kAPI_PARAM_RANGE_MIN] = af_obj.from;
											rt[kAPI_PARAM_RANGE_MAX] = af_obj.to;
											rt[kAPI_PARAM_OPERATOR] = [af_obj.operator];
											active_forms[af_obj.tags] = rt;
											break;
										case kAPI_PARAM_INPUT_STRING:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											rt[kAPI_PARAM_PATTERN] = af_obj.stringselect;
											rt[kAPI_PARAM_OPERATOR] = [af_obj.operator, af_obj.case_sensitive];
											active_forms[af_obj.tags] = rt;
											break;
									}
									selected_forms[frm_keys].forms.push($(this).find("form").serializeObject());
								});
							});
							console.log(selected_forms);
							form_data.form = selected_forms;
							$("#goto_results_btn, #goto_map_btn").hide();
							storage.remove("pgrdg_cache.summary");
							storage.remove("pgrdg_cache.results");
							storage.remove("pgrdg_cache.map");

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


/*=======================================================================================
*	CONTENT INTERFACE
*======================================================================================*/

	/**
	* Remove a single search forms
	* @param  {object} search The form group to remove (html object)
	*/
	$.remove_search = function(search) {
		var $this = search,
		search_id = $this.closest(".panel").attr("id");

		apprise("Are you sure to remove this search?<br />", {title: "Warning", icon: "warning", confirm: true}, function(r) {
			if(r) {
				$($this).parents(".panel").fadeOut(300, function() {
					storage.remove("pgrdg_cache.forms." + search_id);
					$(this).remove(); $("#main_search").focus();
					if($("#accordion .panel").length === 0) {
						storage.remove("pgrdg_cache.forms." + search_id);
						$.reset_all_searches(false);
					}
				});
			}
		});
	};

	/**
	* Reset all searches
	* @param {bool} ask Ask confirm
	*/
	$.reset_all_searches = function(ask) {
		if(ask === undefined) {
			ask = true;
		}
		var next = false;
		$.reset = function(){
			$("#forms-head #right_btn, #forms-head .save_btn").fadeOut(300, function() {
				$("#forms-head .content-title").text("");
				$("#forms-body .content-body").html("");
				$("section.container").animate({"padding-top": "39px"});
					// Reset breadcrumb and panels
					$.reset_breadcrumb();
					$.reset_contents("forms");
					$.reset_contents("summary");
					$.reset_contents("results");
					$.reset_contents("map");
					storage.remove("pgrdg_cache.forms");
					storage.remove("pgrdg_cache.summary");
					storage.remove("pgrdg_cache.results");
					storage.remove("pgrdg_cache.map");
				$("#contents #start").fadeIn(300);
				$("input.typeahead.tt-input").val("").focus();
			});
		};

		//console.log($("#accordion > div.panel"));
		if(ask) {
			if($("#apprise.reset-all").length > 0) {
				$("#apprise.reset-all").modal("show");
			} else {
				apprise("Are you sure?", {title: "Warning", icon: "warning", class: "reset-all", confirm: true}, function(r) {
					if(r) {
						$.reset();
					}
				});
			}
		} else {
			$("#forms-head #right_btn, #forms-head .save_btn").fadeOut(300, function() {
				$.reset();
			});
		}
	};

	/**
	 * Reset the breadcrumbs
	 */
	$.reset_breadcrumb = function() {
		$("#breadcrumb").fadeOut(300, function() {
			$.each($(this).find("ol li"), function(i,v) {
				$(this).hide();
			});
		});
	};

	/**
	* Activate content pane
	* @param  {string} type    The panel to activate
	* @param  {object} options (res, label)
	*/
	$.activate_panel = function(type, options) {
		options = $.extend({
			res: "",
			label: ""
		}, options);

		$.manage_url($.ucfirst(type));

		if(type !== "map") {
			$("#" + type + "-head .content-title").html("Search " + type.toLowerCase());

			$("#" + type + "-body .content-body").html("");
			if(type !== "results") {
				$.each(options.res.results, function(domain, values) {
					$("#" + type + "-body .content-body").attr("id", options.res.id).append("<div class=\"panel panel-success\"><div class=\"panel-heading\"><h4 class=\"list-group-item-heading\"><span class=\"title\">" + $.trim(values[kTAG_LABEL]) + "</span> <span class=\"badge pull-right\">" + values[kAPI_PARAM_RESPONSE_COUNT] + "</span></h4></div><div class=\"panel-body\"><div class=\"btn-group pull-right\"><a class=\"btn btn-default-white\" href=\"javascript: void(0);\" onclick=\"$.show_raw_data('" + options.res.id + "', '" + domain + "')\">View raw data <span class=\"fa fa-th\"></span></a><a onclick=\"$.show_data_on_map('" + options.res.id + "', '" + domain + "')\" class=\"btn btn-default\">View on map <span class=\"ionicons ion-map\"></a></div>" + values[kTAG_DEFINITION] + "</div></div>");
				});
			} else {
				var cols = options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_LIST_COLS],
				rows = options.res[kAPI_RESPONSE_RESULTS];
				$("#" + type + "-body .content-body").append('<table id="' + options.res.id + '" class="table table-striped table-hover table-responsive"></table>');
					/**
					 * Parse cell content and display helps if present
					 * @param  {string|object} disp The text or object that will be parsed
					 * @return {string}      The html string to place iside cell
					 */
					$.cycle_disp = function(disp) {
						if($.type(disp) == "object") {
							return disp[kAPI_PARAM_RESPONSE_FRMT_DISP] + " " + ((disp[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? '<a href="javascript:void(0);" class="text-info pull-right" data-toggle="popover" data-content="' + $.html_encode(disp[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : "");
						} else {
							return disp;
						}
					};

					/**
					* Open/close row
					* @param  {string} id Row id
					*/
					$.expand_row = function(res_id, id) {
						var $icon = $("#" + $.md5(id)).prev("tr").find("td:first-child a > span");

						if($icon.hasClass("fa-rotate-90")) {
							// Row is closed
							$("#" + $.md5(id)).slideUp(600);
							$icon.removeClass("fa-rotate-90");
						} else {
							// Row is opened
							$("#" + $.md5(id) + " td").html('<center class="text-muted"><span class="fa fa-refresh fa-spin"></span> Waiting...</center>');
							$.show_raw_row_content(res_id, id);
							$("#" + $.md5(id)).slideDown(600);
							$icon.addClass("fa-rotate-90");
						}
					};
					var c_count = $.obj_len(cols),
					column = "",
					general_column = "",
					actual = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_ACTUAL],
					affected = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED],
					limit = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_LIMIT],
					skipped = options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_SKIP];

					// Create table header
					$.each(cols, function(col_id, col_data) {
						column += '<td><b>' + col_data[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</b> ' + ((col_data[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? '<a href="javascript:void(0);" class="text-info" data-toggle="popover" data-content="' + $.html_encode(col_data[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : "") + '</td>';
						general_column += '<td class="col_' + col_id + '"></td>';
					});

					$("table#" + options.res.id).html('<thead><tr><td></td>' + column + '</tr></thead><tbody></tbody>');
					$.each(rows, function(row_id, row_data) {
						// Create empty rows
						$("table#" + options.res.id + " tbody").append('<tr id="tr_' + $.md5(row_id) + '" class="expandable" onclick="$.expand_row(\'' + options.res.id + '\', \'' + row_id + '\');"><td align="center"><a href="javascript:void(0);" class="text-muted"><span class="fa fa-chevron-right"></span></a></td>' + general_column + '</tr>');
						$("table#" + options.res.id + " tbody").append('<tr id="' + $.md5(row_id) + '" class="detail"><td colspan="' + (c_count + 1) + '"><div><ul class="list-group transparent">' + '</ul></div></td></tr>');

						// Place contents in each table cell
						$.each(row_data, function(row_col_id, cell_data) {
							$("tr#tr_" + $.md5(row_id) + ' td.col_' + row_col_id).html($.cycle_disp(cell_data[kAPI_PARAM_RESPONSE_FRMT_DISP]));
						});
					});
					$("table#" + options.res.id + " thead").prepend('<tr><td colspan="' + (c_count + 1) + '">' + $.paging_btns(options, actual, affected, limit, skipped) + '<br /></td></tr>');
					$("table#" + options.res.id).append('<tfoot><tr><td colspan="' + (c_count + 1) + '"><br />' + $.paging_btns(options, actual, affected, limit, skipped) + '</td></tr></tfoot>');
					$("table#" + options.res.id + " td a:not(.btn-default-white)").popover({container: "body", placement: "auto", html: "true", trigger: "hover"});
					$("table#" + options.res.id + " td a.btn-default-white").tooltip();
					// $("table#" + options.res.id + " form a");
			}
			$("#contents #" + type + "").fadeIn(300);
		} else {
			if($("#pgrdg_map").children().length === 0) {
				map = $.init_map(function(map) {
					$.reset_all_markers();
					$.add_geojson_cluster(options.res);
				});
			}
			$("#pgrdg_map").fadeIn(600);
		}

	};


	/**
	* Reset selected content pane
	* @param {string} content The HTML id of content pane to reset
	*/
	$.reset_contents = function(content) {
		$("#contents #" + content).fadeOut(300, function(){
			if(content == "map") {
				$.init_map();
			} else {
				if(content == "forms") {
					$(this).find("#" + content + "-head").html('<h1 class="pull-left content-title"></h1><div class="btn-group pull-right"><a id="right_btn" class="btn btn-default-grey" style="display: none;" href="javascript: void(0);"></a></div><div class="clearfix"></div>');
				} else {
					$(this).find("#" + content + "-head").html('<h1 class="content-title"></h1>');
				}
				$(this).find("#" + content + "-body").html('<div class="content-body"></div>');
			}
		});
	};

	/**
	* Show summary content pane
	* @param  {object} active_forms
	*/
	$.show_summary = function(active_forms) {
		var kAPI = {};
		kAPI.storage_group = "summary";
		kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
		kAPI.parameters = {};
		kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
		kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
		kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = active_forms;
		kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = [];

		$.ask_to_service(kAPI, function(res) {
			$.activate_panel("summary", {res: res});
		});

	};

	/*=======================================================================================
	*	RAW DATA
	*======================================================================================*/

		/**
		* Show row data table
		* @param  {string} id     Storage id
		* @param  {string} domain Domain
		* @param  {int}    skip   Skip
		* @param  {int}    limit  Limit
		*/
		$.show_raw_data = function(id, domain, skip, limit) {
			if(skip === undefined || skip === null || skip === "") { skip = 0; }
			if(limit === undefined || limit === null || limit === "") { limit = 50; }
			var summaries_data = storage.get("pgrdg_cache.summary." + id),
			objp = {};
				objp.storage_group = "summary";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = limit;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_SKIP] = skip;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_COLUMN;
			$.ask_to_service(objp, function(res) {
				$.activate_panel("results", {title: $("#" + id + " .panel-heading span.title").text(), domain: domain, res: res});
			});
			/*
			if(type == "map") {
				$.activate_panel("map", {res: decrypted_data});
			} else {
				$.activate_panel("results", {res: decrypted_data});
			}
			*/

		};

		/**
		 * Recursive parse of contents in expanded row
		 * @param  {object} res The content to parse
		 */
		$.parse_row_content = function(res) {
			$.cycle_disp = function(disp, what, who) {
				return disp[what] + ((disp[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? ' <a href="javascript:void(0);" class="text-info" data-toggle="popover" data-content="' + $.html_encode(disp[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : '');
			};

			var r = "",
			v_type = "",
			v_list = "",
			is_struct = false,
			id;

			$.each(res, function(tag, content) {
				if(content[kAPI_PARAM_RESPONSE_FRMT_DOCU] === undefined) {
					switch($.type(content[kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						case "array":
							$.each(content[kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
								if($.type(v) == "array") {
									v_type = "array";
									v_list += $.parse_row_content(v);
								} else {
									v_type = "string";
									v_list = "";
								}
							});
							if(v_type == "string") {
								r += '<li><b>' + content[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</b>: <ul>';
								$.each(content[kAPI_PARAM_RESPONSE_FRMT_DISP], function(k, v) {
									r += '<li>' + $.cycle_disp(v, kAPI_PARAM_RESPONSE_FRMT_DISP) + '</li>';
								});
								r += '</ul></li>';
							} else {
								r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: <ul>' + v_list + '</ul></li>';
							}
							break;
						case "string":
							if(content[kAPI_PARAM_RESPONSE_FRMT_LINK] !== undefined) {
								r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: <a target="_blank" href="' + content[kAPI_PARAM_RESPONSE_FRMT_LINK] + '">' + /*$.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP)*/ content[kAPI_PARAM_RESPONSE_FRMT_DISP] + '</a></li>';
							} else {
								if(content[kAPI_PARAM_RESPONSE_FRMT_DISP] !== undefined) {
									r += '<li><b>'+ $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: ' + /*$.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP)*/ content[kAPI_PARAM_RESPONSE_FRMT_DISP] + '</li>';
								}
							}
							break;
					}
				} else {
					$.each(content[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
						if(v[kAPI_PARAM_RESPONSE_FRMT_DOCU] !== undefined) {
							is_struct = true;
						} else {
							is_struct = false;
						}
					});
					if(is_struct) {
						id = $.makeid();
						label = (content[kAPI_PARAM_RESPONSE_FRMT_NAME] !== undefined) ? $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") : $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP, "label");
						r += '<li><span class="fa fa-fw fa-caret-right"></span> <a href="javascript:void(0);" data-toggle="collapse" data-target="#' + id + '" onclick="$(this).prev(\'span\').toggleClass(\'fa-caret-right fa-caret-down\');">' + label + '</a>: <div id="' + id + '" class="collapse">' + /*$.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP)*/ $.parse_row_content(content[kAPI_PARAM_RESPONSE_FRMT_DOCU]) + '</div></li>';
					} else {
						id = $.makeid();
						label = (content[kAPI_PARAM_RESPONSE_FRMT_NAME] !== undefined) ? $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") : $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP, "label");
						r += '<li><span class="fa fa-fw fa-caret-right"></span> <a href="javascript:void(0);" data-toggle="collapse" data-target="#' + id + '" onclick="$(this).prev(\'span\').toggleClass(\'fa-caret-right fa-caret-down\');">' + label + '</a>: <div id="' + id + '" class="collapse">' + /*$.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP)*/ $.parse_row_content(content[kAPI_PARAM_RESPONSE_FRMT_DOCU]) + '</div></li>';
					}
				}
			});

			return '<div><ul class="list-unstyled fa-ul">' + r + '</ul></div>';
		};

		/**
		* Show row data contents
		* @param  {string} id     Storage id
		* @param  {string} domain Domain
		* @param  {int}    skip   Skip
		* @param  {int}    limit  Limit
		*/
		$.show_raw_row_content = function(id, domain) {
			var summaries_data = storage.get("pgrdg_cache.summary." + id),
			objp = {};
				objp.storage_group = "results";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = domain;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
			$.ask_to_service(objp, function(row_content) {
				$("tr#" + $.md5(domain) + " td").html($.parse_row_content(row_content.results[domain]));
				$("tr#" + $.md5(domain) + " a.text-info, tr#" + $.md5(domain) + " span.info").popover({container: "body", placement: "auto", html: "true", trigger: "hover"});
			});
			/*
			if(type == "map") {
				$.activate_panel("map", {res: decrypted_data});
			} else {
				$.activate_panel("results", {res: decrypted_data});
			}
			*/

		};

		/**
		* Show data on map
		* @param  {string} id     Storage id
		* @param  {string} domain Domain
		*/
		$.show_data_on_map = function(id, domain) {
			//console.log(id, domain);
			var summaries_data = storage.get("pgrdg_cache.summary." + id),
			geometry = [],
			arr = $.get_current_bbox_pgrdg();

			geometry.push(arr);

			var objp = {};
				objp.storage_group = "map";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 10000;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_MARKER;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE] = {};
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE][kTAG_TYPE] = "Polygon";
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE][kTAG_GEOMETRY] = geometry;

			$.ask_to_service(objp, function(res) {
				// console.log(res);
				if(res.paging.affected > 0) {
					$.activate_panel("map", {res: res.results, shape: kTAG_GEO_SHAPE});
					if(res.paging.affected > objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT]) {
						var alert_title = "Displayed 1000 of " + res.paging.affected + " markers";
						apprise("The map cannot currently display more than 1000 points.<br />This means that it contains only the first 1000 points: this limitation will be resolved shortly, in the meanwhile, please reduce your selection.", {class: "only_1k", title: alert_title, titleClass: "text-danger", icon: "fa-eye-slash"});
					}
				} else {
					alert("No results");
				}
			});

		};

	/*=======================================================================================
	*	RAW DATA TABLE
	*======================================================================================*/

		/**
		* Show paging buttons
		* @param  {object} options  The entire (raw data) object
		* @param  {int}    actual   The "actual" data passed from Service
		* @param  {int}    affected The "affected" data passed from Service
		* @param  {int}    limit    The "limit" data passed from Service
		* @param  {int}    skipped  The "skipped" data passed from Service
		* @return {string}          Html div with paging buttons
		*/
		$.paging_btns = function(options, actual, affected, limit, skipped) {
			var page_count = Math.ceil(affected / limit),
			current_page = (skipped/limit) + 1,
			first_page = 1,
			previous_page = current_page - 1,
			next_page = current_page + 1,
			last_page = page_count,
			previous_skip = skipped - limit,
			next_skip = skipped + limit,
			last_skip = (page_count - 1) * limit;

				/*
				console.group("PASSED DATA");
					console.log(options);
				console.groupEnd();
				console.group("PAGE NUMBERING");
					console.log("Page count", page_count);
					console.log("First page", first_page);
					console.log("Previous page", previous_page);
					console.log("Next page", next_page);
					console.log("Current page", current_page);
					console.log("Last page", last_page);
				console.groupEnd();
				console.group("SKIPPING VALUES");
					console.log("Previous skip", previous_skip);
					console.log("Next skip", next_skip);
					console.log("Last skip", last_skip);
				console.groupEnd();
				*/
			$form_group = $('<div class="form-group">');
				$first_btn = $('<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + 0 + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="First page"><span class="fa fa fa-angle-double-left"></a>');

			page_btns = '<div class="form-group">';
				page_btns += '<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + 0 + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="First page"><span class="fa fa fa-angle-double-left"></a>';
			page_btns += '</div>&nbsp;';
			page_btns += '<div class="form-group">';
				page_btns += '<div class="input-group">';
					page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + previous_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="Previous page"><span class="fa fa-angle-left"></a></span>';
					page_btns += '<span class="input-group-addon">Page</span>';
					page_btns += '<input type="number" min="1" max="' + page_count + '" class="form-control" style="width: 75px;" placeholder="Current page" value="' + current_page + '" />';
					page_btns += '<span class="input-group-addon">of ' + page_count + '</span>';
					page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + next_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == page_count) ? ' disabled' : '') + '" title="Nex page"><span class="fa fa-angle-right"></a></span>';
				page_btns += '</div>';
			page_btns += '</div>&nbsp;';
			page_btns += '<div class="btn-group">';
				page_btns += '<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'' + last_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == page_count) ? ' disabled' : '') + '" title="Last page"><span class="fa fa-angle-double-right"></a>';
			page_btns += '</div>';

			return '<form class="form-inline text-center" role="form">' + page_btns + '</form>';
		};

		/**
		* Parse recursive Service data and show in a row tree
		* @param  {object} options The entire Service object
		*/
		$.cycle_row_data = function(options) {
			var content = "";
			$.each(options.row_obj, function(tag, value) {
				var id = $.makeid(),
				label, tag_label, tag_type;
				if(!jQuery.isEmptyObject(options.res)) {
					if($.isNumeric(tag)) {
						tag_label = options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_TAGS][tag]][kTAG_LABEL];
						tag_type = options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_TAGS][tag]][kTAG_DATA_TYPE];
						//console.log(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_TAGS][tag]][kTYPE_ENUM])
					}
				} else {
					tag_label = tag;
				}
				switch(jQuery.type(value)) {
					case "object":
						if(jQuery.isArray(value)) {
							$.each(value, function(key, val) {
								var val_type = jQuery.type(val);
							});
							/*if(val_type == "object") {
								content += "~";//$.cycle_row_data({row_obj: value});
							} else {
								*/content += '<li class="list-group-item"><b>' + tag_label + "</b>: " + value.join(", ") + "</li>";
							//}
						} else {
							if(tag_type == kTYPE_ENUM || tag_type == kTYPE_SET) {
								if(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][value] !== undefined) {
									label = options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][value][kTAG_LABEL];
								} else {
									label = tag_label;
								}
							} else {
								label = tag_label;
							}
							if($.obj_len(value) == 1) {
								$.each(value, function(i, n) {
									label = i;
									value = n;
								});
							}
							content += '<li class="list-group-item"><span class="fa fa-caret-right fa-fw"></span><a href="javascript:void(0);" data-toggle="collapse" data-target="#' + $.md5(label) + '">View</a><div id="' + $.md5(label) + '" class="collapse"><ul class="list-group">' + $.cycle_row_data({res: options.res, row_obj: value}) + "</ul></div></li>";
						}
						break;
					case "array":
						switch(tag_type) {
							case kTYPE_ENUM:
							case kTYPE_SET:
								var lab = [];
								$.each(value, function(key, val) {
									if(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][val] !== undefined) {
										lab.push(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][val][kTAG_LABEL]);
										//console.log(options.res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TERM][val][kTAG_LABEL]);
									}
								});
								content += '<li class="list-group-item"><b>' + $.get_tag_label_from_string(options.res, tag_label) + "</b>: " + lab.join(", ") + "</li>";
								break;
							case kTYPE_STRUCT:
								if($.obj_len(value) == 1) {
									$.each(value, function(key, val) {
										if($.obj_len(val) > 1) {
											content += '<li class="list-group-item"><span class="fa fa-caret-right fa-fw"></span><a href="javascript:void(0);" data-toggle="collapse" data-target="#' + $.md5(label) + '">View</a><div id="' + $.md5(label) + '" class="collapse"><ul class="list-group">' + $.cycle_row_data({res: options.res, row_obj: val}) + "</ul></div></li>";
										} else {
											$.each(val, function(k, v) {
												content += '<li class="list-group-item"><b>' + tag_label + "</b>: " + v + "</li>";
											});
										}
									});
								} else {
									$.each(value, function(key, val) {
										content += '<li class="list-group-item"><span class="fa fa-caret-right fa-fw"></span><a href="javascript:void(0);" data-toggle="collapse" data-target="#' + $.md5(label) + '">View</a><div id="' + $.md5(label) + '" class="collapse"><ul class="list-group">' + $.cycle_row_data({res: options.res, row_obj: val}) + "</ul></div></li>";
									});
								}
								break;
							default:
								content += '<li class="list-group-item"><b>' + $.get_tag_label_from_string(options.res, tag) + "</b>: " + value.join(", ") + "</li>";
								break;
						}
						break;
					default:
						switch(tag_type) {
							case kTYPE_ENUM:
							case kTYPE_SET:
								if(tag_label == "Domain") {
									value = options.title;
								} else {
									value = $.get_enum_label_from_string(options.res, value);
								}
								//console.log(tag_label);
								content += '<li class="list-group-item"><b>' + $.get_tag_label_from_string(options.res, tag_label) + "</b>: " + $.get_enum_label_from_string(options.res, value) + "</li>";
								break;
							case kTYPE_STRUCT:
								break;
							default:
								content += '<li class="list-group-item"><b>' + $.get_tag_label_from_string(options.res, tag) + "</b>: " + $.get_enum_label_from_string(options.res, value) + "</li>";
								break;
						}
						break;
				}
				//content += tag + ": " + jQuery.type(value) + '<br />';
			});
			return content;
		};

		/**
		* Convert an enum string to its label
		* @param  {object} res    The entire Service object
		* @param  {string} string Enum string
		* @return {string}        Enum label
		*/

		// $.get_enum_label_from_string = function(res, string) {
		// 	if(!jQuery.isEmptyObject(res)) {
		// 		if(res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][string] !== undefined) {
		// 		//console.log(res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG], string);
		// 			label = res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][string][kTAG_LABEL];
		// 		} else {
		// 			label = string;
		// 		}
		// 		return label;
		// 	}
		// };

		/**
		* Convert a tag code to its label
		* @param  {object} res    The entire Service object
		* @param  {int} string    Tag string
		* @return {string}        Tag label
		*/

		// $.get_tag_label_from_string = function(res, string) {
		// 	if(!jQuery.isEmptyObject(res)) {
		// 		if(jQuery.isNumeric(string)) {
		// 			var tag_id = res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_TAGS][string];
		// 			if(res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id] !== undefined) {
		// 				return res[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG][tag_id][kTAG_LABEL];
		// 			}
		// 		} else {
		// 			return string;
		// 		}
		// 	} else {
		// 		return string;
		// 	}
		// };


/*=======================================================================================
*	FORM GENERATION
*======================================================================================*/

	/**
	/* Add input form with operators select on its side
	*/
	$.add_input = function(options) {
		options = $.extend({
			id: $.makeid(),
			class: "form-control",
			placeholder: "Enter value...",
			type: "text",
			disabled: true
		}, options);
		var op_btn_list = "";

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
	* Add simple input form
	* @param {object} options (id, class, placeholder, type, disabled)
	*/
	$.add_simple_input = function(options) {
		options = $.extend({
			id: $.makeid(),
			class: "form-control",
			placeholder: "Enter value...",
			type: "text",
			disabled: true
		}, options);

		return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_DEFAULT + '" /><input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="' + options.id + '" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/>';
	};

	/**
	* Add range input group form
	* @param {object} options (id, class, placeholder, min, max, type, disabled)
	*/
	$.add_range = function(options) {
		options = $.extend({
			id: [$.makeid(), $.makeid()],
			class: ["form-control", "form-control"],
			placeholder: [0, 0],
			min: 0,
			max: 0,
			type: "",
			disabled: true
		}, options);
		var op_btn_list = "",
		checkbox = "",
		input_type = (options.type == kTYPE_INT || options.type == kTYPE_FLOAT) ? "number" : "text",
		placeholder = [(options.placeholder[0] !== undefined) ? options.placeholder[0] : 0, (options.placeholder[1] !== undefined) ? options.placeholder[1] : 0],
		min = (options.min !== undefined) ? options.min : options.placeholder[0],
		max = (options.max !== undefined) ? options.max : options.placeholder[1];

		$.check_range_value = function(item) {
			var $this = item;
			$this.val(($this.val() === "" ) ? $this.attr("placeholder") : $this.val());
		};

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
	* Chosen
	*/
		/**
		* Add Chosen autocomplete
		* @param {object} options (id, class, placeholder, no_results_text, multiple, allow_single_deselect, max_select, tree_checkbox, rtl, btn_menu, disabled)
		* @param {object} content ...
		*/
		$.add_chosen = function(options, content) {
			if(content === undefined || content === "") {
				content = [{text: "Test", value: "ok"}, {text: "Test", value: "jkhsdgf"}]; // <----------------------------------- Waiting right data from Milko's Service...
			} else {
				console.log("Chosen: ", content);
			}
			options = $.extend({
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
		* Update the chosen select
		*/
		$.update_chosen = function() { $(this).trigger("chosen:updated"); };

		/**
		* Activate the focus on chosen select
		*/
		$.focus_chosen = function() { $(this).trigger("chosen:activate"); };

		/**
		* Open the chosen flag
		*/
		$.open_chosen = function() { $(this).trigger("chosen:open"); };

		/**
		* Close the chosen flag
		*/
		$.close_chosen = function() { $(this).trigger("chosen:close"); };


	/**
	* Multiselect
	*/
		/**
		* Add Multiselect autocomplete
		*/
		$.create_tree = function(v, item) {
			$.get_node = function(node) {
				$param = item;
				if(!$("#node_" + node).hasClass("open")) {
					$("#" + node + "_toggler").find("span").removeClass("fa-caret-right").addClass("fa-caret-down");

					if($("#node_" + node).html() === "") {
						$("#node_" + node).show().html('<span class="fa fa-refresh fa-spin"></span> Retriving data...');
						$.ask_to_service({storage_group: "forms", loaderType: $panel.find("a.pull-left, a.pull-right"), op: kAPI_OP_GET_NODE_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, node: node}}}, function(res) {
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
			};

			var $panel = item,
			panel_input_term_id = $panel.find('input[name="term"]').attr("id"),
			content = "",
			triangle = '<a class="tree-toggler text-muted" onclick="$.get_node(\'' + v.node + '\'); return false;" id="' + v.node + '_toggler" href="javascript: void(0);"><span class="fa fa-fw fa-caret-right"></a>',
			checkbox = '<div class="checkbox"><label><input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" /> {LABEL}</label></div>';
			checkbox_inline = '<div class="checkbox-inline"><label><input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" /> {LABEL}</label></div>';

			if (v.children !== undefined && v.children > 0) {
				content += '<li class="list-group-item">' + triangle + '<span title="' + $.get_title(v) + '">' + ((v.value !== undefined && v.value) ? checkbox_inline.replace("{LABEL}", v.label) : '<a class="btn-text" href="javascript: void(0);" onclick="$.get_node(\'' + v.node + '\'); return false;">' + v.label + '</a>') + '</span>' + '<ul id="node_' + v.node + '" style="display: none;" class="nav nav-list tree"></ul></li>';
			} else {
				content += '<li class="list-group-item" value="' + v.term + '" title="' + $.get_title(v) + '">' + ((v.value !== undefined && v.value) ? checkbox.replace("{LABEL}", v.label) : '<a class="btn-text" href="javascript: void(0);">' + v.label + '</a>') + '</li>';
			}
			return content;
		};

		/**
		* Manage checkbox tree
		*/
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
			$("#" +id + " span:first-child").text(((selected_enums_terms.length > 1) ? selected_enums_terms.length + " items selected" : ((selected_enums_terms.length === 0) ? "Choose..." : selected_enums_terms.join(", "))));
		};

		/**
		* Recursive check checkboxes in a treeselect
		* @param  {object} item Html object
		*/
		$.check_treeselect = function(item) {
			var $panel = item,
			selected_checkboxes = $("#" + $panel.find("a.treeselect").attr("id") + "_term").val();
			if(selected_checkboxes !== undefined) {
				var selected_checkboxes_arr = selected_checkboxes.split(",");
				for (var i = 0; i < selected_checkboxes_arr.length; i++) {
					$("#" + $.md5(selected_checkboxes_arr[i]) + "_checkbox").attr("checked", true);
				}
			}
		};

		/**
		* Create multiselect form
		* @param {object}   options  (id, class, placeholder, no_results_text, multiple, allow_single_deselect, max_select, tree_checkbox, rtl, btn_menu, disabled)
		*/
		$.add_multiselect = function(options, callback) {
			options = $.extend({
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

			/*
			var select = '<select id="' + options.id + '" class="multiselect form-control' + ((options.rtl) ? " rtl" : "") + '" ' + ((options.multiple) ? " multiple " : "") + 'data-placeholder="' + options.placeholder + '" ' + '></select>';
			var select = '<ul class="nav nav-pills"><li id="' + options.id + '" class="dropdown"><a data-toggle="dropdown" href="#">' + options.placeholder + '</a><ul class="dropdown-menu multiselect" role="menu" aria-labelledby="dLabel"></ul></li></ul>';
			*/
			var select = '<a href="javascript: void(0);" class="btn btn-default-white form-control treeselect dropdown-toggle disabled" data-toggle="dropdown" id="' + options.id + '"><span>' + options.placeholder + '</span> <span class="caret"></a><div class="dropdown-menu"></div>';
			if (jQuery.type(callback) == "function") {
				callback.call(this);
			}
			return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_ENUM + '" /><input type="hidden" id="' + options.id + '_label" value="" /><input id="' + options.id + '_term" type="hidden" name="' + kAPI_RESULT_ENUM_TERM + '" value="" />' + select;
		};


/*=======================================================================================
*	FORM GENERATION (JQUERY FUNCTIONS)
*======================================================================================*/

	/**
	/* Add collapsible content
	*/
	$.fn.addCollapsible = function(options, callback) {
		options = $.extend({
			title: "Collapsible panel",
			icon: "fa fa-search",
			content: "",
			id: $.makeid()
		}, options);

		if($("#accordion").length === 0) {
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
		if (jQuery.type(callback) == "function") {
			callback.call(this);
		}
	};


	/**
	* Add generic autocomplete form, like Trait Autocomplete
	*/
	$.fn.addAutocomplete = function(options, data, callback) {
		options = $.extend({
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
	* Add Chosen form (select with search engine)
	*/
	$.fn.addChosen = function(options, content, callback) {
		options = $.extend({
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
			if (jQuery.type(callback) == "function") {
				callback.call(this);
			}
		});
	};


/*======================================================================================*/

$(document).ready(function() {
	if(current_path == "Search") {
		$(window).resize(function () {
			// Resize the forms when window is resized
			$.resize_forms_mask();
		});
	}
	// Check the presence of constants on storage
	$.check_storage(kAPI_OP_LIST_CONSTANTS, function(data) {
		$.check_storage(kAPI_OP_LIST_REF_COUNTS); // Remember that you can pass also an array
	});
	// Adjust dropdown buttons visualization
	$("button.dropdown-toggle").on("click", function(e) {
		if($(this).closest(".input-group").hasClass("open")) {
			$(this).closest(".input-group").removeClass("open");
		} else {
			$(this).closest(".input-group").addClass("open");
		}
	});
	// Restore the previous content of Search page
	/*if(storage.isSet("pgrdg_cache.html") && storage.get("pgrdg_cache.html") !== undefined) {
		$("body").html($.b64_to_utf8(storage.get("pgrdg_cache.html")));
	}*/
});
// Save the current page if user change
/*window.onbeforeunload = function() {
	storage.set("pgrdg_cache.html", $.utf8_to_b64($("body").html()));
};*/
