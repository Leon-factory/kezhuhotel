/**
 *@JSname:会员储值明细日报
 *
 **/
~(function () {
  "use strict";
  $('#tab_membersStoredValueDetails').datagrid({
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
      { field: 'operatorId', title: "operatorId", align: 'center', width: 20, hidden: true },

      { field: 'memberNickname', title: "会员姓名", align: 'center', width: 22 },
      { field: 'phone', title: "会员手机号", align: 'center', width: 20 },
      {
        field: 'accessAmount', title: "会员充值付款金额", align: 'center', width: 18,
        formatter: function (value, row, index) {
          if (!value) {
            return 0;
          } else {
            return value + "元";
          }
        }
      },
      {
        field: 'rechargeAmount', title: "给予储值消费额度", align: 'center', width: 18,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return value + "元";
          }
        }
      },
      {
        field: 'createTime', title: "操作时间", align: 'center', width: 35,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'operatorUsername', title: "操作员", align: 'center', width: 25 }
    ]]
  });

  //搜索按钮
  $('#searchbydatetime_membersStoredValueDetails').click(function () {
    var getTime = $('#datetime_membersStoredValueDetails').datebox('getValue');
    if (getTime == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide' });
      return;
    }
    var paramDate_membersStoredValueDetails = "";

    var searchloader_membersStoredValueDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getMemberstoredailyreport",
        data: { date: paramDate_membersStoredValueDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_membersStoredValueDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_membersStoredValueDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_membersStoredValueDetails', 'memberNickname', 6, 0);
            return true;
          }
          if (data == "") {
            $('#tab_membersStoredValueDetails').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_membersStoredValueDetails = getTime;
    console.info(paramDate_membersStoredValueDetails)
    $('#tab_membersStoredValueDetails').datagrid("options").loader = searchloader_membersStoredValueDetails;
    $("#tab_membersStoredValueDetails").datagrid("reload");
  });

  //生成日报
  $('#exportCSV_membersStoredValueDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_membersStoredValueDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].memberNickname == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员储值明细日报：" + getDateForHoliday(rows[0].createTime) + ".csv";
    aLink.download = csvName;

    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];

    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].memberNickname,
          rows[i].phone,
          rows[i].accessAmount,
          rows[i].rechargeAmount,
          getDate(rows[i].createTime),
          rows[i].operatorUsername
        ]
      );
    }

    console.info(csvData);
    var str = new CSV(csvData, { header: ["会员姓名", "会员手机号", "会员充值付款金额", "给予储值消费额度", "操作时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();