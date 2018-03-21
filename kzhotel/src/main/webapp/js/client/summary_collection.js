//报表-->汇总-->收款汇总表JS
~(function () {
  "use strict";
  $('#tab_collectionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_collectionSummary,
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
          allCollection: eapor.utils.compute("tab_collectionSummary", "allCollection"),
          cash: eapor.utils.compute("tab_collectionSummary", "cash"),
          unionPay: eapor.utils.compute("tab_collectionSummary", "unionPay"),
          alipay: eapor.utils.compute("tab_collectionSummary", "alipay"),
          weChatPay: eapor.utils.compute("tab_collectionSummary", "weChatPay"),
          remittance: eapor.utils.compute("tab_collectionSummary", "remittance"),
          check: eapor.utils.compute("tab_collectionSummary", "check")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_collectionSummary', 'date', 8, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'allCollection', title: "收款总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (value == undefined || value == "") {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'cash', title: "现金", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'unionPay', title: "银联POS刷卡", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'alipay', title: "支付宝", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },

      {
        field: 'weChatPay', title: "微信支付", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'remittance', title: "银行汇款", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'check', title: "支票", align: 'center', width: 20,
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
  $('#searchbydatetime_collectionSummary').click(function () {

    if ($('#datetime_startCollectionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endCollectionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startCollectionSummary = "";
    var paramDate_endCollectionSummary = "";

    var searchloader_collectionSummary = function (param, success, error) {
      console.info(paramDate_startCollectionSummary);
      console.info(paramDate_endCollectionSummary);
      $.ajax({
        url: "../report/RepPayment",
        data: { sdate: paramDate_startCollectionSummary, edate: paramDate_endCollectionSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_collectionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_collectionSummary').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_collectionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startCollectionSummary = new Date($('#datetime_startCollectionSummary').datebox('getValue'));
    paramDate_endCollectionSummary = new Date($('#datetime_endCollectionSummary').datebox('getValue'));
    $('#tab_collectionSummary').datagrid("options").loader = searchloader_collectionSummary;
    $("#tab_collectionSummary").datagrid("reload");
  });
  //生成Excel报表
  $('#exportCSV_collectionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_collectionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "收款汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].allCollection, 100) + "元",
          NP.divide(data[i].cash, 100) + "元",
          NP.divide(data[i].unionPay, 100) + "元",
          NP.divide(data[i].alipay, 100) + "元",
          NP.divide(data[i].weChatPay, 100) + "元",
          NP.divide(data[i].remittance, 100) + "元",
          NP.divide(data[i].check, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "收款总金额", "现金", "银联POS刷卡", "支付宝", "微信支付", "银行汇款", "支票"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();