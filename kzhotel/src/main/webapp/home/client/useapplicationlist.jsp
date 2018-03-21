<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <title>使用申请列表</title>
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/images/eapolog.ico" />
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrap-table.min.css" rel="stylesheet">
    <script src="../js/jquery-3.1.1.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/bootstrap-table.min.js"></script>
    <script src="../js/bootstrap-table-zh-CN.min.js"></script>

    <!-- <link href="http://cdn.bootcss.com/bootstrap-table/1.9.1/bootstrap-table.min.css" rel="stylesheet"/> 
	<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
	<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap-table/1.9.1/bootstrap-table.min.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap-table/1.9.1/locale/bootstrap-table-zh-CN.min.js"></script> -->
  </head>

  <body>
    <div style="padding: 40px;">
      <h2>使用申请列表</h2>
      <table id="tab" class="table-striped"></table>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" style="top:40px;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">账户批准</h4>
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
                <input type="text" class="form-control" name="mainUsername" required placeholder="请输入主账号" />
              </div>
            </div>
            <div class="form-group" style="height:36px;margin-bottom:10px;">
              <label class="col-md-4 col-xs-4 col-lg-4 col-sm-4 control-label" style="margin-bottom: 0;padding-top: 7px;text-align:right;">初始密码：</label>
              <div class="col-md-5 col-xs-5 col-lg-5 col-sm-5" style="padding-left:0;">
                <input type="password" class="form-control" name="password" required placeholder="请输入初始密码" />
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
              <strong>您确定要删除该申请信息吗？</strong>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="submitDel">确定</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
          </div>
        </div>
      </div>

      <script type="text/javascript">
        applyId = "";//保存点击的申请Id
        applyIdDel = "";//保存删除点击的申请Id
        index = "";
        hName = "";
        var data = [];
        function queryParams() {  //配置参数  
          var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的  
            offset: 0,   //页面大小  
            limit: 99999,  //页码  
          };
          return temp;
        }
        /* $.ajax({
          type:'post',
          url:'../../account/getApplyCount',
          data:{},
          dataType:'json',
          success:function(result){
            console.info(result);
          }
        }); */
        $.ajax({
          type: 'post',
          url: '../../account/getApplyList',
          data: { offset: 0, limit: 99999 },
          dataType: 'json',
          async: false,
          success: function (result) {
            console.info(result);
            data = result;
          }
        });
        var table = $('#tab');
        table.bootstrapTable({
          //url: "duoBaoActivityList",
          data: data,
          /* [
          {'num':22,'id':33,'hotelname':44,'hoteladdress':55,'username':77,'phone':88,'email':99,'date':9856},
          {'num':22,'id':33,'hotelname':44,'hoteladdress':55,'username':77,'phone':88,'email':99,'date':9856},
          {'num':22,'id':33,'hotelname':44,'hoteladdress':55,'username':77,'phone':88,'email':99,'date':9856},
          {'num':22,'id':33,'hotelname':44,'hoteladdress':55,'username':77,'phone':88,'email':99,'date':9856},
          {'num':22,'id':33,'hotelname':44,'hoteladdress':55,'username':77,'phone':88,'email':99,'date':9856},
          ],*/
          dataType: "json",
          pagination: true, //分页
          singleSelect: false,
          //data-locale:"zh-US" , //表格汉化
          // search: true, //显示搜索框
          //sidePagination: "server", //服务端处理分页
          columns: [
            //{title: '序号',field: 'num',align: 'center',valign: 'middle'}, 
            { title: 'ID', field: 'applyId', align: 'center', valign: 'middle' },
            { title: '酒店名称', field: 'hotelName', align: 'center', valign: 'middle' },
            { title: '酒店地址', field: 'address', align: 'center', valign: 'middle' },
            { title: '联系人', field: 'contact', align: 'center', valign: 'middle' },
            { title: '联系手机', field: 'mobile', align: 'center', valign: 'middle' },
            { title: 'email', field: 'email', align: 'center', valign: 'middle' },
            { title: '提交日期时间', field: 'createTime', align: 'center', valign: 'middle' },
            {
              title: '操作', field: 'id', align: 'center', valign: 'middle'
              , formatter: function (value, row, index) {
                var rows = JSON.stringify(row);
                var e = "<a href='javascript:;'  onclick='edit(" + rows + "," + index + ")'>批准</a> ";
                var d = " <a href='javascript:;'  onclick='del(" + rows + "," + index + ")'>删除</a>";
                return e + " | " + d;
              }
            }
          ]
        });

        $('#submit').on('click', function () {
          $("#alert").remove();
          if ($('input[name=mainUsername]').val() == "") {
            $('#myModal').prepend(
              '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<strong>请输入主账号!</strong> ' +
              '</div>'
            );
            return;
          }
          if ($('input[name=password]').val() == "") {
            $("#alert").remove();
            $('#myModal').prepend(
              '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<strong>请输入密码!</strong> ' +
              '</div>'
            );
            return;
          }
          $.ajax({
            type: 'post',
            url: '../../account/approval',
            data: {
              applyId: applyId
              , mainUsername: $('input[name=mainUsername]').val(), password: $('input[name=password]').val()            
},
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result > 0) {
                $('#myModal').modal('hide');
                $("#alert").remove();
                $('body').prepend(
                  '<div class="alert alert-success alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>设置成功!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alert").remove() }, 5000);
                $.ajax({
                  type: 'post',
                  url: '../../account/getApplyList',
                  data: { offset: 0, limit: 99999 },
                  dataType: 'json',
                  async: false,
                  success: function (result) {
                    $('#tab').bootstrapTable('load', result);
                  }
                });
              } else if (result == -2) {
                $("#alert").remove();
                $('#myModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>设置失败!该酒店名称已批准！</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alert").remove() }, 5000);
              } else if (result == -1) {
                $("#alert").remove();
                $('#myModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>设置失败!申请不存在！</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alert").remove() }, 5000);
              } else if (result == -4) {
                $("#alert").remove();
                $('#myModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>设置失败!该账号已存在！</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alert").remove() }, 5000);
              } else {
                $("#alert").remove();
                $('#myModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alert" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>设置失败！</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alert").remove() }, 5000);
              }
            }
          });
        });

        $('#submitDel').on('click', function () {
          console.info(applyIdDel);
          $.ajax({
            type: 'post',
            url: '../../account/removeApply',
            data: { applyId: applyIdDel },
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result > 0) {
                $('#tab').bootstrapTable('remove', {
                  field: 'applyId',
                  values: [applyIdDel]
                });
                $('#myDelModal').modal('hide');
                $('body').prepend(
                  '<div class="alert alert-success alert-dismissible" id="alertDel" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>删除成功!</strong>' +
                  '</div>'
                );
                setTimeout(function () { $("#alertDel").remove() }, 5000);
              } else {
                $("#alertDel").remove();
                $('#myDelModal').prepend(
                  '<div class="alert alert-warning alert-dismissible" id="alertDel" role="alert" style="text-align:center;position: fixed;top:0;width:100%;">' +
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                  '<strong>删除失败!</strong> ' +
                  '</div>'
                );
                setTimeout(function () { $("#alertDel").remove() }, 5000);
              }
            }
          });
        });

        $('#myModal').on('hidden.bs.modal', function (e) {
          $('input[name=mainUsername]').val('');
          $('input[name=password]').val('');
          //$("#alert").remove();
          applyId = "";
        });
        $('#myDelModal').on('hidden.bs.modal', function (e) {
          //$("#alertDel").remove();
          applyIdDel = "";
        });
        function edit(r, i) {
          //console.info(r);//obj
          //console.info(i);
          $("#alert").remove();
          $('#myModal').modal({
            backdrop: 'static', keyboard: false
          });
          applyId = r.applyId;
          hName = r.hotelName;
          $('input[name=hName]').val(hName);
        }
        function del(r, i) {
          console.info(r.applyId);
          console.info(i);
          $("#alertDel").remove();
          $('#myDelModal').modal({
            backdrop: 'static', keyboard: false
          });
          applyIdDel = r.applyId;
          index = i;
        }
      </script>
  </body>

  </html>