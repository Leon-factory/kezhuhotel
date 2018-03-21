/**
 *@JSname:房间位置设置
 */
~(function ($, eapor) {
  "use strict";
  //eapor.utils.layoutHeightSetAuto("layoutDiv_setFloor");

  var clickFlag_setFloor = true,
    setPageNumber_sf = 1,
    setPageSize_sf = 10,
    setFloorListData = {},
    setFloorArray = [],
    setFloorSearchData = {},
    reFlag = false,
    rowSelect_setFloor = null,
    onlySelectedOneRowFlag = 0;

  function refresh_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    $('#floorListPage').pagination({ total: result });
    if (reFlag) {
      $('#floorListPage').pagination({	// 改变选项并刷新分页栏信息
        pageNumber: 1
      });
      reFlag = false;
    }
    var data_refresh = {};
    data_refresh.offset = setPageSize_sf * (setPageNumber_sf - 1);
    data_refresh.limit = setPageSize_sf;
    data_refresh.floorName = "";
    console.info(setPageNumber_sf);
    console.info(setPageSize_sf);
    console.info(data_refresh);
    eapor.utils.defaultAjax('../floor/pglist', data_refresh, sf_getPageListClickCallback);

  }
  /*loader*/
  var setFloorLoader = function (param, success, error) {
    if (!$.isEmptyObject(setFloorArray)) {
      success(setFloorArray);
      return true;
    }
    $.ajax({
      url: "../floor/pglist",
      type: "post",
      dataType: "json",
      data: setFloorListData,
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          success([]);
          return;
        }
        if (data == "") {
          success([]);
          return true;
        }
        setFloorArray = data;
        success(setFloorArray);
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  /*搜索loader*/
  function setFloorSearchLoader(param, success, error) {
    $.ajax({
      url: "../floor/pgcount",
      type: "post",
      data: setFloorSearchData,
      dataType: "json",
      success: function (data) {
        if (eapor.utils.ajaxCallBackErrInfo(data)) {
          $('#tab_guest_manage').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return;
        }
        var tmpjson = JSON.stringify(data);
        if (tmpjson == "[]") {
          $('#tab_guest_manage').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        if (data == "") {
          $('#tab_guest_manage').datagrid('loadData', { total: 0, rows: [] });
          success([]);
          return true;
        }
        success(data);
        return true;
      }
      , error: function (err) {
        alert(err);
      }
    });
  };

  /*搜索*/
  $('#sf_searchFloor').click(function () {
    let data = {
      floorName: $('#sf_floorName').textbox('getValue')
    };
    eapor.utils.defaultAjax('../floor/pgcount', data, sf_getPageCountCallback);
  });
  //删除
  function deleteFloor(index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../floor/del',
          data: { floorId: $('#floorTable').datagrid('getData').rows[index].floorId },
          success: function (result) {
            console.info(result);
            if (result == -2) {
              $.messager.show({ title: '系统提示', msg: '删除失败！该位置下还存在房间！', timeout: 3000 });
              return;
            }
            if (result > 0) {
              if (index == 0) {
                reFlag = true;
              }
              $('#floorTable').datagrid('deleteRow', index);
              /*$('#floorListPage .l-btn-plain').trigger('click')*/
              eapor.utils.defaultAjax("../floor/pgcount", { "floorName": "" }, refresh_getPageCountCallback);
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 3000 });;
            } else {
              $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 3000 });
            }
          }
        })
      }
    });
  }
  //新增
  $('#sf_addNewFloor').click(function () {
    $('#showAddFloorInfo').append(
      `<div id="div" style="padding:30px;">
					<input id="setFloor_addFloorName" type="search" label="<span style='color:red;'>*</span>位置名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>`
    );
    $('#setFloor_addFloorName').textbox({
      required: true,
      missingMessage: "位置名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddFloorInfo_dialog = $('#div');
    showAddFloorInfo_dialog.dialog({
      title: '新增位置信息',
      width: 380,
      height: 180,
      modal: true,
      onOpen: function () {
        $('#setFloor_addFloorName').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#setFloor_addFloorName').textbox('isValid')) {
            $('#setFloor_addFloorName').textbox('textbox').focus();
            return;
          }
          if (clickFlag_setFloor == false) {
            return;
          }
          clickFlag_setFloor = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../floor/add',
            data: { floorName: $('#setFloor_addFloorName').textbox('getValue') },
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的位置名称！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                eapor.utils.defaultAjax("../floor/pgcount", { "floorName": "" }, refresh_getPageCountCallback);
                /*var //data_refresh  = {};
                data_refresh.offset = setPageSize_sf * (setPageNumber_sf - 1);
                data_refresh.limit = setPageSize_sf;
                data_refresh.floorName = "";
                eapor.utils.defaultAjax('../floor/pglist',data_refresh,sf_getPageListClickCallback);*/
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                showAddFloorInfo_dialog.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
            })
            .always(function () {
              clickFlag_setFloor = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddFloorInfo_dialog.dialog('close');
        }
      }]
    })
  });

  function editFloor(row_) {
    let row = JSON.parse(row_);
    $('#showEditFloorInfo').append(
      `<div id="div" style="padding:30px;">
					<input id="setFloor_editFloorName" type="search" label="<span style='color:red;'>*</span>位置名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>
				</div>`
    );
    $('#setFloor_editFloorName').textbox({
      required: true,
      missingMessage: "位置名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //已选择-->取到要修改的数据到弹框上
    $('#setFloor_editFloorName').textbox('setValue', row.floorName);
    let showEditFloorInfo_dialog = $('#div');
    showEditFloorInfo_dialog.dialog({
      title: '编辑位置',
      width: 350,
      height: 180,
      closed: false,
      cache: false,
      modal: true,
      onOpen: function () {
        $('#setFloor_editFloorName').textbox('textbox').focus();
      },
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler: function () {
            if (!$('#setFloor_editFloorName').textbox('isValid')) {
              $('#setFloor_editFloorName').textbox('textbox').focus();
              return;
            }
            if (clickFlag_setFloor == false) {
              return;
            }
            clickFlag_setFloor = false;
            var that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../floor/edit',
              data: {
                floorName: $('#setFloor_editFloorName').textbox('getValue')
                , floorId: row.floorId
              },
              dataType: "json"
            })
              .done(function (data) {
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                if (data == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的位置名称！', timeout: 2000 });
                  return;
                }
                if (data > 0) {
                  //刷新当前页
                  var data_refresh = {};
                  data_refresh.offset = setPageSize_sf * (setPageNumber_sf - 1);
                  data_refresh.limit = setPageSize_sf;
                  data_refresh.floorName = "";
                  eapor.utils.defaultAjax('../floor/pglist', data_refresh, sf_getPageListClickCallback);
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
                  showEditFloorInfo_dialog.dialog('close');
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
              })
              .always(function () {
                clickFlag_setFloor = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditFloorInfo_dialog.dialog('close');
          }
        }]
    })
  };

  //分页按钮
  function sf_getPageListClickCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    setFloorArray = result;
    $('#floorTable').datagrid('options').loader = setFloorLoader;
    $('#floorTable').datagrid('reload');

  }
  //list
  function sf_getPageListCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    setFloorArray = result;
    $('#floorTable').datagrid({
      loader: setFloorLoader,
      title: '位置列表', 		//表格标题
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
      checkOnSelect: false,
      onLoadSuccess: function (data) {
        if (!data.rows.length) {
          eapor.utils.messagerInfoBySearchEmpty('floorTable', 'floorName', 2, 0);
          $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
        }
        //隐藏全选框
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
        //编辑按钮
        $('a[name="editFloor_setFloor"]').on('click', function () {
          let row_ = $(this).attr('data-val');
          editFloor(row_);
        });
        //删除按钮
        $('a[name="deleteFloor_setFloor"]').on('click', function () {
          let index = $(this).attr('data-val');
          deleteFloor(index);
        });
      },
      onClickRow: function (rowIndex, rowData) {

        if (onlySelectedOneRowFlag == 2) {
          onlySelectedOneRowFlag = 0;
          return;
        } else {
          onlySelectedOneRowFlag = 1;
        }

        var rows = $('#floorTable').datagrid('getChecked');
        var flag = true;
        for (let i = 0; i < rows.length; i++) {
          if (rowData == rows[i]) {
            flag = false;
            break;
          }
        }

        if (flag) {
          $('#floorTable').datagrid('checkRow', rowIndex);
          $('#floorTable').datagrid('selectRow', rowIndex);
          rowSelect_setFloor = $('#floorTable').datagrid('getSelected');
        }
        else {
          $('#floorTable').datagrid('uncheckRow', rowIndex);
          $('#floorTable').datagrid('unselectRow', rowIndex);
          rowSelect_setFloor = null;
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

        if (rowData != rowSelect_setFloor) {
          $('#floorTable').datagrid('checkRow', rowIndex);
          $('#floorTable').datagrid('selectRow', rowIndex);
          rowSelect_setFloor = $('#floorTable').datagrid('getSelected');
        } else {
          $('#floorTable').datagrid('uncheckRow', rowIndex);
          $('#floorTable').datagrid('unselectRow', rowIndex);
          rowSelect_setFloor = null;
        }

        onlySelectedOneRowFlag = 0;
      },
      columns: [[{ field: 'ck', title: '', checkbox: true },
      { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
      { field: 'floorId', title: "floorId", align: 'center', width: 20, hidden: true },
      { field: 'creator', title: "创建者", align: 'center', width: 20, hidden: true },
      { field: 'createTime', title: "创建时间", align: 'center', width: 20, hidden: true },

      { field: 'floorName', title: "位置名称", align: 'center', width: 20 },

      {
        field: 'id5', title: '操作', width: 20, align: 'center', formatter: function (value, row, index) {
          //onclick='editFloor("+row+")' onclick='deleteFloor("+index+")'
          let row_ = JSON.stringify(row);

          return `<a style='cursor:pointer;' class='dryColor' name='editFloor_setFloor' data-val='${row_}'  >[编辑]</a>
				        			    <a style='cursor:pointer;' class='dryColor' name='deleteFloor_setFloor' data-val='${index}' >[删除]</a>`
        }
      }
      ]]
    });

  }

  //countCallBack
  function sf_getPageCountCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    //得到分页点击记录
    $('#floorListPage').pagination({
      total: result,
      onSelectPage: function (pageNumber, pageSize) {
        if (!pageNumber) {
          return;
        }
        setPageNumber_sf = pageNumber;
        setPageSize_sf = pageSize;
        var data = {};
        data.offset = pageSize * (pageNumber - 1);
        data.limit = pageSize;
        data.floorName = "";
        eapor.utils.defaultAjax('../floor/pglist', data, sf_getPageListClickCallback);
      }
    });
    //得到显示分页记录
    var page = $('#floorListPage').pagination('options');
    var data = {};
    data.offset = 0;
    data.limit = page.pageSize;
    data.floorName = $('#sf_floorName').textbox('getValue');
    setFloorListData = data;
    eapor.utils.defaultAjax('../floor/pglist', data, sf_getPageListCallback);
  };

  $('#sf_floorName').textbox({});
  eapor.utils.defaultAjax("../floor/pgcount", { floorName: "" }, sf_getPageCountCallback);
})(window.jQuery, window.eapor);