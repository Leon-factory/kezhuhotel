/**
 *@JSname:签单明细 
 *
 */
~(function () {
  "use strict";
  var signdetail = {
    amount: 0,
    result: null,
    shortInfoAndPoolCallBack: function (result) {
      signdetail.roomId = result.roomId;
      signdetail.guestId = result.guestId;
      //简讯
      var shortInfoArray = [];
      shortInfoArray.push(result);
      $('#briefInfo_signdetail').datagrid("loadData", shortInfoArray);
      $("#briefInfo_signdetail").datagrid("reload");
      //汇总
      var countArr = [];
      var data = {
        amount: signdetail.amount
      };
      countArr.push(data);
      $('#countInfo_signdetail').datagrid("loadData", countArr);
      $('#countInfo_signdetail').datagrid("reload");
      $('#detail_signdetail').datagrid("loadData", signdetail.result);
      $("#detail_signdetail").datagrid("reload");
    }
  };
  //简讯
  $('#briefInfo_signdetail').datagrid({
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
      { field: 'roomIds', title: "房间IdList", align: 'center', width: 20, hidden: true },
      { field: 'credit', title: "信用", align: 'center', width: 20, hidden: true },
      { field: 'sign', title: "签单", align: 'center', width: 20, hidden: true },
      { field: 'debt', title: "坏账", align: 'center', width: 20, hidden: true },
      { field: 'free', title: "免单", align: 'center', width: 20, hidden: true },
      { field: 'goodsAmount', title: "商品消费", align: 'center', width: 20, hidden: true },
      { field: 'payment', title: "总支付", align: 'center', width: 20, hidden: true },
      { field: 'rentAmount', title: "总房费", align: 'center', width: 20, hidden: true },
      { field: 'serviceAmount', title: "服务消费", align: 'center', width: 20, hidden: true },
      { field: 'transfer', title: "转入转出", align: 'center', width: 20, hidden: true },
      { field: 'channelId', title: "channelId", align: 'center', width: 20, hidden: true },

      {
        field: 'channelName', title: "客源", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (value == undefined || value == "") {
            return "非会员";
          } else {
            return value;
          }
        }
      },
      { field: 'guestName', title: "宾客姓名", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      { field: 'phone', title: "宾客手机号", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      {
        field: 'checkinTime', title: "登记时间", align: 'center', width: 20,
        formatter: function (value, row) {
          return getDateNoSS(value);
        }
      },
      {
        field: 'checkoutTime', title: "结账时间", align: 'center', width: 20,
        formatter: function (value, row) {
          if (row.receptionState == 1) {//未结账单 时间显示为空
            return "--";
          } else {
            return getDateNoSS(value);
          }
        }
      },
      { field: 'roomCode', title: "房号", align: 'center', width: 20, formatter: eapor.utils.defaultFormatter },
      {
        field: 'receptionState', title: "账单状态", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (row.receptionState == 1) {
            return "未结账";
          } else if (row.receptionState == 2) {
            return "已结账";
          } else if (row.receptionState == 3) {
            return "已审核";
          }
        }
      },
      { field: 'remark', title: "备注", align: 'center', width: 20 }
    ]]
  });
  //汇总
  $('#countInfo_signdetail').datagrid({
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
        field: 'amount', title: "金额", align: 'left', width: 20,
        formatter: function (value, row, index) {
          return NP.divide(value, 100).toFixed(2) + "元";
        }
      }
    ]]
  });
  //明细
  $('#detail_signdetail').datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    striped: true,
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    loadMsg: "loading....",
    singleSelect: false,
    fit: true,
    rownumbers: true,
    checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
    //selectOnCheck:true,//如果为true，单击复选框将永远选择行。
    //如果为false，选择行将不选中复选框。
    columns: [[
      {
        field: 'type', title: "分类", align: 'center', width: 20,
        formatter: function (value) {
          if (value == 1) return "消费";
          return "签单";
        }
      },
      {
        field: 'date', title: "日期时间", align: 'center', width: 20,
        formatter: function (value, row, index) {
          if (row.contentType == 1) return getDateForHoliday(value);
          return (value);
        }
      },
      { field: 'content', title: "内容", align: 'center', width: 20 },
      {
        field: 'number', title: "数量", align: 'center', width: 20,
        formatter: function (value) {
          if (value == undefined) return "--";
          return value;
        }
      },
      {
        field: 'price', title: "单价", align: 'center', width: 20,
        formatter: function (value) {
          if (value != undefined) return NP.divide(value, 100).toFixed(2);
          return "--";
        }
      },
      {
        field: 'amount', title: "金额", align: 'center', width: 20,
        formatter: function (value, row) {
          if (value != undefined && row.type == 2) return NP.divide(value, -100).toFixed(2);
          if (value != undefined && row.type == 1) return NP.divide(value, 100).toFixed(2);
          return "";
        }
      }
    ]]
  });
  //打印btn
  $('#printBtn_signdetail').on('click', function () {
    var shortInfo = $('#briefInfo_signdetail').datagrid('getRows')[0];
    var countAount = $('#countInfo_signdetail').datagrid('getRows')[0];
    var details = $('#detail_signdetail').datagrid('getRows');
    //简讯
    var receptionState = "";
    if (shortInfo.receptionState == 1) {
      receptionState = "未结账";
    } else if (shortInfo.receptionState == 2) {
      receptionState = "已结账";
    } else if (shortInfo.receptionState == 3) {
      receptionState = "已审核";
    }
    var checkoutTime = "";
    if (shortInfo.receptionState == 1) {//未结账单 时间显示为空
      checkoutTime = "--";
    } else {
      checkoutTime = getDateNoSS(value);
    }
    $('#shortInfo_signdetailPrintTbody').empty();
    $('#shortInfo_signdetailPrintTbody').append(
      '<tr>' +
      '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.channelName +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.guestName +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.phone +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      getDateNoSS(shortInfo.checkinTime) +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      checkoutTime +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.roomCode +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      '	border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      receptionState +
      '</td>' +
      '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      shortInfo.remark +
      '</td>' +
      '</tr>'
    );
    //汇总
    $('#countAount_signdetailPrintTbody').empty();
    $('#countAount_signdetailPrintTbody').append(
      '<tr>' +
      '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
      'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
      NP.divide(countAount.amount, 100).toFixed(2) +
      '</td>' +
      '</tr>'
    );
    //明细
    $('#details_signdetailPrintTbody').empty();
    for (let i = 0; i < details.length; i++) {
      var type = "";
      if (details[i].type == 1) {
        type = "消费";
      } else {
        type = "签单";
      }
      var date = "";
      if (details[i].contentType == 1) {
        date = getDateForHoliday(details[i].date);
      } else {
        date = details[i].date;
      }
      var number = "";

      if (details[i].number == undefined) {
        number = "--";
      } else {
        number = details[i].number
      }
      var price = "";
      if (details[i].price == undefined) {
        price = "--";
      } else {
        price = NP.divide(details[i].price, 100).toFixed(2)
      }
      var amount = "";
      if (details[i].amount == undefined) {
        amount = "";
      } else {
        if (details[i].type == 2) amount = NP.divide(details[i].amount, -100).toFixed(2);
        if (details[i].type == 1) amount = NP.divide(details[i].amount, 100).toFixed(2);
      }
      $('#details_signdetailPrintTbody').append(
        '<tr>' +
        '<td scope="row" style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        type +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        date +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        details[i].content +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        number +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        price +
        '</td>' +
        '<td style="height:30px;text-align: center;vertical-align: middle!important;' +
        'border:1px solid #DDDDDD; padding:0 1em 0;  ">' +
        amount +
        '</td>' +
        '</tr>'
      );
    }
    var popTitle = "签单明细_" + getDate(new Date());
    $("div#printDiv_signdetail").printArea({ popTitle: popTitle, mode: 'popup' });
  });
  if (sessionStorage.getItem("signdetailJSPParameter") != "" && sessionStorage.getItem("signdetailJSPParameter") != null) {
    signdetail.receptionId = JSON.parse(sessionStorage.getItem("signdetailJSPParameter")).receptionId;
    signdetail.paymentId = JSON.parse(sessionStorage.getItem("signdetailJSPParameter")).paymentId;
    signdetail.amount = JSON.parse(sessionStorage.getItem("signdetailJSPParameter")).amount;
    signdetail.result = JSON.parse(sessionStorage.getItem("signdetailJSPParameter")).result;
    sessionStorage.setItem("signdetailJSPParameter", "");
    eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: signdetail.receptionId }, signdetail.shortInfoAndPoolCallBack);
  }
})();