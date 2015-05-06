/*jshint scripturl:true*/
/*jshint -W030 */

/**
* Page editing functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/


/**
 * Cyclate pages and build the preview squared interface
 * @param  object 		page_data 			The object to iterate
 * @param  bool 		root      			Is starting from the root
 * @param  string 		parent    			The title of the parent node
 */
$.fn.cyclate_pages = function(page_data, root, parent) {
	$.random_colour = function() {
		return (Math.floor(Math.random() * 256)) + "," + (Math.floor(Math.random() * 156)) + "," + (Math.floor(Math.random() * 156));
	};

	var info;
	if(storage.isSet("pgrdg_cache.local.info")) {
		info = storage.get("pgrdg_cache.local.info");
	}
	if(root === undefined || root === null || root === "") {
		root = false;
	}
	if(parent === undefined || parent === null || parent === "") {
		parent = "";
	}

	if($.obj_len(page_data.subpages) > 0) {
		colour = $.random_colour();
	}
	var $item = $(this),
	$col = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">'),
	$link = $('<a>').attr({
		"href": "javascript:void(0);",
		"onclick": "$.edit_page('" + JSON.stringify(page_data) + "', '" + JSON.stringify(info) + "');",
		"class": "big_btn",
		"data-content": "",
		"style": function() {
			if($.obj_len(page_data.subpages) > 0) {
				return "box-shadow: 0 0 9px rgb(" + colour + ") inset;";
			} else if(!root) {
				return "box-shadow: 0 0 9px rgba(" + colour + ", 0.35) inset;";
			} else {
				return "";
			}
		},
		"title": "Edit this page"
	}),

	$folded = $('<div class="folded">'),
	$img = $('<img>').attr({
		"src": "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
	}),

	$big_btn_title = $('<div class="big_btn_title">'),
	$fittext = $('<span class="title fittext">').html(page_data.title + ((!root) ? "<small>subpage of " + parent + "</small>" : "")).fitText(1.2, {
		minFontSize: "20px",
		maxFontSize: "40px"
	}),

	$icons_list = $('<div class="icons_list">'),
		$icon_login = $('<span class="fa fa-' + ((page_data.need_login) ? "lock" : "unlock") + '">'),
		$icon_visible = $('<span class="fa fa-' + ((page_data.is_visible) ? "eye" : "eye-slash") + '">'),
		$icon_subpages = $('<span class="fa fa-' + ((page_data.subpages) ? "files-o" : "file-o") + '">');

		$icons_list.append($icon_login);
		$icons_list.append($icon_visible);
		if(!root) {
			$icons_list.append('<span class="fa fa-indent"></span>');
		}
		$icons_list.append($icon_subpages);


	$big_btn_title.append($fittext);
	$big_btn_title.append($icons_list);
	$folded.append($img);
	$link.append($folded);
	$link.append($big_btn_title);
	$col.append($link);

	$item.append($col);
	if($.obj_len(page_data.subpages) > 0) {
		$.each(page_data.subpages, function(kk, vv) {
			$item.cyclate_pages(vv, false, page_data.title);
		});
	}

	$.ajax({
		url: "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=http://pgrdiversity.bioversityinternational.org/" + page_data.address + "&screenshot=true",
		context: this,
		type: "GET",
		dataType: "json",
		success: function(data) {
			data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
			$img.attr("src", "data:image/jpeg;base64," + data);
		}
	});
};

/**
 * Make the save btn disabled
 */
$.disable_save_btn = function() {
	if(!$("#save_btn").hasClass("disabled")) {
		$("#save_btn").addClass("disabled");
	}
};

/**
 * Check if the input is empty
 * @return bool
 */
$.fn.check_inputs = function() {
	if($.trim($(this).val()).length > 0) {
		return true;
	} else {
		return false;
	}
};

/**
 * Add a new page
 * @param object 		page_config			The main pages config
 */
$.add_page = function(page_config) {
	var p_data = $.parseJSON(page_config),
	info = p_data.info;
	console.log(p_data);
	console.log(info);

	$("#page_management").hide();
	$("#page_management_edit").append('<h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> ' + i18n[lang].messages.loading_form + '</h1>').show();

	var $row = $('<div class="row">'),
	$form_container = $('<div id="page_management_form_container" class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10 well form">'),
	$fieldset = $('<fieldset>'),
	$legend = $('<legend>').text('Adding new page'),
	$frm = $('<form class="form-horizontal">'),
	$editor = $('<textarea id="text_editor" class="form-control">');
	$btn_div = $('<div class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10">'),
	$cancel_btn = $('<a href="javascript:void(0);" onclick="$.cancel_page_editing();" class="btn btn-default-white pull-left">').html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
	$save_btn = $('<a>').attr({
		"id": "save_btn",
		"href": "javascript:void(0);",
		"onclick": "$.save_page_data();",
		"class": "btn btn-default pull-right disabled"
	}).html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>');

	$.each(info, function(k, v) {
		var $form_group = $('<div class="form-group">'),
		$boolean_group = $('<div>'),
		$label = $('<label>'),
		$input_div = $('<div class="col-sm-5 col-xs-12">');
		$input = $('<input>');
		if(k !== "_id" && k != "obj_name" && k != "is_system_page" && k != "is_main_page" && k != "subpages") {
			$label.attr({
				"class": "col-sm-1 col-sm-offset-2 control-label col-xs-12",
				"for": "__" + k
			}).text($.ucfirst($.trim(k.replace("is", "").replace(/\_/g, " "))));

			if(v.input_type == "checkbox") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"id": "__" + k
				});
			} else {
				$input.attr({
					"type": "text",
					"name": k,
					"id": "__" + k,
					"class": "form-control",
					"value": "",
					"placeholder": v.description
				});
			}
			if(v.required) {
				$label.append(' <span class="text-danger">*</span>');
				$input.attr("required", true).addClass("required");
			}
			switch(k) {
				case "title":
					$input.css("width", "50%");
					break;
				case "address":
					$input.on("blur", function() {
						var this_val = $(this).val();
						$(this).val($.trim(this_val));
					}).attr("id", "address");
					break;
			}

			$input_div.append($input);
			$label.attr("title", v.description).tooltip();
			$form_group.append($label);
			$form_group.append($input_div);
		} else {
			if(v.input_type == "checkbox") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"id": "__" + k,
					"class": "hidden"
				});
			} else {
				$input.attr({
					"type": "hidden",
					"name": k,
					"id": "__" + k,
					"class": "form-control",
					"value": "",
					"placeholder": v.description
				});
				if(v.input_type == "disabled") {
					$input.attr("disabled", true);
				}
			}
			$input_div.append($input);
			$form_group.append($input_div);
			if($input.hasClass("hidden")) {
				$input_div.addClass("hidden");
				$form_group.addClass("hidden");
			}
		}
		$frm.append($form_group);
	});

	$frm.append('<hr />');
	$frm.append('<div class="alert alert-info"><b>Note:</b> For collaborative editing, you can also work on <a href="https://stackedit.io/" target="_blank">StackEdit</a> and paste the Markdown content here</div>');
	$frm.append($editor);
	$fieldset.append($legend);
	$fieldset.append($frm);
	$btn_div.append($cancel_btn).append($save_btn);
	$form_container.append($fieldset);
	$row.append($form_container);
	$row.append($btn_div);
	$("#page_management_edit").html($row);

	$("[type='checkbox']:not(.hidden)").bootstrapSwitch({
		size: "small",
		labelText: "⋮",
		onText: "Yes",
		offText: "No"
	});

	$("#text_editor").markItUp(mySettings);
	$("button.preview").click(function() {
		$("#content").scrollTo(900, 800);
	});
	// Apply the id and the obj_name to the page
	$("#__title").blur(function() {
		$("#__obj_name").val($(this).val());
		$("#___id").val($.md5($(this).val()));
	});
	// Disable/enable the save btn
	$frm.find("input[type=text].required").on("keyup blur", function() {
		if($(this).check_inputs()) {
			if($editor.check_inputs()) {
				$("#save_btn").removeClass("disabled");
			} else {
				$.disable_save_btn();
			}
		} else {
			$.disable_save_btn();
		}
		$editor.on("keyup blur", function() {
				if($(this).check_inputs()) {
				if($frm.find("input[type=text].required").check_inputs()) {
					$("#save_btn").removeClass("disabled");
				} else {
					$.disable_save_btn();
				}
			} else {
				$.disable_save_btn();
			}
		});
	});
};

/**
 * Edit a selected page
 * @param  string   		page_data 			The page data of selected page
 * @param  string 		info				The info object about page_data structure
 */
$.edit_page = function(page_data, info) {
	var p_data = $.parseJSON(page_data),
	i = $.parseJSON(info),
	md_name = (p_data.address.replace(/\_/g, " ") === "") ? "home" : p_data.address.replace(/\_/g, " ");

	$("#page_management").hide();
	$("#page_management_edit").append('<h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> ' + i18n[lang].messages.loading_form + '</h1>').show();
	console.log(p_data._id);
	var $row = $('<div class="row">'),
	$form_container = $('<div id="page_management_form_container" class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10 well form">'),
	$fieldset = $('<fieldset>'),
	$legend = $('<legend>').text('Editing page "' + p_data.title + '"'),
	$frm = $('<form class="form-horizontal">'),
	$editor = $('<textarea id="text_editor" class="form-control">');
	$btn_div = $('<div class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10">'),
	$btn_group = $('<div class="btn-group">'),
	$cancel_btn = $('<a href="javascript:void(0);" onclick="$.cancel_page_editing();" class="btn btn-default-white pull-left">').html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
	$remove_btn = $('<a href="javascript:void(0);" onclick="$.remove_page(\'' + p_data._id + '\');" class="btn btn-danger">').html(i18n[lang].interface.btns.remove_page + ' <span class="fa fa-trash-o"></span>'),
	$save_btn = $('<a>').attr({
		"id": "save_btn",
		"href": "javascript:void(0);",
		"onclick": "$.save_page_data();",
		"class": "btn btn-default pull-right"
	}).html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>');

	$.each(p_data, function(k, v) {
		if($.is_array(v)) {
			v = v.join(", ");
		}

		var $form_group = $('<div class="form-group">'),
		$boolean_group = $('<div>'),
		$label = $('<label>'),
		$input_div = $('<div class="col-sm-5 col-xs-12">');
		$input = $('<input>');
		if(k !== "_id" && k != "obj_name" && k != "is_system_page" && k != "is_main_page" && k != "subpages") {
			$label.attr({
				"class": "col-sm-3 control-label col-xs-12",
				"for": "__" + k
			}).text($.ucfirst($.trim(k.replace("is", "").replace(/\_/g, " "))));
			if(i[k].input_type == "checkbox") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"id": "__" + k
				});
				if(v === true) {
					$input.attr({"checked": "true"});
				}
			} else {
				$input.attr({
					"type": "text",
					"name": k,
					"id": "__" + k,
					"class": "form-control",
					"value": ($.type(v) == "string") ? v.replace(/\_/g, " ") : JSON.stringify(v),
					"placeholder": (($.obj_len(info) > 0 && i[k].description !== undefined) ? i[k].description : "")
				});
			}
			if(i[k].required) {
				$label.append(' <span class="text-danger">*</span>');
				$input.attr("required", true).addClass("required");
			}
			switch(k) {
				case "title":
					$input.css("width", "50%");
					break;
				case "address":
					$input.on("blur", function() {
						var this_val = $(this).val();
						$(this).val($.trim(this_val));
					}).attr("id", "address");
					break;
			}
			$input_div.append($input);
			$label.attr("title", v.description).tooltip();
			$form_group.append($label);
			$form_group.append($input_div);
		} else {
			if(i[k].input_type == "checkbox") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"id": "__" + k,
					"class": "hidden"
				});
				if(v === true) {
					$input.attr({"checked": "true"});
				}
			} else {
				$input.attr({
					"type": "hidden",
					"name": k,
					"id": "__" + k,
					"class": "form-control",
					"value": ($.type(v) == "string") ? v.replace(/\_/g, " ") : JSON.stringify(v),
					"placeholder": (($.obj_len(info) > 0 && i[k].description !== undefined) ? i[k].description : "")
				});
				if(v.input_type == "disabled") {
					$input.attr("disabled", true);
				}
			}
			$input_div.append($input);
			$form_group.append($input_div);
			if($input.hasClass("hidden")) {
				$input_div.addClass("hidden");
				$form_group.addClass("hidden");
			}
		}
		$frm.append($form_group);
	});
	$.ajax({
		url: "common/include/funcs/_ajax/get_all_pages.php",
		DataType: "json",
		crossDomain: true,
		type: "GET",
		timeout: 10000,
		success: function(response) {
			var all_pages = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: response
			});
			all_pages.initialize();

			$("#address").typeahead({
				hint: true,
				highlight: true,
				minLength: 2
			}, {
				name: "pages",
				displayKey: "title",
				source: all_pages.ttAdapter()
			}).bind("typeahead:selected, typeahead:cursorchanged", function(obj, selected, name) {
				$(this).on("blur", function() {
					$(this).val(selected.link.replace(/\_/g, " ").replace(/\//g, ""));
				});
			});
		}
	});
	$.ajax({
		url: "common/md/" + md_name + ".md",
		context: this,
		type: "GET",
		dataType: "text",
		success: function(data) {
			$("#text_editor").text(data);
		},
		error: function() {
			$.ajax({
				url: "common/tpl/pages/" + md_name.replace(/\_/, " ") + ".tpl",
				type: "HEAD",
				success: function(data) {
					var $alert2 = $('<div class="alert alert-warning">').html('<span class="fa fa-exclamation-triangle"></span> ' + i18n[lang].messages.content_managed_by_script.replace("{X}", md_name));
					$alert2.insertAfter($("#page_management_form_container .alert"));
				},
				error: function() {
					var $alert2 = $('<div class="alert alert-danger">').html('<span class="fa fa-times fa-1_5x pull-left"></span> ' + i18n[lang].messages.content_not_exists.replace("{X}", md_name + ".md"));
					$alert2.insertAfter($("#page_management_form_container .alert"));
				}
			});
		}
	});

	$frm.append('<hr />');
	$frm.append('<div class="alert alert-info"><b>Note:</b> For collaborative editing, you can also work on <a href="https://stackedit.io/" target="_blank">StackEdit</a> and paste the Markdown content here</div>');
	$frm.append($editor);
	$fieldset.append($legend);
	$fieldset.append($frm);
	$btn_group.append($cancel_btn).append($remove_btn);
	$btn_div.append($btn_group).append($save_btn);
	$form_container.append($fieldset);
	$row.append($form_container);
	$row.append($btn_div);
	$("#page_management_edit").html($row);

	$("[type='checkbox']:not(.hidden)").bootstrapSwitch({
		size: "small",
		labelText: "⋮",
		onText: "Yes",
		offText: "No"
	});

	$("#text_editor").markItUp(mySettings);
	$("button.preview").click(function() {
		$("#content").scrollTo(900, 800);
	});
	// Apply the id and the obj_name to the page
	$("#__title").blur(function() {
		$("#__obj_name").val($(this).val());
		$("#___id").val($.md5($(this).val()));
	});
	// Disable/enable the save btn
	$frm.find("input[type=text].required").on("keyup blur", function() {
		if($(this).check_inputs()) {
			if($editor.check_inputs()) {
				$("#save_btn").removeClass("disabled");
			} else {
				$.disable_save_btn();
			}
		} else {
			$.disable_save_btn();
		}
		$editor.on("keyup blur", function() {
			if($(this).check_inputs()) {
				if($frm.find("input[type=text].required").check_inputs()) {
					$("#save_btn").removeClass("disabled");
				} else {
					$.disable_save_btn();
				}
			} else {
				$.disable_save_btn();
			}
		});
	});
};

/**
 * Go back to main interface
 */
$.cancel_page_editing = function() {
	$("#page_management").fadeIn(300);
	$("#page_management_edit").fadeOut(300, function() {
		$("#page_management_edit").html("");
	});
};

/**
 * Remove a page
 * @param  string		_id 				The page identifier
 */
$.remove_page = function(_id) {
	console.warn(_id);
	$.get_all_pages_config(function(page_config) {
		var info = page_config.info,
		page_name = "",
		pages = {},
		s = {},
		all = {};
		pages["info"] = info;
		$.each(page_config.pages, function(k, v) {
			if(v._id !== _id) {
				s[k] = v;
			} else {
				page_name = v.obj_name;
			}
		});
		pages["pages"] = s;
		all.data = pages;
		all.title = page_name;
		console.log(all);
		$.require_password(function() {
			$("#loader").show();
			$.ask_cyphered_to_service({
				storage_group: "pgrdg_user_cache.local.page_data",
				data: all,
				dataType: "text",
				type: "remove_page"
			}, function(response) {
				$("#loader").hide();
				if(response == "ok") {
					$.log_activity({
						action: "Removed page \"" + page_name + "\"",
						icon: "fa-file-text-o"
					});
					apprise(i18n[lang].messages.page_deleted.message, {
						title: i18n[lang].messages.page_deleted.title,
						icon: "fa-check",
						titleClass: "text-success"
					}, function(r) {
						location.reload();
					});
				} else {
					apprise(i18n[lang].messages.page_not_deleted.message, {
						title: i18n[lang].messages.page_not_deleted.title,
						icon: "fa-times",
						titleClass: "text-danger"
					});
				}
			});
		});
	});
};

/**
 * Save the page data
 */
$.save_page_data = function() {
	var originalSerializeArray = $.fn.serializeArray;
	$.fn.extend({
		serializeArray: function () {
		        var brokenSerialization = originalSerializeArray.apply(this);
		        var checkboxValues = $(this).find('input[type=checkbox]').map(function () {
		            return { 'name': this.name, 'value': this.checked };
		        }).get();
		        var checkboxKeys = $.map(checkboxValues, function (element) { return element.name; });
		        var withoutCheckboxes = $.grep(brokenSerialization, function (element) {
		            return $.inArray(element.name, checkboxKeys) == -1;
		        });

		        return $.merge(withoutCheckboxes, checkboxValues);
		}
	});
	var serialized = $("#page_management_form_container form").serializeArray(),
	s = {},
	pages = {},
	all = {};

	$.each(serialized, function(k, v) {
		s[v.name] = v.value;
	});
	// Bug fixing
	s.subpages = "";
	pages[s.obj_name] = s;
	// Page config
	console.info("Page config:");
	console.log(pages);
	console.info("Page Markdown content");
	console.log($("#text_editor").val());

	all.data = pages;
	all.content = {
		"title": s.obj_name,
		"content": $("#text_editor").val()
	};

	$.require_password(function() {
		$("#loader").show();
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.local.page_data",
			data: all,
			dataType: "text",
			type: "save_page_data"
		}, function(response) {
			$("#loader").hide();
			if(response == "ok") {
				$.log_activity({
					action: "Changed page \"" + s.obj_name + "\"",
					icon: "fa-file-text-o"
				});
				apprise(i18n[lang].messages.page_saved.message, {
					title: i18n[lang].messages.page_saved.title,
					icon: "fa-check",
					titleClass: "text-success"
				}, function(r) {
					location.reload();
				});
			} else {
				apprise(i18n[lang].messages.page_not_saved.message, {
					title: i18n[lang].messages.page_not_saved.title,
					icon: "fa-times",
					titleClass: "text-danger"
				});
			}
		});
	});
};

/**
 * Buil the preview squared interface
 */
$.init_pages_management = function() {
	$.get_all_pages_config(function(page_config) {
		var $h1 = $('<h1>').text("Pages management"),
		$btn_add = $('<button>').attr({
			"class": "pull-right btn btn-default-white",
			"onclick": "$.add_page('" + JSON.stringify(page_config) + "');"
		}).html(i18n[lang].interface.btns.add_page + ' <span class="fa fa-plus fa-fw"></span>'),
		$row = $('<div class="row">');

		$.each(page_config.pages, function(page_name, page_data) {
			if(page_data.is_backend !== undefined && !page_data.is_backend) {
				$row.cyclate_pages(page_data, true);
			}
		});
		$h1.append($btn_add);
		$("#page_management").html($h1).append($row);
	});
};
