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
 * Add a new page
 */
$.add_page = function() {

};

/**
 * Edit a selected page
 * @param  string   		page_address 		The address of the selected page
 */
$.edit_page = function(page_data, info) {
	console.log(page_data);
	var p_data = $.parseJSON(page_data),
	i = $.parseJSON(info),
	md_name = (p_data.address.replace(/\_/g, " ") === "") ? "home" : p_data.address.replace(/\_/g, " ");


	$("#page_management").hide();
	$("#page_management_edit").append('<h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> ' + i18n[lang].messages.loading_form + '</h1>').show();

	var $row = $('<div class="row">'),
	$form_container = $('<div id="page_management_form_container" class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10 well form">'),
	$fieldset = $('<fieldset>'),
	$legend = $('<legend>').text('Editing page "' + p_data.title + '"'),
	$frm = $('<form class="form-horizontal">'),
	$editor = $('<textarea id="text_editor" class="form-control">');
	$btn_div = $('<div class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10">'),
	$cancel_btn = $('<a href="javascript:void(0);" onclick="$.cancel_page_editing();" class="btn btn-default-white pull-left">').html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
	$save_btn = $('<a>').attr({
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
				"for": $.md5(k)
			}).text($.ucfirst($.trim(k.replace("is", "").replace(/\_/g, " "))));

			if($.type(v) == "boolean") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"id": $.md5(k)
				});
				if(v === true) {
					$input.attr({"checked": "true"});
				}
			} else {
				$input.attr({
					"type": "text",
					"name": k,
					"class": "form-control",
					"value": ($.type(v) == "string") ? v.replace(/\_/g, " ") : JSON.stringify(v),
					"placeholder": (($.obj_len(info) > 0 && i[k] !== undefined) ? i[k] : "")
				});
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
			$form_group.append($label);
			$form_group.append($input_div);
		} else {
			if($.type(v) == "boolean") {
				$input.attr({
					"type": "checkbox",
					"name": k,
					"class": "hidden",
					"id": $.md5(k)
				});
				if(v === true) {
					$input.attr({"checked": "true"});
				}
			} else {
				$input.attr({
					"type": "hidden",
					"name": k,
					"class": "form-control",
					"value": ($.type(v) == "string") ? v.replace(/\_/g, " ") : JSON.stringify(v),
					"placeholder": (($.obj_len(info) > 0 && i[k] !== undefined) ? i[k] : "")
				});
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

	// setTimeout(function () {
	// 	$("#page_management").show();
	// 	$("#page_management_edit").hide().html("");
	// }, 60000);
};

/**
 * Come back to main interface
 */
$.cancel_page_editing = function() {
	$("#page_management").fadeIn(300);
	$("#page_management_edit").fadeOut(300, function() {
		$("#page_management_edit").html("");
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
					title: i18n[lang].messages.page_saved.title,
					icon: "fa-times",
					titleClass: "text-danger"
				});
			}
		});
	});
};
