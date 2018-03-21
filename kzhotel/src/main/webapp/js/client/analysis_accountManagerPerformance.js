/**
 *@JSname:报表--》分析--》客户经理业绩分析
 */
~(function () {
  "use strict";
  $('#tab_accountManagerPerformanceAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_accountManagerPerformanceAnalysis,
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
          billCount: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "billCount"),
          consumeAmount: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "consumeAmount"),
          rent: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "rent"),
          goods: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "goods"),
          service: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "service"),
          pay: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "pay"),
          sign: eapor.utils.compute("tab_accountManagerPerformanceAnalysis", "sign")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_accountManagerPerformanceAnalysis', 'date', 8, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'billCount', title: "结账数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'rent', title: "其中房费", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'goods', title: "其中商品消费", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'service', title: "其中服务消费", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'pay', title: "其中支付结账", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'sign', title: "其中签单结账", align: 'center', width: 20,
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
  //客户经理下拉框
  $('#selectSalerUser_accountManagerPerformanceAnalysis').combobox({
    url: "../user/ujlist",
    queryParams: { offset: 0, limit: 9999, maxUserId: 9999, usergroupId: 0, username: "" },
    valueField: 'userId',
    textField: 'username',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].userId);
        $(this).combobox('setText', data[0].username);
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_accountManagerPerformanceAnalysis').click(function () {
    if ($('#datetime_startAccountManagerPerformanceAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endAccountManagerPerformanceAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#selectSalerUser_accountManagerPerformanceAnalysis').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择客户经理！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startAccountManagerPerformanceAnalysis = "";
    var paramDate_endAccountManagerPerformanceAnalysis = "";
    var selectSalerUser_accountManagerPerformanceAnalysis = "";

    var searchloader_accountManagerPerformanceAnalysis = function (param, success, error) {
      $.ajax({
        url: "../report/getManagerAchievementSummary",
        data: {
          start: paramDate_startAccountManagerPerformanceAnalysis, stop: paramDate_endAccountManagerPerformanceAnalysis
          , salerUserId: selectSalerUser_accountManagerPerformanceAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_accountManagerPerformanceAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_accountManagerPerformanceAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_accountManagerPerformanceAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startAccountManagerPerformanceAnalysis = new Date($('#datetime_startAccountManagerPerformanceAnalysis').datebox('getValue'));
    paramDate_endAccountManagerPerformanceAnalysis = new Date($('#datetime_endAccountManagerPerformanceAnalysis').datebox('getValue'));
    selectSalerUser_accountManagerPerformanceAnalysis = $('#selectSalerUser_accountManagerPerformanceAnalysis').combobox('getValue');
    $('#tab_accountManagerPerformanceAnalysis').datagrid("options").loader = searchloader_accountManagerPerformanceAnalysis;
    $("#tab_accountManagerPerformanceAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_accountManagerPerformanceAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_accountManagerPerformanceAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "客户经理业绩分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          data[i].billCount,
          NP.divide(data[i].consumeAmount, 100) + "元",
          NP.divide(data[i].rent, 100) + "元",
          NP.divide(data[i].goods, 100) + "元",
          NP.divide(data[i].service, 100) + "元",
          NP.divide(data[i].pay, 100) + "元",
          NP.divide(data[i].sign, 100) + "元"
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