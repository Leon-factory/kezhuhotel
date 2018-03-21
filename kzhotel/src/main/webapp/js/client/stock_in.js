/**
 *@名称：入库JS
 * 说明：
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_stockIn");

  var stockIn_clickFlag = true;
  //简讯
  $('#shortInfo_stockIn').datagrid({
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
      { field: 'userName', title: "入库人", align: 'center', width: 20 }
    ]]
  });
  //汇总
  $('#countInfo_stockIn').datagrid({
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
      { field: 'countTypeNumber', title: "入库品类汇总 ", align: 'center', width: 20 },
      { field: 'countNumber', title: "入库数量汇总", align: 'center', width: 20 },
      {
        field: 'countAmount', title: "入库金额汇总", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
    ]]
  });
  //明细
  $('#detailsInfo_stockIn').datagrid({
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
      { field: 'supplierName', title: "供应商", align: 'center', width: 20 },
      { field: 'number', title: "入库数量", align: 'center', width: 20 },
      {
        field: 'purchasePrice', title: "进价", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      {
        field: 'amount', title: "入库金额", align: 'center', width: 20,
        formatter: function (value) {
          return NP.divide(value, 100).toFixed(2) + "元";
        }
      },
      { field: 'remark', title: "备注", align: 'center', width: 20 }
    ]]
  });

  //新增入库项btn
  $('#addStock_stockIn').click(function () {
    var warehouseName = $('#shortInfo_stockIn').datagrid('getRows')[0];
    if (warehouseName != undefined) {
      $('#appendDiv_stockIn').append(
        '<div id="dialogDiv" style="padding:30px 0 0 60px;">' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsType_stockIn" style="width:210px;"' +
        'label="商品类别：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsName_stockIn" style="width:210px;"' +
        'label="商品名称：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addSupplier_stockIn" style="width:210px;"' +
        'label="供应商：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsNumber_stockIn" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>入库数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsPrice_stockIn" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>进价(￥)：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addRemark_stockIn" style="width:210px;"' +
        'label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
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
        .done(function (listGoodscategoryPage) {
          $('#addGoodsType_stockIn').combobox({
            //url:'../Goodscategory/listGoodscategoryPage',
            //queryParams:{limit:9999,offset:0,goodsCategoryName:''},
            data: listGoodscategoryPage,
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
                $('#addGoodsType_stockIn').combobox('setValue', data[0].goodsCategoryId);
                $('#addGoodsType_stockIn').combobox('setText', data[0].goodsCategoryName);
              }
            },
            onSelect: function (data) {
              //var goodsCategoryId = data.goodsCategoryId;
              //console.info(goodsCategoryId);
              //eapor.stockIn.getGoodsNameListByChangeGoodsType(goodsCategoryId);

              var getGoodsType = data.goodsCategoryId;
              console.info(getGoodsType);

              if (getGoodsType != "") {
                $('#addGoodsName_stockIn').combobox({
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
                    console.info(result);
                    if (result.length > 0) {
                      $('#addGoodsName_stockIn').combobox('setValue', result[0].goodsId);
                      $('#addGoodsName_stockIn').combobox('setText', result[0].goodsItemCode);
                    }
                  }
                });
              } else {
                $('#addGoodsName_stockIn').combobox({
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

      $('#addGoodsName_stockIn').combobox({
        data: [],
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        required: true,
        missingMessage: "商品名称不能为空！",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      });
      //供应商
      $('#addSupplier_stockIn').combobox({
        url: '../warehouse/listSupplierPage',
        queryParams: { supplierName: '', offset: 0, limit: 9999 },
        valueField: 'supplierId',
        textField: 'supplierName',
        editable: false,
        panelHeight: "auto",
        panelMaxHeight: 200,
        // required:true,
        // missingMessage : "供应商不能为空！",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
        onLoadSuccess: function (data) {
          if (data.length > 0) {
            $(this).combobox('setValue', data[0].supplierId);
            $(this).combobox('setText', data[0].supplierName);
          }
        },
        loadFilter: function (data) {
          if (data != -3333 && data != -3335) {
            data.unshift({ 'supplierId': 0, 'supplierName': '--' });
          }
          return data;
        }
      });
      $('#addGoodsNumber_stockIn').textbox({
        required: true,
        validType: ['number', 'noNegativeNumber'],
        missingMessage: "请输入出库数量",
        invalidMessage: "格式不正确",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });

      $('#addGoodsPrice_stockIn').numberbox({
        required: true,
        missingMessage: "请输入进价,最小值为0",
        min: 0.00,
        delay: 1000,
        value: 0,
        precision: "2",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#addGoodsPrice_stockIn').numberbox('setValue', 0);
      $('#addRemark_stockIn').textbox({
        multiline: true,
        validType: "maxLength[32]",
        invalidMessage: "最多输入32个字符"

      });

      $('#dialogDiv').dialog({
        title: '新增入库项',
        width: 360,
        height: 360,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            var getData = $('#addGoodsName_stockIn').combobox('getData');
            var addGoodsTypeId = $('#addGoodsType_stockIn').combobox('getValue');
            var addGoodsType = $('#addGoodsType_stockIn').combobox('getText');
            if (!$('#addGoodsType_stockIn').combobox('isValid')) {
              $('#addGoodsType_stockIn').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '要添加的商品类型不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addGoodsId = $('#addGoodsName_stockIn').combobox('getValue');
            var addGoodsName = $('#addGoodsName_stockIn').combobox('getText');
            if (!$('#addGoodsName_stockIn').combobox('isValid')) {
              $('#addGoodsName_stockIn').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '要添加的商品名称不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addSupplierId = $('#addSupplier_stockIn').combobox('getValue');
            var addSupplier = $('#addSupplier_stockIn').combobox('getText');
            /*if(!$('#addSupplier_stockIn').combobox('isValid')){
              $('#addSupplier_stockIn').combobox('textbox').focus();
              $.messager.show({title:'系统提示',msg:'要添加的供应商名称不能为空！',timeout:2000,showType:'slide'});
              return;
            }*/
            if (!$('#addGoodsNumber_stockIn').textbox('isValid')) {
              $('#addGoodsNumber_stockIn').textbox('textbox').focus();
              return;
            }
            var addGoodsNumber = $('#addGoodsNumber_stockIn').textbox('getValue');
            /*if(addGoodsNumber == ""){
              $.messager.show({title:'系统提示',msg:'要添加的商品数量不能为空！',timeout:2000,showType:'slide'});
              return;
            };*/
            var addGoodsPrice = $('#addGoodsPrice_stockIn').numberbox('getValue');
            if (!$('#addGoodsPrice_stockIn').numberbox('isValid')) {
              $('#addGoodsPrice_stockIn').numberbox('textbox').focus();
              return;
            }
            var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
            if (!$('#addRemark_stockIn').textbox('isValid')) {
              $('#addRemark_stockIn').textbox('textbox').focus();
              return;
            }
            var addRemark = $('#addRemark_stockIn').textbox('getValue');
            var addUnitName = "";
            for (let i = 0; i < getData.length; i++) {
              if (addGoodsId == getData[i].goodsId) {
                addUnitName = getData[i].unitName;
                break;
              }
            }
            var addData = {
              goodsCategoryId: Number(addGoodsTypeId),
              goodsCategoryName: addGoodsType,
              goodsItemCode: addGoodsName,
              supplierId: Number(addSupplierId),
              supplierName: addSupplier,
              number: Number(addGoodsNumber),
              purchasePrice: (Number(addGoodsPrice) * 100).toFixed(0),
              amount: (amount * 100).toFixed(0),
              remark: addRemark,

              unitName: addUnitName,//商品单位
              goodsId: Number(addGoodsId)

            };
            var arrData = $('#detailsInfo_stockIn').datagrid('getRows');
            arrData.push(addData);
            $('#detailsInfo_stockIn').datagrid('loadData', arrData);
            $('#detailsInfo_stockIn').datagrid('reload');
            $('#dialogDiv').dialog('close');
            eapor.stockIn.setcountInfoDatagridValue();
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
      $.messager.show({ title: '系统提示', msg: '请先选择要入库的库名称！', timeout: 2000, showType: 'slide' });
      return;
    }
  });
  //删除btn
  $('#delGoods_stockIn').click(function () {
    var indexList = $('#detailsInfo_stockIn').datagrid('getSelections');
    if (indexList.length > 0) {
      for (let i = 0; i < indexList.length; i++) {
        var index = $('#detailsInfo_stockIn').datagrid('getRowIndex', indexList[i]);
        $('#detailsInfo_stockIn').datagrid('deleteRow', index);
      }
      if ($('#detailsInfo_stockIn').datagrid('getSelections').length == 0) {
        $('#detailsInfo_stockIn').datagrid('clearChecked');
      }
      eapor.stockIn.setcountInfoDatagridValue();
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      return;
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要删除的商品！', timeout: 2000 });
      return;
    }
  });
  //编辑btn
  $('#editGoods_stockIn').click(function () {

    var indexList = $('#detailsInfo_stockIn').datagrid('getSelections');
    if (indexList.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的商品！', timeout: 2000 });
      return;
    } else if (indexList.length == 1) {
      console.info(indexList[0]);
      $('#appendDiv_stockIn').append(
        '<div id="dialogDiv" style="padding:30px 0 0 60px;">' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsType_stockIn" style="width:210px;"' +
        'label="商品类别：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsName_stockIn" style="width:210px;"' +
        'label="商品名称：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addSupplier_stockIn" style="width:210px;"' +
        'label="供应商：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsNumber_stockIn" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>入库数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addGoodsPrice_stockIn" style="width:210px;"' +
        'label="<span style=\'color:red;font-size:16px;\'>*</span>进价：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        '<input id="addRemark_stockIn" style="width:210px;"' +
        'label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
        '</div>' +
        '</div>'
      );
      //商品类别
      var y = -1;

      $('#addGoodsType_stockIn').combobox({
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
          $('#addGoodsType_stockIn').combobox('setValue', indexList[0].goodsCategoryId);
          $('#addGoodsType_stockIn').combobox('setText', indexList[0].goodsCategoryName);
        },
        onSelect: function (data) {
          if (y == -1) {
            //商品名称
            y = 0;
            $('#addGoodsName_stockIn').combobox({
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
            // eapor.stockIn.getGoodsNameListByChangeGoodsType(goodsCategoryId);

            var getGoodsType = data.goodsCategoryId;
            console.info(getGoodsType);

            if (getGoodsType != "") {
              $('#addGoodsName_stockIn').combobox({
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
                  console.info(result);
                  if (result.length > 0) {
                    $('#addGoodsName_stockIn').combobox('setValue', result[0].goodsId);
                    $('#addGoodsName_stockIn').combobox('setText', result[0].goodsItemCode);
                  }
                }
              });
            } else {
              $('#addGoodsName_stockIn').combobox({
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
      $('#addGoodsName_stockIn').combobox({
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
      //供应商
      $('#addSupplier_stockIn').combobox({
        editable: false,
        url: '../warehouse/listSupplierPage',
        queryParams: { supplierName: '', offset: 0, limit: 9999 },
        valueField: 'supplierId',
        textField: 'supplierName',
        panelHeight: "auto",
        panelMaxHeight: 200,
        //required:true,
        //missingMessage:"供应商不能为空！",
        validateOnCreate: false,
        validateOnBlur: true,
        onLoadSuccess: function (data) {
          $(this).combobox('setValue', indexList[0].supplierId);
          $(this).combobox('setText', indexList[0].supplierName);
        },
        loadFilter: function (data) {
          if (data != -3333 && data != -3335) {
            data.unshift({ 'supplierId': 0, 'supplierName': '--' });
          }
          return data;
        }
      });
      $('#addGoodsNumber_stockIn').textbox({
        required: true,
        validType: ['number', 'noNegativeNumber'],
        missingMessage: "请输入出库数量",
        invalidMessage: "格式不正确",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#addGoodsNumber_stockIn').textbox('setValue', indexList[0].number);
      $('#addGoodsPrice_stockIn').numberbox({
        required: true,
        missingMessage: "请输入进价,最小值为0",
        min: 0.00,
        value: 0,
        precision: "2",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#addGoodsPrice_stockIn').numberbox('setValue', NP.divide(indexList[0].purchasePrice, 100));
      $('#addRemark_stockIn').textbox({
        multiline: true,
        validType: "maxLength[32]",
        invalidMessage: "最多输入32个字符"
      });
      $('#addRemark_stockIn').textbox('setValue', indexList[0].remark);

      $('#dialogDiv').dialog({
        title: '编辑入库项',
        width: 360,
        height: 360,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            var getData = $('#addGoodsName_stockIn').combobox('getData');
            var addGoodsTypeId = $('#addGoodsType_stockIn').combobox('getValue');
            var addGoodsType = $('#addGoodsType_stockIn').combobox('getText');
            if (!$('#addGoodsType_stockIn').combobox('isValid')) {
              $('#addGoodsType_stockIn').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '要编辑的商品类型不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addGoodsId = $('#addGoodsName_stockIn').combobox('getValue');
            var addGoodsName = $('#addGoodsName_stockIn').combobox('getText');
            if (!$('#addGoodsName_stockIn').combobox('isValid')) {
              $('#addGoodsName_stockIn').combobox('textbox').focus();
              $.messager.show({ title: '系统提示', msg: '要编辑的商品名称不能为空！', timeout: 2000, showType: 'slide' });
              return;
            }
            var addSupplierId = $('#addSupplier_stockIn').combobox('getValue');
            var addSupplier = $('#addSupplier_stockIn').combobox('getText');
            /*if(!$('#addSupplier_stockIn').combobox('isValid')){
              $('#addSupplier_stockIn').combobox('textbox').focus();
              $.messager.show({title:'系统提示',msg:'要编辑的供应商名称不能为空！',timeout:2000,showType:'slide'});
              return;
            }*/
            var addGoodsNumber = $('#addGoodsNumber_stockIn').textbox('getValue');
            if (!$('#addGoodsNumber_stockIn').textbox('isValid')) {
              $('#addGoodsNumber_stockIn').textbox('textbox').focus();
              return;
            }
            var addGoodsPrice = $('#addGoodsPrice_stockIn').numberbox('getValue');
            if (!$('#addGoodsPrice_stockIn').numberbox('isValid')) {
              $('#addGoodsPrice_stockIn').numberbox('textbox').focus();
              return;
            }
            var amount = (Number(addGoodsNumber) * Number(addGoodsPrice));
            if (!$('#addRemark_stockIn').textbox('isValid')) {
              $('#addRemark_stockIn').textbox('textbox').focus();
              return;
            }
            var addRemark = $('#addRemark_stockIn').textbox('getValue');
            var addUnitName = "";
            for (let i = 0; i < getData.length; i++) {
              if (addGoodsId == getData[i].goodsId) {
                addUnitName = getData[i].unitName;
                break;
              }
            }
            var addData = {
              goodsCategoryId: Number(addGoodsTypeId),
              goodsCategoryName: addGoodsType,
              goodsItemCode: addGoodsName,
              supplierId: Number(addSupplierId),
              supplierName: addSupplier,
              number: Number(addGoodsNumber),
              purchasePrice: (Number(addGoodsPrice) * 100).toFixed(0),
              amount: (amount * 100).toFixed(0),
              remark: addRemark,

              unitName: addUnitName,//商品单位
              goodsId: Number(addGoodsId)

            };
            var getidx = $('#detailsInfo_stockIn').datagrid('getRowIndex', indexList[0]);
            if ($('#detailsInfo_stockIn').datagrid('getSelections').length != 0) {
              $('#detailsInfo_stockIn').datagrid('clearChecked');
            }
            $('#detailsInfo_stockIn').datagrid('updateRow', {
              index: getidx,
              row: addData
            });
            $('#dialogDiv').dialog('close');
            eapor.stockIn.setcountInfoDatagridValue();

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

  //打印临时入库单
  $('#print_StockIn').click(function () {
    var getSelected = $('#detailsInfo_stockIn').datagrid('getRows');
    if (getSelected.length == 0) {
      $.messager.show({ title: '系统提示', msg: '操作无效！无入库信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var data = {
      stockName: $('#shortInfo_stockIn').datagrid('getRows')[0].warehouseName,
      date: getDate(new Date()),
      userName: $('#indexusername').val(),
      numberCount: $('#countInfo_stockIn').datagrid('getRows')[0].countNumber,
      amountCount: $('#countInfo_stockIn').datagrid('getRows')[0].countAmount,
      list: $('#detailsInfo_stockIn').datagrid('getRows')
    }
    console.info(data);
    eapor.stockIn.printReportCallBack(data);
  });
  //确认入库btn
  $('#submit_stockIn').click(function () {

    var warehouseId = $('#selectWarehouse_stockIn').combobox('getValue');
    if (warehouseId) {
      var getData = $('#detailsInfo_stockIn').datagrid('getSelections');
      for (let i = 0; i < getData.length; i++) {
        if (getData[i].supplierId == 0) {
          getData[i].supplierName = "";
        }
      }
      console.info(getData);
      if (getData.length > 0) {
        var data = {
          warehouseId: Number(warehouseId),
          remark: "",
          goodsList: JSON.stringify(getData)
        };
        if (!stockIn_clickFlag) {
          $.messager.show({ title: '系统提示', msg: '等待提交结果中~请勿重复提交！', timeout: 2000, showType: 'slide' });
          return;
        }
        stockIn_clickFlag = false;
        eapor.utils.defaultAjax('../warehouse/AddGoodsin', data, eapor.stockIn.addGoodsSubmitCallBack);
      } else {
        $.messager.show({ title: '系统提示', msg: '请选择要入库的商品！', timeout: 2000 });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '请选择要入库的库名称！', timeout: 2000 });
      return;
    }
  });


  eapor.stockIn = {
    changeFlag: true,
    init: function () {
      $('#selectWarehouse_stockIn').combobox({
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
          if (!eapor.stockIn.changeFlag) return;
          var warehouseName = $(this).combobox('getText');
          if (oldValue != "" && eapor.stockIn.changeFlag) {
            $.messager.confirm('系统提示', '是否要切换库？', function (r) {
              if (r) {
                var arr = [];
                var data = {
                  warehouseName: warehouseName,
                  userName: $('#indexusername').val()
                };
                arr.push(data);
                $('#shortInfo_stockIn').datagrid('loadData', arr);
                $('#shortInfo_stockIn').datagrid('reload');
                eapor.stockIn.changeFlag = true;
              } else {
                var data1 = $('#selectWarehouse_stockIn').combobox('getData');
                console.info(data1)
                for (let i = 0; i < data1.length; i++) {
                  if (data1[i].warehouseId == oldValue) {
                    eapor.stockIn.changeFlag = false;
                    $('#selectWarehouse_stockIn').combobox('setValue', oldValue);
                    $('#selectWarehouse_stockIn').combobox('setText', data1[i].warehouseName);
                    eapor.stockIn.changeFlag = true;
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
            $('#shortInfo_stockIn').datagrid('loadData', arr);
            $('#shortInfo_stockIn').datagrid('reload');
            eapor.stockIn.changeFlag = true;
          }
        }
      });
    },
    //设置汇总的datagrid的值
    setcountInfoDatagridValue: function () {
      $('#countInfo_stockIn').datagrid('loadData', { total: 0, rows: [] });
      $('#countInfo_stockIn').datagrid('reload');
      var getCountData = {
        countTypeNumber: eapor.utils.computeType('detailsInfo_stockIn', 'goodsCategoryId'),
        countNumber: eapor.utils.compute('detailsInfo_stockIn', 'number'),
        countAmount: eapor.utils.compute('detailsInfo_stockIn', 'amount')
      };
      var getCountarr = [];
      getCountarr.push(getCountData);
      $('#countInfo_stockIn').datagrid('loadData', getCountarr);
      $('#countInfo_stockIn').datagrid('reload');
    },
    //新增提交的回调函数
    addGoodsSubmitCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        stockIn_clickFlag = true;
        return;
      }
      if (result > 0) {
        var indexList = $('#detailsInfo_stockIn').datagrid('getSelections');
        for (let i = 0; i < indexList.length; i++) {
          var index = $('#detailsInfo_stockIn').datagrid('getRowIndex', indexList[i]);
          $('#detailsInfo_stockIn').datagrid('deleteRow', index);
        }
        if ($('#detailsInfo_stockIn').datagrid('getSelections').length == 0) {
          $('#detailsInfo_stockIn').datagrid('clearChecked');
        }
        eapor.stockIn.setcountInfoDatagridValue();
        $.messager.show({ title: '系统提示', msg: '入库成功！', timeout: 2000, showType: 'slide' });
        stockIn_clickFlag = true;
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '入库失败！', timeout: 2000, showType: 'slide' });
        stockIn_clickFlag = true;
        return;
      }
    },
    getGoodsNameListByChangeGoodsTypeCallBack: function (result) {
      console.info(result);
      $('#addGoodsName_stockIn').combobox('clear');
      $('#addGoodsName_stockIn').combobox('loadData', { total: 0, row: [] });//{total:0,row:[]}
      if (result.length > 0) {
        $('#addGoodsName_stockIn').combobox({
          data: result
        });
        $('#addGoodsName_stockIn').combobox('setValue', result[0].goodsId);
        $('#addGoodsName_stockIn').combobox('setText', result[0].goodsItemCode);
      }
    },
    //改变商品类别，后改变商品名称内的数据源
    getGoodsNameListByChangeGoodsType: function (id) {
      console.info(id);
      var data = {};
      data.offset = 0;
      data.limit = 9999;
      data.goodsName = "" /*按商品名称搜索*/
      data.goodsCategoryId = id;  /*按商品分类id搜索*/
      data.saleState = 1;/*经营状态   1上架 2下架  0全部*/
      eapor.utils.defaultAjax("../Goods/listGoodsPage", data, eapor.stockIn.getGoodsNameListByChangeGoodsTypeCallBack);
    },
    //打印临时入库单
    printReportCallBack: function (result) {
      console.info(result);
      var info = result.list;
      var title = "入库_" + result.stockName + "_" + result.date + "_" + result.userName;
      $('#reportTitle_inStock').html(title);
      $('#inStockPrintTbody').empty();
      var totalPurchasePrice = 0;
      var totalAmount = 0;
      for (let i = 0; i < info.length; i++) {
        $('#inStockPrintTbody').append(
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

      $('#inStockPrintTbody').append(
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
      var popTitle = "入库_" + result.stockName + "_" + result.date;
      $("div#inStockPrint").printArea({ popTitle: popTitle, mode: 'popup' });
    }
  };
  eapor.stockIn.init();
})();