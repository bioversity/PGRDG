/*jshint scripturl:true*/

/**
* Menu editing functions
*
* @author       Alessandro Gubitosi <gubi.ale@iod.io>
* @license      http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link         https://github.com/bioversity/PGRDG/
*/

/**
 * Enable/disable move buttons depending on its position
 */
$.enable_disable_move_btn = function() {
	$.each($("ul.list-group").find("li"), function(k, v) {
		// Show or hide move_up button
		if($(this).prev("li").length === 0) {
			$(this).find(".btn_move_up").addClass("disabled");
		} else {
			$(this).find(".btn_move_up").removeClass("disabled");
		}
		// Show or hide move_down button
		if($(this).next("li").length === 0) {
			$(this).find(".btn_move_down").addClass("disabled");
			// $(this).find(".btn_outdent").addClass("hidden");
		} else {
			$(this).find(".btn_move_down").removeClass("disabled");
			// $(this).find(".btn_outdent").removeClass("hidden");
		}
		// Show or hide indent button
		if($(this).find(".subpanel-body").length === 0) {
			if(!$(this).closest("ul").hasClass("subpanel-body")) {
				$(this).find(".btn_indent").removeClass("hidden");
			}
		} else {
			$(this).find(".btn_indent").addClass("hidden");
		}
		// Show or hide outdent button
		if($(this).closest("ul").hasClass("subpanel-body")) {
			$(this).find(".btn_outdent").removeClass("hidden");
		} else {
			$(this).find(".btn_outdent").addClass("hidden");
		}
	});
};

/**
 * Move a row up
 */
$.fn.move_row_up = function() {
	$(this).click(function() {
		var $btn_up = $(this),
		$btn_down = $btn_up.closest(".btn-group").find(".btn_move_down"),
		$row = $btn_up.closest(".menu_row"),
		$previous = $row.prev("li");
		if($previous.length !== 0){
			$row.insertBefore($previous);
			$.enable_disable_move_btn();
		}
	});
};

/**
 * Move a row down
 */
$.fn.move_row_down = function() {
	$(this).click(function() {
		var $btn_down = $(this),
		$btn_up = $btn_down.closest(".btn-group").find(".btn_move_down"),
		$row = $btn_down.closest(".menu_row"),
		$next = $row.next("li");
		if($next.length !== 0){
			$row.insertAfter($next);
			$.enable_disable_move_btn();
		}
	});
};

/**
 * Indent row to the next row submenu
 */
$.fn.indent_row_btn = function() {
	$(this).click(function() {
		var $btn_indent = $(this),
		$row = $btn_indent.closest(".menu_row"),
		$next = $row.next("li");

		if($next.find(".list-group").length > 0) {
			$next.find(".list-group ul").prepend($row);
		} else {
			var $list_group = $('<div class="list-group">'),
			$list_group_ul = $('<ul class="subpanel-body list-group">');

			$list_group_ul.append($row);
			$list_group.append($list_group_ul);
			$next.append($list_group);
		}
		$.enable_disable_move_btn();

	});
};

/**
 * Outdent row to the previous row
 */
$.fn.outdent_row_btn = function() {
	$(this).click(function() {
		var $btn_outdent = $(this),
		$row = $btn_outdent.closest(".menu_row"),
		$outrow = $btn_outdent.closest(".list-group").closest(".menu_row");

		if($outrow.length !== 0){
			$row.insertBefore($outrow);
			if($outrow.find(".list-group ul li").length === 0) {
				$outrow.find(".list-group").remove();
			}
			if($row.find(".list-group").length > 0) {
				$row.find(".list-group").remove();
			}
			$.enable_disable_move_btn();
		}

	});
};

/**
* Add a new menu
*/
$.add_menu = function() {
	var allow_other = true,
	$item = {};
	$.each($("#menu_management_stage .list-group-item"), function(k, v) {
		if($(v).find(".menu_name").html().length === 0) {
			$item = $(v);
			allow_other = false;
			return false;
		}
	});
	if(allow_other) {
		var host = $.url().attr("host"),
		$li = $('<li id="' + $.md5("new_node" + $.now()) + '" class="list-group-item">'),
		$title_row = $('<div class="title_row">'),
		$move_handle = $('<div class="move-handle"></div>'),
		$move_handle2 = $('<div class="move-handle"></div>'),
		$menu_data = $('<div class="menu_data">'),
		$h4 = $('<h4 class="list-group-item-heading">'),
		$menu_icon = $('<span class="fa fa-indent menu_icon">'),
		$menu_name = $('<span class="menu_name">'),
		$menu_link = $('<span class="menu_link">').text("javascript:void(0);"),
		$fw = $('<span class="fa fa-fw">').html("&rsaquo;"),
		$tt = $('<tt>'),
		$btn_group = $('<div class="btn-group pull-right">'),
		$btn_edit = $('<button>').attr({
			"data-placement": "top",
			"data-toggle": "tooltip",
			"title": i18n[lang].messages.edit,
			"onclick": "$(this).edit_menu();",
			"class": "btn btn-default-white edit_menu_btn"
		}).html('<span class="fa fa-fw fa-edit"></span>'),
		$btn_hide = $('<button>').attr({
			"data-placement": "top",
			"data-toggle": "tooltip",
			"title": i18n[lang].messages.hide,
			"onclick": "$(this).hide_menu();",
			"class": "btn btn-default-white"
		}).html('<span class="fa fa-fw fa-eye-slash"></span>'),
		$small = $('<small class="">'),
		$p = $('<p>').attr({
			"class": "list-group-item-text list-group-item-body clearfix menu_title"
		}).html('<br />');

		$tt.append($small).append($menu_link);
		$btn_group.append($btn_edit).append($btn_hide);
		$h4.append($menu_icon).append(" ").append($menu_name).append($fw).append($tt).append($btn_group);
		$menu_data.append($h4).append($p);
		$title_row.append($move_handle).append($menu_data).append($move_handle2);
		$li.append($title_row);

		$("#menu_management_stage > ul.list-group").prepend($li);
		$btn_edit.edit_menu(i18n[lang].messages.new_menu_item);
	} else {
		$item.find(".edit_menu_btn").edit_menu(i18n[lang].messages.new_menu_item);
	}
};

/**
* Toggle menu item visibility
*/
$.fn.hide_menu = function() {
	var $item = $(this),
	$line = $item.closest(".list-group-item").first();

	$line.find(".title_row h4").first().find("span").toggleClass("not-visible");
	$line.find(".title_row h4").first().find("tt").toggleClass("not-visible");
	$line.find(".title_row p").first().toggleClass("not-visible");
	$item.toggleClass("active");
};

/**
* Edit a menu item
* @param  string   		menu_name 		The menu title that appears on modal form
*/
$.fn.edit_menu = function(menu_name, callback) {
	/**
	 * Get all available icons
	 */
	$.generate_available_icons = function(callback) {
		if(!$.storage_exists("pgrdg_user_cache.local.available_icons")) {
			$.ajax({
				url: "common/include/funcs/_ajax/available_icons.php",
				DataType: "json",
				crossDomain: true,
				type: "GET",
				timeout: 10000,
				success: function(response) {
					storage.set("pgrdg_user_cache.local.available_icons", response.icons);
					if(typeof callback == "function") {
						callback(response.icons);
					}
				}
			});
		} else {
			if(typeof callback == "function") {
				callback(storage.get("pgrdg_user_cache.local.available_icons"));
			}
		}
	};

	/**
	 * Generate a box containing all Font Awesome available icons
	 */
	$.fn.generate_available_icons_preview = function(current_icon) {
		/**
		 * Set the icon on the edit stage to be saved
		 * @param string 		icon 			The icon class to save
		 */
		$.fn.set_icon = function(icon) {
			var $icon_box = $(this).closest(".icon_box"),
			$input = $("input#menu_icon");

			$input.val(icon);
			$icon_box.find("a.selected").removeClass("selected");
			$(this).addClass("selected");
		};

		var $box = $('<ul class="list-inline">');

		$.generate_available_icons(function(icons) {
			for(var i = 0; i < icons.length; i++) {
				var $li = $('<li>'),
				icon = icons[i];
				var $a = $('<a>').attr({
					"href": "javascript:void(0);",
					"onclick": "$(this).set_icon('fa " + icon + "');",
					"id": icon,
					"title": $.ucfirst(icon.replace("fa-", "").replace("-o-", "-").replace("-o", "").replace(/\-/g, " ")),
					"class": (current_icon.replace("fa ", "") == icon) ? "selected": ""
				}),
				$span = $('<span>').addClass("fa fa-fw " + icon);
				// console.log(icon)
				$a.append($span);
				$li.append($a);
				$box.append($li);
			}
		});
		$(this).append($box);
	};

	$("#loader").show();
	var $item = $(this),
	data = $item.closest(".menu_data").first(),
	$title_row = $item.closest(".list-group-item").find(".title_row").first(),
	title = (data.find(".menu_title:first").text() !== i18n[lang].messages.no_title) ? data.find(".menu_title:first").text() : "",
	text = data.find(".menu_name:first").text(),
	icon = $.trim(data.find(".menu_icon:first").attr("class").replace("menu_icon", "")),
	link = $.local_link_to_str(data.find(".menu_link:first").text());

	// DOM generation
	var $form = $('<form class="form-horizontal">'),
	$div_text = $('<div class="form-group">'),
	$div_title = $('<div class="form-group">'),
	$div_link = $('<div class="form-group">'),
	$div_icon_container = $('<div class="icon_box_container">'),
	$div_icon_row = $('<div class="row icon_box_header">'),
	$search_col = $('<div class="col-sm-6">'),
	$search_input_group = $('<div class="input-group">'),
	$search_addon = $('<span class="input-group-addon">').html('<span class="fa fa-search"></span>'),
	$div_icon = $('<div class="icon_box">'),

	$text_label = $('<label class="control-label col-sm-2" for="menu_name">').text(i18n[lang].interface.forms.label_menu_text),
	$title_label = $('<label class="control-label col-sm-2" for="menu_title">').text(i18n[lang].interface.forms.label_menu_title),
	$link_label = $('<label class="control-label col-sm-2" for="menu_link">').text(i18n[lang].interface.forms.label_menu_link),
	$icon_label = $('<label class="control-label col-sm-6 text-left" for="menu_icon">').text(i18n[lang].interface.forms.label_menu_icon),

	$text_input_col = $('<div class="col-sm-6">'),
	$title_input_col = $('<div class="col-sm-10">'),
	$link_input_col = $('<div class="col-sm-10">'),
	$icon_input_col = $('<div class="col-sm-10">'),
	$link_input_group = $('<div class="input-group">'),
	$link_input_group_span = $('<span class="input-group-btn">'),
	$link_input_group_btn = $('<button class="btn btn-default-grey" title="' + i18n[lang].interface.btns.empty_link + '" onclick="$(\'#menu_link\').val(\'javascript:void(0);\'); return false;">').html('<span class="fa fa-code">'),

	$search_input = $('<input type="text" id="icon_search" class="form-control pull-right" placeholder="Search icon..." />'),
	$input_text = $('<input type="text" class="form-control" id="menu_name" name="menu_name" required value="' + text + '" tabindex="1" />'),
	$input_title = $('<input type="text" class="form-control" id="menu_title" name="menu_title" required value="' + title + '" tabindex="2" />'),
	$input_link = $('<input type="url" class="form-control" id="menu_link" name="menu_link" required disabled value="' + link.replace(/\_/g, " ") + '" tabindex="3" />');
	$input_icon = $('<input type="hidden" id="menu_icon" name="menu_icon" value="' + icon + '" tabindex="4" />');

	$text_input_col.append($input_text);
	$div_text.append($text_label);
	$div_text.append($text_input_col);

	$title_input_col.append($input_title);
	$div_title.append($title_label);
	$div_title.append($title_input_col);

	$link_input_group.append($input_link);
	$link_input_group.append($link_input_group_span);
	$link_input_group_span.append($link_input_group_btn);
	$link_input_col.append($link_input_group);
	$div_link.append($link_label);
	$div_link.append($link_input_col);

	$div_icon_row.append($icon_label);
	$search_input_group.append($search_input);
	$search_input_group.append($search_addon);
	$search_col.append($search_input_group);
	$div_icon_row.append($search_col);
	$div_icon_container.append($div_icon_row);
	$div_icon_container.append($input_icon);
	$div_icon.generate_available_icons_preview(icon);
	$div_icon_container.append($div_icon);

	$form.html("");
	$form.append($div_text);
	$form.append($div_title);
	$form.append($div_link);
	$form.append($div_icon_container);

	$title_row.addClass("selected");
	apprise($form[0].outerHTML, {
		title: (menu_name !== undefined && menu_name !== null && menu_name !== "") ? menu_name : i18n[lang].messages.edit_menu,
		form: true,
		allowExit: false,
		cancelBtnClass: "btn-default-white",
		okBtnClass: "btn-default",
		onShown: function(data) {
			$.ajax({
				url: "common/include/funcs/_ajax/get_all_pages.php",
				DataType: "json",
				crossDomain: true,
				type: "GET",
				timeout: 10000,
				success: function(response) {
					// console.log(response);
					var all_pages = new Bloodhound({
						datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
						queryTokenizer: Bloodhound.tokenizers.whitespace,
						local: response
					});
					all_pages.initialize();

					$("#menu_link").attr("disabled", false);
					$("#menu_link").typeahead({
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

			$("#icon_search").on("keyup", function() {
				$("#icon_search").closest(".input-group").find(".fa").switchClass("fa-times", "fa-search");
				$("#icon_search").closest(".input-group").removeClass("has-error");

				var search = this,
				$search_input_group = $("#icon_search").closest(".input-group"),
				$stage = $(".icon_box"),
				$list_items = $stage.find("ul.list-inline li");
				$(".search-sf").remove();
				$.each($list_items, function(i, val) {
					// Lower text for case insensitive
					var searched_text = $(val).find("a").attr("data-original-title").toLowerCase(),
					input_text = $(search).val().toLowerCase();
					if(input_text !== "") {
						if(searched_text.indexOf(input_text) == -1) {
							// hide rows
							$list_items.eq(i).hide();
						} else {
							$(".search-sf").remove();
							$list_items.eq(i).show();
						}
					}
				});
				// All tr elements are hidden
				if($list_items.children(':visible').length === 0) {
					$("#icon_search").closest(".input-group").find(".fa").switchClass("fa-search", "fa-times");
					$("#icon_search").closest(".input-group").addClass("has-error");
					// setTimeout(function() {
					// 	$("#icon_search").closest(".input-group").removeClass("has-error");
					// }, 5000);
					if($("h1.search-sf").length === 0) {
						$stage.append('<h1 class="search-sf" unselectable="true">No entries found.</h1>');
					}
				}
			});
			$(".icon_box").scrollTo("#" + icon.replace("fa ", ""), 800, {
				offset: function() {
					return {top: -70};
				}
			});
		},
		onSave: function(data) {
			if(data !== false) {
				$.each(data, function(k, v) {
					switch(v.name) {
						case "menu_icon":
							$title_row.find("." + v.name).attr("class", "fa " + v.value + " menu_icon");
							break;
						case "menu_link":
							console.info($.str_to_local_link(v.value));
							$title_row.find("." + v.name).html($.str_to_local_link(v.value));
							break;
						default:
							$title_row.find("." + v.name).text(v.value);
							break;
					}
				});
			}
		},
		onHidden: function(data) {
			$title_row.removeClass("selected");
		}
	});
};



$.save_menu = function() {
	/**
	 * Parse the row dom and extract relevant data
	 * @return object 				An object with the row data
	 */
	$.fn.get_row_data = function() {
		var data = {},
		$item = $(this),
		$menu_data = $item.find(".menu_data:first"),
		name = $.trim($menu_data.find(".menu_name").text()),
		obj_name = name.replace(/\_/g, " "),
		visible = ((!$menu_data.find(".menu_icon").hasClass("not-visible")) ? true : false),
		title = $.trim($menu_data.find(".menu_title").text().replace(i18n[lang].messages.no_title, "").replace("not-visible", "")),
		icon = $.trim($menu_data.find("span.menu_icon").attr("class").replace("fa ", "").replace("menu_icon", "").replace("not-visible", "")),
		link = $.local_link_to_str($menu_data.find(".menu_link").html());
		data[obj_name] = {};
		data[obj_name].content = {
			"icon": "fa " + icon,
			"text": name
		};
		// console.log(name, visible);
		data[obj_name].attributes = {
			"href": link,
			"title": title,
			"class": "btn btn-link" + ((!visible) ? " hidden" : "")
		};

		if($.obj_len($item.find(".list-group")) > 0) {
			// var childs = {};
			data[obj_name].childs = {};
			$.each($item.find(".list-group > .subpanel-body > .list-group-item"), function(kk, vv) {
				// childs = $(vv).get_row_data();
				$.each($(vv).get_row_data(), function(i, d) {
					data[obj_name].childs[i] = d;
				});
				// $.extend(data[obj_name].childs, childs);
			});
		}

		return data;

	};

	var root = {};
	root.menu = {};
	root.menu.top = {};
	$.each($("#menu_management_stage > .list-group > .list-group-item"), function(k, v) {
		$.each($(v).get_row_data(), function(i, d) {
			root.menu.top[i.replace(/\_/g, " ")] = d;
		});
	});
	// Add not yet developed backend functionalities
	// root.menu.top["Sign in"] = {"content": {"icon": "fa fa-sign-in", "text": "Sign in"}, "attributes": {"href": "./Signin", "class": "btn btn-link"}};
	root.menu.map_toolbox = [{"Show_hide_menu": {"content": {"icon": "ion-navicon","text": ""},"attributes": {"onclick": "$.sh_menu()","href": "javascript:void(0);","class": "btn","id": "show_hide_menu_btn","title": "Show or hide main menu (ALT+M)"},"divider": "divider nav_divider"},"Show_hide_breadcrumb": {"content": {"icon": "fa fa-history","text": ""},"attributes": {"onclick": "$.sh_breadcrumb()","href": "javascript:void(0);","class": "btn","id": "show_hide_breadcrumb_btn","title": "Show or hide breadcrumb (ALT+B)"}}},{"Find_location": {"content": {"icon": "ion-search","text": ""},"attributes": {"onclick": "$.sub_toolbox('find_location');","href": "javascript:void(0);","class": "btn","id": "find_location_btn","title": "Find a location (ALT+F)"}},"Change_map": {"content": {"icon": "ion-map","text": ""},"attributes": {"onclick": "$.sub_toolbox('change_map');","href": "javascript:void(0);","class": "btn","id": "change_map_btn","title": "Change map type (ALT+T)"}},"Selection": {"content": {"icon": "icon-vector-selection","text": ""},"attributes": {"onclick": "$.sub_toolbox('tools');","href": "javascript:void(0);","class": "btn","id": "selection_btn","title": "Show/hide selection tools"},"divider": "divider"},"Lock_view": {"content": {"icon": "fa fa-lock","text": ""},"attributes": {"onclick": "$.toggle_lock_view();","href": "javascript:void(0);","class": "btn","id": "lock_view_btn","title": "Lock/unlock this view (ALT+L)"}}},{"Help": {"content": {"icon": "ion-help","text": ""},"attributes": {"href": "javascript:void(0);","class": "btn","id": "help_btn","title": "Help (F1)","onclick": "$.show_help();"}}}];
	root.menu.tools = [{"Draw_polygon": {"content": {"icon": "icon-vector-polygon","text": ""},"attributes": {"onclick": "$.draw_polygon();","href": "javascript:void(0);","class": "btn","id": "draw_polygon_btn","title": "Select custom area"}},"Draw_rectangle": {"content": {"icon": "icon-vector-rectangle","text": ""},"attributes": {"onclick": "$.draw_rectangle();","href": "javascript:void(0);","class": "btn","id": "draw_rectangle_btn","title": "Select squared area"}},"Draw_circle": {"content": {"icon": "icon-vector-circle","text": ""},"attributes": {"onclick": "$.draw_circle();","href": "javascript:void(0);","class": "btn","id": "draw_circle_btn","title": "Select circular area"}}}];
	root.menu.map_contextmenu = [{"Get_point": {"content": {"icon": "fa fa-crosshairs","text": "Get informations of this point"},"attributes": {"href": "javascript:void(0);","class": "btn","title": "Help","onclick": "$.get_click_info();"},"divider": "divider"}}];
	root.menu.map_knob_contextmenu = [{"Point_info": {"content": {"icon": "fa fa-info-circle","text": ""},"attributes": {"href": "javascript:void(0);","class": "","title": "Get informations of this point","onclick": "$.get_click_info();"}}}];

	// console.log(root);
	// Now save data to file
	// var k = {};
	// k[kAPI_REQUEST_USER] = (user_id === null || user_id === undefined || user_id === "") ? $.get_manager_id() : user_id;
	// k[kTAG_NAME] = $.trim($("#new_user_full_name").val());
	// k[kTAG_AUTHORITY] = "ITA046";
	// k[kTAG_COLLECTION] = "pgrdiversity.bioversityinternational.org";
	// k[kTAG_ENTITY_TITLE] = $.trim($("#new_user_work_title").val());
	// k[kTAG_ENTITY_EMAIL] = $.trim($("#new_user_mail_address").val());
	// k[kTAG_ROLES] = [];
	$.require_password(function() {
		$.ask_cyphered_to_service({
			storage_group: "pgrdg_user_cache.local.menu",
			data: root,
			dataType: "text",
			type: "save_menu"
		}, function(response) {
			if(response == "ok") {
				$("#alert").removeClass("alert-danger")
					   .addClass("alert-success")
					   .html('<span class="fa fa-check fa-1_5x pull-left"></span> ' + i18n[lang].messages.menu_saved)
					   .fadeIn(600, function() {
					$("#alert").delay(3000).fadeOut(600);
				});
			} else {
				$("#alert").removeClass("alert-success")
					   .addClass("alert-danger")
					   .html('<span class="fa fa-3x fa-times pull-left"></span> ' + i18n[lang].messages.menu_not_saved)
					   .fadeIn(600);
			}
			// if(typeof callback == "function") {
			// 	$.each(response, function(id, ud) {
			// 		// Log
			// 		$.log_activity("Invited an user with id: " + $.get_user_id(ud));
			// 	// 	storage.set("pgrdg_user_cache.user_data.all." + $.get_user_id(ud), ud);
			// 	// 	callback.call(this, ud);
			// 	});
			// }
			$("#loader").hide();
		});
	});
};


/*======================================================================================*/

$(document).ready(function() {
	$.enable_disable_move_btn();
	$(".btn_move_up").move_row_up();
	$(".btn_move_down").move_row_down();
	$(".btn_indent").indent_row_btn();
	$(".btn_outdent").outdent_row_btn();
	$("button").tooltip({
		trigger: "hover click"
	});
});
