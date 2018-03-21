/**
 *@JSname:宾客消费明细日报JS
 *
 **/
~(function () {
  "use strict";
  $('#tab_guestConsumptionRoomDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_reportDayGuestConsumptionDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----
      { field: 'feeType', title: "feeType", align: 'center', width: 20, hidden: true },
      { field: 'roomId', title: "roomId", align: 'center', width: 20, hidden: true },
      { field: 'receptionId', title: "receptionId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20 },
      { field: 'receptionCode', title: "宾客账单ID", align: 'center', width: 35 },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 18,
        formatter: function (value, row, index) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'roomCode', title: "房号", align: 'center', width: 18 },
      { field: 'roomtypeName', title: "房型", align: 'center', width: 18 },

      {
        field: 'rentConsumeAmount', title: "房费", align: 'center', width: 18,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'banquetConsumeAmount', title: "餐宴消费", align: 'center', width: 18,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'goodsConsumeAmount', title: "商品消费", align: 'center', width: 18,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'serviceConsumeAmount', title: "服务消费", align: 'center', width: 18,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'createTime', title: "加单时间", align: 'center', width: 35,
        formatter: function (value) {
          return value;
        }
      },
      { field: 'createUsername', title: "加单操作员", align: 'center', width: 25 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_guestConsumptionRoomDetails').click(function () {
    if ($('#datetime_guestConsumptionRoomDetails').datebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_RDGuestConsumptionDetails = "";

    var searchloader_reportDayGuestConsumptionDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getconsumesumarydailyreport",
        data: { accountDate: paramDate_RDGuestConsumptionDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_guestConsumptionRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_guestConsumptionRoomDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_guestConsumptionRoomDetails', 'guestName', 10, 0);
            return true;
          }
          if (data == "") {
            $('#tab_guestConsumptionRoomDetails').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_RDGuestConsumptionDetails = new Date($('#datetime_guestConsumptionRoomDetails').datebox('getValue'));
    $('#tab_guestConsumptionRoomDetails').datagrid("options").loader = searchloader_reportDayGuestConsumptionDetails;
    $("#tab_guestConsumptionRoomDetails").datagrid("reload");
  });

  //生成日报
  $('#exportCSV_guestConsumptionRoomDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_guestConsumptionRoomDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "宾客消费明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];

    for (let i = 0; i < rows.length; i++) {
      //宾客姓名
      var guestName = rows[i].guestName;
      if (typeof (guestName) == 'undefined' || guestName == "") {
        guestName = '-';
      }
      //宾客姓名
      var roomCode = rows[i].roomCode;
      if (typeof (roomCode) == 'undefined' || roomCode == "") {
        roomCode = '-';
      }
      //房型 名称
      var roomtypeName = rows[i].roomtypeName;
      if (typeof (roomtypeName) == 'undefined' || roomtypeName == "") {
        roomtypeName = '-';
      }

      var rentConsumeAmount = "";
      if (rows[i].rentConsumeAmount == undefined || rows[i].rentConsumeAmount == "") {
        rentConsumeAmount = 0;
      } else {
        rentConsumeAmount = NP.divide(rows[i].rentConsumeAmount, 100) + "元";
      }
      var banquetConsumeAmount = "";
      if (rows[i].banquetConsumeAmount == undefined || rows[i].banquetConsumeAmount == "") {
        banquetConsumeAmount = 0;
      } else {
        banquetConsumeAmount = NP.divide(rows[i].banquetConsumeAmount, 100) + "元";
      }
      var goodsConsumeAmount = "";
      if (rows[i].goodsConsumeAmount == undefined || rows[i].goodsConsumeAmount == "") {
        goodsConsumeAmount = 0;
      } else {
        goodsConsumeAmount = NP.divide(rows[i].goodsConsumeAmount, 100) + "元";
      }
      var serviceConsumeAmount = "";
      if (rows[i].serviceConsumeAmount == undefined || rows[i].serviceConsumeAmount == "") {
        serviceConsumeAmount = 0;
      } else {
        serviceConsumeAmount = NP.divide(rows[i].serviceConsumeAmount, 100) + "元";
      }
      var consumeAmount = "";
      if (rows[i].consumeAmount == undefined || rows[i].consumeAmount == "") {
        consumeAmount = 0;
      } else {
        consumeAmount = NP.divide(rows[i].consumeAmount, 100) + "元";
      }
      csvData.push(
        [
          guestName,
          rows[i].receptionCode,
          consumeAmount,
          roomCode,
          roomtypeName,
          rentConsumeAmount,
          banquetConsumeAmount,
          goodsConsumeAmount,
          serviceConsumeAmount,
          getDateForHoliday(rows[i].createTime),
          rows[i].createUsername
        ]
      );
    }

    console.info(csvData);
    var str = new CSV(csvData, { header: ["宾客姓名", "宾客账单ID", "消费总金额", "房号", "房型", "房费", "餐宴消费", "商品消费", "服务消费", "加单时间", "加单操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();