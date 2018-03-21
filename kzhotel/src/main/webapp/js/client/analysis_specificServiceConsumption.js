//报表--》分析--》特定服务消费分析
~(function () {
  "use strict";
  $('#tab_specificServiceConsumptionAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_specificServiceConsumptionAnalysis,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        var totalpropValue = 0;
        var givenTotal = eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "givenTotal");
        var consumeTotal = eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "consumeTotal");
        if (givenTotal == 0) {
          totalpropValue = 0;
        } else if (consumeTotal == 0) {
          consumeTotal = 0;
        } else {
          totalpropValue = givenTotal / consumeTotal;
        }

        var amountpropValue = 0;
        var givenAmount = eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "givenAmount");
        var consumeAmount = eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "consumeAmount");
        if (givenAmount == 0) {
          amountpropValue = 0;
        } else if (givenAmount == 0) {
          amountpropValue = 0;
        } else {
          amountpropValue = givenAmount / consumeAmount;
        }

        $(this).datagrid('appendRow', {
          date: '总合计',
          consumeTotal: eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "consumeTotal"),
          consumeAmount: eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "consumeAmount"),
          givenTotal: eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "givenTotal"),
          totalprop: totalpropValue,
          givenAmount: eapor.utils.compute("tab_specificServiceConsumptionAnalysis", "givenAmount"),
          amountprop: amountpropValue
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_specificServiceConsumptionAnalysis', 'date', 7, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'consumeTotal', title: "服务消费总数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "服务消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          }
          return NP.divide(value, 100) + "元";

        }
      },
      { field: 'givenTotal', title: "其中特定服务消费总数量", align: 'center', width: 20 },
      {
        field: 'totalprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'givenAmount', title: "其中特定服务消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'amountprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      }
    ]]
  });
  //商品下拉框
  $('#selectService_specificServiceConsumptionAnalysis').combobox({
    url: '../Serviceitem/listServiceitemPage',
    queryParams: { serviceItemName: '', serviceTypeId: 0, offset: 0, limit: 9999 },
    valueField: 'serviceItemCode',
    textField: 'serviceItemCode',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].serviceItemCode);
        $(this).combobox('setText', data[0].serviceItemCode);
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_specificServiceConsumptionAnalysis').click(function () {

    if ($('#datetime_startSpecificServiceConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endSpecificServiceConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startSpecificServiceConsumptionAnalysis = "";
    var paramDate_endSpecificServiceConsumptionAnalysis = "";
    var selectService_specificServiceConsumptionAnalysis = "";

    var searchloader_specificServiceConsumptionAnalysis = function (param, success, error) {
      $.ajax({
        url: "../report/givenGoodsOrServiceAnalysis",
        data: {
          startTime: paramDate_startSpecificServiceConsumptionAnalysis, endTime: paramDate_endSpecificServiceConsumptionAnalysis
          , feeItemType: 3, consumeCode: selectService_specificServiceConsumptionAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_specificServiceConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_specificServiceConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_specificServiceConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startSpecificServiceConsumptionAnalysis = new Date($('#datetime_startSpecificServiceConsumptionAnalysis').datebox('getValue'));
    paramDate_endSpecificServiceConsumptionAnalysis = new Date($('#datetime_endSpecificServiceConsumptionAnalysis').datebox('getValue'));
    selectService_specificServiceConsumptionAnalysis = $('#selectService_specificServiceConsumptionAnalysis').combobox('getValue');
    $('#tab_specificServiceConsumptionAnalysis').datagrid("options").loader = searchloader_specificServiceConsumptionAnalysis;
    $("#tab_specificServiceConsumptionAnalysis").datagrid("reload");
  });
  //生成Excel报表
  $('#createReport_specificServiceConsumptionAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_specificServiceConsumptionAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "特定服务消费分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          data[i].consumeTotal,
          NP.divide(data[i].consumeAmount, 100) + "元",
          data[i].givenTotal,
          (data[i].totalprop * 100).toFixed(2) + "%",
          NP.divide(data[i].givenAmount, 100) + "元",
          (data[i].amountprop * 100).toFixed(2) + "%"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "服务消费总数量", "服务消费总金额", "其中特定服务消费总数量", "占比统计", "其中特定服务消费总金额", "占比统计"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();