/**
 * @JSname:宾客消费汇总表
 */
; (function () {
  "use strict";
  $('#tab_guestConsumptionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_guestConsumptionSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        var rentpropValue = 0;
        var rent = eapor.utils.compute("tab_guestConsumptionSummary", "rent");
        var consumeAmount = eapor.utils.compute("tab_guestConsumptionSummary", "consumeAmount");
        if (rent == 0) {
          rentpropValue = 0;
        } else if (consumeAmount == 0) {
          rentpropValue = 0;
        } else {
          rentpropValue = rent / consumeAmount;
        }

        var banquetpropValue = 0;
        var banquet = eapor.utils.compute("tab_guestConsumptionSummary", "banquet");
        if (banquet == 0) {
          banquetpropValue = 0;
        } else if (consumeAmount == 0) {
          banquetpropValue = 0;
        } else {
          banquetpropValue = banquet / consumeAmount;
        }

        var goodspropValue = 0;
        var goods = eapor.utils.compute("tab_guestConsumptionSummary", "goods");
        if (goods == 0) {
          goodspropValue = 0;
        } else if (consumeAmount == 0) {
          goodspropValue = 0;
        } else {
          goodspropValue = goods / consumeAmount;
        }

        var servicepropValue = 0;
        var service = eapor.utils.compute("tab_guestConsumptionSummary", "service");
        if (service == 0) {
          servicepropValue = 0;
        } else if (consumeAmount == 0) {
          servicepropValue = 0;
        } else {
          servicepropValue = service / consumeAmount;
        }

        $(this).datagrid('appendRow', {
          date: '总合计',
          consumeAmount: eapor.utils.compute("tab_guestConsumptionSummary", "consumeAmount"),
          rent: eapor.utils.compute("tab_guestConsumptionSummary", "rent"),
          rentprop: rentpropValue,
          banquet: eapor.utils.compute("tab_guestConsumptionSummary", "banquet"),
          banquetprop: banquetpropValue,
          goods: eapor.utils.compute("tab_guestConsumptionSummary", "goods"),
          goodsprop: goodspropValue,
          service: eapor.utils.compute("tab_guestConsumptionSummary", "service"),
          serviceprop: servicepropValue
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_guestConsumptionSummary', 'date', 8, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'rent', title: "其中房费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'rentprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'banquet', title: "其中餐宴消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'banquetprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'goods', title: "其中商品消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'goodsprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'service', title: "其中服务消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'serviceprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_guestConsumptionSummary').click(function () {
    if ($('#datetime_startGuestConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endGuestConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startGuestConsumptionSummary = "";
    var paramDate_endGuestConsumptionSummary = "";

    var searchloader_guestConsumptionSummary = function (param, success, error) {
      $.ajax({
        url: "../report/getconsumedailyreport",
        data: { start: paramDate_startGuestConsumptionSummary, stop: paramDate_endGuestConsumptionSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_guestConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_guestConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_guestConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startGuestConsumptionSummary = $('#datetime_startGuestConsumptionSummary').datebox('getValue');
    paramDate_endGuestConsumptionSummary = $('#datetime_endGuestConsumptionSummary').datebox('getValue');
    $('#tab_guestConsumptionSummary').datagrid("options").loader = searchloader_guestConsumptionSummary;
    $("#tab_guestConsumptionSummary").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_guestConsumptionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_guestConsumptionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "宾客消费汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].consumeAmount, 100) + "元",
          NP.divide(data[i].rent, 100) + "元",
          (data[i].rentprop * 100).toFixed(2) + "%",
          NP.divide(data[i].banquet, 100) + "元",
          (data[i].banquetprop * 100).toFixed(2) + "%",
          NP.divide(data[i].goods, 100) + "元",
          (data[i].goodsprop * 100).toFixed(2) + "%",
          NP.divide(data[i].service, 100) + "元",
          (data[i].serviceprop * 100).toFixed(2) + "%"
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