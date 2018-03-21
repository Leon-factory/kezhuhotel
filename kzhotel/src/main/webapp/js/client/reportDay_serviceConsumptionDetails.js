/**
 *@JSname:服务消费明细日报
 */
~(function () {
  "use strict";
  $('#tab_serviceConsumptionDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_serviceConsumptionDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'receptionCode', title: "账单ID", align: 'center', width: 35 },
      { field: 'feeItemCode', title: "服务名称", align: 'center', width: 20 },
      {
        field: 'salePrice', title: "销售单价", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'number', title: "加单数量", align: 'center', width: 20 },
      {
        field: 'amount', title: "销售合价", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },

      {
        field: 'accountTime', title: "加单时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'createUsername', title: "加单操作员", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_serviceConsumptionDetails').click(function () {

    if ($('#datetime_serviceConsumptionDetails').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_serviceConsumptionDetails = "";

    var searchloader_serviceConsumptionDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getsingleconsumesumarydailyreport",
        data: { accountDate: paramDate_serviceConsumptionDetails, feeItemType: 3 },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_serviceConsumptionDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_serviceConsumptionDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_serviceConsumptionDetails', 'guestName', 8, 0);
            return true;
          }
          if (data == "") {
            $('#tab_serviceConsumptionDetails').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_serviceConsumptionDetails = new Date($('#datetime_serviceConsumptionDetails').datebox('getValue'));
    $('#tab_serviceConsumptionDetails').datagrid("options").loader = searchloader_serviceConsumptionDetails;
    $("#tab_serviceConsumptionDetails").datagrid("reload");
  });

  //生成报表
  $('#createReport_serviceConsumptionDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_serviceConsumptionDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "服务消费明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].guestName,
          rows[i].receptionCode,
          rows[i].feeItemCode,
          NP.divide(rows[i].salePrice, 100) + "元",
          rows[i].number,
          NP.divide(rows[i].amount, 100) + "元",
          getDate(rows[i].accountTime),
          rows[i].createUsername
        ]
      );
    }
    var str = new CSV(csvData, { header: ["宾客姓名", "账单ID", "服务名称", "销售单价", "加单数量", "销售合价", "加单时间", "加单操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });

})();