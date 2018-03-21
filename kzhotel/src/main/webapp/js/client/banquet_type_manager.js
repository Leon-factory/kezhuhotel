/**
 *@jsname:餐宴类别管理
 */
~(function (eapor) {
  "use strict";
  //eapor.utils.layoutHeightSetAuto("layoutDiv_banquetTypeMmanager");
  let setPageNumber_BTM = 1,//分页number
    setPageSize_BTM = 10,//分页size
    onlySelectedOneRowFlag = 0,//单选flag
    rowSelect_BTM = null,//单行选择保存的属性对象
    reFlag = false,//判断是否删除数据为该页面第一条，是则将pageNumber指定到第一页 
    firstLoaderArray_BTM = [],//初始loader
    firstLoaderData_BTM = {},//初始加载参数
    banquetTypeName_searchBTM = "";//搜索参数

  function firstLoader_BTM(param, success, error) {
    if (!$.isEmptyObject(firstLoaderArray_BTM)) {
      success(firstLoaderArray_BTM);
      return true;
    }
    $.ajax({
      url: "../banquet/listBanquetType",
      type: "post",
      dataType: "json",
      data: firstLoaderData_BTM,
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
        firstLoaderArray_BTM = data;
        success(firstLoaderArray_BTM);
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
      async: false,
      success: function (result) {
        callBack(result);
      }
    });
  }

  //新增
  function add_BTM() {
    $('#showAddDialog_BTM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="banquetTypeName_add_BTM" type="search" label="<span style='color:red;'>*</span>餐宴类别名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="priority_add_BTM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    //名称
    $('#banquetTypeName_add_BTM').textbox({
      required: true,
      missingMessage: "餐宴类别名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    //优先级
    $('#priority_add_BTM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      min: 0,
      value: 1,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let clickFlag_BTM = true,
      showAddDialog_BTM = $('#div');
    showAddDialog_BTM.dialog({
      title: '新增餐宴类别信息',
      width: 350,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#banquetTypeName_add_BTM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#banquetTypeName_add_BTM').textbox('isValid')) {
            $('#banquetTypeName_add_BTM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_add_BTM').numberbox('isValid')) {
            $('#priority_add_BTM').numberbox('textbox').focus();
            return;
          }
          if (clickFlag_BTM == false) {
            return;
          }
          clickFlag_BTM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            banquetTypeName: $('#banquetTypeName_add_BTM').textbox('getValue'),
            sortCode: $('#priority_add_BTM').numberbox('getValue'),//优先级
          };
          $.ajax({
            type: 'post',
            url: '../banquet/addType',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的餐宴类别名称！', timeout: 3000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                defaultAjax('../banquet/getBanquetTypeCount', { banquetTypeName: "" }, refresh_getPageCountCallback);
                showAddDialog_BTM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BTM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddDialog_BTM.dialog('close');
        }
      }]
    });
  };
  //编辑
  function edit_BTM() {
    let row = $('#table_BTM').datagrid('getSelected');
    if (!row || row.banquetTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (row.banquetTypeName === '早餐') {
      $.messager.show({ title: '系统提示', msg: '默认项早餐不可编辑！', timeout: 3000, showType: 'slide' });
      return;
    }
    $('#showEditDialog_BTM').append(
      `<div id="div" style="padding:30px;">
				<div style="margin-bottom:15px;">
					<input id="banquetTypeName_edit_BTM" type="search" label="<span style='color:red;'>*</span>餐宴类别名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
				<div>
					<input id="priority_edit_BTM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
			</div>`
    );
    //餐厅会馆名称
    $('#banquetTypeName_edit_BTM').textbox({
      required: true,
      missingMessage: "餐宴类别名称不能为空！",
      value: row.banquetTypeName,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //优先级
    $('#priority_edit_BTM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      value: row.sortCode,
      min: 0,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let clickFlag_BTM = true,
      showEditDialog_BTM = $('#div');
    showEditDialog_BTM.dialog({
      title: '编辑餐宴类别信息',
      width: 350,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#banquetTypeName_edit_BTM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#banquetTypeName_edit_BTM').textbox('isValid')) {
            $('#banquetTypeName_edit_BTM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_edit_BTM').numberbox('isValid')) {
            $('#priority_edit_BTM').numberbox('textbox').focus();
            return;
          }
          if (clickFlag_BTM == false) {
            return;
          }
          clickFlag_BTM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            banquetTypeId: row.banquetTypeId,
            banquetTypeName: $('#banquetTypeName_edit_BTM').textbox('getText'),
            sortCode: $('#priority_edit_BTM').numberbox('getValue'),//优先级
          };
          console.info(subData);
          $.ajax({
            type: 'post',
            url: '../banquet/editType',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的餐宴类别名称！', timeout: 2000 });
                return;
              }
              if (result === -1) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！默认项早餐分类不可编辑！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
                let data_refresh = {
                  offset: setPageSize_BTM * (setPageNumber_BTM - 1),
                  limit: setPageSize_BTM,
                  banquetTypeName: "",
                };
                defaultAjax('../banquet/listBanquetType', data_refresh, getPageListClickCallback_BTM);
                showEditDialog_BTM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BTM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showEditDialog_BTM.dialog('close');
        }
      }]
    })
  };
  //删除
  function delete_BTM() {
    let row = $('#table_BTM').datagrid('getSelected');
    if (!row || row.banquetTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '请先选择要删除的信息！', timeout: 3000, showType: 'slide' });
      return;
    }
    if (row.banquetTypeName === '早餐') {
      $.messager.show({ title: '系统提示', msg: '默认项早餐不可删除！', timeout: 3000, showType: 'slide' });
      return;
    }
    let index = $('#table_BTM').datagrid('getRowIndex', row);
    console.info(index);
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../banquet/deleteType',
          data: { banquetTypeId: row.banquetTypeId },
          success: function (result) {
            console.info(result);
            if (result > 0) {
              if (index == 0) {
                reFlag = true;
              }
              $('#table_BTM').datagrid('deleteRow', index);
              defaultAjax('../banquet/getBanquetTypeCount', { banquetTypeName: "" }, refresh_getPageCountCallback);
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 3000 });
              return;
            }
            if (result === -1) {
              $.messager.show({ title: '系统提示', msg: '删除失败！默认项早餐不可删除！', timeout: 3000 });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 3000 });
          }
        })
      }
    });
  };
  function getPageListCallback_BTM(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BTM = result;
    $('#table_BTM').datagrid({
      title: '餐宴类别管理', 		//表格标题
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
      loader: firstLoader_BTM,
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('table_BTM', 'banquetTypeName', 2, 0);
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
        var rows = $('#table_BTM').datagrid('getChecked');
        var flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          $('#table_BTM').datagrid('checkRow', rowIndex);
          $('#table_BTM').datagrid('selectRow', rowIndex);
          rowSelect_BTM = $('#table_BTM').datagrid('getSelected');
        }
        else {
          $('#table_BTM').datagrid('uncheckRow', rowIndex);
          $('#table_BTM').datagrid('unselectRow', rowIndex);
          rowSelect_BTM = null;
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
        if (rowData != rowSelect_BTM) {
          $('#table_BTM').datagrid('checkRow', rowIndex);
          $('#table_BTM').datagrid('selectRow', rowIndex);
          rowSelect_BTM = $('#table_BTM').datagrid('getSelected');
        } else {
          $('#table_BTM').datagrid('uncheckRow', rowIndex);
          $('#table_BTM').datagrid('unselectRow', rowIndex);
          rowSelect_BTM = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      toolbar: [{
        text: '新增',
        iconCls: 'icon-add',
        handler: function () {
          add_BTM();
        }
      }, '-', {
        text: '编辑',
        iconCls: 'icon-edit',
        handler: function () {
          edit_BTM();
        }
      }, '-', {
        text: '删除',
        iconCls: 'icon-remove',
        handler: function () {
          delete_BTM();
        }
      }],
      columns: [[{ field: 'ck', title: '', checkbox: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'banquetTypeId', title: "banquetTypeId", align: 'center', width: 20, hidden: true },

      { field: 'banquetTypeName', title: "餐宴类别名称", align: 'center', width: 20 },
      { field: 'sortCode', title: "优先级", align: 'center', width: 20 }
      ]]
    });
  }

  function getPageListClickCallback_BTM(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BTM = result;
    $('#table_BTM').datagrid('options').loader = firstLoader_BTM;
    $('#table_BTM').datagrid('reload');
  }

  function refresh_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#page_BTM').pagination({ total: result });
    console.info(reFlag);
    if (reFlag) {
      $('#page_BTM').pagination({	// 改变选项并刷新分页栏信息
        pageNumber: 1
      });
      reFlag = false;
      setPageNumber_BTM = 1;
    }
    console.info("setPageNumber_BTM:" + setPageNumber_BTM);
    let data_refresh = {
      offset: setPageSize_BTM * (setPageNumber_BTM - 1),
      limit: setPageSize_BTM,
      banquetTypeName: "",
    };
    console.info(data_refresh);
    defaultAjax('../banquet/listBanquetType', data_refresh, getPageListClickCallback_BTM);

  }

  function getCountCallBack(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#page_BTM').pagination({
      total: result,
      onSelectPage: function (pageNumber, pageSize) {
        if (pageNumber == 0) {
          return;
        }
        setPageNumber_BTM = pageNumber;
        setPageSize_BTM = pageSize;
        let data = {
          offset: pageSize * (pageNumber - 1),
          limit: pageSize,
          banquetTypeName: "",
        };
        defaultAjax('../banquet/listBanquetType', data, getPageListClickCallback_BTM);
      }
    });
    //得到显示分页记录
    let page = $('#page_BTM').pagination('options');
    let subData = {
      offset: 0,
      limit: page.pageSize,
      banquetTypeName: "",
    };
    firstLoaderData_BTM = subData;
    defaultAjax('../banquet/listBanquetType', subData, getPageListCallback_BTM);
  }

  defaultAjax('../banquet/getBanquetTypeCount', { banquetTypeName: "" }, getCountCallBack);
})(window.eapor);