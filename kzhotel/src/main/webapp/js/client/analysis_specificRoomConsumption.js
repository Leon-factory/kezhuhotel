//报表--》分析--》特定房型消费分析
~(function () {
  "use strict";
  $('#tab_specificRoomConsumptionAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_specificRoomConsumptionAnalysis,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        var propValue = 0;
        var roomtypeAmount = eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomtypeAmount");
        var roomConsumeAmount = eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomConsumeAmount");
        if (roomtypeAmount == 0) {
          propValue = 0;
        } else if (roomConsumeAmount == 0) {
          propValue = 0;
        } else {
          propValue = roomtypeAmount / roomConsumeAmount;
        }
        $(this).datagrid('appendRow', {
          date: '总合计',
          roomConsumeTotal: eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomConsumeTotal"),
          roomConsumeAmount: eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomConsumeAmount"),
          roomtypeTotal: eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomtypeTotal"),
          roomtypeAmount: eapor.utils.compute("tab_specificRoomConsumptionAnalysis", "roomtypeAmount"),
          prop: propValue
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_specificRoomConsumptionAnalysis', 'date', 6, 0);
      }
    },
    columns: [[  //-----columns start-----

      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'roomConsumeTotal', title: "房间消费总数量", align: 'center', width: 20 },
      {
        field: 'roomConsumeAmount', title: "房费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      { field: 'roomtypeTotal', title: "房型消费总数量", align: 'center', width: 20 },
      {
        field: 'roomtypeAmount', title: "房型消费总金额", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return 0;
          } else {
            return NP.divide(value, 100) + "元";
          }
        }
      },
      {
        field: 'prop', title: "占比统计", align: 'center', width: 20,
        formatter: function (value) {
          return (value * 100).toFixed(2) + "%";
        }
      }
    ]]
  });
  //房型下拉框
  $('#selectRoomType_specificRoomConsumptionAnalysis').combobox({
    url: "../roomtype/lrtc",
    queryParams: { offset: 0, limit: 9999, roomtypeName: '' },
    valueField: 'roomtypeId',
    textField: 'roomtypeName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        $(this).combobox('setValue', data[0].roomtypeId);
        $(this).combobox('setText', data[0].roomtypeName);
      }
    }
  });
  //搜索按钮
  $('#searchbydatetime_specificRoomConsumptionAnalysis').click(function () {
    if ($('#datetime_startSpecificRoomConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endSpecificRoomConsumptionAnalysis').datetimebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请先选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramDate_startSpecificRoomConsumptionAnalysis = "";
    var paramDate_endSpecificRoomConsumptionAnalysis = "";
    var selectRoomType_specificRoomConsumptionAnalysis = "";

    var searchloader_specificRoomConsumptionAnalysis = function (param, success, error) {
      console.info(paramDate_startSpecificRoomConsumptionAnalysis)
      console.info(paramDate_endSpecificRoomConsumptionAnalysis)
      console.info(selectRoomType_specificRoomConsumptionAnalysis)
      $.ajax({
        url: "../report/getGivenRoomTypeAnalysis",
        data: {
          start: paramDate_startSpecificRoomConsumptionAnalysis, stop: paramDate_endSpecificRoomConsumptionAnalysis
          , roomtypeId: selectRoomType_specificRoomConsumptionAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_specificRoomConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_specificRoomConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
            //$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:2000,showType:'slide'});
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_specificRoomConsumptionAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startSpecificRoomConsumptionAnalysis = new Date($('#datetime_startSpecificRoomConsumptionAnalysis').datebox('getValue'));
    paramDate_endSpecificRoomConsumptionAnalysis = new Date($('#datetime_endSpecificRoomConsumptionAnalysis').datebox('getValue'));
    selectRoomType_specificRoomConsumptionAnalysis = $('#selectRoomType_specificRoomConsumptionAnalysis').combobox('getValue');
    $('#tab_specificRoomConsumptionAnalysis').datagrid("options").loader = searchloader_specificRoomConsumptionAnalysis;
    $("#tab_specificRoomConsumptionAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_specificRoomConsumptionAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_specificRoomConsumptionAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "特定房型消费分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date,
          data[i].roomConsumeTotal,
          NP.divide(data[i].roomConsumeAmount, 100) + "元",
          data[i].roomtypeTotal,
          NP.divide(data[i].roomtypeAmount, 100) + "元",
          (data[i].prop * 100).toFixed(2) + "%"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["日期", "房间消费总数量", "房费总金额", "房型消费总数量", "房型消费总金额", "占比统计"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();