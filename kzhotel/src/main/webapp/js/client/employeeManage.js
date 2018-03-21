/**
 * @JS名称：用户管理
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layoutDiv_employeeManage");

  var clickFlag_employeeManage = true,
    pubjsonfirst_employeeManage = {},
    getUsergroupId = 0,
    rowSelect_employeeManage = null,
    onlySelectedOneRowFlag = 0;

  $('#select_userGroup_employeeManage').combobox({
    valueField: 'usergroupId',
    textField: 'usergroupName',
    url: '../ugrole/listall',//用户组列表 接口
    panelHeight: 'auto',
    panelMaxHeight: 200,
    editable: false,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].usergroupId);
        $(this).combobox('setText', data[0].usergroupName);
      }
    }
    , loadFilter: function (result) {
      if (result != -3333 && result != -3335) {
        result.unshift({ usergroupId: 0, usergroupName: "全部" });
      }
      return result;
    }
  });

  var firstloader_employeeManage = function (param, success, error) {
    if (!$.isEmptyObject(pubjsonfirst_employeeManage)) {
      success(pubjsonfirst_employeeManage);
      return true;
    }
    $.ajax({
      url: '../user/ujlist',//用户列表 接口
      data: { offset: 0, limit: 9999, username: '', maxUserId: 999999, usergroupId: 0 },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        pubjsonfirst_employeeManage = data;
        success(data);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  var searchloader_employeeManage = function (param, success, error) {
    $.ajax({
      url: '../user/ujlist',//用户列表 接口
      data: { offset: 0, limit: 9999, username: '', maxUserId: 9999, usergroupId: getUsergroupId },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_employeeManage').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $('#tab_employeeManage').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_employeeManage').datagrid('loadData', { total: 0, rows: [] });
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

  $('#tab_employeeManage').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    loader: firstloader_employeeManage,
    checkOnSelect: false,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_employeeManage', 'username', 2, 0);
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
        rowSelect_employeeManage = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_employeeManage = null;
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

      if (rowData != rowSelect_employeeManage) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_employeeManage = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_employeeManage = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    toolbar: [{
      iconCls: 'icon-add',
      text: '新增',
      handler: function () {
        add_btn_employeeManage();
      }
    }, '-', {
      iconCls: 'icon-remove',
      text: '删除',
      handler: function () {
        var getSelected = $('#tab_employeeManage').datagrid('getSelected');
        if (!getSelected || getSelected.username == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '请先选择要删除信息！', timeout: 2000 });
          return;
        } else {
          delete_edit(JSON.stringify(getSelected));
        }
      }
    }, '-', {
      iconCls: 'icon-edit',
      text: '编辑用户组',
      handler: function () {
        var getSelected = $('#tab_employeeManage').datagrid('getSelected');
        if (!getSelected || getSelected.username == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 3000 });
          return;
        } else {
          edit_edit(JSON.stringify(getSelected));
        }
      }
    }, '-', {
      iconCls: 'icon-sum',
      text: '密码重置',
      handler: function () {
        var getSelected = $('#tab_employeeManage').datagrid('getSelected');
        if (!getSelected || getSelected.username == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '请先选择要重置密码的信息！', timeout: 2000 });
          return;
        } else {
          resetPassword(JSON.stringify(getSelected));
        }
      }
    }, '-', {
      iconCls: 'icon-sum',
      text: '绑定客主商家用户账号',
      handler() {
        if (!+sessionStorage.getItem('KezhuShopId')) {
          $.messager.show({ title: '系统提示', msg: '操作无效，请先联系管理员将酒店与客主里的商家进行绑定！', timeout: 5000 });
          return;
        }
        var getSelected = $('#tab_employeeManage').datagrid('getSelected');
        if (!getSelected || getSelected.username == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '请先选择要绑定客主商家账号的信息！', timeout: 3000 });
          return;
        } else {
          bindkezhushop(JSON.stringify(getSelected));
        }
      }
    }],
    columns: [[
      { field: 'ck', title: '', checkbox: true },
      { field: 'createTime', title: '创建时间', width: 20, align: 'center', hidden: true },
      { field: 'hotelId', title: '宾馆Id', width: 20, align: 'center', hidden: true },
      { field: 'lastVisit', title: 'lastVisit', width: 20, align: 'center', hidden: true },
      { field: 'state', title: 'state', width: 20, align: 'center', hidden: true },
      { field: 'userId', title: '用户Id', width: 20, align: 'center', hidden: true },
      { field: 'usergroupId', title: '用户组Id', width: 20, align: 'center', hidden: true },

      { field: 'username', title: '用户名', width: 20, align: 'center' },
      { field: 'usergroupName', title: '用户组', width: 20, align: 'center' },
      {
        field: 'kezhuNickname', title: '客主商家账号昵称', width: 20, align: 'center',
        formatter(value, row, index) {
          return value || '--';
        }
      },
    ]]
  });
  //搜索
  $('#search_btn_employeeManage').click(function () {
    getUsergroupId = $('#select_userGroup_employeeManage').combobox('getValue');
    $('#tab_employeeManage').datagrid("options").loader = searchloader_employeeManage;
    $("#tab_employeeManage").datagrid("reload");
  });
  //编辑用户组
  function edit_edit(row) {
    const row_ = JSON.parse(row);
    console.info(row_.userId);
		/*createTime:1499996742000
		hotelId:1
		kezhuNickname:"test123"
		kezhuUserId:83
		lastVisit:1510294378000
		state:0
		userId:5
		usergroupId:1
		usergroupName:"系统组"
		username:"wyx"*/
    $('#addDialog_employeeManage').append(`
			<div id="div" style="padding-top:30px;padding-left:20px;">
				<div style="margin-bottom:10px">
					<input id="edit_userGroup_employeeManage" label="<span style='color:red;font-size:16px;'>*</span>用户组：" labelAlign="right" labelWidth="90px;" labelPosition="before"
						style="width:220px;">
				</div>
			</div>
		`);
    $('#edit_userGroup_employeeManage').combobox({
      url: '../ugrole/listall',
      valueField: 'usergroupId',
      textField: 'usergroupName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "用户组不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].usergroupId);
          $(this).combobox('setText', data[0].usergroupName);
        }
      }
    });
    const dislog = $('#div');
    dislog.dialog({
      title: '新增',
      width: 300,
      height: 160,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          if (!$('#edit_userGroup_employeeManage').combobox('isValid')) {
            $('#edit_userGroup_employeeManage').combobox('textbox').focus();
            return;
          }
          function editUserGroupCallBack(result) {
            console.info(result);
            if (result.errCode >= 0) {
              $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 3000 });
              pubjsonfirst_employeeManage = {};
              $('#tab_employeeManage').datagrid("options").loader = firstloader_employeeManage;
              $("#tab_employeeManage").datagrid("reload");
              dislog.dialog('close');
              return;
            }
            $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 3000 })
          }
          eapor.utils.defaultAjax('../user/editUserGroup',
            { userId: row_.userId, usergroupId: $('#edit_userGroup_employeeManage').combobox('getValue') },
            editUserGroupCallBack);

        }
      }, {
        text: '取消',
        handler: function () {
          dislog.dialog('close');
        }
      }]
    });
  }
  //新增
  function add_btn_employeeManage() {
    $('#addDialog_employeeManage').append(`
			<div id="div" style="padding-top:30px;padding-left:30px;">
				<div style="margin-bottom:10px">
					<input id="add_userGroup_employeeManage" label="<span style='color:red;font-size:16px;'>*</span>用户组：" labelAlign="right" labelWidth="90px;" labelPosition="before"
						style="width:220px;">
				</div>
				<div style="margin-bottom:10px">
					<input id="add_username_employeeManage" label="<span style='color:red;font-size:16px;'>*</span>用户名：" labelAlign="right" labelWidth="90px;" labelPosition="before"
						style="width:220px;"> 
				</div>
				<div style="margin-bottom:10px">
					<input id="add_password_employeeManage"  label="<span style='color:red;font-size:16px;'>*</span>密码：" labelAlign="right" labelWidth="90px;" labelPosition="before" 
						style="width:220px;"> 
				</div>
				<div style="margin-bottom:10px">
					<input id="add_kezhushop_employeeManage" label="客主商家账号：" labelAlign="right" labelWidth="90px;" labelPosition="before"
						style="width:220px;">
				</div>
			</div>
		`);
    //新增用户组 combobox
    $('#add_userGroup_employeeManage').combobox({
      valueField: 'usergroupId',
      textField: 'usergroupName',
      url: '../ugrole/listall',//用户组列表 接口
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "用户组不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].usergroupId);
          $(this).combobox('setText', data[0].usergroupName);
        }
      }
    });
    $('#add_kezhushop_employeeManage').textbox({

    });
    $('#add_username_employeeManage').textbox({
      required: true,
      missingMessage: "用户名不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_password_employeeManage').passwordbox({
      required: true,
      missingMessage: "密码不能为空！",
      validType: ['length[6,28]'],
      invalidMessage: "输入长度为6~28位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_userGroup_employeeManage').combobox('textbox').focus();
    let addDialog_employeeManage_dialog = $('#div');
    addDialog_employeeManage_dialog.dialog({
      title: '新增',
      width: 350,
      height: 240,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          var usergroupId = $('#add_userGroup_employeeManage').combobox('getValue');
          if (usergroupId == "") {
            $('#add_userGroup_employeeManage').combobox('textbox').blur().focus();
            $.messager.show({ title: '系统提示', msg: '用户组不能为空！', timeout: 2000 });
            return;
          }
          var username = $('#add_username_employeeManage').textbox('getValue');
          if (!$('#add_username_employeeManage').textbox('isValid')) {
            $('#add_username_employeeManage').textbox('textbox').focus();
            return;
          }
          if (username.indexOf(',') !== -1) {
            $.messager.show({ title: '系统提示', msg: '用户名不能含有 , 号！', timeout: 2000 });
            return;
          }
          var password = $('#add_password_employeeManage').passwordbox('getValue');
          if (!$('#add_password_employeeManage').passwordbox('isValid')) {
            $('#add_password_employeeManage').passwordbox('textbox').focus();
            return;
          }
          var data = {
            usergroupId: usergroupId,
            username: username,
            password: password,
            kezhuUserName: $('#add_kezhushop_employeeManage').textbox('getValue')
          };
          console.info(data);
          if (clickFlag_employeeManage == false) {
            return;
          }
          clickFlag_employeeManage = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../user/add',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 3000 });
                pubjsonfirst_employeeManage = {};
                $('#tab_employeeManage').datagrid("options").loader = firstloader_employeeManage;
                $("#tab_employeeManage").datagrid("reload");
                addDialog_employeeManage_dialog.dialog('close');
                return;
              }
              if (result === 0) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 3000 });
                return;
              }
              if (result === -1) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！该用户不存在！', timeout: 3000 });
                return;
              }
              if (result === -2) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！该酒店的客主商家不存在！', timeout: 3000 });
                return;
              }
              if (result === -3) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！对应商家账号不存在！', timeout: 3000 });
                return;
              }
              if (result == -4) {
                $('#add_username_employeeManage').textbox('textbox').focus();
                $.messager.show({ title: '系统提示', msg: '新增失败！该用户名已存在！', timeout: 3000 });
                return;
              }
              if (result == -5) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！用户组不存在！', timeout: 3000 });
                return;
              }
              if (result == -6) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！用户名或密码不能为空！', timeout: 3000 });
                return;
              }
              if (result == -7) {
                //$('#add_username_employeeManage').textbox('textbox').focus(); 
                $.messager.show({ title: '系统提示', msg: '新增失败！客主商家用户名有误！', timeout: 3000 });
                return;
              }
              /*0：失败
              -1：该用户不存在
              -2：该酒店的客主商家不存在
              -3：对应商家账号不存在
              -4：用户名已存在
              -5：用户组不存在
              -6：用户名或密码不能为空
              -7：客主商家用户名有误*/
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_employeeManage = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          addDialog_employeeManage_dialog.dialog('close');
        }
      }]
    });
  };
  function bindkezhushop(row) {
    console.info(row);
    $('#editPwdDialog_employeeManage').append(`
				<div id="div" style="padding-top:30px;padding-left:30px;">
					<div style="margin-bottom:10px">
						<input id="bind_kezhushop_employeeManage" 
							label="<span style='color:red;font-size:16px;'>*</span>客主商家账号：" 
							labelAlign="right" labelWidth="110px;" labelPosition="before"
								style="width:240px;"> 
					</div>
				</div>
		`);
    $('#bind_kezhushop_employeeManage').textbox({
      required: true,
      missingMessage: "客主商家账号不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let dialog = $('#div');
    dialog.dialog({
      title: '绑定客主商家账号',
      width: 350,
      height: 160,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          const bind_kezhushop = $('#bind_kezhushop_employeeManage');
          if (!bind_kezhushop.textbox('isValid')) {
            bind_kezhushop.textbox('textbox').focus();
            return;
          }
          $.ajax({
            type: 'post',
            url: '../user/bindKezhuShop',
            data: {
              kezhuUserName: bind_kezhushop.textbox('getValue'),
              userId: JSON.parse(row).userId
            },
            dataType: 'json',
            success: function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
							/*0：失败
								-1：该用户不存在
								-2：该酒店的客主商家不存在
								-3：对应商家账号不存在*/
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '绑定成功！', timeout: 2000 });
                pubjsonfirst_employeeManage = {};
                $('#tab_employeeManage').datagrid("options").loader = firstloader_employeeManage;
                $("#tab_employeeManage").datagrid("reload");
                dialog.dialog('close');
                return;
              }
              if (result === -1) {
                $.messager.show({ title: '系统提示', msg: '绑定失败！该用户不存在！', timeout: 3000 });
                return;
              }
              if (result === -2) {
                $.messager.show({ title: '系统提示', msg: '绑定失败！该酒店的客主商家不存在！', timeout: 3000 });
                return;
              }
              if (result === -3) {
                $.messager.show({ title: '系统提示', msg: '绑定失败！对应商家账号不存在！', timeout: 3000 });
                return;
              }
              $.messager.show({ title: '系统提示', msg: '绑定失败！', timeout: 3000 });
            }
          })
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  }
  //密码清除按钮
  function resetPassword(row) {
    var row = JSON.parse(row);
    $('#editPwdDialog_employeeManage').append(
      '<div id="div" style="padding-top:30px;padding-left:30px;">' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="editPwd_username_employeeManage" diaabled label="用户名：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="editPwd_password_employeeManage" label="<span style=\'color:red;font-size:16px;\'>*</span>密码：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '</div>'
    );
    $('#editPwd_username_employeeManage').textbox({
      disabled: true
    });
    $('#editPwd_username_employeeManage').textbox('setValue', row.username);
    $('#editPwd_password_employeeManage').passwordbox({
      required: true,
      missingMessage: "密码不能为空！",
      validType: ['length[6,28]'],
      invalidMessage: "输入长度为6~28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let editPwdDialog_employeeManage_dialog = $('#div');
    editPwdDialog_employeeManage_dialog.dialog({
      title: '修改密码',
      width: 350,
      height: 200,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          var strPwd = $('#editPwd_password_employeeManage').passwordbox('getValue');
          console.info(strPwd)
          console.info($('#editPwd_password_employeeManage').passwordbox('isValid'))
          if (!$('#editPwd_password_employeeManage').passwordbox('isValid')) {
            $('#editPwd_password_employeeManage').passwordbox('textbox').focus();
            return;
          }
          var intouid = row.userId;
          var data = {};
          data.strPwd = strPwd;
          data.intouid = intouid;
          $.ajax({
            type: 'post',
            url: '../user/Repassword',
            data: data,
            dataType: 'json',
            success: function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '修改成功！', timeout: 2000 });
                pubjsonfirst_employeeManage = {};
                $('#tab_employeeManage').datagrid("options").loader = firstloader_employeeManage;
                $("#tab_employeeManage").datagrid("reload");
                editPwdDialog_employeeManage_dialog.dialog('close');
                return;
              }
              if (result < 0) {
                $.messager.show({ title: '系统提示', msg: '修改失败！', timeout: 2000 });
                return;
              }
            }
          })
        }
      }, {
        text: '取消',
        handler: function () {
          editPwdDialog_employeeManage_dialog.dialog('close');
        }
      }]
    });
  };

  //删除
  function delete_edit(row) {
    var row = JSON.parse(row);
    $.messager.confirm('系统提示', '您确认删除该用户吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../user/dhuser',
          data: { intduid: row.userId },
          dataType: 'json',
          success: function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 })
              pubjsonfirst_employeeManage = {};
              $('#tab_employeeManage').datagrid("options").loader = firstloader_employeeManage;
              $("#tab_employeeManage").datagrid("reload");
              return;
            }
            if (result < 0) {
              $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000 });
              return;
            }
          }
        })
      }
    });
  };

})();