/**JS名称：宾客账单JS
 * JS说明：
 * 	row.type 为1 支付 2 消费 3 签单 4 坏账 5 免单 6 转出 7转入
 * 	
 */
~(function (eapor) {
  "use strict";
  let rowSelect_getBill = null,
    onlySelectedOneRowFlag = 0;

  $('#briefInfo').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    //rownumbers : true,
    columns: [[  //-----columns start-----
      { field: 'roomIds', title: "房间IdList", align: 'center', width: 20, hidden: true },
      { field: 'credit', title: "信用", align: 'center', width: 20, hidden: true },
      { field: 'sign', title: "签单", align: 'center', width: 20, hidden: true },
      { field: 'debt', title: "坏账", align: 'center', width: 20, hidden: true },
      { field: 'free', title: "免单", align: 'center', width: 20, hidden: true },
      { field: 'goodsAmount', title: "商品消费", align: 'center', width: 20, hidden: true },
      { field: 'payment', title: "总支付", align: 'center', width: 20, hidden: true },
      { field: 'rentAmount', title: "总房费", align: 'center', width: 20, hidden: true },
      { field: 'serviceAmount', title: "服务消费", align: 'center', width: 20, hidden: true },
      { field: 'transfer', title: "转入转出", align: 'center', width: 20, hidden: true },
      { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },
      { field: 'roomId', title: "roomId", align: 'center', width: 20, hidden: true },
      { field: 'guestId', title: "guestId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      { field: 'phone', title: "宾客手机号", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      {
        field: 'channelName', title: "客源", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (!value) {
            return "非会员";
          } else {
            return value;
          }
        }
      },
      {
        field: 'checkinTime', title: "登记时间", align: 'center', width: 20,
        formatter: function (value, row) {
          return getDateNoSS(value);
        }
      },
      {
        field: 'checkoutTime', title: "结账时间", align: 'center', width: 20,
        formatter: function (value, row) {
          if (row.receptionState == 1) {//未结账单 时间显示为空
            return "--";
          } else {
            return getDateNoSS(value);
          }
        }
      },
      { field: 'roomCode', title: "房号", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      {
        field: 'receptionState', title: "账单状态", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (row.receptionState == 1) {
            return "未结账";
          } else if (row.receptionState == 2) {
            return "已结账";
          } else if (row.receptionState == 3) {
            return "已审核";
          } else {
            return value;
          }
        }
      },
      { field: 'remark', title: "备注", align: 'center', width: 20 }
    ]]
  });
  //明细
  $('#detail_getBill').datagrid({
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
    data: [],
    rownumbers: true,
    checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
    //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
    //如果为false，选择行将不选中复选框。
    onLoadSuccess: function () {
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
        rowSelect_getBill = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_getBill = null;
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

      if (rowData != rowSelect_getBill) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_getBill = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_getBill = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    columns: [eapor.data.BillDetailsForDatagridColumns]
  });
  //简讯、汇总
  function shortInfoAndPoolCallBack(result) {
    console.info(result);
    Bill.roomId = result.roomId;
    Bill.guestId = result.guestId;
    //简讯
    var shortInfoArray = [];
    shortInfoArray.push(result);
    $('#briefInfo').datagrid("loadData", shortInfoArray);
    $("#briefInfo").datagrid("reload");
    //汇总
    //房费
    $('#roomPrice_getBill').text(NP.divide(result.rentAmount, 100) + "元");
    //balance = 总房价+总消费-总支付-签单-免单-坏账-transferOut(转出)+transferIn(转入)
    $('#hidden_balance_inThisJsp').val(
      (NP.minus(NP.minus(NP.minus(NP.minus(NP.minus(NP.plus(NP.plus(NP.plus(NP.divide(result.rentAmount, 100),
        NP.divide(result.goodsAmount, 100)), NP.divide(result.serviceAmount, 100)),
        NP.divide(result.transferIn, 100)), NP.divide(result.payment, 100)), NP.divide(result.sign, 100)),
        NP.divide(result.free, 100)), NP.divide(result.debt, 100)), NP.divide(result.transferOut, 100))).toFixed(2)
    );
    $('#balance_getBill').text($('#hidden_balance_inThisJsp').val() + "元");
    // 刷新房态 （关系有‘欠’字的显示）
    if (result['roomIds'].length > 0) {
      Bill.roomIds = result.roomIds;
      Bill.refreshRoomType(Bill.roomIds);
    }
    if (Bill.turnInRoomId != undefined) {
      Bill.refreshRoomType(Bill.turnInRoomId);
      Bill.turnInRoomId = undefined;
    }
    //其他消费
    $('#consumeAmount_getBill').text(NP.plus(NP.divide(result.goodsAmount, 100), NP.divide(result.serviceAmount, 100)) + "元");
    //支付
    if (result.payment == 0) {
      $('#getAmountFromGuestOrToAmount').text("0元");
    } else {
      $('#getAmountFromGuestOrToAmount').text(NP.divide(result.payment, -100) + "元");
    }

    //签单金额不为0，显示签单，为0则不在汇总处显示
    if (result.sign != 0) {
      $('#signupAmountResult').text(NP.divide(result.sign, -100) + "元");
      $('#signup_li').show();
    } else {
      $('#signupAmountResult').text("");
      $('#signup_li').hide();
    }
    //免单金额不为0，显示免单，为0则不在汇总处显示
    if (result.free != 0) {
      $('#freeAmountResult').text(NP.divide(result.free, -100) + "元");
      $('#free_li').show();
    } else {
      $('#freeAmountResult').text("");
      $('#free_li').hide();
    }
    //坏账金额不为0，显示坏账，为0则不在汇总处显示
    if (result.debt != 0) {
      $('#badAmountResult').text(NP.divide(result.debt, -100) + "元");
      $('#bad_li').show();
    } else {
      $('#badAmountResult').text("");
      $('#bad_li').hide();
    }
    // 转移：transferIn transferOut 金额不为0，显示，为0则不在汇总处显示   
    var transferAmount = NP.minus(result.transferIn, result.transferOut);
    if (transferAmount != 0) {
      $('#transferAmountResult').text(NP.divide(transferAmount, 100) + "元");
      $('#transfer_li').show();
    } else {
      $('#transferAmountResult').text("");
      $('#transfer_li').hide();
    }
    //信用参考
    if (result.credit > 0) {
      var cname = "";
      if (result.creditName) {
        cname = "（" + result.creditName + "）";
      }
      $('#credit_getBill').html(NP.divide(result.credit, 100) + "元" + cname);
    } else {
      $('#credit_getBill').html("");
    }
  }
  //明细
  function detailsCallBack(result) {
    console.info(result);
    //1 支付 2 消费 3 签单 4 坏账 5 免单 6 转出 7转入
    for (let i = 0; i < result.length; i++) {
      if (result[i].type == 1) {
        result[i].typename = "支付";
      }
      if (result[i].type == 2) {
        result[i].typename = "消费";
      }
      if (result[i].type == 3) {
        result[i].typename = "签单";
      }
      if (result[i].type == 4) {
        result[i].typename = "坏账";
      }
      if (result[i].type == 5) {
        result[i].typename = "免单";
      }
      if (result[i].type == 6 || result[i].type == 7) {
        result[i].typename = "转移";
      }
    }
    Bill.getBillNumberPageDetailsInfo = result;
    $('#detail_getBill').datagrid("loadData", result);
    $("#detail_getBill").datagrid("reload");
    Bill.selectReceptionPageNumberCombobox();//更新账页数据
  }
  $('#getReceptionListByLivingGuestShouldCheckOut1').on('click', function () {
    getReceptionListByLivingGuestShouldCheckOut(1);
  });
  $('#getReceptionListByLivingGuestShouldCheckOut2').on('click', function () {
    getReceptionListByLivingGuestShouldCheckOut(2);
  });
  //预离宾客账单btn
  function getReceptionListByLivingGuestShouldCheckOut(value) {
    $('#hidden_livingRoom_notleave').val(value);//在datagrid加载完成后清空  value为1 为勾选预离  非预离未勾选  value为2则相反
    $('#showLivingGuestShouldCheckOutDiv').append('<div id="addReception_livingRoomList"></div>');
    $('#addReception_livingRoomList').dialog({
      title: '详情',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      href: '../client/livingRoom.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var selected = $('#livingRoom_list').datagrid('getSelected');
          if (!selected) {
            $.messager.show({ title: '系统提示', msg: '请选择房间！', timeout: 2000, showType: 'slide' });
            return;
          }
          Bill.receptionId = selected.receptionId;//保存receptionId到Bill对象
          sessionStorage.setItem('Bill_reception', selected.receptionId);
          Bill.roomCode = selected.roomCode;//保存roomCode到Bill对象 //用于跳转到加单页面传递的参数
          Bill.roomId = selected.roomId;//保存roomId到Bill对象 //用于刷新房态 做为webStock 刷新方法的参数
          //显示简讯、汇总
          eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
          //显示明细
          eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
          $('#addReception_livingRoomList').dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $('#addReception_livingRoomList').dialog('close');
        }
      }]
    });
  };
  //*****************************已退房未结账单、 非住客未结账单按钮\今日已结按钮 start*********************************************
  /*从列表中获取客单信息*/
  function getBill_getReceptionId(value) {
    console.info(value);
    if (value == 1) {//在住客单公共页面情况下
      var selected = $('#livingReception_list').datagrid('getSelected');
      if (selected != null) {
        Bill.receptionId = selected.receptionId;//保存receptionId到Bill对象
        sessionStorage.setItem('Bill_reception', selected.receptionId);
        Bill.roomCode = selected.roomCode;//保存roomCode到Bill对象
        //显示简讯、汇总
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        //显示明细
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        $('#getBill_receptionList').dialog('close');
      } else {
        $.messager.show({ title: '系统提示', msg: '请选择客单！', timeout: 2000, showType: 'slide' });
        return;
      }
    } else if (value == 2) {//所有的含时间搜索的公共页面情况下
      var selected = $('#allReception_list').datagrid('getSelected');
      if (!selected) {
        $.messager.show({ title: '系统提示', msg: '请选择客单！', timeout: 3000, showType: 'slide' });
        return;
      }
      if (selected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
        $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide' });
        return;
      }
      if (selected.receptionType === 3) {
        $.messager.show({ title: '系统提示', msg: '操作无效！请选择非餐宴账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      Bill.receptionId = selected.receptionId;//保存receptionId到Bill对象
      sessionStorage.setItem('Bill_reception', selected.receptionId);
      Bill.roomCode = selected.roomCode;//保存roomCode到Bill对象
      //显示简讯、汇总
      eapor.utils.defaultAjax('../reception/getReceptionInfo',
        { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
      //显示明细
      eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId',
        { receptionId: Bill.receptionId }, detailsCallBack);
      $('#getBill_receptionList').dialog('close');
    }
  };
  $('#showReceptionForUnLiving_getBill2').on('click', function () {
    showReceptionForUnLiving_getBill(2);
  });
  $('#showReceptionForUnLiving_getBill1').on('click', function () {
    showReceptionForUnLiving_getBill(1);
  });
  function showReceptionForUnLiving_getBill(value) {
    $('#getBill_receptionListP').append('<div id="getBill_receptionList"></div>');
    if (value == 1) {//非在住btn
      eapor.data.receptionState = 1;
      eapor.data.receptionType = 2;
      eapor.data.createDate = "";
      eapor.data.checkoutDate = "";
      $('#getBill_receptionList').dialog({
        title: '全部非住客未结客单列表',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            getBill_getReceptionId(2);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#getBill_receptionList').dialog('close');
          }
        }],
        href: '../client/common-getReceptionList.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        }
      });
    } else if (value == 2) {//退房未结账单btn
      eapor.data.receptionState = 10;
      eapor.data.receptionType = 1;
      eapor.data.createDate = "";
      eapor.data.checkoutDate = "";
      $('#getBill_receptionList').dialog({
        title: '退房未结账账单列表',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            getBill_getReceptionId(2);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#getBill_receptionList').dialog('close');
          }
        }],
        href: '../client/common-getReceptionList.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        }
      })
    }
  };
  //******************************已退房未结账单、 非住客未结账单按钮end*********************************************

  //******************************今日已结账单 按钮  start*******************************************
  $('#showReceptionForGetBillList').on('click', function () {
    $('#getBill_receptionListP').append('<div id="getBill_receptionList"></div>');
    eapor.data.receptionState = 2;
    eapor.data.receptionType = 0;
    eapor.data.createDate = "";
    eapor.data.checkoutDate = getDateForHoliday(new Date());
    $('#getBill_receptionList').dialog({
      title: '客单列表',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      buttons: [{
        text: '确定',
        handler: function () {
          getBill_getReceptionId(2);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#getBill_receptionList').dialog('close');
        }
      }],
      href: '../client/common-getReceptionList.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      }
    })
  });
  //******************************今日已结账单 按钮 end*********************************************
  //******************显示未结宾客账单btn start、未结宾客账单查询JSP的按钮********************
  function showReceptionForUnGetBill() {
    $('#getBill_receptionListP').append('<div id="getBill_receptionList"></div>');
    eapor.data.receptionState = 1;
    eapor.data.receptionType = 0;
    eapor.data.createDate = "";
    eapor.data.checkoutDate = "";
    $('#getBill_receptionList').dialog({
      title: '全部未结客单列表',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      buttons: [{
        text: '确定',
        handler: function () {
          getBill_getReceptionId(2);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#getBill_receptionList').dialog('close');
        }
      }],
      href: '../client/common-getReceptionList.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      }
    })
  };
  //******************显示未结宾客账单btn end、未结宾客账单查询JSP的按钮********************
  //***********************搜索 start *********************
  //搜索回调
  function searchCallBack_getBill(result) {
    if (result == "[]" || result.length == 0) {
      $.messager.show({
        title: '系统提示', msg: '未查到相关宾客账单信息！', timeout: 2000
      });
      return;
    }

    $('#searchResultShowInfoDiv').append(
      '<div id="getBill_receipt">' +
      '<table id="allReception_list"></table>' +
      '</div>'
    );
    $('#allReception_list').datagrid({
      title: '客单列表', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      fit: true,
      data: result,
      rownumbers: true,
      columns: [[
        { field: 'channelId', title: '客源ID', align: 'center', hidden: true },
        { field: 'receptionId', title: '客单ID', align: 'center', width: 20, hidden: true },
        { field: 'rentplanId', title: '房价方案ID', align: 'center', width: 20, hidden: true },
        { field: 'sourceGroupId', title: '客源组ID', align: 'center', width: 20, hidden: true },
        { field: 'createUserId', title: 'createUserId', align: 'center', width: 20, hidden: true },
        { field: 'createUsername', title: 'createUsername', align: 'center', width: 20, hidden: true },
        { field: 'hotelId', title: 'hotelId', align: 'center', width: 20, hidden: true },
        { field: 'memberPhone', title: 'memberPhone', align: 'center', width: 20, hidden: true },
        { field: 'primaryGuestId', title: 'primaryGuestId', align: 'center', width: 20, hidden: true },
        //{field:'receptionState',title:'receptionState',align:'center',width:20,hidden:true},//1未结账 2 已结账
        // {field:'receptionType',title:'receptionType',align:'center',width:20,hidden:true},//1住客 2非住客

        { field: 'receptionCode', title: '客单号', align: 'center', width: 34 },
        {
          field: 'channelName', title: '客源', align: 'center', width: 15,
          formatter: function (value) {
            if (value == undefined) {
              return "非会员";
            } else {
              return value;
            }
          }
        },
        {
          field: 'roomCode', title: '房间号', align: 'center', width: 15,
          formatter: function (value) {
            if (value == undefined) {
              return "--";
            } else {
              return value;
            }
          }
        },
        {
          field: 'guestName', title: '住客姓名', align: 'center', width: 15,
          formatter: function (value, row, index) {
            if (value == undefined) {
              return "--";
            } else {
              return value;
            }
          }
        },
        {
          field: 'phone', title: '联系电话', align: 'center', width: 18,
          formatter: function (value) {
            if (value == undefined) {
              return "--";
            } else {
              return value;
            }
          }
        },
        {
          field: 'createTime', title: '创建时间', align: 'center', width: 28,
          formatter: function (value) {
            return getDateNoSS(value);
          }
        },
        {
          field: 'useCreditChannel', title: '是否挂账', align: 'center', width: 12,
          formatter: function (value, row, index) {
            if (value == 1) {
              return '挂账'
            }
            if (value == 0) {
              return '未挂账'
            }
          }
        },
        {
          field: 'receptionType', title: '客单类型', align: 'center', width: 12,
          formatter: function (value, row, index) {
            if (value == 1) {
              return '住客客单 ';
            } else if (value == 2) {
              return '非住客客单';
            } else {
              return value;
            }
          }
        },
        {
          field: 'receptionState', title: '账单状态', align: 'center', width: 12,
          formatter: function (value, row, index) {
            if (value == 1) {
              return '未结账';
            } else if (value == 2) {
              return '已结账';
            } else {
              return value;
            }
          }
        }
      ]]
    });
    $('#getBill_receipt').dialog({
      title: '查询客单结果',
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
          var selected = $('#allReception_list').datagrid('getSelected');
          if (!selected) {
            $.messager.show({ title: '系统提示', msg: '请选择客单！', timeout: 2000 });
            return;
          } else {
            Bill.receptionId = selected.receptionId;//保存receptionId到Bill对象
            sessionStorage.setItem('Bill_reception', selected.receptionId);
            Bill.roomCode = selected.roomCode;//保存roomCode到Bill对象
            //显示简讯、汇总
            eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
            //显示明细
            eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId },
              detailsCallBack);
            $('#getBill_receipt').dialog('close');
          }
        }
      }, {
        text: '取消',
        handler: function () {
          $('#getBill_receipt').dialog('close');
        }
      }]
    })
  };
  $('#searchReceptionBtn_getBill').on('click', function () {
    searchReceptionBtn_getBill();
  });
  function searchReceptionBtn_getBill() {
    //验证手机输入是否正确，格式不正确不能传入后台
    if (!$('#iptGuestPhone_getBill').numberbox('isValid')) {
      $('#iptGuestPhone_getBill').numberbox('textbox').focus();
      return;
    }
    var getGuestName = $('#iptGuestName_getBill').textbox('getValue');
    var getGuestPhone = $('#iptGuestPhone_getBill').numberbox('getValue');
    var getRoomCode = $('#iptRoomCode_getBill').textbox('getValue');

    var dataSearch_getBill = {};
    dataSearch_getBill.receptionState = 1;/*1未结   2已结   0全部*/
    dataSearch_getBill.guestName = getGuestName;
    dataSearch_getBill.phone = getGuestPhone;
    dataSearch_getBill.roomCode = getRoomCode;
    dataSearch_getBill.checkoutTime = "";
    var urlSearch_getBill = '../reception/getReceptionByGuest';
    eapor.utils.defaultAjax(urlSearch_getBill, dataSearch_getBill, searchCallBack_getBill);
  };
  //***********************搜索 end ***********************

  var Bill = {
    receptionId: '',
    turnInRoomId: undefined,//转入的房间Id，用于刷新房态‘欠’
    //roomIds:"",在汇总处得到后赋值给该属性 用于刷新房态
    refreshRoomType: function (roomIds) {
      var length = roomIds.length;
      if (length == 1) {
        eapor.utils.roomOpen_successRefreshRoomType(roomIds[0], 0);
      } else if (length > 1) {
        for (let i = 0; i < length; i++) {
          eapor.utils.roomOpen_successRefreshRoomType(roomIds[i], 0);
        }
      }
    },
    initBill: function () {//初始化
      //初始化控件
      $('#iptGuestName_getBill').textbox({});
      $('#iptGuestPhone_getBill').numberbox({
        validType: 'mobilephone',
        tipPosition: 'bottom',
        delay: 1000,
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#iptRoomCode_getBill').textbox({});
      $('#selectReceptionPageNumber').combobox({
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200
      });
      //结账按钮
      $('#getBill_submit').click(function () {
        Bill.overBill();
      });
      //加单按钮
      $('#addDetailsForReception_getBill').click(function () {
        Bill.addBill();
      });
      //收款按钮
      $('#receiptBtn_getBill').click(function () {
        Bill.receiptBill(1);
      });
      //退款按钮
      $('#cancelReceiptBtn_getBill').click(function () {
        Bill.receiptBill(2);
      });
      //转出按钮
      $('#turnout_getBill').click(function () {
        Bill.turnoutBill();
      });
      //签单按钮
      $('#signup_getBill').click(function () {
        Bill.signBill(1);
      });
      //免单按钮
      $('#freeConsumeBtn').click(function () {
        Bill.signBill(2);
      });
      //坏账按钮
      $('#badBillBtn').click(function () {
        Bill.badBill();
      });
      //撤销按钮
      $('#cancelBtn').click(function () {
        Bill.cancelBill();
      });
      //编辑账页按钮
      $('#editPageNumber').click(function () {
        Bill.editPageNumber();
      });
      //编辑简讯
      $('#editShortInfo_getBill').click(function () {
        Bill.editShortInfo();
      });
      //撤销结账
      $('#cancelGetBill_getBill').click(function () {
        Bill.cancelGetBill();
      });
      //打印按钮
      $('#printBtn_getBill').click(function () {
        Bill.printBill();
      });
    },
    getBillSubmitCallback: function (result) {//结账回调函数
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        eapor.utils.defaultAjax('../reception/getReceptionInfo',
          { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId',
          { receptionId: Bill.receptionId }, detailsCallBack);
        $.messager.show({ title: '系统提示', msg: '结账成功！', timeout: 3000, showType: 'slide' });
      } else if (result === -5) {
        $.messager.show({ title: '系统提示', msg: '5分钟之内不允许重复操作！', timeout: 3000, showType: 'slide' });
        return;
      } else {
        $.messager.confirm('系统提示', '您有房间未退！请退房！', function (r) {
          if (r) {
            console.info('Bill.roomCode:', Bill.roomCode);
            $('#exitRoomData').val(JSON.stringify({ receptionId: Bill.receptionId, roomCode: Bill.roomCode }));
            $("#exit_room").trigger("click");
          }
        })
      }
    },
    overBill: function () {//结账
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000 });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      if ($('#hidden_balance_inThisJsp').val() != 0) {
        $.messager.show({ title: '系统提示', msg: 'Balance未归0，请先通过收退款功能归0后再结账！', timeout: 5000, height: 'auto' });
        return;
      }
      $.messager.confirm('系统提示', '您确认要进行结账操作吗？', function (r) {
        if (r) {
          const data_ = {
            receptionId: Bill.receptionId,
            payMentList: JSON.stringify([{ paymethodCode: 1, paymethodName: '现金', scene: '结账', amount: 0 }])
          };
          eapor.utils.defaultAjax('../reception/checkoutRentReception', data_, Bill.getBillSubmitCallback);
        }
      });
    },
    addBill: function () {//加单
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000 });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      var data = {
        receptionId: Bill.receptionId,
        roomCode: Bill.roomCode
      };
      $('#index_pubRoomData').val(JSON.stringify(data));
      if ($('#index_pubRoomData').val() != "") {
        if ($('#kzmaintable').tabs('exists', '加单')) {
          $('#kzmaintable').tabs('close', '加单');
          $('#kzmaintable').tabs('add', {
            title: '加单',
            closable: true,
            plain: false,
            border: false,
            href: '../client/add_reception.jsp'
          });
        } else {
          $('#kzmaintable').tabs('add', {
            title: '加单',
            closable: true,
            plain: false,
            border: false,
            href: '../client/add_reception.jsp'
          });
        }
      } else {
        $.messager.show({ title: '系统提示', msg: '客单未找到！', timeout: 2000, showType: 'slide' });
      }
    },
    //收款btn回调函数
    getBill_receiptCallback: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        /*0:支付失败
            -1:该账单不存在
            -2:支付明细为空
            -3:匹配码不存在，请检查手机号是否正确
            -4:匹配码不正确
            -5:储值消费写入失败
            -6:积分消费写入失败	
          	
     * 			-7:该手机号不是客主会员
     * 			-8:查不到顾客信息
     * 			-9:查询不到用户注册商家信息
     * 			-10:查询不到消费商家信息
     * 			-11:储值余额不足
     * 			-12:未知操作者
     * 			-13:5分钟之内不允许重复操作*/
        //收款成功
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        //提示
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
        $('#getBill_receipt').dialog('close');
        return;
      }
      const resultCode = {
        '0': '操作失败！支付失败！',
        '-1': '操作失败！该账单不存在！',
        '-2': '操作失败！支付明细为空！',
        '-3': '操作失败！匹配码不存在，请检查手机号是否正确！',
        '-4': '操作失败！匹配码不正确！',
        '-5': '操作失败！储值消费写入失败！',
        '-6': '操作失败！积分消费写入失败！',
        '-7': '操作失败！该手机号不是客主会员！',
        '-8': '操作失败！未查到顾客信息！',
        '-9': '操作失败！未查询到宾客注册的商家信息！',
        '-10': '操作失败！未查询到消费商家信息！',
        '-11': '操作失败！余额不足！',
        '-12': '操作失败！未知操作者！',
        '-13': '操作失败！5分钟之内不允许重复操作！',
      };
      if (result < 0) {
        $.messager.show({ title: '系统提示', msg: resultCode[result + ''] ? resultCode[result + ''] : '操作失败！', timeout: 3000 });
        return;
      }
      /*if(result == -3){
        $.messager.show({title:'系统提示',msg:'匹配码不存在，请检查手机号是否正确！',timeout:3000});
        return;
      }
      if(result == -7){
        $.messager.show({title:'系统提示',msg:'该手机号不是客主会员！',timeout:3000});
        return;
      }
      if(result == -8){
        $.messager.show({title:'系统提示',msg:'未查询到宾客信息！',timeout:3000});
        return;
      }
      if(result == -9){
        $.messager.show({title:'系统提示',msg:'未查询到宾客注册的商家信息！',timeout:3000});
        return;
      }
      if(result == -10){
        $.messager.show({title:'系统提示',msg:'未查询到消费商家信息！',timeout:3000});
        return;
      }
      if(result == -11){
        $.messager.show({title:'系统提示',msg:'储值余额不足！',timeout:3000});
        return;
      }
      if(result == -12){
        $.messager.show({title:'系统提示',msg:'积分余额不足！',timeout:3000});
        return;
      }*/
      /*-8:查不到顾客信息
       *			-9:查询不到用户注册商家信息
       *			-10:查询不到消费商家信息
       *			-11:储值余额不足
       *			-12:积分余额不足*/
      $.messager.show({ title: '系统提示', msg: '操作失败！' + result, timeout: 3000 });
    },
    //从收款详情获取信息 并提交到收款接口
    getBillHandler_getReceipt: function (value) {
      if (Bill.receptionid == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000 });
        return;
      }
      var paymentListArr = [];
      var paymentListDate = {};
      var paymentDate = {};
      //-----
      var payInfo = eapor.utils.getPayIdAndName('ipt_paymethodId_receipt');
      paymentListDate.paymethodName = payInfo.paymethodName;
      paymentListDate.paymethodCode = payInfo.paymethodCode;
      if (payInfo.hasOwnProperty("creditChannelId")) {
        paymentListDate.creditChannelId = payInfo.creditChannelId
      }

      var amount = $('#ipt_amount_receipt').textbox('getValue');//支付金额
      if (amount == "") {
        $.messager.show({ title: '系统提示', msg: '支付金额不能为空！', timeout: 2000 });
        return;
      }
      if (value == 1) {
        paymentListDate.scene = "收款";
        paymentListDate.amount = (amount * 100).toFixed(0);
      } else if (value == 2) {
        paymentListDate.scene = "退款";
        paymentListDate.amount = (amount * (-100)).toFixed(0);
      }
      paymentListArr.push(paymentListDate);
      paymentDate.receptionId = Bill.receptionId;
      paymentDate.payments = JSON.stringify(paymentListArr);
      paymentDate.phone = $('#ipt_phone_receipt').numberbox('getValue');
      paymentDate.matchCode = $('#ipt_matchCode_receipt').textbox('getValue');
      console.info(paymentDate);
      eapor.utils.defaultAjax('../reception/addRentPayment', paymentDate, Bill.getBill_receiptCallback);
    },
    receiptBill: function (value) {//收款  退款
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000 });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({
          title: '系统提示', msg: '该账单已结账！', timeout: 2000
        });
        return;
      }
      $('#receiptBtn_receiptDiv').append(`
			<div id="getBill_receipt" style="padding:10px 0 0 30px;">
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
			/*validType:'mobilephone',
			required:false,
			delay:1000,
			validateOnCreate:false,//为true时在创建该组件时就进行验证
			validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/		});

      $('#ipt_matchCode_receipt').textbox({
			/*required:false,
			delay:1000,
			validateOnCreate:false,//为true时在创建该组件时就进行验证
			validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/		});

      var getBill_payFlag = 0;
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
              validType: 'mobilephone',
              required: true,
              delay: 1000,
              validateOnCreate: false,//为true时在创建该组件时就进行验证
              validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
            });
            $('#ipt_matchCode_receipt').textbox({
              required: true,
              delay: 1000,
              validateOnCreate: false,//为true时在创建该组件时就进行验证
              validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
            });
          } else {
            $('#hidden_div_getBill').show();
            $('#hidden_matchCode_getBill').hide();
            $('#hidden_phone_getBill').hide();
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
          }
        },
        groupFormatter: function (group) {
          if (eapor.data.PaymethodObj.length == getBill_payFlag) {
            getBill_payFlag += 1;
            return '代收';
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
      if (value == 1) {
        $('#getBill_receipt').dialog({
          title: '收款详情',
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
              console.info('type_:', type_);
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
                $('#ipt_matchCode_receipt').textbox('clear')
              }
              if (!$('#ipt_amount_receipt').textbox('isValid')) {
                $('#ipt_amount_receipt').textbox('textbox').focus();
                return;
              }
              Bill.getBillHandler_getReceipt(1);
            }
          }, {
            text: '取消',
            handler: function () {
              $('#getBill_receipt').dialog('close');
            }
          }]
        });
      } else if (value == 2) {
        $('#getBill_receipt').dialog({
          title: '退款详情',
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
              console.info('type_:', type_);
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
                $('#ipt_matchCode_receipt').textbox('clear')
              }
              if (!$('#ipt_amount_receipt').textbox('isValid')) {
                $('#ipt_amount_receipt').textbox('textbox').focus();
                return;
              }
              Bill.getBillHandler_getReceipt(2);
            }
          }, {
            text: '取消',
            handler: function () {
              $('#getBill_receipt').dialog('close');
            }
          }]
        })
      }
    },
    turnoutCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        //刷新数据
        //显示简讯、汇总
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        //显示明细
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        //提示
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
        $('#searchResult_banquetBill').dialog('close');
      } else {
        $.messager.show({
          title: '系统提示', msg: '操作失败！', timeout: 3000
        });
      }
    },
    turnoutBill: function () {//转出
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      const rows = $('#detail_getBill').datagrid('getData').rows;
      const total = $('#detail_getBill').datagrid('getData').total;
      const rows_folio = rows[0].folio;
      //循环判断是否为消费，有一个不是type为2 则 不能签单
      //总签单金额
      let countMoney = 0;
      if (total > 0) {
        let flag = false;
        for (let i = 0; i < total; i++) {
          console.info(rows[i]);
          if (rows[i].type != 2 && rows[i].type != 7) {
            flag = true;
            $.messager.show({ title: '系统提示', msg: '请先将要操作的消费项单独归为一个账页并单独显示！', timeout: 3000, height: 'auto' });
            break;
          }
          /*if(rows[i].type === 7){
            flag = true;
            $.messager.show({title:'系统提示',msg:'转入项不可再转出！',timeout: 3000,height:'auto'});
            break;
          }*/
          if (rows[i].consumeTypeId == 4) {
            flag = true;
            $.messager.show({ title: '系统提示', msg: '包价早餐不可转出！', timeout: 3000, height: 'auto' });
            break;
          }
          countMoney += rows[i].money;
        }
        if (flag) {
          return;
        } else {
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
            let
              onlySelectedOneRowFlag_banquentBill = 0,
              rowSelect_banquentBill = null;

            $('#receiptBtn_receiptDiv').append(`
						<div id="searchResult_banquetBill"><table id="table_serchResult"></table></div>
					`);
            const dialog = $('#searchResult_banquetBill');
            const table = $('#table_serchResult');
            table.datagrid({
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
                  const selected = table.datagrid('getSelected');
                  console.info(selected);
                  if (!selected) {
                    $.messager.show({ title: '系统提示', msg: '请选择客单！', timeout: 3000, showType: 'slide' });
                    return;
                  }
                  if (selected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
                    $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 3000, showType: 'slide' });
                    return;
                  }
                  const data = {
                    outReceptionId: Bill.receptionId,
                    receptionPageNumber: $('#selectReceptionPageNumber').combobox('getValue') == "" ||
                      $('#selectReceptionPageNumber').combobox('getValue') == "全部" ? 1 :
                      $('#selectReceptionPageNumber').combobox('getValue'),
                    inReceptionId: selected.receptionId,
                    intinrtype: selected.receptionType,//转入方账单的receptionType
                    intoutrtype: 1//转出方账单的receptionType
                  };

                  if (data.outReceptionId == data.inReceptionId && selected.receptionType != 3) {
                    $.messager.show({ title: '系统提示', msg: '转入方不能与转出方相同！', timeout: 3000, showType: 'slide' });
                    return;
                  }
                  if (selected.roomId) {
                    Bill.turnInRoomId = selected.roomId;
                  }
                  eapor.utils.defaultAjax('../reception/transferConsume', data, Bill.turnoutCallBack);
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
      }
    },
    signupCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        //刷新数据
        //显示简讯、汇总
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        //显示明细
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);

        $('#signupBillInfo').dialog('close');
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000, showType: 'slide' });
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
        return;
      }
    },
    signupHandler_getBill: function (parametData) {
      var signupData = {
        receptionId: Bill.receptionId,
        receptionPageNumber: parametData.pageNumberForSignup,	//账页编号，>=1
        channelId: parametData.channelForSignup,	//协议单位的客源id
        amount: (parametData.amountForSignup * 100).toFixed(0),	//签单金额
        remark: parametData.remarkForSignup,	//备注
        scene: parametData.scene	//场景
      };
      eapor.utils.defaultAjax(parametData.signupUrl, signupData, Bill.signupCallBack);
    },
    signBill: function (value) {//签单、免单
      console.info('value:', value);
      const tip = value === 1 ? '签单' : '免单';
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      var rows = $('#detail_getBill').datagrid('getData').rows;
      var total = $('#detail_getBill').datagrid('getData').total;
      var rows_folio = rows[0].folio;
      //循环判断是否为消费，有一个不是type为2 则 不能签单
      //总签单金额
      var countMoney = 0;
      if (total > 0) {
        let flag = false;
        for (let i = 0; i < total; i++) {
          if (rows[i].type != 2 && rows[i].type != 7) {
            flag = true;
            $.messager.show({ title: '系统提示', msg: '请先将要操作的消费项单独归为一个账页并单独显示！', timeout: 2800, height: 'auto' });
            break;
          }
          /*if(rows[i].type === 7){
            flag = true;
            if(value == 1){
              $.messager.show({title:'系统提示',msg:'转入项不可签单！',timeout:2800,height:'auto'});
            }else{
              $.messager.show({title:'系统提示',msg:'转入项不可免单！',timeout:2800,height:'auto'});
            }
            break;
          }*/
          console.info(rows[i].consumeTypeId);
          if (rows[i].consumeTypeId == 4) {
            flag = true;
            $.messager.show({ title: '系统提示', msg: '包价早餐不可' + tip + '！', timeout: 3000, height: 'auto' });
            break;
          }
          countMoney += rows[i].money;
        }
        if (flag) {
          return;
        } else {
          if (value == 1) {
            //显示dialog
            $('#receiptBtn_receiptDiv').append(`
						<div id="signupBillInfo" style="padding:30px 0 0 30px;">
							<div style="padding:10px 0 0 20px;">
								<span>请选择签单单位：</span>
									<input style="width:130px;"  id="selectChannelForSignup_getBill"/><br/><br/>
									<span id="showAmount">
									签单金额 ￥：<span id="pageAmount_forSignup"></span>
								</span>&nbsp;&nbsp;&nbsp;&nbsp;
								<span id="showBalanceForSignup" style="display:none;">
									信用余额 ￥：<span id="channelBalance_forSignup"></span>
								</span><br/><br/>
								<input id="remark_forSignup" style="width:200px;" label="备注：" 
									labelWidth="70px" labelAlign="right" />
							</div>
						</div>
					`);
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
                for (let i = 0; i < data.length; i++) {
                  if (data[i].creditAvailable > 0) {
                    value.rows[x++] = data[i];
                  }
                }
                return value.rows;
              }

            })

            $('#pageAmount_forSignup').text(NP.divide(countMoney, 100));
            $('#remark_forSignup').textbox({ multiline: true });

            $('#signupBillInfo').dialog({
              title: '签单设置',
              width: 340,
              height: 290,
              closed: false,
              cache: false,
              modal: true,
              buttons: [{
                text: '确定',
                handler: function () {
                  const channelForSignup = $('#selectChannelForSignup_getBill').combobox('getValue');
                  if (channelForSignup == "") {
                    $.messager.show({ title: '系统提示', msg: '请选择单位！', timeout: 3000, showType: 'slide' });
                    return;
                  }
                  const [amountForSignup, at] = [$('#pageAmount_forSignup').text(),
                  $('#channelBalance_forSignup').text()];
                  if (Number(amountForSignup) > Number(at)) {
                    $.messager.show({ title: '系统提示', msg: '签单金额不能超过余额！', timeout: 3000, showType: 'slide' });
                    return;
                  }
                  const parametData = {
                    channelForSignup: channelForSignup,
                    pageNumberForSignup: rows_folio,
                    amountForSignup: amountForSignup,
                    remarkForSignup: $('#remark_forSignup').textbox('getValue'),
                    scene: "签单",
                    signupUrl: "../reception/payOnChannelCredit"
                  };
                  Bill.signupHandler_getBill(parametData);
                }
              }, {
                text: '取消',
                handler: function () {
                  $('#signupBillInfo').dialog('close');
                }
              }],
              onClose: function () {
                $(this).dialog('destroy');
              }
            })
          } else if (value == 2) {
            $.messager.prompt('系统提示', '您确定要进行免单操作吗？可在此输入免单备注！', function (r) {
              var freeAmount = 0;
              for (let i = 0; i < rows.length; i++) {
                freeAmount += rows[i].money;
              }
              if (r) {
                var data = {
                  amount: freeAmount,//金额
                  receptionId: Bill.receptionId,
                  receptionPageNumber: rows[0].folio,
                  remark: r,//备注
                  scene: "免单"//场景
                };
                eapor.utils.defaultAjax("../reception/payOnFreeConsume", data, Bill.signupCallBack);
              } else if (r == "") {
                var data_ = {
                  amount: freeAmount,//金额
                  receptionId: Bill.receptionId,
                  receptionPageNumber: rows[0].folio,
                  remark: "",//备注
                  scene: "免单"//场景
                };
                eapor.utils.defaultAjax("../reception/payOnFreeConsume", data_, Bill.signupCallBack);
              }
            });
          }
        }
      }
    },
    badCallBack_: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        //刷新数据
        //显示简讯、汇总
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        //显示明细
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);

        $('#badBillDialog').dialog('close');
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000, showType: 'slide' });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });

    },
    badBill: function () {//坏账
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      $('#editPageNumberDiv_getBill').append(
        '<div style="padding:15px 0 0 25px;" id="badBillDialog">' +
        '<span style="color:red;">*</span><span>坏账金额：</span>' +
        '<input  id="badAmount" style="width:130px;"/><br><br>' +
        '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注:&nbsp;&nbsp;</span>' +
        '<textarea  rows="3" cols="15" style="resize:none;" id="badBillRemark"></textarea>' +
        '</div>'
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
      $('#badBillDialog').dialog({
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
            var r = $('#badAmount').textbox('getValue');
            if (r == 0 || r < 0 || r == "") {
              $.messager.show({ title: '系统提示', msg: '操作失败！金额需大于0！', timeout: 2000 });
            } else {
              var url = '../reception/payOnBadDebt';
              var data = {
                receptionId: Bill.receptionId,
                amount: (r * 100).toFixed(0),//金额
                remark: $('#badBillRemark').val(),//备注
                scene: "坏账"//场景
              };
              eapor.utils.defaultAjax(url, data, Bill.badCallBack_);
            }
          }
        }, {
          text: '取消',
          handler: function () {
            $('#badBillDialog').dialog('close');
          }
        }]
      })
    },
    cencelBillBtn_all: function (folio, url, scene) {
      $.messager.prompt('系统提示', '您确定要撤销该项吗？可在此输入备注！', function (r) {
        if (r) {
          var data = {
            receptionId: Bill.receptionId,
            receptionPageNumber: folio,
            remark: r,//备注
            scene: scene//场景
          };
          console.info(data);
          eapor.utils.defaultAjax(url, data, Bill.signupCallBack);
        } else if (r == "") {
          var data = {
            receptionId: Bill.receptionId,
            receptionPageNumber: folio,
            remark: "",//备注
            scene: scene//场景
          };
          console.info(data);
          eapor.utils.defaultAjax(url, data, Bill.signupCallBack);
        }
      });
    },
    undoTransferConsumeCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000, showType: 'slide' });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
    },
    cancelBill: function () {//撤销
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState == 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '该账单已结账！', timeout: 2000 });
        return;
      }
      var rows = $('#detail_getBill').datagrid('getData').rows;
      var total = $('#detail_getBill').datagrid('getData').total;
      if (total > 0) {
        var flag = undefined;
        for (let i = 1; i < total; i++) {
          if (rows[0].folio != rows[i].folio) {
            flag = false;
          }
        }
        if (flag == false) {
          $.messager.show({ title: '系统提示', msg: '请先选择要撤销的账页！', timeout: 2000 });
          return;
        } else {
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
          if (rows[total - 1].type == 5 || rows[0].type == 5) {//免单撤销
            Bill.cencelBillBtn_all(rows[total - 1].folio, '../reception/undoPayOnFreeConsume', "免单撤销");
          } else if (rows[total - 1].type == 4) {//坏账撤销
            Bill.cencelBillBtn_all(rows[total - 1].folio, '../reception/undoPayOnBadDebt', "坏账撤销");
          } else if (rows[total - 1].type == 3 || rows[0].type == 3) {//签单撤销
            var b = 0;
            for (let i = 0; i < rows.length; i++) {
              if (rows[i].consumeItemId != undefined) {
                break;
              }
              b += 1;
              if (b == rows.length) {
                $.messager.show({ title: '系统提示', msg: '签单撤销操作无效！请选择含有消费项的账页进行签单撤销操作！', timeout: 5000 });
                return;
              }
            }
            Bill.cencelBillBtn_all(rows[total - 1].folio, '../reception/undoPayOnChannelCredit', "签单撤销");
          } else if (rows[total - 1].type == 6) {//转出撤销
            /*$.messager.confirm('系统提示','您确认要撤销该转出的消费项吗？',function(r){    
                if (r){
                  let data = {};
                  data.consumeTransferId = rows[total-1].consumeTransferId;
                  eapor.utils.defaultAjax('../reception/undoTransferConsume',data,Bill.undoTransferConsumeCallBack);
                }    
            });*/
            $.messager.show({ title: '系统提示', msg: '无效的操作！转出项不可撤销！', timeout: 3000 });
          } else {
            $.messager.show({ title: '系统提示', msg: '无效的操作！', timeout: 3000 });
          }
        }
      } else {
        $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 3000 });
      }
    },
    //修改支付详情账单页的回调函数
    editPaymentDetailsPageNumberCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        $.messager.show({ title: '系统提示', msg: '修改成功!', timeout: 2000, showType: 'slide' });
        $('#div_getBill').dialog('close');
        return;
      }
      $.messager.show({ title: '系统提示', msg: '修改失败!', timeout: 2000, showType: 'slide' });
    },
    editDetalisPageNumber: function (row) {
      $.ajax({
        type: 'post',
        url: '../consume/getMaxReceptionPageNumber',//得到当前最大账页数量
        data: { receptionId: Bill.receptionId },
        dataType: 'json',
      })
        .done(function (ajaxResult) {
          console.info('ajaxResult:', ajaxResult)
          //根据当前最大账页数限制可以设置的最大账页数【当前最大账页数+1】
          $('#editPageNumberDiv_getBill').append(
            '<div id="div_getBill" style="padding:20px 0 0 30px;">' +
            '<span>请输入修改后的账页号：</span>' +
            '<input style="width:130px;"  id="setEditPageNumber_getBill"/>' +
            '</div>'
          );
          $('#setEditPageNumber_getBill').numberspinner({
            max: Number(ajaxResult) + Number(1),
            editable: false,
            value: row.folio,
            onChange(newValue, oldValue) {
              if (newValue == 0) {
                $('#setEditPageNumber_getBill').numberspinner('setValue', Number(ajaxResult) + Number(1));
              }
            }
          });
          $('#div_getBill').dialog({
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
                var newPageNumber = $('#setEditPageNumber_getBill').numberspinner('getValue');
                var lockPageNumberListArr = $.ajax({
                  type: 'post',
                  url: '../reception/getLockedReceptionPageList',
                  data: { receptionId: Bill.receptionId },
                  dataType: "json",
                  async: false
                }).responseJSON;
                for (let i = 0; i < lockPageNumberListArr.length; i++) {
                  if (newPageNumber == lockPageNumberListArr[i]) {
                    $.messager.show({ title: '系统提示', msg: '该账页已锁定！请选择其他数字！', timeout: 2000 });
                    return;
                  }
                }
                if (newPageNumber != "") {
                  if (row.type == 1) {//支付
                    if (row.folio != undefined && row.paymentId != undefined) {
                      var data_payment = {};
                      data_payment.paymentId = row.paymentId;
                      data_payment.receptionPageNumber = Number(newPageNumber);//row.folio;
                      var url_payment = '../payment/modifyPaymentDetailPageNumber';
                      eapor.utils.defaultAjax(url_payment, data_payment, Bill.editPaymentDetailsPageNumberCallBack);
                    } else {
                      $.messager.show({ title: '系统提示', msg: '修改支付账页参数有误!', timeout: 2000, showType: 'slide' });
                      return;
                    }
                  } else if (row.type == 2 || row.type == 7) {//消费
                    if (row.folio != undefined && row.consumeItemId != undefined) {
                      var data_consume = {
                        consumeDetailId: row.consumeItemId,
                        receptionPageNumber: Number(newPageNumber),//row.folio;
                        detailGenre: row.detailGenre
                      };
                      var url_consume = '../consume/modifyConsumeDetailPageNumber';
                      eapor.utils.defaultAjax(url_consume, data_consume, Bill.editPaymentDetailsPageNumberCallBack);
                    } else {
                      $.messager.show({ title: '系统提示', msg: '修改消费账页参数有误!', timeout: 2000, showType: 'slide' });
                      return;
                    }
                  }
                } else {
                  $.messager.show({ title: '系统提示', msg: '输入不能为空!', timeout: 2000, showType: 'slide' });
                  return;
                }
              }
            }, {
              text: '取消',
              handler: function () {
                $('#div_getBill').dialog('close');
              }
            }]
          });
        });
    },
    editPageNumber: function () {//编辑账页
      var selected = $('#detail_getBill').datagrid('getSelected');
      if (!selected) {
        $.messager.show({ title: '系统提示', msg: '请先选择要编辑的账页！', timeout: 2000, showType: 'slide' });
        return;
      } else {
        if (selected.type == 3 || selected.type == 4 || selected.type == 6 || selected.type == 5 || selected.lockFolio == 1) {
          $.messager.show({ title: '系统提示', msg: '该账页不可编辑！', timeout: 2000, showType: 'slide' });
          return;
        } else {
          Bill.editDetalisPageNumber(selected);
        }
      }
    },
    //编辑简讯提交回调函数
    editShortInfoCallBack: function (result) {
      eapor.clickFlag = true;
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $('#briefInfo').datagrid('updateRow', {
          index: 0,
          row: {
            guestName: $('#editGuestName_getBill').textbox('getValue'),
            remark: $('#editRemark_getBill').textbox('getValue')
          }
        });
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000, showType: 'slide' });
        $('#div').dialog('close');
        return;
      }
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
    },
    //编辑简讯
    editShortInfo: function () {
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      $('#receiptBtn_receiptDiv').append(
        '<div id="div" style="padding:25px 0 0 35px;">' +
        '<div style="margin-bottom:10px">' +
        '<input id="editGuestName_getBill"  style="width:200px;"' +
        'label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
        '</div>' +
        '<div style="margin-bottom:0px">' +
        '<input id="editRemark_getBill"  style="width:200px;"' +
        'label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
        '</div>' +
        '</div>'
      );
      $('#editGuestName_getBill').textbox({});
      $('#editRemark_getBill').textbox({ multiline: true });
      var name = $('#briefInfo').datagrid('getRows')[0].guestName;
      var remark = $('#briefInfo').datagrid('getRows')[0].remark;
      $('#editGuestName_getBill').textbox('setValue', name);
      $('#editRemark_getBill').textbox('setValue', remark);
      $('#div').dialog({
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
            if (eapor.clickFlag != true) {
              return;
            }
            var data = {
              receptionId: Bill.receptionId,
              guestName: $('#editGuestName_getBill').textbox('getValue'),
              guaranteeAmount: null,
              comment: $('#editRemark_getBill').textbox('getValue')
            }
            eapor.clickFlag = false;
            eapor.utils.defaultAjax('../reception/editReception', data, Bill.editShortInfoCallBack);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#div').dialog('close');
          }
        }]
      })
    },
    //反结账回调函数
    cancelGetBillCallBack: function (result) {
      eapor.clickFlag = true;
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000 });
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000 });
      }
    },
    //反结账
    cancelGetBill: function () {
      if (Bill.receptionId == "") {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 2000, showType: 'slide' });
        return;
      }
      if ($('#briefInfo').datagrid('getData').rows[0].receptionState != 2) {//判断账单是否关闭
        $.messager.show({ title: '系统提示', msg: '操作无效！该账单未结账！', timeout: 2000 });
        return;
      }
      $.messager.confirm('系统提示', '您确认要将该已结账单修改为未结账单吗？', function (r) {
        if (r) {
          if (eapor.clickFlag != true) {
            return;
          }
          eapor.clickFlag = false;
          eapor.utils.defaultAjax('../reception/undoCheckout', { receptionId: Bill.receptionId }, Bill.cancelGetBillCallBack);
        }
      });
    },
    printBill: function () {//打印
      if (!Bill.receptionId) {
        $.messager.show({ title: '系统提示', msg: '请先选择宾客账单！', timeout: 3000, showType: 'slide' });
        return;
      }
      var page = $('#selectReceptionPageNumber').combobox('getValue');
      if (page == "") {
        page = 0;
      }
      $('#editPageNumberDiv_getBill').append(`
				<div id="div" style="padding:20px 0 0 30px;">
					<label>请选择打印类型模板：<input id="selectPrintType_getBill" style="width:130px;"/></label>
				</div>
			`);
      $('#selectPrintType_getBill').combobox({
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
              const type = $('#selectPrintType_getBill').combobox('getValue');
              console.info(type);
              if (+type === 1) {
                pfunction(Bill.receptionId, page, Bill.roomId, Bill.guestId);
                dialog.dialog('close');
              } else if (+type === 2) {
                pfunctionSmall(Bill.receptionId, page, Bill.roomId, Bill.guestId);
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
    },
    //选择账页 得到对应账页的明细
    selectReceptionPageNumberCombobox: function () {
      var dataArr_ = [];
      var comboboxLoader_getBill = function () {//param,success,error
        if (Bill.receptionId != "") {
          dataArr_ = [];
          for (let i = 0; i < Bill.getBillNumberPageDetailsInfo.length; i++) {
            if (dataArr_.indexOf(Bill.getBillNumberPageDetailsInfo[i].folio) == -1) {
              dataArr_.push(Bill.getBillNumberPageDetailsInfo[i].folio);
            }
          }
          if (dataArr_[0] == undefined) {
            return;
          }
          if (dataArr_[0].id != 0) {
            var len = Number(dataArr_.length) + Number(1);
            var arr_ = [];
            var data = {};
            for (let i = 0; i < len; i++) {
              if (i == 0) {
                data.id = 0;
                data.text = "全部";
              } else {
                data.id = dataArr_[i - 1];
                data.text = dataArr_[i - 1];
              }
              arr_.push(data);
              data = {};
            }
            let a = arr_.sort(eapor.utils.compareSmallToBig('id'));
            return a;
          }
          let b = dataArr_.sort(eapor.utils.compareSmallToBig('id'))
          return b;
        }
      };
      $('#selectReceptionPageNumber').combobox({
        valueField: 'id',
        textField: 'text',
        data: comboboxLoader_getBill(),
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onChange: function (newValue, oldValue) {
          if (newValue == 0) {
            $('#detail_getBill').datagrid('loadData', Bill.getBillNumberPageDetailsInfo);
            $('#detail_getBill').datagrid('reload');
          } else {
            let arrValue = Bill.getBillNumberPageDetailsInfo.filter(function (item) {
              return newValue == item.folio;
            });
            console.info(arrValue);
            //1 支付 2 消费 3 签单 4 坏账 5 免单 6 转出 7转入
            for (let i = 0; i < arrValue.length; i++) {
              if (arrValue[i].type == 1) {
                arrValue[i].typename = "支付";
              }
              if (arrValue[i].type == 2) {
                arrValue[i].typename = "消费";
              }
              if (arrValue[i].type == 3) {
                arrValue[i].typename = "签单";
              }
              if (arrValue[i].type == 4) {
                arrValue[i].typename = "坏账";
              }
              if (arrValue[i].type == 5) {
                arrValue[i].typename = "免单";
              }
              if (arrValue[i].type == 6 || arrValue[i].type == 7) {
                arrValue[i].typename = "转移";
              }
            }
            $('#detail_getBill').datagrid('loadData', arrValue);
            $('#detail_getBill').datagrid('reload');
          }
        }
      });
    }
  }
  Bill.initBill();

  if (eapor.data.exitRoomAndGetBill != "") {//从退房JSP 退房并结账按钮  进入到宾客账单 的情况
    var UexitRoomAndGetBill;
    UexitRoomAndGetBill = JSON.parse(eapor.data.exitRoomAndGetBill);
    eapor.data.exitRoomAndGetBill = "";

    Bill.receptionId = UexitRoomAndGetBill.receptionId;//收款Btn存的receptionId 取过不清空 + 结账Btn
    sessionStorage.setItem('Bill_reception', UexitRoomAndGetBill.receptionId);
    Bill.roomCode = UexitRoomAndGetBill.roomCode;//收款Btn存的roomCode 取过不清空
    console.info("----2035---")
    eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
    eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
  } else {
    var getBillData = $('#getBillData').val();
    var pubData = $('#index_pubRoomData').val();
    console.info(pubData);
    $('#index_pubRoomData').val("");//清空房态图鼠标点击宾客账单时 存的信息
    if (pubData == "") {
      return;
    } else {
      let pub = JSON.parse(pubData);
      Bill.receptionId = pub.receptionId;
      sessionStorage.setItem('Bill_reception', pub.receptionId);
      Bill.roomCode = pub.roomName;
      console.info('2090-line-Bill.roomCode:', Bill.roomCode);
      eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
      eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
    }
    if (getBillData == "") {
      return;
    }
  }

  //用于index.js 调用
  eapor.utils.setBillReceptionIdRoomCode = function (id, code) {
    console.info('code****:', code);
    Bill.receptionId = id;
    Bill.roomCode = code || "";
  }
  eapor.utils.shortInfoAndPoolCallBack = function (result) {
    shortInfoAndPoolCallBack(result);
  }
  eapor.utils.detailsCallBack = function (result) {
    detailsCallBack(result);
  }
  eapor.utils.Bill = Bill;
	/**
	 * 加单js调用
	 * 说明：当加单提交后，若宾客账单的receptionId于加单页面的receptionId相同，则对宾客账单里的汇总、简讯信息进行刷新
	 */
  eapor.utils.refreshGetBillInfoForAddReception = function (param) {
    if (param.receptionId && param.receptionId === Bill.receptionId) {
      if (param.refreshType && param.refreshType === 'shortInfo') {
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
      }
      if (param.refreshType && param.refreshType === 'shortInfoAndDetail') {
        eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: Bill.receptionId }, shortInfoAndPoolCallBack);
        eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: Bill.receptionId }, detailsCallBack);
      }
    }
  }
})(window.eapor);