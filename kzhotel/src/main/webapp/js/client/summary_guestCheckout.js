/**
 * @JSname:宾客结账汇总表
 */
; (function () {
  "use strict";
  $('#tab_guestCheckoutSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_guestCheckoutSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_guestCheckoutSummary').datagrid('appendRow', {
          checkoutDate: '总合计',
          checkoutCount: eapor.utils.compute("tab_guestCheckoutSummary", "checkoutCount"),
          consumeAmount: eapor.utils.compute("tab_guestCheckoutSummary", "consumeAmount"),
          rentConsumeAmount: eapor.utils.compute("tab_guestCheckoutSummary", "rentConsumeAmount"),
          banquetConsumeAmount: eapor.utils.compute("tab_guestCheckoutSummary", "banquetConsumeAmount"),
          goodsConsumeAmount: eapor.utils.compute("tab_guestCheckoutSummary", "goodsConsumeAmount"),
          serviceConsumeAmount: eapor.utils.compute("tab_guestCheckoutSummary", "serviceConsumeAmount"),
          payAmount: eapor.utils.compute("tab_guestCheckoutSummary", "payAmount"),
          channelCreditAmount: eapor.utils.compute("tab_guestCheckoutSummary", "channelCreditAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_guestCheckoutSummary', 'checkoutDate', 8, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'checkoutDate', title: "日期", align: 'center', width: 20 },
      { field: 'checkoutCount', title: "结账数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'rentConsumeAmount', title: "其中房费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'banquetConsumeAmount', title: "其中餐宴消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'goodsConsumeAmount', title: "其中商品消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'serviceConsumeAmount', title: "其中服务消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'payAmount', title: "其中支付结账", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'channelCreditAmount', title: "其中签单结账", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_guestCheckoutSummary').click(function () {
    if ($('#datetime_startGuestCheckoutSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endGuestCheckoutSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startGuestCheckoutSummary = "";
    var paramDate_endGuestCheckoutSummary = "";

    var searchloader_guestCheckoutSummary = function (param, success, error) {
      $.ajax({
        url: "../report/getcheckoutpaymentsummaryreport",
        data: { start: paramDate_startGuestCheckoutSummary, stop: paramDate_endGuestCheckoutSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_guestCheckoutSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_guestCheckoutSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_guestCheckoutSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startGuestCheckoutSummary = new Date($('#datetime_startGuestCheckoutSummary').datebox('getValue'));
    paramDate_endGuestCheckoutSummary = new Date($('#datetime_endGuestCheckoutSummary').datebox('getValue'));
    $('#tab_guestCheckoutSummary').datagrid("options").loader = searchloader_guestCheckoutSummary;
    $("#tab_guestCheckoutSummary").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_guestCheckoutSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_guestCheckoutSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "宾客结账汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].checkoutDate,
          data[i].checkoutCount,
          NP.divide(data[i].consumeAmount, 100) + "元",
          NP.divide(data[i].rentConsumeAmount, 100) + "元",
          NP.divide(data[i].banquetConsumeAmount, 100) + "元",
          NP.divide(data[i].goodsConsumeAmount, 100) + "元",
          NP.divide(data[i].serviceConsumeAmount, 100) + "元",
          NP.divide(data[i].payAmount, 100) + "元",
          NP.divide(data[i].channelCreditAmount, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "结账数量", "消费总金额", "其中房费", "其中商品消费", "其中服务消费", "其中支付结账", "其中签单结账"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();