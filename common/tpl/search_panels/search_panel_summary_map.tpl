<div id="breadcrumb" style="left: 0;">
        <ol class="breadcrumb">
                <li id="goto_summary_btn"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Summary</span></li>
                <li id="goto_results_btn" style="display: none;"><span class="text-muted fa fa-list-alt"></span> <span class="txt">Results</span></li>
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
                <div id="summary" class="panel_content">
                        <div id="summary-head" class="left panel_content-head container-fluid">
                                <div id="group_by_accordion">
                                        <div id="collapsed_group_form" class="panel-collapse collapse">
                                                <h3><?php print $i18n[$lang]["messages"]["search"]["group_results"]; ?></h3>
                                                <div class="row">
                                                        <div class="col-lg-5 col-md-12">
                                                                <div class="row">
                                                                        <h4 id="filter_group_title" class="col-lg-2 text-muted"><?php print $i18n[$lang]["messages"]["search"]["insert_filter"]; ?></h4>
                                                                        <div class="col-lg-10">
                                                                                <div class="panel">
                                                                                        <div id="filter_search_summary" class="autocomplete"></div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div class="col-lg-7 col-md-12">
                                                                <div class="row" id="filter_stage_panel" style="display: none;">
                                                                        <h4 class="col-lg-2 text-muted"><?php print $i18n[$lang]["messages"]["search"]["group_hierachy"]; ?></h4>
                                                                        <div class="col-lg-10">
                                                                                <input type="hidden" id="selected_filters" value="" />
                                                                                <div class="well well-sm list-group" id="filter_stage"></div>
                                                                                <div class="tabbable tabs-below">
                                                                                        <ul class="nav nav-tabs" role="tablist" id="filter_stage_controls">
                                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('top');" id="move_top_btn" class="btn disabled" title="Move to top"><span class="fa fa-arrow-up text-info"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["move_top"]; ?></span></a></li>
                                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('up');" id="move_up_btn" class="btn disabled" title="Move up"><span class="fa fa-chevron-up text-info"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["move_up"]; ?></span></a></li>
                                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('down');" id="move_down_btn" class="btn disabled" title="Move down"><span class="fa fa-chevron-down text-info"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["move_down"]; ?></span></a></li>
                                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('bottom');" id="move_bottom_btn" class="btn disabled" title="Move to bottom"><span class="fa fa-arrow-down text-info"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["move_bottom"]; ?></span></a></li>
                                                                                                <li class="pull-right"><a href="javascript: void(0);" onclick="$('#filter_stage a.active').remove_filter()" class="btn disabled" title="Remove"><span class="fa fa-times text-danger"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["remove"]; ?></span></a></li>
                                                                                                <li class="pull-right"><a href="javascript: void(0);" onclick="$('#filter_stage a.active').edit_filter()" id="edit_btn" class="btn disabled" title="Edit"><span class="fa fa-edit"></span><span class="visible-md visible-lg text-muted"><?php print $i18n[$lang]["interface"]["btns"]["edit"]; ?></span></a></li>
                                                                                        </ul>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div class="btn-group pull-right">
                                                        <a href="javascript: void(0);" onclick="$.reset_ordering();" id="summary_order_cancel_btn" class="btn btn-default-grey disabled"><span class="ionicons ion-trash-b"></span><?php print $i18n[$lang]["interface"]["btns"]["remove_all"]; ?></a>
                                                        <a href="javascript: void(0);" onclick="$.exec_ordering();" id="summary_order_reorder_btn" class="btn btn-orange disabled"><?php print $i18n[$lang]["interface"]["btns"]["group"]; ?> <span class="fa fa-indent"></span></a>
                                                </div>
                                        </div>
                                </div>
                                <h1 class="content-title clearfix">
                                        <span></span>
                                </h1>
                        </div>
                        <!-- <iframe id="chart" src="./common/tpl/pages/graph_temp_data/flare.html"></iframe> -->
                        <!-- <div id="chart" class="left panel_content-body container-fluid"></div> -->
                        <div id="summary-body" class="left panel_content-body container-fluid">
                                <div class="content-body"></div>
                        </div>
                </div>
        </div>
        <h1 id="se_loader" unselectable="on"><span class="fa fa-gear fa-spin"></span> <?php print $i18n[$lang]["messages"]["search"]["performing_search"]; ?></h1>
</div>
<hr />
<?php
// require_once("common/tpl/search_panels/search_panel_statistics.tpl");
require_once("common/tpl/search_panels/search_panel_result.tpl");
?>
