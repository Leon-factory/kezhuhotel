/**
 *@JSname:节假日设置
 */
~(function () {
  "use strict";
  //	eapor.utils.layoutHeightSetAuto("setWH_accordion");

  var clickFlag_setHoliday = true;
  //ajax
  function set_weekend_ajax(url, data, callback) {
    $.ajax({
      type: 'post',
      url: url,
      dataType: "json",
      /*contentType:"application/json",*/
      data: data,
      success: function (result) {
        callback(result);
      }
    });
  }

  /*设置周末的保存的回调函数*/
  var sw_weeked_Callback = function (data) {
    if (eapor.utils.ajaxCallBackErrInfo(data)) {
      return;
    }
    if (data > 0) {
      $.messager.show({ title: '系统提示', msg: '设置周末成功！', timeout: 2800, showType: 'slide' });
    } else {
      $.messager.show({ title: '系统提示', msg: '设置周末失败！', timeout: 2800, showType: 'slide' });
    }
  }
  /*------------------------------设置周末保存函数----------------------------*/
  var sw_weeked_submit = function () {
    var data = {};
    data.weekendCodeList = "";
    var divcheck = $('.sw_check').find('input[type=checkbox]');
    for (let i = 0; i < divcheck.length; i++) {
      if ($(divcheck[i]).is(":checked")) {
        data.weekendCodeList += $(divcheck[i]).val();
      }
    }
    var set_weekend_url = "../syspara/setWeekEnd";
    set_weekend_ajax(set_weekend_url, data, sw_weeked_Callback);
  }
  /*初始加载页面的回调函数*/
  var set_weekend_checkBack = function (data) {
    if (eapor.utils.ajaxCallBackErrInfo(data)) {
      return;
    }
    var strs = []; //定义一数组
    strs = data.split(""); //字符分割
    for (let i = 0; i < strs.length; i++) {
      $('#sbtn' + strs[i]).switchbutton({
        handleWidth: 1,
        checked: true
      });
      //$('input[value='+strs[i]+']').attr('checked','checked');
    }
  }
  /*count*/
  function initLoadSetWeekendList() {
    var set_weekend_url = "../syspara/getWeekEnd";
    var data = {};
    data.weekendCodeList = "";
    set_weekend_ajax(set_weekend_url, data, set_weekend_checkBack);
  }
  //初始页面
  initLoadSetWeekendList();
  //保存
  $('#sw_weeked_submit').click(sw_weeked_submit);

  /*-------------------------------Holiday Part--------------------------*/
  /*节假日Loader*/
  var holidayArray = {};
  var holidayLoader = function (param, success, error) {
    if (!$.isEmptyObject(holidayArray)) {
      success(holidayArray);
      return true;
    }
    $.ajax({
      url: "../specialday/pglist",
      type: "post",
      dataType: "json",
      data: {
        specialdayName: $('#setWH_holidayName').textbox('getValue'),
        offset: 0,
        limit: 9999
      },
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == '[]') {
          success([]);
          return true;
        }
        if (data == "") {
          success([]);
          return true;
        }
        holidayArray = data;
        success(holidayArray);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };
  /*搜索回调*/
  function setWH_searchCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    holidayArray = result;
    loadHolidayList();
  }
  /*搜索按钮*/
  $('#setWH_search').on('click', function () {
    var data = {};
    data.offset = 0;
    data.limit = 999;
    data.specialdayName = $("#setWH_holidayName").textbox("getValue");
    eapor.utils.defaultAjax("../specialday/pglist", data, setWH_searchCallback);
  });
  /*删除回调*/
  function setWH_removeHolidayCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }

    if (result < 0) {
      $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
      return;
    }

    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });

      var data = {};
      data.specialdayName = $('#setWH_holidayName').textbox('getValue');
      data.limit = 9999;
      data.offset = 0;
      eapor.utils.defaultAjax('../specialday/pglist', data, setWH_loadCallback);
    }
  }
  /*删除*/
  function holidayRemove() {
    var select = $('#setWH_List').datagrid('getSelected');
    if (!select || select.specialdayName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请选择一个节假日！', timeout: 2000 });
      return;
    }

    $.messager.confirm('系统提示', '您确定要删除该节假日吗？', function (r) {
      if (r) {
        var data = {};
        data.specialdayId = select.specialdayId;
        eapor.utils.defaultAjax('../specialday/del', data, setWH_removeHolidayCallback);
      }
    })
  }
  /*编辑回调*/
  function setWH_editHolidayCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的节假日！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data = {};
      data.specialdayName = $('#setWH_holidayName').textbox('getValue');
      data.limit = 9999;
      data.offset = 0;
      eapor.utils.defaultAjax('../specialday/pglist', data, setWH_loadCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
  }
  /*编辑*/
  function holidayEdit() {
    var select = $('#setWH_List').datagrid('getSelected');
    if (!select || select.specialdayName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 2000 });
      return;
    }
    $('#holiday_editDialog').append(
      '<div id="div" style="padding:20px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="setWH_EditHolidayName" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日名称：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="setWH_EditHolidayStart" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日起始时间：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '<div>' +
      '<input id="setWH_EditHolidayEnd" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日结束时间：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '</div>'
    );
    $('#setWH_EditHolidayName').textbox({
      required: true,
      missingMessage: "节假日名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#setWH_EditHolidayStart').datebox({
      required: true,
      missingMessage: "起始时间不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      , editable: false
    });
    $('#setWH_EditHolidayEnd').datebox({
      required: true,
      missingMessage: "结束时间不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      , editable: false
    });
    $('#setWH_EditHolidayName').textbox('setValue', select.specialdayName);
    $('#setWH_EditHolidayStart').datebox('setValue', getDateForHoliday(select.startTime));
    $('#setWH_EditHolidayEnd').datebox('setValue', getDateForHoliday(select.endTime));
    $('#div').dialog({
      title: '编辑节假日',
      width: 420,
      height: 260,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#setWH_EditHolidayName').textbox('isValid')) {
            $('#setWH_EditHolidayName').textbox('textbox').focus();
            return;
          }
          if (!$('#setWH_EditHolidayStart').datebox('isValid')) {
            $('#setWH_EditHolidayStart').datebox('textbox').focus();
            return;
          }
          if (!$('#setWH_EditHolidayEnd').datebox('isValid')) {
            $('#setWH_EditHolidayEnd').datebox('textbox').focus();
            return;
          }
          var data = {};
          data.specialdayName = $('#setWH_EditHolidayName').textbox('getValue');
          data.startTime = $('#setWH_EditHolidayStart').datebox('getValue');
          data.endTime = $('#setWH_EditHolidayEnd').datebox('getValue');
          data.specialdayId = select.specialdayId;

          if (clickFlag_setHoliday == false) {
            return;
          }
          clickFlag_setHoliday = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../specialday/edit',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              setWH_editHolidayCallback(result);
            })
            .always(function () {
              clickFlag_setHoliday = true;
              that.removeClass("l-btn-disabled");
            });
          //eapor.utils.defaultAjax('../specialday/edit',data,setWH_editHolidayCallback);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }
  /*新增回调*/
  function setWH_addHolidayCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的节假日！', timeout: 2000 });
      return;
    }
    if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
      $('#div').dialog('close');
      var data = {};
      data.specialdayName = $('#setWH_holidayName').textbox('getValue');
      data.limit = 9999;
      data.offset = 0;
      eapor.utils.defaultAjax('../specialday/pglist', data, setWH_loadCallback);
      return;
    }
    $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
  }
  /*新增*/
  function holidayAdd() {
    $('#holiday_addDialog').append(
      '<div id="div" style="padding:20px 20px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="setWH_AddHolidayName" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日名称：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="setWH_AddHolidayStart" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日起始时间：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '<div>' +
      '<input id="setWH_AddHolidayEnd" labelAlign="right" labelWidth="150" label="<span style=\'color:red;\'>*</span>节假日结束时间：" labelPosition="before" style="width:300px;height:25px;">' +
      '</div>' +
      '</div>'
    );
    $('#setWH_AddHolidayName').textbox({
      required: true,
      missingMessage: "节假日名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#setWH_AddHolidayStart').datebox({
      required: true,
      missingMessage: "起始时间不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      , editable: false
    });
    $('#setWH_AddHolidayEnd').datebox({
      required: true,
      missingMessage: "结束时间不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      , editable: false
    });
    $('#div').dialog({
      title: '新增节假日',
      width: 420,
      height: 260,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#setWH_AddHolidayName').textbox('isValid')) {
            $('#setWH_AddHolidayName').textbox('textbox').focus();
            return;
          }
          if (!$('#setWH_AddHolidayStart').datebox('isValid')) {
            $('#setWH_AddHolidayStart').datebox('textbox').focus();
            return;
          }
          if (!$('#setWH_AddHolidayEnd').datebox('isValid')) {
            $('#setWH_AddHolidayEnd').datebox('textbox').focus();
            return;
          }
          var data = {};
          data.specialdayName = $('#setWH_AddHolidayName').textbox('getValue');
          data.startTime = $('#setWH_AddHolidayStart').datebox('getValue');
          data.endTime = $('#setWH_AddHolidayEnd').datebox('getValue');

          if (clickFlag_setHoliday == false) {
            return;
          }
          clickFlag_setHoliday = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../specialday/add',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              setWH_addHolidayCallback(result);
            })
            .always(function () {
              clickFlag_setHoliday = true;
              that.removeClass("l-btn-disabled");
            });
          //eapor.utils.defaultAjax('../specialday/add',data,setWH_addHolidayCallback);
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    })
  }

  let rowSelect_setHoliday = null,
    onlySelectedOneRowFlag = 0;
  /*加载节假日列表*/
  function loadHolidayList() {
    $('#setWH_List').datagrid({
      loader: holidayLoader,
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      fit: false,
      rownumbers: true,  //如果为true，则显示一个行号列.默认false
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('setWH_List', 'specialdayName', 3, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      onClickRow: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag == 2) {
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
          rowSelect_setHoliday = $(this).datagrid('getSelected');
        }
        else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_setHoliday = null;
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

        if (rowData != rowSelect_setHoliday) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_setHoliday = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_setHoliday = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      columns: [[
        { field: 'ck', title: '', checkbox: true },
        { field: 'specialdayId', title: "节假日ID", width: 100, hidden: true },

        { field: 'specialdayName', title: "节假日名称", width: 100, align: 'center' },
        {
          field: 'startTime', title: "开始时间", width: 100, align: 'center',
          formatter: function (value, row, index) {
            return getDateForHoliday(value)
          }
        },
        {
          field: 'endTime', title: "结束时间", width: 100, align: 'center',
          formatter: function (value, row, index) {
            return getDateForHoliday(value)
          }
        }
      ]],
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          holidayAdd();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          holidayEdit();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          holidayRemove();
        }
      }]
    })
  }
  function setWH_loadCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    holidayArray = result;
    loadHolidayList();
  }
  /*------------------------ready function-------------------------*/
  $('#setWH_holidayName').textbox({});
  var data = {};
  data.specialdayName = $('#setWH_holidayName').textbox('getValue');
  data.limit = 9999;
  data.offset = 0;
  eapor.utils.defaultAjax('../specialday/pglist', data, setWH_loadCallback);

})();