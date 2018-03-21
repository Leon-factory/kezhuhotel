//报表--》分析--》客户经理储值分析
~(function () {
  "use strict";
  $('#tab_customerValueManagerAnalysis').datagrid({
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
    //data:[{date:'2017-5-26 09:40:55',sumAccessAmount:1000,sumRechargeAmount:1000}],
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $(this).datagrid('appendRow', {
          date: '总合计',
          sumAccessAmount: eapor.utils.compute("tab_customerValueManagerAnalysis", "sumAccessAmount"),
          sumRechargeAmount: eapor.utils.compute("tab_customerValueManagerAnalysis", "sumRechargeAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_customerValueManagerAnalysis', 'date', 3, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'sumAccessAmount', title: "合计会员充值付款金额", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      },
      {
        field: 'sumRechargeAmount', title: "合计给予储值消费额度", align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) + "元" : 0;
        }
      }
    ]]
  });
  //客户经理下拉框
  $('#selectSalerUser_customerValueManagerAnalysis').combobox({
    url: "../user/ujlist",
    queryParams: { offset: 0, limit: 9999, maxUserId: 9999, usergroupId: 0, username: "" },
    valueField: 'userId',
    textField: 'username',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    //		onShowPanel:function(){
    //			$(this).combobox('reload');
    //		},
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].userId);
        $(this).combobox('setText', data[0].username);
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_customerValueManagerAnalysis').click(function () {
    if ($('#datetime_startCustomerValueManagerAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endCustomerValueManagerAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#selectSalerUser_customerValueManagerAnalysis').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择客户经理！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startCustomerValueManagerAnalysis = "";
    var paramDate_endCustomerValueManagerAnalysis = "";
    var selectSalerUser_customerValueManagerAnalysis = "";

    var searchloader_customerValueManagerAnalysis = function (param, success, error) {
      $.ajax({
        //				url : "../report/getMemberstoresummaryreport",
        url: "../report/managerStoreAnalysis",
        data: {
          start: paramDate_startCustomerValueManagerAnalysis,
          end: paramDate_endCustomerValueManagerAnalysis,
          eaporManagerId: selectSalerUser_customerValueManagerAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_customerValueManagerAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_customerValueManagerAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_customerValueManagerAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startCustomerValueManagerAnalysis = $('#datetime_startCustomerValueManagerAnalysis').datebox('getValue');
    paramDate_endCustomerValueManagerAnalysis = $('#datetime_endCustomerValueManagerAnalysis').datebox('getValue');
    selectSalerUser_customerValueManagerAnalysis = $('#selectSalerUser_customerValueManagerAnalysis').combobox('getValue');
    $('#tab_customerValueManagerAnalysis').datagrid("options").loader = searchloader_customerValueManagerAnalysis;
    $("#tab_customerValueManagerAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_customerValueManagerAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_customerValueManagerAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "客户经理储值分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].sumAccessAmount, 100) + "元",
          NP.divide(data[i].sumRechargeAmount, 100) + "元"
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