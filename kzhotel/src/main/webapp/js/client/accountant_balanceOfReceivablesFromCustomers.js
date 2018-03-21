/**
 * //账务-->客源应收款余额统计
 */
~(function () {
  "use strict";
  const BRFC = {
    search_channelName: '',
    init() {
      this.render();
      this.randerTable();
      this.bind();
      this.getTopTableCountAmount();
      this.getList();
    },
    render() {
      $('#channel_balanceOfReceivablesFromCustomers').combobox({
        url: '../channel/pglist',
        queryParams: { offset: 0, limit: 9999999, channelName: '', usageState: 1 },
        valueField: 'channelId',
        textField: 'channelName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        loadFilter(data) {
          if (data != -3333 && data != -3335) {
            let len = data.length - 1;
            for (let i = len; i > -1; i--) {
              if ((data[i].channelName == "会员") || (data[i].channelName == "非会员")) {
                eapor.utils.arrDelByLenId.call(data, i);
              }
            }
            data.unshift({ channelId: 0, channelName: "全部" });
          }
          return data;
        }
      });
    },
    bind() {
      //搜索
      const _this = this;
      $('#searchByChannel_balanceOfReceivablesFromCustomers').click(function () {
        let getChannelData = $('#channel_balanceOfReceivablesFromCustomers').combobox('getData');
        let value = $('#channel_balanceOfReceivablesFromCustomers').combobox('getText');
        let flag = 0;
        for (let i = 0, len = getChannelData.length; i < len; i++) {
          if (value !== getChannelData[i].channelName) {
            flag = i;
          } else {
            break;
          }
          if (flag === (len - 1)) {
            $('#channel_balanceOfReceivablesFromCustomers').combobox('textbox').focus();
            $.messager.show({ title: '系统提示', msg: '客源单位输入有误！', timeout: 2000, showType: 'slide', height: 'auto' });
            return;
          }
        }
        value === "全部" ? _this.search_channelName = "" : _this.search_channelName = value;
        _this.getList();
      });

      //查询明细按钮
      $('#searchDetails_balanceOfReceivablesFromCustomers').click(function () {
        let selected = $('#tab_balanceOfReceivablesFromCustomers').datagrid('getSelected');
        if (!selected) {
          $.messager.show({ title: '系统提示', msg: '请先在明细中选择客源！', timeout: 2000, showType: 'slide' });
          return;
        }
        if (selected.channelName == "非会员" || selected.channelName == "会员") {
          $.messager.show({ title: '系统提示', msg: '该项无明细可查询！', timeout: 2000, showType: 'slide' });
          return;
        }

        sessionStorage.setItem("channelId_balanceOfReceivablesFromCustomers", JSON.stringify(selected));
        if ($('#kzmaintable').tabs('exists', '客源应收款管理')) {
          $('#kzmaintable').tabs('close', '客源应收款管理');
          $('#kzmaintable').tabs('add', {
            title: '客源应收款管理',
            closable: true,
            plain: false,
            border: false,
            href: '../client/accountant_customerReceivableManagement.jsp'
          });
        } else {
          $('#kzmaintable').tabs('add', {
            title: '客源应收款管理',
            closable: true,
            plain: false,
            border: false,
            href: '../client/accountant_customerReceivableManagement.jsp'
          });
        }

      });
      //客源高级管理按钮
      $('#toGuestHighLevelManage_balanceOfReceivablesFromCustomers').click(function () {
        let selected = $('#tab_balanceOfReceivablesFromCustomers').datagrid('getSelected');
        if (!selected) {
          $.messager.show({ title: '系统提示', msg: '请先在明细中选择客源！', timeout: 2000, showType: 'slide' });
          return;
        } else {
          sessionStorage.setItem("channelName_balanceOfReceivablesFromCustomers", selected.channelName);
          if ($('#kzmaintable').tabs('exists', '客源高级管理')) {
            $('#kzmaintable').tabs('close', '客源高级管理');
            $('#kzmaintable').tabs('add', {
              title: '客源高级管理',
              closable: true,
              plain: false,
              border: false,
              href: '../client/client_guestHighLevel_manage.jsp'
            });
          } else {
            $('#kzmaintable').tabs('add', {
              title: '客源高级管理',
              closable: true,
              plain: false,
              border: false,
              href: '../client/client_guestHighLevel_manage.jsp'
            });
          }
        }
      });
    },
    randerTable() {
      $('#tabSummary_balanceOfReceivablesFromCustomers').datagrid({
        title: '', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        //loader:firstloader_balanceOfReceivablesFromCustomers,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        //singleSelect:true,
        fit: true,
        rownumbers: true,
        columns: [[  //-----columns start-----
          //{field : 'channelId',title : "channelId",align : 'center',width:20,hidden:true},

          {
            field: 'balance', title: "应收款汇总", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;

            }
          },
          {
            field: 'creditAmount', title: "信用额度汇总", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;
            }
          },
          {
            field: 'creditAvailable', title: "信用额度余额汇总", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;
            }
          }
        ]]
      });

      let rowSelect_balanceOfReceivablesFromCustomers = null,
        onlySelectedOneRowFlag = 0;
      $('#tab_balanceOfReceivablesFromCustomers').datagrid({
        title: '', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//firstloader_balanceOfReceivablesFromCustomers,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        singleSelect: true,
        fit: true,
        rownumbers: true,
        checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
        //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
        //如果为false，选择行将不选中复选框。
        onClickRow(rowIndex, rowData) {
          if (onlySelectedOneRowFlag === 2) {
            onlySelectedOneRowFlag = 0;
            return;
          } else {
            onlySelectedOneRowFlag = 1;
          }

          let rows = $(this).datagrid('getChecked');
          let flag = true;
          for (let i = 0; i < rows.length; i++) {
            if (rowData == rows[i]) {
              flag = false;
              break;
            }
          }

          if (flag) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_balanceOfReceivablesFromCustomers = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_balanceOfReceivablesFromCustomers = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        onCheck: function (rowIndex, rowData) {
          if (onlySelectedOneRowFlag === 2) {
            return;
          }

          if (onlySelectedOneRowFlag == 1) {
            onlySelectedOneRowFlag = 0;
            return;
          } else {
            onlySelectedOneRowFlag = 2;
          }

          if (rowData != rowSelect_balanceOfReceivablesFromCustomers) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_balanceOfReceivablesFromCustomers = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_balanceOfReceivablesFromCustomers = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        onLoadSuccess(data) {
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
        },
        columns: [[  //-----columns start-----
          { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },

          { field: 'ck', title: '', checkbox: true },
          { field: 'channelName', title: "客源", align: 'center', width: 20 },
          {
            field: 'balance', title: "应收款余额", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;
            }
          },
          {
            field: 'creditAmount', title: "信用额度", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;
            }
          },
          {
            field: 'creditAvailable', title: "信用额度余额", align: 'center', width: 20,
            formatter(value) {
              return value ? NP.divide(value, 100) + "元" : 0;
            }
          }
        ]]
      });
    },
    getTopTableCountAmount() {
      eapor.utils.defaultAjax('../channel/channelCollectManage', {}, $.proxy(this.topTableCountAmountCallBack, this));
    },
    topTableCountAmountCallBack(result) {
      console.info(result);
      $('#tabSummary_balanceOfReceivablesFromCustomers').datagrid('loadData', [{
        balance: result.balance,
        creditAmount: result.creditAmount,
        creditAvailable: result.creditAvailable
      }]);
    },
    getList() {
      eapor.utils.defaultAjax('../channel/getChannelCount', { channelName: this.search_channelName, usageState: 0 }, $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      const _this = this;
      const page_div = $('#page_balanceOfReceivablesFromCustomers');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage(pageNumber, pageSize) {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../channel/listAdvanceChannelPage',
            { offset: pageSize * (pageNumber - 1), limit: pageSize, usageState: 0, channelName: _this.search_channelName },
            $.proxy(_this.listCallBack, _this));
        }
      });
      eapor.utils.defaultAjax('../channel/listAdvanceChannelPage',
        { offset: 0, limit: page_div.pagination('options').pageSize, usageState: 0, channelName: this.search_channelName },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //				this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //				this.maxId = result.maxId;
        $('#tab_balanceOfReceivablesFromCustomers').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#tab_balanceOfReceivablesFromCustomers').datagrid('loadData', result);
      }
    },
  };
  BRFC.init();
})();