/**
 *@JSname:新建预订
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_scheduledNew");
  //计算总房价
  function getRoomPriceCallback(data) {
    var total = 0;//预计房价
    $.each(data.actualPriceList, function (i, item) {
      total += item;
    });
    //入住房费预期
    var checkRoomNumber = $('#ipt_checkRoomNumber_scheduled_new').numberspinner('getValue');
    $('#ipt_expectedRentAmount_scheduled_new').textbox('setValue', NP.divide(total * checkRoomNumber, 100));
  }
  //changeFunction
  function getCountRoomPriceByChange(arg) {
    if (arg.roomNum) {
      var amount = $('#ipt_expectedRentAmount_scheduled_new').textbox('getValue');
      if (amount == "") {
        return;
      } else {
        $('#ipt_expectedRentAmount_scheduled_new').textbox('setValue', amount / arg.oldValue * arg.roomNum);
        return;
      }
      return;
    }

    var data = {
      roomType: arg.roomType || $('#ipt_checkRoomType_scheduled_new').combobox('getValue'),
      checkInType: arg.checkInType || $('#ipt_checkInType_scheduled_new').combobox('getValue'),
      checkInTime: arg.checkInTime || $('#ipt_checkInDate_scheduled_new').datebox('getValue'),
      stayDay: arg.stayDay || $('#ipt_stayDay_scheduled_new').numberspinner('getValue'),
    };
    if (arg.checkInTime || arg.stayDay || arg.checkInType) {
      console.info(data.checkInTime);
      if (data.checkInTime == "") {
        return;
      }
      var endTime = "";
      if (data.checkInType == 1) {
        endTime = getDateForRoomOpen(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + NP.times(86400000, data.stayDay));
        $('#ipt_outTime_scheduled_new').datetimebox('setValue', endTime);
      } else if (data.checkInType == 2) {
        endTime = getDate(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + JSON.parse($('#index_ruleData').val()).restHour * 360000 * data.stayDay);
        $('#ipt_outTime_scheduled_new').datetimebox('setValue', endTime);
      } else {
        endTime = getDateForRoomOpen(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + NP.times(86400000 * data.stayDay));
        $('#ipt_outTime_scheduled_new').datetimebox('setValue', endTime);
      }
    }
    var is = false;
    for (let k in data) {
      if (data[k] == "") {
        is = true;
        break;
      }
    }
    if (is) {
      return;
    }
    var subDate = {};
    subDate.startDateTime = data.checkInTime;
    subDate.roomtypeId = data.roomType;//房型id
    subDate.checkinType = data.checkInType;
    if (subDate.checkinType == 1 || subDate.checkinType == 3) {
      subDate.increment = 1;
    } else {
      subDate.increment = JSON.parse($('#index_ruleData').val()).restHour;
    }
    subDate.rentplanId = JSON.parse($('#hidden_rentplanId_schedluedNew').val()).rentplanId;;
    subDate.expectedStay = data.stayDay;
    subDate.receptionId = 0;
    console.info(subDate)
    eapor.utils.defaultAjax("../reception/calculateRentAmount", subDate, getRoomPriceCallback);
  }

  //生成dialogHtml
  function createDivHtml() {
    $('#showSearchScheduledGuestList_new').append(
      '<div id="divDialog" style="padding:15px 0 0 40px;">' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkRoomType_scheduled_new" style="width:230px;"' +
      'label="房型选择：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkRoomNumber_scheduled_new" style="width:230px;"' +
      'label="房间数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkChannel_scheduled_new" style="width:230px;"' +
      'label="客源：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkInType_scheduled_new" style="width:230px;"' +
      'label="入住类型：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkInDate_scheduled_new" style="width:230px;"' +
      'label="入住日期：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_stayDay_scheduled_new" style="width:230px;"' +
      'label="计划居住：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_outTime_scheduled_new" style="width:230px;"' +
      'label="计划离店：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_expectedRentAmount_scheduled_new" style="width:230px;"' +
      'label="房费：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_reservePerson_scheduled_new" style="width:230px;"' +
      'label="预订人姓名：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:0px">' +
      '<input id="ipt_reserveMobile_scheduled_new" style="width:230px;"' +
      'label="联系手机：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '</div>'
    );
    //房型选择
    $('#ipt_checkRoomType_scheduled_new').combobox({
      url: '../roomtype/getRoomtypeForSearch',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ roomType: newValue });
        }
      },
      onLoadSuccess: function (data) {
        if (data.length > 　0) {
          $(this).combobox('setValue', data[0].roomtypeId);
          $(this).combobox('setText', data[0].roomtypeName);
        }
      }
    });
    //房间数量
    $('#ipt_checkRoomNumber_scheduled_new').numberspinner({
      min: 1,
      max: 99,
      editable: false,
      value: '1',
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ roomNum: newValue, oldValue: oldValue });
        }
      }
    });
    //客源
    $('#ipt_checkChannel_scheduled_new').combobox({
      url: '../channel/pglist',
      queryParams: { limit: 9999, offset: 0, sourceGroupId: 0, channelName: '', usageState: 1 },
      valueField: 'channelId',
      textField: 'channelName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (rec) {
        var data = {};
        data.rentplanId = rec.rentplanId;
        data.sourceGroupId = rec.sourceGroupId;
        data.channelId = rec.channelId;
        $('#hidden_rentplanId_schedluedNew').val(JSON.stringify(data));
      },
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ channelId: newValue });
        }
      },
      onLoadSuccess: function (comdata) {
        if (comdata.length > 0) {
          $.each(comdata, function (i, item) {
            if (item.hasOwnProperty("channelName") && item.channelName == '非会员') {
              $('#ipt_checkChannel_scheduled_new').combobox('setValue', item.channelId);
              $('#ipt_checkChannel_scheduled_new').combobox('setText', item.channelName);
              var data = {};
              data.rentplanId = item.rentplanId;
              data.sourceGroupId = item.sourceGroupId;
              data.channelId = item.channelId;
              $('#hidden_rentplanId_schedluedNew').val(JSON.stringify(data));
              return;
            }
          });
        }
      }
    });
    //入住类型   点击新建预订单 按钮 时  若 当前时间未到预订晚房时间 则 不显示 晚房的选项
    var lrt = JSON.parse($('#index_ruleData').val()).lateRoomTime;
    var nd = new Date();
    var gfy = nd.getFullYear();
    var gm = nd.getMonth() + 1;
    var gd = nd.getDate();
    if (gm < 10) {
      gm = "0" + gm;
    }
    if (nd.getTime() < (new Date(gfy + "-" + gm + "-" + gd + " " + lrt).getTime())) {
      $('#ipt_checkInType_scheduled_new').combobox({
        data: [{
          "id": 1,
          "text": "全日房",
          "selected": true
        }, {
          "id": 2,
          "text": "钟点房"
        }],
        valueField: 'id',
        textField: 'text'
      });
    } else {
      $('#ipt_checkInType_scheduled_new').combobox({
        data: [{
          "id": 1,
          "text": "全日房",
          "selected": true
        }, {
          "id": 2,
          "text": "钟点房"
        }, {
          "id": 3,
          "text": "晚房"
        }],
        valueField: 'id',
        textField: 'text'
      });
    }
    $('#ipt_checkInType_scheduled_new').combobox({
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ checkInType: newValue });
        }
      }
    });
    //计划居住
    $('#ipt_stayDay_scheduled_new').numberspinner({
      required: true,
      validType: 'minLength[1]',
      min: 1,
      editable: false,
      value: '1',
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ stayDay: newValue });
        }
      }
    });
    //计划离店
    $('#ipt_outTime_scheduled_new').datetimebox({
      editable: false
    });
    //房费
    $('#ipt_expectedRentAmount_scheduled_new').textbox({
      editable: false
    });
    //预订人姓名
    $('#ipt_reservePerson_scheduled_new').textbox({
      required: true,
      delay: 1000,
      //				validType:'name',
      missingMessage: "姓名不能为空！",
      //				invalidMessage:"姓名请输入中文或英文",
      validateOnCreate: false,
      validateOnBlur: true
    });
    //联系手机
    $('#ipt_reserveMobile_scheduled_new').numberbox({
      required: true,
      validType: 'mobilephone',
      missingMessage: "手机号码不能为空！",
      invalidMessage: "手机号码格式不正确！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    //入住日期
    $('#ipt_checkInDate_scheduled_new').datebox({
      editable: false,
      onChange: function (newValue, oldValue) {
        if (newValue == "") {
          $('#ipt_outTime_scheduled_new').datetimebox('setValue', "");
          $('#ipt_expectedRentAmount_scheduled_new').textbox('setValue', "");
          $('#ipt_stayDay_scheduled_new').numberspinner('setValue', 1);
          return;
        }
        getCountRoomPriceByChange({ checkInTime: newValue });
      },
      formatter: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var nowGetTime = new Date().getTime();
        if (m < 10) {
          m = "0" + m;
        }
        if (d < 10) {
          d = "0" + d;
        }
        var time = y + "-" + m + "-" + d;
        if (((new Date(time.replace(/-/g, "/")).getTime() + 57600000) < nowGetTime) && ((new Date(time.replace(/-/g, "/")).getTime() + 86400000) > nowGetTime)) {
          console.info(nowTimeAddNHour())
          return nowTimeAddNHour();//得到当前时间 加 三小时 的日期格式
        } else {//当前时间未超过16：00预订的 情况下
          return y + "-" + m + "-" + d + " " + 18 + ":" + "00" + ":" + "00";
        }

      }
    });
    $('#ipt_checkInDate_scheduled_new').datebox().datebox('calendar').calendar({
      validator: function (date) {
        var now = new Date();
        var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
        return d1 <= date && date <= d2;
      }
    });
  }
  //预订但不支付
  function orderNotPay(channelId, reservedetailListArr) {
    var createReserveDate = {};//总Date
    var paymentListDate = {};//预订项列表
    var paymentListArr = new Array();

    paymentListDate.paymethodCode = 1;
    paymentListDate.amount = 0;
    paymentListDate.paymethodName = "现金";
    paymentListDate.scene = "预订";
    paymentListArr.push(paymentListDate);

    createReserveDate.channelId = channelId;
    createReserveDate.reservedetailList = reservedetailListArr;//reservedetailList预定项列表
    createReserveDate.guaranteeAmount = 0;//guaranteeAmount担保金额
    createReserveDate.paymentList = JSON.stringify(paymentListArr);//paymentList支付明细
    createReserveDate.contact = "";//客主会员的姓名
    createReserveDate.memberPhone = "";//客主会员对应的phone
    $.ajax({
      type: 'post',
      url: '../reserve/createReserve',
      data: createReserveDate,
      dataType: 'json',
      success: function (data) {
        console.info(data);
        /* 0： 预订详情为空
 * -1：查询不到对应渠道id
 * -2：传入paymentList为空
 * -3：传入paymentList总金额为0
 * -4：预订房型数量不足
 * -10：并发*/
        if (data > 0) {
          $.messager.alert("系统提示", "创建订单成功！");
          $('#divDialog').dialog('close');
        } else if (data == -1) {
          $.messager.alert("系统提示", "创建订单失败！查询不到客源！");
        } else if (data == -2) {
          $.messager.alert("系统提示", "创建订单失败！" + data);
        } else if (data == -3) {
          $.messager.alert("系统提示", "创建订单失败！" + data);
        } else if (data === -4) {
          $.messager.alert("系统提示", "创建订单失败！预订房型数量不足！");
        } else {
          $.messager.alert("系统提示", "创建订单失败，所有房间已订出！");
        }
      }
    });
  }

  //预订支付
  function orderToPay(channelId, reservedetailListArr) {
    $('#showPaymethod_scheduledNew_div').append(
      '<div id="paydiv" style="padding:20px;">' +
      '<div style="margin-bottom:10px;">' +
      '<input id="ipt_paymethodId_scheduled_new"  style="width:220px;"' +
      'label="支付方式：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
      '</div>' +
      '<div>' +
      '<input id="ipt_amount_scheduled_new"  style="width:220px;"' +
      'label="支付金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
      '</div>' +
      '</div>'
    );
    var scheduledNew_payFlag = 0;
    $('#ipt_paymethodId_scheduled_new').combobox({
      valueField: 'paymethod_name',//paymethod_code
      textField: 'paymethod_name',
      data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
      editable: false,
      panelHeight: "auto",
      panelMaxHeight: 300,
      groupField: 'paymethod_name',
      groupFormatter: function (group) {
        if (eapor.data.PaymethodObj.length == scheduledNew_payFlag) {
          scheduledNew_payFlag += 1;
          return "代收";
        }
        scheduledNew_payFlag += 1;
      },
      onLoadSuccess: function (data) {
        console.info(data);
        if (data.length > 0) {
          var This = this,
            is = true;
          $.each(data, function (i, item) {
            if (item.paymethod_name == "现金") {
              $(This).combobox('setValue', item.paymethod_code);
              $(This).combobox('setText', item.paymethod_name);
              is = false;
              return;
            }
          });
          if (is) {
            $(This).combobox('setValue', data[0].paymethod_code);
            $(This).combobox('setText', data[0].paymethod_name);
          }
        }
      }
    });
    $('#ipt_amount_scheduled_new').textbox({
      value: '0',
      delay: 1000,
      required: true,
      validateOnCreate: false,
      validateOnBlur: true,
      validType: ['numMaxTwoDecimal', 'notZero']
    });
    var payDiv = $('#paydiv');
    payDiv.dialog({
      title: '订单支付',
      width: 300,
      height: 200,
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
            if (!$('#ipt_amount_scheduled_new').textbox('isValid')) {
              $('#ipt_amount_scheduled_new').textbox('textbox').focus();
              return;
            }
            //支付金额
            var createReserveDate = {};//总Date
            var paymentListDate = {};//预订项列表
            var paymentListArr = new Array();
            //-----
            var payInfo = eapor.utils.getPayIdAndName('ipt_paymethodId_scheduled_new');
            paymentListDate.paymethodName = payInfo.paymethodName;
            paymentListDate.paymethodCode = payInfo.paymethodCode;
            console.info(payInfo);
            if (payInfo.hasOwnProperty("creditChannelId")) {
              paymentListDate.creditChannelId = payInfo.creditChannelId
            }

            console.info(paymentListDate);

            //paymentListDate.paymethodCode = $('#ipt_paymethodId_scheduled_new').combobox('getValue');
            paymentListDate.amount = ($('#ipt_amount_scheduled_new').textbox('getValue') * 100).toFixed(0);
            //paymentListDate.paymethodName = $('#ipt_paymethodId_scheduled_new').combobox('getText');
            paymentListDate.scene = "预订";
            paymentListArr.push(paymentListDate);

            createReserveDate.channelId = channelId;
            createReserveDate.reservedetailList = reservedetailListArr;//reservedetailList预定项列表
            createReserveDate.guaranteeAmount = 0;//guaranteeAmount担保金额
            createReserveDate.paymentList = JSON.stringify(paymentListArr);//paymentList支付明细
            createReserveDate.contact = "";//客主会员的姓名
            createReserveDate.memberPhone = "";//客主会员对应的phone
            console.info(createReserveDate);
            $.ajax({
              type: 'post',
              url: '../reserve/createReserve',
              data: createReserveDate,
              dataType: 'json',
              success: function (data) {
                console.info(data);
                if (data > 0) {
                  $.messager.alert("系统提示", "创建订单成功！");
                  $('#divDialog').dialog('close');
                } else if (data == -1) {
                  $.messager.alert("系统提示", "创建订单失败！查询不到客源！");
                } else if (data == -2) {
                  $.messager.alert("系统提示", "创建订单失败！" + data);
                } else if (data == -3) {
                  $.messager.alert("系统提示", "创建订单失败！" + data);
                } else if (data === -4) {
                  $.messager.alert("系统提示", "创建订单失败！预订房型数量不足！");
                } else {
                  $.messager.alert("系统提示", "创建订单失败，所有房间已订出！！");
                }
              }
            });
          }
        }
        , {
          text: '取消',
          handler: function () {
            payDiv.dialog('close');
          }
        }
      ]
    })
  }
  //生成订单
  function generateOrders() {
    var expectedEnterTime = $('#ipt_checkInDate_scheduled_new').datebox('getValue');
    if (expectedEnterTime == "") {
      $.messager.show({
        title: '系统提示', msg: '入住时间不能为空！', timeout: 2800
      });
      return;
    }
    if (!$('#ipt_reservePerson_scheduled_new').textbox('isValid')) {
      $('#ipt_reservePerson_scheduled_new').textbox('textbox').focus();
      return;
    }
    if (!$('#ipt_reserveMobile_scheduled_new').numberbox('isValid')) {
      $('#ipt_reserveMobile_scheduled_new').numberbox('textbox').focus();
      return;
    }

    var hiddenRentplan = JSON.parse($('#hidden_rentplanId_schedluedNew').val());
    //客源
    var channelId = hiddenRentplan.channelId;

    var expectedRentAmount = $('#ipt_expectedRentAmount_scheduled_new').textbox('getValue');
    if (expectedRentAmount == 0) {
      $.messager.show({
        title: '系统提示', msg: '无此入住类型房间！生成订单失败！', timeout: 2800, showType: 'slide'
      });
      return;
    }

    //--------------------------------------------------------
    var reservedetailListDate = {};//预订项列表
    var reservedetailListArr = new Array();

    reservedetailListDate.channelId = channelId;
    reservedetailListDate.roomtypeId = $('#ipt_checkRoomType_scheduled_new').combobox('getValue');
    reservedetailListDate.roomNumber = $('#ipt_checkRoomNumber_scheduled_new').numberspinner('getValue');
    reservedetailListDate.sourceGroupId = hiddenRentplan.sourceGroupId;
    reservedetailListDate.checkinType = $('#ipt_checkInType_scheduled_new').combobox('getValue');
    reservedetailListDate.expectedEnterTime = expectedEnterTime;
    reservedetailListDate.expectedStayNumber = $('#ipt_stayDay_scheduled_new').numberspinner('getValue');
    reservedetailListDate.expectedRentAmount = (expectedRentAmount * 100).toFixed(0);
    reservedetailListDate.reservePerson = $('#ipt_reservePerson_scheduled_new').textbox('getValue');
    reservedetailListDate.reserveMobile = $('#ipt_reserveMobile_scheduled_new').numberbox('getValue');
    reservedetailListDate.remark = "";

    reservedetailListArr.push(reservedetailListDate);
    $.messager.confirm('系统提示', '是否进行预订支付？', function (r) {
      if (r) {
        orderToPay(channelId, JSON.stringify(reservedetailListArr));
      } else {
        orderNotPay(channelId, JSON.stringify(reservedetailListArr));
      }
    });
  }
  //加入购物车
  function addToShoppingCar() {
    var expectedEnterTime = $('#ipt_checkInDate_scheduled_new').datebox('getValue');
    if (expectedEnterTime == "") {
      $.messager.show({
        title: '系统提示', msg: '入住时间不能为空！', timeout: 2800
      });
      return;
    }
    if (!$('#ipt_reservePerson_scheduled_new').textbox('isValid')) {
      $('#ipt_reservePerson_scheduled_new').textbox('textbox').focus();
      return;
    }
    if (!$('#ipt_reserveMobile_scheduled_new').numberbox('isValid')) {
      $('#ipt_reserveMobile_scheduled_new').numberbox('textbox').focus();
      return;
    }

    var hiddenRentplan = JSON.parse($('#hidden_rentplanId_schedluedNew').val());

    var expectedRentAmount = $('#ipt_expectedRentAmount_scheduled_new').textbox('getValue');
    if (expectedRentAmount == 0) {
      $.messager.show({
        title: '系统提示', msg: '无此入住类型房间！生成订单失败！', timeout: 2800, showType: 'slide'
      });
      return;
    }

    var createReserveDate = {};//总Date
    var reservedetailListDate = {};//预订项列表
    var reservedetailListArr = new Array();
    var paymentListDate = {};//预订项列表
    var paymentListArr = new Array();

    paymentListArr.push(paymentListDate);

    reservedetailListDate.channelId = hiddenRentplan.channelId;
    reservedetailListDate.channelName = $('#ipt_checkChannel_scheduled_new').combobox('getText');
    var ipt_checkRoomType = $('#ipt_checkRoomType_scheduled_new');
    reservedetailListDate.roomtypeName = ipt_checkRoomType.combobox('getText');
    reservedetailListDate.roomtypeId = ipt_checkRoomType.combobox('getValue');
    reservedetailListDate.roomNumber = $('#ipt_checkRoomNumber_scheduled_new').numberspinner('getValue');
    reservedetailListDate.sourceGroupId = hiddenRentplan.sourceGroupId;
    reservedetailListDate.checkinType = $('#ipt_checkInType_scheduled_new').combobox('getValue');
    reservedetailListDate.expectedEnterTime = expectedEnterTime;
    reservedetailListDate.expectedStayNumber = $('#ipt_stayDay_scheduled_new').numberspinner('getValue');
    reservedetailListDate.expectedRentAmount = (expectedRentAmount * 100).toFixed(0);
    reservedetailListDate.reservePerson = $('#ipt_reservePerson_scheduled_new').textbox('getValue');
    reservedetailListDate.reserveMobile = $('#ipt_reserveMobile_scheduled_new').numberbox('getValue');
    reservedetailListDate.remark = "";

    if ($('#tab_createScheduled').datagrid('getRows').length > 0) {
      $.each($('#tab_createScheduled').datagrid('getRows'), function (i, item) {
        reservedetailListArr.push(item);
      })
    }
    reservedetailListArr.push(reservedetailListDate);
    $('#tab_createScheduled').datagrid("loadData", reservedetailListArr);
    $('#divDialog').dialog('close');
  }
  //新建
  function showCreateScheduledDiv() {
    createDivHtml();
    var divDialog = $('#divDialog');
    divDialog.dialog({
      title: '新建预订单',
      width: 350,
      height: 470,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '生成订单',
          handler: function () {
            generateOrders();
          }
        }, {
          text: '加入购物车',
          handler: function () {
            addToShoppingCar();
          }
        }, {
          text: '取消',
          handler: function () {
            divDialog.dialog('close');
          }
        }
      ]
    });
  }
  //删除购物车订单 按钮
  function deleteSelect() {
    var rows = $('#tab_createScheduled').datagrid('getSelections');
    if ($('#tab_createScheduled').datagrid('getSelections').length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择要删除的预订单！', timeout: 2000, height: 'auto', showType: 'slide' });
    } else {
      $.messager.confirm('系统提示', '您确定要删除该预订单吗？', function (r) {
        if (r) {
          for (var i = rows.length - 1; i >= 0; i--) {
            var index = $('#tab_createScheduled').datagrid('getRowIndex', rows[i]);
            $('#tab_createScheduled').datagrid('deleteRow', index);
          }
          $.messager.show({
            title: '系统提示', msg: '删除成功！', timeout: 2800
            , height: 'auto', showType: 'slide'
          });
          $('#tab_createScheduled').datagrid('uncheckAll');
        }
      });
    }
  }
  //结算按钮
  function btn_createOrder() {
    var getArr = $('#tab_createScheduled').datagrid('getSelections');
    if (getArr.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择预订单！', height: 'auto', timeout: 2000, showType: 'slide' });
      return;
    }
    console.info(getArr);
    var allAmount = 0;
    var channelId = -1;
    var chaFlag = false;
    $.each(getArr, function (i, item) {
      allAmount += Number(item.expectedRentAmount);
      if (channelId == -1) {
        channelId = item.channelId;
      } else if (channelId !== item.channelId) {
        $.messager.show({ title: '系统提示', msg: '创建失败！提交的客源信息需一致！', height: 'auto', timeout: 2000, showType: 'slide' });
        chaFlag = true;
        return;
      }
    });
    if (chaFlag) {
      return;
    }

    function createOrderCallBack(data) {
      console.info(data);
      if (data > 0) {
        for (var i = getArr.length - 1; i >= 0; i--) {
          var index = $('#tab_createScheduled').datagrid('getRowIndex', getArr[i]);
          $('#tab_createScheduled').datagrid('deleteRow', index);
        }
        if ($('#tab_createScheduled').datagrid('getRows').length == 0) {
          $('#tab_createScheduled').datagrid('clearChecked');
        }
        $.messager.alert("系统提示", "创建订单成功！");
      } else if (data == -1) {
        $.messager.alert("系统提示", "创建订单失败！查询不到客源！");
      } else if (data == -2) {
        $.messager.alert("系统提示", "创建订单失败！" + data);
      } else if (data == -3) {
        $.messager.alert("系统提示", "创建订单失败！" + data);
      } else if (data === -4) {
        $.messager.alert("系统提示", "创建订单失败！预订房型数量不足！");
      } else {
        $.messager.alert("系统提示", "创建订单失败，所有房间已订出！！");
      }
    }

    $.messager.confirm('系统提示', '是否进行预订单的结算？', function (r) {
      if (r) {
        var createReserveDate = {};
        var paymentListDate = {};
        var paymentListArr = new Array();
        $.messager.confirm('系统提示', '是否进行预订单的支付？', function (r) {
          if (r) {
            $('#showPaymethod_scheduledNew_div').append(
              '<div id="div" style="padding:20px;">' +
              '<div style="margin-bottom:10px;">' +
              '<input id="ipt_paymethodId_scheduled_new"  style="width:220px;"' +
              'label="支付方式：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
              '</div>' +
              '<div>' +
              '<input id="ipt_amount_scheduled_new"  style="width:220px;"' +
              'label="支付金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>' +
              '</div>' +
              '</div>'
            );
            var scheduledNew_payFlag1 = 0;
            $('#ipt_paymethodId_scheduled_new').combobox({
              valueField: 'paymethod_name',//paymethod_code
              textField: 'paymethod_name',
              data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
              editable: false,
              panelHeight: "auto",
              panelMaxHeight: 300,
              groupField: 'paymethod_name',
              groupFormatter: function (group) {
                if (eapor.data.PaymethodObj.length == scheduledNew_payFlag1) {
                  scheduledNew_payFlag1 += 1;
                  return "代收";
                }
                scheduledNew_payFlag1 += 1;
              },
              onLoadSuccess: function (data) {
                console.info(data);
                if (data.length > 0) {
                  var This = this,
                    is = true;
                  $.each(data, function (i, item) {
                    if (item.paymethod_name == "现金") {
                      $(This).combobox('setValue', item.paymethod_code);
                      $(This).combobox('setText', item.paymethod_name);
                      is = false;
                      return;
                    }
                  });
                  if (is) {
                    $(This).combobox('setValue', data[0].paymethod_code);
                    $(This).combobox('setText', data[0].paymethod_name);
                  }
                }
              }
            });
            $('#ipt_amount_scheduled_new').textbox({
              value: '0',
              delay: 1000,
              required: true,
              validateOnCreate: false,
              validateOnBlur: true,
              validType: ['numMaxTwoDecimal', 'notZero']
            });

            $('#ipt_amount_scheduled_new').textbox('setValue', NP.divide(allAmount, 100));//支付金额
            var dialogDiv = $('#div');
            dialogDiv.dialog({
              title: '订单支付',
              width: 300,
              height: 200,
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
                    if (!$('#ipt_amount_scheduled_new').textbox('isValid')) {
                      $('#ipt_amount_scheduled_new').textbox('textbox').focus();
                      return;
                    }
                    //-----
                    var payInfo = eapor.utils.getPayIdAndName('ipt_paymethodId_scheduled_new');
                    paymentListDate.paymethodName = payInfo.paymethodName;
                    paymentListDate.paymethodCode = payInfo.paymethodCode;
                    console.info(payInfo);
                    if (payInfo.hasOwnProperty("creditChannelId")) {
                      paymentListDate.creditChannelId = payInfo.creditChannelId
                    }

                    console.info(paymentListDate);
                    //paymentListDate.paymethodCode = $('#ipt_paymethodId_scheduled_new').combobox('getValue');
                    paymentListDate.amount = ($('#ipt_amount_scheduled_new').textbox('getValue') * 100).toFixed(0);
                    //paymentListDate.paymethodName = $('#ipt_paymethodId_scheduled_new').combobox('getText');
                    paymentListDate.scene = "预订";
                    //amount;
                    paymentListArr.push(paymentListDate);
                    console.info(channelId);
                    createReserveDate.channelId = channelId;
                    createReserveDate.reservedetailList = JSON.stringify(getArr);//reservedetailList预定项列表
                    createReserveDate.guaranteeAmount = 0;//guaranteeAmount担保金额
                    createReserveDate.paymentList = JSON.stringify(paymentListArr);//paymentList支付明细
                    createReserveDate.contact = "";//客主会员的姓名
                    createReserveDate.memberPhone = "";//客主会员对应的phone
                    eapor.utils.defaultAjax('../reserve/createReserve'
                      , createReserveDate
                      , createOrderCallBack);
                    dialogDiv.dialog('close');
                  }
                }
                , {
                  text: '取消',
                  handler: function () {
                    dialogDiv.dialog('close');
                  }
                }
              ]
            })
          } else {
            paymentListDate.paymethodCode = 1;
            //paymethodId;
            paymentListDate.amount = 0;
            var paymethodName = "";
            $.each(eapor.data.PaymethodObj, function (i, item) {
              if (1 == item.paymethod_code) {
                paymethodName = item.paymethod_name;
                return;
              }
            });
            paymentListDate.paymethodName = paymethodName;
            paymentListDate.scene = "预订";
            //amount;
            paymentListArr.push(paymentListDate);
            console.info(channelId);
            createReserveDate.channelId = channelId;
            createReserveDate.reservedetailList = JSON.stringify(getArr);//reservedetailList预定项列表
            createReserveDate.guaranteeAmount = 0;//guaranteeAmount担保金额
            createReserveDate.paymentList = JSON.stringify(paymentListArr);//paymentList支付明细
            createReserveDate.contact = "";//客主会员的姓名
            createReserveDate.memberPhone = "";//客主会员对应的phone
            var createReserveUrl = '../reserve/createReserve';
            eapor.utils.defaultAjax(createReserveUrl, createReserveDate, createOrderCallBack);

          }
        });
      }
    });
  }

  $('#tab_createScheduled').datagrid({
    title: '购物车', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: false,
    checkbox: true,
    fit: true,
    rownumbers: true,
    //loader:firstloader_scheduledNew,
    columns: [[
      { field: 'ck', title: '', checkbox: true },
      { field: 'channelId', title: 'channelId', width: 20, align: 'center', hidden: true },
      { field: 'checkinTypeChar', title: 'checkinType', width: 20, align: 'center', hidden: true },
      { field: 'itemIndex', title: 'itemIndex', width: 20, align: 'center', hidden: true },
      { field: 'reserveCode', title: 'reserveCode', width: 20, align: 'center', hidden: true },
      { field: 'reserveDetailId', title: 'reserveDetailId', width: 20, align: 'center', hidden: true },
      { field: 'sourceGroupId', title: 'sourceGroupId', width: 20, align: 'center', hidden: true },
      { field: 'remark', title: 'remark', width: 20, align: 'center', hidden: true },
      { field: 'roomtypeId', title: 'roomtypeId', width: 20, align: 'center', hidden: true },

      { field: 'roomtypeName', title: '房型', width: 20, align: 'center' },
      { field: 'roomNumber', title: '房间数', width: 20, align: 'center' },
      { field: 'channelName', title: '客源', width: 20, align: 'center' },
      {
        field: 'checkinType', title: '入住类型', width: 20, align: 'center',
        formatter: function (value) {
          if (value == 1) {
            return "全日房";
          } else if (value == 2) {
            return "钟点房";
          } else {
            return "晚房";
          }
        }
      },
      {
        field: 'expectedEnterTime', title: '入住时间', width: 20, align: 'center',
        formatter: function (value, row, index) {
          if (!value) {
            return "-";
          } else {
            return getDate(value);
          }
        }
      },
      {
        field: 'expectedStayNumber', title: '计划居住', width: 20, align: 'center',
        formatter: function (value, row, index) {
          if (row.checkinType == 1) {
            return value + JSON.parse($('#index_ruleData').val()).dayRoomUnit;
          } else if (row.checkinType == 2) {
            return value + JSON.parse($('#index_ruleData').val()).restRoomUnit;
          } else {
            return value + JSON.parse($('#index_ruleData').val()).lateRoomUnit;
          }
        }
      },
      {
        field: 'expectedRentAmount', title: '房费', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100) + "元";
        }
      },
      { field: 'reservePerson', title: '预订人', width: 20, align: 'center' },
      { field: 'reserveMobile', title: '联系手机', width: 20, align: 'center' }
    ]]
    , toolbar: [{
      iconCls: 'icon-add',
      text: '新建预订单',
      handler: function () {
        showCreateScheduledDiv();
      }
    }, '-', {
      iconCls: 'icon-remove',
      text: '删除',
      handler: function () {
        deleteSelect();
      }
    }, '-', {
      iconCls: 'icon-save',
      text: '结算',
      handler: function () {
        btn_createOrder();
      }
    }]
  });

  showCreateScheduledDiv();
})();