<div id="summary" class="panel_content">
        <div id="summary-head" class="left panel_content-head container-fluid">
                <h1 class="content-title clearfix">
                        <span></span>
                        <div class="pull-right">
                                <a data-toggle="collapse" data-parent="#group_by_accordion" href="#collapsed_group_form" class="btn btn-default-white">
                                        <span class="fa fa-indent text-muted"></span>Group by...
                                </a>
                        </div>
                </h1>
                <div class="panel-group" id="group_by_accordion">
                        <div id="collapsed_group_form" class="panel-collapse collapse">
                                <div class="row" id="filter_stage_panel" style="display: none;">
                                        <input type="text" id="selected_filters" value="" />
                                        <h4 class="col-lg-1 text-muted">Selected items</h4>
                                        <div class="col-lg-4">
                                                <div class="well well-sm" id="filter_stage"></div>
                                                <div class="tabbable tabs-below">
                                                        <ul class="nav nav-tabs" role="tablist" id="filter_stage_controls">
                                                                <li><a href="javascript: void(0);" class="btn disabled" title="Move to top"><span class="fa fa-arrow-up text-info"></span><span class="visible-md visible-lg text-muted">Move to top</span></a></li>
                                                                <li><a href="javascript: void(0);" class="btn disabled" title="Move up"><span class="fa fa-chevron-up text-info"></span><span class="visible-md visible-lg text-muted">Move up</span></a></li>
                                                                <li><a href="javascript: void(0);" class="btn disabled" title="Move down"><span class="fa fa-chevron-down text-info"></span><span class="visible-md visible-lg text-muted">Move down</span></a></li>
                                                                <li><a href="javascript: void(0);" class="btn disabled" title="Move to bottom"><span class="fa fa-arrow-down text-info"></span><span class="visible-md visible-lg text-muted">Move to bottom</span></a></li>
                                                                <li class="pull-right"><a href="javascript: void(0);" class="btn disabled" title="Remove"><span class="fa fa-times text-danger"></span><span class="visible-md visible-lg text-muted">Remove</span></a></li>
                                                        </ul>
                                                </div>
                                        </div>
                                </div>
                                <br />
                                <div class="well well-sm">
                                        <div class="row">
                                                <h4 id="filter_group_title" class="col-lg-1 text-muted">Group by...</h4>
                                                <div class="col-lg-4">
                                                        <div class="panel">
                                                                <div class="autocomplete"></div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        <div id="summary-body" class="left panel_content-body container-fluid">
                <div class="content-body"></div>
        </div>
</div>
