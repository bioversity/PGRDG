<?php
require_once(FUNCS_DIR . "cut_text_block.php");

$dir = MARKDOWN_DIR . "blog";
$ignored = array(".", "..");

$blog_config = json_decode(file_get_contents(CONF_DIR . "blog.json"), 1);


if(!isset($_GET["s"]) || trim($_GET["s"]) === "") {
        print '<h3 style="color: #666;"><span class="fa fa-home text-muted"></span> The PGRDG Blog</h3>';
} else {
        print '<h3 class="text-muted"><a href="' . $domain . '/Blog"><span class="fa fa-home text-muted"></span><span class="hidden-xs"> The PGRDG Blog</span></a> &lsaquo; <span class="text-info">' . str_replace("_", " ", ucfirst($_GET["t"])) . '</span></h3>';
}
?>
<aside>
        <section>
                <?php
                if(!isset($_GET["s"]) || trim($_GET["s"]) == "" || !is_numeric($_GET["ss"])) {
                        $posts = array();
                        $i = 0;
                        $scanned_dir = scandir($dir);
                        foreach($scanned_dir as $post_id) {
                                if (in_array($post_id, $ignored)) { continue; }
                                $posts[$post_id]["file"]["path"] = $dir . "/" . $post_id;
                                $posts[$post_id]["date"]["cdate"] = filectime($dir . "/" . $post_id);
                                $posts[$post_id]["date"]["mdate"] = filemtime($dir . "/" . $post_id);

                                $i++;
                                if($i <= $blog_config["max_posts_per_page"]) {
                                        foreach(scandir($dir . "/" . $post_id) as $post) {
                                                $posts[$post_id]["file"]["file"] = $dir . "/" . $post_id . "/" . $post;
                                                $posts[$post_id]["file"]["md"] = post;
                                                $posts[$post_id]["post"]["title"] = str_replace(".md", "", $post);
                                                $posts[$post_id]["post"]["summary"] = cut_text_block(file_get_contents($dir . "/" . $post_id . "/" . $post), 300);
                                                $posts[$post_id]["post"]["body"] = file_get_contents($dir . "/" . $post_id . "/" . $post);
                                        }
                                }
                        }
                        arsort($posts);
                } else {
                        $posts = array();
                        $post_id = $_GET["ss"];
                        $scanned_dir = scandir($dir . "/" . $post_id);
                        $posts[$post_id]["file"]["path"] = $dir . "/" . $post_id;
                        $posts[$post_id]["date"]["cdate"] = filectime($dir . "/" . $post_id);
                        $posts[$post_id]["date"]["mdate"] = filemtime($dir . "/" . $post_id);

                        foreach($scanned_dir as $post) {
                                if (in_array($post, $ignored)) { continue; }

                                $posts[$post_id]["file"]["file"] = $dir . "/" . $post_id . "/" . $post;
                                $posts[$post_id]["file"]["md"] = post;
                                $posts[$post_id]["post"]["title"] = str_replace(".md", "", $post);
                                $posts[$post_id]["post"]["summary"] = file_get_contents($dir . "/" . $post_id . "/" . $post);
                                $posts[$post_id]["post"]["body"] = file_get_contents($dir . "/" . $post_id . "/" . $post);
                        }
                }
                if(count($posts) > 0) {
                        $i = 0;
                        foreach($posts as $post_id => $post) {
                                $i++;
                                if($i <= $blog_config["max_posts_per_page"]) {
                                        $post_path = $post["file"]["path"];
                                        $post_md_file = $post["file"]["md"];
                                        $creation_date = $post["date"]["cdate"];
                                        $last_edit_date = $post["date"]["mdate"];
                                        $title = $post["post"]["title"];
                                        $summary = $post["post"]["summary"];
                                        ?>
                                        <article>
                                                <header>
                                                        <?php
                                                        if(substr($title, 0, 1) == ".") {
                                                                if(LOGGED) {
                                                                        print '<h1><span class="text-muted">' . $post . '</span></h1>';
                                                                }
                                                        } else {
                                                                if(!isset($_GET["s"]) || trim($_GET["s"]) == "" || !is_numeric($_GET["ss"])) {
                                                                        print '<h1><a href="' . $domain . '/Blog/Post/' . $post_id . '/' . str_replace(" ", "_", $title) . '" title="Read the entire post" class="text-info">' . ucfirst($title) . '</a></h1><time class="help-block"><span class="fa fa-calendar"></span> ' . date("M d, Y", $creation_date) . '</time>';
                                                                } else {
                                                                        print '<time class="help-block"><span class="fa fa-calendar"></span> ' . date("M d, Y", $creation_date) . '</time>';
                                                                }
                                                        }
                                                        ?>
                                                </header>
                                                <p>
                                                        <?php
                                                        if(substr($title, 0, 1) == ".") {
                                                                if(LOGGED) {
                                                                        print str_replace("<p>", '<p class="text-muted">', Markdown(stripslashes($summary))) . str_replace("<a ", '<a class="text-info" ', readmore($post_id . "/" . $title));
                                                                }
                                                        } else {
                                                                if(!isset($_GET["s"]) || trim($_GET["s"]) == "" || !is_numeric($_GET["ss"])) {
                                                                        $output = Markdown(stripslashes($summary));
                                                                        $output .= readmore($post_id . "/" . $title);
                                                                } else {
                                                                        $output = Markdown(stripslashes($summary));
                                                                }

                                                                print $output;
                                                        }
                                                                /*
                                                                $content = stripslashes($dato_post["content"]);
                                                                preg_match_all('/<div class=\"gallery\"\>(.*?)<\/div>/s', $content, $gresult);
                                                                foreach($gresult[1] as $g => $imgs) {
                                                                        preg_match_all('/<img[^>]+>/i', $imgs, $result);
                                                                        foreach($result[0] as $k => $img_tag) {
                                                                                preg_match_all('/(alt|title|src)=("[^"]*")/i', $img_tag, $img_tags);
                                                                                $content = str_replace('<img src=' . $img_tags[2][0] . ' alt=' . $img_tags[2][1] . ((isset($img_tags[2][2])) ? ' title=' . $img_tags[2][2] : '') . ' />', '<a class="zoombox ' . ((count($result[0]) > 1) ? 'zgallery' . $g : "") . '" href=' . $img_tags[2][0] . ' title="' . htmlentities(str_replace('"', "", (isset($img_tags[2][2])) ? $img_tags[2][2] : $img_tags[2][1])) . '"><img src=' . $img_tags[2][0] . ' alt=' . $img_tags[2][1] . ' /></a>', $content);
                                                                        }
                                                                }
                                                                print Markdown(nl2section($content, array("pre" => "prettyprint")));
                                                                ?>
                                                                <!--footer>
                                                                        <section>
                                                                                Tags:
                                                                                <?php
                                                                                $tags = array_map("trim", explode(",", stripslashes($dato_post["tags"])));
                                                                                foreach($tags as $tag){
                                                                                        print '<a class="tag" href="./Tags/' . $tag . '">' . $tag . '</a>';
                                                                                }
                                                                                ?>
                                                                        </section>
                                                                        Written on <time><?php print date("M d, Y \a\\t H:i a", strtotime($dato_post["data"])); ?></time>
                                                                </footer>
                                                                <p id="cursors">
                                                                        <?php
                                                                        $previous_p = $pdo->query("select * from `iod_posts` where `id` = '" . (addslashes($_GET["id"]) + 1) . "'");
                                                                        if($previous_p->rowCount() > 0) {
                                                                                while($dato_previous_p = $previous_p->fetch()) {
                                                                                        print '<a href="./Post/' . $dato_previous_p["id"] . "/" . $dato_previous_p["link"] . '">&lsaquo; Next post</a>';
                                                                                }
                                                                        }
                                                                        $next_p = $pdo->query("select * from `iod_posts` where `id` = '" . (addslashes($_GET["id"]) - 1) . "'");
                                                                        if($next_p->rowCount() > 0) {
                                                                                while($dato_next_p = $next_p->fetch()) {
                                                                                        print '<a style="float: right;" href="./Post/' . $dato_next_p["id"] . "/" . $dato_next_p["link"] . '">Previous post &rsaquo;</a>';
                                                                                }
                                                                        }
                                                                        ?>
                                                                </p-->
                                                                <?php
                                                                */
                                                        ?>
                                                </p>
                                                <br />
                                                <br />
                                        </article>
                                        <?php
                                }
                        }
                }
                if(!isset($_GET["s"]) || trim($_GET["s"]) == "" || $_GET["ss"] == 1 || !is_numeric($_GET["ss"])) {
                        //print '<nav><a class="pull-right btn btn-default-grey" href="' . $domain . '/Blog/Page/2">Older posts &rsaquo;</a></nav><div class="clearfix"></div>';
                }
                ?>
        </section>
</aside>
