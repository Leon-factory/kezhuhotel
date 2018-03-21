/**
 * @名称：出库JS
 * 说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockOut");
  var stockOut_clickFlag = true;
  //简讯
  $('#shortInfo_stockOut').datagrid({
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
      { field: 'userName', title: "出库人", align: 'center', width: 20 }
    ]]
  });
  //汇总
  $('#countInfo_stockOut').datagrid({
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
      { field: 'countTypeNumber', title: "出库品类汇总 ", align: 'center', width: 20 },
      { field: 'countNumber', title: "出库数量汇总", align: 'center', width: 20 },
      {
        field: 'countAmount', title: "出库金额汇总", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      }
    ]]
  });
  //明细
  $('#detailsInfo_stockOut').datagrid({
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
      { field: 'goodsId', title: "商品名称Id", align: 'center', width: 20, hidden: true },

      { field: 'goodsCategoryName', title: "商品类别 ", align: 'center', width: 20 },
      { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 20 },
      { field: 'number', title: "出库数量", align: 'center', width: 20 },
      {
        field: 'purchasePrice', title: "价格", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'amount', title: "出库金额", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      { field: 'reference', title: "reference", align: 'center', width: 20 },
      { field: 'remark', title: "备注", align: 'center', width: 20 }
    ]]
  });
  //库名确定btn
  $('#search_stockOut').click(function () {
    var warehouseName = $('#selectWarehouse_stockOut').combobox('getText');
    if (warehouseName != "") {
      var arr = [];
      var data = {
        warehouseName: warehouseName,
        userName: $('#indexusername').val()
      };
      arr.push(data);
      $('#shortInfo_stockOut').datagrid('loadData', arr);
      $('#shortInfo_stockOut').datagrid('reload');
    } else {
      $.messager.show({ title: '系统提示', msg: '请先选择要出库的库名称！', timeout: 2000, showType: 'slide' });
      return;
    }
  });
  //新增出库项btn
  $('#addStock_stockOut').click(function () {
    var warehouseName = $('#shortInfo_stockOut').datagrid('getRows')[0];
    if (typeof (warehouseName) === 'undefined') {
      $.messager.show({ title: '系统提示', msg: '请先选择要出库的库名称！并确定！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#appendDiv_stockOut').append(
      '<div id="dialogDiv" style="padding:25px 0 0 60px;">' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsType_stockOut" style="width:208px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>商品类别：" labelPosition="before" labelAlign="right" labelWidth="78"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsName_stockOut" style="width:208px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>商品名称：" labelPosition="before" labelAlign="right" labelWidth="78"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addSupplier_stockOut" style="width:208px;"' +
      'label="领用人：" labelPosition="before" labelAlign="right" labelWidth="78"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addGoodsNumber_stockOut" style="width:208px;"' +
      'label="<span style=\'color:red;font-size:16px;\'>*</span>出库数量：" labelPosition="before" labelAlign="right" labelWidth="78"/>' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input id="addRemark_stockOut" style="width:208px;"' +
      'label="备注：" labelPosition="before" labelAlign="right" labelWidth="78"/>' +
      '</div>' +
      '</div>'
    );
    //商品类别
    $.ajax({
      type: 'post',
      url: '../Goodscategory/listGoodscategoryPage',
      data: { limit: 9999, offset: 0, goodsCategoryName: '' },
      dataType: 'json'
    })
      .done(function (editlistGoodscategoryPage) {
        $('#addGoodsType_stockOut').combobox({
          // url:'../Goodscategory/listGoodscategoryPage',
          // queryParams:{limit:9999,offset:0,goodsCategoryName:''},
          data: editlistGoodscategoryPage,
          valueField: 'goodsCategoryId',
          textField: 'goodsCategoryName',
          panelHeight: 'auto',
          panelMaxHeight: 200,
          editable: false,
          required: true,
          missingMessage: "商品类别不能为空！",
          validateOnCreate: false,//为true时在创建该组件时就进行验证
          validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
          onLoadSuccess: function (data) {
            if (data.length > 0) {
              $('#addGoodsType_stockOut').combobox('setValue', data[0].goodsCategoryId);
              $('#addGoodsType_stockOut').combobox('setText', data[0].goodsCategoryName);
            }
          },
          onSelect: function (data) {
            //var goodsCategoryId = 
            //eapor.stockOut.getGoodsNameListByChangeGoodsType(goodsCategoryId);

            var getGoodsType = data.goodsCategoryId;
            //console.info(getGoodsType);
            if (getGoodsType != "") {
              $('#addGoodsName_stockOut').combobox({
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
                required: true,
                missingMessage: "商品名称不能为空！",
                validateOnCreate: false,//为true时在创建该组件时就进行验证
                validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
                onLoadSuccess: function (result) {
                  if (result.length > 0) {
                    $('#addGoodsName_stockOut').combobox('setValue', result[0].goodsId);
                    $('#addGoodsName_stockOut').combobox('setText', result[0].goodsItemCode);
                  }
                }
              });
            } else {
              $('#addGoodsName_stockOut').combobox({
                data: [],
                panelHeight: 'auto',
                panelMaxHeight: 200,
                editable: false,
                required: true,
                missingMessage: "商品名称不能为空！",
                validateOnCreate: false,//为true时在创建该组件时就进行验证
                validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
              });
            }
          }
        });
      });
    $('#addGoodsName_stockOut').combobox({
      data: [],
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "商品名称不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
    });
    //领用人
    $('#addSupplier_stockOut').textbox({});
    $('#addGoodsNumber_stockOut').textbox({
      required: true,
      validType: ['number', 'noNegativeNumber'],
      missingMessage: "请输入出库数量",
      invalidMessage: "格式不正确",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#addRemark_stockOut').textbox({ multiline: true });

    $('#dialogDiv').dialog({
      title: '新增出库项',
      width: 360,
      height: 300,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var getData = $('#addGoodsName_stockOut').combobox('getData');
          var addGoodsTypeId = $('#addGoodsType_stockOut').combobox('getValue');
          var addGoodsType = $('#addGoodsType_stockOut').combobox('getText');
          if (!$('#addGoodsType_stockOut').combobox('isValid')) {
            $('#addGoodsType_stockOut').combobox('textbox').focus();
            $.messager.show({ title: '系统提示', msg: '要添加的商品类型不能为空！', timeout: 2000, showType: 'slide' });
            return;
          };
          var addGoodsId = $('#addGoodsName_stockOut').combobox('getValue');
          var addGoodsName = $('#addGoodsName_stockOut').combobox('getText');
          if (!$('#addGoodsName_stockOut').combobox('isValid')) {
            $('#addGoodsName_stockOut').combobox('textbox').focus();
            $.messager.show({ title: '系统提示', msg: '要添加的商品名称不能为空！', timeout: 2000, showType: 'slide' });
            return;
          };
          var addSupplier = $('#addSupplier_stockOut').textbox('getText');
          var addGoodsNumber = $('#addGoodsNumber_stockOut').textbox('getValue');
          if (!$('#addGoodsNumber_stockOut').textbox('isValid')) {
            $('#addGoodsNumber_stockOut').textbox('textbox').focus();
            return;
          };
          var addRemark = $('#addRemark_stockOut').textbox('getValue');
          var addUnitName = "";
          var addGoodsPrice = 0;
          for (let i = 0; i < getData.length; i++) {
            if (addGoodsId == getData[i].goodsId) {
              addUnitName = getData[i].unitName;
              addGoodsPrice = getData[i].salePrice;
              break;
            }
          }
          var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
          if (addSupplier == "") {
            addSupplier = "--";
          }
          var addData = {
            goodsCategoryId: Number(addGoodsTypeId),
            goodsCategoryName: addGoodsType,
            goodsItemCode: addGoodsName,
            number: Number(addGoodsNumber),
            purchasePrice: Number(addGoodsPrice),
            amount: amount,
            remark: addRemark,

            unitName: addUnitName,//商品单位
            goodsId: Number(addGoodsId),
            reference: "领用/" + addSupplier


          };
          var arrData = $('#detailsInfo_stockOut').datagrid('getRows');
          arrData.push(addData);
          $('#detailsInfo_stockOut').datagrid('loadData', arrData);
          $('#detailsInfo_stockOut').datagrid('reload');
          $('#dialogDiv').dialog('close');
          eapor.stockOut.setcountInfoDatagridValue();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#dialogDiv').dialog('close');
        }
      }]
    });

  });
  //删除btn
  $('#delGoods_stockOut').click(function () {
    var indexList = $('#detailsInfo_stockOut').datagrid('getSelections');
    if (indexList.length > 0) {
      for (let i = 0; i < indexList.length; i++) {
        var index = $('#detailsInfo_stockOut').datagrid('getRowIndex', indexList[i]);
        $('#detailsInfo_stockOut').datagrid('deleteRow', index);
      }
      if ($('#detailsInfo_stockOut').datagrid('getSelections').length == 0) {
        $('#detailsInfo_stockOut').datagrid('clearChecked');
      }
      eapor.stockOut.setcountInfoDatagridValue();
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      return;
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要删除的商品！', timeout: 2000 });
      return;
    }
  });
  //编辑btn
  $('#editGoods_stockOut').click(function () {

    var indexList = $('#detailsInfo_stockOut').datagrid('getSelections');
    if (indexList.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的商品！', timeout: 2000 });
      return;
    } else if (indexList.length == 1) {
      console.info(indexList[0]);
      $('#appendDiv_stockOut').append(
        '<div id="dialogDiv" style="padding:25px 0 0 60px;">' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsType_stockOut" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>商品类别：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsName_stockOut" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>商品名称：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addSupplier_stockOut" style="width:210px;"' +
        'label="领用人：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsNumber_stockOut" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>出库数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addRemark_stockOut" style="width:210px;"' +
        'label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '</div>'
      );
      //商品类别
      var y = -1;
      $('#addGoodsType_stockOut').combobox({
        url: '../Goodscategory/listGoodscategoryPage',
        queryParams: { limit: 9999, offset: 0, goodsCategoryName: '' },
        valueField: 'goodsCategoryId',
        textField: 'goodsCategoryName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        required: true,
        missingMessage: "商品类别不能为空！",
        validateOnCreate: false,
        validateOnBlur: true,
        onLoadSuccess: function (data) {
          $('#addGoodsType_stockOut').combobox('setValue', indexList[0].goodsCategoryId);
          $('#addGoodsType_stockOut').combobox('setText', indexList[0].goodsCategoryName);
        },
        onSelect: function (data) {
          if (y == -1) {
            //商品名称
            y = 0;
            $('#addGoodsName_stockOut').combobox({
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
            // var goodsCategoryId = data.goodsCategoryId;
            // eapor.stockOut.getGoodsNameListByChangeGoodsType(goodsCategoryId);
            var getGoodsType = data.goodsCategoryId;
            //console.info(getGoodsType);
            if (getGoodsType != "") {
              $('#addGoodsName_stockOut').combobox({
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
                required: true,
                missingMessage: "商品名称不能为空！",
                validateOnCreate: false,//为true时在创建该组件时就进行验证
                validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
                onLoadSuccess: function (result) {
                  if (result.length > 0) {
                    $('#addGoodsName_stockOut').combobox('setValue', result[0].goodsId);
                    $('#addGoodsName_stockOut').combobox('setText', result[0].goodsItemCode);
                  }
                }
              });
            } else {
              $('#addGoodsName_stockOut').combobox({
                data: [],
                panelHeight: 'auto',
                panelMaxHeight: 200,
                editable: false,
                required: true,
                missingMessage: "商品名称不能为空！",
                validateOnCreate: false,//为true时在创建该组件时就进行验证
                validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
              });
            }
          }
        }

      });
      var f = -1;
      //商品名称
      $('#addGoodsName_stockOut').combobox({
        valueField: 'goodsId',
        textField: 'goodsItemCode',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        required: true,
        missingMessage: "商品名称不能为空！",
        validateOnCreate: false,
        validateOnBlur: true,
        onLoadSuccess: function (data) {
          if (f == -1) {
            f = 0;
            $(this).combobox('setValue', indexList[0].goodsId);
            $(this).combobox('setText', indexList[0].goodsItemCode);
          }
        }
      });

      //领用人
      $('#addSupplier_stockOut').textbox({});
      var people = indexList[0].reference.substring(3);
      if (people == "--") {
        people = "";
      }
      $('#addSupplier_stockOut').textbox('setText', people);
      $('#addGoodsNumber_stockOut').textbox({
        required: true,
        validType: ['number', 'noNegativeNumber'],
        missingMessage: "请输入出库数量",
        invalidMessage: "格式不正确",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#addGoodsNumber_stockOut').textbox('setValue', indexList[0].number);
      $('#addRemark_stockOut').textbox({
        multiline: true,
        validType: "maxLength[32]",
        invalidMessage: "最多输入32个字符"

      });
      $('#addRemark_stockOut').textbox('setValue', indexList[0].remark);

      $('#dialogDiv').dialog({
        title: '编辑出库项',
        width: 360,
        height: 300,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            var getData = $('#addGoodsName_stockOut').combobox('getData');
            var addGoodsTypeId = $('#addGoodsType_stockOut').combobox('getValue');
            var addGoodsType = $('#addGoodsType_stockOut').combobox('getText');
            if (!$('#addGoodsType_stockOut').combobox('isValid')) {
              $('#addGoodsType_stockOut').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '商品类型不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addGoodsId = $('#addGoodsName_stockOut').combobox('getValue');
            var addGoodsName = $('#addGoodsName_stockOut').combobox('getText');
            if (!$('#addGoodsName_stockOut').combobox('isValid')) {
              $('#addGoodsName_stockOut').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '商品名称不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addSupplier = $('#addSupplier_stockOut').textbox('getText');
            var addGoodsNumber = $('#addGoodsNumber_stockOut').textbox('getValue');
            if (!$('#addGoodsNumber_stockOut').textbox('isValid')) {
              $('#addGoodsNumber_stockOut').textbox('textbox').focus();
              return;
            }
            if (!$('#addRemark_stockOut').textbox('isValid')) {
              $('#addRemark_stockOut').textbox('textbox').focus();
              return;
            }
            var addRemark = $('#addRemark_stockOut').textbox('getValue');
            var addUnitName = "";
            var addGoodsPrice = 0;
            for (let i = 0; i < getData.length; i++) {
              if (addGoodsId == getData[i].goodsId) {
                addUnitName = getData[i].unitName;
                addGoodsPrice = getData[i].salePrice;
                break;
              }
            }
            var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
            if (addSupplier == "") {
              addSupplier = "--";
            }
            var addData = {
              goodsCategoryId: Number(addGoodsTypeId),
              goodsCategoryName: addGoodsType,
              goodsItemCode: addGoodsName,
              number: Number(addGoodsNumber),
              purchasePrice: Number(addGoodsPrice),
              amount: amount,
              remark: addRemark,

              unitName: addUnitName,//商品单位
              goodsId: Number(addGoodsId),
              reference: "领用/" + addSupplier

            };
            var getidx = $('#detailsInfo_stockOut').datagrid('getRowIndex', indexList[0]);
            if ($('#detailsInfo_stockOut').datagrid('getSelections').length != 0) {
              $('#detailsInfo_stockOut').datagrid('clearChecked');
            }
            $('#detailsInfo_stockOut').datagrid('updateRow', {
              index: getidx,
              row: addData
            });
            $('#dialogDiv').dialog('close');
            eapor.stockOut.setcountInfoDatagridValue();
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
      $.messager.show({ title: '系统提示', msg: '请先选择一项要编辑的商品！不能选择多项！', timeout: 2000 });
      return;
    }
  });
  //打印临时出库单
  $('#print_StockOut').click(function () {
    var getSelected = $('#detailsInfo_stockOut').datagrid('getRows');
    if (getSelected.length == 0) {
      $.messager.show({ title: '系统提示', msg: '操作无效！无出库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var data = {
      stockName: $('#shortInfo_stockOut').datagrid('getRows')[0].warehouseName,
      date: getDate(new Date()),
      userName: $('#indexusername').val(),
      numberCount: $('#countInfo_stockOut').datagrid('getRows')[0].countNumber,
      amountCount: $('#countInfo_stockOut').datagrid('getRows')[0].countAmount,
      list: $('#detailsInfo_stockOut').datagrid('getRows')
    }
    console.info(data);
    eapor.stockOut.printReportCallBack(data);
  });
  //确认出库btn
  $('#submit_stockOut').click(function () {

    var warehouseId = $('#selectWarehouse_stockOut').combobox('getValue');
    if (warehouseId) {
      var getData = $('#detailsInfo_stockOut').datagrid('getSelections');
      if (getData.length > 0) {
        var data = {
          warehouseId: Number(warehouseId),//仓库id
          remark: "",//备注
          list: JSON.stringify(getData),//出库明细
          typeCode: 1,//出库方式，1领用   2加单或退单
        };
        console.info(data);
        if (!stockOut_clickFlag) {
          $.messager.show({ title: '系统提示', msg: '等待提交结果中~请勿重复提交！', timeout: 2000, showType: 'slide' });
          return;
        }
        stockOut_clickFlag = false;
        eapor.utils.defaultAjax('../warehouse/AddGoodsout', data, eapor.stockOut.addGoodsSubmitCallBack);
      } else {
        $.messager.show({ title: '系统提示', msg: '请选择要出库的商品！', timeout: 2000 });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要出库的库名称！', timeout: 2000 });
      return;
    }
  });


  eapor.stockOut = {
    changeFlag: true,
    init: function () {
      $('#selectWarehouse_stockOut').combobox({
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
          if (!eapor.stockOut.changeFlag) return;
          var warehouseName = $(this).combobox('getText');
          if (oldValue != "" && eapor.stockOut.changeFlag) {
            $.messager.confirm('系统提示', '是否要切换库？', function (r) {
              if (r) {
                var arr = [];
                var data = {
                  warehouseName: warehouseName,
                  userName: $('#indexusername').val()
                };
                arr.push(data);
                $('#shortInfo_stockOut').datagrid('loadData', arr);
                $('#shortInfo_stockOut').datagrid('reload');
                eapor.stockOut.changeFlag = true;
              } else {
                var data1 = $('#selectWarehouse_stockOut').combobox('getData');
                console.info(data1)
                for (let i = 0; i < data1.length; i++) {
                  if (data1[i].warehouseId == oldValue) {
                    eapor.stockOut.changeFlag = false;
                    $('#selectWarehouse_stockOut').combobox('setValue', oldValue);
                    $('#selectWarehouse_stockOut').combobox('setText', data1[i].warehouseName);
                    eapor.stockOut.changeFlag = true;
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
            $('#shortInfo_stockOut').datagrid('loadData', arr);
            $('#shortInfo_stockOut').datagrid('reload');
            eapor.stockOut.changeFlag = true;
          }
        }
      });
    },
    //设置汇总的datagrid的值
    setcountInfoDatagridValue: function () {
      $('#countInfo_stockOut').datagrid('loadData', { total: 0, rows: [] });
      $('#countInfo_stockOut').datagrid('reload');
      var getCountData = {
        countTypeNumber: eapor.utils.computeType('detailsInfo_stockOut', 'goodsCategoryId'),
        countNumber: eapor.utils.compute('detailsInfo_stockOut', 'number'),
        countAmount: eapor.utils.compute('detailsInfo_stockOut', 'amount')
      };
      var getCountarr = [];
      getCountarr.push(getCountData);
      $('#countInfo_stockOut').datagrid('loadData', getCountarr);
      $('#countInfo_stockOut').datagrid('reload');
    },
    //新增提交的回调函数
    addGoodsSubmitCallBack: function (result) {

      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        stockOut_clickFlag = true;
        return;
      }
      if (result > 0) {
        var indexList = $('#detailsInfo_stockOut').datagrid('getSelections');
        for (let i = 0; i < indexList.length; i++) {
          var index = $('#detailsInfo_stockOut').datagrid('getRowIndex', indexList[i]);
          $('#detailsInfo_stockOut').datagrid('deleteRow', index);
        }
        if ($('#detailsInfo_stockOut').datagrid('getSelections').length == 0) {
          $('#detailsInfo_stockOut').datagrid('clearChecked');
        }
        eapor.stockOut.setcountInfoDatagridValue();
        $.messager.show({ title: '系统提示', msg: '出库成功！', timeout: 2000, showType: 'slide' });
        stockOut_clickFlag = true;
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '出库失败！', timeout: 2000, showType: 'slide' });
        stockOut_clickFlag = true;
        return;
      }
    },
    getGoodsNameListByChangeGoodsTypeCallBack: function (result) {
      $('#addGoodsName_stockOut').combobox('clear');
      $('#addGoodsName_stockOut').combobox('loadData', { total: 0, row: [] });
      if (result.length > 0) {
        $('#addGoodsName_stockOut').combobox('loadData', { total: result.length, rows: result });
        $('#addGoodsName_stockOut').combobox('setValue', result[0].goodsId);
        $('#addGoodsName_stockOut').combobox('setText', result[0].goodsItemCode);
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
      eapor.utils.defaultAjax("../Goods/listGoodsPage", data, eapor.stockOut.getGoodsNameListByChangeGoodsTypeCallBack);
    },
    //打印临时出库单
    printReportCallBack: function (result) {
      console.info(result);
      var info = result.list;
      var title = "出库_" + result.stockName + "_" + result.date + "_" + result.userName;
      $('#reportTitle_outStock').html(title);
      $('#outStockPrintTbody').empty();
      var totalPurchasePrice = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
        $('#outStockPrintTbody').append(
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
          info[i].reference +
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

      $('#outStockPrintTbody').append(
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
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0; ">' +
        '——' +
        '</td>' +
        '</tr>'
      );
      var popTitle = "出库_" + result.stockName + "_" + result.date;
      $("div#outStockPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    }
  };
  eapor.stockOut.init();
})();