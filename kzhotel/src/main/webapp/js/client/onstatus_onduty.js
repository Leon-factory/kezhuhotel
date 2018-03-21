/**
 * JS名称：当班记录JS
 */
~(function () {
  "use strict";
  //打印按钮
  $('#print_onstatusOnduty').click(function () {
    if ($('#shortInfo_onstatusOnduty').datagrid('getData').rows.length < 1) {
      $.messager.show({ title: '系统提示', msg: '未得到当班信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
    var shortInfo = $('#shortInfo_onstatusOnduty').datagrid('getRows')[0];
    var countAount = $('#countAount_onstatusOnduty').datagrid('getRows')[0];
    var details = $('#details_onstatusOnduty').datagrid('getRows');
    //简讯
    $('#shortInfo_onstatusOndutyPrintTbody').empty();
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
      closeTime = shortInfo.closeTime;
    }
    $('#shortInfo_onstatusOndutyPrintTbody').append(
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
        shortInfo.checkName ? shortInfo.checkName : '' +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        shortInfo.checkTime +
        '</td>' +
        '</tr>'
    );
    //汇总cashPay，unionPay，weChatPay，aliPay，store，point，debts，free，sign
    $('#countAount_onstatusOndutyPrintTbody').empty();
    $('#countAount_onstatusOndutyPrintTbody').append(
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
    $('#details_onstatusOndutyPrintTbody').empty();
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
      $('#details_onstatusOndutyPrintTbody').append(
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
    var popTitle = "当班记录_" + shortInfo.username + '_' + getDate(new Date());
    $("div#print_onstatusOnduty").printArea({ popTitle: popTitle, mode: 'popup' });

  });

  //交款按钮
  $('#addDeliverCash_onstatusOnduty').click(function () {
    //获取当前班次信息
    eapor.utils.defaultAjax("../shift/getActiveSuccession", {}, OnDuty.addDeliverCashCallBack);
  });
  //接款按钮
  $('#acceptMoney_onstatusOnduty').click(function () {
    if ($('#shortInfo_onstatusOnduty').datagrid('getData').rows.length > 0) {
      var successionState = $('#shortInfo_onstatusOnduty').datagrid('getData').rows[0].successionState;
      if (successionState == "1") {
        if ($('#kzmaintable').tabs('exists', '开班和接款')) {
          $('#kzmaintable').tabs('close', '开班和接款');
          $('#kzmaintable').tabs('add', {
            title: '开班和接款',
            closable: true,
            plain: false,
            border: false,
            href: '../client/accept_onduty.jsp'
          });
        } else {
          $('#kzmaintable').tabs('add', {
            title: '开班和接款',
            closable: true,
            plain: false,
            border: false,
            href: '../client/accept_onduty.jsp'
          });
        }
      } else {
        $.messager.show({ title: '系统提示', msg: '接款操作无效！您未在当班状态！', timeout: 2000, showType: 'slide', height: 'auto' });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '未得到当班信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
  });
  //缴款按钮
  $('#payment_onstatusOnduty').click(function () {
    //获取当前班次信息
    eapor.utils.defaultAjax("../shift/getActiveSuccession", {}, OnDuty.paymentOndutyCallBack);
  });
  //领款按钮
  $('#collarMoney_onstatusOnduty').click(function () {
    //获取当前班次信息
    eapor.utils.defaultAjax("../shift/getActiveSuccession", {}, OnDuty.contributionOnduty_getCurrentShift);
  });
  //结班按钮
  $('#close_onstatusOnduty').click(function () {
    console.info($('#succession').val());
    if ($('#shortInfo_onstatusOnduty').datagrid('getData').rows.length > 0) {
      console.info($('#shortInfo_onstatusOnduty').datagrid('getData').rows[0])
      var successionState = $('#shortInfo_onstatusOnduty').datagrid('getData').rows[0].successionState;
      console.info(successionState);
      if (successionState == "1") {
        var cashPayAmount = $('#countAount_onstatusOnduty').datagrid('getData').rows[0].cashPay;
        console.info(cashPayAmount);
        if (cashPayAmount == 0) {
          $.messager.confirm('确认', '您确认要进行结班操作吗？', function (r) {
            if (r) {
              var data = {
                successionId: $('#succession').val(),//开班id
                successionState: 2//1开班，2关闭，3审核
              }
              console.info(data);
              eapor.utils.defaultAjax("../shift/modifySuccessionState", data, OnDuty.close_onstatusOndutyCallBack);
            }
          });
        } else {
          $.messager.show({ title: '系统提示', msg: '当前不能结班！现金未归0！', timeout: 2000, showType: 'slide', height: 'auto' });
          return;
        }
      } else {
        $.messager.show({ title: '系统提示', msg: '无效的操作！', timeout: 2000, showType: 'slide', height: 'auto' });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '未得到当班信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
  });

  //撤销结班按钮
  $('#cancelClose_onstatusOnduty').click(function () {
    if ($('#shortInfo_onstatusOnduty').datagrid('getData').rows.length > 0) {
      var successionState = $('#shortInfo_onstatusOnduty').datagrid('getData').rows[0].successionState;
      console.info(successionState);
      if (successionState == 2) {
        $.ajax({
          type: 'post',
          dataType: 'json',
          url: '../shift/getSuccessionList',
          data: { successionState: 2, successorUserId: $('#indexuserId').val(), createTime: "" }
        })
          .done(function (getSuccessionList) {
            if (getSuccessionList != undefined && getSuccessionList.length > 0) {
              for (let i = 0; i < getSuccessionList.length; i++) {
                console.info(getSuccessionList[i].startTime === OnDuty.startTime)
                if (getSuccessionList[i].startTime === OnDuty.startTime) {
                  OnDuty.successionId = getSuccessionList[i].successionId;
                  break;
                }
              }
            }
            $.messager.confirm('确认', '您确认要进行撤销结班的操作吗？', function (r) {
              if (r) {
                var data = {
                  successionId: OnDuty.successionId,//$('#succession').val(),//开班id
                  successionState: 1//1开班，2关闭，3审核
                }
                console.info(data);
                eapor.utils.defaultAjax("../shift/modifySuccessionState", data, OnDuty.cancelClose_onstatusOndutyCallBack);
              }
            });
          });
      } else if (successionState == 1) {
        $.messager.show({ title: '系统提示', msg: '无效的操作！请先结班！', timeout: 2000, showType: 'slide', height: 'auto' });
        return;
      }
    } else {
      $.messager.show({ title: '系统提示', msg: '未得到当班信息！', timeout: 2000, showType: 'slide', height: 'auto' });
      return;
    }
  });
  //简讯
  $('#shortInfo_onstatusOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: false,
    fit: true,
    striped: true,//隔行变色
    //rownumbers : true,
    columns: [[
      { field: 'checkId', title: 'checkId', width: 20, align: 'center', hidden: true },
      { field: 'userId', title: 'userId', width: 20, align: 'center', hidden: true },

      { field: 'username', title: '当班账号', width: 20, align: 'center' },
      {
        field: 'successionState', title: '当班状态', width: 15, align: 'center',
        formatter: function (value, row, index) {
          if (value == "1") {
            return "当班";
          } else if (value == "2") {
            return "结班";
          } else if (value == "3") {
            return "已审";
          } else {
            return value;
          }
        }
      },
      { field: 'startTime', title: '开班时间', width: 30, align: 'center' },
      { field: 'closeTime', title: '结班时间', width: 30, align: 'center' },
      { field: 'checkName', title: '审核账号', width: 20, align: 'center' },
      { field: 'checkTime', title: '审核时间', width: 30, align: 'center' }
    ]]
  });
  //汇总
  $('#countAount_onstatusOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: false,
    fit: true,
    striped: true,//隔行变色
    //rownumbers : true,
    columns: [[
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
      },
      {
        field: 'instead', title: '代收', width: 20, align: 'center',
        formatter: function (value) {
          return NP.divide(value, 100);
        }
      }
    ]]
  });
  //明细
  $('#details_onstatusOnduty').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: true,
    fit: true,
    striped: true,//隔行变色
    rownumbers: true,
    onLoadSuccess: function (data) {
      //合并分类 单元格
      var rows = data.rows,
        len = data.total,
        i = 0,
        arr = [];
      for (; i < len; i++) {
        if (rows[i].hasOwnProperty("typename")) {
          arr.push(i);
        }
      }
      var x = arr.length;
      if (x == 0) {
        return;
      } else if (x == 1) {
        $(this).datagrid('mergeCells', {
          index: 0,
          field: 'typename',
          rowspan: len
        });
      } else {
        for (let k = 0; k < x; k++) {
          if (k < (x - 1)) {
            $(this).datagrid('mergeCells', {
              index: arr[k],
              field: 'typename',
              rowspan: arr[k + 1] - arr[k]
            });
          } else {
            $(this).datagrid('mergeCells', {
              index: arr[k],
              field: 'typename',
              rowspan: len
            });
          }
        }
      }
      //改变分类偶数行背景色
      $(this).prev().find('td[class="datagrid-td-merged"]:even').css('background-color', '#fafafa');
      //改变分类奇数行背景色
      $(this).prev().find('td[class="datagrid-td-merged"]:odd').css('background-color', '#f5f5f5');
    },
    columns: [[
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
          } else if (value != undefined || value != "") {
            return NP.divide(value, 100) + "元";
          } else {
            return "";
          }
        }
      }
    ]]
  });

  var OnDuty = {

    startTime: '',
    successionId: "",
    shouldShiftAmount: "",
    init: function () {
      $.ajax({
        type: 'post',
        url: '../shift/getCurrentSuccession',
        data: {},
        dataType: "json",
        success: function (result) {
          console.info(result);
          if (result != null) {
            OnDuty.startTime = result.startTime;
            OnDuty.successionId = result.startTime;
            var arr = [];
            arr.push(result);
            $('#shortInfo_onstatusOnduty').datagrid('loadData', arr);
            $('#shortInfo_onstatusOnduty').datagrid('reload');
            $('#countAount_onstatusOnduty').datagrid('loadData', arr);
            $('#countAount_onstatusOnduty').datagrid('reload');
          }
        }
      });
      $.ajax({
        type: 'post',
        url: '../shift/getSuccessionDetail',
        data: {},
        dataType: "json",
        success: function (result) {
          console.info(result);
          var flag1 = 0
            , flag2 = 0
            , flag3 = 0
            , flag4 = 0
            , flag5 = 0
            , flag6 = 0
            , flag7 = 0
            , flag8 = 0
            , flag9 = 0
            , flagdaishou = 0;

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
            if (result[i].type == 6 && flag5 == 0) {
              result[i].typename = "储值";
              flag5 = 1;
            }
            if (result[i].type == 8 && flag6 == 0) {
              result[i].typename = "积分";
              flag6 = 1;
            }
            if (result[i].type == 7 && flagdaishou == 0) {
              result[i].typename = "代收";
              flag6 = 1;
            }
            if (result[i].type == -2 && flag7 == 0) {
              result[i].typename = "坏账";
              flag7 = 1;
            }
            if (result[i].type == -3 && flag8 == 0) {
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
          $('#details_onstatusOnduty').datagrid('loadData', result);
          $('#details_onstatusOnduty').datagrid('reload');
        }
      });
    },
    //撤销结班提交后的回调函数
    cancelClose_onstatusOndutyCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '撤销结班成功！', timeout: 2000 });
        OnDuty.init();
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000 });
        return;
      }
    },
    //结班提交后的回调函数
    close_onstatusOndutyCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.progress({
          title: "系统提示",
          msg: '结班成功！正在退出登录！',
          interval: '500'
        });
        setTimeout(function () {
          $.messager.progress('close');
          $.ajax({
            type: 'post',
            data: {},
            url: '../user/exit',
            dataType: 'json',
            success: function (result) {
              console.info(result);
              if (result.errCode >= 0) {
                if (window.location.hostname === 'localhost') {
                  window.location.href = "../";
                } else {
                  window.location.href = "../../";
                }
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              $.messager.show({ title: '系统提示', msg: '网络连接中断', timeout: 3000 });
              return;
            }
          });
        }, 5000);
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
        return;
      }
    },
    //交款提交后的回调函数
    addDeliverCash_result: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
        OnDuty.init();
        $('#showDialog_onduty').dialog('close');
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
        return;
      }
    },
    //交款提交
    addDeliverCashCallBack_submit: function (amount, remark, successionId) {//类别，1上缴     2领用   
      var data = {};
      data.amount = (amount * 100).toFixed(0);//交款金额
      data.remark = remark;
      data.deliverSuccessionId = successionId;//交款人开班id
      console.info(data);
      eapor.utils.defaultAjax("../shift/addDeliverCash", data, OnDuty.addDeliverCash_result);
    },
    //交款
    addDeliverCashCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (!result) {
        $.messager.show({ title: '系统提示', msg: '您未在当班状态！操作失败！', timeout: 2000 });
        return;
      } else {
        $('#appendDiv_onduty').append(
          '<div id="showDialog_onduty" style="padding-top:20px;">' +
          '<div style="margin-bottom:10px;">' +
          '<input  id="inputAmount_onduty"  label="请输入金额：" labelPosition="before" labelAlign="right" style="width:260px;"/>' +
          '</div>' +
          '<div>' +
          '<input  id="inputRemark_onduty"  label="备注：" labelPosition="before" labelAlign="right" style="width:260px;"/>' +
          '</div>' +
          '</div>'
        );
        $('#inputAmount_onduty').numberbox({
          required: true,
          precision: 2,
          missingMessage: "金额不能为空！",
          validType: ['noNegativeNumber'],
          invalidMessage: "输入数字不能小于0",
          validateOnCreate: false,//为true时在创建该组件时就进行验证
          validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
        });
        $('#inputRemark_onduty').textbox({
          multiline: true,
          validType: ['maxLength[32]'],
          invalidMessage: "最大输入长度为32个字符",
          validateOnCreate: false,//为true时在创建该组件时就进行验证
          validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
        });
        $('#showDialog_onduty').dialog({
          title: '交款',
          width: 300,
          height: 210,
          closed: false,
          cache: false,
          modal: true,
          buttons: [{
            text: '确定',
            handler: function () {
              if (!$('#inputAmount_onduty').numberbox('isValid')) {
                $('#inputAmount_onduty').numberbox('textbox').focus();
                return;
              }
              if (!$('#inputRemark_onduty').textbox('isValid')) {
                $('#inputRemark_onduty').textbox('textbox').focus();
                return;
              }
              var amount = $('#inputAmount_onduty').numberbox('getValue');
              var remark = $('#inputRemark_onduty').textbox('getValue');
              OnDuty.addDeliverCashCallBack_submit(amount, remark, result.successionId);
            }
          }, {
            text: '取消',
            handler: function () {
              $('#showDialog_onduty').dialog('close');
            }
          }],
          onClose: function () {
            $(this).dialog('destroy');
          }
        })
      }
    },
    //确定上缴的回调函数
    contributionOnduty_add: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (result > 0) {
        $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 2000 });
        OnDuty.init();
        $('#showDialog_onduty').dialog('close');
        return;
      } else {
        $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000 });
        return;
      }
    },
    //确定上缴
    contributionOnduty_submit: function (amount, value, successionId) {//类别，1上缴     2领用   
      var data = {};
      data.amount = (amount * 100).toFixed(0);
      data.remark = "";
      data.typeCode = value;
      data.successionId = successionId;
      console.info(data);
      eapor.utils.defaultAjax("../shift/AddPasscash", data, OnDuty.contributionOnduty_add);
    },
    //缴款初次验证回调
    paymentOndutyCallBack: function (result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (!result) {
        $.messager.show({ title: '系统提示', msg: '您未在当班状态！操作失败！', timeout: 2000 });
        return;
      } else {
        $('#appendDiv_onduty').append('<div id="showDialog_onduty" style="display:none;padding-top:20px;">' +
          '<input  id="inputAmount_onduty"  label="请输入金额：" labelPosition="before" labelAlign="right" style="width:260px;"/>' +
          '</div>')
        $('#inputAmount_onduty').numberbox({
          required: true,
          precision: 2,
          missingMessage: "金额不能为空！",
          validType: ['noNegativeNumber'],
          invalidMessage: "输入数字不能小于0",
          validateOnCreate: false,//为true时在创建该组件时就进行验证
          validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
        });
        $('#showDialog_onduty').dialog({
          title: '缴款',
          width: 300,
          height: 160,
          closed: false,
          cache: false,
          modal: true,
          buttons: [{
            text: '确定',
            handler: function () {
              if (!$('#inputAmount_onduty').numberbox('isValid')) {
                $('#inputAmount_onduty').numberbox('textbox').focus();
                return;
              }
              console.info($('#inputAmount_onduty').numberbox('getValue') == 0)
              if ($('#inputAmount_onduty').numberbox('getValue') == 0 || $('#inputAmount_onduty').numberbox('getValue') == "") {
                $('#inputAmount_onduty').numberbox('textbox').focus();
                $.messager.show({
                  title: '系统提示', msg: '请输入大于0 的数字！', timeout: 2000
                });
                return;
              }
              var amount = $('#inputAmount_onduty').numberbox('getValue');
              OnDuty.contributionOnduty_submit(amount, 1, result.successionId);
            }
          }, {
            text: '取消',
            handler: function () {
              $('#showDialog_onduty').dialog('close');
            }
          }],
          onClose: function () {
            $(this).dialog('destroy');
          }
        })
      }
    },
    //领款初次验证回调
    contributionOnduty_getCurrentShift: function (result) {
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      if (!result) {
        $.messager.show({ title: '系统提示', msg: '您未在当班状态！操作失败！', timeout: 2000 });
        return;
      } else {
        $('#appendDiv_onduty').append(
          '<div id="showDialog_onduty" style="display:none;padding-top:20px;">' +
          '<input  id="inputAmount_onduty"  label="请输入金额：" labelPosition="before" labelAlign="right" style="width:260px;"/>' +
          '</div>')
        $('#inputAmount_onduty').numberbox({
          required: true,
          precision: 2,
          missingMessage: "金额不能为空！",
          validType: ['noNegativeNumber'],
          invalidMessage: "输入数字不能小于0",
          validateOnCreate: false,//为true时在创建该组件时就进行验证
          validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
        });
        $('#showDialog_onduty').dialog({
          title: '领款',
          width: 300,
          height: 160,
          closed: false,
          cache: false,
          modal: true,
          buttons: [{
            text: '确定',
            handler: function () {
              if (!$('#inputAmount_onduty').numberbox('isValid')) {
                $('#inputAmount_onduty').numberbox('textbox').focus();
                return;
              }
              console.info($('#inputAmount_onduty').numberbox('getValue') == 0)
              if ($('#inputAmount_onduty').numberbox('getValue') == 0 || $('#inputAmount_onduty').numberbox('getValue') == "") {
                $('#inputAmount_onduty').numberbox('textbox').focus();
                $.messager.show({
                  title: '系统提示', msg: '请输入大于0 的数字！', timeout: 2000
                });
                return;
              }
              var amount = $('#inputAmount_onduty').numberbox('getValue');
              OnDuty.contributionOnduty_submit(amount, 2, result.successionId);
            }
          }, {
            text: '取消',
            handler: function () {
              $('#showDialog_onduty').dialog('close');
            }
          }],
          onClose: function () {
            $(this).dialog('destroy');
          }
        })
      }
    },
    toShiftCallBack: function (data) {
      console.info(data);
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      if (data == -3334) {
        $.messager.show({ title: '系统提示', msg: '您没有班次信息！请核对！', timeout: 3000, showType: 'slide' });
        return;
      } else if (data == 0) {
        $.messager.show({ title: '系统提示', msg: '交班失败！有未审核的款项！', timeout: 3000, showType: 'slide' });
        return;
      } else if (data > 0) {
        $('#showDialog_onduty').dialog('close');
        $.messager.progress({
          title: "系统提示",
          msg: '交班成功！正在退出登录！',
          interval: '500'
        });
        setTimeout(function () {
          $.messager.progress('close');
          $.ajax({
            type: 'post',
            data: {},
            url: '../user/exit',
            dataType: 'json',
            success: function (result) {
              if (result.errCode >= 0) {
                if (window.location.hostname === 'localhost') {
                  window.location.href = "../../";
                } else {
                  window.location.href = "../../../";
                }
              }
            }
          });
        }, 5000);
      }
    }
  };

  $.ajax({
    type: 'post',
    url: '../shift/getActiveSuccession',
    data: {}
  })
    .done(function (result) {
      console.info(result);
      console.info(typeof (null));
      if (result == "null") {
        OnDuty.init();
        $.messager.confirm('系统提示', '您未在当班状态，是否转到开班页面？', function (r) {
          if (r) {
            $('#accept_onduty').trigger('click');
          }
        });

      } else {
        OnDuty.init();
      }
    });
})();