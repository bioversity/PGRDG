<div id="contents">
	<?php
	if($page == "Search" || $page == "Map") {
		require_once("common/tpl/pages/Search.tpl");
	} else {
		?>
		<div id="content" class="panel-content">
			<?php
			if(is_home()) {
				print '<h1>Plant Genetic Resources Diversity Gateway<small class="help-block">for the conservation and use of crop wild relative and landrace traits</small></h1>';

				require_once("common/tpl/pages/home.tpl");
				print optimize(Markdown(file_get_contents("common/md/" . str_replace("_", " ", (($page == "") ? "home" : $page)) . ".md")));
			} else if ($page == "Conservation_Strategies") {
				require_once("common/tpl/pages/Conservation Strategies.tpl");
			} else {
				if($page == "Links") {
					$page_title = 'Links to other information systems';
				} else {
					if($page !== "Feedback" && $page !== "Blog" && $page !== "Se") {
						$page_title = str_replace("_", " ", (($page == "") ? "home" : $page));
					}
				}
				print "<h1 class=\"" . $page_class . "\">" . $page_title . "</h1>";
				switch($page) {
					case "Blog":
						require_once("common/tpl/pages/Blog.tpl");
						break;
					case "Graph":
						require_once("common/tpl/pages/Graph.tpl");
						break;
					case "Feedback":
						require_once("common/tpl/pages/Feedback.tpl");
						break;
					case "Advanced_search":
						//header("Location: " . $domain . "/Search");
						break;
					// ---------------
					// User page
					case "Profile":
						require_once("common/tpl/admin_pages/Profile.tpl");
						break;
					// ---------------
					// Metadata management
					case "Metadata":
						break;
					// Menu management
					case "Menu":
						break;
					// Menu management
					case "Map":
						break;
					// Menu management
					case "Graphs":
						break;
					// Menu management
					case "Users":
						break;

					default:
						print optimize(Markdown(file_get_contents("common/md/" . str_replace("_", " ", (($page == "") ? "home" : $page)) . ".md")));
						break;
				}
			}

			?>
		</div>
		<hr />
		<?php
	}
	if($page !== "Feedback") {
		include("common/tpl/footer.tpl");
	}
	?>
</div>
