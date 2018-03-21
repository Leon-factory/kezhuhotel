//----客户关系-->搜索会员公共页面JS----------
~(function () {
  "use strict";
  var pubjsonfirst_searchVIPInfo = [];

  var firstloader_searchVIPInfo = function (param, success, error) {
    if ($.isEmptyObject(pubjsonfirst_searchVIPInfo)) {
      success(pubjsonfirst_searchVIPInfo);
      return true;
    }

  };
  //搜索loader函数
  var membername_searchVIPInfo = "";
  var phone_searchVIPInfo = "";

  var searchloader_searchVIPInfo = function (param, success, error) {

    $.ajax({
      url: "../hotel/listMemberPage",
      data: { hotelId: $('#indexhotelId').val(), membername: membername_searchVIPInfo, phone: phone_searchVIPInfo, offset: 0, limit: 9999999, maxId: 0 },
      type: "post",
      dataType: "json",
      success: function (data) {
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
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  $('#searchVIPInfo_searchVIPInfo').click(function () {
    var name_searchVIPInfo = $('#iptName_searchVIPInfo').textbox('getValue');
    var ph_searchVIPInfo = $('#iptPhone_searchVIPInfo').numberbox('getValue');
    membername_searchVIPInfo = name_searchVIPInfo;
    phone_searchVIPInfo = ph_searchVIPInfo;
    $('#tab_common_searchVIPInfo').datagrid("options").loader = searchloader_searchVIPInfo;
    $('#tab_common_searchVIPInfo').datagrid('reload');
  });


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
    //loader:firstloader_searchVIPInfo,
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
          } else if (value == 2) {
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
      { field: 'id8', title: 'RFM指标', width: 20, align: 'center' },
      { field: 'id9', title: '历史账簿', width: 20, align: 'center' },
      { field: 'vipcard', title: '是否已制实体卡', width: 35, align: 'center' },
      { field: 'id11', title: '制卡/注销', width: 18, align: 'center' },
      { field: 'id12', title: '备注', width: 18, align: 'center' },
      { field: 'reputation', title: '声望', width: 18, align: 'center' }

      /*
      {field:'nickname',title:'nickname',width:20,align:'center'},
      {field:'phone',title:'phone',width:20,align:'center'},
      {field:'isHome',title:'isHome',width:20,align:'center'},
      {field:'inviterNickname',title:'inviterNickname',width:20,align:'center'},
      {field:'createTime',title:'createTime',width:20,align:'center'},
      
      {field:'balance',title:'balance',width:20,align:'center'},
      
      {field:'inviterId',title:'inviterId',width:20,align:'center'},
      {field:'memberId',title:'memberId',width:20,align:'center'},
      {field:'vipcard',title:'vipcard',width:20,align:'center'},
      {field:'points',title:'points',width:20,align:'center'},
      {field:'reputation',title:'reputation',width:20,align:'center'},
      */
    ]]
  });
})();