/*jshint scripturl:true*/
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


/*=======================================================================================
*	CORE FORM FUNCTIONS
*======================================================================================*/

	/**
	* Create the form
	*/
	$.create_form = function(response, single_form) {
		$.fn.change_offsets = function(ref, item_id, domain) {
			var arr = [],
			tot = 0,
			checked = 0,
			unchecked = 0;

			$.each($(this).closest("ul").find("a:not(.select_all)"), function(k, v) {
				$item = $(this);
				if($item.find("span:first-child").hasClass("fa-check-square-o")) {
					arr.push($item.attr("data-offset"));
				}
			});
			if($(this).find("span:first").hasClass("fa-check-square-o")) {
				// Is checked
				var chckd = -1, unchckd = -1;
				$.each($(this).closest("ul").find("a:not(.select_all) > span:first-child"), function(k, v) {
					if($(this).hasClass("fa-check-square-o")) {
						chckd++;
					} else {
						unchckd++;
					}
				});
				if(chckd > 0) {
					$(this).find("span:first").removeClass("fa-check-square-o").addClass("fa-square-o");
					arr.splice($.inArray($(this).attr("data-offset"), arr), 1);
				}
			} else {
				$(this).find("span:first").removeClass("fa-square-o").addClass("fa-check-square-o");
				arr.push($(this).attr("data-offset"));
			}
			arr = $.array_unique(arr);
			// Add the array of checked offsets in a hidden form
			$("#" + $.md5(domain) + "_offset_input").val(arr);
			if(checked == tot) {
				$(this).closest("ul").find("a.select_all > span:first-child")
					.removeClass("fa-square-o")
					.addClass("fa-check-square-o");
			} else {
				$(this).closest("ul").find("a.select_all > span:first-child")
					.removeClass("fa-check-square-o")
					.addClass("fa-square-o");
			}
			// Check/uncheck the "Select all" btn
			$.each($(this).closest("ul").find("a:not(.select_all) > span:first-child"), function(k, v) {
				tot = $(this).closest("ul").find("a:not(.select_all)").length;
				if($(this).hasClass("fa-check-square-o")) {
					checked++;
				} else {
					unchecked++;
				}
			});
		};
		$.fn.change_all_offsets = function(ref, item_id, domain) {
			var arr = [];
			$(this).on("click", function(e) {
				e.stopPropagation();
			});
			if($(this).find("span:first").hasClass("fa-check-square-o")) {
				// Is checked
				$(this).find("span:first").removeClass("fa-check-square-o").addClass("fa-square-o");
				$.each($(this).closest("ul").find("a:not(.select_all)"), function(k, v) {
					$item = $(this);
					$(this).find("span:first").removeClass("fa-check-square-o").addClass("fa-square-o");
					arr = [];
				});
			} else {
				$(this).find("span:first").removeClass("fa-square-o").addClass("fa-check-square-o");
				$.each($(this).closest("ul").find("a:not(.select_all)"), function(k, v) {
					$item = $(this);
					$item.find("span:first").removeClass("fa-square-o").addClass("fa-check-square-o");
					arr.push($item.attr("data-offset"));
				});
			}
			arr = $.array_unique(arr);
			$("#" + $.md5(domain) + "_offset_input").val(arr);
		};

		$.fn.load_splice = function(ref, domain) {
			// console.log(ref);
			if($("#" + $(this).attr("id") + "_ul").length === 0) {
				var item_id = $(this).attr("id");
				var $dropdown_container = $('<div>')
					.addClass("dropdown-menu dropdown-menu-right")
					.attr({
						"role": "menu",
						"aria-labelledby": item_id,
						"id": item_id + "_ul"
					});
				var $dropdown_heading = $('<div>').addClass("dropdown-header");
				var $dropdown_body = $('<div>').addClass("dropdown-content");
				var $ul = $('<ul>').addClass("list-group");
				var dictionary = response[kAPI_RESULTS_DICTIONARY],
				xref = dictionary[kAPI_DICTIONARY_TAGS],
				_tags = response[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG],
				refs = ref.split(",");

				var $li_select_all = $('<li>').addClass("list-group-item"),
				$li_divider = $('<li>').addClass("divider"),
				$checkbox = $('<span>').addClass("fa fa-fw fa-check-square-o text-muted"),
				$span = $('<span>').addClass("text-muted").html(i18n[lang].interface.btns.select_all);

				$a_select_all = $('<a>').addClass("select_all").attr({
						"href": "javascript: void(0);",
						"onclick": '$(this).change_all_offsets(\'' + refs + '\', \'' + item_id + '\', \'' + domain + '\')'
					})
					.append($checkbox)
					.append($span),
				$a_item = $('<a>').attr({
					"href": "javascript:void(0);",
					"onclick": '$(this).change_offsets(\'' + refs + '\', \'' + item_id + '\', \'' + domain + '\')'
				});

				// Add a "Select all btn"
				// $li_select_all.append($a_select_all);
				// $ul_heading.append($li_select_all);
				// $ul_heading.append($li_divider);
				// $dropdown_heading.append($ul_heading);
				$.each(refs, function(k, v){
					var $li = $('<li>').addClass("list-group-item"),
					$a_item = $('<a>').addClass("offset_item").attr({
						"href": "javascript:void(0);",
						"onclick": '$(this).change_offsets(\'' + refs + '\', \'' + item_id + '\', \'' + domain + '\')',
						"data-offset": v
					}),
					$checkbox = $('<span>').addClass("fa fa-fw fa-check-square-o"),
					l = "",
					d = "";
					// console.warn(v, _tags);
					if (v.indexOf(".") == -1) {
						l = _tags[xref[v]][kTAG_LABEL];
						d = (_tags[xref[v]][kTAG_DESCRIPTION] !== undefined) ? _tags[xref[v]][kTAG_DESCRIPTION] : "";
						$a_item.append($checkbox).append(" " + l);
						$li.append($a_item);
					} else {
						var tags = v.split("."),
						label = "";
						// console.log(tags);
						if(tags.length > 0) {
							$a_item.append($checkbox);
							$.each(tags, function(kk, vv) {
								var $uul = $('<ul class="fa-ul">'),
								$lii = $('<li>');
								l = _tags[xref[vv]][kTAG_LABEL];
								d = (_tags[xref[vv]][kTAG_DESCRIPTION] !== undefined) ? _tags[xref[vv]][kTAG_DESCRIPTION] : "";
								if(kk > 0) {
									$lii.append('<i class="fa-li fa fa-angle-right"></i>' + l);
									$uul.append($lii);
									$a_item.append($uul);
								} else {
									$a_item.append(l);
								}
							});
						}
						$li.append($a_item);
					}
						$ul.append($li);

				});
				$dropdown_body.append($ul);
				$dropdown_container.append($dropdown_body);
				$dropdown_container.insertAfter($(this));
			}
		};
		if(single_form === undefined || single_form === null || single_form === "") {
			single_form = false;
		}
		var dictionary = response[kAPI_RESULTS_DICTIONARY],
		collection = dictionary[kAPI_DICTIONARY_COLLECTION],
		ids = dictionary[kAPI_DICTIONARY_IDS],
		cluster = dictionary[kAPI_DICTIONARY_CLUSTER],
		tags = dictionary[kAPI_DICTIONARY_TAGS],
		_tags = response[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_TAG],
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
		generate_form = function(single_form) {
			var form_size;

			$.each(cluster, function(term, id_arr) {
				$.each(id_arr, function(idk, idv) {
					var offsets = _tags[idv][kTAG_UNIT_OFFSETS];
					// Creates an object with all the forms
					forms = get_form_data(idk, response.results[collection][idv]);
					forms.size = "double";

					if(is_kind_quantitative()) {
						form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max});
						forms.size = "double";
					} else {
						switch(forms.type){
							case kTYPE_FLOAT:
							case kTYPE_INT:
								return_key = false;
								// RANGE
								form = $.add_range({type: forms.type, placeholder: [forms.min, forms.max], min: forms.min, max: forms.max, return_key: return_key});
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
								return_key = false;
								// STRING
								form = $.add_input({return_key: return_key});
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
								return_key = true;
								// CHOSEN
								form = $.add_multiselect({tree_checkbox: true}, function() {
									/*
									$.ask_to_service({op: kAPI_OP_GET_TAG_ENUMERATIONS, parameters: {lang: lang, param: {limit: 300, tag: idv}}}, function(res) {
										console.log("YEAH!", res);
									});
									*/
								});
								break;
							case kTYPE_BOOLEAN:
								return_key = false;
								form = $.add_switch({return_key: return_key});
								break;
							default:
								return_key = false;
								form = $.add_simple_input({return_key: return_key});
								break;
						}
					}

					// Set the size of form boxes
					// REMINDER LEGEND:
					// 	Full with is 12, 6 is middle screen and 3 is quarter
					// 	'col-lg-{X}' -> Large displays
					// 	'col-md-{X}' -> Medium displays (eg. Tablet or 1024 size screens)
					// 	'col-sm-{X}' -> Small displays (eg. Smartphones)
					switch(forms.size) {
						case "double":
							form_size = "col-lg-6 col-md-8 col-sm-12";
							break;
						case "single":
							form_size = "col-lg-3 col-md-6 col-sm-12";
							break;
						default:
							form_size = "col-lg-3 col-md-6 col-sm-12";
							break;
					}
					var $enable_disable_btn = $('<a>').attr({
							"href": "javascript:void(0);",
							"onclick": "$.toggle_form_item($(this), \'" + idv + "\');",
							"class": "pull-left",
							"title": i18n[lang].messages.enable_item
						}).html('<span class="fa fa-square-o"></span>');
					var $badge = $('<sup>')
						.addClass("text-danger")
						.html('<b>' + ((forms.count !== undefined && forms.count > 0) ? forms.count : 0) + '</b>');
					var $splice_btn = $('<a>').attr({
							"title": i18n[lang].interface.btns.contained_in + " (" + i18n[lang].messages.offsets.replace("{X}", offsets.length) + ")",
							"href": "javascript:void(0);",
							"onclick": "$(this).load_splice(\'" + offsets + "\', \'" + idv + "\');",
							"id": $.md5(idv) + "_offsets",
							"data-toggle": "dropdown"
						})
						.addClass("btn btn-xs btn-default-white")
						.html(i18n[lang].interface.btns.contained_in + ' <sup class="text-info">' + i18n[lang].messages.offsets.replace("{X}", offsets.length) + ' </sup>&emsp;<span class="fa fa-caret-down"></span>');
					var $splice_dropdown = $('<div>').attr("id", $.md5(idv) + "_offsets_container").addClass("dropdown keep-open pull-right").append($splice_btn);
					var $mask = $('<div>');
					if(forms.count !== undefined && forms.count > 0) {
						var $mask_check = $('<span>').addClass("fa fa-check");
						$mask.attr({
							"id": $.md5(idv),
							"onclick": "$.toggle_form_item($(\'#" + $.md5(idv) + "\'), \'" + idv + "\');",
							"class": "panel-mask"
						}).html($mask_check[0].outerHTML + '<small>' + i18n[lang].interface.btns.activate + '</small>');
					} else {
						$mask.addClass("panel-mask unselectable");
					}
					var $help = $('<small>').attr({
							"class": "help-block",
							"style": "color: #999; margin-bottom: -3px;"
						}).html('<br />' + $.get_title(forms));
					var $secret_input1 = $('<input />').attr({
							"type": "hidden",
							"name": "type",
							"value": forms.type
						});
					var $secret_input2 = $('<input />').attr({
							"type": "hidden",
							"name": "kind",
							"value": forms.kind
						});
					var $secret_input3 = $('<input />').attr({
							"type": "hidden",
							"name": "tags",
							"value": idv
						});
					var $secret_input4 = $('<input />').attr({
							"type": "hidden",
							"id": $.md5(idv) + "_offset_input",
							"name": "offsets",
							"value": offsets
						});
					var $secret_input4a = $('<input />').attr({
							"type": "hidden",
							"id": $.md5(idv) + "_default_offset_input",
							"name": "default_offsets_input",
							"value": offsets
						});
					var $panel_over_btn = $('<div>').addClass("panel panel-success disabled").attr({
							"title": i18n[lang].messages.forms.item_disabled
						});
					var $form_box = $('<div>')
						.addClass(form_size + " " + $.md5(idv) + " vcenter")
						.append($mask);
					var $form_title = $('<span>')
						.addClass("disabled")
						.append(forms.label + " ")
						.append($badge);
						if(offsets.length > 1) {
							$form_title.append($splice_dropdown);
						}
						$form_title.append($help);
					var $form_box_title = $('<h3>')
						.addClass("panel-title")
						.append($form_title);
					var $form_box_heading = $('<div>')
						.addClass("panel-heading")
						.append($enable_disable_btn)
						.append($form_box_title);
					var $form = $('<form>')
						.attr("onsubmit", "return false;")
						.append($secret_input1)
						.append($secret_input2)
						.append($secret_input3)
						.append($secret_input4)
						.append($secret_input4a)
						.append(form);
					var $form_box_body = $('<div>')
						.addClass("panel-body")
						.append($form);
						// .html('<form onsubmit="return false;">' + $secret_input1[0].outerHTML + $secret_input2[0].outerHTML + $secret_input3[0].outerHTML + $form_box[0].outerHTML + '</form>');
					$panel_over_btn.append($form_box_heading)
						.append($form_box_body);
					$form_box.append($panel_over_btn);

					// Append the form box to the stage
					html_form += $form_box[0].outerHTML;
				});
			});

			if(single_form) {
				return html_form;
			} else {
				return '<div class="row">' + html_form + '</div>';
			}
		};

		return generate_form(single_form);
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
	 * Restore a previous generated form
	 */
	$.restore_form = function() {
		if($.storage_exists("pgrdg_cache.search.criteria")) {
			if($.storage_exists("pgrdg_cache.search.criteria.forms") || $.storage_exists("pgrdg_cache.search.criteria.fulltext") || $.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
				if($.storage_exists("pgrdg_cache.search.criteria.traitAutocomplete")) {
					$("#main_search").val(storage.get("pgrdg_cache.search.criteria.traitAutocomplete.text"));
				}
				$.exec_autocomplete("restore");
			}
		} else {
			$("#advanced_search_home").fadeIn(300);
		}
	};

	/**
	 * Activate treeselect
	 */
	$.fn.activate_treeselect = function(tag) {
		var $item = $(this).find("a.treeselect"),
		$form = $item.closest("form"),
		treeselect_id = $(this).find("a.treeselect").attr("id"),
		treeselect_title = '<div class="dropdown-header"><div class="input-group"><input type="text" class="form-control" placeholder="' + i18n[lang].interface.btns.filter + '" /><span class="input-group-addon"><span class="fa fa-search"></span></span></div></div>',
		//treeselect_content = '<div class="dropdown-content"><ul></ul></div>';
		treeselect_content = '<div class="dropdown-content"><ul class="list-group"></ul></div>';

		$item.addClass("disabled");
		$form.find(".dropdown-menu").html(treeselect_title + treeselect_content);

		var kapi_obj = {};
		kapi_obj.storage_group = "pgrdg_cache.local.forms_data";
		kapi_obj.loaderType = $(this).find("a.pull-left, a.pull-right");
		kapi_obj[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_TAG_ENUMERATIONS;
		kapi_obj.parameters = {};
		kapi_obj.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		kapi_obj.parameters[kAPI_REQUEST_PARAMETERS] = {};
		kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
		kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_TAG] = tag;
		kapi_obj.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;

		$.ask_to_service(kapi_obj, function(res) {
			$.each(res[kAPI_RESPONSE_RESULTS], function(k, v) {
				$form.find(".dropdown-menu .dropdown-content > ul").append($.create_tree(v, $item));
			});
			$item.removeClass("disabled");
			$form.find(".dropdown-toggle").dropdown("toggle");
			$form.find(".dropdown-menu > *").click(function(e) {
				e.stopPropagation();
			});
			if($form.find(".dropdown-menu").is(":visible")) {
				$form.find(".dropdown-menu .dropdown-header input").focus();

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
							tableBody.prepend('<div class="search-sf"><span class="text-muted">' + i18n[lang].messages.no_entries_found + '</span></div>');
						}
					}
					//$form.find(".dropdown-header input").focus();
				});
			}
			$form.on("submit", function(){
				return false;
			});
		});
	};

	/**
	/* Change behavior depending if form is checked
	*/
	$.toggle_form_item = function(item, tag) {
		var $this = item,
		data = [],
		$panel,
		$panel_mask,
		active_forms = {},
		af_obj = {},
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

			$panel.find("a.pull-left, a.pull-right").tooltip("hide").find("span").removeClass("fa-square-o").addClass("fa-check-square-o");
			$panel.find("a.pull-left").attr("data-original-title", i18n[lang].messages.disable_item);
			$panel.removeClass("disabled").attr("data-original-title", "").tooltip("destroy").find(".panel-heading h3 > span, .panel-body").removeClass("disabled");
			$panel.find("input").attr("disabled", false).closest(".panel").find("input:not([type=hidden])").first().focus();
			$panel.find("button").attr("disabled", false);

			if($panel.find(".chosen-select").length > 0){
				$panel.find(".chosen-select").prop("disabled", false).trigger("chosen:updated");
			}
			// Treeselect
			//
			if($panel.find("a.treeselect").length > 0){
				$panel.activate_treeselect(tag);
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
			if($("#accordion .fulltext_search").length > 0) {
				forms_count++;
			}
			if(forms_count === 0) {
				$(".save_btn").addClass("disabled");
			}
			$panel.prev(".panel-mask").css("display: block");
			$.remove_storage("pgrdg_cache.search.criteria.selected_forms." + frm_key);
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
							operators.push({
								"label": rv.label,
								"key": rv.key,
								"selected": rv.selected,
								"type": rv.type,
								"main": rv.main,
								"title": rv.title
							});
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

	/**
	 * Get the static forms list
	 */
	$.get_static_forms = function() {
		$("#static_forms").html('<div class="list-group"></div>');

		var objp = {};
		objp.storage_group = "pgrdg_cache.local.forms_data";
		// objp.loaderType = $panel.find("a.pull-left, a.pull-right");
		objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_NODE_FORM;
		objp.parameters = {};
		objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
		objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_NODE] = "form::forms";
		objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;

		$.ask_to_service(objp, function(response) {
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
				var res = response[kAPI_RESPONSE_RESULTS];

				$.each(res, function(k, v) {
					$("#static_forms").closest(".panel-body.contents").find("h4").html(v[kAPI_PARAM_RESPONSE_FRMT_NAME] + '<small class="help-block">' + v[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</small>');
					$.each(v.children, function(kk, vv) {
						var $a = $('<a>'),
						$span = $('<span>');
						$a.attr({
							"href": "javascript: void(0);",
							"data-node": vv.node,
							"id": vv.node + "_link",
							"onclick": "if(!$(\'#static_forms_list > ul#" + vv.node + "\').is(\':visible\')) { $(this).select_static_form(\'" + vv.node + "\'); }",
							"data-toggle": "popover",
							"title": (vv[kAPI_PARAM_RESPONSE_FRMT_INFO] === undefined) ? "" : vv[kAPI_PARAM_RESPONSE_FRMT_NAME],
							"data-content": (vv[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? vv[kAPI_PARAM_RESPONSE_FRMT_INFO] : vv[kAPI_PARAM_RESPONSE_FRMT_NAME]
						}).addClass("list-group-item").popover({
							placement: ($(window).width() > 420) ? "right" : "top",
							container: "body",
							trigger: "hover"
						});
						$a.html('<span data-info="' + vv[kAPI_PARAM_RESPONSE_FRMT_INFO] + '">' + vv[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</span>' + $span.html());
						$span.addClass("fa fa-angle-right pull-right help-block");

						$("#static_forms > div.list-group").append($a);
					});
				});
			} else {
				$("#loader").addClass("text-warning").html('<span class="fa fa-times"></span> ' + i18n[lang].messages.search.no_search_results.message);
			}
		});
	};

	/**
	 * Static form buttons behaviour
	 */
	$.fn.select_static_form = function(back) {
		/**
		 * Generate link depending on given object params
		 */
		$.generate_link = function(res, parent, html_text) {
			var $text = "";
			var storage_id = $("#static_forms_list > ul.static_root").attr("data-storage"),
			$d = $('<div>');
			if($.type(res) == "object" || $.type(res) == "array") {
				if(res[kAPI_PARAM_RESPONSE_FRMT_NAME] !== undefined) {
					if(res[kAPI_PARAM_TAG] === undefined || $.obj_len(res[kAPI_PARAM_TAG]) === 0) {
						text = res[kAPI_PARAM_RESPONSE_FRMT_NAME];
					} else {
						var $a = $('<a>');
						$a.attr({
							"href": "javascript: void(0);",
							"id": $.md5(res[kAPI_PARAM_TAG]) + "_link",
							"class": "btn btn-text" + ((res[kAPI_PARAM_RESPONSE_COUNT] === 0) ? " disabled text-muted" : ""),
							"onclick": "$.generate_static_form(\'" + res[kAPI_PARAM_TAG] + "\', \'" + storage_id + "\')",
							"title": (res[kAPI_PARAM_RESPONSE_FRMT_INFO] === undefined) ? "" : res[kAPI_PARAM_RESPONSE_FRMT_NAME],
							"data-toggle": "popover",
							"data-content": (res[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? res[kAPI_PARAM_RESPONSE_FRMT_INFO] : res[kAPI_PARAM_RESPONSE_FRMT_NAME],
							"data-parent": parent,
							"data-storage": storage_id
						}).text(res[kAPI_PARAM_RESPONSE_FRMT_NAME]).popover({
							container: "body",
							placement: ($(window).width() > 420) ? "right" : "top",
							trigger: "hover"
						});
						$d.html($a);
						if(html_text) {
							text = $d.html();
						} else {
							text = $d.text();
						}
					}
					// text = res[kAPI_PARAM_RESPONSE_FRMT_NAME];
				}
			} else if($.type(res) == "string") {
				text = res;
			}
			if(text === undefined || text === null || text === ""){
				text = i18n[lang].messages.static_forms.no_data;
			}
			// console.warn(text, $.type(res));
			return text;
		};

		/**
		 * Generate left panel list tree
		 * @param  {Array}   res     The array of child objects
		 * @param  {Boolean} is_root Is a root list?
		 * @param  {String}  parent  [description]
		 */
		$.fn.generate_tree = function(res, is_root, parent) {
			$.fn.movearrow = function() {
				if($(this).find("i").hasClass("fa-rotate-90")) {
					$(this).find("i").removeClass("fa-rotate-90");
				} else {
					$(this).find("i").addClass("fa-rotate-90");
				}
			};

			var $this = $(this);

			$.each(res, function(kobj, obj) {
				var $li = $('<li>');
				if(obj[kAPI_PARAM_RESPONSE_CHILDREN] !== undefined && $.obj_len(obj[kAPI_PARAM_RESPONSE_CHILDREN]) > 0) {
					if(obj[kAPI_PARAM_TAG] === undefined || $.obj_len(obj[kAPI_PARAM_TAG]) === 0) {
						if(is_root) {
							$li.addClass("list-unstyled");
							$li.html('<h3><a onclick="$(this).movearrow();" data-toggle="collapse" href="#' + obj[kAPI_PARAM_NODE] + '"><i class="fa fa-caret-right"></i></a> ' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true) + '</h3>');
						} else {
							$li.html('<a href="javascript: void(0);" onclick="$(this).movearrow();" data-toggle="collapse" data-parent="#' + obj[kAPI_PARAM_PARENT_NODE] + '" data-target="#' + obj[kAPI_PARAM_NODE] + '"><i class="fa-li fa fa-caret-right"></i></a>' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true));
						}
					} else {
						$li.html('<i class="fa-li fa fa-angle-right"></i>' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true));
					}
					$li.attr("title", $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME]), false);
					var $panel_div = $('<div class="">'),
					$ul = $('<ul>').attr({
						"class": "collapse fa-ul",
						"id": obj[kAPI_PARAM_NODE]
					});
					if(is_root) {
						$ul.addClass("static_root");
					} else {
						$ul.addClass("static_child");
					}
					$ul.generate_tree(obj[kAPI_PARAM_RESPONSE_CHILDREN], false, obj[kAPI_PARAM_RESPONSE_FRMT_NAME]);
					$panel_div.append($ul);
					$li.append($panel_div);
				} else {
					if(obj[kAPI_PARAM_TAG] === undefined || $.obj_len(obj[kAPI_PARAM_TAG]) === 0) {
						if(is_root) {
							$li.addClass("list-unstyled");
							$li.html('<h3><a onclick="$(this).movearrow();" data-toggle="collapse" href="#' + obj[kAPI_PARAM_NODE] + '"><i class="fa fa-caret-right"></i></a> ' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true) + '</h3>');
						} else {
							$li.html('<a href="javascript: void(0);" onclick="$(this).movearrow();" data-toggle="collapse" data-parent="#' + obj[kAPI_PARAM_PARENT_NODE] + '" data-target="#' + obj[kAPI_PARAM_NODE] + '"><i class="fa-li fa fa-caret-right"></i></a>' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true));
						}
					} else {
						$li.html('<i class="fa-li fa fa-angle-right"></i>' + $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME], true));
					}
					$li.attr("title", $.generate_link(obj, obj[kAPI_PARAM_RESPONSE_FRMT_NAME]), false);
				}
				$this.append($li);
			});
		};

		var $this = $(this);
		if(back === undefined || back !== "back") {
			$("#loader").addClass("system").fadeIn(100, function(){
				var $a = $('<a>');

				$a.attr({
					"href": "javascript: void(0);",
					"data-node": $this.attr("data-node"),
					"onclick": "$(this).select_static_form(\'back\');",
					"title": $this.find("span:first-child").attr("data-info")
				}).css("padding", "0");
				$a.html('<h4><span class="fa fa-angle-left text-muted"></span>' + $this.find("span:first-child").text() + '</h4>');
				$a.find("h4").append('<small class="help-block">' + $this.find("span:first-child").attr("data-info") + '</small>');

				$.each($this.closest(".panel-body.contents").find("a"), function() {
					$(this).removeClass("list-group-item-success");
				});
				$this.addClass("list-group-item-success");
				if($this.closest(".panel-body.contents").css("left") == "-300px" || $this.closest(".panel-body.contents").css("left") == "-324px") {
					$this.closest(".panel-body.contents").animate({"left": "0px"}, 300);
					$this.closest(".panel-body.contents").next().animate({
						"left": ($(window).width() < 420) ? "-324px" : "-300px"
					}, 300, function() {
						$this.closest(".panel-body.contents").delay(300).animate({
							"left": ($(window).width() < 420) ? "-324px" : "-300px"
						}, 300);
						$this.closest(".panel-body.contents").next().delay(300).animate({"left": "0px"}, 300);
					});
				} else {
					$this.closest(".panel-body.contents").animate({
						"left": ($(window).width() < 420) ? "-324px" : "-300px"
					}, 300);
					$this.closest(".panel-body.contents").next().animate({"left": "0px"}, 300);
				}
				$this.closest(".panel-body.contents").next().find("div.title.panel-heading").html($a);

				var objp = {};
				objp.storage_group = "pgrdg_cache.local.forms_data";
				// objp.loaderType = $panel.find("a.pull-left, a.pull-right");
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_NODE_FORM;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_NODE] = parseInt(back);
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
				$.ask_to_service(objp, function(rr) {
					if(rr[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(rr[kAPI_RESPONSE_RESULTS]) > 0) {
						var rres = rr[kAPI_RESPONSE_RESULTS];
						$("#static_forms_loader").hide();
						$("#static_forms_list").html("");
						$("#static_forms_list").append('<ul id="' + parseInt(back) + '" data-storage="' + rr.id + '">');
						if(rres[kAPI_PARAM_TAG] === undefined || $.obj_len(rres[kAPI_PARAM_TAG]) === 0) {
							$("#static_forms_list ul#" + parseInt(back)).addClass("static_root").attr("data-root", $this.find("span:first-child").text());
						}
						rres[0].root_node = rres[0][kAPI_PARAM_RESPONSE_FRMT_NAME];
						// Just passing roots child to display them in the left panel tree
						$("#static_forms_list ul#" + parseInt(back)).generate_tree(rres[0][kAPI_PARAM_RESPONSE_CHILDREN], true, parseInt(back));

						// Activate popover
						$("#static_forms_list a:not(.disabled)").popover({
							placement: ($(window).width() > 420) ? "right" : "top",
							container: "body",
							trigger: "hover"
						});
						// Disable links of already loaded forms
						$.each($("#accordion div.panel-mask"), function(k, v) {
							var list_id = $(this).attr("id");
							$("#" + list_id + "_link").addClass("text-warning disabled");
						});
					}
					$("#loader").hide();
				});
			});
		} else {
			$this.closest(".panel-body.contents").animate({
				"left": ($(window).width() < 420) ? "324px" : "300px"
			}, 300);
			$this.closest(".panel-body.contents").prev().animate({"left": "0px"}, 300, function() {
				$(this).find("h4.title").text("");
				$("#static_forms_list").html("");
				$("#static_forms_loader").show();
			});
		}
	};

	/**
	 * Create the static form tree and append to the left panel
	 */
	$.generate_static_form = function(tag, storage_id) {
		var kAPI = {};
		kAPI.storage_group = "pgrdg_cache.search.criteria.forms";
		// objp.loaderType = $panel.find("a.pull-left, a.pull-right");
		kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_IDENTIFIER;
		kAPI.parameters = {};
		kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
		kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
		kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_TAG] = tag;
		kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
		$.ask_to_service(kAPI, function(response) {
			if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
				if($("#accordion > #" + response.id).length === 0) {
					var the_title = [];
					if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
						$.manage_url("Forms");
						$.breadcrumb_right_buttons();
						if($(window).width() < 420) {
							$.left_panel("close");
						}
						$("#forms-head #right_btn, #forms-footer #right_btn").html('<span class="ionicons ion-trash-b"></span> ' + i18n[lang].interface.btns.reset_all).fadeIn(300, function() {
							$("#forms-head #right_btn, #forms-footer #right_btn").on("click", function() {
								$.reset_all_searches(true);
							});
						});
						$("section.container").animate({"padding-top": "40px"});
						$("#breadcrumb").animate({"top": "75px"});
						if($("#forms-head .btn-group a.save_btn").length === 0) {
							btn_disabled = "disabled";
							$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
							$("#forms-footer .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
						}
						if($("#breadcrumb").css("display") == "none") {
							$("#breadcrumb").fadeIn(200);
						}

						if($("#" + $.md5(tag)).length === 0) {
							var $link = $("#" + $.md5(tag) + "_link");
							$link.addClass("text-warning disabled");
							var node = $link.closest("ul.static_root").attr("id"),
							text = $link.closest("ul.static_root").attr("data-root");
							the_title.push('<a title="' + i18n[lang].interface.jump_to_this_panel + '" href="javascript: void(0);" onclick="$(\'#' + node + '_link\').select_static_form(\'' + node + '\')">' + text + '</a>');
							the_title.push($link.closest("ul.static_child").prev("h3").text());
							storage.set("pgrdg_cache.search.criteria.forms." + response.id + ".response.storage_id", storage_id);
							storage.set("pgrdg_cache.search.criteria.forms." + response.id + ".response.parent", $link.attr("data-parent"));

							// Create forms
							var forms = $.create_form(response, true);
							$("#forms-head .content-title").html('Output for "' + $link.text() + '"');
							if($("#forms-head div.clearfix + .help-block").length === 0) {
								$("#forms-head").append('<div class="help-block">' + i18n[lang].interface.form_help_text + '</div>');
							}
							$("#forms").fadeIn(300);
							if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.fulltext"))).length === 0) {
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.fulltext")),
										class: "fulltext_search",
										icon: "fa fa-edit",
										expandable: false,
										title: '<span class="text-info">' + i18n[lang].messages.search.fulltext.fulltext_search + ':</span> <a title="' + i18n[lang].messages.search.fulltext.goto_search + '" href="./Search?q=' + $.rawurlencode(storage.get("pgrdg_cache.search.criteria.fulltext")) + '"><span style="color: #dd1144">' + storage.get("pgrdg_cache.search.criteria.fulltext").replace(/"/g, "&quot;") + '</span></a>',
										content: ""
									});
								}
							}
							if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
								var location = "",
								ccode = "";
								if($.storage_exists("pgrdg_cache.search.criteria.select_map_area.zone")) {
									location = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.name");
								} else {
									location = storage.get("pgrdg_cache.search.criteria.select_map_area.coordinates").join(", ");
								}
								ccode = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.ccode");
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area"))).length === 0) {
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area")),
										class: "select_map_area_search",
										icon: "mg map-" + ccode,
										expandable: false,
										title: '<span class="text-success">' + i18n[lang].messages.search.select_map_area.geo_area_near.replace("{X}", '<span class="text-warning">' + location + '</span>') + '</span>',
										content: ""
									});
								}
							}
							$("#forms-body .content-body").addCollapsible({
								id: $.md5($link.closest("ul.static_child").prev("h3").text()),
								title: the_title.join('<span class="fa fa-fw fa-angle-right text-muted"></span>'),
								content: forms
							});
							$("input.switch").bootstrapSwitch();
							$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
								$(this).parent().find("input[type='checkbox']").attr("checked", state);
							});
							$("#forms-body .panel").tooltip();
							// $.resize_forms_mask();


							if($.storage_exists("pgrdg_cache.search.criteria.selected_forms")) {
								$.each(storage.get("pgrdg_cache.search.criteria.selected_forms"), function(row_id, row_data){
									var $panel = $("#" + $.md5(row_data.forms.tags)).next(".panel"),
									$item = $panel.find("a.treeselect");

									$("#" + $.md5(row_data.forms.tags)).addClass("unselectable").hide();
									$panel.removeClass("disabled").find(".panel-heading a > span").removeClass("fa-square-o").addClass("fa-check-square-o");
									$panel.find(".panel-heading h3 > span, .panel-body").addClass("disabled");
									$panel.find("input").prop("disabled", false);
									$panel.find("button").prop("disabled", false);
									if($panel.find("a.treeselect").length > 0){
										$panel.activate_treeselect(row_data.forms.tags);
									}
								});
								$(".save_btn").removeClass("disabled");
							}
							$.activate_form_btns();
						}
					}
				}
			}
		});
	};


/*=======================================================================================
*	SEARCH FUNCTIONS
*======================================================================================*/

	/**
	 * Get selected forms from the storage and returns in an array list
	 */
	$.get_storage_selected_forms = function() {
		var qc = {};
		if($.storage_exists("pgrdg_cache.search.criteria.selected_forms")) {
			$.each(storage.get("pgrdg_cache.search.criteria.selected_forms"), function(row_id, query) {
				$.each(query.active_forms, function(k, v) {
					qc[k] = v;
				});
			});
		}
		return qc;
	};

	/**
	 * Activate the "search" form button
	 */
	$.activate_form_btns = function() {
		var offsets = [];
		if($("#accordion > div.panel-default").length > 0) {
			// Fires when user clicks on "Save" button
			$("#forms-head .btn-group a.save_btn, #forms-footer .btn-group a.save_btn").fadeIn(300, function() {
				$(this).on("click", function() {
					var active_forms = {};
					//form_data.history = storage.get("pgrdg_cache.search.criteria.forms");
					$.each($("#accordion > div.panel-default"), function(k, v) {
						var af_obj = {}, rt = {};
						frm_keys = $(this).attr("id");
						if($(this).find("div.panel-success:not(.disabled)").length > 0) {
							$.each($(this).find("div.panel-success:not(.disabled)"), function(i, vv) {
								af_obj = $(this).find("form").serializeObject();
								if(af_obj[kAPI_PARAM_OFFSETS].indexOf(",") == -1) {
									offsets.push(af_obj[kAPI_PARAM_OFFSETS]);
								} else {
									offsets = af_obj[kAPI_PARAM_OFFSETS].split(",");
								}
								if(af_obj[kAPI_PARAM_OFFSETS] == af_obj.default_offsets_input) {
									offsets = [];
								}
								switch(af_obj["input-type"]) {
									case kAPI_PARAM_INPUT_ENUM:
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										if(offsets.length > 0) {
											rt[kAPI_PARAM_OFFSETS] = offsets;
										}
										rt[kAPI_RESULT_ENUM_TERM] = af_obj.term.split(",");
										active_forms[af_obj.tags] = rt;
										break;
									case kAPI_PARAM_INPUT_RANGE:
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										if(offsets.length > 0) {
											rt[kAPI_PARAM_OFFSETS] = offsets;
										}
										rt[kAPI_PARAM_RANGE_MIN] = parseInt(af_obj.from);
										rt[kAPI_PARAM_RANGE_MAX] = parseInt(af_obj.to);
										rt[kAPI_PARAM_OPERATOR] = [af_obj.operator];
										active_forms[af_obj.tags] = rt;
										break;
									case kAPI_PARAM_INPUT_STRING:
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										if(offsets.length > 0) {
											rt[kAPI_PARAM_OFFSETS] = offsets;
										}
										rt[kAPI_PARAM_PATTERN] = af_obj.stringselect;
										rt[kAPI_PARAM_OPERATOR] = [af_obj.operator, af_obj.case_sensitive];
										active_forms[af_obj.tags] = rt;
										break;
									case kAPI_PARAM_INPUT_SHAPE: break;
									case kAPI_PARAM_INPUT_DEFAULT:
										rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
										if(offsets.length > 0) {
											rt[kAPI_PARAM_OFFSETS] = offsets;
										}
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
								storage.set("pgrdg_cache.search.criteria.selected_forms." + frm_keys, {
									request: storage.get("pgrdg_cache.search.criteria.forms." + frm_keys),
									key: $(this).attr("id"),
									forms: $(this).find("form").serializeObject(),
									active_forms: active_forms
								});
								$.breadcrumb_right_buttons();
							});
						} else {
							storage.set("pgrdg_cache.search.criteria.selected_forms." + frm_keys, {
								request: {}, //storage.get("pgrdg_cache.search.criteria.forms." + frm_keys),
								key: $(this).attr("id"),
								forms: {},
								active_forms: active_forms
							});
							$.breadcrumb_right_buttons();
						}
					});
					$("#goto_results_btn, #goto_map_btn").hide();
					$.remove_storage("pgrdg_cache.summary");
					$.remove_storage("pgrdg_cache.results");
					$.remove_storage("pgrdg_cache.map");
					$.show_summary($.get_storage_selected_forms());
				});
			});
		}
	};

	/**
	* Execute the autocomplete
	*/
	$.exec_autocomplete = function(type) {
		$.manage_url("Forms");
		$.breadcrumb_right_buttons();
		var is_autocompleted = false;

		switch(type) {
			case "autocomplete":
				//if($.storage_exists("pgrdg_cache.search.criteria.forms")) {

				var kAPI = {};
				kAPI.storage_group = "pgrdg_cache.search.criteria.forms";
				kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
				kAPI.parameters = {};
				kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#main_search").val();
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
				$.execTraitAutocomplete(kAPI, function(response) {
					$.breadcrumb_right_buttons();
					if($("#accordion > #" + response.id).length === 0) {
						var the_title = "";
						if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
							$("#forms-head .content-title").html('Output for "' + $("#main_search").val() + '"');
							if($("#forms-head div.clearfix + .help-block").length === 0) {
								$("#forms-head").append('<div class="help-block">' + i18n[lang].interface.form_help_text + '</div>');
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
							var forms = $.create_form(response, true);
							if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.fulltext"))).length === 0) {
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.fulltext")),
										class: "fulltext_search",
										icon: "fa fa-edit",
										expandable: false,
										title: '<span class="text-info">' + i18n[lang].messages.search.fulltext.fulltext_search + ':</span> <a title="' + i18n[lang].messages.search.fulltext.goto_search + '" href="./Search?q=' + $.rawurlencode(storage.get("pgrdg_cache.search.criteria.fulltext")) + '"><span style="color: #dd1144">' + storage.get("pgrdg_cache.search.criteria.fulltext").replace(/"/g, "&quot;") + '</span></a>',
										content: ""
									});
								}
							}
							if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area"))).length === 0) {
									var location = "",
									ccode;
									if($.storage_exists("pgrdg_cache.search.criteria.select_map_area.zone")) {
										location = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.name");
									} else {
										location = storage.get("pgrdg_cache.search.criteria.select_map_area.coordinates").join(", ");
									}
									ccode = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.ccode");
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area")),
										class: "select_map_area_search",
										icon: "mg map-" + ccode,
										expandable: false,
										title: '<span class="text-success">' + i18n[lang].messages.search.select_map_area.geo_area_near.replace("{X}", '<span class="text-warning">' + location + '</span>') + '</span>',
										content: ""
									});
								}
							}
							$("#forms-body .content-body").addCollapsible({
								id: response.id,
								title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#main_search").val() + '"</span>'),
								content: forms
							});
							$("input.switch").bootstrapSwitch();
							$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
								$(this).parent().find("input[type='checkbox']").attr("checked", state);
							});
							$("#forms-body .panel").tooltip();
							// $.resize_forms_mask();
							$("#autocomplete .typeahead").trigger("blur");
						}
					}
				});
				return true;
			case "input":
				if($("#main_search").val().length >= 3) {
					if(!is_autocompleted) {
						storage.set("pgrdg_cache.search.criteria.traitAutocomplete", {text: $("#main_search").val(), type: "input"});

						var kAPI = {};
						kAPI.storage_group = "pgrdg_cache.search.criteria.forms";
						kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_TAG_BY_LABEL;
						kAPI.parameters = {};
						kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
						kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
						kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
						kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
						kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
						kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#main_search").val();
						kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#main_search_operator").attr("class"), ($("#main_search_operator_i").is(":checked") ? '$i' : '"')];
						// kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];

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
									var forms = $.create_form(response, true);
									$("#forms-head .content-title").html('Output for "' + $("#main_search").val() + '"');
									if($("#forms-head div.clearfix + .help-block").length === 0) {
										$("#forms-head").append('<div class="help-block">' + i18n[lang].interface.form_help_text + '</div>');
									}
									$("#forms").fadeIn(300);
									if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
										if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.fulltext"))).length === 0) {
											$("#forms-body .content-body").addCollapsible({
												id: $.md5(storage.get("pgrdg_cache.search.criteria.fulltext")),
												class: "fulltext_search",
												icon: "fa fa-edit",
												expandable: false,
												title: '<span class="text-info">' + i18n[lang].messages.search.fulltext.fulltext_search + ':</span> <a title="' + i18n[lang].messages.search.fulltext.goto_search + '" href="./Search?q=' + $.rawurlencode(storage.get("pgrdg_cache.search.criteria.fulltext")) + '"><span style="color: #dd1144">' + storage.get("pgrdg_cache.search.criteria.fulltext").replace(/"/g, "&quot;") + '</span></a>',
												content: ""
											});
										}
									}
									if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
										if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area"))).length === 0) {
											var location = "",
											ccode = "";
											if($.storage_exists("pgrdg_cache.search.criteria.select_map_area.zone")) {
												location = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.name");
											} else {
												location = storage.get("pgrdg_cache.search.criteria.select_map_area.coordinates").join(", ");
											}
											ccode = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.ccode");
											$("#forms-body .content-body").addCollapsible({
												id: $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area")),
												class: "select_map_area_search",
												icon: "mg map-" + ccode,
												expandable: false,
												title: '<span class="text-success">' + i18n[lang].messages.search.select_map_area.geo_area_near.replace("{X}", '<span class="text-warning">' + location + '</span>') + '</span>',
												content: ""
											});
										}
									}
									$("#forms-body .content-body").addCollapsible({
										id: response.id,
										title: the_title.replace("@pattern@", '<span style="color: #dd1144">"' + $("#main_search").val() + '"</span>'),
										content: forms
									});
									$("input.switch").bootstrapSwitch();
									$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
										$(this).parent().find("input[type='checkbox']").attr("checked", state);
									});
									$("#forms-body .panel").tooltip();
									$(".tt-dropdown-menu").css("display", "none");
									// $.resize_forms_mask();
									$("#autocomplete .typeahead").trigger("blur");
								}
							}
						});
					}
				}
				return false;
			case "restore":
				var form_data = {},
				btn_disabled = "";
				if($.storage_exists("pgrdg_cache.search.criteria.forms")) {
					$.each(storage.get("pgrdg_cache.search.criteria.forms"), function(row_id, results) {
						var response = results.response;
						//console.log(response);
						if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
							if($(window).width() < 420) {
								$.left_panel("close");
							}
							$("#forms-head #right_btn, #forms-footer #right_btn").html('<span class="ionicons ion-trash-b"></span> ' + i18n[lang].interface.btns.reset_all).fadeIn(300, function() {
								$("#forms-head #right_btn, #forms-footer #right_btn").on("click", function() {
									$.reset_all_searches(true);
								});
							});
							$("section.container").animate({"padding-top": "40px"});
							$("#breadcrumb").animate({"top": "75px"});
							if($("#forms-head .btn-group a.save_btn").length === 0) {
								if($("#accordion .panel.fulltext_search").length > 0) {
									btn_disabled = "";
								} else {
									btn_disabled = "disabled";
								}
								$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
								$("#forms-footer .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
							}
							if($("#breadcrumb").css("display") == "none") {
								$("#breadcrumb").fadeIn(200);
							}
							if(response[kAPI_RESPONSE_REQUEST] !== undefined && $.obj_len(response[kAPI_RESPONSE_REQUEST]) > 0) {
								var the_title = "",
								titlee = "",
								panel_id = response.id;
								$.each(operators, function(ck, cv) {
									$.each(response[kAPI_RESPONSE_REQUEST][kAPI_PARAM_OPERATOR], function(cck, ccv) {
										if(ccv == cv.key) {
											if(cv.main) {
												the_title = cv.title;
											} else {
												the_title += " " + '<i style="color: #666;">' + cv.title + '</i>';
											}
										}
									});
								});
								titlee = the_title.replace("@pattern@", '<span style="color: #dd1144"> "' + response[kAPI_RESPONSE_REQUEST][kAPI_PARAM_PATTERN] + '"</span>');
							} else {
								if(response.storage_id !== undefined && response.storage_id !== null && response.storage_id !== "") {
									var tag = response.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_TAG],
									$link = $("#" + $.md5(tag) + "_link"),
									the_title = [],
									titlee = "",
									panel_id = "",
									storage_id = response.storage_id;
									var st = storage.get("pgrdg_cache.local.forms_data." + response.storage_id + ".response." + kAPI_RESPONSE_RESULTS);
									var node = st[0][kAPI_RESULT_ENUM_NODE],
									text = st[0][kAPI_PARAM_RESPONSE_FRMT_NAME],
									parent = response.parent,
									panel_id = $.md5(parent);

									$link.addClass("disabled");
									if($("#" + panel_id).length === 0) {
										if(text !== undefined) {
											the_title.push('<a title="' + i18n[lang].interface.jump_to_this_panel + '" href="javascript: void(0);" onclick="if(!$(\'#static_forms_list > ul#' + node + '\').is(\':visible\')) { $(\'#' + node + '_link\').select_static_form(\'' + node + '\'); }">' + text + '</a>');
										}
										the_title.push(parent);
										titlee = $.array_unique($.array_clean(the_title)).join('<span class="fa fa-fw fa-angle-right text-muted"></span>');
									}
								}
							}
							// Create forms
							var forms = $.create_form(response, true);
							grouping_no = 0;
							if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
								grouping_no = $.obj_len(storage.get("pgrdg_cache.search.criteria.grouping._ordering"));
							}
							$("#forms-head .content-title").html(i18n[lang].messages.search.output_last_search + ((grouping_no > 0) ? ' <sup><a title="' + i18n[lang].interface.btns.change_group_filters + '" href="javascript: void(0);" onclick="$.show_summary($.get_storage_selected_forms(), false, function() { $(\'#collapsed_group_form\').collapse(\'show\'); });"><small class="text-danger" style="font-family: Arial, Helvetica;">' + grouping_no + ' groups</small></a></sup>' : ""));
							if($("#forms-head div.clearfix + .help-block").length === 0) {
								$("#forms-head").append('<div class="help-block">' + i18n[lang].interface.form_help_text + '</div>');
							}
							$("#forms").fadeIn(300);
							if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.fulltext"))).length === 0) {
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.fulltext")),
										class: "fulltext_search",
										icon: "fa fa-edit",
										expandable: false,
										title: '<span class="text-info">' + i18n[lang].messages.search.fulltext.fulltext_search + ':</span> <a title="' + i18n[lang].messages.search.fulltext.goto_search + '" href="./Search?q=' + $.rawurlencode(storage.get("pgrdg_cache.search.criteria.fulltext")) + '"><span style="color: #dd1144">' + storage.get("pgrdg_cache.search.criteria.fulltext").replace(/"/g, "&quot;") + '</span></a>',
										content: ""
									});
								}
							}
							if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
								if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area"))).length === 0) {
									var location = "",
									ccode = "";
									if($.storage_exists("pgrdg_cache.search.criteria.select_map_area.zone")) {
										location = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.name");
									} else {
										location = storage.get("pgrdg_cache.search.criteria.select_map_area.coordinates").join(", ");
									}
									ccode = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.ccode");
									$("#forms-body .content-body").addCollapsible({
										id: $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area")),
										class: "select_map_area_search",
										icon: "mg map-" + ccode,
										expandable: false,
										title: '<span class="text-success">' + i18n[lang].messages.search.select_map_area.geo_area_near.replace("{X}", '<span class="text-warning">' + location + '</span>') + '</span>',
										content: ""
									});
								}
							}
							$("#forms-body .content-body").addCollapsible({
								id: panel_id,
								title: titlee,
								content: forms
							});
							$("input.switch").bootstrapSwitch();
							$("input.switch").on('switchChange.bootstrapSwitch', function(event, state) {
								$(this).parent().find("input[type='checkbox']").attr("checked", state);
							});
							$("#forms-body .panel").tooltip();
							$(".tt-dropdown-menu").css("display", "none");
							// $.resize_forms_mask();
							$("#autocomplete .typeahead").trigger("blur");

							if($.storage_exists("pgrdg_cache.search.criteria.selected_forms")) {
								$.each(storage.get("pgrdg_cache.search.criteria.selected_forms"), function(row_id, row_data){
									var $panel = $("#" + $.md5(row_data.forms.tags)).next(".panel"),
									$item = $panel.find("a.treeselect");

									$("#" + $.md5(row_data.forms.tags)).addClass("unselectable").hide();
									$panel.removeClass("disabled").find(".panel-heading a > span").removeClass("fa-square-o").addClass("fa-check-square-o");
									$panel.find(".panel-heading h3 > span, .panel-body").addClass("disabled");
									$panel.find("input").prop("disabled", false);
									$panel.find("button").prop("disabled", false);
									if($panel.find("a.treeselect").length > 0){
										$panel.activate_treeselect(row_data.forms.tags);
									}
								});
								$(".save_btn").removeClass("disabled");
							}
							$.activate_form_btns();
						}
					});
								return false;
				} else if($.storage_exists("pgrdg_cache.search.criteria.fulltext") || $.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
					if($(window).width() < 420) {
						$.left_panel("close");
					}
					$("#forms-head #right_btn, #forms-footer #right_btn").html('<span class="ionicons ion-trash-b"></span> ' + i18n[lang].interface.btns.reset_all).fadeIn(300, function() {
						$("#forms-head #right_btn, #forms-footer #right_btn").on("click", function() {
							$.reset_all_searches(true);
						});
					});
					$("section.container").animate({"padding-top": "40px"});
					$("#breadcrumb").animate({"top": "75px"});
					if($("#forms-head .btn-group a.save_btn").length === 0) {
						$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
						$("#forms-footer .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
					}
					if($("#breadcrumb").css("display") == "none") {
						$("#breadcrumb").fadeIn(200);
					}

					$("#forms-head .content-title").html(i18n[lang].messages.search.output_last_search);
					if($("#forms-head div.clearfix + .help-block").length === 0) {
						$("#forms-head").append('<div class="help-block">' + i18n[lang].interface.form_help_text + '</div>');
					}
					$("#forms").fadeIn(300);
					if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
						if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.fulltext"))).length === 0) {
							var names = [], nn = "";
							if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
								nn = ', <i class="text-muted">grouped by ';
								$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, v) {
									names.push(v[kAPI_PARAM_RESPONSE_FRMT_NAME]);
								});
								for (var g = 0; g < names.length; g++) {
									nn += names[g];
									if(g < (names.length - 2)) {
										nn += ", ";
									} else {
										if(g < (names.length - 1)) {
											nn += " and ";
										}
									}
								}
								nn += '</i>';
							}
							$("#forms-body .content-body").addCollapsible({
								id: $.md5(storage.get("pgrdg_cache.search.criteria.fulltext")),
								class: "fulltext_search",
								icon: "fa fa-edit",
								expandable: false,
								title: '<span class="text-info">' + i18n[lang].messages.search.fulltext.fulltext_search + ':</span> <a title="' + i18n[lang].messages.search.fulltext.goto_search + '" href="./Search?q=' + $.rawurlencode(storage.get("pgrdg_cache.search.criteria.fulltext")) + '"><span style="color: #dd1144">' + storage.get("pgrdg_cache.search.criteria.fulltext").replace(/"/g, "&quot;") + '</span></a>' + nn,
								content: ""
							});
						}
					}
					if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
						if($("#" + $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area"))).length === 0) {
							var names = [],
							nn = "";
							if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
								nn = ', <i class="text-muted">grouped by ';
								$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, v) {
									names.push(v[kAPI_PARAM_RESPONSE_FRMT_NAME]);
								});
								for (var g = 0; g < names.length; g++) {
									nn += names[g];
									if(g < (names.length - 2)) {
										nn += ", ";
									} else {
										if(g < (names.length - 1)) {
											nn += " and ";
										}
									}
								}
								nn += '</i>';
							}
							var location = "",
							ccode = "";
							if($.storage_exists("pgrdg_cache.search.criteria.select_map_area.zone")) {
								location = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.name");
							} else {
								location = storage.get("pgrdg_cache.search.criteria.select_map_area.coordinates").join(", ");
							}
							ccode = storage.get("pgrdg_cache.search.criteria.select_map_area.zone.ccode");
							$("#forms-body .content-body").addCollapsible({
								id: $.md5(storage.get("pgrdg_cache.search.criteria.select_map_area")),
								class: "select_map_area_search",
								icon: "mg map-" + ccode,
								expandable: false,
								title: '<span class="text-success">' + i18n[lang].messages.search.select_map_area.geo_area_near.replace("{X}", '<span class="text-warning">' + location + '</span>') + '</span>',
								content: ""
							});
						}
					}
					$("#forms-body .panel").tooltip();
					$("#forms-head .btn-group a.save_btn, #forms-footer .btn-group a.save_btn").fadeIn(300, function() {
						$("#goto_results_btn, #goto_map_btn").hide();
						$.remove_storage("pgrdg_cache.summary");
						$.remove_storage("pgrdg_cache.results");
						$.remove_storage("pgrdg_cache.map");

						$.activate_form_btns();
						//$.show_summary([]);
					});
				}
				break;
		}
	};

	/**
	* Execute autocomplete
	* @param {object}   kAPI
	* @param {Function} callback
	*/
	$.execTraitAutocomplete = function(kAPI, callback) {
		var form_data = {},
		btn_disabled = "";
		$.ask_to_service(kAPI, function(response) {
			if (jQuery.type(callback) == "function") {
				if(response[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
					if($(window).width() < 420) {
						$.left_panel("close");
					}
					$("#forms-head #right_btn, #forms-footer #right_btn").html('<span class="ionicons ion-trash-b"></span> ' + i18n[lang].interface.btns.reset_all).fadeIn(300, function() {
						$("#forms-head #right_btn, #forms-footer #right_btn").on("click", function() {
							$.reset_all_searches(true);
						});
					});
					$("section.container").animate({"padding-top": "40px"});
					$("#breadcrumb").animate({"top": "75px"});
					if($("#forms-head .btn-group a.save_btn").length === 0) {
						if($("#accordion .panel.fulltext_search").length > 0) {
							btn_disabled = "";
						} else {
							btn_disabled = "disabled";
						}
						$("#forms-head .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
						$("#forms-footer .btn-group").append('<a href="javascript: void(0);" class="btn btn-orange save_btn ' + btn_disabled + '" style="display: none;">' + i18n[lang].interface.btns.search + ' <span class="fa fa-chevron-right"></span></a>');
					}
					if($("#breadcrumb").css("display") == "none") {
						$("#breadcrumb").fadeIn(200);
					}
					$("#forms").fadeIn(300);

					// Fires when user clicks on "Save" button
					$("#forms-head .btn-group a.save_btn, #forms-footer .btn-group a.save_btn").fadeIn(300, function() {
						$(this).on("click", function() {
							var offsets = [];
						//	var qcriteria;
							form_data.history = storage.get("pgrdg_cache.search.criteria.forms");
							$.each($("#accordion > div.panel-default"), function(k, v) {
								var active_forms = {}, af_obj = {};
								frm_keys = $(this).attr("id");

								$.each($(this).find("div.panel-success:not(.disabled)"), function(i, v) {
									af_obj = $(this).find("form").serializeObject();
									rt = {};
									if(af_obj[kAPI_PARAM_OFFSETS].indexOf(",") == -1) {
										offsets.push(af_obj[kAPI_PARAM_OFFSETS]);
									} else {
										offsets = af_obj[kAPI_PARAM_OFFSETS].split(",");
									}
									if(af_obj[kAPI_PARAM_OFFSETS] == af_obj.default_offsets_input) {
										offsets = [];
									}

									switch(af_obj["input-type"]) {
										case kAPI_PARAM_INPUT_ENUM:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											if(offsets.length > 0) {
												rt[kAPI_PARAM_OFFSETS] = offsets;
											}
											rt[kAPI_RESULT_ENUM_TERM] = af_obj.term.split(",");
											active_forms[af_obj.tags] = rt;
											break;
										case kAPI_PARAM_INPUT_RANGE:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											if(offsets.length > 0) {
												rt[kAPI_PARAM_OFFSETS] = offsets;
											}
											rt[kAPI_PARAM_RANGE_MIN] = parseInt(af_obj.from);
											rt[kAPI_PARAM_RANGE_MAX] = parseInt(af_obj.to);
											rt[kAPI_PARAM_OPERATOR] = [af_obj.operator];
											active_forms[af_obj.tags] = rt;
											break;
										case kAPI_PARAM_INPUT_STRING:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											if(offsets.length > 0) {
												rt[kAPI_PARAM_OFFSETS] = offsets;
											}
											rt[kAPI_PARAM_PATTERN] = af_obj.stringselect;
											rt[kAPI_PARAM_OPERATOR] = [af_obj.operator, af_obj.case_sensitive];
											active_forms[af_obj.tags] = rt;
											break;
										case kAPI_PARAM_INPUT_SHAPE: break;
										case kAPI_PARAM_INPUT_DEFAULT:
											rt[kAPI_PARAM_INPUT_TYPE] = af_obj[kAPI_PARAM_INPUT_TYPE];
											if(offsets.length > 0) {
												rt[kAPI_PARAM_OFFSETS] = offsets;
											}
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
									storage.set("pgrdg_cache.search.criteria.selected_forms." + frm_keys, {
										request: storage.get("pgrdg_cache.search.criteria.forms." + frm_keys),
										key: $(this).attr("id"),
										forms: $(this).find("form").serializeObject(),
										active_forms: active_forms
									});
									$.breadcrumb_right_buttons();
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
					apprise(i18n[lang].messages.text_has_produced_zero_results, {
						title: i18n[lang].messages.no_results,
						icon: "warning"
					}, function(r) {
						if(r) {
							$("#main_search").focus();
						}
					});
				}
			}
		});
	};

	/**
	* Add the main trait autocomplete form
	* @param {object}   options  Autocomplete html attributes (id, class, placeholder)
	* @param {string}   data     type of query
	* @param {Function} callback
	*/
	$.fn.addTraitAutocomplete = function(options, data, callback) {
		$.selected_menu = function(k, v) {
			var kk = k.replace("$", "");
			$("#main_search_operator").attr("class", "").addClass(kk).text(v);
			$("#autocomplete ul.dropdown-menu li").removeClass("active");
			$("#autocomplete ul.dropdown-menu li." + kk).addClass("active");
			$("#main_search").focus();
		};

		options = $.extend({
			id: "",
			class: "",
			placeholder: i18n[lang].interface.btns.choose + "...",
			operator: kAPI_OP_MATCH_TAG_LABELS
		}, options);
		var op_btn_list = "",
		selected_label = "Operator",
		checkbox = "",
		user_input,
		is_autocompleted = false,
		selected_label_key = "",
		selected_label_value = "",
		tags = [],
		autocompleted = false;

		$.each(options.op, function(k, v) {
			if(!v.main) {
				if(v.label !== undefined) {
					checkbox += '<div class="checkbox"><label title="' + ((v.title !== undefined) ? v.title : "") + '"><input type="checkbox" id="main_search_operator_' + v.key.replace("$", "") + '" ' + ((v.selected) ? 'checked="checked"' : "") + ' title="' + ((v.title !== undefined) ? v.title : "") + '" value="" /> ' + v.label + '</label></div>';
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
		$(this).prepend('<div id="autocomplete"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="main_search_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="main_search" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + checkbox + '</div>');

		remoteAutocomplete = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: config.service.proxy + "%QUERY",
				replace: function(url, query) {
					var query_obj = {},
					url_query = "";
					$.each($("#accordion div.panel.panel-success:not(.disabled)"), function() {
						var tag = $(this).find("div.panel-body > form input[name='tags']").val();
						if(tag !== undefined) {
							tags.push(tag);
						}
					});
					query_obj[kAPI_PAGING_LIMIT] = 50;
					query_obj[kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
					query_obj[kAPI_PARAM_PATTERN] = $("#main_search").val();
					query_obj[kAPI_PARAM_EXCLUDED_TAGS] = $.array_unique(tags);
					query_obj[kAPI_PARAM_OPERATOR] = ["$" + $("#main_search_operator").attr("class")];
					if($("#main_search_operator_i").is(":checked")) {
						query_obj[kAPI_PARAM_OPERATOR].push("$i");
					}
					url_query = config.service.url + "Service.php?";
					url_query += kAPI_REQUEST_OPERATION + "=" + options.operator;
					url_query += "&" + kAPI_REQUEST_LANGUAGE + "=" + lang;
					url_query += "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode(JSON.stringify(query_obj));
					var state = "true&query=" + $.utf8_to_b64(url_query);
					//var state = "true&address=" + $.utf8_to_b64("{config.service.url}?" + kAPI_REQUEST_OPERATION + "=" + kAPI_OP_MATCH_TAG_LABELS + "&" + kAPI_REQUEST_LANGUAGE + "=" + lang + "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode('{"' + kAPI_PAGING_LIMIT + '":50,"' + kAPI_PARAM_REF_COUNT + '": "' + kAPI_PARAM_COLLECTION_UNIT + '","' + kAPI_PARAM_PATTERN + '":"'  + $("#main_search").val() + '","' + kAPI_PARAM_OPERATOR + '": ["$' + $("#main_search_operator").attr("class") + '"' + ($("#main_search_operator_i").is(":checked") ? ',"$i"' : "") + ']}'));
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

		$("#main_search").typeahead({
			hint: true,
			highlight: true,
			minLength: 3,
			limit: 50
		}, {
			displayKey: "value",
			source: remoteAutocomplete.ttAdapter()
		//////////// Listen user return key ////////////
		}).bind("keydown", "return", function(event) {
			$(this).trigger("typeahead:_changed");
			return false;
		////////////////////////////////////////////////
		}).on("typeahead:selected", function(e){
			// Autocomplete
			storage.set("pgrdg_cache.search.criteria.traitAutocomplete", {text: $("#main_search").val(), type: "autocomplete"});
			$.breadcrumb_right_buttons();
			is_autocompleted = $.exec_autocomplete("autocomplete");
		}).on("typeahead:_changed", function(e) {
			// User input
			if(!is_autocompleted) {
				storage.set("pgrdg_cache.search.criteria.traitAutocomplete", {text: $("#main_search").val(), type: "input"});
				$.breadcrumb_right_buttons();
				$.exec_autocomplete("input");
			}
		}).bind("keydown", "alt+left", function(e) {
			// $.left_panel("close", "", function() {
			// 	$("#main_search").blur();
			// });
			return false;
		}).bind("keydown", "alt+right", function(e) {
			// $.left_panel("open");
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
		$(this).prepend('<div id="' + options.id + '"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><div id="scrollable-dropdown-menu"><input type="search" id="' + options.id + '_input" class="form-control typeahead' + ((options.class) ? " " + options.class : "") + '" placeholder="' + options.placeholder + '" /></div></div>' + checkbox + '</div>');

		remoteAutocomplete = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: config.service.proxy + "%QUERY",
				replace: function(url, query) {
					var exclude = [],
					query_obj = {},
					url_query = "";
					if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
						st = storage.get("pgrdg_cache.search.criteria.grouping._ordering");
						$.each(st, function(k, v) {
							exclude.push(v.tag);
						});
						exclude = $.array_unique(exclude);
					}
					query_obj[kAPI_PARAM_LOG_REQUEST] = true;
					query_obj[kAPI_PAGING_LIMIT] = 50;
					query_obj[kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
					query_obj[kAPI_PARAM_PATTERN] = $("#" + options.id + "_input").val();
					query_obj[kAPI_PARAM_EXCLUDED_TAGS] = $.array_unique(exclude);
					query_obj[kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class")];
					if($("#" + options.id + "_operator_i").is(":checked")) {
						query_obj[kAPI_PARAM_OPERATOR].push("$i");
					}
					url_query = config.service.url + "Service.php?";
					url_query += kAPI_REQUEST_OPERATION + "=" + options.operator;
					url_query += "&" + kAPI_REQUEST_LANGUAGE + "=" + lang;
					url_query += "&" + kAPI_REQUEST_PARAMETERS + "=" + $.rawurlencode(JSON.stringify(query_obj));
					var state = "true&query=" + $.utf8_to_b64(url_query);

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

		$("#" + options.id + " .typeahead").typeahead({
			hint: true,
			highlight: true,
			minLength: 3,
			limit: 50
		}, {
			displayKey: "value",
			//source: ((data == "remote") ? remoteAutocomplete.ttAdapter() : data)
			source: remoteAutocomplete.ttAdapter()
		// }).bind("keydown", "return", function(event) {
		// 	$(this).trigger("typeahead:_changed");
		// 	return false;
		}).on("typeahead:selected typeahead:_changed", function(){
			if($("#" + options.id + "_input").val().length > 3) {
				var exclude = [];
				if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
					st = storage.get("pgrdg_cache.search.criteria.grouping._ordering");
					$.each(st, function(k, v) {
						exclude.push(v.tag);
					});
					exclude = $.array_unique(exclude);
				}

				if($("#filter_search_summary .input-group #autocomplete_undo_btn").length === 0) {
					$("#filter_search_summary .input-group").append('<span class="input-group-btn"><a class="btn btn-default-grey" id="autocomplete_undo_btn" href="javascript:void(0);"><span class="fa fa-reply"></span>' + i18n[lang].interface.btns.undo + '</a></span>');
				}
				$("#autocomplete_undo_btn").on("click", function() {
					apprise(i18n[lang].messages.search.are_you_sure_to_remove.this.message, {
						title: i18n[lang].messages.search.are_you_sure_to_remove.this.title,
						icon: "warning",
						confirm: true
					}, function(r) {
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

				if (jQuery.type(callback) == "function") {
					callback.call(this);
				}

				// Autocomplete
				var kAPI = {};
				kAPI.storage_group = "pgrdg_cache.search.criteria.grouping.loaded";
				kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_SUMMARY_TAG_BY_LABEL;
				kAPI.parameters = {};
				kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_EXCLUDED_TAGS] = exclude;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_REF_COUNT] = kAPI_PARAM_COLLECTION_UNIT;
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_PATTERN] = $("#" + options.id + "_input").val();
				// kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$" + $("#" + options.id + "_operator").attr("class"), ($("#filter_search_summary_operator_i").is(":checked") ? '$i' : '""')];
				kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_OPERATOR] = ["$EQ"];
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
				$.breadcrumb_right_buttons();
				is_autocompleted = true;
			}
			return false;
		});
		if (typeof(callback) == "function") {
			callback.call(this);
		}
	};

	/**
	* Remove a single search forms
	* @param  {object} search The form group to remove (html object)
	*/
	$.remove_search = function(search) {
		var $this = search,
		search_id = $this.closest(".panel").attr("id");
		apprise(i18n[lang].messages.search.are_you_sure_to_remove.this.message, {
			title: i18n[lang].messages.search.are_you_sure_to_remove.this.title,
			icon: "warning",
			confirm: true
		}, function(r) {
			if(r) {
				if($this.closest(".panel").hasClass("fulltext_search")) {
					storage.set("pgrdg_cache.search.criteria.fulltext", "");
					$.breadcrumb_right_buttons();
				}
				if($this.closest(".panel").hasClass("select_map_area_search")) {
					console.log("ok");
					$.remove_storage("pgrdg_cache.search.criteria.select_map_area", "");
					$.breadcrumb_right_buttons();
				}
				$.each($this.closest(".panel").find("div.panel-mask"), function(k, v) {
					var list_id = $(this).attr("id");
					if($("#static_forms_list").length > 0 && $("#" + list_id + "_link").hasClass("disabled")) {
						$("#" + list_id + "_link").removeClass("text-warning disabled");
					}
				});
				$($this).parents(".panel").fadeOut(300, function() {
					$(this).remove();
					$("#main_search").focus();
					if($("#accordion .panel").length === 0) {
						$.reset_all_searches(false);
					} else {
						var u = 0;
						$.each($("#accordion .panel").find("div.panel-success:not(.disabled)"), function(i, v) {
							u++;
						});
						if($("#accordion .panel.fulltext_search").length > 0) {
							u++;
						}
						var last_row_id = $("#accordion > .panel:last-child").attr("id");
						$("#" + last_row_id + "_collapse").collapse("show");
						if(u === 0) {
							$(".save_btn").addClass("disabled");
						}
					}
					$.remove_storage("pgrdg_cache.search.criteria.traitAutocomplete");
					$.remove_storage("pgrdg_cache.search.criteria.forms." + search_id);
					$.remove_storage("pgrdg_cache.search.criteria.selected_forms." + search_id);
					$.remove_storage("pgrdg_cache.search.criteria.selected_enums");
					$.remove_storage("pgrdg_cache.search.criteria.local.forms_data." + search_id);
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
				$("section.container").animate({"padding-top": "0px"}, 300, function(){
					// Reset breadcrumb and panels
					$.reset_breadcrumb();
					$.reset_contents("forms", true);
					$.reset_contents("summary", true);
					$.reset_contents("results", true);
					$.reset_contents("map", true);
				});
				$("#contents #start").fadeIn(600);
				$("input.typeahead.tt-input").val("").focus();
				$("#advanced_search_home").fadeIn(300);
				$.each($("#static_forms_list li"), function() {
					$(this).find("a.text-warning.disabled").removeClass("text-warning disabled");
				});

				$.left_panel("open");
			});
		};

		//console.log($("#accordion > div.panel"));
		if(ask) {
			if($("#apprise.reset-all").length > 0) {
				$("#apprise.reset-all").modal("show");
			} else {
				apprise(i18n[lang].messages.search.are_you_sure_to_remove.all.message, {
					title: i18n[lang].messages.search.are_you_sure_to_remove.all.title,
					icon: "warning",
					class: "reset-all",
					confirm: true
				}, function(r) {
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
			objp.storage_group = "pgrdg_cache.summary";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = text;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = [];
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE_DISP;
			$.ask_to_service(objp, function(response) {
				if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
					var res = response[kAPI_RESPONSE_RESULTS];

					$.activate_panel("summary", {res: response}, function() {
						$("#se_loader").fadeOut(300);
						$("#se_p").fadeIn(300);
						$("#group_by_btn").removeClass("disabled");
					});
				} else {
					$("#se_loader").addClass("text-warning").html('<span class="fa fa-times"></span> ' + i18n[lang].messages.search.no_search_results.message);
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
					if(content !== "summary") {
						$(this).find("#" + content + "-head").html('<h1 class="content-title"></h1>');
					} else {
						$(this).find("#" + content + "-head").children(":not(#group_by_accordion)").remove();
						$(this).find("#" + content + "-head").prepend('<h1 class="pull-left content-title"></h1><div class="btn-group pull-right"><a data-toggle="collapse" id="group_by_btn" onclick="$.manage_url(\'Summary\');" data-parent="#group_by_accordion" href="#collapsed_group_form" class="btn btn-default-grey"><span class="fa fa-sliders text-muted"></span>' + i18n[lang].interface.btns.group_by + '</a><a href="javascript:window.print()" title="' + i18n[lang].interface.btns.print_results + '" class="btn btn-default-white"><span class="fa fa-print"></span></a></div><div class="clearfix"></div>');
					}
				}
				$(this).find("#" + content + "-body").html('<div class="content-body"></div>');
			}
		});
		if(storage_also) {
			$.remove_storage("pgrdg_cache." + content);
			if(content == "forms") {
				$.remove_storage("pgrdg_cache.search.criteria.forms");
				$.remove_storage("pgrdg_cache.search.criteria.selected_forms");
				$.remove_storage("pgrdg_cache.search.criteria.selected_enums");
				$.remove_storage("pgrdg_cache.search.criteria.fulltext");
				$.remove_storage("pgrdg_cache.search.criteria.traitAutocomplete");
				$.remove_storage("pgrdg_cache.search.criteria.grouping");
				$.remove_storage("pgrdg_cache.map_data.user_layers");
			}
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
			id: "",
			label: ""
		}, options);
		$.manage_url($.ucfirst(type));

		if(type !== "map") {
			if(type == "summary") {
				if(current_path == "Search" || current_path == "Map") {
					$("#" + type + "-head h1.content-title > span").html("Results " + type.toLowerCase());
				} else {
					$("#" + type + "-head h1.content-title").html("Results " + type.toLowerCase());
				}
			} else {
				$("#" + type + "-head h1.content-title").html(i18n[lang].interface.btns.search + " " + type.toLowerCase());
			}

			$("#" + type + "-body .content-body").html("");
			if(type !== "results") {
				$.generate_summaries(options.res, "", function(result_panel){
					$("#" + type + "-body .content-body").attr("id", options.res[kAPI_PARAM_ID]).append(result_panel);

					// $.add_flare({
					// 	padding: [30, 400, 0, 80],
					// 	bar_color: ["steelblue", "#cc"]
					// });
					//$("#" + type + "-body .content-body").attr("id", options.res.id).append("<div class=\"panel panel-success\"><div class=\"panel-heading\"><h4 class=\"list-group-item-heading\"><span class=\"title\">" + $.trim(values[kTAG_LABEL]) + "</span> <span class=\"badge pull-right\">" + values[kAPI_PARAM_RESPONSE_COUNT] + "</span></h4></div><div class=\"panel-body\"><div class=\"btn-group pull-right\"><a class=\"btn btn-default-white\" href=\"javascript: void(0);\" onclick=\"$.show_raw_data('" + options.res.id + "', '" + domain + "')\"><span class=\"fa fa-th\"></span> ' + i18n[lang].interface.btns.view_data + '</a>" + ((values.points > 0) ? "<a onclick=\"$.show_data_on_map('" + options.res.id + "', '" + domain + "')\" class=\"btn " + ((values.points > 10000) ? "btn-warning disabled" : "btn-default") + "\">" + ((values.points > 10000) ? values.points + " points" : "<span class=\"ionicons ion-map\"></span>") + ' ' + i18n[lang].interface.btns.view_map + '&emsp;<span class="badge">' + values.points + '</span></a>' : "") + "</div>" + values[kTAG_DEFINITION] + "</div></div>");
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
						console.warn($("#" + $.md5(id)));
						// Row is opened
						$("#" + $.md5(id) + " td").html('<center class="text-muted"><span class="fa fa-refresh fa-spin"></span> ' + i18n[lang].messages.waiting + '</center>');
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
				limit = (options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_LIMIT] === null) ? 0 : options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_LIMIT],
				skipped = (options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_SKIP] === null) ? 0 : options.res[kAPI_RESPONSE_PAGING][kAPI_PAGING_SKIP];
				// Create table header
				$.each(cols, function(col_id, col_data) {
					column += '<td><b>' + col_data[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</b> ' + ((col_data[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) ? '<a href="javascript:void(0);" class="text-info" data-toggle="popover" data-content="' + $.html_encode(col_data[kAPI_PARAM_RESPONSE_FRMT_INFO]) + '"><span class="fa fa-question-circle"></span></a>' : "") + '</td>';
					general_column += '<td class="col_' + $.md5(col_id) + '"></td>';
				});

				$("table#" + options.res.id).html('<thead><tr><td></td>' + column + '</tr></thead><tbody></tbody>');
				$.each(rows, function(row_id, row_data) {
					// Create empty rows
					$("table#" + options.res.id + " tbody").append('<tr id="tr_' + $.md5(row_id) + '" class="expandable" onclick="$.expand_row(\'' + options.res.id + '\', \'' + row_id + '\');"><td align="center"><a href="javascript:void(0);" class="text-muted"><span class="fa fa-chevron-right"></span></a></td>' + general_column + '</tr>');
					$("table#" + options.res.id + " tbody").append('<tr id="' + $.md5(row_id) + '" class="detail"><td colspan="' + (c_count + 1) + '"><div><ul class="list-group transparent">' + '</ul></div></td></tr>');

					// Place contents in each table cell
					$.each(row_data, function(row_col_id, cell_data) {
						$("tr#tr_" + $.md5(row_id) + ' td.col_' + $.md5(row_col_id)).html($.cycle_disp(cell_data[kAPI_PARAM_RESPONSE_FRMT_DISP]));
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
				$("table#" + options.res.id + " form a");
			}
			$("#contents #" + type + "").fadeIn(300);
		} else {
			if($("#pgrdg_map").children().length === 0) {
				map = $.init_map(function(map) {
					$.remove_storage("pgrdg_cache.map");
					$.reset_all_markers(map, markers);
					$.add_geojson_cluster({id: options.id, geojson: options.res});
				});
			} else {
				$.reset_all_markers(map, markers);
				$.add_geojson_cluster({id: options.id, geojson: options.res});
			}
			$("#pgrdg_map").fadeIn(600);
		}
		if (jQuery.type(callback) == "function") {
			callback.call(this);
		}
	};


	/*=======================================================================================
	*	STATISTICS
	*======================================================================================*/

		/**
		* Show statistics list menu
		* @param  {string} Domain
		*/
		$.load_statistics_menu = function(storage_id, domain, grouped_data) {
			var $modal_container = $('<div>').addClass("modal fade"),
			$modal_dialog = $('<div>').addClass("modal-dialog"),
			$modal_content = $('<div>').addClass("modal-content"),
			$modal_header = $('<div>').addClass("modal-header"),
			$modal_header_close = $('<button>')
				.addClass("close")
				.attr("data-dismiss", "modal")
				.html('<span aria-hidden="true">&times;</span><span class="sr-only">' + i18n[lang].interface.btns.close + '</span>');
			$modal_header_title = $('<h4>').addClass("modal-title").html(i18n[lang].messages.statistics.statistics_list),
			$modal_body = $('<div>').addClass("modal-body"),
			$ul = $('<ul>').addClass("fa-ul");


			objp = {};
			objp.storage_group = "pgrdg_cache.summary";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_LIST_STATS;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
			$.ask_to_service(objp, function(response) {
				if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
					$.each(response[kAPI_RESPONSE_RESULTS], function(k, v){
						var $a = $('<a>').attr({
								"href": "javascript:void(0);",
								"onclick": "$.show_statistics(\'" + v[kAPI_PARAM_STAT] + "\', \'" + storage_id + "\', \'" + domain + "\', \'" + grouped_data + "\')"
							})
							.html(v[kAPI_PARAM_RESPONSE_FRMT_NAME])
							.popover({
								placement: "auto",
								content: v[kAPI_PARAM_RESPONSE_FRMT_INFO],
								container: "body",
								trigger: "hover"
							});
						var $li = $('<li>').html('<i class="fa-li fa fa-angle-right"></i>').append($a);
						$ul.append($li);
					});
				}
			});

			$modal_body.append($ul);
			$modal_header.append($modal_header_close).append($modal_header_title);
			$modal_content.append($modal_header).append($modal_body);
			$modal_dialog.append($modal_content);
			$modal_container.append($modal_dialog);

			$("body").prepend($modal_container);
			$modal_container.modal("show");
		};

		/**
		 * Show statistics panel
		 * @param {string} Statistics id
		 */

		$.show_statistics = function(statistic_id, storage_id, domain, grouped_data) {
			var summaries_data = storage.get("pgrdg_cache.summary." + storage_id),
			grouped = {},
			uobj_id = "",
			objp = {};
			if(grouped_data === undefined || grouped_data === null || grouped_data === "") {
				uobj_id = $.md5(domain);
				grouped_data = {};
			} else {
				$.each($.parseJSON($.rawurldecode(grouped_data)), function(k, v) {
					uobj_id = $.md5(v[kAPI_PARAM_RESPONSE_FRMT_NAME] + domain);
					name = v[kAPI_PARAM_RESPONSE_FRMT_NAME];
					if(v.is_patch !== undefined && v.is_patch === true) {
						grouped = {};
					} else {
						grouped[k] = {};
						$.each(v, function(kk, vv) {
							if(kk !== kAPI_PARAM_RESPONSE_FRMT_NAME && kk !== kAPI_PARAM_RESPONSE_FRMT_INFO) {
								grouped[k][kk] = vv;
							}
						});
					}
				});
			}

			objp.storage_group = "pgrdg_cache.summary";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 50;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_SKIP] = 0;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_STAT] = statistic_id;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_STAT;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SUMMARY] = grouped;

			$.ask_to_service(objp, function(res) {
				var results = res[kAPI_RESPONSE_RESULTS];
				if($.obj_len(results) > 0 || results.length > 0) {
					$(".modal").modal("hide");
					$.activate_panel("stats", {
						title: $("#" + statistic_id + " .panel-heading span.title").text(),
						domain: domain,
						res: res
					}, function() {
						var $table = $('<table>').addClass("table table-striped table-hover table-responsive"),
						$thead = $('<thead>'),
						$thead_tr = $('<tr>'),
						$tbody = $('<tbody>'),
						$tfooter = $('<tfooter>'),
						$tfooter_tr = $('<tr>');

						$.each(results[kAPI_PARAM_RESPONSE_FRMT_HEAD], function(k, v) {
							var $thead_th = $('<th>').attr({
								"data-sort": $.detect_type(results[kAPI_PARAM_RESPONSE_FRMT_DOCU][0][k]),
								"title": i18n[lang].interface.btns.sort_asc
							}),
							$sort_btn = $('<a>')
								.addClass("btn btn-text text-muted pull-right descending")
								.attr({
									"href": "javascript: void(0);",
								});
							if(v[kAPI_PARAM_DATA_TYPE] == kTYPE_FLOAT || v[kAPI_PARAM_DATA_TYPE] == kTYPE_INT) {
								$thead_th.addClass("text-right");
							}
							$sort_btn.html('<span class="fa fa-fw fa-sort"></span>');

							$thead_th.html('<span class="pull-left">' + v[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</span>');
							$thead_tr.append($thead_th);
						});
						$.each(results[kAPI_PARAM_RESPONSE_FRMT_DOCU], function(k, v) {
							var $tbody_tr = $('<tr>');
							$.each(v, function(kk, vv) {
								var $tbody_td = $('<td>');
								if(results[kAPI_PARAM_RESPONSE_FRMT_HEAD][kk][kAPI_PARAM_DATA_TYPE] == kTYPE_FLOAT || results[kAPI_PARAM_RESPONSE_FRMT_HEAD][kk][kAPI_PARAM_DATA_TYPE] == kTYPE_INT) {
									$tbody_td.addClass("text-right");
								}
								if(vv !== undefined && vv !== null) {
									$tbody_td.html($.highlight(vv));
								} else {
									$tbody_td.text("");
								}
								$tbody_tr.append($tbody_td);
							});
							$tbody.append($tbody_tr);
						});
						$thead.append($thead_tr);
						$table.append($thead);
						$table.append($tbody);

						$("#stats #stats-head .content-title").text(results[kAPI_PARAM_RESPONSE_FRMT_NAME]);
						$("#stats #stats-body .content-body").html($table);
						$table.stupidtable({
							"date":function(a, b){
								// Get these into date objects for comparison.
								aDate = date_from_string(a);
								bDate = date_from_string(b);

								return aDate - bDate;
							}
						}).on("aftertablesort", function (event, data) {
							var th = $(this).find("th");
							th.find(".arrow").remove();
							var dir = $.fn.stupidtable.dir;

							var arrow = data.direction === dir.ASC ? '<span class="fa fa-fw fa-sort-asc"></span>' : '<span class="fa fa-fw fa-sort-desc"></span>';
							th.eq(data.column).append('<span class="arrow pull-right">' + arrow +'</span>');
						});
					});
				}
			});
		};

	/*=======================================================================================
	*	SUMMARIES
	*======================================================================================*/

		/**
		* Show summary content pane
		* @param  {object} active_forms
		* @param  {bool} with_grouping
		*/
		$.show_summary = function(active_forms, with_grouping, callback) {
			console.info(active_forms, with_grouping);
			if(with_grouping === undefined || with_grouping === null || with_grouping === "") {
				with_grouping = true;
			}
			var ids = [],
			kAPI = {};

			if(with_grouping && current_path !== "Map") {
				if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
					$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, data) {
						ids.push(data.id);
					});
				}
			}
			if(query.groupby !== undefined) {
				ids = query.groupby.replace(/(\[|\])/g, "").split(",");
			}
			kAPI.storage_group = "pgrdg_cache.summary";
			kAPI[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
			kAPI.parameters = {};
			kAPI.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS] = {};
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 300;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = active_forms;
				if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = storage.get("pgrdg_cache.search.criteria.fulltext");
				}
				if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG] = {};
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_SHAPE;
					kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_SHAPE] = storage.get("pgrdg_cache.search.criteria.select_map_area");
				}
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = ids;
			kAPI.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE_DISP;
			kAPI.colour = true;
			$.ask_to_service(kAPI, function(res) {
				if($.obj_len(res[kAPI_RESPONSE_RESULTS]) > 0 || res[kAPI_RESPONSE_RESULTS].length > 0) {
					// if($.storage_exists("pgrdg_cache.search.criteria.grouping")) {
					// 	$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, v) {
					// 		storage.set("pgrdg_cache.search.criteria.grouping._ordering." + k, res.id);
					// 		storage.set("pgrdg_cache.search.criteria.grouping._ordering." + k, res.id);
					// 	});
					// }
					$.activate_panel("summary", {res: res}, function(){
						$.restore_stage(callback);
					});
				} else {
					if($("#apprise.no-results:visible").length === 0) {
						if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
							apprise(i18n[lang].messages.grouping.zero_results_remove_filter, {
								"class": "no-results",
								"title": i18n[lang].messages.search.no_search_results.message,
								"icon": "warning",
								"confirm": true
							}, function(r) {
								$.show_summary(active_forms, false, function() {
									setTimeout(function() {
										$("#summary-body.disabled").addClass("moved");
									}, 600);
								});
							});
						} else {
							apprise(i18n[lang].messages.search.no_search_results.message, {
								"class": "no-results",
								"title": i18n[lang].messages.search.no_search_results.title,
								"icon": "warning"
							});
						}
					}
				}
			});
		};

		/**
		 * Create summary content pane
		 * @options {object} the result of previous query (eg. Search or Autocomplete)
		 */
		$.generate_summaries = function(options, colour, callback) {
			$.get_domain_colour = function(domain) {
				var rgba = {r:255, g:0, b:0, a:1};
				if(!$.storage_exists("pgrdg_cache.search.domain_colours")) {
					storage.set("pgrdg_cache.search.domain_colours." + domain, $.set_colour({colour: rgba}));
				}
				return storage.get("pgrdg_cache.search.domain_colours." + domain);
			};
			//console.warn(options.history);
			var storage_id = options[kAPI_PARAM_ID],
			h = "",
			shape = {};
			if(options.history !== undefined) {
				h = JSON.stringify(options.history);
			} else {
				h = "";
			}
			if(options[kAPI_RESPONSE_REQUEST] !== undefined && options[kAPI_RESPONSE_REQUEST][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG] !== undefined && $.obj_len(options[kAPI_RESPONSE_REQUEST][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG]) > 0) {
				shape = options[kAPI_RESPONSE_REQUEST][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG];
			}
			$.each(options[kAPI_RESPONSE_RESULTS], function(domain, values) {
				if(h === "") {
					var history = [],
					hobj = {};
					hobj.is_patch = true;
					hobj[values[kAPI_PARAM_OFFSETS]] = values[kAPI_PARAM_PATTERN];
					hobj[kAPI_PARAM_RESPONSE_FRMT_NAME] = values[kAPI_PARAM_RESPONSE_FRMT_NAME];
					if(values[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) {
						hobj[kAPI_PARAM_RESPONSE_FRMT_INFO] = values[kAPI_PARAM_RESPONSE_FRMT_INFO];
					}
					history.push(hobj);
					h = JSON.stringify(history);
				}
				var result_panel = $('<div class="result panel" style="border-color: ' + $.get_domain_colour(domain) + '">'),
				result_h4 = $('<h4 class="">'),
				result_title = $('<span class="title">'),
				result_description = $('<p>'),
				result_content_container = $('<div class="row">'),
				result_description_span_muted = $('<span class="col-lg-3 col-xs-3">'),
				result_description_span_right = $('<span class="col-lg-9 col-xs-9 text-right">');

				result_title.html($.trim(values[kAPI_PARAM_RESPONSE_FRMT_NAME]) + ((values[kAPI_PARAM_RESPONSE_COUNT] !== undefined) ? ' <sup class="text-danger">' + values[kAPI_PARAM_RESPONSE_COUNT] + '</sup>' : "")).appendTo(result_h4);
				result_h4.appendTo(result_panel);
				result_description.html(values[kAPI_PARAM_RESPONSE_FRMT_INFO]).appendTo(result_panel);

				result_description_span_muted.html('<span class="help-block"></span>').appendTo(result_content_container);
				if(values[kAPI_PARAM_RESPONSE_FRMT_STATS] > 0) {
					result_description_span_right.append('<a class="btn text-warning transparent" href="javascript:void(0);" onclick="$.load_statistics_menu(\'' + storage_id + '\', \'' + domain + '\', \'' + $.rawurlencode(h) + '\');"><span class="fa fa-line-chart"></span>' + i18n[lang].interface.btns.view_statistics + '</a>');
					result_description_span_right.append(' <span class="hidden-xs hidden-sm text-muted">|</span>');
				}
				result_description_span_right.append('<a class="btn text-info transparent" href="javascript: void(0);" onclick="$.show_raw_data(\'' + storage_id + '\', \'' + domain + '\', \'' + $.rawurlencode(JSON.stringify(shape)) + '\', \'0\', \'50\', \'' + $.rawurlencode(h) + '\')"><span class="fa fa-list-alt"></span>' + i18n[lang].interface.btns.view_data + '</a>');
				if(values[kAPI_PARAM_RESPONSE_POINTS] > 0) {
					result_description_span_right.append(' <span class="hidden-xs hidden-sm text-muted">|</span>');
					result_description_span_right.append('<a class="btn ' + ((values.points > 10000) ? "text-warning" : "") + ' transparent" href="javascript: void(0);" onclick="$.show_data_on_map(\'' + storage_id + '\', \'' + domain + '\', \'' + $.rawurlencode(JSON.stringify(shape)) + '\', \'' + $.rawurlencode(h) + '\')" title="' + values.points + ' nodes for this entry"><span class="ionicons ion-map"></span>' + i18n[lang].interface.btns.view_map + ' <sup class="text-muted">' + values.points + '</sup></a>');
				}
				result_description_span_right.appendTo(result_content_container);
				result_content_container.appendTo(result_panel);

				if (jQuery.type(callback) == "function") {
					callback.call(this, result_panel);
				}
				h = "";
			});
			return false;
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
				hobj[kAPI_PARAM_RESPONSE_FRMT_NAME] = values[kAPI_PARAM_RESPONSE_FRMT_NAME];
				if(values[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) {
					hobj[kAPI_PARAM_RESPONSE_FRMT_INFO] = values[kAPI_PARAM_RESPONSE_FRMT_INFO];
				}
				options.history[options.level] = hobj;

				var item_colour = (colour !== undefined && colour !== "") ? colour : $.set_colour("random", 0.7),
				item_id = $.makeid(),
				result_panel = $('<div class="result panel tree_summary">'),
				result_h4 = $('<h4 style="border-color: ' + item_colour + '">'),
				// "data-parent" attribute was removed here
				result_title = $('<a class="btn btn-unstyled" data-toggle="collapse" href="#' + item_id + '" class="title" style="margin-left: 5px;" onclick="$.title_behaviour($(this));">'),
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
				result_title.html('' + $.trim(values[kAPI_PARAM_RESPONSE_FRMT_NAME]) + ' <sup class="text-danger">' + ((!has_child) ? child_counts : $.obj_len(values[kAPI_PARAM_RESPONSE_CHILDREN])) + '</sup>').appendTo(result_h4);
				if(values[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined) {
					result_description.html('<span style="margin-left: 5px;">' + values[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</span>').appendTo(result_h4);
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
				var list = $('<li class="level_' + level + '">'),
				lists = "",
				name = "",
				info = "",
				already_selected = false;

				if(level === undefined) {
					level = 0;
				}
				var as = [];
				if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
					$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, v) {
						if(id == v.id) {
							as.push(id);
						}
					});
					if($.inArray(id, as) > -1) {
						already_selected = true;
					}
				}
				$.each(data, function(d, v){
					if(d !== kAPI_PARAM_TAG) {
						// if(d == kAPI_PARAM_RESPONSE_CHILDREN) {
						// 	var ul = $('<ul class="fa-ul level2">');
						//
						// 	//list.prepend($.iterate_childrens(v, (level +1), storage_id, id, tag, contains));
						// 	//list.append(ul);
						// } else {
							if(v !== undefined && v !== null) {
								if(d == kAPI_PARAM_RESPONSE_FRMT_NAME) {
									if(level === 0) {
										var children = (data[kAPI_PARAM_RESPONSE_CHILDREN] !== undefined) ? ' <span class="text-muted">(' + data[kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME] + ')</span>' : "",
										related = (data[kAPI_PARAM_RESPONSE_CHILDREN] !== undefined) ? "related " : "";
										list.addClass(related);
										list.html('<a onclick="" href="javascript: void(0);" class="btn ' + ((already_selected) ? "btn-default" : "btn-default-white") + '"><h5 class="row"><span class="col-xs-10 col-sm-11 col-md-11 vcenter">' + v + children + '</span><span class="fa fa-fw fa-angle-right col-md-1 vcenter"></span></h5></a>');
									} else {
										//list.html('<a onclick="" href="javascript: void(0);" class="btn unclickable ' + ((already_selected) ? "btn-default" : "btn-default-white") + '"><h5>' + v + '</h5></a>');
									}
									name = v;
								}
								if(d == kAPI_PARAM_RESPONSE_FRMT_INFO) {
									list.find("h5 > span.col-md-11").append('<span class="help-block">' + v + '</span>');
									info = v;
								}
								list.find('a').attr("onclick", '$(this).add_remove_item_to_stage(\'' + storage_id + '\', \'' + id + '\', \'' + tag + '\', \'' + name + '\', \'' + contains + '\', \'' + info + '\');');
								if(already_selected) {
									//list.find('a').add_remove_item_to_stage(storage_id, id, tag, name, contains, info, false);
								}
							}
						}
						lists = list.to_html();
					// }
				});
				return lists;
			}
		};

		/**
		* Group buttons in the dialog
		*/
		$.group_tag_by = function(storage_id, id, tag, name, contains, info) {
			var selected = [];
			if($.storage_exists("pgrdg_cache.search.criteria.grouping." + storage_id)) {
				//selected = storage.get("pgrdg_cache.search.criteria.grouping." + storage_id);
				if($.inArray(id, storage.get("pgrdg_cache.search.criteria.grouping." + storage_id)) === -1) {
					selected.push(id);
				} else {
					already_selected = true;
				}
			}

			if($("#filter_stage #" + $.md5(id)).length === 0) {
				var already_selected = false,
				panel = $('<a href="javascript:void(0);" onclick="$.select_group_filter($(this));" ondblclick="$(this).addClass(\'active\'); $(\'#filter_stage a.active\').edit_filter();" class="list-group-item list-group-item-success" id="' + $.md5(id) + '" data-id="' + id + '" data-tag="' + tag + '" data-storage-id="' + storage_id + '">');

				panel.html('<h4 class="list-group-item-heading">' + name + '</h4>');
				if(info !== undefined && info !== null && info.length > 0) {
					panel.append('<p class="list-group-item-text">' + info + '</p>');
				}
				if(contains !== undefined && contains !== null && contains !== "") {
					panel.append('<h4 style="padding-left: 15px;" class="text-muted">' + contains + '</h4>');
				}
				if($("#filter_stage").html().length === 0) {
					$("#filter_stage_panel").fadeIn(300);
					$("#filter_group_title").text(i18n[lang].messages.search.fulltext.add_another_group);
				}

				// Move on the stage
				$("#filter_stage").append(panel);
			} else {
				if($("#" + $.md5(id) + "_restore").length > 0) {
					$.restore_deleted_filter($.md5(id));
				}
			}

			storage.set("pgrdg_cache.search.criteria.grouping." + storage_id, selected);
			$.breadcrumb_right_buttons();
		};


		/*=======================================================================================
		*	FILTERS STAGE
		*======================================================================================*/

			/**
			* Generate stage buttons reading selected filters on the storage
			*/
			$.restore_stage = function(callback) {
				if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
					if(!$("#summary #summary-body").hasClass("disabled")) {
						$("#summary #summary-body").addClass("disabled");
					}
					$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, v) {
						$("#group_by_btn").append('<small class="label label-danger" style="position: absolute; top: -6px; right: -6px;">' + $.obj_len(storage.get("pgrdg_cache.search.criteria.grouping._ordering")) + '</small>');

						if($.obj_len(v) > 0) {
							var id = v.id, tag = v.tag, storage_id = v.storage;
							if($.storage_exists("pgrdg_cache.search.criteria.grouping." + storage_id + ".response." + kAPI_RESPONSE_RESULTS)) {
								var res = storage.get("pgrdg_cache.search.criteria.grouping.loaded." + storage_id + ".response." + kAPI_RESPONSE_RESULTS),
								name = res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_NAME],
								info = res[id][kAPI_PARAM_RESPONSE_CHILDREN][kAPI_PARAM_RESPONSE_FRMT_INFO],
								a = $('<a class="list-group-item list-group-item-success" href="javascript:void(0);" onclick="$.select_group_filter($(this));" ondblclick="$(this).addClass(\'active\'); $(\'#filter_stage a.active\').edit_filter();" id="' + $.md5(id) + '" data-id="' + id + '" data-tag="' + tag + '" data-storage-id="' + storage_id + '">');
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
					$.exec_ordering(callback);
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
				if($("#filter_stage > a.active").prev("a:visible").length === 0) {
					$("#move_down_btn, #move_bottom_btn").removeClass("disabled");
					$("#move_up_btn, #move_top_btn").addClass("disabled");
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
				}
				if($("#filter_stage > a.active").next("a:visible").length === 0) {
					$("#move_up_btn, #move_top_btn").removeClass("disabled");
					$("#move_down_btn, #move_bottom_btn").addClass("disabled");
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
				}
				if($("#filter_stage > a.active").prev("a:visible").length > 0 && $("#filter_stage a.active").next("a:visible").length > 0) {
					$("#move_top_btn, #move_up_btn, #move_down_btn, #move_bottom_btn").removeClass("disabled");
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
				}
				if($("#filter_stage > a.active").prev("a:visible").length === 0 && $("#filter_stage a.active").next("a:visible").length === 0) {
					$("#move_top_btn, #move_up_btn, #move_down_btn, #move_bottom_btn").addClass("disabled");
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
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
			$.fn.add_remove_item_to_stage = function(storage_id, id, tag, name, contains, info, display_message) {
				var multiple = false;

				if(display_message === undefined) {
					display_message = true;
				}
				if($(this).closest("ul:not(.level2) > li").find("a").hasClass("btn-default")) {
					$(this).closest("ul:not(.level2) > li").find("a").removeClass("btn-default").addClass("btn-default-white");
					$(this).next().find("a.unclickable").removeClass("btn-default").addClass("btn-default-white");

					$("#filter_stage #" + $.md5(id)).remove_filter(true);
					if(display_message) {
						$("#modal_messages").removeClass("alert-success").addClass("alert-danger").find("div.text-left").text(i18n[lang].messages.item_removed.replace("{X}", '"' + name + '"'));
						$("#modal_messages").show().delay(1500).fadeOut(300);
					}
				} else {
					if(!multiple) {
						$("#summary_ordering ul.fa-ul li a.btn-default").removeClass("btn-default").addClass("btn-default-white");
						$.each($("#filter_stage a:visible"), function(item, data) {
							if($(this).attr("data-storage-id") == storage_id) {
								$(this).remove_filter(true);
							}
						});
					}

					$(this).closest("ul:not(.level2) > li").find("a").removeClass("btn-default-white").addClass("btn-default");
					$(this).next().find("a.unclickable").removeClass("btn-default-white").addClass("btn-default");
					$.group_tag_by(storage_id, id, tag, name, contains, info);
					if(display_message) {
						$("#modal_messages").removeClass("alert-danger").addClass("alert-success").find("div.text-left").text(i18n[lang].messages.item_added.replace("{X}", '"' + name + '"'));
						$("#modal_messages").show().delay(1500).fadeOut(300);
					}
				}
				if(!multiple) {
					$("#summary_ordering").modal("hide");
				}
				$.update_ordering();

			};

			/**
			* Re-open filters dialogs and let user to add or remove others
			*/
			$.fn.edit_filter = function() {
				var response = storage.get("pgrdg_cache.search.criteria.grouping.loaded." + $(this).attr("data-storage-id") + ".response"),
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

			/**
			* Restore a previous removed filter from stage
			*/
			$.restore_deleted_filter = function(id) {
				var item_id = $("#" + id).attr("data-id"),
				storage_id = $("#" + id).attr("data-storage-id"),
				selected = storage.get("pgrdg_cache.search.criteria.grouping." + storage_id);

				$("#" + id + "_restore").stop().remove();
				$("#" + id).fadeIn(300, function() {
					$("#filter_stage_controls a").removeClass("disabled");
					$.show_btns();

					selected.push(item_id);
					storage.set("pgrdg_cache.search.criteria.grouping." + storage_id, selected);
					$.breadcrumb_right_buttons();
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
				selected = storage.get("pgrdg_cache.search.criteria.grouping." + storage_id);
				if(direct === undefined || direct === null || direct === "") { direct = false; }

				$("#filter_stage_controls a").addClass("disabled");
				$(this).fadeOut(300, function() {
					selected = $.grep(selected, function(value) {
						return value != id;
					});
					storage.set("pgrdg_cache.search.criteria.grouping." + storage_id, selected);
					$.update_ordering();

					if(!direct) {
						$('<div id="' + $.md5(id) + '_restore" class="well well-sm text-muted">' + i18n[lang].messages.removed_item.replace("{X}", '"' + $(this).find("h4").text() + '"') + '<a class="pull-right text-muted" href="javascript:void(0);" onclick="$.restore_deleted_filter(\'' + $(this).attr("id") +  '\')" title="Restore it"><small class="fa fa-reply"></small></a></div>').insertBefore($(this));

						$("#" + $.md5(id) + "_restore").fadeOut(10000, "easeInExpo", function() {
							$("#" + $.md5(id) + "_restore").remove();
							$("#" + $.md5(id)).remove();
							if($("#filter_stage > a:visible").length === 0) {
								$.reset_stage();
								$.reset_ordering(true);
							}
						});
					} else {
						if($("#filter_stage > a:visible").length === 0) {
							$.reset_stage();
						}
						$("#" + $.md5(id)).remove();
					}
				});

				if($("#filter_stage a").length === 0) {
					$("#filter_stage_controls a").addClass("disabled");
				}
			};

			/**
			* Cancel and remove all ordering criteria
			*/
			$.reset_ordering = function(direct) {
				$.exec_reset_ordering = function() {
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
					if(current_path == "Search") {
						$.search_fulltext($("#search_form").val());
					} else {
						$.show_summary($.get_storage_selected_forms());
					}
					storage.set("pgrdg_cache.search.criteria.grouping", {});
				};
				if(direct === undefined || direct === null || direct === "") { direct = false; }

				if(!direct) {
					apprise(i18n[lang].messages.grouping.reset_filters.message, {
						title: i18n[lang].messages.grouping.reset_filters.title,
						icon: "warning",
						confirm: true
					}, function(r) {
						if(r) {
							$.exec_reset_ordering();
						}
					});
				} else {
					$.exec_reset_ordering();
				}
			};

			/**
			* Update the ordering on the storage
			*/
			$.update_ordering = function() {
				var st = [];

				$.each($("#filter_stage > a:visible"), function(k, item) {
					var stid = $(this).attr("data-id"),
					stag = $(this).attr("data-tag"),
					sname = $(this).find("h4:not(.text-muted)").text(),
					sinfo = $(this).find("h4 + p").text(),
					scontains = $(this).find("h4.text-muted").text(),
					ststorage_id = $(this).attr("data-storage-id");
					st.push({
						"id": stid,
						"tag": stag,
						"name": sname,
						"info": sinfo,
						"contains": scontains,
						"storage": ststorage_id
					});
				});
				storage.set("pgrdg_cache.search.criteria.grouping._ordering", st);
				$.update_ordering_on_the_stage(st);
				$.breadcrumb_right_buttons();
			};

			/**
			* Update the ordering on the stage
			*/
			$.update_ordering_on_the_stage = function(st) {
				if(st === undefined || st.length === 0) {
					st = storage.get("pgrdg_cache.search.criteria.grouping._ordering");
				}

				if(!$("#summary #summary-body").hasClass("disabled")) {
					$("#summary #summary-body").addClass("disabled");
				}

				if(st.length > 0) {
					if($("#group_by_btn .label-danger").length === 0) {
						$("#group_by_btn").append('<small class="label label-danger" style="position: absolute; top: -6px; right: -6px;">' + st.length + '</small>');
					} else {
						$("#group_by_btn .label-danger").text(st.length);
					}
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").removeClass("disabled");
					$.each(st, function(k, v) {
						if($("#filter_stage #" + $.md5(v.id)).length === 0) {
							var already_selected = false,
							panel = $('<a href="javascript:void(0);" onclick="$.select_group_filter($(this));" ondblclick="$(this).addClass(\'active\'); $(\'#filter_stage a.active\').edit_filter();" class="list-group-item list-group-item-success" id="' + $.md5(v.id) + '" data-id="' + v.id + '" data-tag="' + v.tag + '" data-storage-id="' + v.storage + '">');

							panel.html('<h4 class="list-group-item-heading">' + v[kAPI_PARAM_RESPONSE_FRMT_NAME] + '</h4>');
							if(v[kAPI_PARAM_RESPONSE_FRMT_INFO] !== undefined && v[kAPI_PARAM_RESPONSE_FRMT_INFO] !== null && v[kAPI_PARAM_RESPONSE_FRMT_INFO].length > 0) {
								panel.append('<p class="list-group-item-text">' + v[kAPI_PARAM_RESPONSE_FRMT_INFO] + '</p>');
							}
							if(v.contains !== undefined && v.contains !== null && v.contains !== "") {
								panel.append('<h4 style="padding-left: 15px;" class="text-muted">' + v.contains + '</h4>');
							}
							if($("#filter_stage").html().length === 0) {
								$("#filter_stage_panel").fadeIn(300);
								$("#filter_group_title").text(i18n[lang].messages.add_another_group_field);
							}

							// Move on the stage
							$("#filter_stage").append(panel);
						}
					});
				} else {
					$.remove_storage("pgrdg_cache.search.criteria.grouping._ordering");
					$("#summary_order_cancel_btn, #summary_order_reorder_btn").addClass("disabled");
					$("#group_by_btn .label-danger").remove();
				}
			};

			/**
			* Call Service and reorder results summary
			*/
			$.exec_ordering = function(callback) {
				var ids = [],
				objp = {};
				$.update_ordering_on_the_stage();

				$("#summary #summary-body").removeClass("disabled");
				$.each(storage.get("pgrdg_cache.search.criteria.grouping._ordering"), function(k, data) {
					ids.push(data.id);
				});
				if($("#collapsed_group_form").hasClass("in")) {
					$("#collapsed_group_form").collapse("hide");
				}

				objp.storage_group = "pgrdg_cache.summary";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = {};
				if(current_path == "Search") {
					objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
					objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
					objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = $.trim($("#search_form").val());
				} else {
					if($.storage_exists("pgrdg_cache.search.criteria")) {
						if($.storage_exists("pgrdg_cache.search.criteria.selected_forms")) {
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = $.get_storage_selected_forms();
						}
						if($.storage_exists("pgrdg_cache.search.criteria.fulltext")) {
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET] = {};
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_TEXT;
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_PARAM_FULL_TEXT_OFFSET][kAPI_PARAM_PATTERN] = storage.get("pgrdg_cache.search.criteria.fulltext");
						}
						if($.storage_exists("pgrdg_cache.search.criteria.select_map_area")) {
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG] = {};
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_INPUT_TYPE] = kAPI_PARAM_INPUT_SHAPE;
							objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG][kAPI_PARAM_SHAPE] = storage.get("pgrdg_cache.search.criteria.select_map_area");
						}
					}
				}
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_GROUP] = ids;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE_DISP;
				$.ask_to_service(objp, function(response) {
					if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok" && $.obj_len(response[kAPI_RESPONSE_RESULTS]) > 0) {
						var res = response;
						res.level = 0;
						res.history = [];

						$("#summary-body").removeClass("disabled");
						$("#summary-body .content-body").html("");
						$.generate_tree_summaries(res, "", function(result_panel){
							$("#summary-body .content-body").attr("id", res[kAPI_PARAM_ID]).append(result_panel);
						});

						if (jQuery.type(callback) == "function") {
							callback.call(this);
						}
					} else {
						$("#collapsed_group_form").collapse("show");
						if($("#apprise.no-results").length === 0) {
							apprise(i18n[lang].messages.grouping.no_combination_results.message, {
								"title": i18n[lang].messages.grouping.no_combination_results.title,
								"icon": "fa-bug",
								"class": "no-results",
								"titleClass": "text-warning",
								"fa_icon": "fa-warning"
							});
						}
						$("#summary-body").addClass("disabled");
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
		$.show_raw_data = function(id, domain, shp, skip, limit, grouped_data) {
			var shape = $.parseJSON($.rawurldecode(shp)),
			grouped = {},
			uobj_id = "",
			name = "";
			if(skip === undefined || skip === null || skip === "") { skip = 0; }
			if(limit === undefined || limit === null || limit === "") { limit = 50; }
			if(grouped_data === undefined || grouped_data === null || grouped_data === "") {
				uobj_id = $.md5(domain);
				grouped_data = {};
			} else {
				$.each($.parseJSON($.rawurldecode(grouped_data)), function(k, v) {
					uobj_id = $.md5(v[kAPI_PARAM_RESPONSE_FRMT_NAME] + domain);
					name = v[kAPI_PARAM_RESPONSE_FRMT_NAME];
					if(v.is_patch !== undefined && v.is_patch === true) {
						grouped = {};
					} else {
						grouped[k] = {};
						$.each(v, function(kk, vv) {
							if(kk !== kAPI_PARAM_RESPONSE_FRMT_NAME && kk !== kAPI_PARAM_RESPONSE_FRMT_INFO) {
								grouped[k][kk] = vv;
							}
						});
					}
				});
			}

			var summaries_data = storage.get("pgrdg_cache.summary." + id),
			objp = {};
				objp.storage_group = "pgrdg_cache.summary";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = limit;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_SKIP] = skip;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SUMMARY] = grouped;
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_COLUMN;
			$.ask_to_service(objp, function(res) {
				$.activate_panel("results", {
					title: $("#" + id + " .panel-heading span.title").text(),
					domain: domain,
					res: res
				});
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
							$item.find("a").popover({
								container: "body",
								placement: "auto",
								html: "true",
								trigger: "hover"
							});
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
							r += '<li><b>' + $.cycle_disp(content, kAPI_PARAM_RESPONSE_FRMT_NAME, "label") + '</b>: ' + content[kAPI_PARAM_RESPONSE_FRMT_DISP][kAPI_PARAM_RESPONSE_FRMT_DISP];
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
			$.searched_words = function(text) {
				if(current_path == "Search") {
					var subj = [],
					text_search = $("#search_form").val(),
					re = new RegExp(text_search, "gi");

					var quotes = text_search.match(/("[^"]+"|[^"\s]+)/gi);
					$.each(quotes, function(k, v) {
						if(v !== undefined) {
							if(v.charAt(0) == "-") {
								quotes.splice(k, 1);
							}
							if(v.charAt(0) == '"') {
								quotes[k] = v.replace(/^[^"]*"|".*/gi, "");
							}
						}
					});
					$.each(quotes, function(k, v) {
						var ree = new RegExp(v, "gi");
						if(text.search(ree) > -1) {
							text = text.replace(ree, function(matched) {
								return '<strong class="text-danger">' + matched + '</strong>';
							});
						}
						if(text.toLowerCase() == v.toLowerCase()) {
							text = text.replace(text, '<strong class="text-danger">' + text + '</strong>');
						}
					});

					return text;
				} else {
					return text;
				}
			};
			// Is a number or a digit
			if($.isNumeric(string)) {
				return '<span style="color: #099;">' + string + '</span>';
			// Is a date
			} else if (Date.parse(string)) {
				return '<span style="color: #7c4a4a;">' + string + '</span> <sup class="text-muted"><span class="fa fa-clock-o"></span></sup>';
			} else {
				return $.searched_words($.linkify(string));
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
				objp.storage_group = "pgrdg_cache.results";
				objp[kAPI_REQUEST_OPERATION] = kAPI_OP_GET_UNIT;
				objp.parameters = {};
				objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
				objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
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
		$.show_data_on_map = function(id, domain, shp, grouped_data) {
			var shape = $.parseJSON($.rawurldecode(shp)),
			grouped = {},
			uobj_id = "",
			name = "",
			summaries_data = storage.get("pgrdg_cache.summary." + id),
			geometry = [],
			arr = $.get_current_bbox_pgrdg();
			if(grouped_data === undefined || grouped_data === null || grouped_data === "") {
				uobj_id = $.md5(domain);
				grouped_data = {};
			} else {
				$.each($.parseJSON($.rawurldecode(grouped_data)), function(k, v) {
					name = v[kAPI_PARAM_RESPONSE_FRMT_NAME];
					if(v.is_patch !== undefined && v.is_patch === true) {
						grouped = {};
					} else {
						grouped[k] = {};
						$.each(v, function(kk, vv) {
							if(kk !== kAPI_PARAM_RESPONSE_FRMT_NAME && kk !== kAPI_PARAM_RESPONSE_FRMT_INFO) {
								grouped[k][kk] = vv;
							}
						});
					}
					uobj_id = $.md5(summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] + domain);
					console.log("Not working... you must generate an MD5(CRITERIA + DOMAIN)... See map.js on line 2665");
					console.log(summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA], uobj_id);
				});
				if($.obj_len(grouped_data) > 0) {
					grouped_data = $.parseJSON($.rawurldecode(grouped_data));
				}
			}
			geometry.push(arr);


			var objp = {};
			objp.storage_group = "pgrdg_cache.map";
			objp[kAPI_REQUEST_OPERATION] = kAPI_OP_MATCH_UNITS;
			objp.parameters = {};
			objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
			objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT] = 5000;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA] = summaries_data.query.obj[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA];
			if($.obj_len(shape) > 0) {
				objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_CRITERIA][kAPI_SHAPE_TAG] = shape;
			}
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DOMAIN] = domain;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SUMMARY] = grouped;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_MARKER;
			objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_SHAPE_OFFSET] = kTAG_GEO_SHAPE_DISP;
			$.ask_to_service(objp, function(res) {
				// console.log(res);
				if(res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > 0) {
					if(!$.storage_exists("pgrdg_cache.map_data.user_layers.results." + uobj_id)) {
						// Save on the user map layers
						var uobj = {},
						uobj_criteria = {};
						if($.storage_exists("pgrdg_cache.map_data.user_layers.results")) {
							uobj = storage.get("pgrdg_cache.map_data.user_layers.results");
						}

						uobj_criteria = storage.get("pgrdg_cache.search.criteria");
						uobj_criteria.node = grouped_data;
						uobj[uobj_id] = {
							show: true,
							criteria: uobj_criteria,
							name: name,
							domain: domain,
							query: objp,
							results: res.results
						};
						storage.set("pgrdg_cache.map_data.user_layers.results", uobj);
					}
					$.activate_panel("map", {res: res.results, id: uobj_id, shape: kTAG_GEO_SHAPE_DISP}, function() {
						$.get_generated_layers(uobj_id);
					});
					if(res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED] > objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT]) {
						var alert_title = i18n[lang].messages.map_limit_display.title;
							alert_title.replace("{N}", objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT]);
							alert_title.replace("{TOT}", res[kAPI_RESPONSE_PAGING][kAPI_PAGING_AFFECTED]);
						var alert_message = i18n[lang].messages.map_limit_display.message;
							alert_message.replace(/\{X\}/g, objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PAGING_LIMIT]);
						setTimeout(function() {
							apprise(alert_message, {
								class: "only_1k",
								title: alert_title,
								titleClass: "text-danger",
								icon: "fa-eye-slash"
							});
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
				$first_btn = $('<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'{}\', \'' + 0 + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="First page"><span class="fa fa fa-angle-double-left"></a>');

				page_btns = '<div class="form-group">';
					page_btns += '<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'{}\', \'' + 0 + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="First page"><span class="fa fa fa-angle-double-left"></a>';
				page_btns += '</div>&nbsp;';
				page_btns += '<div class="form-group">';
					page_btns += '<div class="input-group">';
						page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'{}\', \'' + previous_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == 1) ? ' disabled' : '') + '" title="Previous page"><span class="fa fa-angle-left"></a></span>';
						page_btns += '<span class="input-group-addon">' + i18n[lang].messages.row_data.page + '</span>';
						page_btns += '<input type="number" min="1" max="' + page_count + '" class="form-control" style="width: 75px;" placeholder="' + i18n[lang].messages.row_data.current_page + '" value="' + current_page + '" />';
						page_btns += '<span class="input-group-addon"> ' + i18n[lang].messages.row_data.of_page.replace("{X}", page_count) + '</span>';
						page_btns += '<span class="input-group-btn"><a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'{}\', \'' + next_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == page_count) ? ' disabled' : '') + '" title="Nex page"><span class="fa fa-angle-right"></a></span>';
					page_btns += '</div>';
				page_btns += '</div>&nbsp;';
				page_btns += '<div class="btn-group">';
					page_btns += '<a href="javascript:void(0);" onclick="$.show_raw_data(\'' + options.res.id + '\', \'' + options.domain + '\', \'{}\', \'' + last_skip + '\', \'' + limit + '\')" class="btn btn-default-white' + ((current_page == page_count) ? ' disabled' : '') + '" title="Last page"><span class="fa fa-angle-double-right"></a>';
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
			disabled: true,
			return_key: false
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
		var info_box = (!options.return_key) ? '<small class="pull-right help-block"><span class="fa fa-warning"></span> ' + i18n[lang].messages.forms.return_btn_disabled + '</small><div class="clearfix"></div>' : '';

		return '<input type="hidden" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_STRING + '" /><input id="' + options.id + '_operator_type" type="hidden" name="operator" value="' + selected_label_key + '" /><div class="input-group"><div class="input-group-btn"><button ' + ((options.disabled) ? 'disabled="disabled"' : " ") + ' data-toggle="dropdown" class="btn btn-default-white dropdown-toggle" type="button"><span id="' + options.id + '_operator" class="' + selected_label_key.replace("$", "") + '">' + selected_label_value + '</span> <span class="caret"></span></button><ul class="dropdown-menu">' + op_btn_list + '</ul></div><input type="' + options.type + '" class="' + options.class + '" id="' + options.id + '" name="stringselect" placeholder="' + options.placeholder + '" value="" ' + ((options.disabled) ? 'disabled="disabled"' : " ") + '/></div>' + info_box + checkbox + '';
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
			disabled: true,
			return_key: false
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
			off_txt: "False",
			return_key: false
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
			disabled: true,
			return_key: false
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
			class: "",
			expandable: true,
			id: $.makeid()
		}, options);

		if($("#accordion").length === 0) {
			$(this).append('<div class="panel-group" id="accordion">');
		} else {
			if($("#" + options.id).length === 0) {
				$(".panel-collapse.collapse").collapse("hide");
			}
		}
		var root_node;
		if($("#" + options.id).length === 0) {
			root_node = $('<div id="' + options.id + '" class="panel panel-default ' + options.class + '">');
		} else {
			root_node = $("#" + options.id);
		}
		if($("#" + options.id).length === 0) {
			var node_heading = $('<div class="panel-heading">'),
			node_heading_title = $('<h4 class="panel-title row">'),
				node_heading_title_content_right = $('<div class="col-sm-2 col-md-2 text-right pull-right"></div>'),
				node_heading_title_content_left_btn_toggle = $('<a data-toggle="collapse" data-parent="#accordion" title="' + i18n[lang].interface.open_close_row_content + '" href="#' + options.id + '_collapse"><span class="fa fa-fw fa-sort text-muted"></span></a>'),
				node_heading_title_right_btn_close = $('<a title="' + i18n[lang].interface.remove_row + '" href="javascript:void(0);" onclick="$.remove_search($(this));"><span class="fa fa-times" style="color: #666;"></span></a>'),
				node_heading_title_content_left = $('<div class="col-lg-10 pull-left"></div>'),
				node_heading_title_content_left_title = $('<span class="' + options.icon + '"></span>'),
			node_body_collapse = $('<div id="' + options.id + '_collapse" class="panel-collapse collapse in">'),
			node_body = $('<div class="panel-body">' + options.content + '</div>');

			//node_heading_title.html(json_data);
			node_heading_title_content_left.html(node_heading_title_content_left_title);
			node_heading_title_content_left.append("&nbsp;&nbsp;" + options.title);
			if(options.expandable) {
				node_heading_title_content_left.prepend(node_heading_title_content_left_btn_toggle);
			}
			node_heading_title_content_right.append(node_heading_title_right_btn_close);
			node_heading_title.html(node_heading_title_content_left);
			node_heading_title.append(node_heading_title_content_right);
			node_heading_title.appendTo(node_heading);
			node_heading.appendTo(root_node);
			if(options.content !== "") {
				node_body.appendTo(node_body_collapse);
			}
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
		} else {
			$("#" + options.id + "_collapse > div.panel-body").append(options.content);
			//node_body.appendTo(root_node);
		}

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
			btn_menu: {},
			return_key: false
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
						objp.storage_group = "pgrdg_cache.local.forms_data";
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
			panel_input_term_id = $panel.attr("id") + "_term",
			$form = $panel.closest("form"),
			item_id = $form.closest(".panel-success").prev().attr("id"),
			id = $form.find("input.reference").attr("data-id"),
			content = "",
			triangle = '<a class="tree-toggler text-muted" onclick="$.get_node(\'' + v.node + '\'); return false;" id="' + v.node + '_toggler" href="javascript: void(0);"><span class="fa fa-fw fa-caret-right"></span></a>',
			checked = false;

			if($.storage_exists("pgrdg_cache.search.criteria.selected_enums." + item_id)) {
				if($.inArray(v.label, storage.get("pgrdg_cache.search.criteria.selected_enums." + item_id + ".label")) !== -1) {
					checked = true;
					selected_enums = storage.get("pgrdg_cache.search.criteria.selected_enums." + item_id + ".label");
					selected_enums_term = storage.get("pgrdg_cache.search.criteria.selected_enums." + item_id + ".term");

					$form.find("#" + id + "_label").val(selected_enums.join(","));
					$form.find("#" + id + "_term").val(selected_enums_term.join(","));

					$form.find("a.treeselect").attr("title", selected_enums.join(", ")).attr("data-title", selected_enums.join(", ")).tooltip();
					$form.find("a.treeselect > span:first-child").text(((selected_enums.length > 1) ? selected_enums.length + " items selected" : ((selected_enums.length === 0) ? "Choose..." : selected_enums.join(", "))));
				} else {
					checked = false;
				}
			}
			checkbox = '<div class="checkbox">';
				checkbox += '<a href="javascript: void(0);" class="' + ((v[kAPI_PARAM_RESPONSE_COUNT] === undefined || v[kAPI_PARAM_RESPONSE_COUNT] === 0) ? 'btn btn-text text-muted disabled' : '') + '" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + $.rawurlencode(JSON.stringify(v)) + '\', \'' + panel_input_term_id + '\');">';
				checkbox += '<span class="fa"><big class="fa fa-fw text-default ' + ((checked) ? "fa-check-square-o" : "fa-square-o") + '"></big></span>{LABEL}</a></div>';


			var checkbox_inline = '<div class="checkbox-inline">';
				checkbox_inline += '<a href="javascript: void(0);" class="text-default" data-count="' + v.count + '" data-value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + $.rawurlencode(JSON.stringify(v)) + '\', \'' + panel_input_term_id + '\');"><span class="fa"><big class="fa fa-fw ' + ((checked) ? "fa-check-square-o" : "fa-square-o") + '"></big></span> {LABEL}</a></div>';
				// checkbox_inline += '<label>';
				// checkbox_inline += '<input type="checkbox" value="' + v.term + '" id="' + $.md5(v.term) + '_checkbox" onclick="$.manage_tree_checkbox(\'' + v.term + '\', \'' + v.label + '\', \'' + panel_input_term_id + '\', \'' + $.md5(v.term) + '_checkbox\');" /> {LABEL}</label></div>';

			if (v.children !== undefined && v.children > 0) {
				content += '<li class="list-group-item">' + triangle + '<span title="' + $.get_title(v) + '"> ' + ((v.value !== undefined && v.value) ? checkbox_inline.replace("{LABEL}", v.label) : '<a class="btn btn-text disabled" href="javascript: void(0);" onclick="$.get_node(\'' + v.node + '\'); return false;">' + v.label + '</a>') + '</span><ul id="node_' + v.node + '" style="display: none;" class="tree"></ul></li>';
			} else {
				content += '<li class="" value="' + v.term + '" title="' + $.get_title(v) + '"> ' + ((v.value !== undefined && v.value) ? checkbox.replace("{LABEL}", v.label) : '<a class="btn btn-text disabled" href="javascript: void(0);">' + v.label + '</a>') + '</li>';
			}
			return content;
		};

		/**
		* Manage checkbox tree
		*/
		$.manage_tree_checkbox = function(obj, panel) {
			// Disabled function (too low -> crash the user browser)
			// Keep warning when call
			$.iterate_childrens = function(item) {
				var $form = $this.closest("form"),
				label_input = $form.find("input.reference").attr("data-id"),
				$label_input_label = $("#" + label_input + "_label"),
				$label_input_term = $("#" + label_input + "_term"),
				selected_enums, selected_enums_term;
				// Get the storage
				if($.storage_exists("pgrdg_cache.search.criteria.selected_enums." + label_input)) {
					selected_enums = storage.get("pgrdg_cache.search.criteria.selected_enums." + label_input + ".label");
					selected_enums_term = storage.get("pgrdg_cache.search.criteria.selected_enums." + label_input + ".term");
				} else {
					selected_enums = [];
					selected_enums_term = [];
				}

				$("#loader").addClass("system").fadeIn(300, function() {
					var $this = item;

					$.each($this.find("ul li"), function(k, v) {
						var $li = $(this);

						if($li.find("a.tree-toggler").length > 0) {
							$li.find("a.tree-toggler").click();
						}
						if($li.find("span > div > a:not(.disabled) > big").hasClass("fa-square-o")) {
							selected_enums.push(v.label);
							selected_enums_term.push(v.term);
							$this.addClass("checked").find("big").removeClass("fa-square-o").addClass("fa-check-square-o");

							// Set the storage
							storage.set("pgrdg_cache.search.criteria.selected_enums." + label_input, {label: selected_enums, term: selected_enums_term});
							$.iterate_childrens($this.closest("li"));
						} else {
							selected_enums.splice($.inArray(v.label, selected_enums), 1);
							selected_enums_term.splice($.inArray(v.term, selected_enums_term), 1);

							// Set the storage
							storage.set("pgrdg_cache.search.criteria.selected_enums." + label_input, {label: selected_enums, term: selected_enums_term});
						}
					});
					setTimeout(function(){
						$("#loader").fadeOut(0).removeClass("system");
					}, 1000);

				});
			};

			var i = 0,
			v = JSON.parse($.rawurldecode(obj)),
			id = $.md5(v.term),
			$this = $("#" + id + "_checkbox"),
			$form = $this.closest("form"),
			item_id = $form.closest(".panel-success").prev().attr("id"),
			label_input = $form.find("input.reference").attr("data-id"),
			$label_input_label = $("#" + label_input + "_label"),
			$label_input_term = $("#" + label_input + "_term"),
			selected_enums, selected_enums_term;
			// Get the storage
			if($.storage_exists("pgrdg_cache.search.criteria.selected_enums." + item_id)) {
				selected_enums = storage.get("pgrdg_cache.search.criteria.selected_enums." + item_id + ".label");
				selected_enums_term = storage.get("pgrdg_cache.search.criteria.selected_enums." + item_id + ".term");
			} else {
				selected_enums = [];
				selected_enums_term = [];
			}

			if($this.find("big").hasClass("fa-square-o")) {
				selected_enums.push(v.label);
				selected_enums_term.push(v.term);
				$this.addClass("checked").find("big").removeClass("fa-square-o").addClass("fa-check-square-o");

				$.each($this.closest("li").find("ul > li a > big.fa-check-square-o"), function(index) {
					i++;
				});
				if(v.node !== undefined && i === 0) {
					$.get_node(v.node);
				}

				// Set the storage
				storage.set("pgrdg_cache.search.criteria.selected_enums." + item_id, {label: selected_enums, term: selected_enums_term});
			} else {
				selected_enums.splice($.inArray(v.label, selected_enums), 1);
				selected_enums_term.splice($.inArray(v.term, selected_enums_term), 1);
				$this.removeClass("checked").find("big").removeClass("fa-check-square-o").addClass("fa-square-o");

				$.each($this.closest("li").find("ul > li a > big.fa-check-square-o"), function(index) {
					i++;
				});
				if(v.node !== undefined && i === 0 && !$this.find("big").hasClass("fa-check-square-o")) {
					$.get_node(v.node);
				}
				// Set the storage
				storage.set("pgrdg_cache.search.criteria.selected_enums." + item_id, {label: selected_enums, term: selected_enums_term});
			}

			// $this.val(selected_enums);
			$label_input_label.val(selected_enums);
			$label_input_term.val(selected_enums_term);
			$form.find("a.treeselect").attr("title", selected_enums.join(", ")).attr("data-title", selected_enums.join(", ")).tooltip();
			$form.find("a.treeselect > span:first-child").text(((selected_enums.length > 1) ? selected_enums.length + " items selected" : ((selected_enums.length === 0) ? "Choose..." : selected_enums.join(", "))));
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
			return '<input type="hidden" data-id="' + options.id + '" class="reference" name="' + kAPI_PARAM_INPUT_TYPE + '" value="' + kAPI_PARAM_INPUT_ENUM + '" /><input type="hidden" id="' + options.id + '_label" value="" /><input id="' + options.id + '_term" type="hidden" name="' + kAPI_RESULT_ENUM_TERM + '" value="" />' + select;
		};


/*======================================================================================*/

$.build_big_buttons_menu = function() {
	/**
	 * Iterate the menu buttons and sub-buttons and build a tree of links
	 * @param  object|array 		v    		The object or array to parse
	 * @param  bool 			root 		We are on the root of the tree?
	 * @return string      					The html of the builded tree
	 */
	$.iterate_buttons = function(v, root) {
		/**
		 * Open or close the submenu depending its presence and status
		 */
		$.fn.collapse_submenu = function() {
			var $next = $(this).next();
			if($next.is("ul")) {
				if($next.is(":visible")) {
					$next.slideUp(300);
				} else {
					$next.slideDown(300);
				}
			}
		};

		var $divc = $('<div>'),
		$ul = $('<ul class="' + ((root) ? "list-unstyled" : "fa-ul") + '" style="' + ((!root) ? "display: none;" : "") + '">'),
		groups = ((root) ? v.refines : v.options);
		$.each(groups, function(kk, vv) {
			var $li = $('<li>'),
			$icon = $('<span class="fa-fw fa fa-caret-right"></span>'),
			$sublink = $('<a>').attr({
				"href": "javascript:void(0);",
				"onclick": "$(this).collapse_submenu();",
				"class": ((root) ? "text-info" : "btn-link")
			});
			if(root) {
				$sublink.text(vv.name);
			} else {
				$sublink.text(vv);
			}
			if(root) {
				$li.append($icon);
			}
			$li.append($sublink);
			if(vv.options !== undefined && vv.options.length > 0) {
				$li.append($.iterate_buttons(vv, false));
			}
			$ul.append($li);
		});
		$divc.append($ul);
		return $divc.html();
	};

	$.ajax({
		url: "common/include/conf/advanced_search_buttons.json",
		DataType: "json",
		crossDomain: true,
		type: "GET",
		timeout: 10000,
		success: function(response) {
			storage.set("pgrdg_cache.local.advanced_search_buttons", response.buttons);

			$.each(response.buttons, function(k, v) {
				if(v.icon !== "") {
					var $div = $('<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 text-center">'),
					$link = $('<a>').attr({
						"href": "javascript: void(0);",
						"class": (($.obj_len(v.refines) === 0) ? "disabled" : "")
					}),
					$img = $('<img class="" src="' + v.icon + '" />'),
					$h3 = $('<h3>').text(v.name);
					if($.obj_len(v.refines) === 0) {
						$h3.attr("class", "disabled");
					}

					$link.append($img).append($h3);
					$div.append($link);
					$("#big_buttons").append($div);
					$("#big_buttons a").popover({
						placement: "auto",
						html: true,
						trigger: "click",
						viewport: "body",
						content: function() {
							return $.iterate_buttons(v, true);
						}
					});
				}
			});
		}
	});
};
// Save the current page if user change
/*window.onbeforeunload = function() {
	storage.set("pgrdg_cache.html", $.utf8_to_b64($("body").html()));
};*/

$(document).ready(function() {
	if(current_path == "Search") {
		$(window).resize(function () {
			// Resize the forms when window is resized
			// $.resize_forms_mask();
		});
		if($.obj_len(query) > 0) {
			if($.storage_exists("pgrdg_cache.search.criteria.grouping._ordering")) {
			 	$.restore_stage();
			} else {
				if(query.groupby !== undefined) {
					var groups = query.groupby.replace(/(\[|\])/g, "").split(",");

				} else {
					$.search_fulltext(query.q);
				}
			}
		}
		//$.reset_contents("forms", true);
		//$.remove_storage("pgrdg_cache.search.criteria.selected_forms");
		//$.remove_storage("pgrdg_cache.local.forms_data");
	} else if(current_path == "Advanced_search") {
		$.get_static_forms();
		$.restore_form();
		$.build_big_buttons_menu();
	}
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
	// $(".dropdown.keep-open").on("click", function(e) {
	// 	e.stopPropagation();
	// });
});
