//-------宾客押金预警--------
~(function () {
  "use strict";
  var firstLoaderArray_gwd = [];
  var firstLoader_gwd = function (param, success, error) {
    if (!$.isEmptyObject(firstLoaderArray_gwd)) {
      success(firstLoaderArray_gwd);
      return true;
    }
    $.ajax({
      url: "../persevere/getLowBalanceList",
      type: "post",
      dataType: "json",
      data: { roomCode: "", guestName: "" },
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
        firstLoaderArray_gwd = data;
        success(firstLoaderArray_gwd);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  //搜索loader
  var roomCode_searchGWD = "";
  var guestName_searchGWD = "";

  var searchLoader_gwd = function (param, success, error) {
    $.ajax({
      url: "../persevere/getLowBalanceList",
      type: "post",
      data: { roomCode: roomCode_searchGWD, guestName: guestName_searchGWD },
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#guest_warning_deposit').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        if (typeof (data) === "object" && data === null) {
          $.messager.show({
            title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide', height: 'auto'
          });
          $('#guest_warning_deposit').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $.messager.show({
            title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide', height: 'auto'
          });
          $('#guest_warning_deposit').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $.messager.show({
            title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide', height: 'auto'
          });
          $('#guest_warning_deposit').datagrid('loadData', { total: 0, rows: [] });
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

  $('#gwd_exitRoom').on('click', function () {
    gwd_exitRoom();
  });
  /*退房按钮*/
  function gwd_exitRoom() {
    var gwdSelected = $('#guest_warning_deposit').datagrid('getSelected');
    if (!gwdSelected || gwdSelected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#exitRoomData').val(JSON.stringify(gwdSelected));
    if ($('#kzmaintable').tabs('exists', '退房')) {
      $('#kzmaintable').tabs('close', '退房');
      $('#kzmaintable').tabs('add', {
        title: '退房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/exit_room.jsp'
      });
      return;
    }
    $('#kzmaintable').tabs('add', {
      title: '退房',
      closable: true,
      plain: false,
      border: false,
      href: '../client/exit_room.jsp'
    });
  }

  $('#gwd_continueRoom').on('click', function () {
    gwd_continueRoom();
  });
  /*续房按钮*/
  function gwd_continueRoom() {
    var gwdSelected = $('#guest_warning_deposit').datagrid('getSelected');
    if (!gwdSelected || gwdSelected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#continueRoomData').val(JSON.stringify(gwdSelected));
    if ($('#kzmaintable').tabs('exists', '续房')) {
      $('#kzmaintable').tabs('close', '续房');
      $('#kzmaintable').tabs('add', {
        title: '续房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/continue_room.jsp'
      });
      return;
    }
    $('#kzmaintable').tabs('add', {
      title: '续房',
      closable: true,
      plain: false,
      border: false,
      href: '../client/continue_room.jsp'
    });
  };

  $('#guest_warning_deposit').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    loader: firstLoader_gwd,
    fit: true,
    rownumbers: true,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('guest_warning_deposit', 'receptionCode', 7, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
      $('a[name="consumeDetails_gwd"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        consumeDetails_gwd(row_);
      });
    },
    columns: [[{ field: 'receptionId', title: '宾客账单', width: 20, align: 'center', hidden: true },
    { field: 'debtAmount', title: 'debtAmount', width: 20, align: 'center', hidden: true },
    { field: 'freeAmount', title: 'freeAmount', width: 20, align: 'center', hidden: true },
    { field: 'signAmount', title: 'signAmount', width: 20, align: 'center', hidden: true },

    { field: 'receptionCode', title: '宾客账单', width: 35, align: 'center' },
    { field: 'guestName', title: '宾客姓名', width: 20, align: 'center' },
    { field: 'roomCode', title: '房号', width: 20, align: 'center' },
    {
      field: 'consumeAmount', title: '消费总金额', width: 20, align: 'center',
      formatter: function (value, row, index) {
        return value ? NP.divide(value, 100) + ' 元' : '--';
      }
    },
    {
      field: 'creditAmount', title: '宾客信用总额', width: 20, align: 'center',
      formatter: function (value) {
        return value ? NP.divide(value, 100) + ' 元' : '--';
      }
    },
    {
      field: 'balance', title: '押金Balance', width: 20, align: 'center',
      formatter: function (value, row, index) {
        return value ? NP.divide(value, 100) + ' 元' : '--';
      }
    },
    {
      field: 'deteils', title: '操作', width: 20, align: 'center',
      formatter: function (value, row, index) {
        let row_ = JSON.stringify(row);
        return row.consumeAmount ?
          `<a name='consumeDetails_gwd' data-val='${row_}'  class='dryColor' style='cursor:pointer;'>[详情]</a>`
          : "--";
      }
    }
    ]]
  });
  //账单打印
  $('#print_gwd').click(function () {
    var gwdSelected = $('#guest_warning_deposit').datagrid('getSelected');
    console.info(gwdSelected)
    if (!gwdSelected || gwdSelected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      pfunction(gwdSelected.receptionId, 0, gwdSelected.roomId, gwdSelected.guestId);
    }
  })
  //消费详情btn
  function consumeDetails_gwd(row_) {
    let value = JSON.parse(row_);
    $('#showDetailsDialog_gwa').append(
      '<div id="appendDiv_gwa">' +
      '<table id="tab_common_details_gwa"></table>' +
      '</div>'
    );
    $('#tab_common_details_gwa').datagrid({
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
      rownumbers: true,
      columns: [eapor.data.BillDetailsForDatagridColumns_common]
    })

    function getInfo_gwa_getBillCallBack(result) {
      var a = 0;
      var b = 0;
      var c = 0;
      var d = 0;
      var e = 0;
      var f = 0;
      //1 支付 2 消费 3 签单 4 坏账 5 免单 6 转出 7转入
      for (let i = 0; i < result.length; i++) {

        if (result[i].type == 1 && a == 0) {
          result[i].typename = "支付";
          //a = 1;
        }
        if (result[i].type == 2 && b == 0) {
          result[i].typename = "消费";
          //b = 1;
        }
        if (result[i].type == 3 && c == 0) {
          result[i].typename = "签单";
          //c = 1;
        }
        if (result[i].type == 4 && d == 0) {
          result[i].typename = "坏账";
          //d = 1;
        }
        if (result[i].type == 5 && e == 0) {
          result[i].typename = "免单";
          //e = 1;
        }
        if ((result[i].type == 6 || result[i].type == 7) && f == 0) {
          result[i].typename = "转出/转入";
          //f = 1;
        }
      }
      $('#tab_common_details_gwa').datagrid('loadData', result);
      $('#tab_common_details_gwa').datagrid('reload');
    }
    //显示明细
    eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId',
      { receptionId: value.receptionId }, getInfo_gwa_getBillCallBack);
    $('#appendDiv_gwa').dialog({
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
          $('#appendDiv_gwa').dialog('close');
        }
      }]
    })
  }
  //搜索btn
  $('#search_gwd').click(function () {
    roomCode_searchGWD = $('#roomCode_gwd').textbox('getValue');
    guestName_searchGWD = $('#guestName_gwd').textbox('getValue');
    $('#guest_warning_deposit').datagrid('options').loader = searchLoader_gwd;
    $('#guest_warning_deposit').datagrid('reload');
  })
})();