/**
 * @JSname:商品管理
 */
~(function (eapor) {
  "use strict";
  let clickFlag_goodsList = true;
  const goodsList = {
    search_goodsName: '',
    search_goodsCategoryId: 0,
    isFirstLoad_type: true,
    isFirstLoad_name: true,
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      //商品类别
      $('#gl_goodsCategoryNameSelect').combobox({
				/*url:'../Goodscategory/listGoodscategoryPage',
				queryParams:{limit:9999,offset:0,goodsCategoryName:''},*/
        data: eapor.hotel.getGoodsCategoryName,
        valueField: 'goodsCategoryId',
        textField: 'goodsCategoryName',
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onShowPanel() {
          $(this).combobox('loadData', eapor.hotel.getGoodsCategoryName);
        },
        loadFilter: (result) => {
          if (result.length > 0 && this.isFirstLoad_type && result[0].goodsCategoryName !== "全部") {
            result.unshift({ goodsCategoryId: 0, goodsCategoryName: "全部" });
            this.isFirstLoad_type = false;
          }
          return result;
        }
      });
      $('#gl_goodsNameSelect').combobox({
        data: eapor.hotel.goodsListName,
        valueField: 'goodsItemCode',
        textField: 'goodsItemCode',
        panelHeight: 'auto',
        panelMaxHeight: 200,
        onShowPanel() {
          const value = $(this).combobox('getValue');
          const text = $(this).combobox('getText');
          $(this).combobox('loadData', eapor.hotel.goodsListName);
          $(this).combobox('setValue', value);
          $(this).combobox('setText', text);
        },
        loadFilter: (result) => {
          if (result.length > 0 && this.isFirstLoad_name && result[0].goodsItemCode !== "全部") {
            console.info('全部')
            result.unshift({ goodsItemCode: "全部", "selected": true });
            this.isFirstLoad_name = false;
          }
          return result;
        }
      });
    },
    renderTable() {
      let
        rowSelect_goodsList = null,
        onlySelectedOneRowFlag = 0;
      $('#goodsListTable').datagrid({
        title: '商品列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//loader:firstloader_goodsList,
        fitColumns: true, 		//防止水平滚动
        scrollbarSize: 0, 		//去掉右侧滚动条列
        collapsible: false,	//是否可折叠的 
        loadMsg: "loading....",
        singleSelect: true,
        fit: false,
        rownumbers: true,
        checkOnSelect: false,
        onLoadSuccess(data) {
          if (!data.rows.length) {
            eapor.utils.messagerInfoBySearchEmpty('goodsListTable', 'goodsCategoryName', 7, 0);
            $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
          }
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
        },
        onClickRow(rowIndex, rowData) {
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
            rowSelect_goodsList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_goodsList = null;
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

          if (rowData != rowSelect_goodsList) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_goodsList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_goodsList = null;
          }
          onlySelectedOneRowFlag = 0;
        },
        toolbar: [{
          text: '新增',
          iconCls: 'icon-add',
          handler: function () {
            gl_addNewGoods();
          }
        }, '-', {
          text: '编辑',
          iconCls: 'icon-edit',
          handler: function () {
            gl_editGoods();
          }
        }, '-', {
          text: '删除',
          iconCls: 'icon-remove',
          handler: function () {
            gl_delGoods();
          }
        }],
        columns: [[  //-----columns start-----
          { field: 'ck', title: '12', checkbox: true },
          { field: 'goodsCategoryName', title: "商品类别", align: 'center', width: 20 },
          { field: 'goodsItemCode', title: "商品名称", align: 'center', width: 30 },
          { field: 'unitName', title: "单位", align: 'center', width: 20 },
          { field: 'sortCode', title: "优先级", align: 'center', width: 20 },
          {
            field: 'salePrice', title: "销售单价", align: 'center', width: 20,
            formatter: function (value) {
              return value ? NP.divide(value, 100) : (value === 0 ? 0 : '');
            }
          },
          { field: 'alertNumber', title: "警示数量", align: 'center', width: 20 },
          {
            field: 'saleState', title: "经营状态", align: 'center', width: 20,
            formatter: function (value) {
              return value === 1 ? '正常' : '冻结';
            }
          },

          { field: 'adjustable', title: "adjustable", align: 'center', width: 20, hidden: true },
          { field: 'createTime', title: "createTime", align: 'center', width: 20, hidden: true },
          { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
          { field: 'createUsername', title: "createUsername", align: 'center', width: 20, hidden: true },
          { field: 'goodsCategoryId', title: "goodsCategoryId", align: 'center', width: 20, hidden: true },
          { field: 'goodsId', title: "goodsId", align: 'center', width: 20, hidden: true },
          { field: 'hotelId', title: "宾馆Id", align: 'center', width: 20, hidden: true },
          { field: 'modifyUserId', title: "modifyUserId", align: 'center', width: 20, hidden: true },
          { field: 'photo', title: "photo", align: 'center', width: 20, hidden: true },
          { field: 'remark', title: "备注", align: 'center', width: 20, hidden: true },
          { field: 'version', title: "version", align: 'center', width: 20, hidden: true },
          { field: 'modifyUsername', title: "modifyUsername", align: 'center', width: 20, hidden: true },
          { field: 'latestPurchasePrice', title: "最新进价", align: 'center', width: 20, hidden: true },
          { field: 'modifyTime', title: "modifyTime", align: 'center', width: 20, hidden: true }
        ]]
      });
    },
    bind() {
      $('#gl_searchGoods').click(() => {
        this.search_goodsName = $('#gl_goodsNameSelect').combobox('getText') === '全部'
          ? '' : $('#gl_goodsNameSelect').combobox('getText');
        this.search_goodsCategoryId = $('#gl_goodsCategoryNameSelect').combobox('getValue') === "全部" ||
          $('#gl_goodsCategoryNameSelect').combobox('getValue') === ''
          ? 0 : $('#gl_goodsCategoryNameSelect').combobox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../Goods/getGoodsCount',
        {
          goodsName: this.search_goodsName,
          goodsCategoryId: this.search_goodsCategoryId,
          saleState: 0
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_goodsList').pagination({
        total: result
      });
      const pageSize = $('#page_goodsList').pagination('options').pageSize;
      const pageNumber = $('#page_goodsList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../Goods/listGoodsPage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          goodsName: this.search_goodsName,
          goodsCategoryId: this.search_goodsCategoryId,
          saleState: 0
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#goodsListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../Goods/getGoodsCount',
        {
          goodsName: this.search_goodsName,
          goodsCategoryId: this.search_goodsCategoryId,
          saleState: 0
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_goodsList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../Goods/listGoodsPage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              goodsName: this.search_goodsName,
              goodsCategoryId: this.search_goodsCategoryId,
              saleState: 0
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../Goods/listGoodsPage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          goodsName: this.search_goodsName,
          goodsCategoryId: this.search_goodsCategoryId,
          saleState: 0
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //			this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //			this.maxId = result.maxId;
        $('#goodsListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#goodsListTable').datagrid('loadData', result);
      }
    },
  };

  //编辑按钮
  function gl_editGoods() {
    var selected = $('#goodsListTable').datagrid('getSelected');
    if (selected != null && selected.goodsCategoryName != '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      editGoodsList(selected);
    } else {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的商品！', timeout: 2000, showType: 'slide' });
      return;
    }
  };

  function editGoodsList(row) {
    $('#showEditGoodsListInfo').append(`
				<div id="div" style="padding:30px;">
					<div style="margin-bottom:20px">
						<input id="goodsList_editGoodsCategoryId" label="<span style='color:red;'>*</span>商品类别：" labelAlign="right" labelPosition="before" style="width:270px;" labelWidth="140" />
					</div>
					<div style="margin-bottom:20px">
						<input id="goodsList_editGoodsItemCode"  label="<span style='color:red;'>*</span>商品名称：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="goodsList_editUnitName" label="<span style='color:red;'>*</span>单位：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="goodsList_editSortCode" value="100"  label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="goodsList_editPrice"  label="<span style='color:red;'>*</span>销售单价：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="goodsList_editAlertNumber" value="0"  label="<span style='color:red;'>*</span>警示数量(0为不警示)：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
					</div>
					<div>
						<input id="goodsList_editSaleState"  label="经营状态：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;">
					</div>
				</div>
		`);
    $('#goodsList_editGoodsItemCode').textbox({
      required: true,
      missingMessage: "商品名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_editGoodsCategoryId').combobox({
      /* url:'../Goodscategory/listGoodscategoryPage',
       queryParams:{limit:9999,offset:0,goodsCategoryName:''},*/
      data: eapor.hotel.getGoodsCategoryName,
      valueField: 'goodsCategoryId',
      textField: 'goodsCategoryName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "商品类别名称不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      onShowPanel: function () {
        $(this).combobox('loadData', eapor.hotel.getGoodsCategoryName);
      },
      loadFilter: function (result) {
        console.info(result);
        if (result[0].goodsCategoryName == "全部") {
          result.splice(0, 1);
        }
        console.info(result);
        return result;
      }
    });
    $('#goodsList_editUnitName').textbox({
      required: true,
      missingMessage: "商品单位不能为空！",
      validType: ['maxLength[5]'],
      invalidMessage: "最大输入长度为5个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_editPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "商品单价不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_editSortCode').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_editAlertNumber').numberbox({
      required: true,
      missingMessage: "警示数量不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_editSaleState').combobox({
      data: [{ 'id': 1, 'text': '正常', 'selected': true }, { 'id': 2, 'text': '冻结' }],
      panelHeight: 'auto',
      valueField: 'id',
      textField: 'text',
      editable: false
    });
    //已选择-->取到要修改的数据到弹框上
    $('#goodsList_editGoodsItemCode').textbox('setValue', row.goodsItemCode);
    $('#goodsList_editGoodsCategoryId').combobox('setValue', row.goodsCategoryId);
    $('#goodsList_editUnitName').textbox('setValue', row.unitName);
    $('#goodsList_editPrice').numberbox('setValue', NP.divide(row.salePrice, 100));
    $('#goodsList_editSortCode').numberbox('setValue', row.sortCode);
    $('#goodsList_editAlertNumber').numberbox('setValue', row.alertNumber);
    $('#goodsList_editSaleState').combobox('setValue', row.saleState);

    let showEditGoodsListInfo_dialog = $('#div');
    showEditGoodsListInfo_dialog.dialog({
      title: '编辑',
      width: 380,
      height: 450,
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
            if (!$('#goodsList_editGoodsItemCode').textbox('isValid')) {
              $('#goodsList_editGoodsItemCode').textbox('textbox').focus();
              return;
            }
            if (!$('#goodsList_editGoodsCategoryId').combobox('isValid')) {
              $('#goodsList_editGoodsCategoryId').combobox('textbox').focus();
              return;
            }
            if (!$('#goodsList_editUnitName').textbox('isValid')) {
              $('#goodsList_editUnitName').textbox('textbox').focus();
              return;
            }
            if (!$('#goodsList_editPrice').numberbox('isValid')) {
              $('#goodsList_editPrice').numberbox('textbox').focus();
              return;
            }
            if (!$('#goodsList_editSortCode').numberbox('isValid')) {
              $('#goodsList_editSortCode').numberbox('textbox').focus();
              return;
            }
            if (!$('#goodsList_editAlertNumber').numberbox('isValid')) {
              $('#goodsList_editAlertNumber').numberbox('textbox').focus();
              return;
            }

            if (clickFlag_goodsList == false) {
              return;
            }
            clickFlag_goodsList = false;
            var that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../Goods/edit',
              data: {
                goodsItemCode: $('#goodsList_editGoodsItemCode').textbox('getValue'),
                goodsCategoryId: Number($('#goodsList_editGoodsCategoryId').combobox('getValue')),
                unitName: $('#goodsList_editUnitName').textbox('getValue'),
                price: Number($('#goodsList_editPrice').numberbox('getValue') * 100).toFixed(0),
                alertNumber: Number($('#goodsList_editAlertNumber').numberbox('getValue')),
                saleState: Number($('#goodsList_editSaleState').combobox('getValue')),

                sortCode: Number($('#goodsList_editSortCode').numberbox('getValue')),
                remark: "",
                photo: "",
                goodsId: row.goodsId,
              },
              dataType: "json"
            })
              .done(function (data) {
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                if (data === 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名商品！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data === 1) {
                  goodsList.getRefreshList();
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
                  showEditGoodsListInfo_dialog.dialog('close');
                  $.ajax({
                    type: 'post',
                    url: '../Goods/listGoodsPage',
                    data: {
                      offset: 0,
                      limit: 9999999,
                      goodsName: "",
                      goodsCategoryId: 0,
                      saleState: 0//经营状态   1上架 2下架  0全部
                    },
                    dataType: "json"
                  })
                    .done(function (result) {
                      eapor.hotel.goodsListName = result;

                    })
                  return;
                } else {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });
                  return;
                }
              })
              .always(function () {
                clickFlag_goodsList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditGoodsListInfo_dialog.dialog('close');
          }
        }]
    })
  };
  //删除按钮
  function gl_delGoods() {
    var selected = $('#goodsListTable').datagrid('getSelected');
    var index = $('#goodsListTable').datagrid('getRowIndex', selected);
    if (selected != null && selected.goodsCategoryName != '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      deleteGoodsList(selected, index);
    } else {
      $.messager.show({ title: '系统提示', msg: '请先选择要删除的商品！', timeout: 2000, showType: 'slide' });
      return;
    }
  };
  //删除
  function deleteGoodsList(row, index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../Goods/del',
          data: { goodsId: row.goodsId },
          success: function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            if (result > 0) {
              goodsList.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000, showType: 'slide' });
              $.ajax({
                type: 'post',
                url: '../Goods/listGoodsPage',
                data: {
                  offset: 0,
                  limit: 9999999,
                  goodsName: "",
                  goodsCategoryId: 0,
                  saleState: 0//经营状态   1上架 2下架  0全部
                },
                dataType: "json",
                success: function (result) {
                  eapor.hotel.goodsListName = result;
                }
              });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000, showType: 'slide' });
          }
        })
      }
    });
  };
  //新增
  function gl_addNewGoods() {
    $('#showAddGoodsListInfo').append(`
		   <div id="div" style="padding:30px;">
				<div style="margin-bottom:20px">
					<input id="goodsList_AddGoodsCategoryId" label="<span style='color:red;'>*</span>商品类别：" labelAlign="right" labelPosition="before" style="width:270px;" labelWidth="140" />
				</div>
				<div style="margin-bottom:20px">
					<input id="goodsList_AddGoodsItemCode"  label="<span style='color:red;'>*</span>商品名称：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="goodsList_AddUnitName" label="<span style='color:red;'>*</span>单位：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="goodsList_AddSortCode" value="100"  label="<span style='color:red;'>*</span>优先级：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
				</div>
				<div style="margin-bottom:20px">
					<input id="goodsList_AddPrice"  label="<span style='color:red;'>*</span>销售单价：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
				</div>
				<div>
					<input id="goodsList_AddAlertNumber" value="0"  label="<span style='color:red;'>*</span>警示数量(0为不警示)：" labelAlign="right" labelPosition="before" labelWidth="140" style="width:270px;"/>
				</div>
		   </div>
		`)
    $('#goodsList_AddGoodsItemCode').textbox({
      required: true,
      missingMessage: "商品名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_AddGoodsCategoryId').combobox({
      /*url:'../Goodscategory/listGoodscategoryPage',
      queryParams:{limit:9999,offset:0,goodsCategoryName:''},*/
      data: eapor.hotel.getGoodsCategoryName,
      valueField: 'goodsCategoryId',
      textField: 'goodsCategoryName',
      panelHeight: 'auto',
      panelMaxHeight: 200,
      editable: false,
      required: true,
      missingMessage: "商品类别名称不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true, //为true时在该组件失去焦点的时候进行验证
      onShowPanel: function () {
        $(this).combobox('loadData', eapor.hotel.getGoodsCategoryName);
      },
      loadFilter: function (result) {
        if (result.length > 0) {
          if (result[0].goodsCategoryName == "全部") {
            result.splice(0, 1);
          }
        }
        return result;
      },
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].goodsCategoryId);
          $(this).combobox('setText', data[0].goodsCategoryName);
        }
      }
    });
    $('#goodsList_AddUnitName').textbox({
      required: true,
      missingMessage: "商品单位不能为空！",
      validType: ['maxLength[5]'],
      invalidMessage: "最大输入长度为5个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_AddPrice').numberbox({
      required: true,
      precision: 2,
      missingMessage: "商品单价不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_AddSortCode').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsList_AddAlertNumber').numberbox({
      required: true,
      missingMessage: "警示数量不能为空！",
      validType: ['maxLength[10]'],
      invalidMessage: "最大输入长度为10位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddGoodsListInfo_dialog = $('#div');
    showAddGoodsListInfo_dialog.dialog({
      title: '新增商品',
      width: 380,
      height: 400,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#goodsList_AddGoodsItemCode').textbox('isValid')) {
            $('#goodsList_AddGoodsItemCode').textbox('textbox').focus();
            return;
          }
          if (!$('#goodsList_AddGoodsCategoryId').combobox('isValid')) {
            $('#goodsList_AddGoodsCategoryId').combobox('textbox').focus();
            return;
          }
          if (!$('#goodsList_AddUnitName').textbox('isValid')) {
            $('#goodsList_AddUnitName').textbox('textbox').focus();
            return;
          }
          if (!$('#goodsList_AddPrice').numberbox('isValid')) {
            $('#goodsList_AddPrice').numberbox('textbox').focus();
            return;
          }
          if (!$('#goodsList_AddSortCode').numberbox('isValid')) {
            $('#goodsList_AddSortCode').numberbox('textbox').focus();
            return;
          }
          if (!$('#goodsList_AddAlertNumber').numberbox('isValid')) {
            $('#goodsList_AddAlertNumber').numberbox('textbox').focus();
            return;
          }

          if (clickFlag_goodsList == false) {
            return;
          }
          clickFlag_goodsList = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../Goods/add',
            data: {
              goodsItemCode: $('#goodsList_AddGoodsItemCode').textbox('getValue'),
              goodsCategoryId: Number($('#goodsList_AddGoodsCategoryId').combobox('getValue')),
              unitName: $('#goodsList_AddUnitName').textbox('getValue'),
              price: Number($('#goodsList_AddPrice').numberbox('getValue') * 100).toFixed(0),
              alertNumber: Number($('#goodsList_AddAlertNumber').numberbox('getValue')),
              saleState: 1,

              sortCode: Number($('#goodsList_AddSortCode').numberbox('getValue')),
              remark: "",
              photo: "",
            },
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名商品！', timeout: 2000, showType: 'slide' });
                return;
              }
              if (result > 0) {
                goodsList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddGoodsListInfo_dialog.dialog('close');
                $.ajax({
                  type: 'post',
                  url: '../Goods/listGoodsPage',
                  data: {
                    offset: 0,
                    limit: 9999999,
                    goodsName: "",
                    goodsCategoryId: 0,
                    saleState: 0//经营状态   1上架 2下架  0全部
                  },
                  dataType: "json",
                  success: function (result) {
                    eapor.hotel.goodsListName = result;
                  }
                });
                return;
              } else {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
                return;
              }
            })
            .always(function () {
              clickFlag_goodsList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddGoodsListInfo_dialog.dialog('close');
        }
      }]
    })
  };
  goodsList.init();
})(window.eapor);