<div id="summary" class="panel_content">
        <div id="summary-head" class="left panel_content-head container-fluid">
                <div class="panel-group" id="group_by_accordion">
                        <div id="collapsed_group_form" class="panel-collapse collapse">
                                <h3>Group results</h3>
                                <div class="row">
                                        <div class="col-lg-6 col-md-4">
                                                <div class="row">
                                                        <h4 id="filter_group_title" class="col-lg-2 text-muted">Insert a filter</h4>
                                                        <div class="col-lg-10">
                                                                <div class="panel">
                                                                        <div class="autocomplete"></div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                        <div class="col-lg-6 col-md-8">
                                                <div class="row" id="filter_stage_panel" style="display: none;">
                                                        <h4 class="col-lg-2 text-muted">Selected items</h4>
                                                        <div class="col-lg-10">
                                                                <input type="hidden" id="selected_filters" value="" />
                                                                <div class="well well-sm list-group" id="filter_stage"></div>
                                                                <div class="tabbable tabs-below">
                                                                        <ul class="nav nav-tabs" role="tablist" id="filter_stage_controls">
                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('top');" id="move_top_btn" class="btn disabled" title="Move to top"><span class="fa fa-arrow-up text-info"></span><span class="visible-md visible-lg text-muted">Move to top</span></a></li>
                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('up');" id="move_up_btn" class="btn disabled" title="Move up"><span class="fa fa-chevron-up text-info"></span><span class="visible-md visible-lg text-muted">Move up</span></a></li>
                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('down');" id="move_down_btn" class="btn disabled" title="Move down"><span class="fa fa-chevron-down text-info"></span><span class="visible-md visible-lg text-muted">Move down</span></a></li>
                                                                                <li><a href="javascript: void(0);" onclick="$(this).move_to('bottom');" id="move_bottom_btn" class="btn disabled" title="Move to bottom"><span class="fa fa-arrow-down text-info"></span><span class="visible-md visible-lg text-muted">Move to bottom</span></a></li>
                                                                                <li class="pull-right"><a href="javascript: void(0);" onclick="$('#filter_stage a.active').remove_filter()" class="btn disabled" title="Remove"><span class="fa fa-times text-danger"></span><span class="visible-md visible-lg text-muted">Remove</span></a></li>
                                                                                <li class="pull-right"><a href="javascript: void(0);" onclick="$('#filter_stage a.active').edit_filter()" id="edit_btn" class="btn disabled" title="Edit"><span class="fa fa-edit"></span><span class="visible-md visible-lg text-muted">Edit</span></a></li>
                                                                        </ul>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                                <div class="btn-group pull-right">
                                        <a href="javascript: void(0);" onclick="$.reset_ordering();" id="summary_order_cancel_btn" class="btn btn-default-grey disabled">Cancel</a>
                                        <a href="javascript: void(0);" onclick="$.exec_ordering();" id="summary_order_reorder_btn" class="btn btn-success disabled">Reorder <span class="fa fa-indent"></span></a>
                                </div>
                        </div>
                </div>
                <h1 class="content-title clearfix">
                        <span></span>
                </h1>
        </div>
        <div id="summary-body" class="left panel_content-body container-fluid">
                <div class="content-body"></div>
        </div>
</div>
