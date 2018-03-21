/**
 * @JSname:房态图js
 */
~(function (window, $, eapor) {
  //房态表打印
  function printRoomStatus (arr) {
    let _rState = {
	  '1': '空净房',	
	  '2': '空脏房',	
	  '3': '在住净房',	
	  '4': '在住脏房',	
	  '5': '维修房',	
	  '6': '自用房'	
	};
    $('#printRoomStatus_tbody').empty();
	arr.forEach(function (item) {
	  $('#printRoomStatus_tbody').append(`
		<tr>
	      <td style="width:12%;">${item.fl.floorName }</td>
	      <td style="width:12%;">${item.ro.roomtypeName}</td>
	      <td style="width:12%;">${item.ro.roomCode}</td>
	      <td style="width:12%;">${item.ro.checkin}</td>
	      <td style="width:12%;">${item.ro.leave}</td>
	      <td style="width:12%;">${item.ro.balance}</td>
	      <td style="width:12%;">${_rState['' + item.ro.roomState]}</td>
	      <td style="width:12%;"></td>
	    </tr>
	  `);
	});
  }
  $('#roomState_printBtn').on('click', function () {
	 const arr = JSON.parse(localStorage.printRoomStatusData);
	 arr.forEach(function (item) {
	   if (item.ro.roomState === 3 || item.ro.roomState === 4) {
	     console.info(item);
	     const div = $('#' + item.ro.roomId);
	     if (div.find('span.roomStatus_checkin').length) {
	    	 item.ro.checkin = '钟';
	     }
	     if (div.find('span.roomStatus_leave').length) {
	    	 item.ro.leave = '离';
	     }
	     if (div.find('span.roomStatus_balance').length) {
	    	 item.ro.balance = '欠';
	     }
	   }
	 });
	 console.info(arr);
	 const savePDFName = printRoomStatus(arr);
     //popTitle:savePDFName 为给打印显示页面 点击保存PDF文件时候， 预先设置浏览器title 即为PDF文件名称
     $('div#printRoomStatus').printArea({ popTitle: '房态表', mode: 'popup' });// mode:'popup' // 弹出新的网页
  });
  //绑定左键菜单
  function roomStatus_bindClickMenu() {
    $('div[name^=roomState]').bind('click', function (e) {
      e.preventDefault();
      let r = JSON.parse($(this).find('input').val());
      let data = {
        roomName: $(this).find('p[name=roomCode]').text(),
        roomId: r.roomId,
        roomTypeId: r.roomtypeId,
        roomTypeName: $(this).find('p[name=roomtypeName]').text(),
        rentId: r.rentId,
        roomState: $(this).attr('name').slice(9),
        receptionId: r.receptionId
      };
      $('#hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick').val(JSON.stringify(data));
      if (r.receptionId == 0) {
        $('#index_rightClickData').val(JSON.stringify(data));
      } else {
        $.ajax({
          type: 'post',
          url: '../guest/listGuestByReceptionId',
          data: { orderId: r.receptionId },
          dataType: 'json'
        })
          .done(function (result) {
            console.info(result);
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            data.guestName = result[0].guestName;
            data.phone = result[0].phone;
            $.each(eapor.data.channelObj, function (i, item) {
              if (result[0].channelId == item.channelId) {
                data.channelName = item.channelName;
                return;
              }
            });
            $('#index_rightClickData').val(JSON.stringify(data));
          });
      }
    });

    //空净房
    $(".roomState1").bind("click", function (e) {
      $('#getRoomMenuClean').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    //空脏房
    $(".roomState2").bind("click", function (e) {
      $('#getRoomMenuDirty').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    //在住净房
    $(".roomState3").bind("click", function (e) {
      $('#getRoomMenuAlready').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    //在住脏房
    $(".roomState4").bind("click", function (e) {
      $('#getRoomMenuLivingDirty').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    //维修房
    $(".roomState5").bind("click", function (e) {
      $('#getRoomMenuDirty').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    //自用房
    $(".roomState6").bind("click", function (e) {
      $('#getRoomMenuSelf').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
  }

  //小房态中的欠费和预离提示
  function roomStatus_getBalance(result) {
    if (!result) {
      return;
    }
    const balance = result.credit + result.transferOut + result.paymentAmount +
      result.debtAmount + result.freeAmount + result.signAmount -
      result.transferIn - result.oldRoomPrice - result.consumeAmount;
    console.info(balance);
    const pdiv = $("#" + result.roomId);
    //小房态中的入住方式提示
    if (result.checkinType == 2) {
      if (pdiv.find('span.roomStatus_checkin').text() !== '钟') {
        pdiv.append(`<span class='roomStatus_smallRoomStatus roomStatus_checkin'>钟</span>`);

      }
      if (balance < 0) {
        if (pdiv.find("span.roomStatus_balance").text() !== '欠') {
          pdiv.append(`<span class='roomStatus_smallRoomStatus roomStatus_balance'>欠</span>`);
        }
      }
      return;
    }
    const expleavetime = new Date(result.expectedLeaveTime);
    const emonth = expleavetime.getMonth() + 1;//预计离开的月份
    const edate = expleavetime.getDate();//预计离开的日期
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (((emonth < month) || (emonth == month && edate <= day)) && (pdiv.find('span.roomStatus_leave').text() !== '离')) {
      pdiv.append(`<span class='roomStatus_smallRoomStatus roomStatus_leave'>离</span>`);
    }
    if ((balance < 0) && (pdiv.find('span.roomStatus_balance').text() !== '欠')) {
      pdiv.append(`<span class='roomStatus_smallRoomStatus roomStatus_balance'>欠</span>`);
    }
  }
  //根据楼层，房间信息 加载房态block
  function loadroomtype(srfloorinfo, srroominfo) {
    var floor = JSON.parse(srfloorinfo);
    var room = JSON.parse(srroominfo);
    var parentdiv = $('#srcontains');
   
    const _arr = [];
    $.each(floor, function (f, fl) {
      $.each(room, function (r, ro) {
        if (fl.floorId == ro.floorId) {
          var floorPanel = $('#floor' + fl.floorId);
          if (floorPanel.length == 0) {
            parentdiv.append("<div style='width:100%;' id='floor" + fl.floorId + "'></div>");
            $('#floor' + fl.floorId).panel({
              title: '<span style="font-size:15px;margin-left:10px;">' + fl.floorName + '</span>'
            });
          }
          floorPanel = $('#floor' + fl.floorId);
          let back = 'back' + ro.roomState;
          let cdiv = "";
          cdiv += '<div id=' + ro.roomId + ' class="roomDetails ' + back + ' roomState' + ro.roomState + '"  name="roomState' +
            ro.roomState + '" style="cursor:pointer;text-align:center;font-size:16px;color:white;float:left;width: 100px;height: 100px;margin: 5px 5px;">';
          cdiv += "<p name='roomCode'>" + ro.roomCode + "</p>";
          cdiv += "<p name='roomtypeName'>" + ro.roomtypeName + "</p>";
          cdiv += "<input type='hidden' value='{\"rentId\":" + ro.rentId + ",\"receptionId\":" +
            ro.receptionId + ",\"roomId\":" + ro.roomId + ",\"roomtypeId\":" + ro.roomtypeId + "}'/>"
          cdiv += "</div>";
          floorPanel.append(cdiv);
          if (ro.roomState == 3 || ro.roomState == 4) {
            //加载小房态信息
            console.info(ro.roomCode)
            eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
              { receptionId: ro.receptionId, roomCode: ro.roomCode },
              roomStatus_getBalance);
          }
          //入住类型：天/钟
          //预离：离/否
          //押金：欠/否
          
          //位置/房型/房号/入住类型/预离/押金/房态/备注
          //2f/豪华间/206/天/离/欠/在住脏房/备注
          ro.checkin = '天';
          ro.leave = '否';
          ro.balance = '否';
	     
          _arr.push({ fl, ro })
          //let savePrintData = `${fl.floorName} / ${ro.roomtypeName} / ${ro.roomCode} / 天  / 否 / 否 / ${_rState['' + ro.roomState]}`;
          //console.info(savePrintData);
        }
      })
    });
    localStorage.printRoomStatusData = JSON.stringify(_arr);
    //绑定左键
    roomStatus_bindClickMenu();
    if (!$('#srcontains').html()) {
      $('#srcontains').append(`
		 <div style="width:100%;height:50px;color:red;font-size:24px;text-align:center;
			 vertical-align: middle;line-height: 50px;">未查询到相关信息！</div>
	 `);
    }
  }

  //搜索btn
  $('#roomState_search').on('click', function () {
    function srRoomSearchCallback(data) {
    	console.info('data**:');
    	console.info(data);
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      $('#srcontains').empty();
      let floorData = {
        floorId: $('#roomState_topSearch_floor').combobox('getValue') || 0,
        floorName: $('#roomState_topSearch_floor').combobox('getText') == "全部" ? "" :
          $('#roomState_topSearch_floor').combobox('getText')
      };
      floorData.floorId != 0 ? loadroomtype(JSON.stringify([floorData]), JSON.stringify(data)) :
        loadroomtype($('#srfloorinfo').val(), JSON.stringify(data));
    }
    let srRoomSearchData = {
      roomCode: $('#roomState_topSearch_roomCode').textbox('getText'),
      roomtypeId: $('#roomState_topSearch_roomType').combobox('getValue') || 0,
      floorId: $('#roomState_topSearch_floor').combobox('getValue') || 0,
      roomstates: $('#roomState_topSearch_roomState').combobox('getValue')
    };
    eapor.utils.defaultAjax("../room/selectRoomList", srRoomSearchData, srRoomSearchCallback);
  });

  //---------------------------------ready function----------------------------
  //空脏房/维修房 左右键
  function roomStatus_cleanDirtyRoomState(id) {
    $('#' + id).bind('click', function (e) {
      e.preventDefault();
      let r = JSON.parse($(this).find('input').val());
      let data = {
        roomName: $(this).find('p[name=roomCode]').text(),
        roomId: r.roomId,
        roomTypeId: r.roomtypeId,
        roomTypeName: $(this).find('p[name=roomtypeName]').text(),
        rentId: r.rentId,
        roomState: $(this).attr('name').slice(9),
        receptionId: r.receptionId
      };
      $('#index_rightClickData').val(JSON.stringify(data));
      $('#getRoomMenuDirty').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    })
  }

  //自用房 左右键
  function roomStatus_selfRoomState(id) {
    $('#' + id).bind('click', function (e) {
      e.preventDefault();
      let r = JSON.parse($(this).find('input').val());
      let data = {
        roomName: $(this).find('p[name=roomCode]').text(),
        roomId: r.roomId,
        roomTypeId: r.roomtypeId,
        roomTypeName: $(this).find('p[name=roomtypeName]').text(),
        rentId: r.rentId,
        roomState: $(this).attr('name').slice(9),
        receptionId: r.receptionId
      };
      $('#index_rightClickData').val(JSON.stringify(data));
      $('#getRoomMenuSelf').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    })
  }

  //空净房 左右键
  function roomStatus_emptyCleanRoomState(id) {
    $('#' + id).bind('click', function (e) {
      e.preventDefault();
      let r = JSON.parse($(this).find('input').val());
      let data = {
        roomName: $(this).find('p[name=roomCode]').text(),
        roomId: r.roomId,
        roomTypeId: r.roomtypeId,
        roomTypeName: $(this).find('p[name=roomtypeName]').text(),
        rentId: r.rentId,
        roomState: $(this).attr('name').slice(9),
        receptionId: r.receptionId
      };
      $('#index_rightClickData').val(JSON.stringify(data));
      $('#getRoomMenuClean').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    })
  }
  //在住净房 左右键
  function roomStatus_livingRoomState(id) {
    $('#' + id).bind('click', function (e) {
      e.preventDefault();
      let r = JSON.parse($(this).find('input').val());
      let data = {
        roomName: $(this).find('p[name=roomCode]').text(),
        roomId: r.roomId,
        roomTypeId: r.roomtypeId,
        roomTypeName: $(this).find('p[name=roomtypeName]').text(),
        rentId: r.rentId,
        roomState: $(this).attr('name').slice(9),
        receptionId: r.receptionId
      };
      $('#index_rightClickData').val(JSON.stringify(data));
      $('#getRoomMenuAlready').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    })
  }

  //手动修改房间状态后局部刷新房态图
  function roomStatus_updateRoomState(id) {
    var state = transmitUpRoomState;
    if (state == 1) {//空净房
      roomStatus_emptyCleanRoomState(id);
    }
    if (state == 2 || state == 5) {//空脏房 || 维修房
      roomStatus_cleanDirtyRoomState(id);
    }
    if (state == 6) {//自用房
      roomStatus_selfRoomState(id);
    }
  };
  //绑定左右键的点击事件
  function roomStatus_bindRightAndLeft(id, roomState) {
    console.info("roomState", roomState);
    $('#' + id).unbind();
    if (roomState == 1) {
      roomStatus_emptyCleanRoomState(id);
    }
    if (roomState == 2 || roomState == 5) {
      roomStatus_cleanDirtyRoomState(id);
    }
    if (roomState == 3 || roomState == 4) {
      roomStatus_livingRoomState(id);
    }
    if (roomState == 6) {
      roomStatus_selfRoomState(id);
    }
  }
  //局部修改房态
  window.roomOpen_getOneRoomState = function (result) {
    console.info(result);
    var div = $("#" + result.roomId);
    div.find('p[name="roomCode"]').text(result.roomCode);
    div.find("span").remove();
    var roomclass = "roomDetails back" + result.roomState + " roomState" + result.roomState + "";
    var roomstatename = "roomState" + result.roomState;
    div.attr("name", roomstatename);
    div.attr("class", roomclass);
    //div.attr("name","roomState" + item.roomState);
    var input = div.find('input');
    input.val("{\"rentId\":" + result.rentId + ",\"receptionId\":" + result.receptionId + ",\"roomId\":" + result.roomId + ",\"roomtypeId\":" + result.roomtypeId + "}")
    //加载小房态信息
    console.info(result.receptionId);
    console.info(result.roomCode);
    eapor.utils.defaultAjax("../persevere/getContinueRoomDataByReceptionId",
      { receptionId: result.receptionId, roomCode: result.roomCode },
      roomStatus_getBalance);
    //绑定左右键
    roomStatus_bindRightAndLeft(result.roomId, result.roomState);
  }
  //加载所有房态的信息【别的页面有调用该方法】
  window.initAllRoomState = function () {
    //加载房间信息
    function srlistcb(data) {
      console.info(data);
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      var roominfo = JSON.stringify(data);
      $('#srroominfo').val(roominfo);
      //动态加载房态图
      var srfloorinfo = $('#srfloorinfo').val();
      var srroominfo = $('#srroominfo').val();
      loadroomtype(srfloorinfo, srroominfo);
      //阻止冒泡
      $(document).bind('contextmenu', function (e) {
        e.preventDefault();
      });
    }
    //加载楼层信息
    function srfloorlist(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      var floorinfo = JSON.stringify(data);
      $('#srfloorinfo').val(floorinfo);
      //加载房间信息
      var srdata = {
        floorId: $('#roomState_topSearch_floor').combobox('getValue') || 0,
        roomtypeId: $('#roomState_topSearch_roomType').combobox('getValue') || 0,
        roomCode: $('#roomState_topSearch_roomCode').textbox('getValue'),
        offset: 0,
        limit: 9999
      };
      eapor.utils.defaultAjax("../room/listRoomPage", srdata, srlistcb);
    }
    //init
    eapor.utils.defaultAjax("../floor/pglist", { floorName: "", limit: 999, offset: 0 }, srfloorlist);
  }

  /*-----------------------------------rentList datagrid------------------------------*/
  /*住客列表*/
  function rsRightClick_guestListMenu() {
    $("#guestListMenuP").append(`<div id='guestListMenu'></div>`);
    $('#guestListMenu').dialog({
      title: '住客列表',
      href: "../client/Entourage.jsp",
      width: 800,
      height: 600,
      modal: true,
      onClose: function () {
        $(this).dialog("destroy");
      },
      buttons: [{
        text: '取消',
        handler: function () {
          $('#guestListMenu').dialog('close');
        }
      }]
    })
  }
  /*修改房间状态*/
  function updateRoomStateCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
      eapor.utils.roomOpen_successRefreshRoomType(transmitUpRoomStateId, 0);
      return;
    }
  }
  var transmitUpRoomStateId = 0;
  var transmitUpRoomState = 0;
  /*修改房间状态*/
  function rightClick_updateRoomState() {
    $('#updataRoomStateDialog').append(
      `<div id="div" style="padding:20px 0 0 30px;">
				<div style="margin-bottom:10px;">
					<input disabled="disabled" id="updateRoomState_roomName"  labelAlign="right" labelWidth="120" 
					label="房间名称：" labelPosition="before" style="width:250px">
				</div>
				<div style="margin-bottom:10px;">
					<select id="updateRoomState_roomState" labelAlign="right" labelWidth="120" label="修改后房间状态：" 
					labelPosition="before" style="width:250px"></select>
				</div>
			</div>`
    );
    $('#updateRoomState_roomName').textbox({});
    let combo = [];
    let data = JSON.parse($('#index_rightClickData').val());
    let dr = Number(data.roomState);
    switch (dr) {
      case 1:
        combo = [{ "id": 2, "text": "空脏房" }, { "id": 5, "text": "维修房" }, { "id": 6, "text": "自用房" }];
        break;
      case 2:
        combo = [{ "id": 1, "text": "空净房" }, { "id": 5, "text": "维修房" }, { "id": 6, "text": "自用房" }];
        break;
      case 4:
        combo = [{ "id": 3, "text": "在住净房" }];
        break;
      case 5:
        combo = [{ "id": 1, "text": "空净房" }, { "id": 2, "text": "空脏房" }];
        break;
      case 6:
        combo = [{ "id": 1, "text": "空净房" }, { "id": 2, "text": "空脏房" }];
        break;
    }
    $("#updateRoomState_roomState").combobox({
      data: combo,
      valueField: 'id',
      textField: 'text',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200
    });

    $("#updateRoomState_roomName").textbox("setValue", data.roomName);
    $("#div").dialog({
      title: '修改房间状态',
      width: 380,
      height: 180,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var update = {};
          transmitUpRoomStateId = data.roomId;
          transmitUpRoomState = $("#updateRoomState_roomState").combobox("getValue");
          if ($("#updateRoomState_roomState").combobox("getValue") == "") {
            $.messager.show({ title: '系统提示', msg: '房间状态不能为空！', timeout: 2000, showType: 'slide' });
            return;
          }
          update.roomId = data.roomId;
          update.roomState = transmitUpRoomState;
          eapor.utils.defaultAjax("../room/UpRState", update, updateRoomStateCallback);
          $('#div').dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }

  $(function () {
    $('#roomState_topSearch_roomState').combobox({
      data: [
        { 'rsid': "", 'rsname': '全部', 'selected': true },
        { 'rsid': 1, 'rsname': '空净房' },
        { 'rsid': 2, 'rsname': '空脏房' },
        { 'rsid': 3, 'rsname': '在住净房' },
        { 'rsid': 4, 'rsname': '在住脏房' },
        { 'rsid': 5, 'rsname': '维修房' },
        { 'rsid': 7, 'rsname': '自用房' }
      ],
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      valueField: 'rsid',
      textField: 'rsname',
    });
    //加载搜索信息
    $('#roomState_topSearch_floor').combobox({
      url: "../floor/getFloorForSearch",
      queryParams: { limit: 9999, offset: 0, floorName: '' },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      valueField: 'floorId',
      textField: 'floorName',
      onShowPanel: function () {
        $(this).combobox('reload');
      },
      loadFilter: function (redata) {
        if (redata != -3333 && redata != -3335) {
          redata.unshift({ floorId: 0, floorName: "全部" });
        }
        return redata;
      }
    });

    $('#roomState_topSearch_roomType').combobox({
      url: '../roomtype/getRoomtypeForSearch',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      onShowPanel: function () {
        $(this).combobox('reload');
      },
      loadFilter: function (redata) {
        if (redata != -3333 && redata != -3335) {
          redata.unshift({ roomtypeId: 0, roomtypeName: "全部" });
        }
        return redata;
      }
    });

    //空净房
    $('#getRoomMenuClean').menu({
      onClick: function (item) {
        if (item.name == "openRoom") {
          //开房
          var data = JSON.parse($('#index_rightClickData').val());
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#room_open').trigger('click');
        }
        if (item.name == "createRoomCard") {
          //制房卡
          //$('#index_pubRoomData').val(JSON.stringify(data));
          //toCreateCardJSP();

          //得到房态图 鼠标点击预存的 房间信息， 后再制卡JSP页面 进行判断
          $('#hidden_roomStatusToCreateCardFlag').val($('#hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick').val());
          console.info($('#hidden_roomStatusToCreateCardFlag').val());
          eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
        }
        if (item.name == "updateRoomState") {
          //修改房间状态
          rightClick_updateRoomState();
        }
      }
    });
    //空脏房
    $('#getRoomMenuDirty').menu({
      onClick: function (item) {
        if (item.name == "updateRoomState") {
          //修改房间状态
          rightClick_updateRoomState();
        }
      }
    });
    //在住净房
    $('#getRoomMenuAlready').menu({
      onClick: function (item) {
        var data = JSON.parse($('#index_rightClickData').val());
        if (item.name == "guestReceptionList") {
          //宾客账单
          $('#index_pubRoomData').val(JSON.stringify(data));
          $("#get_bill").trigger("click");
        }
        if (item.name == "createRoomCard") {
          //得到房态图 鼠标点击预存的 房间信息， 后再制卡JSP页面 进行判断
          $('#hidden_roomStatusToCreateCardFlag').val($('#hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick').val());
          eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
        }
        if (item.name == "guestList") {
          eapor.data.indexEntourageList = JSON.stringify(data);
          //住客列表
          rsRightClick_guestListMenu();
        }
        if (item.name == "addReceoption") {
          //加单
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#add_reception').trigger('click');
        }
        if (item.name == "exitRoom") {
          //退房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#exit_room').trigger('click');
        }
        if (item.name == "continueRoom") {
          //续房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#continue_room').trigger('click');
        }
        if (item.name == "changeRoom") {
          //换房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#change_room').trigger('click');
        }
      }
    });
    //在住脏房
    $('#getRoomMenuLivingDirty').menu({
      onClick: function (item) {
        var data = JSON.parse($('#index_rightClickData').val());
        if (item.name == "guestReceptionList") {
          //宾客账单
          $('#index_pubRoomData').val(JSON.stringify(data));
          $("#get_bill").trigger("click");
        }
        if (item.name == "createRoomCard") {
          //制房卡

          //得到房态图 鼠标点击预存的 房间信息， 后再制卡JSP页面 进行判断
          $('#hidden_roomStatusToCreateCardFlag').val($('#hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick').val());
          eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
        }
        if (item.name == "guestList") {
          eapor.data.indexEntourageList = JSON.stringify(data);
          //住客列表
          rsRightClick_guestListMenu();
        }
        if (item.name == "addReceoption") {
          //加单
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#add_reception').trigger('click');
        }
        if (item.name == "exitRoom") {
          //退房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#exit_room').trigger('click');
        }
        if (item.name == "continueRoom") {
          //续房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#continue_room').trigger('click');
        }
        if (item.name == "changeRoom") {
          //换房
          $('#index_pubRoomData').val(JSON.stringify(data));
          $('#change_room').trigger('click');
        }
        if (item.name == "updateRoomState") {
          //修改房间状态
          rightClick_updateRoomState();
        }
      }
    });
    //自用房
    $('#getRoomMenuSelf').menu({
      onClick: function (item) {
        if (item.name == "createRoomCard") {
          //制房卡
          //toCreateCardJSP();

          //得到房态图 鼠标点击预存的 房间信息， 后再制卡JSP页面 进行判断
          $('#hidden_roomStatusToCreateCardFlag').val($('#hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick').val());
          eapor.utils.ifHaveJSPThenCloseThis();//重启制卡JSP页面
        }
        if (item.name == "updateRoomState") {
          //修改房间状态
          rightClick_updateRoomState();
        }
      }
    });

    window.initAllRoomState();
  });
})(window, window.jQuery, window.eapor);