/**
 *@JS名称：盘点报告 
 *说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockCheckReport");
  let rowSelect_stockCheckReport = null,
    onlySelectedOneRowFlag = 0;
  //明细
  $('#detailsInfo_stockCheckReport').datagrid({
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
        rowSelect_stockCheckReport = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_stockCheckReport = null;
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

      if (rowData != rowSelect_stockInReport) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_stockCheckReport = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_stockCheckReport = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    onLoadSuccess: function () {
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
    },
    columns: [[
      { field: 'ck', title: "", checkbox: true },
      { field: 'goodsItemCount', title: "goodsItemCount", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'inventoryCode', title: "inventoryCode", align: 'center', width: 20, hidden: true },
      { field: 'inventoryId', title: "inventoryId", align: 'center', width: 20, hidden: true },
      { field: 'operationUserId', title: "operationUserId", align: 'center', width: 20, hidden: true },
      { field: 'totalAmountChange', title: "totalAmountChange", align: 'center', width: 20, hidden: true },
      { field: 'totalNumberChange', title: "totalNumberChange", align: 'center', width: 20, hidden: true },
      { field: 'totalStoreAmountFinal', title: "totalStoreAmountFinal", align: 'center', width: 20, hidden: true },
      { field: 'warehouseId', title: "warehouseId", align: 'center', width: 20, hidden: true },

      { field: 'warehouseName', title: "库名 ", align: 'center', width: 20 },
      { field: 'operationUsername', title: "盘点人", align: 'center', width: 20 },
      {
        field: 'operationTime', title: "盘点日期时间", align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      }
    ]]
  });

  //显示盘点报告
  $('#show_stockCheckReport').click(function () {
    var getSelected = $('#detailsInfo_stockCheckReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    eapor.utils.defaultAjax('../warehouse/getInventoryDetailList', { inventoryId: getSelected.inventoryId }, eapor.stockCheckReport.showReportCallBack);
  });
  //导出盘点报告
  $('#showExcel_stockCheckReport').on('click', function () {
    var aLink = this;
    var getSelected = $('#detailsInfo_stockCheckReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: "../print/printInventory",
      dataType: "json",
      data: { inventoryId: getSelected.inventoryId, warehouseId: getSelected.warehouseId }
    })
      .done(function (result) {
        var info = result.ids;
        var csvName = "盘点报告_" + result.warehouseName + "_" + getDateForHoliday(result.date) + ".csv";
        aLink.download = csvName;
        console.info(aLink.download)
        // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
        var csvData = [];
        var tit = "盘点报告_" + result.warehouseName + "_" + getDateForHoliday(result.date) + "_" + result.handlerName;
        var arr = [];
        arr.push(tit);
        csvData.push(
          ["序号", "商品名称", "库存数量", "实际数量", "盘增/盘损数量", "最新进价", "盘增/盘损金额", "盘点后库存金额"]
        );
        var numa = 0;
        var numb = 0;
        var numc = 0;
        var numd = 0;
        var nume = 0;
        for (let i = 0; i < info.length; i++) {
          csvData.push(
            [
              (i + 1),
              info[i].goodsItemCode,
              info[i].storeNumber,
              info[i].storeNumberFinal,
              info[i].numberChange,
              NP.divide(info[i].latestPurchasePrice, 100) + "元",
              NP.divide(info[i].amountChange, 100) + "元",
              NP.divide(info[i].storeAmountFinal, 100) + "元"
            ]
          );
          numa += info[i].storeNumber;
          numb += info[i].storeNumberFinal;
          numc += info[i].numberChange;
          numd += NP.divide(info[i].amountChange, 100);
          nume += NP.divide(info[i].storeAmountFinal, 100);
        }
        csvData.push(
          [
            '汇总'
            , '——'
            , numa
            , numb
            , numc
            , '——'
            , numd + "元"
            , nume + "元"
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

  //打印盘点报告
  $('#print_stockCheckReport').click(function () {
    var getSelected = $('#detailsInfo_stockCheckReport').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (getSelected.warehouseName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项盘点的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: "post",
      url: "../print/printInventory",
      data: { inventoryId: getSelected.inventoryId, warehouseId: getSelected.warehouseId },
      dataType: "json"
    })
      .done(function (result) {
        eapor.stockCheckReport.printReportCallBack(result);
      });
  });

  $('#selectWarehouse_stockCheckReport').combobox({
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
    onChange: function (newValue, oldValue) {
      if (!eapor.stockCheckReport.changeFlag) return;
      var warehouseName = $(this).combobox('getText');
      if (oldValue != "" && eapor.stockCheckReport.changeFlag) {
        $.messager.confirm('系统提示', '是否要切换盘点库？', function (r) {
          if (r) {
            var data = {
              warehouseId: $('#selectWarehouse_stockCheckReport').combobox('getValue'),//库房id
              limit: 3
            };
            console.info(data);
            eapor.stockCheckReport.changeFlag = true;
            eapor.utils.defaultAjax('../warehouse/getLatestInventoryList', data, eapor.stockCheckReport.search_stockCheckReportCallBack);
          } else {
            var data = $('#selectWarehouse_stockCheckReport').combobox('getData');
            for (let i = 0; i < data.length; i++) {
              if (data[i].warehouseId == oldValue) {
                eapor.stockCheckReport.changeFlag = false;
                $('#selectWarehouse_stockCheckReport').combobox('setValue', oldValue);
                $('#selectWarehouse_stockCheckReport').combobox('setText', data[i].warehouseName);
                eapor.stockCheckReport.changeFlag = true;
                return;
              }
            }
          }
        });
      } else {
        console.info(999);
        var data = {
          warehouseId: $('#selectWarehouse_stockCheckReport').combobox('getValue'),//库房id
          limit: 3
        };
        console.info(data);
        eapor.stockCheckReport.changeFlag = true;
        eapor.utils.defaultAjax('../warehouse/getLatestInventoryList', data, eapor.stockCheckReport.search_stockCheckReportCallBack);
      }
    }
  });

  eapor.stockCheckReport = {
    warehouseName: "",
    changeFlag: true,
    init: function () {

    },
    //显示具体明细
    showReportCallBack: function (result) {
      console.info(result);
      $('#showReportList_stockCheckReport').append(
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
          { field: 'operationUserId', title: "operationUserId", align: 'center', width: 30, hidden: true },
          { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
          { field: 'inventoryId', title: "inventoryId", align: 'center', width: 20, hidden: true },
          { field: 'warehouseId', title: "warehouseId", align: 'center', width: 40, hidden: true },
          { field: 'inventoryDetailId', title: "inventoryDetailId", align: 'center', width: 20, hidden: true },

          { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 25 },
          { field: 'storeNumber', title: "库存数量", align: 'center', width: 12 },
          { field: 'storeNumberFinal', title: "实际数量", align: 'center', width: 12 },
          { field: 'numberChange', title: "盘增/盘损数量", align: 'center', width: 18 },
          {
            field: 'latestPurchasePrice', title: "最新进价", align: 'center', width: 15,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'amountChange', title: "盘增/盘损金额 ", align: 'center', width: 18,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'storeAmount', title: "库存金额", align: 'center', width: 20, hidden: true,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          {
            field: 'storeAmountFinal', title: "盘点后库存金额", align: 'center', width: 20,
            formatter: function (value) {
              return NP.divide(value, 100) + "元";
            }
          },
          { field: 'operationUsername', title: "盘点人", align: 'center', width: 20 },
          {
            field: 'operationTime', title: "盘点时间", align: 'center', width: 30,
            formatter: function (value, row, index) {
              return getDate(value);
            }
          },
          { field: 'unitName', title: "单位", align: 'center', width: 15, hidden: true }
        ]]
      });
      $('#reportListTab').datagrid('loadData', result);
      $('#reportListTab').datagrid('reload');

      $('#div').dialog({
        title: '盘点详情',
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
    //导出盘点报告
    showExcelReportCallBack(result) {
      console.info(result);

    },
    //打印盘点单回调函数
    printReportCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      var info = result.ids;
      var title = "盘点报告_" + result.warehouseName + "_" + result.date + "_" + result.handlerName;
      $('#reportTitle_checkStockReport').html(title);
      $('#checkStockPrintTbody').empty();
      var totala = 0;
      var totalb = 0;
      var totalc = 0;
      var totald = 0;
      var totale = 0;
      for (let i = 0; i < info.length; i++) {
        $('#checkStockPrintTbody').append(
          '<tr>' +
          '<td scope="row" style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          (i + 1) +
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].goodsItemCode +//商品名称
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].storeNumber +//库存数量
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].storeNumberFinal +//实际数量
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          info[i].numberChange +//盘增/盘损数量
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].latestPurchasePrice, 100) + "元" +//最新进价
          '</td>' +
          '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].amountChange, 100) + "元" +//盘增/盘损金额
          '</td>' +
          '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
          'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
          NP.divide(info[i].storeAmountFinal, 100) + "元" +//盘点后库存金额
          '</td>' +
          '</tr>'
        );
        totala += (info[i].storeNumber);
        totalb += (info[i].storeNumberFinal);
        totalc += (info[i].numberChange);
        totald += NP.divide(info[i].amountChange, 100);
        totale += NP.divide(info[i].storeAmountFinal, 100);
      };

      $('#checkStockPrintTbody').append(
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
        totala +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totalb +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totalc +
        '</td>' +
        '<td style="height:30px; text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totald + '元' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        totale + '元' +
        '</td>' +
        '</tr>'
      );
      var popTitle = "盘点报告_" + result.warehouseName + "_" + result.date;
      $("div#checkReportPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    },
    //搜索提交的回调函数
    search_stockCheckReportCallBack: function (result) {
      console.info(result);
      if (result.length == 0) {
        $('#detailsInfo_stockCheckReport').datagrid('loadData', []);
        eapor.utils.messagerInfoBySearchEmpty('detailsInfo_stockCheckReport', 'warehouseName', 3, 0);
        console.info($('#detailsInfo_stockCheckReport').parent().find('td:eq(0)'))
        $('#detailsInfo_stockCheckReport').parent().find('.datagrid-cell-check').parent().css('display', 'none');
      } else {
        $('#detailsInfo_stockCheckReport').datagrid('loadData', result);
        $('#detailsInfo_stockCheckReport').datagrid('reload');
      }
    }
  };
})();