/**
 * @JSname:商品消费汇总表
 */
; (function () {
  "use strict";
  $('#tab_roomConsumptionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_goodsConsumptionSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $(this).datagrid('appendRow', {
          accountDate: '总合计',
          rentConsumeCount: eapor.utils.compute("tab_roomConsumptionSummary", "rentConsumeCount"),
          rentConsumeAmount: eapor.utils.compute("tab_roomConsumptionSummary", "rentConsumeAmount"),
          availableRoomNumber: eapor.utils.compute("tab_roomConsumptionSummary", "availableRoomNumber"),
          idealRentConsumeAmount: eapor.utils.compute("tab_roomConsumptionSummary", "idealRentConsumeAmount"),
          occupancyRate: eapor.utils.compute("tab_roomConsumptionSummary", "occupancyRate"),
          averageRoomRevenue: eapor.utils.compute("tab_roomConsumptionSummary", "averageRoomRevenue")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_roomConsumptionSummary', 'accountDate', 7, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'createTime', title: "accountDate", align: 'center', width: 20, hidden: true },

      {
        field: 'accountDate', title: "日期", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (value != "总合计" && value != '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
            return getDateForHoliday(value);
          } else {
            return value;
          }
        }
      },
      { field: 'rentConsumeCount', title: "房间消费总数量", align: 'center', width: 20 },
      {
        field: 'rentConsumeAmount', title: "房间总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (value == undefined || value == "") {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'availableRoomNumber', title: "房间可售总数量", align: 'center', width: 20 },
      {
        field: 'idealRentConsumeAmount', title: "房费理论总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'occupancyRate', title: "入住率统计", align: 'center', width: 20 },
      { field: 'averageRoomRevenue', title: "平均客房收益", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_roomConsumptionSummary').click(function () {
    if ($('#datetime_startRoomConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endRoomConsumptionSummary').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startRoomConsumptionSummary = "";
    var paramDate_endRoomConsumptionSummary = "";

    var searchloader_roomConsumptionSummary = function (param, success, error) {
      console.info(paramDate_startRoomConsumptionSummary);
      console.info(paramDate_endRoomConsumptionSummary);
      $.ajax({
        url: "../report/getrentconsumesummaryreport",
        data: { startDate: paramDate_startRoomConsumptionSummary, stopDate: paramDate_endRoomConsumptionSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_roomConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_roomConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_roomConsumptionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startRoomConsumptionSummary = new Date($('#datetime_startRoomConsumptionSummary').datebox('getValue'));
    paramDate_endRoomConsumptionSummary = new Date($('#datetime_endRoomConsumptionSummary').datebox('getValue'));
    $('#tab_roomConsumptionSummary').datagrid("options").loader = searchloader_roomConsumptionSummary;
    $("#tab_roomConsumptionSummary").datagrid("reload");
  });
  //生成Excel报表
  $('#createReport_roomConsumptionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_roomConsumptionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "房间消费汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    var accountDate = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i].accountDate == "总合计") {
        accountDate = "总合计";
      } else {
        accountDate = getDateForHoliday(data[i].accountDate);
      }
      csvData.push(
        [
          accountDate,
          data[i].rentConsumeCount,
          NP.divide(data[i].rentConsumeAmount, 100) + "元",
          data[i].availableRoomNumber,
          NP.divide(data[i].idealRentConsumeAmount, 100) + "元",
          data[i].occupancyRate,
          NP.divide(data[i].averageRoomRevenue, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "房间消费总数量", "房间总金额", "房间可售总数量", "房费理论总金额", "入住率统计", "平均客房收益"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();