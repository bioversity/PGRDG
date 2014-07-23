<?php
if($logged) {
	$post = $pdo->query("select * from `iod_posts` where `id` = '" . addslashes($_GET["id"]) . "'");
	if($post->rowCount()) {
		while($dato_post = $post->fetch()) {
			$title_post = stripslashes($dato_post["title"]);
			$summary_post = stripslashes($dato_post["summary"]);
			$content_post = stripslashes($dato_post["content"]);
			$tags_post = stripslashes($dato_post["tags"]);
				$tags_post_li = '<li>' . str_replace(",", "</li><li>", stripslashes($dato_post["tags"])) . "</li>";
			$link_post = $dato_post["link"];
				$visible = $dato_post["visible"];
				$visible_btn_icon = (($dato_post["visible"] == 1) ? "glyphicon-eye-open" : "glyphicon-eye-close");
				$visible_btn_txt = (($dato_post["visible"] == 1) ? "Visible" : "Hidden");
				$visible_btn_type = (($dato_post["visible"] == 1) ? "btn-default" : "btn-warning");
		}
		$del_btn = "";
	} else {
		$title_post = str_replace("_", " ", ucfirst($_GET["q"]));
		$summary_post = "";
		$content_post = "";
		$tags_post = "";
		$link_post = str_replace(" ", "_", ucfirst($_GET["q"]));
			$visible = 1;
			$visible_btn_icon = "glyphicon-eye-open";
			$visible_btn_txt = "Visible";
			$visible_btn_type = "btn-default";
		
		$del_btn = "disabled";
	}
}
?>
<script src="common/js/EpicEditor/epiceditor/js/epiceditor.min.js"></script>
<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/flick/jquery-ui.css" rel="stylesheet" type="text/css">
<link href="common/js/tag-it/css/jquery.tagit.css" rel="stylesheet" type="text/css">
<script src="common/js/tag-it/js/tag-it.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
$(document).ready(function() {
	var summary_opts = {
		container: 'summary',
		textarea: "post_summary",
		basePath: 'epiceditor',
		clientSideStorage: true,
		localStorageName: 'epiceditor_summary',
		useNativeFullscreen: true,
		parser: marked,
		file: {
			name: 'epiceditor',
			defaultContent: '',
			autoSave: 100
		},
		theme: {
			base: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/base/epiceditor.css',
			preview: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/preview/iod.css',
			editor: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/editor/epic-dark.css'
		},
		button: {
			preview: false,
			fullscreen: false,
			bar: "hide"
		},
		focusOnLoad: false,
		shortcut: {
			modifier: 18,
			fullscreen: 70,
			preview: 80
		},
		string: {
			togglePreview: 'Toggle Preview Mode',
			toggleEdit: 'Toggle Edit Mode',
			toggleFullscreen: 'Enter Fullscreen'
		},
		autogrow: {
			minHeight: 150
		}
	}
	var content_opts = {
		container: 'content',
		textarea: "post_content",
		basePath: 'epiceditor',
		clientSideStorage: true,
		localStorageName: 'epiceditor_content',
		useNativeFullscreen: true,
		parser: marked,
		file: {
			name: 'epiceditor',
			defaultContent: '',
			autoSave: 100
		},
		theme: {
			base: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/base/epiceditor.css',
			preview: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/preview/iod.css',
			editor: 'http://iod.io/common/js/EpicEditor/epiceditor/themes/editor/epic-dark.css'
		},
		button: {
			preview: false,
			fullscreen: false,
			bar: "hide"
		},
		focusOnLoad: false,
		shortcut: {
			modifier: 18,
			fullscreen: 70,
			preview: 80
		},
		string: {
			togglePreview: 'Toggle Preview Mode',
			toggleEdit: 'Toggle Edit Mode',
			toggleFullscreen: 'Enter Fullscreen'
		},
		autogrow: {
			minHeight: 350
		}
	}
	var summary_editor = new EpicEditor(summary_opts);
	var content_editor = new EpicEditor(content_opts);
	summary_editor.load(function() {
		if (!summary_editor.is('loaded')) { return; }
		content_editor.load(function() {
			$("input[type='text']").bind("change paste keyup", function() {
				if(summary_editor.is("preview")) {
					summary_editor.edit();
					content_editor.edit();
					$(".editor_btn.s_edit").switchClass("s_edit", "s_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
					$(".editor_btn.c_edit").switchClass("c_edit", "c_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
					$(".editor_btn.save").removeClass("disabled", function() { $(this).switchClass("btn-success", "btn-primary"); });
					$(".editor_btn.delete").removeClass("disabled");
				}
			});
			summary_editor.on("fullscreenenter", function() {
				$("#summary > iframe").contents().find("#epiceditor-previewer-frame").contents().find("body").css({"margin": "2em"});
			});
			summary_editor.on("fullscreenexit", function() {
				$("#summary > iframe").contents().find("#epiceditor-previewer-frame").contents().find("body").css({"margin": "0"});
			});
			content_editor.on("fullscreenenter", function() {
				$("#content > iframe").contents().find("#epiceditor-previewer-frame").contents().find("body").css({"margin": "2em"});
			});
			content_editor.on("fullscreenexit", function() {
				$("#content > iframe").contents().find("#epiceditor-previewer-frame").contents().find("body").css({"margin": "0"});
			});
			$(".editor_btn").bind("click", function() {
				if (!content_editor.is('loaded')) { return; }
				if($(this).hasClass("s_preview")) {
					summary_editor.preview();
					$(this).switchClass("s_preview", "s_edit").html('<span class="glyphicon glyphicon-edit"></span> Edit');
				} else if($(this).hasClass("c_preview")) {
					content_editor.preview();
					$(this).switchClass("c_preview", "c_edit").html('<span class="glyphicon glyphicon-edit"></span> Edit');
				} else if ($(this).hasClass("s_edit")) {
					summary_editor.edit();
					$(this).switchClass("s_edit", "s_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
				} else if ($(this).hasClass("c_edit")) {
					content_editor.edit();
					$(this).switchClass("c_edit", "c_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
				} else if($(this).hasClass("s_fullscreen")) {
					summary_editor.enterFullscreen();
				} else if($(this).hasClass("c_fullscreen")) {
					content_editor.enterFullscreen();
				} else if($(this).hasClass("save")) {
					var theSummary = summary_editor.exportFile();
					var theContent = content_editor.exportFile();
					if(theContent.trim().length > 0) {
						$.post("common/include/funcs/_ajax/save_post.php", {id: $("#post_id").val(), link: $("#post_link").val(), title: $("#post_title").val(), summary: theSummary, content: theContent, tags: $("#post__tags").val()}, function() {
							summary_editor.preview();
							content_editor.preview();
							$(".editor_btn.s_preview").switchClass("s_preview", "s_edit").html('<span class="glyphicon glyphicon-edit"></span> Edit');
							$(".editor_btn.c_preview").switchClass("c_preview", "c_edit").html('<span class="glyphicon glyphicon-edit"></span> Edit');
							$(".editor_btn.save").addClass("disabled").switchClass("btn-primary", "btn-success");
							$(".editor_btn.delete").removeClass("disabled");
						});
					}
					summary_editor.on('update', function () {
						summary_editor.edit();
						$(this).switchClass("s_edit", "s_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
						$(".editor_btn.save").removeClass("disabled", function() { $(this).switchClass("btn-success", "btn-primary"); });
						$(".editor_btn.delete").removeClass("disabled");
					});
					content_editor.on('update', function () {
						content_editor.edit();
						$(this).switchClass("c_edit", "c_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
						$(".editor_btn.save").removeClass("disabled", function() { $(this).switchClass("btn-success", "btn-primary"); });
						$(".editor_btn.delete").removeClass("disabled");
					});
				} else if($(this).hasClass("show_hide")) {
					if($(this).hasClass("btn-warning")) {
						console.log("hiding...");
						var show = 1;
						$(this).switchClass("btn-warning", "btn-default").html('<span class="glyphicon glyphicon-eye-open"></span> Visible');
					} else {
						console.log("showing...");
						var show = 0;
						$(this).switchClass("btn-default", "btn-warning").html('<span class="glyphicon glyphicon-eye-close"></span> Hidden');
					}
					$.post("common/include/funcs/_ajax/show_hide_post.php", {id: $("#post_id").val(), action: show}, function(data) {
						if(data) {
							console.log(data);
						}
					});
				} else if($(this).hasClass("delete")) {
					if(confirm("Are you sure that you want to delete this post?")) {
						$.post("common/include/funcs/_ajax/delete_post.php", {id: $("#post_id").val()}, function(data) {
							if(data == "ok") {
								$(".editor_btn.save").removeClass("disabled", function() { $(this).switchClass("btn-success", "btn-primary"); });
								$(".editor_btn.delete").addClass("disabled");
							}
						});
					}
				}
			});
		});
	});
	$("#post_tags").tagit({
		allowSpaces: true,
		placeholderText: "Tag me...",
		removeConfirmation: true,
		fieldName: "tags",
		singleField: true,
		singleFieldNode: $("#post__tags"),
		tabIndex: 3,
		afterTagAdded: function(event, ui) {
			if(summary_editor.is("preview")) {
				summary_editor.edit();
				content_editor.edit();
				$(".editor_btn.s_edit").switchClass("s_edit", "s_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
				$(".editor_btn.c_edit").switchClass("c_edit", "c_preview").html('<span class="glyphicon glyphicon-check"></span> Local preview');
				$(".editor_btn.save").removeClass("disabled", function() { $(this).switchClass("btn-success", "btn-primary"); });
				$(".tagit-new").find("input").focus();
			}
		}
	});
});
</script>
<aside>
	<section>
		<article>
			<header>
				<h1><?php print $title_post; ?></h1>
			</header>
			<section>
				<input type="hidden" id="post_id" value="<?php print $_GET["id"]; ?>" />
				<label for="post_title">Title:</label>
				<input type="text" class="form-control" id="post_title" tabIndex="1" required value="<?php print $title_post; ?>" />
				<br />
				<label for="post_link">Link:</label>
				<input type="text" class="form-control" id="post_link" tabIndex="2" required value="<?php print $link_post; ?>" />
				<br />
				<label for="post_tags">Tags:</label>
				<input type="hidden" style="display: none;" id="post__tags" name="tags" value="<?php print $tags_post; ?>">
				<ul id="post_tags"><?php print $tags_post_li; ?></ul>
				<br />
				<label>Summary:</label>
				<textarea id="post_summary" style="display: none;"><?php print $summary_post; ?></textarea>
				<div id="summary" tabindex="4"></div>
			</section>
			<footer>
				<section class="right">
					<div class="btn-group">
						<button class="btn btn-default editor_btn s_fullscreen" tabIndex="5"><span class="glyphicon glyphicon-fullscreen"></span> Fullscreen</button>
						<button class="btn btn-default editor_btn s_preview" tabIndex="6"><span class="glyphicon glyphicon-check"></span> Local preview</button>
					</div>
				</section>
			</footer>
			<br />
			<section>
				<label>Content:</label>
				<textarea id="post_content" style="display: none;"><?php print $content_post; ?></textarea>
				<div id="content" tabindex="7"></div>
			</section>
			<footer>
				<section class="right">
					<div class="btn-group" style="float: left";>
						<button class="btn btn-danger editor_btn delete <?php print $del_btn; ?>" tabIndex="8"><span class="glyphicon glyphicon-remove"></span> Delete</button>
						<button class="btn <?php print $visible_btn_type; ?> editor_btn show_hide" tabIndex="8"><span class="glyphicon <?php print $visible_btn_icon; ?>"></span> <?php print $visible_btn_txt; ?></button>
					</div>
					<div class="btn-group">
						<button class="btn btn-default editor_btn c_fullscreen" tabIndex="9"><span class="glyphicon glyphicon-fullscreen"></span> Fullscreen</button>
						<button class="btn btn-default editor_btn c_preview" tabindex="10"><span class="glyphicon glyphicon-check"></span> Local preview</button>
						<a class="btn btn-default editor_btn" tabindex="11" href="./<?php print $_GET["m"]; ?>/<?php print $_GET["id"]; ?>/<?php print $_GET["q"]; ?>~preview" target="_blank">
							<span class="glyphicon glyphicon-new-window"></span> Page preview
						</a>
						<button class="btn btn-primary editor_btn save" tabIndex="12"><span class=" glyphicon glyphicon-floppy-disk"></span> Save</button>
					</div>
				</section>
			</footer>
		</article>
</aside>