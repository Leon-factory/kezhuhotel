/**
 *@JSname:库存
 */
~(function ($, eapor) {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layoutDiv_stockInventory");
  $('#si_search').click(function () {
    eapor.stockInventory.warehouseId = $('#si_stockName').combobox('getValue');
    eapor.stockInventory.goodsCategoryId = $('#si_goodsTypeName').combobox('getValue');
    eapor.stockInventory.goodsItemCode = $('#si_goodsName').combobox('getValue');
    eapor.stockInventory.alertType = $('#si_isWarning').combobox('getValue');

    if (eapor.stockInventory.goodsItemCode == "全部") {
      eapor.stockInventory.goodsItemCode = "";
    }

    eapor.stockInventory.loadFirstInfo();
  });

  //简讯
  $('#shortInfo_si').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    fit: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    singleSelect: false,	//只能单选
    //rownumbers : true,  //如果为true，则显示一个行号列.默认false
    columns: [[  //-----columns start-----
      { field: 'warehouseName', title: "库名", width: 20, align: 'center' },
      { field: 'goodsTypeName', title: "商品类别", width: 20, align: 'center' }
    ]]
  });
  //汇总
  $('#countInfo_si').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    fit: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    singleSelect: false,	//只能单选
    //rownumbers : true,  //如果为true，则显示一个行号列.默认false
    columns: [[  //-----columns start-----
      { field: 'goodsItemSummary', title: "商品品类汇总", width: 20, align: 'center' },
      { field: 'storeNumberSummary', title: "库存数量汇总", width: 20, align: 'center' },
      {
        field: 'storeAmountSummary', title: "库存金额汇总", width: 20, align: 'center',
        formatter: function (value, row, index) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'averagePurchasePrice', title: "库存均价", width: 20, align: 'center',
        formatter: function (value, row, index) {
          return NP.divide(value, 100).toFixed(2) + "元";
        }
      }
    ]]
  });
  //明细设置
  $('#currentStock').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    fit: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    singleSelect: true,	//只能单选
    rownumbers: true,  //如果为true，则显示一个行号列.默认false
    columns: [[
      { field: 'goodsId', title: "商品编号", width: 20, align: 'center', hidden: true },

      { field: 'goodsItemCode', title: "商品名称", width: 20, align: 'center' },
      { field: 'storeNumber', title: "库存数量", width: 20, align: 'center' },
      {
        field: 'alertType', title: "库存状态", width: 20, align: 'center',
        formatter: function (value) {
          if (value == 1) {
            return "<span style='color:red;'>库存低！</span>";
          } else if (value == 2) {
            return "库存正常";
          } else {
            return value;
          }
        }
      },
      {
        field: 'latestPurchasePrice', title: "最新进价", width: 20, align: 'center',
        formatter: function (value, row, index) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'storeAmount', title: "库存金额", width: 20, align: 'center',
        formatter: function (value, row, index) {
          return NP.divide(value, 100) + "元";
        }
      }
    ]],
    onLoadError: function () {
      $.messager.alert('温馨提示', '数据加载失败!');
    }
  });

  //生成库存报告btn
  $('#showReportForExcel_inventoryStock').on('click', function () {
    var aLink = this;
    var data = {
      stockName: $('#shortInfo_si').datagrid('getRows')[0].warehouseName,
      type: $('#shortInfo_si').datagrid('getRows')[0].goodsTypeName,
      date: getDate(new Date()),
      userName: $('#indexusername').val(),
      numberCount: $('#countInfo_si').datagrid('getRows')[0].storeNumberSummary,
      amountCount: $('#countInfo_si').datagrid('getRows')[0].storeAmountSummary,
      list: $('#currentStock').datagrid('getRows')
    };

    var csvName = "库存_" + data.stockName + "_" + data.type + "_" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    if (data.list.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成库存报告失败！无数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    var tit = "库存_" + data.stockName + "_" + data.type + "_" + getDateForHoliday(new Date()) + "_" + $('#indexusername').val();
    var arr = [];
    arr.push(tit);
    csvData.push(
      ["序号", "商品名称", "库存数量", "库存状态", "最新进价", "库存金额"]
    );
    var num = 0;
    var amo = 0;
    for (let i = 0; i < data.list.length; i++) {
      var alertType = "";
      if (data.list[i].alertType == 2) {
        alertType = "库存正常";
      } else {
        alertType = "库存低！";
      }

      csvData.push(
        [
          (i + 1),
          data.list[i].goodsItemCode,
          data.list[i].storeNumber,
          alertType,
          NP.divide(data.list[i].latestPurchasePrice, 100) + "元",
          NP.divide(data.list[i].storeAmount, 100) + "元"
        ]
      );
      num += data.list[i].storeNumber;
      amo += NP.divide(data.list[i].storeAmount, 100);
    }
    csvData.push(
      [
        '汇总',
        '——',
        num,
        '——',
        '——',
        amo + "元"
      ]
    );
    var str = new CSV(csvData, { header: arr }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
  //打印库存报告btn
  $('#printReport_inventoryStock').click(function () {
    var data = {
      stockName: $('#shortInfo_si').datagrid('getRows')[0].warehouseName,
      type: $('#shortInfo_si').datagrid('getRows')[0].goodsTypeName,
      date: getDate(new Date()),
      userName: $('#indexusername').val(),
      numberCount: $('#countInfo_si').datagrid('getRows')[0].storeNumberSummary,
      amountCount: $('#countInfo_si').datagrid('getRows')[0].storeAmountSummary,
      list: $('#currentStock').datagrid('getRows')
    }
    console.info(data);
    eapor.stockInventory.printReportCallBack(data);
  });

  $('#si_stockName').combobox({
    valueField: 'warehouseId',
    textField: 'warehouseName',
    url: '../warehouse/listWarehouse',
    queryParams: {
    	offset: 0,
    	limit: 99999999,
    	warehouseId: 0
    },
    editable: false,
    panelMaxHeight: 200,
    panelHeight: "auto",
    onLoadSuccess: function (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isPrimary == 1) {
          $(this).combobox('setValue', data[i].warehouseId);
          $(this).combobox('setText', data[i].warehouseName);
        }
      }
    },
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        if (data.length > 0) {
          data.unshift({ warehouseId: 0, warehouseName: "全部" });
          return data;
        }
      }
      return data;
    }
  });
  //商品类别
  $('#si_goodsTypeName').combobox({
    valueField: 'goodsCategoryId',
    textField: 'goodsCategoryName',
    url: '../Goodscategory/listGoodscategoryPage',
    queryParams: { offset: 0, limit: 99999, goodsCategoryName: "" },
    panelMaxHeight: 200,
    editable: false,
    panelHeight: "auto",
    /*onShowPanel:function(){
      $(this).combobox('reload');
    },*/
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        if (data[0].goodsCategoryId == 0) {
          $(this).combobox('setValue', data[0].goodsCategoryId);
          $(this).combobox('setText', data[0].goodsCategoryName);
        }
      }
    },
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        if (data.length > 0 && data[0].goodsCategoryId != 0) {
          data.unshift({ goodsCategoryId: 0, goodsCategoryName: "全部" });
          return data;
        }
      }
      return data;
    }
  });
  //商品名称
  $('#si_goodsName').combobox({
    valueField: 'goodsItemCode',
    textField: 'goodsItemCode',
    url: '../Goods/listGoodsPage',
    queryParams: {
      offset: 0,
      limit: 9999,
      goodsName: "",
      goodsCategoryId: 0,
      saleState: 1//经营状态   1上架 2下架  0全部
    },
    panelMaxHeight: 200,
    panelHeight: "auto",
    onLoadSuccess: function (data) {
      $(this).combobox('setValue', "");
      $(this).combobox('setText', "全部");
    }
  });
  //是否警示
  $('#si_isWarning').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{ 'id': 0, 'text': '全部' }, { 'id': 1, 'text': '报警' }, { 'id': 2, 'text': '不报警' }],
    panelMaxHeight: 200,
    editable: false,
    panelHeight: "auto",
    onLoadSuccess: function (data) {
      $(this).combobox('setValue', 0);
      $(this).combobox('setText', "全部");
    }
  });

  eapor.stockInventory = {
    warehouseId: 1,
    goodsCategoryId: 0,
    goodsItemCode: '',
    alertType: 0,
    init: function () {
      //this.loadFirstInfo();
    },
    loadFirstInfo: function () {
      var This = this;
      var gtx = $('#si_goodsTypeName').combobox('getText');
      if (gtx == "") {
        gtx = "全部";
      }
      var shortInfo = {
        warehouseName: $('#si_stockName').combobox('getText'),
        goodsTypeName: gtx
      };
      var arrShortInfo = [];
      arrShortInfo.push(shortInfo);
      console.info(arrShortInfo)
      $('#shortInfo_si').datagrid('loadData', arrShortInfo);
      $('#shortInfo_si').datagrid('reload');

      console.info(This.warehouseId);
      console.info(This.goodsCategoryId);
      console.info(This.goodsItemCode);
      console.info(This.alertType);

      if (This.goodsCategoryId == "") {
        This.goodsCategoryId = 0;
      }
      $.ajax({
        type: 'post',
        url: '../warehouse/getGoodsStoreSummary',
        //库房id//商品类别id,0为全部//商品名称//报警   0不报警，1库存底，2库存正常
        data: {
          warehouseId: This.warehouseId, goodsCategoryId: This.goodsCategoryId
          , goodsItemCode: This.goodsItemCode, alertType: This.alertType
        },
        dataType: "json",
        success: function (result) {
          console.info(result);
          if (eapor.utils.ajaxCallBackErrInfo(result)) {
            $('#countInfo_si').datagrid('loadData', { total: 0, rows: [] });
            return;
          }
          $('#countInfo_si').datagrid('loadData', result);
          $('#countInfo_si').datagrid('reload');
        }
      });
      $.ajax({
        type: 'post',
        url: '../warehouse/getGoodsStoreDetailList',
        //库房id//商品类别id,0为全部//商品名称//报警   0不报警，1库存底，2库存正常
        data: {
          warehouseId: This.warehouseId, goodsCategoryId: This.goodsCategoryId
          , goodsItemCode: This.goodsItemCode, alertType: This.alertType
        },
        dataType: "json",
        success: function (result) {
          console.info(result);
          if (eapor.utils.ajaxCallBackErrInfo(result)) {
            $('#currentStock').datagrid('loadData', { total: 0, rows: [] });
            return;
          }
          $('#currentStock').datagrid('loadData', result);
          $('#currentStock').datagrid('reload');
        }
      });
    },
    //打印库存报告
    printReportCallBack: function (result) {
      console.info(result);
      var info = result.list;
      var title = "库存报告_" + result.stockName + "_" + result.type + "_" + result.date + "_" + result.userName;
      $('#reportTitle_inventoryStockReport').html(title);
      $('#inventoryStockPrintTbody').empty();
      var alertType = "";
      for (let i = 0; i < info.length; i++) {
        console.info(info[i].alertType)
        if (info[i].alertType == 2) {
          alertType = "库存正常";
        } else {
          alertType = "库存低！";
        }
        $('#inventoryStockPrintTbody').append(
          '<tr>' +
          '<td scope="row" style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          (i + 1) +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].goodsItemCode +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].storeNumber +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          alertType +
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].latestPurchasePrice, 100) + "元" +
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].storeAmount, 100) + "元" +
          '</td>' +
          '</tr>'
        );
      };

      $('#inventoryStockPrintTbody').append(
        '<tr>' +
        '<td scope="row" style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '汇总' +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        result.numberCount +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        NP.divide(result.amountCount, 100) + '元' +
        '</td>' +
        '</tr>'
      );
      var popTitle = "库存报告_" + result.stockName + "_" + result.type + "_" + result.date;
      $("div#inventoryReportPrint").printArea({ popTitle: popTitle, mode: 'popup' });

    }
  };
  eapor.stockInventory.init();
})(window.jQuery, window.eapor);