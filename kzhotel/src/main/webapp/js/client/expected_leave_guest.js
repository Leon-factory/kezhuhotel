//-----预离宾客JS---------
~(function () {
  "use strict";
  var rowSelect_expectedleaveguest = null,
    onlySelectedOneRowFlag = 0;
  $('#tab_expectedleaveguest').datagrid({
    title: '预离宾客', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    rownumbers: true,
    url: '../guest/selectExpectedLeaveGuest',
    queryParams: { roomCode: '' },
    checkOnSelect: false,
    onClickRow: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag == 2) {
        onlySelectedOneRowFlag = 0;
        return;
      } else {
        onlySelectedOneRowFlag = 1;
      }
      let rows = $(this).datagrid('getChecked');
      let flag = true;
      for (let i = 0; i < rows.length; i++) {
        if (rowData == rows[i]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_expectedleaveguest = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_expectedleaveguest = null;
      }
      onlySelectedOneRowFlag = 0;
    },
    onCheck: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag == 2) {
        return;
      }
      if (onlySelectedOneRowFlag == 1) {
        onlySelectedOneRowFlag = 0;
        return;
      } else {
        onlySelectedOneRowFlag = 2;
      }
      if (rowData != rowSelect_expectedleaveguest) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_expectedleaveguest = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_expectedleaveguest = null;
      }
      onlySelectedOneRowFlag = 0;
    },
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_expectedleaveguest', 'roomCode', 6, 0);
        $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      $('a[name="gotoGetBillJSP_expectedleaveguest"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        gotoGetBillJSP_expectedleaveguest(row_);
      });
      $('a[name="showGuestInfo_expectedleaveguest"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        showGuestInfo_expectedleaveguest(row_);
      });
    },
    columns: [[
      { field: 'receptionId', title: 'receptionId', width: 20, align: 'center', hidden: true },
      { field: 'roomtypeId', title: 'roomtypeId', width: 20, align: 'center', hidden: true },
      { field: 'roomtypeName', title: 'roomtypeName', width: 20, align: 'center', hidden: true },

      { field: 'ck', title: '', checkbox: true },
      { field: 'roomCode', title: '房号', width: 20, align: 'center' },
      {
        field: 'enterTime', title: '入住时间', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: '计划退房时间', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'balance', title: '押金Balance', width: 20, align: 'center',
        formatter: function (value, row, index) {
          return value ? value / -100 : value;
        }
      },
      { field: 'cardcount', title: '发出房卡数', width: 15, align: 'center' },
      {
        field: 'id', title: '链接', width: 40, align: 'center',
        formatter: function (value, row, index) {
          let row_ = JSON.stringify(row);
          return `<a name='gotoGetBillJSP_expectedleaveguest' data-val='${row_}' class='dryColor' style='cursor:pointer;'>[宾客账簿链接] </a>
			        				<a name='showGuestInfo_expectedleaveguest' data-val='${row_}' class='dryColor' style='cursor:pointer;'> [在住宾客链接]</a>`;
        }
      }
    ]]
  });
  //跳转到宾客账单按钮
  function gotoGetBillJSP_expectedleaveguest(row_) {
    let row = JSON.parse(row_);
    console.info(row);
    if ($('#kzmaintable').tabs('exists', '宾客账单')) {
      $.messager.confirm('系统提示', '宾客账单页面已打开，是否继续跳转到宾客账单页面？', function (r) {
        if (r) {
          $('#kzmaintable').tabs('close', '宾客账单');
          eapor.data.exitRoomAndGetBill = JSON.stringify(row);
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
      eapor.data.exitRoomAndGetBill = JSON.stringify(row);
      $('#kzmaintable').tabs('add', {
        title: '宾客账单',
        closable: true,
        plain: false,
        border: false,
        href: '../client/get_bill.jsp'
      });
    }
  };
  function showGuestInfoCallback_expectedleaveguest(result) {
    console.info(result);
    eapor.clickFlag = true;
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#showGuestInfoHiddenDiv').append(
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
        { field: 'receptionId', width: 20, title: 'receptionId', align: 'center', hidden: true },
        { field: 'identityCardNumber', width: 20, title: 'identityCardNumber', align: 'center', hidden: true },
        { field: 'groupCode', width: 20, title: 'groupCode', align: 'center', hidden: true },
        { field: 'receptionGuestId', width: 20, title: 'receptionGuestId', align: 'center', hidden: true },
        { field: 'roomId', width: 20, title: 'roomId', align: 'center', hidden: true },
        { field: 'sexCode', width: 20, title: 'sexCode', align: 'center', hidden: true },
        { field: 'isPrimary', width: 20, title: 'isPrimary', align: 'center', hidden: true },
        { field: 'guestId', width: 20, title: 'guestId', align: 'center', hidden: true },
        { field: 'email', width: 20, title: 'email', align: 'center', hidden: true },
        { field: 'channelId', width: 20, title: 'channelId', align: 'center', hidden: true },

        { field: 'roomCode', width: 20, title: '房间号', align: 'center' },
        { field: 'guestName', width: 20, align: 'center', title: '客人姓名' },
        {
          field: 'certificateType', width: 20, align: 'center', title: '证件类型',
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
        { field: 'certificateCode', align: 'center', width: 30, title: '证件号码' },
        { field: 'phone', width: 25, align: 'center', title: '联系电话' }
      ]]
    });

    $('#div').dialog({
      title: '在住宾客信息',
      width: 700,
      height: 350,
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
  };
  //显示在住宾客信息按钮
  function showGuestInfo_expectedleaveguest(row_) {
    let row = JSON.parse(row_);
    console.info(row);
    if (eapor.clickFlag != true) {
      return;
    }
    eapor.clickFlag = false;
    eapor.utils.defaultAjax("../guest/getLivingGuestByReceptionIdAndRoomId", { receptionId: row.receptionId, roomId: row.roomId }, showGuestInfoCallback_expectedleaveguest);
  }
  //搜索按钮
  $('#searchExpectedLeaveGuestByRoomId').click(function () {
    $('#tab_expectedleaveguest').datagrid('load', {
      roomCode: $('#ipt_roomId_expectedLeaveGuest').val()
    });
  });
  //退房并结账按钮
  $('#btn_exitroomAndGetBill').click(function () {
    var rowSelected = $('#tab_expectedleaveguest').datagrid('getSelected');
    if (!rowSelected || rowSelected.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      //var roomCodeSelected = $('#tab_expectedleaveguest').datagrid('getSelected').roomCode;
      if ($('#kzmaintable').tabs('exists', '退房')) {
        $.messager.confirm('系统提示', '退房页面已打开，是否继续跳转到退房页面？', function (r) {
          if (r) {
            $('#kzmaintable').tabs('close', '退房');
            $('#exitRoomData').val(JSON.stringify(rowSelected));
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
        $('#exitRoomData').val(JSON.stringify(rowSelected));
        $('#kzmaintable').tabs('add', {
          title: '退房',
          closable: true,
          plain: false,
          border: false,
          href: '../client/exit_room.jsp'
        });
      }
    }
  });
  //退房
  $('#btn_exitroom').click(function () {
    var rowSelected = $('#tab_expectedleaveguest').datagrid('getSelected');
    if (!rowSelected || rowSelected.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      //var roomCodeSelected = $('#tab_expectedleaveguest').datagrid('getSelected').roomCode;
      if ($('#kzmaintable').tabs('exists', '退房')) {
        $.messager.confirm('系统提示', '退房页面已打开，是否继续跳转到退房页面？', function (r) {
          if (r) {
            $('#kzmaintable').tabs('close', '退房');
            $('#exitRoomData').val(JSON.stringify(rowSelected));
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
        $('#exitRoomData').val(JSON.stringify(rowSelected));
        $('#kzmaintable').tabs('add', {
          title: '退房',
          closable: true,
          plain: false,
          border: false,
          href: '../client/exit_room.jsp'
        });
      }
    }
  });
  //续房
  $('#btn_continue').click(function () {
    var rowSelected = $('#tab_expectedleaveguest').datagrid('getSelected');
    if (!rowSelected || rowSelected.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择房间!', timeout: 2000, showType: 'slide' });
      return;
    } else {
      if ($('#kzmaintable').tabs('exists', '续房')) {
        $.messager.confirm('系统提示', '续房页面已打开，是否继续跳转到续房页面？', function (r) {
          if (r) {
            $('#kzmaintable').tabs('close', '续房');
            $('#continueRoomData').val(JSON.stringify(rowSelected));
            $('#kzmaintable').tabs('add', {
              title: '续房',
              closable: true,
              plain: false,
              border: false,
              href: '../client/continue_room.jsp'
            });
          }
        });
      } else {
        $('#continueRoomData').val(JSON.stringify(rowSelected));
        $('#kzmaintable').tabs('add', {
          title: '续房',
          closable: true,
          plain: false,
          border: false,
          href: '../client/continue_room.jsp'
        });
      }
    }
  });
})();