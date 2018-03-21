/**
 * @名称：盘点JS
 * 说明：
 */
; (function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockCheck");

  //简讯
  $('#shortInfo_stockCheck').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    //rownumbers : true,
    columns: [[  //-----columns start-----
      { field: 'warehouseName', title: "库名", align: 'center', width: 20 },
      { field: 'userName', title: "盘点人", align: 'center', width: 20 }
    ]]
  });
  //汇总
  $('#countInfo_stockCheck').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    //rownumbers : true,
    columns: [[  //-----columns start-----
      { field: 'countTypeNumber', title: "商品品类汇总 ", align: 'center', width: 20 },
      { field: 'countChangeNumber', title: "盘增/盘损数量汇总", align: 'center', width: 20 },
      {
        field: 'countChangeAmount', title: "盘增/盘损金额汇总", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'countCheckAmount', title: "盘点后库存金额汇总", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      }
    ]]
  });

  //明细
  $('#detailsInfo_stockCheck').datagrid({
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

    columns: [[
      { field: 'ck', title: "", checkbox: true },
      { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
      { field: 'warehouseId', title: "warehouseId", align: 'center', width: 20, hidden: true },
      { field: 'unitName', title: "unitName", align: 'center', width: 20, hidden: true },
      { field: 'storeAmount', title: "storeAmount", align: 'center', width: 20, hidden: true },

      { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
      { field: 'storeNumber', title: "库存数量", align: 'center', width: 20 },
      { field: 'storeNumberFinal', title: "实际数量", align: 'center', width: 20 },
      { field: 'numberChange', title: "盘增/盘损数量", align: 'center', width: 20 },
      {
        field: 'latestPurchasePrice', title: "最新进价", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'amountChange', title: "盘增/盘损金额", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'storeAmountFinal', title: "盘点后库存金额", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      }
    ]]
  });
  //编辑
  $('#edit_stockCheck').on('click', function () {
    var getSelections = $('#detailsInfo_stockCheck').datagrid('getSelections');
    console.info(getSelections);
    if (getSelections.length != 1) {
      $.messager.show({ title: '系统提示', msg: '请选择一项要编辑的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#appendDiv_stockCheck').append(
      '<div id="div" style="padding:30px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="goodsName_stockCheck"  disabled style="width:200px;"' +
      'label="商品名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
      '</div>' +
      '<div>' +
      '<input id="iptGoodsNumber_stockCheck" style="width:200px;"' +
      'label="实际数量：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
      '</div>' +
      '</div>'
    );
    $('#goodsName_stockCheck').textbox({

    });
    $('#goodsName_stockCheck').textbox('setValue', getSelections[0].goodsItemCode);
    $('#iptGoodsNumber_stockCheck').numberbox({});
    $('#div').dialog({
      title: '请输入实际盘点数量',
      width: 300,
      height: 205,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var iptnumber = $('#iptGoodsNumber_stockCheck').combobox('getText');
          if (iptnumber == "") {
            $.messager.show({ title: '系统提示', msg: '输入的实际数量不能为空！', timeout: 2000, showType: 'slide' });
            return;
          };
          if (iptnumber < 0) {
            $.messager.show({ title: '系统提示', msg: '输入的实际数量不能小于0！', timeout: 2000, showType: 'slide' });
            return;
          }
          var getidx = $('#detailsInfo_stockCheck').datagrid('getRowIndex',
            getSelections[0]);
          if (getSelections.length != 0) {
            $('#detailsInfo_stockCheck').datagrid('clearChecked');
          }
          var addData = {
            goodsId: getSelections[0].goodsId,
            warehouseId: getSelections[0].warehouseId,
            unitName: getSelections[0].unitName,
            storeAmount: getSelections[0].storeAmount,
            goodsItemCode: getSelections[0].goodsItemCode,
            storeNumber: getSelections[0].storeNumber,
            storeNumberFinal: iptnumber,
            numberChange: (iptnumber - getSelections[0].storeNumber),
            latestPurchasePrice: getSelections[0].latestPurchasePrice,
            amountChange: ((iptnumber - getSelections[0].storeNumber) * getSelections[0].latestPurchasePrice),
            storeAmountFinal: (iptnumber * getSelections[0].latestPurchasePrice)
          };
          $('#detailsInfo_stockCheck').datagrid('updateRow', {
            index: getidx,
            row: addData
          });
          stockCheck.setcountInfoDatagridValue();
          $('#div').dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  });
  //确定生成盘点报告
  $('#submit_stockCheck').click(function () {
    if (eapor.stockCheck.clickFlag != -1) {
      $.messager.show({ title: '系统提示', msg: '等待提交结果中~请勿重复提交！', timeout: 2000, showType: 'slide' });
      return;
    }
    var getSelections = $('#detailsInfo_stockCheck').datagrid('getSelections');
    if (getSelections.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择要保存的信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var data = {
      warehouseId: $('#selectWarehouse_stockCheck').combobox('getValue'),//库id
      warehouseName: $('#selectWarehouse_stockCheck').combobox('getText'),//库名
      detailList: JSON.stringify(getSelections)//明细 
    };
    console.info(data);
    console.info(eapor.stockCheck.clickFlag);

    eapor.stockCheck.clickFlag = 0;
    eapor.utils.defaultAjax('../warehouse/addInventory', data, eapor.stockCheck.submitCallBack_stockCheck);
  });

  eapor.stockCheck = {
    clickFlag: -1,
    changeFlag: true,
    init: function () {
      var This = this;
      $('#selectWarehouse_stockCheck').combobox({
        //data:eapor.hotel.getStockName,
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
          if (!This.changeFlag) return;
          var warehouseName = $(this).combobox('getText');
          if (oldValue != "" && This.changeFlag) {
            $.messager.confirm('系统提示', '正在对当前库进行盘点，是否要切换盘点库？', function (r) {
              if (r) {
                var arr = [];
                var data = {
                  warehouseName: warehouseName,
                  userName: $('#indexusername').val()
                };
                arr.push(data);
                $('#shortInfo_stockCheck').datagrid('loadData', arr);
                $('#shortInfo_stockCheck').datagrid('reload');
                This.changeFlag = true;
                eapor.utils.defaultAjax('../warehouse/getInventoryDetailPreList', { warehouseId: newValue }, This.searchCallBack_stockCheck);
              } else {
                var data = $('#selectWarehouse_stockCheck').combobox('getData');
                for (let i = 0; i < data.length; i++) {
                  if (data[i].warehouseId == oldValue) {
                    This.changeFlag = false;
                    $('#selectWarehouse_stockCheck').combobox('setValue', oldValue);
                    $('#selectWarehouse_stockCheck').combobox('setText', data[i].warehouseName);
                    This.changeFlag = true;
                    return;
                  }
                }
              }
            });
          } else {
            console.info(999);
            var arr = [];
            var data = {
              warehouseName: warehouseName,
              userName: $('#indexusername').val()
            };
            arr.push(data);
            $('#shortInfo_stockCheck').datagrid('loadData', arr);
            $('#shortInfo_stockCheck').datagrid('reload');
            This.changeFlag = true;
            eapor.utils.defaultAjax('../warehouse/getInventoryDetailPreList', { warehouseId: newValue }, This.searchCallBack_stockCheck);
          }
        }
      })
    },
    searchCallBack_stockCheck: function (result) {
      $('#detailsInfo_stockCheck').datagrid('loadData', result);
      $('#detailsInfo_stockCheck').datagrid('reload');
      eapor.stockCheck.setcountInfoDatagridValue();
    },
    //设置汇总的datagrid的值
    setcountInfoDatagridValue: function () {
      $('#countInfo_stockCheck').datagrid('loadData', { total: 0, rows: [] });
      $('#countInfo_stockCheck').datagrid('reload');
      var getCountData = {
        countTypeNumber: eapor.utils.computeType('detailsInfo_stockCheck', 'goodsCategoryId'),
        countChangeNumber: eapor.utils.compute('detailsInfo_stockCheck', 'numberChange'),
        countChangeAmount: eapor.utils.compute('detailsInfo_stockCheck', 'amountChange'),
        countCheckAmount: eapor.utils.compute('detailsInfo_stockCheck', 'storeAmountFinal')
      };
      var getCountarr = [];
      getCountarr.push(getCountData);
      $('#countInfo_stockCheck').datagrid('loadData', getCountarr);
      $('#countInfo_stockCheck').datagrid('reload');
    },
    submitCallBack_stockCheck: function (result) {
      console.info(result);
      eapor.stockCheck.clickFlag = -1;
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000, showType: 'slide' });
        return;
      }
      if (result < 1) {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
        return;
      }
    }

  };

  eapor.stockCheck.init();
})();