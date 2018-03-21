//报表-->分析-->会员消费RFM分析JS
~(function () {
  "use strict";
  $('#R_RFMOfMemberConsumption').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "1"
    }, {
      "id": 2,
      "text": "2",
    }, {
      "id": 3,
      "text": "3"
    }, {
      "id": 4,
      "text": "4"
    }, {
      "id": 5,
      "text": "5"
    }],
    editable: false,
    panelHeight: 'auto'
  });
  $('#F_RFMOfMemberConsumption').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "1"
    }, {
      "id": 2,
      "text": "2",
    }, {
      "id": 3,
      "text": "3"
    }, {
      "id": 4,
      "text": "4"
    }, {
      "id": 5,
      "text": "5"
    }],
    editable: false,
    panelHeight: 'auto'
  });
  $('#M_RFMOfMemberConsumption').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "1"
    }, {
      "id": 2,
      "text": "2",
    }, {
      "id": 3,
      "text": "3"
    }, {
      "id": 4,
      "text": "4"
    }, {
      "id": 5,
      "text": "5"
    }],
    editable: false,
    panelHeight: 'auto'
  });
  $('#tab_RFMOfMemberConsumption').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    //loader:firstloader_RFMOfMemberConsumption,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    columns: [[  //-----columns start-----

      { field: 'guestId', title: "userId", align: 'center', width: 20, hidden: true },

      { field: 'guestName', title: "姓名", align: 'center', width: 20 },
      { field: 'phone', title: "手机号", align: 'center', width: 20 },
      { field: 'sourceGroupName', title: "客源组", align: 'center', width: 20 },
      {
        field: 'isHome', title: "是否本店会员", align: 'center', width: 20,
        formatter: function (value) {
          return value === 0 ? '否' : (value === 1 ? '是' : '--');
        }
      },
      { field: 'rIndex', title: "R", align: 'center', width: 10 },
      { field: 'fIndex', title: "F", align: 'center', width: 10 },
      { field: 'mIndex', title: "M", align: 'center', width: 10 },
      { field: 'rValue', title: "最近消费时间", align: 'center', width: 20 },
      {
        field: 'fValue', title: "消费次数", align: 'center', width: 20,
        formatter: function (value) {
          return value + "次";
        }
      },
      {
        field: 'mValue', title: "消费总额", align: 'center', width: 20,
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
  $('#search_RFMOfMemberConsumption').click(function () {
    if ($('#R_RFMOfMemberConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择R值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#F_RFMOfMemberConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择F值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#M_RFMOfMemberConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择M值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var paramR_RFMOfMemberConsumption = "";
    var paramF_RFMOfMemberConsumption = "";
    var paramM_RFMOfMemberConsumption = "";

    var searchloader_RFMOfMemberConsumption = function (param, success, error) {
      $.ajax({
        //				url : "../report/getMemberConsumeRFM",
        url: "../report/getGuestRFMAnalysis",
        data: { sourceGroupId: 1, isHome: 1, rIndex: paramR_RFMOfMemberConsumption, fIndex: paramF_RFMOfMemberConsumption, mIndex: paramM_RFMOfMemberConsumption },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_RFMOfMemberConsumption').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            //清空数据
            $('#tab_RFMOfMemberConsumption').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_RFMOfMemberConsumption', 'name', 8, 0);
            return true;
          }
          if (data == "") {
            $('#tab_RFMOfMemberConsumption').datagrid('loadData', { total: 0, rows: [] });
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
    paramR_RFMOfMemberConsumption = $('#R_RFMOfMemberConsumption').combobox('getValue');
    paramF_RFMOfMemberConsumption = $('#F_RFMOfMemberConsumption').combobox('getValue');
    paramM_RFMOfMemberConsumption = $('#M_RFMOfMemberConsumption').combobox('getValue');

    $('#tab_RFMOfMemberConsumption').datagrid("options").loader = searchloader_RFMOfMemberConsumption;
    $("#tab_RFMOfMemberConsumption").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_RFMOfMemberConsumption').on('click', function () {
    var aLink = this;
    var data = $('#tab_RFMOfMemberConsumption').datagrid('getData').rows;
    if (data.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (data[0].name == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "会员消费RFM分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          i + 1,
          data[i].name,
          data[i].phone,
          (data[i].rFM) % 10,
          parseInt(NP.divide(data[i].rFM, 10) % 10),
          parseInt(NP.divide(data[i].rFM, 100)),
          getDate(data[i].consumeTime),
          (data[i].consumeCount) + "次",
          NP.divide(data[i].consumeAmount, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["序号", "姓名", "手机号", "R", "F", "M", "最近消费时间", "最近消费次数", "消费总额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();