/**
 *@JSname:退房明细日报
 */
~(function () {
  "use strict";
  $('#tab_checkOutRoomDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_reportDayCheckOutRoomDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'consumeId', title: "consumeId", align: 'center', width: 25, hidden: true },
      { field: 'createTime', title: "createTime", align: 'center', width: 25, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 25, hidden: true },
      { field: 'expectedStayNumber', title: "expectedStayNumber", align: 'center', width: 25, hidden: true },
      { field: 'guestId', title: "guestId", align: 'center', width: 15, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 15, hidden: true },
      { field: 'roomId', title: "roomId", align: 'center', width: 20, hidden: true },
      { field: 'roomtypeId', title: "roomtypeId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'logId', title: "账单Id", align: 'center', width: 20 },
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
        field: 'enterTime', title: "入住时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: "预期退房时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'actualLeaveTime', title: "实际退房时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'rentAmount', title: "房费", align: 'center', width: 20,
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
  $('#searchbydatetime_checkOutRoomDetails').click(function () {
    if ($('#datetime_checkOutRoomDetails').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_RDCheckOutRoomDetails = "";

    var searchloader_reportDayCheckOutRoomDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getlogexitroomdailyreport",
        data: { date: paramDate_RDCheckOutRoomDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_checkOutRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == "[]") {
            $('#tab_checkOutRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_checkOutRoomDetails', 'guestName', 10, 0);
            return true;
          }
          if (data == "") {
            $('#tab_checkOutRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "-3333" || data == "") {
            //清空数据
            $('#tab_checkOutRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          //如果不是用的list方法，这里给json前后加变成数组放入
          success(data);
          return true;
        }
        , error: function (err) {
          alert(err);
        }
      });
    };
    paramDate_RDCheckOutRoomDetails = new Date($('#datetime_checkOutRoomDetails').datebox('getValue'));
    $('#tab_checkOutRoomDetails').datagrid("options").loader = searchloader_reportDayCheckOutRoomDetails;
    $("#tab_checkOutRoomDetails").datagrid("reload");
  });

  $('#createReport_checkOutRoomDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_checkOutRoomDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "退房明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      var checkInType = rows[i].checkinType;
      if (checkInType == 1) {
        checkInType = "全日房";
      } else if (checkInType == 2) {
        checkInType = "钟点房";
      } else {
        checkInType = "晚房";
      }
      csvData.push(
        [
          rows[i].guestName,
          rows[i].logId,
          rows[i].roomCode,
          rows[i].roomtypeName,
          checkInType,
          getDate(rows[i].enterTime),
          getDate(rows[i].expectedLeaveTime),
          getDate(rows[i].actualLeaveTime),
          NP.divide(rows[i].rentAmount, 100) + "元",
          rows[i].createUsername
        ]
      );
    }

    var str = new CSV(csvData, {
      header: ["宾客姓名", "账单Id", "房号", "房型",
        "入住类型", "入住时间", "预期退房时间", "实际退房时间", "房费", "操作员"]
    }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();