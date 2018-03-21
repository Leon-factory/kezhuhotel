/**
 *@JSname:开房明细日报
 */
~(function () {
  "use strict";
  $('#tab_openRoomDetails').datagrid({
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
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'roomId', title: "roomId", align: 'center', width: 20, hidden: true },
      { field: 'roomtypeId', title: "roomtypeId", align: 'center', width: 20, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'channelName', title: "客源", align: 'center', width: 20 },
      {
        field: 'reserveDetailId', title: "预订ID", align: 'center', width: 35,
        formatter: function (value) {
          if (!value) {
            return "--";
          } else {
            return value;
          }
        }
      },
      { field: 'receptionCode', title: "账单ID", align: 'center', width: 35 },
      { field: 'roomCode', title: "房号", align: 'center', width: 20 },
      { field: 'roomtypeName', title: "房型", align: 'center', width: 20 },
      {
        field: 'checkinType', title: "入住类型", align: 'center', width: 20,
        formatter: function (value) {
          if (value == 1) {
            return "全日房"
          } else if (value == 2) {
            return "钟点房"
          } else {
            return "晚房"
          }

        }
      },
      {
        field: 'enterTime', title: "入住时间", align: 'center', width: 30,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: "预计退房时间", align: 'center', width: 30,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'expectedRentAmount', title: "房费", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_openRoomDetails').click(function () {
    if ($('#datetime_openRoomDetails').datebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var searchDate_reportDayOpenRoomDetails = "";

    var searchloader_reportDayOpenRoomDetails = function (param, success, error) {
      console.info(searchDate_reportDayOpenRoomDetails);
      $.ajax({
        url: '../report/getcheckinroomdailyreport',
        data: { date: searchDate_reportDayOpenRoomDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_openRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_openRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_openRoomDetails', 'guestName', 11, 0);
            return true;
          }
          if (data == "") {
            $('#tab_openRoomDetails').datagrid('loadData', { total: 0, rows: [] });
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
    searchDate_reportDayOpenRoomDetails = new Date($('#datetime_openRoomDetails').datebox('getValue'));
    $('#tab_openRoomDetails').datagrid("options").loader = searchloader_reportDayOpenRoomDetails;
    $("#tab_openRoomDetails").datagrid("reload");
  });

  $('#createReport_openRoomDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_openRoomDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "开房明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      var reserveDetailId = "";
      if (rows[i].reserveDetailId == 0) {
        reserveDetailId = "--";
      } else {
        reserveDetailId = rows[i].reserveDetailId;
      }
      csvData.push(
        [
          rows[i].guestName,
          rows[i].channelName,
          reserveDetailId,
          rows[i].receptionCode,
          rows[i].roomCode,
          rows[i].roomtypeName,
          rows[i].checkinType,
          getDate(rows[i].enterTime),
          getDate(rows[i].expectedLeaveTime),
          NP.divide(rows[i].expectedRentAmount, 100) + "元",
          rows[i].createUsername
        ]
      );
    }

    console.info(csvData);
    var str = new CSV(csvData, { header: ["宾客姓名", "客源", "预订单号", "账单编号", "房号", "房型", "入住类型", "入住时间", "预计退房时间", "房费", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();
/*function ssscallback(result){
console.info(result);
}

//生成报表按钮
function clickBTN1(){
//console.info("okkkkkkkkkkkk");

var head = ["宾客姓名","客源","预订ID","账单ID","房号","房型","入住类型","入住时间","预计退房时间","房费","操作员"];

var data = $("#tab_openRoomDetails").datagrid("getData");
//console.info(data);
var arr = new Array();
$.each(data.rows,function(i,item){
	arr.push(item.guestName);
	arr.push(item.channelName);
	arr.push(item.reserveDetailId+"");
	arr.push(item.consumeId+"");
	arr.push(item.roomCode);
	arr.push(item.roomtypeName);
	arr.push(item.checkinType+"");
	arr.push(getDate(item.enterTime));
	arr.push(getDate(item.expectedLeaveTime));
	arr.push(item.expectedRentAmount+"");
	arr.push(item.createUsername);
})
var tdata = {};
tdata.head = JSON.stringify(head);
tdata.body = JSON.stringify(arr);
tdata.name = "开房明细日报";
console.info(tdata);
eapor.utils.defaultAjax("../csv/export",tdata,ssscallback);
}*/