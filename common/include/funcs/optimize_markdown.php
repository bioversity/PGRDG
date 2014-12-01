<?php
function optimize($markdown) {
        $optimized = str_replace(
                array(
                        "<img ",
                        "{{YEAR}}",
                        '<p></p>'
                ),
                array(
                        '<img class="img-responsive"',
                        date("Y"),
                        "<br />"
                ),
                $markdown
        );
        $optimized = preg_replace("/\{\{RIGHT\((.*?)\)\}\}/", '<div class="lead pull-right">$1</div>', $optimized);

        return $optimized;
}
?>
