//选择宾客账单公共页面JS
//搜索loader函数  
/*receptionState=0;
receptionType=0;
createDate="";
checkoutDate="";*/
~(function () {
  "use strict";
  $('#guestReceptionStatus').combobox({});
  $('#guestReceptionType').combobox({});
  $('#createReceptionDate').datebox({});
  $('#getBillReceptionDate').datebox({});
  $('#allReception_list').datagrid({
    title: '客单列表', 		//表格标题
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
    onLoadSuccess: function (data) {
      eapor.data.searceReceptionFlag = "";//清空搜索btn 设置的flag
    },
    columns: [[
      { field: 'channelId', title: '客源ID', align: 'center', hidden: true },
      { field: 'receptionId', title: '客单ID', align: 'center', width: 20, hidden: true },
      { field: 'rentplanId', title: '房价方案ID', align: 'center', width: 20, hidden: true },
      { field: 'sourceGroupId', title: '客源组ID', align: 'center', width: 20, hidden: true },
      { field: 'createUserId', title: 'createUserId', align: 'center', width: 20, hidden: true },
      { field: 'createUsername', title: 'createUsername', align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: 'hotelId', align: 'center', width: 20, hidden: true },
      { field: 'memberPhone', title: 'memberPhone', align: 'center', width: 20, hidden: true },
      { field: 'primaryGuestId', title: 'primaryGuestId', align: 'center', width: 20, hidden: true },

      { field: 'receptionCode', title: '客单号', align: 'center', width: 34 },
      {
        field: 'channelName', title: '客源', align: 'center', width: 15,
        formatter: function (value) {
          if (value == undefined) {
            return "非会员";
          } else {
            return value;
          }
        }
      },
      {
        field: 'roomCode', title: '房间号', align: 'center', width: 15,
        formatter: function (value) {
          if (value == undefined) {
            return "--";
          } else {
            return value;
          }
        }
      },
      {
        field: 'guestName', title: '住客姓名', align: 'center', width: 15,
        formatter: function (value, row, index) {
          console.info(row);
          if (value == undefined) {
            return "--";
          } else {
            return value;
          }
        }
      },
      {
        field: 'phone', title: '联系电话', align: 'center', width: 18,
        formatter: function (value) {
          if (value == undefined) {
            return "--";
          } else {
            return value;
          }
        }
      },
      {
        field: 'createTime', title: '创建时间', align: 'center', width: 28,
        formatter: function (value) {
          return getDateNoSS(value);
        }
      },
      {
        field: 'useCreditChannel', title: '是否挂账', align: 'center', width: 12,
        formatter: function (value, row, index) {
          if (value == 1) {
            return '挂账'
          }
          if (value == 0) {
            return '未挂账'
          }
        }
      },
      {
        field: 'receptionType', title: '客单类型', align: 'center', width: 12,
        formatter: function (value, row, index) {
          if (value == 1) {
            return '住客客单 ';
          } else if (value == 2) {
            return '非住客客单';
          } else if (value == 3) {
            return '餐宴账单';
          } else {
            return value;
          }
        }
      },
      {
        field: 'receptionState', title: '账单状态', align: 'center', width: 12,
        formatter: function (value, row, index) {
          if (value == 1) {
            return '未结账';
          } else if (value == 2) {
            return '已结账';
          } else {
            return value;
          }
        }
      },
      {
    	  field: 'receptionDetail', title: '备注', align: 'center', width: 20,
          formatter: function (value, row, index) {
            return typeof value !== 'undefined' ? value : '';
          }  
      }
    ]]
  });
  if (window.createDate != "") {
    window.createDate = (window.createDate + " 00:00:00");
  }
  if (window.checkoutDate != "") {
    window.checkoutDate = (window.checkoutDate + " 00:00:00");
  }
  if (eapor.data.searceReceptionFlag == 1) {

  } else {
    console.info($('#allReception_list'))
    $('#allReception_list').datagrid("options").loader = searchloader_commonGetReception;
    $("#allReception_list").datagrid("reload");
  }

  //搜索按钮
  $('#searchReception').click(function () {
    eapor.data.receptionState = $('#guestReceptionStatus').combobox('getValue');
    eapor.data.receptionType = $('#guestReceptionType').combobox('getValue');
    eapor.data.createDate = $('#createReceptionDate').datebox('getValue');
    eapor.data.checkoutDate = $('#getBillReceptionDate').datebox('getValue');
    if (window.createDate != "") {
      window.createDate = (window.createDate + " 00:00:00");
    }
    if (window.checkoutDate != "") {
      window.checkoutDate = (window.checkoutDate + " 00:00:00");
    }
    console.info(window.createDate);
    console.info(window.checkoutDate);
    $('#allReception_list').datagrid("options").loader = searchloader_commonGetReception;
    $("#allReception_list").datagrid("reload");
  });

  function searchloader_commonGetReception(param, success, error) {
    console.info(eapor.data.receptionState);
    console.info(eapor.data.receptionType);
    console.info(eapor.data.createDate);
    console.info(eapor.data.checkoutDate);
    $.ajax({
      url: '../room/getReceptionInfo',
      //url:'../room/selectRoomByReception',
      data: {
        receptionState: eapor.data.receptionState,
        receptionType: eapor.data.receptionType,
        createDate: eapor.data.createDate,
        checkoutDate: eapor.data.checkoutDate
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#allReception_list').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          $('#allReception_list').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          eapor.utils.messagerInfoBySearchEmpty('allReception_list', 'receptionCode', 9, 0);
          return true;
        }
        if (data == "") {
          $('#allReception_list').datagrid('loadData', { total: 0, rows: [] });
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


})();