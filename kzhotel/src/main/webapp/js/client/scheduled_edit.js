/**
 *@JSname:预订编辑
 */
~(function (window) {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_schedulEdit");

  var pubjsonfirst_scheduledEdit = {};

  var firstloader_scheduledEdit = function (param, success, error) {
    if (!$.isEmptyObject(pubjsonfirst_scheduledEdit)) {
      success(pubjsonfirst_scheduledEdit);
      return true;
    }

    $.ajax({
      url: '../persevere/paymentAndReserveDetail',
      data: {
        reserveStates: '1', reservePerson: '', reserveMobile: '',
        starttime: "", stoptime: "", offset: 0, limit: 9999
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        pubjsonfirst_scheduledEdit = data;

        success(data);
      }
      , error: function (err) {
        alert(err);
      }
    });

  };
  //搜索loader函数
  var getGuestName = "";
  var getGuestPhone = "";
  var startTime = "";
  var stopTime = "";

  var searchloader_scheduledEdit = function (param, success, error) {
    $.ajax({
      url: '../persevere/paymentAndReserveDetail',
      data: {
        reserveStates: '1', reservePerson: getGuestName, reserveMobile: getGuestPhone,
        starttime: startTime, stoptime: stopTime, offset: 0, limit: 9999
      },
      type: "post",
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_scheduled_edit').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          //清空数据
          $('#tab_scheduled_edit').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_scheduled_edit').datagrid('loadData', { total: 0, rows: [] });
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
  $('#tab_scheduled_edit').datagrid({
    title: '预订单', 		//表格标题
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
    loader: firstloader_scheduledEdit,
    onLoadSuccess: function (data) {
      $('a[name="scheduled_edit"]').on('click', function () {
        let row_ = $(this).attr('data-val');
        scheduled_edit(row_);
      });
    },
    columns: [[
      { field: 'roomtypeId', title: '房型ID', width: 20, align: 'center', hidden: true },
      { field: 'reserveCode', title: '订单号', width: 20, align: 'center', hidden: true },
      { field: 'reserveDetailId', title: 'reserveDetailId', width: 20, align: 'center', hidden: true },
      { field: 'reserveId', title: 'reserveId', width: 20, align: 'center', hidden: true },
      { field: 'checkinType', title: 'checkinType', width: 20, align: 'center', hidden: true },
      { field: 'sourceGroupId', title: 'sourceGroupId', width: 20, align: 'center', hidden: true },
      { field: 'channelId', title: 'channelId', width: 20, align: 'center', hidden: true },
      { field: 'itemIndex', title: 'itemIndex', width: 20, hidden: true },

      { field: 'roomtypeName', title: '房型', width: 20, align: 'center' },
      { field: 'roomNumber', title: '房间数', width: 15, align: 'center' },
      { field: 'channelName', title: '客源', width: 20, align: 'center' },
      { field: 'checkinTypeChar', title: '入住类型', width: 20, align: 'center' },
      { field: 'expectedEnterTime', title: '计划到店日期时间', width: 40, align: 'center', formatter: function (value, row, index) { return getDate(value) } },
      {
        field: 'expectedStayNumber', title: '计划居住', width: 20, align: 'center',
        formatter: function (value, row) {
          return row.checkinType == 2 ? value + "式" : value + "天";
          if (row.checkinType == 2) {
            return value + "式";
          }
          return value + "天";
        }
      },
      {
        field: 'expectedRentAmount', title: '房费', width: 20, align: 'center',
        formatter: function (value) {
          return value ? NP.divide(value, 100) : "";
        }
      },
      { field: 'reservePerson', title: '预订人姓名', width: 20, align: 'center' },
      { field: 'reserveMobile', title: '联系手机', width: 26, align: 'center' },
      {
        field: 'paymethodId', title: '支付方式', width: 30, align: 'center',
        formatter: function (value, row) {
          if (row.amount > 0) {
            if (value == 5) {
              if (row.creaditChannelName) {
                return "代收（" + row.creaditChannelName + "）";
              } else {
                return "代收";
              }
            } else {
              $.each(eapor.data.PaymethodObj, function (i, item) {
                if (value == item.paymethod_code) {
                  value = item.paymethod_name;
                  return;
                }
              });
              return value;
            }
          } else {
            return "";
          }
        }
      },
      {
        field: 'amount', title: '支付金额', width: 20, align: 'center',
        formatter: function (value) {
          return value > 0 ? NP.divide(value, 100) + "元" : "";
        }
      },
      {
        field: 'reserveState', title: '订单状态', width: 20, align: 'center',
        formatter: function (value) {
          if (value == 1) {
            value = "有效";
          } else if (value == 2) {
            value = "解除";
          } else if (value == 3) {
            value = "失约";
          } else if (value == 4) {
            value = "入住";
          }
          return value;
        }
      },
      { field: 'modifyUsername', title: '最后编辑人', width: 20, align: 'center' },
      {
        field: 'modifyTime', title: '最后编辑时间', width: 40, align: 'center', align: 'center',
        formatter: function (value) {
          return value < 0 ? "--" : getDate(value);
        }
      }, { field: 'remark', title: '备注', width: 20, align: 'center' },
      {
        field: 'id18', title: '操作', width: 20, align: 'center',
        formatter: function (value, row, index) {
          let row_ = JSON.stringify(row);//
          return `<a name='scheduled_edit' data-val='${row_}' class='dryColor' style='cursor:pointer;'>[编辑]</a>`;
        }
      }

    ]]

  });
  //编辑
  function scheduled_edit(row_) {
    let row = JSON.parse(row_);
    createDivHtml();
    console.info(row);
    //已选择-->取到要修改的数据到弹框上
    $('#ipt_checkChannel_scheduledEdit').combobox('setValue', row.channelId);
    $('#ipt_checkChannel_scheduledEdit').combobox('setText', row.channelName);

    $('#ipt_checkRoomType_scheduledEdit').combobox('setValue', row.roomtypeId);
    $('#ipt_checkRoomType_scheduledEdit').combobox('setText', row.roomtypeName);
    $('#ipt_checkRoomNumber_scheduledEdit').numberspinner('setValue', row.roomNumber);

    $('#ipt_checkInDate_scheduledEdit').datebox('setValue', getDate(row.expectedEnterTime));
    $('#ipt_stayDay_scheduledEdit').numberspinner('setValue', row.expectedStayNumber);
    $('#ipt_expectedRentAmount_scheduledEdit').textbox('setValue', NP.divide(row.expectedRentAmount, 100));
    $('#ipt_reservePerson_scheduledEdit').textbox('setValue', row.reservePerson);
    $('#ipt_reserveMobile_scheduledEdit').numberbox('setValue', row.reserveMobile);

    var checkinType = $('#ipt_checkInType_scheduledEdit').combobox('getValue');
    if (checkinType == "钟点房" || checkinType == 2) {
      $('#edit_unit').text("计划居住（" + JSON.parse($('#index_ruleData').val()).restRoomUnit + "）：");
    } else if (checkinType == "全日房" || checkinType == 1) {
      $('#edit_unit').text("计划居住（" + JSON.parse($('#index_ruleData').val()).dayRoomUnit + "）：");
    } else {
      $('#edit_unit').text("计划居住（" + JSON.parse($('#index_ruleData').val()).lateRoomUnit + "）：");
    }


    var divDialog = $('#divDialog');
    divDialog.dialog({
      title: '编辑预订单',
      width: 350,
      height: 470,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler: function () {
            sureEdit(row);
          }
        }, {
          text: '取消',
          handler: function () {
            divDialog.dialog('close');
          }
        }
      ]
    });
  };
  //搜索
  $('#searchScheduledGuest_edit').click(function () {
    if (!$('#ipt_guestPhone_scheduled_edit').numberbox('isValid')) {
      $('#ipt_guestPhone_scheduled_edit').numberbox('textbox').focus();
      return;
    }
    getGuestName = $('#ipt_guestName_scheduled_edit').val();
    getGuestPhone = $('#ipt_guestPhone_scheduled_edit').val();
    if ($('#ipt_startTime_scheduledEdit').datebox('getValue') != "") {
      startTime = $('#ipt_startTime_scheduledEdit').datebox('getValue');
      stopTime = $('#ipt_startTime_scheduledEdit').datebox('getValue');
    } else {
      startTime = "";
      stopTime = "";
    }
    $('#tab_scheduled_edit').datagrid("options").loader = searchloader_scheduledEdit;
    $("#tab_scheduled_edit").datagrid("reload");


  })
  //计算总房价
  function getRoomPriceCallback(data) {
    var total = 0;//预计房价
    $.each(data.actualPriceList, function (i, item) {
      total += item;
    });
    //入住房费预期
    var checkRoomNumber = $('#ipt_checkRoomNumber_scheduledEdit').numberspinner('getValue');
    $('#ipt_expectedRentAmount_scheduledEdit').textbox('setValue', NP.divide(NP.times(total, checkRoomNumber), 100));
  }
  //changeFunction
  function getCountRoomPriceByChange(arg) {
    if (arg.roomNum) {
      var amount = $('#ipt_expectedRentAmount_scheduledEdit').textbox('getValue');
      if (amount == "") {
        return;
      } else {
        $('#ipt_expectedRentAmount_scheduledEdit').textbox('setValue', amount / arg.oldValue * arg.roomNum);
        return;
      }
      return;
    }

    var data = {
      roomType: arg.roomType || $('#ipt_checkRoomType_scheduledEdit').combobox('getValue'),
      checkInType: arg.checkInType || $('#ipt_checkInType_scheduledEdit').combobox('getValue'),
      checkInTime: arg.checkInTime || $('#ipt_checkInDate_scheduledEdit').datebox('getValue'),
      stayDay: arg.stayDay || $('#ipt_stayDay_scheduledEdit').numberspinner('getValue'),
    };
    if (arg.checkInTime || arg.stayDay || arg.checkInType) {
      if (data.checkInTime == "") {
        return;
      }
      var endTime = "";
      if (data.checkInType == 1) {
        endTime = getDateForRoomOpen(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + NP.times(86400000, data.stayDay));
        $('#ipt_outTime_scheduledEdit').datetimebox('setValue', endTime);
      } else if (data.checkInType == 2) {
        endTime = getDate(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + JSON.parse($('#index_ruleData').val()).restHour * 360000 * data.stayDay);
        $('#ipt_outTime_scheduledEdit').datetimebox('setValue', endTime);
      } else {
        endTime = getDateForRoomOpen(new Date(data.checkInTime.replace(/-/g, "/")).getTime()
          + NP.times(86400000, data.stayDay));
        $('#ipt_outTime_scheduledEdit').datetimebox('setValue', endTime);
      }
    }
    var is = false;
    for (let k in data) {
      if (data[k] == "") {
        is = true;
        break;
      }
    }
    if (is) {
      return;
    }
    var subDate = {};
    subDate.startDateTime = data.checkInTime;
    subDate.roomtypeId = data.roomType;//房型id
    subDate.checkinType = data.checkInType;
    if (subDate.checkinType == 1 || subDate.checkinType == 3) {
      subDate.increment = 1;
    } else {
      subDate.increment = JSON.parse($('#index_ruleData').val()).restHour;
    }
    if ($('#hidden_rentplanId_schedluedEdit').val() == "") {
      console.info(633);
      return;
    }
    subDate.rentplanId = JSON.parse($('#hidden_rentplanId_schedluedEdit').val()).rentplanId;;
    subDate.expectedStay = data.stayDay;
    subDate.receptionId = 0;
    console.info(subDate)
    eapor.utils.defaultAjax("../reception/calculateRentAmount", subDate, getRoomPriceCallback);
  }

  //生成dialogHtml
  function createDivHtml() {
    $('#showEditScheduledEditInfo').append(
      '<div id="divDialog" style="padding:20px 0 0 40px;">' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkRoomType_scheduledEdit" style="width:230px;"' +
      'label="房型选择：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkRoomNumber_scheduledEdit" style="width:230px;"' +
      'label="房间数量：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkChannel_scheduledEdit" style="width:230px;"' +
      'label="客源：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkInType_scheduledEdit" style="width:230px;"' +
      'label="入住类型：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_checkInDate_scheduledEdit" style="width:230px;"' +
      'label="入住日期：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_stayDay_scheduledEdit" style="width:230px;"' +
      'label="计划居住：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_outTime_scheduledEdit" style="width:230px;"' +
      'label="计划离店：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_expectedRentAmount_scheduledEdit" style="width:230px;"' +
      'label="房费：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:10px">' +
      '<input id="ipt_reservePerson_scheduledEdit" style="width:230px;"' +
      'label="预订人姓名：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '<div style="margin-bottom:0px">' +
      '<input id="ipt_reserveMobile_scheduledEdit" style="width:230px;"' +
      'label="预订人手机：" labelPosition="before" labelAlign="right" labelWidth="80"/>' +
      '</div>' +
      '</div>'
    );
    //房型选择
    $('#ipt_checkRoomType_scheduledEdit').combobox({
      url: '../roomtype/getRoomtypeForSearch',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ roomType: newValue });
        }
      }/*,
		        onLoadSuccess:function(data){
		        	if(data.length >　0){
		        		$(this).combobox('setValue',data[0].roomtypeId);
		    			$(this).combobox('setText',data[0].roomtypeName);
		        	}
			    }*/
    });
    //房间数量
    $('#ipt_checkRoomNumber_scheduledEdit').numberspinner({
      min: 1,
      max: 99,
      editable: false,
      value: '1',
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ roomNum: newValue, oldValue: oldValue });
        }
      }
    });
    //客源
    $('#ipt_checkChannel_scheduledEdit').combobox({
      url: '../channel/pglist',
      queryParams: { limit: 9999, offset: 0, sourceGroupId: 0, channelName: '', usageState: 1 },
      valueField: 'channelId',
      textField: 'channelName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onSelect: function (rec) {
        var data = {};
        data.rentplanId = rec.rentplanId;
        data.sourceGroupId = rec.sourceGroupId;
        data.channelId = rec.channelId;
        $('#hidden_rentplanId_schedluedEdit').val(JSON.stringify(data));
      },
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ channelId: newValue });
        }
      }/*,
			    onLoadSuccess:function(comdata){
			    	if(comdata.length > 0){
			    		$.each(comdata,function(i,item){
				    		if(item.hasOwnProperty("channelName") && item.channelName == '非会员'){
				    			$('#ipt_checkChannel_scheduledEdit').combobox('setValue',item.channelId);
				    			$('#ipt_checkChannel_scheduledEdit').combobox('setText',item.channelName);
				    			var data = {};
				    			data.rentplanId = item.rentplanId;
				    	    	data.sourceGroupId = item.sourceGroupId;
				    	    	data.channelId = item.channelId;
				    	       $('#hidden_rentplanId_schedluedEdit').val(JSON.stringify(data));
				    	       return;
				    		}
				    	});
			    	}
			    }*/
    });
    //入住类型   点击新建预订单 按钮 时  若 当前时间未到预订晚房时间 则 不显示 晚房的选项
    /*var lrt = JSON.parse($('#index_ruleData').val()).lateRoomTime;
    var nd = new Date();
    var gfy = nd.getFullYear();
    var gm = nd.getMonth()+1;
    var gd = nd.getDate();
    if(gm<10){
      gm = "0"+gm;
    }*/
    //if(nd.getTime() < (new Date(gfy+"-"+gm+"-"+gd+" "+lrt).getTime())){
    /*$('#ipt_checkInType_scheduledEdit').combobox({
      data:[{    
          "id":1,    
          "text":"全日房",
          "selected":true
      },{    
          "id":2,    
          "text":"钟点房"   
      }],
      valueField: 'id',
      textField: 'text'
    });*/
    //}else{
    $('#ipt_checkInType_scheduledEdit').combobox({
      data: [{
        "id": 1,
        "text": "全日房",
        "selected": true
      }, {
        "id": 2,
        "text": "钟点房"
      }, {
        "id": 3,
        "text": "晚房"
      }],
      valueField: 'id',
      textField: 'text',
      //});
      //}
      //$('#ipt_checkInType_scheduledEdit').combobox({
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ checkInType: newValue });
        }
      }
    });
    //计划居住
    $('#ipt_stayDay_scheduledEdit').numberspinner({
      required: true,
      validType: 'minLength[1]',
      min: 1,
      editable: false,
      value: '1',
      onChange: function (newValue, oldValue) {
        if (oldValue != "") {
          getCountRoomPriceByChange({ stayDay: newValue });
        }
      }
    });
    //计划离店
    $('#ipt_outTime_scheduledEdit').datetimebox({

    });
    //房费
    $('#ipt_expectedRentAmount_scheduledEdit').textbox({
      editable: false
    });
    //预订人姓名
    $('#ipt_reservePerson_scheduledEdit').textbox({
      required: true,
      delay: 1000,
      //				validType:'name',
      missingMessage: "姓名不能为空！",
      //				invalidMessage:"姓名请输入中文或英文",
      validateOnCreate: false,
      validateOnBlur: true
    });
    //联系手机
    $('#ipt_reserveMobile_scheduledEdit').numberbox({
      required: true,
      validType: 'mobilephone',
      missingMessage: "手机号码不能为空！",
      invalidMessage: "手机号码格式不正确！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    //入住日期
    $('#ipt_checkInDate_scheduledEdit').datebox({
      editable: false,
      onChange: function (newValue, oldValue) {
        if (newValue == "") {
          $('#ipt_outTime_scheduled_new').datetimebox('setValue', "");
          $('#ipt_expectedRentAmount_scheduled_new').numberbox('setValue', "");
          $('#ipt_stayDay_scheduled_new').numberspinner('setValue', 1);
          return;
        }
        getCountRoomPriceByChange({ checkInTime: newValue });
      },
      formatter: function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var nowGetTime = new Date().getTime();
        if (m < 10) {
          m = "0" + m;
        }
        if (d < 10) {
          d = "0" + d;
        }
        var time = y + "-" + m + "-" + d;
        if (((new Date(time.replace(/-/g, "/")).getTime() + 57600000) < nowGetTime) && ((new Date(time.replace(/-/g, "/")).getTime() + 86400000) > nowGetTime)) {
          console.info(nowTimeAddNHour())
          return nowTimeAddNHour();//得到当前时间 加 三小时 的日期格式
        } else {//当前时间未超过16：00预订的 情况下
          return y + "-" + m + "-" + d + " " + 18 + ":" + "00" + ":" + "00";
        }

      }
    });
    $('#ipt_checkInDate_scheduledEdit').datebox().datebox('calendar').calendar({
      validator: function (date) {
        var now = new Date();
        var d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 100);
        return d1 <= date && date <= d2;
      }
    });
  }


  function sureEdit(srow) {
    var row = srow;
    var expectedEnterTime = $('#ipt_checkInDate_scheduledEdit').datebox('getValue');
    if (expectedEnterTime == "") {
      $.messager.show({
        title: '系统提示', msg: '入住时间不能为空！', timeout: 2800
      });
      return;
    }
    if (!$('#ipt_reservePerson_scheduledEdit').textbox('isValid')) {
      $('#ipt_reservePerson_scheduledEdit').textbox('textbox').focus();
      return;
    }
    if (!$('#ipt_reserveMobile_scheduledEdit').numberbox('isValid')) {
      $('#ipt_reserveMobile_scheduledEdit').numberbox('textbox').focus();
      return;
    }

    var hiddenRentplan = JSON.parse($('#hidden_rentplanId_schedluedEdit').val());
    //客源
    var channelId = hiddenRentplan.channelId;

    var expectedRentAmount = $('#ipt_expectedRentAmount_scheduledEdit').textbox('getValue');
    if (expectedRentAmount == 0) {
      $.messager.show({
        title: '系统提示', msg: '无此入住类型房间！编辑订单失败！', timeout: 2800, showType: 'slide'
      });
      return;
    }

    //--------------------------------------------------------
    var reservedetailListDate = {};//预订项列表
    reservedetailListDate.reserveDetailId = row.reserveDetailId;
    reservedetailListDate.channelId = channelId;
    reservedetailListDate.roomtypeId = $('#ipt_checkRoomType_scheduledEdit').combobox('getValue');
    reservedetailListDate.roomNumber = $('#ipt_checkRoomNumber_scheduledEdit').numberspinner('getValue');
    reservedetailListDate.sourceGroupId = hiddenRentplan.sourceGroupId;
    reservedetailListDate.checkinType = $('#ipt_checkInType_scheduledEdit').combobox('getValue');
    reservedetailListDate.expectedEnterTime = expectedEnterTime;
    reservedetailListDate.expectedStayNumber = $('#ipt_stayDay_scheduledEdit').numberspinner('getValue');
    reservedetailListDate.expectedRentAmount = (expectedRentAmount * 100).toFixed(0);
    reservedetailListDate.reservePerson = $('#ipt_reservePerson_scheduledEdit').textbox('getValue');
    reservedetailListDate.reserveMobile = $('#ipt_reserveMobile_scheduledEdit').numberbox('getValue');
    console.info(reservedetailListDate);
    $.ajax({
      type: 'post',
      url: '../reserve/editReservedetail',
      data: reservedetailListDate,
      dataType: "json",
      success: function (data) {
        console.info(data);
        if (data > 0) {
          pubjsonfirst_scheduledEdit = {};
          $('#tab_scheduled_edit').datagrid("options").loader = firstloader_scheduledEdit;
          $("#tab_scheduled_edit").datagrid("reload");
          $.messager.show({
            title: '系统提示', msg: '编辑成功！', timeout: 2800, showType: 'slide'
          });
          $('#hidden_rentplanId_schedluedEdit').val("");
          $('#divDialog').dialog('close');
        } else if (data == -301) {
          $.messager.show({
            title: '系统提示', msg: '编辑失败！手机格式不正确！', timeout: 2800, showType: 'slide'
          });
        } else if (data < -19999) {
          $.messager.alert("系统提示", "该时间段内房间数超额！编辑订单失败！");
        } else if (data > -20000 && data < -9999) {
          $.messager.alert("系统提示", "该时间段内订单超额！编辑订单失败！");
        } else {
          $.messager.show({
            title: '系统提示', msg: '编辑失败！', timeout: 2800, showType: 'slide'
          });
        }
      }
    });
  }


  //开房按钮
  $('#openRoom_scheduledEdit').on('click', function () {
    var getSelected = $('#tab_scheduled_edit').datagrid('getSelected');
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请选择订单！', timeout: 2800, showType: 'slide' });
      return;
    }
    $('#openRoomData').val(JSON.stringify(getSelected));
    if ($('#kzmaintable').tabs('exists', '开房')) {
      $('#kzmaintable').tabs('close', '开房');
      $('#kzmaintable').tabs('add', {
        title: '开房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/room_open.jsp'
      });
    } else {
      $('#kzmaintable').tabs('add', {
        title: '开房',
        closable: true,
        plain: false,
        border: false,
        href: '../client/room_open.jsp'
      });
    }
  });
  //解除按钮
  $('#click_scheduledRemove').click(function () {
    var getRemoveObj = $('#tab_scheduled_edit').datagrid('getSelected');
    if (!getRemoveObj) {
      $.messager.show({
        title: '系统提示', msg: '请选择订单！', timeout: 2800, showType: 'slide'
      });
      return;
    }
    $.messager.confirm('系统提示', '您确认想要解除该订单吗？', function (r) {
      if (r) {
        var toDBReserveDetailId = getRemoveObj.reserveDetailId;
        $.ajax({
          type: 'post',
          url: '../reserve/changeReserveState',
          data: { reserveState: 2, reserveDetailId: toDBReserveDetailId },
          dataType: 'json',
          success: function (data) {
            if (data > 0) {
              pubjsonfirst_scheduledEdit = {};
              $('#tab_scheduled_edit').datagrid("options").loader = firstloader_scheduledEdit;
              $("#tab_scheduled_edit").datagrid("reload");
              $.messager.show({
                title: '系统提示', msg: '解除修改成功！', timeout: 2800, showType: 'slide'
              });
            } else {
              $.messager.show({
                title: '系统提示', msg: '解除修改失败！', timeout: 2800, showType: 'slide'
              });
            }
          }
        })
      }
    });
  });
  //失约按钮
  $('#click_scheduledMissApp').click(function () {
    var getRemoveObj = $('#tab_scheduled_edit').datagrid('getSelected');
    if (!getRemoveObj) {
      $.messager.show({
        title: '系统提示', msg: '请先选择订单！', timeout: 2800, showType: 'slide'
      });
      return;
    }
    $.messager.confirm('系统提示', '您确认要修改该订单为失约状态吗？', function (r) {
      if (r) {
        var toDBReserveDetailId = getRemoveObj.reserveDetailId;
        $.ajax({
          type: 'post',
          url: '../reserve/changeReserveState',
          data: { reserveState: 3, reserveDetailId: toDBReserveDetailId },
          dataType: 'json',
          success: function (data) {
            if (data > 0) {
              pubjsonfirst_scheduledEdit = {};
              $('#tab_scheduled_edit').datagrid("options").loader = firstloader_scheduledEdit;
              $("#tab_scheduled_edit").datagrid("reload");
              $.messager.show({
                title: '系统提示', msg: '失约修改成功！', timeout: 2800, showType: 'slide'
              });
            } else {
              $.messager.show({
                title: '系统提示', msg: '失约修改失败！', timeout: 2800, showType: 'slide'
              });
            }
          }
        });
      }
    });
  });

})(window);