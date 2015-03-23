<h1><?php print $page->title; ?></h1>
<?php
$super_root = "common/media/pdf/Conservation_Strategies";
$super_root_files = array_diff(scandir($super_root), array("..", "."));
$files = array_diff(scandir($super_root), array("..", "."));
?>
<br />
<br />
<div class="table-responsive">
	<table class="table">
		<tr>
			<?php
			foreach($super_root_files as $super_root_file) {
				if(is_dir($super_root . "/" . $super_root_file)) {
					print '<th style="width: 50%;"><h3>' . $super_root_file . '</h3></th>';
				}
			}
			?>
		</tr>
		<tr>
			<?php
			foreach($super_root_files as $super_root_file) {
				if(is_dir($super_root . "/" . $super_root_file)) {
					$local = $super_root . "/" . $super_root_file;
					$local_files = array_diff(scandir($local), array("..", "."));
					?>
					<td style="width: 50%;">
						<?php
						foreach($local_files as $local_file) {
							if(is_dir($local . "/" . $local_file)) {
								$sub_local = $super_root . "/" . $super_root_file . "/" . $local_file;
								$sub_local_files = array_diff(scandir($sub_local), array("..", "."));

							//	if(count($sub_local_files) > 0) {
									print '<h4><span class="fa fa-angle-right text-muted"></span> ' . $local_file . "</h4>";
							//	}
							}
							?>
							<div class="panel-group" id="accordion">
								<?php
								if(count($sub_local_files) > 0) {
									foreach($sub_local_files as $file) {
										if(is_dir($sub_local . "/" . $file)) {
											?>
											<div class="panel panel-success">
												<div class="panel-heading">
													<h4 class="panel-title">
														<a data-toggle="collapse" data-parent="#accordion" href="javascript:void(0);" data-target="#<?php print md5($file); ?>">
															<?php print $file; ?>
														</a>
													</h4>
												</div>
												<div id="<?php print md5($file); ?>" class="panel-collapse collapse">
													<div class="panel-body">
														<h3>Last file version</h3>
														<ul class="fa-ul lead">
															<?php
															$subdir = $sub_local . "/" . $file;
															$subfiles = array_values(array_diff(scandir($subdir), array("..", ".")));
															$subdir_old = $sub_local . "/" . $file . "/older";
															if(is_dir($subdir_old)) {
																$subfiles_old = array_values(array_diff(scandir($subdir_old), array("..", ".")));
															}
															if(count($subfiles_old) == 1) {
																$subfile_old = $subfiles_old[0];
															}
															foreach($subfiles as $subfile) {
																if(!is_dir($subdir . "/" . $subfile)) {
																	$pos = strrpos($subfile_old, "_title");
									                                                                if ($pos === false) {
																		if(count($subfiles_old) == 1 && file_exists($subdir_old . "/" . str_replace(".pdf", "_title", $subfile_old))) {
																			$title = file_get_contents($subdir . "/" . str_replace(".pdf", "_title", $subfile));
																		} else {
																			$title = str_replace(array("_", ".pdf"), array(" ", ""), $subfile);
																		}
																		print '<li><span class="fa-li fa fa-file-pdf-o fa-fw text-danger"></span><a target="_blank" href="/API/?view=' . base64_encode(str_replace("common/media/", "", $subdir) . '/' . $subfile) . '" title="Click to download" class="text-warning">' . ((trim($title) !== "") ? $title : str_replace("_", " ", $subfile)) . '</a></li>';
																	}
																}
															}
															?>
														</ul>
														<?php
														if(is_dir($subdir_old) && count($subfiles_old) > 0) {
															?>
															<hr />
															<h5>Older file version</h5>
															<ul class="fa-ul">
																<?php
																foreach($subfiles_old as $subfile_old) {
																	if(!is_dir($subdir_old . "/" . $subfile_old)) {
																		$pos = strrpos($subfile_old, "_title");
														                                if ($pos === false) {
																			if(file_exists($subdir_old . "/" . str_replace(".pdf", "_title", $subfile_old))) {
																				$title = file_get_contents($subdir_old . "/" . str_replace(".pdf", "_title", $subfile_old));
																			} else {
																				$title = str_replace(".pdf", "", $subfile_old);
																			}
																			print '<li><span class="fa-li fa fa-file-pdf-o fa-fw text-warning"></span><a target="_blank" href="/API/?view=' . base64_encode(str_replace("common/media/", "", $subdir_old) . '/' . $subfile_old) . '" title="Click to download" class="text-muted">' . ((trim($title) !== "") ? $title : str_replace("_", " ", $subfile_old)) . '</a></li>';
																		}
																	}
																}
																?>
															</ul>
															<?php
														}
														?>
													</div>
												</div>
											</div>
											<?php
										} else {
											$pos = strrpos($file, "_title");
											if ($pos === false) {
												?>
												<div class="panel panel-default">
													<br />
													<ul class="list-group fa-ul">
														<?php
														if(file_exists($sub_local . "/" . str_replace(".pdf", "_title", $file))) {
															$title = file_get_contents($sub_local . "/" . str_replace(".pdf", "_title", $file));
														} else {
															$title = str_replace(array("_", ".pdf"), array(" ", ""), $file);
														}
														print '<li class="list-group-item"><span class="fa-li fa fa-file-pdf-o fa-fw text-danger"></span><a target="_blank" href="/API/?view=' . base64_encode(str_replace("common/media/", "", $sub_local) . '/' . $file) . '" title="Click to download" class="text-warning">' . ((trim($title) !== "") ? $title : str_replace("_", " ", $file)) . '</a></li>';
														?>
													</ul>
													<br />
												</div>
												<?php
											}
										}
									}
								} else {
									print '<span class="text-muted">No files for this entry</span>';
								}
								?>
							</div>
							<br />
							<?php
						}
						?>
					</td>
					<?php
				}
			}
			?>
		</tr>
	</table>
</div>
