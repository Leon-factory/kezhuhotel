~(function () {
  "use strict";
  $('#livingRoom_list').datagrid({
    title: '在住房间列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    striped: true,//隔行变色
    rownumbers: true,
    //data:result,
    onLoadSuccess: function () {
      $('#hidden_livingRoom_notleave').val("");//清除非预离flag 结果为选中
    },
    columns: [[
      { field: 'receptionId', title: '客单ID', align: 'center', hidden: true },
      { field: 'rentId', title: '房租ID', align: 'center', hidden: true },
      { field: 'roomId', title: '房间ID', align: 'center', hidden: true },
      { field: 'roomtypeId', title: '房间类型ID', align: 'center', hidden: true },
      { field: 'roomtypeName', title: '房间类型', align: 'center', width: 80, hidden: true },
      { field: 'channelId', title: '客源ID', align: 'center', hidden: true },

      { field: 'guestName', title: '宾客姓名', align: 'center', width: 100 },
      { field: 'roomCode', title: '房间名称', align: 'center', width: 70 },
      { field: 'channelName', title: '客源', align: 'center', width: 100 },
      {
        field: 'enterTime', title: '入住时间', align: 'center', width: 120,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: '预离时间', align: 'center', width: 120,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      }
    ]]

  });
  function getLivingRoom(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#livingRoom_list').datagrid('loadData', result);
  }

  function loadLivingRoomList() {
    var data = {};
    data.leave = $("#livingRoom_leave").is(':checked');
    data.notleave = $("#livingRoom_notleave").is(':checked');
    data.guestName = $('#livingRoom_guestName').textbox('getValue');
    data.date = $('#livingRoom_date').datetimebox('getValue');
    if (data.date == "") {
      data.date = "";
    } else {
      data.date = data.date;
    }
    data.roomtypeId = Number($('#livingRoom_roomType').combobox('getValue'));
    if (data.roomtypeId == "") {
      data.roomtypeId = 0;
    }
    data.channelId = Number($('#livingRoom_channel').combobox('getValue'));
    if (data.channelId == "") {
      data.channelId = 0;
    }
    eapor.utils.defaultAjax("../persevere/roomLeaveOrNotLeave", data, getLivingRoom);
  }

  $('#loadLivingRoomList').on('click', function () {
    loadLivingRoomList();
  });

  //预离check
  $('#livingRoom_leave').on('change', function () {
    loadLivingRoomList();
  });

  //非预离check
  $('#livingRoom_notleave').on('change', function () {
    loadLivingRoomList();
  });
  //加载房型
  $('#livingRoom_roomType').combobox({
    url: '../roomtype/lrtc',
    queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    valueField: 'roomtypeId',
    textField: 'roomtypeName',
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

  $('#livingRoom_channel').combobox({
    url: '../channel/pglist',
    queryParams: { offset: 0, limit: 9999, channelName: '', usageState: 1 },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    valueField: 'channelId',
    textField: 'channelName',
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        data.unshift({ channelId: 0, channelName: "全部" });
      }
      return data;
    }
  });

  $('#livingRoom_guestName').textbox({});
  $('#livingRoom_channel').combobox({});
  $('#livingRoom_date').datetimebox({});
  if ($('#hidden_livingRoom_notleave').val() == 1) {
    $("#livingRoom_notleave").removeAttr("checked");
  } else if ($('#hidden_livingRoom_notleave').val() == 2) {
    $("#livingRoom_leave").removeAttr("checked");
  }
  //加载在住房间列表
  loadLivingRoomList();

})();