/**
 *@JS名称：入库报告 
 *说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockInReport");
  var onlySelectedOneRowFlag = 0;
  //明细
  $('#detailsInfo_stockInReport').datagrid({
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
        eapor.stockInReport.rowSelect_stockInReport = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockInReport.rowSelect_stockInReport = null;
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

      if (rowData != eapor.stockInReport.rowSelect_stockInReport) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        eapor.stockInReport.rowSelect_stockInReport = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        eapor.stockInReport.rowSelect_stockInReport = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    columns: [[
      { field: 'ck', title: "", checkbox: true },
      { field: 'warehouseId', title: "warehouseId", align: 'center', width: 20, hidden: true },
      { field: 'totalAmount', title: "totalAmount", align: 'center', width: 20, hidden: true },
      { field: 'remark', title: "remark", align: 'center', width: 20, hidden: true },
      { field: 'operationUserId', title: "operatorUserId", align: 'center', width: 20, hidden: true },
      { field: 'inCode', title: "inCode", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'goodsinId', title: "goodsinId", align: 'center', width: 20, hidden: true },

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
      { field: 'operationUsername', title: "入库人", align: 'center', width: 20 },
      {
        field: 'inTime', title: "入库日期时间", align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      }
    ]]
  });
  //确定btn
  $('#search_stockInReport').click(function () {
    eapor.stockInReport.warehouseName = $('#selectWarehouse_stockInReport').combobox('getText');
    if (eapor.stockInReport.warehouseName == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择库名！', timeout: 2000, showType: 'slide' });
      return;
    }
    var startTime = $('#selectStartTime_stockInReport').datebox('getValue');
    if (startTime == "") {
      startTime = null;
    }
    var endTime = $('#selectEndTime_stockInReport').datebox('getValue');
    if (endTime == "") {
      endTime = null;
    }
    var data = {
      warehouseId: $('#selectWarehouse_stockInReport').combobox('getValue'),//库房id
      startTime: startTime,//startTime,//起始日期时间,为null则不限制,yyyy-MM-dd HH:mm:ss
      stopTime: endTime//endTime//截止日期时间,为null则不限制
    };
    eapor.utils.defaultAjax('../warehouse/getGoodsinCount', data, eapor.stockInReport.getGoodsinCountCallBack);
  });
  //显示入库报告单
  $('#show_stockInReport').click(function () {
    var getSelected = $('#detailsInfo_stockInReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    eapor.utils.defaultAjax('../warehouse/getGoodsinDetailList', { goodsinId: getSelected.goodsinId }, eapor.stockInReport.showReportCallBack);
  });
  //导出入库报告
  $('#saveForExcel_StockInReport').on('click', function () {
    var aLink = this;
    var getSelected = $('#detailsInfo_stockInReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      dataType: "json",
      url: '../print/printInWarehouse',
      data: { goodsinId: getSelected.goodsinId, warehouseId: getSelected.warehouseId }
    })
      .done(function (result) {
        var info = result.gds;
        var csvName = "入库报告_" + result.warehouseName + "_" + result.date + ".csv";
        aLink.download = csvName;
        var csvData = [];
        var tit = "入库报告_" + result.warehouseName + "_" + result.date + "_" + result.handlerName;
        var arr = [];
        arr.push(tit);
        csvData.push(
          ["序号", "商品类别", "商品名称", "供应商", "入库数量", "进价", "入库金额", "备注"]
        );
        var num = 0;
        var amo = 0;
        for (let i = 0; i < info.length; i++) {
          csvData.push(
            [
              (i + 1),
              info[i].goodsCategoryName,
              info[i].goodsItemCode,
              info[i].supplierName,
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
      });
  });
  //打印入库报告单
  $('#print_stockInReport').click(function () {
    var getSelected = $('#detailsInfo_stockInReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项入库报告信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: '../print/printInWarehouse',
      data: { goodsinId: getSelected.goodsinId, warehouseId: getSelected.warehouseId },
      dataType: "json",
    })
      .done(function (result) {
        eapor.stockInReport.printReportCallBack(result);
      });
  });


  eapor.stockInReport = {
    warehouseName: "",
    rowSelect_stockInReport: null,
    searchLoadArr: [],
    init: function () {
      var data = {
        warehouseId: $('#selectWarehouse_stockInReport').combobox('getValue'),//库房id
        startTime: null,
        stopTime: null
      };
      eapor.utils.defaultAjax('../warehouse/getGoodsinCount', data, this.getGoodsinCountCallBack);
    },
    getGoodsinCountCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_stockInReport').pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: function (pageNumber, pageSize) {
          if (pageNumber == 0) {
            return;
          }
          var data = {};
          data = eapor.stockInReport.getPrame();
          data.offset = pageSize * (pageNumber - 1);
          data.limit = pageSize;
          eapor.utils.defaultAjax('../warehouse/getGoodsinList', data, eapor.stockInReport.loadInReportListCallback);
        }
      });

      var page = $('#page_stockInReport').pagination('options');
      var data = eapor.stockInReport.getPrame();
      data.offset = 0;
      data.limit = page.pageSize;
      eapor.utils.defaultAjax('../warehouse/getGoodsinList', data, eapor.stockInReport.loadInReportListCallback);
    },
    /*分页按钮*/
    loadInReportListCallback: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      eapor.stockInReport.searchLoadArr = result;
      if (result.length == 0) {
        $('#detailsInfo_stockInReport').datagrid('loadData', []);
        eapor.utils.messagerInfoBySearchEmpty('detailsInfo_stockInReport', 'warehouseName', 3, 0);
        $('#detailsInfo_stockInReport').parent().find('.datagrid-cell-check').parent().css('display', 'none');
      } else {
        $('#detailsInfo_stockInReport').datagrid('options').loader = eapor.stockInReport.searchLoader_stockInReport;
        $('#detailsInfo_stockInReport').datagrid('reload');
      }
    },
    searchLoader_stockInReport: function (param, success, error) {
      if (eapor.stockInReport.searchLoadArr.length == 0) {
        success([]);
        return true;
      }
      if (!$.isEmptyObject(eapor.stockInReport.searchLoadArr)) {
        success(eapor.stockInReport.searchLoadArr);
        return true;
      }
    },
    /*获取头部搜索栏信息*/
    getPrame: function () {
      var data = {};
      var selectWarehouse = $('#selectWarehouse_stockInReport').combobox('getValue');
      if (selectWarehouse == "") {
        selectWarehouse = 1;
      }
      data.warehouseId = selectWarehouse;

      var selectStartTime = $('#selectStartTime_stockInReport').combobox('getValue');
      if (selectStartTime == "") {
        selectStartTime = null;
      }
      data.startTime = selectStartTime;

      var selectEndTime = $('#selectEndTime_stockInReport').combobox('getValue');
      if (selectEndTime == "") {
        selectEndTime = null;
      }
      data.stopTime = selectEndTime;

      return data;
    },
    //显示具体入库明细
    showReportCallBack: function (result) {
      $('#showReportList_stockInReport').append(
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
          { field: 'goodsinId', title: "goodsinId", align: 'center', width: 20, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
          { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
          { field: 'operatorUserId', title: "operatorUserId", align: 'center', width: 20, hidden: true },
          { field: 'supplierId', title: "supplierId", align: 'center', width: 20, hidden: true },

          { field: 'supplierName', title: "供应商", align: 'center', width: 30 },
          { field: 'goodsCategoryName', title: "商品类别", align: 'center', width: 20 },
          { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
          { field: 'number', title: "数量", align: 'center', width: 15 },
          { field: 'unitName', title: "单位", align: 'center', width: 15 },
          {
            field: 'purchasePrice', title: "进价", align: 'center', width: 15,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'amount', title: "入库金额", align: 'center', width: 15,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'inTime', title: "入库时间", align: 'center', width: 40,
            formatter: function (value) {
              return getDate(value);
            }
          },
          { field: 'operatorUsername', title: "入库操作者", align: 'center', width: 20 },
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
        }],
        onClose: function () {
          $(this).dialog('destroy');
        }
      });
    },
    //打印入库单回调函数
    printReportCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      var info = result.gds;
      var title = "入库报告_" + result.warehouseName + "_" + result.date + "_" + result.handlerName;
      $('#reportTitle_inStockReportPrint').html(title);
      $('#tbody_inStockReportPrint').empty();
      var totalPurchasePrice = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
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
          info[i].supplierName +
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
        totalPurchasePrice += (info[i].number);
        totalAmount += NP.divide(info[i].amount, 100);
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
      var popTitle = "入库报告_" + result.warehouseName + "_" + result.date;
      $("div#inStockReportPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    },
    //搜索提交的回调函数
    search_stockInReportCallBack: function (result) {
      for (let i = 0; i < result.length; i++) {
        result[i].warehouseName = eapor.stockInReport.warehouseName;
      }
      $('#detailsInfo_stockInReport').datagrid('loadData', result);
      $('#detailsInfo_stockInReport').datagrid('reload');
    }
  };


  $('#selectWarehouse_stockInReport').combobox({
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
      if (data[0].warehouseId !== 0) {
        data.unshift({ warehouseId: 0, warehouseName: '全部' });
      }
      return data;
    }
  });
  $('#selectStartTime_stockInReport').datebox({
    editable: false
  });
  $('#selectEndTime_stockInReport').datebox({
    editable: false
  });

  //stockInReport.init();
  $('#page_stockInReport').pagination({
    total: 0,
    loading: true,
    showRefresh: false,
    pageSize: 10,
  });
})();