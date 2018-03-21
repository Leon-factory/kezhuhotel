/*
 * @客户关系--促销推送
 */
~(function () {
  'use strict';
  const promotion = {
    fastclick_: false,
    maxId: 0,
    init() {
      this.render();
      this.randerTable();
      this.bind();
      this.getList();
    },
    render() {
      $('#activityTheme_promotionPush').textbox({
        required: true,
        missingMessage: "活动主题不能为空",
        delay: 1000,
        validateOnCreate: false,
        validateOnBlur: false
      });
      $('#activityTime_promotionPush').textbox({
        required: true,
        missingMessage: "活动时间不能为空",
        delay: 1000,
        validateOnCreate: false,
        validateOnBlur: false
      });
      $('#activityAddress_promotionPush').textbox({
        required: true,
        missingMessage: "活动地址不能为空",
        delay: 1000,
        validateOnCreate: false,
        validateOnBlur: false
      });
      $('#activityDetail_promotionPush').textbox({
        multiline: true,
        required: true,
        missingMessage: "活动详情不能为空",
        delay: 1000,
        validateOnCreate: false,
        validateOnBlur: false,
        height: 200,
        value: sessionStorage.getItem('activityDetail') || ''
      });
      if (sessionStorage.getItem('activityDetail')) {
        sessionStorage.removeItem('activityDetail')
      }
    },
    bind() {
      $('#submit_promotionPush').on('click', () => {
        if (!+sessionStorage.getItem('KezhuShopId')) {
          $.messager.show({ title: '系统提示', msg: '请先绑定客主商家账号！', timeout: 3000, showType: 'slide' });
          return;
        }
        this.submit();
      });
      $('#reset_promotionPush').on('click', () => {
        this.reset();
      });
    },
    submit() {
      console.info(this.getParam())
      if (this.fastclick_) {
        return;
      }
      const data = this.getParam();
      if (!this.validate(data)) {
        return;
      }
      $('#submit_promotionPush').linkbutton('disable');
      this.fastclick_ = true;
      eapor.utils.defaultAjax('../push/activityPush', data, $.proxy(this.submit_promotionPushCallback, this));
    },
    submit_promotionPushCallback(result) {
      console.info(result);
      this.fastclick_ = false;
      $('#submit_promotionPush').linkbutton('enable');
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '推送成功！', timeout: 3000, showType: 'slide' });
        promotion.maxId = 0;
        this.reset();
        this.getList();
        return;
      }
      if (result === -1) {
        $.messager.show({ title: '系统提示', msg: '推送失败！两周内不可重复推送！', timeout: 3000, showType: 'slide' });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '推送失败！', timeout: 3000, showType: 'slide' });
    },
    getParam() {
      const check1 = $($('input[name="checkbox_promotionPush"]:checked')[0]).val();
      const check2 = $($('input[name="checkbox_promotionPush"]:checked')[1]).val();
      let type = 0;
      if (check1 && check2) {
        type = 3;
      } else if (check1) {
        type = +check1;
      }
      return {//推送人群选择，1 本店会员 2储值会员 3都有
        type,
        theme: $('#activityTheme_promotionPush').textbox('getValue'),
        time: $('#activityTime_promotionPush').textbox('getValue'),
        address: $('#activityAddress_promotionPush').textbox('getValue'),
        detail: $('#activityDetail_promotionPush').textbox('getValue')
      };
    },
    reset() {
      $('input[name="checkbox_promotionPush"]').eq(0).prop('checked', 'checked').end().eq(1).prop('checked', 'checked');
      $('#activityTheme_promotionPush').textbox('clear').textbox('resetValidation');
      $('#activityTime_promotionPush').textbox('clear').textbox('resetValidation');
      $('#activityAddress_promotionPush').textbox('clear').textbox('resetValidation');
      $('#activityDetail_promotionPush').textbox('clear').textbox('resetValidation');
    },
    validate(data) {
      if (!data) {
        $.messager.show({ title: '系统提示', msg: '推送对象至少选择一项！', timeout: 3000, showType: 'slide' });
        return false;
      }
      if (!$('#activityTheme_promotionPush').textbox('isValid')) {
        $('#activityTheme_promotionPush').textbox('textbox').focus();
        return false;
      }
      if (!$('#activityTime_promotionPush').textbox('isValid')) {
        $('#activityTime_promotionPush').textbox('textbox').focus();
        return false;
      }
      if (!$('#activityAddress_promotionPush').textbox('isValid')) {
        $('#activityAddress_promotionPush').textbox('textbox').focus();
        return false;
      }
      if (!$('#activityDetail_promotionPush').textbox('isValid')) {
        $('#activityDetail_promotionPush').textbox('textbox').focus();
        return false;
      }
      return true;
    },
    getList() {
      eapor.utils.defaultAjax('../push/selectCount', { content: '' }, $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      const _this = this;
      const page_promotionPush = $('#page_promotionPush');
      page_promotionPush.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: function (pageNumber, pageSize) {
          if (pageNumber == 0) {
            return;
          }
          console.info({
            offset: pageSize * (pageNumber - 1), limit: pageSize,
            content: ''
          })
          eapor.utils.defaultAjax('../push/selectPage',
            { offset: pageSize * (pageNumber - 1), limit: pageSize, content: '', maxId: _this.maxId },
            $.proxy(_this.listPushCallBack, _this));
        }
      });
      eapor.utils.defaultAjax('../push/selectPage',
        { offset: 0, limit: page_promotionPush.pagination('options').pageSize, content: '', maxId: this.maxId },
        $.proxy(this.firstlistPushCallBack, this));
    },
    firstlistPushCallBack(result) {
      console.info(result);
      if (Array.isArray(result.data)) {
        this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        this.maxId = result.maxId;
        $('#list_promotionPush').datagrid('loadData', result.data);
      }
    },
    listPushCallBack(result) {
      console.info(result);
      if (Array.isArray(result.data)) {
        $('#list_promotionPush').datagrid('loadData', result.data);
      }
    },
    randerTable() {
      $('#list_promotionPush').datagrid({
        title: '促销推送列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        striped: true,//隔行变色
        loadMsg: "loading....",
        singleSelect: false,
        fitColumns: true,
        rownumbers: true,
        data: [],
        onLoadSuccess(data) {
          console.info('data:', data);
          if (data.rows.length === 0) {
            $(this).datagrid('insertRow', {
              index: 0,	// 索引从0开始
              row: {
                messageId: '<span style="color:red;font-size:18px;">未查询到相关信息！</span>'
              }
            });
            $(this).datagrid('mergeCells', {
              index: 0,
              field: 'messageId',
              colspan: 6
            });
          }
          $('a[name="repush-promotion-push"]').on('click', function () {
            $('#activityDetail_promotionPush').textbox('setValue', $(this).attr('data-redata'));
          });
        },
        columns: [[
          { field: 'messageId', title: 'ID', width: 10, align: 'center' },
          {
            field: 'pushType', title: '推送对象', width: 20, align: 'center',
            formatter(value, row, index) {
              if (value === 'push_all') {
                return '所有会员';
              } else if (value === 'push_home') {
                return '本店会员';
              } else if (value === 'push_card') {
                return '储值会员';
              } else {
                return '';
              }
            }
          },
          { field: 'content', title: '消息内容', width: 40, align: 'center' },
          {
            field: 'pushTime', title: '推送时间', width: 30, align: 'center',
            formatter(value, row, index) {
              return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
            }
          },
          { field: 'pushNumber', title: '推送会员数', width: 15, align: 'center' },
          {
            field: 'cz', title: '操作', width: 16, align: 'center',
            formatter(value, row, index) {
              return `<a  class="dryColor" style="cursor:pointer;" 
						        			name="repush-promotion-push" data-redata="${row.content}">重发</a>`;
            }
          }
        ]]
      });
    },
    nextPushTime(time) {//time:上次推送时间
      if (!time) {
        return;
      }
      const nextPushTime = $('#nextPushTime_promotion_push');
      const prevTime = new Date(time).getTime() + 14 * 86400000;
      const nowTime = new Date().getTime();
      let seconds = prevTime - nowTime; //倒计时的秒数     
      let timer = setInterval(function () {
        let num = seconds / 1000;
        let text = '距离下次推送时间为：' +
          (Math.floor(num / 86400) < 10 ? '0' + Math.floor(num / 86400) : Math.floor(num / 86400)) +
          '天' +
          (Math.floor(num % 86400 / 3600) < 10 ? '0' + Math.floor(num % 86400 / 3600) : Math.floor(num % 86400 / 3600)) +
          '小时' +
          (Math.floor(num % 3600 / 60) < 10 ? '0' + Math.floor(num % 3600 / 60) : Math.floor(num % 3600 / 60)) +
          '分' +
          ((num % 60).toFixed(0) < 10 ? '0' + (num % 60).toFixed(0) : (num % 60).toFixed(0))
          + '秒';
        if (num < 1000) {
          text = '您现在可发送促销推送';
          clearInterval(timer);
        }
        nextPushTime.text(text);
        seconds = seconds - 1000;
      }, 1000)
    }
  };
  promotion.init();
})();