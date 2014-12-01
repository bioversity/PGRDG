// Apprise for Bootstrap by Alessandro Gubitosi
//
// based on Apprie 1.5 by Daniel Raftery
// http://thrivingkings.com/apprise

function apprise(string, args, callback) {
	if(typeof(string) == "object") {
		callback = args;
		args = string;
		string = "";
	}
	var default_args = {
		"allowExit": true,
		"confirm": false, 			// Ok and Cancel buttons
		"input": false,
		"inputIP": false,
		"invertedBtns": false,
		"message": false, 			// Textarea (can be true or string for default text)
		"progress": false,
		"showFooter": true,
		"showHeader": true,
		"verify": false,			// Yes and No buttons
		"perhaps": false,
		"class": "",
		"fa_icon": "",
		"icon": "",
		"okBtnClass": "btn-primary",		// Ok button class
		"PerhapsBtnClass": "btn-default",	// Perhaps button class
		"tag": "h4",
		"textCancel": "Cancel",			// Cancel button default text
		"textNo": "No", 			// No button default text
		"textOk": "Ok", 			// Ok button default text
		"textPerhaps": "Perhaps",		// Perhaps button default text
		"textYes": "Si", 			// Yes button default text
		"title": "",
		"titleClass": "text-primary"
	};
	if (args) {
		for (var index in default_args) {
			if (typeof(args[index]) == "undefined") args[index] = default_args[index];
		}
	} else {
		args = default_args;
	}

	var modal = $('<div class="modal fade' + ((args !== undefined) ? " " + args.class : "") + '" id="apprise" tabindex="-1" role="dialog" aria-labelledby="appriseLabel" aria-hidden="true"' + ((args !== undefined && !args.allowExit) ? ' data-backdrop="static" data-keyboard="false"' : '') + '></div>'),
	dialog = $('<div class="modal-dialog">'),
	content = $('<div class="modal-content">'),
	header = $('<div class="modal-header">'),
	title = $('<h4 class="modal-title">'),
	close = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'),
	body = $('<div class="modal-body">'),
	row = $('<div class="row">'),
	panel = $('<div>'),
	footer = $('<div class="modal-footer" style="margin-top: 0;">');

	if (args) {
		if(args.showHeader) {
			if (args.title) {
				if (args.title.length > 0) {
					var title_icon = "",
					title_class = " text-primary";

					if (args.icon) {
						switch(args.icon) {
							case "success":
								args.icon = "fa-check";
								title_class = " text-success";
								break;
							case "warning":
								args.icon = "fa-exclamation-triangle";
								title_class = " text-warning";
								break;
							case "error":
								args.icon = "fa-times";
								title_class = " text-danger";
								break;
							default:
								title_class = " " + args.titleClass;
								break;
						}
						title_icon = '<span class="fa ' + args.icon + '"></span>&nbsp;&nbsp;';
					} else {
						title_icon = "";
						title_class = " text-primary";
					}
					title.addClass(title_class).append(title_icon + args.title);

					if(args.fa_icon) {
						row.prepend('<div class="col-sm-2 text-muted"><span style="font-size: 81px;" class="fa ' + args.fa_icon + '"></span></div>');
					}
				}
			}
			header.appendTo(content);
			if(args.allowExit) {
				close.appendTo(header);
			}
			title.appendTo(header);
		}
	}
	if(string !== undefined) {
		if(string.length > 0) {
			if(args.fa_icon) {
				panel.addClass("col-sm-10");
			} else {
				panel.addClass("col-sm-12");
			}
			if(string.length > 0) {
				row.appendTo(body);
				if(args.showHeader && args.showFooter) {
					panel.append('<' + args.tag + '>' + string + '</' + args.tag + '>').appendTo(row);
				} else {
					panel.append('<div style="text-align: center;">' + string + '</div>').appendTo(row);
				}
				body.appendTo(content);
			}
		}
	}

	if (args) {
		if (args.input) {
			if (typeof(args.input) == 'string') {
				row.find("div.col-sm-12").append('<input type="text" class="form-control" value="' + args.input + '" /></div>');
			} else {
				if(args.fa_icon) {
					row.find("div.col-sm-10").append('<input type="text" class="form-control" /></div>');
				} else {
					row.find("div.col-sm-12").append('<input type="text" class="form-control" /></div>');
				}
			}
		}
		if (args.inputIP) {
			row.prepend('<div class="form-group col-sm-5"><p>Tipo di indirizzo:</p><label><input type="radio" id="ipv4" name="ipaddr" class="ipaddr" checked /> <acronym title="Internet Protocol versione 4">IPv4</acronym></label><br /><label><input type="radio" id="ipv6" name="ipaddr" class="ipaddr" /> <acronym title="Internet Protocol versione 6">IPv6</acronym></label><br /><label><input type="radio" id="dns" name="ipaddr" class="ipaddr" /> <acronym title="Domain Name System">DNS</acronym></label></div>');

			$.add_input = function(args) {
				if (typeof(args.inputIP) == 'string') {
					row.find("div.col-sm-12").append('<input type="text" class="form-control" value="' + args.inputIP + '" /></div>');
				} else {
					if(args.fa_icon) {
						row.find("div.col-sm-10").append('<input type="text" class="form-control" /></div>');
					} else {
						row.find("div.col-sm-12").append('<input type="text" class="form-control" /></div>');
					}
				}
			};
			$.add_input(args);
		}
		if (args.message) {
			if (typeof(args.message) == 'string') {
				row.find("div.col-sm-12").append('<textarea rows="5" class="form-control">' + args.message + '</textarea></div>');
			} else {
				if(args.fa_icon) {
					row.find("div.col-sm-10").append('<textarea rows="5" class="form-control"></textarea></div>');
				} else {
					row.find("div.col-sm-12").append('<textarea rows="5" class="form-control"></textarea></div>');
				}
			}
		}
	}
	if (args) {
		var btn_group = $('<div class="btn-group">');
		if (args.confirm || args.input || args.message) {
			if(args.confirm) {
				args.textOk = "Yes";
				args.textCancel = "No";
			}
			btn_group.append('<button value="cancel" data-dismiss="modal" class="btn btn-default">' + args.textCancel + '</button>');
			btn_group.append('<button value="ok" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">' + args.textOk + '</button>');
			btn_group.appendTo(footer);
		} else if (args.invertedBtns) {
			btn_group.append('<button value="ok" data-dismiss="modal" class="btn btn-default">' + args.textOk + '</button>');
			btn_group.append('<button value="cancel" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">' + args.textCancel + '</button>');
			btn_group.appendTo(footer);
			btn_group.appendTo(footer);
		} else if (args.perhaps) {
			btn_group.append('<button value="cancel" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">' + args.textCancel + '</button>');
			btn_group.append('<button value="perhaps" data-dismiss="modal" class="btn ' + args.PerhapsBtnClass + '">' + args.textPerhaps + '</button>');
			btn_group.append('<button value="ok" data-dismiss="modal" class="btn btn-default">' + args.textOk + '</button>');
			btn_group.appendTo(footer);
		} else if (args.verify) {
			btn_group.append('<button value="cancel" data-dismiss="modal" class="btn btn-default">' + args.textNo + '</button>');
			btn_group.append('<button value="ok" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">' + args.textYes + '</button>');
			btn_group.appendTo(footer);
		} else if(args.progress) {
			footer.append('<div class="progress progress-striped active" style="margin: 0;"><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
		} else {
			footer.append('<button value="ok" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">' + args.textOk + '</button>');
		}
	} else {
		footer.append('<button value="ok" data-dismiss="modal" class="btn ' + args.okBtnClass + ' right">Ok</button>');
		$("#apprise .modal-footer, #apprise .progress").css({"margin": "0px"});
	}

	dialog.appendTo(modal);
	content.appendTo(dialog);
	if(args.showFooter) {
		footer.appendTo(content);
	}
	modal.prependTo('body');
	$(".btn").click(function() {
		if (callback && typeof(callback) === "function") {
			if(args.input || args.message) {
				callback(($('.form-control').val().length > 0) ? $('.form-control').val() : false);
			} else if(args.perhaps) {
				if($(this).val() == "ok") {
					callback(true);
				} else if ($(this).val() == "perhaps") {
					callback("perhaps");
				} else {
					callback(false);
				}
			} else {
				callback(($(this).val() == "ok") ? true : false);
			}
		}
	});
	$("#apprise").modal(modal).on("shown.bs.modal", function() {
		if(args.inputIP) {
			$(this).find(".form-control").ipAddress().focus();
		} else if(args.input) {
			$(this).find(".form-control").focus();
		}
		$(document).keydown(function (e) {
			if (e.keyCode == 13) {
				if(!args.input && !args.message) {
					$('button[value="ok"]').click();
				}
			}
			if(args.allowExit) {
				if (e.keyCode == 27) { $("#apprise").modal("hide"); }
			}
		});
		$(".ipaddr").change(function() {
			var $form_control = row.find(".form-control");
			if($("#ipv4").is(":checked")) {
				$form_control.remove();
				$.add_input(args);
				$("#apprise .form-control").ipAddress({v: 4}).focus();
			} else if($("#ipv6").is(":checked")) {
				$form_control.remove();
				$.add_input(args);
				$("#apprise .form-control").ipAddress({v: 6}).focus();
			} else if($("#dns").is(":checked")) {
				$form_control.remove();
				$.add_input(args);
				$("#apprise .form-control").focus();
			}
		});
		$("*[title]:not(acronym)").tooltip();
		$("acronym[title]").tooltip({placement: "right"});
	});
}
