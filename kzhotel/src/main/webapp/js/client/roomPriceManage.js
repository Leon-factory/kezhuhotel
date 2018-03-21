/**
 * @JSname：房价管理
 */
~(function () {
  "use strict";
	/*var layoutDiv = window.document.getElementById('layout_roomPriceManage');
	layoutDiv.style.height=(eapor.h-57)+"px";
	layoutDiv.style.minHeight=660+"px";*/

  var clickFlag_roomPriceManage = true,
    setPageNumber = 1,
    setPageSize = 20,
    roomPrice_getAddOrRemoveCountCallback = function (result) {
      $('#roomPriceManage_page').pagination({ total: result });
      var data = {};
      data = initLoadRoomPrice();
      data.offset = NP.times(setPageSize, (setPageNumber - 1));
      data.limit = setPageSize;
      eapor.utils.defaultAjax('../rentprice/pglist', data, roomPrice_pageClickCallback);
    },
    roomPriceManage_roomPricePlanArray = {}
    , roomPriceManage_roomTypeArray = {}
    , roomPrice_roomPriceArray = [];

  /*房价方案loader*/
  var roomPriceManage_roomPricePlanLoader = function (param, success, error) {
    if (!$.isEmptyObject(roomPriceManage_roomPricePlanArray)) {
      success(roomPriceManage_roomPricePlanArray);
      return true;
    }
    $.ajax({
      url: "../rentplan/pglist",
      type: "post",
      dataType: "json",
      data: {
        offset: 0,
        limit: 9999,
        rentplanName: ""
      },
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }

        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          success([]);
          return true;
        }
        if (data == "") {
          success([]);
          return true;
        }
        roomPriceManage_roomPricePlanArray = data;
        success(roomPriceManage_roomPricePlanArray);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  /*房型loader*/
  var roomPriceManage_roomTypeLoader = function (param, success, error) {
    if (!$.isEmptyObject(roomPriceManage_roomTypeArray)) {
      success(roomPriceManage_roomTypeArray);
      return true;
    }
    $.ajax({
      url: "../roomtype/lrtc",
      type: "post",
      dataType: "json",
      data: {
        offset: 0,
        limit: 9999,
        roomtypeName: ""
      },
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }

        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          success([]);
          return true;
        }
        if (data == "") {
          success([]);
          return true;
        }
        roomPriceManage_roomTypeArray = data;
        success(roomPriceManage_roomTypeArray);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };


  /*房价loader*/

  var roomPrice_roomPriceLoader = function (param, success, error) {
    if (roomPrice_roomPriceArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(roomPrice_roomPriceArray)) {
      success(roomPrice_roomPriceArray);
      return true;
    }
    $.ajax({
      url: "../rentprice/pglist",
      type: "post",
      dataType: "json",
      data: {
        offset: 0,
        limit: 20,
        rentplanId: 0,
        roomtypeId: 0,
        checkinType: 0,
        timeinterval: 0
      },
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        roomPrice_roomPriceArray = data;
        success(roomPrice_roomPriceArray);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  /*当确定房型时，应确定入住方式*/
  function roomPrice_choiseRoomType(record) {
    var checkin = $("#roomPrice_AddCheckinType");
    var data = checkin.combobox("getData");
    var late = record.lateRoom;//晚房
    var rest = record.restRoom;//钟点房
    var chooseRoomtype = [];

    if (late == 0) {
      //该房型不支持晚房
      chooseRoomtype = [{
        "id": 1,
        "text": "全日房"
      }, {
        "id": 2,
        "text": "钟点房"
      }];
    }

    if (rest == 0) {
      //该房型不支持钟点房
      chooseRoomtype = [{
        "id": 1,
        "text": "全日房"
      }, {
        "id": 3,
        "text": "晚房"
      }];
    }

    if (late == 0 && rest == 0) {
      //该房型既不支持晚房也不支持钟点房
      chooseRoomtype = [{
        "id": 1,
        "text": "全日房"
      }];
    }

    $("#roomPrice_AddCheckinType").combobox({
      data: chooseRoomtype
    })
  }


  /*删除回调*/
  function roomPrice_RemoveCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '删除房价失败！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      var data1 = {};
      data1 = initLoadRoomPrice();
      eapor.utils.defaultAjax('../rentprice/pgcount', data1, roomPrice_getAddOrRemoveCountCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000 });
  }
  /*删除*/
  function roomPrice_Remove() {
    var select = $('#roomPriceList').datagrid('getSelected');
    if (!select || select.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择一个房价！', timeout: 2000 });
      return;
    }
    $.messager.confirm('系统提示', '您确定删除此房价吗？', function (r) {
      if (r) {
        var data = {};
        data.rentpriceId = select.rentpriceId;
        eapor.utils.defaultAjax('../rentprice/del', data, roomPrice_RemoveCallback);
      }
    })
  };

  /*编辑回调*/
  function roomPrice_EditCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -1111) {
      $.messager.show({ title: '系统提示', msg: '操作失败！该房型无钟点房设置！', timeout: 2000 });
      return;
    }
    if (result == -1112) {
      $.messager.show({ title: '系统提示', msg: '操作失败！该房型无晚房设置！', timeout: 2000 });
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '操作失败！已存在相同的房价！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data = {};
      data = initLoadRoomPrice();
      data.offset = NP.times(setPageSize, (setPageNumber - 1));
      data.limit = setPageSize;

      eapor.utils.defaultAjax('../rentprice/pglist', data, roomPrice_pageClickCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000 });
  }


  /*编辑*/
  function roomPrice_Edit() {
    var select = $('#roomPriceList').datagrid('getSelected');
    if (!select || select.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择一项要编辑的信息！', timeout: 2000 });
      return;
    }
    $('#roomPrice_EditDialog').append(
      '<div id="div" style="padding:20px 0 0 40px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_EditRoomType" label="<span style=\'color:red;\'>*</span>房间类型：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_EditRoomPricePlan" label="<span style=\'color:red;\'>*</span>房价方案：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<select id="roomPrice_EditCheckinType"  labelWidth="90px;" labelAlign="right"  label="<span style=\'color:red;\'>*</span>入住方式：" labelPosition="before" style="width:230px;" >' +
      '<option value="1">全日房</option>' +
      '<option value="2">钟点房</option>' +
      '<option value="3">晚房</option>' +
      '</select>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<select id="roomPrice_EditTimeinterval"   label="<span style=\'color:red;\'>*</span>入住时段：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;" >' +
      '<option value="1">平日</option>' +
      '<option value="2">周末</option>' +
      '<option value="3">节假日</option>' +
      '</select>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_EditPrice"  label="<span style=\'color:red;\'>*</span>价格：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_EditRemark"  label="备注：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;">' +
      '</div>' +
      '</div>'
    );
    $('#roomPrice_EditRoomType').combobox({
      loader: roomPriceManage_roomTypeLoader,
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false,
      required: true,
      missingMessage: "房间类型不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_EditRoomPricePlan').combobox({
      loader: roomPriceManage_roomPricePlanLoader,
      valueField: 'rentplanId',
      textField: 'rentplanName',
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false,
      required: true,
      missingMessage: "房间方案不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_EditCheckinType').combobox({
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false
    });
    $('#roomPrice_EditTimeinterval').combobox({
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false
    });
    $('#roomPrice_EditPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "价格不能为空！",
      validType: ['numMaxTwoDecimal'],
      invalidMessage: "请输入非负数，最多2位小数",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_EditRemark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最多输入32位字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#roomPrice_EditRoomType').combobox('setValue', select.roomtypeId);
    $('#roomPrice_EditRoomPricePlan').combobox('setValue', select.rentplanId);
    $('#roomPrice_EditCheckinType').combobox('setValue', select.checkinType);
    $('#roomPrice_EditTimeinterval').combobox('setValue', select.timeinterval);
    $('#roomPrice_EditPrice').numberbox('setValue', NP.divide(select.price, 100));
    $('#roomPrice_EditRemark').textbox('setValue', select.remark);
    $('#div').dialog({
      title: '编辑房价',
      width: 360,
      height: 380,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#roomPrice_EditRoomType').combobox('isValid')) {
            $('#roomPrice_EditRoomType').combobox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_EditRoomPricePlan').combobox('isValid')) {
            $('#roomPrice_EditRoomPricePlan').combobox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_EditPrice').numberbox('isValid')) {
            $('#roomPrice_EditPrice').numberbox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_EditRemark').textbox('isValid')) {
            $('#roomPrice_EditRemark').textbox('textbox').focus();
            return;
          }
          var rentpriceId = select.rentpriceId;
          var roomtypeId = $('#roomPrice_EditRoomType').combobox('getValue');
          var timeinterval = $('#roomPrice_EditTimeinterval').combobox('getValue');
          var checkinType = $('#roomPrice_EditCheckinType').combobox('getValue');
          var rentplanId = $('#roomPrice_EditRoomPricePlan').combobox('getValue');
          var price = $('#roomPrice_EditPrice').numberbox('getValue');
          var remark = $('#roomPrice_EditRemark').textbox('getValue');

          var data = {};
          data.rentpriceId = rentpriceId;
          data.remark = remark;
          data.roomtypeId = roomtypeId;
          data.timeinterval = timeinterval;
          data.checkinType = checkinType;
          data.rentplanId = rentplanId;
          data.price = NP.times(price, 100);

          if (clickFlag_roomPriceManage == false) {
            return;
          }
          clickFlag_roomPriceManage = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../rentprice/EditRentPrice',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              roomPrice_EditCallback(result);
            })
            .always(function () {
              clickFlag_roomPriceManage = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }

  /*新增回调*/
  function roomPrice_AddCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -1111) {
      $.messager.show({ title: '系统提示', msg: '新增失败！该房型无钟点房设置！', timeout: 2000 });
      return;
    }
    if (result == -1112) {
      $.messager.show({ title: '系统提示', msg: '新增失败！该房型无晚房设置！', timeout: 2000 });
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '新增失败！您所添加的房价已经存在', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data1 = {};
      data1 = initLoadRoomPrice();
      eapor.utils.defaultAjax('../rentprice/pgcount', data1, roomPrice_getAddOrRemoveCountCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
  }

  /*新增*/
  function roomPrice_Add() {
    $('#roomPrice_AddDialog').append(
      '<div id="div" style="padding:20px 0 0 40px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_AddRoomType" label="<span style=\'color:red;\'>*</span>房间类型：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_AddRoomPricePlan"   label="<span style=\'color:red;\'>*</span>房价方案：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<select id="roomPrice_AddCheckinType"   label="<span style=\'color:red;\'>*</span>入住方式：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;" >' +
      '<option value="1">全日房</option>' +
      '<option value="2">钟点房</option>' +
      '<option value="3">晚房</option>' +
      '</select>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<select id="roomPrice_AddTimeinterval"  labelWidth="90px;" labelAlign="right" label="<span style=\'color:red;\'>*</span>入住时段：" labelPosition="before" style="width:230px;" >' +
      '<option value="1">平日</option>' +
      '<option value="2">周末</option>' +
      '<option value="3">节假日</option>' +
      '</select>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_AddPrice"  label="<span style=\'color:red;\'>*</span>价格：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPrice_AddRemark"  label="备注：" labelPosition="before" labelWidth="90px;" labelAlign="right" style="width:230px;">' +
      '</div>' +
      '</div>'
    );

    $('#roomPrice_AddRoomType').combobox({
      loader: roomPriceManage_roomTypeLoader,
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].roomtypeId);
          $(this).combobox('setText', data[0].roomtypeName);
        }
      },
      required: true,
      missingMessage: "房间类型不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_AddRoomPricePlan').combobox({
      loader: roomPriceManage_roomPricePlanLoader,
      valueField: 'rentplanId',
      textField: 'rentplanName',
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].rentplanId);
          $(this).combobox('setText', data[0].rentplanName);
        }
      },
      required: true,
      missingMessage: "房间方案不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_AddTimeinterval').combobox({
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false
    });
    $('#roomPrice_AddCheckinType').combobox({
      panelMaxHeight: 200,
      panelHeight: 'auto',
      editable: false
    });
    $('#roomPrice_AddPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "价格不能为空！",
      validType: ['numMaxTwoDecimal'],
      invalidMessage: "请输入非负数，最多2位小数",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPrice_AddRemark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最多输入32位字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#div').dialog({
      title: '新增房价',
      width: 360,
      height: 380,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#roomPrice_AddRoomType').combobox('isValid')) {
            $('#roomPrice_AddRoomType').combobox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_AddRoomPricePlan').combobox('isValid')) {
            $('#roomPrice_AddRoomPricePlan').combobox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_AddPrice').numberbox('isValid')) {
            $('#roomPrice_AddPrice').numberbox('textbox').focus();
            return;
          }
          if (!$('#roomPrice_AddRemark').textbox('isValid')) {
            $('#roomPrice_AddRemark').textbox('textbox').focus();
            return;
          }

          var price = $('#roomPrice_AddPrice').numberbox('getValue');

          var data = {};
          data.roomtypeId = $('#roomPrice_AddRoomType').combobox('getValue');
          data.rentplanId = $('#roomPrice_AddRoomPricePlan').combobox('getValue');
          data.timeinterval = $('#roomPrice_AddTimeinterval').combobox('getValue');
          data.checkinType = $('#roomPrice_AddCheckinType').combobox('getValue');
          data.price = NP.times(price, 100);
          data.remark = $('#roomPrice_AddRemark').textbox('getValue');

          if (clickFlag_roomPriceManage == false) {
            return;
          }
          clickFlag_roomPriceManage = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../rentprice/add',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              roomPrice_AddCallback(result);
            })
            .always(function () {
              clickFlag_roomPriceManage = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  };

  /*搜索*/
  $('#roomPrice_search').on('click', function () {
    var data = {};
    data = initLoadRoomPrice();
    eapor.utils.defaultAjax('../rentprice/pgcount', data, roomPrice_getCountCallback);
  });
  /*分页按钮*/
  function roomPrice_pageClickCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    roomPrice_roomPriceArray = result;
    $('#roomPriceList').datagrid('options').loader = roomPrice_roomPriceLoader;
    $('#roomPriceList').datagrid('reload');
  }
  /*list*/
  var rowSelect_roomPrice = null,
    onlySelectedOneRowFlag = 0;
  function roomPrice_getListCallback(result) {

    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    roomPrice_roomPriceArray = result;

    $('#roomPriceList').datagrid({
      loader: roomPrice_roomPriceLoader,
      title: '房价列表', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      rownumbers: true,
      fit: false,
      checkOnSelect: false,
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          roomPrice_Add();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          roomPrice_Edit();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          roomPrice_Remove();
        }
      }],
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
          rowSelect_roomPrice = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_roomPrice = null;
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

        if (rowData != rowSelect_roomPrice) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_roomPrice = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_roomPrice = null;
        }

        onlySelectedOneRowFlag = 0;
      },
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('roomPriceList', 'roomtypeName', 8, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        //隐藏全选框
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      columns: [[
        { field: 'rentplanId', title: "房价方案ID", align: 'center', hidden: true },
        { field: 'rentpriceId', title: "房价ID", align: 'center', hidden: true },
        { field: 'createTime', title: "createTime", align: 'center', hidden: true },
        { field: 'createUsername', title: "createUsername", align: 'center', hidden: true },

        { field: 'ck', title: '', checkbox: true },
        { field: 'roomtypeName', title: "房型名称", width: 100, align: 'center' },
        { field: 'rentplanName', title: "房价方案名称", align: 'center', width: 100 },
        { field: 'checkinTypeName', title: "入住方式", align: 'center', width: 100 },
        { field: 'timeintervalName', title: "入住时段", align: 'center', width: 100 },
        {
          field: 'price', title: "价格", align: 'center', width: 100,
          formatter: function (value, row, index) {
            return value ? NP.divide(value, 100) : '';
          }
        },
        {
          field: 'modifyTime', title: "最后修改时间", align: 'center', width: 100,
          formatter: function (value, row, index) {
            return value ? getDate(value) : "--";
          }
        },
        {
          field: 'modifyUsername', title: "最后修改人", align: 'center', width: 100,
          formatter: function (value, row, index) {
            return value ? value : "--";
          }
        },
        { field: 'remark', align: 'center', title: "备注", width: 100 }
      ]]
    })
  }

  /*加载count，加载分页控件*/
  function roomPrice_getCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#roomPriceManage_page').pagination({
      total: result,
      loading: true,
      showRefresh: false,
      pageSize: 20,
      onSelectPage: function (pageNumber, pageSize) {
        if (!pageNumber) {
          return;
        }
        setPageNumber = pageNumber;
        setPageSize = pageSize;
        var data = {};
        data = initLoadRoomPrice();
        data.offset = NP.times(pageSize, (pageNumber - 1));
        data.limit = pageSize;

        eapor.utils.defaultAjax('../rentprice/pglist', data, roomPrice_pageClickCallback);
      }
    });

    var page = $('#roomPriceManage_page').pagination('options');
    var data = initLoadRoomPrice();
    data.offset = 0;
    data.limit = page.pageSize;
    eapor.utils.defaultAjax('../rentprice/pglist', data, roomPrice_getListCallback);
  }
  /*获取头部搜索栏信息*/
  function initLoadRoomPrice() {
    var data = {};

    var rentplanId = $('#roomPriceManage_rtp').combobox('getValue');
    if (rentplanId == "" || rentplanId == "全部") {
      rentplanId = 0;
    }

    data.rentplanId = rentplanId;

    var roomtypeId = $('#roomPriceManage_roomtype').combobox('getValue');
    if (roomtypeId == "" || roomtypeId == "全部") {
      roomtypeId = 0;
    }

    data.roomtypeId = roomtypeId;

    var checkinType = $('#roomPriceManage_checkinType').combobox('getValue');
    if (checkinType == "" || checkinType == "全部") {
      checkinType = 0;
    }

    data.checkinType = checkinType;

    var timeinterval = $('#roomPriceManage_timeinterval').combobox('getValue');
    if (timeinterval == "" || timeinterval == "全部") {
      timeinterval = 0;
    }

    data.timeinterval = timeinterval;

    return data;

  }
  function roomPriceManage_getRoomPricePlan(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    var roompriceplanObjAddAll = result;
    var array_roompriceplanObj = {};
    array_roompriceplanObj.rentplanId = 0;
    array_roompriceplanObj.rentplanName = "全部";
    roompriceplanObjAddAll.unshift(array_roompriceplanObj);

    $('#roomPriceManage_rtp').combobox({
      data: roompriceplanObjAddAll,
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      valueField: 'rentplanId',
      textField: 'rentplanName'
    })

  }
  function roomPriceManage_loadRoomTypeAndRoomPricePlan() {
    //加载房型
    $('#roomPriceManage_roomtype').combobox({
      url: '../roomtype/lrtc',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      onShowPanel: function () {
        $(this).combobox('reload');
      },
      loadFilter: function (data) {
        if (data != -3333 && data != -3335) {
          data.unshift({ roomtypeId: 0, roomtypeName: "全部" });
        }
        return data;
      }
    })
    //加载房价方案
    var data = {};
    data.offset = 0;
    data.limit = 999;
    data.rentplanName = "";
    eapor.utils.defaultAjax("../rentplan/pglist", data, roomPriceManage_getRoomPricePlan);
  }

  $('#roomPriceManage_rtp').combobox({});
  $('#roomPriceManage_checkinType').combobox({});
  $('#roomPriceManage_timeinterval').combobox({});
  //加载房型、房价方案
  roomPriceManage_loadRoomTypeAndRoomPricePlan();

  var data = initLoadRoomPrice();
  eapor.utils.defaultAjax('../rentprice/pgcount', data, roomPrice_getCountCallback);

})();