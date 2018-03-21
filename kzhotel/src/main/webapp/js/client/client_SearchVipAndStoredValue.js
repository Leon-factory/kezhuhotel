/**
 * @JSname:客户关系--》会员和储值管理
 */
~(function () {
  "use strict";

  let setPageNumber_highLevel = 1,
    setPageSize_highLevel = 10,
    guestManageArray_highLevel = [],
    rowjavadillselect = null,
    onlySelectedOneRowFlag = 0,
    guestManageListData_highLevel = {},
    maxId = 0;

  function guestManageLoader_highLevel(param, success, error) {
    if (!$.isEmptyObject(guestManageArray_highLevel)) {
      success(guestManageArray_highLevel);
      return true;
    }
    console.info("guestManageListData_highLevel", guestManageListData_highLevel);
    $.ajax({
      url: "../hotel/listMemberPage",
      type: "post",
      dataType: "json",
      data: guestManageListData_highLevel,
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        guestManageArray_highLevel = data;
        success(guestManageArray_highLevel);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  $('#createOrCancelCard_svasv').on('click', function () {
    try {
      let getSelected = $('#tab_client_SearchVipAndStoredValue').datagrid('getSelected');
      if (!getSelected || getSelected.nickname == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
        $.messager.show({ title: '系统提示', msg: '请先选择要编辑的数据！', timeout: 3000, showType: 'slide' });
        return;
      }
      //已制卡-->销卡
      if (getSelected.hasOwnProperty('vipcard')) {
        $.messager.confirm('系统提示', '您确认要注销该实体卡吗？', function (r) {
          if (r) {
            $.ajax({
              type: 'post',
              url: '../hotel/unbindVipcard',
              data: { userId: getSelected.memberId },
              dataType: 'json',
              success: function (result) {
                console.info(result);
                if (result > 0) {
                  $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
                  //刷新。。
                  reloadDatagrid_highLevel();
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
              }
            });
          }
        });
      } else {
        //未制卡 --》制卡
        $('#showCreateCardDialog_SearchVipAndStoredValue').append(
          `<div id="div" style="padding:20px;">
						<div style="margin-bottom:20px">
							<input id="cardNum_SearchVipAndStoredValue" style="width:250px;"
								label="实体卡号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
						</div>
						<div>
							<input id="cardCode_SearchVipAndStoredValue" style="width:250px;"
								label="卡的编号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
						</div>
					</div>`
        );
        $('#cardNum_SearchVipAndStoredValue').textbox({});
        $('#cardCode_SearchVipAndStoredValue').textbox({});
        let div = $('#div');
        div.dialog({
          title: '制实体卡',
          width: 320,
          height: 200,
          closed: false,
          cache: false,
          modal: true,
          buttons: [{
            text: '确定',
            handler: function () {
              console.info(getSelected.memberId);
              console.info($('#cardNum_SearchVipAndStoredValue').textbox('getValue'));
              console.info($('#cardCode_SearchVipAndStoredValue').textbox('getValue'));
              $.ajax({
                type: 'post',
                url: '../hotel/bindVipcard',
                data: {
                  userId: getSelected.memberId,
                  vipcard: $('#cardNum_SearchVipAndStoredValue').textbox('getValue'),
                  vipcardface: $('#cardCode_SearchVipAndStoredValue').textbox('getValue')
                },
                dataType: 'json'
              })
                .done(function (result) {
                  console.info(result);
                  if (eapor.utils.ajaxCallBackErrInfo(result)) {
                    return;
                  }
                  if (result > 0) {
                    $.messager.show({
                      title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide'
                    });
                    div.dialog('close');
                    //刷新。。
                    reloadDatagrid_highLevel();
                    return;
                  }
                  $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
                });
            }
          },
          {
            text: '取消',
            handler: function () {
              div.dialog('close');
            }
          }
          ]
        });
      }
    } catch (e) {

    }
  });
  //客户经理指定
  $('#setChannelId_svasv').on('click', function () {
    try {
      let getSelected = $('#tab_client_SearchVipAndStoredValue').datagrid('getSelected');
      if (!getSelected || getSelected.nickname == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
        $.messager.show({ title: '系统提示', msg: '请先选择要编辑的数据！', timeout: 3000, showType: 'slide' });
        return;
      }
      //更改客户经理设置
      console.info(getSelected);
      let id = getSelected.managerId;
      $('#showSetManagerDialog_SearchVipAndStoredValue').append(
        `<div id="div" style="padding:20px;">
					<div style="margin-bottom:0px">
						<input id="managerName_editSvasv" style="width:250px;"
							label="客户经理：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
				</div>`
      );
      $('#managerName_editSvasv').combobox({
        url: '../user/ujlist',
        /*url:'../hotel/getShopUserList',*/
        queryParams: { offset: 0, limit: 9999999, maxUserId: 9999999, usergroupId: 0, username: '' },
        valueField: 'userId',
        textField: 'username',
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onLoadSuccess: function (data) {
          let This = this;
          if (data.length > 0) {
            $.each(data, function (i, item) {
              if (item.userId == id) {
                $(This).combobox('setValue', item.userId);
                $(This).combobox('setText', item.username);
                return;
              }
            });
          }
        },
        loadFilter: function (data) {
          if (data != -3333 && data != -3335) {
            data.unshift({ 'userId': 0, 'username': '--' });
          }
          return data;
        }

      });
      let div = $('#div');
      div.dialog({
        title: '客户经理指定',
        width: 340,
        height: 150,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            $.ajax({
              type: 'post',
              url: '../hotel/modifyManager',
              data: {
                userId: getSelected.memberId,
                userName: getSelected.nickname,
                clientmanagerId: $('#managerName_editSvasv').combobox('getValue'),
                clientmanagerName: $('#managerName_editSvasv').combobox('getText') === '--'
                  ? ''
                  : $('#managerName_editSvasv').combobox('getText')
              },
              dataType: 'json',
              success: function (result) {
                console.info(result);
                if (eapor.utils.ajaxCallBackErrInfo(result)) {
                  return;
                }
                if (result > 0) {
                  $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
                  div.dialog('close');
                  reloadDatagrid_highLevel();
                  return;
                } else {
                  $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
                  return;
                }
              }
            });

          }
        }, {
          text: '取消',
          handler: function () {
            div.dialog('close');
          }
        }]
      });
    } catch (e) {

    }
  });

  function reloadDatagrid_highLevel() {
    let data = {
      offset: setPageSize_highLevel * (setPageNumber_highLevel - 1),
      limit: setPageSize_highLevel,
      phone: "",
      membername: "",
      hotelId: $('#indexhotelId').val(),
      maxId: maxId
    };
    console.info(data);
    eapor.utils.defaultAjax('../hotel/listMemberPage', data, ghm_getPageListClickCallback);
  };

  /*搜索*/
  $('#searchVIPInfo').on('click', function () {
    if (!$('#iptPhone_svasv').numberbox('isValid')) {
      $('#iptPhone_svasv').numberbox('textbox').focus();
      return;
    }
    let data = {
      hotelId: $('#indexhotelId').val(),
      membername: $('#iptName_svasv').textbox('getValue'),
      phone: $('#iptPhone_svasv').numberbox('getValue')
    };
    eapor.utils.defaultAjax('../hotel/getMemberCount', data, ghm_getPageCountCallback);
  });

  /*分页按钮*/
  function ghm_getPageListClickCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    guestManageArray_highLevel = result.data;
    $('#tab_client_SearchVipAndStoredValue').datagrid('options').loader =
      guestManageLoader_highLevel;
    $('#tab_client_SearchVipAndStoredValue').datagrid('reload');
  }

  function ghm_getPageListCallback(result) {
    $('#loading_svasv').hide();
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    guestManageArray_highLevel = result.data;
    maxId = result.maxId;
    console.info(result);
    $('#tab_client_SearchVipAndStoredValue').datagrid({
      loader: guestManageLoader_highLevel,
      title: '', 		//表格标题
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
          rowjavadillselect = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowjavadillselect = null;
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
          rowjavadillselect = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowjavadillselect = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('tab_client_SearchVipAndStoredValue', 'nickname', 9, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      columns: [[
        { field: 'managerId', title: 'managerId', width: 15, align: 'center', hidden: true },
        { field: 'inviterId', title: '邀请人id', width: 15, align: 'center', hidden: true },
        { field: 'memberId', title: '会员ID', width: 15, align: 'center', hidden: true },
        {
          field: 'createTime', title: '会员发展时间', width: 30, align: 'center', hidden: true,
          formatter: function (value) {
            return getDate(value);
          }
        },

        { field: 'ck', title: '', checkbox: true },
        { field: 'nickname', title: '会员昵称', width: 15, align: 'center' },
        { field: 'phone', title: '手机号码', width: 20, align: 'center' },
        {
          field: 'isBind', title: '手机号码是否绑定', width: 20, align: 'center',
          formatter: function (value, row, index) {
            if (value == 1) {
              return "是";
            } else if (value == 0) {
              return "否";
            } else {
              return value;
            }
          }
        },
        {
          field: 'isHome', title: '是否本店会员', width: 20, align: 'center',
          formatter: function (value, row, index) {
            if (value == 1) {
              return "是";
            } else if (value == 0) {
              return "否";
            } else {
              return value;
            }
          }
        },
        //						      {field:'inviterNickname',title:'会员发展人',width:20,align:'center'}, 
        { field: 'balance', title: '本店储值余额', width: 20, align: 'center' },
        { field: 'points', title: '积分币金额', width: 20, align: 'center' },
        { field: 'vipcard', title: '实体卡号', width: 30, align: 'center' },
        { field: 'manangerName', title: '客户经理', width: 20, align: 'center' }
      ]]
    })
  }
  //countCallBack
  function ghm_getPageCountCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    //得到分页点击记录
    $('#listPage_searchVipAndStoredValue').pagination({
      showPageList: false,
      total: result,
      pageSize: 10,
      pageNumber: 1,
      onSelectPage: function (pageNumber, pageSize) {
        if (!pageNumber) {
          return;
        }
        setPageNumber_highLevel = pageNumber;
        setPageSize_highLevel = pageSize;
        let data = {
          offset: pageSize * (pageNumber - 1),
          limit: pageSize,
          phone: "",
          membername: "",
          hotelId: $('#indexhotelId').val(),
          maxId: maxId
        };
        eapor.utils.defaultAjax('../hotel/listMemberPage', data, ghm_getPageListClickCallback);
      }
    });
    //得到显示分页记录
    let page = $('#listPage_searchVipAndStoredValue').pagination('options');
    let data = {
      offset: 0,
      limit: page.pageSize,
      phone: $('#iptPhone_svasv').numberbox('getValue'),
      membername: $('#iptName_svasv').textbox('getValue'),
      hotelId: $('#indexhotelId').val(),
      maxId: 0
    };
    guestManageListData_highLevel = data;
    console.info(data);
    eapor.utils.defaultAjax('../hotel/listMemberPage', data, ghm_getPageListCallback);
  };

  $('#listPage_searchVipAndStoredValue').pagination({ showPageList: false });

  let data = {
    hotelId: $('#indexhotelId').val(),
    membername: "",
    phone: ""
  };
  eapor.utils.defaultAjax("../hotel/getMemberCount", data, ghm_getPageCountCallback);
})();