/**
 * @JSname:开房
 */
~(function (window, eapor) {
  "use strict";
  let _changeDayFlag = false;
  //通过手机号码搜索宾客信息
  $('#usePhoneSearchGuestInfo_roomOpen').on('click', function () {
    const guestPhone = $('#guestPhone_roomopen');
    if (!guestPhone.numberbox('getValue')) {
      $.messager.show({ title: '系统提示', msg: '请先输入手机号码', timeout: 3000, showType: 'slide' });
      guestPhone.numberbox('textbox').focus();
      return;
    }
    if (!guestPhone.numberbox('isValid')) {
      guestPhone.numberbox('textbox').focus();
      return;
    }
    console.info(guestPhone.numberbox('getValue'));
    function getGuestByPhoneCallBack(result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      console.info(result);
      if (typeof result === 'object' && result !== null) {
        if (result.guestname || result.nickname) {
          $('#guestName_roomopen').textbox('setValue', result.guestname || result.nickname);
        }
        if (result.identitycardnumber || result.idCard) {
          $('#certificateCode_roomopen').textbox('setValue', result.identitycardnumber || result.idCard);
          $('#certificateType_roomopen').combobox('setText', '身份证');
          $('#gender_roomopen').combobox('setValue', '身份证');
        }
        $('#certificateType_roomopen').combobox('setValue', 1);
        if (result.sexcode === 0 || result.sex === 'man') {
          $('#gender_roomopen').combobox('setValue', 0);
          $('#gender_roomopen').combobox('setText', '男');
        } else {
          $('#gender_roomopen').combobox('setValue', 1);
          $('#gender_roomopen').combobox('setText', '女');
        }
        $('#north_guestsource_openroom').combobox('getData').forEach(function (item, index, array) {
          if (item.channelName === '会员') {
            $('#north_guestsource_openroom').combobox('setValue', item.channelId);
            $('#north_guestsource_openroom').combobox('setText', '会员');
          }
        });
        $.messager.alert('系统提示', '该手机号码对应的身份信息为会员');
      } else {
        $.messager.alert('系统提示', '该手机号码对应的身份信息为非会员');
      }

    }
    eapor.utils.defaultAjax('../hotel/getUsersByPhone',
      { phone: guestPhone.numberbox('getValue') },
      getGuestByPhoneCallBack);
  });
  //手动房价
  $('#diyRoomPrice_roomOpen').on('click', function () {
    let roomPriceList = sessionStorage.getItem("roomPriceDetails_roomOpen");
    if (roomPriceList) {
      roomPriceList = JSON.parse(roomPriceList);
    } else {
      return;
    }
    let str = '<div id="div_roomOpen" style="padding:20px 10px 0 10px;">' +
      '<table class="table_showRoomPriceDetail_roomOpen" ' +
      'style="font-size:16px;text-align:center;border-collapse: collapse;">' +
      '<tr class="tdo_showRoomPriceDetail_roomOpen" style="border-bottom:1px solid #000;">' +
      '<th style="width:230px;">日期</th>' +
      '<th style="width:180px;">系统房价</th>' +
      '<th style="width:180px;">手动房价</th>' +
      '</tr>';
    let _showDiyPrice = '';
    roomPriceList.timeList.forEach(function (item, key, obj) {
      if (roomPriceList.newPriceList[key] === -1 || typeof roomPriceList.newPriceList[key] === 'undefined') {
        _showDiyPrice = (roomPriceList.priceList[key] / 100).toFixed(2);
      } else {
        _showDiyPrice = (roomPriceList.newPriceList[key] / 100).toFixed(2);
      }
      str += '<tr class="tr_showRoomPriceDetail_roomOpen"  ' +
        'style="border-bottom:1px solid #000;line-height: 36px;vertical-align: middle;height: 36px;">' +
        '<td>' + item.slice(0, 10) + ' ' + moment(item.slice(0, 10)).format('dddd') + '</td>' +
        '<td>' + (roomPriceList.priceList[key] / 100).toFixed(2) + '</td>' +
        '<td><input type="text" class="diyRoomPriceInput_roomOpen" value="' + _showDiyPrice + '"' +
        'style="width: 80px;border: 1px solid #ccc; height: 26px;text-align: center;position: relative;top: -2px;"/></td></tr>'
    });
    str += '</table></div>';
    $('#showRoomPriceDetails_roomOpen').append(str);
    const ipt_ = $('.diyRoomPriceInput_roomOpen');
    for (let i_ = 0; i_ < ipt_.length; i_++) {
      $(ipt_[i_]).textbox({
        delay: 1000,
        validType: ['numMaxTwoDecimal']
      });
    }
    const dialog = $('#div_roomOpen');
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
          const ipt = $('.diyRoomPriceInput_roomOpen');
          let validFlag = false;
          for (let _i_ = 0; _i_ < ipt.length; _i_++) {
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
          for (let i = 0; i < ipt.length; i++) {
            roomPriceList.newPriceList[i] =
              ipt[i].value === '--' || NP.times(ipt[i].value, 100) == roomPriceList.priceList[i] ?
                -1 : NP.times(ipt[i].value, 100);
            total += NP.times(ipt[i].value, 100);
          }
          roomPriceList.actualAmount = +total;
          $('#roomAmount_roomopen').textbox('setValue', (total / 100).toFixed(2));
          sessionStorage.setItem("roomPriceDetails_roomOpen", JSON.stringify(roomPriceList));
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
  //获得信用余额/储值金额
  function getAmountForChannelAndPhone(channelId, phone) {
    console.info("channelId:", channelId);
    console.info("phone:", phone);
    $.ajax({
      type: 'post',
      url: '../persevere/getCreditAndStore',
      data: { channelId: channelId, phone: phone },
      dataType: 'json',
      success: function (result) {
        console.info(result);
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          return;
        }
				/*  -100001:该酒店未与客主对应
	  				-100002:该用户不是客主会员
	  				-100003:该用户未储值
	  				-100004:该客源不存在*/
        let value = NP.divide(result.value, 100);
        if (value != -100001 && value != -100002 && value != -100003 && value != -100004) {
          $('#storedAmount_roomopen').textbox('setValue', value);
        }
      }
    });
  }
  //设置layout width height
  var w = window.innerWidth,
    h = window.innerHeight,
    roomOpenFlag = 0,//判断支付方式中代收的flag
    isSign = {
      record: {
        id: 1
      }
    },
    transmitRoomDataId = 0,//右边空净房，选择房间后，保存 房间Id,后用于开房成功后，用websocket通知刷新房态图
    mapDiv_roomOpen = window.document.getElementById("div_room_open");

  mapDiv_roomOpen.style.height = (h - 57) + "px";
  mapDiv_roomOpen.style.minHeight = 740 + "px";
  window.document.getElementById("eastDiv_roomOpen").style.maxWidth = (w - 423) + "px";

  eapor.dlgcleanflag = "dlgopenclean";
  console.info('eapor.dlgcleanflag:184,', eapor.dlgcleanflag)
  //制房卡 按钮
  $('#south_openroomcard_openroom').click(function () {
    eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
  });
  //预订单 按钮
  $('#north_orderform_openroom').click(function () {
    var d_inquire = new Date().getTime();
    $(this).parent().append("<div id = 'showOrderDiv' style = 'display:none;'></div>");
    $('#hidden_setHref').val(1);
    $('#showOrderDiv').dialog({
      title: '预订单',
      width: 1000,
      height: 655,
      closed: false,
      cache: false,
      href: '../client/scheduled_inquire.jsp',
      modal: true,
      onLoad: function () {
        $('#layout_scheduledInquire').find('.panel-body-noheader').css('padding', '0');
        $('#layout_scheduledInquire').find('.layout-panel-center').css('top', '0');
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var idTime = $('#hidden_setHrefIdTime').val();
          //将选中的订单信息添加到开房页中
          var getSelected = $('#tab_scheduledInquire' + idTime).datagrid('getSelected');
          //先验证是否已选择预订单
          if (!getSelected) {
            $.messager.show({ title: '系统提示', msg: '请先选择预订单', timeout: 2000, showType: 'slide' });
            return;
          }
          $('#hidden_reserveDetailId').val(getSelected.receptionId);
          sessionStorage.setItem("reserveDetailId", getSelected.reserveDetailId);
          $.each(eapor.data.roomtypeObj, function (i, item) {
            if (getSelected.roomtypeName == item.roomtypeName) {
              $('#index_roomTypeIdByOtherBtnToOpenRoom').val(item.roomtypeId);
              return;
            }
          });
          eapor.utils.loadCleanRoomList();//重新加载房型，进行默认选择预订房型
          //通过得到客源ID ， 取得receptionId, 并赋值给 hidden_rentplanId  
          var getChannelId = getSelected.channelId;
          $.each(eapor.data.channelObj, function (i, item) {
            if (getChannelId == item.channelId) {
              $('#hidden_rentplanId').val(JSON.stringify({
                rentplanId: item.rentplanId,
                sourceGroupId: item.sourceGroupId,
                channelId: item.channelId
              }));
              return;
            }
          });
          //将得到的数据 赋值给propertygrid
          $('#north_guestsource_openroom').combobox('setValue', getSelected.channelName);
          //姓名
          $('#guestName_roomopen').textbox('setValue', getSelected.reservePerson);
          //手机
          $('#guestPhone_roomopen').numberbox('setValue', getSelected.reserveMobile);
          //入住类型
          $('#checkInType_roomopen').combobox('setValue', getSelected.checkinTypeChar);

          //入住时间
          $('#checkInTime_roomopen').textbox('setValue', getDate(new Date()));
          //计划居住
          $('#stayNumber_roomopen').numberspinner('setValue', getSelected.expectedStayNumber);
          //根据入住时间，居住天数，计算预离时间，并显示到页面
          var beginTime = getDate(new Date());
          //得到预住天数 
          var expectedStayNumber = getSelected.expectedStayNumber;
          // 获取当前时间格式的时间戳
          var nowtime = new Date(beginTime.replace(/-/g, "/")).getTime();
          //入住方式
          if (getSelected.checkinType == 3) {
            //改变计划居住单位
            $('#stayNumberName_roomopen').html("计划居住（天）<span style='color:red;'>*</span>");
            //当前时间戳加上预住天数得到预离时间戳
            livetime = nowtime + 86400000 * expectedStayNumber;
            //预离时间
            $('#checkOutTime_roomopen').textbox('setValue', getDateForRoomOpen(livetime));
          } else if (getSelected.checkinType == 2) {
            //改变计划居住单位
            $('#stayNumberName_roomopen').html("计划居住（式）<span style='color:red;'>*</span>");
            //当前时间戳加上预住天数得到预离时间戳
            livetime = nowtime + JSON.parse($('#index_ruleData').val()).restHour * 3600000 * expectedStayNumber;
            //预离时间
            $('#checkOutTime_roomopen').textbox('setValue', getDate(livetime));
          } else {
            //改变计划居住单位
            $('#stayNumberName_roomopen').html("计划居住（天）<span style='color:red;'>*</span>");
            //当前时间戳加上预住天数得到预离时间戳
            livetime = nowtime + NP.times(86400000, expectedStayNumber);
            //预离时间
            $('#checkOutTime_roomopen').textbox('setValue', getDateForRoomOpen(livetime));
          }
          $('#roomAmount_roomopen').textbox('setValue', NP.divide(getSelected.expectedRentAmount, 100));
          //支付方式
          var paymethod = "";
          $.each(eapor.data.PaymethodObj, function (i, item) {
            if (getSelected.paymethodId == item.paymethod_code) {
              paymethod = item.paymethod_name;
              return;
            }
          });
          //支付方式
          //$('#tab_room_open').propertygrid('updateRow', {index: 12,row: {value: paymethod}});
          //已付金额
          if (getSelected.amount == undefined) {
            getSelected.amount = 0;
          }
          $('#paidAmount_roomopen').textbox('setValue', NP.divide(getSelected.amount, 100));
          $('#showOrderDiv').dialog('close');

          $('#noReserveOpenRoom_roomOpen').hide();
          $('#reserveOpenRoom_roomOpen').show();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showOrderDiv').dialog('close');
        }
      }]
    });
  });

  //添加随住客人函数
  function readCardAddGuestInfo(value) {
    $('#roomopen_guestListP').append(
      '<div id="roomopen_guestListPDialog" style="padding:30px 60px;">' +
      '<div style="width:100%;max-width:320px;padding:30px 100px;margin:0 auto">' +
      '<a  id="readCard_addentourage">读取身份证信息</a>' +
      '<div style="margin-bottom:20px;margin-top:20px" >' +
      '<span style="display:inline-block;width:90px;text-align:right;"><span style="color:red;font-size:18px;">*</span>姓名：&nbsp;&nbsp;</span>' +
      '<input id="adden_name"   style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:90px;text-align:right;line-height: 24px;vertical-align: middle;">' +
      '<span style="color:red;font-size:18px;">*</span>性别：&nbsp;&nbsp;</span>' +
      '<input id="adden_sex" style="width:150px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:90px;text-align:right;"><span style="color:red;font-size:18px;">*</span>证件类型：&nbsp;&nbsp;</span>' +
      '<input id="adden_cardtype" style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:90px;text-align:right;"><span style="color:red;font-size:18px;">*</span>证件号码：&nbsp;&nbsp;</span>' +
      '<input id="adden_cardcode"   style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:90px;text-align:right;">手机：&nbsp;&nbsp;</span>' +
      '<input id="adden_phone" style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:90px;text-align:right;height:42px;line-height:32px;">地址：&nbsp;&nbsp;</span>' +
      '<input  id="adden_address" style="width:150px;"/>' +
      '</div>' +
      '<div style="display:none;">' +
      '<iframe id="ifReadCard" width="10px" height="10px"></iframe>' +
      '</div>' +
      '<div id="showResultInfoDiv"></div>' +
      '</div>' +
      '</div>'
    );
    $('#readCard_addentourage').linkbutton({});
    //		$('#readCard_addentourage_test').linkbutton({});
    $('#adden_name').textbox({
      required: true,
      delay: 1000,
      //			validType:'name',
      missingMessage: "姓名不能为空！",
      //			invalidMessage:"姓名请输入中文或英文",
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#adden_sex').combobox({
      data: [{ "id": 1, "text": "男", "selected": true }, { "id": 2, "text": "女" }],
      valueField: 'id',
      textField: 'text',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200
    });

    $('#adden_cardtype').combobox({
      data: eapor.hotel.certificateTypeObj,
      valueField: 'certificate_type_code',
      textField: 'certificate_type_name',
      panelMaxHeight: 200,
      panelHeight: "auto",
      editable: false,
      onLoadSuccess: function (data) {
        var This = this;
        if (data.length > 0) {
          var flag = true;
          $.each(data, function (i, item) {
            if (item.certificate_type_name == "身份证") {
              flag = false;
              $(This).combobox('setValue', item.certificate_type_code);
              $(This).combobox('setText', item.certificate_type_name);
              return;
            }
          });
          if (flag) {
            $(This).combobox('setValue', data[0].certificate_type_code);
            $(This).combobox('setText', data[0].certificate_type_name);
          }
        }
      }
    });
    $('#adden_cardcode').textbox({
      required: true,
      missingMessage: "证件号码不能为空！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true,
      validType: "certificateType",
      invalidMessage: "身份证格式不正确！"
    });
    $('#adden_phone').numberbox({
      validType: 'mobilephone',
      invalidMessage: "手机号码格式不正确！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#adden_address').textbox({
      multiline: true,
      validateOnCreate: false,
      validateOnBlur: true,
      validType: 'maxLength[32]',
      invalidMessage: "最多输入32个字符！",
      delay: 1000
    });
    var readCardEventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());//事件号
    var readCardComCode = $('#indexmd5').val(); //通讯号
    function readIdCardFirstCallBack(result) {
      console.info(result);
    }
    $('#readCard_addentourage').click(function () {
      //到exe
      var hrefUrl_readCard = "kzybidread://" + (Number(eapor.data.exenum) + Number(1)) + "," + readCardEventCode;
      $('#ifReadCard').attr('src', hrefUrl_readCard);
      //到接口
      var readIdCardFirstData = {
        eventCode: readCardEventCode,
        comCode: readCardComCode,
        type: 'room_open_jsp_send'
      };
      eapor.utils.defaultAjax('../transmit/readIdCardFirst', readIdCardFirstData, readIdCardFirstCallBack)
    });
    //		$('#readCard_addentourage_test').click(function(){
    //			//到exe
    //			var hrefUrl_readCard = "kzybidread://"+(Number(300)+Number(1))+","+readCardEventCode;
    //			$('#ifReadCard').attr('src',hrefUrl_readCard);
    //			//到接口
    //			var readIdCardFirstData = {
    //					eventCode: readCardEventCode,
    //					comCode: readCardComCode,
    //					type: 'room_open_jsp_send'
    //			};
    //			eapor.utils.defaultAjax('../transmit/readIdCardFirst',readIdCardFirstData,readIdCardFirstCallBack)
    //		});
    $("#roomopen_guestListPDialog").dialog({
      title: '添加身份信息',
      width: 600,
      height: 550,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          //读取身份证，显示于页面
          if (value == 1) {
            if (!$('#adden_name').textbox('isValid')) {
              $('#adden_name').textbox('textbox').focus();
              return;
            }
            if (!$('#adden_cardcode').textbox('isValid')) {
              $('#adden_cardcode').textbox('textbox').focus();
              return;
            }
            if (!$('#adden_phone').numberbox('isValid')) {
              $('#adden_phone').numberbox('textbox').focus();
              return;
            }
            if (!$('#adden_address').textbox('isValid')) {
              $('#adden_address').textbox('textbox').focus();
              return;
            }
            var enData = eapor.utils.commonFunctionByAddFollowGuestInfo(1);
            //预存 读到的身份证上的地址
            $('#hidden_roomOpenCutReadInfoFromReadCard').val(JSON.stringify(enData));
            $('#guestName_roomopen').textbox('setValue', enData.guestName);
            if ($('#adden_phone').numberbox('getValue') != "") {
              $('#guestPhone_roomopen').numberbox('setValue', $('#adden_phone').numberbox('getValue'));
            }
            $('#certificateType_roomopen').combobox('setValue', $('#adden_cardtype').combobox('getValue'));
            $('#certificateType_roomopen').combobox('setText', $('#adden_cardtype').combobox('getText'));
            $('#certificateCode_roomopen').textbox('setValue', enData.certificateCode);
            $('#gender_roomopen').combobox('setValue', $('#adden_sex').combobox('getText'));
            $('#roomopen_guestListPDialog').dialog('close');
          } else {
            var enData = eapor.utils.commonFunctionByAddFollowGuestInfo(2);
            var select = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
            enData.roomId = select.roomId;
            enData.roomCode = select.roomCode;
            $('#hidden_roomOpenJSPAddGuestInfo').val(JSON.stringify(enData));
            $('#roomopen_guestListPDialog').dialog('close');
          }
        }
      }, {
        text: '取消',
        handler: function () {
          $('#roomopen_guestListPDialog').dialog('close');
        }
      }]
    })
  };

  $('#south_addguest_openroom').click(function () {
    var select = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择房间', timeout: 2000, showType: 'slide' });
      return;
    }
    readCardAddGuestInfo(2);
  });

  $('#showReadIdCardJSP').on('click', function () {
    readCardAddGuestInfo(1);
  });

  function srGetRoomCallbackbbbb(data) {
    openRoomFastClickFlag = false;
    $('#south_openroom_openroom').linkbutton('enable');
    if (data == -3334) {
      $.messager.confirm('系统提示', '您未在当班状态，是否转到接班页面？', function (r) {
        if (r) {
          $('#accept_onduty').trigger('click');
        } else {
          return false;
        }
      });
    } else {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      if (data < 0) {
        const errCode = {
          '-11': '开房失败，房间不存在！',
          '-12': '开房失败，房间状态有误！',
          '-13': '开房失败，该房间已开房！'
        };
        $.messager.show({ title: '系统提示', msg: errCode['' + data] || '开房失败！', timeout: 3000, showType: 'silde' });
        return;
      }
      var saveData = {
        guestName: $('#guestName_roomopen').textbox('getValue'),
        enterTime: $('#checkInTime_roomopen').textbox('getValue'),
        expectedLeaveTime: $('#checkOutTime_roomopen').textbox('getValue')
      };
      $('#hidden_openRoom_guestInfo').val(JSON.stringify(saveData));//存储宾客信息
      $('#hidden_outRoom_roomInfo').val(JSON.stringify($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected')));//存储房间信息

      //开房成功局部刷新房态
      eapor.data.index_refreshRoomType = "roomOpen";
      console.info(transmitRoomDataId);
      eapor.utils.roomOpen_successRefreshRoomType(transmitRoomDataId, 0);
      $('#hidden_reserveDetailId').val('');//清空预订单转开房时存储的reserveDetailId
      sessionStorage.setItem("reserveDetailId", "");
      $('#guestName_roomopen').textbox('setValue', '');
      $('#guestPhone_roomopen').numberbox('setValue', '');
      $('#certificateType_roomopen').combobox('setValue', 1);
      $('#certificateType_roomopen').combobox('setText', '身份证');
      $('#certificateCode_roomopen').textbox('setValue', '');
      $('#gender_roomopen').combobox('setValue', '男');
      $('#checkInType_roomopen').combobox('setValue', "全日房");
      $('#checkInTime_roomopen').textbox('setValue', getDate(new Date()));
      $('#stayNumber_roomopen').numberspinner('setValue', 1);
      var leaveTime = getDateForRoomOpen(new Date(getNowFormatDate().replace(/-/g, "/")).getTime() + 86400000);
      $('#checkOutTime_roomopen').textbox('setValue', leaveTime);
      $('#roomAmount_roomopen').textbox('setValue', 0);
      $('#packageBreakfast_roomopen').numberspinner('setValue', 0);
      $('#paidAmount_roomopen').textbox('setValue', 0);
      $('#payType_roomopen').combobox('setValue', '现金');
      $('#payAmount_roomopen').textbox('setValue', 0);
      $('#isSign_roomopen').combobox('setValue', '否');
      $('#creditBalance_roomopen').textbox('setValue', '--');
      $('#storedAmount_roomopen').textbox('setValue', '--');
      $('#creditCardAmount_roomopen').textbox('setValue', 0);
      $('#isJointRoom_roomopen').combobox('setValue', '否');
      $('#JointRoomNumber_roomopen').textbox('setValue', '');
      var leaveTime = getDateForRoomOpen(new Date(getNowFormatDate().replace(/-/g, "/")).getTime() + 86400000);
      $('#checkOutTime_roomopen').textbox('setValue', leaveTime);
      $('#north_guestsource_openroom').combobox('setValue', "非会员");
      eapor.utils.loadCleanRoomList();
      $('#roomAmount_roomopen').textbox('setValue', '');

      $('#guestName_roomopen').textbox('resetValidation');
      $('#certificateCode_roomopen').textbox('resetValidation');

      $('#noReserveOpenRoom_roomOpen').show();
      $('#reserveOpenRoom_roomOpen').hide();

      $.messager.confirm('系统提示', '<span style="color:red;font-size:18px;">开房成功！<br>是否跳转到制卡页面？</span>', function (r) {
        $('#roomAmount_roomopen').textbox('setValue', '');
        if (r) {//跳到开房页面
          //关闭选项卡
          $('#hidden_createCardFlag').val(1);//flag存于index.jsp
          //如果存在制卡销卡页面则重开该页面
          eapor.utils.ifHaveJSPThenCloseThis();
        }
      });
    }
  }
  let openRoomFastClickFlag = false;
  //确认开房
  $('#south_openroom_openroom').click(function () {
    if (openRoomFastClickFlag) {
      return;
    }

    if (!$('#guestName_roomopen').textbox('isValid')) {
      $('#guestName_roomopen').textbox('textbox').focus();
      return;
    }
    if (!$('#guestPhone_roomopen').numberbox('isValid')) {
      $('#guestPhone_roomopen').numberbox('textbox').focus();
      return;
    }
    if (!$('#certificateCode_roomopen').textbox('isValid')) {
      $('#certificateCode_roomopen').textbox('textbox').focus();
      return;
    }
    if (!$('#creditCardAmount_roomopen').textbox('isValid')) {
      $('#creditCardAmount_roomopen').textbox('textbox').focus();
      return;
    }
    if (!$('#payAmount_roomopen').textbox('isValid')) {
      $('#payAmount_roomopen').textbox('textbox').focus();
      return;
    }
    var j = 0;
    for (let i = 0; i < $('#north_guestsource_openroom').combobox('getData').length; i++) {
      if ($('#north_guestsource_openroom').combobox('getText') != $('#north_guestsource_openroom').combobox('getData')[i].channelName) {
        j += 1;
      } else {
        break;
      }
      if (j == $('#north_guestsource_openroom').combobox('getData').length) {
        $.messager.show({
          title: '系统提示', msg: '客源不正确！', timeout: 2000
        });
        return;
      }
    }
    /*总参数*/
    var sr_getRoomDetailsData = {};
    /*获取住客信息*/
    var srGuestArr = [];
    //主客
    var srRoomDetailsGuestData = {};
    //调用代码
    //将客源中文转化为数字 防止bug
    $.each(eapor.data.channelObj, function (i, item) {
      if ($('#north_guestsource_openroom').combobox('getValue') == item.channelName) {
        $('#north_guestsource_openroom').combobox('setValue', item.channelId);
        return;
      }
    })


    srRoomDetailsGuestData.guestName = $('#guestName_roomopen').textbox('getValue');
    srRoomDetailsGuestData.firstName = srRoomDetailsGuestData.guestName;
    srRoomDetailsGuestData.lastName = "";
    srRoomDetailsGuestData.phone = $('#guestPhone_roomopen').numberbox('getValue');
    var gender = $('#gender_roomopen').combobox('getValue');
    //男，女
    gender === "女" ? srRoomDetailsGuestData.sexCode = 1 : srRoomDetailsGuestData.sexCode = 0;

    srRoomDetailsGuestData.email = "";
    //读身份证情况下开房
    if ($('#hidden_roomOpenCutReadInfoFromReadCard').val() != "") {

      var getIndexInfoForReadCard = JSON.parse($('#hidden_roomOpenCutReadInfoFromReadCard').val());
      $('#hidden_roomOpenCutReadInfoFromReadCard').val("");//取到数据后清空该数据

      srRoomDetailsGuestData.address = getIndexInfoForReadCard.address;//取到读取身份证时候存的地址
      //srRoomDetailsGuestData.nation = getIndexInfoForReadCard.nation;	//民族
      //srRoomDetailsGuestData.startTimeLimit = getIndexInfoForReadCard.startTimeLimit;	//开始期限
      //srRoomDetailsGuestData.stopTimeLimit = getIndexInfoForReadCard.stopTimeLimit;	//结束期限
      //srRoomDetailsGuestData.issuedOffice = getIndexInfoForReadCard.issuedOffice;	//签发机关
      //srRoomDetailsGuestData.birthday = getIndexInfoForReadCard.birthday;	//出生日期
      srRoomDetailsGuestData.photo = getIndexInfoForReadCard.photo.replace(/http:\/\/www.eapor.com\//, "");	//照片存放路径
      //未读身份证情况下开房
    } else {
      srRoomDetailsGuestData.address = "";
      //srRoomDetailsGuestData.nation = "";	//民族
      //srRoomDetailsGuestData.startTimeLimit = "1970-01-01 00:00:00";	//开始期限
      //srRoomDetailsGuestData.stopTimeLimit = "1970-01-01 00:00:00";	//结束期限
      //srRoomDetailsGuestData.issuedOffice = "";	//签发机关
      //srRoomDetailsGuestData.birthday = "1970-01-01 00:00:00";	//出生日期
      srRoomDetailsGuestData.photo = "";	//照片存放路径
    }

    //证件类型
    //var value = 1;
    var typeValue = $('#certificateType_roomopen').combobox('getValue');
    console.info(typeValue);
    $.each(eapor.hotel.certificateTypeObj, function (i, item) {
      if (typeValue == item.certificate_type_name) {
        typeValue = item.certificate_type_code;
        return;
      }
    });

    srRoomDetailsGuestData.certificateType = typeValue;
    var certificateCode = $('#certificateCode_roomopen').textbox('getValue');

    srRoomDetailsGuestData.certificateCode = certificateCode;
    srRoomDetailsGuestData.guestId = 0;
    if (!$('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected')) {
      $.messager.show({ title: '系统提示', msg: '请选择房间', timeout: 2000 });
      return;
    } else {
      var getSelectedRoomInfo = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
    }
    srRoomDetailsGuestData.roomId = getSelectedRoomInfo.roomId;
    transmitRoomDataId = getSelectedRoomInfo.roomId;
    srRoomDetailsGuestData.roomCode = getSelectedRoomInfo.roomCode;

    srGuestArr.push(srRoomDetailsGuestData);
    if ($('#hidden_roomOpenJSPAddGuestInfo').val() != "") {
      srGuestArr.push(JSON.parse($('#hidden_roomOpenJSPAddGuestInfo').val()));
      $('#hidden_roomOpenJSPAddGuestInfo').val("");
    }

    sr_getRoomDetailsData.livingguestList = JSON.stringify(srGuestArr);
    //----------------livingguestList  end------------
    /*获取房间信息*/
    var srRoomDetailsRoomData = {};
    var srRoomArr = [];
    //入住方式
    var checkInType_roomopen = $('#checkInType_roomopen').combobox('getValue');
    if (checkInType_roomopen == "晚房") {
      srRoomDetailsRoomData.checkinType = 3;
    } else if (checkInType_roomopen == "钟点房") {
      srRoomDetailsRoomData.checkinType = 2;
    } else {
      srRoomDetailsRoomData.checkinType = 1;
    }

    srRoomDetailsRoomData.checkoutOperator = $('#indexusername').val();
    srRoomDetailsRoomData.expectedLeaveTime = new Date($('#checkOutTime_roomopen').textbox('getValue'));
    srRoomDetailsRoomData.roomId = getSelectedRoomInfo.roomId;
    srRoomDetailsRoomData.roomCode = getSelectedRoomInfo.roomCode;
    srRoomDetailsRoomData.roomtypeId = getSelectedRoomInfo.roomtypeId;
    srRoomDetailsRoomData.roomtypeName = getSelectedRoomInfo.roomtypeName;
    srRoomDetailsRoomData.expectedStayNumber = $('#stayNumber_roomopen').numberspinner('getValue');
    var getreserveDetailId = sessionStorage.getItem("reserveDetailId");
    if (getreserveDetailId) {
      srRoomDetailsRoomData.reserveDetailId = Number(getreserveDetailId);
    } else {
      srRoomDetailsRoomData.reserveDetailId = 0;
    }
    srRoomArr.push(srRoomDetailsRoomData);
    sr_getRoomDetailsData.rentList = JSON.stringify(srRoomArr);
    //----------------rentList  end------------

    var oldDeposit = Number($('#payAmount_roomopen').textbox('getValue'));
    var newDeposit = (oldDeposit * 100).toFixed(0); //单位分
    var srRoomDetailsPayData = {};
    var srPayArr = [];

    //支付方式
    var payTypeData = $('#payType_roomopen').combobox('getData');
    var paymethodName = $('#payType_roomopen').combobox('getText');
    var paymethodCode = 0;
    $.each(payTypeData, function (i, item) {
      if (paymethodName == item.paymethod_name) {
        paymethodCode = item.paymethod_code;
        return;
      }
    });
    srRoomDetailsPayData.paymethodCode = paymethodCode;
    srRoomDetailsPayData.paymethodName = $('#payType_roomopen').combobox('getText');
    srRoomDetailsPayData.amount = newDeposit;
    srRoomDetailsPayData.scene = "入住";//场景（入住、预订、加单、续住、结账）
    if (srRoomDetailsPayData.paymethodCode == 5) {
      $.each(payTypeData, function (i, item) {
        if (item.paymethodName == srRoomDetailsPayData.paymethodName) {
          srRoomDetailsPayData.creditChannelId = item.channelId;
          return;
        }
      });
    }
    srPayArr.push(srRoomDetailsPayData);
    sr_getRoomDetailsData.paymentList = JSON.stringify(srPayArr);
    //----------------paymentList  end------------
    //其他参数
    var data = $('#hidden_rentplanId').val();
    var roomData = JSON.parse(data);

    //不联房情况下
    var isJointRoom_roomopen = $('#isJointRoom_roomopen').combobox('getText');
    if (isJointRoom_roomopen == "否") {
      if ($('#hidden_reserveDetailId').val() != "") {//是 预订单 不联房情况下
        sr_getRoomDetailsData.linkReceptionId = Number($('#hidden_reserveDetailId').val());//预订单ID 或连入客单ID //联入的客单id或订单客单id；
      } else {
        sr_getRoomDetailsData.linkReceptionId = 0;		/*不联入已有客单为<=0*/
      }
      //判断是否是从预订单 进入开房页面
      sr_getRoomDetailsData.channelId = $('#north_guestsource_openroom').combobox('getValue');
      //roomData.channelId;	/*客源组下的渠道id。联入已有客单时为0*/

      if ($('#north_guestsource_openroom').combobox('getValue') == '会员') {//不联房会员情况下
        /*客主会员手机号。联入已有客单时为null*/
        sr_getRoomDetailsData.memberPhone = $('#guestPhone_roomopen').numberbox('getText');
      } else {//非会员情况下
        sr_getRoomDetailsData.memberPhone = "";
      }
      var isSign = $('#isSign_roomopen').combobox('getText');
      if (isSign == "是") {
        sr_getRoomDetailsData.useChannelCredit = 1;/*渠道是否挂账，联入已有客单时为0*/
      } else {//非挂账
        sr_getRoomDetailsData.useChannelCredit = 0;/*渠道是否挂账，联入已有客单时为0*/
      }
      sr_getRoomDetailsData.rentplanId = roomData.rentplanId;/*房价方案id.联入已有客单时为0*/
      //联房情况下
    } else {
      //通过房间号 得到ID
      if ($('#hidden_reserveDetailId').val() != "") {//是 预订单 又联房情况下
        sr_getRoomDetailsData.linkReceptionId = Number($('#hidden_reserveDetailId').val());//预订单ID 或连入客单ID //联入的客单id或订单客单id；
      } else {//非 预订单 又联房情况下
        //得到dialog确定前 存的 select 数据，得到roomId
        if ($('#roomopen_hidden_livingRoomData').val() == "") {
          $.messager.show({
            title: '系统提示', msg: '请先选择联入的房间!', timeout: 3000, showType: 'slide'
          });
          return;
        }
        var getRoomIdByHidden = JSON.parse($('#roomopen_hidden_livingRoomData').val()).roomId;
        //通过roomId查出对应的receptionId
        $.ajax({
          type: 'post',
          url: '../room/getRoomById',
          data: { roomId: getRoomIdByHidden },
          dataType: 'json'
        })
          .done(function (recId) {
            sr_getRoomDetailsData.linkReceptionId = Number(recId.receptionId);
          });
      }
      sr_getRoomDetailsData.channelId = 0;
      sr_getRoomDetailsData.memberPhone = "";
      sr_getRoomDetailsData.useChannelCredit = 0;
      sr_getRoomDetailsData.rentplanId = 0;
    }
    if ($('#hidden_reserveDetailId').val() != "") {//从预订到开房
      sr_getRoomDetailsData.linkByReserve = true;	/*预订单联入为true；联房联入为false*/
    } else {//非预订单开房
      sr_getRoomDetailsData.linkByReserve = false;	/*预订单联入为true；联房联入为false*/
    }
    sr_getRoomDetailsData.guarantee_amount = (Number($('#creditCardAmount_roomopen').textbox('getValue')) * 100).toFixed(0);
    sr_getRoomDetailsData.comment = "";
    //sr_getRoomDetailsData.packageBreakfast = 

    sr_getRoomDetailsData.breakfastNumber = $('#packageBreakfast_roomopen').numberspinner('getValue');//包价早餐
    sr_getRoomDetailsData.isBreakfast = sr_getRoomDetailsData.breakfastNumber > 0 ? 1 : 0;//是否含有包价早餐 0否 1是
    const timePriceRange = JSON.parse(sessionStorage.getItem("roomPriceDetails_roomOpen"));
    timePriceRange.actualPriceList.forEach(function (item, key, obj) {
      if (timePriceRange.newPriceList[key] != -1 && typeof timePriceRange.newPriceList[key] !== 'undefined') {
        timePriceRange.actualPriceList[key] = timePriceRange.newPriceList[key];
        timePriceRange.priceList[key] = timePriceRange.newPriceList[key];
      }
    });
    console.info(timePriceRange);
    sr_getRoomDetailsData.timePriceRange = timePriceRange;
    console.info(sr_getRoomDetailsData);

    let checkHaveRoomPrice = {
      receptionId: 0,
      roomtypeId: JSON.parse(sr_getRoomDetailsData.rentList)[0].roomtypeId,//房型id
      rentplanId: roomData.rentplanId,//房价方案id
      checkinType: JSON.parse(sr_getRoomDetailsData.rentList)[0].checkinType,//入住方式
      startDateTime: $('#checkInTime_roomopen').textbox('getValue'),//开始日
      increment: JSON.parse(sr_getRoomDetailsData.rentList)[0].checkinType == 2 ?
        JSON.parse($('#index_ruleData').val()).restHour : 1,//间隔数：天房，晚房为1 ，钟点房为钟点房小时数
      expectedStay: JSON.parse(sr_getRoomDetailsData.rentList)[0].expectedStayNumber  //居住数  ：  正整数  + 0.5的倍数
    };
    //检查是否含有房价方案,只有设置过房价方案才可提交开房的信息数据
    function checkRoomPriceCallBack(result) {
      console.info(result);
      let flag_ = false;
      result.hasPrice.forEach(function (item, key, obj) {
        console.info(item);
        if (flag_) {
          return;
        }
        if (item == false) {
          flag_ = true;
          $.messager.alert('系统提示', '<span style="color:red;font-size:16px;">未查询到相关房价方案，请先设置！</span>');
          return;
        }
      });
      if (!flag_) {
        $('#south_openroom_openroom').linkbutton('disable');
        openRoomFastClickFlag = true;
        eapor.utils.defaultAjaxHasContentType("../reception/createRentReception", JSON.stringify(sr_getRoomDetailsData), srGetRoomCallbackbbbb);
      }
    }
    console.info(checkHaveRoomPrice);

    eapor.utils.defaultAjax("../reception/calculateRentAmount", checkHaveRoomPrice, checkRoomPriceCallBack);
  });

  //初始化input
  //姓名
  $('#guestName_roomopen').textbox({
    delay: 1000
  });
  //手机号码
  $('#guestPhone_roomopen').numberbox({
    delay: 1000
  });
  //证件类型
  $('#certificateType_roomopen').combobox({
    valueField: 'certificate_type_code',
    textField: 'certificate_type_name',
    data: eapor.hotel.certificateTypeObj,
    editable: false,
    panelHeight: "auto",
    onLoadSuccess: function (data) {
      var This = this;
      if (data.length > 0) {
        var flag = true;
        $.each(data, function (i, item) {
          if (item.certificate_type_name == "身份证") {
            flag = false;
            $(This).combobox('setValue', item.certificate_type_code);
            $(This).combobox('setText', item.certificate_type_name);
            return;
          }
        });
        if (flag) {
          $(This).combobox('setValue', data[0].certificate_type_code);
          $(This).combobox('setText', data[0].certificate_type_name);
        }
      }
    },
    onChange: function (newValue, oldValue) {
      if (newValue == "身份证" || newValue == 1) {
        $('#certificateCode_roomopen').textbox({});
        $('#certificateCode_roomopen').textbox('enableValidation');
      } else {
        $('#certificateCode_roomopen').textbox({});
        $('#certificateCode_roomopen').textbox('disableValidation');
      }
    }
  });

  //证件号码
  $('#certificateCode_roomopen').textbox({
    delay: 1000
  });
  //性别
  $('#gender_roomopen').combobox({
    valueField: 'id',
    textField: 'text',
    editable: false,
    value: "男",
    panelHeight: "auto",
    data: [{
      "id": "男",
      "text": "男"
    }, {
      "id": "女",
      "text": "女"
    }]
  });
  function comparisonNowTimeWithLateRoomTime() {
    //点击新建预订单 按钮 时  若 当前时间未到预订晚房时间 则 不显示 晚房的选项
    var lrt = JSON.parse($('#index_ruleData').val()).lateRoomTime;
    var nd = new Date();
    var gfy = nd.getFullYear();
    var gm = nd.getMonth() + 1;
    var gd = nd.getDate();
    if (gm < 10) {
      gm = "0" + gm;
    }
    if (nd.getTime() < (new Date(gfy + "-" + gm + "-" + gd + " " + lrt).getTime())) {
      return false;
    } else {
      return true;
    }
  }
  function getCheckInTypeData_roomOpen() {
    var typeOne = [{ 'id': '全日房', 'text': '全日房', "selected": true }, { 'id': '钟点房', 'text': '钟点房' }];
    var typeTwo = [{ 'id': '全日房', 'text': '全日房', "selected": true }, { 'id': '钟点房', 'text': '钟点房' }, { 'id': '晚房', 'text': '晚房' }];
    //当前时间超过设置的晚房时间
    if (comparisonNowTimeWithLateRoomTime()) {
      return typeTwo;
    } else {
      //当前时间未超过设置的晚房时间
      return typeOne;
    }
  }
  //入住类型
  $('#checkInType_roomopen').combobox({
    data: getCheckInTypeData_roomOpen(),
    valueField: 'id',
    textField: 'text',
    value: "全日房",
    editable: false,
    panelHeight: "auto",
    onChange: function (newValue, oldValue) {
      if (newValue == "全日房") {
        $('#stayNumberName_roomopen').html("计划居住（天）<span style='color:red;'>*</span>");
        $('#packageBreakfast_roomopen').numberspinner('enable');
      }
      if (newValue == "钟点房") {
        $('#stayNumberName_roomopen').html("计划居住（式）<span style='color:red;'>*</span>");
        $('#packageBreakfast_roomopen').numberspinner('reset').numberspinner('disable');
      }
      if (newValue == "晚房") {//lateRoomUnit
        $('#stayNumberName_roomopen').html("计划居住（天）<span style='color:red;'>*</span>");
        $('#packageBreakfast_roomopen').numberspinner('enable');
      }
      //dataTest();
      changecheckInTypeGetCountRoomPrice(newValue);
    }
  });
  $('#checkInTime_roomopen').textbox({});
  $('#checkInTime_roomopen').textbox('setValue', getNowFormatDate());
  //计划居住
  $('#stayNumber_roomopen').numberspinner({
    min: 1,//最小值    
    value: 1,
    onChange: function (newValue, oldValue) {
      console.info($('#checkInType_roomopen').combobox('getValue'))
      if ($('#checkInType_roomopen').combobox('getValue') != "钟点房") {
        console.info('1032')
        getEstimateTime(newValue);
      } else {
        console.info('1035')
        getEstimateTime_ByHourRoom(newValue);
      }
    }
  });
  $('#checkOutTime_roomopen').textbox({});
  $('#checkOutTime_roomopen').textbox('setValue', getDateForRoomOpen(new Date(getNowFormatDate().replace(/-/g, "/")).getTime() + 86400000));

  $('#payType_roomopen').combobox({
    valueField: 'paymethod_name',//paymethod_code
    textField: 'paymethod_name',
    data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
    editable: false,
    panelHeight: "auto",
    panelMaxHeight: 300,
    groupField: 'paymethod_name',
    groupFormatter: function (group) {
      if (eapor.data.PaymethodObj.length - 2 == roomOpenFlag) {
        roomOpenFlag += 1;
        return "代收";
      }
      roomOpenFlag += 1;
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].paymethod_code);
        $(this).combobox('setText', data[0].paymethod_name);
      }
    },
    loadFilter: function (data) {
      var _data = [];
      $.each(data, function (i, item) {
        if (item.paymethod_name != "积分" && item.paymethod_name != "储值") {
          _data.push(item);
        }
      });
      return _data;
    }
  });

  //押金金额
  $('#payAmount_roomopen').textbox({
    value: '0',
    delay: 1000,
    validType: ['numMaxTwoDecimal']
  });
  $('#payAmount_roomopen').textbox('textbox')
    .focus(function () {
      if ($('#payAmount_roomopen').textbox('getValue') == 0) {
        $('#payAmount_roomopen').textbox('setValue', '');
      }
    })
    .blur(function () {
      if ($('#payAmount_roomopen').textbox('getValue') == "") {
        $('#payAmount_roomopen').textbox('setValue', 0);
      }
    });
  let chFlag = false;
  //是否挂账
  $('#isSign_roomopen').combobox({
    valueField: 'text',
    textField: 'text',
    editable: false,
    panelHeight: "auto",
    data: [{
      "id": 1,
      "text": "否",
      "selected": true
    }, {
      "id": 2,
      "text": "是"
    }],
    onChange: function (newValue, oldValue) {
      if (chFlag) {
        $(this).combobox('setValue', "否");
        $(this).combobox('setText', "否");
        chFlag = false;
      }
    },
    onSelect: function (record) {
      console.info(record);
      isSign.record.id = record.id;
      if (record.id == 2) {
        var channelValue = $('#north_guestsource_openroom').combobox('getText');
        console.info("onselect");
        if (channelValue == "会员" && !$('#guestPhone_roomopen').numberbox('getValue')) {
          chFlag = true;
          $('#guestPhone_roomopen').numberbox('textbox').focus();
          $.messager.show({
            title: '系统提示', msg: '请先输入手机号码!', timeout: 3000, showType: 'slide'
          });
          return;
        }
        changeChannelGetAmount(channelValue);
      } else {
        $('#creditBalance_roomopen').textbox({});
        $('#creditBalance_roomopen').textbox('setValue', "--");
        $('#storedAmount_roomopen').textbox({});
        $('#storedAmount_roomopen').textbox('setValue', "--");
        $('#creditCardAmount_roomopen').textbox({});
        $('#creditCardAmount_roomopen').textbox('setValue', 0);
      }
    }
  });
  $('#creditBalance_roomopen').textbox({
    value: '--',
    disabled: true
  });
  //预授权金额
  $('#creditCardAmount_roomopen').textbox({
    value: '0',
    delay: 1000,
    validType: ['numMaxTwoDecimal']
  });
  $('#creditCardAmount_roomopen').textbox('textbox').focus(function () {
    var val = $('#creditCardAmount_roomopen').textbox('getValue');
    if (val == 0) {
      $('#creditCardAmount_roomopen').textbox('setValue', "");
    }
  }).blur(function () {
    if ($('#creditCardAmount_roomopen').textbox('getValue') == "") {
      $('#creditCardAmount_roomopen').textbox('setValue', 0);
    }
  });
  //是否联房
  $('#isJointRoom_roomopen').combobox({
    valueField: 'text',
    textField: 'text',
    editable: false,
    panelHeight: "auto",
    data: [{
      "id": 1,
      "text": "否",
      "selected": true
    }, {
      "id": 2,
      "text": "是"
    }],
    onSelect: function (data) {
      if (data.text == "否") {
        $('#JointRoomNumber_roomopen').textbox({});
        $('#JointRoomNumber_roomopen').textbox('setValue', '');
      }
    }
  });

  //客源下拉选项
  $('#north_guestsource_openroom').combobox({
    url: '../channel/pglist',
    queryParams: {
      channelName: '',
      offset: 0,
      limit: 9999,
      usageState: 1
    },
    valueField: 'channelId',
    textField: 'channelName',
    value: "非会员",
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onSelect: function (rec) {
      $('#hidden_rentplanId').val(JSON.stringify({
        rentplanId: rec.rentplanId,
        sourceGroupId: rec.sourceGroupId,
        channelId: rec.channelId
      }));
    },
    onChange: function (newValue, oldValue) {
      //会员中午退房延迟  【显示】
      if ($(this).combobox('getText') == "会员" && $('#checkInType_roomopen').combobox('getText') != "钟点房") {
        var t = JSON.parse($('#index_ruleData').val()).memberCheckoutDelay;
        var restHour = JSON.parse($('#index_ruleData').val()).restHour;
        var getInTime = $('#checkInTime_roomopen').textbox('getValue');
        var getStayNumber = $('#stayNumber_roomopen').numberspinner('getValue');
        var setNewTime = getDateForRoomOpen(Number(new Date(getInTime).getTime()) + Number(getStayNumber * 86400000));
        var time = getDate(new Date(setNewTime).getTime() + NP.times(t, 60000));
        $('#checkOutTime_roomopen').textbox('setValue', time);
      } else if ($(this).combobox('getText') != "会员" && $('#checkInType_roomopen').combobox('getText') != "钟点房") {
        var getInTime = $('#checkInTime_roomopen').textbox('getValue');
        var getStayNumber = $('#stayNumber_roomopen').numberspinner('getValue');
        var setNewTime = getDateForRoomOpen(Number(new Date(getInTime).getTime()) + Number(getStayNumber * 86400000));
        $('#checkOutTime_roomopen').textbox('setValue', setNewTime);
      }
      console.info("onchange");
      //changeChannelGetAmount(newValue);//改变客源 得到 信用余额
      if ($('#openRoomData').val() == "") {
        $.each(eapor.data.channelObj, function (i, item) {
          if (newValue == item.channelName) {
            changeChannelGetAmount(newValue);
            changeChannelgetCountRoomPrice(newValue);
            //dataTest();
            return;
          } else if (newValue == item.channelId) {
            changeChannelGetAmount(newValue);
            changeChannelgetCountRoomPrice(newValue);
            //dataTest();
            return;
          }
        })
      }
    },
    onLoadSuccess: function () {
      var strval = $(this).combobox("getText");
      var all = $(this).combobox("getData");
      $.each(all, function (i, item) {
        if (strval == "非会员" && strval == item.channelName) {
          $('#creditBalance_roomopen').textbox({});
          $('#creditBalance_roomopen').textbox('setValue', '--');
          var data = {};
          data.rentplanId = item.rentplanId;
          data.sourceGroupId = item.sourceGroupId;
          data.channelId = item.channelId;
          $('#hidden_rentplanId').val(JSON.stringify(data));
        }
      })
    },
    loadFilter: function (data) {
      var _data = [];
      $.each(data, function (i, item) {
        if (item.channelName != "驿宝") {
          _data.push(data[i]);
        }
      });
      return _data;
    }
  });
  //改变客源后更新该客源下的信用余额，后用于显示 
  function changeChannelGetAmount(value) {
    console.info(value);
    var Sign = isSign.record.id;
    console.info(Sign);
    //根据客源变化，改变储值金额的显示，在选择挂账的时候&&已经填上手机号码
    let getGuestPhone = $('#guestPhone_roomopen').numberbox('getValue');
    if (value == "会员" && Sign == 2) {
      //客源选择会员   && 挂账 选择 是   && 手机号码不为空--》取得 储值金额，显示与页面
      getAmountForChannelAndPhone($('#north_guestsource_openroom').combobox('getValue'), getGuestPhone);
    } else {
      $('#storedAmount_roomopen').textbox('setValue', "--");
    }
    if (value == "会员 " || value == "非会员" || Sign == 1) {
      $('#creditBalance_roomopen').textbox('setValue', '--');
      return;
    } else if (value && value != "会员 " && value != "非会员") {
      //value 未知情况
      var j = 0,
        k = 0;
      for (let i = 0; i < eapor.data.channelObj.length; i++) {
        if (value != eapor.data.channelObj[i].channelName) {
          j += 1;
        } else {
          break;
        }
        if (value != eapor.data.channelObj[i].channelId) {
          k += 1;
        } else {
          break;
        }
        if (j == eapor.data.channelObj.length && k == channelObj.responseJSON.length) {//name id全不服合情况
          $('#creditBalance_roomopen').textbox('setValue', '--');
          return;
        }
      }
      //value 为中文情况，且为正确的中文
      $.each(eapor.data.channelObj, function (i, item) {
        if (value == item.channelName) {
          value = item.channelId;
          return;
        }
      });
      $.ajax({
        type: 'post',
        url: '../channel/getbyid',
        data: { channelId: value },
        dataType: 'json'
      })
        .done(function (getResult) {
          var getAmount = (Number(getResult.creditAmount) - Number(getResult.balance));
          $('#creditBalance_roomopen').textbox('setValue', (NP.divide(getAmount, 100) + "元"));
        });
    }
  };
  //根据客源变化 + 1  房型   2 入住方式  3 起始时间  4 预离时间    计算 预期房费
  function changeChannelgetCountRoomPrice(value) {

    //避免预订单按钮，选择的数据BUG，
    $.each(eapor.data.channelObj, function (i, item) {
      if (value == item.channelName) {
        value = item.channelId;
        return;
      }
    });
    $.ajax({
      type: 'post',
      url: '../channel/getbyid',
      dataType: 'json',
      data: { channelId: value }
    })
      .done(function (rentplanIdObj) {
        //①.得到rentplanId 
        var getrentplanId = rentplanIdObj.rentplanId;
        var getselected_CleanRoom_list = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');

        if (getselected_CleanRoom_list != null) {
          //②.得到roomtypeId
          var searchRoomtypeId = getselected_CleanRoom_list.roomtypeId;//得到
          //③.得到beginTime
          var beginTime = $('#checkInTime_roomopen').textbox('getValue');
          //④.得到endTime
          var endTime = $('#checkOutTime_roomopen').textbox('getValue');
          endTime = getDate(new Date(endTime.replace(/-/g, "/")).getTime() - 86400000);
          var getRoomPriceDataChangeChannel = {};
          getRoomPriceDataChangeChannel.startDateTime = beginTime;
          //getRoomPriceDataChangeChannel.endTime = endTime;
          getRoomPriceDataChangeChannel.roomtypeId = searchRoomtypeId;//房型id

          //入住方式
          if ($('#checkInType_roomopen').textbox('getValue') == "晚房") {
            getRoomPriceDataChangeChannel.checkinType = 3;
            getRoomPriceDataChangeChannel.increment = 1;
          } else if ($('#checkInType_roomopen').textbox('getValue') == "钟点房") {
            getRoomPriceDataChangeChannel.checkinType = 2;
            getRoomPriceDataChangeChannel.increment = JSON.parse($('#index_ruleData').val()).restHour;//1;
          } else {
            getRoomPriceDataChangeChannel.checkinType = 1;
            getRoomPriceDataChangeChannel.increment = 1;
          }

          if (endTime == "") {
            $.messager.show({ title: '系统提示', timeout: 3000, msg: '请选择计划居住天数！', showType: 'slide' });
            return false;
          }

          getRoomPriceDataChangeChannel.receptionId = 0;
          getRoomPriceDataChangeChannel.rentplanId = getrentplanId;
          getRoomPriceDataChangeChannel.expectedStay = $('#stayNumber_roomopen').numberspinner('getValue');
          eapor.utils.defaultAjax("../reception/calculateRentAmount", getRoomPriceDataChangeChannel, getRoomPriceCallback);
        }
      });
  };


  //根据预离天数计算预离时间 //外加 根据客源  入住和预离时间 计算预期房费
  function getEstimateTime(value) {
    console.info(eapor.dlgcleanflag);
    console.info('#' + 'cleanRoom_list' + eapor.dlgcleanflag);
    console.info($('#' + 'cleanRoom_list' + eapor.dlgcleanflag));
    console.info($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).length);
    var getselected_CleanRoom_list = null;
    if ($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).length === 0) {

    } else {
      getselected_CleanRoom_list = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
    }
    //得到预住天数 
    var timeDay = value;
    // 获取当前时间格式的时间戳
    var timestamp2 = new Date($('#checkInTime_roomopen').textbox('getValue').replace(/-/g, "/")).getTime();
    //当前时间戳加上预住天数得到预离时间戳
    var timestamp3 = getDateForRoomOpen(timestamp2 + NP.times(86400000, timeDay));
    //转换预离时间戳格式
    if ($('#north_guestsource_openroom').combobox('getText') == "会员") {
      var t = JSON.parse($('#index_ruleData').val()).memberCheckoutDelay;
      var ti = getDate(new Date(timestamp3).getTime() + NP.times(t, 60000));
      //预离时间
      $('#checkOutTime_roomopen').textbox('setValue', ti);
    } else {
      $('#checkOutTime_roomopen').textbox('setValue', timestamp3);
    }
    if ($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).length === 0) {

    } else {
      getselected_CleanRoom_list = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
    }
    console.info($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).length);
    console.info('getselected_CleanRoom_list:', getselected_CleanRoom_list)
    if (getselected_CleanRoom_list) {
      var searchRoomtypeId = getselected_CleanRoom_list.roomtypeId;
      //计算总房价
      var beginTime = $('#checkInTime_roomopen').textbox('getValue');

      var getRoomPriceData = {};
      getRoomPriceData.startDateTime = beginTime;

      getRoomPriceData.roomtypeId = searchRoomtypeId;//房型id

      //入住方式
      if ($('#checkInType_roomopen').textbox('getValue') == "晚房") {
        var endTime = getDateForRoomOpen(new Date(timestamp3).getTime() - 86400000);
        //getRoomPriceData.endTime = endTime;
        getRoomPriceData.checkinType = 3;
        getRoomPriceData.increment = 1;
      } else if ($('#checkInType_roomopen').textbox('getValue') == "钟点房") {
        var endTime = getDate(timestamp3);
        getRoomPriceData.checkinType = 2;
        getRoomPriceData.increment = JSON.parse($('#index_ruleData').val()).restHour;//1;
      } else {
        var endTime = getDateForRoomOpen(new Date(timestamp3).getTime() - 86400000);
        getRoomPriceData.checkinType = 1;
        getRoomPriceData.increment = 1;
      }
      var data = $('#hidden_rentplanId').val();
      if (data == "") {
        $.messager.show({ title: '系统提示', timeout: 3000, msg: '请选择房间！客源！入住方式！', showType: 'slide' });
        return false;
      }

      var rentplanId = JSON.parse(data).rentplanId;//房价方案id（客源）
      getRoomPriceData.rentplanId = rentplanId;
      getRoomPriceData.expectedStay = value;
      getRoomPriceData.receptionId = 0;
      _changeDayFlag = true;

      eapor.utils.defaultAjax("../reception/calculateRentAmount", getRoomPriceData, getRoomPriceCallback);
    }
    setTimeout(() => {
      console.info($('#' + 'cleanRoom_list' + eapor.dlgcleanflag).length);
    }, 5000);
  };
  //根据预离天数计算预离时间 //外加 根据客源  入住和预离时间 计算预期房费
  function getEstimateTime_ByHourRoom(value) {
    var getselected_CleanRoom_list = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');

    //得到预住天数 
    var timeDay = value;
    // 获取当前时间格式的时间戳
    var timestamp2 = new Date($('#checkInTime_roomopen').textbox('getValue').replace(/-/g, "/")).getTime();

    //当前时间戳加上预住天数得到预离时间戳
    var timestamp3 = timestamp2 + JSON.parse($('#index_ruleData').val()).restHour * NP.times(360000, timeDay);
    //转换预离时间戳格式
    $('#checkOutTime_roomopen').textbox('setValue', getDate(timestamp3));
    if (getselected_CleanRoom_list != null) {
      var searchRoomtypeId = getselected_CleanRoom_list.roomtypeId;
      //计算总房价
      var beginTime = $('#checkInTime_roomopen').textbox('getValue');
      var endTime = getDate(timestamp3 - 86400000);

      var getRoomPriceData = {};
      getRoomPriceData.startDateTime = beginTime;
      //getRoomPriceData.endTime = endTime;
      getRoomPriceData.roomtypeId = searchRoomtypeId;//房型id
      //入住方式
      if ($('#checkInType_roomopen').textbox('getValue') == "晚房") {
        getRoomPriceData.checkinType = 3;
        getRoomPriceData.increment = 1;
      } else if ($('#checkInType_roomopen').textbox('getValue') == "钟点房") {
        getRoomPriceData.checkinType = 2;
        getRoomPriceData.increment = JSON.parse($('#index_ruleData').val()).restHour;//1;
      } else {
        getRoomPriceData.checkinType = 1;
        getRoomPriceData.increment = 1;
      }

      var data = $('#hidden_rentplanId').val();
      if (data == "") {
        $.messager.show({ title: '系统提示', timeout: 3000, msg: '请选择房间！客源！入住方式！', showType: 'slide' });
        return false;
      }

      var rentplanId = JSON.parse(data).rentplanId;//房价方案id（客源）
      getRoomPriceData.rentplanId = rentplanId;
      getRoomPriceData.expectedStay = value;
      getRoomPriceData.receptionId = 0;
      _changeDayFlag = true;
      eapor.utils.defaultAjax("../reception/calculateRentAmount", getRoomPriceData, getRoomPriceCallback);
    }
  };


  //根据入住方式变化 + 1  房型   2 客源  3 起始时间  4 预离时间    计算 预期房费
  function changecheckInTypeGetCountRoomPrice(value) {
    var data = $('#hidden_rentplanId').val();

    //①.得到rentplanId 
    var getrentplanId = JSON.parse(data).rentplanId;

    var getselected_CleanRoom_list = $('#' + 'cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');

    var getRoomPriceDataChangeCheckInType = {};
    //③.得到beginTime
    var beginTime = $('#checkInTime_roomopen').textbox('getValue');

    //得到预住天数 
    var expectedStayNumber = $('#stayNumber_roomopen').numberspinner('getValue');
    // 获取当前时间格式的时间戳
    var nowtime = new Date(beginTime.replace(/-/g, "/")).getTime();
    //入住方式
    if (value == "晚房") {
      getRoomPriceDataChangeCheckInType.checkinType = 3;
      getRoomPriceDataChangeCheckInType.increment = 1;
      //当前时间戳加上预住天数得到预离时间戳
      livetime = getDateForRoomOpen(nowtime + NP.times(86400000, expectedStayNumber));
      if ($('#north_guestsource_openroom').combobox('getText') == "会员") {
        var t = JSON.parse($('#index_ruleData').val()).memberCheckoutDelay;
        var ti = getDate(new Date(livetime).getTime() + NP.times(t, 60000));
        //预离时间
        $('#checkOutTime_roomopen').textbox('setValue', ti);
      } else {
        //预离时间
        $('#checkOutTime_roomopen').textbox('setValue', livetime);
      }
    } else if (value == "钟点房") {
      getRoomPriceDataChangeCheckInType.checkinType = 2;
      getRoomPriceDataChangeCheckInType.increment = JSON.parse($('#index_ruleData').val()).restHour;
      //当前时间戳加上预住天数得到预离时间戳
      livetime = nowtime + JSON.parse($('#index_ruleData').val()).restHour * 3600000 * expectedStayNumber;
      //预离时间
      $('#checkOutTime_roomopen').textbox('setValue', getDate(livetime));
    } else {
      getRoomPriceDataChangeCheckInType.checkinType = 1;
      getRoomPriceDataChangeCheckInType.increment = 1;
      //当前时间戳加上预住天数得到预离时间戳
      livetime = getDateForRoomOpen(nowtime + 86400000 * expectedStayNumber);
      if ($('#north_guestsource_openroom').combobox('getText') == "会员") {
        var t = JSON.parse($('#index_ruleData').val()).memberCheckoutDelay;
        var ti = getDate(new Date(livetime).getTime() + NP.times(t, 60000));
        //预离时间
        $('#checkOutTime_roomopen').textbox('setValue', ti);
      } else {
        //预离时间
        $('#checkOutTime_roomopen').textbox('setValue', livetime);
      }
    }

    //④.得到endTime
    var endTime = $('#checkOutTime_roomopen').textbox('getValue');
    endTime = getDate(new Date(endTime.replace(/-/g, "/")).getTime() - 86400000);
    if (!getselected_CleanRoom_list) {
      return;
    } else {
      //②.得到roomtypeId
      var searchRoomtypeId = getselected_CleanRoom_list.roomtypeId;//得到
    }
    getRoomPriceDataChangeCheckInType.startDateTime = beginTime;
    //getRoomPriceDataChangeCheckInType.endTime = endTime;
    getRoomPriceDataChangeCheckInType.roomtypeId = searchRoomtypeId;//房型id

    getRoomPriceDataChangeCheckInType.rentplanId = getrentplanId;
    getRoomPriceDataChangeCheckInType.expectedStay = $('#stayNumber_roomopen').numberspinner('getValue');
    getRoomPriceDataChangeCheckInType.receptionId = 0;
    eapor.utils.defaultAjax("../reception/calculateRentAmount", getRoomPriceDataChangeCheckInType, getRoomPriceCallback);
  };

  var getRoomPriceCallback = function (result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    const hasPrice = result.hasPrice;
    let flag = false;
    hasPrice.forEach(function (item, key, obj) {
      if (flag) {
        return;
      }
      if (item == false) {
        flag = true;
        $.messager.alert('系统提示', '<span style="color:red;font-size:16px;">未查询到相关房价方案，请先设置！</span>');
        return;
      }
    });
    if (flag) {
      return;
    }
    let roomprice = 0;
    if (_changeDayFlag) {
      _changeDayFlag = false;
      let details_ = sessionStorage.getItem("roomPriceDetails_roomOpen");
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
            roomprice += +result.newPriceList[key];
          }
        });
        result.actualAmount = roomprice;
      } else {
        console.info(33)
        result.actualPriceList.forEach(function (item, key, obj) {
          roomprice += +item;
        });
      }
    } else {
      const actualPriceList = result.actualPriceList;
      actualPriceList.forEach(function (item, key, obj) {
        roomprice = +((NP.plus(roomprice, item)).toFixed(2));
      });
    }
    sessionStorage.setItem("roomPriceDetails_roomOpen", JSON.stringify(result));
    //入住房费预期
    $('#roomAmount_roomopen').textbox('setValue', NP.divide(roomprice, 100));
  };




  //联房选择是，出现在住房间列表
  $('#roomopen_showLivingRoomListBtn').on('click', function () {
    if ($('#isJointRoom_roomopen').combobox('getText') == "否") {
      $.messager.show({ title: '系统提示', msg: '联房请先选择‘是’！', timeout: 5000, showType: 'slide' });
      return;
    }
    $('#roomopen_showLivingRoomListP').append('<div id="roomopen_showLivingRoomList"></div>');
    $('#roomopen_showLivingRoomList').dialog({
      title: '全部在住房间信息',
      width: 950,
      height: 650,
      closed: false,
      cache: false,
      modal: true,
      href: '../client/livingRoom.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          var select = $('#livingRoom_list').datagrid('getSelected');
          if (!select) {
            $.messager.show({ title: '系统提示', msg: '请先选择联入的房间！', timeout: 2800, showType: 'slide' });
            return;
          }
          $('#JointRoomNumber_roomopen').textbox({});
          $('#JointRoomNumber_roomopen').textbox('setValue', select.roomCode);
          $('#roomopen_hidden_livingRoomData').val(JSON.stringify(select));
          $('#roomopen_showLivingRoomList').dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $('#roomopen_showLivingRoomList').dialog('close');
        }
      }]
    })
  });
  //预订入住--宾客失约--预抵客人页面-->开房按钮进入开房页面
  var openRoomData = $('#openRoomData').val();
  if (openRoomData != "") {
    //根据receptionId查询住客信息
    openRoomData = JSON.parse(openRoomData);
    $('#north_guestsource_openroom').combobox('setValue', openRoomData.channelId);
    //宾客姓名
    $('#guestName_roomopen').textbox({});
    $('#guestName_roomopen').textbox('setValue', openRoomData.reservePerson);
    //手机号码
    $('#guestPhone_roomopen').numberbox({});
    $('#guestPhone_roomopen').numberbox('setValue', openRoomData.reserveMobile);
    //入住类型
    $('#checkInType_roomopen').combobox({});
    $('#checkInType_roomopen').combobox('setValue', openRoomData.checkinTypeChar);
    //入住日期时间
    $('#checkInTime_roomopen').textbox({});
    $('#checkInTime_roomopen').textbox('setValue', getDate(new Date()));
    //计划居住
    $('#stayNumber_roomopen').numberspinner({});
    $('#stayNumber_roomopen').numberspinner('setValue', openRoomData.expectedStayNumber);
    $('#hidden_reserveDetailId').val(openRoomData.receptionId);//存于roomopen.jsp页面预订单转入住 开房 保存receptionId 后传入 开房接口
    sessionStorage.setItem("reserveDetailId", openRoomData.reserveDetailId);
    //得到预住天数 
    var expectedStayNumber = openRoomData.expectedStayNumber;
    // 获取当前时间格式的时间戳
    var nowtime = Date.parse(new Date(getDate(openRoomData.expectedEnterTime)));
    //当前时间戳加上预住天数得到预离时间戳
    var livetime = nowtime + 86400000 * expectedStayNumber;
    //预离时间
    $('#checkOutTime_roomopen').textbox({});
    $('#checkOutTime_roomopen').textbox('setValue', getDateForRoomOpen(livetime));

    //房费
    $('#roomAmount_roomopen').textbox({});
    $('#roomAmount_roomopen').textbox('setValue', NP.divide(NP.divide(openRoomData.expectedRentAmount, openRoomData.roomNumber), 100));
    //已付金额
    if (openRoomData.amount == undefined) {
      openRoomData.amount = 0;
    }
    $('#paidAmount_roomopen').textbox({});
    $('#paidAmount_roomopen').textbox('setValue', NP.divide(openRoomData.amount, 100));
    var getRoomtypeId;
    $.each(eapor.data.roomtypeObj, function (i, item) {
      if (openRoomData.roomtypeName == item.roomtypeName) {
        getRoomtypeId = item.roomtypeId;
        return;
      }
    });
    $('#index_roomTypeIdByOtherBtnToOpenRoom').val(getRoomtypeId);
    $('#noReserveOpenRoom_roomOpen').hide();
    $('#reserveOpenRoom_roomOpen').show();
  }
})(window, eapor);