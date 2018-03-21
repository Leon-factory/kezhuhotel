//------宾客失约预警JS------------
~(function () {
  "use strict";

  var pubjsonfirst_ewg = {},//初始加载loader函数
    getGuestName_ewg = "",//搜索loader函数
    getGuestPhone_ewg = "";

  function firstloader_ewg(param, success, error) {
    if (!$.isEmptyObject(pubjsonfirst_ewg)) {
      success(pubjsonfirst_ewg);
      return true;
    }

    $.ajax({
      url: '../reserve/selectLossArrivalAlertList',
      data: { reservePerson: '', reserveMobile: '' },
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        pubjsonfirst_ewg = data;
        success(data);
      },
      error: function (err) {
        alert(err);
      }
    });
  };

  function searchloader_ewg(param, success, error) {
    $.ajax({
      url: '../reserve/selectLossArrivalAlertList',
      data: { reservePerson: getGuestName_ewg, reserveMobile: getGuestPhone_ewg },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_earlywarningguest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $('#tab_earlywarningguest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_earlywarningguest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data);
        return true;
      },
      error: function (err) {
        alert(err);
      }
    });
  };
  $('#tab_earlywarningguest').datagrid({
    title: '宾客失约预警列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fit: true,
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fitColumns: true,//防止水平滚动
    fitColumns: true,//防止水平滚动
    rownumbers: true,
    loader: firstloader_ewg,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_earlywarningguest', 'roomtypeName', 14, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
    },
    columns: [[
      { field: 'checkinType', title: 'checkinType', align: 'center', width: 20, hidden: true },
      { field: 'itemIndex', title: 'itemIndex', align: 'center', width: 20, hidden: true },
      { field: 'reserveCode', title: 'reserveCode', align: 'center', width: 20, hidden: true },
      { field: 'reserveDetailId', title: 'reserveDetailId', align: 'center', width: 20, hidden: true },
      { field: 'sourceGroupId', title: 'sourceGroupId', align: 'center', width: 20, hidden: true },

      { field: 'roomtypeName', title: '房型', align: 'center', width: 20 },
      { field: 'roomNumber', title: '房间数', align: 'center', width: 20 },
      {
        field: 'channelId', title: '客源', align: 'center', width: 20,
        formatter: function (value) {
          $.each(eapor.data.channelObj, function (i, item) {
            if (value == item.channelId) {
              value = item.channelName;
              return;
            }
          })
          return value;
        }
      },
      { field: 'checkinTypeChar', title: '入住类型', align: 'center', width: 20 },
      {
        field: 'expectedEnterTime', title: '计划到店日期时间', align: 'center', width: 36,
        formatter: function (value) {
          return getDate(value);
        }
      },
      {
        field: 'expectedStayNumber', title: '计划居住', align: 'center', width: 20,
        formatter: function (value) {
          return value + "天";
        }
      },
      {
        field: 'expectedRentAmount', title: '房费', align: 'center', width: 20,
        formatter: function (value) {
          return value ? NP.divide(value, 100) : value;
        }
      },
      { field: 'reservePerson', title: '预订人姓名', align: 'center', width: 20 },
      { field: 'reserveMobile', title: '联系手机', align: 'center', width: 25 },
      {
        field: 'paymethodId', title: '支付方式', width: 20, align: 'center',
        formatter: function (value, row) {
          if (row.amount > 0) {
            if (value == 5) {
              return "代收（" + row.creditChannelName + "）";
            } else {
              $.each(eapor.data.PaymethodObj, function (i, item) {
                if (value == item.paymethod_code) {
                  value = item.paymethod_name;
                  return;
                }
              });
              return value;
            }
          } else {
            return "";
          }
        }
      },
      {
        field: 'amount', title: '支付金额', width: 20, align: 'center',
        formatter: function (value) {
          return value > 0 ? NP.divide(value, 100) + "元" : "";
        }
      },
      {
        field: 'reserveState', title: '订单状态', align: 'center', width: 20,
        formatter: function (value) {
          if (value == 1) {
            value = "有效";
          } else if (value == 2) {
            value = "解除";
          } else if (value == 3) {
            value = "失约";
          } else if (value == 4) {
            value = "入住";
          }
          return value;
        }
      },
      { field: 'modifyUsername', title: '最后编辑人', align: 'center', width: 20 },
      {
        field: 'modifyTime', title: '编辑时间', align: 'center', width: 40,
        formatter: function (value) {
          return value < 0 ? "--" : getDate(value);
        }
      }
    ]]

  });
  //编辑按钮
  $('#edit_btn_ewg').click(function () {
    //判断是否选中要修改的数据
    var getRow_ewg = $('#tab_earlywarningguest').datagrid('getSelected');

    if (!getRow_ewg || getRow_ewg.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的订单！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#showEditEarlyWarningGuestInfo').append(
      `<div id="div" style="padding:20px 0 0 40px;">
				<div style="margin-bottom:10px">
					<input id="ipt_checkChannel_ewg" style="width:240px;"
						label="客源：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_checkRoomType_ewg" style="width:240px;"
						label="房型选择：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_checkRoomNumber_ewg"  style="width:240px;"
						label="房间数：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_checkInType_ewg"  style="width:240px;"
						label="入住类型：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_checkInDate_ewg" style="width:240px;"
						label="入住时间：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_stayDay_ewg"  style="width:240px;"
						label="计划居住：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_expectedRentAmount_ewg" style="width:240px;"
						label="房费：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_reservePerson_ewg" style="width:240px;"
						label="预订人姓名：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="ipt_reserveMobile_ewg"  style="width:240px;"
						label="预订人手机：" labelPosition="before" labelAlign="right" labelWidth="90"/>
				</div>
			</div>`
    );
    //客源
    $('#ipt_checkChannel_ewg').combobox({
      url: '../channel/pglist',
      queryParams: { limit: 9999, offset: 0, sourceGroupId: 0, channelName: '', usageState: 1 },
      valueField: 'channelId',
      value: '非会员',
      textField: 'channelName'
    });
    //房型选择
    $('#ipt_checkRoomType_ewg').combobox({
      url: '../roomtype/lrtc',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      valueField: 'roomtypeId',
      value: '标准间',
      textField: 'roomtypeName'
    });
    //房间数
    $('#ipt_checkRoomNumber_ewg').numberspinner({ value: 1 });
    //入住类型
    $('#ipt_checkInType_ewg').combobox({
      valueField: 'id'
      , textField: 'text'
      , data: [{ 'id': 1, 'text': '全日房' }, { 'id': 2, 'text': '钟点房' }, { 'id': 3, 'text': '晚房' }]
    });
    //入住日期时间
    $('#ipt_checkInDate_ewg').datetimebox({

    });
    //计划居住
    $('#ipt_stayDay_ewg').numberspinner({

    });
    //房费
    $('#ipt_expectedRentAmount_ewg').numberbox({

    });
    //预订人姓名
    $('#ipt_reservePerson_ewg').textbox({

    });
    //预订人手机
    $('#ipt_reserveMobile_ewg').numberbox({

    });
    //已选择-->取到要修改的数据到弹框上
    console.info(getRow_ewg);
    $('#ipt_checkChannel_ewg').combobox('setValue', getRow_ewg.channelId);
    $('#ipt_checkChannel_ewg').combobox('setText', getRow_ewg.channelName);
    $('#ipt_checkRoomType_ewg').combobox('setValue', getRow_ewg.roomtypeName);
    $('#ipt_checkRoomNumber_ewg').numberspinner('setValue', getRow_ewg.roomNumber);
    $('#ipt_checkInType_ewg').combobox('setValue', getRow_ewg.checkinTypeChar);
    $('#ipt_checkInDate_ewg').datetimebox('setValue', getDate(getRow_ewg.expectedEnterTime));
    $('#ipt_stayDay_ewg').numberspinner('setValue', getRow_ewg.expectedStayNumber);
    $('#ipt_expectedRentAmount_ewg').numberbox('setValue', NP.divide(getRow_ewg.expectedRentAmount, 100));
    $('#ipt_reservePerson_ewg').textbox('setValue', getRow_ewg.reservePerson);
    $('#ipt_reserveMobile_ewg').numberbox('setValue', getRow_ewg.reserveMobile);

    var showEditEarlyWarningGuestInfo_dialog = $('#div');
    showEditEarlyWarningGuestInfo_dialog.dialog({
      title: '编辑订单',
      width: 350,
      height: 420,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler: function () {
            var ipt_checkRoomType = $('#ipt_checkRoomType_ewg');
            //房间类型转化到后台
            var edit_roomtypeId = ipt_checkRoomType.combobox('getValue');//房型id
            $.each(eapor.data.roomtypeObj, function (i, item) {
              if (edit_roomtypeId == item.roomtypeName) {
                edit_roomtypeId = item.roomtypeId;
                return;
              }
            })

            if ($('#ipt_checkInType_ewg').combobox('getValue') == "全日房") {
              $('#ipt_checkInType_ewg').combobox('setValue', 1);
            } else if ($('#ipt_checkInType_ewg').combobox('getValue') == "钟点房") {
              $('#ipt_checkInType_ewg').combobox('setValue', 2);
            } else if ($('#ipt_checkInType_ewg').combobox('getValue') == "晚房") {
              $('#ipt_checkInType_ewg').combobox('setValue', 3);
            }
            var edit_checkinType = $('#ipt_checkInType_ewg').combobox('getValue');//入住方式   1全日房  2终点房  3晚房

            var editOrder_Data = {};
            editOrder_Data.reserveDetailId = 1 * (getRow_ewg.reserveDetailId);
            editOrder_Data.channelId = 1 * ($('#ipt_checkChannel_ewg').combobox('getValue'));
            editOrder_Data.roomtypeId = 1 * (edit_roomtypeId);
            editOrder_Data.roomNumber = 1 * ($('#ipt_checkRoomNumber_ewg').numberspinner('getValue'));
            editOrder_Data.sourceGroupId = 1 * (getRow_ewg.sourceGroupId);
            editOrder_Data.checkinType = 1 * (edit_checkinType);
            editOrder_Data.expectedEnterTime = $('#ipt_checkInDate_ewg').datetimebox('getValue');
            editOrder_Data.expectedStayNumber = 1 * ($('#ipt_stayDay_ewg').numberspinner('getValue'));
            editOrder_Data.expectedRentAmount = ($('#ipt_expectedRentAmount_ewg').numberbox('getValue') * 100).toFixed(0);
            editOrder_Data.reservePerson = $('#ipt_reservePerson_ewg').textbox('getValue');
            editOrder_Data.reserveMobile = $('#ipt_reserveMobile_ewg').numberbox('getValue');

            console.info(editOrder_Data);
            $.ajax({
              type: 'post',
              url: '../reserve/editReservedetail',
              data: editOrder_Data,
              dataType: "json",
              success: function (data) {
                console.info(data);
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                if (data > 0) {
                  pubjsonfirst_ewg = {};
                  $('#tab_earlywarningguest').datagrid("options").loader = firstloader_ewg;
                  $("#tab_earlywarningguest").datagrid("reload");
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });
              }
            });
            showEditEarlyWarningGuestInfo_dialog.dialog('close');
          }
        }, {
          text: '取消',
          handler: function () {
            showEditEarlyWarningGuestInfo_dialog.dialog('close');
          }
        }]
    })
  });
  //开房按钮
  $('#openRoom_btn_ewg').click(function () {
    var getSelected = $('#tab_earlywarningguest').datagrid('getSelected');
    //选中订单
    if (!getSelected || getSelected.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择订单！', timeout: 2000, showType: 'slide' });
      return;
    }
    //$('#index_roomOpenData').val(JSON.stringify(getSelected));
    $('#openRoomData').val(JSON.stringify(getSelected));
    if ($('#kzmaintable').tabs('exists', '开房')) {
      $('#kzmaintable').tabs('close', '开房');
      $('#kzmaintable').tabs('add', {
        title: '开房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/room_open.jsp'
      });
    } else {
      $('#kzmaintable').tabs('add', {
        title: '开房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/room_open.jsp'
      });
    }
  });
  //解除按钮
  $('#remove_btn_ewg').click(function () {
    var getRemoveObj = $('#tab_earlywarningguest').datagrid('getSelected');
    if (!getRemoveObj || getRemoveObj.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择订单！', timeout: 2000, showType: 'slide' });
      return;
    }
    var toDBReserveDetailId = getRemoveObj.reserveDetailId;
    $.ajax({
      type: 'post',
      url: '../reserve/changeReserveState',
      data: { reserveState: 2, reserveDetailId: toDBReserveDetailId },
      dataType: 'json',
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          return;
        }
        if (data > 0) {
          pubjsonfirst_ewg = {};
          $('#tab_earlywarningguest').datagrid("options").loader = firstloader_ewg;
          $("#tab_earlywarningguest").datagrid("reload");
          $.messager.show({ title: '系统提示', msg: '解除修改成功！', timeout: 2000, showType: 'slide' });
          return;
        }
        $.messager.show({ title: '系统提示', msg: '解除修改失败！', timeout: 2000, showType: 'slide' });
      }
    })
  });
  //失约按钮
  $('#miss_btn_ewg').click(function () {
    var getRemoveObj = $('#tab_earlywarningguest').datagrid('getSelected');
    if (!getRemoveObj || getRemoveObj.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择订单！', timeout: 2000, showType: 'slide' });
      return;
    }
    var toDBReserveDetailId = getRemoveObj.reserveDetailId;
    $.ajax({
      type: 'post',
      url: '../reserve/changeReserveState',
      data: { reserveState: 3, reserveDetailId: toDBReserveDetailId },
      dataType: 'json',
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          return;
        }
        if (data > 0) {
          pubjsonfirst_ewg = {};
          $('#tab_earlywarningguest').datagrid("options").loader = firstloader_ewg;
          $("#tab_earlywarningguest").datagrid("reload");
          $.messager.show({ title: '系统提示', msg: '失约修改成功！', timeout: 2000, showType: 'slide' });
          return;
        }
        $.messager.show({ title: '系统提示', msg: '失约修改失败！', timeout: 2000, showType: 'slide' });
      }
    })
  });
  //搜索按钮
  $('#search_btn_ewg').click(function () {
    if (!$('#ipt_guestPhone_ewg').numberbox('isValid')) {
      $('#ipt_guestPhone_ewg').numberbox('textbox').focus();
      return;
    }
    getGuestName_ewg = $('#ipt_guestName_ewg').textbox('getValue');
    getGuestPhone_ewg = $('#ipt_guestPhone_ewg').numberbox('getValue');
    $('#tab_earlywarningguest').datagrid("options").loader = searchloader_ewg;
    $("#tab_earlywarningguest").datagrid("reload");
  });
})();