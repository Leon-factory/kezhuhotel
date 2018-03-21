/**
 * @JSname:库管理
 */
~(function () {
  'use strict';
  const setWare = {
    clickFlag_setWarehouse: true,
    warehouseId: 0,
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      $('#inputwarehouseId').combobox({
        editable: false,
        url: '../warehouse/listWarehouse',
        queryParams: { warehouseId: 0, offset: 0, limit: 99999999 },
        valueField: 'warehouseId',
        textField: 'warehouseName',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onShowPanel: function () {
          $(this).combobox('reload');
        },
        loadFilter: function (result) {
          if (result != -3333 && result != -3335) {
            result.unshift({ warehouseId: 0, warehouseName: '全部' });
          }
          return result;
        }
      });
    },
    renderTable() {
      const this_ = this;
      let rowSelect_warehouseManage = null;
      let onlySelectedOneRowFlag = 0;
      $('#warehouseManage').datagrid({//------datagrid设置 start------
        title: '仓库列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,			//隔行变色特性 
        fitColumns: true, 		//防止水平滚动
        fit: false,
        scrollbarSize: 0, 		//去掉右侧滚动条列
        data: [],//firstloader,
        //idField : 'warehouseId',         //指明哪一个字段是标识字段
        collapsible: false,	//是否可折叠的 
        singleSelect: true,	//只能单选
        rownumbers: true,  //如果为true，则显示一个行号列.默认false
        checkOnSelect: false,
        loadMsg: 'loading...',
        onLoadSuccess: function () {
          //隐藏全选框
          $(this).parent().find('.datagrid-header-check').children('input')[0].style.visibility = 'hidden';
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
            rowSelect_warehouseManage = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_warehouseManage = null;
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

          if (rowData != rowSelect_warehouseManage) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_warehouseManage = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_warehouseManage = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        columns: [[  //-----columns start-----
          { field: 'ck', title: '', checkbox: true },
          { field: 'version', title: 'version', width: 20, align: 'center', hidden: true },
          { field: 'createUserId', title: '创建者编号', width: 20, align: 'center', hidden: true },
          { field: 'hotelId', title: '宾馆编号', width: 20, align: 'center', hidden: true },
          { field: 'isPrimary', title: '是否主客', width: 20, align: 'center', hidden: true },
          { field: 'modifyUserId', title: '修改者编号', width: 20, align: 'center', hidden: true },

          { field: 'warehouseId', title: '仓库编号', width: 20, align: 'center', hidden: true },
          { field: 'createUsername', title: '创建者', width: 20, align: 'center', hidden: true },
          { field: 'createTime', title: '创建时间', width: 30, align: 'center', hidden: true },
          { field: 'modifyTime', title: '修改时间', width: 30, align: 'center', hidden: true },
          { field: 'remark', title: '备注', width: 20, align: 'center', hidden: true },
          { field: 'warehouseName', title: '仓库名称', width: 20, align: 'center' },
          { field: 'sortCode', title: '优先级', width: 20, align: 'center' }
        ]],//-----columns end-----

        toolbar: [  //-----toolbar start-----
          {
            text: '新增',
            iconCls: 'icon-add',
            handler: () => {
             this.renderAdd();
            }
          },
          '-',
          {
            text: '编辑',
            iconCls: 'icon-edit',
            handler: () => {
              this.renderEdit();
            }
          },
          '-',
          {
            text: '删除',
            iconCls: 'icon-remove',
            handler: () => {
              this.renderRemove();
            }
          }]
      });
    },
    bind() {
      //搜索按钮
      $('#search_warehouse').click(() => {
        this.warehouseId = $('#inputwarehouseId').combobox('getValue');
        this.getList();
      });
    },
    getList(refresh) {
    	refresh ?
    	  eapor.utils.defaultAjax('../warehouse/listWarehouseCount', { warehouseId: this.warehouseId }, $.proxy(this.refreshCountCallBack, this))
    	  : eapor.utils.defaultAjax('../warehouse/listWarehouseCount', { warehouseId: this.warehouseId }, $.proxy(this.countCallBack, this))
    },
    refreshCountCallBack(result) {
      console.log(result);
	  if (eapor.utils.ajaxCallBackErrInfo(result)) {
	    return;
	  }
	 const pageWrapper = $('#page_warehouseManage');
	  $('#page_warehouseManage').pagination({
	    total: result
	  });
	  const pageSize = pageWrapper.pagination('options').pageSize;
	  const pageNumber = pageWrapper.pagination('options').pageNumber;
	  eapor.utils.defaultAjax(
		'../warehouse/listWarehouse',
		{
		  offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
		  limit: pageSize,
		  warehouseId: this.warehouseId
		},
		$.proxy(this.listCallBack, this)
	  );
    },
    countCallBack(result) {
      console.log(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      const _this = this;
      const page_div = $('#page_warehouseManage');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage(pageNumber, pageSize) {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax(
            '../warehouse/listWarehouse',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              warehouseId: _this.warehouseId
            },
            $.proxy(_this.listCallBack, _this)
          );
        }
      });
      eapor.utils.defaultAjax(
        '../warehouse/listWarehouse',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          warehouseId: this.warehouseId
        },
        $.proxy(this.listCallBack, this)
      );
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#warehouseManage').datagrid('loadData', result);
      }
    },
    renderAdd() {
      //显示添加界面
      $('#addWarehouse').append(`
        <div id="div" style="padding:20px 0 0 30px;">
          <div style="margin-bottom:10px;display:none;">
            <input id="remark_fm" type="text" style="width:200px;"
              label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
          </div>
          <div style="margin-bottom:10px">
            <input id="warehouseName_fm"  style="width:200px;"
              label="库名称：" labelPosition="before"  labelAlign="right" labelWidth="70"/>
          </div>
          <div style="margin-bottom:10px">
            <input id="sortCode_fm" style="width:200px;"
              label="优先级：" labelPosition="before" labelAlign="right" labelWidth="70"/>
          </div>
        </div>
      `);
      $('#warehouseName_fm').textbox({
        required: true,
        missingMessage: '库名称不能为空！',
        validType: ['maxLength[28]'],
        invalidMessage: '最大输入长度为28个字符',
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#sortCode_fm').numberbox({
        required: true,
        missingMessage: '优先级不能为空！',
        validType: ['maxLength[3]'],
        invalidMessage: '最大输入长度为3位数字',
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      const this_ = this;
      const div_dialog = $('#div');
      div_dialog.dialog({
        title: '新增仓库信息',
        width: 300,
        height: 180,
        closed: false,
        cache: false,
        modal: true, //定义是否将窗体显示为模式化窗口。
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            const that = this;
            this_.addSubmit(that);
          }
        }, {
          text: '取消',
          handler: () => {
            div_dialog.dialog('close');
          }
        }]
      });
    },
    addSubmit(that) {
      console.log(this);
      console.log(that);
      if (!$('#warehouseName_fm').textbox('isValid')) {
        $('#warehouseName_fm').textbox('textbox').focus();
        return;
      }
      if (!$('#sortCode_fm').numberbox('isValid')) {
        $('#sortCode_fm').numberbox('textbox').focus();
        return;
      }

      if (!this.clickFlag_setWarehouse) {
        return;
      }
      this.clickFlag_setWarehouse = false;
      $(that).addClass('l-btn-disabled');
      $.ajax({
        type: 'post',
        url: '../warehouse/AddWarehouse',
        data: {
          sortCode: $('#sortCode_fm').numberbox('getValue'),
          warehouseName: $('#warehouseName_fm').textbox('getValue'),
          remark: $('#remark_fm').val()
        },
        dataType: 'json'
      })
        .done((data) => {
          this.addCallback(data);
        })
        .always(() => {
          this.clickFlag_setWarehouse = true;
          $(that).removeClass('l-btn-disabled');
        });
    },
    addCallback(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      if (data === 0) {
        $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的库', timeout: 2000, showType: 'slide' });
        return;
      }
      if (data > 0) {
        $('#div').dialog('close');
        this.warehouseId = 0;
        this.getList(1);
        $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
    },
    renderEdit() {
      var rows = $('#warehouseManage').datagrid('getSelections'); //返回所有选中的行
      if (rows.length != 1) {//选中1行的话触发事件
        $.messager.show({ title: '系统提示', msg: '请选择要编辑的信息！', timeout: 2000, showType: 'slide' });
        return;
      }
      if (rows[0].isPrimary === 1) {
        $.messager.show({ title: '系统提示', msg: '基本库不可编辑！', timeout: 2000, showType: 'slide' });
        return;
      }

      //获得修改前的信息
      var warehouseId = rows[0].warehouseId;
      var warehouseName = rows[0].warehouseName;
      var sortCode = rows[0].sortCode;
      var remark = rows[0].remark;
      //选中要修改修改的行的索引   //返回指定行的索引号，该行的参数可以是一行记录或一个ID字段值
      var tableindex = $('#warehouseManage').datagrid('getRowIndex', rows[0]);
      //显示修改界面
      $('#updateWarehouse').append(`
        <div id="div" style="padding:20px 0 0 30px;">
          <div style="margin-bottom:10px;display:none;">
            <input id="warehouseId_update_fm" type="text" style="width:200px;"
              label="库id：" labelPosition="before" labelAlign="right" labelWidth="70"/>
          </div>
          <div style="margin-bottom:10px;display:none;">
            <input id="remark_update_fm" type="text" style="width:200px;"
              label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
          </div>
          <div style="margin-bottom:10px">
            <input id="warehouseName_update_fm"  style="width:200px;"
              label="库名称：" labelPosition="before"  labelAlign="right" labelWidth="70"/>
          </div>
          <div style="margin-bottom:10px">
            <input id="sortCode_update_fm" style="width:200px;"
              label="优先级：" labelPosition="before" labelAlign="right" labelWidth="70"/>
          </div>
        </div>
      `);

      $('#warehouseName_update_fm').textbox({
        required: true,
        missingMessage: '库名称不能为空！',
        validType: ['maxLength[28]'],
        invalidMessage: '最大输入长度为28个字符',
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });
      $('#sortCode_update_fm').numberbox({
        required: true,
        missingMessage: '优先级不能为空！',
        validType: ['maxLength[3]'],
        invalidMessage: '最大输入长度为3位数字',
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
      });

      $('#warehouseId_update_fm').val(warehouseId);
      $('#warehouseName_update_fm').textbox('setValue', warehouseName);
      $('#sortCode_update_fm').numberbox('setValue', sortCode);
      $('#remark_update_fm').val(remark);

      const this_edit = this;

      let editWarehouse_dialog = $('#div');
      editWarehouse_dialog.dialog({
        title: '编辑仓库信息',
        width: 300,
        height: 180,
        closed: false,
        cache: false,
        modal: true,
        onClose: function () {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler: function () {
            const that = this;
            this_edit.editSubmit(that);
          }
        }, {
          text: '取消',
          handler: function () {
            editWarehouse_dialog.dialog('close')
          }
        }]
      });
    },
    editSubmit(that) {
      console.log(this)
      console.log(that)
      if (!$('#warehouseName_update_fm').textbox('isValid')) {
        $('#warehouseName_update_fm').textbox('textbox').focus();
        return;
      }
      if (!$('#sortCode_update_fm').numberbox('isValid')) {
        $('#sortCode_update_fm').numberbox('textbox').focus();
        return;
      }

      if (!this.clickFlag_setWarehouse) {
        return;
      }
      this.clickFlag_setWarehouse = false;
      $(that).addClass('l-btn-disabled');
      $.ajax({
        type: 'post',
        url: '../warehouse/EditWarehouse',
        data: {
          remark: $('#remark_update_fm').val(),
          sortCode: $('#sortCode_update_fm').numberbox('getValue'),
          warehouseId: $('#warehouseId_update_fm').val(),
          warehouseName: $('#warehouseName_update_fm').textbox('getValue')
        },
        dataType: 'json'
      })
        .done((data) => {
          this.editCallback(data);
        })
        .always(() => {
          this.clickFlag_setWarehouse = true;
          $(that).removeClass('l-btn-disabled');
        });
    },
    editCallback(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      if (data === 0) {
        $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的库', timeout: 2000, showType: 'slide' });
        return;
      }
      if (data > 0) {
        $('#div').dialog('close');
        this.getList(1);
        $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
        return;
      }
      $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });
    },
    renderRemove() {
      var rows = $('#warehouseManage').datagrid('getSelected');
      if (!rows) {
        $.messager.show({ title: '系统提示', msg: '请选择要删除的数据！', timeout: 2000, showType: 'slide' });
        return;
      }
      if (rows.isPrimary === 1) {
        $.messager.show({ title: '系统提示', msg: '基本库不可删除！', timeout: 2000, showType: 'slide' });
        return;
      }
     
      $.messager.confirm('系统提示', '您确定要删除该仓库信息吗？',
        (res) => {
          if (res) {
            console.info(rows);
            if (rows.isPrimary == 1) {
              $.messager.show({ title: '系统提示', msg: '删除失败！该库为基本库不可删除！', timeout: 2000, showType: 'slide' });
              return;
            }
            this.removeSubmit(rows.warehouseId, $('#warehouseManage').datagrid('getRowIndex', rows));
          }
        });
    },
    removeSubmit(warehouseId, tableindex) {
      console.log(this)
      $.post(
        '../warehouse/DelWarehouse',
        { warehouseId: warehouseId },
        (data) => {
          if (eapor.utils.ajaxCallBackErrInfo(data)) {
            return;
          }
          if (data > 0) {
            this.warehouseId = 0;
            this.getList(1);
            $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000, showType: 'slide' });
            return;
          }
          $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000, showType: 'slide' });
        }
      );
    }
  };
  setWare.init();
})();