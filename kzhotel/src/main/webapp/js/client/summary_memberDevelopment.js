//报表-->汇总-->会员发展汇总表JS
//搜索loader函数
/**
 * @JSname:会员发展汇总表
 */
; (function () {
  "use strict";
  $('#tab_memberDevelopmentSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_memberDevelopmentSummary').datagrid('appendRow', {
          date: '总合计'
          , number: eapor.utils.compute("tab_memberDevelopmentSummary", "number")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_memberDevelopmentSummary', 'date', 2, 0);
      }
    },
    columns: [[
      {
        field: 'date', title: "日期", align: 'center', width: 20,
        formatter: function (value) {
          if (value == "总合计") {
            return value;
          } else if (value == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
            return value;
          }
          return getDateForHoliday(value);
        }
      },
      { field: 'number', title: "会员发展数量", align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_memberDevelopmentSummary').click(function () {
    if ($('#datetime_startMemberDevelopmentSummary').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endMemberDevelopmentSummary').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startMemberDevelopmentSummary = "";
    var paramDate_endMemberDevelopmentSummary = "";

    var searchloader_memberDevelopmentSummary = function (param, success, error) {
      $.ajax({
        url: '../report/getMemberInviteDailySummary',
        data: { startTime: paramDate_startMemberDevelopmentSummary, endTime: paramDate_endMemberDevelopmentSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_memberDevelopmentSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          if (typeof (data) === "object" && data.length === 0) {
            $('#tab_memberDevelopmentSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_memberDevelopmentSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_memberDevelopmentSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startMemberDevelopmentSummary = $('#datetime_startMemberDevelopmentSummary').datebox('getValue');
    paramDate_endMemberDevelopmentSummary = $('#datetime_endMemberDevelopmentSummary').datebox('getValue');
    console.info(paramDate_startMemberDevelopmentSummary);
    console.info(paramDate_endMemberDevelopmentSummary);
    $('#tab_memberDevelopmentSummary').datagrid("options").loader = searchloader_memberDevelopmentSummary;
    $("#tab_memberDevelopmentSummary").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_memberDevelopmentSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_memberDevelopmentSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员发展汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    var date = "";

    for (let i = 0, len = data.length; i < len; i++) {
      if (data[i].date != "总合计") {
        date = getDateForHoliday(data[i].date);
      } else {
        date = "总合计";
      }
      csvData.push(
        [
          date
          , data[i].number
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "会员发展数量"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();