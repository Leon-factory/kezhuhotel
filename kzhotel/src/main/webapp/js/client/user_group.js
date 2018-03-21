/**
 * @JSname:用户组管理
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_userGroup");

  var d = new Date().getTime();
  var id1 = $('#userGroup_perimissionDialog').attr('id');
  var id2 = $('#userGroup_userGroupName').attr('id');
  var id3 = $('#userGroup_hasPermissionList').attr('id');
  var id4 = $('#userGroup_hasPermissionTree').attr('id');
  $('#userGroup_perimissionDialog').attr('id', id1 + d);
  $('#userGroup_userGroupName').attr('id', id2 + d);
  $('#userGroup_hasPermissionList').attr('id', id3 + d);
  $('#userGroup_hasPermissionTree').attr('id', id4 + d);

  //用户组Loader
  var userGroup_userGroupArray = {};
  var userGroup_userGroupLoader = function (param, success, error) {
    if (!$.isEmptyObject(userGroup_userGroupArray)) {
      success(userGroup_userGroupArray);
      return true;
    }
    $.ajax({
      url: "../ugrole/listall",
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
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
        userGroup_userGroupArray = data;
        success(data);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  //已有权限Loader
  var userGroup_hasPermissionArray = [];
  var userGroup_hasPermissionLoader = function (param, success, error) {
    if (userGroup_hasPermissionArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(userGroup_hasPermissionArray)) {
      success(userGroup_hasPermissionArray);
      return true;
    }
  };

  function convert(rows) {
    function exists(rows, parentId) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].id == roletypeId) return true;
      }
      return false;
    }

    var nodes = [];
    // get the top level nodes
    for (let i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!exists(rows, row.roletypeId)) {
        nodes.push({
          id: item.roletypeId,
          text: maptype.get(item.roletypeId)
          , roletypeId: item.roletypeId
          , checked: false
        });
      }
    }

    var toDo = [];
    for (let i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }
    while (toDo.length) {
      var node = toDo.shift();    // the parent node
      // get the children nodes
      for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.parentId == node.id) {
          var child = { id: row.id, text: row.name };
          if (node.children) {
            node.children.push(child);
          } else {
            node.children = [child];
          }
          toDo.push(child);
        }
      }
    }
    return nodes;
  }

  function converttype(rows) {

    var nodes = [];
    // get the top level nodes
    for (let i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.roletypeParentId == 0) {
        nodes.push({
          id: "ty" + row.roletypeCode,
          text: row.roletypeName
          , roletype: -1
          , roletypeId: row.roletypeParentId
          , realid: row.roletypeId
          , checked: false
          , relationid: 0
        });

        rows.splice(i, 1);
        i--;
      }
    }

    var toDo = [];
    for (let i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }

    while (toDo.length) {
      var node = toDo.shift();    // the parent node
      // get the children nodes
      for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.roletypeParentId == node.realid) {
          var child = {
            id: "ty" + row.roletypeCode,
            text: row.roletypeName
            , roletype: -2
            , roletypeId: row.roletypeParentId
            , realid: row.roletypeId
            , checked: false
            , relationid: 0
          };
          if (node.children) {
            node.children.push(child);
          } else {
            node.children = [child];
          }
          rows.splice(i, 1);
          i--;
          toDo.push(child);
        }
      }
    }
    return nodes;
  }

  function convertnodeschild(itemtmprow, lsttmpnodes) {

    //遍历所有子元素
    $.each(lsttmpnodes, function (i, itemlsttmpnode) {
      if (itemlsttmpnode.children) {

        convertnodeschild(itemtmprow, itemlsttmpnode.children);
      }

      if ("ty" + itemtmprow.roletypeId == itemlsttmpnode.id) {
        var child = {
          id: itemtmprow.roleId
          , text: itemtmprow.roleName
          , roletype: 0
          , roletypeId: itemtmprow.roletypeId
          , realid: itemtmprow.roletypeId
          , checked: false
          , relationid: 0
        };

        if (itemlsttmpnode.children) {

          itemlsttmpnode.children.push(child);
        } else {
          itemlsttmpnode.children = [child];
        }
      }
    });
  }
  //convertnodes(converttype(lstroletype),lstrole)
  function convertnodes(lsttmpnodes, rows) {
    $.each(rows, function (j, itemtmprow) {
      convertnodeschild(itemtmprow, lsttmpnodes);
    });

    return lsttmpnodes;
  }

  function checkhaspermission(lsttreetmp, has) {
    $.each(lsttreetmp, function (i, item) {
      checkhaspermissionchild(item, has);
    });
  }

  function checkhaspermissionchild(lsttreetmp, has) {
    if (lsttreetmp.children) {
      $.each(lsttreetmp.children, function (i, item) {
        checkhaspermissionchild(item, has);
      });
    } else {
      $.each(has, function (j, hasper) {
        if (hasper.roleId == lsttreetmp.id) {
          lsttreetmp.checked = true;
          lsttreetmp.relationid = hasper.usergroupRoleId;
        }
      });
    }
  }

  //批量回调
  function userGroup_batchRoleCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result == 1) {
      $.messager.show({ title: '系统提示', msg: '增加成功！！', timeout: 2000 });
    }

    if (result == 2) {
      $.messager.show({ title: '系统提示', msg: '删除成功！！', timeout: 2000 });
    }

    if (result == 3) {
      $.messager.show({ title: '系统提示', msg: '操作成功！！', timeout: 2000 });
    }

    $('#userGroup_perimissionDialog' + d).dialog('close');
  }
  //点击保存按钮
  function userGroup_savePermission() {
    var add = new Array();
    var remove = new Array()

    $.each(userGroup_changeArray, function (i, item) {
      if (item.checked) {
        add.push(item);
      } else {
        remove.push(item.relationId);
      }
    })

    var data = {};
    data.add = "";
    data.remove = "";
    if (add.length > 0) {
      data.add = JSON.stringify(add);
    }
    if (remove.length > 0) {
      data.remove = JSON.stringify(remove);
    }
    if (add.length <= 0 && remove.length <= 0) {
      $('#userGroup_perimissionDialog' + d).dialog('close');
      return;
    }
    data.usergroupId = userGroupId;
    eapor.utils.defaultAjax('../persevere/batchRole', data, userGroup_batchRoleCallback);
  }

  //添加changeArray
  var userGroup_changeArray = new Array();
  function userGroup_eachChild(node, checked) {

    var hasData = $('#userGroup_hasPermissionList' + d).datagrid("getData");
    var hasArray = hasData.rows;

    if (!node.children) {
      var usergroupid = userGroupId;
      var roleid;
      if (!node.children) {
        roleid = node.id;
        var relationid = node.relationid;
      }
      var data = {};
      data.intpid = roleid;
      data.intmid = usergroupid;
      data.checked = checked;
      data.relationId = relationid;

      var flag = 0;
      var index = 0;
      if (checked) {
        $.each(userGroup_changeArray, function (i, item) {
          if (item.intpid == roleid) {
            if (item.checked == false) {
              index = i;
              flag = 2;
            } else {
              flag = 1;
            }
          }
        });
        if (flag == 2) {
          userGroup_changeArray.splice(index, 1);
        } else if (flag == 0) {
          userGroup_changeArray.push(data);
        }

        $.each(userGroup_changeArray, function (u, uc) {
          $.each(hasArray, function (h, ha) {
            if (uc.intpid == ha.roleId) {
              flag = 3;
              index = u;
              return;
            }
          })
        })
        if (flag == 3) {
          userGroup_changeArray.splice(index, 1);
        }
      } else {
        $.each(userGroup_changeArray, function (i, item) {
          if (item.intpid == roleid) {
            if (item.checked == true) {
              index = i;
              flag = 2;
            } else {
              flag = 1;
            }
          }
        });
        if (flag == 2) {
          userGroup_changeArray.splice(index, 1);
        } else if (flag == 0) {
          userGroup_changeArray.push(data);
        }
      }
    } else {
      $.each(node.children, function (i, item) {
        userGroup_eachChild(item, item.checked);
      })
    }
  }

  //递归定位
  function userGroup_eachTree(tree) {
    var ptree = $('#userGroup_hasPermissionTree' + d).tree('getParent', tree.target);
    if (ptree != null) {
      $('#userGroup_hasPermissionTree' + d).tree('expand', ptree.target);
      userGroup_eachTree(ptree);
    }
  }
  //左定位右
  function userGroup_getRoleByRoletypeId(roletypeId) {
    var tree = $('#userGroup_hasPermissionTree' + d).tree('find', roletypeId);
    $('#userGroup_hasPermissionTree' + d).tree('select', tree.target);
    $('#userGroup_hasPermissionTree' + d).tree('check', tree.target);
    userGroup_eachTree(tree);
  }
  //获取所有的角色和角色类型
  function userGroup_getRoleAndRoletypeCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    var lstroletype = result.lstroletype;
    var lstrole = result.lstrole;
    var lsttreetmp = convertnodes(converttype(lstroletype), lstrole);

    checkhaspermission(lsttreetmp, userGroup_hasPermissionArray);
    userGroup_changeArray = new Array();
    $('#userGroup_hasPermissionTree' + d).tree({
      data: lsttreetmp,
      animate: false,
      checkbox: true,
      fit: true,
      onLoadSuccess: function (node, data) {
        $('#userGroup_hasPermissionTree' + d).tree('collapseAll');
      },
      onCheck: function (node, checked) {
        userGroup_eachChild(node, checked);
      }
    })

  }
  //已有权限回调
  function userGroup_getHasPermissionCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    userGroup_hasPermissionArray = new Array();
    $.each(result, function (i, item) {
      if (item.roleId > 1000) {
        userGroup_hasPermissionArray.push(item);
      }
    })
    //userGroup_hasPermissionArray = result;

    $('#userGroup_hasPermissionList' + d).datagrid({
      loader: userGroup_hasPermissionLoader,
      title: '已有权限列表', 		//表格标题
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
      onSelect: function (index, row) {
        //根据左边权限定位树形权限所在位置
        userGroup_getRoleByRoletypeId(row.roleId);
      },
      columns: [[
        { field: 'roleName', title: "权限名称", width: 100 }
      ]]

    })

    eapor.utils.defaultAjax("../role/listwithtype", {}, userGroup_getRoleAndRoletypeCallback);
  }
  //根据usergroupId查询已有权限
  var userGroupId = 0;
  function userGroup_getHasPermission(usergroupId) {
    userGroupId = usergroupId;
    eapor.utils.defaultAjax('../ugrole/lstbyug', { usergroupId: usergroupId }, userGroup_getHasPermissionCallback);
  }
  //用户组的权限管理
  function userGroup_permissionAddorRemove(select) {
    if (!select || select.usergroupName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择一个用户组！', timeout: 2000 });
      return;
    }

    $('#userGroup_userGroupName' + d).textbox('setValue', select.usergroupName);

    userGroup_getHasPermission(select.usergroupId);

    $('#userGroup_perimissionDialog' + d).dialog({
      title: '用户组权限管理',
      width: 800,
      height: 600,
      modal: true,
      buttons: [{
        text: '保存并退出',
        handler: function () {
          userGroup_savePermission();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#userGroup_perimissionDialog' + d).dialog('close');
        }
      }]
    })
  }
  //删除回调
  function userGroup_removeCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result == 0 || result == -1) {
      $.messager.show({ title: '系统提示', msg: '删除失败！该用户组下存在用户，不可删除！', timeout: 2000, height: 'auto' });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
      eapor.utils.defaultAjax('../ugrole/listall', {}, userGroup_getAllUserGroupList);
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000, height: 'auto' });
      return;
    }
  }
  //删除
  function userGroup_remove() {
    var select = $('#userGroup_list').datagrid('getSelected');
    if (!select || select.usergroupName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择一个用户组！', timeout: 2000 });
      return;
    }

    $.messager.confirm('系统提示', '您确认删除该用户组吗？', function (r) {
      if (r) {
        eapor.utils.defaultAjax('../ugrole/del', { usergroupId: select.usergroupId }, userGroup_removeCallback);
      }
    })
  }
  //编辑回调
  function userGroup_editCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '编辑成功', timeout: 2000 });
      $('#div').dialog('close');
      eapor.utils.defaultAjax('../ugrole/listall', {}, userGroup_getAllUserGroupList);
    }
  }
  //编辑
  function userGroup_Edit() {

    var select = $('#userGroup_list').datagrid('getSelected');
    if (!select || select.usergroupName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择一个用户组！', timeout: 2000 });
      return;
    }
    $('#userGroup_edit').append(
      '<div id="div" style="padding-top:20px;padding-left:30px;">' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="userGroup_editUserGroupName" diaabled label="<span style=\'color:red;font-size:16px;\'>*</span>用户组名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="userGroup_editRemark"  label="备注：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '</div>'
    );
    $('#userGroup_editUserGroupName').textbox({
      required: true,
      missingMessage: "用户组名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#userGroup_editUserGroupName').textbox('setValue', select.usergroupName);
    $('#userGroup_editRemark').textbox({
      multiline: true,
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#userGroup_editRemark').textbox('setValue', select.remark);
    $('#div').dialog({
      title: '编辑用户组',
      width: 320,
      height: 190,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var name = $('#userGroup_editUserGroupName').textbox('getValue');
          if (!$('#userGroup_editUserGroupName').textbox('isValid')) {
            $('#userGroup_editUserGroupName').textbox('textbox').focus();
            //$.messager.show({title:'系统提示',msg:'用户组名称不能为空 ！',timeout:2000});
            return;
          }
          if (!$('#userGroup_editRemark').textbox('isValid')) {
            $('#userGroup_editRemark').textbox('textbox').focus();
            return;
          }
          var remark = $('#userGroup_editRemark').textbox('getValue');
          var data = {};
          data.usergroupId = select.usergroupId;
          data.usergroupName = name;
          data.remark = remark;
          eapor.utils.defaultAjax('../ugrole/edit', data, userGroup_editCallback);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }
  //新增回调
  function userGroup_addCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result <= 0) {
      $('#userGroup_addUserGroupName').textbox('textbox').focus();
      $.messager.show({ title: '系统提示', msg: '新增失败！您所添加的用户组已经存在！', timeout: 2000 });
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '新增成功', timeout: 2000 });
      $('#div').dialog('close');
      eapor.utils.defaultAjax('../ugrole/listall', {}, userGroup_getAllUserGroupList);
    }
  }
  /*新增用户组*/
  function userGroup_Add() {
    $('#userGroup_add').append(
      '<div id="div" style="padding-top:20px;padding-left:30px;">' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="userGroup_addUserGroupName" diaabled label="<span style=\'color:red;font-size:16px;\'>*</span>用户组名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="userGroup_addRemark"  label="备注：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:220px;">' +
      '</div>' +
      '</div>'
    );
    $('#userGroup_addUserGroupName').textbox({
      required: true,
      missingMessage: "用户组名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证

    });
    $('#userGroup_addRemark').textbox({
      multiline: true,
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#div').dialog({
      title: '新增用户组',
      width: 340,
      height: 200,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var name = $('#userGroup_addUserGroupName').textbox('getValue');
          //if(name == ""){
          if (!$('#userGroup_addUserGroupName').textbox('isValid')) {
            $('#userGroup_addUserGroupName').textbox('textbox').blur().focus();
            //$.messager.show({title:'系统提示',msg:'请输入用户组名称 ！',timeout:2000});
            return;
          }
          if (!$('#userGroup_addRemark').textbox('isValid')) {
            $('#userGroup_addRemark').textbox('textbox').blur().focus();
            return;
          }

          var remark = $('#userGroup_addRemark').textbox('getValue');
          var data = {};
          data.usergroupName = name;
          data.remark = remark;
          eapor.utils.defaultAjax('../ugrole/add', data, userGroup_addCallback);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  };
  //加载table
  var rowSelect_userGroup = null,
    onlySelectedOneRowFlag = 0;
  function userGroup_loadTable() {

    $('#userGroup_list').datagrid({
      loader: userGroup_userGroupLoader,
      title: '用户组列表', 		//表格标题
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
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('userGroup_list', 'usergroupName', 2, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        //隐藏全选框
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          userGroup_Add();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          userGroup_Edit();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          userGroup_remove();
        }
      }, '-', {
        text: '权限管理',
        iconCls: 'icon-sum',
        handler: function () {
          var select = $('#userGroup_list').datagrid('getSelected');
          userGroup_permissionAddorRemove(select);
        }
      }],
      checkOnSelect: false,
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
          rowSelect_userGroup = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_userGroup = null;
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

        if (rowData != rowSelect_userGroup) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_userGroup = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_userGroup = null;
        }

        onlySelectedOneRowFlag = 0;
      },
      columns: [[
        { field: 'ck', title: "", checkbox: true },
        { field: 'usergroupId', title: "用户组ID", hidden: true },
        { field: 'usergroupName', title: "用户组名称", width: 100, align: 'center' },
        { field: 'remark', title: "备注", width: 100, align: 'center' },
      ]]
    })

  }

  function userGroup_getRoleAndRoletype(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    var lstroletype = result.lstroletype;
    var lstrole = result.lstrole;
    var lsttreetmp = convertnodes(converttype(lstroletype), lstrole);

    $('#userGroup_tree').tree({
      data: lsttreetmp,
      animate: false,
      checkbox: true,
      onLoadSuccess: function (node, data) {
        $('#userGroup_tree').tree('collapseAll');
      },
			/*onCheck:function(node,checked){
				permission_change(node,checked);
			}*/
    })
  }
  /*获取所有用户组*/
  function userGroup_getAllUserGroupList(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    userGroup_userGroupArray = result;
    userGroup_loadTable();

    eapor.utils.defaultAjax("../role/listwithtype", {}, userGroup_getRoleAndRoletype);
  }

  eapor.utils.defaultAjax('../ugrole/listall', {}, userGroup_getAllUserGroupList);
})();