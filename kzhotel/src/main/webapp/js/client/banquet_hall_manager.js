/**
 *@jsname:餐厅会馆管理
 */
~(function () {
  "use strict";

  let
    setPageNumber_BHM = 1,//分页number
    setPageSize_BHM = 10,//分页size
    onlySelectedOneRowFlag = 0,//单选flag
    rowSelect_BHM = null,//单行选择保存的属性对象
    reFlag = false,//判断是否删除数据为该页面第一条，是则将pageNumber指定到第一页
    firstLoaderArray_BHM = [],//初始loader
    firstLoaderData_BHM = {},//初始加载参数
    positionName_searchBHM = "",//搜索参数
    restaurantName_searchBHM = "";//搜索参数

  function firstLoader_BHM(param, success, error) {
    console.info(firstLoaderArray_BHM);
    if (!$.isEmptyObject(firstLoaderArray_BHM)) {
      success(firstLoaderArray_BHM);
      return true;
    }
    $.ajax({
      url: "../banquet/listRestaurant",
      type: "post",
      dataType: "json",
      data: firstLoaderData_BHM,
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
        firstLoaderArray_BHM = data;
        success(firstLoaderArray_BHM);
      }
      , error: function (err) {
        alert(err);
      }
    });
  }
  //搜索loader
  function searchLoader_BHM(param, success, error) {
    console.info(restaurantName_searchBHM);
    console.info(positionName_searchBHM);

    $.ajax({
      url: "../banquet/listRestaurant",
      type: "post",
      data: {
        restaurantName: restaurantName_searchBHM, banquetLocationId: positionName_searchBHM,
        offset: 0, limit: 9999
      },
      dataType: "json",
      success: function (data) {
        console.info(data);
        $('#page_BHM').pagination({	// 改变选项并刷新分页栏信息
          total: data.length,
          pageNumber: 1
        });
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#table_BHM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        let tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#table_BHM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#table_BHM').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data.slice(0, setPageSize_BHM));
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
  $('#search_BHM').on('click', function () {
    restaurantName_searchBHM = $('#restaurantName_BHM').textbox('getValue');
    positionName_searchBHM = $('#positionName_BHM').combobox('getValue');
    $('#table_BHM').datagrid('options').loader = searchLoader_BHM;
    $('#table_BHM').datagrid('reload');
  });
  //新增
  $('#add_BHM').on('click', function () {
    $('#showAddDialog_BHM').append(
      `<div id="div" style="padding:30px;">
					<div style="margin-bottom:15px;">
						<input id="restaurantName_add_BHM" type="search" label="<span style='color:red;'>*</span>餐厅会馆名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="maxPeople_add_BHM" type="search" label="<span style='color:red;'>*</span>最大载客：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="positionName_add_BHM" label="<span style='color:red;'>*</span>餐宴位置：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div style="margin-bottom:15px;">
						<input id="priority_add_BHM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="remark_add_BHM" type="search" label="备注：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
					</div>
				</div>`
    );
    //餐厅会馆名称
    $('#restaurantName_add_BHM').textbox({
      required: true,
      missingMessage: "餐厅会馆名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //最大载客
    $('#maxPeople_add_BHM').numberbox({
      required: true,
      missingMessage: "最大载客不能为空！",
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //餐宴位置
    $('#positionName_add_BHM').combobox({
      valueField: 'banquetLocationId',
      textField: 'banquetLocationName',
      url: '../banquet/listBanquetLocation',
      queryParams: {
        banquetLocationName: "",
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
    //优先级
    $('#priority_add_BHM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      min: 0,
      value: 1,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //备注
    $('#remark_add_BHM').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let clickFlag_BHM = true,
      showAddDialog_BHM = $('#div');
    showAddDialog_BHM.dialog({
      title: '新增餐厅会馆信息',
      width: 350,
      height: 330,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#restaurantName_add_BHM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#restaurantName_add_BHM').textbox('isValid')) {
            $('#restaurantName_add_BHM').textbox('textbox').focus();
            return;
          }
          if (!$('#maxPeople_add_BHM').numberbox('isValid')) {
            $('#maxPeople_add_BHM').numberbox('textbox').focus();
            return;
          }
          if (!$('#positionName_add_BHM').combobox('isValid')) {
            $('#positionName_add_BHM').combobox('textbox').focus();
            return;
          }
          if (!$('#priority_add_BHM').numberbox('isValid')) {
            $('#priority_add_BHM').numberbox('textbox').focus();
            return;
          }
          if (!$('#remark_add_BHM').textbox('isValid')) {
            $('#remark_add_BHM').textbox('textbox').focus();
            return;
          }
          if (clickFlag_BHM == false) {
            return;
          }
          clickFlag_BHM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            restaurantName: $('#restaurantName_add_BHM').textbox('getValue'),
            maxPeople: $('#maxPeople_add_BHM').numberbox('getValue'),//最大人数
            banquetLocationId: $('#positionName_add_BHM').combobox('getValue'),//餐宴位置id
            sortCode: $('#priority_add_BHM').numberbox('getValue'),//优先级
            remark: $('#remark_add_BHM').textbox('getValue'),
          };
          $.ajax({
            type: 'post',
            url: '../banquet/addRestaurant',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的餐宴位置名称！', timeout: 3000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                defaultAjax('../banquet/getRestaurantCount', { restaurantName: "", banquetLocationId: 0 }, refresh_getPageCountCallback);
                showAddDialog_BHM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BHM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddDialog_BHM.dialog('close');
        }
      }]
    });
  });
  //编辑
  function editPosition(row) {
    console.info(row);
    $('#showEditDialog_BHM').append(
      `<div id="div" style="padding:30px;">
				<div style="margin-bottom:15px;">
					<input id="restaurantName_edit_BHM" type="search" label="<span style='color:red;'>*</span>餐厅会馆名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
				<div style="margin-bottom:15px;">
					<input id="maxPeople_edit_BHM" type="search" label="<span style='color:red;'>*</span>最大载客：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
				<div style="margin-bottom:15px;">
					<input id="positionName_edit_BHM" label="<span style='color:red;'>*</span>餐宴位置：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
				<div style="margin-bottom:15px;">
					<input id="priority_edit_BHM" type="search" label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
				<div>
					<input id="remark_edit_BHM" type="search" label="备注：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>
			</div>`
    );
    //餐厅会馆名称
    $('#restaurantName_edit_BHM').textbox({
      required: true,
      missingMessage: "餐厅会馆名称不能为空！",
      value: row.restaurantName,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //最大载客
    $('#maxPeople_edit_BHM').numberbox({
      required: true,
      missingMessage: "最大载客不能为空！",
      value: row.maxPeople,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //餐宴位置
    $('#positionName_edit_BHM').combobox({
      valueField: 'banquetLocationId',
      textField: 'banquetLocationName',
      url: '../banquet/listBanquetLocation',
      queryParams: {
        banquetLocationName: "",
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
        $(this).combobox('setValue', row.banquetLocationId);
        $(this).combobox('setText', row.banquetLocationName);
      }
    });
    //优先级
    $('#priority_edit_BHM').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      value: row.sortCode,
      min: 0,
      //validType:['maxLength[32]'],
      //invalidMessage : "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //备注
    $('#remark_edit_BHM').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      value: row.remark,
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    let clickFlag_BHM = true,
      showEditDialog_BHM = $('#div');
    showEditDialog_BHM.dialog({
      title: '编辑餐厅会馆信息',
      width: 350,
      height: 330,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#restaurantName_edit_BHM').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#restaurantName_edit_BHM').textbox('isValid')) {
            $('#restaurantName_edit_BHM').textbox('textbox').focus();
            return;
          }
          if (!$('#maxPeople_edit_BHM').numberbox('isValid')) {
            $('#maxPeople_edit_BHM').numberbox('textbox').focus();
            return;
          }
          if (!$('#positionName_edit_BHM').combobox('isValid')) {
            $('#positionName_edit_BHM').combobox('textbox').focus();
            return;
          }
          if (!$('#priority_edit_BHM').numberbox('isValid')) {
            $('#priority_edit_BHM').numberbox('textbox').focus();
            return;
          }
          if (!$('#remark_edit_BHM').textbox('isValid')) {
            $('#remark_edit_BHM').textbox('textbox').focus();
            return;
          }
          if (clickFlag_BHM == false) {
            return;
          }
          clickFlag_BHM = false;
          let that = $(this);
          that.addClass("l-btn-disabled");
          let subData = {
            restaurantId: row.restaurantId,
            restaurantName: $('#restaurantName_edit_BHM').textbox('getText'),
            maxPeople: $('#maxPeople_edit_BHM').numberbox('getValue'),//最大人数
            banquetLocationId: $('#positionName_edit_BHM').combobox('getValue'),//餐宴位置id
            sortCode: $('#priority_edit_BHM').numberbox('getValue'),//优先级
            remark: $('#remark_edit_BHM').textbox('getValue'),
          };
          console.info(subData);
          $.ajax({
            type: 'post',
            url: '../banquet/editRestaurant',
            data: subData,
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的餐厅会馆名称！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
                let data_refresh = {
                  offset: setPageSize_BHM * (setPageNumber_BHM - 1),
                  limit: setPageSize_BHM,
                  restaurantName: "",
                  banquetLocationId: 0,
                };
                defaultAjax('../banquet/listRestaurant', data_refresh, getPageListClickCallback_BHM);
                showEditDialog_BHM.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_BHM = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showEditDialog_BHM.dialog('close');
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
          url: '../banquet/deleteRestaurant',
          data: { restaurantId: $('#table_BHM').datagrid('getData').rows[index].restaurantId },
          success: function (result) {
            console.info(result);
            if (result > 0) {
              if (index == 0) {
                reFlag = true;
              }
              $('#table_BHM').datagrid('deleteRow', index);
              defaultAjax('../banquet/getRestaurantCount', { restaurantName: "", banquetLocationId: 0 }, refresh_getPageCountCallback);
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000 });
            } else {
              $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000 });
            }
          }
        })
      }
    });
  };
  function getPageListCallback_BHM(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BHM = result;
    $('#table_BHM').datagrid({
      title: '餐厅会馆管理', 		//表格标题
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
      loader: firstLoader_BHM,
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('table_BHM', 'restaurantName', 6, 0);
          //$(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        //编辑
        $('a[name="editPosition_BHM"]').on('click', function () {
          let row = JSON.parse($(this).attr('data-val'));
          editPosition(row);
        });
        //删除
        $('a[name="deletePosition_BHM"]').on('click', function () {
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
        let rows = $('#table_BHM').datagrid('getChecked');
        let flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          $('#table_BHM').datagrid('checkRow', rowIndex);
          $('#table_BHM').datagrid('selectRow', rowIndex);
          rowSelect_BHM = $('#table_BHM').datagrid('getSelected');
        }
        else {
          $('#table_BHM').datagrid('uncheckRow', rowIndex);
          $('#table_BHM').datagrid('unselectRow', rowIndex);
          rowSelect_BHM = null;
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
        if (rowData != rowSelect_BHM) {
          $('#table_BHM').datagrid('checkRow', rowIndex);
          $('#table_BHM').datagrid('selectRow', rowIndex);
          rowSelect_BHM = $('#table_BHM').datagrid('getSelected');
        } else {
          $('#table_BHM').datagrid('uncheckRow', rowIndex);
          $('#table_BHM').datagrid('unselectRow', rowIndex);
          rowSelect_BHM = null;
        }
        onlySelectedOneRowFlag = 0;
      },
      columns: [[
        { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
        { field: 'banquetLocationId', title: "banquetLocationId", align: 'center', width: 20, hidden: true },
        { field: 'restaurantId', title: "restaurantId", align: 'center', width: 20, hidden: true },

        { field: 'restaurantName', title: "餐厅会馆名称", align: 'center', width: 20 },
        { field: 'maxPeople', title: "最大载客", align: 'center', width: 20 },
        { field: 'banquetLocationName', title: "餐宴位置", align: 'center', width: 20 },
        { field: 'sortCode', title: "优先级", align: 'center', width: 20 },
        { field: 'remark', title: "备注", align: 'center', width: 20 },
        {
          field: 'cz', title: '操作', width: 20, align: 'center',
          formatter: function (value, row, index) {
            let row_ = JSON.stringify(row);
            return `<a style='cursor:pointer;' class='dryColor' name='editPosition_BHM' data-val='${row_}'>[编辑]</a>
										<a style='cursor:pointer;' class='dryColor' name='deletePosition_BHM' data-val='${index}' >[删除]</a>`
          }
        }
      ]]
    });
  }

  function getPageListClickCallback_BHM(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    firstLoaderArray_BHM = result;
    $('#table_BHM').datagrid('options').loader = firstLoader_BHM;
    $('#table_BHM').datagrid('reload');
  }

  function refresh_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#page_BHM').pagination({ total: result });
    if (reFlag) {
      $('#page_BHM').pagination({	// 改变选项并刷新分页栏信息
        pageNumber: 1
      });
      reFlag = false;
      setPageNumber_BHM = 1;
    }
    console.info(setPageNumber_BHM);
    let data_refresh = {
      offset: setPageSize_BHM * (setPageNumber_BHM - 1),
      limit: setPageSize_BHM,
      restaurantName: "",
      banquetLocationId: 0,
    };
    console.info(data_refresh);
    defaultAjax('../banquet/listRestaurant', data_refresh, getPageListClickCallback_BHM);

  }

  function getCountCallBack(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#page_BHM').pagination({
      total: result,
      onSelectPage: function (pageNumber, pageSize) {
        if (pageNumber == 0) {
          return;
        }
        setPageNumber_BHM = pageNumber;
        setPageSize_BHM = pageSize;
        let data = {
          offset: pageSize * (pageNumber - 1),
          limit: pageSize,
          restaurantName: $('#restaurantName_BHM').textbox('getValue'),
          banquetLocationId: $('#positionName_BHM').combobox('getValue'),
        };
        defaultAjax('../banquet/listRestaurant', data, getPageListClickCallback_BHM);
      }
    });
    //得到显示分页记录
    let page = $('#page_BHM').pagination('options');
    let subData = {
      offset: 0,
      limit: page.pageSize,
      restaurantName: $('#restaurantName_BHM').textbox('getValue'),
      banquetLocationId: $('#positionName_BHM').combobox('getValue'),
    };
    firstLoaderData_BHM = subData;
    defaultAjax('../banquet/listRestaurant', subData, getPageListCallback_BHM);
  }
  $('#restaurantName_BHM').textbox({});
  $('#positionName_BHM').combobox({
    valueField: 'banquetLocationId',
    textField: 'banquetLocationName',
    url: '../banquet/listBanquetLocation',
    queryParams: {
      banquetLocationName: "",
      offset: 0,
      limit: 99999
    },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    value: 0,
    loadFilter: function (data) {
      data.unshift({ banquetLocationName: "全部", banquetLocationId: 0 });
      return data;
    }
  });

  defaultAjax('../banquet/getRestaurantCount', { restaurantName: "", banquetLocationId: 0 }, getCountCallBack);

})();