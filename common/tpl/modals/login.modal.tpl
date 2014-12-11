<div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div id="loginform" class="form-horizontal" method="post">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title"><span class="fa fa-sign-in"></span>&nbsp;&nbsp;<?php print $i18n[$lang]["messages"]["login"]["sign_in"]; ?></h4>
				</div>
				<div class="modal-body">
					<div style="margin-bottom: 25px" class="input-group">
						<span class="input-group-addon"><i class="fa fa-user"></i></span>
						<input id="login-username" type="text" class="form-control" name="username" autofocus value="alessandro" placeholder="username or email" />
					</div>
					<div style="margin-bottom: 25px" class="input-group">
						<span class="input-group-addon"><i class="fa fa-lock"></i></span>
						<input id="login-password" type="password" class="form-control" name="password" placeholder="password" value="quellochetepare" />
					</div>
					<div class="input-group">
						<div class="checkbox">
							<label>
								<input id="remember_login_btn" type="checkbox" name="remember" value="1"> <?php print $i18n[$lang]["messages"]["login"]["remember_me"]; ?>
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<div class="row">
						<div class="col-sm-6">
							<?php
							if($interface["site"]["allow_signup"]) {
								?>
								<div class="input-group">
									<?php print $i18n[$lang]["messages"]["login"]["dont_have_account"]; ?> <a href="javascript:void(0);"><?php print $i18n[$lang]["messages"]["login"]["signup_here"]; ?></a>
								</div>
								<?php
							}
							?>
						</div>
						<div class="col-sm-6 text-right">
							<a href="javascript: void(0);" id="login_btn" class="btn btn-primary"><?php print $i18n[$lang]["messages"]["login"]["sign_in_btn"]; ?></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
