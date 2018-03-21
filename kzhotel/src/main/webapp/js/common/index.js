/**
 * @JSname:indexJS
 * 读卡第一步：
1：	成功
-1：	数据存入mongo失败

读卡第二步：
comIdentity：	1
comInfo：	199 卡号为空
		101 读卡成功
		198 卡内信息为空

--------------------------------------------

开卡第一步：
-1：	存入mongo失败
-2：	酒店标识未设置
-3：	房间未设置锁号

开卡第二步：


开卡第三步：
comIdentity：	1
comInfo：	199 卡号为空
		102 开卡成功


开卡失败：
comIdentity：	1
comInfo：	198 卡内信息为空
		197 开卡失败
		196 检测不到卡
		195 不是用户卡
		194 未知错误
----------------------------------------------

注销卡第一步：
-1：	存入mongo失败

注销卡第二步：
comIdentity：	1
comInfo:	103 注销成功
		193 注销失败

--------------------------------------------------

读取身份证第一步：
-1：	存入mongo失败

读取身份证第二步：


读取身份证第三步：
ComIdentity：	2
comInfo：	201 读取身份证成功


读取身份证失败：
ComIdentity：	2
comInfo：	299 设备未找到
		298 未知错误
		
 */
~(function ($, eapor) {
	/*console.info = function(v){
		
	};*/
  //给easyui 时间控件添加 清空按钮 
  $.fn.datebox.defaults.buttons.splice(1, 0, {
    text: "清空",
    handler(datebox) {
      $(datebox).datebox("clear")
    }
  });

  $.fn.datetimebox.defaults.buttons.splice(2, 0, {
    text: "清空",
    handler(datetimebox) {
      $(datetimebox).datetimebox("clear")
    }
  });
  //根据浏览器路径，启动相应exe
  (function (hostname) {
    var stragtegy = {
      '127.0.0.1'() {
        eapor.data.exenum = 100;
        eapor.data.wsnum = 1;
      },
      'localhost'() {
        eapor.data.exenum = 100;
        eapor.data.wsnum = 1;
      },
      'dbinner.kezhu.net'() {
        eapor.data.exenum = 1200;
        eapor.data.wsnum = 2;
      },
      'test.kezhu.net'() {
        eapor.data.exenum = 1200;
        eapor.data.wsnum = 2;
      },
      'www.kezhu.net'() {
        eapor.data.exenum = 1500;
        eapor.data.wsnum = 3;
      },
      '106.15.48.28'() {
        eapor.data.exenum = 1300;
        eapor.data.wsnum = 4;
        window.console.info = function () { }
      },
      'www.eapor.com'() {
        eapor.data.exenum = 1300;
        eapor.data.wsnum = 4;
        window.console.info = function () { }
      },
      'eapor.com'() {
        eapor.data.exenum = 1300;
        eapor.data.wsnum = 4;
        window.console.info = function () { }
      }
    }
    stragtegy[hostname]();
  })(window.location.hostname);
  /**/
  $.ajax({
    type: 'post',
    url: '../hotel/getKezhuShopId',
    dataType: 'json',
    data: {}
  })
    .done(function (result) {
      console.info('getKezhuShopId:', result);
      sessionStorage.setItem('KezhuShopId', result);
    });
  /*客源Obj*/  //#####2016年12月19日11:36:34##### -----last edit by cxt
  $.ajax({
    type: 'post',
    url: '../channel/pglist',
    dataType: 'json',
    data: { offset: 0, limit: 9999, channelName: '', usageState: 1 }
  })
    .done(function (result) {
      eapor.data.channelObj = result;
    });
  /*房间类型 【结果为后台添加的所有数据】Obj*/  //#####2016年12月19日11:36:34##### -----last edit by cxt
  $.ajax({
    type: 'post',
    url: '../roomtype/lrtc',
    data: { limit: 9999, offset: 0, roomtypeName: '' },
    dataType: 'json'
  })
    .done(function (result) {
      eapor.data.roomtypeObj = result;
    });

  $.ajax({
    type: 'post',
    url: '../hotel/hotelbyid',
    data: {},
    dataType: 'json'
  })
    .done(function (result) {
      eapor.data.hotel = result;
      $('#menu_hotelName').text(result.businessName);
    });

  /*支付类型Obj*/  //#####2016年12月19日11:36:34##### -----last edit by cxt
  $.ajax({
    type: 'post',
    url: "../syspara/getPaymethodJson",//paymethod_code 1 paymethod_name 现金
    dataType: 'json'
  })
    .done(function (result) {
      eapor.data.PaymethodObj = result;

      $.ajax({
        type: 'post',
        url: '../channel/getAgentCollectionList',
        data: {},
        dataType: "json"
      })
        .done(function (result) {
          eapor.data.otherPaymethod = result;
          for (let i = 0; i < eapor.data.PaymethodObj.length; i++) {
            eapor.data.getNewPaymethodAddOtherPaymenthod.push(eapor.data.PaymethodObj[i]);
          }
          if (eapor.data.otherPaymethod.length > 0) {
            for (let i = 0; i < eapor.data.otherPaymethod.length; i++) {
              eapor.data.getNewPaymethodAddOtherPaymenthod.push(eapor.data.otherPaymethod[i]);
            }
            for (let i = 0; i < eapor.data.getNewPaymethodAddOtherPaymenthod.length; i++) {
              if (eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodCode) {
                eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethod_code =
                  eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodCode;
                eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethod_name =
                  eapor.data.getNewPaymethodAddOtherPaymenthod[i].paymethodName;
              }
            }
          }
        });
    });


  $(function () {
		/*let timeOut_ = 0;
		let wst = null;*/
    //定时刷新session 使session不过期
    const audio = document.querySelector('#audio');
    setInterval(() => {
      $.ajax({
        type: 'post',
        url: '../user/refreshSession',
        data: {},
        dataType: 'json'
      })
        .done((result) => {
          console.info('刷新session');
        })
        .fail((result) => {
          console.info('刷新session请求失败');
        });
			/*if(spring_websocket){
				spring_websocket.send('websocket_success_msg');
				
			}else{
				webSocketInit();
			}*/
      //			 wst = setInterval(()=>{
      //				 console.info(timeOut_);
      //				if(timeOut_ === 20){
      //					$.messager.alert('系统提示','网络已断开，请从新连接'); 
      //					clearInterval(wst);
      //				}
      //				timeOut_ += 1;
      //			}, 1000);
    }, 600000);
    //10000);
    //600000);//10分钟倒计时
    //请求房价数据
    $.ajax({
      type: 'post',
      url: '../rentprice/getRentpriceListByHotelId',
      data: { roomTypeId: 0, rentplanId: 0 },
      dataType: 'json'
    })
      .done(function (result) {
        eapor.data.index_roomPriceData = JSON.stringify(result);
      });

    $.ajax({
      type: 'post',
      url: '../syspara/getConfigByHotelId',
      data: {},
      dataType: 'json'
    })
      .done(function (result) {
        $('#index_ruleData').val(JSON.stringify(result));
      });

		/**
		 * @use:加载菜单
		 * @ps:二级菜单、三级菜单在eapor_common.js中调取方法，菜单Data在eapor_common.js中预先设置
		 */
    var roleList = JSON.parse($('#roleList').val());
    var roleMap = JSON.parse($('#roleMap').val());

    eapor.roleList = roleList;
    eapor.roleMap = roleMap;
    var newmenu;
    var num = 0;
    $.each(eapor.data._menu, function (i, item) {
      newmenu = "";
      $.each(item, function (j, m) {
        num++;
        newmenu = "<div id='mc" + num + "' style='display:none' class='easyui-menu'>";
        var nn = "";
        $.each(m, function (x, y) {
          if (eapor.getIsMenu(y.id)) {
            nn += " <div id='" + y.id + "' name='addPanel_menu'>" + y.name + "</div> ";
          } else {
            if (num == 9) {
              nn += " <div id='" + y.id + "' >"
                + "<a href='../home/client/" + y.id + ".jsp' target=\"_blank\" style='color:#333333;text-decoration:none;'>" + y.name + "</a>"
                + "</div> ";
            }
          }
        });
        if (nn != "") {
          newmenu += nn;
          $("#kezhunetmainindex").append($(newmenu));
        }
      })
    });

    var newmenuchild = eapor.utils.index_topSet();
    var newmenuchildReport = eapor.utils.index_topReport();
    $("#kezhunetmainindex").append($(newmenuchildReport));
    $("#kezhunetmainindex").append($(newmenuchild));
    $('div[name="addPanel_menu"]').on('click', function () {
      eapor.utils.addPanel(this);
    });

    $('#kzmaintable').tabs({
      onContextMenu(e, title, index) {
        e.preventDefault();
        $('#index_close').menu('show', {
          left: e.pageX,
          top: e.pageY
        }).data("index", index);
        $("#index_close").menu({
          onClick(item) {
            eapor.utils.closeTab(this, item.name, title);
          }
        });
      },
      onSelect(title, index) {
        if (title == "开房") {
          eapor.dlgcleanflag = "dlgopenclean";
          return true;
        }

        if (title == "换房") {
          eapor.dlgcleanflag = "dlgchangeclean";
          return true;
        }
      },

      onClose(title, index) {
        if (title == "续房") {
          $('#continueRoomData').val("");
          $('#index_pubRoomData').val("");
          sessionStorage.removeItem("roomPriceDetails_continueRoom");
        }
        if (title == "加单") {
          $('#index_pubRoomData').val("");
        }
        if (title == "退房") {
          $('#exitRoomData').val("");
          $('#index_pubRoomData').val("");
        }
        if (title == "换房") {
          $('#changeRoomData').val("");
          $('#index_pubRoomData').val("");
        }
        if (title == "开房") {
          $('#index_pubRoomData').val("");
          $('#openRoomData').val("");
          sessionStorage.removeItem("openRoomSceneFlag");
          sessionStorage.removeItem("roomPriceDetails_roomOpen");
        }
      }
    });

    //退出按钮
    $('#indexquit').on("click", function () {
      $.ajax({
        type: 'post',
        url: '../user/exit',
        data: {},
        dataType: 'json',
      })
        .done(function (result) {
          console.info(result);
          if (result.errCode >= 0) {
            if (window.location.hostname === 'localhost') {
              window.location.href = "../";
            } else {
              window.location.href = "../../";
            }
          }
        })
        .fail(function (error) {
          console.info(error);
        });
    });

    $('#mc1').length > 0 ?
      $('#menuidfrontroom').menubutton({ iconCls: 'icon-filter', menu: "#mc1" }) : $('#menuidfrontroom').hide();
    //前台菜单
    $('#mc1').length > 0 ?
      $('#menuidfrontroom').menubutton({ iconCls: 'icon-filter', menu: "#mc1" }) : $('#menuidfrontroom').hide();
    //餐宴菜单
    $('#mc2').length > 0 ?
      $('#menuidbanquet').menubutton({ iconCls: 'icon-large-picture', menu: "#mc2" }) : $('#menuidbanquet').hide();
    //预订菜单
    $('#mc3').length > 0 ?
      $('#menuidbooking').menubutton({ iconCls: 'icon-large-picture', menu: "#mc3" }) : $('#menuidbooking').hide();
    //宾客菜单
    $('#mc4').length > 0 ?
      $('#menuidguest').menubutton({ iconCls: 'icon-man', menu: "#mc4" }) : $('#menuidguest').hide();
    //客户关系菜单
    $('#mc5').length > 0 ?
      $('#menuidrelationcustom').menubutton({ iconCls: 'icon-large-clipart', menu: "#mc5" }) : $('#menuidrelationcustom').hide();
    //当班菜单
    $('#mc6').length > 0 ?
      $('#menuidonduty').menubutton({ iconCls: 'icon-large-smartart', menu: "#mc6" }) : $('#menuidonduty').hide();
    //账务菜单
    $('#mc7').length > 0 ?
      $('#menuidtransaction').menubutton({ iconCls: 'icon-reload', menu: "#mc7" }) : $('#menuidtransaction').hide();
    //库存菜单
    $('#mc8').length > 0 ?
      $('#menuidstock').menubutton({ iconCls: 'icon-large-shapes', menu: "#mc8" }) : $('#menuidstock').hide();
    //内部菜单
    $('#mc9').length > 0 ?
      $('#menuidhiddenmenu').menubutton({ menu: "#mc9" }) : $('#menuidhiddenmenu').hide();
    //设置菜单
    $('#mc10').length > 0 ?
      $('#menuidset').menubutton({ iconCls: 'icon-sum', menu: "#mc10" }) : $('#menuidset').hide();
    //报表菜单
    $('#mc11').length > 0 ?
      $('#menuidreport').menubutton({ iconCls: 'icon-large-chart', menu: "#mc11" }) : $('#menuidreport').hide();
    //有权限情况下，自动打开房态图
    if (eapor.getIsMenu('room_open')) {
      $('#room_status').trigger('click');
    }
    //websocket
    let spring_websocket = null;

    function webSocketInit() {
      if (window.WebSocket) {
        if ("http:" == window.location.protocol) {
          spring_websocket = new WebSocket("ws://" + window.location.host + "/kzhotel/marco");
        }
        if ("https:" == window.location.protocol) {
          spring_websocket = new WebSocket("wss://" + window.location.host + "/kzhotel/marco");
        }
      }

      //连接发生错误的回调方法
      spring_websocket.onerror = function (event) {
        console.info('websocket_onerror')
      }

      //连接成功建立的回调方法
      spring_websocket.onopen = function (event) {
        console.info("success");
      }

      //接收到消息的回调方法
      spring_websocket.onmessage = function (event) {
        console.info("接收到消息的", event);
        if (event.data === 'websocket_success_msg') {
          console.info('websocket成功返回')
          /*console.info(timeOut_);
          clearInterval(wst);*/
          return;
        }
        if (event.data === 'haveNewOrder') {
          console.info('haveNewOrder')
          audio.play();
          $.messager.show({
            title: '系统提示',
            msg: `<span style="font-size:16px;color:green;">您有新的会员预订单！</span>`,
            timeout: 3000,
            showType: 'slide'
          });
          /*console.info(timeOut_);
          clearInterval(wst);*/
          return;
        }
        eapor.data.index_eventCode = md5($('#indexhotelId').val() + $('#indexuserId').val() + new Date().getTime());
        eapor.createCard.hrefUrl_open2 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(2)) + "," + eapor.data.index_eventCode;
        eapor.createCard.hrefUrl_open3 = "kzlockcarder://" + (Number(eapor.data.exenum) + Number(3)) + "," + eapor.data.index_eventCode;
        $('#ifid2').attr('src', eapor.createCard.hrefUrl_open2);
        $('#ifid3').attr('src', eapor.createCard.hrefUrl_open3);

        $('#tab_guestRoom').datagrid('loadData', { total: 0, rows: [] });
        eapor.createCard.data = {};
        eapor.createCard.hrefUrl_open = "javascript:;";
        $('#btn_createCard_open').attr('href', eapor.createCard.hrefUrl_open);
        eapor.createCard.loadDataArr = [];
        eapor.createCard.loadData = {};
        //返回 JSON.parse(event.data).conIdentity 为1表示 是返回的门卡的信息 ， 2为 返回的为身份证的信息
        let comIdentity = 0;
        if (typeof event.data === 'string' && event.data !== 'null') {
          if (JSON.parse(event.data).hasOwnProperty('comIdentity')) {
            comIdentity = +JSON.parse(event.data).comIdentity;
          }
        }

        if (comIdentity === 1) {
          const comInfo = JSON.parse(event.data).comInfo;
          if (comInfo == "102") {
            $.messager.alert('系统提示', '开卡成功！');
          } else if (comInfo == "103") {
            $.messager.alert('系统提示', '注销卡成功！');
          } else if (comInfo == "193") {
            $.messager.alert('系统提示', '注销卡失败！');
          } else if (comInfo == "101") {
            //读卡flag， 在制卡页面显示数据时候，能区分是读卡得到的数据还是一开始选择房间得到的数控
            sessionStorage.setItem('isReadCard', 'isReadCard');
            $('#tab_guestRoom').datagrid({ data: [JSON.parse(event.data)] });
            $('#tab_guestRoom').datagrid("reload");
            $.messager.alert('系统提示', '读卡成功！');
          } else if (comInfo == "194") {
            $.messager.alert('系统提示', '未知错误！');
          } else if (comInfo == "197") {
            $.messager.alert('系统提示', '开卡失败！');
          } else if (comInfo == "196") {
            $.messager.alert('系统提示', '检测不到卡！');
          } else if (comInfo == "198") {
            $.messager.alert('系统提示', '卡内信息为空！');
          } else if (comInfo == "195") {
            $.messager.alert('系统提示', '不是用户卡！');
          } else if (comInfo == "199") {//注销时返回的
            $.messager.alert('系统提示', '卡号为空！');
          }
        } else if (comIdentity === 2) {
          const eventData = JSON.parse(event.data);
          const comInfo = eventData.comInfo;
          if (comInfo == "201") {//读取身份证成功
            $('#hidden_followGuestInfoByReadCard').val(event.data);
            const showResultInfoDiv = $('#showResultInfoDiv');
            const resultInfoDialog = '<div id="resultInfoDialog" style="display:none;padding:20px 30px;"></div>';
            showResultInfoDiv.append(resultInfoDialog);
            $('#resultInfoDialog').dialog({
              title: '身份信息',
              width: 610,
              height: 430,
              closed: false,
              cache: false,
              modal: true,
              href: '../client/common-showReadCardResult.jsp',
              onClose() {
                $(this).dialog('destroy');
              },
              onLoad() {
                $('#name_readCardResult').text(eventData.name);
                eventData.sex == 2 ? $('#sex_readCardResult').text('女') : $('#sex_readCardResult').text('男');
                //转换民族，调用了自己定义的方法，在roomStatus_utils.js中
                $('#nation_readCardResult').text(getNationIdReturnNationName(eventData.nation));
                $('#birthDay_readCardResult').text(getDateForHoliday(eventData.birthDay));
                $('#address_readCardResult').text(eventData.address);
                $('#idCode_readCardResult').text(eventData.idCode);
                $('#idIssue_readCardResult').text(eventData.idIssue);
                $('#effectiveBeginTime_readCardResult').text(getDateForHoliday(eventData.effectiveBeginTime).replace(/-/g, "."));
                $('#effectiveEndTime_readCardResult').text(getDateForHoliday(eventData.effectiveEndTime).replace(/-/g, "."));
                let _photoCode = JSON.parse(event.data).photoCode;
                if (_photoCode) {
                  const _arr = {
                    '1': "D:\\eapor_upload\\IDcard\\" + _photoCode,
                    '2': "http://test.kezhu.net/upload/IDcard/" + _photoCode,
                    '3': "http://www.kezhu.net/upload/IDcard/" + _photoCode,
                    '4': "http://www.eapor.com/upload/IDcard/" + _photoCode,
                  };
                  _arr['' + eapor.data.wsnum] && document.getElementById("photoInfo_readCardResult").setAttribute("src", _arr['' + eapor.data.wsnum]);
                }
              },
              buttons: [{
                text: '确定',
                handler() {
                  //用身份证号码 去后台查询是否为客主会员
                  console.info($('#idCode_readCardResult').val());
                  $.ajax({
                    type: 'post',
                    url: '../guest/getGuestByCertificate',
                    data: {
                      certificateType: 1,
                      certificateCode: $('#idCode_readCardResult').text()
                    },
                    dataType: 'json',
                    success(result) {
                      if (eapor.utils.ajaxCallBackErrInfo(result)) {
                        $.messager.alert('系统提示', '查询宾客身份信息是否为会员时，发生数据异常！');
                        //return;
                      }
                      /*-201: 证件类型不正确；
                        -701: 身份证号码格式不正确；
                        -1: 该用户不存在；*/
                      //查询到该宾客身份信息为会员
                      if (eventData.type === 'room_open_jsp_send') {
                        console.info(result);
                        if (typeof (result) === 'object') {
                          let vipFlag = true,
                            alertInfo = '<span style="color:red;font-size:16px;">查询到该宾客身份信息为<br><b>客主会员</b>！</span>';
                          if (!result.strbindphone) {
                            alertInfo = '<span style="color:red;font-size:16px;">查询到该宾客身份信息为<br><b>非客主会员</b>！</span>';
                            vipFlag = false;
                          }
                          $.messager.alert(
                            '系统提示',
                            alertInfo,
                            'info',
                            function () {
                              if (vipFlag) {//客主会员
                                //将客源改为会员
                                const channelCom = $('#north_guestsource_openroom');
                                const data = channelCom.combobox('getData');
                                $.each(data, function (i, item) {
                                  if ("会员" == item.channelName) {
                                    channelCom.combobox('setValue', item.channelId);
                                    channelCom.combobox('setText', item.channelName);
                                    return;
                                  }
                                });
                                //将手机号码改为绑定手机号码
                                $('#adden_phone').numberbox('setValue', result.strbindphone);
                              } else if (result.strphone) {//非客主会员
                                //将手机号码改为宾客手机号码
                                $('#adden_phone').numberbox('setValue', result.strphone);
                              }
                            }
                          );
                        }
                      }
                      $('#adden_name').textbox('setValue', $('#name_readCardResult').text());
                      $('#adden_sex').combobox('setValue', eventData.sex);
                      $('#adden_cardtype').combobox('setValue', "1");
                      $('#adden_cardtype').combobox('setText', "身份证");
                      $('#adden_cardcode').textbox('setValue', $('#idCode_readCardResult').text());

                      $('#adden_address').textbox('setValue', $('#address_readCardResult').text());
                      $('#resultInfoDialog').dialog('close');
                    }
                  });
                }
              }, {
                text: '取消',
                handler() {
                  $('#resultInfoDialog').dialog('close');
                }
              }]
            })

          } else if (comInfo == "299") {
            $.messager.alert('系统提示', '未检测到身份证！');
          } else if (comInfo == "298") {
            $.messager.alert('系统提示', '读取身份证未知的错误！');
          }
        } else {
          console.info(event);
          console.info(event.data);
          const roomRefresh = JSON.parse(event.data);
          if (typeof roomRefresh[0] === 'number') {//刷新房态
            const roomId1 = roomRefresh[0];
            const roomId2 = roomRefresh[1];
            console.info(roomId1);
            console.info(roomId2);
            if (!roomId2) {
              eapor.utils.defaultAjax("../room/getRoomById", { roomId: roomId1 }, window.roomOpen_getOneRoomState);
            } else {
              eapor.utils.defaultAjax("../room/getRoomById", { roomId: roomId1 }, window.roomOpen_getOneRoomState);
              eapor.utils.defaultAjax("../room/getRoomById", { roomId: roomId2 }, window.roomOpen_getOneRoomState);
            }
          }
          if (typeof roomRefresh[0] === 'object' && roomRefresh[0] instanceof Object) {
            roomRefresh.forEach(function (item, key, obj) {
              if (item.type === -2) {
                console.info('刷新餐宴图');
                if (window.banquetChart_getOneBlockState) {
                  eapor.utils.defaultAjax("../banquet/getBqRestaurantById",
                    { bqRestaurantId: item.bqRestaurantId }, window.banquetChart_getOneBlockState);
                }
              }
              if (item.type === -3) {
                console.info('刷新餐宴预订图');
                if (window.scheduledChart_getOneBlockState) {
                  eapor.utils.defaultAjax("../bqReserve/getBqReserveInfoByBqRestaurant",
                    { bqRestaurantId: item.bqRestaurantId }, window.scheduledChart_getOneBlockState);
                }
              }
            });
          }

          //					if(roomRefresh[2] == -1){
          //						
          //					}else if(roomRefresh[2] == -2){//刷新餐宴图
          //						const bqRestaurantId = roomRefresh[0];
          //						console.info('刷新餐宴图');
          //						if(window.banquetChart_getOneBlockState){
          //							eapor.utils.defaultAjax("../banquet/getBqRestaurantById",
          //									{bqRestaurantId: bqRestaurantId},window.banquetChart_getOneBlockState);
          //						}
          //					}else if(roomRefresh[2] == -3){
          //						const bqScheduledRestaurantId = roomRefresh[0];
          //						console.info(bqScheduledRestaurantId);
          //						console.info('刷新餐宴预订图');
          //						if(window.scheduledChart_getOneBlockState){
          //							eapor.utils.defaultAjax("../bqReserve/getBqReserveInfoByBqRestaurant",
          //									{bqRestaurantId: bqScheduledRestaurantId},window.scheduledChart_getOneBlockState);
          //						}
          //						
          //					}


        }
      }

      //连接关闭的回调方法
      spring_websocket.onclose = function (event) {
        console.info('websocket_onclose');
        //$.messager.alert('系统提示','网络已断开，请刷新页面，否则可能会丢失部分同步数据'); 
      }
    }
    webSocketInit();
    //window.spring_websocket = spring_websocket;
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
		/*window.onbeforeunload = function(event){
			console.info('onbeforeunload');
		}*/
  });
})(window.jQuery, window.eapor);


/*test
function dataEach(rentplanId,roomtypeId,checkinType,timeinterval){
	var data = JSON.parse(eapor.data.index_roomPriceData);//JSON.parse($('#index_roomPriceData').val());
	var array = new Array();	
	if(rentplanId>0){
		var rparr = new Array();
		$.each(data,function(r,rp){
		if(rentplanId==rp.rentplanId){
			rparr.push(rp);
				array = rparr;
			}
		})		
	}
	
	if(roomtypeId>0){
		var rtarr = new Array();
		$.each(array,function(r,rt){
			if(roomtypeId==rt.roomtypeId){
				rtarr.push(rt);
				array = rtarr;
			}
		})
	}
	
	if(checkinType>0){
		var ckarr = new Array();
		$.each(array,function(c,ck){
			if(checkinType==ck.checkinType){
				ckarr.push(ck);
				array = ckarr;
			}
		})
	}
	
	if(timeinterval>=0){
		var ttarr = new Array();
		$.each(array,function(t,tt){
			if(timeinterval==tt.timeinterval){
				ttarr.push(tt);
				array = ttarr;
			}
		})
	}
	console.info(array);
}

function dataTest(){
	
	var r = $('#hidden_rentplanId').val(); 
	if(r != null){
		var rentplanId = JSON.parse(r).rentplanId;
		var roomtype = $('#'+'cleanRoom_list'+ eapor.dlgcleanflag).datagrid('getSelected');
		var roomtypeId = 0;
		if(roomtype!=null){
			roomtypeId = roomtype.roomtypeId;
		}
		
		var checkinType = $('#checkInType_roomopen').combobox('getValue');
			//$('#tab_room_open').propertygrid('getData').rows[6].value;
		var i = $('#checkInTime_roomopen').textbox('getValue');
			//$('#tab_room_open').propertygrid('getData').rows[7].value;
		var timeinterval = 1;
		timeinterval = $('#hidden_isSpecial').val();
		dataEach(rentplanId,roomtypeId,checkinType,timeinterval);
	}
};*/


//------------------------------------------------------

/**
* @param starttime 入住时间 // 时间戳
* @param staynumber 居住单位
* @param roomtypeid 入住类型
* @param checkin 入住方式
* @param rentplan 房价方案
* @returns
*/
/*function LocalRentPrice(starttime,staynumber,roomtypeid,checkin,rentplan){
	var num =Math.abs( (starttime-new Date().getTime())/(1000*60*60*24));
	var staydays = localRentPrice.specials.slice(num,staynumber);
	var rp = localRentPrice.rentpriceJoins;
	var price = 0;
	for(let i=0;i<staydays.length;i++){
		$.each(rp,function(j,jtem){
			if(
					jtem.timeinterval==staydays[i] && 
					jtem.checkinType == checkin && 
					jtem.rentplanId == rentplan && 
					jtem.roomtypeId == roomtypeid
				){
				price+=jtem.price;
			}
		})
	}
	return price;
}
*/
