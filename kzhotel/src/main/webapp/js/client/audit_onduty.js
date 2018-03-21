/**
 * JS名称：审核
 * @returns
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_auditOnduty");

  //简讯
  $('#shortInfo_auditOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    //rownumbers : true,
    columns: [[  //-----columns start-----
      { field: 'checkId', title: "auditUserId", align: 'center', width: 20, hidden: true },
      { field: 'userId', title: "successorUserId", align: 'center', width: 20, hidden: true },
      { field: 'successionId', title: "successionId", align: 'center', width: 20, hidden: true },
      { field: 'remark', title: "remark", align: 'center', width: 20, hidden: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },

      { field: 'username', title: "当班账号", align: 'center', width: 20 },
      {
        field: 'successionState', title: "当班状态", align: 'center', width: 12,
        formatter: function (value, row, index) {
          if (value == 1) {
            value = "当班";
          } else if (value == 2) {
            value = "结班";
          } else if (value == 3) {
            value = "已审";
          }
          return value;
        }
      },
      { field: 'startTime', title: "开班时间", align: 'center', width: 30 },
      {
        field: 'closeTime', title: "结班时间", align: 'center', width: 30,
        formatter: function (value, row, index) {
          if (value) return getDate(value);
          return "";
        }
      },
      { field: 'checkName', title: "审核账号", align: 'center', width: 20 },
      {
        field: 'checkTime', title: "审核时间", align: 'center', width: 30,
        formatter: function (value, row, index) {
          if (value) return getDate(value);
          return "";
        }
      }
    ]]
  });
  //汇总
  $('#countInfo_auditOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    //singleSelect:true,
    fit: true,
    //rownumbers : true,
    columns: [[  //-----columns start-----
      {
        field: 'cashPay', title: '现金', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'unionPay', title: '银联', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'weChatPay', title: '微信支付', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'aliPay', title: '支付宝', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'store', title: '储值', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'point', title: '积分', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'debts', title: '坏账', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'free', title: '免单', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      },
      {
        field: 'sign', title: '转应收款', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      }
    ]]
  });
  //明细
  $('#detailsInfo_auditOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    singleSelect: true,
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    fit: true,
    rownumbers: true,
    data: [],
    checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
    //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
    //如果为false，选择行将不选中复选框。
    onLoadSuccess: function (data) {
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
    },
    onClickRow: function (rowIndex, rowData) {
      if (auditOnduty.onlySelectedOneRowFlag == 2) {
        auditOnduty.onlySelectedOneRowFlag = 0;
        return;
      } else {
        auditOnduty.onlySelectedOneRowFlag = 1;
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
        auditOnduty.rowSelect_auditOnduty = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        auditOnduty.rowSelect_auditOnduty = null;
      }

      auditOnduty.onlySelectedOneRowFlag = 0;
    },
    onCheck: function (rowIndex, rowData) {
      if (auditOnduty.onlySelectedOneRowFlag == 2) {
        return;
      }

      if (auditOnduty.onlySelectedOneRowFlag == 1) {
        auditOnduty.onlySelectedOneRowFlag = 0;
        return;
      } else {
        auditOnduty.onlySelectedOneRowFlag = 2;
      }

      if (rowData != auditOnduty.rowSelect_auditOnduty) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        auditOnduty.rowSelect_auditOnduty = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        auditOnduty.rowSelect_auditOnduty = null;
      }

      auditOnduty.onlySelectedOneRowFlag = 0;
    },
    columns: [[
      { field: 'ck', title: '', checkbox: true },
      { field: 'typename', title: '分类', width: 12, align: 'center' },
      { field: 'time', title: '日期时间', width: 30, align: 'center' },
      {
        field: 'scene', title: '内容', width: 40, align: 'center',
        formatter: function (value, row, index) {//1未审核 2 通过 3 未通过
          if (value == "入住" || value == "预订" || value == "加单" || value == "续住" || value == "结账" && row.amount > 0) {
            return "收款/" + value;
          } else if (row.channelName != "" && row.channelName != undefined && row.amount > 0) {
            return value + "/" + row.channelName;
          } else if (row.channelName != "" && row.channelName != undefined && row.amount < 0) {
            return value;
          } else if (value == "入住" || value == "预订" || value == "加单" || value == "续住" || value == "结账" && row.amount > 0) {
            return "收款/" + value;
          } else if (value == "结账" && row.amount < 0) {
            return "退款/" + value;
          } else {
            return value;
          }
        }
      },
      { field: 'transaction', title: '交易方', width: 20, align: 'center' },
      {
        field: 'amount', title: '金额', width: 15, align: 'center',
        formatter: function (value, row, index) {
          if (row.scene == "缴款") {
            return "-" + NP.divide(value, 100) + "元";
          } else if (value) {
            return NP.divide(value, 100) + "元";
          } else {
            return "";
          }
        }
      }
    ]]
  });
  //搜索btn
  $('#search_auditOnduty').on('click', function () {
    auditOnduty.selectState_auditOnduty = $('#selectState_auditOnduty').combobox('getValue');
    auditOnduty.selectUserNum_auditOnduty = $('#selectUserNum_auditOnduty').combobox('getValue');
    auditOnduty.selectTime_auditOnduty = $('#selectTime_auditOnduty').datebox('getValue');
    var data = {
      successionState: Number($('#selectState_auditOnduty').combobox('getValue')),
      successorUserId: Number($('#selectUserNum_auditOnduty').combobox('getValue')),
      createTime: $('#selectTime_auditOnduty').datebox('getValue')
    };
    console.info(data)
    eapor.utils.defaultAjax('../shift/getSuccessionList', data, auditOnduty.searchLoadCallBack_auditOnduty);
  });
  //打印
  $('#printbtn_auditOnduty').on('click', function () {
    if ($('#shortInfo_auditOnduty').datagrid('getRows').length < 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未检测到当班记录信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var shortInfo = $('#shortInfo_auditOnduty').datagrid('getRows')[0];
    var countAount = $('#countInfo_auditOnduty').datagrid('getRows')[0];
    var details = $('#detailsInfo_auditOnduty').datagrid('getRows');
    //简讯
    $('#shortInfo_auditOndutyPrintTbody').empty();
    var successionState = "";
    if (shortInfo.successionState == '1') {
      successionState = '当班';
    } else if (shortInfo.successionState == '2') {
      successionState = '结班';
    } else {
      successionState = "已审";
    }
    var closeTime = "";
    if (shortInfo.closeTime != undefined) {
      shiftTime = shortInfo.closeTime;
    }
    var checkName = "";
    if (shortInfo.checkName != undefined) {
      checkName = shortInfo.checkName;
    }
    var checkTime = "";
    if (shortInfo.checkTime != undefined) {
      checkTime = shortInfo.checkTime;
    }
    $('#shortInfo_auditOndutyPrintTbody').append(
      '<tr>' +
      '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.username +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      successionState +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.startTime +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      closeTime +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      checkName +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      checkTime +
      '</td>' +
      '</tr>'
    );
    //汇总cashPay，unionPay，weChatPay，aliPay，store，point，debts，free，sign
    $('#countAount_auditOndutyPrintTbody').empty();
    $('#countAount_auditOndutyPrintTbody').append(
      '<tr>' +
      '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.cashPay, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.unionPay, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.weChatPay, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.aliPay, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.store, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.point, 100) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.debts, 100) +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.free, 100) +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.sign, 100) +
      '</td>' +
      '</tr>'
    );
    //明细
    $('#details_auditOndutyPrintTbody').empty();
    for (let i = 0; i < details.length; i++) {
      var scene = "";
      if (details[i].scene == "入住" || details[i].scene == "预订" || details[i].scene == "加单"
        || details[i].scene == "续住" || details[i].scene == "结账" && details[i].amount > 0) {
        scene = "收款/" + details[i].scene;
      } else if (details[i].channelName != "" && details[i].channelName != undefined &&
        details[i].amount > 0) {
        scene = details[i].scene + "/" + details[i].channelName;
      } else if (details[i].channelName != "" && details[i].channelName != undefined &&
        details[i].amount < 0) {
        scene = details[i].scene;
      } else if (details[i].scene == "入住" || details[i].scene == "预订" ||
        details[i].scene == "加单" || details[i].scene == "续住" ||
        details[i].scene == "结账" && details[i].amount > 0) {
        scene = "收款/" + details[i].scene;
      } else if (details[i].scene == "结账" && details[i].amount < 0) {
        scene = "退款/" + details[i].scene;
      } else {
        scene = details[i].scene;
      }

      var amount = "";
      if (details[i].scene == "缴款") {
        amount = "-" + NP.divide(details[i].amount, 100) + "元";
      } else if (details[i].amount != undefined || details[i].amount != "") {
        amount = NP.divide(details[i].amount, 100) + "元";
      }
      var transaction = "";
      if (details[i].transaction != undefined) {
        transaction = details[i].transaction;
      }
      var typename = "";
      if (details[i].typename != undefined) {
        typename = details[i].typename;
      }
      $('#details_auditOndutyPrintTbody').append(
        '<tr>' +
        '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        typename +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        details[i].time +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        scene +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        transaction +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        amount +
        '</td>' +
        '</tr>'
      );
    }
    var popTitle = "审核_" + getDate(new Date());
    $("div#printDiv_auditOnduty").printArea({ popTitle: popTitle, mode: 'popup' });
  });
  //审核缴款领款btn
  $('#checkAmount_auditOnduty').on('click', function () {
    var getSelected = $('#detailsInfo_auditOnduty').datagrid('getSelected');
    console.info(getSelected);
    if (!getSelected) {
      $.messager.show({ title: '系统提示', msg: '请先选择缴款或领款信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (getSelected.scene != '领款' && getSelected.scene != '缴款') {
      $.messager.show({ title: '系统提示', msg: '请选择缴款或领款信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (getSelected.transaction != '' && getSelected.transaction != undefined) {
      $.messager.show({ title: '系统提示', msg: '该信息已审核！请选择其他未审核的信息！', timeout: 3000, showType: 'slide', height: 'auto' });
      return;
    }

    $.messager.defaults.ok = "通过";
    $.messager.defaults.cancel = "不通过";
    $.messager.defaults.width = 350;

    $.messager.confirm(
      '系统提示',
      '<h3><span>您要审核的 </span><span style="color:red;">' + getSelected.scene + ' </span><span>金额为：</span> <span style="color:red;">' + NP.divide(getSelected.amount, 100) + ' </span><span>元</span></h3>'
      , function (r) {
        if (r) {
          console.info(this)
          var data = {
            successionId: 0,
            passcashId: getSelected.passcashId,
            state: 2	//当passcashId 不为0时，state  2通过    3不通过
            //当passcaId 为0时， state 1开班，2关闭，3审核
          }
          console.info(data);
          eapor.utils.defaultAjax('../shift/review', data, auditOnduty.checkAmountCallBack);
        }
        //		    else{
        //		    	var data = {
        //	    				successionId : 0,
        //	    				passcashId : getSelected.passcashId,
        //	    				state : 3	//当passcashId 不为0时，state  2通过    3不通过
        //	    						//当passcaId 为0时， state 1开班，2关闭，3审核
        //	    		}
        //	    		console.info(data);
        //	    		eapor.utils.defaultAjax('../shift/review',data,auditOnduty.checkAmountCallBack); 
        //		    }    
      });
    $.messager.defaults.ok = "确定";
    $.messager.defaults.cancel = "取消";
    $.messager.defaults.width = 300;
  });
  //审核当班记录
  $('#checkList_auditOnduty').on('click', function () {
    var shortRows = $('#shortInfo_auditOnduty').datagrid('getRows');
    if (shortRows.length < 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！未检测到当班记录信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var successionState = shortRows[0].successionState;
    if (successionState == 3) {
      $.messager.show({ title: '系统提示', msg: '操作无效！该当班记录已审核！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    if (successionState == 1) {
      $.messager.show({ title: '系统提示', msg: '操作无效！该当班记录未结班！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }

    var successionId = auditOnduty.successionId;//$('#shortInfo_auditOnduty').datagrid('getRows')[0].successionId;
    $.messager.defaults.ok = "通过";
    $.messager.defaults.cancel = "不通过";
    $.messager.defaults.width = 350;
    $.messager.confirm(
      '系统提示',
      '<h3><span>审核的当班账号为： </span><span style="color:red;">' + shortRows[0].username + ' </span></h3>'
      , function (r) {
        if (r) {
          var data = {
            successionId: successionId,
            passcashId: 0,
            state: 3	//当passcashId 不为0时，state  2通过    3不通过
            //当passcaId 为0时， state 1开班，2关闭，3审核
          }
          console.info(data);
          eapor.utils.defaultAjax('../shift/review', data, auditOnduty.checkAmountCallBack);
        }
        //		    else{
        //		    	var data = {
        //	    				successionId : successionId,
        //	    				passcashId : 0,
        //	    				state : 3	//当passcashId 不为0时，state  2通过    3不通过
        //	    						//当passcaId 为0时， state 1开班，2关闭，3审核
        //	    		}
        //	    		console.info(data);
        //	    		eapor.utils.defaultAjax('../shift/review',data,auditOnduty.checkAmountCallBack);
        //		    }    
      });
    $.messager.defaults.ok = "确定";
    $.messager.defaults.cancel = "取消";
    $.messager.defaults.width = 300;
  });
  var auditOnduty = {
    rowSelect_auditOnduty: null,
    onlySelectedOneRowFlag: 0,
    selectState_auditOnduty: "",
    selectUserNum_auditOnduty: "",
    selectTime_auditOnduty: "",
    successionId: "",
    init: function () {
      var data = {
        successionState: Number(2),
        successorUserId: Number(0),
        createTime: ""
      };
      eapor.utils.defaultAjax('../shift/getSuccessionList', data, auditOnduty.firstLoadCallBack_auditOnduty);
    },
    firstLoadCallBack_auditOnduty: function (result, type) {
      console.info(result);
      console.info(type);
      if (result.length > 0) {
        $('#append_auditOnduty').append(
          '<div id="div">' +
          '<table id="tab_auditOnduty"></table>' +
          '</div>'
        );
        $('#tab_auditOnduty').datagrid({
          title: '', 		//表格标题
          iconCls: 'icon-list',  //表格图标
          nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
          striped: true,
          fitColumns: true, 		//防止水平滚动
          scrollbarSize: 0, 		//去掉右侧滚动条列
          collapsible: false,	//是否可折叠的 
          loadMsg: "loading....",
          fit: true,
          data: result,
          singleSelect: true,
          rownumbers: true,
          columns: [[
            { field: 'successorUserId', title: "当班账号", align: 'center', width: 20, hidden: true },
            { field: 'successionId', title: "当班账号", align: 'center', width: 20, hidden: true },
            { field: 'remark', title: "当班账号", align: 'center', width: 20, hidden: true },
            { field: 'hotelId', title: "当班账号", align: 'center', width: 20, hidden: true },

            { field: 'successorUsername', title: "当班账号", align: 'center', width: 20 },
            {
              field: 'successionState', title: "当班状态", align: 'center', width: 12,
              formatter: function (value, row, index) {
                if (value == 1) {
                  value = "当班";
                } else if (value == 2) {
                  value = "结班";
                } else if (value == 3) {
                  value = "已审";
                }
                return value;
              }
            },
            {
              field: 'startTime', title: "开班时间", align: 'center', width: 30,
              formatter: function (value, row, index) {
                if (value != undefined) return getDate(value);
                return "";
              }
            },
            {
              field: 'closeTime', title: "结班时间", align: 'center', width: 30,
              formatter: function (value, row, index) {
                if (value != undefined) return getDate(value);
                return "";
              }
            },
            { field: 'checkName', title: "审核账号", align: 'center', width: 20 },
            { field: 'checkTime', title: "审核时间", align: 'center', width: 30 }
          ]]
        });
        $('#div').dialog({
          title: '详情',
          width: 980,
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
              var getSelections = $('#tab_auditOnduty').datagrid('getSelections');
              console.info(getSelections)
              if (getSelections.length == 0) {
                $.messager.show({ title: '系统提示', msg: '请选择一项当班纪录！', timeout: 2000, showType: 'slide' });
                return;
              }

              var arr = [];
              arr.push(getSelections[0].pcs)
              //简讯
              $('#shortInfo_auditOnduty').datagrid('loadData', { total: 1, rows: arr });
              $('#shortInfo_auditOnduty').datagrid('reload');
              //汇总

              $('#countInfo_auditOnduty').datagrid('loadData', { total: 1, rows: arr });
              $('#countInfo_auditOnduty').datagrid('reload');
              //明细
              var result1 = JSON.stringify(getSelections[0].psd);
              var result = JSON.parse(result1);
              var flag1 = 0;
              var flag2 = 0;
              var flag3 = 0;
              var flag4 = 0;
              var flag5 = 0;
              var flag6 = 0;
              var flag7 = 0;
              var flag8 = 0;
              var flag9 = 0;

              for (var i = 0; i < result.length; i++) {
                if (result[i].scene == "交款") {
                  result.splice(0, 0, result[i]);
                  result.splice(i + 1, 1);
                }
                if (result[i].scene == "接款") {
                  result.splice(0, 0, result[i]);
                  result.splice(i + 1, 1);
                }
                if (result[i].scene == "领用") {
                  result.splice(0, 0, result[i]);
                  result.splice(i + 1, 1);
                  result[0].scene = "领款";
                }
                if (result[i].scene == "缴款") {
                  result.splice(0, 0, result[i]);
                  result.splice(i + 1, 1);
                }
              }
              //1 现金2 银联 3 微信支付 4 支付宝 5 储值 6积分 -3坏账 -2免单  -1转应收款
              for (let i = (result.length - 1); i > -1; i--) {
                if (result[i].scene == "开班" || result[i].scene == "入住" && result[i].amount == 0) {
                  eapor.utils.arrDelByLenId.call(result, i);
                }
              }
              for (let i = 0; i < result.length; i++) {

                if (result[i].type == 1 && flag1 == 0) {
                  result[i].typename = "现金";
                  flag1 = 1;
                }
                if (result[i].type == 2 && flag2 == 0) {
                  result[i].typename = "银联POS";
                  flag2 = 1;
                }
                if (result[i].type == 3 && flag3 == 0) {
                  result[i].typename = "微信支付";
                  flag3 = 1;
                }
                if (result[i].type == 4 && flag4 == 0) {
                  result[i].typename = "支付宝";
                  flag4 = 1;
                }
                if (result[i].type == 5 && flag5 == 0) {
                  result[i].typename = "储值";
                  flag5 = 1;
                }
                if (result[i].type == 6 && flag6 == 0) {
                  result[i].typename = "积分";
                  flag6 = 1;
                }
                if (result[i].type == -3 && flag7 == 0) {
                  result[i].typename = "坏账";
                  flag7 = 1;
                }
                if (result[i].type == -2 && flag8 == 0) {
                  result[i].typename = "免单";
                  flag8 = 1;
                }
                if (result[i].type == -1 && flag9 == 0) {
                  result[i].typename = "转应收款";
                  flag9 = 1;
                }
                if (result[i].scene == "开班" || result[i].scene == "入住" && result[i].amount == 0) {
                  eapor.utils.arrDelByLenId.call(result, i);
                }
              }
              auditOnduty.successionId = getSelections[0].successionId;
              console.info(auditOnduty.successionId)
              $('#detailsInfo_auditOnduty').datagrid('loadData', { total: 1, rows: result });
              $('#detailsInfo_auditOnduty').datagrid('reload');
              $('#div').dialog('close');
            }
          }, {
            text: '取消',
            handler: function () {
              $('#div').dialog('close');
            }
          }]
        });
      } else {
        if (type != undefined) $.messager.show({ title: '系统提示', msg: '未查询到相关信息！', timeout: 3000, showType: 'slide' });
      }
    },
    searchLoadCallBack_auditOnduty: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      auditOnduty.firstLoadCallBack_auditOnduty(result, 1);
    },
    //审核缴款、领款回调函数
    checkAmountCallBack: function (result) {
      console.info(result);
      console.info(auditOnduty.successionId);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '审核成功！', timeout: 3000, showType: 'slide' });
        console.info(auditOnduty.successionId)
        eapor.utils.defaultAjax('../shift/getSuccessInfoById', { successionId: auditOnduty.successionId }, auditOnduty.reloadData);
        $('#div').dialog('close');

      } else {
        $.messager.show({ title: '系统提示', msg: '审核失败！', timeout: 3000, showType: 'slide' });
      }
    },
    reloadData: function (data) {
      console.info(data);
      var arr = [];
      arr.push(data.perCurrentSuccesion);
      //简讯
      $('#shortInfo_auditOnduty').datagrid('loadData', { total: 1, rows: arr });
      $('#shortInfo_auditOnduty').datagrid('reload');
      //汇总

      $('#countInfo_auditOnduty').datagrid('loadData', { total: 1, rows: arr });
      $('#countInfo_auditOnduty').datagrid('reload');
      //明细
      var result1 = JSON.stringify(data.perSuccessionDetails);
      var result = JSON.parse(result1);
      var flag1 = 0;
      var flag2 = 0;
      var flag3 = 0;
      var flag4 = 0;
      var flag5 = 0;
      var flag6 = 0;
      var flag7 = 0;
      var flag8 = 0;
      var flag9 = 0;

      for (var i = 0; i < result.length; i++) {
        if (result[i].scene == "交款") {
          result.splice(0, 0, result[i]);
          result.splice(i + 1, 1);
        }
        if (result[i].scene == "接款") {
          result.splice(0, 0, result[i]);
          result.splice(i + 1, 1);
        }
        if (result[i].scene == "领用") {
          result.splice(0, 0, result[i]);
          result.splice(i + 1, 1);
          result[0].scene = "领款";
        }
        if (result[i].scene == "缴款") {
          result.splice(0, 0, result[i]);
          result.splice(i + 1, 1);
        }
      }
      //1 现金2 银联 3 微信支付 4 支付宝 5 储值 6积分 -3坏账 -2免单  -1转应收款
      for (let i = (result.length - 1); i > -1; i--) {
        if (result[i].scene == "开班" || result[i].scene == "入住" && result[i].amount == 0) {
          eapor.utils.arrDelByLenId.call(result, i);
        }
      }
      for (let i = 0; i < result.length; i++) {

        if (result[i].type == 1 && flag1 == 0) {
          result[i].typename = "现金";
          flag1 = 1;
        }
        if (result[i].type == 2 && flag2 == 0) {
          result[i].typename = "银联POS";
          flag2 = 1;
        }
        if (result[i].type == 3 && flag3 == 0) {
          result[i].typename = "微信支付";
          flag3 = 1;
        }
        if (result[i].type == 4 && flag4 == 0) {
          result[i].typename = "支付宝";
          flag4 = 1;
        }
        if (result[i].type == 5 && flag5 == 0) {
          result[i].typename = "储值";
          flag5 = 1;
        }
        if (result[i].type == 6 && flag6 == 0) {
          result[i].typename = "积分";
          flag6 = 1;
        }
        if (result[i].type == -3 && flag7 == 0) {
          result[i].typename = "坏账";
          flag7 = 1;
        }
        if (result[i].type == -2 && flag8 == 0) {
          result[i].typename = "免单";
          flag8 = 1;
        }
        if (result[i].type == -1 && flag9 == 0) {
          result[i].typename = "转应收款";
          flag9 = 1;
        }
        if (result[i].scene == "开班" || result[i].scene == "入住" && result[i].amount == 0) {
          eapor.utils.arrDelByLenId.call(result, i);
        }
      }
      console.info(data);
      if (data.perCurrentSuccesion.hasOwnProperty("successionId")) {
        auditOnduty.successionId = data.perCurrentSuccesion.successionId;
      }
      console.info(auditOnduty.successionId)
      $('#detailsInfo_auditOnduty').datagrid('loadData', { total: 1, rows: result });
      $('#detailsInfo_auditOnduty').datagrid('reload');
    }
  };

  console.info($('#succession').val());
  //当班状态：1工作中、2已结班、3已审核、0全部
  $('#selectState_auditOnduty').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "当班"
    }, {
      "id": 2,
      "text": "结班"

    }, {
      "id": 3,
      "text": "已审"
    }],
    editable: false,
    panelHeight: 'auto',
  });
  //账号
  $('#selectUserNum_auditOnduty').combobox({
    url: '../user/ujlist',
    queryParams: { offset: 0, limit: 9999, maxUserId: 9999, usergroupId: 0, username: '' },
    valueField: 'userId',
    textField: 'username',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter: function (data) {
      data.unshift({ userId: 0, username: '全部' });
      return data;
    }
  });
  //日期
  $('#selectTime_auditOnduty').datebox({ editable: false });
  auditOnduty.init();

})();