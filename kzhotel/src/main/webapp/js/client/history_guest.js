~(function (eapor) {
  "use strict";
  //-------历史宾客--------
  let historyGuestListArray = [],
    //搜索loader
    roomCode = "",
    guestName = undefined,
    beginTime = undefined,
    endTime = undefined;
  function historyGuestListLoader(param, success, error) {
    if (!$.isEmptyObject(historyGuestListArray)) {
      success(historyGuestListArray);
      return true;
    }
    $.ajax({
      url: "../persevere/getHistoryGuestInfo",
      type: "post",
      dataType: "json",
      data: { roomCode: "", guestName: "", beginTime: '1900-01-01 01:01:01', endTime: getNowFormatDate() },
      success: function (result) {
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          success([]);
          return;
        }
        if (result == "") {
          success([]);
          return true;
        }
        historyGuestListArray = result;
        success(historyGuestListArray);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  function searchHistoryGuestListLoader(param, success, error) {
    $.ajax({
      url: "../persevere/getHistoryGuestInfo",
      type: "post",
      data: {
        roomCode: roomCode,
        guestName: guestName,
        beginTime: beginTime,
        endTime: endTime
      },
      dataType: "json",
      success: function (result) {
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(result);
        if (tmpjson == "[]") {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (result == "") {
          $('#tab_history_guest').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        //如果不是用的list方法，这里给json前后加变成数组放入
        success(result);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  $('#tab_history_guest').datagrid({
    loader: historyGuestListLoader,
    title: '历史客人列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_history_guest', 'roomCode', 10, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
      $('a[name="consumeDetails_hg"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        consumeDetails_hg(row_);
      });
    },
    columns: [[

      { field: 'roomId', title: 'roomId', width: 20, align: 'center', hidden: true },
      { field: 'receptionId', title: 'receptionId', width: 20, align: 'center', hidden: true },
      {
        field: 'checkoutTime', title: '结账时间', width: 20, align: 'center', hidden: true,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },

      { field: 'roomCode', title: '房号', width: 10, align: 'center' },
      { field: 'guestName', title: '宾客姓名', width: 15, align: 'center' },
      {
        field: 'enterTime', title: '入住时间', width: 28, align: 'center',
        formatter: function (value, row, index) {
          return value ? getDate(value) : "--";
        }
      },
      {
        field: 'leaveTime', title: '退房时间', width: 28, align: 'center',
        formatter: function (value, row, index) {
          return value ? getDate(value) : "--";
        }
      },
      { field: 'phone', title: '手机号码', width: 20, align: 'center' },
      {
        field: 'certificateType', title: '证件类型', width: 15, align: 'center',
        formatter: function (value, row, index) {
          console.info(value);
          console.info(row);
          if (!row.certificateCode) {
            return '';
          } else {
            $.each(eapor.hotel.certificateTypeObj, function (i, item) {
              if (value == item.certificate_type_code) {
                value = item.certificate_type_name;
                return;
              }
            });
            return value;
          }
        }
      },
      { field: 'certificateCode', title: '证件号码', width: 25, align: 'center' },
      {
        field: 'consumeAmount', title: '消费总金额', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return value ? NP.divide(value, 100) + " 元" : "--";
        }
      },
      {
        field: 'paymentAmount', title: '宾客付款总额', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return value ? NP.divide(value, 100) + " 元" : "--";
        }
      },
      {
        field: 'details', title: '操作', width: 16, align: 'center',
        formatter: function (value, row, index) {
          row.checkoutTime = "";
          row.enterTime = "";
          row.leaveTime = "";
          let row_ = JSON.stringify(row);
          return row.consumeAmount ?
            `<a  name='consumeDetails_hg' data-val='${row_}'  class='dryColor' style='cursor:pointer;'>[详情]</a>` : "--";
        }
      }
    ]]
  });
  //宾客账单打印
  $('#print_hg').click(function () {
    var selected = $('#tab_history_guest').datagrid('getSelected');
    console.info(selected);
    if (!selected || selected.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择客单', timeout: 3000, showType: 'slide' });
      return;
    } else {
      pfunction(selected.receptionId, 0, selected.roomId, selected.guestId);
    }
  });
  //消费详情btn
  function consumeDetails_hg(row_) {
    console.info(row_);
    let rows = JSON.parse(row_);
    $('#showDetailsDialog_hg').append(
      '<div id="appendDiv_hg">' +
      '<table id="tab_common_details_hg"></table>' +
      '</div>'
    );
    $('#tab_common_details_hg').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      striped: true,
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      loadMsg: "loading....",
      //singleSelect:true,
      fit: true,
      rownumbers: true,
      columns: [eapor.data.BillDetailsForDatagridColumns_common]
    })

    function getInfo_hg_getBillCallBack(result) {
      let a = 0,
        b = 0,
        c = 0,
        d = 0,
        e = 0,
        f = 0;
      //1 支付 2 消费 3 签单 4 坏账 5 免单 6 转出 7转入
      for (let i = 0; i < result.length; i++) {

        if (result[i].type == 1 && a == 0) {
          result[i].typename = "支付";
        }
        if (result[i].type == 2 && b == 0) {
          result[i].typename = "消费";
        }
        if (result[i].type == 3 && c == 0) {
          result[i].typename = "签单";
        }
        if (result[i].type == 4 && d == 0) {
          result[i].typename = "坏账";
        }
        if (result[i].type == 5 && e == 0) {
          result[i].typename = "免单";
        }
        if ((result[i].type == 6 || result[i].type == 7) && f == 0) {
          result[i].typename = "转出/转入";
        }
      }
      $('#tab_common_details_hg').datagrid('loadData', result);
      $('#tab_common_details_hg').datagrid('reload');
    }
    //--------显示明细    start ---------------
    eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId',
      { receptionId: rows.receptionId }, getInfo_hg_getBillCallBack);
    $('#appendDiv_hg').dialog({
      title: '详情',
      width: 800,
      height: 400,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          $('#appendDiv_hg').dialog('close');
        }
      }]
    });
  }
  //搜索
  $('#searchBtn_history_guest').click(function () {
    roomCode = $('#ipt_roomCode_history_guest').textbox('getValue'),
      guestName = $('#ipt_guestName_history_guest').textbox('getValue'),
      beginTime = $('#ipt_timeStart_history_guest').datetimebox('getValue');
    if (beginTime == "") {
      beginTime = '1900-01-01 01:01:01';
    } else {
      beginTime = beginTime;
    }
    endTime = $('#ipt_timeEnd_history_guest').datetimebox('getValue');
    if (endTime == "") {
      endTime = getDate(getNowFormatDate());
    } else {
      endTime = endTime;
    }
    $('#tab_history_guest').datagrid("options").loader = searchHistoryGuestListLoader;
    $("#tab_history_guest").datagrid("reload");
  });
})(window.eapor);