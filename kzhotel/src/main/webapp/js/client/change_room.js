/**
 * @name:换房JS
 */
~(function () {
  "use strict";
  var _transmitOldRoomId = 0,
    _transmitNewRoomId = 0,
    _changeRoom_changeRoomData = "",
    _hiddenroomId_changeroom = -1,
    _newRoomTypeId_changeRoomData = -1,
    _hiddenchannelId_changeroom = -1,
    _hiddencheckinType_changeroom = -1;

  /*获取换房信息*/
  function changeRoom_getChangeRoomDataCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    _hiddenchannelId_changeroom = result.channelId;
    _hiddencheckinType_changeroom = result.checkinType;
    _transmitOldRoomId = result.roomId;

    _changeRoom_changeRoomData = JSON.stringify(result);
    //住客姓名
    $('#tab_room_change').propertygrid('updateRow', { index: 0, row: { value: result.guestName } });
    //房间号
    $('#tab_room_change').propertygrid('updateRow', { index: 1, row: { value: result.roomCode } });
    //已发房卡数量
    $('#tab_room_change').propertygrid('updateRow', { index: 2, row: { value: result.roomCardCount } });

    //入住时间
    $('#tab_room_change').propertygrid('updateRow', { index: 6, row: { value: getDate(result.enterTime) } });
    //预离时间
    $('#tab_room_change').propertygrid('updateRow', { index: 7, row: { value: getDate(result.expectedLeaveTime) } });
    //房费
    $('#tab_room_change').propertygrid('updateRow', { index: 8, row: { value: NP.divide(result.oldRoomPrice, 100) } });
    //消费总额
    $('#tab_room_change').propertygrid('updateRow', { index: 9, row: { value: NP.divide(result.consumeAmount, 100) } });
    //总金额
    var total = NP.divide(NP.plus(result.consumeAmount, result.oldRoomPrice), 100);
    $('#tab_room_change').propertygrid('updateRow', { index: 10, row: { value: total } });
    //已付金额
    $('#tab_room_change').propertygrid('updateRow', { index: 11, row: { value: NP.divide(result.paymentAmount, 100) } });
    //需支付的金额
    var deposit = (total - NP.divide(result.paymentAmount, 100)).toFixed(2);
    $('#tab_room_change').propertygrid('updateRow', { index: 12, row: { value: deposit } });
    //签单挂账
    if (result.signAmount == 0) {
      $('#tab_room_change').propertygrid('updateRow', { index: 13, row: { value: "--" } });
    } else {
      $('#tab_room_change').propertygrid('updateRow', { index: 13, row: { value: NP.divide(result.signAmount, 100) } });
    }
    //信用余额
    if (result.credit == 0) {
      $('#tab_room_change').propertygrid('updateRow', { index: 14, row: { value: "--" } });
    } else {
      $('#tab_room_change').propertygrid('updateRow', { index: 14, row: { value: NP.divide(result.credit, 100) + "（" + result.creditName + "）" } });
    }
  }
  //换房按钮
  function changeRoom_submitCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '换房成功！', timeout: 2000, showType: 'slide' });
      $('#changeRoomData').val("");
      $('#kzmaintable').tabs('close', '换房');
      eapor.utils.roomOpen_successRefreshRoomType(_transmitNewRoomId, _transmitOldRoomId);
      $('#kzmaintable').tabs('select', '房态图');
    } else {
      $.messager.show({ title: '系统提示', msg: '换房失败！', timeout: 2000, showType: 'slide' });
    }
  }
  //换房并制卡按钮
  function changeRoomAndCreateCard_submitCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 1) {
      $.messager.show({ title: '系统提示', msg: '换房成功！', timeout: 2000, showType: 'slide' });

      $('#changeRoomData').val("");
      $('#kzmaintable').tabs('close', '换房');
      console.info(_transmitNewRoomId);
      console.info(_transmitOldRoomId);
      eapor.utils.roomOpen_successRefreshRoomType(_transmitNewRoomId, _transmitOldRoomId);
      $('#kzmaintable').tabs('select', '房态图');
      $.messager.confirm('系统提示', '换房成功！是否跳转到制卡页面？', function (r) {
        if (r) {
          //制卡方法 
          eapor.utils.ifHaveJSPThenCloseThis();
        } else {

        }
      });
    } else {
      $.messager.show({ title: '系统提示', msg: '换房失败！', timeout: 2000, showType: 'slide' });
    }
  }

  //获得新房间的房价
  function getNewRoomPrice_changeRoom(channelId, checkinType) {
    if (channelId == -1 || checkinType == -1) {
      return "";
    }
    var renId = $.ajax({
      type: 'post',
      url: '../channel/getbyid',
      data: { channelId: channelId },
      dataType: 'json',
      async: false
    }).responseJSON;
    var increment = 1;
    if (checkinType == 2) {
      increment = JSON.parse($('#index_ruleData').val()).restHour;
    }
    var data = {
      receptionId: 0, //房型id
      roomtypeId: _newRoomTypeId_changeRoomData, //房型id
      rentplanId: renId.rentplanId, //房价方案id
      checkinType: checkinType, //入住方式
      startDateTime: getDate(new Date().getTime()), //开始日
      increment: increment,  //间隔数：天房，晚房为1 ，钟点房为钟点房小时数
      expectedStay: 1  //居住数  ：  正整数  + 0.5的倍数
    };

    console.info(data);
    var mm = $.ajax({
      type: 'post',
      url: '../reception/calculateRentAmount',
      data: data,
      async: false,
      dataType: 'json'
    }).responseJSON;
    return NP.divide(mm.actualAmount, 100);
  }
  //属性表格
  $('#tab_room_change').propertygrid({
    showHeader: false,//隐藏头
    striped: true,//隔行变色
    data: {
      "total": 30,
      "rows": [
        { "name": "宾客姓名", "value": "", "group": "宾客身份信息" }
        , { "name": "原房号", "value": "", "group": "宾客身份信息" }
        , { "name": "已发房卡数量", "value": "", "group": "宾客身份信息" }
        , { "name": "新房型选择", "value": "", "group": "选择房型(点击空净房列表选择)" }
        , { "name": "新房号选择", "value": "", "group": "选择房型(点击空净房列表选择)" }
        , { "name": "新房间单价", "value": "", "group": "选择房型(点击空净房列表选择)" }
        , { "name": "入住时间", "value": "", "group": "入住详情" }
        , { "name": "退房时间", "value": "", "group": "入住详情" }
        , { "name": "房费", "value": "", "group": "入住详情" }
        , { "name": "消费", "value": "", "group": "入住详情" }
        , { "name": "总额", "value": "", "group": "入住详情" }
        , { "name": "已付金额", "value": "", "group": "入住详情" }
        , { "name": "需支付金额", "value": "", "group": "入住详情" }
        , { "name": "签单挂账", "value": "", "group": "" }
        , { "name": "信用余额", "value": "", "group": "" }
      ]
    },
    columns: [[
      { field: 'name', title: '', width: 10 },
      { field: 'value', title: '', width: 60 }
    ]],
    showGroup: true, //定义是否显示属性分组。
    scrollbarSize: 0//滚动条的宽度
  });

  //空房列表
  $("#north_roomlist_changeroom").click(function () {
    $('#showallroomlistDiv_changeroomP').append(
      '<div id="showallroomlistDiv_changeroom"></div>'
    );
    var showallroomlistDiv_changeroom_dialog = $('#showallroomlistDiv_changeroom').dialog({
      width: 980,
      height: 600,
      closed: false,
      title: '全部空房列表',
      cache: false,
      href: '../client/common-cleanRoomC.jsp',//
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var getselected_CleanRoom_list = $('#cleanRoom_listdlgchangeclean').datagrid('getSelected');
          console.info(getselected_CleanRoom_list);
          if (getselected_CleanRoom_list != null) {
            var searchRoomtypeName = getselected_CleanRoom_list.roomtypeName;//房间类型名称（单人间）
            var searchRoomCode = getselected_CleanRoom_list.roomCode;//房间名称（A101）
            var searchRoomId = getselected_CleanRoom_list.roomId;
            _transmitNewRoomId = searchRoomId;
            _hiddenroomId_changeroom = searchRoomId;
            _newRoomTypeId_changeRoomData = getselected_CleanRoom_list.roomtypeId;
            $('#tab_room_change').propertygrid('updateRow', { index: 3, row: { value: searchRoomtypeName } });
            $('#tab_room_change').propertygrid('updateRow', { index: 4, row: { value: searchRoomCode } });
            //新房间单价
            var channelId = _hiddenchannelId_changeroom,
              checkinType = _hiddencheckinType_changeroom,
              newRoomPrice = getNewRoomPrice_changeRoom(channelId, checkinType);
            console.info(newRoomPrice);
            $('#tab_room_change').propertygrid('updateRow', { index: 5, row: { value: newRoomPrice } });
            showallroomlistDiv_changeroom_dialog.dialog('close');
          } else {
            $.messager.show({ title: '系统提示', msg: '请先选择信息！', timeout: 2000, showType: 'slide' });
          }
        }
      }, {
        text: '取消',
        handler: function () {
          showallroomlistDiv_changeroom_dialog.dialog('close');
        }
      }]
    });
  });

  //显示全部在住客人列表按钮点击事件
  $("#north_livingguest_changeroom").click(function () {
    $('#showalllivingguestsDiv_changeroomP').append(
      '<div id="showalllivingguestsDiv_changeroom">' +
      '</div>'
    );
    var living_dialog = $('#showalllivingguestsDiv_changeroom').dialog({
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
          var getselected_livingRoom_list = $('#livingRoom_list').datagrid('getSelected');
          if (getselected_livingRoom_list != null) {
            var searchReceptionId = getselected_livingRoom_list.receptionId;
            var roomCode = getselected_livingRoom_list.roomCode;
            //清空原先房间选择
            _hiddenroomId_changeroom = -1;
            $('#tab_room_change').propertygrid('updateRow', { index: 3, row: { value: "" } });
            $('#tab_room_change').propertygrid('updateRow', { index: 4, row: { value: "" } });
            $('#tab_room_change').propertygrid('updateRow', { index: 5, row: { value: "" } });

            eapor.utils.defaultAjax('../persevere/getContinueRoomDataByReceptionId'
              , { receptionId: searchReceptionId, roomCode: roomCode }
              , changeRoom_getChangeRoomDataCallback);
            living_dialog.dialog('close');
          } else {
            $.messager.alert("系统提示", "请选择数据");
          }
        }
      }, {
        text: '取消',
        handler: function () {
          living_dialog.dialog('close');
        }
      }]
    });
  });

  //换房按钮
  function changeRoomFunction(value) {
    if (_changeRoom_changeRoomData == "") {
      $.messager.show({ title: '系统提示', msg: '请先从在住房列表选择房间！', timeout: 2000, showType: 'slide' });
      return;
    }
    var changeRoomData = JSON.parse(_changeRoom_changeRoomData);
    var data = {};
    data.rentId = changeRoomData.rentId;
    data.oldRoomStateTo = 2;

    if (_hiddenroomId_changeroom == -1) {
      $.messager.show({ title: '系统提示', msg: '请先从空净房列表选择更换后的房间！', timeout: 2000, showType: 'slide' });
      return;
    }
    data.newRoomId = _hiddenroomId_changeroom;
    console.info(value);
    console.info(data);


    if (value == 1) {//换房按钮情况下执行
      eapor.utils.defaultAjax('../reception/changeRoom', data, changeRoom_submitCallback);
    } else {//换房并制卡按钮情况下执行
      eapor.utils.defaultAjax('../reception/changeRoom', data, changeRoomAndCreateCard_submitCallback);
    }
  };
  //换房btn
  $('#south_changeroom_changeroom').on('click', function () {
    changeRoomFunction(1);
  });
  //换房并制卡btn
  $('#south_changeroomAndCreateCard_changeroom').on('click', function () {
    changeRoomFunction(2);
  });

  var changeRoom = $('#changeRoomData').val();
  var pubData = $('#index_pubRoomData').val();
  if (pubData != "") {
    pubData = JSON.parse(pubData);
    var data = {};
    data.receptionId = pubData.receptionId;
    data.roomCode = pubData.roomName;
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
      data, changeRoom_getChangeRoomDataCallback);
    return;
  }

  if (changeRoom != "") {
    changeRoom = JSON.parse(changeRoom);
    //根据receptionId获取续房所需信息
    var data = {};
    data.receptionId = changeRoom.receptionId;
    data.roomCode = changeRoom.roomCode;
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
      data, changeRoom_getChangeRoomDataCallback);
  } else {
    $('#north_livingguest_changeroom').trigger('click');
  }
})();