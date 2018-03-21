/**
 * @Js名称：客源基本管理
 * 
 */
~(function () {
  "use strict";
  var clickFlag_guestManage = true,
    setPageNumber = 1,
    setPageSize = 10,
    guestManageListData = {},
    guestManageArray = [],
    rowSelect_guestManage = null,
    onlySelectedOneRowFlag = 0;

  var guestManageLoader = function (param, success, error) {
    if (!$.isEmptyObject(guestManageArray)) {
      success(guestManageArray);
      return true;
    }
    $.ajax({
      url: "../channel/pglist",
      type: "post",
      dataType: "json",
      data: guestManageListData,
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        guestManageArray = data;
        success(guestManageArray);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };


  /*搜索*/
  $('#searchGuestManage_guestManage').on('click', function searchGuestManage() {
    let data = {
      channelName: $('#ipt_guestName_guest_manage').textbox('getValue'),
      usageState: 0
    };
    eapor.utils.defaultAjax('../channel/getChannelCount', data, gm_getPageCountCallback);
  });

  //新增
  $('#addGuestManage_guestManage').on('click', function () {
    $('#addGuestManageDiv').append(
      '<div id="div" style="padding-top:20px;padding-left:50px;">' +
      '<div style="margin-bottom:8px">' +//<!-- 客源名称 -->
      '<input id="ipt_gm_channelName"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>客源名称 ：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 房价方案-->
      '<input  id="ipt_gm_rentplanId" style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>房价方案：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- *客源组  -->
      '<input id="ipt_gm_sourceGroupId" style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>客源组：" labelPosition="before" labelAlign="right" labelWidth="100" />' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 联系人 -->
      '<input id="ipt_gm_contact"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>联系人：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 联系手机 -->
      '<input id="ipt_gm_mobile"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>联系手机：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 邮箱  -->
      '<input id="ipt_gm_email"  style="width:240px;"' +
      'label="邮箱：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 开户行 -->
      '<input id="ipt_gm_bankName"  style="width:240px;"' +
      'label="开户行：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 账号 -->
      '<input id="ipt_gm_bankAccount"  style="width:240px;"' +
      'label="账号：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 地址 -->
      '<input id="ipt_gm_address"  style="width:240px;"' +
      'label="通讯地址：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 状态-->
      '	<input id="ipt_gm_usageState" style="width:240px;" ' +
      'label="状态：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 优先级-->
      '<input id="ipt_gm_sortCode" style="width:240px;"' +
      'label="优先级：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '</div>'
    );
    $('#ipt_gm_channelName').textbox({
      required: true,
      missingMessage: '客源名称不能为空！',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_rentplanId').combobox({
      url: '../rentplan/pglist'
      , queryParams: { limit: 9999, offset: 0, rentplanName: '' }
      , valueField: 'rentplanId', textField: 'rentplanName'
      , editable: false
      , panelHeight: 'auto'
      , panelMaxHeight: 200,
      required: true,
      missingMessage: '房价方案不能为空！',
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_sourceGroupId').combobox({
      url: '../sourcegroup/pglist',
      queryParams: { limit: 9999, offset: 0, groupName: '' },
      valueField: 'sourceGroupId', textField: 'sourceGroupName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: '客源组不能为空！',
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_contact').textbox({
      required: true,
      missingMessage: '联系人不能为空！',
      validType: "maxLength[32]",
      invalidMessage: '输入最大长度为32个字符',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_mobile').numberbox({
      required: true,
      missingMessage: '手机号码不能为空！',
      validType: 'mobilephone',
      invalidMessage: '手机号码格式不正确，如：13700001234',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_email').textbox({
      validType: 'email',
      invalidMessage: '邮箱格式输入不正确，如:123456@163.com',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_bankName').textbox({
      //			validType:'name',
      //			invalidMessage:'格式不正确，只能为中文或英文',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_bankAccount').textbox({
      validType: ['number', 'length[5,30]'],
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gm_address').textbox({
      multiline: true,
      validType: "maxLength[64]",
      invalidMessage: '输入最大长度为64个字符',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });

    $('#ipt_gm_usageState').combobox({
      data: [{ 'id': 1, 'text': '使用', 'selected': true }, { 'id': 2, 'text': '冻结' }]
      , valueField: 'id'
      , textField: 'text'
      , editable: false
      , panelHeight: 'auto'
    });
    $('#ipt_gm_sortCode').numberbox({});
    $('#ipt_gm_sortCode').numberbox('setValue', 100);
    let addGuestManageDiv_dialog = $('#div');
    addGuestManageDiv_dialog.dialog({
      title: '新增客源',
      width: 400,
      height: 480,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#ipt_gm_channelName').textbox('isValid')) {
            $('#ipt_gm_channelName').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_rentplanId').combobox('isValid')) {
            $('#ipt_gm_rentplanId').combobox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_sourceGroupId').combobox('isValid')) {
            $('#ipt_gm_sourceGroupId').combobox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_contact').textbox('isValid')) {
            $('#ipt_gm_contact').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_mobile').numberbox('isValid')) {
            $('#ipt_gm_mobile').numberbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_email').textbox('isValid')) {
            $('#ipt_gm_email').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_address').textbox('isValid')) {
            $('#ipt_gm_address').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_bankName').textbox('isValid')) {
            $('#ipt_gm_bankName').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gm_bankAccount').textbox('isValid')) {
            $('#ipt_gm_bankAccount').textbox('textbox').focus();
            return;
          }

          var data = {};
          data.channelName = $('#ipt_gm_channelName').textbox('getValue');
          data.rentplanId = $('#ipt_gm_rentplanId').combobox('getValue');
          data.sourceGroupId = $('#ipt_gm_sourceGroupId').combobox('getValue');
          data.contact = $('#ipt_gm_contact').textbox('getValue');
          data.mobile = $('#ipt_gm_mobile').numberbox('getValue');
          data.email = $('#ipt_gm_email').textbox('getValue');
          data.bankAccount = $('#ipt_gm_bankAccount').textbox('getValue');
          data.address = $('#ipt_gm_address').textbox('getValue');
          data.usageState = $('#ipt_gm_usageState').combobox('getValue');
          data.sortCode = $('#ipt_gm_sortCode').numberbox('getValue');
          if (data.sortCode == "") {
            data.sortCode = 100;
          }
          data.salerUserId = 0;
          data.salerUsername = "";
          data.telephone = "";
          data.credit = 1;
          data.creditAmount = 0;
          data.balance = 0;
          data.remark = "";

          console.info(data)

          if (clickFlag_guestManage == false) {
            return;
          }
          clickFlag_guestManage = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../channel/add',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                addGuestManageDiv_dialog.dialog('close');
                var data1 = {};
                data1.channelName = "";
                data1.usageState = 0;
                eapor.utils.defaultAjax("../channel/getChannelCount", data1, gm_getAddResultPageCountCallback);

                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_guestManage = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          addGuestManageDiv_dialog.dialog('close');
        }
      }]
    })
  });
  function gm_getAddResultPageCountCallback(result) {
    $('#channelListPage').pagination({ total: result });
    var data = {};
    data.offset = setPageSize * (setPageNumber - 1);
    data.limit = setPageSize;
    data.channelName = "";
    data.usageState = 0;
    eapor.utils.defaultAjax('../channel/pglist', data, gm_getPageListClickCallback);
  }
  //编辑btn
  $('#edit_gm').click(function () {
    var selected = $('#tab_guest_manage').datagrid('getSelected');
    if (!selected || selected.channelName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择客源！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      if (selected.channelName == "会员" || selected.channelName == "非会员" || selected.channelName == "驿宝") {
        $.messager.show({ title: '系统提示', msg: '该项不可编辑！请选择其他客源！', timeout: 2000, showType: 'slide' });
        return;
      } else {
        var index = -1;
        gm_Edit(selected, index)
      }
    }
  });
  /*编辑*/
  function gm_Edit(row, index) {
    console.info(row);
    if (row.channelName == "会员" || row.channelName == "非会员") {
      $.messager.show({
        title: '系统提示', msg: '该信息为默认信息，不可编辑！', timeout: 2000
      })
      return;
    }
    $('#editGuestManageDiv').append(
      '<div id="div" style="padding-top:20px;padding-left:50px;">' +
      '<div style="margin-bottom:8px">' +//<!-- 客源名称 -->
      '<input id="ipt_gmEdit_channelName"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>客源名称 ：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 房价方案-->
      '<input  id="ipt_gmEdit_rentplanId" style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>房价方案：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- *客源组  -->
      '<input id="ipt_gmEdit_sourceGroupId" style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>客源组：" labelPosition="before" labelAlign="right" labelWidth="100" />' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 联系人 -->
      '<input id="ipt_gmEdit_contact"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>联系人：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 联系手机 -->
      '<input id="ipt_gmEdit_mobile"  style="width:240px;"' +
      'label="<span style=\'color:red;font-size: 22px;vertical-align: middle;height: 22px;display: inline;\'>*</span>联系手机：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 邮箱  -->
      '<input id="ipt_gmEdit_email"  style="width:240px;"' +
      'label="邮箱：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 开户行 -->
      '<input id="ipt_gmEdit_bankName"  style="width:240px;"' +
      'label="开户行：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 账号 -->
      '<input id="ipt_gmEdit_bankAccount"  style="width:240px;"' +
      'label="账号：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 地址 -->
      '<input id="ipt_gmEdit_address"  style="width:240px;"' +
      'label="通讯地址：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 状态-->
      '	<input id="ipt_gmEdit_usageState" style="width:240px;" ' +
      'label="状态：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '<div style="margin-bottom:8px">' +//<!-- 优先级-->
      '<input id="ipt_gmEdit_sortCode" style="width:240px;"' +
      'label="优先级：" labelPosition="before" labelAlign="right" labelWidth="100"/>' +
      '</div>' +
      '</div>'
    );
    $('#ipt_gmEdit_channelName').textbox({
      required: true,
      missingMessage: '客源名称不能为空！',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_rentplanId').combobox({
      url: '../rentplan/pglist',
      queryParams: { limit: 9999, offset: 0, rentplanName: '' },
      valueField: 'rentplanId', textField: 'rentplanName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: '房价方案不能为空！',
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_sourceGroupId').combobox({
      url: '../sourcegroup/pglist',
      queryParams: { limit: 9999, offset: 0, groupName: '' },
      valueField: 'sourceGroupId', textField: 'sourceGroupName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: '客源组不能为空！',
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_contact').textbox({
      required: true,
      missingMessage: '联系人不能为空！',
      validType: "maxLength[32]",
      invalidMessage: '输入最大长度为32个字符',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_mobile').numberbox({
      required: true,
      missingMessage: '手机号码不能为空！',
      validType: 'mobilephone',
      invalidMessage: '手机号码格式不正确，如：13700001234',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_email').textbox({
      validType: 'email',
      invalidMessage: '邮箱格式输入不正确，如:123456@163.com',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_bankName').textbox({
      validType: 'name',
      invalidMessage: '格式不正确，只能为中文或英文',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_bankAccount').textbox({
      validType: ['number', 'length[5,30]'],
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#ipt_gmEdit_address').textbox({
      multiline: true,
      validType: "maxLength[64]",
      invalidMessage: '输入最大长度为64个字符',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });

    $('#ipt_gmEdit_usageState').combobox({
      data: [{ 'id': 1, 'text': '使用' }, { 'id': 2, 'text': '冻结' }],
      valueField: 'id',
      textField: 'text',
      editable: false,
      panelHeight: 'auto'
    });
    $('#ipt_gmEdit_sortCode').numberbox({});

    $('#ipt_gmEdit_salerUserId').combobox('setValue', row.salerUserId);
    $('#ipt_gmEdit_sourceGroupId').combobox('setValue', row.sourceGroupId);
    $('#ipt_gmEdit_channelName').textbox('setValue', row.channelName);
    $('#ipt_gmEdit_contact').textbox('setValue', row.contact);
    $('#ipt_gmEdit_mobile').numberbox('setValue', row.mobile);
    $('#ipt_gmEdit_email').textbox('setValue', row.email);
    $('#ipt_gmEdit_address').textbox('setValue', row.address);
    $('#ipt_gmEdit_bankAccount').textbox('setValue', row.bankAccount);
    $('#ipt_gmEdit_rentplanId').combobox('setValue', row.rentplanId);
    $('#ipt_gmEdit_sortCode').numberbox('setValue', row.sortCode);
    $('#ipt_gmEdit_usageState').combobox('setValue', row.usageState);

    $('#div').dialog({
      title: '编辑客源',
      width: 400,
      height: 480,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#ipt_gmEdit_channelName').textbox('isValid')) {
            $('#ipt_gmEdit_channelName').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_rentplanId').combobox('isValid')) {
            $('#ipt_gmEdit_rentplanId').combobox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_sourceGroupId').combobox('isValid')) {
            $('#ipt_gmEdit_sourceGroupId').combobox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_contact').textbox('isValid')) {
            $('#ipt_gmEdit_contact').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_mobile').numberbox('isValid')) {
            $('#ipt_gmEdit_mobile').numberbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_email').textbox('isValid')) {
            $('#ipt_gmEdit_email').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_address').textbox('isValid')) {
            $('#ipt_gmEdit_address').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_bankName').textbox('isValid')) {
            $('#ipt_gmEdit_bankName').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_gmEdit_bankAccount').textbox('isValid')) {
            $('#ipt_gmEdit_bankAccount').textbox('textbox').focus();
            return;
          }

          var data = {};
          data.channelName = $('#ipt_gmEdit_channelName').textbox('getValue');
          data.rentplanId = $('#ipt_gmEdit_rentplanId').combobox('getValue');
          data.sourceGroupId = $('#ipt_gmEdit_sourceGroupId').combobox('getValue');
          data.contact = $('#ipt_gmEdit_contact').textbox('getValue');
          data.mobile = $('#ipt_gmEdit_mobile').numberbox('getValue');
          data.email = $('#ipt_gmEdit_email').textbox('getValue');
          data.bankAccount = $('#ipt_gmEdit_bankAccount').textbox('getValue');
          data.address = $('#ipt_gmEdit_address').textbox('getValue');
          data.usageState = $('#ipt_gmEdit_usageState').combobox('getValue');
          data.sortCode = $('#ipt_gmEdit_sortCode').numberbox('getValue');
          if (data.sortCode == "") {
            data.sortCode = 100;
          }
          data.salerUserId = 0;
          data.salerUsername = "";
          data.telephone = "";
          data.credit = 1;
          data.creditAmount = 0;
          data.balance = 0;
          data.remark = "";
          data.channelId = row.channelId;
          console.info(data);

          if (clickFlag_guestManage == false) {
            return;
          }
          clickFlag_guestManage = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../channel/edit',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == -1) {
                $.messager.show({
                  title: '系统提示', msg: '客源名称已占用！请更改！', timeout: 2000
                });
              } else if (result == -601) {
                $.messager.show({
                  title: '系统提示', msg: '银行账户输入有误！为16~19位数字！', timeout: 2000
                });
              } else if (result < -1) {
                $.messager.show({
                  title: '系统提示', msg: '编辑失败！', timeout: 2000
                });
              } else if (result > 0) {
                $('#div').dialog('close');
                //刷新当前页
                var data = {};
                data.offset = setPageSize * (setPageNumber - 1);
                data.limit = setPageSize;
                data.channelName = "";
                data.usageState = 0;
                eapor.utils.defaultAjax('../channel/pglist', data, gm_getPageListClickCallback);

                $.messager.show({
                  title: '系统提示', msg: '编辑成功！', timeout: 2000
                });
              }
            })
            .always(function () {
              clickFlag_guestManage = true;
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
  /*分页按钮*/
  function gm_getPageListClickCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    guestManageArray = result;
    $('#tab_guest_manage').datagrid('options').loader = guestManageLoader;
    $('#tab_guest_manage').datagrid('reload');
  }
  /*list*/
  function gm_getPageListCallback(result) {
    console.info(result)
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    guestManageArray = result;
    $('#tab_guest_manage').datagrid({
      loader: guestManageLoader,
      title: '客源基本信息列表', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      rownumbers: true,
      fit: true,
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('tab_guest_manage', 'channelName', 11, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
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
          rowSelect_guestManage = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_guestManage = null;
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
        if (rowData != rowjavadillselect) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_guestManage = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_guestManage = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      columns: [[
        { field: 'balance', title: '余额', align: 'center', width: 20, hidden: true },
        {
          field: 'credit', title: '能否挂帐', align: 'center', width: 20, hidden: true,
          formatter: function (value) {
            return value ? "能" : "不能";
          }
        },
        { field: 'creditAmount', title: '挂帐最大额度', align: 'center', width: 20, hidden: true },
        { field: 'telephone', title: '联系座机', align: 'center', width: 20, hidden: true },
        { field: 'remark', title: '备注', align: 'center', width: 20, hidden: true },
        { field: 'sourceGroupId', title: '客源组Id', align: 'center', width: 20, hidden: true },
        { field: 'channelId', title: 'channelId', align: 'center', width: 20, hidden: true },
        { field: 'createTime', title: '创建时间', align: 'center', width: 20, hidden: true },
        { field: 'creator', title: '创建者', align: 'center', width: 20, hidden: true },
        { field: 'hotelId', title: '宾馆lId', align: 'center', width: 20, hidden: true },
        { field: 'rentplanId', title: '默认房价方案id', align: 'center', width: 20, hidden: true },
        { field: 'saler', title: '销售员username', align: 'center', width: 20, hidden: true },

        { field: 'ck', title: '', checkbox: true },
        { field: 'channelName', title: '客源名称', align: 'center', width: 18 },
        { field: 'rentplanName', title: '价格方案', align: 'center', width: 18 },
        { field: 'sourceGroupName', title: '客源组', align: 'center', width: 18 },
        { field: 'contact', title: '联系人', align: 'center', width: 18 },
        { field: 'mobile', title: '联系手机', align: 'center', width: 25 },
        { field: 'email', title: '邮箱', align: 'center', width: 30 },
        { field: 'id7', title: '开户行', align: 'center', width: 20 },
        { field: 'bankAccount', title: '银行账号', align: 'center', width: 30 },
        { field: 'address', title: '通讯地址', align: 'center', width: 30 },
        {
          field: 'usageState', title: '状态', align: 'center', width: 10,
          formatter: function (value, row) {
            console.info(row);
            if (value == 1) {
              return "使用";
            } else if (value == 2) {
              return "冻结";
            } else {
              return value;
            }
          }
        },
        { field: 'sortCode', title: '排序', align: 'center', width: 20 }
      ]]
    })
  }
  //countCallBack
  function gm_getPageCountCallback(result) {
    console.info(result)
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#channelListPage').pagination({
      total: result,
      //loading:true,
      //showRefresh:,
      onSelectPage: function (pageNumber, pageSize) {
        if (!pageNumber) {
          return;
        }
        setPageNumber = pageNumber;
        setPageSize = pageSize;
        var data = {};
        data.offset = pageSize * (pageNumber - 1);
        data.limit = pageSize;
        data.channelName = "";
        data.usageState = 0;
        eapor.utils.defaultAjax('../channel/pglist', data, gm_getPageListClickCallback);
      }
    });
    //得到显示分页记录
    var page = $('#channelListPage').pagination('options');
    var data = {};
    data.offset = 0;
    data.limit = page.pageSize;
    data.channelName = $('#ipt_guestName_guest_manage').textbox('getValue');
    data.usageState = 0;
    guestManageListData = data;
    eapor.utils.defaultAjax('../channel/pglist', data, gm_getPageListCallback);
  };

  $('#channelListPage').pagination({ showPageList: false });
  var data = {};
  data.channelName = "";
  data.usageState = 0;
  eapor.utils.defaultAjax("../channel/getChannelCount", data, gm_getPageCountCallback);
})();