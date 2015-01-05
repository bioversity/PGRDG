<header id="header">
        <div id="logo-group">

                <!-- PLACE YOUR LOGO HERE -->
                <span id="logo"> <img src="<?php print $domain; ?>/common/media/svg/bioversity-logo_small_horizontal.svg" alt="SmartAdmin"> </span>
                <!-- END LOGO PLACEHOLDER -->

                <!-- Note: The activity badge color changes when clicked and resets the number to 0
                Suggestion: You may want to set a flag when this happens to tick off all checked messages / notifications -->
                <span id="activity" class="activity-dropdown"> <i class="fa fa-user"></i> <b class="badge"> 21 </b> </span>

                <!-- AJAX-DROPDOWN : control this dropdown height, look and feel from the LESS variable file -->
                <div class="ajax-dropdown">

                        <!-- the ID links are fetched via AJAX to the ajax container "ajax-notifications" -->
                        <div class="btn-group btn-group-justified" data-toggle="buttons">
                                <label class="btn btn-default">
                                        <input type="radio" name="activity" id="ajax/notify/mail.html">
                                        Msgs (14) </label>
                                        <label class="btn btn-default">
                                                <input type="radio" name="activity" id="ajax/notify/notifications.html">
                                                notify (3) </label>
                                                <label class="btn btn-default">
                                                        <input type="radio" name="activity" id="ajax/notify/tasks.html">
                                                        Tasks (4) </label>
                                                </div>

                                                <!-- notification content -->
                                                <div class="ajax-notifications custom-scroll">

                                                        <div class="alert alert-transparent">
                                                                <h4>Click a button to show messages here</h4>
                                                                This blank page message helps protect your privacy, or you can show the first message here automatically.
                                                        </div>

                                                        <i class="fa fa-lock fa-4x fa-border"></i>

                                                </div>
                                                <!-- end notification content -->

                                                <!-- footer: refresh area -->
                                                <span> Last updated on: 12/12/2013 9:43AM
                                                        <button type="button" data-loading-text="<i class='fa fa-refresh fa-spin'></i> Loading..." class="btn btn-xs btn-default pull-right">
                                                                <i class="fa fa-refresh"></i>
                                                        </button> </span>
                                                        <!-- end footer -->

                                                </div>
                                                <!-- END AJAX-DROPDOWN -->
                                        </div>

                                        <!-- #PROJECTS: projects dropdown -->
                                        <div class="project-context hidden-xs">

                                                <span class="label">Projects:</span>
                                                <span class="project-selector dropdown-toggle" data-toggle="dropdown">Recent projects <i class="fa fa-angle-down"></i></span>

                                                <!-- Suggestion: populate this list with fetch and push technique -->
                                                <ul class="dropdown-menu">
                                                        <li>
                                                                <a href="javascript:void(0);">Online e-merchant management system - attaching integration with the iOS</a>
                                                        </li>
                                                        <li>
                                                                <a href="javascript:void(0);">Notes on pipeline upgradee</a>
                                                        </li>
                                                        <li>
                                                                <a href="javascript:void(0);">Assesment Report for merchant account</a>
                                                        </li>
                                                        <li class="divider"></li>
                                                        <li>
                                                                <a href="javascript:void(0);"><i class="fa fa-power-off"></i> Clear</a>
                                                        </li>
                                                </ul>
                                                <!-- end dropdown-menu-->

                                        </div>
                                        <!-- end projects dropdown -->

                                        <!-- #TOGGLE LAYOUT BUTTONS -->
                                        <!-- pulled right: nav area -->
                                        <div class="pull-right">

                                                <!-- collapse menu button -->
                                                <!-- <div id="hide-menu" class="btn-header pull-right"> -->
                                                        <!-- <span> <a href="javascript:void(0);" data-action="toggleMenu" title="Collapse Menu"><i class="fa fa-reorder"></i></a> </span> -->
                                                <!-- </div> -->
                                                <!-- end collapse menu -->

                                                <!-- #MOBILE -->
                                                <!-- Top menu profile link : this shows only when top menu is active -->
                                                <ul id="mobile-profile-img" class="header-dropdown-list hidden-xs padding-5">
                                                        <li class="">
                                                                <a href="#" class="dropdown-toggle no-margin userdropdown" data-toggle="dropdown">
                                                                        <img src="<?php print $domain; ?>/common/media/img/admin/avatars/sunny.png" alt="John Doe" class="online" />
                                                                </a>
                                                                <ul class="dropdown-menu pull-right">
                                                                        <li>
                                                                                <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0"><i class="fa fa-cog"></i> Setting</a>
                                                                        </li>
                                                                        <li class="divider"></li>
                                                                        <li>
                                                                                <a href="#ajax/profile.html" class="padding-10 padding-top-0 padding-bottom-0"> <i class="fa fa-user"></i> <u>P</u>rofile</a>
                                                                        </li>
                                                                        <li class="divider"></li>
                                                                        <li>
                                                                                <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0" data-action="toggleShortcut"><i class="fa fa-arrow-down"></i> <u>S</u>hortcut</a>
                                                                        </li>
                                                                        <li class="divider"></li>
                                                                        <li>
                                                                                <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0" data-action="launchFullscreen"><i class="fa fa-arrows-alt"></i> Full <u>S</u>creen</a>
                                                                        </li>
                                                                        <li class="divider"></li>
                                                                        <li>
                                                                                <a href="/Signout" class="padding-10 padding-top-5 padding-bottom-5" data-action="userLogout"><i class="fa fa-sign-out fa-lg"></i> <strong><u>L</u>ogout</strong></a>
                                                                        </li>
                                                                </ul>
                                                        </li>
                                                </ul>

                                                <!-- logout button -->
                                                <div id="logout" class="btn-header transparent pull-right">
                                                        <span> <a href="/Signout" title="Sign Out" data-action="userLogout" data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i class="fa fa-sign-out"></i></a> </span>
                                                </div>
                                                <!-- end logout button -->

                                                <!-- search mobile button (this is hidden till mobile view port) -->
                                                <div id="search-mobile" class="btn-header transparent pull-right">
                                                        <span> <a href="javascript:void(0)" title="Search"><i class="fa fa-search"></i></a> </span>
                                                </div>
                                                <!-- end search mobile button -->

                                                <!-- #SEARCH -->
                                                <!-- input: search field -->
                                                <form action="#ajax/search.html" class="header-search pull-right">
                                                        <input id="search-fld" type="text" name="param" placeholder="Find reports and more">
                                                        <button type="submit">
                                                                <i class="fa fa-search"></i>
                                                        </button>
                                                        <a href="javascript:void(0);" id="cancel-search-js" title="Cancel Search"><i class="fa fa-times"></i></a>
                                                </form>
                                                <!-- end input: search field -->

                                                <!-- fullscreen button -->
                                                <div id="fullscreen" class="btn-header transparent pull-right">
                                                        <span> <a href="javascript:void(0);" data-action="launchFullscreen" title="Full Screen"><i class="fa fa-arrows-alt"></i></a> </span>
                                                </div>
                                                <!-- end fullscreen button -->

                                                <!-- #Voice Command: Start Speech -->
                                                <!-- NOTE: Voice command button will only show in browsers that support it. Currently it is hidden under mobile browsers.
                                                You can take off the "hidden-sm" and "hidden-xs" class to display inside mobile browser-->
                                                <div id="speech-btn" class="btn-header transparent pull-right hidden-sm hidden-xs">
                                                        <div>
                                                                <a href="javascript:void(0)" title="Voice Command" data-action="voiceCommand"><i class="fa fa-microphone"></i></a>
                                                                <div class="popover bottom"><div class="arrow"></div>
                                                                <div class="popover-content">
                                                                        <h4 class="vc-title">Voice command activated <br><small>Please speak clearly into the mic</small></h4>
                                                                        <h4 class="vc-title-error text-center">
                                                                                <i class="fa fa-microphone-slash"></i> Voice command failed
                                                                                <br><small class="txt-color-red">Must <strong>"Allow"</strong> Microphone</small>
                                                                                <br><small class="txt-color-red">Must have <strong>Internet Connection</strong></small>
                                                                        </h4>
                                                                        <a href="javascript:void(0);" class="btn btn-success" onclick="commands.help()">See Commands</a>
                                                                        <a href="javascript:void(0);" class="btn bg-color-purple txt-color-white" onclick="$('#speech-btn .popover').fadeOut(50);">Close Popup</a>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                        <!-- end voice command -->

                                        <!-- multiple lang dropdown : find all flags in the flags page -->
                                        <ul class="header-dropdown-list hidden-xs">
                                                <li>
                                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"> <img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-gb" alt="England"> <span> EN</span> <i class="fa fa-angle-down"></i> </a>
                                                        <ul class="dropdown-menu pull-right">
                                                                <li class="active">
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-gb" alt="England"> English (EN)</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-fr" alt="France"> Français</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-es" alt="Spanish"> Español</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-de" alt="German"> Deutsch</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-jp" alt="Japan"> 日本語</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-cn" alt="China"> 中文</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-it" alt="Italy"> Italiano</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-pt" alt="Portugal"> Portugal</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-ru" alt="Russia"> Русский язык</a>
                                                                </li>
                                                                <li>
                                                                        <a href="javascript:void(0);"><img src="<?php print $domain; ?>/common/media/img/admin/blank.gif" class="flag flag-kr" alt="Korea"> 한국어</a>
                                                                </li>

                                                        </ul>
                                                </li>
                                        </ul>
                                        <!-- end multiple lang -->

                                </div>
                                <!-- end pulled right: nav area -->

                        </header>
                        <!-- END HEADER -->

                        <!-- #NAVIGATION -->
                        <!-- Left panel : Navigation area -->
                        <!-- Note: This width of the aside area can be adjusted through LESS/SASS variables -->
                        <aside id="left-panel">

                                <!-- User info -->
                                <div class="login-info">
                                        <span> <!-- User image size is adjusted inside CSS, it should stay as is -->
                                                <a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut" style="width: 100%;">
                                                        <img src="<?php print $domain; ?>/common/media/img/admin/avatars/male.png" alt="me" class="online" />
                                                        <span>
                                                                <?php print $user->name . " " . $user->last_name; ?>
                                                        </span>
                                                        <i class="fa fa-angle-down pull-right" style="margin-top: 7.5px;"></i>
                                                </a>
                                        </span>
                                </div>
                                <!-- end user info -->

                                <!-- NAVIGATION : This navigation is also responsive

                                To make this navigation dynamic please make sure to link the node
                                (the reference to the nav > ul) after page load. Or the navigation
                                will not initialize.
                        -->
                        <nav>
                                <!--
                                NOTE: Notice the gaps after each icon usage <i></i>..
                                Please note that these links work a bit different than
                                traditional href="" links. See documentation for details.
                        -->

                        <?php
                        print str_replace(array("btn btn-link", "fa fa-"), array("", "fa fa-lg fa-fw fa-"), $site_config->menu("top", ""));
                        ?>

                </div>
                <!-- END DISPLAY USERS -->
        </li>
</ul>
</li>
</ul>
</nav>


<span class="minifyme" data-action="minifyMenu"> <i class="fa fa-arrow-circle-left hit"></i> </span>

</aside>
<!-- END NAVIGATION -->

<!-- #MAIN PANEL -->
<div id="main" role="main">

        <!-- RIBBON -->
        <div id="ribbon">

                <span class="ribbon-button-alignment">
                        <span id="refresh" class="btn btn-ribbon" data-action="resetWidgets" data-title="refresh" rel="tooltip" data-placement="bottom" data-original-title="<i class='text-warning fa fa-warning'></i> Warning! This will reset all your widget settings." data-html="true" data-reset-msg="Would you like to RESET all your saved widgets and clear LocalStorage?"><i class="fa fa-refresh"></i></span>
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
<div id="content">

</div>

<!-- END #MAIN CONTENT -->

</div>
<!-- END #MAIN PANEL -->

<!-- #PAGE FOOTER -->
<div class="page-footer">
        <div class="row">
                <div class="col-xs-12 col-sm-6">
                        <span class="txt-color-white">Plant Genetic Resource Diversity Gateway</span>
                </div>

                <div class="col-xs-6 col-sm-6 text-right hidden-xs">
                        <div class="txt-color-white inline-block">
                                <i class="txt-color-blueLight hidden-mobile">Last account activity <i class="fa fa-clock-o"></i> <strong>52 mins ago &nbsp;</strong> </i>
                                <div class="btn-group dropup">
                                        <button class="btn btn-xs dropdown-toggle bg-color-blue txt-color-white" data-toggle="dropdown">
                                                <i class="fa fa-link"></i> <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu pull-right text-left">
                                                <li>
                                                        <div class="padding-5">
                                                                <p class="txt-color-darken font-sm no-margin">Download Progress</p>
                                                                <div class="progress progress-micro no-margin">
                                                                        <div class="progress-bar progress-bar-success" style="width: 50%;"></div>
                                                                </div>
                                                        </div>
                                                </li>
                                                <li class="divider"></li>
                                                <li>
                                                        <div class="padding-5">
                                                                <p class="txt-color-darken font-sm no-margin">Server Load</p>
                                                                <div class="progress progress-micro no-margin">
                                                                        <div class="progress-bar progress-bar-success" style="width: 20%;"></div>
                                                                </div>
                                                        </div>
                                                </li>
                                                <li class="divider"></li>
                                                <li >
                                                        <div class="padding-5">
                                                                <p class="txt-color-darken font-sm no-margin">Memory Load <span class="text-danger">*critical*</span></p>
                                                                <div class="progress progress-micro no-margin">
                                                                        <div class="progress-bar progress-bar-danger" style="width: 70%;"></div>
                                                                </div>
                                                        </div>
                                                </li>
                                                <li class="divider"></li>
                                                <li>
                                                        <div class="padding-5">
                                                                <button class="btn btn-block btn-default">refresh</button>
                                                        </div>
                                                </li>
                                        </ul>
                                </div>
                                <!-- end btn-group-->
                        </div>
                        <!-- end div-->
                </div>
                <!-- end col -->
        </div>
        <!-- end row -->
</div>
<!-- END FOOTER -->

<!-- #SHORTCUT AREA : With large tiles (activated via clicking user name tag)
Note: These tiles are completely responsive, you can add as many as you like -->
<div id="shortcut">
        <ul>
                <li>
                        <a href="#ajax/inbox.html" class="jarvismetro-tile big-cubes bg-color-blue"> <span class="iconbox"> <i class="fa fa-envelope fa-4x"></i> <span>Mail <span class="label pull-right bg-color-darken">14</span></span> </span> </a>
                </li>
                <li>
                        <a href="#ajax/calendar.html" class="jarvismetro-tile big-cubes bg-color-orangeDark"> <span class="iconbox"> <i class="fa fa-calendar fa-4x"></i> <span>Calendar</span> </span> </a>
                </li>
                <li>
                        <a href="#ajax/gmap-xml.html" class="jarvismetro-tile big-cubes bg-color-purple"> <span class="iconbox"> <i class="fa fa-map-marker fa-4x"></i> <span>Maps</span> </span> </a>
                </li>
                <li>
                        <a href="#ajax/invoice.html" class="jarvismetro-tile big-cubes bg-color-blueDark"> <span class="iconbox"> <i class="fa fa-book fa-4x"></i> <span>Invoice <span class="label pull-right bg-color-darken">99</span></span> </span> </a>
                </li>
                <li>
                        <a href="#ajax/gallery.html" class="jarvismetro-tile big-cubes bg-color-greenLight"> <span class="iconbox"> <i class="fa fa-picture-o fa-4x"></i> <span>Gallery </span> </span> </a>
                </li>
                <li>
                        <a href="#ajax/profile.html" class="jarvismetro-tile big-cubes selected bg-color-pinkDark"> <span class="iconbox"> <i class="fa fa-user fa-4x"></i> <span>My Profile </span> </span> </a>
                </li>
        </ul>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script>
if (!window.jQuery) {
        document.write('<script src="<?php print $domain; ?>/common/js/admin/libs/jquery-2.1.1.min.js"><\/script>');
}
</script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script>
if (!window.jQuery.ui) {
        document.write('<script src="<?php print $domain; ?>/common/js/admin/libs/jquery-ui-1.10.3.min.js"><\/script>');
}
</script>

<!-- IMPORTANT: APP CONFIG -->
<script src="<?php print $domain; ?>/common/js/admin/app.config.js"></script>

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
<script src="<?php print $domain; ?>/common/js/admin/plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script>

<!-- BOOTSTRAP JS -->
<script src="<?php print $domain; ?>/common/js/admin/bootstrap/bootstrap.min.js"></script>

<!-- CUSTOM NOTIFICATION -->
<script src="<?php print $domain; ?>/common/js/admin/notification/SmartNotification.min.js"></script>

<!-- JARVIS WIDGETS -->
<script src="<?php print $domain; ?>/common/js/admin/smartwidgets/jarvis.widget.min.js"></script>

<!-- EASY PIE CHARTS -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js"></script>

<!-- SPARKLINES -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/sparkline/jquery.sparkline.min.js"></script>

<!-- JQUERY VALIDATE -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/jquery-validate/jquery.validate.min.js"></script>

<!-- JQUERY MASKED INPUT -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/masked-input/jquery.maskedinput.min.js"></script>

<!-- JQUERY SELECT2 INPUT -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/select2/select2.min.js"></script>

<!-- JQUERY UI + Bootstrap Slider -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/bootstrap-slider/bootstrap-slider.min.js"></script>

<!-- browser msie issue fix -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/msie-fix/jquery.mb.browser.min.js"></script>

<!-- FastClick: For mobile devices: you can disable this in app.js -->
<script src="<?php print $domain; ?>/common/js/admin/plugin/fastclick/fastclick.min.js"></script>

<!--[if IE 8]>
<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
<![endif]-->

<!-- Demo purpose only -->
<!-- // <script src="<?php print $domain; ?>/common/js/admin/demo.min.js"></script> -->

<!-- MAIN APP JS FILE -->
<!-- // <script src="<?php print $domain; ?>/common/js/admin/app.min.js"></script> -->

<!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
<!-- Voice command : plugin -->
<!-- // <script src="<?php print $domain; ?>/common/js/admin/speech/voicecommand.min.js"></script> -->

<!-- SmartChat UI : plugin -->
<script src="<?php print $domain; ?>/common/js/admin/smart-chat-ui/smart.chat.ui.min.js"></script>
<script src="<?php print $domain; ?>/common/js/admin/smart-chat-ui/smart.chat.manager.min.js"></script>
