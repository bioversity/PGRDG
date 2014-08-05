<h2 class="text-muted">Your data</h2>

<div class="pull-left"></div>
<form method="post" action="" class="form-horizontal" role="form">
        <h3>Personal</h3>
        <div class="form-group">
                <label for="uname" class="col-sm-2 control-label">Name <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                        <input type="text" name="name" required class="form-control" id="uname" placeholder="Name">
                </div>
        </div>
        <div class="form-group">
                <label for="ulast" class="col-sm-2 control-label">Last name <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                        <input type="text" name="lastname" required class="form-control" id="ulast" placeholder="Last name">
                </div>
        </div>
        <div class="form-group">
                <label for="uemail" class="col-sm-2 control-label">Email address <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                        <input type="email" name="email" required class="form-control" id="uemail" placeholder="Email address">
                </div>
        </div>

        <h3>Job</h3>
        <div class="form-group">
                <label for="ujob" class="col-sm-2 control-label">Company name <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                        <input type="text" name="ujob" required class="form-control" id="ujob" placeholder="Authority">
                </div>
        </div>
        <div class="form-group">
                <label for="utask" class="col-sm-2 control-label">Task</label>
                <div class="col-sm-10">
                        <input type="text" name="lastname" class="form-control" id="utask" placeholder="Job taks">
                </div>
        </div>
        <hr />
        <h3>Account</h3>
        <div class="form-group">
                <label for="username" class="col-sm-2 control-label">Username <span class="text-danger">*</span></label>
                <div class="col-sm-10">
                        <input type="text" name="username" required class="form-control" id="username" placeholder="Username">
                </div>
        </div>
        <div class="form-group">
                <label for="upgp" class="col-sm-2 control-label"><span class="fa fa-lock"></span> <acronym title="Pretty Good Privacy">PGP</acronym> PUBLIC key</label>
                <div class="col-sm-10">
                        <textarea name="pgp" rows="4" class="form-control" required id="upgp" placeholder="PGP PUBLIC key"></textarea>
                        <span class="help-block">You strictly need a personal PGP key.<br />For further instructions please see here: <a class="text-danger" target="_blank" href="http://www.pgpi.org/doc/pgpintro/">http://www.pgpi.org/doc/pgpintro/</a><sup class="fa fa-external-link text-muted"></sup></span>
                </div>
        </div>
        <div id="user_permission"></div>

        <div class="btn-group pull-right">
                <button class="btn btn-default-white">Cancel</button>
                <input id="save_profile_btn" type="submit" class="btn btn-default" value="Save" />
        </div>
        <div class="clearfix"></div>
</form>
<br />
<hr />
<br />
<form method="post" action="" class="form-horizontal" role="form">
        <div class="panel panel-warning">
                <div class="panel-heading">
                        <a class="text-muted" data-toggle="collapse" data-parent="#accordion" href="#chpwd_form">
                                <span class="fa fa-warning text-warning"></span>Change password
                        </a>
                </div>
                <div id="chpwd_form"class="panel-body panel-collapse collapse">
                        <div class="form-group has-warning">
                                <label for="pwd1" class="col-sm-2 control-label">Current password</label>
                                <div class="col-sm-10">
                                        <input type="password" name="pwd1" class="form-control" id="pwd1" placeholder="Current password">
                                </div>
                        </div>
                        <br />
                        <div class="form-group has-warning">
                                <label for="pwd1" class="col-sm-2 control-label">New password</label>
                                <div class="col-sm-10">
                                        <input type="password" name="pwd1" class="form-control" id="pwd1" autocomplete="off" placeholder="New password">
                                </div>
                        </div>
                        <div class="form-group has-warning">
                                <label for="pwd2" class="col-sm-2 control-label">Repeat password</label>
                                <div class="col-sm-10">
                                        <input type="password" name="pwd2" class="form-control" id="pwd2" placeholder="Repeat password" value="123456789">
                                </div>
                        </div>
                        <div class="btn-group pull-right">
                                <input type="submit" class="btn btn-warning" value="Update password" />
                        </div>
                </div>
        </div>
</form>
