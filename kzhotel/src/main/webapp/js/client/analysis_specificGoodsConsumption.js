//报表--》分析--》特定商品消费分析
~(function () {
  "use strict";
  $('#tab_specificGoodsConsumptionAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_specificGoodsConsumptionAnalysis,
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
        var givenTotal = eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "givenTotal");
        var consumeTotal = eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "consumeTotal");
        if (givenTotal == 0) {
          totalpropValue = 0;
        } else if (consumeTotal == 0) {
          consumeTotal = 0;
        } else {
          totalpropValue = givenTotal / consumeTotal;
        }

        var amountpropValue = 0;
        var givenAmount = eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "givenAmount");
        var consumeAmount = eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "consumeAmount");
        if (givenAmount == 0) {
          amountpropValue = 0;
        } else if (givenAmount == 0) {
          amountpropValue = 0;
        } else {
          amountpropValue = givenAmount / consumeAmount;
        }

        $(this).datagrid('appendRow', {
          date: '总合计',
          consumeTotal: eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "consumeTotal"),
          consumeAmount: eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "consumeAmount"),
          givenTotal: eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "givenTotal"),
          totalprop: totalpropValue,
          givenAmount: eapor.utils.compute("tab_specificGoodsConsumptionAnalysis", "givenAmount"),
          amountprop: amountpropValue
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_specificGoodsConsumptionAnalysis', 'date', 7, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'consumeTotal', title: "商品消费总数量", align: 'center', width: 20 },
      {
        field: 'consumeAmount', title: "商品消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'givenTotal', title: "其中特定商品消费总数量", align: 'center', width: 20 },
      {
        field: 'totalprop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'givenAmount', title: "其中特定商品消费总金额", align: 'center', width: 20,
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
  $('#selectGoods_specificGoodsConsumptionAnalysis').combobox({
    url: "../Goods/listGoodsPage",
    queryParams: { offset: 0, limit: 9999, goodsName: '', saleState: 0, goodsCategoryId: 0 },
    valueField: 'goodsItemCode',
    textField: 'goodsItemCode',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].goodsItemCode);
        $(this).combobox('setText', data[0].goodsItemCode);
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_specificGoodsConsumptionAnalysis').click(function () {
    if ($('#datetime_startSpecificGoodsConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endSpecificGoodsConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startSpecificGoodsConsumptionAnalysis = "";
    var paramDate_endSpecificGoodsConsumptionAnalysis = "";
    var selectGoods_specificGoodsConsumptionAnalysis = "";

    var searchloader_specificGoodsConsumptionAnalysis = function (param, success, error) {
      $.ajax({
        url: "../report/givenGoodsOrServiceAnalysis",
        data: {
          startTime: paramDate_startSpecificGoodsConsumptionAnalysis, endTime: paramDate_endSpecificGoodsConsumptionAnalysis
          , feeItemType: 2, consumeCode: selectGoods_specificGoodsConsumptionAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_specificGoodsConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_specificGoodsConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_specificGoodsConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startSpecificGoodsConsumptionAnalysis = new Date($('#datetime_startSpecificGoodsConsumptionAnalysis').datebox('getValue'));
    paramDate_endSpecificGoodsConsumptionAnalysis = new Date($('#datetime_endSpecificGoodsConsumptionAnalysis').datebox('getValue'));
    selectGoods_specificGoodsConsumptionAnalysis = $('#selectGoods_specificGoodsConsumptionAnalysis').combobox('getValue');
    $('#tab_specificGoodsConsumptionAnalysis').datagrid("options").loader = searchloader_specificGoodsConsumptionAnalysis;
    $("#tab_specificGoodsConsumptionAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_specificGoodsConsumptionAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_specificGoodsConsumptionAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "特定商品消费分析：" + getDateForHoliday(new Date()) + ".csv";
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

    var str = new CSV(csvData, { header: ["日期", "商品消费总数量", "商品销售总金额", "其中特定商品消费总数量", "占比统计", "其中特定商品销售总金额", "占比统计"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();