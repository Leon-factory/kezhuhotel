/**
 * @JSname:会员充值
 */
~(function () {
  "use strict";

  $('#cardNum_memberRecharge').textbox({
    validType: ['number', 'getKeZhuPhoneCode'],
    prompt: "若没有实体卡忽略此项",
    delay: 1000,
    validateOnCreate: false,
    validateOnBlur: false
  });
  let submitFlag = false;
  $('#searchVIPInfo_searchVIPInfo').click(function () {
    if (!$('#iptPhone_searchVIPInfo').numberbox('getValue') &&
      !$('#iptName_searchVIPInfo').textbox('getValue')) {
      $.messager.show({ title: '系统提示', msg: '姓名和手机号码不能都为空！', timeout: 3000, showType: 'slide' });
      return;
    }

    if (!$('#iptPhone_searchVIPInfo').numberbox('isValid')) {
      $('#iptPhone_searchVIPInfo').numberbox('textbox').focus();
      return;
    }
    function searchloader_searchVIPInfo(param, success, error) {
      $.ajax({
        url: "../hotel/listMemberPage",
        data: {
          hotelId: $('#indexhotelId').val(),
          membername: $('#iptName_searchVIPInfo').textbox('getValue'),
          phone: $('#iptPhone_searchVIPInfo').numberbox('getValue'),
          offset: 0,
          limit: 9999999,
          maxId: 0
        },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.info(data)
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            $('#tab_common_searchVIPInfo').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return;
          }
          var tmpjson = JSON.stringify(data.data);
          if (tmpjson == '[]') {
            $('#tab_common_searchVIPInfo').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_common_searchVIPInfo').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          if (data == "") {
            $('#tab_common_searchVIPInfo').datagrid('loadData', { total: 0, rows: [] });
            success([]);
            return true;
          }
          //如果不是用的list方法，这里给json前后加变成数组放入
          success(data.data);
          return true;
        },
        error: function (err) {
          alert(err);
        }
      });
    };
    $('#showSearchVipInfoDialog').append(`
			<div id="showDiv"><table id="tab_common_searchVIPInfo"></table></div>
		`);
    $('#tab_common_searchVIPInfo').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      fitColumns: true,
      rownumbers: true,
      loader: searchloader_searchVIPInfo,
      columns: [[
        { field: 'inviterId', title: 'inviterId', width: 15, align: 'center', hidden: true },
        { field: 'memberId', title: 'memberId', width: 15, align: 'center', hidden: true },

        { field: 'nickname', title: '会员姓名', width: 15, align: 'center' },
        { field: 'phone', title: '会员手机', width: 28, align: 'center' },
        {
          field: 'isHome', title: '是否本店会员', width: 22, align: 'center',
          formatter: function (value) {
            if (value == 1) {
              return "是";
            } else if (value == 0) {
              return "否";
            }
          }
        },
        { field: 'inviterNickname', title: '会员发展人', width: 20, align: 'center' },
        {
          field: 'createTime', title: '会员发展时间', width: 40, align: 'center',
          formatter: function (value) {
            return getDate(value);
          }
        },
        { field: 'points', title: '积分币金额', width: 20, align: 'center' },
        { field: 'balance', title: '储值金额', width: 20, align: 'center' },
        /*{field:'id8',title:'RFM指标',width:20,align:'center'},
        {field:'id9',title:'历史账簿',width:20,align:'center'},*/
        { field: 'vipcard', title: '实体卡号', width: 35, align: 'center' },
        /*{field:'id11',title:'制卡/注销',width:18,align:'center'},*/
        { field: 'userComment', title: '备注', width: 18, align: 'center' },
        { field: 'reputation', title: '声望', width: 18, align: 'center' }
      ]]
    });

    $('#showDiv').dialog({
      title: '会员信息',
      width: 1180,
      height: 600,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          const selected_searchVIPInfo = $('#tab_common_searchVIPInfo').datagrid('getSelected');
          if (!selected_searchVIPInfo) {
            $.messager.show({ title: '系统提示', msg: '请选择会员信息！', timeout: 3000, showType: 'slide' });
            return;
          }
          selectedHandler_searchVIPInfo(JSON.stringify(selected_searchVIPInfo));
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showDiv').dialog('close');
        }
      }]
    })
  });
  //-------客户关系--》会员充值-------

  function selectedHandler_searchVIPInfo(value) {
    var getInfo_searchVIPInfo = JSON.parse(value);
    if (getInfo_searchVIPInfo.nickname) {
      $('#guestName_memberRecharge').textbox('setValue', getInfo_searchVIPInfo.nickname);
    }
    if (getInfo_searchVIPInfo.phone) {
      $('#guestPhone_memberRecharge').textbox('setValue', getInfo_searchVIPInfo.phone);
    }
    if (getInfo_searchVIPInfo.vipcard) {
      $('#cardNum_memberRecharge').textbox('setValue', getInfo_searchVIPInfo.vipcard);
    }
    if (getInfo_searchVIPInfo.phone) {
      $('#phone_memberRecharge').numberbox('setValue', getInfo_searchVIPInfo.phone);
    }
    if (getInfo_searchVIPInfo.matchCode) {
      $('#num_memberRecharge').textbox('setValue', getInfo_searchVIPInfo.matchCode);
    }
    $('#showDiv').dialog('close');
  }

  function submit_memberRechargeCallBack(result) {
    console.info(result);
    $('#submit_memberRecharge').linkbutton('enable');
    submitFlag = false;
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result > 0) {
      sessionStorage.removeItem('cardCode');
      $('#iptName_searchVIPInfo').textbox('clear');
      $('#iptPhone_searchVIPInfo').numberbox('clear');
      $('#guestName_memberRecharge').textbox('clear');
      $('#guestPhone_memberRecharge').textbox('clear');
      $('#cardNum_memberRecharge').textbox('clear').textbox('resetValidation');
      $('#phone_memberRecharge').numberbox('clear').numberbox('resetValidation');
      $('#num_memberRecharge').textbox('clear').textbox('resetValidation');
      $('#remark_memberRecharge').textbox('clear').textbox('resetValidation');

      $('#getAmount_memberRecharge').numberbox('clear').numberbox('resetValidation');
      $('#rechangeAmount_memberRecharge').numberbox('clear').numberbox('resetValidation');
      $.messager.show({ title: '系统提示', msg: '充值成功！', timeout: 2000, showType: 'slide' });
      eapor.utils.defaultAjax('../payment/listRecharge', {}, listPaymentsCallBack);
      return;
    }

    const returnResult = function () {
      const _result = {
        '-1': '查询不到顾客信息',
        '-2': '查询不到用户注册商家信息',
        '-3': '查询不到消费商家信息',
        '-4': '余额不足',
        '-5': '未知操作者',
        '-6': '实体卡号不正确',
        '-7': '验证码不正确',
        '-8': '验证码过期',
        '-9': '3分钟内请勿再次充值',
        '-10': '当前未当班，请先当班后操作！',
        '-11': '用户正在进行充值消费操作中，请稍候重试'
      }
      return function (code) {
        $.messager.show({
          title: '系统提示', msg: '充值失败！' + _result[code] ? _result[code] : '',
          timeout: 3000, showType: 'slide'
        });
        return;
      }
    }();
    if (typeof result === 'number') {
      returnResult('' + result)
    }
    //       console.info(returnResult(''+result));
    //		if(result == -1){
    //			$.messager.show({title:'系统提示',msg:'匹配码不正确！',timeout:2000,showType:'slide'});
    //			return;
    //		}
    //		if(result == -1){
    //			$.messager.show({title:'系统提示',msg:'匹配码不正确！',timeout:2000,showType:'slide'});
    //			return;
    //		}
    //		$.messager.show({title:'系统提示',msg:'充值失败！',timeout:2000,showType:'slide'});
  }
  //提交
  $('#submit_memberRecharge').on('click', function () {

    if (!$('#cardNum_memberRecharge').textbox('isValid')) {
      $('#cardNum_memberRecharge').textbox('textbox').focus();
      return;
    }
    if (!$('#phone_memberRecharge').numberbox('isValid')) {
      $('#phone_memberRecharge').numberbox('textbox').focus();
      return;
    }
    if (!$('#num_memberRecharge').textbox('isValid')) {
      $('#num_memberRecharge').textbox('textbox').focus();
      return;
    }
    if (!$('#getAmount_memberRecharge').numberbox('isValid')) {
      $('#getAmount_memberRecharge').numberbox('textbox').focus();
      return;
    }
    if (!$('#rechangeAmount_memberRecharge').numberbox('isValid')) {
      $('#rechangeAmount_memberRecharge').numberbox('textbox').focus();
      return;
    }
    if (!$('#remark_memberRecharge').textbox('isValid')) {
      $('#remark_memberRecharge').textbox('textbox').focus();
      return;
    }
    var entity = $('#cardNum_memberRecharge').textbox('getValue');
    var phone = $('#phone_memberRecharge').numberbox('getValue');
    var matchCode = $('#num_memberRecharge').textbox('getValue');
    var actual = $('#getAmount_memberRecharge').numberbox('getValue');
    var recharge = $('#rechangeAmount_memberRecharge').numberbox('getValue');
    var remark = $('#remark_memberRecharge').textbox('getValue');
    if (submitFlag) {
      return;
    }
    $('#submit_memberRecharge').linkbutton('disable');
    submitFlag = true;
    var data_memberRecharge = {
      entity,//实体卡
      phone,
      matchCode,//匹配码
      actual: NP.times(actual, 100),//实收金额
      recharge: NP.times(recharge, 100),//充值金额
      remark//备注	
    };
    console.info(data_memberRecharge);
    eapor.utils.defaultAjax('../hotel/memberStore', data_memberRecharge, submit_memberRechargeCallBack);
  });
  //清空
  $('#reset_memberRecharge').on('click', function () {
    sessionStorage.removeItem('cardCode');
    $('#cardNum_memberRecharge').textbox('clear').textbox('resetValidation');

    $('#phone_memberRecharge').numberbox('clear').numberbox('resetValidation');
    $('#num_memberRecharge').textbox('clear').textbox('resetValidation');
    $('#getAmount_memberRecharge').numberbox('clear').numberbox('resetValidation');
    $('#rechangeAmount_memberRecharge').numberbox('clear').numberbox('resetValidation');
    $('#remark_memberRecharge').textbox('clear').textbox('resetValidation');

    $('#guestName_memberRecharge').textbox('clear');
    $('#guestPhone_memberRecharge').textbox('clear');

    $('#iptName_searchVIPInfo').textbox('clear');
    $('#iptPhone_searchVIPInfo').numberbox('clear');
  });

  /****************/
  $('#list_memberRecharge').datagrid({
    title: '账单列表', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    fitColumns: true,
    rownumbers: true,
    data: [],
    columns: [[
      { field: 'userId', title: 'userId', width: 15, align: 'center', hidden: true },
      { field: 'shopId', title: 'shopId', width: 15, align: 'center', hidden: true },
      { field: 'pointsReturned', title: '返积分', width: 10, align: 'center', hidden: true },

      { field: 'id', title: 'ID', width: 10, align: 'center' },
      { field: 'payNo', title: '交易编号', width: 28, align: 'center' },
      { field: 'payType', title: '交易类型', width: 12, align: 'center' },
      { field: 'nickname', title: '会员姓名', width: 12, align: 'center' },
      { field: 'phone', title: '会员手机', width: 15, align: 'center' },
      { field: 'shopName', title: '商家', width: 10, align: 'center' },
      { field: 'price', title: '充值金额', width: 10, align: 'center' },
      { field: 'actualPrice', title: '实收金额', width: 10, align: 'center' },
      {
        field: 'createTime', title: '交易时间', width: 28, align: 'center',
        formatter(value, row, index) {
          return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
        }
      },
      { field: 'comment', title: '备注', width: 10, align: 'center' },
      { field: 'operateName', title: '收银员', width: 10, align: 'center' }
    ]]
  });
  function listPaymentsCallBack(result) {
    console.info('listPaymentsCallBack:', result);
    $('#list_memberRecharge').datagrid('loadData', result);
  }
  eapor.utils.defaultAjax('../payment/listRecharge', {}, listPaymentsCallBack);
})();