/**
 * @JS名称：房价方案管理
 */
~(function () {
  "use strict";

  let clickFlag_roomPricePlan = true,
    roomPricePlanList = {},
    roomPricePlanArray = {},
    roomPricePlanData = {},
    rowSelect_roomPricePlan = null,
    onlySelectedOneRowFlag = 0;

  function roomPricePlanLoader(param, success, error) {
    if (!$.isEmptyObject(roomPricePlanArray)) {
      success(roomPricePlanArray);
      return true;
    }
    $.ajax({
      url: "../rentplan/pglist",
      type: "post",
      dataType: "json",
      data: roomPricePlanList,
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
        roomPricePlanArray = data;
        success(roomPricePlanArray);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  function roomPricePlanSearchLoader(param, success, error) {
    $.ajax({
      url: "../rentplan/pgcount",
      type: "post",
      data: roomPricePlanData,
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  /*删除回调*/
  function roomPricePlan_RemoveCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({
        title: '系统提示', msg: '该房价方案含有所对应的房价！不可删除！', timeout: 2000
      });
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      var data = {};
      data.rentplanName = $('#roomPricePlanName').textbox('getValue');
      eapor.utils.defaultAjax('../rentplan/pgcount', data, roomPricePlan_getPageCountCallback);
    }
  }
  /*删除*/
  function roomPricePlan_Remove() {
    var select = $('#roomPricePlanList').datagrid('getSelected');
    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择一个房价方案！', timeout: 2000 });
      return;
    }
    var name = select.rentplanName;
    if (name == "会员价" || name == "非会员价") {
      $.messager.show({ title: '系统提示', msg: '该方案为默认方案，不可删除！', timeout: 2000 });
      return;
    }
    $.messager.confirm('系统提示', '您确定要删除该房价方案吗？', function (r) {
      if (r) {
        var data = {};
        data.rentplanId = select.rentplanId;
        eapor.utils.defaultAjax('../rentplan/del', data, roomPricePlan_RemoveCallback);
      }
    })
  };
  /*编辑回调*/
  function roomPricePlan_EditCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '编辑失败！已存在相同的房价方案！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data = {};
      data.rentplanName = $('#roomPricePlanName').textbox('getValue');
      eapor.utils.defaultAjax('../rentplan/pgcount', data, roomPricePlan_getPageCountCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
  }

  //编辑
  function roomPricePlan_Edit() {
    var select = $('#roomPricePlanList').datagrid('getSelected');
    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择一个房价方案！', timeout: 2000 });
      return;
    }
    var name = select.rentplanName;
    if (name == "会员价" || name == "非会员价") {
      $.messager.show({ title: '系统提示', msg: '该方案为默认方案，不可编辑！', timeout: 2000 });
      return;
    }
    $('#roomPricePlanEditDialog').append(
      '<div id="div" style="padding:25px 35px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPricePlan_EditName" label="<span style=\'color:red\'>*</span>方案名称：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;">' +
      '</div>' +
      '<div>' +
      '<input id="roomPricePlan_EditRemark"  label="备注：" labelWidth="90px;" labelAlign="right"  labelPosition="before" style="width:230px;">' +
      '</div>' +
      '</div>'
    );
    $('#roomPricePlan_EditName').textbox({
      required: true,
      missingMessage: "方案名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPricePlan_EditRemark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPricePlan_EditName').textbox('setValue', select.rentplanName);
    $('#roomPricePlan_EditRemark').textbox('setValue', select.remark);
    $('#roomPricePlan_EditId').val(select.rentplanId);
    $('#div').dialog({
      title: '编辑房价方案',
      width: 340,
      height: 215,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#roomPricePlan_EditName').textbox('isValid')) {
            $('#roomPricePlan_EditName').textbox('textbox').focus();
            return;
          }
          if (!$('#roomPricePlan_EditRemark').textbox('isValid')) {
            $('#roomPricePlan_EditRemark').textbox('textbox').focus();
            return;
          }
          var data = {};
          data.rentplanName = $('#roomPricePlan_EditName').textbox('getValue');
          data.remark = $('#roomPricePlan_EditRemark').textbox('getValue');
          data.rentplanId = select.rentplanId;
          console.info(data);
          if (clickFlag_roomPricePlan == false) {
            return;
          }
          clickFlag_roomPricePlan = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          console.info(data);
          $.ajax({
            type: 'post',
            url: '../rentplan/edit',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              roomPricePlan_EditCallback(result);
            })
            .always(function () {
              clickFlag_roomPricePlan = true;
              that.removeClass("l-btn-disabled");
            });
          //eapor.utils.defaultAjax('../rentplan/edit',data,roomPricePlan_EditCallback);
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
  function roomPricePlan_AddCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '新增失败！您所添加的房价方案已经存在！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data = {};
      data.rentplanName = $('#roomPricePlanName').textbox('getValue');
      eapor.utils.defaultAjax('../rentplan/pgcount', data, roomPricePlan_getPageCountCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
  }


  /*新增*/
  function roomPricePlan_Add() {
    $('#roomPricePlanAddDialog').append(
      '<div id="div" style="padding:25px 35px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomPricePlan_AddName"  label="<span style=\'color:red\'>*</span>方案名称：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;">' +
      '</div>' +
      '<div>' +
      '<input id="roomPricePlan_AddRemark" label="备注：" labelWidth="90px;" labelAlign="right" labelPosition="before" style="width:230px;">' +
      '</div>' +
      '</div>'
    );
    $('#roomPricePlan_AddName').textbox({
      required: true,
      missingMessage: "方案名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomPricePlan_AddRemark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#div').dialog({
      title: '新增房价方案',
      width: 340,
      height: 215,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#roomPricePlan_AddName').textbox('isValid')) {
            $('#roomPricePlan_AddName').textbox('textbox').focus();
            return;
          }
          if (!$('#roomPricePlan_AddRemark').textbox('isValid')) {
            $('#roomPricePlan_AddRemark').textbox('textbox').focus();
            return;
          }
          var data = {};
          data.rentplanName = $('#roomPricePlan_AddName').textbox('getValue');
          data.remark = $('#roomPricePlan_AddRemark').textbox('getValue');

          if (clickFlag_roomPricePlan == false) {
            return;
          }
          clickFlag_roomPricePlan = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../rentplan/add',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              roomPricePlan_AddCallback(result);
            })
            .always(function () {
              clickFlag_roomPricePlan = true;
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
  /*搜索*/
  $('#roomPricePlanSearch').on('click', function () {
    var data = {};
    data.rentplanName = $('#roomPricePlanName').textbox('getValue');
    roomPricePlanData = data;
    eapor.utils.defaultAjax('../rentplan/pgcount', data, roomPricePlan_getPageCountCallback);
  });
  /*分页按钮*/
  function roomPricePlan_getPageListClickCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    roomPricePlanArray = result;
    $('#roomPricePlanList').datagrid('options').loader = roomPricePlanLoader;
    $('#roomPricePlanList').datagrid('reload');
  }
  /*list*/

  function roomPricePlan_getPageListCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    roomPricePlanArray = result;
    console.info(roomPricePlanArray);
    $('#roomPricePlanList').datagrid({
      loader: roomPricePlanLoader,
      title: '房价方案列表', 		//表格标题
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
      onClickRow: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag == 2) {
          onlySelectedOneRowFlag = 0;
          return;
        } else {
          onlySelectedOneRowFlag = 1;
        }

        let rows = $(this).datagrid('getChecked');
        let flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_roomPricePlan = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_roomPricePlan = null;
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
        if (rowData != rowSelect_roomPricePlan) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_roomPricePlan = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_roomPricePlan = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('roomPricePlanList', 'rentplanName', 4, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          roomPricePlan_Add();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          roomPricePlan_Edit();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          roomPricePlan_Remove();
        }
      }],
      columns: [[
        { field: 'ck', title: '', checkbox: true },
        { field: 'rentplanId', title: "房价方案ID", hidden: true, align: 'center' },
        { field: 'rentplanName', title: "房价方案名称", align: 'center', width: 100 },
        {
          field: 'modifyTime', title: "最后修改时间", width: 100, align: 'center',
          formatter: function (value, row, index) {
            if (row.rentplanName == "会员价" || row.rentplanName == "非会员价") {
              return "";
            } else if (value == undefined) {
              return getDate(row.createTime);
            } else {
              return getDate(value);
            }
          }
        },
        { field: 'remark', title: "备注", align: 'center', width: 100 },
        {
          field: 'modifyUsername', title: "最后编辑人", align: 'center', width: 100,
          formatter: function (value, row, index) {
            if (value == undefined) {
              return row.createUsername;
            } else {
              return value;
            }
          }
        },

        { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
        { field: 'modifyUserId', title: "modifyUserId", align: 'center', width: 100, hidden: true },
        { field: 'version', title: "version", align: 'center', width: 100, hidden: true },
        { field: 'createTime', title: "createTime", align: 'center', width: 100, hidden: true },
        { field: 'createUserId', title: "createUserId", align: 'center', width: 100, hidden: true },
        { field: 'createUsername', title: "createUsername", align: 'center', width: 100, hidden: true }
      ]]
    })

  }
  /*count*/
  function roomPricePlan_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    $('#roomPricePlan_page').pagination({
      total: result,
      loading: true,
      showRefresh: false,
      onSelectPage: function (pageNumber, pageSize) {
        var data = {};
        data.offset = pageSize * (pageNumber - 1);
        data.limit = pageSize;
        data.rentplanName = $('#roomPricePlanName').textbox('getValue');
        eapor.utils.defaultAjax('../rentplan/pglist', data, roomPricePlan_getPageListClickCallback);
      }
    });

    var page = $('#roomPricePlan_page').pagination('options');
    var data = {};
    data.offset = 0;
    data.limit = page.pageSize;
    data.rentplanName = $('#roomPricePlanName').textbox('getValue');
    roomPricePlanList = data;
    eapor.utils.defaultAjax('../rentplan/pglist', data, roomPricePlan_getPageListCallback);

  }
  $('#roomPricePlanName').textbox({});
  var data = {};
  data.rentplanName = $('#roomPricePlanName').textbox('getValue');

  eapor.utils.defaultAjax('../rentplan/pgcount', data, roomPricePlan_getPageCountCallback);

})();