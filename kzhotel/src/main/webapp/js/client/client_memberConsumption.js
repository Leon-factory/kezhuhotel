/**
 * @JS_NAME:客户关系--会员消费
 */
~(function () {
  $(function () {
    const memberConsumption = {
      fastclick_: false,
      init() {
        this.render();
        this.bind();
      },
      render() {
        $('#cardNum_memberConsumption').textbox({
          validType: ['number', 'getKeZhuPhoneCode_memberConsumption'],
          prompt: "若没有实体卡忽略此项",
          delay: 1000,
          validateOnCreate: false,
          validateOnBlur: false
        });
      },
      bind() {
        $('#submit_memberConsumption').on('click', () => {
          const data = this.getParam();
          console.info(data);
          console.info(this.validate());
          if (!this.validate()) {
            return;
          }
          if (this.fastclick_) {
            return;
          }
          this.fastclick_ = true;
          $('#submit_memberConsumption').linkbutton('disable');
          eapor.utils.defaultAjax('../payment/kezhuConsume', data, $.proxy(this.submit_memberConsumptionCallback, this));
        });
        $('#reset_memberConsumption').on('click', () => {
          this.reset();
        });
      },
      submit_memberConsumptionCallback(result) {
        console.info(result);
        console.info(this);
        this.fastclick_ = false;
        $('#submit_memberConsumption').linkbutton('enable');
        if (result > 0) {
          $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000, showType: 'slide' });
          memberConsumption.reset();
          eapor.utils.defaultAjax('../payment/listPayments', {}, listPaymentsCallBack);
          return;
        }
        /*-1,查询不到顾客信息
         * 			-2,查询不到用户注册商家信息
         * 			-3,查询不到消费商家信息
         * 			-4,余额不足
         * 			-5,未知操作者
         * 			-6,操作失败
         * 			-7,验证码不正确
         * 			-8,验证码过期
         * 			-9,3分钟内请勿再次充值*/
        const returnResult = function () {
          const _result = {
            '-1': '查询不到顾客信息',
            '-2': '查询不到用户注册商家信息',
            '-3': '查询不到消费商家信息',
            '-4': '余额不足',
            '-5': '未知操作者',
            '-6': '操作失败',
            '-7': '验证码不正确',
            '-8': '验证码过期',
            '-9': '3分钟内请勿再次操作',
            '-10': '当前未当班，请先当班后操作！',
            '-11': '用户正在进行充值消费操作中，请稍候重试'
          }
          return function (code) {
            $.messager.show({
              title: '系统提示', msg: '操作失败！' + _result[code] ? _result[code] : '',
              timeout: 3000, showType: 'slide'
            });
            return;
          }
        }();
        if (typeof result === 'number') {
          returnResult('' + result)
        }
      },
      getParam() {
        return {
          type: +$('input[name="consumptionType_memberConsumption"]:checked').val(),	//3储值 2积分 1现金	是	[int]		
          entity: $('#cardNum_memberConsumption').textbox('getValue'),	//实体卡号	是	[string]		
          phone: $('#phone_memberConsumption').numberbox('getValue'),	//手机号	是	[string]		
          matchCode: $('#num_memberConsumption').textbox('getValue'),	//匹配码	是	[string]		
          amount: NP.times($('#consumptioneAmount_memberConsumption').textbox('getValue'), 100),	//消费金额	是	[int]		
          remark: $('#remark_memberConsumption').textbox('getValue')
        };
      },
      reset() {
        $('input[name="consumptionType_memberConsumption"]').eq(0).prop('checked', 'checked');	//3储值 2积分 1现金	是	[int]		
        $('#cardNum_memberConsumption').textbox('clear');	//实体卡号	是	[string]		
        $('#phone_memberConsumption').numberbox('clear').numberbox('resetValidation');	//手机号	是	[string]		
        $('#num_memberConsumption').textbox('clear').textbox('resetValidation');	//匹配码	是	[string]		
        $('#consumptioneAmount_memberConsumption').textbox('clear').textbox('resetValidation');	//消费金额	是	[int]
        $('#remark_memberConsumption').textbox('clear');
        sessionStorage.removeItem('cardCode_memberConsumption');
      },
      validate() {
        if (!$('#phone_memberConsumption').numberbox('isValid')) {
          $('#phone_memberConsumption').numberbox('textbox').focus();
          return false;
        }
        if (!$('#num_memberConsumption').textbox('isValid')) {
          $('#num_memberConsumption').textbox('textbox').focus();
          return false;
        }
        if (!$('#consumptioneAmount_memberConsumption').textbox('isValid')) {
          $('#consumptioneAmount_memberConsumption').textbox('textbox').focus();
          return false;
        }
        return true;
      }
    };
    memberConsumption.init();
  });
  /****************/
  $('#list_memberConsumption').datagrid({
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

      { field: 'id', title: 'ID', width: 10, align: 'center' },
      { field: 'payNo', title: '交易编号', width: 28, align: 'center' },
      { field: 'payType', title: '交易类型', width: 12, align: 'center' },
      { field: 'nickname', title: '会员姓名', width: 12, align: 'center' },
      { field: 'phone', title: '会员手机', width: 15, align: 'center' },
      { field: 'shopName', title: '商家', width: 16, align: 'center' },
      { field: 'price', title: '金额', width: 10, align: 'center' },
      { field: 'pointsReturned', title: '返积分', width: 10, align: 'center' },
      {
        field: 'createTime', title: '交易时间', width: 28, align: 'center',
        formatter(value, row, index) {
          return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
        }
      },
      { field: 'comment', title: '备注', width: 16, align: 'center' },
      { field: 'operateName', title: '收银员', width: 15, align: 'center' },
      {
        field: 'cancelled', title: '撤销状态', width: 10, align: 'center',
        formatter(value, row, index) { //0正常状态 1撤销状态
          return value && value == 1 ? '已撤销' : '未撤销';
        }
      }
    ]]
  });
  function listPaymentsCallBack(result) {
    console.info('listPaymentsCallBack:', result);
    $('#list_memberConsumption').datagrid('loadData', result);
  }
  eapor.utils.defaultAjax('../payment/listPayments', {}, listPaymentsCallBack);
})();