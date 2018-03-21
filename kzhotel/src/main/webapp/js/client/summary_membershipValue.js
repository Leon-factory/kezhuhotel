/**
 * @JSname:会员储值汇总表
 */
; (function () {
  "use strict";
  $('#tab_membershipValueSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_guestConsumptionSummary,
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
          date: '总合计',
          sumAccessAmount: eapor.utils.compute("tab_membershipValueSummary", "sumAccessAmount"),
          sumRechargeAmount: eapor.utils.compute("tab_membershipValueSummary", "sumRechargeAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_membershipValueSummary', 'date', 3, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'sumAccessAmount', title: "合计会员充值付款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return value + "元";
          }
        }
      },
      {
        field: 'sumRechargeAmount', title: "合计给予储值消费额度", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return value + "元";
          }
        }
      }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_membershipValueSummary').click(function () {
    if ($('#datetime_startMembershipValueSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide' });
      return;
    }
    if ($('#datetime_endMembershipValueSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide' });
      return;
    }
    var paramDate_startMembershipValueSummary = "";
    var paramDate_endMembershipValueSummary = "";

    var searchloader_membershipValueSummary = function (param, success, error) {
      console.info(paramDate_startMembershipValueSummary);
      console.info(paramDate_endMembershipValueSummary);
      $.ajax({
        url: "../report/getMemberstoresummaryreport",
        data: { managerId: 0, startDate: paramDate_startMembershipValueSummary, stopDate: paramDate_endMembershipValueSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_membershipValueSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_membershipValueSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_membershipValueSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startMembershipValueSummary = $('#datetime_startMembershipValueSummary').datebox('getValue') + " 00:00:00";
    paramDate_endMembershipValueSummary = $('#datetime_endMembershipValueSummary').datebox('getValue') + " 23:59:59";
    $('#tab_membershipValueSummary').datagrid("options").loader = searchloader_membershipValueSummary;
    $("#tab_membershipValueSummary").datagrid("reload");
  });
  //生成报表
  $('#exportCSV_membershipValueSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_membershipValueSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员储值汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          data[i].sumAccessAmount + "元",
          data[i].sumRechargeAmount + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "合计会员充值付款金额", "合计给予储值消费额度"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();