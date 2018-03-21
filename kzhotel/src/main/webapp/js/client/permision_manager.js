/**
 *@JSname:权限管理
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_permision");

  function Map() {
    this.keys = [];
    this.data = [];
  }

  Map.prototype = {
    constructor: Map,
    //添加键值对
    set: function (key, value) {
      if (this.keys.indexOf(key) == -1) {
        //if (this.data[key] == null) {//如键不存在则身【键】数组添加键名
        this.keys.push(value);
      }
      this.data[key] = value;//给键赋值
    },
    //获取键对应的值
    get: function (key) {
      return this.data[key];
    },
    //去除键值，(去除键数据中的键名及对应的值)
    remove: function (key) {
      this.keys.remove(key);
      this.data[key] = null;
    },
    //判断键值元素是否为空
    isEmpty: function () {
      return this.keys.length == 0;
    },
    //获取键值元素大小
    size: function () {
      return this.keys.length;
    }
  };

  var permissiontypetree = {};

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
    //不对数据项做操作
    if (lsttmpnodes.roletype == 0) {
      return;
    }
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

  function convertnodes(lsttmpnodes, rows) {
    $.each(rows, function (j, itemtmprow) {
      convertnodeschild(itemtmprow, lsttmpnodes);
    });

    return lsttmpnodes;
  }

	/*重组数据结构
	 * 转化为tree标准结构
	 * */
  function convertold(rows) {
    function existsnode(existsrows, parentId) {
      var bresultflag = false;
      $.each(existsrows, function (i, item) {
        if (item.roletypeId == parentId) {
          bresultflag = true;
          return;
        }
      });
      return bresultflag;
    }

    var nodesresult = [];
    //top level
    $.each(rows, function (i, item) {

      if (existsnode(nodesresult, item.roletypeId) == false) {
        if (item.roletypeId > 0) {
          nodesresult.push({
            id: item.roletypeId,
            text: maptype.get(item.roletypeId)
            , roletypeId: item.roletypeId
            , checked: false
          });
        }
      }
    });

    var lsttmpnodes = [];
    $.each(nodesresult, function (i, item) {
      lsttmpnodes.push(item);
    });

    $.each(lsttmpnodes, function (i, itemlsttmpnode) {
      $.each(rows, function (i, itemtmprow) {
        if (itemtmprow.roletypeId == itemlsttmpnode.roletypeId) {
          var child = { id: itemtmprow.roleId, text: itemtmprow.roleName };
          if (itemlsttmpnode.children) {
            itemlsttmpnode.children.push(child);
          } else {
            itemlsttmpnode.children = [child];
          }
          lsttmpnodes.push(child);
        }
      });
    });
    return nodesresult;
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

  var maptype = new Map();
  maptype.set(1001, '前台');
  maptype.set(1002, '预订');
  maptype.set(1003, '客人');
  maptype.set(1004, '客户关系');
  maptype.set(1005, '当班');
  maptype.set(1006, '交易');
  maptype.set(1007, '库存');
  maptype.set(1008, '报表');
  maptype.set(2001, '物业设置');
  maptype.set(2002, '房价设置');
  maptype.set(2003, '库 商品 服务设置');
  maptype.set(2004, '账号管理');
  maptype.set(2005, '规则设置');

  console.info(maptype);
  /*所有用户组Loader*/
  var permission_allUserGroup = [];
  var permission_allUserGroupLoader = function (param, success, error) {
    if (!$.isEmptyObject(permission_allUserGroup)) {
      success(permission_allUserGroup);
      return true;
    }
    $.ajax({
      url: '../ugrole/listall',
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        permission_allUserGroup = data;
        success(permission_allUserGroup);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  /*用户组loader*/
  var permission_UserGroupArray = [];
  var permission_UserGroupLoader = function (param, success, error) {
    if (permission_UserGroupArray.length == 0) {
      success(permission_UserGroupArray);
      return true;
    }
    if (!$.isEmptyObject(permission_UserGroupArray)) {
      success(permission_UserGroupArray);
      return true;
    }
    $.ajax({
      url: '../ugrole/selectUsergroupByRoleId',
      type: "post",
      dataType: "json",
      data: { roleId: 0 },
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
        permission_UserGroupArray = data;
        success(permission_UserGroupArray);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  /*添加用户组回调函数*/
  function permission_addUserGroupCallback(result) {

    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '操作成功！！', timeout: 2000 });
      $('#div').dialog('close');
    }
    var rid = $('#permisionManager_tree').tree('getSelected').id;
    eapor.utils.defaultAjax('../ugrole/selectUsergroupByRoleId', { roleId: rid }, permission_getUserGroupByRoleIdCallback);
  }
  /*添加用户组确定按钮*/
  function permission_addUserGroupSubmit() {
    var ug = $('#permission_allUserGroup').combobox('getValue');
    if (ug == "") {
      $.messager.show({ title: '系统提示', msg: '请选择一个用户组！', timeout: 2000 });
      return;
    }

    var h = 0;
    console.info(permission_UserGroupArray);
    //判断是否已经存在
    $.each(permission_UserGroupArray, function (i, item) {
      if (ug == item.usergroupName) {
        h = 1;
        return;
      }
    })

    if (h == 1) {
      $.messager.show({ title: '系统提示', msg: '已经存在该用户组了！', timeout: 2000 });
      return;
    }

    var usergroupId = 0;
    var re = "";
    $.each(permission_allUserGroup, function (p, per) {
      if (ug == per.usergroupName) {
        usergroupId = per.usergroupId;
        re = per.reamrk;
        return;
      }
    })

    var roleId = $('#permisionManager_tree').tree('getSelected').id;
    var data = {};
    data.usergroupId = usergroupId;
    data.roleId = roleId;

    eapor.utils.defaultAjax('../ugrole/addug', data, permission_addUserGroupCallback);

  }
  /*添加用户组*/
  function permission_AddUserGroup() {
    $('#permission_addUserGroupDialog').append(
      '<div id="div" style="padding:30px;">' +
      '<input class="easyui-combobox" id="permission_allUserGroup" style="width:80%;" labelAlign="right" label="用户组：" labelPosition="before" />' +
      '</div>'
    );
    $('#permission_allUserGroup').combobox({
      loader: permission_allUserGroupLoader,
      valueField: 'usergroupName',
      textField: 'usergroupName',
      //value:'全部',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].usergroupName);
          $(this).combobox('setText', data[0].usergroupName);
        }
      }
    });
    var permission_add = $('#div').dialog({
      title: '新增用户组',
      width: 360,
      height: 160,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          permission_addUserGroupSubmit();
        }
      }, {
        text: '取消',
        handler: function () {
          permission_add.dialog('close');
        }
      }]
    })
  }
  /*移除回调*/
  function permission_removeUserGroupCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000 });
      var select = $('#permision_userGroupList').datagrid('getSelected');
      var index = $('#permision_userGroupList').datagrid('getRowIndex', select);
      $('#permision_userGroupList').datagrid('deleteRow', index);
    }
  }
  /*移除用户组*/
  function permission_RemoveUserGroup() {
    var select = $('#permision_userGroupList').datagrid('getSelected');

    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择一个用户组！', timeout: 2000 });
      return;
    }
    $.messager.confirm('系统提示', '您确认要删除该信息吗？', function (r) {
      if (r) {
        var tree = $('#permisionManager_tree').tree('getSelected');
        var data = {};
        data.roleId = tree.id;
        data.usergroupId = select.usergroupId;
        eapor.utils.defaultAjax('../ugrole/deleteByRoleIdAndUsergroupId', data, permission_removeUserGroupCallback);
      }
    });
  }
  /*加载右边用户组列表*/
  function permission_loadUserGroup() {
    $('#permision_userGroupList').datagrid({
      loader: permission_UserGroupLoader,
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
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          permission_AddUserGroup();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          permission_RemoveUserGroup();
        }
      }],
      columns: [[
        { field: 'usergroupId', title: "用户组ID", width: 100, hidden: true },
        { field: 'usergroupName', title: "用户组名称", width: 100 },
        { field: 'remark', title: "备注", width: 100, },
      ]]
    })
  }

  /*获取所有用户组的回调函数*/
  function permission_getAllUserGroupCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    permission_allUserGroup = result;
  }
  /*回调*/
  function permission_getUserGroupByRoleIdCallback(result) {

    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    permission_UserGroupArray = result;
    permission_loadUserGroup();
    eapor.utils.defaultAjax('../ugrole/listall', {}, permission_getAllUserGroupCallback)

  }

  /*获取角色类型回调函数*/
  function permission_getRoleTypeCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    permissiontypetree = JSON.stringify(result);

    var lstroletype = result.lstroletype;
    var lstrole = result.lstrole;

    var lsttreetmp = convertnodes(converttype(lstroletype), lstrole);
    //var has = JSON.parse($('#permission_hasRoleData').val());
    // checkhaspermission(lsttreetmp,has);
    // console.info(lsttreetmp);

    $('#permisionManager_tree').tree({
      data: lsttreetmp,
      animate: false,
      onLoadSuccess: function (node, data) {
        $('#permisionManager_tree').tree('collapseAll');
      },
      onSelect: function (node, checked) {
        if (node.children == null) {
          eapor.utils.defaultAjax('../ugrole/selectUsergroupByRoleId', { roleId: node.id }, permission_getUserGroupByRoleIdCallback)
        }
      }
    })
  }

  eapor.utils.defaultAjax("../role/listwithtype", {}, permission_getRoleTypeCallback);
})();