/**
 *@JSname:预抵宾客
 */
~(function () {
  "use strict";
  var getGuestName = "",
    getGuestPhone = "",
    pubjsonfirst_arrivalGuest = {},
    firstloader_arrivalGuest = function (param, success, error) {
      console.info(pubjsonfirst_arrivalGuest);
      if (!$.isEmptyObject(pubjsonfirst_arrivalGuest)) {
        success(pubjsonfirst_arrivalGuest);
        return true;
      }
      $.ajax({
        url: '../reserve/selectPreArrivalList',
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
          pubjsonfirst_arrivalGuest = data;

          success(data);
        }
        , error: function (err) {
          alert(err);
        }
      });
    },
    searchloader_arrivalGuest = function (param, success, error) {
      $.ajax({
        url: '../reserve/selectPreArrivalList',
        data: { reservePerson: getGuestName, reserveMobile: getGuestPhone },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_arrivalguest').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data);
          if (tmpjson == '[]') {
            $('#tab_arrivalguest').datagrid('loadData', { total: 0, rows: [] });
            $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 1800, showType: 'slide' });
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

  $('#tab_arrivalguest').datagrid({
    title: '订单', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    striped: true,//隔行变色
    fit: true,
    rownumbers: true,
    loader: firstloader_arrivalGuest,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_arrivalguest', 'roomtypeName', 14, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
    },
    columns: [[
      { field: 'sourceGroupId', title: 'sourceGroupId', align: 'center', width: 20, hidden: true },
      { field: 'checkinType', title: 'checkinType', align: 'center', width: 20, hidden: true },
      { field: 'itemIndex', title: 'itemIndex', align: 'center', width: 20, hidden: true },
      { field: 'reserveCode', title: 'reserveCode', align: 'center', width: 20, hidden: true },
      { field: 'reserveDetailId', title: 'reserveDetailId', align: 'center', width: 20, hidden: true },

      { field: 'roomtypeName', title: '房型', align: 'center', width: 20 },
      { field: 'roomNumber', title: '房间数', align: 'center', width: 20 },
      { field: 'channelId', title: '客源', align: 'center', width: 20 },
      { field: 'checkinTypeChar', title: '入住类型', align: 'center', width: 20 },
      {
        field: 'expectedEnterTime', title: '计划到店日期时间', align: 'center', width: 40,
        formatter: function (value, row, index) {
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
      { field: 'reservePerson', title: '预订人姓名', align: 'center', width: 15 },
      { field: 'reserveMobile', title: '联系手机', align: 'center', width: 15 },
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
        field: 'modifyTime', title: '编辑时间', align: 'center', width: 30,
        formatter: function (value) {
          return value < 0 ? "--" : getDate(value);
        }
      }
    ]]
  });
  //搜索按钮
  $('#searchBtn_arrival_guest').click(function () {
    if (!$('#ipt_phone_arrival_guest').numberbox('isValid')) {
      $('#ipt_phone_arrival_guest').numberbox('textbox').focus();
      return;
    }
    getGuestName = $('#ipt_name_arrival_guest').textbox('getValue');
    getGuestPhone = $('#ipt_phone_arrival_guest').numberbox('getValue');

    $('#tab_arrivalguest').datagrid("options").loader = searchloader_arrivalGuest;
    $("#tab_arrivalguest").datagrid("reload");
  });
  //转到开房页面按钮
  $('#openRoomBtn_arrival_guest').click(function () {
    var getSelected = $('#tab_arrivalguest').datagrid('getSelected');
    if (!getSelected || getSelected.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择订单！', timeout: 1800, showType: 'slide' });
      return;
    }
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
  //解除预订按钮
  $('#removeBtn_arrival_guest').click(function () {
    var getRemoveObj = $('#tab_arrivalguest').datagrid('getSelected');
    if (!getRemoveObj || getRemoveObj.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择订单！', timeout: 2800, showType: 'slide' });
      return;
    }
    var toDBReserveDetailId = getRemoveObj.reserveDetailId;
    var index = $('#tab_arrivalguest').datagrid('getRowIndex', getRemoveObj);
    console.info(index);
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
          $('#tab_arrivalguest').datagrid('deleteRow', index);
          $('#tab_arrivalguest').datagrid('reload');
          $.messager.show({ title: '系统提示', msg: '解除修改成功！', timeout: 2800, showType: 'slide' });
        } else {
          $.messager.show({ title: '系统提示', msg: '解除修改失败！', timeout: 2800, showType: 'slide' });
        }
      }
    });
  });
  //失约按钮
  $('#missBtn_arrival_guest').click(function () {
    var getRemoveObj = $('#tab_arrivalguest').datagrid('getSelected');
    if (!getRemoveObj || getRemoveObj.roomtypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择订单！', timeout: 1500, showType: 'slide' });
      return;
    }
    var toDBReserveDetailId = getRemoveObj.reserveDetailId;
    var index = $('#tab_arrivalguest').datagrid('getRowIndex', getRemoveObj);
    console.info(index);
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
          $('#tab_arrivalguest').datagrid('deleteRow', index);
          $('#tab_arrivalguest').datagrid('reload');
          $.messager.show({ title: '系统提示', msg: '失约修改成功！', timeout: 2800, showType: 'slide' });
        } else {
          $.messager.show({ title: '系统提示', msg: '失约修改失败！', timeout: 2800, showType: 'slide' });
        }
      }
    });
  });
})();