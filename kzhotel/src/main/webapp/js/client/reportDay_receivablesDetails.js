/**
 *@JSname:应收款明细日报
 */
~(function () {
  "use strict";
  $('#tab_receivablesDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_receivablesDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_receivablesDetails').datagrid('appendRow', {
          guestName: '总合计',
          phone: "",
          receptionCode: "",
          channelName: "",
          saler: "",
          amount: eapor.utils.compute("tab_receivablesDetails", 'amount'),
          createTime: "",
          createUsername: ""
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_receivablesDetails', 'guestName', 8, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'receptionId', title: "receptionId", align: 'center', width: 20, hidden: true },
      { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },
      { field: 'paymentId', title: "paymentId", align: 'center', width: 20, hidden: true },
      { field: 'paymethodId', title: "paymethodId", align: 'center', width: 20, hidden: true },
      { field: 'paymethodName', title: "paymethodName", align: 'center', width: 20, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'billType', title: "billType", align: 'center', width: 20, hidden: true },
      { field: 'billId', title: "billId", align: 'center', width: 20, hidden: true },
      { field: 'billCode', title: "billCode", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'phone', title: "宾客手机", align: 'center', width: 20 },
      { field: 'receptionCode', title: "宾客账簿", align: 'center', width: 20 },
      { field: 'channelName', title: "客源单位", align: 'center', width: 20 },
      { field: 'saler', title: "客户经理", align: 'center', width: 20 },
      {
        field: 'amount', title: "应收款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'createTime', title: "日期时间", align: 'center', width: 20,
        formatter: function (value) {
          console.info(value);
          if (!value) {
            return "";
          } else {
            return getDate(value);
          }
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });
  //搜索按钮
  $('#searchbydatetime_receivablesDetails').click(function () {

    if ($('#datetime_receivablesDetails').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_receivablesDetails = "";

    var searchloader_receivablesDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getchannelpaymentdailyreport",
        data: { date: paramDate_receivablesDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_receivablesDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_receivablesDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_receivablesDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          success(data);
          return true;
        }
        , error: function (err) {
          alert(err);
        }
      });
    };

    paramDate_receivablesDetails = new Date($('#datetime_receivablesDetails').datebox('getValue'));
    $('#tab_receivablesDetails').datagrid("options").loader = searchloader_receivablesDetails;
    $("#tab_receivablesDetails").datagrid("reload");
  });

  //生成报表
  $('#createReport_receivablesDetails').on('click', function () {
    var aLink = this;
    var data = $('#tab_receivablesDetails').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "应收款明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].guestName,
          data[i].phone,
          data[i].receptionCode,
          data[i].channelName,
          data[i].saler,
          NP.divide(data[i].amount, 100) + "元",
          getDate(data[i].createTime),
          data[i].createUsername
        ]
      );
    }

    var str = new CSV(csvData, { header: ["宾客姓名", "宾客手机", "宾客账簿", "客源单位", "客户经理", "应收款金额", "日期时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();