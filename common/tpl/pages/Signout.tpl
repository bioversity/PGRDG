<?php
if(LOGGED) {
        ?>
        <script type="text/javascript">
        $(document).ready(function() {
                $.logout();
        });
        </script>
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
