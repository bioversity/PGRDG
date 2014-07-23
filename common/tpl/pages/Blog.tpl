<?php
require_once("common/include/funcs/nl2.php");
require_once("common/include/funcs/readmore.php");
require_once("common/include/lib/php-markdown-extra-extended/markdown.php");

$dir = "common/md/blog";
$ignored = array(".", "..");
$logged = false;

?>
<aside>
        <section>
                <?php
                if(!isset($_GET["id"]) || trim($_GET["id"]) == "") {
                        if(!$logged) {
                                foreach(scandir($dir) as $file) {
                                        if (in_array($file, $ignored)) { continue; }
                                        $files[$file] = filectime($dir . "/" . $file);
                                }
                                arsort($files);
                                $files = array_keys($files);

                                $posts = ($files) ? $files : false;
                        } else {
                        //        $posts = $pdo->query("select * from `iod_posts` where `visible` = '1' order by `id` desc");
                        }
                } else {
                        //$posts = $pdo->query("select * from `iod_posts` where `id` = '" . addslashes($_GET["id"]) . "'");
                }
                if(count($posts) > 0) {
                        foreach($posts as $post_id => $post) {
                                $post = trim(str_replace(".md", "", $post));
                                ?>
                                <article>
                                        <header>
                                                <?php
                                                if(substr($post, 0, 1) == ".") {
                                                        if($logged) {
                                                                print '<h1><span class="text-muted">' . $post . '</span></h1>';
                                                        }
                                                } else {
                                                        print '<h1>' . $post . '</h1>';
                                                }
                                                ?>
                                        </header>
                                        <p>
                                                <?php
                                                if(!isset($_GET["id"]) || trim($_GET["id"]) == "") {
                                                        if(substr($post, 0, 1) == ".") {
                                                                if($logged) {
                                                                        print str_replace("<p>", '<p class="text-muted">', Markdown(stripslashes(file_get_contents($dir . "/" . $post . ".md")))) . str_replace("<a ", '<a class="text-info" ', readmore($post));
                                                                }
                                                        } else {
                                                                print stripslashes(file_get_contents($dir . "/" . $post . ".md")) . '<p class="pull-left text-muted">Created ' . date("M, d Y \o\\n H:i:s", filectime($dir . "/" . $post . ".md")) . '</p>' . readmore($post_id . "/" . str_replace(" ", "_", file_get_contents($dir . "/" . $post . ".md")));
                                                        }
                                                } else {
                                                        // $content = stripslashes($dato_post["content"]);
                                                        // preg_match_all('/<div class=\"gallery\"\>(.*?)<\/div>/s', $content, $gresult);
                                                        // foreach($gresult[1] as $g => $imgs) {
                                                        //         preg_match_all('/<img[^>]+>/i', $imgs, $result);
                                                        //         foreach($result[0] as $k => $img_tag) {
                                                        //                 preg_match_all('/(alt|title|src)=("[^"]*")/i', $img_tag, $img_tags);
                                                        //                 $content = str_replace('<img src=' . $img_tags[2][0] . ' alt=' . $img_tags[2][1] . ((isset($img_tags[2][2])) ? ' title=' . $img_tags[2][2] : '') . ' />', '<a class="zoombox ' . ((count($result[0]) > 1) ? 'zgallery' . $g : "") . '" href=' . $img_tags[2][0] . ' title="' . htmlentities(str_replace('"', "", (isset($img_tags[2][2])) ? $img_tags[2][2] : $img_tags[2][1])) . '"><img src=' . $img_tags[2][0] . ' alt=' . $img_tags[2][1] . ' /></a>', $content);
                                                        //         }
                                                        // }
                                                        // print Markdown(nl2section($content, array("pre" => "prettyprint")));
                                                        // ?>
                                                        // <!--footer>
                                                        //         <section>
                                                        //                 Tags:
                                                        //                 <?php
                                                        //                 $tags = array_map("trim", explode(",", stripslashes($dato_post["tags"])));
                                                        //                 foreach($tags as $tag){
                                                        //                         print '<a class="tag" href="./Tags/' . $tag . '">' . $tag . '</a>';
                                                        //                 }
                                                        //                 ?>
                                                        //         </section>
                                                        //         Written on <time><?php print date("M d, Y \a\\t H:i a", strtotime($dato_post["data"])); ?></time>
                                                        // </footer>
                                                        // <p id="cursors">
                                                        //         <?php
                                                        //         $previous_p = $pdo->query("select * from `iod_posts` where `id` = '" . (addslashes($_GET["id"]) + 1) . "'");
                                                        //         if($previous_p->rowCount() > 0) {
                                                        //                 while($dato_previous_p = $previous_p->fetch()) {
                                                        //                         print '<a href="./Post/' . $dato_previous_p["id"] . "/" . $dato_previous_p["link"] . '">&lsaquo; Next post</a>';
                                                        //                 }
                                                        //         }
                                                        //         $next_p = $pdo->query("select * from `iod_posts` where `id` = '" . (addslashes($_GET["id"]) - 1) . "'");
                                                        //         if($next_p->rowCount() > 0) {
                                                        //                 while($dato_next_p = $next_p->fetch()) {
                                                        //                         print '<a style="float: right;" href="./Post/' . $dato_next_p["id"] . "/" . $dato_next_p["link"] . '">Previous post &rsaquo;</a>';
                                                        //                 }
                                                        //         }
                                                        //         ?>
                                                        // </p-->
                                                        <?php
                                                }
                                                ?>
                                        </p>
                                        <br />
                                        <br />
                                </article>
                                <?php
                        }
                }
                ?>
        </section>
</aside>
