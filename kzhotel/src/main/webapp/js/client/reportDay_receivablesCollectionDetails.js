/**
 *@JSname:应收款收款明细日报
 */
~(function () {
  "use strict";
  $('#tab_receivablesCollectionDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_receivablesCollectionDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_receivablesCollectionDetails').datagrid('appendRow', {
          channelName: '总合计',
          salerUsername: "",
          accessAmount: eapor.utils.compute("tab_receivablesCollectionDetails", "accessAmount"),
          rechargeAmount: eapor.utils.compute("tab_receivablesCollectionDetails", "rechargeAmount"),
          createTime: "",
          createUsername: "",
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_receivablesCollectionDetails', 'channelName', 6, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
      { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },
      { field: 'salerUserId', title: "salerUserId", align: 'center', width: 20, hidden: true },

      { field: 'channelName', title: "客源单位", align: 'center', width: 20 },
      { field: 'salerUsername', title: "客户经理", align: 'center', width: 20 },
      {
        field: 'accessAmount', title: "收款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'rechargeAmount', title: "冲抵应收款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'createTime', title: "日期时间", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return "";
          } else {
            return getDate(value);
          }
        }
      },
      { field: 'createUsername', title: "操作员", align: 'center', width: 20 }
    ]]
  });
  //搜索按钮
  $('#searchbydatetime_receivablesCollectionDetails').click(function () {

    if ($('#datetime_receivablesCollectionDetails').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_receivablesCollectionDetails = "";

    var searchloader_receivablesCollectionDetails = function (param, success, error) {
      $.ajax({
        url: "../report/getchannelcollectdailyreport",
        data: { date: paramDate_receivablesCollectionDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_receivablesCollectionDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_receivablesCollectionDetails').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_receivablesCollectionDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          //如果不是用的list方法，这里给json前后加变成数组放入
          success(data);
          return true;
        },
        error: function (err) {
          alert(err);
        }
      });
    };
    paramDate_receivablesCollectionDetails = new Date($('#datetime_receivablesCollectionDetails').datebox('getValue'));
    $('#tab_receivablesCollectionDetails').datagrid("options").loader = searchloader_receivablesCollectionDetails;
    $("#tab_receivablesCollectionDetails").datagrid("reload");
  });
  //生成报表
  $('#createReport_receivablesCollectionDetails').on('click', function () {
    var aLink = this;
    var data = $('#tab_receivablesCollectionDetails').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "应收款收款明细日报：" + getDateForHoliday(data[0].createTime) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].channelName,
          data[i].salerUsername,
          NP.divide(data[i].accessAmount, 100) + "元",
          NP.divide(data[i].rechargeAmount, 100) + "元",
          getDate(data[i].createTime),
          data[i].createUsername
        ]
      );
    }

    var str = new CSV(csvData, { header: ["客源单位", "客户经理", "收款金额", "冲抵应收款金额", "日期时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();