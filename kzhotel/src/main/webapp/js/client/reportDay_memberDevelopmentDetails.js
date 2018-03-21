/**
 *@JSname:会员发展明细日报
 */
~(function () {
  "use strict";
  $('#tab_memberDevelopmentDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_goodsConsumptionDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----

      { field: 'memberNickname', title: "会员姓名", align: 'center', width: 20 },
      { field: 'memberPhone', title: "会员手机", align: 'center', width: 20 },
      { field: 'inviterPhone', title: "会员发展人", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_memberDevelopmentDetails').click(function () {
    if ($('#datetime_memberDevelopmentDetails').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_memberDevelopmentDetails = "";

    var searchloader_memberDevelopmentDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getMemberInviteDailyReport",
        data: { date: paramDate_memberDevelopmentDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_memberDevelopmentDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_memberDevelopmentDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_memberDevelopmentDetails', 'memberNickname', 3, 0);
            return true;
          }
          if (data == "") {
            $('#tab_memberDevelopmentDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          //如果不是用的list方法，这里给json前后加变成数组放入
          success(data);
          return true;
        }
        , error: function (err) {
          alert(err);
        }
      });
    };
    paramDate_memberDevelopmentDetails = $('#datetime_memberDevelopmentDetails').datebox('getValue');
    $('#tab_memberDevelopmentDetails').datagrid("options").loader = searchloader_memberDevelopmentDetails;
    $("#tab_memberDevelopmentDetails").datagrid("reload");
  });

  //生成报表
  $('#createReport_memberDevelopmentDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_memberDevelopmentDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].memberNickname == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员发展明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].memberNickname,
          rows[i].memberPhone,
          rows[i].inviterPhone
        ]
      );
    }

    var str = new CSV(csvData, { header: ["会员姓名", "会员手机", "会员发展人"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();