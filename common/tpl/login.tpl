<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">Sign In</h4>
			</div>
			<div class="modal-body">
				<div style="display:none" id="login-alert" class="alert alert-danger col-sm-12"></div>
					<form id="loginform" class="form-horizontal" role="form">
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
						<div style="margin-top:10px" class="form-group">
							<!-- Button -->
							<div class="col-sm-12 controls">
								<button type="submit" id="btn-login" class="btn btn-success">Login</button>
							</div>
						</div>
						<div class="form-group">
							<div class="col-md-12 control">
								<div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
									Don't have an account? 
									<a href="#" onClick="$('#loginbox').hide(); $('#signupbox').show()">Sign Up Here</a>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>