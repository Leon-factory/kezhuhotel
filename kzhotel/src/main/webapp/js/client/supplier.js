/**
 * @JSname:供应商管理
 */
~(function () {
  "use strict";

  let clickFlag_supplier = true;
  const supplier = {
    search_supplierName: '',
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      console.count();
      //搜索供应商 combobox
      $('#select_supplier').combobox({
        valueField: 'supplierName',
        textField: 'supplierName',
        url: '../warehouse/listSupplierPage',
        queryParams: { supplierName: '', offset: 0, limit: 9999999 },
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onShowPanel() {
          $(this).combobox('reload');
        },
        loadFilter: (result) => {
          console.info('loadFilter')
          if (result.length > 0 && result[0].supplierName !== "全部") {
            result.unshift({ supplierName: "全部" });
          }
          return result;
        }
      });
    },
    renderTable() {
      let
        rowSelect_supplier = null,
        onlySelectedOneRowFlag = 0;
      $('#tab_supplier').datagrid({
        title: '供应商列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        striped: true,//隔行变色
        loadMsg: "loading....",
        singleSelect: true,
        fit: false,
        rownumbers: true,
        data: [],//loader:firstloader_supplier,
        checkOnSelect: false,
        onLoadSuccess: function (data) {
          if (!data.rows.length) {
            eapor.utils.messagerInfoBySearchEmpty('tab_supplier', 'supplierName', 9, 0);
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
            rowSelect_supplier = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_supplier = null;
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

          if (rowData != rowSelect_supplier) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_supplier = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_supplier = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        toolbar: [{
          text: '新增',
          iconCls: 'icon-add',
          handler: function () {
            add_btn_supplier();
          }
        }, '-', {
          text: '编辑',
          iconCls: 'icon-edit',
          handler: function () {
            var getSelected = $('#tab_supplier').datagrid('getSelected');
            if (!getSelected || getSelected.supplierName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要编辑的供应商信息！', timeout: 2000, showType: 'slide' });
              return;
            } else {
              editSupplier(JSON.stringify(getSelected));
            }
          }
        }, '-', {
          text: '删除',
          iconCls: 'icon-remove',
          handler: function () {
            var getSelected = $('#tab_supplier').datagrid('getSelected');
            if (!getSelected || getSelected.supplierName == '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
              $.messager.show({ title: '系统提示', msg: '请先选择要删除的供应商信息！', timeout: 2000, showType: 'slide' });
              return;
            } else {
              deleteSupplier(JSON.stringify(getSelected));
            }
          }
        }],
        columns: [[
          { field: 'ck', title: '', checkbox: true },
          { field: 'createTime', title: '创建时间', width: 20, align: 'center', hidden: true },
          { field: 'createUserId', title: '创建用户Id', width: 20, align: 'center', hidden: true },
          { field: 'createUsername', title: '创建人', width: 20, align: 'center', hidden: true },
          { field: 'hotelId', title: '宾馆Id', width: 20, align: 'center', hidden: true },
          { field: 'modifyUserId', title: '修改者ID', width: 20, align: 'center', hidden: true },
          { field: 'sortCode', title: 'sortCode', width: 20, align: 'center', hidden: true },
          { field: 'supplierId', title: 'supplierId', width: 20, align: 'center', hidden: true },
          { field: 'modifyTime', title: '修改时间', width: 20, align: 'center', hidden: true },
          { field: 'modifyUsername', title: '修改者', width: 20, align: 'center', hidden: true },
          { field: 'version', title: '版本', width: 20, align: 'center', hidden: true },

          { field: 'supplierName', title: '供应商名称', width: 20, align: 'center' },
          { field: 'contact', title: '联系人', width: 20, align: 'center' },
          { field: 'telephone', title: '联系电话', width: 18, align: 'center' },
          { field: 'mobile', title: '联系手机', width: 20, align: 'center' },
          { field: 'address', title: '快递地址', width: 20, align: 'center' },
          { field: 'bank', title: '开户行', width: 20, align: 'center' },
          { field: 'accountName', title: '银行名称', width: 20, align: 'center' },
          { field: 'accountNo', title: '银行账号', width: 30, align: 'center' },
          { field: 'remark', title: '备注', width: 20, align: 'center' }
        ]]
      });
    },
    bind() {
      //搜索
      $('#search_btn_supplier').click(() => {
        this.search_supplierName = $('#select_supplier').combobox('getValue') === '全部'
          ? '' : $('#select_supplier').combobox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../warehouse/getSupplierCount',
        {
          supplierName: this.search_supplierName,
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_supplier').pagination({
        total: result
      });
      const pageSize = $('#page_supplier').pagination('options').pageSize;
      const pageNumber = $('#page_supplier').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../warehouse/listSupplierPage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          supplierName: this.search_supplierName,
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#tab_supplier').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../warehouse/getSupplierCount',
        {
          supplierName: this.search_supplierName,
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) { return; }

      const page_div = $('#page_supplier');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../warehouse/listSupplierPage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              supplierName: this.search_supplierName,
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../warehouse/listSupplierPage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          supplierName: this.search_supplierName,
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#tab_supplier').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#tab_supplier').datagrid('loadData', result);
      }
    },

  };

  //新增
  function add_btn_supplier() {
    $('#addDialog_supplier').append(
      '<div id="div" style="padding-top:20px;padding-left:70px;">' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_supplierName_supplier" label="<span style=\'color:red;font-size:16px;\'>*</span>供应商名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_contact_supplier" label="联系人：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_telephone_supplier" label="联系电话：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//numberbox
      '<input id="add_mobile_supplier" label="联系手机：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_address_supplier" label="地址：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_bank_supplier" label="开户银行：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_accountName_supplier" label="账户名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_accountNo_supplier" label="帐号：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//numberbox
      '<input id="add_sortCode_supplier" label="排序：" value="100" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="add_remark_supplier" label="备注：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '</div>'
    );

    $('#add_supplierName_supplier').textbox({
      required: true,
      missingMessage: "供应商名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_contact_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_telephone_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_mobile_supplier').numberbox({
      validType: ['mobilephone', 'maxLength[28]'],
      invalidMessage: "手机格式不正确",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_address_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_bank_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_accountName_supplier').textbox({
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_accountNo_supplier').textbox({
      validType: ['number', 'maxLength[32]'],
      invalidMessage: "请输入数字，最多32位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_sortCode_supplier').numberbox({
      validType: ['number', 'maxLength[11]'],
      invalidMessage: "请输入数字，最多11位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#add_remark_supplier').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#div').dialog({
      title: '新增供应商信息',
      width: 400,
      height: 480,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          var add_supplierName = $('#add_supplierName_supplier').textbox('getValue');
          if (!$('#add_supplierName_supplier').textbox('isValid')) {
            $('#add_supplierName_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_contact_supplier').textbox('isValid')) {
            $('#add_contact_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_telephone_supplier').textbox('isValid')) {
            $('#add_telephone_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_mobile_supplier').numberbox('isValid')) {
            $('#add_mobile_supplier').numberbox('textbox').focus();
            return;
          }
          if (!$('#add_address_supplier').textbox('isValid')) {
            $('#add_address_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_bank_supplier').textbox('isValid')) {
            $('#add_bank_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_accountName_supplier').textbox('isValid')) {
            $('#add_accountName_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_accountNo_supplier').textbox('isValid')) {
            $('#add_accountNo_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_remark_supplier').textbox('isValid')) {
            $('#add_remark_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#add_sortCode_supplier').numberbox('isValid')) {
            $('#edit_sortCode_supplier').numberbox('textbox').focus();
            return;
          }

          if (clickFlag_supplier == false) {
            return;
          }
          clickFlag_supplier = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../warehouse/addSupplier',
            data: {
              supplierName: add_supplierName,
              contact: $('#add_contact_supplier').textbox('getValue'),
              telephone: $('#add_telephone_supplier').textbox('getValue'),
              mobile: $('#add_mobile_supplier').numberbox('getValue'),
              address: $('#add_address_supplier').textbox('getValue'),
              bank: $('#add_bank_supplier').textbox('getValue'),
              accountName: $('#add_accountName_supplier').textbox('getValue'),
              accountNo: $('#add_accountNo_supplier').textbox('getValue'),
              remark: $('#add_remark_supplier').textbox('getValue'),
              sortCode: $('#add_sortCode_supplier').numberbox('getValue'),
            },
            dataType: 'json'
          })
            .done(function (result) {
              console.info(result);
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的供应商！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                supplier.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000 });
                $('#div').dialog('close');
                return;
              } else {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000 });
                return;
              }
            })
            .always(function () {
              clickFlag_supplier = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  };

  //编辑
  function editSupplier(row) {
    $('#editDialog_supplier').append(
      '<div id="div" style="padding-top:20px;padding-left:70px;">' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_supplierName_supplier" label="<span style=\'color:red;font-size:16px;\'>*</span>供应商名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_contact_supplier" label="联系人：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_telephone_supplier" label="联系电话：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//numberbox
      '<input id="edit_mobile_supplier" label="联系手机：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_address_supplier" label="地址：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_bank_supplier" label="开户银行：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_accountName_supplier" label="账户名称：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_accountNo_supplier" label="帐号：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//numberbox
      '<input id="edit_sortCode_supplier" label="排序：" value="100" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '<div style="margin-bottom:10px">' +//textbox
      '<input id="edit_remark_supplier" label="备注：" labelAlign="right" labelWidth="90px;" labelPosition="before" ' +
      'style="width:240px;">' +
      '</div>' +
      '</div>'
    );

    $('#edit_supplierName_supplier').textbox({
      required: true,
      missingMessage: "供应商名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_contact_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_telephone_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_mobile_supplier').numberbox({
      validType: ['mobilephone', 'maxLength[28]'],
      invalidMessage: "手机格式不正确",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_address_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_bank_supplier').textbox({
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_accountName_supplier').textbox({
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_accountNo_supplier').textbox({
      validType: ['number', 'maxLength[32]'],
      invalidMessage: "请输入数字，最多32位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_sortCode_supplier').numberbox({
      validType: ['number', 'maxLength[11]'],
      invalidMessage: "最大输入长度为11位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#edit_remark_supplier').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    var row = JSON.parse(row);
    $('#edit_supplierName_supplier').textbox('setValue', row.supplierName);
    $('#edit_contact_supplier').textbox('setValue', row.contact);
    $('#edit_telephone_supplier').textbox('setValue', row.telephone);
    $('#edit_mobile_supplier').numberbox('setValue', row.mobile);
    $('#edit_address_supplier').textbox('setValue', row.address);
    $('#edit_bank_supplier').textbox('setValue', row.bank);
    $('#edit_accountName_supplier').textbox('setValue', row.accountName);
    $('#edit_accountNo_supplier').textbox('setValue', row.accountNo);
    $('#edit_remark_supplier').textbox('setValue', row.remark);
    $('#edit_sortCode_supplier').numberbox('setValue', row.sortCode);

    $('#div').dialog({
      title: '编辑供应商信息',
      width: 400,
      height: 480,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确认',
        handler: function () {
          if (!$('#edit_supplierName_supplier').textbox('isValid')) {
            $('#edit_supplierName_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_contact_supplier').textbox('isValid')) {
            $('#edit_contact_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_telephone_supplier').textbox('isValid')) {
            $('#edit_telephone_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_mobile_supplier').numberbox('isValid')) {
            $('#edit_mobile_supplier').numberbox('textbox').focus();
            return;
          }
          if (!$('#edit_address_supplier').textbox('isValid')) {
            $('#edit_address_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_bank_supplier').textbox('isValid')) {
            $('#edit_bank_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_accountName_supplier').textbox('isValid')) {
            $('#edit_accountName_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_accountNo_supplier').textbox('isValid')) {
            $('#edit_accountNo_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_remark_supplier').textbox('isValid')) {
            $('#edit_remark_supplier').textbox('textbox').focus();
            return;
          }
          if (!$('#edit_sortCode_supplier').numberbox('isValid')) {
            $('#edit_sortCode_supplier').numberbox('textbox').focus();
            return;
          }
          var edit_supplierName = $('#edit_supplierName_supplier').textbox('getValue');
          var data = {};
          data.supplierName = edit_supplierName;
          data.contact = $('#edit_contact_supplier').textbox('getValue');
          data.telephone = $('#edit_telephone_supplier').textbox('getValue');
          data.mobile = $('#edit_mobile_supplier').numberbox('getValue');
          data.address = $('#edit_address_supplier').textbox('getValue');
          data.bank = $('#edit_bank_supplier').textbox('getValue');
          data.accountName = $('#edit_accountName_supplier').textbox('getValue');
          data.accountNo = $('#edit_accountNo_supplier').textbox('getValue');
          data.remark = $('#edit_remark_supplier').textbox('getValue');
          data.sortCode = $('#edit_sortCode_supplier').numberbox('getValue');
          data.supplierId = row.supplierId;

          if (clickFlag_supplier == false) {
            return;
          }
          clickFlag_supplier = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../warehouse/editSupplier',
            data: data,
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名的供应商！', timeout: 2000 });
                return;
              }
              if (result > 0) {
                supplier.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000 });
                $('#div').dialog('close');
                return;
              }
              if (result < 0) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000 });
                return;
              }
            })
            .always(function () {
              clickFlag_supplier = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          $('#div').dialog('close');
        }
      }]
    });
  };

  //删除
  function deleteSupplier(row) {
    row = JSON.parse(row);
    console.info(row);
    $.messager.confirm('系统提示', '您确认要删除该供应商信息吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../warehouse/delSupplierById',
          data: { supplierId: row.supplierId },
          dataType: 'json'
        })
          .done(function (result) {
            console.info(result);
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            if (result > 0) {
              supplier.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2800 });
            } else {
              $.messager.show({ title: '系统提示', msg: '删除失败！库存里还存在该供应商供应的商品！', timeout: 2800, height: 'auto' });
              return;
            }
          });
      }
    });
  };
  supplier.init();
})();