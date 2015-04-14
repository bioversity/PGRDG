<div class="panel" id="login_form">
        <div class="panel-body">
                <!-- <form action="" onsumbit="return "> -->
                        <h2>Login</h2>
                        <div style="margin-bottom: 25px" class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                                <input id="login-username" type="text" class="form-control" name="username" autofocus value="" placeholder="username or email" />
                        </div>
                        <div style="margin-bottom: 25px" class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                                <input id="login-password" type="password" class="form-control" name="password" placeholder="password" value="" />
                        </div>
                        <div id="hp" class="input-group" style="display: none; visibility: hidden;">
                                <input type="text" class="form-control" name="hp" value="" />
                                <p class="help-block"><?php print $i18n[$lang]["messages"]["login"]["honeypot_message"]; ?></p>
                        </div>
                        <div class="input-group">
                                <div class="checkbox">
                                        <label>
                                                <input id="login-remember" type="checkbox" name="remember" value="1"> <?php print $i18n[$lang]["messages"]["login"]["remember_me"]; ?>
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
                                        <!-- <a href="javascript: void(0);" onclick="$.login();" id="login_btn" class="btn btn-default-grey"><?php print $i18n[$lang]["messages"]["login"]["sign_in_btn"]; ?> <span class="fa fa-angle-right"></span></a> -->
                                        <button type="submit" id="login_btn" onclick="$.login();" class="btn btn-default-grey"><?php print $i18n[$lang]["messages"]["login"]["sign_in_btn"]; ?> <span class="fa fa-angle-right"></span></button>
                                </div>
                        </div>
                <!-- </form> -->
        </div>
</div>
