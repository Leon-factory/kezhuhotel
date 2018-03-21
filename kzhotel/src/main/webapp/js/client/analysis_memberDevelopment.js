//报表--》分析--》会员发展分析JS

~(function () {
  "use strict";
  $('#searchPhone_memberDevelopmentAnalysis').numberbox({
    validType: 'mobilephone',
    invalidMessage: "手机号码格式不正确！",
    delay: 1000,
    validateOnCreate: false,
    validateOnBlur: true,
    tipPosition: 'top'
  });

  $('#tab_memberDevelopmentAnalysis').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_memberDevelopmentAnalysis,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (data.rows.length > 0) {
        $(this).datagrid('appendRow', {
          date: '总合计',
          inviteCount: eapor.utils.compute("tab_memberDevelopmentAnalysis", "inviteCount")
        });
      } else {
        eapor.utils.messagerInfoBySearchEmpty('tab_memberDevelopmentAnalysis', 'date', 2, 0);
      }
    },
    columns: [[  //-----columns start-----
      { field: 'date', title: "日期", align: 'center', width: 20 },
      { field: 'inviteCount', title: "会员发展数量", align: 'center', width: 20 }
    ]]
  });


  //搜索按钮
  $('#searchbydatetime_memberDevelopmentAnalysis').click(function () {
    if ($('#datetime_startMemberDevelopmentAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择起始日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#datetime_endMemberDevelopmentAnalysis').datebox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择结束日期！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if (!$('#searchPhone_memberDevelopmentAnalysis').numberbox('isValid')) {
      $('#searchPhone_memberDevelopmentAnalysis').numberbox('textbox').focus();
      return;
    }

    var paramDate_startMemberDevelopmentAnalysis = "";
    var paramDate_endMemberDevelopmentAnalysis = "";
    var paramPhone_memberDevelopmentAnalysis = "";

    var searchloader_memberDevelopmentAnalysis = function (param, success, error) {
      $.ajax({
        url: "../report/getMemberInvitereport",
        data: {
          startDate: paramDate_startMemberDevelopmentAnalysis, stopDate: paramDate_endMemberDevelopmentAnalysis
          , phone: paramPhone_memberDevelopmentAnalysis
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_memberDevelopmentAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $.messager.show({
              title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide', height: 'auto'
            });
            $('#tab_memberDevelopmentAnalysis').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $.messager.show({
              title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide', height: 'auto'
            });
            $('#tab_memberDevelopmentAnalysis').datagrid('loadData', { total: 0, rows: [] });
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
    paramDate_startMemberDevelopmentAnalysis = $('#datetime_startMemberDevelopmentAnalysis').datebox('getValue');
    paramDate_endMemberDevelopmentAnalysis = $('#datetime_endMemberDevelopmentAnalysis').datebox('getValue');
    paramPhone_memberDevelopmentAnalysis = $('#searchPhone_memberDevelopmentAnalysis').numberbox('getValue');
    $('#tab_memberDevelopmentAnalysis').datagrid("options").loader = searchloader_memberDevelopmentAnalysis;
    $("#tab_memberDevelopmentAnalysis").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_memberDevelopmentAnalysis').on('click', function () {
    var aLink = this;
    var data = $('#tab_memberDevelopmentAnalysis').datagrid('getData').rows;
    if (data.length < 2) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员发展分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          data[i].date
          , data[i].inviteCount
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