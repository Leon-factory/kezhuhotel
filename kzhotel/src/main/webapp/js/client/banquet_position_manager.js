/**
 *@jsname:餐宴位置管理
 */
~(function () {
  "use strict";

  let setPageNumber_BQM = 1,//分页number
    setPageSize_BQM = 10,//分页size
    onlySelectedOneRowFlag = 0,//单选flag
    rowSelect_BQM = null,//单行选择保存的属性对象
    reFlag = false,//判断是否删除数据为该页面第一条，是则将pageNumber指定到第一页
    firstLoaderArray_BQM = [],//初始loader
    firstLoaderData_BQM = {},//初始加载参数
    positionName_searchBQM = "";//搜索参数

  function firstLoader_BQM(param, success, error) {

    if (!$.isEmptyObject(firstLoaderArray_BQM)) {
      success(firstLoaderArray_BQM);
      return true;
    }
    $.ajax({
      url: "../banquet/listBanquetLocation",
      type: "post",
      dataType: "json",
      data: firstLoaderData_BQM,
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
        firstLoaderArray_BQM = data;
        success(firstLoaderArray_BQM);
      }
      , error: function (err) {
        alert(err);
      }
    });
  }
  //搜索loader
  function searchLoader_BQM(param, success, error) {
    $.ajax({
      url: "../banquet/listBanquetLocation",
      type: "post",
      data: { banquetLocationName: positionName_searchBQM, offset: 0, limit: 9999 },
      dataType: "json",
      success: function (data) {
        $('#page_BQM').pagination({	// 改变选项并刷新分页栏信息
          total: data.length,
          pageNumber: 1
        });
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#table_BQM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        let tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#table_BQM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#table_BQM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data.slice(0, setPageSize_BQM));
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
  $('#search_BQM').on('click', function () {
    positionName_searchBQM = $('#positionName_BQM').textbox('getValue');
    $('#table_BQM').datagrid('options').loader = searchLoader_BQM;
    $('#table_BQM').datagrid('reload');
  });
  //新增
  $('#add_BQM').on('click', function () {
    $('#showAddDialog_BQM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="positionName_add_BQM" type="search" label="<span style='color:red;'>*</span>餐宴位置名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="priority_add_BQM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    $('#positionName_add_BQM').textbox({
      required: true,
      missingMessage: "餐宴位置名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#priority_add_BQM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      min: 0,
      value: 1,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let clickFlag_BQM = true,
      showAddDialog_BQM = $('#div');
    showAddDialog_BQM.dialog({
      title: '新增餐宴位置信息',
      width: 350,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#positionName_add_BQM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#positionName_add_BQM').textbox('isValid')) {
            $('#positionName_add_BQM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_add_BQM').numberbox('isValid')) {
            $('#priority_add_BQM').numberbox('textbox').focus();
            return;
          }
          if (clickFlag_BQM == false) {
            return;
          }
          clickFlag_BQM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            locationName: $('#positionName_add_BQM').textbox('getValue'),
            sortCode: $('#priority_add_BQM').numberbox('getValue')
          };
          $.ajax({
            type: 'post',
            url: '../banquet/addBanquetLocation',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的餐宴位置名称！', timeout: 3000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                defaultAjax('../banquet/getBanquetLocationCount', { banquetLocationName: "" }, refresh_getPageCountCallback);
                showAddDialog_BQM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BQM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddDialog_BQM.dialog('close');
        }
      }]
    });
  });
  //编辑
  function editPosition(row) {
    $('#showEditDialog_BQM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="positionName_edit_BQM" type="search" label="<span style='color:red;'>*</span>餐宴位置名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="priority_edit_BQM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    $('#positionName_edit_BQM').textbox({
      required: true,
      missingMessage: "餐宴位置名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: row.banquetLocationName
    });
    $('#priority_edit_BQM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      value: row.sortCode
    });
    let clickFlag_BQM = true,
      showAddDialog_BQM = $('#div');
    showAddDialog_BQM.dialog({
      title: '编辑餐宴位置信息',
      width: 350,
      height: 200,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#positionName_edit_BQM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#positionName_edit_BQM').textbox('isValid')) {
            $('#positionName_edit_BQM').textbox('textbox').focus();
            return;
          }
          if (!$('#priority_edit_BQM').numberbox('isValid')) {
            $('#priority_edit_BQM').numberbox('textbox').focus();
            return;
          }
          if (clickFlag_BQM == false) {
            return;
          }
          clickFlag_BQM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            banquetLocationId: row.banquetLocationId,
            locationName: $('#positionName_edit_BQM').textbox('getValue'),
            sortCode: $('#priority_edit_BQM').numberbox('getValue'),
          };
          $.ajax({
            type: 'post',
            url: '../banquet/editBanquetLocation',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的餐宴位置名称！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
                let data_refresh = {
                  offset: setPageSize_BQM * (setPageNumber_BQM - 1),
                  limit: setPageSize_BQM,
                  banquetLocationName: "",
                };
                defaultAjax('../banquet/listBanquetLocation', data_refresh, getPageListClickCallback_BQM);
                showAddDialog_BQM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BQM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddDialog_BQM.dialog('close');
        }
      }]
    })
  };
  //删除
  function deletePosition(index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../banquet/deleteBanquetLocation',
          data: { banquetLocationId: $('#table_BQM').datagrid('getData').rows[index].banquetLocationId },
          success: function (result) {
            if (result > 0) {
              if (index == 0) {
                reFlag = true;
              }
              $('#table_BQM').datagrid('deleteRow', index);
              defaultAjax('../banquet/getBanquetLocationCount', { banquetLocationName: "" }, refresh_getPageCountCallback);
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
            } else {
              $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000 });
            }
          }
        })
      }
    });
  };
  function getPageListCallback_BQM(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BQM = result;
    $('#table_BQM').datagrid({
      title: '餐宴位置管理', 		//表格标题
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
      loader: firstLoader_BQM,
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('table_BQM', 'banquetLocationName', 3, 0);
          //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        //编辑
        $('a[name="editPosition_BQM"]').on('click', function () {
          console.info($(this).attr('data-val'));
          let row = JSON.parse($(this).attr('data-val'));
          editPosition(row);
        });
        //删除
        $('a[name="deletePosition_BQM"]').on('click', function () {
          let index = JSON.parse($(this).attr('data-val'));
          deletePosition(index);
        });
      },
      onClickRow: function (rowIndex, rowData) {
        if (onlySelectedOneRowFlag == 2) {
          onlySelectedOneRowFlag = 0;
          return;
        } else {
          onlySelectedOneRowFlag = 1;
        }
        let rows = $('#table_BQM').datagrid('getChecked');
        let flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          $('#table_BQM').datagrid('checkRow', rowIndex);
          $('#table_BQM').datagrid('selectRow', rowIndex);
          rowSelect_BQM = $('#table_BQM').datagrid('getSelected');
        }
        else {
          $('#table_BQM').datagrid('uncheckRow', rowIndex);
          $('#table_BQM').datagrid('unselectRow', rowIndex);
          rowSelect_BQM = null;
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
        if (rowData != rowSelect_BQM) {
          $('#table_BQM').datagrid('checkRow', rowIndex);
          $('#table_BQM').datagrid('selectRow', rowIndex);
          rowSelect_BQM = $('#table_BQM').datagrid('getSelected');
        } else {
          $('#table_BQM').datagrid('uncheckRow', rowIndex);
          $('#table_BQM').datagrid('unselectRow', rowIndex);
          rowSelect_BQM = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      columns: [[
        { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
        { field: 'banquetLocationId', title: "banquetLocationId", align: 'center', width: 20, hidden: true },

        { field: 'banquetLocationName', title: "餐宴位置名称", align: 'center', width: 20 },
        { field: 'sortCode', title: "优先级", align: 'center', width: 20 },
        {
          field: 'cz', title: '操作', width: 20, align: 'center',
          formatter: function (value, row, index) {
            row.createTime = "";
            row.modifyTime = "";
            let row_ = JSON.stringify(row);
            return `<a style='cursor:pointer;' class='dryColor' name='editPosition_BQM' data-val='${row_}'>[编辑]</a>
										<a style='cursor:pointer;' class='dryColor' name='deletePosition_BQM' data-val='${index}' >[删除]</a>`
          }
        }
      ]]
    });
  }

  function getPageListClickCallback_BQM(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BQM = result;
    $('#table_BQM').datagrid('options').loader = firstLoader_BQM;
    $('#table_BQM').datagrid('reload');
  }

  function refresh_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#page_BQM').pagination({ total: result });
    if (reFlag) {
      $('#page_BQM').pagination({	// 改变选项并刷新分页栏信息
        pageNumber: 1
      });
      reFlag = false;
      setPageNumber_BQM = 1;
    }
    let data_refresh = {
      offset: setPageSize_BQM * (setPageNumber_BQM - 1),
      limit: setPageSize_BQM,
      banquetLocationName: "",
    };
    defaultAjax('../banquet/listBanquetLocation', data_refresh, getPageListClickCallback_BQM);

  }

  function getCountCallBack(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#page_BQM').pagination({
      total: result,
      onSelectPage: function (pageNumber, pageSize) {
        if (pageNumber == 0) {
          return;
        }
        setPageNumber_BQM = pageNumber;
        setPageSize_BQM = pageSize;
        let data = {
          offset: pageSize * (pageNumber - 1),
          limit: pageSize,
          banquetLocationName: $('#positionName_BQM').textbox('getValue'),
        };
        defaultAjax('../banquet/listBanquetLocation', data, getPageListClickCallback_BQM);
      }
    });
    //得到显示分页记录
    let page = $('#page_BQM').pagination('options');
    let subData = {
      offset: 0,
      limit: page.pageSize,
      banquetLocationName: $('#positionName_BQM').textbox('getValue'),
    };
    firstLoaderData_BQM = subData;
    defaultAjax('../banquet/listBanquetLocation', subData, getPageListCallback_BQM);
  }
  $('#positionName_BQM').textbox({});
  defaultAjax('../banquet/getBanquetLocationCount', { banquetLocationName: "" }, getCountCallBack);

})();