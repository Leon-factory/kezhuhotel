//报表--》分析--》客户经理应收款收款分析JS
~(function () {
  "use strict";
  $('#tab_accountsReceivableCollection').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_accountsReceivableCollection,
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
          accessAmount: eapor.utils.compute("tab_accountsReceivableCollection", "accessAmount"),
          rechargeAmont: eapor.utils.compute("tab_accountsReceivableCollection", "rechargeAmont")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_accountsReceivableCollection', 'date', 3, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'accessAmount', title: "合计收款金额", align: 'center', width: 20,
        formatter: function (value, row, index) {
          console.info(row);
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'rechargeAmont', title: "合计冲抵应收款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      }
    ]]
  });

  //客户经理下拉框
  $('#searchSalarUser_accountsReceivableCollection').combobox({
    url: "../user/ujlist",
    queryParams: { offset: 0, limit: 9999, maxUserId: 9999, usergroupId: 0, username: "" },
    valueField: 'userId',
    textField: 'username',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].userId);
        $(this).combobox('setText', data[0].username);
      }
    }
  });

  //搜索按钮
  $('#searchbydatetime_accountsReceivableCollection').click(function () {
    if ($('#datetime_startAccountsReceivableCollection').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endAccountsReceivableCollection').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#searchSalarUser_accountsReceivableCollection').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择客户经理！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startAccountsReceivableCollection = "";
    var paramDate_endAccountsReceivableCollection = "";
    var paramSalarUser_accountsReceivableCollection = "";

    var searchloader_accountsReceivableCollection = function (param, success, error) {
      console.info(paramDate_startAccountsReceivableCollection)
      console.info(paramDate_endAccountsReceivableCollection)
      console.info(paramSalarUser_accountsReceivableCollection)
      $.ajax({
        url: "../report/getchannelcollectsummaryBySaler",
        data: {
          startDate: paramDate_startAccountsReceivableCollection, stopDate: paramDate_endAccountsReceivableCollection
          , salerUserId: paramSalarUser_accountsReceivableCollection
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_accountsReceivableCollection').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_accountsReceivableCollection').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_accountsReceivableCollection').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startAccountsReceivableCollection = new Date($('#datetime_startAccountsReceivableCollection').datebox('getValue'));
    paramDate_endAccountsReceivableCollection = new Date($('#datetime_endAccountsReceivableCollection').datebox('getValue'));
    paramSalarUser_accountsReceivableCollection = $('#searchSalarUser_accountsReceivableCollection').combobox('getValue');
    $('#tab_accountsReceivableCollection').datagrid("options").loader = searchloader_accountsReceivableCollection;
    $("#tab_accountsReceivableCollection").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_accountsReceivableCollection').on('click', function () {
    var aLink = this;
    var data = $('#tab_accountsReceivableCollection').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "客户经理应收款收款分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].accessAmount, 100) + "元",
          NP.divide(data[i].rechargeAmont, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "合计收款金额", "合计冲抵应收款金额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();