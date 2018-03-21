/**
 *@JSname:预订查询
 */
~(function () {
  "use strict";
  //eapor.utils.layoutHeightSetAuto("layout_scheduledInquire");
  var d_inquire = new Date().getTime();
  $('#hidden_setHrefIdTime').val(d_inquire);//将值存首页，以便开房页href到该页面能取到ID

  var id1 = $('#tab_scheduledInquire').attr('id'),
    id2 = $('#ipt_startTime').attr('id'),
    id3 = $('#ipt_stopTime').attr('id'),
    id4 = $('#statusSearch').attr('id'),
    id5 = $('#search_scheduledInquire').attr('id'),
    id6 = $('#searchEfectiive_scheduledInquire').attr('id'),
    id7 = $('#history_scheduledInquire').attr('id'),
    id8 = $('#northDiv_scheduledInquire').attr('id');

  $('#tab_scheduledInquire').attr('id', id1 + d_inquire);
  $('#ipt_startTime').attr('id', id2 + d_inquire);
  $('#ipt_stopTime').attr('id', id3 + d_inquire);
  $('#statusSearch').attr('id', id4 + d_inquire);
  $('#search_scheduledInquire').attr('id', id5 + d_inquire);
  $('#searchEfectiive_scheduledInquire').attr('id', id6 + d_inquire);
  $('#history_scheduledInquire').attr('id', id7 + d_inquire);
  $('#northDiv_scheduledInquire').attr('id', id8 + d_inquire);

  var nowStartTime = getTimeForTodayStart(),//得到今日起始时间 yyyy-mm-dd 00:00:00
    nowEndTime = getTimeForTodayEnd();//得到今日结束时间 yyyy-mm-dd 23:59:59

  var pubjsonfirst_scheduledInquire = [];

  if ($('#hidden_setHref').val() == 1) {
    pubjsonfirst_scheduledInquire = [1];
    $('#northDiv_scheduledInquire' + d_inquire).css('display', 'none');
    nowEndTime = "";
  }

  var firstloader_scheduledInquire = function (param, success, error) {
    if ($.isEmptyObject(pubjsonfirst_scheduledInquire)) {
      success(pubjsonfirst_scheduledInquire);
      return true;
    }

    $.ajax({
      url: '../persevere/paymentAndReserveDetail',
      data: {
        reserveStates: '1', reservePerson: '', reserveMobile: '',
        starttime: nowStartTime, stoptime: nowEndTime, offset: 0, limit: 9999
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        pubjsonfirst_scheduledInquire = data;
        success(data);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  //搜索loader函数
  var reserveStates = "234",//状态  1有效  2解除  3失约  4入住
    reservePerson = "",//查询预定人姓名，""为全部
    reserveMobile = "",//查询预定人手机，""为全部
    startTime = "",//起始时间，null为不限定
    stopTime = "",//结束时间，null为不限定
    limit = 9999999,
    offset = 0;

  var searchloader_scheduledInquire = function (param, success, error) {
    console.info(reserveStates);
    console.info(reservePerson);
    console.info(reserveMobile);
    console.info(startTime);
    console.info(stopTime);
    console.info(offset);
    console.info(limit);
    $.ajax({
      url: '../persevere/paymentAndReserveDetail',
      data: {
        reserveStates: reserveStates, reservePerson: reservePerson, reserveMobile: reserveMobile,
        starttime: startTime, stoptime: stopTime, offset: offset, limit: limit
      },
      type: "post",
      dataType: "json",
      success: function (data) {

        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_scheduledInquire' + d_inquire).datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          //清空数据
          $('#tab_scheduledInquire' + d_inquire).datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_scheduledInquire' + d_inquire).datagrid('loadData', { total: 0, rows: [] });
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

  $('#tab_scheduledInquire' + d_inquire).datagrid({
    title: '订单', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fit: true,
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fitColumns: true,//防止水平滚动
    rownumbers: true,
    loader: firstloader_scheduledInquire,
    onLoadSuccess: function (value) {
      $('#hidden_setHref').val("");//加载成功，清空开房页预订单按钮设置的flag
    },
    columns: [[
      { field: 'reserveCode', title: '订单号', width: 10, align: 'center', hidden: true },
      { field: 'reserveDetailId', title: 'reserveDetailId', width: 10, align: 'center', hidden: true },
      { field: 'checkinType', title: 'checkinType', width: 10, align: 'center', hidden: true },
      { field: 'sourceGroupId', title: 'sourceGroupId', width: 10, align: 'center', hidden: true },
      { field: 'channelId', title: 'channelId', width: 10, align: 'center', hidden: true },
      { field: 'itemIndex', title: 'itemIndex', width: 10, hidden: true },

      { field: 'roomtypeName', title: '房型', width: 20, align: 'center' },
      { field: 'roomNumber', title: '房间数', width: 12, align: 'center' },
      { field: 'channelName', title: '客源', width: 18, align: 'center' },
      { field: 'checkinTypeChar', title: '入住类型', width: 18, align: 'center' },
      { field: 'expectedEnterTime', title: '计划到店日期时间', width: 36, align: 'center', formatter: function (value, row, index) { return getDate(value) } },
      {
        field: 'expectedStayNumber', title: '计划居住', width: 15, align: 'center',
        formatter: function (value, row, index) {
          if (row.checkinType == 2) {//钟点房
            return value + JSON.parse($('#index_ruleData').val()).restRoomUnit;
          } else if (row.checkinType == 1) {//全日房
            return value + JSON.parse($('#index_ruleData').val()).dayRoomUnit;
          } else {
            return value + JSON.parse($('#index_ruleData').val()).lateRoomUnit;
          }
        }
      },
      {
        field: 'expectedRentAmount', title: '房费', width: 14, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      { field: 'reservePerson', title: '预订人姓名', width: 18, align: 'center' },
      { field: 'reserveMobile', title: '联系手机', width: 25, align: 'center' },
      {
        field: 'paymethodId', title: '支付方式', width: 30, align: 'center',
        formatter: function (value, row) {
          if (row.amount > 0) {
            if (value == 5) {
              return "代收（" + row.creaditChannelName + "）";
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
        field: 'amount', title: '支付金额', width: 16, align: 'center',
        formatter: function (value) {
          if (value > 0) {
            return NP.divide(value, 100) + "元";
          } else {
            return "";
          }

        }
      },
      {
        field: 'reserveState', title: '订单状态', width: 15, align: 'center',
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
      { field: 'remark', title: '备注', width: 20, align: 'center' }
    ]]
  });
  //搜索
  $('#search_scheduledInquire' + d_inquire).click(function () {
    var setStartTime = $('#ipt_startTime' + d_inquire).datebox('getValue');
    var setStopTime = $('#ipt_stopTime' + d_inquire).datebox('getValue');
    var statusSearch = $('#statusSearch' + d_inquire).combobox('getValue');
    if (statusSearch == "") {
      $.messager.show({
        title: '系统提示', msg: '请选择状态！', timeout: 2000, showType: 'slide'
      });
      return;
    }
    reserveStates = statusSearch;//状态  1有效  2解除  3失约  4入住
    reservePerson = "";//查询预定人姓名，""为全部
    reserveMobile = "";//查询预定人手机，""为全部
    startTime = setStartTime;//起始时间，null为不限定
    stopTime = setStopTime;//结束时间，null为不限定
    offset = 0;
    limit = 9999999;
    $('#tab_scheduledInquire' + d_inquire).datagrid("options").loader = searchloader_scheduledInquire;
    $("#tab_scheduledInquire" + d_inquire).datagrid("reload");
  });
  //当前有效订单查询
  $('#searchEfectiive_scheduledInquire' + d_inquire).click(function () {

    reserveStates = "1";//状态  1有效  2解除  3失约  4入住
    reservePerson = "";//查询预定人姓名，""为全部
    reserveMobile = "";//查询预定人手机，""为全部
    startTime = "";//起始时间，null为不限定
    stopTime = "";//结束时间，null为不限定
    offset = 0;
    limit = 9999999;
    $('#tab_scheduledInquire' + d_inquire).datagrid("options").loader = searchloader_scheduledInquire;
    $("#tab_scheduledInquire" + d_inquire).datagrid("reload");
  });
  //历史订单查询
  $('#history_scheduledInquire' + d_inquire).click(function () {

    reserveStates = "234";//状态  1有效  2解除  3失约  4入住
    reservePerson = "";//查询预定人姓名，""为全部
    reserveMobile = "";//查询预定人手机，""为全部
    startTime = "";//起始时间，null为不限定
    stopTime = "";//结束时间，null为不限定
    offset = 0;
    limit = 9999999;
    $('#tab_scheduledInquire' + d_inquire).datagrid("options").loader = searchloader_scheduledInquire;
    $("#tab_scheduledInquire" + d_inquire).datagrid("reload");
  });
})();