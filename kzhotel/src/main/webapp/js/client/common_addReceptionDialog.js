//加单 显示 的 新建宾客账单 弹出的dialog JS
~(function () {
  "use strict";
  //客源combobox
  $('#selectChannel_addReception').combobox({
    valueField: 'channelId',
    textField: 'channelName',
    url: '../channel/pglist',
    queryParams: { offset: 0, limit: 9999, channelName: '', usageState: 1 },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    onLoadSuccess: function (data) {
      if (data.length > 0) {
        for (let value in data) {
          if (data[value].channelName == '非会员') {
            $(this).combobox('setValue', data[value].channelId);
            $(this).combobox('setText', data[value].channelName);
            return;
          }
        }
      }
    }
  });
  //是否签单combobox
  $('#selectUseChannelCredit_addReception').combobox({
    valueField: 'label',
    textField: 'value',
    data: [{
      label: '0',
      value: '否',
      'selected': true
    }, {
      label: '1',
      value: '是'
    }]
    , editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200
  });
  function VIPInfo_common_addReceptionDialog(value) {
    var getVIPObj = JSON.parse(value);
    console.info(getVIPObj);
    if (getVIPObj.nickname != undefined) {
      $('#searchName_addReception').textbox('setValue', getVIPObj.nickname);
    }
    if (getVIPObj.phone != undefined) {
      $('#searchPhone_addReception').textbox('setValue', getVIPObj.phone);
    }
    var channelData = $('#selectChannel_addReception').combobox('getData');
    if (channelData.length > 0) {
      for (let value in channelData) {
        if (channelData[value].channelName == '会员') {
          $('#selectChannel_addReception').combobox('setText', channelData[value].channelName);
          $('#selectChannel_addReception').combobox('setValue', channelData[value].channelId);
          return;
        }
      }
    }
  }
  //会员信息搜索btn
  $('#searchVIPInfo_addReception').click(function () {
    var pdiv = $('#showVIPInfoDialog_common_addReceptionDialog');
    var div = '<div id="showDivSecond"></div>';
    pdiv.append(div);
    $('#showDivSecond').dialog({
      title: '会员信息',
      width: 1180,
      height: 600,
      // left: 150,
      // top:50,
      closed: false,
      cache: false,
      href: '../client/common_searchVIPInfo.jsp',
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var selected_searchVIPInfo = $('#tab_common_searchVIPInfo').datagrid('getSelected');
          if (!selected_searchVIPInfo) {
            $.messager.show({ title: '系统提示', msg: '请选择会员信息！', timeout: 2000, showType: 'slide' });
            return;
          } else {
            VIPInfo_common_addReceptionDialog(JSON.stringify(selected_searchVIPInfo));
            $('#showDivSecond').dialog('close');
          }
        }
      }, {
        text: '取消',
        handler: function () {
          $('#showDivSecond').dialog('close');
        }
      }]
    })
    $('#showDivSecond').dialog('center');
  });
})();