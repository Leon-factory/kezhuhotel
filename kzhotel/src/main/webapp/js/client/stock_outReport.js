/**
 *JS名称：出库报告 
 *说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockOutReport");
  var onlySelectedOneRowFlag = 0;
  //明细
  $('#detailsInfo_stockOutReport').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    fit: true,
    rownumbers: true,
    checkOnSelect: false,
    singleSelect: true,
    data: [],
    onLoadSuccess: function () {
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
    },
    onClickRow: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag == 2) {
        onlySelectedOneRowFlag = 0;
        return;
      } else {
        onlySelectedOneRowFlag = 1;
      }

      var rows = $(this).datagrid('getChecked');
      var flag = true;
      for (let i = 0; i < rows.length; i++) {
        if (rowData == rows[i]) {
          flag = false;
          break;
        }
      }

      if (flag) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        eapor.stockOutReport.rowSelect_stockOutReport = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockOutReport.rowSelect_stockOutReport = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    onCheck: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag == 2) {
        return;
      }

      if (onlySelectedOneRowFlag == 1) {
        onlySelectedOneRowFlag = 0;
        return;
      } else {
        onlySelectedOneRowFlag = 2;
      }

      if (rowData != eapor.stockOutReport.rowSelect_stockOutReport) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        eapor.stockOutReport.rowSelect_stockOutReport = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockOutReport.rowSelect_stockOutReport = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    columns: [[
      { field: 'ck', title: "", checkbox: true },
      { field: 'warehouseId', title: "warehouseId", align: 'center', width: 20, hidden: true },
      { field: 'typeCode', title: "typeCode", align: 'center', width: 20, hidden: true },
      { field: 'outCode', title: "outCode", align: 'center', width: 20, hidden: true },
      { field: 'totalAmount', title: "totalAmount", align: 'center', width: 20, hidden: true },
      { field: 'remark', title: "remark", align: 'center', width: 20, hidden: true },
      { field: 'operationUserId', title: "operatorUserId", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'goodsoutId', title: "goodsinId", align: 'center', width: 20, hidden: true },
      { field: 'reference', title: "reference", align: 'center', width: 20, hidden: true },

      {
        field: 'warehouseName', title: "库名 ", align: 'center', width: 20,
        formatter: function (value, row, index) {
          $.each(eapor.hotel.getStockName, function (i, item) {
            if (item.warehouseId == row.warehouseId) {
              value = item.warehouseName;
            }
          })
          return value;
        }
      },
      { field: 'operationUsername', title: "出库人", align: 'center', width: 20 },
      {
        field: 'outTime', title: "入库日期时间", align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      }
    ]]
  });
  //确定btn
  $('#search_stockOutReport').click(function () {
    eapor.stockOutReport.warehouseName = $('#selectWarehouse_stockOutReport').combobox('getText');
    if (eapor.stockOutReport.warehouseName == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择库名！', timeout: 2000, showType: 'slide' });
      return;
    }
    var startTime = $('#selectStartTime_stockOutReport').datebox('getValue');
    if (startTime == "") {
      startTime = null;
    }
    var endTime = $('#selectEndTime_stockOutReport').datebox('getValue');
    if (endTime == "") {
      endTime = null;
    }
    var data = {
      warehouseId: $('#selectWarehouse_stockOutReport').combobox('getValue'),//库房id
      startTime: startTime,//startTime,//起始日期时间,为null则不限制,yyyy-MM-dd HH:mm:ss
      stopTime: endTime,//endTime//截止日期时间,为null则不限制
    };
    console.info(data);
    eapor.utils.defaultAjax('../warehouse/getGoodsoutCount', data, eapor.stockOutReport.getGoodsoutCountCallBack);
  });
  //显示出库单
  $('#show_stockOutReport').click(function () {
    var getSelected = $('#detailsInfo_stockOutReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    eapor.utils.defaultAjax('../warehouse/getGoodsoutDetailList', { goodsoutId: getSelected.goodsoutId }, eapor.stockOutReport.showReportCallBack);
  });
  //导出出库报告
  $('#saveForExcel_StockOutReport').on('click', function () {
    var aLink = this;
    var getSelected = $('#detailsInfo_stockOutReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      dataType: "json",
      url: '../print/printOutWarehouse',
      data: { goodsOutId: getSelected.goodsoutId, warehouseId: getSelected.warehouseId }
    })
      .done(function (result) {
        var info = result.gds;
        var csvName = "出库报告_" + result.warehouseName + "_" + result.date + ".csv";
        aLink.download = csvName;
        console.info(aLink.download)
        // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
        var csvData = [];
        var tit = "出库报告_" + result.warehouseName + "_" + result.date + "_" + result.handlerName;
        var arr = [];
        arr.push(tit);
        csvData.push(
          ["序号", "商品类别", "商品名称", "出库数量", "销售单价", "出库金额", "Reference", "备注"]
        );
        var num = 0;
        var amo = 0;

        for (let i = 0; i < info.length; i++) {
          var ref = "--";
          if (typeof info[i].reference !== 'undefined') {
            ref = info[i].reference;
          }
          csvData.push(
            [
              (i + 1),
              info[i].goodsCategoryName,
              info[i].goodsItemCode,
              info[i].number,
              NP.divide(info[i].salePrice, 100) + "元",
              NP.divide(info[i].amount, 100) + "元",
              ref,
              info[i].remark
            ]
          );
          num += (info[i].number);
          amo += NP.divide(info[i].amount, 100);
        }
        csvData.push(
          [
            '汇总'
            , '——'
            , '——'
            , num
            , '——'
            , amo + "元"
            , '——'
            , '——'
          ]
        );
        console.info(csvData)
        var str = new CSV(csvData, { header: arr }).encode();
        str = encodeURIComponent(str);
        aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
        setTimeout(function () {
          $(aLink).removeAttr("href");
          $(aLink).removeAttr("download");
        }, 1000);
      });
  });
  //打印出库单
  $('#print_stockOutReport').click(function () {
    var getSelected = $('#detailsInfo_stockOutReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项出库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: '../print/printOutWarehouse',
      data: { goodsOutId: getSelected.goodsoutId, warehouseId: getSelected.warehouseId },
      dataType: "json",
    })
      .done(function (result) {
        eapor.stockOutReport.printReportCallBack(result);
      });
  });


  eapor.stockOutReport = {
    warehouseName: "",
    rowSelect_stockOutReport: null,
    searchLoadArr: [],
    init: function () {
      var data = {
        warehouseId: $('#selectWarehouse_stockOutReport').combobox('getValue'),//库房id
        startTime: null,
        stopTime: null
      };
      console.info(data);
      eapor.utils.defaultAjax('../warehouse/getGoodsoutCount', data, eapor.stockOutReport.getGoodsoutCountCallBack);
    },
    getGoodsoutCountCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_stockOutReport').pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: function (pageNumber, pageSize) {
          if (pageNumber == 0) {
            return;
          }
          var data = {};
          data = eapor.stockOutReport.getPrame();
          data.offset = pageSize * (pageNumber - 1);
          data.limit = pageSize;
          eapor.utils.defaultAjax('../warehouse/getGoodsoutList', data, eapor.stockOutReport.loadOutReportListCallback);
        }
      });

      var page = $('#page_stockOutReport').pagination('options');
      var data = eapor.stockOutReport.getPrame();
      data.offset = 0;
      data.limit = page.pageSize;
      console.info(data);
      eapor.utils.defaultAjax('../warehouse/getGoodsoutList', data, eapor.stockOutReport.loadOutReportListCallback);
    },
    /*分页按钮*/
    loadOutReportListCallback: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      eapor.stockOutReport.searchLoadArr = result;
      if (result.length == 0) {
        console.info(122);
        $('#detailsInfo_stockOutReport').datagrid('loadData', []);
        eapor.utils.messagerInfoBySearchEmpty('detailsInfo_stockOutReport', 'warehouseName', 3, 0);
        $('#detailsInfo_stockOutReport').parent().find('.datagrid-cell-check').parent().css('display', 'none');
      } else {
        $('#detailsInfo_stockOutReport').datagrid('options').loader = eapor.stockOutReport.searchLoader_stockOutReport;
        $('#detailsInfo_stockOutReport').datagrid('reload');
      }
    },
    searchLoader_stockOutReport: function (param, success, error) {
      if (eapor.stockOutReport.searchLoadArr.length == 0) {
        success([]);
        return true;
      }
      if (!$.isEmptyObject(eapor.stockOutReport.searchLoadArr)) {
        console.info(eapor.stockOutReport.searchLoadArr);
        success(eapor.stockOutReport.searchLoadArr);
        return true;
      }
    },
    /*获取头部搜索栏信息*/
    getPrame: function () {
      var data = {};
      var selectWarehouse = $('#selectWarehouse_stockOutReport').combobox('getValue');
      if (selectWarehouse == "") {
        selectWarehouse = 1;
      }
      data.warehouseId = selectWarehouse;

      var selectStartTime = $('#selectStartTime_stockOutReport').combobox('getValue');
      if (selectStartTime == "") {
        selectStartTime = null;
      }
      data.startTime = selectStartTime;

      var selectEndTime = $('#selectEndTime_stockOutReport').combobox('getValue');
      if (selectEndTime == "") {
        selectEndTime = null;
      }
      data.stopTime = selectEndTime;

      return data;
    },
    //显示具体出库明细
    showReportCallBack: function (result) {
      console.info(result);
      $('#showReportList_stockOutReport').append(
        '<div id="div">' +
        '<table id="reportListTab"></table>' +
        '</div>'
      );
      $('#reportListTab').datagrid({
        title: '', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        fit: true,
        rownumbers: true,
        singleSelect: true,
        columns: [[
          { field: 'goodsCategoryId', title: "goodsCategoryId ", align: 'center', width: 20, hidden: true },
          { field: 'warehouseId', title: "warehouseId", align: 'center', width: 20, hidden: true },
          { field: 'goodsinDetailId', title: "goodsinDetailId", align: 'center', width: 20, hidden: true },
          { field: 'goodsoutId', title: "goodsinId", align: 'center', width: 20, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
          { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
          { field: 'operatorUserId', title: "operatorUserId", align: 'center', width: 20, hidden: true },
          { field: 'typeCode', title: "typeCode", align: 'center', width: 20, hidden: true },
          { field: 'purchasePrice', title: "purchasePrice", align: 'center', width: 20, hidden: true },

          /*{field : 'supplierName',title : "供应商",align : 'center',width:30},*/
          { field: 'goodsCategoryName', title: "商品类别", align: 'center', width: 20 },
          { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
          { field: 'number', title: "数量", align: 'center', width: 15 },
          { field: 'unitName', title: "单位", align: 'center', width: 15 },
          {
            field: 'salePrice', title: "销售单价", align: 'center', width: 15,
            formatter: function (value) {
              return value / 100 + "元";
            }
          },
          {
            field: 'amount', title: "出库金额", align: 'center', width: 15,
            formatter: function (value) {
              return value / 100 + "元";
            }
          },
          {
            field: 'outTime', title: "出库时间", align: 'center', width: 40,
            formatter: function (value) {
              return getDate(value);
            }
          },
          { field: 'operatorUsername', title: "出库操作者", align: 'center', width: 20 },
          { field: 'reference', title: "reference", align: 'center', width: 30 },
          { field: 'remark', title: "备注", align: 'center', width: 20 }
        ]]
      });
      $('#reportListTab').datagrid('loadData', result);
      $('#reportListTab').datagrid('reload');

      $('#div').dialog({
        title: '详情',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            $('#div').dialog('close');
          }
        }, {
          text: '取消',
          handler: function () {
            $('#div').dialog('close');
          }
        }],
        onClose: function () {
          $(this).dialog('destroy');
        }
      });
    },
    //打印入库单回调函数
    printReportCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      var info = result.gds;
      var title = "出库报告_" + result.warehouseName + "_" + result.date + "_" + result.handlerName;
      $('#reportTitle_outStockReport').html(title);
      $('#tbody_inStockReportPrint').empty();
      var totalPurchasePrice = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
        var reff = "——";
        if (typeof info[i].reference !== 'undefined') {
          reff = info[i].reference;
        }
        $('#tbody_inStockReportPrint').append(
          '<tr>' +
          '<td scope="row" style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          (i + 1) +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].goodsCategoryName +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].goodsItemCode +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].number +
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          (info[i].salePrice / 100) + "元" +
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          (info[i].amount / 100) + "元" +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          reff +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].remark +
          '</td>' +
          '</tr>'
        );
        totalPurchasePrice += (info[i].number);
        totalAmount += (info[i].amount / 100);
      };

      $('#tbody_inStockReportPrint').append(
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
        '——' +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totalPurchasePrice +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totalAmount + '元' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '</tr>'
      );
      var popTitle = "出库报告_" + result.warehouseName + "_" + result.date;
      $("div#outReportPrint").printArea({ popTitle: title, mode: 'popup' });

    },
    //搜索提交的回调函数
    search_stockOutReportCallBack: function (result) {
      console.info(result);
      for (let i = 0; i < result.length; i++) {
        result[i].warehouseName = eapor.stockOutReport.warehouseName;
      }
      $('#detailsInfo_stockOutReport').datagrid('loadData', result);
      $('#detailsInfo_stockOutReport').datagrid('reload');
    }
  };
  $('#selectWarehouse_stockOutReport').combobox({
    url: '../warehouse/listWarehouse',
    queryParams: {
    	offset: 0,
    	limit: 99999999,
    	warehouseId: 0
    },
    valueField: 'warehouseId',
    textField: 'warehouseName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
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
        if (data[0].warehouseId !== 0) {
          data.unshift({ warehouseId: 0, warehouseName: '全部' });
        }
      }
      return data;
    }
  });
  $('#selectStartTime_stockOutReport').datebox({
    editable: false
  });
  $('#selectEndTime_stockOutReport').datebox({
    editable: false
  });

  $('#page_stockOutReport').pagination({
    total: 0,
    loading: true,
    showRefresh: false,
    pageSize: 10,
    pageNumber: 1,
  });

})();