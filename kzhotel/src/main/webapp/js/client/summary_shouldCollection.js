/**
 * @JSname:应收款汇总表
 */
; (function () {
  "use strict";
  //客源下拉框
  $('#selectChannel_shouldCollectionSummary').combobox({
    url: '../channel/pglist',
    queryParams: { offset: 0, limit: 9999, channelName: '', usageState: 1 },
    valueField: 'channelId',
    textField: 'channelName',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    editable: false,
    onShowPanel: function () {
      $(this).combobox('reload');
    }/*,
		loadFilter:function(data){
			data.unshift({channelId:0,channelName:"全部"});
			return data;
		}*/
    ,
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].channelId);
        $(this).combobox('setText', data[0].channelName);
      }
    }
  });

  $('#tab_shouldCollectionSummary').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_shouldCollectionSummary,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_shouldCollectionSummary').datagrid('appendRow', {
          date: '总合计',
          amount: eapor.utils.compute("tab_shouldCollectionSummary", "amount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_shouldCollectionSummary', 'date', 2, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'amount', title: "应收款金额", align: 'center', width: 20,
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

  //搜索按钮
  $('#searchbydatetime_shouldCollectionSummary').click(function () {
    if ($('#datetime_startShouldCollectionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endShouldCollectionSummary').datetimebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#selectChannel_shouldCollectionSummary').combobox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请选择客源！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startShouldCollectionSummary = "";
    var paramDate_endShouldCollectionSummary = "";
    var channelId_shouldCollectionSummary = "";

    var searchloader_shouldCollectionSummary = function (param, success, error) {
      console.info(paramDate_startShouldCollectionSummary);
      console.info(paramDate_endShouldCollectionSummary);
      console.info(channelId_shouldCollectionSummary);
      $.ajax({
        url: "../report/getchannelpaymentsummaryreport",
        data: { start: paramDate_startShouldCollectionSummary, stop: paramDate_endShouldCollectionSummary, channelId: channelId_shouldCollectionSummary },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_shouldCollectionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_shouldCollectionSummary').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_shouldCollectionSummary').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startShouldCollectionSummary = new Date($('#datetime_startShouldCollectionSummary').datebox('getValue'));
    paramDate_endShouldCollectionSummary = new Date($('#datetime_endShouldCollectionSummary').datebox('getValue'));
    channelId_shouldCollectionSummary = $('#selectChannel_shouldCollectionSummary').combobox('getValue');
    $('#tab_shouldCollectionSummary').datagrid("options").loader = searchloader_shouldCollectionSummary;
    $("#tab_shouldCollectionSummary").datagrid("reload");
  });
  //生成Excel报表
  $('#createReport_shouldCollectionSummary').on('click', function () {
    var aLink = this;
    var data = $('#tab_shouldCollectionSummary').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "应收款汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].amount, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "应收款金额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();