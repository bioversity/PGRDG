<h1><span class="ionicons ion-person-add"></span>&nbsp;&nbsp;Invite an user</h1>
<hr />
<div id="invite_user" class="form-horizontal panel-content">
        <div class="row">
                <div class="col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2 well" id="invite_container">
                        <fieldset>
                                <legend>User personal data</legend>
                                <div class="form-group">
                                        <div class="row">
                                                <label class="control-label col-sm-3 control-label col-xs-12" for="new_user_full_name">Full name</label>
                                                <div class="col-sm-9 col-xs-12 row">
                                                        <input type="text" class="form-control" name="new_user_full_name" id="new_user_full_name" placeholder="Full name" value="" />
                                                </div>
                                        </div>
                                </div>
                                <div class="form-group">
                                        <div class="row">
                                                <label class="control-label col-sm-3 control-label col-xs-12" for="new_user_mail_address">E-mail address</label>
                                                <div class="col-sm-9 col-xs-12 row">
                                                        <input type="email" class="form-control" name="new_user_mail_address" id="new_user_mail_address" placeholder="E-mail address" value="" />
                                                </div>
                                        </div>
                                </div>
                                <br />
                                <div class="form-group">
                                        <div class="row">
                                                <label class="control-label col-sm-3 control-label col-xs-12" for="new_user_work_title">Work title</label>
                                                <div class="col-sm-9 col-xs-12 row">
                                                        <input type="text" class="form-control" name="new_user_work_title" id="new_user_work_title" placeholder="Work title" value="" />
                                                </div>
                                        </div>
                                </div>
                        </fieldset>
                        <br />
                        <br />
                        <fieldset>
                                <legend>Roles</legend>

                                <dl class="dl-horizontal roles">
                                        <dt>
                                                <input type="checkbox" id="role-login" value=":roles:user-login">
                                                <label class="control-label" for="role-login">
                                                        <span class="fa fa-fw fa-sign-in fa-3x text-success"></span>
                                                </label>
                                        </dt>
                                        <dd>
                                                Login <i class="help-block">The ability to login.</i>
                                        </dd>
                                        <dt>
                                                <input type="checkbox" id="role-invite" value=":roles:user-invite">
                                                <label class="control-label" for="role-invite">
                                                        <span class="fa fa-fw fa-certificate fa-3x text-success"></span>
                                                </label>
                                        </dt>
                                        <dd>
                                                Invite users <i class="help-block">The ability to compile a user profile and send an invitation.</i>
                                        </dd>
                                        <dt>
                                                <input type="checkbox" id="role-upload" value=":roles:user-upload">
                                                <label class="control-label" for="role-upload">
                                                        <span class="fa fa-fw fa-upload fa-3x text-success"></span>
                                                </label>
                                        </dt>
                                        <dd>
                                                Upload data <i class="help-block">The ability to upload data templates.</i>
                                        </dd>
                                        <dt>
                                                <input type="checkbox" id="role-edit" value=":roles:page-edit" />
                                                <label class="control-label" for="role-edit">
                                                        <span class="fa fa-fw fa-file-text-o fa-3x text-success"></span>
                                                </label>
                                        </dt>
                                        <dd>
                                                Edit pages <i class="help-block">The ability to edit portal pages.</i>
                                        </dd>
                                        <dt>
                                                <input type="checkbox" id="manage-users" value=":roles:manage-users" />
                                                <label class="control-label" for="manage-users">
                                                        <span class="fa fa-fw fa-group fa-3x text-success"></span>
                                                </label>
                                        </dt>
                                        <dd>
                                                Manage users <i class="help-block">The ability to manage all users.</i>
                                        </dd>
                                </dl>
                        </fieldset>
                </div>
                <div class="col-xs-12 col-sm-5 col-lg-5 col-sm-offset-1 col-lg-offset-2">
                        <a href="javascript:void(0);" onclick="" class="btn btn-default-white"> <span class="fa fa-angle-left"></span> Cancel</a>
                        <a href="javascript:void(0);" onclick="$.invite_user();" class="btn btn-default pull-right">Send <span class="fa fa-share"></span></a></div>
                </div>
        </div>
        <br />
        <br />
        <!-- <h1 unselectable="on"><span class="fa fa-gear fa-spin"></span> <?php print $i18n[$lang]["messages"]["generating_invite_form"]; ?></h1> -->
</div>
