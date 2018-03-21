/**
 *@jsname:餐宴账单
 *@README:type 1支付  2消费   3签单  4坏账  5免单 6转出 7转入
 */
~(function (eapor) {
  "use strict";
  let onlySelectedOneRowFlag_banquentBill = 0,
    rowSelect_banquentBill = null,
    dialog = null,
    _banquetReceptionId = 0,
    getBanquetBillNumberPageDetailsInfo = null;//缓存明细 result -->选择账页 时 用于筛选出结果

  //初始化
  //选择账页
  $('#selectReceptionPageNumber_banquetBill').combobox({
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    data: [],
    valueField: 'text',
    textField: 'text',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter: function (data) {
      data.unshift({ "id": 0, "text": "全部", "selected": true });
      return data;
    }
  });
  //餐厅
  $('#restaurant_banquentBill').combobox({
    url: "../banquet/listRestaurant",
    queryParams: {
      restaurantName: "",
      banquetLocationId: 0,
      offset: 0,
      limit: 999999
    },
    valueField: 'restaurantId',
    textField: 'restaurantName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter: function (data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return [];
      }
      data.unshift({ "restaurantId": 0, "restaurantName": "全部" });
      return data;
    }
  });
  //宾客手机
  $('#guestPhone_banquentBill').numberbox({
    validType: 'mobilephone',
    invalidMessage: "手机号码格式不正确！",
    delay: 1000,
    tipPosition: 'top',
    validateOnCreate: false,
    validateOnBlur: true
  });
  //宾客姓名
  $('#guestName_banquentBill').textbox({});
  //备注
  $('#remark_banquentBill').textbox({
    //multiline:true,
    validateOnCreate: false,
    validateOnBlur: true,
    validType: 'maxLength[10]',
    invalidMessage: "最多输入10个字符！",
    delay: 1000
  });
  //简讯
  $('#briefInfo_banquentBill').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    data: [],
    columns: [[
      { field: 'banquetReceptionId', title: 'banquetReceptionId', width: 20, align: 'center', hidden: true },
      { field: 'banquetRestaurantId', title: 'banquetRestaurantId', width: 20, align: 'center', hidden: true },
      { field: 'channelId', title: 'channelId', width: 20, align: 'center', hidden: true },
      { field: 'createUserId', title: 'createUserId', width: 20, align: 'center', hidden: true },
      { field: 'createUserName', title: 'createUserName', width: 20, align: 'center', hidden: true },
      { field: 'hotelId', title: 'hotelId', width: 20, align: 'center', hidden: true },
      { field: 'modifyTime', title: 'modifyTime', width: 20, align: 'center', hidden: true },
      { field: 'modifyUserId', title: 'modifyUserId', width: 20, align: 'center', hidden: true },
      { field: 'dBendTime', title: 'dBendTime', width: 20, align: 'center', hidden: true },
      { field: 'amount', title: 'amount', width: 20, align: 'center', hidden: true },
      { field: 'isCheckout', title: 'isCheckout', width: 20, align: 'center', hidden: true },

      { field: 'guestName', title: '宾客姓名', width: 20, align: 'center' },
      { field: 'guestPhone', title: '宾客手机号', width: 20, align: 'center' },
      { field: 'channelName', title: '客源', width: 20, align: 'center' },
      { field: 'banquetRestaurantName', title: '餐厅', width: 20, align: 'center' },
      { field: 'peopleNumber', title: '用餐人数', width: 10, align: 'center' },
      { field: 'createTime', title: '开单时间', width: 20, align: 'center' },
      { field: 'endTime', title: '结账时间', width: 20, align: 'center' },
      {
        field: 'state', title: '账单状态', width: 15, align: 'center',
        formatter: function (value, row, index) {
          return value == 1 ? "未结账" : "已结账";
        }
      },
      { field: 'remark', title: '备注', width: 40, align: 'center' }
    ]]
  });

  //明细
  $('#detail_banquentBill').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
    onLoadSuccess: function () {
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
    },
    onClickRow: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag_banquentBill == 2) {
        onlySelectedOneRowFlag_banquentBill = 0;
        return;
      } else {
        onlySelectedOneRowFlag_banquentBill = 1;
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
        rowSelect_banquentBill = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_banquentBill = null;
      }
      onlySelectedOneRowFlag_banquentBill = 0;
    },
    onCheck: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag_banquentBill == 2) {
        return;
      }
      if (onlySelectedOneRowFlag_banquentBill == 1) {
        onlySelectedOneRowFlag_banquentBill = 0;
        return;
      } else {
        onlySelectedOneRowFlag_banquentBill = 2;
      }
      if (rowData != rowSelect_banquentBill) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_banquentBill = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_banquentBill = null;
      }
      onlySelectedOneRowFlag_banquentBill = 0;
    },
    columns: [[
      { field: 'bqReceptionId', title: 'bqReceptionId', width: 20, align: 'center', hidden: true },
      { field: 'bqPaymentId', title: 'bqPaymentId', width: 20, align: 'center', hidden: true },//支付id，当类型为支付时，该参数为必含参数	
      { field: 'bqConsumeId', title: 'bqConsumeId', width: 20, align: 'center', hidden: true },//消费id，当类型为消费时，该参数为必含参数	
      { field: 'isLock', title: 'isLock', width: 20, align: 'center', hidden: true },//帐页是否锁定 0不锁 1锁

      { field: 'ck', title: '', checkbox: true },
      {
        field: 'bqDetailType', title: '分类', width: 10, align: 'center',//明细类型 1支付 2消费
        formatter(value, row, index) {
          if (value == 1) {
            return "支付";
          } else if (value == 2) {
            return "消费";
          } else if (value == 3) {
            return "签单";
          } else if (value == 4) {
            return "坏账";
          } else if (value == 5) {
            return "免单";
          } else if (value == 6 || value == 7) {
            return "转移";
          } else {
            return value;
          }
        }
      },
      {
        field: 'bqHappenTime', title: '日期时间', width: 25, align: 'center',
        formatter(value, row, index) {
          return getDateNoSS(value);
        }
      },
      {
        field: 'bqFolio', title: '账页', width: 10, align: 'center',
        formatter: function (value, row, index) {
          return row.isLock && row.isLock == 1 ? value + "*" : value
        }
      },
      { field: 'bqContent', title: '内容', width: 40, align: 'center' },
      {
        field: 'bqDetailNumber', title: '数量', width: 10, align: 'center',//数量，类型为支付时，该参数为-1
        formatter(value, row, index) {
          return row.bqDetailType != -1 && value != -123456 ? value : "--";
        }
      },
      {
        field: 'bqSalePrice', title: '单价', width: 15, align: 'center',//单价，类型为支付时，该参数为-1
        formatter(value, row, index) {
          return value == -123456 ? "--" : NP.divide(value, 100)
        }
      },
      {
        field: 'bqAmount', title: '金额', width: 15, align: 'center',
        formatter(value, row, index) {
          if (row.bqDetailType === 1 || row.bqDetailType === 3 || row.bqDetailType === 4 ||
            row.bqDetailType === 5 || row.bqDetailType === 6) {
            return value === -123456 ? "--" : NP.divide(value, -100);
          }
          return value === -123456 ? "--" : NP.divide(value, 100);
        }
      }
    ]]
  });
  //搜索
  $('#search_banquentBill').on('click', function () {
    if (!$('#guestPhone_banquentBill').numberbox('isValid')) {
      $('#guestPhone_banquentBill').numberbox('textbox').focus();
      return;
    }
    if (!$('#remark_banquentBill').numberbox('isValid')) {
      $('#remark_banquentBill').numberbox('textbox').focus();
      return;
    }
    let checkedItem = $('input[name="selectedBill_banquet"]:checked').val();
    let time = checkedItem == 1 ? "" : getTimeForTodayStart(new Date().getTime());//"2017-9-21 00:00:00";//
    let submitData = {
      banquetRestaurantId: 1 * $('#restaurant_banquentBill').combobox('getValue'),
      receptionState: 1 * checkedItem,/*账单状态 0全部  1正在使用   2已结账*/
      receptionCreatTime: time,/*订单创建时间*/
      guestPhone: $('#guestPhone_banquentBill').numberbox('getValue'),/*宾客手机号*/
      guestName: $('#guestName_banquentBill').textbox('getValue'),/*宾客姓名*/
      remark: $('#remark_banquentBill').textbox('getValue'),/*备注*/
      offset: 0,
      limit: 9999999
    };
    console.info(submitData);
    eapor.utils.defaultAjax('../banquetBill/listBanquetReception', submitData, searchCallback);
  });
  //搜索callbackFun
  function searchCallback(data) {
    if (eapor.utils.ajaxCallBackErrInfo(data)) {
      return;
    }
    if (!data.length) {
      $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    let onlySelectedOneRowFlag_banquentBill = 0,
      rowSelect_banquentBill = null;

    $('#showSearchResultDialog').append(`
				<div id="searchResult_banquetBill">
					<table id="table_serchResult"></table>
				</div>
		`);
    dialog = $('#searchResult_banquetBill');
    let table = $('#table_serchResult');
    $('#table_serchResult').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      loadMsg: "loading....",
      singleSelect: true,
      fit: true,
      rownumbers: true,
      data: data,
      checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
      onLoadSuccess: function () {
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      onClickRow: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag_banquentBill == 2) {
          onlySelectedOneRowFlag_banquentBill = 0;
          return;
        } else {
          onlySelectedOneRowFlag_banquentBill = 1;
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
          rowSelect_banquentBill = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_banquentBill = null;
        }
        onlySelectedOneRowFlag_banquentBill = 0;
      },
      onCheck: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag_banquentBill == 2) {
          return;
        }
        if (onlySelectedOneRowFlag_banquentBill == 1) {
          onlySelectedOneRowFlag_banquentBill = 0;
          return;
        } else {
          onlySelectedOneRowFlag_banquentBill = 2;
        }
        if (rowData != rowSelect_banquentBill) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_banquentBill = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_banquentBill = null;
        }
        onlySelectedOneRowFlag_banquentBill = 0;
      },
      columns: [[{ field: 'ck', title: '', checkbox: true },
      { field: 'banquetReceptionId', title: 'banquetReceptionId', width: 20, align: 'center', hidden: true },
      { field: 'banquetRestaurantId', title: 'banquetRestaurantId', width: 20, align: 'center', hidden: true },
      { field: 'channelId', title: 'channelId', width: 20, align: 'center', hidden: true },
      { field: 'createUserId', title: 'createUserId', width: 20, align: 'center', hidden: true },
      { field: 'createUserName', title: 'createUserName', width: 20, align: 'center', hidden: true },
      { field: 'hotelId', title: 'hotelId', width: 20, align: 'center', hidden: true },
      { field: 'modifyTime', title: 'modifyTime', width: 20, align: 'center', hidden: true },
      { field: 'modifyUserId', title: 'modifyUserId', width: 20, align: 'center', hidden: true },
      { field: 'dBendTime', title: 'dBendTime', width: 20, align: 'center', hidden: true },
      { field: 'amount', title: 'amount', width: 20, align: 'center', hidden: true },

      { field: 'guestName', title: '宾客姓名', width: 20, align: 'center' },
      { field: 'guestPhone', title: '宾客手机号', width: 20, align: 'center' },
      { field: 'channelName', title: '客源', width: 20, align: 'center' },
      { field: 'banquetRestaurantName', title: '餐厅', width: 20, align: 'center' },
      { field: 'peopleNumber', title: '用餐人数', width: 20, align: 'center' },
      { field: 'createTime', title: '开单时间', width: 35, align: 'center' },
      { field: 'endTime', title: '结账时间', width: 35, align: 'center' },
      {
        field: 'state', title: '账单状态', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return value == 1 ? "正在使用" : "已结账";
        }
      },
      { field: 'remark', title: '备注', width: 20, align: 'center' },
      ]]
    });
    dialog.dialog({
      title: '搜索结果',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          let selected = table.datagrid('getSelected');
          if (!selected) {
            $.messager.show({ title: '系统提示', msg: '请先选择一项账单信息！', timeout: 3000, showType: 'slide' });
            return;
          }
          eapor.utils.defaultAjax(
            '../banquetBill/getBanquetReceptionLettersById',
            { banquetReceptionId: selected.banquetReceptionId },
            showShortSummaryInfo
          );
          eapor.utils.defaultAjax(
            '../banquetBill/listBanquetReceptionDetail',
            { banquetReceptionId: selected.banquetReceptionId },
            showDetailInfo
          );
          getPageNumList(selected.banquetReceptionId);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  }
  //根据账单id 刷新简讯 汇总 明细 信息
  function refreshInfo(_banquetReceptionId) {
    if (!_banquetReceptionId) {
      return;
    }
    eapor.utils.defaultAjax(
      '../banquetBill/getBanquetReceptionLettersById',
      { banquetReceptionId: _banquetReceptionId },
      showShortSummaryInfo
    );
    eapor.utils.defaultAjax(
      '../banquetBill/listBanquetReceptionDetail',
      { banquetReceptionId: _banquetReceptionId },
      showDetailInfo
    );
    getPageNumList(_banquetReceptionId);
  }
  //根据账单id查询简讯、汇总信息
  function showShortSummaryInfo(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    _banquetReceptionId = result.pbr.banquetReceptionId;
    console.info(dialog);
    if (dialog) {
      try {
        dialog.dialog('close');
      } catch (err) {
        //console.info(err);
      }
    }
    $('#briefInfo_banquentBill').datagrid('loadData', [result.pbr]);
    //balance
    $('#balance_banquentBill').text((NP.minus(NP.plus(NP.minus(NP.minus(NP.minus(NP.minus(NP.plus(NP.divide(result.banquetAmount, 100),
      NP.divide(result.otherAmount, 100)), NP.divide(result.payAmount, 100)), NP.divide(result.sign, 100)),
      NP.divide(result.free, 100)), NP.divide(result.debt, 100)), NP.divide(result.transferIn, 100)),
      NP.divide(result.transferOut, 100))).toFixed(2) + "元");
    $('#banquentPrice_banquentBill').text(NP.divide(result.banquetAmount, 100) + "元");//餐费
    $('#consumeAmount_banquentBill').text(NP.divide(result.otherAmount, 100) + "元");//其他消费
    $('#getAmountFromGuestOrToAmount_banquentBill').text(NP.divide(result.payAmount, -100) + "元");//收款

    //$('#credit_banquentBill').text(result.payAmount);//信用参考

    result.sign ? $('#signup_li_banquentBill').show() : $('#signup_li_banquentBill').hide();
    $('#signupAmountResult_banquentBill').text(NP.divide(result.sign, -100) + "元");//签单

    result.debt ? $('#bad_li_banquentBill').show() : $('#bad_li_banquentBill').hide();
    $('#badAmountResult_banquentBill').text(NP.divide(result.debt, -100) + "元");//坏账

    result.free ? $('#free_li_banquentBill').show() : $('#free_li_banquentBill').hide();
    $('#freeAmountResult_banquentBill').text(NP.divide(result.free, -100) + "元");//免单

    (result.transferOut - result.transferIn) ? $('#transfer_li_banquentBill').show() : $('#transfer_li_banquentBill').hide();
    $('#transferAmountResult_banquentBill').text(NP.divide(NP.minus(result.transferIn, result.transferOut), 100) + "元");//转出转入

    //信用参考
    if (result.credit > 0) {
      let cname = "";
      if (result.creditName) {
        cname = "（" + result.creditName + "）";
      }
      $('#credit_banquentBill').html(NP.divide(result.credit, 100) + "元" + cname);
    } else {
      $('#credit_banquentBill').html("");
    }
  }

  //根据账单id查询明细信息
  function showDetailInfo(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    getBanquetBillNumberPageDetailsInfo = result;
    $('#detail_banquentBill').datagrid('loadData', result);
  }
  function isOverBill(_banquetReceptionId) {
    if (!_banquetReceptionId) {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 3000, showType: 'slide' });
      return false;
    }
    const state = $('#briefInfo_banquentBill').datagrid('getRows')[0].state;
    console.info(state);
    if (state == 1) {//判断账单是否关闭
      $.messager.show({ title: '系统提示', msg: '操作无效！该账单未结账！', timeout: 3000 });
      return false;
    }
    if (state == 3) {//判断账单是否关闭
      $.messager.show({ title: '系统提示', msg: '操作无效！该账单已审核！', timeout: 3000 });
      return false;
    }
    return true;
  }
  function isUnOverBill(_banquetReceptionId) {
    if (!_banquetReceptionId) {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 3000, showType: 'slide' });
      return false;
    }
    const state = $('#briefInfo_banquentBill').datagrid('getRows')[0].state;
    console.info(state);
    if (state == 2) {//判断账单是否关闭
      $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 3000 });
      return false;
    }
    if (state == 3) {//判断账单是否关闭
      $.messager.show({ title: '系统提示', msg: '该账单已审核！', timeout: 3000 });
      return false;
    }
    return true;
  }
  //导航功能
  //打印回调fun
  function printSmallCallBack(result) {
    console.info(result);
    const type = 'Small';
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#hotelName_printBanquetBill' + type).text(result.hotelName);
    $('#printTime_printBanquetBill' + type).text(result.printTime);
    $('#guestName_printBanquetBill' + type).text(result.guestName);
    $('#enterTime_printBanquetBill' + type).text(result.createTime);
    $('#phone_printBanquetBill' + type).text(result.guestPhone);
    $('#leaveTime_printBanquetBill' + type).text(result.checkoutTime ? result.checkoutTime : "");
    $('#channelName_printBanquetBill' + type).text(result.channelName);
    $('#restaurantName_printBanquetBill' + type).text(result.bqRestaurantName);
    $('#receptionCode_printBanquetBill' + type).text(result.bqReceptionCode);
    $('#peopleNumber_printBanquetBill' + type).text(result.peopleNumber);

    $('#pay_printBanquetBill' + type).text(result.payAmount);
    $('#consume_printBanquetBill' + type).text(result.consumeAmount);
    $('#bill_printBanquetBill' + type).text(result.signAmount);
    $('#printBalance_printBanquetBill' + type).text(result.balance);
    $('#handler_printBanquetBill' + type).text(result.userName);

    const ul = $('#details_printBanquetBill' + type);
    ul.empty();
    if (result.pbrds.length > 0) {
      let lock = "",
        numPrice = "";
      const arr = result.pbrds;
      arr.forEach(function (item, key, obj) {
        item.isLock ? lock = "*" : "";
        item.bqDetailNumber == -123456 || item.bqSalePrice == -123456 ? numPrice = "--" :
          numPrice = (item.bqDetailNumber + '*' + NP.divide(item.bqSalePrice, 100));
        ul.append(`<li style="width:50%;text-align:center;border-bottom:1px solid #000;list-style:none;display:inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.bqContent}</li><li style="width:30%;text-align:center;border-bottom:1px solid #000;list-style:none;display:inline-block;">&nbsp;${numPrice}</li><li style="width:20%;text-align:left;border-bottom:1px solid #000;list-style:none;display:inline-block;">${NP.divide(item.bqAmount, 100)}</li>`);
      });
      ul.show();
    } else {
      ul.hide();
    }
    $("div#banquetBillPrintSmall").printArea({ popTitle: '餐宴账单' + getDate(new Date()), mode: 'popup' });
  }
  //打印回调fun
  function printCallBack(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#hotelName_printBanquetBill').text(result.hotelName);
    $('#printTime_printBanquetBill').text(result.printTime);
    $('#guestName_printBanquetBill').text(result.guestName);
    $('#enterTime_printBanquetBill').text(result.createTime);
    $('#phone_printBanquetBill').text(result.guestPhone);
    $('#leaveTime_printBanquetBill').text(result.checkoutTime ? result.checkoutTime : "");
    $('#channelName_printBanquetBill').text(result.channelName);
    $('#restaurantName_printBanquetBill').text(result.bqRestaurantName);
    $('#receptionCode_printBanquetBill').text(result.bqReceptionCode);
    $('#peopleNumber_printBanquetBill').text(result.peopleNumber);

    $('#pay_printBanquetBill').text(result.payAmount);
    $('#consume_printBanquetBill').text(result.consumeAmount);
    $('#bill_printBanquetBill').text(result.signAmount);
    $('#printBalance_printBanquetBill').text(result.balance);
    $('#handler_printBanquetBill').text(result.userName);

    const ul = $('#details_printBanquetBill');
    ul.empty();
    if (result.pbrds.length > 0) {
      let lock = "",
        numPrice = "";
      const arr = result.pbrds;
      arr.forEach(function (item, key, obj) {
        item.isLock ? lock = "*" : "";
        item.bqDetailNumber == -123456 || item.bqSalePrice == -123456 ? numPrice = "--" :
          numPrice = (item.bqDetailNumber + '*' + NP.divide(item.bqSalePrice, 100));
        ul.append(`
					<li style="width: 27%;float:left;border-bottom:1px solid #000;" >
						${getDateNoSS(item.bqHappenTime)}
						</li><li style="width: 5%;float:left;text-align:center;border-bottom:1px solid #000;">
						${item.bqFolio + lock}
						</li><li style="width: 42%;text-align:center;float:left;border-bottom:1px solid #000;">
						${item.bqContent}
						</li><li style="width:14%;float:left;text-align:center;border-bottom:1px solid #000;">
						${numPrice}
						</li><li style="width: 10%;float:left;text-align:center;border-bottom:1px solid #000;">
						${NP.divide(item.bqAmount, 100)}
						</li>
				`);
      });
      ul.show();
    } else {
      ul.hide();
    }
    $("div#banquetBillPrint").printArea({ popTitle: '餐宴账单' + getDate(new Date()), mode: 'popup' });
  }
  //打印
  $('#printBtn_banquentBill').on('click', function () {
    if (!_banquetReceptionId) {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 3000, showType: 'slide' });
      return false;
    }
    let bqReceptionFolio = $('#selectReceptionPageNumber_banquetBill').combobox('getValue');
    bqReceptionFolio == "全部" || bqReceptionFolio == "0" ? bqReceptionFolio = 0 :
      bqReceptionFolio = bqReceptionFolio;

    console.info(bqReceptionFolio);
    $('#showAddDialog').append(`
			<div id="div" style="padding:20px 0 0 30px;">
				<label>请选择打印类型模板：<input id="selectPrintType_banquetBill" style="width:130px;"/></label>
			</div>
		`);
    $('#selectPrintType_banquetBill').combobox({
      editable: false,
      valueField: 'id',
      textField: 'text',
      data: [{
        "id": 1,
        "text": "非小票纸张类型",
        "selected": true
      }, {
        "id": 2,
        "text": "小票纸张类型"
      }],
      panelHeight: 'auto',
      maxPanelHeight: 200
    });
    const dialog = $('#div');
    dialog.dialog({
      title: '选择打印类型模板',
      width: 330,
      height: 150,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler: function () {
            const type = $('#selectPrintType_banquetBill').combobox('getValue');
            console.info(type);
            if (+type === 1) {
              eapor.utils.defaultAjax('../banquetBill/printBqReception',
                { bqReceptionId: _banquetReceptionId, bqReceptionFolio }, printCallBack);
              dialog.dialog('close');
            } else if (+type === 2) {
              eapor.utils.defaultAjax('../banquetBill/printBqReception',
                { bqReceptionId: _banquetReceptionId, bqReceptionFolio }, printSmallCallBack);
              dialog.dialog('close');
            }
          }
        }, {
          text: '取消',
          handler: function () {
            dialog.dialog('close');
          }
        }]
    });
  });
  //撤销结账
  $('#cancelGetBill_banquentBill').on('click', function () {
    if (!isOverBill(_banquetReceptionId)) {
      return;
    }
    $.messager.confirm('系统提示', '您确认要进行撤销结账操作吗？', function (r) {
      if (r) {
        function getBillCallBack(result) {
          console.info(result);
          if (result > 0) {
            $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
            //刷新...
            eapor.utils.defaultAjax('../banquetBill/getBanquetReceptionLettersById',
              { banquetReceptionId: _banquetReceptionId },
              showShortSummaryInfo);
            return;
          }
          $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
        }
        eapor.utils.defaultAjax('../banquetBill/cancelCheckOut',
          { bqReceptionId: _banquetReceptionId }, getBillCallBack);
      }
    });
  });
  //结账
  $('#getBill_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    $.messager.confirm('系统提示', '您确认要进行结账操作吗？', function (r) {
      if (r) {
        const banquetRestaurantId = $('#briefInfo_banquentBill').datagrid('getRows')[0].banquetRestaurantId;
        const isCheckout = $('#briefInfo_banquentBill').datagrid('getRows')[0].isCheckout;
        function getBillCallBack(result) {
          console.info(result);
          //		    		-1：该账单不存在
          //		    		-2：该账单金额不平，不能结账
          //		    		-3：更新餐厅会馆状态失败
          if (result > 0) {
            $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
            //刷新 账单里的数据
            eapor.utils.defaultAjax('../banquetBill/getBanquetReceptionLettersById',
              { banquetReceptionId: _banquetReceptionId },
              showShortSummaryInfo);
            //isCheckout 是否操作过反结账  0否 1是
            if (!isCheckout) {//没操作过反结账的账单 才刷新餐宴图 
              eapor.utils.banquetChart_successRefreshType(banquetRestaurantId);
            }
            return;
          }
          if (result == -1) {
            $.messager.show({ title: '系统提示', msg: '操作失败！该账单不存在！', timeout: 3000 });
            return;
          }
          if (result == -2) {
            $.messager.show({ title: '系统提示', msg: '操作失败！Balance未归0！', timeout: 3000 });
            return;
          }
          if (result == -3) {
            $.messager.show({ title: '系统提示', msg: '操作失败！更新餐厅会馆状态失败！', timeout: 3000 });
            return;
          }
          $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
        }

        eapor.utils.defaultAjax('../banquetBill/checkOutBqReception',
          { bqReceptionId: _banquetReceptionId }, getBillCallBack);
      }
    });
  });
  //
  function cancelCallBack(result) {
    console.info(result);
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
      //刷新
      refreshInfo(_banquetReceptionId);
      return;
    }
    if (result == -3) {
      $.messager.show({ title: '系统提示', msg: '该帐页下无消费项！', timeout: 3000 });
      return;
    }
    $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
  }
  //撤销
  $('#cancelBtn_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    if (!$('#detail_banquentBill').length) {
      console.info(5);
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到消费项！', timeout: 3000 });
      return;
    }
    const datagrid = $('#detail_banquentBill').datagrid('getData');
    console.info(datagrid);
    console.info(datagrid.length);
    if (!datagrid.rows.length) {
      console.info(51);
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到消费项！', timeout: 3000 });
      return;
    }
    const [rows, total] = [datagrid.rows, datagrid.total];
    if (total < 1) {
      console.info(52);
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到消费项！', timeout: 3000 });
      return;
    }
    let flag = false;
    for (let i = 1; i < total; i++) {
      if (rows[0].bqFolio != rows[i].bqFolio) {
        flag = true;
        break;
      }
    }
    if (flag) {
      $.messager.show({ title: '系统提示', msg: '请先单独显示要撤销的账页！', timeout: 3000 });
      return;
    }
    const bqDetailType_ = rows[total - 1].bqDetailType;
    const bqDetailType = rows[0].bqDetailType;
    let flag1 = 0;
    for (let i = 1; i < total; i++) {
      if (rows[i].money < 0) {
        if (rows[i].type == 3) {
          flag1 = '操作无效！含有撤销签单项！';
        }
        if (rows[i].type == 4) {
          flag1 = '操作无效！含有撤销坏账项！';
        }
        if (rows[i].type == 5) {
          flag1 = '操作无效！含有撤销免单项！';
        }
      }
    }
    if (flag1) {
      return $.messager.show({ title: '系统提示', msg: flag1, timeout: 3000 });
    }
    if (bqDetailType == 5 || bqDetailType_ == 5) {//免单撤销
      eapor.utils.defaultAjax('../banquetBill/bqCancelFree', {
        banquetReceptionId: _banquetReceptionId, banquetReceptionFolio: rows[total - 1].bqFolio,
        scene: "免单撤销"
      }, cancelCallBack);
    } else if (bqDetailType == 4 || bqDetailType_ == 4) {//坏账撤销
      eapor.utils.defaultAjax('../banquetBill/bqCancelDebt', {
        banquetReceptionId: _banquetReceptionId, banquetReceptionFolio: rows[total - 1].bqFolio,
        scene: "坏账撤销"
      }, cancelCallBack);
    } else if (bqDetailType == 3 || bqDetailType_ == 3) {//签单撤销
      eapor.utils.defaultAjax('../banquetBill/bqCancelSign', {
        banquetReceptionId: _banquetReceptionId, banquetReceptionFolio: rows[total - 1].bqFolio,
        scene: "签单撤销"
      }, cancelCallBack);
    } else {
      $.messager.show({ title: '系统提示', msg: '无效的操作！', timeout: 3000 });
    }
  });
  //编辑简讯
  $('#editShortInfo_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    const shortInfo = $('#briefInfo_banquentBill').datagrid('getRows')[0];
    $('#showAddDialog').append(
      `<div id="editBillDialog" style="padding:25px 0 0 35px;">
					<div style="margin-bottom:10px">
						<input id="guestName"  style="width:200px;" autofocus="autofocus"
							label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
					<div style="margin-bottom:0px">
						<input id="remark"  style="width:200px;"
							label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
				</div>`
    );
    $('#guestName').textbox({});
    $('#guestName').textbox('setValue', shortInfo.guestName);

    $('#remark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      delay: 1000
    });
    $('#remark').textbox('setValue', shortInfo.remark);
    const dialog = $('#editBillDialog');
    dialog.dialog({
      title: '编辑简讯',
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
          if (!$('#remark').textbox('isValid')) {
            $('#remark').textbox('textbox').focus();
            return;
          }
          const submitData = {
            banquetReceptionId: shortInfo.banquetReceptionId,
            guestName: $('#guestName').textbox('getValue'),
            remark: $('#remark').textbox('getValue')
          };
          function editShortInfoCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
              dialog.dialog('close');
              //刷新...
              eapor.utils.defaultAjax(
                '../banquetBill/getBanquetReceptionLettersById',
                { banquetReceptionId: shortInfo.banquetReceptionId },
                showShortSummaryInfo);
              //刷新餐宴图 数据
              eapor.utils.banquetChart_successRefreshType(shortInfo.banquetRestaurantId);
              return;
            }
            $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
          }
          console.info(submitData);
          eapor.utils.defaultAjax("../banquetBill/updateBqReceptionLetters", submitData, editShortInfoCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  //坏账
  $('#badBillBtn_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
		/*if($('#detail_banquentBill').datagrid('getRows').length < 1){
			$.messager.show({title:'系统提示',msg:'操作无效！未查询到明细项！',timeout:3000});
			return;
		}*/
    $('#showAddDialog').append(
      `<div style="padding:15px 0 0 25px;" id="badBillDialog">
				<div style="margin-bottom:20px">
					<input id="badAmount"  style="width:210px;" labelWidth="80" autofocus="autofocus"
						label="<span style='color:red;'>*</span>坏账金额：" labelPosition="before" labelAlign="right"/>
				</div>
				<div>
					<input id="badBillRemark"  style="width:210px;"
						label="备注：" labelPosition="before" labelAlign="right" labelWidth="80"/>
				</div>
			</div>`
    );
    $('#badAmount').textbox({
      required: true,
      missingMessage: "金额不能为空！",
      validType: ['numMaxTwoDecimal', 'notZero'],
      invalidMessage: "请输入大于0的数字，最多2位小数",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      delay: 1000
    });
    $('#badBillRemark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      delay: 1000
    });
    const dialog = $('#badBillDialog');
    dialog.dialog({
      title: '坏账设置',
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
          if (!$('#badAmount').textbox('isValid')) {
            $('#badAmount').textbox('textbox').focus();
            return;
          }
          if (!$('#badBillRemark').textbox('isValid')) {
            $('#badBillRemark').textbox('textbox').focus();
            return;
          }
          const amount = $('#badAmount').textbox('getValue');
          if (!amount || amount < 0) {
            $.messager.show({ title: '系统提示', msg: '操作失败！金额需大于0！', timeout: 3000 });
            return;
          }
          const submitData = {
            banquetReceptionId: _banquetReceptionId,//餐宴账单id
            payAmount: (amount * 100).toFixed(0),	//金额
            remark: $('#badBillRemark').textbox('getValue'),	//支付项备注
            scene: "坏账"
          };
          function badBillCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
              dialog.dialog('close');
              //刷新...
              refreshInfo(_banquetReceptionId);
              return;
            }
            if (result == -8) {
              $.messager.show({ title: '系统提示', msg: '操作失败！账页不能包含支付项！', timeout: 3000, showType: 'slide' });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
          }
          eapor.utils.defaultAjax("../banquetBill/bqDebt", submitData, badBillCallBack);
        }
      }, {
        text: '取消',
        handler() {
          dialog.dialog('close');
        }
      }]
    });
  });
  //转出
  $('#turnout_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    if ($('#detail_banquentBill').datagrid('getRows').length < 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到明细项！', timeout: 3000 });
      return;
    }
    const datagrid = $('#detail_banquentBill').datagrid('getData');
    const [rows, total] = [datagrid.rows, datagrid.total];
    const rows_folio = rows[0].bqFolio;
    //总签单金额
    let flag = false;
    for (let i = 0; i < total; i++) {
      if (rows[i].bqDetailType != 2 && rows[i].bqDetailType != 7) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '转出项请先通过账页划分单独显示！', timeout: 4000, height: 'auto' });
        break;
      }
			/*if(rows[i].bqDetailType === 6){
				flag = true;
				$.messager.show({title:'系统提示',msg:'转入项不可再转出！',timeout:4000,height:'auto'});
				break;
			}*/
      if (rows[i].bqDetailNumber < 1) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '转出项请先通过账页划分单独显示！不能包含退单项！', timeout: 4000, height: 'auto' });
        break;
      }
      if (rows[i].isLock == 1) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '转出项请先通过账页划分单独显示！不能包含已锁项！', timeout: 4000, height: 'auto' });
        break;
      }
    }
    if (flag) {
      return;
    }

    const submitData = {
      receptionState: 1,
      receptionType: 0,
      createDate: '',
      checkoutDate: ''
    };
    console.info(submitData);
    eapor.utils.defaultAjax('../banquetBill/listAllReception', submitData, transferSearchCallback);

    function transferSearchCallback(data) {
      console.info(data);
      let onlySelectedOneRowFlag_banquentBill = 0,
        rowSelect_banquentBill = null;

      $('#showSearchResultDialog').append(`
					<div id="searchResult_banquetBill">
						<table id="table_serchResult"></table>
					</div>
			`);
      dialog = $('#searchResult_banquetBill');
      let table = $('#table_serchResult');
      $('#table_serchResult').datagrid({
        title: '', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        singleSelect: true,
        fit: true,
        rownumbers: true,
        data: data,
        checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
        onLoadSuccess: function () {
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
        },
        onClickRow: function (rowIndex, rowData) {
          if (onlySelectedOneRowFlag_banquentBill == 2) {
            onlySelectedOneRowFlag_banquentBill = 0;
            return;
          } else {
            onlySelectedOneRowFlag_banquentBill = 1;
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
            rowSelect_banquentBill = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_banquentBill = null;
          }
          onlySelectedOneRowFlag_banquentBill = 0;
        },
        onCheck: function (rowIndex, rowData) {
          if (onlySelectedOneRowFlag_banquentBill == 2) {
            return;
          }
          if (onlySelectedOneRowFlag_banquentBill == 1) {
            onlySelectedOneRowFlag_banquentBill = 0;
            return;
          } else {
            onlySelectedOneRowFlag_banquentBill = 2;
          }
          if (rowData != rowSelect_banquentBill) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_banquentBill = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_banquentBill = null;
          }
          onlySelectedOneRowFlag_banquentBill = 0;
        },
        columns: [[{ field: 'ck', title: '', checkbox: true },
        { field: 'receptionId', title: 'receptionId', width: 20, align: 'center', hidden: true },
        { field: 'receptionType', title: 'receptionType', width: 20, align: 'center', hidden: true },

        {
          field: 'nickName', title: '宾客姓名', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'phone', title: '宾客手机号', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'channelName', title: '客源', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'roomTypeName', title: '房间类型', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'roomName', title: '房号', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'banquetName', title: '餐厅', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'useNumber', title: '用餐人数', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        },
        {
          field: 'receptionState', title: '账单状态', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value == 1 ? "未结账" : "已结账";
          }
        },
        {
          field: 'remark', title: '备注', width: 20, align: 'center',
          formatter: function (value, row, index) {
            return value ? value : '--';
          }
        }
        ]]
      });
      dialog.dialog({
        title: '搜索结果',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            let selected = table.datagrid('getSelected');
            console.info(selected);
            if (!selected) {
              $.messager.show({ title: '系统提示', msg: '请先选择一项账单信息！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (selected.receptionId == _banquetReceptionId && selected.receptionType != 1) {
              $.messager.show({ title: '系统提示', msg: '转入方与转出方不可相同！', timeout: 3000, showType: 'slide' });
              return;
            }
            const submitData = {
              outReceptionId: _banquetReceptionId,
              receptionPageNumber: $('#selectReceptionPageNumber_banquetBill').combobox('getValue') == "" ||
                $('#selectReceptionPageNumber_banquetBill').combobox('getValue') == "全部" ? 1 :
                $('#selectReceptionPageNumber_banquetBill').combobox('getValue'),
              inReceptionId: selected.receptionId,
              intinrtype: selected.receptionType,//转入方账单的receptionType
              intoutrtype: 3//转出方账单的receptionType
            };
            function turnoutCallBack(result) {
              console.info(result);
              if (result == -1) {
                $.messager.show({ title: '系统提示', msg: '操作失败！消费项目不存在！', timeout: 4000, height: 'auto' });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 4000, height: 'auto' });
                dialog.dialog('close');
                //刷新。。。
                refreshInfo(_banquetReceptionId);
                return;
              }
              $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 4000, height: 'auto' });
            }
            console.info(submitData);
            eapor.utils.defaultAjax('../reception/transferConsume', submitData, turnoutCallBack);
          }
        }, {
          text: '取消',
          handler: function () {
            dialog.dialog('close');
          }
        }]
      });
    }
  });
  //免单 
  $('#freeConsumeBtn_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    if ($('#detail_banquentBill').datagrid('getRows').length < 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到明细项！', timeout: 3000 });
      return;
    }
    const datagrid = $('#detail_banquentBill').datagrid('getData');
    const [rows, total] = [datagrid.rows, datagrid.total];
    const rows_folio = rows[0].bqFolio;
    //总签单金额
    let flag = false;
    for (let i = 0; i < total; i++) {
      if (rows[i].bqDetailType != 2 && rows[i].bqDetailType != 7) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '免单项请先通过账页划分单独显示！', timeout: 4000, height: 'auto' });
        break;
      }
      if (rows[i].bqDetailNumber < 1) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '免单项请先通过账页划分单独显示！不能包含退单项！', timeout: 4000, height: 'auto' });
        break;
      }
      if (rows[i].isLock == 1) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '免单项请先通过账页划分单独显示！不能包含已锁项！', timeout: 4000, height: 'auto' });
        break;
      }
			/*if(rows[i].bqDetailType == 6 && rows[i].isLock == 0){
				flag = true;
				$.messager.show({title:'系统提示',msg:'转入项不可免单！',timeout:4000,height:'auto'});
				break;
			}*/
    }
    if (flag) {
      return;
    }
    $.messager.prompt('系统提示', '您确定要进行免单操作吗？可在此输入免单备注！', function (r) {
      if (typeof (r) === 'string') {//确定按钮
        let submitData = {
          banquetReceptionId: _banquetReceptionId,	//餐宴账单id	是	[long]		
          banquetReceptionFolio: $('#detail_banquentBill').datagrid('getRows')[0].bqFolio,//餐宴账单 帐页	是	[int]		
          remark: r,	//支付项备注		[string]		
          scene: '免单'
        };
        console.info(submitData);
        function freeBillCallBack(result) {
          console.info(result);
          if (result > 0) {
            $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
            //刷新。。。
            refreshInfo(_banquetReceptionId);
            return;
          }
          if (result == -8) {
            $.messager.show({ title: '系统提示', msg: '操作失败！账页不能包含支付项！', timeout: 3000, showType: 'slide' });
            return;
          }
          $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
        }
        eapor.utils.defaultAjax("../banquetBill/bqFree", submitData, freeBillCallBack);
      }
    });
  });

  //签单
  $('#signup_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    if ($('#detail_banquentBill').datagrid('getRows').length < 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到明细项！', timeout: 3000 });
      return;
    }
    const datagrid = $('#detail_banquentBill').datagrid('getData');
    const [rows, total] = [datagrid.rows, datagrid.total];
    const rows_folio = rows[0].bqFolio;
    //循环判断是否为消费，有一个不是type为  则 不能签单
    //总签单金额
    let countMoney = 0;
    let flag = false;
    console.info(rows);
    for (let i = 0; i < total; i++) {
      if ((rows[i].bqDetailType != 2 && rows[i].bqDetailType != 7) || rows[i].bqDetailNumber < 1 || rows[i].isLock == 1) {
        flag = true;
        $.messager.show({ title: '系统提示', msg: '无效操作！请先通过账页划分将消费项单独显示！不能包含退单和已锁账页！', timeout: 4000, height: 'auto' });
        break;
      }
      /*if(rows[i].bqDetailType == 6 && rows[i].isLock == 0){
        flag = true;
        $.messager.show({title:'系统提示',msg:'转入项不可签单！',timeout:4000,height:'auto'});
        break;
      }*/
      countMoney += rows[i].bqAmount;
    }
    if (flag) {
      return;
    }
    $('#showAddDialog').append(
      `<div id="div" style="padding:30px 0 0 30px;">
					<div style="padding:10px 0 0 20px;">
						<span>请选择签单单位：</span>
						<input style="width:130px;"  id="selectChannelForSignup_getBill"/><br/><br/>
						<span id="showAmount">
						签单金额 ￥：<span id="pageAmount_forSignup"></span>
						</span>&nbsp;&nbsp;&nbsp;&nbsp;
						<span id="showBalanceForSignup" style="display:none;">
						信用余额 ￥：<span id="channelBalance_forSignup"></span>
						</span><br/><br/>
						<input id="remark_forSignup" style="width:200px;" label="备注：" labelWidth="70px" labelAlign="right" />
					</div>
				</div>`
    );
    //宾客账单--签单功能--选择签单单位的JS
    $('#selectChannelForSignup_getBill').combobox({
      url: '../channel/listAdvanceChannelPage',
      queryParams: { offset: 0, limit: 9999, channelName: "", sourceGroupId: 0, usageState: 0 },
      valueField: 'channelId',
      textField: 'channelName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (record) {
        $('#channelBalance_forSignup').text(NP.divide(record.creditAvailable, 100));
        $('#showBalanceForSignup').show();

      },
      loadFilter: function (data) {
        //过滤数据
        var value = {
          total: 9999,
          rows: []
        };
        var x = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].creditAvailable > 0) {
            value.rows[x++] = data[i];
          }
        }
        return value.rows;
      }
    });

    $('#pageAmount_forSignup').text(NP.divide(countMoney, 100));
    $('#remark_forSignup').textbox({ multiline: true });
    const dialog = $('#div');
    dialog.dialog({
      title: '签单设置',
      width: 340,
      height: 290,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const creditChannelId = $('#selectChannelForSignup_getBill').combobox('getValue');
          if (!creditChannelId) {
            $.messager.show({ title: '系统提示', msg: '请选择签单单位！', timeout: 3000, showType: 'slide' });
            return;
          }
          const payAmount = $('#pageAmount_forSignup').text();
          const at = $('#channelBalance_forSignup').text();
          if (Number(payAmount) > Number(at)) {
            $.messager.show({ title: '系统提示', msg: '签单金额不能超过余额！', timeout: 3000, showType: 'slide' });
            return;
          }
          const remark = $('#remark_forSignup').textbox('getValue');
          const submitData = {
            payAmount: NP.times(payAmount, 100),
            banquetReceptionId: rows[0].bqReceptionId,
            banquetReceptionFolio: rows[0].bqFolio,
            creditChannelId,
            remark,
            scene: "签单"
          };
          function signupCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
              dialog.dialog('close');
              refreshInfo(rows[0].bqReceptionId);
              return;
            }
            if (result == -3) {
              $.messager.show({ title: '系统提示', msg: '签单失败！该帐页下无消费项！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (result == -4) {
              $.messager.show({ title: '系统提示', msg: '签单失败！签单单位不存在！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (result == -5) {
              $.messager.show({ title: '系统提示', msg: '签单失败！签单单位余额不足！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (result == -8) {
              $.messager.show({ title: '系统提示', msg: '签单失败！账页不能包含支付项！', timeout: 3000, showType: 'slide' });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '签单失败！', timeout: 3000, showType: 'slide' });
          }
          console.info(submitData);
          eapor.utils.defaultAjax('../banquetBill/banquetSign', submitData, signupCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  function chargeBack(selected) {
    console.info(selected);
    $('#showAddDialog').append(`
			<div id="div" style="padding:20px 0 0 30px;">
				<input id="cancelNumber" style="width:200px;"
					label="退单数量：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
		`);
    $('#cancelNumber').numberspinner({
      max: selected.bqDetailNumber,
      min: 1
    });
    $('#cancelNumber').numberspinner('setValue', selected.bqDetailNumber);
    const dialog = $('#div');
    dialog.dialog({
      title: '退单',
      width: 300,
      height: 160,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const number = $('#cancelNumber').numberspinner('getValue');
          if (number < 1 || number > selected.bqDetailNumber) {
            $.messager.show({ title: '系统提示', msg: '退单数量输入有误！', timeout: 3000 });
            return;
          }
          const submitData = {
            number,//退的数量
            bqReceptionDetailId: selected.bqReceptionDetailId,//消费项id
          };
          function chargeBackCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
              dialog.dialog('close');
              //刷新...
              refreshInfo(_banquetReceptionId);
              return;
            }
            $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
          }
          console.info(JSON.stringify([submitData]));
          eapor.utils.defaultAjaxHasContentType('../banquetBill/cancelConsume',
            JSON.stringify([submitData]),
            chargeBackCallBack);

        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  }
  //退单
  $('#cancelDetailsForReception_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    const selected = $('#detail_banquentBill').datagrid('getSelected');
    if (!selected) {
      $.messager.show({ title: '系统提示', msg: '请先选择要退单的消费项！', timeout: 3000, showType: 'slide' });
      return;
    } else {
      if (selected.isLock == 1 || selected.bqDetailNumber < 1) {
        $.messager.show({ title: '系统提示', msg: '该项不可退单！', timeout: 3000, showType: 'slide' });
        return;
      } else {
        chargeBack(selected);
      }
    }
  });
  //编辑账页fun
  function editDetalisPageNumber(selected) {
    console.info(selected);
    eapor.utils.defaultAjax('../banquetBill/getMaxFolioByBqReceptionId', { bqReceptionId: _banquetReceptionId },
      getgetMaxFolioCallBack
    );
    function getgetMaxFolioCallBack(result) {
      console.info(result);
      $('#showAddDialog').append(//根据当前最大账页数限制可以设置的最大账页数【当前最大账页数+1】
        `<div id="editPageNum_banquetBill" style="padding:20px 0 0 30px;">
						<span>请输入修改后的账页号：</span>
						<input style="width:130px;"  id="iptEditPageNumber_banquetBill"/>
					</div>`
      );
      $('#iptEditPageNumber_banquetBill').numberspinner({
        max: Number(result) + Number(1),
        editable: false,
        value: selected.bqFolio,
        onChange(newValue, oldValue) {
          if (newValue == 0) {
            $('#iptEditPageNumber_banquetBill').numberspinner('setValue', Number(result) + Number(1));
          }
        }
      });
      const dialog = $('#editPageNum_banquetBill');
      dialog.dialog({
        title: '修改账页',
        width: 350,
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
            const newPageNumber = $('#iptEditPageNumber_banquetBill').numberspinner('getValue');
            eapor.utils.defaultAjax('../banquetBill/getLockByReceptionId', { bqReceptionId: _banquetReceptionId },
              getLoackPageNumCallBack
            );
            function getLoackPageNumCallBack(result) {
              console.info(result);
              let flag_ = false;
              result.forEach(function (i, k, o) {
                if (newPageNumber == i) {
                  flag_ = true;
                  $.messager.show({ title: '系统提示', msg: '该账页已锁定！请选择其他数字！', timeout: 3000 });
                  return;
                }
              });
              if (flag_) {
                return;
              }
              if (selected.bqDetailType == 1) {//支付
                const data_payment = {
                  bqPaymentId: selected.bqPaymentId,
                  bqFolio: newPageNumber
                };
                eapor.utils.defaultAjax('../banquetBill/updatePaymentFolio', data_payment,
                  editPaymentDetailsPageNumberCallBack);
              } else if ((selected.bqDetailType === 2) || (selected.bqDetailType === 7 && selected.isLock === 0)) {//消费
                const data_consume = {
                  bqReceptionDetailId: selected.bqReceptionDetailId,
                  bqFolio: newPageNumber,
                  detailGenre: selected.detailGenre
                };
                eapor.utils.defaultAjax('../banquetBill/updateReceptionDetailFolio', data_consume,
                  editPaymentDetailsPageNumberCallBack);
              }
            }
            function editPaymentDetailsPageNumberCallBack(result) {
              console.info(result);
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '编辑账页成功！', timeout: 3000 });
                dialog.dialog('close');
                //刷新明细
                eapor.utils.defaultAjax(
                  '../banquetBill/listBanquetReceptionDetail',
                  { banquetReceptionId: _banquetReceptionId },
                  showDetailInfo
                );
                //刷新选择账页
                getPageNumList(_banquetReceptionId);
                return;
              } else {
                $.messager.show({ title: '系统提示', msg: '<span style="color:red;font-size:16px;">编辑账页失败！</span>', timeout: 3000 });
                return;
              }
            }
          }
        }, {
          text: '取消',
          handler: function () {
            dialog.dialog('close');
          }
        }]
      });
    }
  }
  //编辑账页
  $('#editPageNumber_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    const selected = $('#detail_banquentBill').datagrid('getSelected');
    if (!selected) {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的账页！', timeout: 3000, showType: 'slide' });
      return;
    } else {
      if (selected.isLock == 1) {
        $.messager.show({ title: '系统提示', msg: '该账页不可编辑！', timeout: 3000, showType: 'slide' });
        return;
      } else {
        editDetalisPageNumber(selected);
      }
    }
  });
  //收款
  $('#receiptBtn_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    receipt_banquetBill({ title: '收款详情', scene: '收款' });
  });
  //退款
  $('#cancelReceiptBtn_banquentBill').on('click', function () {
    if (!isUnOverBill(_banquetReceptionId)) {
      return;
    }
    receipt_banquetBill({ title: '退款详情', scene: '退款' });
  });
  function receipt_banquetBill(param) {
    console.info(param)
    if (!_banquetReceptionId) {
      $.messager.show({ title: '系统提示', msg: '未查询到账单信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if ($('#briefInfo_banquentBill').datagrid('getData').rows[0].state == 2) {//判断账单是否关闭
      $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 3000 });
      return;
    }
    $('#showReceiptDialog').append(`
			<div id="receiptDialog_banquetBill" style="padding:10px 0 0 30px;">
				<div id="hidden_div_getBill" style="height:24px;width:100%;">
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_paymethodId_receipt"  style="width:210px;"
						label="支付方式：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div id="hidden_phone_getBill" style="margin-bottom:10px;display:none;">
					<input id="ipt_phone_receipt"  style="width:210px;"
						label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div id="hidden_matchCode_getBill"  style="margin-bottom:10px;display:none;">
					<input id="ipt_matchCode_receipt"  style="width:210px;"
						label="匹配码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div>
					<input id="ipt_amount_receipt"  style="width:210px;"
					label="支付金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
			</div>
		`);
    $('#ipt_phone_receipt').numberbox({
      validType: 'mobilephone',
      required: false,
      delay: 1000,
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#ipt_matchCode_receipt').textbox({
      required: false,
      delay: 1000,
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let getBill_payFlag = 0;
    $('#ipt_paymethodId_receipt').combobox({
      valueField: 'paymethod_name',//paymethod_code
      textField: 'paymethod_name',
      data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
      editable: false,
      panelHeight: "auto",
      panelMaxHeight: 300,
      groupField: 'paymethod_name',
      onChange: function (newValue, oldValue) {
        if (newValue == "积分" || newValue == "储值") {
          $('#hidden_matchCode_getBill').show();
          $('#hidden_phone_getBill').show();
          $('#hidden_div_getBill').hide();
          $('#ipt_phone_receipt').numberbox({
            required: true
          });
          $('#ipt_matchCode_receipt').textbox({
            required: false
          });
        } else {
          $('#hidden_div_getBill').show();
          $('#hidden_matchCode_getBill').hide();
          $('#hidden_phone_getBill').hide();
          $('#ipt_phone_receipt').numberbox({
            required: false
          });
          $('#ipt_matchCode_receipt').textbox({
            required: false
          });
        }
      },
      groupFormatter: function (group) {
        if (eapor.data.PaymethodObj.length == getBill_payFlag) {
          getBill_payFlag += 1;
          return "代收";
        }
        getBill_payFlag += 1;
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].paymethod_code);
          $(this).combobox('setText', data[0].paymethod_name);
        }
      }
    });
    $('#ipt_amount_receipt').textbox({
      required: true,
      missingMessage: "金额不能为空！",
      validType: ['noNegativeNumber', 'notZero'],
      invalidMessage: "请输入不小于0的数字，最多两位小数",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let receiptDialog = $('#receiptDialog_banquetBill');
    receiptDialog.dialog({
      title: param.title,
      width: 300,
      height: 220,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#ipt_phone_receipt').numberbox('isValid')) {
            $('#ipt_phone_receipt').numberbox('textbox').focus();
            return;
          }
          if (!$('#ipt_matchCode_receipt').textbox('isValid')) {
            $('#ipt_matchCode_receipt').textbox('textbox').focus();
            return;
          }
          if (!$('#ipt_amount_receipt').textbox('isValid')) {
            $('#ipt_amount_receipt').textbox('textbox').focus();
            return;
          }
          let amount = $('#ipt_amount_receipt').textbox('getValue');//支付金额
          if (amount == "") {
            $.messager.show({ title: '系统提示', msg: '支付金额不能为空！', timeout: 2000 });
            return;
          }
          let payInfo = eapor.utils.getPayIdAndName('ipt_paymethodId_receipt');
          let paymentDate = {
            banquetPayMethodName: payInfo.paymethodName,
            banquetPayMethodCode: payInfo.paymethodCode,
            creditChannelId: payInfo.hasOwnProperty("creditChannelId") ? payInfo.creditChannelId : 0,
            payAmount: (amount * 100).toFixed(0),
            remark: "",
            scene: param.scene,
            banquetReceptionId: _banquetReceptionId,
            phone: (payInfo.paymethodName != "储值" && payInfo.paymethodName != "积分") ? "" :
              $('#ipt_phone_receipt').numberbox('getValue'),
            matchCode: (payInfo.paymethodName != "储值" && payInfo.paymethodName != "积分") ? "" :
              $('#ipt_matchCode_receipt').textbox('getValue')
          };
          console.info(paymentDate);
          if (param.scene == "收款") {
            eapor.utils.defaultAjax('../banquetBill/banquetReceipt', paymentDate, receiptSubmitCallBack);
          } else {
            eapor.utils.defaultAjax('../banquetBill/banquetRefund', paymentDate, receiptSubmitCallBack);
          }
        }
      }, {
        text: '取消',
        handler: function () {
          receiptDialog.dialog('close');
        }
      }]
    });
  };

  function getPageNumListCallBack(result) {
    const result_ = [];
    for (let i = 0; i < result.length; i++) {
      result_.push({ 'id': i + 1, 'text': result[i] });
    }
    $('#selectReceptionPageNumber_banquetBill').combobox({
      data: result_,
      valueField: 'text',
      textField: 'text',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onChange(newValue, oldValue) {
        if (!oldValue) {
          return;
        } else if (newValue == "全部") {
          $('#detail_banquentBill').datagrid('loadData', getBanquetBillNumberPageDetailsInfo);
        } else {
          $('#detail_banquentBill').datagrid('loadData', getBanquetBillNumberPageDetailsInfo.filter(function (item) {
            return newValue == item.bqFolio;
          }));
        }
      },
      loadFilter(data) {
        data.unshift({ "id": 0, "text": "全部", "selected": true });
        return data;
      }
    });
  }
  //根据账单ID，获得账页list fun
  function getPageNumList(banquetReceptionId) {
    eapor.utils.defaultAjax('../banquetBill/getFoliosByBqReceptionId', { bqReceptionId: banquetReceptionId },
      getPageNumListCallBack);
  }

  function receiptSubmitCallBack(result) {
    console.info(result);
    if (result > 0) {
      $('#receiptDialog_banquetBill').dialog('close');
      refreshInfo(_banquetReceptionId);
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result === -11) {
      $.messager.show({ title: '系统提示', msg: '操作失败！积分不足！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result === -12) {
      $.messager.show({ title: '系统提示', msg: '操作失败！储值不足！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result === -13) {
      $.messager.show({ title: '系统提示', msg: '操作失败！手机号或匹配码不正确！', timeout: 3000, showType: 'slide' });
      return;
    }
    $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
  }

  //加单--餐宴
  function showFormDetails_banquet() {
    $('#banquetConsumeItemTypeId').combobox({
      url: '../banquet/listBanquetType',
      valueField: 'banquetTypeId',
      textField: 'banquetTypeName',
      queryParams: {
        offset: 0,
        limit: 9999999,
        banquetTypeName: ""
      },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (data) {
        console.info(data);
        $('#banquetConsumeItemId').combobox({
          //url:'../banquet/listBanquetItem',
          url: '../banquet/listBanquetItemNotHasBreakfast',
          valueField: 'banquetItemId',
          textField: 'banquetItemName',
          queryParams: {
            banquetItemName: "",
            offset: 0,
            limit: 99999,
            banquetTypeId: data.banquetTypeId
          },
          editable: false,
          panelHeight: 'auto',
          panelMaxHeight: 200,
          onSelect: function (data) {
            $('#banquetConsumeItemUnit').textbox('setText', data.unit);
            $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data.salePrice, 100));
            $('#banquetConsumeItemNumber').textbox('setText', 1);
          },
          onLoadSuccess: function (data) {
            if (data.length > 0) {
              $(this).combobox('setValue', data[0].banquetItemId);
              $(this).combobox('setText', data[0].banquetItemName);
              $('#banquetConsumeItemUnit').textbox('setText', data[0].unit);
              $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data[0].salePrice, 100));
              $('#banquetConsumeItemNumber').textbox('setText', 1);
            } else {
              $('#banquetConsumeItemUnit').textbox('setText', '');
              $('#banquetConsumeItemPrice').textbox('setText', '');
              $('#banquetConsumeItemNumber').textbox('setText', '');
            }
          }
        });
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].banquetTypeId);
          $(this).combobox('setText', data[0].banquetTypeName);
        }
      }
    });
  }
  //加单--商品
  function showFormDetails_goods() {
    $('#banquetConsumeItemTypeId').combobox({
      url: '../Goodscategory/listGoodscategoryPage',
      valueField: 'goodsCategoryId',
      textField: 'goodsCategoryName',
      queryParams: {
        offset: 0,
        limit: 9999999,
        goodsCategoryName: ""
      },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (data) {
        console.info(data);
        $('#banquetConsumeItemId').combobox({
          url: '../Goods/listGoodsPage',
          valueField: 'goodsId',
          textField: 'goodsItemCode',
          queryParams: {
            goodsName: "",
            offset: 0,
            limit: 99999,
            saleState: 1,//经营状态   1上架 2下架  0全部
            goodsCategoryId: data.goodsCategoryId
          },
          editable: false,
          panelHeight: 'auto',
          panelMaxHeight: 200,
          onSelect: function (data) {
            $('#banquetConsumeItemUnit').textbox('setText', data.unitName);
            $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data.salePrice, 100));
            $('#banquetConsumeItemNumber').textbox('setText', 1);
          },
          onLoadSuccess: function (data) {
            console.info(data);
            if (data.length > 0) {
              $(this).combobox('setValue', data[0].goodsId);
              $(this).combobox('setText', data[0].goodsItemCode);
              $('#banquetConsumeItemUnit').textbox('setText', data[0].unitName);
              $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data[0].salePrice, 100));
              $('#banquetConsumeItemNumber').textbox('setText', 1);
            } else {
              $('#banquetConsumeItemUnit').textbox('setText', '');
              $('#banquetConsumeItemPrice').textbox('setText', '');
              $('#banquetConsumeItemNumber').textbox('setText', '');
            }
          }
        });
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].goodsCategoryId);
          $(this).combobox('setText', data[0].goodsCategoryName);
        }
      }
    });
  }
  //加单--服务
  function showFormDetails_service() {
    $('#banquetConsumeItemTypeId').combobox({
      url: '../Servicetype/listServicetypePage',
      valueField: 'serviceTypeId',
      textField: 'serviceTypeName',
      queryParams: {
        offset: 0,
        limit: 9999999,
        serviceTypeName: ""
      },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (data) {
        console.info(data);
        $('#banquetConsumeItemId').combobox({
          url: '../Serviceitem/listServiceitemPage',
          valueField: 'serviceItemId',
          textField: 'serviceItemCode',
          queryParams: {
            serviceItemName: "",
            offset: 0,
            limit: 99999,
            serviceTypeId: data.serviceTypeId
          },
          editable: false,
          panelHeight: 'auto',
          panelMaxHeight: 200,
          onSelect: function (data) {
            $('#banquetConsumeItemUnit').textbox('setText', '--');
            $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data.price, 100));
            $('#banquetConsumeItemNumber').textbox('setText', 1);
          },
          onLoadSuccess: function (data) {
            if (data.length > 0) {
              $(this).combobox('setValue', data[0].serviceItemId);
              $(this).combobox('setText', data[0].serviceItemCode);
              $('#banquetConsumeItemUnit').textbox('setText', '--');
              $('#banquetConsumeItemPrice').textbox('setText', NP.divide(data[0].price, 100));
              $('#banquetConsumeItemNumber').textbox('setText', 1);
            } else {
              $('#banquetConsumeItemUnit').textbox('setText', '--');
              $('#banquetConsumeItemPrice').textbox('setText', '');
              $('#banquetConsumeItemNumber').textbox('setText', '');
            }
          }
        });
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].serviceTypeId);
          $(this).combobox('setText', data[0].serviceTypeName);
        }
      }
    });
  }
  //餐宴加单btn
  $('#addDetailsForReception_banquentBill').on('click', function () {
    if (!_banquetReceptionId) {
      $.messager.show({ title: '系统提示', msg: '未查询到账单信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    $('#showAddDialog').append(`
			<div id="div" style="padding:30px 0 0 40px;">
				<div id="top_addDialog" style="margin-bottom:20px">
					<input id="banquetConsumeItemType" style="width:250px;"
						label="消费项目类别：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div id="warehouseId_addDialog" style="margin-bottom:20px;display:none;" >
					<input id="banquetConsumeItemWarehouseId" style="width:250px;"
						label="出货库：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemTypeId" style="width:250px;"
						label="消费项目分类名称：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemId" style="width:250px;"
						label="消费项目名称：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemUnit" style="width:250px;"
						label="消费项目单位：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemPrice" style="width:250px;"
						label="消费项目单价：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemNumber" style="width:250px;"
						label="消费项目数量：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="banquetConsumeItemAmount" style="width:250px;"
						label="消费项目总价：" labelPosition="before" labelAlign="right" labelWidth="120"/>
				</div>
			</div>
		`);
    //消费项目类别
    $('#banquetConsumeItemType').combobox({
      valueField: 'id',
      textField: 'text',
      data: [{
        id: '4',
        text: '餐宴',
        "selected": true
      }, {
        id: '2',
        text: '商品'
      }, {
        id: '3',
        text: '服务'
      }],
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (data) {
        let id = data.id;
        if (id == 4) {
          $('#warehouseId_addDialog').hide();
          showFormDetails_banquet();
        }
        if (id == 2) {
          $('#warehouseId_addDialog').show();
          showFormDetails_goods();
        }
        if (id == 3) {
          $('#warehouseId_addDialog').hide();
          showFormDetails_service();
        }
      }
    });
    //出货库
    $('#banquetConsumeItemWarehouseId').combobox({//warehouseId_addDialog
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
      onLoadSuccess: function (getData) {
        if (getData.length > 0) {
          for (let value in getData) {
            if (getData[value].isPrimary == 1) {
              $(this).combobox('setValue', getData[value].warehouseId);
              return;
            }
          }
        }
      }
    });
    //消费项目分类名称
    $('#banquetConsumeItemTypeId').combobox({
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200
    });

    //消费项目名称
    $('#banquetConsumeItemId').combobox({
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200
    });
    //消费项目单位
    $('#banquetConsumeItemUnit').textbox({ editable: false });
    //消费项目单价
    $('#banquetConsumeItemPrice').textbox({ editable: false });
    //消费项目总价
    $('#banquetConsumeItemAmount').textbox({ editable: false });
    //消费项目数量
    $('#banquetConsumeItemNumber').textbox({
      validType: ['noNegativeNumber', 'number'],
      delay: 800,
      invalidMessage: '数量输入有误',
      onValidate: function (valid) {
        if (valid) {
          let val = $(this).textbox('getText') * $('#banquetConsumeItemPrice').textbox('getText');
          $('#banquetConsumeItemAmount').textbox('setValue', val.toFixed(2));
        } else {
          $('#banquetConsumeItemAmount').textbox('setValue', '');
        }
      }
    });

    let dialog = $('#div');
    dialog.dialog({
      title: '加单',
      width: 380,
      height: 460,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          let itemData = {
            banquetReceptionId: _banquetReceptionId,

            banquetConsumeItemType: $('#banquetConsumeItemType').combobox('getValue'),//项目类别
            //出货库
            //banquetConsumeItemWarehouseId: $('#banquetConsumeItemWarehouseId').combobox('getValue'),
            //消费项目分类名称
            banquetConsumeItemTypeName: $('#banquetConsumeItemTypeId').combobox('getText'),
            banquetConsumeItemTypeId: $('#banquetConsumeItemTypeId').combobox('getValue'),
            //消费项目名称
            banquetConsumeItemName: $('#banquetConsumeItemId').combobox('getText'),
            banquetConsumeItemId: $('#banquetConsumeItemId').combobox('getValue'),

            banquetConsumeItemUnit: $('#banquetConsumeItemUnit').textbox('getText'),//单位

            banquetConsumeItemPrice: NP.times($('#banquetConsumeItemPrice').textbox('getText'), 100),//消费项目单价

            banquetConsumeItemAmount: NP.times($('#banquetConsumeItemAmount').textbox('getText'), 100),//消费项目总价

            banquetConsumeItemNumber: $('#banquetConsumeItemNumber').textbox('getText')//消费项目数量
          };
          if (itemData.banquetConsumeItemType == 2) {
            itemData.banquetConsumeItemWarehouseId = $('#banquetConsumeItemWarehouseId').combobox('getValue');
          }
          if (!itemData.banquetConsumeItemType) {
            $.messager.show({ title: '系统提示', msg: '消费项目类别不能为空！', timeout: 3000 });
            return;
          }
          if (!itemData.banquetConsumeItemTypeName) {
            $.messager.show({ title: '系统提示', msg: '消费项目分类不能为空！', timeout: 3000 });
            return;
          }
          if (!itemData.banquetConsumeItemName) {
            $.messager.show({ title: '系统提示', msg: '消费项目名称不能为空！', timeout: 3000 });
            return;
          }
          let submitData = {
            pbcds: [itemData],
            pbp: null
          };
          console.info(submitData);
          $.messager.confirm('系统提示', '<span style="color:red;font-size:16px;">是否对该加单项进行收款操作？</span>',
            function (r) {
              if (r) {
                addReception_addPay_banquetBill(submitData);
              } else {
                eapor.utils.defaultAjaxHasContentType('../banquetBill/banquetConsume',
                  JSON.stringify(submitData),
                  addReception_banquetBill);
              }
            });
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  //对加单进行收款
  function addReception_addPay_banquetBill(submitData) {
    console.info(submitData);
    //eapor.utils.defaultAjax('../banquetBill/banquetConsume', JSON.stringify(submitData), addReception_banquetBill);
    $('#showAddDialog').append(`
			<div id="payDiv_banquetBill"  style="padding:10px 0 0 30px;">
				<div id="hidden_div_getBill" style="height:24px;width:100%;">
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_paymethodId_receipt"  style="width:210px;"
						label="支付方式：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div id="hidden_phone_getBill" style="margin-bottom:10px;display:none;">
					<input id="ipt_phone_receipt"  style="width:210px;"
						label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div id="hidden_matchCode_getBill"  style="margin-bottom:10px;display:none;">
					<input id="ipt_matchCode_receipt"  style="width:210px;"
						label="匹配码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
				<div>
					<input id="ipt_amount_receipt"  style="width:210px;"
					label="支付金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
			</div>
		`);
    $('#ipt_phone_receipt').numberbox({
      validType: 'mobilephone',
      required: false,
      delay: 1000,
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#ipt_matchCode_receipt').textbox({
      required: false,
      delay: 1000,
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let getBill_payFlag = 0;
    $('#ipt_paymethodId_receipt').combobox({
      valueField: 'paymethod_name',//paymethod_code
      textField: 'paymethod_name',
      data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
      editable: false,
      panelHeight: "auto",
      panelMaxHeight: 300,
      groupField: 'paymethod_name',
      onChange: function (newValue, oldValue) {
        if (newValue == "积分" || newValue == "储值") {
          $('#hidden_matchCode_getBill').show();
          $('#hidden_phone_getBill').show();
          $('#hidden_div_getBill').hide();
          $('#ipt_phone_receipt').numberbox({
            required: true
          });
          $('#ipt_matchCode_receipt').textbox({
            required: false
          });
        } else {
          $('#hidden_div_getBill').show();
          $('#hidden_matchCode_getBill').hide();
          $('#hidden_phone_getBill').hide();
          $('#ipt_phone_receipt').numberbox({
            required: false
          });
          $('#ipt_matchCode_receipt').textbox({
            required: false
          });
        }
      },
      groupFormatter: function (group) {
        if (eapor.data.PaymethodObj.length == getBill_payFlag) {
          getBill_payFlag += 1;
          return "代收";
        }
        getBill_payFlag += 1;
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].paymethod_code);
          $(this).combobox('setText', data[0].paymethod_name);
        }
      }
    });
    $('#ipt_amount_receipt').textbox({
      required: true,
      missingMessage: "金额不能为空！",
      validType: ['noNegativeNumber', 'notZero'],
      invalidMessage: "请输入不小于0的数字，最多两位小数",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let receiptDialog = $('#payDiv_banquetBill');
    receiptDialog.dialog({
      title: "加单收款",
      width: 300,
      height: 220,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const type_ = $('#ipt_paymethodId_receipt').combobox('getText');
          if (type_ === '储值' || type_ === '积分') {
            if (!$('#ipt_phone_receipt').numberbox('isValid')) {
              $('#ipt_phone_receipt').numberbox('textbox').focus();
              return;
            }
            if (!$('#ipt_matchCode_receipt').textbox('isValid')) {
              $('#ipt_matchCode_receipt').textbox('textbox').focus();
              return;
            }
          } else {
            $('#ipt_phone_receipt').numberbox('clear');
            $('#ipt_matchCode_receipt').textbox('clear');
          }
          if (!$('#ipt_amount_receipt').textbox('isValid')) {
            $('#ipt_amount_receipt').textbox('textbox').focus();
            return;
          }
          const payInfo = eapor.utils.getPayIdAndName('ipt_paymethodId_receipt');
          const amount = $('#ipt_amount_receipt').textbox('getValue');//支付金额
          if (amount == "") {
            $.messager.show({ title: '系统提示', msg: '支付金额不能为空！', timeout: 2000 });
            return;
          }
          submitData.pbp = {
            banquetPayMethodCode: payInfo.paymethodCode,	//支付方式id	是	[long]		
            banquetPayMethodName: payInfo.paymethodName,//支付方式名称	是	[string]		
            payAmount: NP.times(amount, 100),//支付金额，单位分	是	[int]		
            banquetReceptionId: _banquetReceptionId,//餐宴账单id	是	[long]		
            scene: "餐宴加单",//场景	是	[string]		
          };
          if (payInfo.hasOwnProperty("creditChannelId")) {
            submitData.pbp.creditChannelId = payInfo.creditChannelId
          }
          if (payInfo.paymethodName == "积分" || payInfo.paymethodName == "储值") {
            //手机号，当支付方式为积分或储值时为必填项。若无，请传入NULL或""		[string]		
            submitData.pbp.phone = $('#ipt_phone_receipt').numberbox('getValue');
            submitData.pbp.matchCode = $('#ipt_matchCode_receipt').textbox('getValue');
          }
          console.info(submitData);
          eapor.utils.defaultAjaxHasContentType('../banquetBill/banquetConsume', JSON.stringify(submitData),
            addReception_banquetBill);
        }
      }, {
        text: '取消',
        handler: function () {
          receiptDialog.dialog('close');
        }
      }]
    });
  }

  function addReception_banquetBill(result) {
    console.info(result);
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '加单成功！', timeout: 3000, showType: 'slide' });
      //刷新简讯、汇总信息
      refreshInfo(_banquetReceptionId);
      $('#div').dialog('close');
      $('#payDiv_banquetBill').dialog('close');
      return;
    }
    if (result == -7) {
      $.messager.show({
        title: '系统提示', msg: '<span style="color:red;font-size:16px;">商品出库失败！</span>',
        timeout: 3000, showType: 'slide'
      });
      return;
    }
    if (result == -11) {
      $.messager.show({
        title: '系统提示', msg: '<span style="color:red;font-size:16px;">加单失败！积分不足！</span>',
        timeout: 3000, showType: 'slide'
      });
      return;
    }
    if (result == -12) {
      $.messager.show({
        title: '系统提示', msg: '<span style="color:red;font-size:16px;">加单失败！储值不足！</span>',
        timeout: 3000, showType: 'slide'
      });
      return;
    }
    if (result == -13) {
      $.messager.show({
        title: '系统提示', msg: '<span style="color:red;font-size:16px;">加单失败！手机号或匹配码不正确！</span>',
        timeout: 3000, showType: 'slide'
      });
      return;
    }
    $.messager.show({
      title: '系统提示', msg: `<span style="color:red;font-size:16px;">加单失败！${result}</span>`,
      timeout: 3000, showType: 'slide'
    });
  }
  //从餐宴图进入到餐宴账单页面情况下
  if (sessionStorage.getItem('banquentChartToBillPage')) {
    let chartBlockObj = JSON.parse(JSON.parse(sessionStorage.getItem('banquentChartToBillPage')).guestObj);
    sessionStorage.removeItem('banquentChartToBillPage');
    console.info(chartBlockObj);
    console.info(chartBlockObj.banquetReceptionId);
    console.info(refreshInfo);
    refreshInfo(chartBlockObj.banquetReceptionId);
    /*$.ajax({
      type:'post',
      url:'../banquetBill/getBanquetReceptionLettersById',
      data:{banquetReceptionId: chartBlockObj.banquetReceptionId},
      dataType:'json'
    })
    .done(function(result){
      console.info(result);
      showShortSummaryInfo(result);
    });*/
  }

})(window.eapor);