/**
 * @JSname:退房
 */
~(function () {
  "use strict";
  var transmitExitRoomId = 0;
  //显示全部在住客人按钮
  $("#north_livingguest_exitroom").click(function () {
    $('#showalllivingguestsDivP').append(
      "<div id='showalllivingguestsDiv' style='display:none;'></div>"
    );
    var showalllivingguestsDiv_dialog = $('#showalllivingguestsDiv').dialog({
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
          if (!getselected_livingRoom_list) {
            $.messager.show({ title: '系统提示', msg: '请先选择信息！', timeout: 2000, showType: 'slide' });
            return;
          }
          var data = {};
          data.receptionId = getselected_livingRoom_list.receptionId;
          data.roomCode = getselected_livingRoom_list.roomCode;
          showalllivingguestsDiv_dialog.dialog('close');
          eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
            data, exitRoom_getGuestInfoByReceptionId);
        }
      }, {
        text: '取消',
        handler: function () {
          showalllivingguestsDiv_dialog.dialog('close');
        }
      }]
    });
  });

  //签收门卡 按钮
  $("#south_exitroomcard_exitroom").click(function () {
    eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
  });
  //退房按钮点击事件
  $('#south_exitroom_exitroom').click(function () {
    var getRentId = $('#hiddenGetRentId').val();
    if (getRentId == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: '../rent/exitRoom',
      data: { rentId: getRentId },
      success: function (result) {
        console.info(result);
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          return;
        }
        if (result > 0) {
          $.messager.show({ title: '系统提示', msg: '退房成功！', timeout: 2000, showType: 'slide' });
          $('#exitRoomData').val("");
          //关闭选项卡
          eapor.data.index_refreshRoomType = "exitRoom";
          eapor.utils.roomOpen_successRefreshRoomType(transmitExitRoomId, 0);
          $('#kzmaintable').tabs('select', '房态图');
          $('#kzmaintable').tabs('close', '退房');
          return;
        }
        $.messager.show({ title: '系统提示', msg: '退房失败！', timeout: 2000, showType: 'slide' });
      }
    })
  });

  //退房并结账按钮点击事件
  $('#south_exitroomandgetbill_exitroom').click(function () {
    var getRentId = $('#hiddenGetRentId').val();
    if (getRentId == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: '../rent/exitRoom',
      data: { rentId: getRentId },
      success: function (result) {
        console.info(result);
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          return;
        }
        if (result > 0) {
          $('#exitRoomData').val("");
          //关闭选项卡
          eapor.data.index_refreshRoomType = "exitRoom";
          console.info("transmitExitRoomId", transmitExitRoomId);
          eapor.utils.roomOpen_successRefreshRoomType(transmitExitRoomId, 0);
          $('#kzmaintable').tabs('select', '房态图');
          $('#kzmaintable').tabs('close', '退房');
          $.messager.confirm('系统提示', '退房成功！进入结账功能操作？', function (r) {
            if (r) {
              if ($('#kzmaintable').tabs('exists', "宾客账单")) {
                $('#kzmaintable').tabs('close', '宾客账单');
                $('#kzmaintable').tabs('add', {
                  title: '宾客账单',
                  closable: true,
                  plain: false,
                  border: false,
                  href: '../client/get_bill.jsp'
                });
              } else {
                $('#kzmaintable').tabs('add', {
                  title: '宾客账单',
                  closable: true,
                  plain: false,
                  border: false,
                  href: '../client/get_bill.jsp'  // 宾客账单页面
                });
              }
            }
          });
        } else {
          $.messager.show({ title: '系统提示', msg: '退房失败！', timeout: 2000, showType: 'slide' });
        }
      }
    })
  });

  /*根据receptionId获得住客信息*/
  function exitRoom_getGuestInfoByReceptionId(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    transmitExitRoomId = result.roomId;
    eapor.data.exitRoomAndGetBill = JSON.stringify(result);//将宾客信息存于index.js里设置的全局变量，为了实现 退房并结账功能按钮
    $('#hiddenGetRentId').val(result.rentId);
    //宾客姓名
    $('#tab_room_exit').propertygrid('updateRow', { index: 0, row: { value: result.guestName } });
    //房间号
    $('#tab_room_exit').propertygrid('updateRow', { index: 1, row: { value: result.roomCode } });
    //发出房卡数量
    $('#tab_room_exit').propertygrid('updateRow', { index: 2, row: { value: result.roomCardCount } });
    //入住时间
    $('#tab_room_exit').propertygrid('updateRow', { index: 3, row: { value: getDate(result.enterTime) } });
    //预离时间
    $('#tab_room_exit').propertygrid('updateRow', { index: 4, row: { value: getDate(result.expectedLeaveTime) } });
    //房费
    $('#tab_room_exit').propertygrid('updateRow', { index: 5, row: { value: NP.divide(result.oldRoomPrice, 100) } });
    //消费总额
    $('#tab_room_exit').propertygrid('updateRow', { index: 6, row: { value: NP.divide(result.consumeAmount, 100) } });
    //支付金额
    $('#tab_room_exit').propertygrid('updateRow', { index: 7, row: { value: NP.divide(result.paymentAmount, 100) } });

    var amount = (NP.divide(result.rentAmount, 100) + NP.divide(result.consumeAmount, 100) -
      NP.divide(result.paymentAmount, 100) - NP.divide(result.signAmount, 100) -
      NP.divide(result.freeAmount, 100) - NP.divide(result.debtAmount, 100)).toFixed(2);
    //balance
    $('#tab_room_exit').propertygrid('updateRow', { index: 8, row: { value: amount } });

    if (result.signAmount == 0) {
      //签单单位
      $('#tab_room_exit').propertygrid('updateRow', { index: 9, row: { value: "--" } });
      //签单金额
      $('#tab_room_exit').propertygrid('updateRow', { index: 10, row: { value: "--" } });
    } else {
      //签单单位
      $('#tab_room_exit').propertygrid('updateRow', { index: 9, row: { value: result.signName } });
      //签单金额
      $('#tab_room_exit').propertygrid('updateRow', { index: 10, row: { value: "-" + NP.divide(result.signAmount, 100) } });
    }
    //信用余额
    if (result.credit == 0) {
      $('#tab_room_exit').propertygrid('updateRow', { index: 11, row: { value: "--" } });
    } else {
      $('#tab_room_exit').propertygrid('updateRow', { index: 11, row: { value: NP.divide(result.credit, 100) + "（" + result.creditName + "）" } });
    }
  }

  //属性表格
  $('#tab_room_exit').propertygrid({
    showHeader: false,//隐藏头
    striped: true,//隔行变色
    data: {
      "total": 30,
      "rows": [{ "name": "宾客姓名", "value": "", "group": "详情" },
      { "name": "房号", "value": "", "group": "详情" },
      { "name": "发出房卡数量", "value": "", "group": "详情" },
      { "name": "入住时间", "value": "", "group": "详情" },
      { "name": "预离时间", "value": "", "group": "详情" },
      { "name": "房费", "value": "", "group": "详情" },
      { "name": "消费总额", "value": "", "group": "详情" },
      { "name": "已付金额", "value": "", "group": "详情" },
      { "name": "balance", "value": "", "group": "详情" },
      { "name": "签单单位", "value": "", "group": "签单" },
      { "name": "签单金额", "value": "", "group": "签单" },
      { "name": "信用余额", "value": "", "group": "信用" }
				          /*{"name" : "免单金额","value" : "","group" : "免单"},
				          {"name" : "坏账金额","value" : "","group" : "坏账"}*/]
    },
    columns: [[
      { field: 'name', title: '', width: 10 },
      { field: 'value', title: '', width: 80 }
    ]],
    showGroup: true, //定义是否显示属性分组。
    scrollbarSize: 0//滚动条的宽度
  });

  console.info($('#exitRoomData').val());
  console.info($('#index_pubRoomData').val());
  var exitRoomData = $('#exitRoomData').val();
  var pubData = $('#index_pubRoomData').val();//房态图
  if (pubData != "") {
    pubData = JSON.parse(pubData);
    var data = {
      receptionId: pubData.receptionId,
      roomCode: pubData.roomName ? pubData.roomName : pubData.roomCode
    };
    $('#index_pubRoomData').val("");
    console.info(data);
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId", data, exitRoom_getGuestInfoByReceptionId);
  } else if (exitRoomData != "") {
    exitRoomData = JSON.parse(exitRoomData);
    $('#exitRoomData').val("");
    var data = {
      receptionId: exitRoomData.receptionId,
      roomCode: exitRoomData.roomCode
    };
    console.info(data);
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId", data, exitRoom_getGuestInfoByReceptionId);
  } else if (eapor.data.GuestShouldLeaveJSPToExitRoomJSP != "") {//宾客应离店预警 JSP 退房、退房并结账按钮 进入 本JSP，变量存于index.JS
    var dataInfo = JSON.parse(eapor.data.GuestShouldLeaveJSPToExitRoomJSP);
    var data = {
      receptionId: dataInfo.receptionId,
      roomCode: dataInfo.roomCode
    };
    eapor.data.GuestShouldLeaveJSPToExitRoomJSP = "";
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId", data, exitRoom_getGuestInfoByReceptionId);
  } else {
    $("#north_livingguest_exitroom").trigger('click');
  }
})();