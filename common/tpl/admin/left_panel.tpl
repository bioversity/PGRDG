<!-- #NAVIGATION -->
<!-- Left panel : Navigation area -->
<!-- Note: This width of the aside area can be adjusted through LESS/SASS variables -->
<aside id="left-panel">
        <!-- User info -->
        <div class="login-info">
                <span> <!-- User image size is adjusted inside CSS, it should stay as is -->
                        <a href="/Profile#<?php print $user[kTAG_IDENTIFIER][kAPI_PARAM_RESPONSE_FRMT_DISP]; ?>" title="Manage profile" style="width: 100%;">
                                <?php
                                if(!isset($user[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_NAME])) {
                                        $path = "/common/media/img/admin/user_rand_images/";
                                } else {
                                        $path = "/common/media/img/admin/user_images/";
                                }
                                        print '<img src="' . $domain . $path . $user[kTAG_ENTITY_ICON][kAPI_PARAM_RESPONSE_FRMT_DISP] . '" alt="me" class="online" />';
                                ?>
                                <span>
                                        <?php print $user[kTAG_NAME][kAPI_PARAM_RESPONSE_FRMT_DISP]; ?>
                                </span>
                                <i class="fa fa-angle-right pull-right" style="margin-top: 7.5px;"></i>
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
                print str_replace(array("btn btn-link"), array(""), $site_config->menu("admin", ""));
                ?>
        </nav>
        <!-- END DISPLAY USERS -->

        <span class="minifyme" data-action="minifyMenu"> <i class="fa fa-arrow-circle-left hit"></i> </span>
</aside>
<!-- END NAVIGATION -->
