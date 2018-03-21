/**
 * @JS名称：服务管理
 */
~(function (eapor) {
  "use strict";
  let clickFlag_serverList = true;
  const serverList = {
    search_serviceTypeId: 0,
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      $('#serverList_serverName').combobox({
        data: eapor.hotel.getServerName,
        valueField: 'serviceTypeId',
        textField: 'serviceTypeName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        editable: false,
        onShowPanel: function () {
          $(this).combobox('loadData', eapor.hotel.getServerName);
        },
        loadFilter: function (result) {
          if (result.length > 0 && result[0].serviceTypeName !== "全部") {
            result.unshift({ serviceTypeId: 0, serviceTypeName: "全部" });
          }
          return result;
        }
      });
    },
    renderTable() {
      let
        rowSelect_serverList = null,
        onlySelectedOneRowFlag = 0;
      $('#serverListTable').datagrid({
        title: '服务列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//loader:firstloader_serverList,
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
            eapor.utils.messagerInfoBySearchEmpty('serverListTable', 'serviceItemCode', 4, 0);
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
            rowSelect_serverList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_serverList = null;
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

          if (rowData != rowSelect_serverList) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_serverList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_serverList = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        toolbar: [{
          text: '新增',
          iconCls: 'icon-add',
          handler: function () {
            addServer_serverList();
          }
        }, '-', {
          text: '编辑',
          iconCls: 'icon-edit',
          handler: function () {
            var getSelected = $('#serverListTable').datagrid('getSelected');
            if (!getSelected || getSelected.serviceItemCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要编辑的信息！', timeout: 2000 });
              return;
            } else {
              editServerList(JSON.stringify(getSelected));
            }
          }
        }, '-', {
          text: '删除',
          iconCls: 'icon-remove',
          handler: function () {
            var getSelected = $('#serverListTable').datagrid('getSelected');
            if (!getSelected || getSelected.serviceItemCode == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要删除的信息！', timeout: 2000 });
              return;
            } else {
              var i = $('#serverListTable').datagrid('getRowIndex', getSelected);
              deleteServerList(JSON.stringify(getSelected), i);
            }
          }
        }],
        columns: [[  //-----columns start-----
          { field: 'ck', title: "", checkbox: true },
          { field: 'reateTime', title: "reateTime", align: 'center', width: 100, hidden: true },
          { field: 'creator', title: "creator", align: 'center', width: 100, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
          { field: 'remark', title: "remark", align: 'center', width: 100, hidden: true },
          { field: 'serviceItemId', title: "serviceItemId", align: 'center', width: 100, hidden: true },
          { field: 'serviceTypeId', title: "serviceTypeId", align: 'center', width: 100, hidden: true },

          { field: 'serviceItemCode', title: "服务名称", align: 'center', width: 20 },
          { field: 'serviceTypeName', title: "服务类别名称", align: 'center', width: 20 },
          {
            field: 'price', title: "价格", align: 'center', width: 20,
            formatter: function (value, index, row) {
              if (value != undefined) {
                return NP.divide(value, 100);
              } else {
                return value;
              }
            }
          },
          { field: 'sortCode', title: "优先级", align: 'center', fitColumns: true, width: 20 }
        ]]
      });
    },
    bind() {
      //搜索
      $('#searchServer_serverList').click(() => {
        this.search_serviceTypeId = $('#serverList_serverName').combobox('getValue') === "全部" ||
          $('#serverList_serverName').combobox('getValue') === ""
          ? 0 : $('#serverList_serverName').combobox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../Serviceitem/getServiceitemCount',
        {
          serviceItemName: '',
          serviceTypeId: this.search_serviceTypeId,
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_serverList').pagination({
        total: result
      });
      const pageSize = $('#page_serverList').pagination('options').pageSize;
      const pageNumber = $('#page_serverList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../Serviceitem/listServiceitemPage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          serviceItemName: '',
          serviceTypeId: this.search_serviceTypeId,
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#serverListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../Serviceitem/getServiceitemCount',
        {
          serviceItemName: '',
          serviceTypeId: this.search_serviceTypeId,
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_serverList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../Serviceitem/listServiceitemPage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              serviceItemName: '',
              serviceTypeId: this.search_serviceTypeId,
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../Serviceitem/listServiceitemPage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          serviceItemName: '',
          serviceTypeId: this.search_serviceTypeId,
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //			this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //			this.maxId = result.maxId;
        $('#serverListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#serverListTable').datagrid('loadData', result);
      }
    },
  };

  //编辑按钮
  function editServerList(row) {
    row = JSON.parse(row);
    $('#showEditServerListInfo').append(`
				<div id="div" style="padding-top:30px;padding-left:50px;">
					<div style="margin-bottom:20px">
						<input id="serverList_EditServerName"  labelWidth="90" label="<span style='color:red;'>*</span>服务名称:" labelAlign="right" labelPosition="before" style="width:220px;">
					</div>
					<div style="margin-bottom:20px">
						<input id="serverList_EditServerTypeName" labelWidth="90" label="<span style='color:red;'>*</span>服务类别名称:" labelAlign="right" labelPosition="before" style="width:220px;">
					</div>
					<div style="margin-bottom:20px">
						<input id="serverList_EditServerPrice" labelWidth="90" label="<span style='color:red;'>*</span>价格（¥）:" labelAlign="right" labelPosition="before" style="width:220px;">
					</div>
					<div>
						<input id="serverList_EditServerLevel" labelWidth="90" label="<span style='color:red;'>*</span>优先级:"  labelAlign="right" labelPosition="before" style="width:220px;">
					</div>
				</div>
		`);
    $('#serverList_EditServerName').textbox({
      required: true,
      missingMessage: "服务名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverList_EditServerTypeName').combobox({
      url: '../Servicetype/listServicetypePage',
      queryParams: { serviceTypeName: "", limit: 9999, offset: 0 },
      valueField: 'serviceTypeId',
      textField: 'serviceTypeName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "服务类别名称不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].serviceTypeId);
          $(this).combobox('setText', data[0].serviceTypeName);
        }
      }
    });
    $('#serverList_EditServerPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "服务价格不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverList_EditServerLevel').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //已选择-->取到要修改的数据到弹框上
    $('#serverList_EditServerName').textbox('setValue', row.serviceItemCode);
    $('#serverList_EditServerTypeName').combobox('setValue', row.serviceTypeName);
    $('#serverList_EditServerPrice').numberbox('setValue', NP.divide(row.price, 100));
    $('#serverList_EditServerLevel').numberbox('setValue', row.sortCode);
    var getServiceItemId = row.serviceItemId;

    let showEditServerListInfo_dialog = $('#div');
    showEditServerListInfo_dialog.dialog({
      title: '编辑',
      width: 360,
      height: 300,
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
            if (!$('#serverList_EditServerName').textbox('isValid')) {
              $('#serverList_EditServerName').textbox('textbox').focus();
              return;
            }
            if (!$('#serverList_EditServerTypeName').combobox('isValid')) {
              $('#serverList_EditServerTypeName').combobox('textbox').focus();
              return;
            }
            if (!$('#serverList_EditServerPrice').numberbox('isValid')) {
              $('#serverList_EditServerPrice').numberbox('textbox').focus();
              return;
            }
            if (!$('#serverList_EditServerLevel').numberbox('isValid')) {
              $('#serverList_EditServerLevel').numberbox('textbox').focus();
              return;
            }
            var editServiceItemName = $('#serverList_EditServerName').textbox('getValue');
            var editServiceTypeId = $('#serverList_EditServerTypeName').combobox('getValue');
            $.each($('#serverList_EditServerTypeName').combobox('getData'), function (i, item) {
              if (editServiceTypeId == item.serviceTypeName) {
                editServiceTypeId = item.serviceTypeId;
                return;
              }
            });
            var editServerPrice = $('#serverList_EditServerPrice').numberbox('getValue');
            var editServerSortCode = $('#serverList_EditServerLevel').numberbox('getValue');
            var editServerRemark = '';

            var data = {
              serviceItemName: editServiceItemName,
              serviceTypeId: editServiceTypeId,
              price: (editServerPrice * 100).toFixed(0),
              sortCode: editServerSortCode,
              remark: editServerRemark,
              serviceItemId: getServiceItemId,
            };

            if (clickFlag_serverList == false) {
              return;
            }
            clickFlag_serverList = false;
            var that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../Serviceitem/edit',
              data: data,
              dataType: 'json'
            })
              .done(function (result) {
                if (eapor.utils.ajaxCallBackErrInfo(result)) {
                  return;
                }
                if (result == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！该服务名称已存在！', timeout: 2800, showType: 'slide' });
                  return;
                }
                if (result > 0) {
                  serverList.getRefreshList();
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2800, showType: 'slide' });
                  showEditServerListInfo_dialog.dialog('close');
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2800, showType: 'slide' });
              })
              .always(function () {
                clickFlag_serverList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditServerListInfo_dialog.dialog('close');
          }
        }]
    })
  };
  //删除
  function deleteServerList(row, index) {
    var row = JSON.parse(row);
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../Serviceitem/del',
          data: { serviceItemId: row.serviceItemId },
          success: function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            if (result > 0) {
              serverList.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2800, showType: 'slide' });
              return;
            } else {
              $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2800, showType: 'slide' });
              return;
            }
          }
        })
      }
    });
  }
  //新增
  function addServer_serverList() {
    $('#showAddServerListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:50px;">
				<div style="margin-bottom:20px">
					<input id="serverList_AddServerName" labelAlign="right" labeWidth="90" label="<span style='color:red;'>*</span>服务名称:" labelPosition="before" style="width:220px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="serverList_AddServerTypeName" labelAlign="right" labeWidth="90" label="<span style='color:red;'>*</span>服务类别名称:" labelPosition="before" style="width:220px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="serverList_AddServerPrice" labelAlign="right" labeWidth="90" label="<span style='color:red;'>*</span>价格（¥）:" labelPosition="before" style="width:220px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="serverList_AddServerLevel" value="100" labelAlign="right" labeWidth="90" label="<span style='color:red;'>*</span>优先级:" labelPosition="before" style="width:220px;">
				</div>
			</div>
		`);
    $('#serverList_AddServerName').textbox({
      required: true,
      missingMessage: "服务名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverList_AddServerTypeName').combobox({
      url: '../Servicetype/listServicetypePage',
      queryParams: { serviceTypeName: "", limit: 9999, offset: 0 },
      valueField: 'serviceTypeId',
      textField: 'serviceTypeName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "服务类别名称不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $('#serverList_AddServerTypeName').combobox('setValue', data[0].serviceTypeId);
          $('#serverList_AddServerTypeName').combobox('setText', data[0].serviceTypeName);
        }
      }
    });
    $('#serverList_AddServerPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "服务价格不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#serverList_AddServerLevel').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddServerListInfo_dialog = $('#div');
    showAddServerListInfo_dialog.dialog({
      title: '新增服务',
      width: 360,
      height: 300,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#serverList_AddServerName').textbox('isValid')) {
            $('#serverList_AddServerName').textbox('textbox').focus();
            return;
          }
          if (!$('#serverList_AddServerTypeName').combobox('isValid')) {
            $('#serverList_AddServerTypeName').combobox('textbox').focus();
            return;
          }
          if (!$('#serverList_AddServerPrice').numberbox('isValid')) {
            $('#serverList_AddServerPrice').numberbox('textbox').focus();
            return;
          }
          if (!$('#serverList_AddServerLevel').numberbox('isValid')) {
            $('#serverList_AddServerLevel').numberbox('textbox').focus();
            return;
          }

          if (clickFlag_serverList == false) {
            return;
          }
          clickFlag_serverList = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../Serviceitem/add',
            data: {
              serviceItemName: $('#serverList_AddServerName').textbox('getValue'),
              serviceTypeId: $('#serverList_AddServerTypeName').combobox('getValue'),
              price: ($('#serverList_AddServerPrice').numberbox('getValue') * 100).toFixed(0),
              sortCode: $('#serverList_AddServerLevel').numberbox('getValue'),
              remark: '',
            },
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！该服务名称已存在！', timeout: 2000, showType: 'slide' });
                return;
              }
              if (result > 0) {
                serverList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddServerListInfo_dialog.dialog('close');
                return;
              } else {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
                return;
              }
            })
            .always(function () {
              clickFlag_serverList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddServerListInfo_dialog.dialog('close');
        }
      }]
    })
  };
  serverList.init();
})(window.eapor);