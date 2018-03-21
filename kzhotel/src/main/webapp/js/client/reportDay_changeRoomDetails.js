/**
 *@JSname:换房明细日报
 */
~(function () {
  "use strict";
  $('#tab_changeRoomDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    data: [],
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'guestId', title: "guestId", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'logId', title: "logId", align: 'center', width: 20, hidden: true },
      { field: 'newRoomtypeId', title: "newRoomtypeId", align: 'center', width: 20, hidden: true },
      { field: 'newRoomId', title: "newRoomId", align: 'center', width: 20, hidden: true },
      { field: 'oldRoomId', title: "oldRoomId", align: 'center', width: 20, hidden: true },
      { field: 'oldRoomtypeId', title: "oldRoomtypeId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 18 },
      { field: 'receptionCode', title: "原账单ID", align: 'center', width: 20 },
      { field: 'oldRoomCode', title: "原房号", align: 'center', width: 16 },
      { field: 'oldRoomtypeName', title: "原房型", align: 'center', width: 16 },

      { field: 'receptionCode', title: "新账单ID", align: 'center', width: 20 },
      { field: 'newRoomCode', title: "调整后房号", align: 'center', width: 16 },
      { field: 'newRoomtypeName', title: "调整后房型", align: 'center', width: 16 },
      {
        field: 'createTime', title: "操作时间", align: 'center', width: 30,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });

  $('#searchbydatetime_changeRoomDetails').click(function () {
    var time = $('#date_changeRoomDetails').datebox('getValue');
    $.ajax({
      type: 'post',
      url: '../report/getchangeroomdailyreport',
      data: { date: new Date(time) },
      dataType: "json",
      beforeSend: function () {
        if (time == "") {
          $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000 });
          return false;
        }
      },
      success: function (result) {
        console.info(result);
        if (result.length == 0) {
          //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000});
          $('#tab_changeRoomDetails').datagrid('loadData', []);
          $('#tab_changeRoomDetails').datagrid('reload');
          eapor.utils.messagerInfoBySearchEmpty('tab_changeRoomDetails', 'guestName', 9, 0);
          return;
        }
        $('#tab_changeRoomDetails').datagrid('loadData', result);
        $('#tab_changeRoomDetails').datagrid('reload');
      }
    })
  });
  $('#createReport_changeRoomDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_changeRoomDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "换房明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].guestName,
          rows[i].receptionCode,
          rows[i].oldRoomCode,
          rows[i].oldRoomtypeName,
          rows[i].receptionCode,
          rows[i].newRoomCode,
          rows[i].newRoomtypeName,
          getDate(rows[i].createTime),
          rows[i].createUsername
        ]
      );
    }

    console.info(csvData);
    var str = new CSV(csvData, { header: ["宾客姓名", "原账单ID", "原房号", "原房型", "新账单ID", "调整后房号", "调整后房型", "操作时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();