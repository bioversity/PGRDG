<div id="contents">
	<?php
	if(strtolower($page->current) == "search" || strtolower($page->current) == "map") {
		require_once("common/tpl/pages/Search.tpl");
	} else {
		?>
		<div id="content" class="panel-content">
			<?php
			if($page->is_main_page) {
				if(!LOGGED) {
					require_once("common/tpl/pages/home.tpl");
				} else {
					require_once("common/tpl/admin/dashboard.tpl");
				}
			} else if ($page->current == "Conservation_Strategies") {
				require_once("common/tpl/pages/Conservation Strategies.tpl");
			} else {
				if($page->current == "Links") {
					$page->current_title = 'Links to other information systems';
				} else {
					if($page->current !== "Feedback" && $page->current !== "Blog" && $page->current !== "Se") {
						$page->current_title = str_replace("_", " ", (($page->current == "") ? "home" : $page->current));
					}
				}
				if($page->current !== "Profile") {
					print "<h1 class=\"" . $page->title_class . "\">" . $page->title . "</h1>";
				}

				$md_page = str_replace("_", " ", (($page->current == "") ? "home" : $page->current)) . ".md";
				if(file_exists("common/md/" . $md_page)) {
					print optimize(Markdown(file_get_contents("common/md/" . $md_page)));
				}

				if(strlen($page->template) && trim($page->template) !== "") {
					require_once($page->template);
				}
			}
			?>
		</div>
		<?php
	}
	if(!LOGGED && $page->current !== "Feedback") {
		include("common/tpl/footer.tpl");
	}
	?>
</div>
