/**
 *@JSname:会员结账明细日报
 */
~(function (window) {
  "use strict";
  $('#tab_memberClosingDetails').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_memberClosingDetails,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      $('a[name="toGetBillJSP_mcd"]').on('click', function () {
        let id = $(this).attr('data-val');
        toGetBillJSP_mcd(id);
      });
    },
    columns: [[  //-----columns start-----
      { field: 'receptionId', title: "receptionId", align: 'center', width: 20, hidden: true },
      { field: 'checkoutUserId', title: "checkoutUserId", align: 'center', width: 20, hidden: true },
      { field: 'payAmount', title: "payAmount", align: 'center', width: 20, hidden: true },
      { field: 'channelCreditAmount', title: "channelCreditAmount", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "会员姓名", align: 'center', width: 20 },
      {
        field: 'receptionCode', title: "宾客账单编号", align: 'center', width: 30,
        formatter: function (value, row, index) {
          let receptionId = row.receptionId;
          return `<a href='javascript:;' name='toGetBillJSP_mcd' data-val='${receptionId}'>${value}</a>`;
        }
      },
      {
        field: 'consumeAmount', title: "消费总金额", align: 'center', width: 18,
        formatter: function (value, row, index) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'rentConsumeAmount', title: "房费", align: 'center', width: 18,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'goodsConsumeAmount', title: "商品消费", align: 'center', width: 18,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'serviceConsumeAmount', title: "服务消费", align: 'center', width: 18,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'banquetConsumeAmount', title: "餐宴消费", align: 'center', width: 18,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'checkoutTime', title: "结账时间", align: 'center', width: 30,
        formatter: function (value) {
          return getDate(value);
        }
      },
      { field: 'checkoutUsername', title: "结账操作员", align: 'center', width: 20 }
    ]]
  });
  function toGetBillJSP_mcd(receptionId) {
    console.info(receptionId);
    if ($('#kzmaintable').tabs('exists', '宾客已结账单')) {
      $.messager.confirm('系统提示', '宾客已结账单页面已打开，是否继续跳转到该页面显示信息？', function (r) {
        if (r) {
          sessionStorage.setItem("receptionId_mcd", receptionId);
          $('#kzmaintable').tabs('close', '宾客已结账单');
          $('#kzmaintable').tabs('add', {
            title: '宾客已结账单',
            closable: true,
            plain: false,
            border: false,
            href: '../client/newGetBill_getBill.jsp'
          });
        }
      });

    } else {
      sessionStorage.setItem("receptionId_mcd", receptionId);
      $('#kzmaintable').tabs('add', {
        title: '宾客已结账单',
        closable: true,
        plain: false,
        border: false,
        href: '../client/newGetBill_getBill.jsp'
      });
    }
  };
  //搜索按钮
  $('#searchbydatetime_memberClosingDetails').click(function () {
    if ($('#datetime_memberClosingDetails').datebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide' });
      return;
    }
    var paramDate_memberClosingDetails = "";

    function searchloader_memberClosingDetails(param, success, error) {
      console.info(paramDate_memberClosingDetails);
      $.ajax({
        url: '../report/getmembercheckoutpaymentdailyreport',
        data: { startDate: paramDate_memberClosingDetails },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_memberClosingDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_memberClosingDetails').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_memberClosingDetails', 'guestName', 8, 0);
            return true;
          }
          if (data == "") {
            $('#tab_memberClosingDetails').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_memberClosingDetails = new Date($('#datetime_memberClosingDetails').datebox('getValue'));
    $('#tab_memberClosingDetails').datagrid("options").loader = searchloader_memberClosingDetails;
    $("#tab_memberClosingDetails").datagrid("reload");
  });
  //生成报表
  $('#createReport_memberClosingDetails').on('click', function () {
    var aLink = this;
    var rows = $('#tab_memberClosingDetails').datagrid('getData').rows;
    if (rows.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (rows[0].guestName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员结账明细日报：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < rows.length; i++) {
      csvData.push(
        [
          rows[i].guestName,
          rows[i].receptionCode,
          NP.divide(rows[i].consumeAmount, 100) + "元",
          NP.divide(rows[i].rentConsumeAmount, 100) + "元",
          NP.divide(rows[i].goodsConsumeAmount, 100) + "元",
          NP.divide(rows[i].serviceConsumeAmount, 100) + "元",
          NP.divide(rows[i].banquetConsumeAmount, 100) + "元",
          getDate(rows[i].checkoutTime),
          rows[i].checkoutUsername
        ]
      );
    }

    console.info(csvData);
    var str = new CSV(csvData, { header: ["会员姓名", "宾客账单编号", "消费总金额", "房费", "商品消费", "服务消费", "结账时间", "操作员"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})(window);