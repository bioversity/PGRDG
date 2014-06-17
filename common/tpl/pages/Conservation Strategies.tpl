<?php
$dir = "common/media/pdf/Conservation_Strategies";
$files = array_diff(scandir($dir), array("..", "."));
?>
<div class="panel-group" id="accordion">
	<?php
	foreach($files as $file) {
		//print '<li>' . $file . '</li>';
		if(is_dir($dir . "/" . $file)) {
			$d[] = $file;
		} else {
			$f[] = $file;
		}
	}
	foreach($d as $file) {
		?>
		<div class="panel panel-success">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a data-toggle="collapse" data-parent="#accordion" href="#<?php print md5($file); ?>">
						<?php print $file; ?>
					</a>
				</h4>
			</div>
			<div id="<?php print md5($file); ?>" class="panel-collapse collapse">
				<div class="panel-body">
					<h3>Last file version</h3>
					<ul class="fa-ul lead">
						<?php
						$subdir = "common/media/pdf/Conservation_Strategies/" . $file;
						$subfiles = array_diff(scandir($subdir), array("..", "."));
						$subdir_old = "common/media/pdf/Conservation_Strategies/" . $file . "/older";
						if(is_dir($subdir_old)) {
							$subfiles_old = array_diff(scandir($subdir_old), array("..", "."));
						}
						
						foreach($subfiles as $subfile) {
							if(!is_dir($subdir . "/" . $subfile)) {
								print '<li><span class="fa-li fa fa-file-pdf-o fa-fw text-danger"></span><a href="/API/?download=' . str_replace("common/media/", "", $subdir) . '/' . $subfile . '" title="Click to download" class="text-warning">' . str_replace("_", " ", $subfile) . '</a></li>';
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
									print '<li><span class="fa-li fa fa-file-pdf-o fa-fw text-warning"></span><a href="/API/?download=' . str_replace("common/media/", "", $subdir_old) . '/' . $subfile_old . '" title="Click to download" class="text-muted">' . str_replace("_", " ", $subfile_old) . '</a></li>';
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
	}
		?>
	<div class="panel panel-default">
		<br />
		<ul class="list-group fa-ul">
			<?php
			foreach($f as $file) {
				print '<li class="list-group-item"><span class="fa-li fa fa-file-pdf-o fa-fw text-danger"></span><a href="/API/?download=' . str_replace("common/media/", "", $dir) . '/' . $file . '" title="Click to download" class="text-warning">' . str_replace("_", " ", $file) . '</a></li>';
			}
			?>
		</ul>
		<br />
	</div>
</div>