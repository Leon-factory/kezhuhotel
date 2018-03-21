/**
 *@JSname:规则设置
 */
~(function (eapor) {
  "use strict";
  /*清空*/
  $('#rule_clean').on('click', function () {
    $('#rule_auditTime').timespinner('clear');
    $('#rule_vipNoonExitRoomTime').numberspinner('clear');
    $('#rule_restHour').numberspinner('clear');
    $('#rule_noonExitRoomTime').timespinner('clear');
    $('#rule_afternoonExitRoomTime').timespinner('clear');
    $('#rule_lateRoomTime').timespinner('clear');
  });

  /*确认按钮*/
  $('#submitBtn_setRule').on('click', function () {
    var url = "../syspara/EditConfig";
    var data = {};

    var auditTime = $('#rule_auditTime').timespinner('getValue');
    if (auditTime == "") {
      $.messager.show({
        title: '系统提示', msg: '夜审点不能为空！', timeout: 5000, showType: 'slide'
      });
      return;
    }
    var memberCheckoutDelay = $('#rule_vipNoonExitRoomTime').numberspinner('getValue') * 60;
    if (memberCheckoutDelay == "") {
      memberCheckoutDelay = 0;
    }
    var restHour = $('#rule_restHour').numberspinner('getValue');
    if (restHour == "") {
      restHour = 0;
    }
    var noonCheckoutTime = $('#rule_noonExitRoomTime').timespinner('getValue');
    if (noonCheckoutTime == "") {
      $.messager.show({
        title: '系统提示', msg: '中午退房时间不能为空！', timeout: 5000, showType: 'slide'
      });
      return;
    }
    var afternoonCheckoutTime = $('#rule_afternoonExitRoomTime').timespinner('getValue');
    if (afternoonCheckoutTime == "") {
      $.messager.show({
        title: '系统提示', msg: '下午退房时间不能为空！', timeout: 5000, showType: 'slide'
      });
      return;
    }
    var lateRoomTime = $('#rule_lateRoomTime').timespinner('getValue');
    if (lateRoomTime == "") {
      $.messager.show({
        title: '系统提示', msg: '晚房时间不能为空！', timeout: 5000, showType: 'slide'
      });
      return;
    }
    var dayRoomUnit = $('#rule_dayRoomUnit').textbox('getValue');
    var restRoomUnit = $('#rule_restRoomUnit').textbox('getValue');

    data.auditTime = auditTime;
    data.memberCheckoutDelay = Number(memberCheckoutDelay);
    data.restHour = Number(restHour);
    data.noonCheckoutTime = noonCheckoutTime;
    data.afternoonCheckoutTime = afternoonCheckoutTime;
    data.lateRoomTime = lateRoomTime;
    data.dayRoomUnit = dayRoomUnit;
    data.restRoomUnit = restRoomUnit;
    if (eapor.setRule.clickFlag == false) {
      return;
    }
    eapor.setRule.clickFlag = false;
    $("#submitBtn_setRule").addClass("l-btn-disabled");
    console.info(data)
    eapor.setRule.defaultAjax(url, data, eapor.setRule.setRuleCallBack);
  });

  eapor.setRule = {
    clickFlag: true,
    init: function () {
      $.ajax({
        type: 'post',
        url: '../syspara/getConfigByHotelId',
        data: {},
        dataType: 'json',
        success: function (result) {
          console.info(result);
          if (eapor.utils.ajaxCallBackErrInfo(result)) {
            return;
          }
          var at = result.auditTime;//eapor.setRule.getHMSByDate(new Date(result.auditTime));
          var nert = result.noonCheckoutTime;//eapor.setRule.getHMSByDate(new Date(result.noonCheckoutTime));
          var anert = result.afternoonCheckoutTime;//eapor.setRule.getHMSByDate(new Date(result.afternoonCheckoutTime));
          var lrt = result.lateRoomTime;//eapor.setRule.getHMSByDate(new Date(result.lateRoomTime));
          $('#rule_auditTime').timespinner({});
          $('#rule_noonExitRoomTime').timespinner({});
          $('#rule_vipNoonExitRoomTime').numberspinner({ min: 0 });
          $('#rule_afternoonExitRoomTime').timespinner({});
          $('#rule_restHour').numberspinner({ min: 0 });
          $('#rule_lateRoomTime').timespinner({});
          $('#rule_dayRoomUnit').textbox({});
          $('#rule_restRoomUnit').textbox({});

          $('#rule_auditTime').timespinner('setValue', at);
          $('#rule_noonExitRoomTime').timespinner('setValue', nert);
          $('#rule_vipNoonExitRoomTime').numberspinner('setValue', result.memberCheckoutDelay / 60);
          $('#rule_afternoonExitRoomTime').timespinner('setValue', anert);
          $('#rule_restHour').numberspinner('setValue', result.restHour);
          $('#rule_lateRoomTime').timespinner('setValue', lrt);
          $('#rule_dayRoomUnit').textbox('setValue', result.dayRoomUnit);
          $('#rule_restRoomUnit').textbox('setValue', result.restRoomUnit);
          //$('#index_ruleData').val("");
        }
      })
    },
    defaultAjax: function (url, data, callback) {
      $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json'
      })
        .done(function (result) {
          callback(result);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          $.messager.alert("系统提示", "网络连接中断");
          return;
        })
        .always(function () {
          eapor.setRule.clickFlag = true;
          $("#submitBtn_setRule").removeClass("l-btn-disabled");
        });
    }
    , getHMSByDate: function (time) {
      var t = time;
      var h = time.getHours();
      var m = time.getMinutes();
      var s = time.getSeconds();
      if (h < 10) { h += "0" };
      if (m < 10) { m += "0" };
      if (s < 10) { s += "0" };
      return h + ":" + m + ":" + s;
    }
    , setRuleCallBack: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '编辑成功！！', timeout: 2000 });
        $.ajax({
          type: 'post',
          url: '../syspara/getConfigByHotelId',
          data: {},
          dataType: 'json',
          success: function (result) {
            $('#index_ruleData').val(JSON.stringify(result));
          }
        });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '编辑失败！！', timeout: 2000 });
    }
  };
  eapor.setRule.init();
})(window.eapor);