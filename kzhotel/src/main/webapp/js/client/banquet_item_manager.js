/**
 *@jsname:餐宴项目管理
 */
~(function (eapor) {
  "use strict";

  let setPageNumber_BIM = 1,//分页number
    setPageSize_BIM = 10,//分页size
    onlySelectedOneRowFlag = 0,//单选flag
    rowSelect_BIM = null,//单行选择保存的属性对象
    reFlag = false,//判断是否删除数据为该页面第一条，是则将pageNumber指定到第一页
    firstLoaderArray_BIM = [],//初始loader
    firstLoaderData_BIM = {},//初始加载参数
    banquetType_searchBIM = "",//搜索参数
    banquetItemName_searchBIM = "";//搜索参数

  function firstLoader_BIM(param, success, error) {
    console.info(firstLoaderArray_BIM);
    if (!$.isEmptyObject(firstLoaderArray_BIM)) {
      success(firstLoaderArray_BIM);
      return true;
    }
    $.ajax({
      url: "../banquet/listBanquetItem",
      type: "post",
      dataType: "json",
      data: firstLoaderData_BIM,
      success: function (data) {
        console.info(data);
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        firstLoaderArray_BIM = data;
        success(firstLoaderArray_BIM);
      }
      , error: function (err) {
        alert(err);
      }
    });
  }
  //搜索loader
  function searchLoader_BIM(param, success, error) {
    console.info(banquetItemName_searchBIM);
    console.info(banquetType_searchBIM);

    $.ajax({
      url: "../banquet/listBanquetItem",
      type: "post",
      data: {
        banquetItemName: banquetItemName_searchBIM, banquetTypeId: banquetType_searchBIM,
        offset: 0, limit: 9999
      },
      dataType: "json",
      success: function (data) {
        console.info(data);
        $('#page_BIM').pagination({	// 改变选项并刷新分页栏信息
          total: data.length,
          pageNumber: 1
        });
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#table_BIM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        let tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#table_BIM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#table_BIM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data.slice(0, setPageSize_BIM));
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  }
  function defaultAjax(url, data, callBack) {
    $.ajax({
      type: 'post',
      url: url,
      data: data,
      success: function (result) {
        callBack(result);
      }
    });
  }
  //搜索
  $('#search_BIM').on('click', function () {
    banquetItemName_searchBIM = $('#banquetItemName_BIM').textbox('getValue');
    banquetType_searchBIM = $('#banquetType_BIM').combobox('getValue');
    $('#table_BIM').datagrid('options').loader = searchLoader_BIM;
    $('#table_BIM').datagrid('reload');
  });
  //新增
  function add_BIM() {
    $('#showAddDialog_BIM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="banquetItemName_add_BIM" type="search" label="<span style='color:red;'>*</span>餐宴名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="banquetType_add_BIM" label="<span style='color:red;'>*</span>餐宴类别：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="unit_add_BIM" type="search" label="<span style='color:red;'>*</span>单位：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="priority_add_BIM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="salePrice_add_BIM" type="search" label="<span style='color:red;'>*</span>销售单价：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    //餐宴类别
    $('#banquetType_add_BIM').combobox({
      valueField: 'banquetTypeId',
      textField: 'banquetTypeName',
      url: '../banquet/listBanquetType',
      queryParams: {
        banquetTypeName: "",
        offset: 0,
        limit: 99999
      },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: "餐宴位置不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //餐宴名称
    $('#banquetItemName_add_BIM').textbox({
      required: true,
      missingMessage: "餐厅会馆名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //单位
    $('#unit_add_BIM').textbox({
      required: true,
      missingMessage: "单位不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //优先级
    $('#priority_add_BIM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      min: 0,
      value: 1,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //销售单价
    $('#salePrice_add_BIM').textbox({
      required: true,
      missingMessage: "销售单价不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let clickFlag_BIM = true,
      showAddDialog_BIM = $('#div');
    showAddDialog_BIM.dialog({
      title: '新增餐宴项目信息',
      width: 350,
      height: 340,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#banquetItemName_add_BIM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#banquetType_add_BIM').combobox('isValid')) {
            $('#banquetType_add_BIM').combobox('textbox').focus();
            return;
          }
          if (!$('#banquetItemName_add_BIM').textbox('isValid')) {
            $('#banquetItemName_add_BIM').textbox('textbox').focus();
            return;
          }
          if (!$('#unit_add_BIM').textbox('isValid')) {
            $('#unit_add_BIM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_add_BIM').numberbox('isValid')) {
            $('#priority_add_BIM').numberbox('textbox').focus();
            return;
          }
          if (!$('#salePrice_add_BIM').textbox('isValid')) {
            $('#salePrice_add_BIM').textbox('textbox').focus();
            return;
          }
          if (clickFlag_BIM == false) {
            return;
          }
          clickFlag_BIM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            banquetTypeId: $('#banquetType_add_BIM').combobox('getValue'),
            banquetItemName: $('#banquetItemName_add_BIM').textbox('getValue'),
            unit: $('#unit_add_BIM').textbox('getValue'),
            sortCode: $('#priority_add_BIM').numberbox('getValue'),//优先级
            salePrice: NP.times($('#salePrice_add_BIM').textbox('getValue'), 100),
            operatingState: 0,//0正常 1 冻结 默认正常
          };
          console.info(subData);
          let always = $.ajax({
            type: 'post',
            url: '../banquet/addBanquetItem',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的餐宴项目名称！', timeout: 3000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                defaultAjax('../banquet/getBanquetItemCount', { banquetItemName: "", banquetTypeId: 0 }, refresh_getPageCountCallback);
                showAddDialog_BIM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BIM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddDialog_BIM.dialog('close');
        }
      }]
    });
  };
  //编辑
  function edit_BIM() {
    let row = $('#table_BIM').datagrid('getSelected');
    if (!row || row.banquetTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (row.banquetItemName === '包价早餐') {
      $.messager.show({ title: '系统提示', msg: '默认项包价早餐不可编辑！', timeout: 3000, showType: 'slide' });
      return;
    }
    $('#showEditDialog_BIM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="banquetItemName_edit_BIM" type="search" label="<span style='color:red;'>*</span>餐宴名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="banquetType_edit_BIM" label="<span style='color:red;'>*</span>餐宴类别：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="unit_edit_BIM" type="search" label="<span style='color:red;'>*</span>单位：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="priority_edit_BIM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="salePrice_edit_BIM" type="search" label="<span style='color:red;'>*</span>销售单价：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="operatingState_edit_BIM" label="<span style='color:red;'>*</span>经营状态：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    //餐宴类别
    $('#banquetType_edit_BIM').combobox({
      valueField: 'banquetTypeId',
      textField: 'banquetTypeName',
      url: '../banquet/listBanquetType',
      queryParams: {
        banquetTypeName: "",
        offset: 0,
        limit: 99999
      },
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: "餐宴位置不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onLoadSuccess: function (data) {
        $(this).combobox('setValue', row.banquetTypeId);
        $(this).combobox('setText', row.banquetTypeName);
      }
    });
    //餐宴名称
    $('#banquetItemName_edit_BIM').textbox({
      required: true,
      missingMessage: "餐厅会馆名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: row.banquetItemName
    });
    //单位
    $('#unit_edit_BIM').textbox({
      required: true,
      missingMessage: "单位不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: row.unit
    });
    //优先级
    $('#priority_edit_BIM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      min: 0,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: row.sortCode
    });
    //销售单价
    $('#salePrice_edit_BIM').textbox({
      required: true,
      missingMessage: "销售单价不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: NP.divide(row.salePrice, 100)
    });
    //经营状态
    $('#operatingState_edit_BIM').combobox({
      valueField: 'id',
      textField: 'text',
      data: [
        { "id": 0, "text": "正常" },
        { "id": 1, "text": "冻结" },
      ],
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      onLoadSuccess: function (data) {
        $(this).combobox('setValue', row.operatingState);
        if (row.operatingState == 0) {
          $(this).combobox('setText', '正常');
        } else if (row.operatingState == 1) {
          $(this).combobox('setText', '冻结');
        }
      }
    });
    let clickFlag_BIM = true,
      showEditDialog_BIM = $('#div');
    showEditDialog_BIM.dialog({
      title: '编辑餐宴项目信息',
      width: 350,
      height: 360,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#banquetItemName_edit_BIM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#banquetType_edit_BIM').combobox('isValid')) {
            $('#banquetType_edit_BIM').combobox('textbox').focus();
            return;
          }
          if (!$('#banquetItemName_edit_BIM').textbox('isValid')) {
            $('#banquetItemName_edit_BIM').textbox('textbox').focus();
            return;
          }
          if (!$('#unit_edit_BIM').textbox('isValid')) {
            $('#unit_edit_BIM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_edit_BIM').numberbox('isValid')) {
            $('#priority_edit_BIM').numberbox('textbox').focus();
            return;
          }
          if (!$('#salePrice_edit_BIM').textbox('isValid')) {
            $('#salePrice_edit_BIM').textbox('textbox').focus();
            return;
          }
          if (clickFlag_BIM == false) {
            return;
          }
          clickFlag_BIM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            banquetTypeId: $('#banquetType_edit_BIM').combobox('getValue'),
            banquetItemId: row.banquetItemId,
            banquetItemName: $('#banquetItemName_edit_BIM').textbox('getText'),
            unit: $('#unit_edit_BIM').textbox('getValue'),
            sortCode: $('#priority_edit_BIM').numberbox('getValue'),//优先级
            salePrice: NP.times($('#salePrice_edit_BIM').textbox('getValue'), 100),
            operatingState: $('#operatingState_edit_BIM').combobox('getValue'),//0正常 1 冻结 
          };
          console.info(subData);
          let always = $.ajax({
            type: 'post',
            url: '../banquet/editBanquetItem',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的餐宴项目名称！', timeout: 3000 });
                return;
              }
              if (result === -1) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！默认项不可编辑！', timeout: 3000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 3000 });
                let data_refresh = {
                  offset: setPageSize_BIM * (setPageNumber_BIM - 1),
                  limit: setPageSize_BIM,
                  banquetItemName: "",
                  banquetTypeId: 0
                };
                defaultAjax('../banquet/listBanquetItem', data_refresh, getPageListClickCallback_BIM);
                showEditDialog_BIM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 3000 });
            })
            .always(function () {
              clickFlag_BIM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showEditDialog_BIM.dialog('close');
        }
      }]
    })
  };
  //删除
  function delete_BIM() {
    let row = $('#table_BIM').datagrid('getSelected');
    if (!row || row.banquetTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要删除的信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (row.banquetItemName === '包价早餐') {
      $.messager.show({ title: '系统提示', msg: '默认项包价早餐不可删除！', timeout: 3000, showType: 'slide' });
      return;
    }
    let index = $('#table_BIM').datagrid('getRowIndex', row);
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../banquet/deleteBanquetItem',
          data: { banquetItemId: row.banquetItemId },
          success: function (result) {
            console.info(result);
            if (result > 0) {
              if (index == 0) {
                reFlag = true;
              }
              $('#table_BIM').datagrid('deleteRow', index);
              defaultAjax('../banquet/getBanquetItemCount', { banquetItemName: "", banquetTypeId: 0 }, refresh_getPageCountCallback);
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 3000 });
              return;
            }
            if (result === -1) {
              $.messager.show({ title: '系统提示', msg: '删除失败！默认项不可删除！', timeout: 3000 });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 3000 });
          }
        })
      }
    });
  };
  function getPageListCallback_BIM(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BIM = result;
    $('#table_BIM').datagrid({
      title: '餐宴项目管理', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      striped: true,//隔行变色
      loadMsg: "loading....",
      singleSelect: true,
      rownumbers: true,
      fit: false,
      loader: firstLoader_BIM,
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('table_BIM', 'banquetTypeName', 6, 0);
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
        let rows = $('#table_BIM').datagrid('getChecked');
        let flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          $('#table_BIM').datagrid('checkRow', rowIndex);
          $('#table_BIM').datagrid('selectRow', rowIndex);
          rowSelect_BIM = $('#table_BIM').datagrid('getSelected');
        }
        else {
          $('#table_BIM').datagrid('uncheckRow', rowIndex);
          $('#table_BIM').datagrid('unselectRow', rowIndex);
          rowSelect_BIM = null;
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
        if (rowData != rowSelect_BIM) {
          $('#table_BIM').datagrid('checkRow', rowIndex);
          $('#table_BIM').datagrid('selectRow', rowIndex);
          rowSelect_BIM = $('#table_BIM').datagrid('getSelected');
        } else {
          $('#table_BIM').datagrid('uncheckRow', rowIndex);
          $('#table_BIM').datagrid('unselectRow', rowIndex);
          rowSelect_BIM = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          add_BIM();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          edit_BIM();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          delete_BIM();
        }
      }],
      columns: [[

        { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
        { field: 'banquetTypeId', title: "banquetTypeId", align: 'center', width: 20, hidden: true },
        { field: 'banquetItemId', title: "banquetItemId", align: 'center', width: 20, hidden: true },

        { field: 'ck', title: "", checkbox: true },
        { field: 'banquetTypeName', title: "餐宴类别", align: 'center', width: 20 },
        { field: 'banquetItemName', title: "餐宴名称", align: 'center', width: 20 },
        { field: 'unit', title: "单位", align: 'center', width: 20 },
        { field: 'sortCode', title: "优先级", align: 'center', width: 20 },
        {
          field: 'salePrice', title: "销售单价", align: 'center', width: 20,
          formatter: function (value, row, index) {
            return value ? NP.divide(value, 100) : value;
          }
        },
        {
          field: 'operatingState', title: "经营状态", align: 'center', width: 20,
          formatter: function (value, row, index) {
            return value == 0 ? "正常" : (value == 1) ? "冻结" : value;
          }
        }
      ]]
    });
  }

  function getPageListClickCallback_BIM(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BIM = result;
    $('#table_BIM').datagrid('options').loader = firstLoader_BIM;
    $('#table_BIM').datagrid('reload');
  }

  function refresh_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#page_BIM').pagination({ total: result });
    if (reFlag) {
      $('#page_BIM').pagination({	// 改变选项并刷新分页栏信息
        pageNumber: 1
      });
      reFlag = false;
      setPageNumber_BIM = 1;
    }
    console.info(setPageNumber_BIM);
    let data_refresh = {
      offset: setPageSize_BIM * (setPageNumber_BIM - 1),
      limit: setPageSize_BIM,
      banquetItemName: "",
      banquetTypeId: 0,
    };
    console.info(data_refresh);
    defaultAjax('../banquet/listBanquetItem', data_refresh, getPageListClickCallback_BIM);

  }

  function getCountCallBack(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#page_BIM').pagination({
      total: result,
      onSelectPage: function (pageNumber, pageSize) {
        if (pageNumber == 0) {
          return;
        }
        setPageNumber_BIM = pageNumber;
        setPageSize_BIM = pageSize;
        let data = {
          offset: pageSize * (pageNumber - 1),
          limit: pageSize,
          banquetItemName: $('#banquetItemName_BIM').textbox('getValue'),
          banquetTypeId: $('#banquetType_BIM').combobox('getValue'),
        };
        defaultAjax('../banquet/listBanquetItem', data, getPageListClickCallback_BIM);
      }
    });
    //得到显示分页记录
    let page = $('#page_BIM').pagination('options');
    let subData = {
      offset: 0,
      limit: page.pageSize,
      banquetItemName: $('#banquetItemName_BIM').textbox('getValue'),
      banquetTypeId: $('#banquetType_BIM').combobox('getValue'),
    };
    firstLoaderData_BIM = subData;
    defaultAjax('../banquet/listBanquetItem', subData, getPageListCallback_BIM);
  }
  $('#banquetItemName_BIM').textbox({});
  $('#banquetType_BIM').combobox({
    valueField: 'banquetTypeId',
    textField: 'banquetTypeName',
    url: '../banquet/listBanquetType',
    queryParams: {
      banquetTypeName: "",
      offset: 0,
      limit: 99999
    },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    value: 0,
    loadFilter: function (data) {
      data.unshift({ banquetTypeName: "全部", banquetTypeId: 0 });
      return data;
    }
  });

  defaultAjax('../banquet/getBanquetItemCount', { banquetItemName: "", banquetTypeId: 0 }, getCountCallBack);

})(window.eapor);