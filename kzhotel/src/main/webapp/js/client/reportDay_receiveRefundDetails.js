/**
 *@JSname:收退款明细日报
 */
~(function () {
  "use strict";
  $('#tab_receiveRefundDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_receiveRefundDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----

      { field: 'billId', title: "billId", align: 'center', width: 20, hidden: true },
      { field: 'billType', title: "billType", align: 'center', width: 20, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'paymentId', title: "paymentId", align: 'center', width: 20, hidden: true },
      { field: 'paymethodId', title: "paymethodId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'billCode', title: "收退款ID", align: 'center', width: 20 },
      {
        field: 'amount', title: "收退款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'paymethodName', title: "方式", align: 'center', width: 20 },
      {
        field: 'createTime', title: "操作时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_receiveRefundDetails').click(function () {
    if ($('#datetime_receiveRefundDetails').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_receiveRefundDetails = "";

    var searchloader_receiveRefundDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getpaymentdailyreport",
        data: { date: paramDate_receiveRefundDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_receiveRefundDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_receiveRefundDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_receiveRefundDetails', 'guestName', 6, 0);
            return true;
          }
          if (data == "") {
            $('#tab_receiveRefundDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          //如果不是用的list方法，这里给json前后加变成数组放入
          success(data);
          return true;
        },
        error: function (err) {
          alert(err);
        }
      });
    };
    paramDate_receiveRefundDetails = new Date($('#datetime_receiveRefundDetails').datebox('getValue'));
    $('#tab_receiveRefundDetails').datagrid("options").loader = searchloader_receiveRefundDetails;
    $("#tab_receiveRefundDetails").datagrid("reload");
  });

  //生成报表
  $('#createReport_receiveRefundDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_receiveRefundDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "收退款明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].guestName,
          rows[i].billCode,
          NP.divide(rows[i].amount, 100) + "元",
          rows[i].paymethodName,
          getDate(rows[i].createTime),
          rows[i].createUsername
        ]
      );
    }
    var str = new CSV(csvData, { header: ["宾客姓名", "收退款ID", "收退款金额", "方式", "操作时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();