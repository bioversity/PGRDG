<?php
if(!isset($_GET["q"]) || trim($_GET["q"]) == "") {
        ?>
        <div id="se">
                <h1 unselectable="on">PGRDG</h1>
                <h2>Plant Genetic Resource Diversity Gateway</h2>
                <br />
                <!--form onsubmit="$.search_fulltext($('#search_form').val()); return false;"-->
                <form method="get" action="">
                        <div class="input-group">
                                <input type="text" name="q" class="form-control" id="search_form" placeholder="Search..." />
                                <span class="input-group-btn">
                                        <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                </span>
                        </div>
                </form>
                <div id="statistics" class="help-block">
                        <big><a href="<?php print $domain; ?>/Advanced_search<?php print (isset($_GET["q"]) && trim($_GET["q"]) !== "") ? "?q=" . $_GET["q"] : ""; ?>">Advanced search</a></big>
                        <br />
                        <br />
                        <small class="loader">
                                <span class="fa fa-refresh fa-spin"></span> Retriving statistics data...
                        </small>
                </div>
        </div>
        <?php
} else {
        ?>
        <div id="se_p">
                <div id="breadcrumb">
                        <ol class="breadcrumb">
                                <li id="goto_summary_btn"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Summary</span></li>
                                <li id="goto_results_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Results</span></li>
                                <li id="goto_map_btn" style="display: none;"><span class="text-muted ionicons ion-map"></span> <span class="txt">Map<span></li>
                        </ol>
                </div>
                <div id="se_results">
                        <form method="get" action="">
                                <div class="input-group">
                                        <input type="text" name="q" class="form-control" id="search_form" placeholder="Search..." value="<?php print $_GET["q"]; ?>" />
                                        <span class="input-group-btn">
                                                <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                        </span>
                                </div>
                        </form>
                        <div id="statistics" class="help-block">
                                <big><a href="<?php print $domain; ?>/Advanced_search?q=<?php print $_GET["q"]; ?>">Advanced search</a></big>
                        </div>
                        <?php
                        require_once("common/tpl/search_panels/search_panel_summary.tpl");
                        require_once("common/tpl/search_panels/search_panel_result.tpl");
                        require_once("common/tpl/search_panels/search_panel_map.tpl");
                        ?>
                </div>
        </div>
        <hr />
        <?php
}
?>
