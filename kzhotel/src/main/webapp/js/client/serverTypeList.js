/**
 *@JSname:服务类别管理
 */
~(function (eapor) {
  "use strict";
  let clickFlag_serverTypeList = true;
  const serverTypeList = {
    search_serviceTypeName: '',
    init() {
      this.renderTable();
      this.bind();
      this.getList();
    },
    renderTable() {
      let
        rowSelect_serverTypeList = null,
        onlySelectedOneRowFlag = 0;
      $('#serverTypeListTable').datagrid({
        title: '服务类别列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//loader:firstloader_serverTypeList,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        singleSelect: true,
        fit: false,
        rownumbers: true,
        checkOnSelect: false,
        onLoadSuccess: function (data) {
          if (!data.rows.length) {
            eapor.utils.messagerInfoBySearchEmpty('serverTypeListTable', 'serviceTypeName', 2, 0);
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
            rowSelect_serverTypeList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_serverTypeList = null;
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

          if (rowData != rowSelect_serverTypeList) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_serverTypeList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_serverTypeList = null;
          }
          onlySelectedOneRowFlag = 0;
        },
        toolbar: [{
          text: '新增',
          iconCls: 'icon-add',
          handler: function () {
            addServer_serverTypeList();
          }
        }, '-', {
          text: '编辑',
          iconCls: 'icon-edit',
          handler: function () {
            var getSelected = $('#serverTypeListTable').datagrid('getSelected');
            if (!getSelected || getSelected.serviceTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 2000 });
              return;
            } else {
              editServerTypeList(JSON.stringify(getSelected));
            }
          }
        }, '-', {
          text: '删除',
          iconCls: 'icon-remove',
          handler: function () {
            var getSelected = $('#serverTypeListTable').datagrid('getSelected');
            if (!getSelected || getSelected.serviceTypeName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要删除的信息！', timeout: 2000 });
              return;
            } else {
              var i = $('#serverTypeListTable').datagrid('getRowIndex', getSelected);
              deleteServerTypeList(JSON.stringify(getSelected), i);
            }
          }
        }],
        columns: [[  //-----columns start-----
          { field: 'ck', title: "", checkbox: true },
          { field: 'reateTime', title: "reateTime", align: 'center', width: 100, hidden: true },
          { field: 'creator', title: "creator", align: 'center', width: 100, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
          { field: 'serviceTypeId', title: "serviceTypeId", align: 'center', width: 100, hidden: true },

          { field: 'serviceTypeName', title: "服务类别名称", align: 'center', width: 20 },
          { field: 'sortCode', title: "优先级", align: 'center', fitColumns: true, width: 20 }
        ]]
      });
    },
    bind() {
      //搜索
      $('#searchServerType_serverTypeList').click(() => {
        this.search_serviceTypeName = $('#serverTypeList_serverTypeName').textbox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../Servicetype/getServicetypeCount',
        {
          serviceTypeName: this.search_serviceTypeName,
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_serverTypeList').pagination({
        total: result
      });
      const pageSize = $('#page_serverTypeList').pagination('options').pageSize;
      const pageNumber = $('#page_serverTypeList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../Servicetype/listServicetypePage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          serviceTypeName: this.search_serviceTypeName,
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#serverTypeListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../Servicetype/getServicetypeCount',
        {
          serviceTypeName: this.search_serviceTypeName,
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_serverTypeList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../Servicetype/listServicetypePage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              serviceTypeName: this.search_serviceTypeName,
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../Servicetype/listServicetypePage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          serviceTypeName: this.search_serviceTypeName,
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#serverTypeListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#serverTypeListTable').datagrid('loadData', result);
      }
    },
  };

  //编辑按钮
  function editServerTypeList(row) {
    row = JSON.parse(row);
    $('#showEditServerTypeListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:35px;">
				<div style="margin-bottom:20px">
					<input id="serverTypeList_EditServerTypeName"  label="<span style='color:red;'>*</span>服务类别名称:" labelWidth="90" labelPosition="before" labelAlign="right" style="width:220px;">
				</div>
				<div>
					<input id="serverTypeList_EditLevel" label="<span style='color:red;'>*</span>优先级:" labelAlign="right" labelWidth="90" labelPosition="before" style="width:220px;">
				</div>
			</div>
		`);
    $('#serverTypeList_EditServerTypeName').textbox({
      required: true,
      missingMessage: "服务类别名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverTypeList_EditLevel').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最大输入长度为3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证

    });
    //已选择-->取到要修改的数据到弹框上
    $('#serverTypeList_EditServerTypeName').textbox('setValue', row.serviceTypeName);
    $('#serverTypeList_EditLevel').numberbox('setValue', row.sortCode);

    let showEditServerTypeListInfo_dialog = $('#div');
    showEditServerTypeListInfo_dialog.dialog({
      title: '编辑',
      width: 330,
      height: 220,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler: function () {
            if (!$('#serverTypeList_EditServerTypeName').textbox('isValid')) {
              $('#serverTypeList_EditServerTypeName').textbox('textbox').focus();
              return;
            }
            if (!$('#serverTypeList_EditLevel').textbox('isValid')) {
              $('#serverTypeList_EditLevel').numberbox('textbox').focus();
              return;
            }

            if (clickFlag_serverTypeList == false) {
              return;
            }
            clickFlag_serverTypeList = false;
            var that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../Servicetype/edit',
              data: {
                serviceTypeName: $('#serverTypeList_EditServerTypeName').textbox('getValue'),
                sortCode: Number($('#serverTypeList_EditLevel').numberbox('getValue') === ''
                  ? 100 : $('#serverTypeList_EditLevel').numberbox('getValue')),
                serviceTypeId: row.serviceTypeId,
              },
              dataType: "json"
            })
              .done(function (data) {
                console.info(data);
                if (data == 1) {
                  serverTypeList.getRefreshList();
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
                  showEditServerTypeListInfo_dialog.dialog('close');
                  $.ajax({
                    type: 'post',
                    url: '../Servicetype/listServicetypePage',
                    data: { serviceTypeName: "", limit: 9999, offset: 0 },
                    dataType: 'json'
                  })
                    .done(function (result) {
                      eapor.hotel.getServerName = result;
                    });
                } else if (data == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的服务类别！！', timeout: 2000, showType: 'slide' });
                } else {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });
                }
              })
              .always(function () {
                clickFlag_serverTypeList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditServerTypeListInfo_dialog.dialog('close');
          }
        }]
    })
  };
  //删除
  function deleteServerTypeList(row, index) {
    row = JSON.parse(row);
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../Servicetype/del',
          data: { serviceTypeId: row.serviceTypeId },
          dataType: 'json'
        })
          .done(function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) { return; }
            if (result > 0) {
              serverTypeList.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000, showType: 'slide' });
              $.ajax({
                type: 'post',
                url: '../Servicetype/listServicetypePage',
                data: { serviceTypeName: "", limit: 9999, offset: 0 },
                dataType: 'json'
              })
                .done(function (result) {
                  eapor.hotel.getServerName = result;
                });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '该服务类别下存在其他服务！不能删除！', timeout: 2000, showType: 'slide' });
          });
      }
    });
  }
  //新增
  function addServer_serverTypeList() {
    $('#showAddServerTypeListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:35px;">
				<div style="margin-bottom:20px">
					<input id="serverTypeList_AddServerTypeName"  label="<span style='color:red;'>*</span>服务类别名称:" labelPosition="before" labelAlign="right" labelWidth="90" style="width:220px;">
				</div>
				<div>
					<input id="serverTypeList_AddServerTypeListLevel" value="100" label="<span style='color:red;'>*</span>优先级:" labelAlign="right" labelPosition="before" labelWidth="90" style="width:220px;">
				</div>
			</div>
		`);
    $('#serverTypeList_AddServerTypeName').textbox({
      required: true,
      missingMessage: "服务类别名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverTypeList_AddServerTypeListLevel').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最大输入长度为3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddServerTypeListInfo_dialog = $('#div');
    showAddServerTypeListInfo_dialog.dialog({
      title: '新增服务类别',
      width: 330,
      height: 220,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          var AddServerTypeName = $('#serverTypeList_AddServerTypeName').textbox('getValue');
          var AddServerTypeListLevel = $('#serverTypeList_AddServerTypeListLevel').numberbox('getValue');
          if (!$('#serverTypeList_AddServerTypeName').textbox('isValid')) {
            $('#serverTypeList_AddServerTypeName').textbox('textbox').focus();
            return;
          }
          if (!$('#serverTypeList_AddServerTypeListLevel').textbox('isValid')) {
            $('#serverTypeList_AddServerTypeListLevel').numberbox('textbox').focus();
            return;
          }

          if (clickFlag_serverTypeList == false) {
            return;
          }
          clickFlag_serverTypeList = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../Servicetype/add',
            data: {
              serviceTypeName: AddServerTypeName,
              sortCode: AddServerTypeListLevel,
            },
            dataType: 'json'
          })
            .done(function (result) {
              if (result > 0) {
                serverTypeList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddServerTypeListInfo_dialog.dialog('close');
                $.ajax({
                  type: 'post',
                  url: '../Servicetype/listServicetypePage',
                  data: { serviceTypeName: "", limit: 9999999, offset: 0 },
                  dataType: 'json'
                })
                  .done(function (result) {
                    eapor.hotel.getServerName = result;
                  });
              } else if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的服务类别！', timeout: 2000, showType: 'slide' });
              } else {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
              }
            })
            .always(function () {
              clickFlag_serverTypeList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddServerTypeListInfo_dialog.dialog('close');
        }
      }]
    })
  };
  serverTypeList.init();
})(window.eapor);