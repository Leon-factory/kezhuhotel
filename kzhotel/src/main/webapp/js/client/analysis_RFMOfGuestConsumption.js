/**
 * @name:报表-->分析-->宾客消费RFM分析JS
 */
~(function () {
  "use strict";
  $('#R_RFMOfGuestConsumption').combobox({
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
  $('#F_RFMOfGuestConsumption').combobox({
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
  $('#M_RFMOfGuestConsumption').combobox({
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
  //客源组combobox
  $('#sourceGroup_RFMOfGuestConsumption').combobox({
    url: '../sourcegroup/pglist',
    queryParams: { offset: 0, limit: 9999999, groupName: "" },
    valueField: 'sourceGroupId',
    textField: 'sourceGroupName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter: function (data) {
      if (data != -3333 && data != -3335) {
        data.unshift({ sourceGroupId: 0, sourceGroupName: "全部", "selected": true });
      }
      return data;
    }
  });
  //是否本店会员combobox
  $('#isHomeVip_RFMOfGuestConsumption').combobox({
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "是"
    }, {
      "id": -1,
      "text": "否"
    }],
    valueField: 'id',
    textField: 'text',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200
  });
  //搜索loader函数
  $('#tab_RFMOfGuestConsumption').datagrid({
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
    //data:[],
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
  $('#search_RFMOfGuestConsumption').click(function () {
    if ($('#R_RFMOfGuestConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择R值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#F_RFMOfGuestConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择F值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    if ($('#M_RFMOfGuestConsumption').combobox('getValue') == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择M值！', timeout: 2000, showType: 'slide', height: 'auto'
      });
      return;
    }
    var sourceGroupId = "";
    var isHome = "";
    var paramR_RFMOfGuestConsumption = "";
    var paramF_RFMOfGuestConsumption = "";
    var paramM_RFMOfGuestConsumption = "";

    var searchloader_RFMOfGuestConsumption = function (param, success, error) {
      console.info(sourceGroupId)
      console.info(isHome)
      console.info(paramR_RFMOfGuestConsumption)
      console.info(paramF_RFMOfGuestConsumption)
      console.info(paramM_RFMOfGuestConsumption)
      $.ajax({
        url: "../report/getGuestRFMAnalysis",
			/*	long sourceGroupId,//客源组id，0为不限制
				int isHome,//是否本店会员，大于0为是，小于0不是，0不限制
				int rIndex,//R选择(1-5),0为不限制
				int fIndex,//F选择(1-5),0为不限制
				int mIndex//M选择(1-5),0为不限制
		*/		data: {
          sourceGroupId: sourceGroupId
          , isHome: isHome
          , rIndex: paramR_RFMOfGuestConsumption
          , fIndex: paramF_RFMOfGuestConsumption
          , mIndex: paramM_RFMOfGuestConsumption
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data);
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_RFMOfGuestConsumption').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          if (data == "") {
            $('#tab_RFMOfGuestConsumption').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_RFMOfGuestConsumption').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            eapor.utils.messagerInfoBySearchEmpty('tab_RFMOfGuestConsumption', 'name', 10, 0);
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
    sourceGroupId = $('#sourceGroup_RFMOfGuestConsumption').combobox('getValue');
    isHome = $('#isHomeVip_RFMOfGuestConsumption').combobox('getValue');
    paramR_RFMOfGuestConsumption = $('#R_RFMOfGuestConsumption').combobox('getValue');
    paramF_RFMOfGuestConsumption = $('#F_RFMOfGuestConsumption').combobox('getValue');
    paramM_RFMOfGuestConsumption = $('#M_RFMOfGuestConsumption').combobox('getValue');

    $('#tab_RFMOfGuestConsumption').datagrid("options").loader = searchloader_RFMOfGuestConsumption;
    $("#tab_RFMOfGuestConsumption").datagrid("reload");
  });

  //生成Excel报表
  $('#createReport_RFMOfGuestConsumption').on('click', function () {
    var aLink = this;
    var data = $('#tab_RFMOfGuestConsumption').datagrid('getData').rows;
    if (data.length == 0) {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！无报表数据！', timeout: 2000, showType: 'slide' });
      return;
    }
    if (data[0].name == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '生成报表失败！未查询到相关信息！', timeout: 2000, showType: 'slide' });
      return;
    }
    var csvName = "宾客消费RFM分析：" + getDateForHoliday(new Date()) + ".csv";
    aLink.download = csvName;
    // 这里可以将后台返回的数据放入csvData，然后将其导出到csv保存
    var csvData = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [
          i + 1,
          data[i].name,
          data[i].phone,
          data[i].guestGroup,
          data[i].is,
          (data[i].rFM) % 10,
          parseInt(NP.divide(data[i].rFM, 10) % 10),
          parseInt(NP.divide(data[i].rFM, 100)),
          getDate(data[i].consumeTime),
          (data[i].consumeCount) + "次",
          NP.divide(data[i].consumeAmount, 100) + "元"
        ]
      );
    }

    var str = new CSV(csvData, { header: ["序号", "姓名", "手机号", "客源组", "是否本店会员", "R", "F", "M", "最近消费时间", "最近消费次数", "消费总额"] }).encode();
    str = encodeURIComponent(str);
    aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
    setTimeout(function () {
      $(aLink).removeAttr("href");
      $(aLink).removeAttr("download");
    }, 1000);
  });
})();