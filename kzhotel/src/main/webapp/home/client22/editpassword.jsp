<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
  <!doctype html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <title>修改密码</title>
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/images/eapolog.ico" />
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrapValidator.min.css" rel="stylesheet">
    <script src="../js/md5.min.js"></script>
    <script src="../js/jquery-3.1.1.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrapValidator.min.js"></script>
    <!-- <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet"> -->
    <!-- <link href="https://cdn.bootcss.com/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css" rel="stylesheet"> -->
    <!-- <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script> -->
    <!-- <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
    <!-- <script src="https://cdn.bootcss.com/jquery.bootstrapvalidator/0.5.3/js/bootstrapValidator.min.js"></script> -->
    <style>
      .login-form-bg {
        width: 572px;
        padding-top: 0px;
        margin: 120px auto 0 auto;
      }

      input::-webkit-input-placeholder {
        color: #5cadf9;
      }

      input:focus::-webkit-input-placeholder {
        color: #5cadf9;
      }

      input:-moz-placeholder {
        color: #5cadf9;
      }

      input:focus:-moz-placeholder {
        color: #5cadf9;
      }

      input::-moz-placeholder {
        color: #5cadf9;
      }

      input:focus::-moz-placeholder {
        color: #5cadf9;
      }

      input:-ms-input-placeholder {
        color: #5cadf9;
      }

      input:focus:-ms-input-placeholder {
        color: #5cadf9;
      }

      input:focus {
        border: 1px solid #5cadf9;
      }

      input::-webkit-input-placeholder {
        color: #c0c5c9;
      }

      input::-moz-placeholder {
        color: #c0c5c9;
      }

      input,
      textarea {
        outline: none;
        border: 1px solid #c0c5c9;
      }

      .idg-btn {
        background: #5cadf9;
        cursor: pointer;
        width: 110px;
        height: 40px;
        border: 0;
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
      }

      .idg-btn:hover {
        opacity: 0.8;
      }

      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .clear {
        clear: both;
      }

      body {
        font-family: Arial, serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }

      .login,
      .hotel {
        width: 240px;
        padding-right: 5px;
        padding-left: 35px;
        height: 42px;
        color: #000;
        font-size: 16px;
        border-radius: 3px;
        margin-bottom: 10px;
      }

      label,
      input,
      button,
      select,
      textarea {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 13px;
        font-weight: normal;
        line-height: 18px;
      }

      .login-form {
        vertical-align: middle;
        -webkit-box-shadow: 0px 0px 8px 0px rgba(50, 50, 50, 0.4);
        -moz-box-shadow: 0px 0px 8px 0px rgba(50, 50, 50, 0.4);
        box-shadow: 0px 0px 8px 0px rgba(50, 50, 50, 0.4);
        margin: 0 auto 0 auto;
        height: 415px;
        width: 372px;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
      }
    </style>
  </head>

  <body>
    <div class="login-form-bg" style="margin:120px auto 0 auto;">
      <div style="height: 75px;text-align:center;">
        <h2 style="color: #00AEFB;">修改密码</h3>
      </div>
      <div class="login-form" style="height: 350px;padding:35px;background-color: #fff;">
        <form method="post" class="form-horizontal" action="" autocomplete="off">
          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;">用户名：</label>
            <div class="col-md-8 col-xs-8 col-lg-8 col-sm-8" style="padding-left:0;">
              <input type="text" class="form-control" autocomplete="off" name="username" required placeholder="请输入用户名" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;">旧密码：</label>
            <div class="col-md-8 col-xs-8 col-lg-8 col-sm-8" style="padding-left:0;">
              <input type="password" class="form-control" autocomplete="off" name="oldpassword" required placeholder="请输入旧密码" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;">新密码：</label>
            <div class="col-md-8 col-xs-8 col-lg-8 col-sm-8" style="padding-left:0;">
              <input type="password" class="form-control" autocomplete="off" name="newpassword" required placeholder="请输入新密码" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;">确认新密码：</label>
            <div class="col-md-8 col-xs-8 col-lg-8 col-sm-8" style="padding-left:0;">
              <input type="password" class="form-control" name="newpassword2" autocomplete="off" required placeholder="请再次输入新密码" />
            </div>
          </div>

          <div class="form-group">
            <div class="col-md-12 col-xs-12 col-lg-12 col-sm-12 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1" style="padding-left:20px;">
              <button type="submit" class="btn btn-primary" style="margin-right:20px;width:110px;">提交</button>
              <button type="button" id="resetBtn" class="btn btn-primary" style="width:110px;">清空</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <script>
      $(document).ready(function () {

        $('form').bootstrapValidator({
          message: 'This value is not valid',
          feedbackIcons: {/*input状态样式图片*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {/*验证*/
            username: {/*键名username和input name值对应*/
              message: '',//The username is not valid
              validators: {
                notEmpty: {/*非空提示*/
                  message: '用户名不能为空'
                }
              }
            },
            oldpassword: {
              message: '密码无效',
              validators: {
                notEmpty: {
                  message: '旧密码不能为空'
                }
              }
            },
            newpassword: {
              validators: {
                notEmpty: {
                  message: '新密码不能为空'
                },
                stringLength: {/*长度提示*/
                  min: 6,
                  max: 28,
                  message: '长度必须在6到28位之间'
                }
              }
            },
            newpassword2: {
              validators: {
                notEmpty: {
                  message: '确认密码不能为空'
                },
                stringLength: {/*长度提示*/
                  min: 6,
                  max: 28,
                  message: '长度必须在6到28位之间'
                },
                identical: {
                  field: 'newpassword',
                  message: '两次输入的密码不相符'
                }
              }
            },
          }
        }).on('success.form.bv', function (e) {//点击提交之后
          //$.post($form.attr('action'), $form.serialize(), function(result) {

          e.preventDefault();
          console.info(123);
          console.info($("form").data('bootstrapValidator').isValid());
          if ($("form").data('bootstrapValidator').isValid()) {
            console.info('er');
            $.ajax({
              type: "POST",
              url: "../../kzhotel/user/changePassword",
              data: {
                userName: $('input[name="username"]').val(),
                oldPassword: md5($('input[name="oldpassword"]').val()),
                newPassword: md5($('input[name="newpassword"]').val())
              },
              dataType: "json",
              success: function (msg) {
                console.info(msg);
                if (msg == -1) {
                  //用户名不正确
                  $('input[name="username"]').focus();
                  alert('用户名或旧密码错误！');
                }

                if (msg > 0) {
                  //修改成功
                  alert('修改成功！');
                  $('#resetBtn').trigger('click');
                }
              }
            });
          }
        });
      });

      $('#resetBtn').click(function () {
        $('input[name="username"]').val('');
        $('input[name="oldpassword"]').val('');
        $('input[name="newpassword"]').val('');
        $('input[name="newpassword2"]').val('');
        $("form").data('bootstrapValidator').resetForm();
      });
    </script>
  </body>

  </html>