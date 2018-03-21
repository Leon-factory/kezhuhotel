/*
 *@客户关系--促销推送记录
 */
~(function () {
  'use strict';
  $(function () {
    const promotionPushRecording = {
      maxId: 0,
      init() {
        this.randerTable();
        this.bind();
        this.getList();
      },
      bind() {
        $('#searchPromotionPushRecording').on('click', () => {
          console.info($('#searchCode_promotionPushRecording').textbox('getValue'));
          this.getList();
        });
      },
      getList() {
        console.info({ content: $('#searchCode_promotionPushRecording').textbox('getValue') });
        eapor.utils.defaultAjax('../push/selectCount',
          { content: $('#searchCode_promotionPushRecording').textbox('getValue') },
          $.proxy(this.countCallBack, this));
      },
      countCallBack(result) {
        console.info(result);
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          return;
        }
        const _this = this;
        const searchCode_promotionPushRecording = $('#searchCode_promotionPushRecording');
        const page_promotionPushRecording = $('#page_promotionPushRecording');
        page_promotionPushRecording.pagination({
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
              content: searchCode_promotionPushRecording.textbox('getValue')
            })
            eapor.utils.defaultAjax('../push/selectPage',
              {
                offset: pageSize * (pageNumber - 1),
                limit: pageSize,
                content: searchCode_promotionPushRecording.textbox('getValue'),
                maxId: _this.maxId
              },
              $.proxy(_this.listCallBack, _this));
          }
        });
        eapor.utils.defaultAjax('../push/selectPage',
          {
            offset: 0, limit: page_promotionPushRecording.pagination('options').pageSize,
            content: searchCode_promotionPushRecording.textbox('getValue'), maxId: this.maxId
          },
          $.proxy(this.firstListCallBack, this));
      },
      firstListCallBack(result) {
        console.info(result);
        if (Array.isArray(result.data)) {
          this.maxId = result.maxId;
          $('#list_promotionPushRecording').datagrid('loadData', result.data);
        }
      },
      listCallBack(result) {
        console.info(result);
        if (Array.isArray(result.data)) {
          $('#list_promotionPushRecording').datagrid('loadData', result.data);
        }
      },
      randerTable() {
        $('#list_promotionPushRecording').datagrid({
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
            $('a[name="repush-promotion-push-recording"]').on('click', function () {
              if ($('#kzmaintable').tabs('exists', '促销推送')) {
                $('#kzmaintable').tabs('select', '促销推送');
                $('#activityDetail_promotionPush')
                  .textbox('setValue', $(this).attr('data-redata'))
                  .textbox('textbox')
                  .focus();
              } else {
                sessionStorage.setItem('activityDetail', $(this).attr('data-redata'));
                $('#kzmaintable').tabs('add', {
                  title: '促销推送',
                  closable: true,
                  plain: false,
                  border: false,
                  href: '../client/client_promotion_push.jsp'
                });
              }
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
                return `<a class="dryColor" style="cursor:pointer;" name="repush-promotion-push-recording" 
					        		data-redata="${row.content}">重发</a>`;
              }
            }
          ]]
        });
      }
    };
    promotionPushRecording.init();
  });
})();