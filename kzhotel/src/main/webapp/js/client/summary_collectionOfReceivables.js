/**
 *@JSname:应收款收款汇总表
 */
; (function () {
  "use strict";
  $('#tab_collectionOfReceivables').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_collectionOfReceivables,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $('#tab_collectionOfReceivables').datagrid('appendRow', {
          date: '总合计',
          collectAmount: eapor.utils.compute("tab_collectionOfReceivables", "collectAmount"),
          offsetAmount: eapor.utils.compute("tab_collectionOfReceivables", "offsetAmount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_collectionOfReceivables', 'date', 3, 0);
      }

    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      {
        field: 'collectAmount', title: "合计收款金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'offsetAmount', title: "合计冲抵应收款金额", align: 'center', width: 20,
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
  $('#searchbydatetime_collectionOfReceivables').click(function () {
    if ($('#datetime_startCollectionOfReceivables').datebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if ($('#datetime_endCollectionOfReceivables').datebox('getValue') == "") {
      $.messager.show({ title: '系统提示', msg: '请先选择日期！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var paramDate_startCollectionOfReceivables = "";
    var paramDate_endCollectionOfReceivables = "";

    var searchloader_collectionOfReceivables = function (param, success, error) {
      $.ajax({
        url: "../report/getchannelcollectsummary",
        data: { start: paramDate_startCollectionOfReceivables, stop: paramDate_endCollectionOfReceivables },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_collectionOfReceivables').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_collectionOfReceivables').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_collectionOfReceivables').datagrid('loadData', { total: 0, rows: [] });
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

    paramDate_startCollectionOfReceivables = new Date($('#datetime_startCollectionOfReceivables').datebox('getValue'));
    paramDate_endCollectionOfReceivables = new Date($('#datetime_endCollectionOfReceivables').datebox('getValue'));
    $('#tab_collectionOfReceivables').datagrid("options").loader = searchloader_collectionOfReceivables;
    $("#tab_collectionOfReceivables").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_collectionOfReceivables').on('click', function () {
    var aLink = this;
    var data = $('#tab_collectionOfReceivables').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "应收款收款汇总表：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          NP.divide(data[i].collectAmount, 100) + "元",
          NP.divide(data[i].offsetAmount, 100) + "元"
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