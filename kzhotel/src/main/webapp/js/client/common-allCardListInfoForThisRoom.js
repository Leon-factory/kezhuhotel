//强行注销有效门卡 公共页面JS
~(function () {
  "use strict";
  $('#cardListTable_common').datagrid({
    title: '有效门卡列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_roomList,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'cardId', title: "cardId", align: 'center', width: 100, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 100, hidden: true },
      { field: 'createUsername', title: "createUsername", align: 'center', width: 100, hidden: true },
      { field: 'enterTime', title: "enterTime", align: 'center', width: 100, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
      { field: 'hotelIdentity', title: "hotelIdentity", align: 'center', width: 100, hidden: true },
      { field: 'liveState', title: "liveState", align: 'center', width: 100, hidden: true },
      { field: 'lockCode', title: "lockCode", align: 'center', width: 100, hidden: true },
      { field: 'modifyTime', title: "modifyTime", align: 'center', fitColumns: true, width: 20, hidden: true },
      { field: 'modifyUserId', title: "modifyUserId", align: 'center', fitColumns: true, width: 20, hidden: true },
      { field: 'receptionId', title: "receptionId", align: 'center', fitColumns: true, width: 20, hidden: true },
      { field: 'version', title: "version", align: 'center', fitColumns: true, width: 20, hidden: true },
      { field: 'roomId', title: "roomId", align: 'center', fitColumns: true, width: 20, hidden: true },

      { field: 'lockCardId', title: "门卡ID", align: 'center', width: 10 },
      { field: 'cardCode', title: "卡号", align: 'center', width: 70 },
      {
        field: 'createTime', title: "开卡时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: "门卡到期时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'roomCode', title: "房号", align: 'center', width: 10 }
    ]]
  })
})();