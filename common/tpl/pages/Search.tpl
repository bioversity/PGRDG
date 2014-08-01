<?php
if(!isset($_GET["q"]) || trim($_GET["q"]) == "") {
        ?>
        <div id="se">
                <h1 unselectable="on">PGRDG</h1>
                <h2>Plant Genetic Resource Diversity Gateway</h2>
                <br />
                <!--form onsubmit="$.search_fulltext($('#search_form').val()); return false;"-->
                <form method="get" action="" onsubmit="if($('#search_form').val().length < 3) { return false; }">
                        <div class="input-group">
                                <input type="text" name="q" class="form-control" id="search_form" placeholder="Search..." />
                                <span class="input-group-btn">
                                        <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                </span>
                        </div>
                </form>
                <div id="statistics" class="help-block">
                        <big class="pull-left"><a href="<?php print $domain; ?>/Advanced_search<?php /* print (isset($_GET["q"]) && trim($_GET["q"]) !== "") ? "?q=" . $_GET["q"] : "";*/ ?>">Advanced search &rsaquo;</a></big>
                        <a href="javascript:void(0);" id="search_tips" class="text-muted pull-right"><span class="fa fa-keyboard-o"></span> Search tips</a>
                        <br />
                        <br />
                        <small id="statistics_loader"></small>
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
                        <form method="get" action="" onsubmit="if($('#search_form').val().length < 3) { return false; }">
                                <div class="input-group">
                                        <input type="text" name="q" class="form-control" id="search_form" placeholder="Search..." value="<?php print htmlentities(urldecode($_GET["q"])); ?>" />
                                        <span class="input-group-btn">
                                                <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                        </span>
                                </div>
                        </form>
                        <div id="statistics" class="help-block">
                                <big class="pull-left"><a href="<?php print $domain; ?>/Advanced_search<?php /* print (isset($_GET["q"]) && trim($_GET["q"]) !== "") ? "?q=" . $_GET["q"] : "";*/ ?>">Advanced search &rsaquo;</a></big>
                                <a href="javascript:void(0);" id="search_tips" class="text-muted pull-right"><span class="fa fa-keyboard-o"></span> Search tips</a>
                        </div>
                        <?php
                        require_once("common/tpl/search_panels/search_panel_summary.tpl");
                        require_once("common/tpl/search_panels/search_panel_result.tpl");
                        require_once("common/tpl/search_panels/search_panel_map.tpl");
                        ?>
                        <h1 id="se_loader" unselectable="on"><span class="fa fa-gear fa-spin"></span> Performing your research...</h1>
                </div>
        </div>
        <hr />
        <?php
}
?>
