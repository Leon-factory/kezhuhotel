/**
 * @jsname:包价早餐
 */

~(function () {
  "use strict";
  let searchFlag = false;
  //初始化
  $('#roomCode_packageBreakfast').textbox({});

  $('#tab_packageBreakfast').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    //rownumbers : true,
    fit: true,
    onLoadSuccess(data) {
      if (data.rows.length == 0) {
        $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 3000, showType: 'slide' });
        return;
      }
    },
    columns: [[
      { field: 'roomId', title: "roomId", width: 15, align: 'center', hidden: true },

      { field: 'guestName', title: "宾客姓名", width: 20, align: 'center' },
      { field: 'enterTime', title: "登记时间", width: 25, align: 'center' },
      { field: 'expectedLeaveTime', title: "预计离店", width: 25, align: 'center' },
      { field: 'roomCode', title: "房号", width: 15, align: 'center' },
      { field: 'breakfastCount', title: "包价早餐数量", width: 15, align: 'center' },
      { field: 'todayCount', title: "今日已用", width: 12, align: 'center' }
    ]]
  });
  //读房卡
  $('#readRoomCard_packageBreakfast').on('click', function () {
    $('#ifid4').attr('src', eapor.createCard.hrefUrl_open4);
    var logoutData_inquiry = {}, logout = {};
    logoutData_inquiry.comCode = $('#indexmd5').val(); //通讯号
    if (eapor.data.index_eventCode != "") {
      logoutData_inquiry.eventCode = eapor.data.index_eventCode;
      eapor.createCard.hrefUrl_open4 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(3)) + "," + eapor.data.index_eventCode;
    } else {
      logout = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
      logoutData_inquiry.eventCode = logout;
      eapor.createCard.hrefUrl_open4 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(3)) + "," + logout;
    }
    console.info(logoutData_inquiry);
    $('#ifid4').attr('src', eapor.createCard.hrefUrl_open4);
    function logoutCallBack(result) {
      console.info(result);
    };
    eapor.utils.defaultAjax('../lock/readCardFirst', logoutData_inquiry, logoutCallBack);
  });
  //搜索
  $('#search_packageBreakfast').on('click', function () {
    if (searchFlag) {
      return;
    }
    searchFlag = true;
    $('#search_packageBreakfast').linkbutton('disable');
    eapor.utils.defaultAjax('../banquet/getInfoByRoomCode', {
      roomCode: $('#roomCode_packageBreakfast').textbox('getValue')
    }, searchCallBack);
  });
  //使用
  $('#use_packageBreakfast').on('click', function () {//// style="margin-bottom:10px"
    const row = $('#tab_packageBreakfast').datagrid('getRows')[0];
    console.info(row);
    if (!row) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到宾客信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    $('#dialogParent_packageBreakfas').append(`
			<div id="div" style="padding:30px 0 0 40px;">
				<input id="number" style="width:230px;"  label="使用包价早餐：" labelPosition="before" 
					labelAlign="right" labelWidth="90"/>
			</div>
		`);
    $('#number').textbox({});
    $('#number').textbox('setValue', Number(row.breakfastCount) - Number(row.todayCount));
    const dialog = $('#div');
    dialog.dialog({
      title: '使用包价早餐',
      width: 320,
      height: 160,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          function submitCallBack(result) {
            console.info(result);
            if (result > 0) {
              searchFlag = true;
              eapor.utils.defaultAjax('../banquet/getInfoByRoomCode', {
                roomCode: row.roomCode
              }, searchCallBack);
              dialog.dialog('close');
              $.messager.show({ title: '系统提示', msg: '成功提交，简讯已更新！', timeout: 3000, showType: 'slide' });
              return
            }
            if (result == -1) {
              $.messager.show({ title: '系统提示', msg: '提交失败！使用数量不能大于拥有数量！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (result == -2) {
              $.messager.show({ title: '系统提示', msg: '提交失败！无包价早餐项目！', timeout: 3000, showType: 'slide' });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '提交失败！', timeout: 3000, showType: 'slide' });

          }
          console.info(row.roomId);
          console.info($('#number').textbox('getValue'));
          eapor.utils.defaultAjax('../banquet/useBreakfast', {
            roomId: row.roomId, number: $('#number').textbox('getValue')
          }, submitCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  //撤销
  $('#cancel_packageBreakfast').on('click', function () {
    const row = $('#tab_packageBreakfast').datagrid('getRows')[0];
    console.info(row);
    if (!row) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未查询到宾客信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    $('#dialogParent_packageBreakfas').append(`
			<div id="div" style="padding:30px 0 0 40px;">
				<div style="margin-bottom:10px">
					<input id="countNumber" style="width:230px;" readonly label="使用包价早餐：" labelPosition="before" 
						labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="useNumber" style="width:230px;" readonly  label="今日已用：" labelPosition="before" 
						labelAlign="right" labelWidth="90"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="cancelNumber" style="width:230px;"  label="撤销数量：" labelPosition="before" 
						labelAlign="right" labelWidth="90"/>
				</div>
			</div>
		`);
    $('#countNumber').textbox({});
    $('#useNumber').textbox({});
    $('#cancelNumber').textbox({});

    $('#countNumber').textbox('setValue', row.breakfastCount);
    $('#useNumber').textbox('setValue', row.todayCount);
    $('#cancelNumber').textbox('setValue', row.todayCount);
    const dialog = $('#div');
    dialog.dialog({
      title: '撤销包价早餐',
      width: 320,
      height: 240,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          function submitCallBack(result) {
            console.info(result);
            if (result > 0) {
              searchFlag = true;
              eapor.utils.defaultAjax('../banquet/getInfoByRoomCode', {
                roomCode: row.roomCode
              }, searchCallBack);
              dialog.dialog('close');
              $.messager.show({ title: '系统提示', msg: '成功提交，简讯已更新！', timeout: 3000, showType: 'slide' });
              return
            }
            $.messager.show({ title: '系统提示', msg: '提交失败！', timeout: 3000, showType: 'slide' });

          }
          console.info(row.roomId);
          console.info($('#cancelNumber').textbox('getValue'));
          eapor.utils.defaultAjax('../banquet/useBreakfast', {
            roomId: row.roomId, number: $('#cancelNumber').textbox('getValue') * -1
          }, submitCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  });
  function searchCallBack(result) {
    console.info(result);
    searchFlag = false;
    $('#search_packageBreakfast').linkbutton('enable');
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result instanceof Array) {
      $('#tab_packageBreakfast').datagrid('loadData', result);
    }
  }
})();