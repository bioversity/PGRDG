<div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<form id="loginform" class="form-horizontal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalLabel"><span class="fa fa-sign-in	"></span>&nbsp;&nbsp;Sign In</h4>
				</div>
				<div class="modal-body">
					<div style="margin-bottom: 25px" class="input-group">
						<span class="input-group-addon"><i class="fa fa-user"></i></span>
						<input id="login-username" type="text" class="form-control" name="username" autofocus value="" placeholder="username or email" />
					</div>
					<div style="margin-bottom: 25px" class="input-group">
						<span class="input-group-addon"><i class="fa fa-lock"></i></span>
						<input id="login-password" type="password" class="form-control" name="password" placeholder="password" />
					</div>
					<div class="input-group">
						<div class="checkbox">
							<label>
								<input id="login-remember" type="checkbox" name="remember" value="1"> Remember me
							</label>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<div class="row">
						<div class="col-sm-6">
							<div class="input-group">
								Don't have an account? <a href="#" onclick="$('#loginbox').hide(); $('#signupbox').show()">Sign Up Here</a>
							</div>
						</div>
						<div class="col-sm-6 text-right">
							<input type="submit" id="login_btn" class="btn btn-primary" value="Sign in" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>