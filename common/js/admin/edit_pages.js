/**
* Page editing functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/


/**
 * Edit a selected page
 * @param  string   		page_address 		The address of the selected page
 */
$.edit_page = function(page_data, info) {
	p_data = $.parseJSON(page_data);
	i = $.parseJSON(info);

	$("#page_management").hide();
	$("#page_management_edit").append('<h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> ' + i18n[lang].messages.loading_form + '</h1>').show();

	var $row = $('<div class="row">'),
	$form_container = $('<div id="page_management_form_container" class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10 well form">'),
	$fieldset = $('<fieldset>'),
	$legend = $('<legend>').text('Editing page "' + p_data.title + '"'),
	$frm = $('<form class="form-horizontal">'),
	$editor = $('<textarea id="text_editor" class="form-control">').text("### Ok");
	$btn_div = $('<div class="col-xs-offset-1 col-sm-offset-1 col-xs-12 col-sm-8 col-lg-10">'),
	$cancel_btn = $('<a href="javascript:void(0);" onclick="$.cancel_page_editing();" class="btn btn-default-white pull-left">').html('<span class="fa fa-angle-left"></span> ' + i18n[lang].interface.btns.cancel),
	$save_btn = $('<a href="javascript:void(0);" onclick="$.save_page_data();" class="btn btn-default pull-right">').html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>');

	$.each(p_data, function(k, v) {
		if(k !== "_id" && k !== "title_class" && k !== "subpages" && k != "is_system_page" && k != "is_main_page") {
			if($.is_array(v)) {
				v = v.join(", ");
			}

			var $form_group = $('<div class="form-group">'),
			$boolean_group = $('<div>'),
			$label = $('<label class="col-sm-3 control-label col-xs-12" for="' + $.md5(k) + '">' + $.ucfirst($.trim(k.replace("is", "").replace(/\_/g, " "))) + '</label>'),
			$input_div = $('<div class="col-sm-5 col-xs-12">');
			$input = $('<input>');

			if($.type(v) == "boolean") {
				$input.attr({ "type": "checkbox", "id": $.md5(k) });
				if(v === true) {
					$input.attr({"checked": "true"});
				}
			} else {
				$input.attr({
					"type": "text",
					"class": "form-control",
					"value": v.replace(/\_/g, " "),
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
			$frm.append($form_group);
		}
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
		url: "common/md/" + p_data.address.replace(/\_/g, " ") + ".md",
		context: this,
		type: "GET",
		dataType: "text",
		success: function(data) {
			console.warn(data);
		},
		error: function() {
			console.warn("The file do not exists");
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

	$("[type='checkbox']").bootstrapSwitch({
		size: "small",
		labelText: "⋮",
		onText: "Yes",
		offText: "No"
	});

	$("#text_editor").markItUp(mySettings);
	// console.log($.parseJSON(page_data));

	// setTimeout(function () {
	// 	$("#page_management").show();
	// 	$("#page_management_edit").hide().html("");
	// }, 60000);
};
