/**
 *@jsname:餐宴开单
 */
~(function () {
  "use strict";
  //初始化
  let
    bqReserveId_ = 0,//预订订转 开单情况下，  id为预订id
    bqRestaurantIdForOrder_ = 0,//预订时候的会馆id[用于刷新预订时候的会馆信息]
    restaurantId_ = 0;//会馆id【用于 根据会馆id 刷新餐宴图 】
  //餐厅
  $('#restaurant_createBilling').combobox({
    url: '../banquet/listRestaurant',
    queryParams: {
      restaurantName: "", banquetLocationId: 0,
      offset: 0, limit: 9999
    },
    valueField: 'restaurantId',
    textField: 'restaurantName',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    editable: false
  });
  //宾客手机
  $('#guestPhone_createBilling').numberbox({
    validType: 'mobilephone',
    invalidMessage: "手机号码格式不正确！",
    delay: 1000,
    tipPosition: 'top',
    validateOnCreate: false,
    validateOnBlur: true
  });
  //宾客姓名
  $('#guestName_createBilling').textbox({
    delay: 1000,
    //		validType:'name',
    //		invalidMessage:"姓名请输入中文或英文",
    validateOnCreate: false,
    validateOnBlur: true
  });
  //人数
  $('#guestNum_createBilling').numberspinner({
    min: 0
  });
  //客源
  $('#channel_createBilling').combobox({
    url: '../channel/pglist',
    queryParams: {
      channelName: '',
      offset: 0,
      limit: 9999,
      usageState: 1
    },
    valueField: 'channelId',
    textField: 'channelName',
    panelHeight: 'auto',
    panelMaxHeight: 200,
    editable: false,
    onLoadSuccess(data) {
      console.info(data);
      let this_ = this;
      data.forEach(function (value, key, obj) {
        if (value.channelName == "非会员") {
          $(this_).combobox('setValue', value.channelId);
          $(this_).combobox('setText', value.channelName);
          return;
        }
      });
    },
    loadFilter: (data) => {
      let _data = [];
      $.each(data, function (i, item) {
        if (item.channelName != "驿宝") {
          _data.push(data[i]);
        }
      });
      return _data;
    }
  });
  //备注
  $('#remark_createBilling').textbox({
    multiline: true,
    validateOnCreate: false,
    validateOnBlur: true,
    validType: 'maxLength[10]',
    invalidMessage: "最多输入10个字符！",
    delay: 1000
  });
  /////////////////sessionStorage//////////////////////////
  const banquentChartToCreateBillPage_ = sessionStorage.getItem('banquentChartToCreateBillPage');
  if (banquentChartToCreateBillPage_) {
    const banquentChartToCreateBillPage = JSON.parse(banquentChartToCreateBillPage_);
    console.info(banquentChartToCreateBillPage);
    sessionStorage.removeItem("banquentChartToCreateBillPage");
    if (banquentChartToCreateBillPage.hasOwnProperty("bqReserveId")) {
      bqReserveId_ = banquentChartToCreateBillPage.bqReserveId;
      bqRestaurantIdForOrder_ = banquentChartToCreateBillPage.bqRestaurantId;
    }
    if (bqReserveId_) {
      $('#orderFlag_createBilling').text('预订开单');
      $('#guestPhone_createBilling').textbox('setValue', banquentChartToCreateBillPage.guestPhone);
      $('#guestName_createBilling').textbox('setValue', banquentChartToCreateBillPage.guestName);
      $('#guestNum_createBilling').numberspinner('setValue', banquentChartToCreateBillPage.peopleNumer);
      $('#remark_createBilling').textbox('setValue', banquentChartToCreateBillPage.remark);
    }
    if (banquentChartToCreateBillPage.hasOwnProperty('bqRestaurantName')) {
      $('#restaurant_createBilling').combobox('setValue', banquentChartToCreateBillPage.bqRestaurantId);
      $('#restaurant_createBilling').combobox('setText', banquentChartToCreateBillPage.bqRestaurantName);
    } else {
      $('#restaurant_createBilling').combobox('setValue', banquentChartToCreateBillPage.restaurantId);
      $('#restaurant_createBilling').combobox('setText', banquentChartToCreateBillPage.restaurantName);
    }

  }
  ////////////////////////////////////////////////////////
  //提交回调fun
  function submitCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      $('#restaurant_createBilling').combobox('clear');
      $('#guestPhone_createBilling').numberbox('clear');
      $('#guestName_createBilling').textbox('clear');
      $('#guestNum_createBilling').numberspinner('clear');
      let channelData = $('#channel_createBilling').combobox('getData');

      channelData.forEach(function (item, key, obj) {
        if (item.channelName == "非会员") {
          console.info("feihuiyuan")
          $('#channel_createBilling').combobox('setValue', item.channelId);
          $('#channel_createBilling').combobox('setText', item.channelName);
        }
      });
      $('#remark_createBilling').textbox('clear');

      $.messager.show({ title: '系统提示', msg: '新建账单成功！', timeout: 3000, showType: 'slide' });
      //刷新餐宴图/餐宴预订图
      if (bqReserveId_) {
        eapor.utils.freshChart_banquet_scheduled(
          JSON.stringify([
            { type: -2, bqRestaurantId: restaurantId_ },
            { type: -3, bqRestaurantId: bqRestaurantIdForOrder_ }
          ]));
      } else {
        eapor.utils.banquetChart_successRefreshType(restaurantId_);
      }
      return;
    }
    if (result == -1) {
      $.messager.show({ title: '系统提示', msg: '该餐厅不存在！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result == -2) {
      $.messager.show({ title: '系统提示', msg: '该餐厅不允许开台！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (result == -3) {
      $.messager.show({ title: '系统提示', msg: '会员开单时手机号码不可为空！', timeout: 3000, showType: 'slide' });
      return;
    }
    $.messager.show({ title: '系统提示', msg: '新建账单失败！', timeout: 3000, showType: 'slide' });
  }

  //搜索回调fun
  function searchCallback(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result && typeof result === 'object') {
      $('#guestName_createBilling').textbox('setValue', result.nickname);
      let channelId = 0;
      const arr = $('#channel_createBilling').combobox('getData');
      arr.forEach(item => {
        if (item.channelName === "会员") {
          channelId = item.channelId;
        }
      });
      $('#channel_createBilling').combobox('setValue', channelId);
      $('#channel_createBilling').combobox('setText', '会员');
      return;
    }
    $.messager.show({ title: '系统提示', msg: '未查询到该手机号所对应的会员信息！', timeout: 3000, showType: 'slide' });

  }

  //搜索btn
  $('#search_searchVIPInfo').on('click', function () {
    if (!$('#guestPhone_createBilling').numberbox('isValid')) {
      $('#guestPhone_createBilling').numberbox('textbox').focus();
      return;
    }
    let phone = $('#guestPhone_createBilling').numberbox('getValue');
    if (!phone) {
      $('#guestPhone_createBilling').numberbox('textbox').focus();
      $.messager.show({ title: '系统提示', msg: '请先输入手机号码！', timeout: 3000, showType: 'slide' });
      return;
    }
    console.info(phone);
    eapor.utils.defaultAjax("../hotel/getUsersByPhone", { phone: phone }, searchCallback);
  });
  let createBillFastClick = false;
  //新建btn
  $('#submit_createBilling').on('click', function () {
    if (createBillFastClick) {
      return;
    }

    //手机
    if (!$('#guestPhone_createBilling').numberbox('isValid')) {
      $('#guestPhone_createBilling').numberbox('textbox').focus();
      return;
    }
    //姓名
    if (!$('#guestName_createBilling').textbox('isValid')) {
      $('#guestName_createBilling').textbox('textbox').focus();
      return;
    }
    //备注
    if (!$('#remark_createBilling').textbox('isValid')) {
      $('#remark_createBilling').textbox('textbox').focus();
      return;
    }
    let subDate = {
      bqReserveId: bqReserveId_,
      banquetRestaurantId: $('#restaurant_createBilling').combobox('getValue') || 0,//餐厅会馆id
      phone: $('#guestPhone_createBilling').numberbox('getValue'),//宾客手机号，可以为""，当值为""时，客源不可以是【会员】
      guestName: $('#guestName_createBilling').textbox('getValue'),//宾客姓名，可以为""
      peopleNumber: $('#guestNum_createBilling').numberspinner('getValue') || 0,//人数
      channelId: $('#channel_createBilling').combobox('getValue'),//客源id
      remark: $('#remark_createBilling').textbox('getValue'),//备注，10字以内
    };
    const channelData_ = $('#channel_createBilling').combobox('getData');
    let channelFlag = 0;
    channelData_.forEach(function (value, key, obj) {
      if (value.channelName === "会员") {
        channelFlag = value.channelId;
        return;
      }
    });

    if (!subDate.phone && (channelFlag && subDate.channelId == channelFlag)) {
      $('#guestPhone_createBilling').numberbox('textbox').focus();
      $.messager.show({ title: '系统提示', msg: '会员开单时手机号码不可为空！', timeout: 3000, showType: 'slide' });
      return;
    }
    createBillFastClick = true;
    $('#submit_createBilling').linkbutton('disable');

    $.ajax({
      type: 'post',
      url: '../banquetBill/createBanquetReception',
      data: subDate,
      dataType: 'json'
    })
      .done(function (data, textStatus, jqXHR) {
        restaurantId_ = subDate.banquetRestaurantId;
        submitCallback(data);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        $.messager.alert("系统提示", "网络连接中断");
        return;
      })
      .always(function () {
        createBillFastClick = false;
        $('#submit_createBilling').linkbutton('enable');
      });
  });

})();