<?php

include(TEMPLATE_DIR . "body_header.tpl");
?>
<span id="f" style="display: none;"><?php print trim($_GET["f"]); ?></span>
<div class="signin">
        <h1><span style="font-size: 2.2em !important;">Wait...</span><small class="help-block"><?php print $i18n[$lang]["messages"]["activation"]["title"]; ?></small></h1>
        <div id="activation_content">
                <p class="lead" ><?php print $i18n[$lang]["messages"]["activation"]["message"]; ?></p>
        </div>
</div>
<div class="signature"><span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Irina Naumets", "http://www.freeimages.com/photo/1426260"), $i18n[$lang]["messages"]["photo_author_caption"]); ?></div>

<script type="text/javascript">
$.fn.check_valid = function() {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if(!regex.test($(this).val())) {
                $(this).closest(".input-group").addClass("has-error");
        } else {
                if($("#np1").val() === $("#np2").val()) {
                        $("#np1, #np2").closest(".input-group").removeClass("has-error");
                        $("#save_btn").removeClass("disabled");
                } else {
                        $("#np1, #np2").closest(".input-group").addClass("has-error");
                        $("#save_btn").addClass("disabled");
                }
        }
};
$.change_user_password = function() {
        var form_data = $("#user_password").serializeObject(),
        k = {};
        $("#loader").show();
        k[kAPI_REQUEST_USER] = form_data["uid"];
        k[kAPI_PARAM_ID] = form_data["uid"];
        k[kAPI_PARAM_OBJECT] = {};
        k[kAPI_PARAM_OBJECT][kTAG_CONN_CODE] = form_data["um"];
        k[kAPI_PARAM_OBJECT][kTAG_CONN_PASS] = $.sha1(form_data["np2"]);

        $.ask_cyphered_to_service({
                data: k,
                type: "save_user_data",
                force_renew: true
        }, function(response) {
                if($.obj_len(response) > 0 && response[kAPI_STATUS_STATE] == "ok") {
                        window.location.href = "./Signin";
                }
        });
};
$(document).ready(function() {
        var f = "fingerprint=" + $.rawurlencode($("#f").text());
        $("#loader").show();
        $.cryptAjax({
                url: "./API/",
                dataType: "json",
                crossDomain: true,
                type: (!config.site.developer_mode) ? "POST" : "GET",
                timeout: 30000,
                data: {
                        jCryption: $.jCryption.encrypt(f, password),
                        type: "activate_user"
                },
                success: function(response) {
                        var user_id, user_mail;
                        $.each(response[kAPI_RESPONSE_RESULTS][kAPI_PARAM_COLLECTION_USER], function(k, v) {
                                user_id = k;
                                user_mail = v[kTAG_ENTITY_EMAIL][0][kTAG_TEXT];
                        });
                        $("#loader").hide();

                        $("div.signin h1 > span").text(i18n[lang].messages.new_password).fitText(0.8);
                        $("div.signin h1 > small").text(i18n[lang].messages.create_new_password);

                        var $br = $('<br />'),
                        $hr = $('<hr />'),
                        $footer = $('<div class="text-right">'),
                        $save_btn = $('<button>').attr({
                                "class": "btn btn-default-white disabled",
                                "id": "save_btn"
                        }).click(function() {
                                $.change_user_password();
                        }).html(i18n[lang].interface.btns.save + ' <span class="fa fa-angle-right"></span>'),
                        $form = $('<form id="user_password">'),
                        $input_group1 = $('<div class="input-group">'),
                        $input_group2 = $('<div class="input-group">'),
                        $form_group1 = $('<div class="form-group">'),
                        $form_group2 = $('<div class="form-group">'),
                        $label1 = $('<label class="control-label" for="np1">').text(i18n[lang].messages.new_password),
                        $label2 = $('<label class="control-label" for="np2">').text(i18n[lang].messages.repeat_new_password),
                        $input0 = $('<input type="hidden" name="uid" value="' + user_id + '">'),
                        $input01 = $('<input type="hidden" name="um" value="' + user_mail + '">'),
                        $input1 = $('<input type="password" name="np1" id="np1" class="form-control" size="32" value="qwerty123A">'),
                        $input2 = $('<input type="password" name="np2" id="np2" class="form-control" size="32" value="qwerty123A">'),
                        $addon1 = $('<span class="input-group-addon">'),
                        $lock1 = $('<span class="fa fa-lock text-muted">'),
                        $addon2 = $('<span class="input-group-addon">'),
                        $lock2 = $('<span class="fa fa-lock text-muted">');

                        $addon1.append($lock1);
                        $addon2.append($lock2);
                        $input_group1.append($input0).append($input01).append($input1).append($addon1);
                        $input_group2.append($input2).append($addon2);
                        $form_group1.append($label1).append($input_group1);
                        $form_group2.append($label2).append($input_group2);
                        $form.append($form_group1).append($br);
                        $form.append($form_group2);
                        $footer.append($save_btn);
                        $("#activation_content").html("");
                        $("#activation_content").append($form).append($hr).append($footer);

                        $("#np1, #np2").on("keyup blur", function() {
                                $(this).check_valid();
                        });
                }
        });
});
</script>
