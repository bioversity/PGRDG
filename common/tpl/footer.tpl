<?php
if($page !== "Search") {
	?>
	<footer>
		<div class="row">
			<div class="col-lg-4">
				<div class="csc-textpic csc-textpic-intext-left-nowrap">
					<div class="csc-textpic-imagewrap">
						<figure class="csc-textpic-image csc-textpic-last">
							<a title="CGIAR" target="_blank" href="http://www.cgiar.org/">
								<img alt="CGIAR logo" src="<?php print $domain; ?>/common/media/img/cgiar-logo.jpg">
							</a>
						</figure>
					</div>
					<div class="csc-textpic-text">
						<div class="csc-textpicHeader csc-textpicHeader-26"></div>
						<p>Bioversity International is a member of the CGIAR Consortium.</p>
					</div>
				</div>
			</div>
			<div class="col-lg-4">
				<img src="<?php print $domain; ?>/common/media/img/pgr_secure_logo.jpg" style="height: 62px;">
			</div>
			<div class="col-lg-4 text-right">
				<img src="<?php print $domain; ?>/common/media/img/eu_flag.jpg" style="height: 62px;">
			</div>
		</div>
		<div class="centered" style="padding: 15px 0; border-top: 1px solid rgb(221, 221, 221);">
			<a href="http://creativecommons.org/licenses/by-nc-nd/4.0/" rel="license"><img src="http://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png" style="border-width:0" alt="Creative Commons License"></a> This work is licensed under a <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/" rel="license">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.<br />
			<a href="/Terms and Conditions of Use">Terms and Conditions of Use</a>
		</div>
	</footer>
	<?php
}
?>
