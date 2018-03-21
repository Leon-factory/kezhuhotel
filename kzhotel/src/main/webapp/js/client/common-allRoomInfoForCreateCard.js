//制卡销卡弹出现在房间页面
~(function () {
  "use strict";
  //初始加载loader 函数
  var pubjsonfirst_roomList = {};
  var firstloader_roomList = function (param, success, error) {
    if (!$.isEmptyObject(pubjsonfirst_roomList)) {
      success(pubjsonfirst_roomList);
      return true;
    }

    $.ajax({
      url: "../room/listRoomPage",
      data: { offset: 0, limit: 9999, roomCode: '', roomtypeId: 0, floorId: 0 },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        pubjsonfirst_roomList = data;

        success(data);
      }
      , error: function (err) {
        alert(err);
      }
    });

  };
  //搜索loader函数
  var getRoomCode = "";
  var getRoomtypeId = 0;
  var getFloorId = 0;

  var searchloader_roomList = function (param, success, error) {

    $.ajax({
      url: "../room/listRoomPage",
      data: { offset: 0, limit: 9999, roomCode: getRoomCode, roomtypeId: getRoomtypeId, floorId: getFloorId },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#roomListTable_common').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $('#roomListTable_common').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#roomListTable_common').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };


  $('#roomListTable_common').datagrid({
    title: '房间列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    loader: firstloader_roomList,
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

      { field: 'roomCode', title: "房号", align: 'center', width: 20 },
      { field: 'roomtypeName', title: "房间类型", align: 'center', width: 20 },
      { field: 'floorName', title: "楼层", align: 'center', width: 20 },
      { field: 'effectiveCardCount', title: "已制宾客卡数量", align: 'center', width: 20 },
      { field: 'lockCode', title: "门锁号", align: 'center', width: 20, hidden: true },
      { field: 'description', title: "备注", align: 'center', width: 20, hidden: true }
    ]]
  })

  //搜索
  $('#rl_searchRoom_common').click(function () {
    getRoomCode = $('#rl_roomInput_common').textbox('getValue');
    getRoomtypeId = $('#rl_roomTypeSelect_common').combobox('getValue');
    getFloorId = $('#rl_floorSelect_common').combobox('getValue');
    if (getRoomtypeId == "全部" || getRoomtypeId == "") {
      getRoomtypeId = 0;
    }
    if (getFloorId == "全部" || getFloorId == "") {
      getFloorId = 0;
    }
    $('#roomListTable_common').datagrid("options").loader = searchloader_roomList;
    $("#roomListTable_common").datagrid("reload");
  })


  $('#rl_roomTypeSelect_common').combobox({
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
  $('#rl_floorSelect_common').combobox({
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
})();