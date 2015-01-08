<!-- #MAIN PANEL -->
<div id="main" role="main" class="admin">
        <!-- RIBBON -->
        <div id="ribbon">
                <span class="ribbon-button-alignment pull-right">
                        <span id="refresh" class="btn btn-ribbon" data-action="resetWidgets" data-title="refresh" rel="tooltip" data-placement="bottom" data-original-title="<i class='text-warning fa fa-warning'></i> Warning! This will reset all your non-logged search history." data-html="true" data-reset-msg="Would you like to RESET all your non-logged saved history and clear LocalStorage?">
                                <i class="fa fa-trash-o"></i>
                        </span>
                </span>

                <!-- breadcrumb -->
                <ol class="breadcrumb">
                        <!-- This is auto generated -->
                </ol>
                <!-- end breadcrumb -->

                <!-- You can also add more buttons to the
                ribbon for further usability

                Example below:

                <span class="ribbon-button-alignment pull-right" style="margin-right:25px">
                <a href="#" id="search" class="btn btn-ribbon hidden-xs" data-title="search"><i class="fa fa-grid"></i> Change Grid</a>
                <span id="add" class="btn btn-ribbon hidden-xs" data-title="add"><i class="fa fa-plus"></i> Add</span>
                <button id="search" class="btn btn-ribbon" data-title="search"><i class="fa fa-search"></i> <span class="hidden-mobile">Search</span></button>
                </span> -->

        </div>
        <!-- END RIBBON -->

        <!-- #MAIN CONTENT -->
        <?php
        require_once("common/tpl/content.tpl")
        ?>
        <!-- END #MAIN CONTENT -->
</div>
<!-- END #MAIN PANEL -->
