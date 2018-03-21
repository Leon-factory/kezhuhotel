~(function () {
  "use strict";
  let _receptionId = 0,
    _fastClick = false;
  eapor.utils.layoutHeightSetAuto("div_room_continue");
  //手动房价
  $('#diyRoomPrice_continueRoom').on('click', function () {
    let roomPriceList = sessionStorage.getItem("roomPriceDetails_continueRoom");
    console.info(roomPriceList)
    if (roomPriceList) {
      roomPriceList = JSON.parse(roomPriceList);
    } else {
      return;
    }
    const oldStayDays_continueRoom = $('#oldStayDays_continueRoom').text();
    let str = '<div id="div_continueRoom" style="padding:20px 10px 0 10px;">' +
      '<table class="table_showRoomPriceDetail_continueRoom" ' +
      'style="font-size:16px;text-align:center;border-collapse: collapse;">' +
      '<tr class="tdo_showRoomPriceDetail_continueRoom" style="border-bottom:1px solid #000;">' +
      '<th style="width:230px;border:1px solid #000;">日期</th>' +
      '<th style="width:180px;border:1px solid #000;">系统房价</th>' +
      '<th style="width:180px;border:1px solid #000;">手动房价</th>' +
      '</tr>';
    let _showDiyPrice = '';
    roomPriceList.timeList.forEach(function (item, key, obj) {
      if (key < oldStayDays_continueRoom) {
        if (roomPriceList.newPriceList[key] === -1 || typeof roomPriceList.newPriceList[key] === 'undefined') {
          _showDiyPrice = '--';
        } else {
          _showDiyPrice = (roomPriceList.newPriceList[key] / 100).toFixed(2);
        }
        str += '<tr class="tr_showRoomPriceDetail_continueRoom" style="line-height: 36px;vertical-align: middle;height: 36px;background-color:#ddd;">' +
          '<td style="border:1px solid #000;">' + item.slice(0, 10) + ' ' + moment(item.slice(0, 10)).format('dddd') + '</td>' +
          '<td style="border:1px solid #000;">' + (roomPriceList.priceList[key] / 100).toFixed(2) + '</td>' +
          '<td style="border:1px solid #000;"><input type="text" class="diyRoomPriceInput_continueRoom"  disabled value="' + _showDiyPrice + '"' +
          'style="width: 80px;border: 1px solid #ccc; height: 26px;text-align: center;position: relative;top: -2px;"/></td>' +
          '</tr>'
      } else {
        if (roomPriceList.newPriceList[key] === -1 || typeof roomPriceList.newPriceList[key] === 'undefined') {
          _showDiyPrice = (roomPriceList.priceList[key] / 100).toFixed(2);
        } else {
          _showDiyPrice = (roomPriceList.newPriceList[key] / 100).toFixed(2);
        }
        str += '<tr class="tr_showRoomPriceDetail_continueRoom" style="line-height: 36px;vertical-align: middle;height: 36px;">' +
          '<td style="border:1px solid #000;">' + item.slice(0, 10) + ' ' + moment(item.slice(0, 10)).format('dddd') + '</td>' +
          '<td style="border:1px solid #000;">' + (roomPriceList.priceList[key] / 100).toFixed(2) + '</td>' +
          '<td style="border:1px solid #000;"><input type="text" class="diyRoomPriceInput_continueRoom"  value="' + _showDiyPrice + '"' +
          'style="width: 80px;border: 1px solid #ccc; height: 26px;text-align: center;position: relative;top: -2px;"/></td>' +
          '</tr>'
      }
    });
    str += '</table></div>';
    $('#showRoomPriceDetails_continueRoom').append(str);
    const ipt_ = $('.diyRoomPriceInput_continueRoom');
    for (let i_ = (+oldStayDays_continueRoom).toFixed(0); i_ < ipt_.length; i_++) {
      $(ipt_[i_]).textbox({
        delay: 1000,
        validType: ['numMaxTwoDecimal']
      });
    }
    const dialog = $('#div_continueRoom');
    dialog.dialog({
      title: '手动房价明细',
      width: 450,
      height: 450,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const ipt = $('.diyRoomPriceInput_continueRoom');
          let validFlag = false;
          for (let _i_ = (+oldStayDays_continueRoom).toFixed(0); _i_ < ipt.length; _i_++) {
            if (!$(ipt[_i_]).textbox('isValid')) {
              $(ipt[_i_]).textbox('textbox').focus();
              validFlag = true;
              break;
            }
          }
          if (validFlag) {
            return;
          }
          let total = 0;
          const newStayNum = $('#newStayDays_continueRoom').numberspinner('getValue');
          let hasHalfDay = false;
          if (newStayNum * 2 % 2 !== 0) {
            hasHalfDay = !hasHalfDay;
          }
          for (let i = 0; i < ipt.length; i++) {
            roomPriceList.newPriceList[i] =
              ipt[i].value === '--' || NP.times(ipt[i].value, 100) == roomPriceList.priceList[i] ?
                -1 : NP.times(ipt[i].value, 100);
            if (hasHalfDay && i == (ipt.length - 1)) {
              if (roomPriceList.newPriceList[i] === -1) {
                total += roomPriceList.priceList[i] / 2;
              } else {
                total += roomPriceList.newPriceList[i] / 2;
              }
            } else {
              if (roomPriceList.newPriceList[i] === -1) {
                total += roomPriceList.priceList[i];
              } else {
                total += roomPriceList.newPriceList[i];
              }
            }
          }
          roomPriceList.actualAmount = +total;
          console.info(total);
          $('#newRoomPrice_continueRoom').text((total / 100).toFixed(2));
          $('#allPrice_continueRoom').text((total / 100).toFixed(2));
          $('#needPayPrice_continueRoom').text((total / 100 - 1 * $('#payedPrice_continueRoom').text()).toFixed(2));
          sessionStorage.setItem("roomPriceDetails_continueRoom", JSON.stringify(roomPriceList));
          dialog.dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  //支付方式
  var continueRoom_Flag = 0;
  $('#payMethodPrice_continueRoom').combobox({
    valueField: 'paymethod_name',//paymethod_code
    textField: 'paymethod_name',
    data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
    editable: false,
    panelHeight: "auto",
    panelMaxHeight: 300,
    groupField: 'paymethod_name',
    onChange: function (newValue, oldValue) {
      if (newValue === "积分" || newValue === "储值") {
        if ($('#showPhone_continueRoom').is(':hidden')) {
          $('#showPhone_continueRoom').show();
          $('#payPhone_continueRoom').numberbox({
            validType: 'mobilephone',
            required: true,
            tipPosition: 'right',
            delay: 1000,
            validateOnCreate: false,//为true时在创建该组件时就进行验证
            validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
          });
        }
        if ($('#showCode_continueRoom').is(':hidden')) {
          $('#showCode_continueRoom').show();
          $('#payCode_continueRoom').textbox({
            required: true,
            delay: 1000,
            tipPosition: 'right',
            validateOnCreate: false,//为true时在创建该组件时就进行验证
            validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
          });
        }
      } else {
        if ($('#showPhone_continueRoom').is(':visible')) {
          $('#showPhone_continueRoom').hide();
          $('#payPhone_continueRoom').numberbox({
            validType: 'mobilephone',
            required: false,
            tipPosition: 'right',
            delay: 1000,
            validateOnCreate: false,//为true时在创建该组件时就进行验证
            validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
          });
        }
        if ($('#showCode_continueRoom').is(':visible')) {
          $('#showCode_continueRoom').hide();
          $('#payCode_continueRoom').textbox({
            required: false,
            delay: 1000,
            tipPosition: 'right',
            validateOnCreate: false,//为true时在创建该组件时就进行验证
            validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
          });
        }
      }
    },
    groupFormatter: function (group) {
      if (eapor.data.PaymethodObj.length == continueRoom_Flag) {
        continueRoom_Flag += 1;
        return "代收";
      }
      continueRoom_Flag += 1;
    },
    onLoadSuccess: function (data) {
      console.info(data);
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].paymethod_code);
        $(this).combobox('setText', data[0].paymethod_name);
      }
    }
  });
  $('#payPhone_continueRoom').numberbox({});
  $('#payCode_continueRoom').textbox({});
  //现居住天数
  $('#newStayDays_continueRoom').numberspinner({
    editable: false,
    min: 0,
    precision: 1,
    onChange: function (newValue, oldValue) {
      continueRoom_livingDetail(newValue);
    }
  });
  /*现居住天数的change事件*/
  function continueRoom_livingDetail(newValue) {
    if ($('#continurRoom_roomData').val() == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择要续住的房间！', timeout: 2000, showType: 'slide' });
      $('#newStayDays_continueRoom').numberspinner("clear");
      return;
    }
    console.info($('#enterTime_continueRoom').text())
    //入住时间
    var enterTime = new Date($('#enterTime_continueRoom').text().replace(/-/g, "/")).getTime();
    console.info(enterTime)
    //新的预离时间
    var total = NP.times(Number(newValue), 86400000);
    if (newValue > 0 && (NP.divide(NP.times(newValue, 2), 2)) == 0) {
      $('#newExitTime_continueRoom').text(getDateForRoomOpen(Number(enterTime) + Number(total)));
    } else //if(newValue > 0 && ((newValue *2)%2) == 1)
    {
      var newTime = eapor.utils.getDateForAfternoonCheckOutTime(enterTime + total);
      console.info(newTime)
      $('#newExitTime_continueRoom').text(newTime);
    }

    var roomData = JSON.parse($('#continurRoom_roomData').val());

    var data = {
      receptionId: _receptionId,
      startDateTime: getDate(enterTime),/*开始日*/
      checkinType: roomData.checkinType,/*入住方式*/
      //间隔数：天房，晚房为1 ，钟点房为钟点房小时数（规则设置里的值：如4）
      increment: roomData.checkinType == 2 ? JSON.parse($('#index_ruleData').val()).restHour : 1,
      expectedStay: Number(newValue),//居住数  ：  正整数  + 0.5的倍数 （是 起始与 结束 的 时间差【总的】）
      roomtypeId: roomData.roomtypeId,/*房型id*/
      rentplanId: roomData.rentplanId,/*房价方案id*/
    };
    console.info(data);
    eapor.utils.defaultAjax('../reception/calculateRentAmount', data, continueRoom_getRoomPriceCallback);
  }

  /*获取房费预期*/
  function continueRoom_getRoomPriceCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (!result || $.isEmptyObject(result)) {
      $.messager.show({ title: '系统提示', msg: '续住天数输入有误！最小值为0！', timeout: 2000, showType: 'slide' });
      return;
    }
    let details_ = sessionStorage.getItem("roomPriceDetails_continueRoom");
    var roomprice = 0;
    if (details_) {
      console.info(22)
      details_ = JSON.parse(details_);
      result.newPriceList = details_.newPriceList;
      result.actualPriceList.forEach(function (item, key, obj) {
        if (result.newPriceList[key] == -1 || typeof result.newPriceList[key] === 'undefined') {
          console.info(44)
          roomprice += +item;
        } else {
          console.info(55)
          roomprice += +result.newPriceList[key] * result.numberList[key];
        }
      });
    } else {
      console.info(33)
      result.actualPriceList.forEach(function (item, key, obj) {
        if (result.newPriceList[key] == -1 || typeof result.newPriceList[key] === 'undefined') {
          console.info('296:', roomprice)
          roomprice += +item * result.numberList[key];
        } else {
          roomprice += +result.newPriceList[key] * result.numberList[key];
        }
      });
    }
    sessionStorage.setItem("roomPriceDetails_continueRoom", JSON.stringify(result));

    $('#newRoomPrice_continueRoom').text(NP.divide(roomprice, 100));

    //得到总额
    var total = (+$('#newRoomPrice_continueRoom').text() + +$('#addBill_continueRoom').text());
    $('#allPrice_continueRoom').text(total);
    var pay = $('#payedPrice_continueRoom').text();

    var deposit = total - Number(pay);
    deposit < 0 ? $('#needPayPrice_continueRoom').text(0) : $('#needPayPrice_continueRoom').text(deposit.toFixed(2));
  }

  $('#south_continueroom_continueroom').on('click', function () {
    continueRoomFunction(1);
  });
  $('#south_continueroomcard_continueroom').on('click', function () {
    continueRoomFunction(2);
  });
  //续房按钮函数
  function continueRoomFunction(value) {
    if (_fastClick) {
      return;
    }
    const type_ = $('#payMethodPrice_continueRoom').combobox('getText');
    console.info('type_:', type_);
    if (type_ === '储值' || type_ === '积分') {
      if (!$('#payPhone_continueRoom').numberbox('isValid')) {
        $('#payPhone_continueRoom').numberbox('textbox').focus();
        return;
      }
      if (!$('#payCode_continueRoom').textbox('isValid')) {
        $('#payCode_continueRoom').textbox('textbox').focus();
        return;
      }
    } else {
      $('#payPhone_continueRoom').numberbox('clear');
      $('#payCode_continueRoom').textbox('clear');
    }
    var conRoomData = $('#continurRoom_roomData').val();
    console.info(conRoomData);
    if (conRoomData) {
      conRoomData = JSON.parse(conRoomData);
    } else {
      $.messager.show({ title: '系统提示', msg: '续房信息不能为空！', timeout: 2000, showType: 'slide' });
      return;
    }

    //新的预离时间
    var newExpectedLeaveTime = $('#newExitTime_continueRoom').text();
    //逗留数
    var newExpectedStayNumber = Number($('#newStayDays_continueRoom').numberspinner('getValue'));

    //获取支付方式
    var paymentList = [];
    //-----
    var payInfo = eapor.utils.getPayIdAndName('payMethodPrice_continueRoom');
    var pay = {
      paymethodName: payInfo.paymethodName,
      paymethodCode: payInfo.paymethodCode
    };
    console.info(payInfo);
    if (payInfo.hasOwnProperty("creditChannelId")) {
      pay.creditChannelId = payInfo.creditChannelId
    }

    console.info(pay);
    var amount = $('#payPrice_continueRoom').numberbox('getValue');
    if (amount == "") {
      amount = 0;
    }
    pay.amount = (amount * 100).toFixed(0);
    pay.scene = "续住";
    pay.phone = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
      $('#payPhone_continueRoom').numberbox('getValue') : '';
    pay.matchCode = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
      $('#payCode_continueRoom').textbox('getValue') : '';
    paymentList.push(pay);
    _fastClick = true;
    if (value == 1) {
      $('#south_continueroom_continueroom').linkbutton('disable');
    } else {
      $('#south_continueroomcard_continueroom').linkbutton('disable');
    }
    const _save = JSON.parse(sessionStorage.getItem("roomPriceDetails_continueRoom"));
    _save.priceList.forEach(function (item, key, obj) {
      if (_save.newPriceList[key] !== -1 && typeof _save.newPriceList[key] !== 'undefined') {
        _save.priceList[key] = _save.newPriceList[key];
        _save.actualPriceList[key] = _save.newPriceList[key];
      }
    });

    //数据整理
    var continueRoomData = {
      rentId: conRoomData.rentId,
      newExpectedLeaveTime: newExpectedLeaveTime,
      newExpectedStayNumber: Number(newExpectedStayNumber),
      paymentList: JSON.stringify(paymentList),
      timePriceRange: _save
    };

    console.info(continueRoomData);
    if (value == 1) {//续房按钮情况下执行
      eapor.utils.defaultAjaxHasContentType('../reception/extendRent', JSON.stringify(continueRoomData), continueRoom_submitCallback);
    } else {//续房并制卡按钮情况下执行
      eapor.utils.defaultAjaxHasContentType('../reception/extendRent', JSON.stringify(continueRoomData), continueRoom_submitCallbackAndCreateCard);
    }
  }

  //续房回调
  function continueRoom_submitCallback(result) {
    console.info(result);
    _fastClick = false;
    $('#south_continueroom_continueroom').linkbutton('enable');
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -3334) {
      $.messager.show({ title: '系统提示', msg: '续房失败！您未在当班状态！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '续房成功！', timeout: 2000, showType: 'slide' });
      $('#continueRoomData').val("");
      //$('#payPrice_continueRoom').numberbox("clear");
      eapor.data.index_refreshRoomType = "continueRoom";
      eapor.utils.roomOpen_successRefreshRoomType(transmitConRoomId, 0);

      var data = JSON.parse(sessionStorage.getItem("continueRoomObj"));
      eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
        data, continueRoom_getContinueRoomInfo);
      return;
    }
    if (result === -4) {
      $.messager.show({ title: '系统提示', msg: '原计划居住与现计划居住天数不能相同！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result === -6) {
      $.messager.show({ title: '系统提示', msg: '5分钟之内不允许重复操作！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result === -2) {
      $.messager.show({ title: '系统提示', msg: '手机号或匹配码不正确！', timeout: 3000, showType: 'slide' });
      return;
    }
    $.messager.show({ title: '系统提示', msg: '续房失败！', timeout: 3000, showType: 'slide' });
  }
  //续房并制卡回调
  function continueRoom_submitCallbackAndCreateCard(result) {
    _fastClick = false;
    $('#south_continueroomcard_continueroom').linkbutton('enable');
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -3334) {
      $.messager.show({ title: '系统提示', msg: '续房失败！您未在当班状态！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '续房成功！', timeout: 2000, showType: 'slide' });
      console.info($('#continueRoomData').val());
      $('#continueRoomData').val("");
      $('#hidden_createCardFlag').val(2);//设置flag 进入制卡JSP用于判断是否是从续房JSP页面进入
      eapor.data.index_refreshRoomType = "continueRoom";
      eapor.utils.roomOpen_successRefreshRoomType(transmitConRoomId, 0);
      $('#kzmaintable').tabs('close', '续房');
      $.messager.confirm('系统提示', '续房成功！是否跳转到制卡页面？', function (r) {
        if (r) {
          //制卡方法 
          eapor.utils.ifHaveJSPThenCloseThis();
        } else {

        }
      });
    }
    if (result === -6) {
      $.messager.show({ title: '系统提示', msg: '5分钟之内不允许重复操作！', timeout: 3000, showType: 'slide' });
      return;
    }
    $.messager.show({ title: '系统提示', msg: '续房失败！', timeout: 2000, showType: 'slide' });
  }



  //续房按钮
  var transmitConRoomId = 0;
  /*获取continueRoom数据*/
  function continueRoom_getContinueRoomInfo(result) {
    console.info(result);

    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result.zhuanyi === 'false') {
      $.messager.show({ title: '系统提示', msg: '该账单中房费有转移项，不能续房！', timeout: 3000, showType: 'slide' });
      return;
    }
    transmitConRoomId = result.roomId;
    //得到住客姓名
    $('#guestName_continueRoom').text(result.guestName);
    //得到入住时间
    $('#enterTime_continueRoom').text(getDate(result.enterTime));
    //得到原计划居住天数
    $('#oldStayDays_continueRoom').text(result.expectedStayNumber);
    console.info(result.expectedStayNumber);

    $('#continurRoom_roomData').val(JSON.stringify(result));


    //先计划居住
    $('#newStayDays_continueRoom').numberspinner('setValue', result.expectedStayNumber);
    //得到支付总额
    $('#payedPrice_continueRoom').text(NP.divide(result.paymentAmount, 100));
    //得到消费总额
    $('#addBill_continueRoom').text(NP.divide(result.consumeAmount, 100));
    //得到原房费
    $('#oldRoomPrice_continueRoom').text(NP.divide(result.oldRoomPrice, 100));

    $('#payPrice_continueRoom').numberbox('clear');//支付金额
    //信用卡担保
    //$('#credit_continueRoom').text('');
    //储值余额
    //$('#guestName_continueRoom').text('');
    //签单挂账
    if (result.signAmount != 0) {
      $('#sign_continueRoom').text(NP.divide(result.signAmount, 100));
    } else {
      $('#sign_continueRoom').text("--");
    }
    //信用余额
    var cname = "";
    if (result.creditName) {
      cname = "（" + result.creditName + "）";
    }
    var cred = "--";
    if (result.credit != 0) {
      cred = NP.divide(result.credit, 100);
    }
    $('#creditBalance_continueRoom').text(cred + cname);

    //changeNumber();

    //需支付金额
    var rp = $('#newRoomPrice_continueRoom').text();
    var con = $('#addBill_continueRoom').text();
    //得到总额
    var total = (Number(rp) + Number(con));
    $('#allPrice_continueRoom').text(total);
    var pay = $('#payedPrice_continueRoom').text();
    var deposit = total - Number(pay);
    deposit < 0 ? $('#needPayPrice_continueRoom').text(0) : $('#needPayPrice_continueRoom').text(deposit.toFixed(2));
  }
  // -------- 前台  ---- 续房JS ---------------


  $("#north_livingguest_continueroom").click(function () {
    $('#showalllivingguestsDiv_continueroomP').append(`<div id="showalllivingguestsDiv_continueroom"></div>`);
    const dialog = $('#showalllivingguestsDiv_continueroom');
    dialog.dialog({
      title: '全部在住客人信息',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      href: '../client/livingRoom.jsp',//单独在住客人页面
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const getselected_livingRoom_list = $('#livingRoom_list').datagrid('getSelected');
          if (!getselected_livingRoom_list) {
            $.messager.show({ title: '系统提示', msg: '请选择信息！', timeout: 3000, showType: 'slide' });
          }
          _receptionId = getselected_livingRoom_list.receptionId;
          eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
            {
              receptionId: getselected_livingRoom_list.receptionId,
              roomCode: getselected_livingRoom_list.roomCode
            },
            continueRoom_getContinueRoomInfo);
          dialog.dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });

  $('#iop').on('click', function () {
    var n = $('#newStayDays_continueRoom').numberspinner('getValue');
    if (!n) {
      return;
    }
    $('#newStayDays_continueRoom').numberspinner('setValue', (Number(n) + Number(0.5)));
  });
  $('#jkl').on('click', function () {
    var n = $('#newStayDays_continueRoom').numberspinner('getValue');
    if (n == "" || n == 0 || n == 1) {
      return;
    }
    $('#newStayDays_continueRoom').numberspinner('setValue', (Number(n) - Number(0.5)));
  });


  var continueRoom = $('#continueRoomData').val();
  console.info(continueRoom);
  var pubData = $('#index_pubRoomData').val();//房态图 鼠标 左键点的续房菜单存储的信息 rsRightClick.js里预存的
  console.info(pubData);

  if (pubData) {
    pubData = JSON.parse(pubData);
    var data = {
      receptionId: pubData.receptionId,
      roomCode: pubData.roomName
    };
    _receptionId = pubData.receptionId;
    sessionStorage.setItem("continueRoomObj", JSON.stringify(data));
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
      data, continueRoom_getContinueRoomInfo);
    return;
  }

  if (continueRoom) {
    continueRoom = JSON.parse(continueRoom);
    //根据receptionId获取续房所需信息
    var data_ = {
      receptionId: continueRoom.receptionId,
      roomCode: continueRoom.roomCode
    };
    _receptionId = continueRoom.receptionId;
    sessionStorage.setItem("continueRoomObj", JSON.stringify(data_));
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
      data_, continueRoom_getContinueRoomInfo);
    return;
  }

  $("#north_livingguest_continueroom").trigger('click');
})();