/**
 * @JSname:空净房公共页面JS
 * @说明：在 此JS上 为 eapor.utils.loadCleanRoomList 上添加了 公用function
 */
~(function (window, eapor) {
  "use strict";
  var price1,
    price2,
    rowSelect_cleanRoom = null,
    onlySelectedOneRowFlag = 0;
  function getReferenceRoomPrice(value, row, index) {
    if (price1 && price2) {
      return '<span title="参考：全日房会员价：' + price2 + '元/间。非会员价：' + price1
        + '元/间。" style="display:block; width:100%;" class="easyui-tooltip">'
        + value + '</span>';
    } else {
      $.each(eapor.data.rp, function (i, item) {
        if (row.roomtypeId == item.roomtypeId) {
          price1 = NP.divide(item.price, 100);
          return;
        }
      });
      $.each(eapor.data.rpvip, function (i, item) {
        if (row.roomtypeId == item.roomtypeId) {
          price2 = NP.divide(item.price, 100);
          return;
        }
      });
      return '<span title="参考：全日房会员价：' + price2 + '元/间。非会员价：' + price1
        + '元/间。" style="display:block; width:100%;" class="easyui-tooltip">'
        + value + '</span>';
    }
  }
  //改变房型时 计算出相对应的房价  在cleanRoom.js里调用的该函数
  function roomopen_changeprice(index, row) {
    if (row == undefined) {
      $.messager.alert('系统提示', '该预订单预订的房型已满！');
      return;
    }
    var data = $('#hidden_rentplanId').val();
    //①.得到rentplanId 
    var getrentplanId = JSON.parse(data).rentplanId;

    var time = $('#checkOutTime_roomopen').textbox('getValue');

    if (time > 0 || time != "") {
      //②.得到roomtypeId
      var searchRoomtypeId = row.roomtypeId;//得到
      //③.得到beginTime
      var beginTime = $('#checkInTime_roomopen').textbox('getValue');
      //④.得到endTime
      var endTime = $('#checkOutTime_roomopen').textbox('getValue');

      if (endTime == undefined) {
        endTime = getDate(new Date(beginTime.replace(/-/g, "/")).getTime() + 86400000);//24*60*60*1000);
        //预离时间
        $('#checkOutTime_roomopen').textbox('setValue', endTime);
      }
      if ($('#north_guestsource_openroom').combobox('getText') == "会员" &&
        $('#checkInType_roomopen').textbox('getValue') != "晚房") {
        var t = JSON.parse($('#index_ruleData').val()).memberCheckoutDelay;
        endTime = getDate(new Date(endTime.replace(/-/g, "/")).getTime() - 86400000 - NP.times(t, 60000))
      } else {
        endTime = getDate(new Date(endTime.replace(/-/g, "/")).getTime() - 86400000);
      }
      var getRoomPriceDataChangeCheckInType = {};
      getRoomPriceDataChangeCheckInType.startDateTime = beginTime;
      //getRoomPriceDataChangeCheckInType.endTime =endTime;
      getRoomPriceDataChangeCheckInType.roomtypeId = searchRoomtypeId;//房型id

      var value = $('#checkInType_roomopen').textbox('getValue');
      //入住方式
      if (value == "晚房") {
        getRoomPriceDataChangeCheckInType.checkinType = 3;
        getRoomPriceDataChangeCheckInType.increment = 1;
      } else if (value == "钟点房") {
        getRoomPriceDataChangeCheckInType.checkinType = 2;
        getRoomPriceDataChangeCheckInType.increment = JSON.parse($('#index_ruleData').val()).restHour;
      } else {
        getRoomPriceDataChangeCheckInType.checkinType = 1;
        getRoomPriceDataChangeCheckInType.increment = 1;
      }

      if (endTime == "") {
        $.messager.show({ title: '系统提示', timeout: 3000, msg: '请选择计划居住天数！', showType: 'slide' });
        return false;
      }

      getRoomPriceDataChangeCheckInType.receptionId = 0;
      getRoomPriceDataChangeCheckInType.rentplanId = getrentplanId;
      getRoomPriceDataChangeCheckInType.expectedStay = $('#stayNumber_roomopen').numberspinner('getValue');

      function getRoomPriceCallback(result) {
        console.info(result);
        sessionStorage.setItem("roomPriceDetails_roomOpen", JSON.stringify(result));
        const hasPrice = result.hasPrice;
        let flag = false;
        hasPrice.forEach(function (item, key, obj) {
          if (flag) {
            return;
          }
          if (item == false) {
            flag = true;
            $.messager.alert('系统提示', '<span style="color:red;font-size:16px;">未查询到相关房价方案，请先设置！</span>');
            return;
          }
        });
        let total = 0;//预计房价
        const actualPriceList = result.actualPriceList;
        actualPriceList.forEach(function (item, key, obj) {
          total = NP.plus(total, NP.divide(item, 100));
        });
        //入住房费预期
        $('#roomAmount_roomopen').textbox('setValue', total);
      };
      eapor.utils.defaultAjax("../reception/calculateRentAmount", getRoomPriceDataChangeCheckInType, getRoomPriceCallback);
    }
  }
  function getCleanRoom(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#cleanRoom_list' + eapor.dlgcleanflag).datagrid({
      title: '空房列表', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      loadMsg: "loading....",
      singleSelect: true,
      striped: true,//隔行变色
      fitColumns: true,
      rownumbers: true,
      data: result,
      checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
      //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
      //如果为false，选择行将不选中复选框。
      onClickRow: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag == 2) {
          onlySelectedOneRowFlag = 0;
          return;
        } else {
          onlySelectedOneRowFlag = 1;
        }

        var rows = $(this).datagrid('getChecked');
        var flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }

        if (flag) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_cleanRoom = $(this).datagrid('getSelected');
          if (eapor.dlgcleanflag == "dlgopenclean") {
            roomopen_changeprice(rowIndex, rowData);
          }
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_cleanRoom = null;
          if (eapor.dlgcleanflag == "dlgopenclean") {
            $('#roomAmount_roomopen').textbox('setValue', "");
          }
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

        if (rowData != rowSelect_cleanRoom) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_cleanRoom = $(this).datagrid('getSelected');
          if (eapor.dlgcleanflag == "dlgopenclean") {
            roomopen_changeprice(rowIndex, rowData);
          }
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_cleanRoom = null;
          if (eapor.dlgcleanflag == "dlgopenclean") {
            $('#roomAmount_roomopen').textbox('setValue', "");
          }
        }

        onlySelectedOneRowFlag = 0;
      },
      onLoadSuccess: function (data) {
        //隐藏全选框
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";

        if ($('#index_roomTypeIdByOtherBtnToOpenRoom').val() != "") {
          $(this).datagrid('selectRow', 0);
          $(this).datagrid('checkRow', 0);
          $('#index_roomTypeIdByOtherBtnToOpenRoom').val("");
        }
        var roomInfo = $('#index_pubRoomData').val();

        if (!roomInfo) {
          return;
        }

        roomInfo = JSON.parse(roomInfo);
        $.each(data.rows, function (r, row) {
          if (roomInfo.roomId == row.roomId) {
            var rowIndex = $('#cleanRoom_list' + eapor.dlgcleanflag).datagrid('getRowIndex', row);
            $('#cleanRoom_list' + eapor.dlgcleanflag).datagrid('checkRow', rowIndex);
            $('#cleanRoom_list' + eapor.dlgcleanflag).datagrid('selectRow', rowIndex);
            rowSelect_cleanRoom = $('#cleanRoom_list' + eapor.dlgcleanflag).datagrid('getSelected');
            $('#index_pubRoomData').val('');
            return;
          }
        })
				/*$(".easyui-tooltip").tooltip({
                    onShow: function () {
                        $(this).tooltip('tip').css({
                            borderColor: '#000'
                        });
                    }
                });*/
      },
      columns: [[
        { field: 'ck', title: '', checkbox: true },
        { field: 'roomId', title: '房间ID', hidden: true },
        {
          field: 'roomCode', title: '房间名称', width: 100,
          formatter: function (value, row, index) {
            return getReferenceRoomPrice(value, row, index)
          }
        },
        { field: 'roomtypeId', title: '房间类型ID', hidden: true },
        {
          field: 'roomtypeName', title: '房间类型', width: 100,
          formatter: function (value, row, index) {
            return getReferenceRoomPrice(value, row, index)
          }
        },
        {
          field: 'roomState', title: '房间状态', width: 100,
          formatter: function (value, row, index) {
            var price1;
            var price2;
            $.each(eapor.data.rp, function (i, item) {
              if (row.roomtypeId == item.roomtypeId) {
                price1 = NP.divide(item.price, 100);
                return;
              }
            });
            $.each(eapor.data.rpvip, function (i, item) {
              if (row.roomtypeId == item.roomtypeId) {
                price2 = NP.divide(item.price, 100);
                return;
              }
            });
            if ((value > 0 && value < 6) || value == 7) {
              return '<span title="参考：全日房会员价：' + price2 + '元/间。非会员价：' + price1
                + '元/间。" style="display:block; width:100%;" class="easyui-tooltip">'
                + '空净房' + '</span>';
            }
          }
        },
        {
          field: 'description', title: '备注', width: 120,
          formatter: function (value, row, index) {
            return getReferenceRoomPrice(value, row, index)
          }
        }
      ]]
    });
  }

  $('#loadCleanRoomList').on('click', function () {
    eapor.utils.loadCleanRoomList();
  });
  eapor.utils.loadCleanRoomList = function () {
    var data = {};
    //从其他页面进入
    if ($('#index_roomTypeIdByOtherBtnToOpenRoom').val() != "") {
      data.roomtypeId = $('#index_roomTypeIdByOtherBtnToOpenRoom').val();
    } else {
      if ($('#cleanRoom_roomType' + eapor.dlgcleanflag).combobox('getValue') == "") {
        data.roomtypeId = 0;
      } else {
        data.roomtypeId = $('#cleanRoom_roomType' + eapor.dlgcleanflag).combobox('getValue');
      }
    }
    if (data.roomtypeId == "全部") {
      data.roomtypeId = 0;
    }
    data.floorId = $('#cleanRoom_floor' + eapor.dlgcleanflag).combobox('getValue');
    if (data.floorId == "" || data.floorId == "全部") {
      data.floorId = 0;
    }
    data.roomstates = $('#cleanRoom_roomState' + eapor.dlgcleanflag).combobox('getValue');
    if (data.roomstates == "" || data.roomstates == "全部") {
      data.roomstates = 12;
    }
    var url = "../room/selectRoomList";
    $('#cleanRoom_roomName' + eapor.dlgcleanflag).textbox({});
    data.roomCode = $('#cleanRoom_roomName' + eapor.dlgcleanflag).textbox('getValue');

    eapor.utils.defaultAjax(url, data, getCleanRoom);
  }

  //加载房型
  $('#cleanRoom_roomType').combobox({
    url: '../roomtype/getRoomtypeForSearch',
    queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    valueField: 'roomtypeId',
    textField: 'roomtypeName',
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    loadFilter: function (redata) {
      if (redata != -3333 && redata != -3335) {
        redata.unshift({ roomtypeId: 0, roomtypeName: "全部" });
      }
      return redata;
    }
  });

  //加载位置
  $('#cleanRoom_floor').combobox({
    url: "../floor/getFloorForSearch",
    queryParams: { limit: 9999, offset: 0, floorName: '' },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    valueField: 'floorId',
    textField: 'floorName',
    onShowPanel: function () {
      $(this).combobox('reload');
    },
    loadFilter: function (redata) {
      if (redata != -3333 && redata != -3335) {
        redata.unshift({ floorId: 0, floorName: "全部" });
      }
      return redata;
    }
  });

  //加载房间状态
  $('#cleanRoom_roomState').combobox({
    data: [{ "id": "12", "text": "全部", selected: true },
    { "id": "1", "text": "空净房" },
    { "id": "2", "text": "空脏房" }],
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    valueField: 'id',
    textField: 'text'
  });

  $('#cleanRoom_list').attr('id', 'cleanRoom_list' + eapor.dlgcleanflag);
  $('#cleanRoom_roomName').attr('id', 'cleanRoom_roomName' + eapor.dlgcleanflag);
  $('#cleanRoom_roomType').attr('id', 'cleanRoom_roomType' + eapor.dlgcleanflag);
  $('#cleanRoom_floor').attr('id', 'cleanRoom_floor' + eapor.dlgcleanflag);
  $('#cleanRoom_roomState').attr('id', 'cleanRoom_roomState' + eapor.dlgcleanflag);
  $('#loadCleanRoomList').attr('id', 'loadCleanRoomList' + eapor.dlgcleanflag);

  //加载在住房间列表
  eapor.utils.loadCleanRoomList();

})(window, window.eapor);