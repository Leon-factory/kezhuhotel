<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <title>使用申请</title>
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/images/eapolog.ico" />
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrapValidator.min.css" rel="stylesheet">
    <script src="../js/jquery-3.1.1.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrapValidator.min.js"></script>
    <script type="text/javascript" src="../js/cookie.js"></script>

    <!-- <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
	<link href="https://cdn.bootcss.com/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css" rel="stylesheet">
	<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://cdn.bootcss.com/jquery.bootstrapvalidator/0.5.3/js/bootstrapValidator.min.js"></script>
	<script type="text/javascript" src="../js/cookie.js"></script> -->
    <style>
      .login-form-bg {
        width: 572px;
        padding-top: 0px;
        margin: 110px auto 0 auto;
      }

      input::-webkit-input-placeholder {
        color: #5cadf9;
      }

      input:focus::-webkit-input-placeholder {
        color: #5cadf9;
      }

      /* Firefox < 19 */

      input:-moz-placeholder {
        color: #5cadf9;
      }

      input:focus:-moz-placeholder {
        color: #5cadf9;
      }

      /* Firefox > 19 */

      input::-moz-placeholder {
        color: #5cadf9;
      }

      input:focus::-moz-placeholder {
        color: #5cadf9;
      }

      /* Internet Explorer 10 */

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

      /*使用申请CSS*/

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

      #validation {
        margin-right: 18px;
      }
    </style>
  </head>

  <body>
    <script>
      $(function () {
        //点击刷新验证码
        $('#verificationCode_useapplication').click(function () {
          var time = new Date().getTime();
          //$(this).attr('src','../../validate/applyCode?'+time);
          $(this).attr('src', '../../validate/applyCode?' + time);
        });
      })
    </script>
    <div class="login-form-bg" style="position: relative;">
      <div style="width:260px;height: 75px;position: absolute;top: -65px;left:200px;">
        <h2 style="color: #00AEFB;">PMS使用申请</h3>
      </div>
      <div class="login-form" style="height: 500px;padding:30px 0px 0 0px;background-color: #fff;">
        <form method="post" class="form-horizontal" action="" autocomplete="off">
          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">酒店名称：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <input type="text" class="form-control" name="hotelName" required placeholder="请输入酒店名称" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">酒店地址：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <input type="text" class="form-control" name="hotelAddress" required placeholder="请输入酒店地址" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">联系人：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <input type="text" class="form-control" name="user" required placeholder="请输入联系人" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">手机号码：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <input type="text" class="form-control" name="phone" required placeholder="请输入手机号码" />
            </div>
          </div>

          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">邮箱：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <input type="text" class="form-control" name="email" required placeholder="请输入邮箱" />
            </div>
          </div>
          <div class="form-group" style="height:56px;margin-bottom:10px;">
            <label class="col-md-3 col-xs-3 col-lg-3 col-sm-3 col-md-offset-1 col-xs-offset-1 col-lg-offset-1 col-sm-offset-1 control-label"
              style="margin-bottom: 0;padding-top: 7px;padding-right: 0px;margin-left:20px;">验证码：</label>
            <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7" style="padding-left:0;">
              <div class="col-md-6 col-xs-6 col-lg-6 col-sm-6" style="padding-left:0;width:53%;padding-right:8px;">
                <input type="text" class="form-control" name="validation" placeholder="验证码" style="padding-right:32px;" />
              </div>
              <div class="col-md-6 col-xs-6 col-lg-6 col-sm-6" style="padding-left:0;width:47%;">
                <!-- <img id="verificationCode_useapplication" alt="验证码" src="../../validate/applyCode" style="width:104px;height:32px;"/> -->
                <img id="verificationCode_useapplication" alt="验证码" src="../../validate/applyCode" />
              </div>
            </div>

          </div>

          <div class="form-group">
            <div class="col-md-9 col-xs-9 col-lg-9 col-sm-9 col-md-offset-2 col-xs-offset-2 col-lg-offset-2 col-sm-offset-2">
              <button type="submit" class="btn btn-primary" style="margin-right:20px;width:110px;">提交</button>
              <button type="button" id="resetBtn_useapplication" class="btn btn-primary" style="width:110px;">清空</button>
            </div>
          </div>
        </form>
      </div>

      <div id="myModal" data-show="false" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">系统提示</h4>
            </div>
            <div class="modal-body">
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      $(document).ready(function () {
        $('#myModal').modal({ backdrop: 'static', keyboard: true });
        $('form').bootstrapValidator({
          message: 'This value is not valid',
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            hotelName: {
              message: '',
              validators: {
                notEmpty: {
                  message: '酒店名称不能为空'
                }
              }
            },
            hotelAddress: {
              message: '密码无效',
              validators: {
                notEmpty: {
                  message: '酒店地址不能为空'
                }
              }
            },
            user: {
              validators: {
                notEmpty: {
                  message: '联系人不能为空'
                }
              }
            }
            , phone: {
              message: '手机号码无效',
              validators: {
                notEmpty: {
                  message: '手机号码不能为空'
                },
                regexp: {
                  regexp: /^1[3|4|5|7|8][0-9]{9}$/,
                  message: '手机号码格式输入不正确'
                }
              }
            }
            , email: {
              message: '邮箱无效',
              validators: {
                notEmpty: {
                  message: '邮箱不能为空'
                },
                regexp: {
                  regexp: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                  message: '邮箱格式输入不正确'
                }
              }
            }
          }
        }).on('success.form.bv', function (e) {//点击提交之后
          e.preventDefault();
          console.info($("form").data('bootstrapValidator').isValid());

          if ($("form").data('bootstrapValidator').isValid()) {
            console.info('er');
            $.ajax({
              type: "POST",
              url: "../../account/addApply",
              data: {
                hotelName: $('input[name="hotelName"]').val()
                , address: $('input[name="hotelAddress"]').val()
                , contact: $('input[name="user"]').val()
                , mobile: $('input[name="phone"]').val()
                , email: $('input[name="email"]').val()
                , applyCode: $('input[name="validation"]').val()
              },
              dataType: "json",
              success: function (msg) {
                //-3 验证码不正确
                if (msg > 0) {
                  $('#resetBtn_useapplication').trigger('click');
                  $('div[class="modal-body"]').text('提交成功！返回首页中。。。');
                  $('#myModal').modal('show');
                  setTimeout(function () {
                    window.location.href = 'http://www.eapor.com';
                  }, 3000);
                } else if (msg == -3) {
                  $('input[name="validation"]').parent().parent().parent().find('label').css('color', '#a94442');
                  $('input[name="validation"]').parent().find('small[data-bv-for="validation"]').remove();
                  $('input[name="validation"]').css('border-color', '#a94442').focus().parent().append(
                    '<small class="help-block" data-bv-validator="notEmpty" data-bv-for="validation" data-bv-result="INVALID" style="color:#a94442">请输入正确的验证码</small>'
                  );
                  $('button[type="submit"]').removeAttr("disabled");
                } else {
                  $('#resetBtn_useapplication').trigger('click');
                  $('div[class="modal-body"]').text('提交失败！');
                  $('#myModal').modal('show');
                }
              }
            });
          }
        });
      });

      $('#resetBtn_useapplication').click(function () {
        $('input[name="hotelName"]').val('');
        $('input[name="hotelAddress"]').val('');
        $('input[name="user"]').val('');
        $('input[name="phone"]').val('');
        $('input[name="email"]').val('');
        $('input[name="validation"]').val('');
        $('input[name="validation"]').parent().parent().parent().find('label').css('color', '#333333');
        $('input[name="validation"]').css('border-color', '#ccc').parent().find('small[data-bv-for="validation"]').remove();
        $('#verificationCode_useapplication').trigger('click');
        $("form").data('bootstrapValidator').resetForm();
      });
    </script>
  </body>

  </html>