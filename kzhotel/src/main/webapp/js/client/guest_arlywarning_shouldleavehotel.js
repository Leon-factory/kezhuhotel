//--------宾客应离店预警JS------
~(function () {
  "use strict";
  $('#roomCode_gas').textbox({});
  var firstLoaderArray_gas = [],//初始loader
    roomCode_searchGAS = "";//搜索loader

  function firstLoader_gas(param, success, error) {
    if (!$.isEmptyObject(firstLoaderArray_gas)) {
      success(firstLoaderArray_gas);
      return true;
    }
    $.ajax({
      url: "../guest/selectLeaveRentAlert",
      type: "post",
      dataType: "json",
      data: { roomCode: "" },
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        firstLoaderArray_gas = data;
        success(firstLoaderArray_gas);
      },
      error: function (err) {
        alert(err);
      }
    });
  };

  function searchLoader_gas(param, success, error) {
    console.info(roomCode_searchGAS);
    $.ajax({
      url: "../guest/selectLeaveRentAlert",
      type: "post",
      data: { roomCode: roomCode_searchGAS },
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_guestarlywarningshouldleavehotel').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#tab_guestarlywarningshouldleavehotel').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_guestarlywarningshouldleavehotel').datagrid('loadData', { total: 0, rows: [] });
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
  $('#gasl_continueRoom').on('click', function () {
    gasl_continueRoomClick();
  });
  //续住按钮
  function gasl_continueRoomClick() {
    var roomData = $('#tab_guestarlywarningshouldleavehotel').datagrid('getSelected');
    if (!roomData || roomData.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择房间！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      $('#continueRoomData').val(JSON.stringify(roomData));
      if ($('#kzmaintable').tabs('exists', '续房')) {
        $('#kzmaintable').tabs('select', '续房');
      } else {
        $('#kzmaintable').tabs('add', {
          title: '续房',
          closable: true,
          plain: false,
          border: false,
          href: '../client/continue_room.jsp'
        });
      }
    }
  }
  // 退房并结账按钮
  $('#gasl_exitRoomAndGetBillClick').on('click', function () {
    gasl_exitRoomClick();
  });
  // 退房
  $('#gasl_exitRoom').on('click', function () {
    gasl_exitRoomClick();
  });
  /*退房按钮*/
  function gasl_exitRoomClick() {
    var roomData = $('#tab_guestarlywarningshouldleavehotel').datagrid('getSelected');
    if (!roomData || roomData.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      eapor.data.GuestShouldLeaveJSPToExitRoomJSP = JSON.stringify(roomData);
      if ($('#kzmaintable').tabs('exists', '退房')) {
        $.messager.confirm('系统提示', '退房页面已打开，请确认是否已保存！是否继续跳转？', function (r) {
          if (r) {
            $('#kzmaintable').tabs('close', '退房');
            $('#kzmaintable').tabs('add', {
              title: '退房',
              closable: true,
              plain: false,
              border: false,
              href: '../client/exit_room.jsp'
            });
          }
        });
      } else {
        $('#kzmaintable').tabs('add', {
          title: '退房',
          closable: true,
          plain: false,
          border: false,
          href: '../client/exit_room.jsp'
        });
      }
    }
  };

  $('#tab_guestarlywarningshouldleavehotel').datagrid({
    title: '预离宾客列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    striped: true,//隔行变色
    singleSelect: true,
    fit: true,
    rownumbers: true,
    loader: firstLoader_gas,
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_guestarlywarningshouldleavehotel', 'roomCode', 6, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
      $('a[name="toGuestBillJSP_gas"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        toGuestBillJSP_gas(row_);
      });
      $('a[name="livingGuestJSP_gas"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        livingGuestJSP_gas(row_);
      });
    },
    columns: [[
      { field: 'receptionId', title: 'receptionId', width: 20, hidden: true },
      { field: 'roomtypeId', title: 'roomtypeId', width: 20, hidden: true },
      { field: 'roomtypeName', title: 'roomtypeName', width: 20, hidden: true },

      { field: 'roomCode', title: '房号', align: 'center', width: 20 },
      {
        field: 'enterTime', title: '入住时间', align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: '计划退房时间', align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'balance', title: 'balance', align: 'center', width: 20,
        formatter: function (value) {
          return value / -100 + " 元";
        }
      },
      { field: 'cardcount', title: '发出房卡数', align: 'center', width: 20 },
      {
        field: 'link', title: '链接', align: 'center', width: 40,
        formatter: function (value, row, index) {
          let row_ = JSON.stringify(row);
          return `<a name='toGuestBillJSP_gas' data-val='${row_}' class='dryColor' style='cursor:pointer;' >[宾客账单] </a>
        				<a name='livingGuestJSP_gas' data-val='${row_}' class='dryColor' style='cursor:pointer;' > [在住宾客]</a>`;
        }
      }
    ]]
  });
  function toGuestBillJSP_gas(row_) {
    let rows = JSON.parse(row_);
    if ($('#kzmaintable').tabs('exists', '宾客账单')) {
      $.messager.confirm('系统提示', '宾客账单页面已打开，是否继续跳转到宾客账单页面？', function (r) {
        if (r) {
          $('#kzmaintable').tabs('close', '宾客账单');
          eapor.data.exitRoomAndGetBill = JSON.stringify(rows);
          $('#kzmaintable').tabs('add', {
            title: '宾客账单',
            closable: true,
            plain: false,
            border: false,
            href: '../client/get_bill.jsp'
          });
        }
      });
    } else {
      eapor.data.exitRoomAndGetBill = JSON.stringify(rows);
      $('#kzmaintable').tabs('add', {
        title: '宾客账单',
        closable: true,
        plain: false,
        border: false,
        href: '../client/get_bill.jsp'
      });
    }
  }
  //显示在住宾客信息按钮回调函数
  function showGuestInfoCallback_gas(result) {
    console.info(result);
    eapor.clickFlag = true;
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#showGuestInfoHiddenDiv_gas').append(
      `<div id="div">
					<table id="appendTab"></table>
				</div>`
    );
    $('#appendTab').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: false,
      fit: true,
      data: result,
      rownumbers: true,
      columns: [[
        { field: 'roomCode', width: 20, title: '房间号', align: 'center' },
        { field: 'guestName', width: 20, align: 'center', title: '客人姓名' },
        {
          field: 'certificateType', width: 18, align: 'center', title: '证件类型',
          formatter: function (value, row, index) {
            $.each(eapor.hotel.certificateTypeObj, function (i, item) {
              if (value == item.certificate_type_code) {
                value = item.certificate_type_name;
                return;
              }
            });
            return value;
          }
        },
        { field: 'certificateCode', align: 'center', width: 35, title: '证件号码' },
        { field: 'phone', width: 25, align: 'center', title: '联系电话' }
      ]]
    });

    $('#div').dialog({
      title: '在住宾客信息',
      width: 600,
      height: 300,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  }
  //显示在住宾客信息按钮
  function livingGuestJSP_gas(row_) {
    let rows = JSON.parse(row_);
    console.info(rows);
    if (eapor.clickFlag != true) {
      return;
    }
    eapor.clickFlag = false;
    //eapor.utils.defaultAjax("../rent/listRentByReceptionId",{receptionId:rows.receptionId,livingStates:"1"},showGuestInfoCallback_gas);
    eapor.utils.defaultAjax("../guest/getLivingGuestByReceptionIdAndRoomId", { receptionId: rows.receptionId, roomId: rows.roomId }, showGuestInfoCallback_gas);
  }
  //搜索btn
  $('#search_gas').click(function () {
    roomCode_searchGAS = $('#roomCode_gas').textbox('getValue');
    $('#tab_guestarlywarningshouldleavehotel').datagrid('options').loader = searchLoader_gas;
    $('#tab_guestarlywarningshouldleavehotel').datagrid('reload');
  });

})();