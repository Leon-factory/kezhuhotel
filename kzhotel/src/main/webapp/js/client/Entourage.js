~(function () {
  "use strict";
  var d_entourage = new Date().getTime();
  var id0_entourage = $('#entourage_roomInfo').attr('id');
  var id1_entourage = $('#entourage_showLivingRoomBtn').attr('id');
  var id2_entourage = $('#entourage_showLivingRoomListP').attr('id');
  var id3_entourage = $('#entourage_addEntourageDialogP').attr('id');
  var id4_entourage = $('#entourage_livingGuestList').attr('id');

  $('#entourage_roomInfo').attr('id', id0_entourage + d_entourage);
  $('#entourage_showLivingRoomBtn').attr('id', id1_entourage + d_entourage);
  $('#entourage_showLivingRoomListP').attr('id', id2_entourage + d_entourage);
  $('#entourage_addEntourageDialogP').attr('id', id3_entourage + d_entourage);
  $('#entourage_livingGuestList').attr('id', id4_entourage + d_entourage);

  var entourage_livingGuestListArray = [];
  var entourage_livingGuestListLoader = function (param, success, error) {
    var s = JSON.parse($('#entourage_roomInfo' + d_entourage).val());

		/*if(!$.isEmptyObject(entourage_livingGuestListArray))
		{
		success(entourage_livingGuestListArray);
		return true;
		}*/
    $.ajax({
      url: "../guest/listGuestByReceptionId",
      type: "post",
      data: { orderId: s.receptionId },
      dataType: "json",
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
        entourage_livingGuestListArray = data;
        //console.info(entourage_livingGuestListArray);
        success(entourage_livingGuestListArray);
      },
      error: function (err) {
        success([]);
        $.messager.show({ title: "系统提示", msg: '数据错误！', timeout: 2000, showType: 'slide' });
        return true;
      }
    });

  }
  $('#entourage_livingGuestList' + d_entourage).datagrid({
    //loader:entourage_livingGuestListLoader,
    title: '在住客人信息', 		//表格标题
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
    toolbar: [{
      text: "添加随住客人",
      iconCls: 'icon-add',
      handler: function () {
        entourage_add();
      }
    }],
    columns: [[
      { field: 'roomCode', width: 100, title: '房间号', align: 'center' },
      { field: 'guestName', width: 100, align: 'center', title: '客人姓名' },
      {
        field: 'certificateType', width: 100, align: 'center', title: '证件类型',
        formatter: function (value, row, index) {
          const certificateTypeObj = eapor.hotel.certificateTypeObj;
          certificateTypeObj.forEach(function (item, key, obj) {
            if (value == item.certificate_type_code) {
              value = item.certificate_type_name;
              return;
            }
          });
          return value;
        }
      },
      { field: 'certificateCode', align: 'center', width: 100, title: '证件号码' },
      { field: 'phone', width: 100, align: 'center', title: '联系电话' }
    ]]
  })
  /*添加随住客人的回调函数*/
  function entourage_addEntourageCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '添加成功！', timeout: 3000, showType: 'slide' });
      $("#entourage_addEntourageDialog").dialog('close');
      $('#entourage_livingGuestList' + d_entourage).datagrid('options').loader = entourage_livingGuestListLoader;
      $('#entourage_livingGuestList' + d_entourage).datagrid('reload');
      return;
    }
    $.messager.show({ title: '系统提示', msg: '添加失败！', timeout: 3000, showType: 'slide' });
  }

  /*添加随住客人*/
  function entourage_add() {
    if ($('#entourage_livingGuestList' + d_entourage).datagrid('getRows').length == 0) {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2800, showType: 'slide' });
      return;
    }
    $('#entourage_addEntourageDialogP' + d_entourage).append(
      '<div id="entourage_addEntourageDialog" style="padding:30px 60px;">' +
      '<div style="width:100%;max-width:320px;padding:30px 60px;margin:0 auto">' +
      '<a  id="readCard_addentourage">读取身份证信息</a>' +
      '<div style="margin-bottom:20px;margin-top:20px" >' +
      '<span style="display:inline-block;width:7%;">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;"><span style="color:red;font-size:18px;">*</span>姓名：&nbsp;&nbsp;</span>' +
      '<input id="adden_name"   style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:7%;">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;line-height: 24px;vertical-align: middle;">' +
      '<span style="color:red;font-size:18px;">*</span>性别：&nbsp;&nbsp;</span>' +
      '<input id="adden_sex" style="width:150px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:7%;t">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;"><span style="color:red;font-size:18px;">*</span>证件类型：&nbsp;&nbsp;</span>' +
      '<input id="adden_cardtype" style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:7%;">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;"><span style="color:red;font-size:18px;">*</span>证件号码：&nbsp;&nbsp;</span>' +
      '<input id="adden_cardcode"   style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:7%;">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;">手机：&nbsp;&nbsp;</span>' +
      '<input id="adden_phone" style="width:150px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<span style="display:inline-block;width:7%;">&nbsp;</span>' +
      '<span style="display:inline-block;width:24%;text-align:right;height:42px;line-height:32px;">地址：&nbsp;&nbsp;</span>' +
      '<input  id="adden_address" style="width:150px;"/>' +
      '</div>' +
      '<div style="display:none;">' +
      '<iframe id="ifReadCard" width="10px" height="10px"></iframe>' +
      '</div>' +
      '<div id="showResultInfoDiv"></div>' +
      '</div>' +
      '</div>'
    );
    $('#readCard_addentourage').linkbutton({});
    $('#adden_name').textbox({
      required: true,
      delay: 1000,
      //					validType:'name',
      missingMessage: "姓名不能为空！",
      //					invalidMessage:"姓名格式不正确！",
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#adden_sex').combobox({
      data: [{ "id": 1, "text": "男", "selected": true }, { "id": 2, "text": "女" }],
      valueField: 'id',
      textField: 'text',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200
    });

    $('#adden_cardtype').combobox({
      data: eapor.hotel.certificateTypeObj,
      valueField: 'certificate_type_code',
      textField: 'certificate_type_name',
      panelMaxHeight: 200,
      panelHeight: "auto",
      editable: false,
      onLoadSuccess: function (data) {
        var This = this;
        if (data.length > 0) {
          var flag = true;
          $.each(data, function (i, item) {
            if (item.certificate_type_name == "身份证") {
              flag = false;
              $(This).combobox('setValue', item.certificate_type_code);
              $(This).combobox('setText', item.certificate_type_name);
              return;
            }
          });
          if (flag) {
            $(This).combobox('setValue', data[0].certificate_type_code);
            $(This).combobox('setText', data[0].certificate_type_name);
          }
        }
      }
    });
    $('#adden_cardcode').textbox({
      required: true,
      missingMessage: "证件号码不能为空！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true,
      validType: "certificateType",
      invalidMessage: "身份证格式不正确！"
    });
    $('#adden_phone').numberbox({
      validType: 'mobilephone',
      invalidMessage: "手机号码格式不正确！如：13700001234",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#adden_address').textbox({
      multiline: true,
      validateOnCreate: false,
      validateOnBlur: true,
      validType: 'maxLength[32]',
      invalidMessage: "最多输入32个字符！",
      delay: 1000
    });
    var readCardEventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());//事件号
    console.info(readCardEventCode);
    var readCardComCode = $('#indexmd5').val(); //通讯号
    function readIdCardFirstCallBack(result) {
      console.info(result);

    }
    $('#readCard_addentourage').click(function () {
      //到exe
      var hrefUrl_readCard = "kzybidread://" + (Number(eapor.data.exenum) + Number(1)) + "," + readCardEventCode;
      console.info(hrefUrl_readCard);
      $('#ifReadCard').attr('src', hrefUrl_readCard);
      //到接口
      var readIdCardFirstData = {
        eventCode: readCardEventCode,
        comCode: readCardComCode,
        type: 'entourage_jsp_send'
      };
      console.info(readIdCardFirstData);
      eapor.utils.defaultAjax('../transmit/readIdCardFirst', readIdCardFirstData, readIdCardFirstCallBack)
    });
    $("#entourage_addEntourageDialog").dialog({
      title: '新增随住客人',
      width: 600,
      height: 550,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#adden_name').textbox('isValid')) {
            $('#adden_name').textbox('textbox').focus();
            return;
          }
          if (!$('#adden_cardcode').textbox('isValid')) {
            $('#adden_cardcode').textbox('textbox').focus();
            return;
          }
          if (!$('#adden_phone').numberbox('isValid')) {
            $('#adden_phone').numberbox('textbox').focus();
            return;
          }
          if (!$('#adden_address').textbox('isValid')) {
            $('#adden_address').textbox('textbox').focus();
            return;
          }
          var roomInfo = JSON.parse($('#entourage_roomInfo' + d_entourage).val());
          console.info(roomInfo);
          var data = {
            receptionId: roomInfo.receptionId,
            isPrimary: 0
          };
          var enarr = [];
          var enData = {
            guestName: $('#adden_name').textbox('getValue'),
            firstName: "",
            lastName: "",
            phone: $('#adden_phone').numberbox('getValue'),
            address: $('#adden_address').val(),
            certificateType: $('#adden_cardtype').combobox('getValue'),
            certificateCode: $('#adden_cardcode').textbox('getValue'),
            sexCode: $('#adden_sex').combobox('getValue'),
            nation: "",
            startTimeLimit: new Date(getNowFormatDate()),
            stopTimeLimit: new Date(getNowFormatDate()),
            issuedOffice: "",  // 签发机关
            birthday: new Date(getNowFormatDate()),
            photo: "",
            roomId: roomInfo.roomId,
            roomCode: roomInfo.roomCode,
            guestId: 0
          };
          enarr.push(enData);

          data.livingguestjoin = JSON.stringify(enarr);
          console.info(data);
          eapor.utils.defaultAjax('../guest/AddLivingguest', data, entourage_addEntourageCallback);

        }
      }, {
        text: '取消',
        handler: function () {
          $('#entourage_addEntourageDialog').dialog('close');
        }
      }]
    })
  }

  $('#entourage_livingGuestList' + d_entourage).datagrid({});
  /*获取房间所有在住客人信息*/
  function entourage_getRoomGuestCallback() {
    var s = JSON.parse($('#entourage_roomInfo' + d_entourage).val());
    $('#entourage_livingGuestList' + d_entourage).datagrid('options').loader = entourage_livingGuestListLoader;
    $('#entourage_livingGuestList' + d_entourage).datagrid('reload');
    //loader:entourage_livingGuestListLoader,
  }

  /*点击dialog的保存按钮*/
  function entourage_saveRoomInfo() {
    var select = $('#livingRoom_list').datagrid('getSelected');
    if (!select) {
      $.messager.show({ title: '系统提示', msg: '请选择房间', timeout: 2000, showType: 'slide' });
      return;
    }
    $('#entourage_roomInfo' + d_entourage).val(JSON.stringify(select));
    $('#entourage_showLivingRoom').dialog('close');
    entourage_getRoomGuestCallback();
  }
  $('#entourage_showLivingRoomBtn' + d_entourage).on('click', function () {
    entourage_showLivingRoomList();
  });
  /*显示在住房间列表*/
  function entourage_showLivingRoomList() {
    console.info('entourage')
    $('#entourage_showLivingRoomListP' + d_entourage).append(`
				<div id="entourage_showLivingRoom"></div>
		`);
    $('#entourage_showLivingRoom').dialog({
      title: '全部在住房间信息',
      width: 980,
      height: 580,
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
          entourage_saveRoomInfo();
        }
      }, {
        text: '取消',
        handler: function () {
          $('#entourage_showLivingRoom').dialog('close');
        }
      }]
    });
  }

  function entourage_getRoomInfo(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    $.each(result, function (i, item) {
      $('#entourage_roomInfo' + d_entourage).val(JSON.stringify(item));
    })
    entourage_getRoomGuestCallback();
  }


  var en = eapor.data.indexEntourageList;
  if (en == "") {
    $('#entourage_showLivingRoomBtn' + d_entourage).trigger('click');
  } else {
    en = JSON.parse(en);
    eapor.data.indexEntourageList = "";
    eapor.utils.defaultAjax("../rent/listRentByReceptionId", { receptionId: en.receptionId, livingStates: "1" }, entourage_getRoomInfo);
  }
})();