<h2 class="text-muted">Your data</h2>

<form id="personal_form" method="post" action="" class="form-horizontal" role="form">
        <div class="form-group">
                <label for="upgp" class="col-sm-4 control-label"><span class="fa fa-lock"></span> <abbr title="Pretty Good Privacy">PGP</abbr> PUBLIC key</label>
                <div class="col-sm-8">
                        <textarea name="pgp" rows="4" class="form-control" required id="upgp" placeholder="PGP PUBLIC key"></textarea>
                        <div class="help-block">
                                You strictly need a personal PGP key.<br />
                                If you do not have a personal PGP key, you can install these free software:
                                <ul>
                                        <li class="text-danger"><b>Windows</b>: <a class="text-danger" target="_blank" href="http://gpg4win.org/">Gpg4win</a></li>
                                        <li class="text-danger"><b>Mac</b>: <a class="text-danger" target="_blank" href="http://gpgtools.org/">Mac GPG</a></li>
                                        <li class="text-danger"><b>Linux/Unix</b>: the package <code>pgpgpg</code> is currently available</li>
                                </ul>
                                For further instructions please see here: <a class="text-danger" target="_blank" href="http://www.pgpi.org/doc/pgpintro/">http://www.pgpi.org/doc/pgpintro/</a><sup class="fa fa-external-link text-muted"></sup>
                        </div>
                </div>
        </div>
        <div id="user_permission"></div>
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
