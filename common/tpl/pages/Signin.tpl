<?php
include(TEMPLATE_DIR . "body_header.tpl");

if(!LOGGED) {
        ?>
        <div class="signin">
                <h1>
                        <span><?php print $i18n[$lang]["messages"]["login"]["sign_in"]; ?></span>
                </h1>
                <!-- <?php //print ($wrong_login) ? '<h3 class="text-danger">' . $i18n[$lang]["messages"]["login"]["wrong_data"] . '</h3>' : "" ?> -->

                <hr />
                <?php
                include(TEMPLATE_DIR . "login_form.tpl");
                ?>
        </div>
        <?php
} else {
        ?>
        <h1>
                <span><span class="fa fa-times"></span> <?php print $i18n[$lang]["messages"]["login"]["already_logged"]["title"]; ?></span>
        </h1>
        <p><?php print str_replace("{USER_NAME}", $user->name, $i18n[$lang]["messages"]["login"]["already_logged"]["message"]); ?></p>
        <?php
}
?>
