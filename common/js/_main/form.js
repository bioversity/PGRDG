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
		return ((v[kAPI_RESULT_ENUM_DESCR] !== undefined && v[kAPI_RESULT_ENUM_DESCR].length > 0) ? ((v[kAPI_RESULT_ENUM_DESCR] !== undefined && v[kAPI_RESULT_ENUM_DESCR].length > 0) ? v[kAPI_RESULT_ENUM_DESCR] : "") : ((v.definition !== undefined && v.definition.length > 0) ? v.definition : ""));
	};


	/**
	* Check if local storage is allowed
	*/
	$.check_storage = function(cname, page, callback) {
		$.operate = function(oprst){
			if(page == "Advanced_search") {
				//$("#left_panel div.panel-body:first-child").after('<div class="panel-header"><h1>' + oprts.results.title + '</h1></div>');
				$("#left_panel div.panel-body.autocomplete").addTraitAutocomplete({
					id: "main_search",
					class: "",
					placeholder: oprst[kAPI_RESPONSE_RESULTS].placeholder,
					op: operators
				}, "remote", function() {
					operators = operators;
				});
				$.left_panel("check", "", function() {
					$("#forms-body").fadeIn(300);
				});
			} else if(page == "Search"){
				//$("#left_panel div.panel-body:first-child").after('<div class="panel-header"><h1>' + oprts.results.title + '</h1></div>');
				$("#collapsed_group_form .panel .autocomplete").addAutocomplete({
					id: "filter_search_summary",
					class: "",
					placeholder: oprst[kAPI_RESPONSE_RESULTS].placeholder,
					op: operators,
					operator: kAPI_OP_MATCH_TAG_SUMMARY_LABELS
				}, "remote", function() {
					operators = operators;
				});
				$('.collapse').on("shown.bs.collapse", function() {
					$("input.typeahead").focus();
				});
			}
			if (jQuery.type(callback) == "function") {
				callback.call(this, system_constants);
			}
		};

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
						$.get_operators_list(system_constants, function(oprts){
							$.operate(oprts);
						});
					});
				} else {
					$.get_operators_list(storage.get("pgrdg_cache.local." + $.md5(name) + ".response"), function(oprst) {
						$.operate(oprst);
					});
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
		return_key = false,
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
								return_key = false;
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
								return_key = false;
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
								return_key = true;
								break;
							case kTYPE_BOOLEAN:
								form = $.add_switch();
								return_key = false;
								break;
							default:
								form = $.add_simple_input();
								return_key = false;
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
					secret_input = '<input type="hidden" name="type" value="' + forms.type + '" /><input type="hidden" name="kind" value="' + forms.kind + '" /><input type="hidden" name="tags" value="' + idv + '" />',
					info_box = (!return_key) ? '<small class="pull-right help-block"><span class="fa fa-warning"></span> Return button disabled</small>' : '';
					html_form += '<div class="' + form_size + " " + $.md5(idv) + ' vcenter">' + mask + '<div class="panel panel-success disabled" title="This item is disable"><div class="panel-heading">' + enable_disable_btn + '<h3 class="panel-title"><span class="disabled">' + forms.label + badge + help + '</span></h3></div><div class="panel-body">' /*'<p><tt>' + forms.type + "</tt><br /><tt>" + forms.kind + '</tt></p>' */ + '<form onsubmit="return false;">' + secret_input + form + info_box + '</form></div></div></div>';
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
		$panel, $panel_mask,
		active_forms = {}, af_obj = {},
		frm_key = $this.closest("div.panel-collapse").parent().attr("id");

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
				kapi_obj.storage_group = "forms_data";
				kapi_obj.loaderType = $panel.find("a.pull-left, a.pull-right");
				kapi_obj[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_TAG_ENUMERATIONS;
				kapi_obj.parameters = {};
				kapi_obj.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS] = {};
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_TAG] = tag;
				kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;

				$.ask_to_service(kapi_obj, function(res) {
					$.each(res[kAPI_RESPONSE_RESULTS], function(k, v) {
						$form.find(".dropdown-menu .dropdown-content > ul").append($.create_tree(v, $panel));
					});
					$item.removeClass("disabled");
					$form.find(".dropdown-toggle").dropdown("toggle");
					$form.find(".dropdown-menu > *").click(function(e) {
						e.stopPropagation();
					});
					if($form.find(".dropdown-menu").is(":visible")) {
						$form.find(".dropdown-menu .dropdown-header input").focus();

						console.log("ok");
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

								if(rowText.indexOf(inputText) == -1) {
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
							//$form.find(".dropdown-header input").focus();
						});
					}
					$form.on("submit", function(){
						return false;
					});
				});
			}
			$panel_mask.fadeOut(300);
			$(".save_btn").removeClass("disabled");
		} else {
			// Enable all items with same tag
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
			$.remove_storage("pgrdg_cache.selected_forms." + frm_key);
		}
	};

	/**
	* Select a form block
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
	$.get_operators_list = function(system_constants, callback) {
		$.list_operators = function(system_constants, callback) {
			if(jQuery.type(system_constants) == "string") {
				system_constants = jQuery.parseJSON(system_constants);
			}

			if(system_constants[kAPI_RESPONSE_RESULTS].kAPI_OP_LIST_OPERATORS !== undefined) {
				$.ask_to_service(system_constants[kAPI_RESPONSE_RESULTS].kAPI_OP_LIST_OPERATORS, function(oprts) {
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
					if(jQuery.type(callback) == "function") {
						callback.call(this, oprts);
					}
				});
			}
		};

		if(system_constants === undefined) {
			// Check the presence of constants on storage
			$.check_storage(kAPI_OP_LIST_CONSTANTS, current_path, function(data) {
				$.check_storage(kAPI_OP_LIST_REF_COUNTS, current_path); // Remember that you can pass also an array
			});
		} else {
			$.list_operators(system_constants, callback);
		}

	};


/*=======================================================================================
*	SEARCH FUNCTIONS
*======================================================================================*/

	/**
	* Add the main trait autocomplete form
	* @param {object}   options  Autocomplete html attributes (id, class, placeholder)
	* @param {string}   data     type of query
	* @param {Function} callback
	*/
	$.fn.addTraitAutocomplete = function(options, data, callback) {
		$.selected_menu = function(k, v) {
			var kk = k.replace("$", "");
			$("#" + options.id + "_operator").attr("class", "").addClass(kk).text(v);
			$("#autocomplete ul.dropdown-menu li").removeClass("active");
			$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
			$("#" + options.id).focus();
		};

		/**
		* Execute autocomplete
		* @param {object}   kAPI
		* @param {Function} callback
		*/
		$.execTraitAutocomplete = function(kAPI, callback) {
			$.get_storage_selected_forms = function() {
				var qc = {};
				$.each(storage.get("pgrdg_cache.selected_forms"), function(row_id, query) {
					$.each(query.active_forms, function(k, v) {
						qc[k] = v;
					});
				});
				return qc;
			};

			var form_data = {};
			$.ask_to_service(kAPI, function(response) {
				if (jQuery.type(callback) == "function") {
					if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
						if($(window).width() < 420) {
							$.left_panel("close");
						}
						$("#forms-head #right_btn, #forms-footer #right_btn").html('<span class="ionicons ion-trash-b"></span> Reset all').fadeIn(300, function() {
							$("#forms-head #right_btn, #forms-footer #right_btn").on("click", function() {
								$.reset_all_searches(true);
							});
						});
						$("section.container").animate({"padding-top": "115px"});
						$("#breadcrumb").animate({"top": "75px"});
						if($("#forms-head .btn-group a.save_btn").length === 0) {
							$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn disabled" style="display: none;">Search <span class="fa fa-chevron-right"></span></a>');
							$("#forms-footer .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn disabled" style="display: none;">Search <span class="fa fa-chevron-right"></span></a>');
						}
						if($("#breadcrumb").css("display") == "none") {
							$("#breadcrumb").fadeIn(200);
						}
						$("#forms").fadeIn(300);

						// Fires when user clicks on "Save" button
						$("#forms-head .btn-group a.save_btn, #forms-footer .btn-group a.save_btn").fadeIn(300, function() {
							$(this).on("click", function() {
							//	var qcriteria;
								form_data.history = storage.get("pgrdg_cache.forms");
								$.each($("#accordion > div.panel-default"), function(k, v) {
									var active_forms = {}, af_obj = {};
									frm_keys = $(this).attr("id");

									$.each($(this).find("div.panel-success:not(.disabled)"), function(i, v) {
										af_obj = $(this).find("form").serializeObject();
										rt = {};

										switch(af_obj["input-type"]) {
											case kAPI_PARAM_INPUT_ENUM:
												rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
												rt[kAPI_RESULT_ENUM_TERM] = af_obj.term.split(",");
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
											case kAPI_PARAM_INPUT_SHAPE: break;
											case kAPI_PARAM_INPUT_DEFAULT:
												rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
												switch(af_obj[kAPI_PARAM_RESPONSE_FRMT_TYPE]) {
													case kTYPE_BOOLEAN:
														rt[kAPI_PARAM_PATTERN] = (af_obj.boolean !== undefined && af_obj.boolean == "on") ? true : false;
														break;
													default:
														break;
												}
												active_forms[af_obj.tags] = rt;
												break;
										}
										storage.set("pgrdg_cache.selected_forms." + frm_keys, {
											request: storage.get("pgrdg_cache.forms." + frm_keys),
											key: $(this).attr("id"),
											forms: $(this).find("form").serializeObject(),
											active_forms: active_forms
										});
									});
								});

								$("#goto_results_btn, #goto_map_btn").hide();
								$.remove_storage("pgrdg_cache.summary");
								$.remove_storage("pgrdg_cache.results");
								$.remove_storage("pgrdg_cache.map");
								$.show_summary($.get_storage_selected_forms());
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

		options = $.extend({
			id: "",
			class: "",
			placeholder: "Choose...",
			operator: kAPI_OP_MATCH_TAG_LABELS
		}, options);
		var op_btn_list = "",
		selected_label = "Operator",
		checkbox = "",
		user_input,
		is_autocompleted = false,
		selected_label_key = "",
		selected_label_value = "";

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
		$(this).prepend('<div id="autocomplete"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + checkbox + '</div>');

		remoteAutocomplete = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: service_url + "%QUERY",
				replace: function(url, query) {
					var state = "true&query=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + options.operator + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '":"' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					//var state = "true&address=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '": "' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					return url.replace("%QUERY", state);
				},
				filter: function (parsedResponse) {
					var res = [];
					$.each(parsedResponse, function(respType, v) {
						if(((parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE] === undefined || parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE] === null) ? parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] : parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE]) == "ok" && parsedResponse[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
							if(respType == "results") {
								for (i = 0; i < parsedResponse[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED]; i++) {
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
			kAPI.storage_group = "forms";
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
					if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
						$("#forms-head .content-title").html('Output for "' + $("#" + options.id).val() + '"');
						if($("#forms-head div.clearfix + .help-block").length === 0) {
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
						$("input.switch").bootstrapSwitch();
						$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
							$(this).parent().find("input[type='checkbox']").attr("checked", state);
						});
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
					kAPI.storage_group = "forms";
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
							if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
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
								if($("#forms-head div.clearfix + .help-block").length === 0) {
									$("#forms-head").append('<div class="help-block">' + form_help_text + '</div>');
								}
								$("#forms").fadeIn(300);
								$("#forms-body .content-body").addCollapsible({id: response.id, title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#" + options.id).val() + '"</span>'), content: '<pre style="display: none;">' + JSON.stringify(response, null, "\t") + '</pre><br />' + forms});
								$("input.switch").bootstrapSwitch();
								$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
									$(this).parent().find("input[type='checkbox']").attr("checked", state);
								});
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
	* Add generic autocomplete form, like Trait Autocomplete
	*/
	$.fn.addAutocomplete = function(options, data, callback) {
		options = $.extend({
			id: "",
			class: "",
			placeholder: "Choose...",
			op: kAPI_OP_MATCH_TAG_LABELS
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
		$(this).prepend('<div id="autocomplete"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="' + options.id + '" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + checkbox + '</div>');

		remoteAutocomplete = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: service_url + "%QUERY",
				replace: function(url, query) {
					var state = "true&query=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + options.operator + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PARAM_LOG_REQUEST + '":true,"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '":"' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#filter_search_summary_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					//var state = "true&address=" + $.utf8_to_b64("{SERVICE_URL}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '": "' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#" + options.id).val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#" + options.id + "_operator").attr("class") + '"' + ($("#filter_search_summary_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
					return url.replace("%QUERY", state);
				},
				filter: function (parsedResponse) {
					var res = [];
					$.each(parsedResponse, function(respType, v) {
						if(((parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE] === undefined || parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE] === null) ? parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] : parsedResponse[kAPI_RESPONSE_STATUS][kAPI_STATUS_MESSAGE]) == "ok" && parsedResponse[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
							if(respType == "results") {
								for (i = 0; i < parsedResponse[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED]; i++) {
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

		$("#" + options.id).typeahead({
			hint: true,
			highlight: true,
			minLength: 3,
			limit: 50
		}, {
			displayKey: "value",
			//source: ((data == "remote") ? remoteAutocomplete.ttAdapter() : data)
			source: remoteAutocomplete.ttAdapter()
		}).bind("keydown", "return", function(event) {
			$(this).trigger("typeahead:_changed");
			return false;
		}).on("typeahead:selected typeahead:_changed", function(){
			var exclude = [];
			if(storage.isSet("pgrdg_cache.search.searched")) {
				st = storage.get("pgrdg_cache.search.searched");
				exclude = st.filter(function(itm, i, a){
					return i == st.indexOf(itm);
				});
				console.log(exclude);
			}

			/*
			if($("#autocomplete .input-group #autocomplete_undo_btn").length === 0) {
				$("#autocomplete .input-group").append('<span class="input-group-btn"><a class="btn btn-default-grey" id="autocomplete_undo_btn" href="javascript:void(0);"><span class="fa fa-reply"></span>Undo</a></span>');
			}
			$("#autocomplete_undo_btn").on("click", function() {
				apprise("Are you sure to remove all defined group filters?", {confirm: true}, function(r) {
					if(r) {
						$("#summary #summary-body").removeClass("disabled");
						$("#filter_stage").html("");
						$("#autocomplete_undo_btn").closest("span").remove();
						$("#filter_stage_panel").fadeOut(300, function() {
							$("#filter_search_summary").val("").focus();
						});
					}
				});
			});
			*/
			/*
			if (jQuery.type(callback) == "function") {
				callback.call(this);
			}
			*/

			// Autocomplete
			var kAPI = {};
			kAPI.storage_group = "search.loaded";
			kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_SUMMARY_TAG_BY_LABEL;
			kAPI.parameters = {};
			kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_EXCLUDED_TAGS] = [];
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id).val();
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class"), ($("#filter_search_summary_operator_i").is(":checked") ? '$i' : '""')];
			$.ask_to_service(kAPI, function(response) {
				if($.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0){
					var tag = {},
					exclude_tags = [],
					lll = "",
					contains = "";
					//console.log(response[kAPI_RESPONSE_RESULTS]);
					$("#summary_ordering").find(".modal-body").html('<ul class="fa-ul">');
					$.each(response[kAPI_RESPONSE_RESULTS], function(id, data){
						if(data[kAPI_PARAM_TAG] !== undefined) {
							tag[id] = data[kAPI_PARAM_TAG];
							exclude_tags.push(data[kAPI_PARAM_TAG]);

							if(data[kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN] !== undefined) {
								contains = data[kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME];
							}
							lll += $.iterate_childrens(data[kAPI_PARAM_RESPONSE_CHILDREN], 0, response.id, id, data[kAPI_PARAM_TAG], contains);
						}
					});
					$("#summary_ordering").find(".modal-body ul").html(lll);
					$("#summary_ordering").modal("show");

					$("#summary_ordering .modal-body .fa-ul a").hover(function(){
						$(this).next().find("a.unclickable").addClass("active");
					}, function() {
						$(this).next().find("a.unclickable").removeClass("active");
					});
				}
			});
			is_autocompleted = true;
			return false;
		});
	};


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
					$(this).remove(); $("#main_search").focus();
					if($("#accordion .panel").length === 0) {
						$.reset_all_searches(false);
					} else {
						var u = 0;
						$.each($("#accordion .panel").find("div.panel-success:not(.disabled)"), function(i, v) {
							u++;
						});
						if(u === 0) {
							$(".save_btn").addClass("disabled");
						}
					}
					$.remove_storage("pgrdg_cache.forms." + search_id);
					$.remove_storage("pgrdg_cache.selected_forms." + search_id);
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
			$("#forms-head #right_btn, #forms-head .save_btn, #forms-footer #right_btn, #forms-footer .save_btn").fadeOut(300, function() {
				$("#forms-head .content-title, #forms-footer .content-title").text("");
				$("#forms-body .content-body").html("");
				$("section.container").animate({"padding-top": "75px"}, 300, function(){
					// Reset breadcrumb and panels
					$.reset_breadcrumb();
					$.reset_contents("forms", true);
					$.reset_contents("summary", true);
					$.reset_contents("results", true);
					$.reset_contents("map", true);
				});
				$("#contents #start").fadeIn(600);
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
			$("#forms-head #right_btn, #forms-head .save_btn, #forms-footer #right_btn, #forms-footer .save_btn").fadeOut(300, function() {
				$.reset();
			});
		}
	};

	/**
	* Fulltext search from given text
	*/
	$.search_fulltext = function(text) {
		if(text.length >= 3) {
			var objp = {};
			objp.storage_group = "summary";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = text;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = [];
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
			$.ask_to_service(objp, function(response) {
				if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
					var res = response[kAPI_RESPONSE_RESULTS];

					$.activate_panel("summary", {res: response}, function() {
						$("#se_loader").fadeOut(300);
						$("#se_p").fadeIn(300);
						$("#group_by_btn").removeClass("disabled");
					});
				} else {
					$("#se_loader").addClass("text-warning").html('<span class="fa fa-times"></span> No results for this search');
					$("#search_form").focus();
				}
			});
		}
	};


/*=======================================================================================
*	CONTENT INTERFACE
*======================================================================================*/

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
	 * Remove single breadcrumb link
	 */
	$.remove_breadcrumb = function(item) {
		$("#goto_" + item.toLowerCase() + "_btn").css({"display": "none"});
	};

	/**
	* Reset selected content pane
	* @param {string} content The HTML id of content pane to reset
	*/
	$.reset_contents = function(content, storage_also) {
		if(storage_also === undefined || storage_also === null) {
			sorage_also = false;
		}
		$("#contents #" + content).fadeOut(300, function(){
			if(content == "map") {
				$.reset_map();
			} else {
				if(content == "forms") {
					$(this).find("#" + content + "-head").html('<h1 class="pull-left content-title"></h1><div class="btn-group pull-right"><a id="right_btn" class="btn btn-default-grey" style="display: none;" href="javascript: void(0);"></a></div><div class="clearfix"></div>');
					$(this).find("#" + content + "-footer").html('<div class="btn-group pull-right"><a id="right_btn" class="btn btn-default-grey" style="display: none;" href="javascript: void(0);"></a></div>');
				} else {
					$(this).find("#" + content + "-head").html('<h1 class="content-title"></h1>');
				}
				$(this).find("#" + content + "-body").html('<div class="content-body"></div>');
			}
		});
		if(storage_also) {
			$.remove_storage("pgrdg_cache." + content);
			$.remove_storage("pgrdg_cache.selected_forms");
		}
	};

	/**
	* Activate content pane
	* @param  {string} type    The panel to activate
	* @param  {object} options (res, label)
	*/
	$.activate_panel = function(type, options, callback) {
		options = $.extend({
			res: "",
			label: ""
		}, options);

		$.manage_url($.ucfirst(type));

		if(type !== "map") {
			if(type == "summary") {
				if(current_path == "Search") {
					$("#" + type + "-head h1.content-title > span").html("Results " + type.toLowerCase());
				} else {
					$("#" + type + "-head h1.content-title").html("Results " + type.toLowerCase());
				}
			} else {
				$("#" + type + "-head h1.content-title").html("Search " + type.toLowerCase());
			}

			$("#" + type + "-body .content-body").html("");
			if(type !== "results") {
				$.generate_summaries(options.res, "", function(result_panel){
					$("#" + type + "-body .content-body").attr("id", options.res[kAPI_PARAM_ID]).append(result_panel);
					//$("#" + type + "-body .content-body").attr("id", options.res.id).append("<div class=\"panel panel-success\"><div class=\"panel-heading\"><h4 class=\"list-group-item-heading\"><span class=\"title\">" + $.trim(values[kTAG_LABEL]) + "</span> <span class=\"badge pull-right\">" + values[kAPI_PARAM_RESPONSE_COUNT] + "</span></h4></div><div class=\"panel-body\"><div class=\"btn-group pull-right\"><a class=\"btn btn-default-white\" href=\"javascript: void(0);\" onclick=\"$.show_raw_data('" + options.res.id + "', '" + domain + "')\"><span class=\"fa fa-th\"></span> View data</a>" + ((values.points > 0) ? "<a onclick=\"$.show_data_on_map('" + options.res.id + "', '" + domain + "')\" class=\"btn " + ((values.points > 10000) ? "btn-warning disabled" : "btn-default") + "\">" + ((values.points > 10000) ? values.points + " points" : "<span class=\"ionicons ion-map\"></span>") + ' View map&emsp;<span class="badge">' + values.points + '</span></a>' : "") + "</div>" + values[kTAG_DEFINITION] + "</div></div>");
				});
			} else {
				var cols = options.res[kAPI_RESULTS_DICTIONARY][kAPI_DICTIONARY_LIST_COLS],
				rows = options.res[kAPI_RESPONSE_RESULTS];
				$("#" + type + "-body .content-body").append('<table id="' + options.res[kAPI_PARAM_ID] + '" class="table table-striped table-hover table-responsive"></table>');
				/**
				 * Parse cell content and display helps if present
				 * @param  {string|object} disp The text or object that will be parsed
				 * @return {string}      The html string to place iside cell
				 */
				$.cycle_disp = function(disp) {
					if($.type(disp) == "object") {
						return disp[kAPI_PARAM_RESPONSE_FRMT_DISP] + " " + ((disp[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? '<a href="javascript:void(0);" class="text-info pull-right" data-toggle="popover" data-content="' + $.html_encode(disp[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : "");
					} else if($.type(disp) == "array") {
						return disp.join(", ");
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
				$("table#" + options.res.id + " td a:not(.btn-default-white)").popover({
					container: "body",
					placement: function(pop, element){
						// Move popover on the left if we are on the last column
						if($(element).parent().is("td:last-child")) {
							return "left";
						} else {
							return "top";
						}
					},
					html: "true",
					trigger: "hover"
				});
				$("table#" + options.res.id + " td a.btn-default-white").tooltip();
				// $("table#" + options.res.id + " form a");
			}
			$("#contents #" + type + "").fadeIn(300);
		} else {
			if($("#pgrdg_map").children().length === 0) {
				map = $.init_map(function(map) {
					$.remove_storage("pgrdg_cache.map");
					$.reset_all_markers(map, markers);
					$.add_geojson_cluster(options.res);
				});
			} else {
				$.reset_all_markers(map, markers);
				$.add_geojson_cluster(options.res);
			}
			$("#pgrdg_map").fadeIn(600);
		}
		if (jQuery.type(callback) == "function") {
			callback.call(this);
		}
	};


	/*=======================================================================================
	*	SUMMARIES
	*======================================================================================*/

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
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = active_forms;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = [];
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
			kAPI.colour = true;

			$.ask_to_service(kAPI, function(res) {
				if($.obj_len(res[kAPI_RESPONSE_RESULTS]) > 0 || res[kAPI_RESPONSE_RESULTS].length > 0) {
					$.activate_panel("summary", {res: res});
				} else {
					apprise("No results for this search", {"title": "No data", "icon": "warning"});
				}
			});

		};

		/**
		 * Create summary content pane
		 * @options {object} the result of previous query (eg. Search or Autocomplete)
		 */
		$.generate_summaries = function(options, colour, callback) {
			$.get_domain_colour = function(domain) {
				return storage.get("pgrdg_cache.search.domain_colours." + domain);
			};
			//console.warn(options.history);
			var storage_id = options[kAPI_PARAM_ID],
			h = "";
			if(options.history !== undefined) {
				h = JSON.stringify(options.history);
			}

			$.each(options[kAPI_RESPONSE_RESULTS], function(domain, values) {
				var result_panel = $('<div class="result panel" style="border-color: ' + $.get_domain_colour(domain) + '">'),
				result_h4 = $('<h4 class="">'),
				result_title = $('<span class="title">'),
				result_description = $('<p>'),
				result_content_container = $('<div class="row">'),
				result_description_span_muted = $('<span class="col-lg-6 col-xs-3">'),
				result_description_span_right = $('<span class="col-lg-6 col-xs-9 text-right">');

				result_title.html($.trim(values[kAPI_PARAM_RESPONSE_FRMT_NAME]) + ((values[kAPI_PARAM_RESPONSE_COUNT] !== undefined) ? ' <sup class="text-danger">' + values[kAPI_PARAM_RESPONSE_COUNT] + '</sup>' : "")).appendTo(result_h4);
				result_h4.appendTo(result_panel);
				result_description.html(values[kAPI_PARAM_RESPONSE_FRMT_INFO]).appendTo(result_panel);

				result_description_span_muted.html('<span class="help-block"></span>').appendTo(result_content_container);
				result_description_span_right.append('<a class="btn text-info" href="javascript: void(0);" onclick="$.show_raw_data(\'' + storage_id + '\', \'' + domain + '\', \'0\', \'50\', \'' + $.rawurlencode(h) + '\')\"><span class="fa fa-list-alt"></span>View data</a>');
				if(values.points > 0) {
					result_description_span_right.append(' <span class="hidden-xs hidden-sm text-muted">|</span><a class="btn ' + ((values.points > 10000) ? "text-warning" : "") + '" href="javascript: void(0);" onclick="$.show_data_on_map(\'' + storage_id + '\', \'' + domain + '\', \'' + $.rawurlencode(h) + '\')" title="' + values.points + ' nodes for this entry"><span class="ionicons ion-map"></span>View map <sup class="text-muted">' + values.points + '</sup></a>');
				}
				result_description_span_right.appendTo(result_content_container);
				result_content_container.appendTo(result_panel);

				if (jQuery.type(callback) == "function") {
					callback.call(this, result_panel);
				}
			});
		};

		/**
		* Create indented summary content pane
		* @param {object} the result of previous query (eg. Search or Autocomplete)
		*/
		$.generate_tree_summaries = function(options, colour, callback) {
			$.random_colour = function() {
				return "rgb(" + (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 156)) + "," + (Math.floor(Math.random() * 156)) + ")";
			};
			$.title_behaviour = function(item) {
				var $item = item;
				if($("#" + $item.attr("href").replace("#", "")).hasClass("in")) {
					$item.closest("h4").css({
						"border-bottom-left-radius": "0",
						"border-bottom-width": "0"
					});
					$item.find("span").removeClass("fa-chevron-down").addClass("fa-chevron-right");
				} else {
					$item.closest("h4").css({
						"border-bottom-left-radius": "15px 10px",
						"border-bottom-width": "1px"
					});
					$item.find("span").removeClass("fa-chevron-right").addClass("fa-chevron-down");
				}
			};
			$.each(options[kAPI_RESPONSE_RESULTS], function(domain, values) {
				// GOOD
				//console.log(options.level, [values[kAPI_PARAM_OFFSETS], values[kAPI_PARAM_PATTERN]]);
				var hobj = {};
				hobj[values[kAPI_PARAM_OFFSETS]] = values[kAPI_PARAM_PATTERN];
				options.history[options.level] = hobj;

				var item_colour = (colour !== undefined && colour !== "") ? colour : $.set_colour("random", 0.7),
				item_id = $.makeid(),
				result_panel = $('<div class="result panel tree_summary">'),
				result_h4 = $('<h4 style="border-color: ' + item_colour + '">'),
				// "data-parent" attribute was removed here
				result_title = $('<a class="btn btn-unstyled" data-toggle="collapse" href="#' + item_id + '" class="title" onclick="$.title_behaviour($(this));">'),
				result_description = $('<small class="help-block">'),
				result_content_container = $('<div class="row collapse" id="' + item_id + '">'),
				result_description_ul_results = $('<div class="children">'),
				res = {},
				has_child = false,
				child_counts = 0;

				if($.obj_len(values[kAPI_PARAM_RESPONSE_CHILDREN]) > 0) {
					res[kAPI_PARAM_ID] = options[kAPI_PARAM_ID];
					res[kAPI_RESPONSE_RESULTS] = values[kAPI_PARAM_RESPONSE_CHILDREN];

					$.each(res[kAPI_RESPONSE_RESULTS], function(dom, data) {
						if(data[kAPI_PARAM_RESPONSE_CHILDREN] !== undefined && $.obj_len(data[kAPI_PARAM_RESPONSE_CHILDREN]) > 0) {
							has_child = true;
							child_counts = 0;
						} else {
							has_child = false;
							child_counts += data[kAPI_PARAM_RESPONSE_COUNT];
						}
					});
					res.level = (options.level + 1);
					res.domain_id = options.domain_id;
					res.history = options.history;
					if(has_child) {
						$.generate_tree_summaries(res, item_colour, function(tree) {
							result_description_ul_results.append(tree);
							options.history = [options.history[0]];
						});
					} else {
						$.generate_summaries(res, item_colour, function(tree) {
							result_description_ul_results.append(tree);
						});
					}
					result_description_ul_results.appendTo(result_content_container);
				}
				result_title.html('<span class="fa fa-chevron-right text-muted"></span> ' + $.trim(values[kAPI_PARAM_RESPONSE_FRMT_NAME]) + ' <sup class="text-danger">' + ((!has_child) ? child_counts : $.obj_len(values[kAPI_PARAM_RESPONSE_CHILDREN])) + '</sup>').appendTo(result_h4);
				if(values[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) {
					result_description.html('<span style="margin-left: 25px;">' + values[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</span>').appendTo(result_h4);
				}
				result_h4.appendTo(result_panel);
				result_content_container.appendTo(result_panel);

				if (jQuery.type(callback) == "function") {
					callback.call(this, result_panel);
				}
			});
		};


		/**
		* Generate dialog contents
		*/
		$.iterate_childrens = function(data, level, storage_id, id, tag, contains) {
			$("#summary #summary-body").addClass("disabled");
			if(id !== undefined) {
				$.fn.to_html = function() {
					return $('<div></div>').html($(this).clone()).html();
				};
				var list = $('<li>'),
				lists = "",
				name = "",
				info = "",
				already_selected = false;

				if(level === undefined) {
					level = 0;
				}

				if(!storage.isSet("pgrdg_cache.search.selected." + storage_id)) {
					storage.set("pgrdg_cache.search.selected", storage_id);
				}
				if($.inArray(id, storage.get("pgrdg_cache.search.selected." + storage_id)) > -1) {
					already_selected = true;
				}
				$.each(data, function(d, v){
					if(d !== kAPI_PARAM_TAG) {
						if(d == kAPI_PARAM_RESPONSE_CHILDREN) {
							var ul = $('<ul class="fa-ul level2">');

							ul.append($.iterate_childrens(v, (level +1), storage_id, id, tag, contains));
							list.append(ul);
						} else {
							if(v !== undefined && v !== null) {
								if(d == kAPI_PARAM_RESPONSE_FRMT_NAME) {
									if(level === 0) {
										list.html('<a onclick="" href="javascript: void(0);" class="btn ' + ((already_selected) ? "btn-default" : "btn-default-white") + '"><h5 class="row"><span class="col-md-11 vcenter">' + v + '</span><span class="fa fa-fw fa-angle-right col-md-1 vcenter"></span></h5></a>');
									} else {
										list.html('<a onclick="" href="javascript: void(0);" class="btn unclickable ' + ((already_selected) ? "btn-default" : "btn-default-white") + '"><h5>' + v + '</h5></a>');
									}
									name = v;
								}
								if(d == kAPI_PARAM_RESPONSE_FRMT_INFO) {
									list.find("h5 > span.col-md-11").append('<span class="help-block">' + v + '</span>');
									info = v;
								}
								list.find('a').attr("onclick", '$(this).add_remove_item_to_stage(\'' + storage_id + '\', \'' + id + '\', \'' + name + '\', \'' + contains + '\', \'' + info + '\');');
								if(already_selected) {
									list.find('a').add_remove_item_to_stage(storage_id, id, name, contains, info, false);
								}
							}
						}
						lists = list.to_html();
					}
				});
				return lists;
			}
		};

		/**
		* Group buttons in the dialog
		*/
		$.group_tag_by = function(storage_id, id, name, contains, info) {
			var selected = [];
			if(storage.isSet("pgrdg_cache.search.selected." + storage_id)) {
				selected = storage.get("pgrdg_cache.search.selected." + storage_id);
			}
			if($.inArray(id, storage.get("pgrdg_cache.search.selected." + storage_id)) === -1) {
				selected.push(id);
			} else {
				already_selected = true;
			}

			if($("#filter_stage #" + $.md5(id)).length === 0) {
				var already_selected = false,
				panel = $('<a href="javascript:void(0);" onclick="$.select_group_filter($(this));" class="list-group-item list-group-item-success" id="' + $.md5(id) + '" data-id="' + id + '" data-storage-id="' + storage_id + '">');

				panel.html('<h4 class="list-group-item-heading">' + name + '</h4>');
				if(info !== undefined && info !== null && info.length > 0) {
					panel.append('<p class="list-group-item-text">' + info + '</p>');
				}
				if(contains !== undefined && contains !== null && contains !== "") {
					panel.append('<h4 style="padding-left: 15px;" class="text-muted">' + contains + '</h4>');
				}
				if($("#filter_stage").html().length === 0) {
					$("#filter_stage_panel").fadeIn(300);
					$("#filter_group_title").text("Add another filter");
				}

				// Move on the stage
				$("#filter_stage").append(panel);
			} else {
				if($("#" + $.md5(id) + "_restore").length > 0) {
					$.restore_deleted_filter($.md5(id));
				}
			}

			storage.set("pgrdg_cache.search.selected." + storage_id, selected);
		};

		/**
		* Re-open filters dialogs and let user to add or remove others
		*/
		$.fn.edit_filter = function() {
			var response = storage.get("pgrdg_cache.search.loaded." + $(this).attr("data-storage-id") + ".response"),
			tag = {},
			exclude_tags = [],
			lll = "",
			contains = "";
			$("#summary_ordering").find(".modal-body").html('<ul class="fa-ul">');
			$.each(response[kAPI_RESPONSE_RESULTS], function(id, data){
				if(data[kAPI_PARAM_TAG] !== undefined) {
					tag[id] = data[kAPI_PARAM_TAG];
					exclude_tags.push(data[kAPI_PARAM_TAG]);

					if(data[kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN] !== undefined) {
						contains = data[kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME];
					}
					lll += $.iterate_childrens(data[kAPI_PARAM_RESPONSE_CHILDREN], 0, response.id, id, data[kAPI_PARAM_TAG], contains);
				}
			});
			$("#summary_ordering").find(".modal-body ul").html(lll);
			$("#summary_ordering").modal("show");

			$("#summary_ordering .modal-body .fa-ul a").hover(function(){
				$(this).next().find("a.unclickable").addClass("active");
			}, function() {
				$(this).next().find("a.unclickable").removeClass("active");
			});
		};


		/*=======================================================================================
		*	FILTERS STAGE
		*======================================================================================*/

			/**
			* Generate stage buttons reading selected filters on the storage
			*/
			$.restore_stage = function() {
				if(storage.isSet("pgrdg_cache.search.selected._ordering")) {
					if(!$("#summary #summary-body").hasClass("disabled")) {
						$("#summary #summary-body").addClass("disabled");
					}
					$.each(storage.get("pgrdg_cache.search.selected._ordering"), function(k, v) {
						$("#group_by_btn").append('<small class="label label-danger" style="position: absolute; top: -6px; right: -6px;">' + $.obj_len(storage.get("pgrdg_cache.search.selected._ordering")) + '</small>');

						if($.obj_len(v) > 0) {
							var id = v.id, storage_id = v.storage;
							if(storage.isSet("pgrdg_cache.search.loaded." + storage_id + ".response." + kAPI_RESPONSE_RESULTS)) {
								var res = storage.get("pgrdg_cache.search.loaded." + storage_id + ".response." + kAPI_RESPONSE_RESULTS),
								name = res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME],
								info = res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_INFO],
								a = $('<a class="list-group-item list-group-item-success" href="javascript:void(0);" onclick="$.select_group_filter($(this));" id="' + $.md5(id) + '" data-id="' + id + '" data-storage-id="' + storage_id + '">');
								a.html('<h4 class="list-group-item-heading">' + name + '</h4>');
								if(info !== undefined && info.length > 0) {
									a.append('<p class="list-group-item-text">' + info + '</p>');
								}
								if(res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN] !== undefined) {
									a.append('<h4 style="padding-left: 15px;" class="text-muted">' + res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME] + '</small>');
								}
								//if($.inArray(id, item) > -1) {
									$("#filter_stage").append(a);
								//}
								$("#filter_stage_panel").fadeIn(300);
							}
						}
						$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
					});
					$.exec_ordering();
				}
			};

			/**
			* Highlight selected filter button of the stage
			*/
			$.select_group_filter = function(item) {
				$this = item;

				if($this.hasClass("active")) {
					$this.removeClass("active");
					$("#filter_stage_controls a").addClass("disabled");
				} else {
					$("#filter_stage a").removeClass("active");
					$this.addClass("active");
					if($("#filter_stage a:visible").length > 0) {
						$("#filter_stage_controls a").removeClass("disabled");
					}
					$.show_btns();
				}
			};

			/**
			* Enable/disable stage buttons (move, edit and remove buttons)
			*/
			$.show_btns = function() {
				if($("#filter_stage > a.active").prev(":visible").length === 0) {
					$("#move_down_btn, #move_bottom_btn").removeClass("disabled");
					$("#move_up_btn, #move_top_btn").addClass("disabled");
				}
				if($("#filter_stage > a.active").next(":visible").length === 0) {
					$("#move_up_btn, #move_top_btn").removeClass("disabled");
					$("#move_down_btn, #move_bottom_btn").addClass("disabled");
				}
				if($("#filter_stage > a.active").prev(":visible").length > 0 && $("#filter_stage a.active").next(":visible").length > 0) {
					$("#move_top_btn, #move_up_btn, #move_down_btn, #move_bottom_btn").removeClass("disabled");
				}
			};

			/**
			* Move selected item on the stage (top, up, down and bottom directions)
			*/
			$.fn.move_to = function(where) {
				var selected = $('#filter_stage a.active'),
				selected_before = $("#filter_stage a.active").prev(),
				selected_after = $("#filter_stage a.active").next();

				switch(where) {
					case "top":
						selected.remove();
						$('#filter_stage').prepend(selected);
						break;
					case "bottom":
						selected.remove();
						$('#filter_stage').append(selected);
						break;
					case "up":
						selected.remove();
						selected.insertBefore(selected_before);
						break;
					case "down":
						selected.remove();
						selected.insertAfter(selected_after);
						break;
				}

				$.update_ordering();
				$.show_btns();
			};

			/**
			* Add or remove selected item from the stage
			*/
			$.fn.add_remove_item_to_stage = function(storage_id, id, name, contains, info, display_message) {
				if(display_message === undefined) {
					display_message = true;
				}
				if($(this).closest("ul:not(.level2) > li").find("a").hasClass("btn-default")) {
					$(this).closest("ul:not(.level2) > li").find("a").removeClass("btn-default").addClass("btn-default-white");
					$(this).next().find("a.unclickable").removeClass("btn-default").addClass("btn-default-white");

					$("#filter_stage #" + $.md5(id)).remove_filter(true);
					if(display_message) {
						$("#modal_messages").removeClass("alert-success").addClass("alert-danger").find("div.text-left").text('"' + name + '" removed');
						$("#modal_messages").fadeIn(300);
					}
				} else {
					$(this).closest("ul:not(.level2) > li").find("a").removeClass("btn-default-white").addClass("btn-default");
					$(this).next().find("a.unclickable").removeClass("btn-default-white").addClass("btn-default");
					$.group_tag_by(storage_id, id, name, contains, info);
					if(display_message) {
						$("#modal_messages").removeClass("alert-danger").addClass("alert-success").find("div.text-left").text('"' + name + '" added');
						$("#modal_messages").fadeIn(300);
					}
				}
				$.update_ordering();

			};

			/**
			* Restore a previous removed filter from stage
			*/
			$.restore_deleted_filter = function(id) {
				var item_id = $("#" + id).attr("data-id"),
				storage_id = $("#" + id).attr("data-storage-id"),
				selected = storage.get("pgrdg_cache.search.selected." + storage_id);

				$("#" + id + "_restore").stop().remove();
				$("#" + id).fadeIn(300, function() {
					$("#filter_stage_controls a").removeClass("disabled");
					$.show_btns();

					selected.push(item_id);
					storage.set("pgrdg_cache.search.selected." + storage_id, selected);
				});
				$.update_ordering();
			};

			/**
			* Remove a filter
			*/
			$.fn.remove_filter = function(direct) {
				$.reset_stage = function() {
					$("#summary #summary-body").removeClass("disabled");
					$("#filter_stage").html("");
					//$("#autocomplete_undo_btn").closest("span").remove();
					$("#filter_stage_panel").fadeOut(300, function() {
						$("#filter_search_summary").val("").focus();
					});
				};

				var id = $(this).attr("data-id"),
				storage_id = $(this).attr("data-storage-id"),
				selected = storage.get("pgrdg_cache.search.selected." + storage_id);

				$("#filter_stage_controls a").addClass("disabled");
				$(this).fadeOut(300, function() {
					if(!direct) {
						$('<div id="' + $.md5(id) + '_restore" class="well well-sm text-muted">Removed \"' + $(this).find("h4").text() + '\".<a class="pull-right text-muted" href="javascript:void(0);" onclick="$.restore_deleted_filter(\'' + $(this).attr("id") +  '\')" title="Restore it"><small class="fa fa-reply"></small></a></div>').insertBefore($(this));

						$("#" + $.md5(id) + "_restore").fadeOut(10000, "easeInExpo", function() {
							$("#" + $.md5(id) + "_restore").remove();
							$("#" + $.md5(id)).remove();
							if($("#filter_stage > a:visible").length === 0) {
								$.reset_stage();
							}
						});
					} else {
						if($("#filter_stage > a:visible").length === 0) {
							$.reset_stage();
						}
						$("#" + $.md5(id)).remove();
					}

					selected = $.grep(selected, function(value) {
						return value != id;
					});
					storage.set("pgrdg_cache.search.selected." + storage_id, selected);
					$.update_ordering();
				});

				if($("#filter_stage a").length === 0) {
					$("#filter_stage_controls a").addClass("disabled");
				}
			};

			/**
			* Cancel and remove all ordering criteria
			*/
			$.reset_ordering = function() {
				apprise("Do you really want to cancel and remove all defined group filters?", {title: "Reset all group filters", icon: "warning", confirm: true}, function(r) {
					if(r) {
						$("#summary #summary-body").removeClass("disabled");
						$("#filter_stage").html("");
						$("#autocomplete_undo_btn").closest("span").remove();
						$("#filter_stage_panel").fadeOut(300, function() {
							$("#autocomplete .typeahead").val("");
						});

						if(!$("#summary_order_cancel_btn").hasClass("disabled")) {
							$("#summary_order_cancel_btn").addClass("disabled");
						}
						if(!$("#summary_order_reorder_btn").hasClass("disabled")) {
							$("#summary_order_reorder_btn").addClass("disabled");
						}
						$("#summary #summary-body").removeClass("disabled");
						$("#collapsed_group_form").collapse("hide");
						$("#group_by_btn .label-danger").remove();
						$.search_fulltext($("#search_form").val());

						storage.remove("pgrdg_cache.search.selected");
					}
				});
			};

			/**
			* Update the ordering in the storage
			*/
			$.update_ordering = function() {
				var st = [];

				if(!$("#summary #summary-body").hasClass("disabled")) {
					$("#summary #summary-body").addClass("disabled");
				}
				$.each($("#filter_stage > a:visible"), function(k, item) {
					var stid = $(this).attr("data-id"),
					ststorage_id = $(this).attr("data-storage-id");
					st.push({"id": stid, "storage": ststorage_id});
				});
				storage.set("pgrdg_cache.search.selected._ordering", st);

				if(st.length > 0) {
					if($("#group_by_btn .label-danger").length === 0) {
						$("#group_by_btn").append('<small class="label label-danger" style="position: absolute; top: -6px; right: -6px;">' + st.length + '</small>');
					} else {
						$("#group_by_btn .label-danger").text(st.length);
					}
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
				} else {
					storage.remove("pgrdg_cache.search.selected");
					$("#group_by_btn .label-danger").remove();
				}
			};

			/**
			* Call Service and reorder results summary
			*/
			$.exec_ordering = function() {
				var ids = [];

				$("#summary #summary-body").removeClass("disabled");
				$.each(storage.get("pgrdg_cache.search.selected._ordering"), function(k, data) {
					ids.push(data.id);
				});
				$("#collapsed_group_form").collapse("hide");

				var objp = {};
				objp.storage_group = "summary";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = $.trim($("#search_form").val());
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = ids;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
				$.ask_to_service(objp, function(response) {
					if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
						var res = response;
						res.level = 0;
						res.history = [];

						$("#summary-body .content-body").html("");
						$.generate_tree_summaries(res, "", function(result_panel){
							$("#summary-body .content-body").attr("id", res[kAPI_PARAM_ID]).append(result_panel);
						});
					}
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
		$.show_raw_data = function(id, domain, skip, limit, grouped_data) {
			if(skip === undefined || skip === null || skip === "") { skip = 0; }
			if(limit === undefined || limit === null || limit === "") { limit = 50; }
			if(grouped_data === undefined || grouped_data === null || grouped_data === "") {
				grouped_data = {};
			} else {
				grouped_data = $.parseJSON($.rawurldecode(grouped_data));
			}

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
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SUMMARY] = grouped_data;
			$.ask_to_service(objp, function(res) {
				$.activate_panel("results", {title: $("#" + id + " .panel-heading span.title").text(), domain: domain, res: res});
			});

		};

		/**
		 * Recursive parse of contents in expanded row
		 * @param  {object} res The content to parse
		 */
		$.parse_row_content = function(res, a_id) {
			$.cycle_disp = function(disp, what, who) {
				if($.type(disp) == "string") {
					return disp;
				} else {
					return disp[what] + ((disp[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? ' <a href="javascript:void(0);" class="text-info" data-toggle="popover" data-content="' + $.html_encode(disp[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : '');
				}
			};
			$.call_service = function(serv, a_id) {
				var service = $.parseJSON($.b64_to_utf8(serv));

				var objp = {};
				objp[kAPI_REQUEST_OPERATION] = service[kAPI_REQUEST_OPERATION];
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = service[kAPI_REQUEST_LANGUAGE];
				objp.parameters[kAPI_REQUEST_PARAMETERS] = service[kAPI_REQUEST_PARAMETERS];

				$.ask_to_service(objp, function(data) {
					$.each(data[kAPI_RESPONSE_RESULTS], function(domain, ress) {
						var $item = $("#" + a_id).parent();
						if($item.find("div").length === 0) {
							$item.append($.parse_row_content(ress).replace('<div>', '<div style="display: none;">'));
							$item.find("a").popover({container: "body", placement: "auto", html: "true", trigger: "hover"});
						}
						if($item.find("div").is(":visible")) {
							$item.find("div").slideUp(300);
							$item.find("a > .fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-right");
						} else {
							$item.find("div").slideDown(300);
							$item.find("a > .fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-down");
						}
					});
				});
			};

			var r = "",
			v_type = "",
			v_list = "",
			is_struct = false,
			id;

			$.each(res, function(tag, content) {
				if(content[kAPI_PARAM_RESPONSE_FRMT_DOCU] === undefined) {
					switch($.type(content[kAPI_PARAM_RESPONSE_FRMT_DISP])) {
						case "object":
							r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: ' + $.highlight(content[kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP]);
							break;
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
									r += '<li>' + $.highlight($.cycle_disp(v, kAPI_PARAM_RESPONSE_FRMT_DISP)) + '</li>';
								});
								r += '</ul></li>';
							} else {
								r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: <ul>' + v_list + '</ul></li>';
							}
							break;
						case "string":
							if(content[kAPI_PARAM_RESPONSE_FRMT_LINK] !== undefined) {
								r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: <a target="_blank" href="' + content[kAPI_PARAM_RESPONSE_FRMT_LINK] + '">' + $.highlight(content[kAPI_PARAM_RESPONSE_FRMT_DISP]) + '</a></li>';
							} else {
								if(content[kAPI_PARAM_RESPONSE_FRMT_DISP] !== undefined) {
									if(content.serv !== undefined) {
										var a_id = $.uuid();
										r += '<li><b>'+ $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: &nbsp;<a id="' + a_id + '" onclick="$.call_service(\'' + $.utf8_to_b64(JSON.stringify(content.serv)) + '\', \'' + a_id  + '\')" href="javascript:void(0);"><span class="fa fa-caret-right">&nbsp;' + $.highlight(content[kAPI_PARAM_RESPONSE_FRMT_DISP]) + '</a></li>';
									} else {
										r += '<li><b>'+ $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: ' + $.highlight(content[kAPI_PARAM_RESPONSE_FRMT_DISP]) + '</li>';
									}
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
						r += '<li><div class="back_indent"><span class="fa fa-fw fa-caret-right"></span> <a href="javascript:void(0);" data-toggle="collapse" data-target="#' + id + '" onclick="$(this).prev(\'span\').toggleClass(\'fa-caret-right fa-caret-down\');">' + label + '</a>: <div id="' + id + '" class="collapse">' + /*$.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_DISP)*/ $.parse_row_content(content[kAPI_PARAM_RESPONSE_FRMT_DOCU]) + '</div></div></li>';
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
		 * Highlight text for more readability
		 */
		$.highlight = function(string) {
			if($.isNumeric(string)) {
				return '<span style="color: #099;">' + string + '</span>';
			} else if (Date.parse("some string")) {
				return '<span style="color: #800000;">' + string + '</span>';
			} else {
				return $.linkify(string);
			}
		};

		/**
		* Show row data contents
		* @param  {string} id     Storage id
		* @param  {string} domain Domain
		* @param  {int}    skip   Skip
		* @param  {int}    limit  Limit
		*/
		$.show_raw_row_content = function(id, domain) {
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
				$("tr#" + $.md5(domain) + " a.text-info, tr#" + $.md5(domain) + " span.info").popover({
					container: "body",
					placement: "auto",
					html: "true",
					trigger: "hover"
				});
			});
		};

		/**
		* Show data on map
		* @param  {string} id     Storage id
		* @param  {string} domain Domain
		*/
		$.show_data_on_map = function(id, domain, grouped_data) {
			if(grouped_data === undefined || grouped_data === null || grouped_data === "") {
				grouped_data = {};
			} else {
				grouped_data = $.parseJSON($.rawurldecode(grouped_data));
			}

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
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 5000;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = "true";
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SUMMARY] = grouped_data;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_MARKER;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE;
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE] = {};
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE][kTAG_TYPE] = "Polygon";
				//objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE][kTAG_GEOMETRY] = geometry;

			$.ask_to_service(objp, function(res) {
				// console.log(res);
				if(res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
					$.activate_panel("map", {res: res.results, shape: kTAG_GEO_SHAPE});
					if(res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT]) {
						var alert_title = "Displayed " + objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] + " of " + res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] + " markers";
						setTimeout(function() {
							apprise("The map cannot currently display more than " + objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] + " points.<br />This means that it contains only the first " + objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] + " points: this limitation will be resolved shortly, in the meanwhile, please reduce your selection.", {class: "only_1k", title: alert_title, titleClass: "text-danger", icon: "fa-eye-slash"});
						}, 4000);
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



	/*=======================================================================================
	*	FORM TYPES
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
		var op_btn_list = "",
		selected_label_key = "";

		$.each(operators, function(k, v) {
			if(!v.main) {
				if(v.label !== undefined) {
					checkbox += '<div class="checkbox"><label title="' + ((v.title !== undefined) ? v.title : "") + '" onclick="$(\'#' + options.id[0] + '_operator_' + v.key.replace("$", "") + '\').val(($(\'#' + options.id[0] + '_operator_' + v.key.replace("$", "") + '\').is(\':checked\') ? \'' + v.key + '\' : \'\'))"><input type="checkbox" id="' + options.id[0] + '_operator_' + v.key.replace("$", "") + '" ' + ((v.selected) ? 'checked="checked"' : "") + ' title="' + ((v.title !== undefined) ? v.title : "") + '" name="case_sensitive" value="' + v.key + '" /> ' + v.label + '</label></div>';
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
	* Add switch input form
	* @param {object} options (id, class, placeholder, type, disabled)
	*/
	$.add_switch = function(options) {
		options = $.extend({
			id: $.makeid(),
			size: "normal",
			default: "on",
			on_txt: "True",
			off_txt: "False"
		});
		return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_DEFAULT + '" /><div class="text-center"><input type="checkbox" class="switch"' + ((options.default == "on") ? ' checked="checked"' : '') + 'data-on-text="' + options.on_txt + '" data-off-text="' + options.off_txt + '" data-size="' + options.size + '" id="' + options.id + '" name="boolean" /></div>';
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
		return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_RANGE + '" /><div class="input-group"><input id="' + options.id[0] + '_operator_type" type="hidden" name="operator" value="' + selected_label_key + '" /><div class="input-group-btn"><button ' + ((options.disabled) ? 'disabled="disabled"' : " ") + ' data-toggle="dropdown" class="btn btn-default-white dropdown-toggle" type="button"><span id="' + options.id[0] + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu" id="' + options.id[0] + '_operator_type_ul">' + op_btn_list + '</ul></div><span class="input-group-addon_white">From</span><input class="' + options.class[0] + '" type="' + input_type + '" id="' + options.id[0] + '" name="from" min="' + min + '" max="' + max + '" placeholder="' + placeholder[0] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/><span class="input-group-addon_white">to</span><input class="' + options.class[1] + '" type="' + input_type + '" id="' + options.id[1] + '" name="to" min="' + min + '" max="' + max + '" placeholder="' + placeholder[1] + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>';
	};

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
			$(".panel-collapse.collapse").collapse("hide");
		}

		var root_node = $('<div id="' + options.id + '" class="panel panel-default">'),
			node_heading = $('<div class="panel-heading">'),
				node_heading_title = $('<h4 class="panel-title row"><div class="col-md-1 text-right pull-right"><a title="Remove" href="javascript:void(0);" onclick="$.remove_search($(this));"><span class="fa fa-times" style="color: #666;"></span></a></div><div class="col-lg-6 pull-left"><span class="' + options.icon + '"></span>&nbsp;&nbsp;<a data-toggle="collapse" data-parent="#accordion" href="#' + options.id + '_collapse">' + options.title + '</a></div>' + ((developer_mode) ? '<div class="col-sm-5"><a href="javascript:void(0);" onclick="$(\'#' + options.id + '_collapse > .panel-body > pre\').slideToggle()" class="text-info" title="Show/hide json source"><span class="fa fa-file-code-o"></span> json</div>' : '') + '</h4>'),
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


	/*=======================================================================================
	*	CHOSEN
	*======================================================================================*/

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


	/*=======================================================================================
	*	MULTISELECT
	*======================================================================================*/

		/**
		* Add Multiselect autocomplete
		*/
		$.create_tree = function(v, item) {
			$.get_node = function(node) {
				$param = item;
				if(!$("#node_" + node).hasClass("open")) {
					$("#" + node + "_toggler").find("span").removeClass("fa-caret-right").addClass("fa-caret-down");

					if($("#node_" + node).html() === "") {
						$("#node_" + node).show().html('<span class="fa fa-refresh fa-spin"></span> Acquiring data...');
						var objp = {};
						objp.storage_group = "forms_data";
						objp.loaderType = $panel.find("a.pull-left, a.pull-right");
						objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_NODE_ENUMERATIONS;
						objp.parameters = {};
						objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
						objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
						objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
						objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_NODE] = parseInt(node);
						objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;

						$.ask_to_service(objp, function(res) {
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
			triangle = '<a class="tree-toggler text-muted" onclick="$.get_node(\'' + v.node + '\'); return false;" id="' + v.node + '_toggler" href="javascript: void(0);"><span class="fa fa-fw fa-caret-right"></span></a>',
			checkbox = '<div class="checkbox">';
				checkbox += '<label class="' + ((v[kAPI_PARAM_RESPONSE_COUNT] === undefined || v[kAPI_PARAM_RESPONSE_COUNT] === 0) ? 'text-muted' : '') + '">';
				checkbox += '<input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" ';
					if(v[kAPI_PARAM_RESPONSE_COUNT] === undefined || v[kAPI_PARAM_RESPONSE_COUNT] === 0) {
						checkbox += 'disabled="disabled"';
					}
				checkbox += ' /> {LABEL}</label></div>';
			var checkbox_inline = '<div class="checkbox-inline">';
				checkbox_inline += '<label>';
				checkbox_inline += '<input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\');" /> {LABEL}</label></div>';

			if (v.children !== undefined && v.children > 0) {
				content += '<li class="list-group-item">' + triangle + '<span title="' + $.get_title(v) + '">' + ((v.value !== undefined && v.value) ? checkbox_inline.replace("{LABEL}", v.label) : '<a class="btn-text" href="javascript: void(0);" onclick="$.get_node(\'' + v.node + '\'); return false;">' + v.label + '</a>') + '</span><ul id="node_' + v.node + '" style="display: none;" class="nav nav-list tree"></ul></li>';
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




/*======================================================================================*/

// Save the current page if user change
/*window.onbeforeunload = function() {
	storage.set("pgrdg_cache.html", $.utf8_to_b64($("body").html()));
};*/

$(document).ready(function() {
	if(current_path == "Search") {
		$(window).resize(function () {
			// Resize the forms when window is resized
			$.resize_forms_mask();
		});
		if($.obj_len(query) > 0) {
			if(storage.isSet("pgrdg_cache.search.selected._ordering") && storage.get("pgrdg_cache.search.selected._ordering").length > 0) {
				$.restore_stage();
			} else {
				$.search_fulltext(query.q);
			}
		}
	}
	$.reset_contents("forms", true);
	$.remove_storage("pgrdg_cache.selected_forms");
	$.remove_storage("pgrdg_cache.forms_data");
	// Adjust dropdown buttons visualization
	$("button.dropdown-toggle").on("click", function(e) {
		if($(this).closest(".input-group").hasClass("open")) {
			$(this).closest(".input-group").removeClass("open");
		} else {
			$(this).closest(".input-group").addClass("open");
		}
	});
	$(".panel-body form").submit(false);
	$(".panel-body form:submit").attr("disabled", "disabled");
	// Restore the previous content of Search page
	/*if(storage.isSet("pgrdg_cache.html") && storage.get("pgrdg_cache.html") !== undefined) {
		$("body").html($.b64_to_utf8(storage.get("pgrdg_cache.html")));
	}*/
});
