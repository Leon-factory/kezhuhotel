//------------在住宾客--------------------
~(function () {
  "use strict";
  /*证件类型加载*/
  $('#entourageGuestCardType').combobox({
    data: eapor.hotel.certificateTypeObj,
    valueField: 'certificate_type_code',
    textField: 'certificate_type_name'
  });
  //数据列表
  $('#tab_livingguest').datagrid({
    title: '在住宾客', 		//表格标题
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
    url: '../guest/getAllLivingGuest',
    queryParams: {
      guestName: "",
      roomCode: ""
    },
    onLoadSuccess: function (data) {
      if (!data.rows.length) {
        eapor.utils.messagerInfoBySearchEmpty('tab_livingguest', 'roomCode', 7, 0);
        //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
      }
    },
    columns: [[
      { field: 'roomCode', title: '房号', width: 20, align: 'center' },
      { field: 'guestName', title: '宾客姓名', align: 'center', width: 20 },
      {
        field: 'enterTime', title: '入住时间', align: 'center', width: 20,
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      {
        field: 'expectedLeaveTime', title: '计划退房时间', align: 'center', width: 20,
        formatter: function (value, row, index) {
          console.info(row)
          return getDate(value);
        }
      },
      { field: 'phone', title: '手机号码', align: 'center', width: 20 },
      {
        field: 'certificateType', title: '证件类型', align: 'center', width: 20,
        formatter: function (value, row, index) {
          console.info(value);
          console.info(row);
          $.each(eapor.hotel.certificateTypeObj, function (i, item) {
            if (value == item.certificate_type_code) {
              value = item.certificate_type_name;
              return;
            }
          });
          return value;
        }
      },
      { field: 'certificateCode', title: '证件号码', align: 'center', width: 20 }
    ]]
  });

  //搜索按钮
  $('#searchLivingGuestByRoomIdOrGuestName').click(function () {
    $('#tab_livingguest').datagrid('load', {
      roomCode: $('#ipt_roomId_livingGuest').val(),
      guestName: $('#ipt_guestName_livingGuest').val()
    });
  });
  $('#addfollowguest1').on('click', function () {
    addfollowguest(1);
  });
  $('#addfollowguest2').on('click', function () {
    addfollowguest(2);
  });
  //添加随住客人按钮
  function addfollowguest(value) {
    var roomInfo = $('#tab_livingguest').datagrid('getSelected');
    if (!roomInfo || roomInfo.roomCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择房间！', timeout: 2000, showType: 'slide' });
      return;
    } else {
      $('#addFollowGuestDiv').append(
        '<div id="addFollowGuestDivDialog" style="padding:30px 60px;">' +
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
        //				validType:'name',
        missingMessage: "姓名不能为空！",
        //				invalidMessage:"姓名格式不正确！如：张三或Tony！",
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
          type: 'living_guest_jsp_send'
        };
        console.info(readIdCardFirstData);
        eapor.utils.defaultAjax('../transmit/readIdCardFirst', readIdCardFirstData, readIdCardFirstCallBack)
      });
      $("#addFollowGuestDivDialog").dialog({
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

            var enData = eapor.utils.commonFunctionByAddFollowGuestInfo(2);
            if (enData == undefined) {
              return;
            }
            enData.roomId = roomInfo.roomId;
            enData.roomCode = roomInfo.roomCode;
            $('#hidden_roomOpenJSPAddGuestInfo').val(JSON.stringify(enData));

            var add_flDataInfoArr = [];//从客列表
            //接口总参数
            var add_flData = {};
            add_flDataInfoArr.push(enData);
            add_flData.isPrimary = 0;//
            add_flData.livingguestjoin = JSON.stringify(add_flDataInfoArr);//从客信息
            console.info(add_flData.livingguestjoin);
            $.ajax({
              type: 'post',
              url: '../room/selectRoomList',
              dataType: 'json',
              data: { roomCode: roomInfo.roomCode, roomtypeId: 0, floorId: 0, roomstates: "" }
            })
              .done(function (data) {
                add_flData.receptionId = data[0].receptionId;
                console.info(add_flData);
                $.ajax({
                  type: 'post',
                  url: '../guest/AddLivingguest',
                  data: add_flData,
                  success: function (result) {
                    console.info(result);
                    if (result != -201 && result != -111 && result > 0) {
                      $.messager.show({ title: '系统提示', msg: '添加成功！', timeout: 2000, showType: 'slide' });

                      $('#addFollowGuestDivDialog').dialog('close');
                      $('#tab_livingguest').datagrid('reload');
                      if (value == 2) {//添加随住客人并制卡
                        $.messager.confirm('系统提示', '是否跳转到制卡页面？', function (r) {
                          if (r) {
                            eapor.utils.ifHaveJSPThenCloseThis();
                          }
                        });
                      }
                    } else {
                      $.messager.show({ title: '系统提示', msg: '添加失败！', timeout: 2000, showType: 'slide' });
                    }
                  }
                });//ajax 2end
              });
          }
        },
        {
          text: '取消',
          handler: function () {
            $('#addFollowGuestDivDialog').dialog('close');
          }
        }]
      })
    }
  };
})();