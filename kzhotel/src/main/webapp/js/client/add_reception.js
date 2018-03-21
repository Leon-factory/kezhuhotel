~(function () {
  "use strict";
  //判断是否有账单，0表示未检测到账单。1表示检测到账单
  var addReception_guestInfo = 0,
    isSubmitFlag = false,
    isSubmitFlagNi = true;
  $('#selectWarehouse_addreception').combobox({
    url: '../warehouse/listWarehouse',
    queryParams: {
    	offset: 0,
    	limit: 99999999,
    	warehouseId: 0
    },
    valueField: 'warehouseId',
    textField: 'warehouseName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onLoadSuccess: function (getData) {
      if (getData.length > 0) {
        for (let value in getData) {
          if (getData[value].isPrimary == 1) {
            $(this).combobox('setValue', getData[value].warehouseId);
            return;
          }
        }
      }
    }
  });
  $('#addReception_PayMethod').combobox({});
  $('#addReception_PayPhone').numberbox({
		/*validType:'mobilephone',
		required:false,
		tipPosition: 'bottom',
		delay:1000,
		validateOnCreate:false,//为true时在创建该组件时就进行验证
		validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/	});
  $('#addReception_PayCode').textbox({
		/*required:false,
		delay:1000,
		tipPosition: 'bottom',
		validateOnCreate:false,//为true时在创建该组件时就进行验证
		validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/	});
  $('#addReception_PayMoney').textbox({
    precision: 2,
    validType: ['numMaxTwoDecimal'],
    delay: 1000,
    tipPosition: 'bottom'
  });

  $('#addReception_goodsTotal').numberbox({ precision: 2 });
  $('#addReception_serviceTotal').numberbox({ precision: 2 });
  $('#addReception_Total').numberbox({ precision: 2 });
  //******************新建宾客账单btn start********************
  function addReceptionBtnCallBack(data) {
    console.info(data);//返回receptionId
    if (eapor.utils.ajaxCallBackErrInfo(data)) {
      return;
    }
    if (data > 0) {
      addReception_guestInfo = 1;
      var guestData = {
        receptionId: data
      };
      $('#addReception_hiddenData').val(JSON.stringify(guestData));
      $.messager.show({ title: '系统提示', msg: '新建账单成功！', timeout: 2000, showType: 'slide' });
      $('#showDiv').dialog('close');
    } else {
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000, showType: 'slide' });
    }
  }
  $('#createNewReception').click(function () {
    $('#showSearchVipInfoDialog_addreception').append(
      `<div id="showDiv"></div>`
    );
    $('#showDiv').dialog({
      title: '新建账单',
      width: 350,
      height: 400,
      closed: false,
      cache: false,
      href: '../client/common_addReceptionDialog.jsp',
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#searchPhone_addReception').numberbox('isValid')) {
            $('#searchPhone_addReception').numberbox('textbox').focus();
            return;
          }
          if (!$('#remark_addReception').textbox('isValid')) {
            $('#remark_addReception').textbox('textbox').focus();
            return;
          }
          var guestName = $('#searchName_addReception').textbox('getValue');
          var guestPhone = $('#searchPhone_addReception').textbox('getValue');
          var guestChannel = $('#selectChannel_addReception').combobox('getValue');
          console.info(guestChannel);
          var channelName = "";
          $.each(eapor.data.channelObj, function (i, item) {
            if (guestChannel == item.channelId) {
              channelName = item.channelName;
              return;
            }
          })
          var ifSignup = $('#selectUseChannelCredit_addReception').combobox('getValue');
          if (ifSignup == "否") {
            ifSignup = 0;
          } else if (ifSignup == "是") {
            ifSignup = 1;
          }
          var remark = $('#remark_addReception').textbox('getValue');

          $('#shortInfo_addreception').datagrid('loadData',
            [{ guestName: guestName, phone: guestPhone, channelName: guestChannel, ifSignup, remark }]);
          $('#shortInfo_addreception').datagrid('reload');

          $('#addReception').linkbutton('enable');
          isSubmitFlag = true;
          $('#noNameAddReceptionAndGetBill_addReception').linkbutton('disable');
          isSubmitFlagNi = false;
          var urlData = {
            channelId: guestChannel,
            memberPhone: channelName == "会员" ? guestPhone : '',
            rcpGuestList:
              JSON.stringify([{ guestName, firstName: guestName, lastName: "", phone: guestPhone, address: "" }]),
            useChannelCredit: ifSignup,
            comment: remark
          };
          console.info(urlData);
          eapor.utils.defaultAjax('../reception/add', urlData, addReceptionBtnCallBack);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showDiv').dialog('close');
        }
      }]
    });
  })
  //******************新建宾客账单btn end********************
  //预离宾客账单btn
  $('#getReceptionListByLivingGuestShouldCheckOut_addreception1').click(function () {
    getReceptionListByLivingGuestShouldCheckOut_addreception(1);
  });
  //非预离宾客账单btn
  $('#getReceptionListByLivingGuestShouldCheckOut_addreception2').click(function () {
    getReceptionListByLivingGuestShouldCheckOut_addreception(2);
  });
  function getReceptionListByLivingGuestShouldCheckOut_addreception(value) {
    $('#hidden_livingRoom_notleave').val(value);//在datagrid加载完成后清空  value为1 为勾选预离  非预离未勾选  value为2则相反
    $('#showLivingGuestShouldCheckOutDiv_addreception').append('<div id="addReception_livingRoomList"></div>');
    $('#addReception_livingRoomList').dialog({
      title: '详情',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      href: '../client/livingRoom.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var selected = $('#livingRoom_list').datagrid('getSelected');
          if (selected != null) {
            $('#addReception_hiddenData').val(JSON.stringify(selected));
            addReception_guestInfo = 1;
            addReception_getDepositByReceptionId(selected.receptionId, selected.roomCode);
            $('#addReception_livingRoomList').dialog('close');
          } else {
            $.messager.show({ title: '系统提示', msg: '请选择房间！', timeout: 2000, showType: 'slide' });
            return;
          }
        }
      }, {
        text: '取消',
        handler: function () {
          $('#addReception_livingRoomList').dialog('close');
        }
      }]
    });
  };
  //已退房未结宾客btn
  $('#showReceptionForUnLiving_addreception2').click(function () {
    showReceptionForUnLiving_addreception(2);
  });
  //非住客未结宾客btn
  $('#showReceptionForUnLiving_addreception1').click(function () {
    showReceptionForUnLiving_addreception(1);
  });
  /*从列表中获取客单信息*/
  function addreception_getReceptionId(value) {
    if (value == 1) {//在住客单公共页面情况下

    } else if (value == 2) {//所有的含时间搜索的公共页面情况下
      var selected = $('#allReception_list').datagrid('getSelected');
      if (selected) {
        if (selected.receptionCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 2000, showType: 'slide' });
          return;
        }
        $('#addReception_hiddenData').val(JSON.stringify(selected));
        addReception_guestInfo = 1;
        addReception_getDepositByReceptionId(selected.receptionId, selected.roomCode);
        $('#getBill_receptionList').dialog('close');
      } else {
        $.messager.show({ title: '系统提示', msg: '请先选择客单！', timeout: 2000, showType: 'slide' });
        return;
      }
    }
  };
  function showReceptionForUnLiving_addreception(value) {
    $('#showLivingGuestShouldCheckOutDiv_addreception').append('<div id="getBill_receptionList"></div>');
    if (value == 1) {//非在住btn
      eapor.data.receptionState = 1;
      eapor.data.receptionType = 2;
      eapor.data.createDate = "";
      eapor.data.checkoutDate = "";
      $('#getBill_receptionList').dialog({
        title: '全部非住客未结客单列表',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        href: '../client/common-getReceptionList.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            addreception_getReceptionId(2);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#getBill_receptionList').dialog('close');
          }
        }]
      });
    } else if (value == 2) {//退房未结账单btn
      eapor.data.receptionState = 10;
      eapor.data.receptionType = 1;
      eapor.data.createDate = "";
      eapor.data.checkoutDate = "";
      $('#getBill_receptionList').dialog({
        title: '退房未结账账单列表',
        width: 980,
        height: 600,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
          text: '确定',
          handler: function () {
            addreception_getReceptionId(2);
          }
        }, {
          text: '取消',
          handler: function () {
            $('#getBill_receptionList').dialog('close');
          }
        }],
        href: '../client/common-getReceptionList.jsp',
        onClose: function () {
          $(this).dialog('destroy');
        }
      })
    }
  };

  $('#shortInfo_addreception').datagrid({
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
    //rownumbers : true,
    onLoadSuccess: function (data) {
      console.info(123);
      $('a[name="editShortInfo_addreception"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        editShortInfo_addreception(row_);
      });
    },
    columns: [[
      {
        field: 'guestName', title: "宾客姓名", align: 'center', width: 20,
        formatter: function (value) {
          return value ? value : "--";
        }
      },
      {
        field: 'phone', title: "宾客手机号", align: 'center', width: 20,
        formatter: function (value) {
          return value ? value : "--";
        }
      },
      {
        field: 'channelName', title: "客源", align: 'center', width: 20,
        formatter: function (value) {
          if (!value) {
            return "--";
          } else {
            $.each(eapor.data.channelObj, function (i, item) {
              if (value == item.channelId) {
                value = item.channelName;
                return;
              }
            })
            return value;
          }
        }
      },
      { field: 'roomCode', title: "房号", align: 'center', width: 20 },
      {
        field: 'balance', title: "balance", align: 'center', width: 20,
        formatter: function (value, row) {
          return value ? value + " 元" : "--";
        }
      },
      {
        field: 'credit', title: "信用参考", align: 'center', width: 20,
        formatter: function (value, row) {
          return value ? NP.divide(value, 100) + "元（" + row.creditName + "）" : "--";
        }
      },
      { field: 'remark', title: "账单备注", align: 'center', width: 20 },
      {
        field: 'id', title: "操作", align: 'center', width: 20,
        formatter: function (value, row, index) {
          let row_ = JSON.stringify(row);
          return `<a name="editShortInfo_addreception" class="dryColor" style="cursor:pointer;" data-val='${row_}' >[编辑]</a>`;
        }
      }
    ]]
  });
  //编辑简讯提交回调函数
  function editShortInfoCallBack_addreception(result) {
    console.info(result);
    eapor.clickFlag = true;
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      $('#shortInfo_addreception').datagrid('updateRow', {
        index: 0,
        row: {
          guestName: $('#editGuestName_addreception').textbox('getValue'),
          remark: $('#editRemark_addreception').textbox('getValue')
        }
      });
      $('a[name="editShortInfo_addreception"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        editShortInfo_addreception(row_);
      });
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
      if (eapor.utils.hasOwnProperty('refreshGetBillInfoForAddReception')) {
        eapor.utils.refreshGetBillInfoForAddReception({
          receptionId: JSON.parse($('#addReception_hiddenData').val()).receptionId, refresfType: 'shortInfo'
        });
      }
      $('#div').dialog('close');
      return;
    } else {
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000, showType: 'slide' });
      return;
    }
  };
  //编辑简讯
  function editShortInfo_addreception(row_) {
    let row = JSON.parse(row_);
    console.info(row);
    $('#addReception_livingRoomListP').append(
      `<div id="div" style="padding:25px 0 0 35px;">
					<div style="margin-bottom:10px">
						<input id="editGuestName_addreception" style="width:200px;"
							label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
					<div style="margin-bottom:0px">
						<input id="editRemark_addreception" style="width:200px;"
							label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
					</div>
				</div>`
    );
    $('#editGuestName_addreception').textbox({});
    $('#editRemark_addreception').textbox({
      multiline: true,
      validType: 'maxLength[32]',
      invalidMessage: '最多输入32个字符',
      validateOnCreate: false,
      validateOnBlur: true
    });
    //var name = $('#shortInfo_addreception').datagrid('getRows')[0].guestName;
    //var remark = $('#shortInfo_addreception').datagrid('getRows')[0].remark;
    $('#editGuestName_addreception').textbox('setValue', row.guestName);
    $('#editRemark_addreception').textbox('setValue', row.remark);
    $('#div').dialog({
      title: '编辑简讯',
      width: 300,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#editRemark_addreception').textbox('isValid')) {
            $('#editRemark_addreception').textbox('textbox').focus();
            return;
          }
          //var obj = JSON.parse($('#addReception_hiddenData').val());
          if (eapor.clickFlag != true) {
            return;
          }
          var data = {
            receptionId: row.receptionId,
            guestName: $('#editGuestName_addreception').textbox('getValue'),
            guaranteeAmount: null,
            comment: $('#editRemark_addreception').textbox('getValue')
          }
          console.info(data);
          eapor.clickFlag = false;
          eapor.utils.defaultAjax('../reception/editReception', data, editShortInfoCallBack_addreception);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  };
  /*动态id*/
  //商品
  var time = new Date().getTime();

  //服务
  var addService = $("#addService").attr("id");
  var addService_serviceType = $("#addService_serviceType").attr("id");
  var addService_serviceName = $("#addService_serviceName").attr("id");
  var addService_servicePrice = $("#addService_servicePrice").attr("id");
  var addService_serviceCount = $("#addService_serviceCount").attr("id");
  var addService_serviceTotal = $("#addService_serviceTotal").attr("id");
  var addService_serviceRemark = $("#addService_serviceRemark").attr("id");
  $("#addService").attr("id", addService + time);
  $("#addService_serviceType").attr("id", addService_serviceType + time);
  $("#addService_serviceName").attr("id", addService_serviceName + time);
  $("#addService_servicePrice").attr("id", addService_servicePrice + time);
  $("#addService_serviceCount").attr("id", addService_serviceCount + time);
  $("#addService_serviceTotal").attr("id", addService_serviceTotal + time);
  $("#addService_serviceRemark").attr("id", addService_serviceRemark + time);
  /*商品分类loader*/
  var addReception_goodsCategoryArray = [];
  var addReception_goodsCategoryLoader = function (param, success, error) {
    if (addReception_goodsCategoryArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(addReception_goodsCategoryArray)) {
      success(addReception_goodsCategoryArray);
      return true;
    }

  };

  /*商品loader*/
  var addReception_goodsArray = [];
  var addReception_goodsLoader = function (param, success, error) {
    if (addReception_goodsArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(addReception_goodsArray)) {
      success(addReception_goodsArray);
      return true;
    }
  };

  /*服务分类Loader*/
  var addReception_serviceTypeArray = [];
  var addReception_serviceTypeLoader = function (param, success, error) {
    if (addReception_serviceTypeArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(addReception_serviceTypeArray)) {
      success(addReception_serviceTypeArray);
      return true;
    }
  };

  /*服务loader*/
  var addReception_serviceArray = [];
  var addReception_serviceLoader = function (param, success, error) {
    if (addReception_serviceArray.length == 0) {
      success([]);
      return true;
    }
    if (!$.isEmptyObject(addReception_serviceArray)) {
      success(addReception_serviceArray);
      return true;
    }
  };

  /*在住客房列表*/
  function addReception_roomCodeClick() {
    $('#addReception_livingRoomListP').append(`<div id='addReception_livingRoomList'></div>`);
    const dialog = $('#addReception_livingRoomList');
    dialog.dialog({
      title: '全部在住房间信息',
      width: 980,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      href: '../client/livingRoom.jsp',
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          addReception_saveRoomInfo(1);
        }
      }, {
        text: '取消',
        handler: function () {
          dialog.dialog('close');
        }
      }]
    });
  }

  //显示明细 
  function addReception_getBillDetail(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    var goodsConsume = result.goodsConsumedetails;
    var serviceConseme = result.serviceConsumedetails;
    var goodsConsumeList = $("#goodsConsume");
    var serviceConsumeList = $("#serviceConsume");

    goodsConsumeList.datagrid("loadData", { total: 0, rows: [] });
    serviceConsumeList.datagrid("loadData", { total: 0, rows: [] });

    $.each(goodsConsume, function (g, gc) {
      //右边商品
      goodsConsumeList.datagrid("appendRow", {
        goodsId: gc.feeItemId,
        goodsCategory: gc.typeName,
        goodsName: gc.feeItemCode,
        goodsPrice: NP.divide(gc.salePrice, 100),
        goodsUnit: gc.unitName,
        goodsCount: gc.number,
        goodsTotal: NP.divide(gc.amount, 100)
      })

    });

    $.each(serviceConseme, function (s, sc) {
      //右边服务
      serviceConsumeList.datagrid("appendRow", {
        serviceId: sc.feeItemId,
        serviceCategory: sc.typeName,
        serviceName: sc.feeItemCode,
        servicePrice: NP.divide(sc.salePrice, 100),
        serviceCount: sc.number,
        serviceTotal: NP.divide(sc.amount, 100),
        serviceRemark: sc.remark
      })
    });
    $.ajax({
      type: 'post',
      url: '../reception/getReceptionInfo',
      data: { receptionId: result.receptionId },
      dataType: 'json',
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          return;
        }
        var arr = [];
        data.balance = (NP.divide(data.rentAmount, 100) + NP.divide(data.goodsAmount, 100) +
          + NP.divide(data.serviceAmount, 100) - NP.divide(data.payment, 100) -
          NP.divide(data.sign, 100) - NP.divide(data.free, 100) -
          NP.divide(data.debt, 100)).toFixed(2);
        arr.push(data);

        $('#addReception').linkbutton('enable');
        isSubmitFlag = true;
        $('#noNameAddReceptionAndGetBill_addReception').linkbutton('disable');
        isSubmitFlagNi = false;
        $('#shortInfo_addreception').datagrid('loadData', arr);
        $('#shortInfo_addreception').datagrid('reload');
        $('#noNameAddReceptionAndGetBill_addReception').linkbutton('disable');
      }
    });
  }

  function addReception_getDepositByReceptionId(receptionId, roomCode) {
    const data = {
      receptionId: receptionId,
      roomCode: typeof roomCode === 'undefined' ? '' : roomCode
    };
    eapor.utils.defaultAjax('../reception/addReceptionPageDetail', data,
      addReception_getBillDetail);
  }

  /*根据在住房间列表获取房间信息*/
  function addReception_saveRoomInfo(value) {
    let selected = null;
    if (value == 1) {
      selected = $('#livingRoom_list').datagrid('getSelected');
    } else if (value == 2) {
      selected = $('#allReception_list').datagrid('getSelected');
    }

    if (selected) {
      $('#addReception_hiddenData').val(JSON.stringify(selected));
      addReception_getDepositByReceptionId(selected.receptionId, selected.roomCode);
      addReception_guestInfo = 1;
      if (value == 1) {
        $('#addReception_livingRoomList').dialog('close');
      } else if (value == 2) {
        $('#getBill_receptionList_addreception').dialog('close');
      }
      return;
    }
    $('#livingRoom_list').datagrid('unselectAll');
    $.messager.show({ title: '系统提示', msg: '请先选择账单！', timeout: 2800, showType: 'slide' });
  }

  function addReception_reServiceArray(arr) {
    const serviceRows = $('#serviceCar').datagrid('getRows');
    console.info(serviceRows)
    if (serviceRows.length > 0) {
      serviceRows.forEach(function (item, key, obj) {
        arr.push({
          feeItemType: 3,
          feeItemCode: item.serviceName,
          feeItemId: item.serviceId,//item.serviceItemId,
          salePrice: (item.servicePrice * 100).toFixed(0),
          number: item.serviceCount,
          amount: (item.serviceTotal * 100).toFixed(0),
          remark: item.serviceRemark,
          unitName: item.hasOwnProperty('unitName') ? item.unitName : ''
        });
      });
    }
    return arr;

  }
  //重组商品和服务数据
  function addReception_reBuildArray() {
    const arr = [];
    const goodsRows = $('#goodsCar').datagrid('getRows');
    console.info(goodsRows);
    if (goodsRows.length > 0) {
      goodsRows.forEach(function (i, k, o) {
        arr.push({
          feeItemType: 2,
          feeItemCode: i.goodsName,
          feeItemId: i.goodsId,
          salePrice: (i.goodsPrice * 100).toFixed(0),
          number: i.goodsCount,
          amount: (i.goodsTotal * 100).toFixed(0),
          unitName: i.goodsUnit
        });
      });
    }
    const arr1 = addReception_reServiceArray(arr);
    return arr1;
  }

  //回调函数
  function addReception_addConsumeCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -2) {
      $.messager.show({ title: '系统提示', msg: '提交失败！匹配码不正确！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result == -4) {
      $.messager.show({ title: '系统提示', msg: '提交失败！该手机号不是客主会员！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result == -6) {
      $.messager.show({ title: '系统提示', msg: '提交失败！5分钟之内不允许重复操作！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result > 0) {
      isSubmitFlag = false;
      $.messager.progress('close');
      $.messager.alert('系统提示', '提交成功！');
      console.info($('#addReception_hiddenData').val());
      var eo = JSON.parse($('#addReception_hiddenData').val());

      $('#addReception_goodsTotal').textbox('setValue', 0);
      $('#addReception_serviceTotal').textbox('setValue', 0);
      $('#addReception_Total').textbox('setValue', 0);
      $('#addReception_PayMoney').textbox('clear');
      $('#goodsCar').datagrid('loadData', { total: 0, rows: [] });
      $('#serviceCar').datagrid('loadData', { total: 0, rows: [] });
      console.info("eo.receptionId", eo.receptionId);
      if (eapor.utils.hasOwnProperty('refreshGetBillInfoForAddReception')) {
        eapor.utils.refreshGetBillInfoForAddReception({ receptionId: eo.receptionId, refreshType: 'shortInfoAndDetail' });
      }
      addReception_getDepositByReceptionId(eo.receptionId, "");
      $('#srcontains').empty();
      window.initAllRoomState();

    } else if (result == -1113) {
      $.messager.progress('close');
      $.messager.alert('系统提示', '提交失败！退单数量大于消费商品数量！');

    } else {
      $.messager.progress('close');
      $.messager.alert('系统提示', '提交失败！');
    }
  }

  //非住客客单
  function addReception_createNoneReceptionCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result == -201 || result == -102 || result == -111 || result == -301 || result == -801) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }

    if (result > 0) {
      //清空总计里的内容
      $('#addReception_goodsTotal').textbox('setValue', 0);
      $('#addReception_serviceTotal').textbox('setValue', 0);
      $('#addReception_Total').textbox('setValue', 0);
      //$('#addRecetion_depositTip').html('');
      //清空支付金额textbox
      $('#addReception_PayMoney').textbox('clear');

      $('#goodsCar').datagrid('loadData', { total: 0, rows: [] });
      $('#serviceCar').datagrid('loadData', { total: 0, rows: [] });
      $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000 });
			/*$('#kzmaintable').tabs('close','加单');
			$('#kzmaintable').tabs('select','房态图');*/
      $('#srcontains').empty();
      initAllRoomState();
      return;
    } else if (result === 0) {
    	$.messager.show({ title: '系统提示', msg: '操作失败！支付金额与消费金额不一致！', timeout: 2000 });
    } else {
    	$.messager.show({ title: '系统提示', msg: '操作失败！' + result, timeout: 2000 });
    }

  }

  $('#noNameAddReceptionAndGetBill_addReception').on('click', function () {
    console.info(isSubmitFlagNi);
    if (!isSubmitFlagNi) {
      return;
    }
    console.info(5663);
    noNameAddReceptionAndGetBill_addReception();
  });
  //匿名加单并快捷结账
  function noNameAddReceptionAndGetBill_addReception() {
    var consumeDetail = addReception_reBuildArray();
    if (consumeDetail.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先添加商品或服务！', timeout: 2800, showType: 'slide' });
      return;
    }
    if (!$('#addReception_PayMoney').textbox('isValid')) {
      $('#addReception_PayMoney').textbox('textbox').focus();
      return;
    }
    $.messager.confirm('系统提示', '这是一个新的账单是否继续操作', function (r) {
      if (r) {
        //提交
        var data = {};
        var pay = [];
        var payment = {};
        //-----
        var payInfo = eapor.utils.getPayIdAndName('addReception_PayMethod');
        var payment = {
          paymethodName: payInfo.paymethodName,
          paymethodCode: payInfo.paymethodCode
        };
        console.info(payInfo);
        if (payInfo.hasOwnProperty("creditChannelId")) {
          payment.creditChannelId = payInfo.creditChannelId
        }

        console.info(payment);
        let amount = $('#addReception_PayMoney').textbox('getValue');
        if (amount == "") {
          amount = 0;
        }
        payment.amount = (amount * 100).toFixed(0);
        payment.scene = "匿名加单";
        payment.phone = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
          $('#addReception_PayPhone').numberbox('getValue') : '';
        payment.matchCode = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
          $('#addReception_PayCode').textbox('getValue') : '';
        pay.push(payment);
        data.paymentList = JSON.stringify(pay);//支付明细
        data.consumedetailList = JSON.stringify(consumeDetail);
        data.warehouseId = Number($('#selectWarehouse_addreception').combobox('getValue'));
        console.info(data);
        eapor.utils.defaultAjax("../reception/createAnonymousReception", data, addReception_createNoneReceptionCallback);
      } else {
        $('#addReception_roomCode').trigger('click');
      }
    })
  };

  $('#addReception').on('click', function () {
    console.info(22);
    console.info(isSubmitFlag);
    if (!isSubmitFlag) {
      return;
    }
    console.info(33);
    addReceptionSubmit_addReception();
  });
  //加单按钮 提交函数
  function addReceptionSubmit_addReception() {
    var con = addReception_reBuildArray();
    if (con.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先添加商品或服务！', timeout: 2800, showType: 'slide' });
      return;
    }

    const type_ = $('#addReception_PayMethod').combobox('getText');
    console.info('type_:', type_);
    if (type_ === '储值' || type_ === '积分') {
      if (!$('#addReception_PayPhone').numberbox('isValid')) {
        $('#addReception_PayPhone').numberbox('textbox').focus();
        return;
      }
      if (!$('#addReception_PayCode').textbox('isValid')) {
        $('#addReception_PayCode').textbox('textbox').focus();
        return;
      }
    } else {
      $('#addReception_PayPhone').numberbox('clear');
      $('#addReception_PayCode').textbox('clear');
    }

    if (!$('#addReception_PayMoney').textbox('isValid')) {
      $('#addReception_PayMoney').textbox('textbox').focus();
      return;
    }

    //重组数据
    var oldData = $('#addReception_hiddenData').val();
    console.info(oldData);
    let nowData = JSON.parse(oldData);
    var data = {};
    console.info(addReception_reBuildArray());
    var consumeDetail = addReception_reBuildArray();
    console.info(consumeDetail)
    if (consumeDetail.length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先添加商品或服务！', timeout: 2800, showType: 'slide' });
      return;
    }
    data.receptionId = nowData.receptionId;
    data.warehouseId = Number($('#selectWarehouse_addreception').combobox('getValue'));
    if (nowData.rentId == undefined) {
      data.rentId = 0;
    } else {
      data.rentId = nowData.rentId;
    }
    if (nowData.roomId == undefined) {
      data.roomId = 0;
    } else {
      data.roomId = nowData.roomId;
    }
    if (nowData.roomCode == undefined) {
      data.roomCode = "";
    } else {
      data.roomCode = nowData.roomCode;
    }

    var pay = [];
    //-----
    var payInfo = eapor.utils.getPayIdAndName('addReception_PayMethod');
    var payment = {
      paymethodName: payInfo.paymethodName,
      paymethodCode: payInfo.paymethodCode
    };
    if (payInfo.hasOwnProperty("creditChannelId")) {
      payment.creditChannelId = payInfo.creditChannelId
    }

    console.info(payment);
    let amount = $('#addReception_PayMoney').textbox('getValue');
    if (amount == "") {
      amount = 0;
    }
    payment.scene = "加单";
    payment.amount = (amount * 100).toFixed(0);

    payment.phone = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
      $('#addReception_PayPhone').numberbox('getValue') : '';
    payment.matchCode = payInfo.paymethodName === '储值' || payInfo.paymethodName === '积分' ?
      $('#addReception_PayCode').textbox('getValue') : '';
    pay.push(payment);
    data.paymentList = JSON.stringify(pay);//支付明细
    data.consumeList = JSON.stringify(consumeDetail);
    if (amount == 0) {
      data.payState = 0;//未支付
      data.paymentList = "";
    } else {
      data.payState = 1;//已支付
    }
    $.messager.progress({
      title: "系统提示",
      msg: '正在提交',
      interval: '500'
    });

    setTimeout(function () {
      $.messager.progress('close');
    }, 5000)
    console.info(data);
    eapor.utils.defaultAjax('../consume/add', data, addReception_addConsumeCallback);
  };
  /*------------------------------------------------goods part------------------------------------*/
  /*删除商品*/
  function addReception_removeGoods(select) {
    var goodsCar = $("#goodsCar");

    var total = Number(select.goodsTotal);

    /*商品价格总计*/
    var gt = Number($("#addReception_goodsTotal").numberbox("getValue"));
    $("#addReception_goodsTotal").numberbox("setValue", gt - total);

    /*总价格*/
    var pricet = Number($("#addReception_Total").numberbox("getValue"));
    $("#addReception_Total").numberbox("setValue", pricet - total);

    var index = goodsCar.datagrid("getRowIndex", select);
    goodsCar.datagrid("deleteRow", index);

  }
  /*添加商品确认*/
  function addReception_addGoodsSubmit() {
    var price = $("#addGoods_goodsPrice");
    var unit = $("#addGoods_goodsUnit");
    var count = $("#addGoods_goodsCount");
    var total = $("#addGoods_goodsTotal");
    var gc = $("#addGoods_goodsCategory");
    var gn = $("#addGoods_goodsName");
    var t = Number(total.numberbox("getValue"));//商品小计
    //var gd = Number($("#addReception_guestDeposit").val());

    /*商品总计*/
    var goodsTotal = $("#addReception_goodsTotal");
    var gt = Number(goodsTotal.numberbox("getValue"));//当前商品总计
    goodsTotal.numberbox("setValue", gt + t);


    /*服务总计*/
    var serviceTotal = $("#addReception_serviceTotal");
    var st = Number(serviceTotal.numberbox("getValue"));

    /*价格总计*/
    var priceTotal = $("#addReception_Total");
    var allt = gt + st + t;
    priceTotal.numberbox("setValue", allt);

    /*datagrid 增加数据*/
    var gcname = gc.combobox("getValue");
    if (gcname == "" || gcname == "全部") {
      $.messager.show({
        title: '系统提示',
        msg: '请选择商品分类！',
        timeout: 2000
      })
      return;
    }
    var gnname = gn.combobox("getText");
    if (gnname == "" || gnname == "全部") {
      $.messager.show({
        title: '系统提示',
        msg: '请选择商品！',
        timeout: 2000
      })
      return;
    }
    var gi;
    $.each(gn.combobox("getData"), function (i, item) {
      if (item.goodsItemCode == gnname || item.goodsName == gnname) {
        gi = item.goodsId;
        return;
      }
    });
    var goodsCar = $("#goodsCar");
    goodsCar.datagrid("appendRow", {
      goodsId: gi,
      goodsCategory: gcname,
      goodsName: gnname,
      goodsPrice: price.numberbox("getValue"),
      goodsUnit: unit.textbox("getValue"),
      goodsCount: count.numberbox("getValue"),
      goodsTotal: total.numberbox("getValue")
    })
    $("#div").dialog('close');
  }
  /*显示商品详细*/
  function addReception_showGoodsDetail(record) {
    console.info(record)
    var price = NP.divide(record.price, 100);//salePrice/100;
    var unit = record.unit;//unitName;

    /*单价*/
    $("#addGoods_goodsPrice").numberbox("setValue", price);
    $("#addGoods_goodsPrice").numberbox({
      disabled: true,
      precision: 2
    });
    /*单位*/
    $("#addGoods_goodsUnit").textbox("setValue", unit);
    $("#addGoods_goodsUnit").textbox({
      disabled: true
    });
    /*数量，默认为1*/

    $("#addGoods_goodsCount").numberspinner({
      editable: false,
      min: 1,
      max: record.stockNumber,//剩余库存数量
      onSpinUp: function () {
        var count = Number($("#addGoods_goodsCount").numberspinner("getValue"));
        if (count == record.stockNumber) {
          $.messager.show({ title: '系统提示', msg: '已达库存最大值！', timeout: 2000 });
          return;
        }
      },
      onChange: function (newValue, oldValue) {
        var p = $("#addGoods_goodsPrice").numberbox("getValue");
        var t = p * newValue;
        $("#addGoods_goodsTotal").numberbox("setValue", t);
      }
    })
    $("#addGoods_goodsCount").numberspinner("setValue", 1)


    /*小计*/
    var c = $("#addGoods_goodsCount").numberspinner("getValue");
    var total = price * c;
    $("#addGoods_goodsTotal").numberbox("setValue", total);
  }
  /*初始化商品combobox*/
  function addReception_getGoods(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -201 || result == -111) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }

    addReception_goodsArray = result;
    var goods = $("#addGoods_goodsName");
    goods.combobox({
      loader: addReception_goodsLoader,
      valueField: 'goodsId',
      textField: 'goodsName',//'goodsItemCode',
      //value:"全部",
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          goods.combobox('setValue', data[0].goodsId);
          goods.combobox('setText', data[0].goodsName);
        }
      },
      onSelect: function (record) {
        addReception_showGoodsDetail(record);
      }
    })
  }
  /*根据商品分类显示商品combobox*/
  function addReception_getGoodsByGoodsCategoryId(id) {
    var data = {};
    //data.offset = 0;"../Goods/listGoodsPage"
    //data.limit=9999;
    //data.goodsName = "" /*按商品名称搜索*/
    //data.goodsCategoryId = id;  /*按商品分类id搜索*/
    //data.saleState = 1;/*经营状态   1上架 2下架  0全部*/
    //库房id//商品类别id,0为全部//商品名称//报警   0不报警，1库存底，2库存正常
    data.warehouseId = $('#selectWarehouse_addreception').combobox('getValue') * 1;
    data.goodsCategoryId = id;
    console.info(data);
    ///goods/getGoodsListByWarehouse
    eapor.utils.defaultAjax('../Goods/getGoodsListByWarehouse', data, addReception_getGoods);
  }

  function addReception_getGoodsCategory(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -201 || result == -111) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }
    addReception_goodsCategoryArray = result;
    var goodsCategory = $("#addGoods_goodsCategory");
    goodsCategory.combobox({
      loader: addReception_goodsCategoryLoader,
      valueField: 'goodsCategoryName',
      textField: 'goodsCategoryName',
      //value:"全部",
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          goodsCategory.combobox('setValue', data[0].goodsCategoryName);
          goodsCategory.combobox('setText', data[0].goodsCategoryName);
        }
      },
      onSelect: function (record) {
        var goodsCategoryId = record.goodsCategoryId;
        addReception_getGoodsByGoodsCategoryId(goodsCategoryId);
      }
    })
  }
  /*添加商品dialog*/
  function addReception_addGoods() {
    console.info('add');
    $('#addGoods').append(
      '<div id="div" style="padding:30px 0 0 50px;">' +
      '<div style="margin-bottom:15px;">' +
      '<input labelAlign="right" id="addGoods_goodsCategory" ' +
      'style="width:230px;" label="商品类型：" labelPosition="before"  labelWidth="80">' +
      '</div>' +
      '<div style="margin-bottom:15px;">' +
      '<input labelAlign="right" id="addGoods_goodsName"  ' +
      'style="width:230px;" label="商品名称：" labelPosition="before" labelWidth="80">' +
      '</div>' +
      '<div style="margin-bottom:15px;">' +
      '<input labelAlign="right" id="addGoods_goodsPrice"  ' +
      'style="width:230px;" label="商品单价：" labelPosition="before" labelWidth="80">' +
      '</div>' +
      '<div style="margin-bottom:15px;">' +
      '<input labelAlign="right" id="addGoods_goodsUnit" ' +
      'style="width:230px;" label="商品单位：" labelPosition="before" labelWidth="80">' +
      '</div>' +
      '<div style="margin-bottom:15px;">' +
      '<input labelAlign="right" id="addGoods_goodsCount" ' +
      'style="width:230px;" label="商品数量：" labelPosition="before" labelWidth="80">' +
      '</div>' +
      '<div style="margin-bottom:0px;">' +
      '<input labelAlign="right" id="addGoods_goodsTotal"  ' +
      'style="width:230px;" label="商品小计：" labelPosition="before" labelWidth="80">' +
      '</div>' +
      '</div>'
    );
    //商品类型
    $('#addGoods_goodsCategory').combobox({

    });
    //商品名称
    $('#addGoods_goodsName').combobox({
			/*loader:addReception_goodsLoader,
			value:""*/
    });
    //商品单价
    $('#addGoods_goodsPrice').numberbox({
      precision: 2
    });
    //商品单位
    $('#addGoods_goodsUnit').textbox({

    });
    //商品数量
    $('#addGoods_goodsCount').numberspinner({

    });
    //商品小计
    $('#addGoods_goodsTotal').numberbox({
      editable: false,
      precision: 2
    });
    console.info($('#div'))
    $('#div').dialog({
      title: '添加商品',
      width: 360,
      height: 400,
      modal: true,
      closed: false,
      cache: false,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          addReception_addGoodsSubmit();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })

    /*加载完dialog，显示商品类别combobox*/
    var data = {};
    data.offset = 0;/*分页offset*/
    data.limit = 9999;/*分页limit*/
    data.goodsCategoryName = "";/*按名称模糊查询*/
    eapor.utils.defaultAjax("../Goodscategory/listGoodscategoryPage", data, addReception_getGoodsCategory);
  }

  /*初始加载左边商品datagrid*/
  $('#goodsCar').datagrid({
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    toolbar: [{
      text: "添加",
      iconCls: 'icon-add',
      handler: function () {
        addReception_addGoods();
      }
    }, '-', {
      text: "删除",
      iconCls: 'icon-remove',
      handler: function () {
        var select = $('#goodsCar').datagrid("getSelected");
        if (!select) {
          $.messager.show({ title: '系统提示', msg: '请选择一件商品进行删除操作！', timeout: 2000 });
          return;
        }
        addReception_removeGoods(select);
      }
    }],
    columns: [[
      { field: 'goodsId', title: '商品id', width: 20, align: 'center', hidden: true },
      { field: 'goodsCategory', title: '商品类别', width: 20, align: 'center' },
      { field: 'goodsName', title: '商品名称', width: 20, align: 'center' },
      { field: 'goodsPrice', title: '商品单价', width: 20, align: 'center' },
      { field: 'goodsUnit', title: '商品单位', width: 20, align: 'center' },
      { field: 'goodsCount', title: '商品数量', width: 20, align: 'center' },
      { field: 'goodsTotal', title: '商品小计', width: 20, align: 'center' }
    ]]
  })

  /*-----------------------------------------------service part------------------------------------------*/
  /*删除服务*/
  function addReception_removeService(select) {
    var serviceCar = $("#serviceCar");
    var total = Number(select.serviceTotal);
    /*服务价格总计*/
    var gt = Number($("#addReception_serviceTotal").numberbox("getValue"));
    $("#addReception_serviceTotal").numberbox("setValue", gt - total);

    /*总价格*/
    var pricet = Number($("#addReception_Total").numberbox("getValue"));
    $("#addReception_Total").numberbox("setValue", pricet - total);

    /*获取余额*/
		/*var deposit = Number($("#addReception_guestDeposit").val());
		
		var tipsprice = deposit - (pricet-total);
		var tips = $("#addRecetion_depositTip");
		if(tipsprice>0){
			tips.text("");
		}else{
			tips.text("已超过余额，需支付"+(-tipsprice));
		}*/

    var index = serviceCar.datagrid("getRowIndex", select);
    serviceCar.datagrid("deleteRow", index);
  }
  /*确定*/
  function addReception_addServiceSubmit() {
    var price = $("#addService_servicePrice" + time);
    var count = $("#addService_serviceCount" + time);
    var total = $("#addService_serviceTotal" + time);
    var remark = $("#addService_serviceRemark" + time);
    var stype = $("#addService_serviceType" + time);
    var sname = $("#addService_serviceName" + time);
    var t = Number(total.numberbox("getValue"));//服务小计
    //var gd = Number($("#addReception_guestDeposit").val());

    /*服务总计*/
    var serviceTotal = $("#addReception_serviceTotal");
    var st = Number(serviceTotal.numberbox("getValue"));//当前商品总计
    serviceTotal.numberbox("setValue", st + t);


    /*商品总计*/
    var goodsTotal = $("#addReception_goodsTotal");
    var gt = Number(goodsTotal.numberbox("getValue"));

    /*价格总计*/
    var priceTotal = $("#addReception_Total");
    var allt = gt + st + t;
    priceTotal.numberbox("setValue", allt);

    //var tips = $("#addRecetion_depositTip");

		/*if(gd-allt<0){
			var str = -(gd-allt)+"";
			tips.css("color","red");
			tips.text("已超过余额，需支付"+str);
		}*/

    /*datagrid 增加数据*/
    var sertype = stype.combobox("getValue");
    if (sertype == "" || sertype == "全部") {
      $.messager.show({ title: '系统提示', msg: '请选择服务分类！', timeout: 2000 });
      return;
    }
    var sername = sname.combobox("getValue");
    if (sername == "" || sername == "全部") {
      $.messager.show({ title: '系统提示', msg: '请选择服务！', timeout: 2000 });
      return;
    }
    var serid;

    $.each(sname.combobox("getData"), function (i, item) {
      if (item.serviceItemCode == sername) {
        console.info("***")
        console.info(item)
        console.info(item.serviceItemId)
        serid = item.serviceItemId;
        return;
      }
    });
    var serviceCar = $("#serviceCar");

    console.info(sname.combobox('getValue'));
    console.info(sertype);
    console.info(sname.combobox('getText'));
    console.info(price.numberbox("getValue"));
    console.info(count.numberbox("getValue"));
    console.info(total.numberbox("getValue"));
    console.info(remark.textbox("getValue"));

    serviceCar.datagrid("appendRow", {
      serviceItemId: sname.combobox('getValue'),
      serviceCategory: sertype,
      serviceName: sname.combobox('getText'),
      servicePrice: price.numberbox("getValue"),
      serviceCount: count.numberbox("getValue"),
      serviceTotal: total.numberbox("getValue"),
      serviceRemark: remark.textbox("getValue")
    })
  }
  /*服务详情*/
  function addReception_showServiceDetail(record) {
    var price = NP.divide(record.price, 100);
    /*单价*/
    $("#addService_servicePrice" + time).numberbox("setValue", price);
    $("#addService_servicePrice" + time).numberbox({
      //disabled:true,
      precision: 2,
      onChange: function (newValue, oldValue) {
        console.info(newValue);
        /*小计*/
        var c = $("#addService_serviceCount" + time).numberspinner("getValue");
        var total = newValue * c;
        $("#addService_serviceTotal" + time).numberbox("setValue", total);
      }
    });

    /*数量，默认为1*/

    $("#addService_serviceCount" + time).numberspinner({
      editable: false,
      min: 1,
      onChange: function (newValue, oldValue) {
        var p = $("#addService_servicePrice" + time).numberbox("getValue");
        var t = p * newValue;
        $("#addService_serviceTotal" + time).numberbox("setValue", t);
      }
    })
    $("#addService_serviceCount" + time).numberspinner("setValue", 1);
    /*小计*/
    //var c = $("#addService_serviceCount"+time).numberspinner("getValue");
    //var total = price * c;
    //$("#addService_serviceTotal"+time).numberbox("setValue",total);

    /*服务备注*/
    var remark = record.remark
    $("#addService_serviceRemark" + time).textbox("setValue", remark);

  }
  /*获取服务回调函数*/
  function addReception_getService(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -201 || result == -111) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }

    addReception_serviceArray = result;
    var service = $("#addService_serviceName" + time);
    service.combobox({
      loader: addReception_serviceLoader,
      valueField: 'serviceItemId',
      textField: 'serviceItemCode',
      //value:"全部",
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          service.combobox('setValue', data[0].serviceItemId);
          service.combobox('setText', data[0].serviceItemCode);
        }
      },
      onSelect: function (record) {
        addReception_showServiceDetail(record);
      }
    })
  }
  /*获取服务*/
  function addReception_getServiceByServiceTypeId(id) {
    var data = {};
    data.offset = 0;
    data.limit = 9999;
    data.serviceItemName = "";
    data.serviceTypeId = id;

    eapor.utils.defaultAjax("../Serviceitem/listServiceitemPage", data, addReception_getService);
  }
  /*获取服务类别*/
  function addReception_getServiceType(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == -201 || result == -111) {
      $.messager.show({ title: '系统提示', msg: '参数错误！', timeout: 2000 });
      return;
    }

    addReception_serviceTypeArray = result;
    var serviceType = $("#addService_serviceType" + time);
    serviceType.combobox({
      loader: addReception_serviceTypeLoader,
      valueField: 'serviceTypeName',
      textField: 'serviceTypeName',
      //value:"全部",
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          serviceType.combobox('setValue', data[0].serviceTypeName);
          serviceType.combobox('setText', data[0].serviceTypeName);
        }
      },
      onSelect: function (record) {
        var serviceTypeId = record.serviceTypeId;
        addReception_getServiceByServiceTypeId(serviceTypeId);
      }
    })
  }
  /*添加服务dialog*/
  function addReception_addService() {
    var addSerivce = $("#addService" + time);
    addSerivce.dialog({
      title: '添加服务',
      width: 380,
      height: 400,
      modal: true,
      onClose: function () {
        $('#addService_servicePrice' + time).numberbox('clear');
        $('#addService_serviceCount' + time).numberbox('clear');
        $('#addService_serviceTotal' + time).numberbox('clear');
        $('#addService_serviceType' + time).combobox('setValue', "");
        addReception_serviceArray = [];
        $('#addService_serviceName' + time).combobox({
          loader: addReception_serviceLoader,
          value: ""
        });
      },
      buttons: [{
        text: '确定',
        handler: function () {
          addReception_addServiceSubmit();
          addSerivce.dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          addSerivce.dialog('close');
        }
      }]
    })


    /*加载完dialog，显示服务类别combobox*/
    var data = {};
    data.offset = 0;/*分页offset*/
    data.limit = 9999;/*分页limit*/
    data.serviceTypeName = ""; /*按名称模糊查询*/
    eapor.utils.defaultAjax("../Servicetype/listServicetypePage", data, addReception_getServiceType);
  }
  /*初始加载左边服务datagrid*/
  $('#serviceCar').datagrid({
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    toolbar: [{
      text: "添加",
      iconCls: 'icon-add',
      handler: function () {
        addReception_addService();
      }
    }, '-', {
      text: "删除",
      iconCls: 'icon-remove',
      handler: function () {
        var select = $('#serviceCar').datagrid("getSelected");
        if (!select) {
          $.messager.show({ title: '系统提示', msg: '请选择一件商品进行删除操作！', timeout: 2000 });
          return;
        }
        addReception_removeService(select);
      }
    }],
    columns: [[
      { field: 'serviceItemId', title: '服务名称id', width: 20, hidden: true, align: 'center' },
      { field: 'serviceCategory', title: '服务类别', width: 20, align: 'center' },
      { field: 'serviceName', title: '服务名称', width: 20, align: 'center' },
      { field: 'servicePrice', title: '服务单价', width: 20, align: 'center' },
      { field: 'serviceCount', title: '服务数量', width: 20, align: 'center' },
      { field: 'serviceTotal', title: '服务小计', width: 20, align: 'center' },
      { field: 'serviceRemark', title: '备注', width: 20, align: 'center' }
    ]]
  })


  /*----------------------------------右边已消费列表 part----------------------------------------*/
  /*----------服务退单-----------*/

  function addReception_returnService(row) {
    console.info(row);
    if (row.serviceCount < 0) {
      $.messager.show({ title: '系统提示', msg: '请您对服务数量大于0的商品进行操作！', timeout: 2000, height: 'auto' });
      return;
    }

    $("#returnService").append(
      '<div id="div" style="padding:20px 0 0 50px;">' +
      '<div style="margin-bottom:10px;">' +
      '<input id="returnService_serviceId" type="hidden"/>' +
      '<input id="returnService_serviceCategory" type="hidden"/>' +
      '<input disabled="true" labelAlign="right" id="returnService_serviceName"  style="width:200px;" label="服务名称：" labelWidth="70px" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input disabled="true" labelAlign="right" id="returnService_servicePrice"  style="width:200px;" label="服务单价：" labelWidth="70px" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input labelAlign="right" id="returnService_serviceCount"  style="width:200px;" label="服务数量：" labelWidth="70px" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input disabled="true" labelAlign="right" id="returnService_serviceTotal"  style="width:200px;" label="服务小计：" labelWidth="70px" labelPosition="before">' +
      '</div>' +
      '<div>' +
      '<input labelAlign="right" id="returnService_serviceRemark"  style="width:200px;" label="备注：" labelWidth="70px" labelPosition="before">' +
      '</div>' +
      '</div>'
    );

    $("#returnService_serviceName").textbox({});
    $("#returnService_servicePrice").numberbox({});
    $("#returnService_serviceCount").numberspinner({});
    $("#returnService_serviceTotal").numberbox({ precision: 2 });
    $("#returnService_serviceRemark").textbox({ multiline: true });

    $("#returnService_serviceId").val(row.serviceId);
    $("#returnService_serviceCategory").val(row.serviceCategory);
    $("#returnService_serviceName").textbox("setValue", row.serviceName);
    $("#returnService_servicePrice").numberbox("setValue", row.servicePrice);
    $("#returnService_serviceTotal").numberbox("setValue", row.serviceTotal);
    $("#returnService_serviceRemark").textbox("setValue", row.serviceRemark);

    $("#returnService_serviceCount").numberspinner({
      editable: false,
      min: 1,
      max: row.serviceCount,
      value: row.serviceCount,
      onSpinUp: function () {
        var count = Number($("#returnService_serviceCount").numberspinner("getValue"));
        $("#returnService_serviceTotal").numberbox("setValue", count * row.servicePrice);
      },
      onSpinDown: function () {
        var count = Number($("#returnService_serviceCount").numberspinner("getValue"));
        $("#returnService_serviceTotal").numberbox("setValue", count * row.servicePrice);
      }
    })

    $("#div").dialog({
      title: '服务退单',
      width: 350,
      height: 300,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var serviceTotal = $("#returnService_serviceTotal").numberbox("getValue");

          var st = Number($("#addReception_serviceTotal").numberbox("getValue"));
          $("#addReception_serviceTotal").numberbox("setValue", st - (serviceTotal))
          var pt = Number($("#addReception_Total").numberbox("getValue"));
          $("#addReception_Total").numberbox("setValue", pt - (serviceTotal));

          $("#serviceCar").datagrid("appendRow", {
            serviceId: $("#returnService_serviceId").val(),
            serviceCategory: $("#returnService_serviceCategory").val(),
            serviceName: $("#returnService_serviceName").textbox("getValue"),
            servicePrice: $("#returnService_servicePrice").numberbox("getValue"),
            serviceCount: Number($("#returnService_serviceCount").numberspinner("getValue")) * -1,
            serviceTotal: -serviceTotal,
            serviceRemark: $("#returnService_serviceRemark").textbox("getValue")
          })
          $("#div").dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $("#div").dialog('close');
        }
      }]
    })
  }
  /*初始加载右边消费详细datagrid*/
  $("#serviceConsume").datagrid({
    title: "已消费服务列表",
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    toolbar: [{
      text: "点击消费项可执行退单操作",
      iconCls: 'icon-help'/*,
			handler: function(){}*/
    }],
    columns: [[
      { field: 'serviceId', title: '服务Id', width: 20, align: 'center', hidden: true },
      { field: 'serviceCategory', title: '服务类别名称', width: 20, align: 'center', hidden: true },
      { field: 'serviceName', title: '服务名称', width: 20, align: 'center' },
      { field: 'servicePrice', title: '服务单价', width: 20, align: 'center' },
      { field: 'serviceCount', title: '服务数量', width: 20, align: 'center' },
      { field: 'serviceTotal', title: '服务小计', width: 20, align: 'center' },
      { field: 'serviceRemark', title: '备注', width: 20, align: 'center' }
    ]],
    onSelect: function (index, row) {
      addReception_returnService(row);
    }
  })

  /*----------------------------商品退单-------------------------*/

  /*右边商品退单*/
  function addReception_returnGoods(row) {
    console.info(row);
    if (row.goodsCount < 0) {
      $.messager.show({ title: '系统提示', msg: '请您对商品数量大于0的商品进行操作！', timeout: 2800, height: 'auto' });
      return;
    }
    $("#returnGoods").append(
      '<div id="div" style="padding:20px 0 0 50px;">' +
      '<div style="margin-bottom:10px;">' +
      '<input id="returnGoods_goodsId" type="hidden"/>' +
      '<input id="returnGoods_goodsCategory" type="hidden"/>' +
      '<input disabled="true" labelAlign="right" id="returnGoods_goodsName"  style="width:200px;" label="商品名称：" labelWidth="70px;" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input disabled="true" labelAlign="right" id="returnGoods_goodsPrice"  style="width:200px;" label="商品单价：" labelWidth="70px;" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input disabled="true" labelAlign="right" id="returnGoods_goodsUnit"  style="width:200px;" label="商品单位：" labelWidth="70px;" labelPosition="before">' +
      '</div>' +
      '<div style="margin-bottom:10px;">' +
      '<input labelAlign="right" id="returnGoods_goodsCount"  style="width:200px;" label="商品数量：" labelWidth="70px;"  labelPosition="before">' +
      '</div>' +
      '<div>' +
      '<input disabled="true" labelAlign="right" id="returnGoods_goodsTotal" style="width:200px;" label="商品小计：" labelWidth="70px;"  labelPosition="before">' +
      '</div>' +
      '</div>'
    );

    $("#returnGoods_goodsName").textbox({});
    $("#returnGoods_goodsPrice").numberbox({});
    $("#returnGoods_goodsPrice").numberbox({ precision: 2 });
    $("#returnGoods_goodsUnit").textbox({});
    $("#returnGoods_goodsCount").numberspinner({});
    $("#returnGoods_goodsTotal").numberbox({ precision: 2 });
    $('#returnGoods_goodsId').val(row.goodsId);
    $('#returnGoods_goodsCategory').val(row.goodsCategory);
    $("#returnGoods_goodsName").textbox("setValue", row.goodsName);
    $("#returnGoods_goodsPrice").numberbox("setValue", row.goodsPrice);
    $("#returnGoods_goodsUnit").textbox("setValue", row.goodsUnit);
    $("#returnGoods_goodsTotal").numberbox("setValue", row.goodsTotal);


    $("#returnGoods_goodsCount").numberspinner({
      editable: false,
      min: 1,
      max: row.goodsCount,
      value: row.goodsCount,
      onSpinUp: function () {
        var count = Number($("#returnGoods_goodsCount").numberspinner("getValue"));
        $("#returnGoods_goodsTotal").numberbox("setValue", count * row.goodsPrice);
      },
      onSpinDown: function () {
        var count = Number($("#returnGoods_goodsCount").numberspinner("getValue"));
        $("#returnGoods_goodsTotal").numberbox("setValue", count * row.goodsPrice);
      }
    })

    $('#div').dialog({
      title: '商品退单',
      width: 330,
      height: 300,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var goodsTotal = $("#returnGoods_goodsTotal").numberbox("getValue");

          var gt = Number($("#addReception_goodsTotal").numberbox("getValue"));
          $("#addReception_goodsTotal").numberbox("setValue", gt - (goodsTotal))
          var pt = Number($("#addReception_Total").numberbox("getValue"));
          $("#addReception_Total").numberbox("setValue", pt - (goodsTotal));
          console.info("1789", $("#returnGoods_goodsId").val());
          $("#goodsCar").datagrid("appendRow", {
            goodsId: $("#returnGoods_goodsId").val(),
            goodsCategory: $("#returnGoods_goodsCategory").val(),
            goodsName: $("#returnGoods_goodsName").textbox("getValue"),
            goodsPrice: $("#returnGoods_goodsPrice").numberbox("getValue"),
            goodsUnit: $("#returnGoods_goodsUnit").textbox("getValue"),
            goodsCount: Number($("#returnGoods_goodsCount").numberspinner("getValue")) * -1,
            goodsTotal: -goodsTotal
          })
          $('#div').dialog('close');
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }
  /*初始加载右边消费详细datagrid*/
  $("#goodsConsume").datagrid({
    title: "已消费商品列表",
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    toolbar: [{
      text: "点击消费项可执行退单操作",
      iconCls: 'icon-help'/*,
			handler: function(){}*/
    }],
    columns: [[
      { field: 'goodsId', title: '商品Id', width: 20, align: 'center', hidden: true },
      { field: 'goodsCategory', title: '商品类别名称', width: 20, align: 'center', hidden: true },
      { field: 'goodsName', title: '商品名称', width: 20, align: 'center' },
      { field: 'goodsPrice', title: '商品单价', width: 20, align: 'center' },
      { field: 'goodsUnit', title: '商品单位', width: 20, align: 'center' },
      { field: 'goodsCount', title: '商品数量', width: 20, align: 'center' },
      { field: 'goodsTotal', title: '商品小计', width: 20, align: 'center' }
    ]],
    onSelect: function (index, row) {
      addReception_returnGoods(row);
    }
  })

  $(function () {
    var roomOpenFlag_addReception = 0;
    $('#addReception_PayMethod').combobox({
      valueField: 'paymethod_name',//paymethod_code
      textField: 'paymethod_name',
      data: eapor.data.getNewPaymethodAddOtherPaymenthod,//eapor.data.PaymethodObj,//
      editable: false,
      panelHeight: "auto",
      panelMaxHeight: 300,
      groupField: 'paymethod_name',
      onChange: function (newValue, oldValue) {
        if (newValue === "积分" || newValue === "储值") {
          if ($('#showDiv_pay').is(':hidden')) {
            $('#showDiv_pay').show();
            $('#addReception_PayPhone').numberbox({
              validType: 'mobilephone',
              required: true,
              tipPosition: 'bottom',
              delay: 1000,
              validateOnCreate: false,//为true时在创建该组件时就进行验证
              validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
            });
            $('#addReception_PayCode').textbox({
              required: true,
              delay: 1000,
              tipPosition: 'bottom',
              validateOnCreate: false,//为true时在创建该组件时就进行验证
              validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
            });
          }
        } else {
          if ($('#showDiv_pay').is(':visible')) {
            $('#showDiv_pay').hide();
            $('#addReception_PayPhone').numberbox({
              validType: 'mobilephone',
              required: false,
              tipPosition: 'bottom',
              delay: 1000,
              validateOnCreate: false,//为true时在创建该组件时就进行验证
              validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
            });
            $('#addReception_PayCode').textbox({
              required: false
            });
          }
        }
      },
      groupFormatter: function (group) {
        if (eapor.data.PaymethodObj.length == roomOpenFlag_addReception) {
          roomOpenFlag_addReception += 1;
          return "代收";
        }
        roomOpenFlag_addReception += 1;
      },
      onLoadSuccess: function (data) {
        console.info(data);
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].paymethod_code);
          $(this).combobox('setText', data[0].paymethod_name);
        }
      }
    });
    var roomInfo = $('#index_pubRoomData').val();
    console.info(roomInfo);
    if (roomInfo != "") {
      addReception_guestInfo = 1;
      roomInfo = JSON.parse(roomInfo);
      var data = roomInfo;
      if (roomInfo.roomName != undefined) {//宾客账簿 选择预离时候存的信息 ，需进行判断 原先的无roomName属性
        data.roomCode = roomInfo.roomName;
      } else {
        data.roomCode = roomInfo.roomCode;
      }
      $('#addReception_hiddenData').val(JSON.stringify(data));
      console.info(roomInfo.receptionId)
      console.info(data.roomCode)
      addReception_getDepositByReceptionId(roomInfo.receptionId, data.roomCode);
    }/*else{
			addReception_roomCodeClick();
		}*/

  })
})();