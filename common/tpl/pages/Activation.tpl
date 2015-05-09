<?php

include(TEMPLATE_DIR . "body_header.tpl");
?>
<span id="f" style="display: none;"><?php print trim($_GET["f"]); ?></span>
<div class="signin">
        <h1><span style="font-size: 2.2em !important;">Wait...</span><small class="help-block"><?php print $i18n[$lang]["messages"]["activation"]["title"]; ?></small></h1>
        <p class="lead"><?php print $i18n[$lang]["messages"]["activation"]["message"]; ?></p>
        <hr />

</div>
<div class="signature"><span class="fa fa-camera"></span> <?php print str_replace(array("{NAME}", "{URL}"), array("Irina Naumets", "http://www.freeimages.com/photo/1426260"), $i18n[$lang]["messages"]["photo_author_caption"]); ?></div>

<script type="text/javascript">
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
                        if(response[kAPI_RESPONSE_STATUS][kAPI_STATUS_STATE] == "ok") {
                                window.location.href = "./Signin";
                        }
                }
        })
        // objp.storage_group = "local";
        // objp[kAPI_REQUEST_OPERATION] = kAPI_OP_USER_INVITE;
        // objp.parameters = {};
        // objp.parameters[kAPI_REQUEST_LANGUAGE] = lang;
        // objp.parameters[kAPI_REQUEST_PARAMETERS] = {};
        // objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_LOG_REQUEST] = true;
        // objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_DATA] = kAPI_RESULT_ENUM_DATA_FORMAT;
        // objp.parameters[kAPI_REQUEST_PARAMETERS][kAPI_PARAM_ID] = data;
        //
        // $.cryptAjax({
        //         url: (!config.site.developer_mode) ? "API/" : param_nob64,
        //         dataType: "json",
        //         // dataFilter: function(data, type) {
        //         // 	if(type !== "json") {
        //         // 		return JSON.parse(data);
        //         // 	}
        //         // },
        //         crossDomain: true,
        //         type: (!config.site.developer_mode) ? "POST" : "GET",
        //         timeout: 30000,
        //         data: {
        //                 jCryption: $.jCryption.encrypt("", password),
        //                 type: "activate_user"
        //         },
        //         success: function(response) {
        //                 console.log(response);
        //         }
        // });
});
</script>
