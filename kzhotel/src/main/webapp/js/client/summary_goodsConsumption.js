/**
 * @JSname:商品消费汇总表
 */
; (function () {
  "use strict";
  $('#tab_goodsConsumptionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_goodsConsumptionSummary,
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
          date: '总合计',
          consumeTotal: eapor.utils.compute("tab_goodsConsumptionSummary", "consumeTotal"),
          consumeAmount: eapor.utils.compute("tab_goodsConsumptionSummary", "consumeAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_goodsConsumptionSummary', 'date', 3, 0);
      }

    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'consumeTotal', title: "商品消费总数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "商品销售总金额", align: 'center', width: 20,
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
  $('#searchbydatetime_goodsConsumptionSummary').click(function () {

    if ($('#datetime_startGoodsConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endGoodsConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startGoodsConsumptionSummary = "";
    var paramDate_endGoodsConsumptionSummary = "";

    var searchloader_goodsConsumptionSummary = function (param, success, error) {
      $.ajax({
        url: "../report/getGoodsOrServiceConsumeSummary",
        data: { startTime: paramDate_startGoodsConsumptionSummary, endTime: paramDate_endGoodsConsumptionSummary, feeItemType: 2 },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_goodsConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_goodsConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_goodsConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startGoodsConsumptionSummary = new Date($('#datetime_startGoodsConsumptionSummary').datebox('getValue'));
    paramDate_endGoodsConsumptionSummary = new Date($('#datetime_endGoodsConsumptionSummary').datebox('getValue'));
    $('#tab_goodsConsumptionSummary').datagrid("options").loader = searchloader_goodsConsumptionSummary;
    $("#tab_goodsConsumptionSummary").datagrid("reload");
  });
  //生成Excel报表
  $('#createReport_goodsConsumptionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_goodsConsumptionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "商品消费汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
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

    var str = new CSV(csvData, { header: ["日期", "商品消费总数量", "商品销售总金额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();