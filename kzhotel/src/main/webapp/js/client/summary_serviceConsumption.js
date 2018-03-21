/**
 * @JSname:服务消费汇总表
 */
; (function () {
  "use strict";
  $('#tab_serviceConsumptionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_serviceConsumptionSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $(this).datagrid('appendRow', {
          date: '合计',
          consumeTotal: eapor.utils.compute("tab_serviceConsumptionSummary", "consumeTotal"),
          consumeAmount: eapor.utils.compute("tab_serviceConsumptionSummary", "consumeAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_serviceConsumptionSummary', 'date', 3, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'consumeTotal', title: "服务消费总数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "服务销售总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_serviceConsumptionSummary').click(function () {
    if ($('#datetime_startServiceConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endServiceConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startServiceConsumptionSummary = "";
    var paramDate_endServiceConsumptionSummary = "";

    var searchloader_serviceConsumptionSummary = function (param, success, error) {
      $.ajax({
        url: "../report/getGoodsOrServiceConsumeSummary",
        data: { startTime: paramDate_startServiceConsumptionSummary, endTime: paramDate_endServiceConsumptionSummary, feeItemType: 3 },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_serviceConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_serviceConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_serviceConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startServiceConsumptionSummary = new Date($('#datetime_startServiceConsumptionSummary').datebox('getValue'));
    paramDate_endServiceConsumptionSummary = new Date($('#datetime_endServiceConsumptionSummary').datebox('getValue'));
    $('#tab_serviceConsumptionSummary').datagrid("options").loader = searchloader_serviceConsumptionSummary;
    $("#tab_serviceConsumptionSummary").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_serviceConsumptionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_serviceConsumptionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "服务消费汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          data[i].consumeTotal,
          NP.divide(data[i].consumeAmount, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "服务消费总数量", "服务销售总金额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();