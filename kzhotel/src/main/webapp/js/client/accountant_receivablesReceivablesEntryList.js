/**
 *@JSname:账务-->客源应收款收款录入
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_receivablesReceivableEntry");
  var channelId_receivablesReceivablesList = "";
  var channelName_receivablesReceivablesList = "";

  var searchloader_receivablesReceivablesList = function (param, success, error) {
    $.ajax({
      url: '../channel/listChannelCollectPage',
      data: {
        limit: 9999999, offset: 0, channelName: channelName_receivablesReceivablesList,
        channelId: channelId_receivablesReceivablesList
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_receivablesReceivablesList').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $('#tab_receivablesReceivablesList').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_receivablesReceivablesList').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data);
        return true;
      },
      error: function (err) {
        alert(err);
      }
    });
  };
  //收款方式combobox初始化
  $('#paymethodCode_receivablesReceivableEntry').combobox({
    valueField: 'paymethod_code',
    textField: 'paymethod_name',
    data: eapor.data.PaymethodObj,
    editable: false,
    panelHeight: "auto",
    panelMaxHeight: 200,
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].paymethod_code);
        $(this).combobox('setText', data[0].paymethod_name);
      }
    }
  });

  var receivablesReceivableEntry_clickFlag = true;
  //清空按钮
  $('#reset_receivablesReceivableEntry').click(function () {
    $('#accessAmount_receivablesReceivableEntry').numberbox('clear');
    $('#rechargeAmount_receivablesReceivableEntry').numberbox('clear');
    $('#remark_receivablesReceivableEntry').textbox('clear');
  });
  //提交按钮
  $('#submit_receivablesReceivableEntry').click(function () {
    if (!receivablesReceivableEntry_clickFlag) {
      $.messager.show({ title: '系统提示', msg: '等待提交结果中~请勿重复提交！', timeout: 2000, showType: 'slide' });
      return;
    }
    var salerUserId = undefined,
      salerUsername = "",
      channelId = undefined,
      paramAccessAmount_receivablesReceivableEntry = "",
      paramRechargeAmount_receivablesReceivableEntry = "";

    if ($('#channel_receivablesReceivableEntry').textbox('getValue') == "") {
      $('#channel_receivablesReceivablesList').combobox('textbox').focus();
      $.messager.show({ title: '系统提示', msg: '请先选择客源单位，点击搜索！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var channelId = $('#channel_receivablesReceivableEntry').textbox('getValue');
    var getChannelData = $('#channel_receivablesReceivablesList').combobox('getData');
    $.each(getChannelData, function (i, item) {
      if (channelId == item.channelId) {
        salerUserId = item.salerUserId;
        salerUsername = item.salerUsername;
        return;
      }
    })
    if (!$('#accessAmount_receivablesReceivableEntry').textbox('isValid')) {
      $('#accessAmount_receivablesReceivableEntry').textbox('textbox').focus();
      return;
    }
    if (!$('#rechargeAmount_receivablesReceivableEntry').textbox('isValid')) {
      $('#rechargeAmount_receivablesReceivableEntry').textbox('textbox').focus();
      return;
    }
    if (!$('#remark_receivablesReceivableEntry').textbox('isValid')) {
      $('#remark_receivablesReceivableEntry').textbox('textbox').focus();
      return;
    }

    paramAccessAmount_receivablesReceivableEntry = (($('#accessAmount_receivablesReceivableEntry').numberbox('getValue')) * 100).toFixed(0);
    paramRechargeAmount_receivablesReceivableEntry = (($('#rechargeAmount_receivablesReceivableEntry').numberbox('getValue')) * 100).toFixed(0);
    var setRemark = $('#remark_receivablesReceivableEntry').textbox('getValue');

    receivablesReceivableEntry_clickFlag = !receivablesReceivableEntry_clickFlag;
    var paymethodCode = $('#paymethodCode_receivablesReceivableEntry').combobox('getValue');
    var paymethodName = $('#paymethodCode_receivablesReceivableEntry').combobox('getText');

    $.ajax({
      url: '../channel/addChanelCollect',
      data: {
        accessAmount: paramAccessAmount_receivablesReceivableEntry,
        rechargeAmount: paramRechargeAmount_receivablesReceivableEntry,
        channelId: channelId,
        salerUserId: salerUserId,
        salerUsername: salerUsername,
        remark: setRemark,
        paymethodCode: paymethodCode,//支付方式编码int
        paymethodName: paymethodName//支付方式名称String
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          receivablesReceivableEntry_clickFlag = !receivablesReceivableEntry_clickFlag;
          return;
        }
        if (data > 0) {
          $('#accessAmount_receivablesReceivableEntry').numberbox('clear');
          $('#rechargeAmount_receivablesReceivableEntry').numberbox('clear');
          $('#remark_receivablesReceivableEntry').textbox('clear');
          $('#accessAmount_receivablesReceivableEntry').numberbox('resetValidation');
          $('#rechargeAmount_receivablesReceivableEntry').numberbox('resetValidation');
          $('#remark_receivablesReceivableEntry').textbox('resetValidation');

          channelId_receivablesReceivablesList = $('#channel_receivablesReceivableEntry').textbox('getValue');
          channelName_receivablesReceivablesList = $('#channel_receivablesReceivableEntry').textbox('getText');
          $('#tab_receivablesReceivablesList').datagrid("options").loader = searchloader_receivablesReceivablesList;
          $("#tab_receivablesReceivablesList").datagrid("reload");
          $.messager.show({ title: '系统提示', msg: '录入成功！！', timeout: 2000, showType: 'slide', height: 'auto' });
          receivablesReceivableEntry_clickFlag = !receivablesReceivableEntry_clickFlag;
        } else {
          $.messager.show({ title: '系统提示', msg: '录入失败！！', timeout: 2000, showType: 'slide', height: 'auto' });
          receivablesReceivableEntry_clickFlag = !receivablesReceivableEntry_clickFlag;
        }
      }
    });
  });

  //账务-->客源应收款收款列表
  $('#tab_receivablesReceivablesList').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows[0] == undefined) {
        $(this).datagrid('insertRow', {
          index: 0,	// 索引从0开始
          row: {
            accessAmount: '<span style="color:red;font-size:18px;">未查询到相关信息！</span>'
          }
        });
        $(this).datagrid('mergeCells', {
          index: 0,
          field: 'accessAmount',
          colspan: 5
        });
        $(this).parent().find(".datagrid-td-rownumber").css("background-color", "#FAFAFA").css("border-color", "#FAFAFA").children('div').html("");
        $(this).parent().find(".datagrid-td-merged").css("border-bottom-color", "#FAFAFA")
        const that = $(this).parent().find(".datagrid-td-merged").parent()[0];
        $(that).hover(function () { $(that).css("background-color", "#FAFAFA") });
      }
    },
    columns: [[  //-----columns start-----
      { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'salerUserId', title: "salerUserId", align: 'center', width: 20, hidden: true },
      { field: 'channelCollectId', title: "channelCollectId", align: 'center', width: 20, hidden: true },
      { field: 'channelName', title: "客源名称", align: 'center', width: 20, hidden: true },
      { field: 'salerUsername', title: "客户经理名称", align: 'center', width: 20, hidden: true },
      {
        field: 'creditBalance', title: "信用额度", align: 'center', width: 20, hidden: true,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },

      {
        field: 'accessAmount', title: "收款", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else if (value == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
            return value;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'rechargeAmount', title: "冲抵应收款", align: 'center', width: 20,
        formatter: function (value, row, index) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      { field: 'remark', title: "备注", align: 'center', width: 20 },
      {
        field: 'createTime', title: "日期时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'createUsername', title: "编辑人", align: 'center', width: 20 }
    ]]
  });

  $('#searchByChannel_receivablesReceivablesList').click(function () {
    var channelText = $('#channel_receivablesReceivablesList').combobox('getText');
    var channelId = $('#channel_receivablesReceivablesList').combobox('getValue');
    if (channelText == "") {
      $('#channel_receivablesReceivablesList').combobox('textbox').focus();
      $.messager.show({ title: '系统提示', msg: '请先选择客源单位！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }

    channelId_receivablesReceivablesList = channelText;
    var flag = 0;
    var arrCombobox = $('#channel_receivablesReceivablesList').combobox('getData');
    for (let i = 0; i < arrCombobox.length; i++) {
      if (channelText != arrCombobox[i].channelName) {
        flag = i;
      } else {
        break;
      }
      if (flag == (arrCombobox.length - 1)) {
        $.messager.show({ title: '系统提示', msg: '客源名称输入有误！', timeout: 2000, showType: 'slide' });
        return;
      }
    }
    arrCombobox.forEach(function (item, key, obj) {
      if (channelId_receivablesReceivablesList == item.channelName) {
        channelId_receivablesReceivablesList = item.channelId;
        channelName_receivablesReceivablesList = item.channelName;
        return;
      }
    });
    $('#channel_receivablesReceivableEntry').textbox('setValue', channelId_receivablesReceivablesList);
    $('#channel_receivablesReceivableEntry').textbox('setText', channelName_receivablesReceivablesList);
    $('#accessAmount_receivablesReceivableEntry').numberbox('resetValidation');
    $('#rechargeAmount_receivablesReceivableEntry').numberbox('resetValidation');
    $('#remark_receivablesReceivableEntry').textbox('resetValidation');
    $('#tab_receivablesReceivablesList').datagrid("options").loader = searchloader_receivablesReceivablesList;
    $("#tab_receivablesReceivablesList").datagrid("reload");
  });


  $('#channel_receivablesReceivablesList').combobox({
    url: '../channel/pglist',
    queryParams: { offset: 0, limit: 9999, channelName: '', usageState: 1 },
    valueField: 'channelId',
    textField: 'channelName',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter: function (data) {
      var len = data.length - 1;
      for (let i = len; i > -1; i--) {
        if ((data[i].channelName == "会员") || (data[i].channelName == "非会员")) {
          eapor.utils.arrDelByLenId.call(data, i);
        }
      }
      return data;
    }
  });
  $('#accessAmount_receivablesReceivableEntry').numberbox({
    precision: 2,
    required: true,
    missingMessage: '请输入收款金额！',
    validateOnCreate: false,
    validateOnBlur: true
  });
  $('#rechargeAmount_receivablesReceivableEntry').numberbox({
    precision: 2,
    required: true,
    missingMessage: '请输入金额！',
    validateOnCreate: false,
    validateOnBlur: true
  });
  $('#remark_receivablesReceivableEntry').textbox({
    multiline: true,
    validType: ['maxLength[32]'],
    invalidMessage: '最多输入32个字符',
    validateOnCreate: false,
    validateOnBlur: true
  });
})();