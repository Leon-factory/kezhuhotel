/**
 * @JSname:会员结账汇总表JS
 */
; (function () {
  "use strict";
  $('#tab_memberClosingSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_memberClosingSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_memberClosingSummary').datagrid('appendRow', {
          checkoutDate: '总合计',
          checkoutCount: eapor.utils.compute("tab_memberClosingSummary", "checkoutCount"),
          consumeAmount: eapor.utils.compute("tab_memberClosingSummary", "consumeAmount"),
          rentConsumeAmount: eapor.utils.compute("tab_memberClosingSummary", "rentConsumeAmount"),
          goodsConsumeAmount: eapor.utils.compute("tab_memberClosingSummary", "goodsConsumeAmount"),
          serviceConsumeAmount: eapor.utils.compute("tab_memberClosingSummary", "serviceConsumeAmount"),
          banquetConsumeAmount: eapor.utils.compute("tab_memberClosingSummary", "banquetConsumeAmount"),
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_memberClosingSummary', 'checkoutDate', 6, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'channelCreditAmount', title: "channelCreditAmount", align: 'center', width: 20, hidden: true },
      { field: 'payAmount', title: "payAmount", align: 'center', width: 20, hidden: true },

      { field: 'checkoutDate', title: "日期", align: 'center', width: 20 },
      { field: 'checkoutCount', title: "结账数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 20,
        formatter(value) {
          return value ? NP.divide(value, 100) + '元' : 0;
        }
      },
      {
        field: 'rentConsumeAmount', title: "其中房费", align: 'center', width: 20,
        formatter(value) {
          return value ? NP.divide(value, 100) + '元' : 0;
        }
      },
      {
        field: 'goodsConsumeAmount', title: "其中商品消费", align: 'center', width: 20,
        formatter(value) {
          return value ? NP.divide(value, 100) + '元' : 0;
        }
      },
      {
        field: 'serviceConsumeAmount', title: "其中服务消费", align: 'center', width: 20,
        formatter(value) {
          return value ? NP.divide(value, 100) + '元' : 0;
        }
      },
      {
        field: 'banquetConsumeAmount', title: "其中餐宴消费", align: 'center', width: 20,
        formatter(value) {
          return value ? NP.divide(value, 100) + '元' : 0;
        }
      }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_memberClosingSummary').click(function () {
    if ($('#datetime_startMemberClosingSummary').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endMemberClosingSummary').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startMemberClosingSummary = "";
    var paramDate_endMemberClosingSummary = "";

    var searchloader_memberClosingSummary = function (param, success, error) {
      $.ajax({
        url: '../report/getmembercheckoutpaymentsummaryreport',
        data: { startDate: paramDate_startMemberClosingSummary, stopDate: paramDate_endMemberClosingSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_memberClosingSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_memberClosingSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_memberClosingSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startMemberClosingSummary = $('#datetime_startMemberClosingSummary').datebox('getValue');
    paramDate_endMemberClosingSummary = $('#datetime_endMemberClosingSummary').datebox('getValue');
    $('#tab_memberClosingSummary').datagrid("options").loader = searchloader_memberClosingSummary;
    $("#tab_memberClosingSummary").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_memberClosingSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_memberClosingSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员结账汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    var checkoutDate = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i].checkoutDate != "总合计") {
        checkoutDate = data[i].checkoutDate;
      } else {
        checkoutDate = "总合计";
      }
      csvData.push(
        [
          checkoutDate,
          data[i].checkoutCount,
          NP.divide(data[i].consumeAmount, 100) + "元",
          NP.divide(data[i].rentConsumeAmount, 100) + "元",
          NP.divide(data[i].goodsConsumeAmount, 100) + "元",
          NP.divide(data[i].serviceConsumeAmount, 100) + "元",
          NP.divide(data[i].banquetConsumeAmount, 100) + "元",
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "结账数量", "消费总金额", "其中房费", "其中商品消费", "其中服务消费", "其中餐宴消费"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();