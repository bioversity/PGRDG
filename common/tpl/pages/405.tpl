<?php
http_response_code(405);
?>
<?php include("common/tpl/body_header.tpl"); ?>
<div class="e405">
        <h1><span>405</span><small class="help-block"><?php print $i18n[$lang]["messages"]["errors"]["405"]; ?></small></h1>
        <p><?php print $i18n[$lang]["messages"]["errors"]["page_requires_login"]; ?></p>

        <hr />
        <div class="panel">
                <div class="panel-body">
                        <h2>Login</h2>
                        <div style="margin-bottom: 25px" class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                                <input id="login-username" type="text" class="form-control" name="username" autofocus value="alessandro" placeholder="username or email" />
                        </div>
                        <div style="margin-bottom: 25px" class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                                <input id="login-password" type="password" class="form-control" name="password" placeholder="password" value="quellochetepare" />
                        </div>
                        <div class="input-group">
                                <div class="checkbox">
                                        <label>
                                                <input id="remember_login_btn" type="checkbox" name="remember" value="1"> <?php print $i18n[$lang]["messages"]["login"]["remember_me"]; ?>
                                        </label>
                                </div>
                        </div>
                        <div class="row">
                                <div class="col-sm-6">
                                        <?php
                                        if($interface["site"]["allow_signup"]) {
                                                ?>
                                                <div class="input-group">
                                                        <?php print $i18n[$lang]["messages"]["login"]["dont_have_account"]; ?> <a href="javascript:void(0);"><?php print $i18n[$lang]["messages"]["login"]["signup_here"]; ?></a>
                                                </div>
                                                <?php
                                        }
                                        ?>
                                </div>
                                <div class="col-sm-6 text-right">
                                        <a href="javascript: void(0);" onclick="$.login();" id="login_btn" class="btn btn-default-grey"><?php print $i18n[$lang]["messages"]["login"]["sign_in_btn"]; ?> <span class="fa fa-angle-right"></span></a>
                                </div>
                        </div>
                </div>
        </div>
</div>
<div class="signature"><span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Christopher Hogue Thompson", "http://commons.wikimedia.org/wiki/Main_Page"), $i18n[$lang]["messages"]["photo_author_caption"]); ?></div>
