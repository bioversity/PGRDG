<?php
if($page == "Map" || ($page == "Search" && isset($_GET["q"]) && trim($_GET["q"]) !== "")) {
        ?>
        <div id="breadcrumb" style="left: 0;">
                <ol class="breadcrumb">
                        <li id="goto_summary_btn"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Summary</span></li>
                        <li id="goto_results_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Results</span></li>
                        <li id="goto_stats_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Statistics</span></li>
                        <li id="goto_map_btn" style="display: none;"><span class="text-muted ionicons ion-map"></span> <span class="txt">Map<span></li>
                </ol>
        </div>
        <div id="se_p">
                <div id="se_results">
                        <form method="get" action="" onsubmit="if($('#search_form').val().length < 3) { return false; }">
                                <div class="input-group">
                                        <input type="text" name="q" class="form-control" id="search_form" placeholder="<?php print $i18n[$lang]["interface"]["btns"]["search"]; ?>..." value="<?php print htmlentities(urldecode($_GET["q"])); ?>" />
                                        <div class="input-group-btn">
                                                <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                                <a data-toggle="collapse" id="group_by_btn" onclick="$.manage_url('Summary');" data-parent="#group_by_accordion" href="#collapsed_group_form" class="btn btn-default-grey disabled">
                                                        <span class="fa fa-sliders text-muted"></span><?php print $i18n[$lang]["interface"]["btns"]["group_by"]; ?>
                                                </a>
                                        </div>
                                </div>
                                <div id="statistics" class="help-block">
                                        <big class="pull-left"><a href="<?php print $domain; ?>/Advanced_search<?php /* print (isset($_GET["q"]) && trim($_GET["q"]) !== "") ? "?q=" . $_GET["q"] : "";*/ ?>"><?php print $i18n[$lang]["interface"]["btns"]["advanced_search"]; ?>&nbsp;<small><span class="fa fa-angle-right text-muted"></span></small></a></big>
                                        <a href="javascript:void(0);" id="search_tips" class="text-muted pull-right"><span class="fa fa-keyboard-o"></span><?php print $i18n[$lang]["interface"]["btns"]["search_tips"]; ?></a>
                                </div>
                        </form>
                        <?php
                        require_once("common/tpl/search_panels/search_panel_summary.tpl");
                        require_once("common/tpl/search_panels/search_panel_result.tpl");
                        require_once("common/tpl/search_panels/search_panel_statistics.tpl");
                        require_once("common/tpl/search_panels/search_panel_map.tpl");
                        ?>
                        <h1 id="se_loader" unselectable="on"><span class="fa fa-gear fa-spin"></span> <?php print $i18n[$lang]["messages"]["search"]["performing_search"]; ?></h1>
                </div>
        </div>
        <hr />
        <?php
} else {
        ?>
        <div id="se">
                <h1 unselectable="on">PGRDG</h1>
                <h2>Plant Genetic Resource Diversity Gateway</h2>
                <br />
                <!--form onsubmit="$.search_fulltext($('#search_form').val()); return false;"-->
                <form method="get" action="" onsubmit="if($('#search_form').val().length < 3) { return false; }">
                        <div class="input-group">
                                <input type="text" name="q" class="form-control" id="search_form" placeholder="<?php print $i18n[$lang]["interface"]["btns"]["search"]; ?>..." />
                                <span class="input-group-btn">
                                        <button type="submit" class="btn btn-default-white"><span class="fa fa-search"></span></button>
                                </span>
                        </div>
                </form>
                <div id="statistics" class="help-block">
                        <big class="pull-left"><a href="<?php print $domain; ?>/Advanced_search<?php /* print (isset($_GET["q"]) && trim($_GET["q"]) !== "") ? "?q=" . $_GET["q"] : "";*/ ?>"><?php print $i18n[$lang]["interface"]["btns"]["advanced_search"]; ?>&nbsp;<small><span class="fa fa-angle-right text-muted"></span></small></a></big>
                        <a href="javascript:void(0);" id="search_tips" class="text-muted pull-right"><span class="fa fa-keyboard-o"></span><?php print $i18n[$lang]["interface"]["btns"]["search_tips"]; ?></a>
                        <br />
                        <br />
                        <span class="help-block">The figures below will be changing, since we are currently loading data.</p>
                        <small id="statistics_loader"></small>
                </div>
        </div>
        <?php
}
?>
