/**
 * @JSname:客源高级管理
 */
~(function (window) {
  "use strict";
  var setPageNumber_highLevel = 1,
    setPageSize_highLevel = 10,
    guestManageListData_highLevel = {},
    guestManageArray_highLevel = [],
    rowjavadillselect = null,
    onlySelectedOneRowFlag = 0,
    //回调函数
    setIsThird_handler = function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '设置成功！', timeout: 2000, showType: 'slide' });
        $('#div').dialog('close');
        reloadDatagrid_highLevel();
        //更新index中的代收对象
        $.ajax({
          type: 'post',
          url: '../channel/getAgentCollectionList',
          data: {},
          dataType: "json"
        })
          .done(function (result) {
            eapor.data.otherPaymethod = result;
            eapor.data.getNewPaymethodAddOtherPaymenthod = [];

            for (let i = 0; i < eapor.data.PaymethodObj.length; i++) {
              eapor.data.getNewPaymethodAddOtherPaymenthod.push(eapor.data.PaymethodObj[i]);
            }
            if (eapor.data.otherPaymethod.length > 0) {
              for (let i = 0; i < eapor.data.otherPaymethod.length; i++) {
                eapor.data.getNewPaymethodAddOtherPaymenthod.push(eapor.data.otherPaymethod[i]);
              }
              for (let i = 0; i < eapor.data.getNewPaymethodAddOtherPaymenthod.length; i++) {
                if (eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodCode) {
                  eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethod_code =
                    eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodCode;
                  eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethod_name =
                    eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodName;
                }
              }
            }

          });
        //window.getAllpaymenthod();
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
        return;
      }
    },
    setCredits_handler = function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '设置成功！', timeout: 2000, showType: 'slide' });
        $('#div').dialog('close');
        reloadDatagrid_highLevel();
      }
      if (result < 0) {
        $.messager.show({ title: '系统提示', msg: '设置失败！', timeout: 2000, showType: 'slide' });
      }
    },
    guestManageLoader_highLevel = function (param, success, error) {
      if (!$.isEmptyObject(guestManageArray_highLevel)) {
        success(guestManageArray_highLevel);
        return true;
      }
      $.ajax({
        url: "../channel/listAdvanceChannelPage",
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
    },
    setAccountManager_handler = function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '设置成功！', timeout: 2000, showType: 'slide' });
        $('#div').dialog('close');
        reloadDatagrid_highLevel();
      }
      if (result < 0) {
        $.messager.show({ title: '系统提示', msg: '设置失败！', timeout: 2000, showType: 'slide' });
      }
    };

  //信用额度设定
  $('#setCredit_highLevel').click(function () {
    var selected = $('#tab_client_guestHighLevel_manage').datagrid('getSelected');
    if (!selected || selected.channelName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择客源！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (selected.sourceGroupName != "协议单位" && selected.sourceGroupName != "旅行社") {
      $.messager.show({ title: '系统提示', msg: '该项信用额度不可编辑！请选择其他客源！(客源组为协议单位或旅行社才可设置信用额度！)', timeout: 5000, showType: 'slide', height: 'auto' });
      return;
    }
    var rows = selected;
    var index = "";
    cgm_Edit(rows, index, 1);
  });
  //客户经理指定
  $('#setUser_highLevel').click(function () {
    var selected = $('#tab_client_guestHighLevel_manage').datagrid('getSelected');
    if (!selected || selected.channelName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择客源！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (selected.channelName == "会员" || selected.channelName == "非会员" || selected.channelName == "驿宝") {
      $.messager.show({ title: '系统提示', msg: '该项不可编辑！请选择其他客源！', timeout: 2000, showType: 'slide' });
      return;
    }
    var rows = selected;
    var index = "";
    cgm_Edit(rows, index, 2);
  });

  function reloadDatagrid_highLevel() {
    var data = {
      offset: setPageSize_highLevel * (setPageNumber_highLevel - 1),
      limit: setPageSize_highLevel,
      channelName: "",
      usageState: 0
    };
    eapor.utils.defaultAjax('../channel/listAdvanceChannelPage', data, ghm_getPageListClickCallback);
  };

  function setIsThirdPartPayment_highLevel(row) {
    $('#setIsThirdPartPayment_div').append(
      `<div id="div" style="padding:20px 0 0 20px;">
				<div style="margin-bottom:20px;">
					<input id="setCredits_guestName3"  style="width:220px;"
						label="客源名称：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:20px;">
					<input id="setIsThird_salerUserId"  style="width:220px;"
						label="是否代收：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
			</div>`
    );
    $('#setCredits_guestName3').textbox({ disabled: true });;

    $('#setCredits_guestName3').textbox('setValue', row.channelId);
    $('#setCredits_guestName3').textbox('setText', row.channelName);
    $('#setIsThird_salerUserId').combobox({
      data: [{
        "id": 0,
        "text": "否"
      }, {
        "id": 1,
        "text": "是"
      }],
      valueField: 'text',
      textField: 'text',
      editable: false,
      panelHeight: "auto",
      onLoadSuccess: function () {
        $(this).combobox('setValue', row.isAgentCollection);
        if (row.isAgentCollection == 1) {
          $(this).combobox('setText', "是");
        } else if (row.isAgentCollection == 0) {
          $(this).combobox('setText', "否");
        }
      }
    });
    $('#div').dialog({
      title: '代收设置',
      width: 300,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var getChannelId = $('#setCredits_guestName3').textbox('getValue');
          if (getChannelId == "") {
            $.messager.show({ title: '系统提示', msg: '请选择要设置的客源名称！', timeout: 2000, showType: 'slide' });
            return;
          }
          var flag = $('#setIsThird_salerUserId').combobox('getValue');
          if (flag == "是") {
            flag = 1;
          } else if (flag == "否") {
            flag = 0;
          }
          var data = {};
          data.channelId = Number(getChannelId);
          data.flag = flag;//0非第三方支付，1是第三方支付
          eapor.utils.defaultAjax('../channel/modifyIsAgentCollection', data
            , setIsThird_handler);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  };
  //代收设定
  $('#setIsThirdPartPayment_highLevel').click(function () {
    var selected = $('#tab_client_guestHighLevel_manage').datagrid('getSelected');
    if (!selected || selected.channelName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择客源！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (selected.channelName == "会员" || selected.channelName == "非会员" || selected.channelName == "驿宝") {
      $.messager.show({ title: '系统提示', msg: '该项不可编辑！请选择其他客源！', timeout: 2000, showType: 'slide' });
      return;
    }
    setIsThirdPartPayment_highLevel(selected);
  });

  /*搜索*/
  $('#searchGuestManage_highLevel').on('click', function () {
    eapor.utils.defaultAjax('../channel/getChannelCount',
      {
        channelName: $('#ipt_guestName_guest_manage_highLevel').textbox('getValue'),
        usageState: 0
      },
      ghm_getPageCountCallback);
  });

  /*分页按钮*/
  function ghm_getPageListClickCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    guestManageArray_highLevel = result;
    $('#tab_client_guestHighLevel_manage').datagrid('options').loader =
      guestManageLoader_highLevel;
    $('#tab_client_guestHighLevel_manage').datagrid('reload');
  }

  function ghm_getPageListCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    guestManageArray_highLevel = result;
    $('#tab_client_guestHighLevel_manage').datagrid({
      loader: guestManageLoader_highLevel,
      title: '客源高级信息列表', 		//表格标题
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
          eapor.utils.messagerInfoBySearchEmpty('tab_client_guestHighLevel_manage', 'channelName', 8, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      columns: [[
        { field: 'sourceGroupId', title: 'sourceGroupId', align: 'center', width: 18, hidden: true },
        { field: 'salerUserId', title: 'salerUserId', align: 'center', width: 18, hidden: true },
        { field: 'channelId', title: 'channelId', align: 'center', width: 18, hidden: true },
        { field: 'rentplanName', title: '价格方案', align: 'center', width: 18, hidden: true },

        { field: 'ck', title: '', checkbox: true },
        {
          field: 'channelName', title: '客源名称', align: 'center', width: 18,
          formatter: function (value, row, index) {
            if (row.channelName == "会员" || row.channelName == "非会员" || row.channelName == "驿宝") {
              return value + "<span style='color:red;'>*</span>";
            } else {
              return value;
            }
          }
        },
        { field: 'sourceGroupName', title: '客源组', align: 'center', width: 18 },
        {
          field: 'payAmount2Y', title: '2年内交易总额', align: 'center', width: 20,
          formatter: function (value, row, index) {
            if (row.channelName != "会员" && row.channelName != "非会员"
              && row.channelName != "驿宝" && value != undefined) {
              return NP.divide(value, 100);
            } else {
              return "";
            }
          }
        },
        {
          field: 'balance', title: '应收款总额', align: 'center', width: 18,
          formatter: function (value, row, index) {
            if (row.channelName != "会员" && row.channelName != "非会员" && row.channelName != "驿宝") {
              return NP.divide(value, 100);
            } else {
              return "";
            }
          }
        },
        {
          field: 'creditAmount', title: '信用额度总额', align: 'center', width: 18,
          formatter: function (value, row, index) {
            if (row.channelName != "会员" && row.channelName != "非会员" && row.channelName != "驿宝") {
              if (NP.divide(value, 100) != 0) {
                return NP.divide(value, 100);
              } else {
                return "--";
              }
            } else {
              return "";
            }
          }
        },
        {
          field: 'creditAvailable', title: '信用额度余额', align: 'center', width: 18,
          formatter: function (value, row, index) {
            if (row.channelName != "会员" && row.channelName != "非会员" && row.channelName != "驿宝") {
              if (NP.divide(row.creditAmount, 100) != 0) {
                return NP.divide(value, 100);
              } else {
                return "--";
              }
            } else {
              return "";
            }
          }
        },
        {
          field: 'salerUsername', title: '客户经理', align: 'center', width: 16,
          formatter: function (value, row, index) {
            if (row.channelName != "会员" && row.channelName != "非会员" && row.channelName != "驿宝") {
              return value;
            } else {
              return "";
            }
          }
        },
        {
          field: 'isAgentCollection', title: '是否代收', align: 'center', width: 18,
          formatter: function (value, row, index) {
            if (value == 0) {
              return "不可代收";
            } else if (value == 1) {
              return "可代收";
            } else {
              return value;
            }
          }
        }
      ]]
    })
  }
  //操作
  function cgm_Edit(row, index, num) {
    console.info(row);
    if (num == 1) {//信用额度设定
      $('#setCredits_div').append(
        `<div id="div" style="padding:20px 0 0 40px">
					<div style="margin-bottom:20px;">
						<input id="setCredits_guestName" style="width:200px;"
							label="客源名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
					<div style="margin-bottom:20px;">
						<input id="setCredits_amount" style="width:200px;"
							label="信用额度：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
				</div>`
      );
      $('#setCredits_guestName').textbox({ disabled: true });
      $('#setCredits_amount').numberbox({
        required: true,
        precision: 2,
        missingMessage: "请输入要设置的信用额度！",
        validType: ['noNegativeNumber'],
        invalidMessage: "输入数字不能小于0",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#setCredits_guestName').textbox('setValue', row.channelId);
      $('#setCredits_guestName').textbox('setText', row.channelName);
      $('#setCredits_amount').numberbox('setValue', NP.divide(row.creditAmount, 100));
      $('#div').dialog({
        title: '信用额度设定',
        width: 300,
        height: 200,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            var getName = $('#setCredits_guestName').textbox('getValue');
            if (getName == "") {
              $.messager.show({ title: '系统提示', msg: '请选择要设置的客源名称！', timeout: 2000, showType: 'slide' });
              return;
            }
            if (!$('#setCredits_amount').numberbox('isValid')) {
              $('#setCredits_amount').numberbox('textbox').focus();
              return;
            }
            var getAmount = $('#setCredits_amount').numberbox('getValue');
            var data = {};
            data.channelId = getName;
            data.creditAmount = (getAmount * 100).toFixed(0);
            console.info(data);
            eapor.utils.defaultAjax('../channel/modifyCreditAmount', data
              , setCredits_handler);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#div').dialog('close');
          }
        }]

      })
    } else if (num == 2) {//客户经理指定
      $('#setAccountManager_div').append(
        `<div id="div" style="padding:20px 0 0 40px">
						<div style="margin-bottom:20px;">
							<input id="setCredits_guestName2" style="width:200px;"
								label="客源名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>
						</div>
						<div style="margin-bottom:20px;">
							<input id="setCredits_salerUserId" style="width:200px;"
								label="客户经理：" labelPosition="before" labelAlign="right" labelWidth="70"/>
						</div>
					</div>`
      );
      $('#setCredits_guestName2').textbox({ disabled: true });
      $('#setCredits_guestName2').textbox('setValue', row.channelId);
      $('#setCredits_guestName2').textbox('setText', row.channelName);
      $('#setCredits_salerUserId').combobox({
        url: '../user/ujlist',
        queryParams: { offset: 0, limit: 9999999, maxUserId: 9999999, usergroupId: 0, username: '' },
        valueField: 'userId',
        textField: 'username',
        editable: false,
        panelHeight: "auto",
        panelMaxHeight: 200,
        required: true,
        missingMessage: "请选择要设置的客户经理！",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
        onLoadSuccess: function (data) {
          let This = this;
          if (data.length > 0) {
            $.each(data, function (i, item) {
              if (item.userId == row.salerUserId) {
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
      $('#div').dialog({
        title: '客户经理指定',
        width: 300,
        height: 200,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            var getChannelId = $('#setCredits_guestName2').textbox('getValue');
            if (getChannelId == "") {
              $.messager.show({ title: '系统提示', msg: '请选择要设置的客源名称！', timeout: 2000, showType: 'slide' });
              return;
            }
            if (!$('#setCredits_salerUserId').combobox('isValid')) {
              $('#setCredits_salerUserId').combobox('textbox').focus();
              return;
            }
            var getSalerUserId = $('#setCredits_salerUserId').combobox('getValue');
            var salerUsername = $('#setCredits_salerUserId').combobox('getText');
            eapor.utils.defaultAjax('../channel/modifySaler',
              {
                channelId: Number(getChannelId),
                salerUserId: Number(getSalerUserId),
                salerUsername: salerUsername === '--' ? '' : salerUsername
              },
              setAccountManager_handler);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#div').dialog('close');
          }
        }]
      })
    }
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
    $('#channelListPage_guestHeightManage').pagination({
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
        var data = {};
        data.offset = pageSize * (pageNumber - 1);
        data.limit = pageSize;
        data.channelName = "";
        data.usageState = 0;
        eapor.utils.defaultAjax('../channel/listAdvanceChannelPage', data, ghm_getPageListClickCallback);
      }
    });
    //得到显示分页记录
    var page = $('#channelListPage_guestHeightManage').pagination('options');
    var data = {};
    data.offset = 0;
    data.limit = page.pageSize;
    data.channelName = $('#ipt_guestName_guest_manage_highLevel').textbox('getValue');
    data.usageState = 0;
    guestManageListData_highLevel = data;
    console.info(data);
    eapor.utils.defaultAjax('../channel/listAdvanceChannelPage', data, ghm_getPageListCallback);
  };

  $('#channelListPage_guestHeightManage').pagination({ showPageList: false });
  $('#ipt_guestName_guest_manage_highLevel').textbox({});
  var getValue = (sessionStorage.getItem("channelName_balanceOfReceivablesFromCustomers"));
  if (getValue != null && getValue != "") {//该判断是从客源余额统计JSP中的客源管理按钮进入的情况下
    $('#ipt_guestName_guest_manage_highLevel').textbox('setValue', getValue);
    sessionStorage.setItem("channelName_balanceOfReceivablesFromCustomers", "");
    $('#searchGuestManage_highLevel').click();
  } else {
    eapor.utils.defaultAjax("../channel/getChannelCount",
      { channelName: "", usageState: 0 },
      ghm_getPageCountCallback);
  }
})(window);