/**
 * 名称：调拨JS
 * 说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockTransfer");
  var stockTransfer_clickFlag = true;
  //简讯
  $('#shortInfo_stockTransfer').datagrid({
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
      { field: 'warehouseNameStart', title: "起始库", align: 'center', width: 20 },
      { field: 'warehouseNameEnd', title: "终点库", align: 'center', width: 20 },
      { field: 'userName', title: "调拨人", align: 'center', width: 20 }
    ]]
  });
  //汇总
  $('#countInfo_stockTransfer').datagrid({
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
      { field: 'countTypeNumber', title: "调拨品类汇总 ", align: 'center', width: 20 },
      { field: 'countNumber', title: "调拨数量汇总", align: 'center', width: 20 },
      {
        field: 'countAmount', title: "调拨金额汇总", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      }
    ]]
  });
  //明细
  $('#detailsInfo_stockTransfer').datagrid({
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
      { field: 'unitName', title: "商品单位", align: 'center', width: 20, hidden: true },
      { field: 'goodsCategoryId', title: "商品分类Id", align: 'center', width: 20, hidden: true },
      { field: 'supplierId', title: "supplierId", align: 'center', width: 20, hidden: true },

      { field: 'goodsCategoryName', title: "商品类别 ", align: 'center', width: 20 },
      { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
      { field: 'number', title: "调拨数量", align: 'center', width: 20 },
      {
        field: 'purchasePrice', title: "最新进价", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'amount', title: "调拨金额", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      { field: 'remark', title: "备注", align: 'center', width: 20 }
    ]]
  });
  //库名确定btn
  $('#search_stockTransfer').click(function () {
    var warehouseNameStart = $('#selectWarehouse_stockTransferStart').combobox('getText');
    if (warehouseNameStart == "") {
      $.messager.show({ title: '系统提示', msg: '请选择要调拨的起始库！', timeout: 2000, showType: 'slide' });
      return;
    }
    var warehouseNameEnd = $('#selectWarehouse_stockTransferEnd').combobox('getText');

    if (warehouseNameEnd == "") {
      $.messager.show({ title: '系统提示', msg: '请选择要调拨的终点库！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (warehouseNameEnd == warehouseNameStart) {
      $.messager.show({ title: '系统提示', msg: '起始库与终点库不能相同！', timeout: 2000, showType: 'slide' });
      return;
    }
    var arr = [];
    var data = {
      warehouseNameStart: warehouseNameStart,
      warehouseNameEnd: warehouseNameEnd,
      userName: $('#indexusername').val()
    };
    arr.push(data);
    $('#shortInfo_stockTransfer').datagrid('loadData', arr);
    $('#shortInfo_stockTransfer').datagrid('reload');
  });
  //新增调拨项btn
  $('#addStock_stockTransfer').click(function () {
    var warehouseName = $('#shortInfo_stockTransfer').datagrid('getRows')[0];
    console.info(warehouseName)

    if (warehouseName == undefined || warehouseName.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择起始库与终点库！并确定！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#appendDiv_stockTransfer').append(
      '<div id="dialogDiv" style="padding:30px 0 0 60px;">' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsType_stockTransfer" style="width:210px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>商品类别：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsName_stockTransfer" style="width:210px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>商品名称：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsNumber_stockTransfer" style="width:210px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>调拨数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addRemark_stockTransfer" style="width:210px;"' +
      'label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '</div>'
    );
    //商品类别
    $('#addGoodsType_stockTransfer').combobox({
      url: '../Goodscategory/listGoodscategoryPage',
      queryParams: { limit: 9999, offset: 0, goodsCategoryName: '' },
      valueField: 'goodsCategoryId',
      textField: 'goodsCategoryName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $('#addGoodsType_stockTransfer').combobox('setValue', data[0].goodsCategoryId);
          $('#addGoodsType_stockTransfer').combobox('setText', data[0].goodsCategoryName);

        }
      },
      onSelect: function (data) {
        var goodsCategoryId = data.goodsCategoryId;
        eapor.stockTransfer.getGoodsNameListByChangeGoodsType(goodsCategoryId);
      }

    });
    var k = 0;
    //商品名称
    $('#addGoodsName_stockTransfer').combobox({
      url: '../Goods/listGoodsPage',
      queryParams: {
        offset: 0,
        limit: 9999,
        goodsName: "",
        goodsCategoryId: 0,
        saleState: 1//经营状态   1上架 2下架  0全部
      },
      valueField: 'goodsId',
      textField: 'goodsItemCode',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      onLoadSuccess: function (data) {
        var getGoodsType = $('#addGoodsType_stockTransfer').combobox('getValue');
        if (getGoodsType != "" && k == 0) {
          k = -1;
          $('#addGoodsName_stockTransfer').combobox({
            url: "../Goods/listGoodsPage",
            queryParams: {
              offset: 0,
              limit: 9999,
              goodsName: "",
              goodsCategoryId: getGoodsType,
              saleState: 1//经营状态   1上架 2下架  0全部
            },
            valueField: 'goodsId',
            textField: 'goodsItemCode',
            panelHeight: 'auto',
            panelMaxHeight: 200,
            editable: false,
            onLoadSuccess: function (result) {
              if (result.length > 0) {
                $('#addGoodsName_stockTransfer').combobox('setValue', result[0].goodsId);
                $('#addGoodsName_stockTransfer').combobox('setText', result[0].goodsItemCode);
              }
            }
          });
        }
      }

    });
    $('#addGoodsNumber_stockTransfer').textbox({
      required: true,
      validType: ['number', 'noNegativeNumber'],
      missingMessage: "请输入数量",
      invalidMessage: "格式不正确",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#addRemark_stockTransfer').textbox({ multiline: true });

    $('#dialogDiv').dialog({
      title: '新增调拨项',
      width: 360,
      height: 280,
      closed: false,
      cache: false,
      modal: true,
      buttons: [{
        text: '确定',
        handler: function () {
          var getData = $('#addGoodsName_stockTransfer').combobox('getData');
          var addGoodsTypeId = $('#addGoodsType_stockTransfer').combobox('getValue');
          var addGoodsType = $('#addGoodsType_stockTransfer').combobox('getText');
          if (addGoodsType == "") {
            $.messager.show({ title: '系统提示', msg: '要添加的商品类型不能为空！', timeout: 2000, showType: 'slide' });
            return;
          };
          var addGoodsId = $('#addGoodsName_stockTransfer').combobox('getValue');
          var addGoodsName = $('#addGoodsName_stockTransfer').combobox('getText');
          if (addGoodsName == "") {
            $.messager.show({ title: '系统提示', msg: '要添加的商品名称不能为空！', timeout: 2000, showType: 'slide' });
            return;
          };
          var addGoodsNumber = $('#addGoodsNumber_stockTransfer').textbox('getValue');
          if (!$('#addGoodsNumber_stockTransfer').textbox('isValid')) {
            $('#addGoodsNumber_stockTransfer').textbox('textbox').focus();
            return;
          };

          var addRemark = $('#addRemark_stockTransfer').textbox('getValue');
          var addUnitName = "";
          var addGoodsPrice = 0;
          for (let i = 0; i < getData.length; i++) {
            if (addGoodsId == getData[i].goodsId) {
              addUnitName = getData[i].unitName;
              console.info(getData[i]);
              addGoodsPrice = getData[i].latestPurchasePrice;
              break;
            }
          }
          var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
          var addData = {
            goodsCategoryId: Number(addGoodsTypeId),
            goodsCategoryName: addGoodsType,
            goodsItemCode: addGoodsName,
            number: Number(addGoodsNumber),
            purchasePrice: Number(addGoodsPrice),
            amount: amount,
            remark: addRemark,

            unitName: addUnitName,//商品单位
            goodsId: Number(addGoodsId)

          };
          var arrData = $('#detailsInfo_stockTransfer').datagrid('getRows');
          arrData.push(addData);
          $('#detailsInfo_stockTransfer').datagrid('loadData', arrData);
          $('#detailsInfo_stockTransfer').datagrid('reload');
          $('#dialogDiv').dialog('close');
          eapor.stockTransfer.setcountInfoDatagridValue();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#dialogDiv').dialog('close');
        }
      }],
      onClose: function () {
        $(this).dialog('destroy');
      }
    });
  });
  //删除btn
  $('#delGoods_stockTransfer').click(function () {
    var indexList = $('#detailsInfo_stockTransfer').datagrid('getSelections');
    if (indexList.length > 0) {
      for (let i = 0; i < indexList.length; i++) {
        var index = $('#detailsInfo_stockTransfer').datagrid('getRowIndex', indexList[i]);
        $('#detailsInfo_stockTransfer').datagrid('deleteRow', index);
      }
      if ($('#detailsInfo_stockTransfer').datagrid('getSelections').length == 0) {
        $('#detailsInfo_stockTransfer').datagrid('clearChecked');
      }
      eapor.stockTransfer.setcountInfoDatagridValue();
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      return;
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要删除的商品！', timeout: 2000 });
      return;
    }
  });
  //编辑btn
  $('#editGoods_stockTransfer').click(function () {

    var indexList = $('#detailsInfo_stockTransfer').datagrid('getSelections');
    if (indexList.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的商品！', timeout: 2000 });
      return;
    } else if (indexList.length == 1) {
      console.info(indexList[0]);
      $('#appendDiv_stockTransfer').append(
        '<div id="dialogDiv" style="padding:30px 0 0 60px;">' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsType_stockTransfer" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>商品类别：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsName_stockTransfer" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>商品名称：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsNumber_stockTransfer" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>调拨数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addRemark_stockTransfer" style="width:210px;"' +
        'label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '</div>'
      );
      //商品类别
      var y = -1;
      $('#addGoodsType_stockTransfer').combobox({
        url: '../Goodscategory/listGoodscategoryPage',
        queryParams: { limit: 9999, offset: 0, goodsCategoryName: '' },
        valueField: 'goodsCategoryId',
        textField: 'goodsCategoryName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        onLoadSuccess: function (data) {
          $('#addGoodsType_stockTransfer').combobox('setValue', indexList[0].goodsCategoryId);
          $('#addGoodsType_stockTransfer').combobox('setText', indexList[0].goodsCategoryName);
        },
        onSelect: function (data) {
          if (y == -1) {
            //商品名称
            y = 0;
            $('#addGoodsName_stockTransfer').combobox({
              url: '../Goods/listGoodsPage',
              queryParams: {
                offset: 0,
                limit: 9999,
                goodsName: "",
                goodsCategoryId: indexList[0].goodsCategoryId,
                saleState: 1//经营状态   1上架 2下架  0全部
              }
            });
          } else {
            var goodsCategoryId = data.goodsCategoryId;
            eapor.stockTransfer.getGoodsNameListByChangeGoodsType(goodsCategoryId);
          }
        }

      });
      var f = -1;
      //商品名称
      $('#addGoodsName_stockTransfer').combobox({
        valueField: 'goodsId',
        textField: 'goodsItemCode',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        onLoadSuccess: function (data) {
          if (f == -1) {
            f = 0;
            $(this).combobox('setValue', indexList[0].goodsId);
            $(this).combobox('setText', indexList[0].goodsItemCode);
          }
        }
      });

      $('#addGoodsNumber_stockTransfer').textbox({
        required: true,
        validType: ['number', 'noNegativeNumber'],
        missingMessage: "请输入数量",
        invalidMessage: "格式不正确",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#addGoodsNumber_stockTransfer').textbox('setValue', indexList[0].number);
      $('#addRemark_stockTransfer').textbox({ multiline: true });
      $('#addRemark_stockTransfer').textbox('setValue', indexList[0].remark);

      $('#dialogDiv').dialog({
        title: '编辑调拨项',
        width: 360,
        height: 280,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            var getData = $('#addGoodsName_stockTransfer').combobox('getData');
            var addGoodsTypeId = $('#addGoodsType_stockTransfer').combobox('getValue');
            var addGoodsType = $('#addGoodsType_stockTransfer').combobox('getText');
            if (addGoodsType == "") {
              $.messager.show({ title: '系统提示', msg: '商品类型不能为空！', timeout: 2000, showType: 'slide' });
              return;
            };
            var addGoodsId = $('#addGoodsName_stockTransfer').combobox('getValue');
            var addGoodsName = $('#addGoodsName_stockTransfer').combobox('getText');
            if (addGoodsName == "") {
              $.messager.show({ title: '系统提示', msg: '商品名称不能为空！', timeout: 2000, showType: 'slide' });
              return;
            };
            var addGoodsNumber = $('#addGoodsNumber_stockTransfer').textbox('getValue');
            if (!$('#addGoodsNumber_stockTransfer').textbox('isValid')) {
              $('#addGoodsNumber_stockTransfer').textbox('textbox').focus();
              return;
            };
            var addRemark = $('#addRemark_stockTransfer').textbox('getValue');
            var addUnitName = "";
            var addGoodsPrice = 0;
            for (let i = 0; i < getData.length; i++) {
              if (addGoodsId == getData[i].goodsId) {
                addUnitName = getData[i].unitName;
                addGoodsPrice = getData[i].latestPurchasePrice;
                break;
              }
            }
            var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
            var addData = {
              goodsCategoryId: Number(addGoodsTypeId),
              goodsCategoryName: addGoodsType,
              goodsItemCode: addGoodsName,
              number: Number(addGoodsNumber),
              purchasePrice: Number(addGoodsPrice),
              amount: amount,
              remark: addRemark,

              unitName: addUnitName,//商品单位
              goodsId: Number(addGoodsId)

            };
            var getidx = $('#detailsInfo_stockTransfer').datagrid('getRowIndex', indexList[0]);
            if ($('#detailsInfo_stockTransfer').datagrid('getSelections').length != 0) {
              $('#detailsInfo_stockTransfer').datagrid('clearChecked');
            }
            $('#detailsInfo_stockTransfer').datagrid('updateRow', {
              index: getidx,
              row: addData
            });
            $('#dialogDiv').dialog('close');
            eapor.stockTransfer.setcountInfoDatagridValue();

          }
        }, {
          text: '取消',
          handler: function () {
            $('#dialogDiv').dialog('close');
          }
        }],
        onClose: function () {
          $(this).dialog('destroy');
        }
      });
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择一项要编辑的商品！不能选择多项！', timeout: 2800 });
      return;
    }
  });
  //打印临时调拨单
  $('#print_StockTransfer').click(function () {
    var getSelected = $('#detailsInfo_stockTransfer').datagrid('getRows');
    if (getSelected.length == 0) {
      $.messager.show({ title: '系统提示', msg: '操作无效！无调拨信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var data = {
      stockNameStart: $('#shortInfo_stockTransfer').datagrid('getRows')[0].warehouseNameStart,
      stockNameEnd: $('#shortInfo_stockTransfer').datagrid('getRows')[0].warehouseNameEnd,
      date: getDate(new Date()),
      userName: $('#shortInfo_stockTransfer').datagrid('getRows')[0].userName,
      numberCount: $('#countInfo_stockTransfer').datagrid('getRows')[0].countNumber,
      amountCount: $('#countInfo_stockTransfer').datagrid('getRows')[0].countAmount,
      list: $('#detailsInfo_stockTransfer').datagrid('getRows')
    }
    console.info(data);
    eapor.stockTransfer.printReportCallBack(data);
  });
  //确认调拨btn
  $('#submit_stockTransfer').click(function () {

    var warehouseIdStart = $('#selectWarehouse_stockTransferStart').combobox('getValue');
    if (warehouseIdStart == "") {
      $.messager.show({ title: '系统提示', msg: '请选择要调拨的起始库名称！', timeout: 2000 });
      return;
    }
    var warehouseIdEnd = $('#selectWarehouse_stockTransferEnd').combobox('getValue');
    if (warehouseIdEnd == "") {
      $.messager.show({ title: '系统提示', msg: '请选择要调拨的终点库名称！', timeout: 2000 });
      return;
    }
    var getData = $('#detailsInfo_stockTransfer').datagrid('getSelections');
    if (getData) {
      if (getData.length > 0) {
        var data = {
          fromWarehouseId: warehouseIdStart,/*出库id*/
          toWarehouseId: warehouseIdEnd,/*入库id*/
          remark: "",
          goodsoutdetaiLlist: JSON.stringify(getData)/*商品列表*/
        };
        console.info(data);
        if (!stockTransfer_clickFlag) {
          $.messager.show({ title: '系统提示', msg: '等待提交结果中~请勿重复提交！', timeout: 2000, showType: 'slide' });
          return;
        }
        stockTransfer_clickFlag = false;
        eapor.utils.defaultAjax('../warehouse/allocation', data, eapor.stockTransfer.addGoodsSubmitCallBack);
      } else {
        $.messager.show({ title: '系统提示', msg: '请选择要调拨的商品！', timeout: 2000 });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要调拨的库名称！', timeout: 2000 });
      return;
    }
  });


  eapor.stockTransfer = {

    init: function () {
      $('#selectWarehouse_stockTransferStart').combobox({
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
        panelMaxHeight: 200
      });
      $('#selectWarehouse_stockTransferEnd').combobox({
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
        panelMaxHeight: 200
      });
    },
    //设置汇总的datagrid的值
    setcountInfoDatagridValue: function () {
      $('#countInfo_stockTransfer').datagrid('loadData', { total: 0, rows: [] });
      $('#countInfo_stockTransfer').datagrid('reload');
      var getCountData = {
        countTypeNumber: eapor.utils.computeType('detailsInfo_stockTransfer', 'goodsCategoryId'),
        countNumber: eapor.utils.compute('detailsInfo_stockTransfer', 'number'),
        countAmount: eapor.utils.compute('detailsInfo_stockTransfer', 'amount')
      };
      var getCountarr = [];
      getCountarr.push(getCountData);
      $('#countInfo_stockTransfer').datagrid('loadData', getCountarr);
      $('#countInfo_stockTransfer').datagrid('reload');
    },
    //调拨提交的回调函数
    addGoodsSubmitCallBack: function (result) {

      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        stockTransfer_clickFlag = true;
        return;
      }
      if (result > 0) {
        var indexList = $('#detailsInfo_stockTransfer').datagrid('getSelections');
        for (let i = 0; i < indexList.length; i++) {
          var index = $('#detailsInfo_stockTransfer').datagrid('getRowIndex', indexList[i]);
          $('#detailsInfo_stockTransfer').datagrid('deleteRow', index);
        }
        if ($('#detailsInfo_stockTransfer').datagrid('getSelections').length == 0) {
          $('#detailsInfo_stockTransfer').datagrid('clearChecked');
        }
        eapor.stockTransfer.setcountInfoDatagridValue();
        $.messager.show({ title: '系统提示', msg: '调拨成功！', timeout: 2000, showType: 'slide' });
        stockTransfer_clickFlag = true;
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '调拨失败！', timeout: 2000, showType: 'slide' });
        stockTransfer_clickFlag = true;
        return;
      }
    },
    getGoodsNameListByChangeGoodsTypeCallBack: function (result) {
      $('#addGoodsName_stockTransfer').combobox('clear');
      $('#addGoodsName_stockTransfer').combobox('loadData', { total: 0, row: [] });
      if (result.length > 0) {
        $('#addGoodsName_stockTransfer').combobox('loadData', result);
        $('#addGoodsName_stockTransfer').combobox('setValue', result[0].goodsId);
        $('#addGoodsName_stockTransfer').combobox('setText', result[0].goodsItemCode);
      }
    },
    //改变商品类别，后改变商品名称内的数据源
    getGoodsNameListByChangeGoodsType: function (id) {
      var data = {};
      data.offset = 0;
      data.limit = 9999;
      data.goodsName = "" /*按商品名称搜索*/
      data.goodsCategoryId = id;  /*按商品分类id搜索*/
      data.saleState = 1;/*经营状态   1上架 2下架  0全部*/
      eapor.utils.defaultAjax("../Goods/listGoodsPage", data, eapor.stockTransfer.getGoodsNameListByChangeGoodsTypeCallBack);
    },
    printReportCallBack: function (result) {
      console.info(result);
      var info = result.list;
      var title = "调拨_" + result.stockNameStart + "(起始)_" + "_" + result.stockNameEnd + "(终点)_" + "_" + result.date + "_" + result.userName;
      $('#reportTitle_transferStock').html(title);
      $('#transferStockPrintTbody').empty();
      var totalPurchasePrice = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
        $('#transferStockPrintTbody').append(
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
        totalPurchasePrice += (info[i].number);
        totalAmount += NP.divide(info[i].amount, 100);
      };

      $('#transferStockPrintTbody').append(
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
      var popTitle = "调拨_" + result.stockNameStart + "(起始)_" + result.stockNameEnd + "(终点)_" + result.date + "_" + result.userName;
      $("div#transferStockPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    }
  };
  eapor.stockTransfer.init();
})();