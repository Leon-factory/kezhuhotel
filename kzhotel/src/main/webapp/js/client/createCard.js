/**
 * @JSname:制卡销卡JS
 * @说明：事件号格式为： hotelid + userid + 当前时间戳     
 *		--》 $('#indexhotelId').val() $('#indexuserId').val() new Date().getTime()
 *		console.info(md5($('#indexhotelId').val() +$('#indexuserId').val()+new Date().getTime()));
 */
~(function (window) {
  "use strict";
  //初始化控件
  $('#roomCode_createCard').textbox({});
  $('#roomType_createCard').combobox({
    url: '../roomtype/lrtc',
    queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
    valueField: 'roomtypeId',
    textField: 'roomtypeName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        data.unshift({ roomtypeId: 0, roomtypeName: "全部" });
      }
      return data;
    }
  });
  $('#floor_createCard').combobox({
    url: "../floor/pglist",
    queryParams: { limit: 9999, offset: 0, floorName: '' },
    valueField: 'floorId',
    textField: 'floorName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        data.unshift({ floorId: 0, floorName: "全部" });
      }
      return data;
    }
  });

  $('#tab_guestRoom').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    fit: true,
    striped: true,//隔行不变色
    rownumbers: true,
    data: [],
    onLoadSuccess: function (data) {
      $('a[name="editCardOutTime"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        editCardOutTime(row_);
      });
    },
    columns: [[
      { field: 'receptionId', title: '客单ID', hidden: true, align: 'center' },
      { field: 'roomId', title: '房间ID', hidden: true, align: 'center' },
      { field: 'channelName', title: '客源', width: 100, align: 'center', hidden: true },
      { field: 'roomtypeId', title: '房间类型ID', align: 'center', hidden: true },
      { field: 'channelId', title: '客源ID', align: 'center', hidden: true },
      { field: 'guestId', title: '宾客ID', width: 120, align: 'center', hidden: true },

      { field: 'roomCode', title: '房号', width: 70, align: 'center' },
      {
        field: 'guestName', title: '宾客姓名', width: 100, align: 'center',
        formatter: function (value) {
          return value ? value : "--";
        }
      },
      { field: 'roomtypeName', title: '房型', width: 80, align: 'center' },
      {
        field: 'enterTime', title: '入住时间', align: 'center', width: 120,
        formatter: function (value, row, index) {
          return value ? getDate(value) : value;
        }
      },
      {
        field: 'startCardTime', title: '开卡时间', align: 'center', width: 120,
        formatter: function (value, row, index) {
          if (row.createTime) {
            return getDate(row.createTime);
          } else if (!value) {
            return "--";
          } else {
            return getDate(value);
          }
        }
      },
      {
        field: 'endCardTime', align: 'center', title: '房卡有效时间', width: 120,
        formatter: function (value, row, index) {
          row.enterTime = new Date(row.enterTime).getTime();
          row.expectedLeaveTime = new Date(row.expectedLeaveTime).getTime();
          if (row.endCardTime) {
            row.endCardTime = new Date(row.endCardTime).getTime();
          }
          var row_ = JSON.stringify(row);
          console.info(row_);
          var a = `<a name='editCardOutTime' data-val='${row_}'  
			        					class='dryColor' style='cursor:pointer;'> [编辑]</a>`;
          if (sessionStorage.getItem('isReadCard')) {
            a = "";
            sessionStorage.removeItem('isReadCard')
          }
          if (row.expectedLeaveTime && !value) {
            return getDate(row.expectedLeaveTime) + a;
          }
          if (!value) {
            return "--" + a;
          }
          return getDate(value) + a;
        }
      },

    ]]
  });
	/**
	 * **************制卡 start*****************************
	 */
  //编辑房卡有效结束时间
  function editCardOutTime(row_) {
    console.info(row_);
    let obj = JSON.parse(row_);
    console.info(obj);
    $('#inputLeaveTimeDialigDiv').append(
      `<div id="leaveDiv" style="padding:20px 0 0 30px;">
					<input id="createCard_createLeaveTime" label="房卡有效结束时间：" style="width:280px;" 
					labelPosition="before" labelAlign="right" labelWidth="120"/>
			</div>`
    );
    $('#createCard_createLeaveTime').datetimebox({
      editable: false,
      currentText: "",
      closeText: "",
      value: getDate(obj.expectedLeaveTime)
    });
    var buttons = $.extend([], $.fn.datetimebox.defaults.buttons);
    buttons.splice(0, 2, {
      text: '中午',
      handler: function (target) {
        var opts = $.data(target, "datetimebox").options;
        var c = $(target).datetimebox("calendar");
        var date = c.calendar("options").current;
        var h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getHours();
        var m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getMinutes();
        var s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getSeconds();
        var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
        eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
      }
    }, {
        text: '下午',
        handler: function (target) {
          var opts = $.data(target, "datetimebox").options;
          var c = $(target).datetimebox("calendar");
          var date = c.calendar("options").current;
          var h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getHours();
          var m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getMinutes();
          var s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getSeconds();
          var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
          eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
        }
      }, {
        text: '钟点',
        handler: function (target) {
          var opts = $.data(target, "datetimebox").options;
          var nowTime = new Date();
          var h = Number(JSON.parse($('#index_ruleData').val()).restHour) + Number(nowTime.getHours());
          var date = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), h, nowTime.getMinutes(),
            nowTime.getSeconds())
          eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
        }
      }, {
        text: '确定',
        handler: function (target) {
          eapor.utils.update_date_utils._b53(target);
        }
      });
    $('#createCard_createLeaveTime').datetimebox({
      buttons: buttons
    });

    $('#createCard_createLeaveTime').datetimebox().datetimebox('calendar').calendar({
      validator: function (date) {
        var now = new Date();
        var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
        return d1 <= date && date <= d2;
      }
    });
    $('#leaveDiv').dialog({
      title: '编辑房卡有效结束时间',
      width: 350,
      height: 160,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          var editLeaveTime = $('#createCard_createLeaveTime').datetimebox('getValue');
          console.info(editLeaveTime);
          if (editLeaveTime == "") {
            $.messager.show({ title: '系统提示', msg: '请输入房卡有效结束时间！', timeout: 3000, showType: 'silde' });
            return;
          }
          var edtime = getDate(new Date(editLeaveTime.replace(/-/g, '/')).getTime());
          console.info(edtime);
          obj.endCardTime = edtime;
          //obj.editLeaveTime = edtime;
          eapor.createCard.data.expectedLeaveTime = getDate(edtime);
          //$('#tab_guestRoom').datagrid('loadData',[obj]);
          eapor.createCard.loadDataArr = [obj];
          //$('#tab_guestRoom').datagrid('updateRow',{index: 0,row: {endCardTime: edtime}});
          $('#leaveDiv').dialog('close');
          eapor.utils.defaultAjax('../lock/createCardFirst', eapor.createCard.data, createCardFirstCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#leaveDiv').dialog('close');
        }
      }]
    })
  }

  function createCardFirstCallBack(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //酒店标识未设置
    if (result == -2) {
      $.messager.alert('系统提示', '请先设置门禁发卡器标识！');
      return;
    }
    //房间未设置锁号
    if (result == -3) {
      $.messager.alert('系统提示', '该房间对应的锁号未设置！请先设置锁号！');
      return;
    }
    if (result > 0) {
      $('#btn_createCard_open').click(function () {
        $('#ifid1').attr('src', eapor.createCard.hrefUrl_open);//开房制卡按钮触发链接到exe
      });
      // 将 信息 显示与页面
      $('#tab_guestRoom').datagrid({ data: eapor.createCard.loadDataArr });
      eapor.createCard.loadData = {};
      eapor.createCard.loadDataArr = [];
      //关闭  弹出的dialog
      $('#leaveDiv').dialog('close');
      $('#showdiv').dialog('close');
      $('#dialogDiv').dialog('close');
    }
  }
  function tichudedaima(select, type) {//type 用于判断进入的方式类型

    eapor.createCard.data.expectedLeaveTime = $('#createCard_createLeaveTime').datetimebox('getValue');
    eapor.createCard.data.eventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
    console.info(eapor.createCard.data.eventCode);
    eapor.createCard.data.roomId = select.roomId;
    eapor.createCard.data.comCode = $('#indexmd5').val(); //通讯号

    eapor.createCard.hrefUrl_open = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(1)) + ","
      + eapor.createCard.data.eventCode;
    console.info(eapor.createCard.hrefUrl_open);
    if (type == 1) {//直接进入制卡页面，且选择的房间为空房间
      eapor.createCard.loadData.roomCode = select.roomCode;
      eapor.createCard.loadData.roomtypeName = select.roomtypeName;
      //eapor.createCard.loadData.enterTime = getDate(new Date().getTime());//?
      eapor.createCard.loadData.endCardTime = $('#createCard_createLeaveTime').datetimebox('getValue');

      eapor.createCard.loadDataArr.push(eapor.createCard.loadData);
    } else if (type == 2) {//从房态图进入制卡页面，且选择的房间为空房间
      eapor.createCard.loadData.roomCode = select.roomName;
      eapor.createCard.loadData.roomtypeName = select.roomTypeName;
      //eapor.createCard.loadData.enterTime = getDate(new Date().getTime());
      eapor.createCard.loadData.endCardTime = $('#createCard_createLeaveTime').datetimebox('getValue');
      eapor.createCard.loadDataArr.push(eapor.createCard.loadData);
    }
    console.info(eapor.createCard.data)
    eapor.createCard.data.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
    eapor.utils.defaultAjax('../lock/createCardFirst', eapor.createCard.data, createCardFirstCallBack);
  }
  //搜索完后的确定fun
  function dialogDiv_confirmHandler() {
    var select = $('#roomListTable_common').datagrid('getSelected');
    console.info(select)
    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择房间!', timeout: 3000, showType: 'silde' });
      return;
    }
    //选择的为空房 ，通过判断rentId 为0 ， 让用户输入 预离时间
    if (select.rentId == 0) {
      $('#inputLeaveTimeDialigDiv').append(
        `<div id="leaveDiv">
						<div style="margin:0 auto;width:300px;padding:15px 0 0 0;">
							<span style="display:inline-block;width:40px;height:24px;line-height:24px;
								vertical-align: middle;text-align: right;padding-top:1px;">房号：</span>
							<span style="display:inline-block;width:50px;height:24px;line-height:24px;
						vertical-align: middle; border-bottom: 1px solid black; text-align: center;" id="setRoomCode"></span>
							<span style="display:inline-block;width:70px;" ></span>
							<span style="display:inline-block;width:40px;height:24px;line-height:24px;
								vertical-align: middle;text-align: right;padding-top:1px;">房型：</span>
							<span style="display:inline-block;width:50px;height:24px;line-height:24px;
					vertical-align: middle; border-bottom: 1px solid black; text-align: center;" id="setRoomTypeName"></span>
							<br/>
							<br/>
						</div>
						<div style="margin:0 auto;width:321px;padding:15px 0 0 0;">
							<span>请输入房卡有效结束时间：</span>
							<span><input id="createCard_createLeaveTime"/></span>
						</div>
					</div>`
      );
      $('#setRoomCode').html(select.roomCode);
      $('#setRoomTypeName').html(select.roomtypeName);
      $('#createCard_createLeaveTime').datetimebox({
        editable: false,
        currentText: "",
        closeText: ""
      });
      var buttons = $.extend([], $.fn.datetimebox.defaults.buttons);
      buttons.splice(0, 2, {
        text: '中午',
        handler: function (target) {
          var opts = $.data(target, "datetimebox").options;
          var c = $(target).datetimebox("calendar");
          var date = c.calendar("options").current;
          var h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getHours();
          var m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getMinutes();
          var s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getSeconds();
          var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
          eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
        }
      }, {
          text: '下午',
          handler: function (target) {
            var opts = $.data(target, "datetimebox").options;
            var c = $(target).datetimebox("calendar");
            var date = c.calendar("options").current;
            var h = new Date("1970-01-01 " +
              JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getHours();
            var m = new Date("1970-01-01 " +
              JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getMinutes();
            var s = new Date("1970-01-01 " +
              JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getSeconds();
            var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
            eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
          }
        }, {
          text: '钟点',
          handler: function (target) {
            var opts = $.data(target, "datetimebox").options;
            var nowTime = new Date();
            var h = Number(JSON.parse($('#index_ruleData').val()).restHour) + Number(nowTime.getHours());
            var date = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), h,
              nowTime.getMinutes(), nowTime.getSeconds())
            eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
          }
        }, {
          text: '确定',
          handler: function (target) {
            eapor.utils.update_date_utils._b53(target);
          }
        });
      $('#createCard_createLeaveTime').datetimebox({
        buttons: buttons
      });

      $('#createCard_createLeaveTime').datetimebox().datetimebox('calendar').calendar({
        validator: function (date) {
          var now = new Date();
          var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
          return d1 <= date && date <= d2;
        }
      });
      $('#leaveDiv').dialog({
        title: '请输入房卡有效结束时间',
        width: 350,
        height: 200,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确认',
          handler: function () {
            if ($('#createCard_createLeaveTime').datetimebox('getValue') != "") {
              var iptTime = new Date($('#createCard_createLeaveTime')
                .datetimebox('getValue').replace(/-/g, "/")).getTime();
              tichudedaima(select, 1);
            } else {
              $.messager.show({ title: '系统提示', msg: '请输入房卡有效结束时间！', timeout: 2000, showType: 'silde' })
            }
          }
        }, {
          text: '取消',
          handler: function () {
            $('#leaveDiv').dialog('close');
          }
        }]
      })
    } else {
      // rentId  不为0  则将 宾客信息 显示与 页面
      console.info(select)
      $.ajax({
        type: 'post',
        url: '../lock/getCreateCardInfoByReceptionIdAndRoomId',
        data: { receptionId: select.receptionId, roomId: select.roomId },
        dataType: "json"
      })
        .done(function (result) {
          console.info(result);
          for (let i = 0; i < result.length; i++) {
            if (result[i].roomId == select.roomId) {
              //会员退房时间加上规则设置里的会员延迟退房时间
              if (result[i].channelName == "会员") {
                eapor.createCard.data.expectedLeaveTime = getDate(result[i].expectedleaveTime);
              } else {
                eapor.createCard.data.expectedLeaveTime = getDate(result[i].expectedleaveTime);
              }
              eapor.createCard.data.eventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() +
                new Date().getTime());
              console.info(eapor.createCard.data.eventCode);
              eapor.createCard.data.roomId = select.roomId;

              //添加roomId 数据到 sessionStorage  
              //为了 给强行注销门卡Btn使用，在强行注销门卡btn点击后 先判断是否有roomId ，有则不弹出房间显示，无则进行房间选择
              sessionStorage.setItem("writeOffRoomCardInfoByCardWriteOffBtn", select.roomId);

              eapor.createCard.data.comCode = $('#indexmd5').val(); //通讯号
              eapor.createCard.hrefUrl_open = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(1)) + ","
                + eapor.createCard.data.eventCode;
              console.info(eapor.createCard.data);

              eapor.createCard.loadData.roomCode = select.roomCode;
              eapor.createCard.loadData.roomtypeName = select.roomtypeName;
              eapor.createCard.loadData.enterTime = result[i].enterTime;
              eapor.createCard.loadData.expectedLeaveTime = result[i].expectedleaveTime;
              eapor.createCard.loadData.guestName = result[i].guestName;
              eapor.createCard.loadDataArr.push(eapor.createCard.loadData);
              console.info(eapor.createCard.loadDataArr)
              eapor.createCard.data.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
              eapor.utils.defaultAjax('../lock/createCardFirst', eapor.createCard.data, createCardFirstCallBack);
            }
          }
        });
    }
  };
  //搜索回调fun
  function searchCallBack(result) {
    console.info(result);
    if (result == "[]" || result.length == 0) {
      $.messager.show({ title: '系统提示', msg: '未查到相关房间信息！', timeout: 2800 });
      return;
    }
    $('#parentDialogDiv').append(`<div id="showdiv"><table id="roomListTable_common"></table></div>`);
    $('#roomListTable_common').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      striped: true,
      data: result,
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      loadMsg: "loading....",
      singleSelect: true,
      fit: true,
      rownumbers: true,
      columns: [[  //-----columns start-----
        { field: 'roomState', title: "roomState", align: 'center', width: 100, hidden: true },
        { field: 'unitedState', title: "unitedState", align: 'center', width: 100, hidden: true },
        { field: 'roomtypeId', title: "roomtypeId", align: 'center', width: 100, hidden: true },
        { field: 'roomId', title: "roomId", align: 'center', width: 100, hidden: true },
        { field: 'restRoom', title: "restRoom", align: 'center', width: 100, hidden: true },
        { field: 'rentId', title: "rentId", align: 'center', width: 100, hidden: true },
        { field: 'receptionId', title: "receptionId", align: 'center', width: 100, hidden: true },
        { field: 'lateRoom', title: "lateRoom", align: 'center', width: 100, hidden: true },
        { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
        { field: 'floorId', title: "floorId", align: 'center', width: 100, hidden: true },
        { field: 'creator', title: "creator", align: 'center', width: 100, hidden: true },
        { field: 'reateTime', title: "reateTime", align: 'center', width: 100, hidden: true },
        { field: 'lockCode', title: "门锁号", align: 'center', width: 20, hidden: true },
        { field: 'description', title: "备注", align: 'center', width: 20, hidden: true },

        { field: 'roomCode', title: "房号", align: 'center', width: 20 },
        { field: 'roomtypeName', title: "房间类型", align: 'center', width: 20 },
        { field: 'floorName', title: "楼层", align: 'center', width: 20 },
        { field: 'effectiveCardCount', title: "已制宾客卡数量", align: 'center', width: 20 }

      ]]
    });
    $('#showdiv').dialog({
      title: '搜索房间结果列表',
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
          dialogDiv_confirmHandler();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showdiv').dialog('close');
        }
      }]
    });
  }
  //搜索按钮功能
  $('#search_createCard').on('click', function () {

    var getRoomCode = $('#roomCode_createCard').textbox('getValue');
    var getRoomtypeId = $('#roomType_createCard').combobox('getValue');
    var getFloorId = $('#floor_createCard').combobox('getValue');
    if (getRoomtypeId == "全部" || getRoomtypeId == "") {
      getRoomtypeId = 0;
    }
    if (getFloorId == "全部" || getFloorId == "") {
      getFloorId = 0;
    }
    eapor.utils.defaultAjax('../room/listRoomPage',
      { offset: 0, limit: 9999, roomCode: getRoomCode, roomtypeId: getRoomtypeId, floorId: getFloorId },
      searchCallBack
    );
  });

	/**
	 * **************注销门卡 start*****************************
	 */
	/*if(eapor.data.index_eventCode != ""){
		hrefUrl_open2 = "kzlockcarder://"+(Number(eapor.data.exenum)+Number(2))+","+eapor.data.index_eventCode;
		hrefUrl_open3 = "kzlockcarder://"+(Number(eapor.data.exenum)+Number(3))+","+eapor.data.index_eventCode;
	}else{
		var logout =  md5($('#indexhotelId').val() +$('#indexuserId').val()+new Date().getTime());
		hrefUrl_open2 = "kzlockcarder://"+(Number(eapor.data.exenum)+Number(2))+","+logout;
		hrefUrl_open3 = "kzlockcarder://"+(Number(eapor.data.exenum)+Number(3))+","+logout;
	}*/
  function logoutCallBack(result) {
    console.info(result);
    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: `读卡异常！${result}`, timeout: 3000, showType: 'slide' });
      return;
    }
  };
  $('#btn_createCard_logout').click(function () {
    var logoutData = {}, logout = {};
    logoutData.comCode = $('#indexmd5').val(); //通讯号
    if (eapor.data.index_eventCode != "") {
      eapor.createCard.hrefUrl_open2 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(2)) + ","
        + eapor.data.index_eventCode;
      logoutData.eventCode = eapor.data.index_eventCode;
    } else {
      logout = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
      eapor.createCard.hrefUrl_open2 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(2)) + "," + logout;
      logoutData.eventCode = logout;
    }
    console.info(logoutData);
    $('#ifid2').attr('src', eapor.createCard.hrefUrl_open2);
    eapor.utils.defaultAjax('../lock/cancelCardFirst', logoutData, logoutCallBack);
  });

	/**
	 * **************查询门卡 start*****************************
	 */
  $('#btn_createCard_inquiry').click(function () {
    $('#ifid3').attr('src', eapor.createCard.hrefUrl_open3);
    var logoutData_inquiry = {}, logout = {};
    logoutData_inquiry.comCode = $('#indexmd5').val(); //通讯号
    if (eapor.data.index_eventCode != "") {
      logoutData_inquiry.eventCode = eapor.data.index_eventCode;
      eapor.createCard.hrefUrl_open3 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(3)) + ","
        + eapor.data.index_eventCode;
    } else {
      logout = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
      logoutData_inquiry.eventCode = logout;
      eapor.createCard.hrefUrl_open3 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(3)) + "," + logout;
    }
    console.info(logoutData_inquiry);
    $('#ifid3').attr('src', eapor.createCard.hrefUrl_open3);
    eapor.utils.defaultAjax('../lock/readCardFirst', logoutData_inquiry, logoutCallBack);
  });

	/**
	 * **************强制注销门卡信息 start*****************************
	 */
  //确定具体门卡 函数
  function showCardInfo_Handler() {
    var selectCardHandlerInfo = $('#cardListTable_common').datagrid('getSelected');
    if (!selectCardHandlerInfo) {
      $.messager.show({ title: '系统提示', msg: '请选择要注销的门卡！', timeout: 2000, showType: 'slide' });
      return;
    }
    $.ajax({
      type: 'post',
      url: '../lock/updateLockState',
      data: { lockCardId: selectCardHandlerInfo.lockCardId },
      dataType: "json"
    })
      .done(function (result) {
        console.info(result);
        if (result > 0) {
          $.messager.show({ title: '系统提示', msg: '注销成功！', timeout: 2000, showType: 'slide' });
          $('#showCardInfo_dialogDiv').dialog('close');
          $('#dialogDiv').dialog('close');
          return;
        }
        $.messager.show({ title: '系统提示', msg: '注销失败！', timeout: 3000, showType: 'slide' });
      });
  };
  //强制注销门卡 显示房间下的有效房卡信息函数
  function showThisRoomOfCardListDialog(data) {
    var loadCardListData = JSON.parse(data);
    //弹出房卡选择
    $('#parentDialogDiv').append("<div id='showCardInfo_dialogDiv'></div>");
    $('#showCardInfo_dialogDiv').dialog({
      title: '门卡信息',
      width: 900,
      height: 580,
      closed: false,
      cache: false,
      modal: true,
      href: '../client/common-allCardListInfoForThisRoom.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      },
      onLoad: function () {
        $('#cardListTable_common').datagrid('loadData', loadCardListData);
      },
      buttons: [{
        text: '确认',
        handler: function () {
          showCardInfo_Handler();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showCardInfo_dialogDiv').dialog('close');
        }
      }]
    });
  };
  //强制注销门卡 选择房间后的 确定函数
  function btn_createCard_forceLogoutHandler() {
    var selectRoomHandlerInfo = $('#roomListTable_common').datagrid('getSelected');
    if (!selectRoomHandlerInfo) {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    }
    console.info(selectRoomHandlerInfo.roomId)
    $.ajax({
      type: 'post',
      url: '../lock/getLockCardByRoomId',
      data: { roomId: selectRoomHandlerInfo.roomId },
      dataType: "json"
    })
      .done(function (result) {
        console.info(result);
        if (result.length == 0) {
          $.messager.show({ title: '系统提示', msg: '该房间下未查询到宾客卡信息！', timeout: 3000, showType: 'slide' });
          return;
        }
        showThisRoomOfCardListDialog(JSON.stringify(result));
      });
  };
  //强制注销门卡 按钮
  $('#btn_createCard_forceLogout').click(function () {
    //先判断 sessionStorage 里是否存了writeOffRoomCardInfoByCardWriteOffBtn key 
    var getSessionStorageForRoomId_writeOffBtn = sessionStorage.getItem("writeOffRoomCardInfoByCardWriteOffBtn");
    console.info(getSessionStorageForRoomId_writeOffBtn);
    if (getSessionStorageForRoomId_writeOffBtn) {
      var getSessionStorageForRoomId = sessionStorage.getItem("writeOffRoomCardInfoByCardWriteOffBtn");
      //sessionStorage.removeItem("writeOffRoomCardInfoByCardWriteOffBtn");
      console.info(sessionStorage.getItem("writeOffRoomCardInfoByCardWriteOffBtn"));
      $.ajax({
        type: 'post',
        url: '../lock/getLockCardByRoomId',
        data: { roomId: getSessionStorageForRoomId },
        dataType: "json"
      })
        .done(function (result) {
          console.info(result);
          if (result.length == 0) {
            $.messager.show({ title: '系统提示', msg: '该房间下未查询到宾客卡信息！', timeout: 3000, showType: 'slide' });
            return;
          }
          showThisRoomOfCardListDialog(JSON.stringify(result));
        });
    } else {//弹出房间选择
      $('#parentDialogDiv').append(`<div id='dialogDiv'></div>`);
      const dialog = $('#dialogDiv');
      dialog.dialog({
        title: '信息',
        width: 950,
        height: 650,
        closed: false,
        cache: false,
        modal: true,
        href: '../client/common-allRoomInfoForCreateCard.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确认',
          handler: function () {
            btn_createCard_forceLogoutHandler();
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


	/**
	 * init
	 */
  //首次进入制卡页面情况下，根据进入该页面的方式，做出相应的显示操作【开房页面、房态图、菜单栏。。】
  if ($('#hidden_roomStatusToCreateCardFlag').val() == "") {//flag 为空情况下，
    //1.flag 为空 则 确定 不是从房态图进入， 后判断是否是从开房等其他页面进入
    if ($('#hidden_createCardFlag').val() == 1) {//判断$('#hidden_createCardFlag').val()的值，来确定是否是从开房JSP页面进入
      $('#hidden_createCardFlag').val("");
      var setDate_getFromRoomOpenJSP = {
        roomCode: JSON.parse($('#hidden_outRoom_roomInfo').val()).roomCode,
        guestName: JSON.parse($('#hidden_openRoom_guestInfo').val()).guestName,
        roomtypeName: JSON.parse($('#hidden_outRoom_roomInfo').val()).roomtypeName,
        enterTime: JSON.parse($('#hidden_openRoom_guestInfo').val()).enterTime,
        expectedLeaveTime: JSON.parse($('#hidden_openRoom_guestInfo').val()).expectedLeaveTime,
      };

      eapor.createCard.loadDataArr.push(setDate_getFromRoomOpenJSP);

      eapor.createCard.data.expectedLeaveTime = getDate(setDate_getFromRoomOpenJSP.expectedLeaveTime);
      eapor.createCard.data.eventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
      eapor.createCard.data.roomId = JSON.parse($('#hidden_outRoom_roomInfo').val()).roomId;
      eapor.createCard.data.comCode = $('#indexmd5').val(); //通讯号
      eapor.createCard.hrefUrl_open = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(1)) + ","
        + eapor.createCard.data.eventCode;
      eapor.createCard.data.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
      eapor.utils.defaultAjax('../lock/createCardFirst', eapor.createCard.data, createCardFirstCallBack);

    }/*else if($('#hidden_createCardFlag').val() == 2){//续房页面进入
			$('#hidden_createCardFlag').val("");
			
			
		}*/else {
      //直接从菜单进入制卡JSP页面情况下
      $('#parentDialogDiv').append("<div id='dialogDiv'></div>");
      $('#dialogDiv').dialog({
        title: '信息',
        width: 950,
        height: 650,
        closed: false,
        cache: false,
        modal: true,
        href: '../client/common-allRoomInfoForCreateCard.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确认',
          handler: function () {
            dialogDiv_confirmHandler();
          }
        }, {
          text: '取消',
          handler: function () {
            $('#dialogDiv').dialog('close');
          }
        }]
      })
    }

  } else {//flag 不为空情况下，即为 房间已确定的情况下 进入制卡页面
    // 1. 在住的房间情况下
    eapor.createCard.flagInfo = JSON.parse($('#hidden_roomStatusToCreateCardFlag').val());
    console.info(eapor.createCard.flagInfo)
    $('#hidden_roomStatusToCreateCardFlag').val("");
    if (eapor.createCard.flagInfo.rentId > 0) {
      console.info(eapor.createCard.flagInfo.receptionId)
      $.ajax({
        type: 'post',
        url: '../lock/getCreateCardInfoByReceptionIdAndRoomId',
        data: { receptionId: eapor.createCard.flagInfo.receptionId, roomId: eapor.createCard.flagInfo.roomId },
        dataType: "json",
        success: function (result) {
          console.info(result)
          for (let i = 0; i < result.length; i++) {
            if (result[i].roomId == eapor.createCard.flagInfo.roomId) {
              eapor.createCard.data.expectedLeaveTime = result[i].expectedleaveTime;
              eapor.createCard.data.eventCode = md5($('#indexhotelId').val() + $('#indexuserId').val()
                + new Date().getTime());
              console.info(eapor.createCard.data.eventCode);
              eapor.createCard.data.roomId = eapor.createCard.flagInfo.roomId;
              eapor.createCard.data.comCode = $('#indexmd5').val(); //通讯号
              eapor.createCard.hrefUrl_open = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(1)) + ","
                + eapor.createCard.data.eventCode;
              console.info(eapor.createCard.data);

              eapor.createCard.loadData.roomCode = eapor.createCard.flagInfo.roomName;
              eapor.createCard.loadData.roomtypeName = eapor.createCard.flagInfo.roomTypeName;
              eapor.createCard.loadData.enterTime = result[i].enterTime;
              eapor.createCard.loadData.expectedLeaveTime = result[i].expectedleaveTime;
              eapor.createCard.loadData.guestName = result[i].guestName;
              eapor.createCard.loadDataArr.push(eapor.createCard.loadData);
              console.info(eapor.createCard.data)
              eapor.createCard.data.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
              eapor.utils.defaultAjax('../lock/createCardFirst', eapor.createCard.data, createCardFirstCallBack);
            }
          }
        }
      })
    } else {// 2. 空房间的情况下
      // （1）.弹出输入预离时间
      // 确定
      //将 数据 显示到页面
      $('#inputLeaveTimeDialigDiv').append(
        `<div id="leaveDiv">
						<div style="margin:0 auto;width:300px;padding:15px 0 0 0;">
							<span style="display:inline-block;width:40px;height:24px;line-height:24px;
						vertical-align: middle;text-align: right;padding-top:1px;">房号：</span>
							<span style="display:inline-block;width:50px;height:24px;line-height:24px;
			vertical-align: middle; border-bottom: 1px solid black; text-align: center;" id="setRoomCode"></span>
							<span style="display:inline-block;width:70px;" ></span>
							<span style="display:inline-block;width:40px;height:24px;line-height:24px;
							vertical-align: middle;text-align: right;padding-top:1px;">房型：</span>
							<span style="display:inline-block;width:50px;height:24px;line-height:24px;
			vertical-align: middle; border-bottom: 1px solid black; text-align: center;" id="setRoomTypeName"></span>
							<br/>
							<br/>
						</div>
						<div style="margin:0 auto;width:321px;padding:15px 0 0 0;">
							<span>请输入房卡有效结束时间：</span>
							<span><input id="createCard_createLeaveTime"/></span>
						</div>
					</div>`
      );

      $('#setRoomCode').html(eapor.createCard.flagInfo.roomName);
      $('#setRoomTypeName').html(eapor.createCard.flagInfo.roomTypeName);
      $('#createCard_createLeaveTime').datetimebox({
        editable: false,
        currentText: "",
        closeText: ""
      });
      var buttons = $.extend([], $.fn.datetimebox.defaults.buttons);
      buttons.splice(0, 2, {
        text: '中午',
        handler: function (target) {
          var opts = $.data(target, "datetimebox").options;
          var c = $(target).datetimebox("calendar");
          var date = c.calendar("options").current;
          var h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getHours();
          var m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getMinutes();
          var s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).noonCheckoutTime).getSeconds();
          var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
          eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
        }
      }, {
          text: '下午',
          handler: function (target) {
            var opts = $.data(target, "datetimebox").options;
            var c = $(target).datetimebox("calendar");
            var date = c.calendar("options").current;
            var h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getHours();
            var m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getMinutes();
            var s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getSeconds();
            var date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
            eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
          }
        }, {
          text: '钟点',
          handler: function (target) {
            var opts = $.data(target, "datetimebox").options;
            var nowTime = new Date();
            var h = Number(JSON.parse($('#index_ruleData').val()).restHour) + Number(nowTime.getHours());
            var date = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), h, nowTime.getMinutes(),
              nowTime.getSeconds())
            eapor.utils.update_date_utils._b52(target, opts.formatter.call(target, date));
          }
        }, {
          text: '确定',
          handler: function (target) {
            eapor.utils.update_date_utils._b53(target);
          }
        });
      $('#createCard_createLeaveTime').datetimebox({
        buttons: buttons
      });


      $('#createCard_createLeaveTime').datetimebox().datetimebox('calendar').calendar({
        validator: function (date) {
          var now = new Date();
          var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
          return d1 <= date && date <= d2;
        }
      });
      $('#leaveDiv').dialog({
        title: '请输入房卡的有效时间',
        width: 350,
        height: 200,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确认',
          handler: function () {
            if ($('#createCard_createLeaveTime').datetimebox('getValue') == "") {
              $.messager.show({ title: '系统提示', msg: '请输入房卡有效结束时间！', timeout: 2000, showType: 'silde' });
              return;
            }
            var iptTime = new Date($('#createCard_createLeaveTime').datetimebox('getValue').replace(/-/g, "/"))
              .getTime();
            tichudedaima(eapor.createCard.flagInfo, 2);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#leaveDiv').dialog('close');
          }
        }]
      })
    }
  }
})(window);