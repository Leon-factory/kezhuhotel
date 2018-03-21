/**
 *JS名称：调拨报告 
 *说明：
 */
//明细
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockTransferReport");
  $('#selectWarehouseStart_stockTransferReport').combobox({
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
    onSelect: function (data) {
      $('#selectWarehouseEnd_stockTransferReport').combobox('setValue', "");
      $('#selectWarehouseEnd_stockTransferReport').combobox('setText', "");
    }
  });
  $('#selectWarehouseEnd_stockTransferReport').combobox({
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
    onSelect: function (data) {
      $('#selectWarehouseStart_stockTransferReport').combobox('setValue', "");
      $('#selectWarehouseStart_stockTransferReport').combobox('setText', "");
    }
  });
  $('#selectStartTime_stockTransferReport').datebox({
    editable: false
  });
  $('#selectEndTime_stockTransferReport').datebox({
    editable: false
  });
  $('#page_stockTransferReport').pagination({
    total: 0,
    loading: true,
    showRefresh: false,
    pageSize: 10,
    pageNumber: 1,
  });

  var onlySelectedOneRowFlag = 0;
  $('#detailsInfo_stockTransferReport').datagrid({
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
    onLoadSuccess: function (data) {
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
        eapor.stockTransferReport.rowSelect_stockTransferReport = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockTransferReport.rowSelect_stockTransferReport = null;
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

      if (rowData != eapor.stockTransferReport.rowSelect_stockTransferReport) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        eapor.stockTransferReport.rowSelect_stockTransferReport = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockTransferReport.rowSelect_stockTransferReport = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    columns: [[
      { field: 'ck', title: "", checkbox: true },
      { field: 'allotCode', title: "allotCode", align: 'center', width: 20, hidden: true },
      { field: 'allotId', title: "allotId", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'inwarehouseId', title: "inwarehouseId", align: 'center', width: 20, hidden: true },
      { field: 'operationUserId', title: "operationUserId", align: 'center', width: 20, hidden: true },
      { field: 'outwarehouseId', title: "outwarehouseId", align: 'center', width: 20, hidden: true },
      { field: 'remark', title: "remark", align: 'center', width: 20, hidden: true },

      { field: 'outwarehouseName', title: "起始库名", align: 'center', width: 20 },
      { field: 'inwarehouseName', title: "终点库 ", align: 'center', width: 20 },
      { field: 'operationUsername', title: "调拨人", align: 'center', width: 20 },
      {
        field: 'allotTime', title: "调拨日期时间", align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      }
    ]]
  });
  //确定btn
  $('#search_stockTransferReport').click(function () {
    eapor.stockTransferReport.warehouseNameStart = $('#selectWarehouseStart_stockTransferReport').combobox('getText');
    eapor.stockTransferReport.warehouseNameEnd = $('#selectWarehouseEnd_stockTransferReport').combobox('getText');
    if (eapor.stockTransferReport.warehouseNameStart == "" && eapor.stockTransferReport.warehouseNameEnd == "") {
      $.messager.show({ title: '系统提示', msg: '请选择要查询的库！', timeout: 2000, showType: 'slide' });
      return;
    }
    var startTime = $('#selectStartTime_stockTransferReport').datebox('getValue');
    if (startTime == "") {
      startTime = null;
    }
    var endTime = $('#selectEndTime_stockTransferReport').datebox('getValue');
    if (endTime == "") {
      endTime = null;
    }
    if (eapor.stockTransferReport.warehouseNameStart == "") {
      eapor.stockTransferReport.warehouseNameStart = 0;
    } else {
      eapor.stockTransferReport.warehouseNameStart = $('#selectWarehouseStart_stockTransferReport').combobox('getValue');
    }
    if (eapor.stockTransferReport.warehouseNameEnd == "") {
      eapor.stockTransferReport.warehouseNameEnd = 0;
    } else {
      eapor.stockTransferReport.warehouseNameEnd = $('#selectWarehouseEnd_stockTransferReport').combobox('getValue');
    }
    var data = {
      outwarehouseId: eapor.stockTransferReport.warehouseNameStart,//起点库
      inwarehouseId: eapor.stockTransferReport.warehouseNameEnd,//终点库
      startTime: startTime,//startTime,//起始日期时间,为null则不限制,yyyy-MM-dd HH:mm:ss
      stopTime: endTime//endTime//截止日期时间,为null则不限制
    };
    console.info(data);
    eapor.utils.defaultAjax('../warehouse/getAllotCount', data, eapor.stockTransferReport.getAllotCountCallBack);
  });
  //显示调拨报告
  $('#show_stockTransferReport').click(function () {
    var getSelected = $('#detailsInfo_stockTransferReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.outwarehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    eapor.utils.defaultAjax('../warehouse/getAllotDetailList', { allotId: getSelected.allotId }, eapor.stockTransferReport.showReportCallBack);
  });
  //导出调拨报告
  $('#saveForExcel_StockTransferReport').on('click', function () {
    var aLink = this;
    var getSelected = $('#detailsInfo_stockTransferReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.outwarehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: "../print/printAllot",
      dataType: "json",
      data: {
        allotId: getSelected.allotId,
        outwarehouseId: getSelected.outwarehouseId,
        inwarehouseId: getSelected.inwarehouseId
      }
    })
      .done(function (result) {
        var info = result.ads;
        var csvName = "调拨报告_" + result.startWarehouseName + "(起始)_" + result.endWarehouseName + "(终点)_" +
          result.date + "_" + result.handlerName + ".csv";
        aLink.download = csvName;
        // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
        var csvData = [];
        var tit = "调拨报告_" + result.startWarehouseName + "(起始)_" + result.endWarehouseName + "(终点)_" + result.date + "_" + result.handlerName;
        var arr = [];
        arr.push(tit);
        csvData.push(
          ["序号", "商品类别", "商品名称", "调拨数量", "最新进价", "调拨金额", "备注"]
        );
        var num = 0;
        var amo = 0;
        for (let i = 0; i < info.length; i++) {
          csvData.push(
            [
              (i + 1),
              info[i].goodsCategoryName,
              info[i].goodsItemCode,
              info[i].number,
              NP.divide(info[i].purchasePrice, 100) + "元",
              NP.divide(info[i].amount, 100) + "元",
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
          ]
        );
        var str = new CSV(csvData, { header: arr }).encode();
        str = encodeURIComponent(str);
        aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
        setTimeout(function () {
          $(aLink).removeAttr("href");
          $(aLink).removeAttr("download");
        }, 1000);
      })
  });
  //打印调拨报告
  $('#print_stockTransferReport').click(function () {
    var getSelected = $('#detailsInfo_stockTransferReport').datagrid('getSelected');
    console.info(getSelected);
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.outwarehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项调拨信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: "post",
      url: "../print/printAllot",
      data: { allotId: getSelected.allotId, outwarehouseId: getSelected.outwarehouseId, inwarehouseId: getSelected.inwarehouseId },
      dataType: "json"
    })
      .done(function (result) {
        eapor.stockTransferReport.printReportCallBack(result);
      });
  });


  eapor.stockTransferReport = {
    rowSelect_stockTransferReport: null,
    warehouseNameStart: "",
    warehouseNameEnd: "",
    searchLoadArr: [],
    init: function () {
      var data = {
        outwarehouseId: 0,//起点库
        inwarehouseId: 0,//终点库
        startTime: null,
        stopTime: null
      };
      eapor.utils.defaultAjax('../warehouse/getAllotCount', data, eapor.stockTransferReport.getAllotCountCallBack);
    },
    getAllotCountCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_stockTransferReport').pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        pageNumber: 1,
        onSelectPage: function (pageNumber, pageSize) {
          if (pageNumber == 0) {
            return;
          }
          var data = {};
          data = eapor.stockTransferReport.getPrame();
          data.offset = pageSize * (pageNumber - 1);
          data.limit = pageSize;
          console.info(pageSize)
          console.info(pageNumber)
          eapor.utils.defaultAjax('../warehouse/getAllotList', data, eapor.stockTransferReport.loadTransferReportListCallback);
        }
      });

      var page = $('#page_stockTransferReport').pagination('options');
      var data = eapor.stockTransferReport.getPrame();
      data.offset = 0;
      data.limit = page.pageSize;
      console.info(page.pageSize)
      eapor.utils.defaultAjax('../warehouse/getAllotList', data, eapor.stockTransferReport.loadTransferReportListCallback);
    },
    /*分页按钮*/
    loadTransferReportListCallback: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      eapor.stockTransferReport.searchLoadArr = result;
      if (result.length == 0) {
        console.info(122);
        $('#detailsInfo_stockTransferReport').datagrid('loadData', []);
        eapor.utils.messagerInfoBySearchEmpty('detailsInfo_stockTransferReport', 'outwarehouseName', 4, 0);
        $('#detailsInfo_stockTransferReport').parent().find('.datagrid-cell-check').parent().css('display', 'none');
      } else {
        $('#detailsInfo_stockTransferReport').datagrid('options').loader = eapor.stockTransferReport.searchLoader_stockTransferReport;
        $('#detailsInfo_stockTransferReport').datagrid('reload');
      }
    },
    searchLoader_stockTransferReport: function (param, success, error) {
      if (eapor.stockTransferReport.searchLoadArr.length == 0) {
        success([]);
        return true;
      }
      if (!$.isEmptyObject(eapor.stockTransferReport.searchLoadArr)) {
        success(eapor.stockTransferReport.searchLoadArr);
        return true;
      }
    },
    /*获取头部搜索栏信息*/
    getPrame: function () {
      var data = {};
      var selectWarehouseStart = $('#selectWarehouseStart_stockTransferReport').combobox('getValue');
      if (selectWarehouseStart == "") {
        selectWarehouseStart = 0;
      }
      data.outwarehouseId = selectWarehouseStart;
      var selectWarehouseEnd = $('#selectWarehouseEnd_stockTransferReport').combobox('getValue');
      if (selectWarehouseEnd == "") {
        selectWarehouseEnd = 0;
      }
      data.inwarehouseId = selectWarehouseEnd;
      var selectStartTime = $('#selectStartTime_stockTransferReport').combobox('getValue');
      if (selectStartTime == "") {
        selectStartTime = null;
      }
      data.startTime = selectStartTime;
      var selectEndTime = $('#selectEndTime_stockTransferReport').combobox('getValue');
      if (selectEndTime == "") {
        selectEndTime = null;
      }
      data.stopTime = selectEndTime;
      return data;
    },
    //显示具体入库明细
    showReportCallBack: function (result) {
      console.info(result);
      $('#showReportList_stockTransferReport').append(
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
          { field: 'allotCode', title: "allotCode ", align: 'center', width: 20, hidden: true },
          { field: 'allotDetailId', title: "allotDetailId ", align: 'center', width: 20, hidden: true },
          { field: 'allotId', title: "allotId ", align: 'center', width: 20, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
          { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
          { field: 'operatorUserId', title: "operatorUserId", align: 'center', width: 20, hidden: true },

          { field: 'goodsCategoryName', title: "商品类别", align: 'center', width: 20 },
          { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
          { field: 'number', title: "数量", align: 'center', width: 15 },
          { field: 'unitName', title: "单位", align: 'center', width: 15 },
          {
            field: 'purchasePrice', title: "销售单价", align: 'center', width: 15,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'amount', title: "调拨金额", align: 'center', width: 15,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          { field: 'operatorUsername', title: "调拨操作者", align: 'center', width: 20 },
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
      var popTitle = eapor.stockTransferReport.transferPrint(result);
      $("div#transferReportPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    },
    transferPrint: function (result) {
      var info = result.ads;
      var title = "调拨报告_" + result.startWarehouseName + "(起始)_" + result.endWarehouseName + "(终点)_" + result.date + "_" + result.handlerName;
      $('#reportTitle_transferReportStockReport').html(title);
      $('#transferReportStockPrintTbody').empty();
      var totalNumber = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
        $('#transferReportStockPrintTbody').append(
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
          NP.divide(info[i].purchasePrice, 100) + "元" +
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].amount, 100) + "元" +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].remark +
          '</td>' +
          '</tr>'
        );
        totalNumber += (info[i].number);
        totalAmount += NP.divide(info[i].amount, 100);
      };

      $('#transferReportStockPrintTbody').append(
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
        totalNumber +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totalAmount + '元' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '</tr>'
      );
      var popTitle = "调拨报告_" + result.startWarehouseName + "(起始)_" + result.endWarehouseName + "(终点)_" + result.date + "_" + result.handlerName;
      return popTitle;
    },
    //搜索提交的回调函数
    search_stockTransferReportCallBack: function (result) {
      console.info(result);
      $('#detailsInfo_stockTransferReport').datagrid('loadData', result);
      $('#detailsInfo_stockTransferReport').datagrid('reload');
    }
  };

})();