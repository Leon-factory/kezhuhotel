/**
 * @JSname:商品类别管理
 */
~(function (eapor) {
  "use strict";
  let clickFlag_goodsTypeList = true;
  const goodsTypeList = {
    search_goodsCategoryName: '',
    init() {
      this.render();
      this.renderTable();
      this.getList();
    },
    render() {

    },
    renderTable() {
      let
        rowSelect_goodsTypeList = null,
        onlySelectedOneRowFlag = 0;
      $('#goodsTypeListTable').datagrid({
        title: '商品类别列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//loader:firstloader_goodsTypeList,
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
            eapor.utils.messagerInfoBySearchEmpty('goodsTypeListTable', 'goodsCategoryName', 2, 0);
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
            rowSelect_goodsTypeList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_goodsTypeList = null;
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
            rowSelect_goodsTypeList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_goodsTypeList = null;
          }
          onlySelectedOneRowFlag = 0;
        },
        toolbar: [{
          text: '新增',
          iconCls: 'icon-add',
          handler: function () {
            gtl_addNewGoodsType();
          }
        }, '-', {
          text: '编辑',
          iconCls: 'icon-edit',
          handler: function () {
            gtl_editGoodsType();
          }
        }, '-', {
          text: '删除',
          iconCls: 'icon-remove',
          handler: function () {
            gtl_delGoodsType();
          }
        }],
        columns: [[  //-----columns start-----
          { field: 'ck', title: '', checkbox: true },
          { field: 'createTime', title: "创建时间", align: 'center', width: 20, hidden: true },
          { field: 'creator', title: "创建者", align: 'center', width: 20, hidden: true },
          { field: 'goodsCategoryId', title: "商品类别ID", align: 'center', width: 20, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
          {
            field: 'usageCode', title: "商品类别用途", align: 'center', width: 20, hidden: true,
            formatter: function (value) {
              if (value === 1) {
                return "消费";
              }
              if (value === 2) {
                return "消耗";
              }
              if (value === 3) {
                return "自用";
              } else {
                return value;
              }
            }
          },

          { field: 'goodsCategoryName', title: "商品类别名称", align: 'center', width: 20 },
          { field: 'sortCode', title: "优先级", align: 'center', width: 20 }
        ]]
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../Goodscategory/getGoodscategoryCount',
        {
          goodsCategoryName: this.search_goodsCategoryName,
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_goodsTypeList').pagination({
        total: result
      });
      const pageSize = $('#page_goodsTypeList').pagination('options').pageSize;
      const pageNumber = $('#page_goodsTypeList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../Goodscategory/listGoodscategoryPage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          goodsCategoryName: this.search_goodsCategoryName,
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#goodsTypeListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../Goodscategory/getGoodscategoryCount',
        {
          goodsCategoryName: this.search_goodsCategoryName,
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_goodsTypeList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../Goodscategory/listGoodscategoryPage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              goodsCategoryName: this.search_goodsCategoryName,
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../Goodscategory/listGoodscategoryPage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          goodsCategoryName: this.search_goodsCategoryName,
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //			this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //			this.maxId = result.maxId;
        $('#goodsTypeListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#goodsTypeListTable').datagrid('loadData', result);
      }
    },
  };

  //编辑按钮
  function gtl_editGoodsType() {
    var selected = $('#goodsTypeListTable').datagrid('getSelected');
    if (selected != null && selected.goodsCategoryName != '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      editGoodsTypeList(selected);
    } else {
      $.messager.show({ title: '系统提示', msg: '请先选择要编辑的商品类别！', timeout: 2000, showType: 'slide' });
      return;
    }
  }
  //编辑按钮
  function editGoodsTypeList(row) {
    $('#showEditGoodsTypeListInfo').append(`
				<div id="div" style="padding-top:30px;padding-left:30px;">
					<div style="margin-bottom:20px">
						<input id="goodsTypeList_editGoodsTypeName"  label="<span style='color:red;'>*</span>商品类别名称：" labelAlign="right" 
								labelPosition="before"  style="width:250px;"/>
					</div>
					<div>
						<input id="goodsTypeList_editSortCode"  label="<span style='color:red;'>*</span>优先级：" labelAlign="right"  value="100"
								labelPosition="before" style="width:250px;"/>
					</div>
				</div>
			`);
    $('#goodsTypeList_editGoodsTypeName').textbox({
      required: true,
      missingMessage: "商品类别名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsTypeList_editSortCode').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //已选择-->取到要修改的数据到弹框上
    $('#goodsTypeList_editGoodsTypeName').textbox('setValue', row.goodsCategoryName);
    $('#goodsTypeList_editSortCode').numberbox('setValue', row.sortCode);

    let showEditGoodsTypeListInfo_dialog = $('#div');
    showEditGoodsTypeListInfo_dialog.dialog({
      title: '编辑',
      width: 360,
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
            if (!$('#goodsTypeList_editGoodsTypeName').textbox('isValid')) {
              $('#goodsTypeList_editGoodsTypeName').textbox('textbox').focus();
              return;
            }
            if (!$('#goodsTypeList_editSortCode').numberbox('isValid')) {
              $('#goodsTypeList_editSortCode').numberbox('textbox').focus();
              return;
            }

            if (clickFlag_goodsTypeList == false) {
              return;
            }
            clickFlag_goodsTypeList = false;
            var that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../Goodscategory/edit',
              data: {
                goodsCategoryName: $('#goodsTypeList_editGoodsTypeName').textbox('getValue'),
                sortCode: Number($('#goodsTypeList_editSortCode').numberbox('getValue')),
                goodsCategoryId: row.goodsCategoryId
              },
              dataType: "json"
            })
              .done(function (data) {
                console.info(data);
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                if (data == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！已存在同名商品类型！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data > 0) {
                  goodsTypeList.getRefreshList();
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
                  showEditGoodsTypeListInfo_dialog.dialog('close');
                  $.ajax({
                    type: 'post',
                    url: '../Goodscategory/listGoodscategoryPage',
                    data: { limit: 9999, offset: 0, goodsCategoryName: '' },
                    dataType: 'json',
                    success: function (result) {
                      eapor.hotel.getGoodsCategoryName = result;
                    }
                  });
                } else {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });
                }
              })
              .always(function () {
                clickFlag_goodsTypeList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditGoodsTypeListInfo_dialog.dialog('close');
          }
        }]
    })
  }
  //删除按钮
  function gtl_delGoodsType() {
    var selected = $('#goodsTypeListTable').datagrid('getSelected');
    var index = $('#goodsTypeListTable').datagrid('getRowIndex', selected);
    if (selected != null && selected.goodsCategoryName != '<span style="color:red;font-size:18px;">未查询到相关信息！</span>') {
      deleteGoodsTypeList(selected, index);
    } else {
      $.messager.show({ title: '系统提示', msg: '请先选择要删除的商品类别！', timeout: 2000, showType: 'slide' });
      return;
    }
  }
  //删除
  function deleteGoodsTypeList(row, index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../Goodscategory/del',
          data: { goodsCategoryId: row.goodsCategoryId },
          success: function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            if (result > 0) {
              goodsTypeList.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000, showType: 'slide' });
              $.ajax({
                type: 'post',
                url: '../Goodscategory/listGoodscategoryPage',
                data: { limit: 9999, offset: 0, goodsCategoryName: '' },
                dataType: 'json',
                success: function (result) {
                  eapor.hotel.getGoodsCategoryName = result;
                }
              });
            } else {
              $.messager.show({ title: '系统提示', msg: '该商品类型下存在商品！删除失败！', timeout: 2000, showType: 'slide' });
            }
          }
        })
      }
    });
  }

  //新增
  function gtl_addNewGoodsType() {
    $('#showAddGoodsTypeListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:30px;">
				<div style="margin-bottom:20px">
					<input id="goodsTypeList_addGoodsTypeName"  label="<span style='color:red;'>*</span>商品类别名称：" labelAlign="right" 
							labelPosition="before"  style="width:250px;"/>
				</div>
				<div>
					<input id="goodsTypeList_addSortCode"  label="<span style='color:red;'>*</span>优先级：" labelAlign="right"  value="100"
							labelPosition="before" style="width:250px;"/>
				</div>
			</div>
		`);
    $('#goodsTypeList_addGoodsTypeName').textbox({
      required: true,
      missingMessage: "商品类别名称不能为空！",
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#goodsTypeList_addSortCode').numberbox({
      required: true,
      missingMessage: "优先级不能为空！",
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "最大输入长度为3位数字",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddGoodsTypeListInfo_dialog = $('#div');
    showAddGoodsTypeListInfo_dialog.dialog({
      title: '新增商品类别',
      width: 360,
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
          if (!$('#goodsTypeList_addGoodsTypeName').textbox('isValid')) {
            $('#goodsTypeList_addGoodsTypeName').textbox('textbox').focus();
            return;
          }
          if (!$('#goodsTypeList_addSortCode').numberbox('isValid')) {
            $('#goodsTypeList_addSortCode').numberbox('textbox').focus();
            return;
          }

          if (clickFlag_goodsTypeList == false) {
            return;
          }
          clickFlag_goodsTypeList = false;
          var that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../Goodscategory/add',
            data: {
              goodsCategoryName: $('#goodsTypeList_addGoodsTypeName').textbox('getValue'),
              sortCode: Number($('#goodsTypeList_addSortCode').numberbox('getValue'))
            },
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！该已存在同名的商品类别！', timeout: 2000, showType: 'slide' });
                return;
              }
              if (result > 0) {
                goodsTypeList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddGoodsTypeListInfo_dialog.dialog('close');
                $.ajax({
                  type: 'post',
                  url: '../Goodscategory/listGoodscategoryPage',
                  data: { limit: 9999999, offset: 0, goodsCategoryName: '' },
                  dataType: 'json',
                  success: function (result) {
                    eapor.hotel.getGoodsCategoryName = result;
                  }
                });
                return;
              } else {
                $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
                return;
              }
            })
            .always(function () {
              clickFlag_goodsTypeList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddGoodsTypeListInfo_dialog.dialog('close');
        }
      }]
    })
  };
  goodsTypeList.init();
})(window.eapor);