/**
 * JS名称：账务-->客源应收款管理
 */
~(function () {
  "use strict";
  const CRM = {
    channelId_customerReceivableManagement: 0,
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
      const getValue = sessionStorage.getItem("channelId_balanceOfReceivablesFromCustomers");
      if (getValue) {
        console.info(JSON.parse(getValue))
        console.info(JSON.parse(getValue).channelId)
        console.info(JSON.parse(getValue).channelName)
        $('#channel_customerReceivableManagement').combobox('setValue', JSON.parse(getValue).channelId);
        $('#channel_customerReceivableManagement').combobox('setText', JSON.parse(getValue).channelName);
        sessionStorage.setItem("channelId_balanceOfReceivablesFromCustomers", "");
        $('#searchByChannel_customerReceivableManagement').trigger('click');
      }
    },
    render() {
      $('#channel_customerReceivableManagement').combobox({
        url: '../channel/pglist',
        queryParams: { offset: 0, limit: 9999999, channelName: '', usageState: 1 },
        valueField: 'channelId',
        textField: 'channelName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        loadFilter: function (data) {
          let i = data.length - 1;
          for (; i > -1; i--) {
            if ((data[i].channelName === "会员") || (data[i].channelName === "非会员")) {
              eapor.utils.arrDelByLenId.call(data, i);
            }
          }
          return data;
        }
      });
    },
    renderTable() {
      var rowSelect_customerReceivableManagement = null,
        onlySelectedOneRowFlag = 0;
      $('#tab_customerReceivableManagement').datagrid({
        title: '', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        //loader:firstloader_customerReceivableManagement,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        singleSelect: true,
        fit: false,
        data: [],
        rownumbers: true,
        checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
        //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
        //如果为false，选择行将不选中复选框。
        checkOnSelect: false,
        onClickRow: function (rowIndex, rowData) {
          if (onlySelectedOneRowFlag == 2) {
            onlySelectedOneRowFlag = 0;
            return;
          } else {
            onlySelectedOneRowFlag = 1;
          }

          var rows = $(this).datagrid('getChecked');
          var flag = true;
          for (let i = 0; i < rows.length; i++) {
            if (rowData == rows[i]) {
              flag = false;
              break;
            }
          }

          if (flag) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_customerReceivableManagement = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_customerReceivableManagement = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        onCheck: function (rowIndex, rowData) {
          if (onlySelectedOneRowFlag == 2) {
            return;
          }

          if (onlySelectedOneRowFlag == 1) {
            onlySelectedOneRowFlag = 0;
            return;
          } else {
            onlySelectedOneRowFlag = 2;
          }

          if (rowData != rowSelect_customerReceivableManagement) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_customerReceivableManagement = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_customerReceivableManagement = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        onLoadSuccess: function (data) {
          //隐藏全选框
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
          if (!data.rows[0]) {
            $('#ac_channelName').textbox({});
            $('#ac_channelName').textbox('setText', "");
            $('#ac_countAmount').textbox({});
            $('#ac_countAmount').textbox('setText', "");
            $(this).datagrid('insertRow', {
              index: 0,	// 索引从0开始
              row: {
                type: '<span style="color:red;font-size:18px;">未查询到相关信息！</span>',
                creditBalance: '',
                accessAmount: '',
                amount: '',
                rechargeAmount: '',
                createTime: ''
              }
            });
            $(this).datagrid('mergeCells', {
              index: 0,
              field: 'type',
              colspan: 6
            });
            $(this).parent().find(".datagrid-cell-check").parent().css("border-color", "#FAFAFA")
              .children('div').children('input')[0].style.visibility = "hidden";
            $(this).parent().find(".datagrid-td-rownumber").css("background-color", "#FAFAFA").css("border-color", "#FAFAFA").children('div').html("");
            $(this).parent().find(".datagrid-td-merged").css("border-bottom-color", "#FAFAFA")
            var that = $(this).parent().find(".datagrid-td-merged").parent()[0];
            $(that).hover(function () { $(that).css("background-color", "#FAFAFA") });
          } else {
            $('#ac_channelName').textbox('setText', $('#channel_customerReceivableManagement').combobox('getText'));
            $('#ac_countAmount').textbox('setText', NP.divide(data.rows[0].creditBalance, 100) + "元");
          }
        },
        columns: [[  //-----columns start-----
          { field: 'guestName', title: "主宾姓名", align: 'center', width: 20, hidden: true },

          { field: 'ck', title: "", checkbox: true },
          {
            field: 'type', title: "分类", align: 'center', width: 20,
            formatter: function (value, row, index) {
              console.info(row);
              if (value === '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
                return value;
              }
              return row.amount > 0 ? '签单' : (row.amount < 0 ? '撤销签单' : '收款');
            }
          },
          {
            field: 'creditBalance', title: "应收款总额", align: 'center', width: 20,
            formatter: function (value, row, index) {
              return value ? NP.divide(value, 100) + '元' : '';
            }
          },
          {
            field: 'accessAmount', title: "收款", align: 'center', width: 20,
            formatter: function (value) {
              return value ? NP.divide(value, 100) + '元' : '';
            }
          },
          {
            field: 'amount', title: "宾客账单签单金额", align: 'center', width: 20,
            formatter: function (value) {
              return value ? NP.divide(value, 100) + '元' : '';
            }
          },
          {
            field: 'rechargeAmount', title: "冲抵应收款", align: 'center', width: 20,
            formatter: function (value) {
              return value ? NP.divide(value, 100) + '元' : '';
            }
          },
          {
            field: 'createTime', title: "日期时间", align: 'center', width: 20,
            formatter(value, row, index) {
              return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
            }
          }
        ]],
        toolbar: [
          { text: '客源单位:' }, '-', { text: '<input class="easyui-textbox" disabled id="ac_channelName" style="width:130px;"/>' },
          { text: '应收款总额:' }, '-', { text: '<input class="easyui-textbox" disabled id="ac_countAmount" style="width:130px;"/>' }
        ]
      });
    },
    bind() {
      $('#searchDetails_customerReceivableManagement').click(function () {
        var getSelected = $('#tab_customerReceivableManagement').datagrid('getSelected');
        console.info(getSelected);
        if (!getSelected) {
          $.messager.show({ title: '系统提示', msg: '请先选择要查询的信息！', timeout: 2000, showType: 'slide' });
          return;
        }
        if (getSelected.type === '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
          $.messager.show({ title: '系统提示', msg: '查询无效！', timeout: 2000, showType: 'slide' });
          return;
        }

        $.ajax({
          type: 'post',
          url: '../channel/getPerSignDetail',
          data: { receptionId: getSelected.receptionId, paymentId: getSelected.paymentId },
          dataType: "json"
        })
          .done(function (result) {
            console.info(result);
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            getSelected.result = result;
            var data = JSON.stringify(getSelected);
            sessionStorage.setItem("signdetailJSPParameter", data);

            if ($('#kzmaintable').tabs('exists', '签单明细')) {
              $('#kzmaintable').tabs('close', '签单明细');
              $('#kzmaintable').tabs('add', {
                title: '签单明细',
                closable: true,
                plain: false,
                border: false,
                href: '../client/signdetail.jsp'
              });
            } else {
              $('#kzmaintable').tabs('add', {
                title: '签单明细',
                closable: true,
                plain: false,
                border: false,
                href: '../client/signdetail.jsp'
              });
            }
          });
      });
      const this_ = this;
      $('#searchByChannel_customerReceivableManagement').click(function () {
        const text = $('#channel_customerReceivableManagement').combobox('getText');
        const id = $('#channel_customerReceivableManagement').combobox('getValue');
        console.info(text)
        console.info(id)
        if (!text) {
          $('#channel_customerReceivableManagement').combobox('textbox').focus();
          $.messager.show({ title: '系统提示', msg: '请先选择客源单位！', timeout: 2000, showType: 'slide', height: 'auto' });
          return;
        }
        this_.channelId_customerReceivableManagement = text;
        let flag = 0;
        if ($('#channel_customerReceivableManagement').combobox('getData').length === 0) {
          $.ajax({
            type: 'post',
            url: '../channel/pglist',
            data: { offset: 0, limit: 9999999, channelName: '', usageState: 1 },
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              action(result)
            })
            .fail(function (error) {
              console.info(error);
            });
        } else {
          action($('#channel_customerReceivableManagement').combobox('getData'))
        }
        function action(arrCombobox) {
          for (let i = 0; i < arrCombobox.length; i++) {
            if (text != arrCombobox[i].channelName) {
              flag = i;
            } else {
              break;
            }
            if (flag === (arrCombobox.length - 1)) {
              $.messager.show({ title: '系统提示', msg: '客源名称输入有误！', timeout: 2000, showType: 'slide' });
              return;
            }
          }
          $.each(arrCombobox, function (i, item) {
            if (this_.channelId_customerReceivableManagement === item.channelName) {
              this_.channelId_customerReceivableManagement = item.channelId;
              return;
            }
          })
          this_.getList();
          // $('#tab_customerReceivableManagement').datagrid("options").loader = searchloader_customerReceivableManagement;
          // $("#tab_customerReceivableManagement").datagrid("reload");
        }
      });
    },
    getList() {
      eapor.utils.defaultAjax(
        '../channel/getChannelBalanceFlowCount',
        { 
          creditChannelId: this.channelId_customerReceivableManagement,
          startDate: '',
          stopDate: ''
        },
        $.proxy(this.countCallBack, this)
      );
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      const _this = this;
      const page_div = $('#page_customerReceivableManagement');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage(pageNumber, pageSize) {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax(
            '../channel/getChannelBalanceFlow',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              startDate: '',
              stopDate: '',
              creditChannelId: _this.channelId_customerReceivableManagement
            },
            $.proxy(_this.listCallBack, _this)
          );
        }
      });
      eapor.utils.defaultAjax(
        '../channel/getChannelBalanceFlow',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          startDate: '',
          stopDate: '',
          creditChannelId: this.channelId_customerReceivableManagement
        },
        $.proxy(this.listCallBack, this)
      );
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#tab_customerReceivableManagement').datagrid('loadData', result);
      }
    }
  };
  CRM.init();

  //搜索loader函数
  // var channelId_customerReceivableManagement = "";

  // var searchloader_customerReceivableManagement = function (param, success, error) {
  //   console.info(channelId_customerReceivableManagement);
  //   $.ajax({
  //     url: '../channel/getChannelBalanceFlow',
  //     data: {
  //       startDate: undefined, stopDate: undefined,
  //       creditChannelId: channelId_customerReceivableManagement
  //     },
  //     type: "post",
  //     dataType: "json",
  //     success: function (data) {
  //       if (eapor.utils.ajaxCallBackErrInfo(data)) {
  //         $('#tab_customerReceivableManagement').datagrid('loadData', { total: 0, rows: [] });
  //         success([]);
  //         return;
  //       }
  //       if (data == "") {
  //         $('#tab_customerReceivableManagement').datagrid('loadData', { total: 0, rows: [] });
  //         success([]);
  //         return true;
  //       }
  //       var tmpjson = JSON.stringify(data);
  //       if (tmpjson == '[]') {
  //         $('#tab_customerReceivableManagement').datagrid('loadData', { total: 0, rows: [] });
  //         success([]);
  //         return true;
  //       }
  //       success(data);
  //       return true;
  //     },
  //     error: function (err) {
  //       alert(err);
  //     }
  //   });
  // };
  // var rowSelect_customerReceivableManagement = null,
  //   onlySelectedOneRowFlag = 0;
  // $('#tab_customerReceivableManagement').datagrid({
  //   title: '', 		//表格标题
  //   iconCls: 'icon-list',  //表格图标
  //   nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
  //   striped: true,
  //   //loader:firstloader_customerReceivableManagement,
  //   fitColumns: true, 		//防止水平滚动
  //   scrollbarSize: 0, 		//去掉右侧滚动条列
  //   collapsible: false,	//是否可折叠的 
  //   loadMsg: "loading....",
  //   singleSelect: true,
  //   fit: true,
  //   data: [],
  //   rownumbers: true,
  //   checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
  //   //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
  //   //如果为false，选择行将不选中复选框。
  //   checkOnSelect: false,
  //   onClickRow: function (rowIndex, rowData) {
  //     if (onlySelectedOneRowFlag == 2) {
  //       onlySelectedOneRowFlag = 0;
  //       return;
  //     } else {
  //       onlySelectedOneRowFlag = 1;
  //     }

  //     var rows = $(this).datagrid('getChecked');
  //     var flag = true;
  //     for (let i = 0; i < rows.length; i++) {
  //       if (rowData == rows[i]) {
  //         flag = false;
  //         break;
  //       }
  //     }

  //     if (flag) {
  //       $(this).datagrid('checkRow', rowIndex);
  //       $(this).datagrid('selectRow', rowIndex);
  //       rowSelect_customerReceivableManagement = $(this).datagrid('getSelected');
  //     }
  //     else {
  //       $(this).datagrid('uncheckRow', rowIndex);
  //       $(this).datagrid('unselectRow', rowIndex);
  //       rowSelect_customerReceivableManagement = null;
  //     }

  //     onlySelectedOneRowFlag = 0;
  //   },
  //   onCheck: function (rowIndex, rowData) {
  //     if (onlySelectedOneRowFlag == 2) {
  //       return;
  //     }

  //     if (onlySelectedOneRowFlag == 1) {
  //       onlySelectedOneRowFlag = 0;
  //       return;
  //     } else {
  //       onlySelectedOneRowFlag = 2;
  //     }

  //     if (rowData != rowSelect_customerReceivableManagement) {
  //       $(this).datagrid('checkRow', rowIndex);
  //       $(this).datagrid('selectRow', rowIndex);
  //       rowSelect_customerReceivableManagement = $(this).datagrid('getSelected');
  //     } else {
  //       $(this).datagrid('uncheckRow', rowIndex);
  //       $(this).datagrid('unselectRow', rowIndex);
  //       rowSelect_customerReceivableManagement = null;
  //     }

  //     onlySelectedOneRowFlag = 0;
  //   },
  //   onLoadSuccess: function (data) {
  //     //隐藏全选框
  //     $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
  //     if (!data.rows[0]) {
  //       $('#ac_channelName').textbox({});
  //       $('#ac_channelName').textbox('setText', "");
  //       $('#ac_countAmount').textbox({});
  //       $('#ac_countAmount').textbox('setText', "");
  //       $(this).datagrid('insertRow', {
  //         index: 0,	// 索引从0开始
  //         row: {
  //           type: '<span style="color:red;font-size:18px;">未查询到相关信息！</span>',
  //           creditBalance: '',
  //           accessAmount: '',
  //           amount: '',
  //           rechargeAmount: '',
  //           createTime: ''
  //         }
  //       });
  //       $(this).datagrid('mergeCells', {
  //         index: 0,
  //         field: 'type',
  //         colspan: 6
  //       });
  //       $(this).parent().find(".datagrid-cell-check").parent().css("border-color", "#FAFAFA")
  //         .children('div').children('input')[0].style.visibility = "hidden";
  //       $(this).parent().find(".datagrid-td-rownumber").css("background-color", "#FAFAFA").css("border-color", "#FAFAFA").children('div').html("");
  //       $(this).parent().find(".datagrid-td-merged").css("border-bottom-color", "#FAFAFA")
  //       var that = $(this).parent().find(".datagrid-td-merged").parent()[0];
  //       $(that).hover(function () { $(that).css("background-color", "#FAFAFA") });
  //     } else {
  //       $('#ac_channelName').textbox('setText', $('#channel_customerReceivableManagement').combobox('getText'));
  //       $('#ac_countAmount').textbox('setText', NP.divide(data.rows[0].creditBalance, 100) + "元");
  //     }
  //   },
  //   columns: [[  //-----columns start-----
  //     { field: 'guestName', title: "主宾姓名", align: 'center', width: 20, hidden: true },

  //     { field: 'ck', title: "", checkbox: true },
  //     {
  //       field: 'type', title: "分类", align: 'center', width: 20,
  //       formatter: function (value, row, index) {
  //         console.info(row);
  //         if (value === '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
  //           return value;
  //         }
  //         return row.amount > 0 ? '签单' : (row.amount < 0 ? '撤销签单' : '收款');
  //       }
  //     },
  //     {
  //       field: 'creditBalance', title: "应收款总额", align: 'center', width: 20,
  //       formatter: function (value, row, index) {
  //         return value ? NP.divide(value, 100) + '元' : '';
  //       }
  //     },
  //     {
  //       field: 'accessAmount', title: "收款", align: 'center', width: 20,
  //       formatter: function (value) {
  //         return value ? NP.divide(value, 100) + '元' : '';
  //       }
  //     },
  //     {
  //       field: 'amount', title: "宾客账单签单金额", align: 'center', width: 20,
  //       formatter: function (value) {
  //         return value ? NP.divide(value, 100) + '元' : '';
  //       }
  //     },
  //     {
  //       field: 'rechargeAmount', title: "冲抵应收款", align: 'center', width: 20,
  //       formatter: function (value) {
  //         return value ? NP.divide(value, 100) + '元' : '';
  //       }
  //     },
  //     {
  //       field: 'createTime', title: "日期时间", align: 'center', width: 20,
  //       formatter: function (value) {
  //         return value ? NP.divide(value, 100) + '元' : '';
  //       }
  //     }
  //   ]],
  //   toolbar: [
  //     { text: '客源单位:' }, '-', { text: '<input class="easyui-textbox" disabled id="ac_channelName" style="width:130px;"/>' },
  //     { text: '应收款总额:' }, '-', { text: '<input class="easyui-textbox" disabled id="ac_countAmount" style="width:130px;"/>' }
  //   ]
  // });
  // //搜索按钮
  // $('#searchByChannel_customerReceivableManagement').click(function () {
  //   var text = $('#channel_customerReceivableManagement').combobox('getText');
  //   var id = $('#channel_customerReceivableManagement').combobox('getValue');
  //   console.info(text)
  //   console.info(id)
  //   if (text == "") {
  //     $('#channel_customerReceivableManagement').combobox('textbox').focus();
  //     $.messager.show({ title: '系统提示', msg: '请先选择客源单位！', timeout: 2000, showType: 'slide', height: 'auto' });
  //     return;
  //   }
  //   channelId_customerReceivableManagement = text;
  //   var flag = 0;
  //   if ($('#channel_customerReceivableManagement').combobox('getData').length === 0) {
  //     $.ajax({
  //       type: 'post',
  //       url: '../channel/pglist',
  //       data: { offset: 0, limit: 9999999, channelName: '', usageState: 1 },
  //       dataType: 'json'
  //     })
  //       .done(function (result) {
  //         console.info(result);
  //         action(result)
  //       })
  //       .fail(function (error) {
  //         console.info(error);
  //       });
  //   } else {
  //     action($('#channel_customerReceivableManagement').combobox('getData'))
  //   }
  //   function action(arrCombobox) {
  //     for (let i = 0; i < arrCombobox.length; i++) {
  //       if (text != arrCombobox[i].channelName) {
  //         flag = i;
  //       } else {
  //         break;
  //       }
  //       if (flag == (arrCombobox.length - 1)) {
  //         $.messager.show({ title: '系统提示', msg: '客源名称输入有误！', timeout: 2000, showType: 'slide' });
  //         return;
  //       }
  //     }
  //     $.each(arrCombobox, function (i, item) {
  //       if (channelId_customerReceivableManagement == item.channelName) {
  //         channelId_customerReceivableManagement = item.channelId;
  //         return;
  //       }
  //     })
  //     $('#tab_customerReceivableManagement').datagrid("options").loader = searchloader_customerReceivableManagement;
  //     $("#tab_customerReceivableManagement").datagrid("reload");
  //   }

  // });
  // //查询明细按钮
  // $('#searchDetails_customerReceivableManagement').click(function () {
  //   var getSelected = $('#tab_customerReceivableManagement').datagrid('getSelected');
  //   console.info(getSelected);
  //   if (!getSelected) {
  //     $.messager.show({ title: '系统提示', msg: '请先选择要查询的信息！', timeout: 2000, showType: 'slide' });
  //     return;
  //   }
  //   if (getSelected.type === '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
  //     $.messager.show({ title: '系统提示', msg: '查询无效！', timeout: 2000, showType: 'slide' });
  //     return;
  //   }

  //   $.ajax({
  //     type: 'post',
  //     url: '../channel/getPerSignDetail',
  //     data: { receptionId: getSelected.receptionId, paymentId: getSelected.paymentId },
  //     dataType: "json"
  //   })
  //     .done(function (result) {
  //       console.info(result);
  //       if (eapor.utils.ajaxCallBackErrInfo(result)) {
  //         return;
  //       }
  //       getSelected.result = result;
  //       var data = JSON.stringify(getSelected);
  //       sessionStorage.setItem("signdetailJSPParameter", data);

  //       if ($('#kzmaintable').tabs('exists', '签单明细')) {
  //         $('#kzmaintable').tabs('close', '签单明细');
  //         $('#kzmaintable').tabs('add', {
  //           title: '签单明细',
  //           closable: true,
  //           plain: false,
  //           border: false,
  //           href: '../client/signdetail.jsp'
  //         });
  //       } else {
  //         $('#kzmaintable').tabs('add', {
  //           title: '签单明细',
  //           closable: true,
  //           plain: false,
  //           border: false,
  //           href: '../client/signdetail.jsp'
  //         });
  //       }
  //     });
  // });


  // $('#channel_customerReceivableManagement').combobox({
  //   url: '../channel/pglist',
  //   queryParams: { offset: 0, limit: 9999999, channelName: '', usageState: 1 },
  //   valueField: 'channelId',
  //   textField: 'channelName',
  //   panelHeight: 'auto',
  //   panelMaxHeight: 200,
  //   loadFilter: function (data) {
  //     let i = data.length - 1;
  //     for (; i > -1; i--) {
  //       if ((data[i].channelName == "会员") || (data[i].channelName == "非会员")) {
  //         eapor.utils.arrDelByLenId.call(data, i);
  //       }
  //     }
  //     return data;
  //   }
  // });
  // var getValue = sessionStorage.getItem("channelId_balanceOfReceivablesFromCustomers");
  // if (getValue) {
  //   console.info(JSON.parse(getValue))
  //   console.info(JSON.parse(getValue).channelId)
  //   console.info(JSON.parse(getValue).channelName)
  //   $('#channel_customerReceivableManagement').combobox('setValue', JSON.parse(getValue).channelId);
  //   $('#channel_customerReceivableManagement').combobox('setText', JSON.parse(getValue).channelName);
  //   sessionStorage.setItem("channelId_balanceOfReceivablesFromCustomers", "");
  //   $('#searchByChannel_customerReceivableManagement').trigger('click');
  // }
})();