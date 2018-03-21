/**
 * JS名称：开班和接款
 * 
 */
~(function () {  
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_onduty");

  var rowSelect_acceptOnduty = null,
    onlySelectedOneRowFlag = 0,
    deliverSuccessionId = undefined;
  //待接款列表
  $("#acceptOnduty_table").datagrid({
    title: '', 		//表格标题
    iconCls: 'icon-list',  //表格图标
    nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
    fitColumns: true, 		//防止水平滚动
    scrollbarSize: 0, 		//去掉右侧滚动条列
    collapsible: false,	//是否可折叠的 
    striped: true,//隔行变色
    loadMsg: "loading....",
    singleSelect: true,
    rownumbers: true,
    fit: true,
    checkOnSelect: false,
    onLoadSuccess: function () {
      $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
    },
    onClickRow: function (rowIndex, rowData) {
      if (onlySelectedOneRowFlag == 2) {
        onlySelectedOneRowFlag = 0;
        return;
      } else {
        onlySelectedOneRowFlag = 1;
      }

      var rows = $(this).datagrid('getChecked');
      var flag = true;
      for (let i = 0; i < rows.length; i++) {
        if (rowData == rows[i]) {
          flag = false;
          break;
        }
      }

      if (flag) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_acceptOnduty = $(this).datagrid('getSelected');
      }
      else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_acceptOnduty = null;
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

      if (rowData != rowSelect_acceptOnduty) {
        $(this).datagrid('checkRow', rowIndex);
        $(this).datagrid('selectRow', rowIndex);
        rowSelect_acceptOnduty = $(this).datagrid('getSelected');
      } else {
        $(this).datagrid('uncheckRow', rowIndex);
        $(this).datagrid('unselectRow', rowIndex);
        rowSelect_acceptOnduty = null;
      }

      onlySelectedOneRowFlag = 0;
    },
    columns: [[
      { field: 'deliverCashId', title: "deliverCashId", width: 16, align: 'center', hidden: true },
      { field: 'deliverSuccessionId', title: "deliverSuccessionId", width: 16, align: 'center', hidden: true },
      { field: 'deliverUserId', title: "deliverUserId", width: 16, align: 'center', hidden: true },
      { field: 'hotelId', title: "hotelId", width: 16, align: 'center', hidden: true },
      { field: 'receiveState', title: "receiveState", width: 16, align: 'center', hidden: true },
      { field: 'receiveSuccessionId', title: "receiveSuccessionId", width: 16, align: 'center', hidden: true },
      { field: 'receiveUserId', title: "receiveUserId", width: 16, align: 'center', hidden: true },

      { field: 'ck', title: '', checkbox: true },
      {
        field: 'id1', title: "项目", width: 16, align: 'center',
        formatter: function (value, row, index) {
          if (value == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
            return value;
          } else {
            return "交款";
          }
        }
      },
      {
        field: 'amount', title: "金额", width: 16, align: 'center',
        formatter: function (value, row, index) {
          console.info(value);
          if (value) {
            return NP.divide(value, 100);
          } else {
            return '';
          }
        }
      },
      { field: 'deliverUsername', title: "交款账号", width: 16, align: 'center' },
      {
        field: 'deliverTime', title: "交款时间", width: 26, align: 'center',
        formatter: function (value, row, index) {
          return getDate(value);
        }
      },
      { field: 'remark', title: "备注", width: 16, align: 'center' }
    ]]
  });

  //确定开班的回调函数
  function acceptOnduty_createShiftCallback(result) {
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '开班失败，该班次未交班，不能重复开班！', timeout: 2000, height: 'auto' });
      return;
    }
    if (result > 0) {
      console.info(result);
      $('#succession').val(result);
      $.messager.show({ title: '系统提示', msg: '开班成功', timeout: 2000 });
      init_acceptOnduty();
      return;
    }
    $.messager.show({ title: '系统提示', msg: '开班失败！', timeout: 2000, height: 'auto' });
  }
  //新开班btn
  $('#createShift_acceptOnduty').click(function () {
    $.ajax({
      type: 'post',
      url: '../shift/getActiveSuccession',
      data: {},
      success: function (result) {
        console.info(result);
        if (result == "null") {
          $.messager.confirm('确认', '您确认要进行开班操作吗？', function (r) {
            if (r) {
              eapor.utils.defaultAjax("../shift/createSuccession", {
                remark: ""
              }, acceptOnduty_createShiftCallback);
            }
          });
        } else {
          if (eapor.utils.ajaxCallBackErrInfo(result)) {
            return;
          }
          $.messager.alert('系统提示', '无效的操作！您已在当班状态！');
        }
      }
    });
  });
  //接款 确定函数
  function acceptOnduty_accept(row) {
    console.info(row);
    $.messager.confirm('确认', '您确认要接' + row.deliverUsername + '的款项吗？', function (r) {
      if (r) {
        eapor.utils.defaultAjax("../shift/receiveCash", {
          remark: '',
          deliverCashId: row.deliverCashId//交款记录id
        }, acceptOnduty_acceptShift);
      }
    });
  };
  //确定接款回调函数
  function acceptOnduty_acceptShift(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    if (result == 0) {
      $.messager.show({ title: '系统提示', msg: '接款失败！', timeout: 2000 });
      return;
    } else if (result > 0) {
      $.messager.show({ title: '系统提示', msg: '接款成功', timeout: 2000 });
      init_acceptOnduty();
      return;
    } else {
      $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 2000 });
      return;
    }
  }

  //接款btn
  $('#receiveMoney_acceptOnduty').click(function () {
    var selected = $("#acceptOnduty_table").datagrid('getSelected');
    console.info(selected);
    if (!selected) {
      $.messager.show({ title: '系统提示', msg: '请先选择接款项！', timeout: 2000 });
      return;
    } else if (selected.id1 == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      $.messager.show({ title: '系统提示', msg: '未查询到相关待接款信息！', timeout: 2000 });
      return;
    } else {
      var row = JSON.stringify(selected);
      acceptOnduty_accept(selected);
    }
  });

  function init_acceptOnduty() {
    $.ajax({
      type: 'post',
      url: '../shift/listDeliverCashPage',
      data: { offset: 0, limit: 9999999, deliverSuccessionId: 0, receiveSuccessionId: 0, receiveState: 1 },
      dataType: "json",
      success: function (result) {
        console.info(result);
        if (eapor.utils.ajaxCallBackErrInfo(result)) {
          return;
        }

        if (result.length > 0) {
          $('#acceptOnduty_table').datagrid("loadData", result);
          $("#acceptOnduty_table").datagrid("reload");
        } else {
          $('#acceptOnduty_table').datagrid("loadData", { total: 0, rows: [] });
          $("#acceptOnduty_table").datagrid("reload");
          $('#acceptOnduty_table').datagrid('insertRow', {
            index: 0,	// 索引从0开始
            row: {
              id1: '<span style="color:red;font-size:18px;">未查询到相关信息！</span>'
            }
          });
          $('#acceptOnduty_table').datagrid('mergeCells', {
            index: 0,
            field: 'id1',
            colspan: 5
          });
          $('#acceptOnduty_table').parent().find(".datagrid-cell-check").parent().css("border-color", "#FAFAFA")
            .children('div').children('input')[0].style.visibility = "hidden";
          $('#acceptOnduty_table').parent().find(".datagrid-td-rownumber").css("background-color", "#FAFAFA").css("border-color", "#FAFAFA").children('div').html("");
          $('#acceptOnduty_table').parent().find(".datagrid-td-merged").css("border-bottom-color", "#FAFAFA")
          var that = $('#acceptOnduty_table').parent().find(".datagrid-td-merged").parent()[0];
          $(that).hover(function () { $(that).css("background-color", "#FAFAFA") });
        }
      }
    })
  };

  init_acceptOnduty();
})();