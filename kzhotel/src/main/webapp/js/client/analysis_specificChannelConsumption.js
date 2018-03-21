//报表--》分析--》特定客源消费分析
~(function () {
  "use strict";
  $('#tab_specificChannelConsumptionAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_specificChannelConsumptionAnalysis,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        var givenpropValue = 0;
        var givenChannelAmount = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "givenChannelAmount");
        var consumeAmount = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "consumeAmount");
        if (givenChannelAmount == 0) {
          givenpropValue = 0;
        } else if (consumeAmount == 0) {
          givenpropValue = 0;
        } else {
          givenpropValue = givenChannelAmount / consumeAmount;
        }

        var givenRentPropValue = 0;
        var givenRent = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "givenRent");
        var rent = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "rent");
        if (givenRent == 0) {
          givenRentPropValue = 0;
        } else if (rent == 0) {
          givenRentPropValue = 0;
        } else {
          givenRentPropValue = givenRent / rent;
        }

        var givenGoodsPropValue = 0;
        var givenGoods = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "givenGoods");
        var goods = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "goods");
        if (givenGoods == 0) {
          givenGoodsPropValue = 0;
        } else if (goods == 0) {
          givenGoodsPropValue = 0;
        } else {
          givenGoodsPropValue = givenGoods / goods;
        }

        var givenServicePropValue = 0;
        var givenService = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "givenService");
        var service = eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "service");
        if (givenService == 0) {
          givenServicePropValue = 0;
        } else if (service == 0) {
          givenServicePropValue = 0;
        } else {
          givenServicePropValue = givenService / service;
        }

        $(this).datagrid('appendRow', {
          accountDate: '总合计',
          consumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "consumeAmount"),
          rentConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "rentConsumeAmount"),
          goodsConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "goodsConsumeAmount"),
          serviceConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "serviceConsumeAmount"),
          specifyConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount"),
          proportion: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "consumeAmount") === 0 ? 0 : eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount") /
            eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "consumeAmount"),
          specifyRentConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyRentConsumeAmount"),
          rentProportion: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount") === 0 ? 0 : eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyRentConsumeAmount") /
            eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount"),
          specifyGoodsConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyGoodsConsumeAmount"),
          goodsProportion: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount") === 0 ? 0 : eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyGoodsConsumeAmount") /
            eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount"),
          specifyServiceConsumeAmount: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyServiceConsumeAmount"),
          serviceProportion: eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount") === 0 ? 0 : eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyServiceConsumeAmount") /
            eapor.utils.compute("tab_specificChannelConsumptionAnalysis", "specifyConsumeAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_specificChannelConsumptionAnalysis', 'accountDate', 13, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'accountDate', title: "日期", align: 'center', width: 20 },
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
        field: 'specifyConsumeAmount', title: "特定客源消费总金额", align: 'center', width: 25,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'proportion', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'specifyRentConsumeAmount', title: "其中房费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'rentProportion', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {//.toFixed(2)
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'specifyGoodsConsumeAmount', title: "其中商品消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'goodsProportion', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      },
      {
        field: 'specifyServiceConsumeAmount', title: "其中服务消费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'serviceProportion', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      }
    ]]
  });

  //客源下拉框
  $('#selectChannel_specificChannelConsumptionAnalysis').combobox({
    url: '../channel/pglist',
    queryParams: { offset: 0, limit: 9999, channelName: '', usageState: 1 },
    valueField: 'channelId',
    textField: 'channelName',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    editable: false,
    /*onShowPanel:function(){
    $(this).combobox('reload');
  },
  loadFilter:function(data){
    data.unshift({channelId:0,channelName:"全部"});
    return data;
  },*/
    onLoadSuccess: function (data) {
      if (data != -3333 && data != -3335) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].channelId);
          $(this).combobox('setText', data[0].channelName);
        }
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_specificChannelConsumptionAnalysis').click(function () {

    if ($('#datetime_startSpecificChannelConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endSpecificChannelConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startSpecificChannelConsumptionAnalysis = "";
    var paramDate_endSpecificChannelConsumptionAnalysis = "";
    var selectChannel_specificChannelConsumptionAnalysis = "";
    var selectSourceGroupId_specificChannelConsumptionAnalysis = "";

    var searchloader_specificChannelConsumptionAnalysis = function (param, success, error) {
      $.ajax({
        url: "../report/getconsumesummaryforsource",
        data: {
          start: paramDate_startSpecificChannelConsumptionAnalysis, stop: paramDate_endSpecificChannelConsumptionAnalysis
          , channelId: selectChannel_specificChannelConsumptionAnalysis, sourceGroupId: selectSourceGroupId_specificChannelConsumptionAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_specificChannelConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_specificChannelConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_specificChannelConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startSpecificChannelConsumptionAnalysis = $('#datetime_startSpecificChannelConsumptionAnalysis').datebox('getValue');
    paramDate_endSpecificChannelConsumptionAnalysis = $('#datetime_endSpecificChannelConsumptionAnalysis').datebox('getValue');
    selectChannel_specificChannelConsumptionAnalysis = $('#selectChannel_specificChannelConsumptionAnalysis').combobox('getValue');
    if (selectChannel_specificChannelConsumptionAnalysis == 0) {
      selectSourceGroupId_specificChannelConsumptionAnalysis = 0;
    } else {
      $.each($('#selectChannel_specificChannelConsumptionAnalysis').combobox('getData'), function (i, item) {
        if (item.channelId == selectChannel_specificChannelConsumptionAnalysis) {
          selectSourceGroupId_specificChannelConsumptionAnalysis = item.sourceGroupId;
          return;
        }
      });
    }
    console.info(selectSourceGroupId_specificChannelConsumptionAnalysis)
    $('#tab_specificChannelConsumptionAnalysis').datagrid("options").loader = searchloader_specificChannelConsumptionAnalysis;
    $("#tab_specificChannelConsumptionAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_specificChannelConsumptionAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_specificChannelConsumptionAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "特定客源消费分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].accountDate,
          data[i].consumeAmount,
          NP.divide(data[i].rentConsumeAmount, 100) + "元",
          NP.divide(data[i].goodsConsumeAmount, 100) + "元",
          NP.divide(data[i].serviceConsumeAmount, 100) + "元",
          NP.divide(data[i].specifyConsumeAmount, 100) + "元",
          data[i].proportion + "%",
          NP.divide(data[i].specifyRentConsumeAmount, 100) + "元",
          data[i].rentProportion + "%",
          NP.divide(data[i].specifyGoodsConsumeAmount, 100) + "元",
          data[i].goodsProportion + "%",
          NP.divide(data[i].specifyServiceConsumeAmount, 100) + "元",
          data[i].serviceProportion + "%"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "消费总金额", "其中房费", "期中商品消费", "其中服务消费", "特定客源消费总金额", "占比统计", "其中房费", "占比统计", "其中商品消费", "占比统计", "其中服务消费", "占比统计"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();