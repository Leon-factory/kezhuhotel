<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <title>账户管理</title>
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/images/eapolog.ico" />
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrap-table.min.css" rel="stylesheet">
    <script src="../js/jquery-3.1.1.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrap-table.min.js"></script>
    <script src="../js/bootstrap-table-zh-CN.min.js"></script>
    <!-- <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet"> -->
    <!-- <link href="http://cdn.bootcss.com/bootstrap-table/1.9.1/bootstrap-table.min.css" rel="stylesheet"/>  -->
    <!-- <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script> -->
    <!-- <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
    <!-- <script src="http://cdn.bootcss.com/bootstrap-table/1.9.1/bootstrap-table.min.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap-table/1.9.1/locale/bootstrap-table-zh-CN.min.js"></script> -->
  </head>

  <body>
    <div style="padding: 40px;">
      <h2>账户管理</h2>
      <table id="tab" class="table-striped"></table>
    </div>
    <!-- 密码重置 -->
    <div class="modal fade" id="myModalReset" tabindex="-1" role="dialog" aria-labelledby="myModalLabelReset">
      <div class="modal-dialog" style="top:40px;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabelReset">密码重置</h4>
          </div>
          <div class="modal-body">
            <div class="form-group" style="height:36px;margin-bottom:20px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">酒店名称：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="text" class="form-control" name="hName" required disabled placeholder="" />
              </div>
            </div>
            <div class="form-group" style="height:36px;margin-bottom:20px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">主账号：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="text" class="form-control" name="username" required disabled placeholder="" />
              </div>
            </div>
            <div class="form-group" style="height:36px;margin-bottom:10px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">新密码：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="password" class="form-control" name="password" required placeholder="请输入新密码" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="submit">确定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <div class="modal fade" id="myModalEdit" tabindex="-1" role="dialog" aria-labelledby="myModalLabelEdit">
      <div class="modal-dialog" style="top:40px;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabelEdit">编辑</h4>
          </div>
          <div class="modal-body">
            <div class="form-group" style="height:36px;margin-bottom:20px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">主账号：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="text" class="form-control" name="name" required placeholder="请输入主账号" />
              </div>
            </div>
            <div class="form-group" style="height:36px;margin-bottom:10px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">对应客主商家账号：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="text" class="form-control" name="kezhuName" required placeholder="请输入对应客主商家账号" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="submitEdit">确定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>

    <%-- 删除Modal --%>
      <div class="modal fade bs-example-modal-sm" id="myDelModal" tabindex="-1" role="dialog" aria-labelledby="myDelModalLabel">
        <div class="modal-dialog  modal-sm" style="top:40px;" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myDelModalLabel">系统提示</h4>
            </div>
            <div class="modal-body">
              <strong>您确定要删除该账户信息吗？</strong>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="submitDel">确定</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
          </div>
        </div>
      </div>

      <script type="text/javascript">
        id = "";
        hotelId = "";
        mainUserId = "";
        index = "";
        hotelIdDel = "";
        dataArr = [];
        $.ajax({
          type: 'post',
          url: '../../account/getAccountList',
          data: { offset: 0, limit: 99999, hotelName: "" },
          dataType: 'json',
          async: false,
          success: function (result) {
            console.info(result);
            dataArr = result;
          }
        });

        var table = $('#tab');
        table.bootstrapTable({
          //url: "duoBaoActivityList" , 
          data: dataArr /* [
		    {'id':33,'hotelname':44,'hoteladdress':55,'username':77},
		    {'id':33,'hotelname':44,'hoteladdress':55,'username':77},
		    {'id':33,'hotelname':44,'hoteladdress':55,'username':77},
		    {'id':33,'hotelname':44,'hoteladdress':55,'username':77},
		    {'id':33,'hotelname':44,'hoteladdress':55,'username':77},
    	] */ ,
          dataType: "json",
          pagination: true, //分页
          singleSelect: false,
          //data-locale:"zh-US" , //表格汉化
          search: true, //显示搜索框
          //sidePagination: "server", //服务端处理分页
          columns: [
            //{title: 'mainUserId',field: 'mainUserId',align: 'center',valign: 'middle',hidden:true}, 
            { title: 'ID', field: 'hotelId', align: 'center', valign: 'middle' },
            { title: '酒店名称', field: 'hotelName', align: 'center', valign: 'middle' },
            { title: '主账号', field: 'mainUsername', align: 'center', valign: 'middle' },
            { title: '对应客主商家账号', field: 'kezhuUsername', align: 'center', valign: 'middle' },
            { title: '对应客主商家名称', field: 'kezhuShopName', align: 'center', valign: 'middle' },
            { title: '对应客主商家ID', field: 'kezhuShopId', align: 'center', valign: 'middle' },
            {
              title: '操作', field: 'cz', align: 'center', valign: 'middle',
              formatter: function (value, row, index) {
                var rows = JSON.stringify(row);
                var e = "<a href='javascript:;' data-row=" + rows + " onclick='pwdReset(" + index + ")'>密码重置</a>";
                var f = "<a href='javascript:;' data-row=" + rows + " onclick='edit(" + index + ")'>修改</a>";
                var d = "<a href='javascript:;' data-row=" + rows + " style='display:none;' onclick='del(" + index + ")'> | 移除</a>";
                return e + " | " + f + d;
              }
            }
          ]
        });
        $('#submit').on('click', function () {
          if ($('input[name=password]').val() == "") {
            $("#alertReset").remove();
            $('#myModalReset').prepend(
              '<div class="alert alert-warning alert-dismissible" id="alertReset" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<strong>请输入新密码!</strong>' +
              '</div>'
            );
            return;
          }
          $.ajax({
            type: 'post',
            url: '../../account/resetPassword',
            data: { mainUserId: id, replacePassword: $('input[name=password]').val() },
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result > 0) {
                $('#myModalReset').modal('hide');
                $("#alertReset").remove();
                $('body').prepend(
                  '<div class="alert alert-success alert-dismissible" id="alertReset" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>密码重置成功!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertReset").remove() }, 4000);
                return;
              } else {
                $("#alertReset").remove();
                $('#myModalReset').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alertReset" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>操作失败!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertReset").remove() }, 4000);
                return;
              }
            }
          });
        });
        $('#submitEdit').on('click', function () {
          if ($('input[name=name]').val() == "") {
            $("#alertEdit").remove();
            $('#myModalEdit').prepend(
              '<div class="alert alert-warning alert-dismissible" id="alertEdit" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<strong>请输入主账号!</strong>' +
              '</div>'
            );
            return;
          }
          $.ajax({
            type: 'post',
            url: '../../account/editAccount',
            data: {              
hotelId: hotelId, mainUserId: mainUserId
              , mainUsername: $('input[name=name]').val(), kezhuUsername: $('input[name=kezhuName]').val()
            },
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result > 0) {
            	  $.ajax({
                      type: 'post',
                      url: '../../account/getAccountList',
                      data: { offset: 0, limit: 99999, hotelName: "" },
                      dataType: 'json',
                      async: false,
                      success: function (result) {
                        console.info(result);
                        $('#tab').bootstrapTable('load', result);
                      }
                    });
                /* $('#tab').bootstrapTable('updateRow', {
                  index: index,
                  row: {
                    mainUsername: $('input[name=name]').val(),
                    kezhuUsername: $('input[name=kezhuName]').val()
                  }
                }); */
                $('#myModalEdit').modal('hide');
                $("#alertEdit").remove();
                $('body').prepend(
                  '<div class="alert alert-success alert-dismissible" id="alertEdit" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>修改成功!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertEdit").remove() }, 4000);
                return;
              } else {
                $("#alertEdit").remove();
                $('#myModalEdit').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alertEdit" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>修改失败!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertEdit").remove() }, 4000);
                return;
              }
            }
          });
        });

        $('#submitDel').on('click', function () {
          $.ajax({
            type: 'post',
            url: '../../account/removeHotel',
            data: { hotelId: hotelIdDel },
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result > 0) {
                $('#tab').bootstrapTable('remove', {
                  field: 'hotelId',
                  values: [hotelIdDel]
                });
                $('#myDelModal').modal('hide');
                $('body').prepend(
                  '<div class="alert alert-success alert-dismissible" id="alertDel" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>移除成功!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertDel").remove() }, 5000);
              } else {
                $("#alertDel").remove();
                $('#myDelModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alertDel" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>移除失败!</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alertDel").remove() }, 5000);
              }
            }
          });
        });
        function pwdReset(i) {
          console.log(event.target.dataset.row);
          var r = JSON.parse(event.target.dataset.row);
          $('#myModalReset').modal({
            backdrop: 'static', keyboard: false
          });
          id = r.mainUserId;
          $('input[name=hName]').val(r.hotelName);
          $('input[name=username]').val(r.mainUsername);
        }
        function edit(i) {
          console.log(event.target.dataset.row);
          var r = JSON.parse(event.target.dataset.row);
          $('#myModalEdit').modal({
            backdrop: 'static', keyboard: false
          });
          index = i;
          hotelId = r.hotelId;
          mainUserId = r.mainUserId;
          $('input[name=name]').val(r.mainUsername);
          $('input[name=kezhuName]').val(r.kezhuUsername);
        }
        function del(i) {
          console.log(event.target.dataset.row);
          var r = JSON.parse(event.target.dataset.row);
          $("#alertDel").remove();
          $('#myDelModal').modal({
            backdrop: 'static', keyboard: false
          });
          hotelIdDel = r.hotelId;
        }
      </script>
  </body>

  </html>