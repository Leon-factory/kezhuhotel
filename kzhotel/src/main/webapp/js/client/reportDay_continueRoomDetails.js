/**
 *@JSname:续房明细日报
 */
~(function () {
  "use strict";
  $('#tab_continueRoomDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_reportDayContinueRoomDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'guestId', title: "guestId", align: 'center', width: 25, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 25, hidden: true },
      { field: 'roomId', title: "roomId", align: 'center', width: 15, hidden: true },
      { field: 'roomtypeId', title: "roomtypeId", align: 'center', width: 15, hidden: true },
      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'logId', title: "logId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'receptionCode', title: "账单编号", align: 'center', width: 20 },
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
        field: 'enterTime', title: "入住时间", align: 'center', width: 28,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'oldExpectedRentAmount', title: "原房费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + '元' : '';
        }
      },
      {
        field: 'newExpectedRentAmount', title: "调整后房费", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + '元' : '';
        }
      },
      {
        field: 'oldExpectedLeaveTime', title: "原预期退房时间", align: 'center', width: 28,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'newExpectedLeaveTime', title: "调整后预期退房时间", align: 'center', width: 28,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'oldExpectedStayNumber', title: "原居住天数", align: 'center', width: 20 },
      { field: 'newExpectedStayNumber', title: "调整后居住天数", align: 'center', width: 20 },
      {
        field: 'createTime', title: "操作时间", align: 'center', width: 20,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_continueRoomDetails').click(function () {

    if ($('#datetime_continueRoomDetails').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate = "";

    var searchloader_reportDayContinueRoomDetails = function (param, success, error) {
      console.info(paramDate);
      $.ajax({
        url: "../report/getextendroomdailyreport",
        data: { date: paramDate },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_continueRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_continueRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_continueRoomDetails', 'guestName', 14, 0);
            return true;
          }
          if (data == "") {
            $('#tab_continueRoomDetails').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate = new Date($('#datetime_continueRoomDetails').datebox('getValue'));
    $('#tab_continueRoomDetails').datagrid("options").loader = searchloader_reportDayContinueRoomDetails;
    $("#tab_continueRoomDetails").datagrid("reload");
  });
  $('#createReport_continueRoomDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_continueRoomDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "续房明细日报：" + getDateForHoliday(new Date()) + ".csv";
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
          NP.divide(rows[i].oldExpectedRentAmount, 100) + "元",
          NP.divide(rows[i].newExpectedRentAmount, 100) + "元",
          getDate(rows[i].oldExpectedLeaveTime),
          getDate(rows[i].newExpectedLeaveTime),
          rows[i].oldExpectedStayNumber,
          rows[i].newExpectedStayNumber,
          getDate(rows[i].createTime),
          rows[i].createUsername
        ]
      );
    }

    var str = new CSV(csvData, {
      header: ["宾客姓名", "账单编号", "房号", "房型", "入住类型", "入住时间", "原房费", "调整后房费",
        "原预期退房时间", "调整后预期退房时间", "原居住天数", "调整后居住天数", "操作时间", "操作员"]
    }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();