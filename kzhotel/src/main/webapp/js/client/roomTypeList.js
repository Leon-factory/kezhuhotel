/**
 *@JSname:房型管理
 */
~(function ($, eapor) {
  "use strict";

  let clickFlag_roomTypeList = true;

  const roomTypeList = {
    search_roomtypeName: '',
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      $('#rtl_roomTypeName').combobox({
        url: '../roomtype/lrtc',
        queryParams: { limit: 9999999, offset: 0, roomtypeName: '' },
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        valueField: 'roomtypeName',
        textField: 'roomtypeName',
        /*onShowPanel:function(){
          $(this).combobox('reload');
        },*/
        loadFilter: function (data) {
          if (data != -3333 && data != -3335) {
            data.unshift({ roomtypeName: "全部" });
          }
          return data;
        }
      });
    },
    renderTable() {
      let rowSelect_roomTypeList = null,
        onlySelectedOneRowFlag = 0;
      $('#roomTypeListTable').datagrid({
        title: '房型列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//loader:firstloader_roomTypeList,
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
            eapor.utils.messagerInfoBySearchEmpty('roomTypeListTable', 'roomtypeName', 9, 0);
            $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
          }
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
          //编辑按钮
          $('a[name="editRoomTypeList_roomTypeList"]').on('click', function () {
            let row_ = $(this).attr('data-val');
            editRoomTypeList(row_);
          });
          //删除按钮
          $('a[name="deleteRoomTypeList_roomTypeList"]').on('click', function () {
            let index = $(this).attr('data-val');
            deleteRoomTypeList(index);
          });
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
            rowSelect_roomTypeList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_roomTypeList = null;
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

          if (rowData != rowSelect_roomTypeList) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_roomTypeList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_roomTypeList = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        columns: [[  //-----columns start-----
          { field: 'ck', title: '', checkbox: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 20, hidden: true },
          { field: 'roomtypeId', title: "房间类型ID", align: 'center', width: 20, hidden: true },
          { field: 'createUsername', title: "创建者", align: 'center', width: 20, hidden: true },
          { field: 'createUserId', title: "createUserId", align: 'center', width: 20, hidden: true },
          { field: 'createTime', title: "createTime", align: 'center', width: 20, hidden: true },
          { field: 'modifyUserId', title: "modifyUserId", align: 'center', width: 20, hidden: true },
          { field: 'version', title: "version", align: 'center', width: 20, hidden: true },
          { field: 'availableRoomNumber', title: "预订房间数量", align: 'center', width: 20, hidden: true },

          { field: 'roomtypeName', title: "房型名称", align: 'center', width: 20 },
          { field: 'remark', title: "备注(移动端)", align: 'center', width: 20 },
          {
            field: 'restRoom', title: "开钟点房", align: 'center', width: 10,
            formatter: function (value) {
              return value == 1 ? "√" : "×";
            }
          },
          {
            field: 'lateRoom', title: "开晚房", align: 'center', width: 10,
            formatter: function (value) {
              return value == 1 ? "√" : "×";
            }
          },
          { field: 'overorderNumber', title: "超订数量", align: 'center', width: 10 },
          { field: 'sortCode', title: "优先级", align: 'center', width: 20 },
          {
            field: 'photo', title: "房型图片(不超过480*480像素  <100KB)", align: 'center', width: 40,
            formatter: function (value, row, index) {
              return value
                ? (
                  value.includes('eapor.com')
                    ? `<img style="height:80px;width:80px;" src="${value}"/>`
                    : `<img style="height:80px;width:80px;" src="http://www.eapor.com/${value}"/>`
                )
                : `<img style="height:80px;width:80px;" src="${eapor.data.guestFileNoPictureUrl}"/>`;
            }
          },
          { field: 'roomCount', title: "房间数量", align: 'center', width: 10 },

          {
            field: 'id5', title: '操作', width: 20, align: 'center',
            formatter: function (value, row, index) {
              let row_ = JSON.stringify(row);
              return `<a name='editRoomTypeList_roomTypeList' data-val='${row_}' class='dryColor' style='cursor:pointer;'>[编辑] </a>
				        				<a name='deleteRoomTypeList_roomTypeList' data-val='${index}' class='dryColor' style='cursor:pointer;'> [删除]</a>`;
            }
          }
        ]]
      });
    },
    bind() {
      $('#rtl_searchroomtype').on('click', () => {
        this.search_roomtypeName = $('#rtl_roomTypeName').combobox('getValue') === "全部"
          ? "" : $('#rtl_roomTypeName').combobox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../roomtype/rtc',
        { roomtypeName: this.search_roomtypeName },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_roomTypeList').pagination({
        total: result
      });
      const pageSize = $('#page_roomTypeList').pagination('options').pageSize;
      const pageNumber = $('#page_roomTypeList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../roomtype/lrtc',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          roomtypeName: this.search_roomtypeName
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#roomTypeListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax(
        '../roomtype/rtc',
        { roomtypeName: this.search_roomtypeName },
        $.proxy(this.countCallBack, this)
      );
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_roomTypeList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../roomtype/lrtc',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              roomtypeName: this.search_roomtypeName
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax(
        '../roomtype/lrtc',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          roomtypeName: this.search_roomtypeName
        },
        $.proxy(this.firstlistCallBack, this)
      );
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //			this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //			this.maxId = result.maxId;
        $('#roomTypeListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#roomTypeListTable').datagrid('loadData', result);
      }
    },
  };

  //编辑按钮
  function editRoomTypeList(row_) {
    let row = JSON.parse(row_);
    $('#showEditRoomTypeListInfo').append(
      '<div id="div" style="text-align:center;padding:30px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editRoomtypeName"   label="<span style=\'color:red;\'>*</span>房型名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editOverorderNumber"  label="超订数量：" labelAlign="right" labelPosition="before" style="width:250px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editRestRoom"  label="开设钟点房：" labelAlign="right" ' +
      'labelPosition="before" style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editLateRoom"  label="开设晚房：" labelAlign="right" ' +
      'data-options="editable:false,data:[{\'id\':0,\'text\':\'否\',\'selected\':true},{\'id\':1,\'text\':\'是\'}],valueField:\'id\',textField:\'text\',panelHeight:\'auto\'"' +
      'labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editSortCode"  value="" label="优先级：" labelAlign="right" labelPosition="before" style="width:250px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<label>照片：</label>' +
      '<img id="roomTypeList_editPhoto" style="width: 100px; height: 100px" src="" />' +
      '<p style="padding-left:30px;padding-bottom:5px;color:red;">' +
      '<input type="button" style="width: 70px" value="上传图片" id="rtl_showUpFileBtn_edit" />' +
      '</p>' +
      '<p style="padding-left:20px;padding-bottom:5px;color:red;">图片宽度为60~480像素,高度为60~480像素</p>' +
      '<p style="padding-left:20px;color:red;">格式可为\'jpg\', \'png\'</p>' +
      '<div id="hif_mapMask_editroomtype" style="position: fixed; margin: 0 auto; left: 0px; top: 0px; width: 100%; height: 100%;' +
      'background-color: gray; display: none;"></div>' +
      //<!-- 文件上传Div -->
      '<div id="upFileDiv_editroomtype"  style="position: absolute; left: 30%; top: 22%; margin-left: -250px; margin-top: -120px; ' +
      'z-index: 20; width: 83%; height: 520px; display: none; background-color: white; padding-top: 20px;">' +
      '<iframe src="../client/bootstrapFileUpload_editroomtype.jsp" name="iframe" width="800px" height="500px"></iframe>' +
      '</div>' +
      '<span class="upFileClose" id="upFileClose_editroomtype" style="background:url(../img/delete.png) no-repeat;background-size: 100%;border-radius:35px;z-index: 77; width: 28px; height:28px; display: none;' +
      'position: absolute; right: 11%; top: 0; cursor: pointer; color: red;"></span>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_editRemark"   label="备注：" labelAlign="right" labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '</div>'
    );
    $('#roomTypeList_editRoomtypeName').textbox({
      required: true,
      missingMessage: "房型名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomTypeList_editOverorderNumber').numberspinner({
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最多3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomTypeList_editRestRoom').combobox({
      data: [
        { 'id': 0, 'text': '否', 'selected': true },
        { 'id': 1, 'text': '是' }
      ],
      valueField: 'id',
      textField: 'text',
      panelHeight: 'auto',
      editable: false
    });
    $('#roomTypeList_editLateRoom').combobox({

    });
    $('#roomTypeList_editSortCode').numberspinner({
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最多3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //编辑显示图片上传
    $('#rtl_showUpFileBtn_edit').click(function () {
      $('#hif_mapMask_editroomtype').fadeTo(1, 0.3);
      $('#upFileDiv_editroomtype').show();
      $('#upFileClose_editroomtype').show();
    });

    $('#upFileClose_editroomtype').click(closeUpFileDiv_editroomtype);

    row.photo
      ? (
        row.photo.includes('eapor.com')
          ? $('#roomTypeList_editPhoto').attr('src', row.photo)
          : $('#roomTypeList_editPhoto').attr('src', 'http://www.eapor.com/' + row.photo)
      )
      : $('#roomTypeList_editPhoto').attr('src', eapor.data.guestFileNoPictureUrl);

    $('#roomTypeList_editRemark').textbox({
      multiline: true,
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //已选择-->取到要修改的数据到弹框上
    $('#roomTypeList_editRoomtypeName').textbox('setValue', row.roomtypeName);
    $('#roomTypeList_editOverorderNumber').numberspinner('setValue', row.overorderNumber);
    $('#roomTypeList_editRestRoom').combobox('setValue', row.restRoom);
    $('#roomTypeList_editLateRoom').combobox('setValue', row.lateRoom);
    $('#roomTypeList_editSortCode').numberspinner('setValue', row.sortCode);
    $('#roomTypeList_editRemark').textbox('setValue', row.remark);
    let showEditRoomTypeListInfo_dialog = $('#div');
    showEditRoomTypeListInfo_dialog.dialog({
      title: '编辑',
      width: 980,
      height: 610,
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
            if (!$('#roomTypeList_editRoomtypeName').textbox('isValid')) {
              $('#roomTypeList_editRoomtypeName').textbox('textbox').focus();
              return;
            }
            if (!$('#roomTypeList_editOverorderNumber').numberspinner('isValid')) {
              $('#roomTypeList_editOverorderNumber').numberspinner('textbox').focus();
              return;
            }
            if (!$('#roomTypeList_editSortCode').numberspinner('isValid')) {
              $('#roomTypeList_editSortCode').numberspinner('textbox').focus();
              return;
            }
            if (!$('#roomTypeList_editRemark').textbox('isValid')) {
              $('#roomTypeList_editRemark').textbox('textbox').focus();
              return;
            }
            let editOverorderNumber = $('#roomTypeList_editOverorderNumber').numberspinner('getValue');
            let editRestRoom = $('#roomTypeList_editRestRoom').combobox('getValue');
            let editLateRoom = $('#roomTypeList_editLateRoom').combobox('getValue');
            let editSortCode = $('#roomTypeList_editSortCode').numberspinner('getValue');
            if (editOverorderNumber == "") {
              editOverorderNumber = 0;
            }
            if (editSortCode == "") {
              editSortCode = 100;
            }

            if (clickFlag_roomTypeList == false) {
              return;
            }
            clickFlag_roomTypeList = false;
            let that = $(this);
            that.addClass("l-btn-disabled");

            $.ajax({
              type: 'post',
              url: '../roomtype/edit',
              data: {
                roomtypeName: $('#roomTypeList_editRoomtypeName').textbox('getValue'),
                overorderNumber: Number(editOverorderNumber),
                restRoom: Number(editRestRoom),
                lateRoom: Number(editLateRoom),
                sortCode: Number(editSortCode),
                photo: $('#roomTypeList_editPhoto').attr('src').replace(/http:\/\/www.eapor.com\//, ""),
                remark: $('#roomTypeList_editRemark').textbox('getValue'),
                roomtypeId: row.roomtypeId,
              },
              dataType: "json"
            })
              .done(function (data) {
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                if (data == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！该房型已存在！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data > 0) {
                  roomTypeList.getRefreshList();
									/*pubjsonfirst_roomTypeList = {};
									$('#roomTypeListTable').datagrid("options").loader=firstloader_roomTypeList;
									$("#roomTypeListTable").datagrid("reload");*/
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 2000, showType: 'slide' });
                  showEditRoomTypeListInfo_dialog.dialog('close');
                  eapor.data.allRoomType = [];
                  eapor.hotel.getAllRoomType();
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 2000, showType: 'slide' });

              })
              .always(function () {
                clickFlag_roomTypeList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        },
        {
          text: '取消',
          handler: function () {
            showEditRoomTypeListInfo_dialog.dialog('close');
          }
        }]
    })
  };
  //删除
  function deleteRoomTypeList(index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../roomtype/del',
          data: { roomTypeId: $('#roomTypeListTable').datagrid('getData').rows[index].roomtypeId }
        })
          .done(function (result) {
            if (result > 0) {
              roomTypeList.getRefreshList();
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 3000, showType: 'slide' });
              return;
            }
            if (result === 0) {
              $.messager.show({ title: '系统提示', msg: '该房型下存在房间！删除失败！', timeout: 3000, showType: 'slide' });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 3000, showType: 'slide' });
          });
      }
    });
  }

  //新增
  $('#rtl_addNewRoomType').click(function () {
    $('#showAddRoomTypeListInfo').append(
      '<div id="div" style="text-align:center;padding:30px;">' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addRoomtypeName"   label="<span style=\'color:red;\'>*</span>房型名称：" labelAlign="right" labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addOverorderNumber"  label="超订数量：" labelAlign="right" labelPosition="before" style="width:250px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addRestRoom"  label="开设钟点房：" labelAlign="right" ' +
      'data-options="editable:false,data:[{\'id\':0,\'text\':\'否\',\'selected\':true},{\'id\':1,\'text\':\'是\'}],valueField:\'id\',textField:\'text\',panelHeight:\'auto\'"' +
      'labelPosition="before" style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addLateRoom" label="开设晚房：" labelAlign="right" ' +
      'data-options="editable:false,data:[{\'id\':0,\'text\':\'否\',\'selected\':true},{\'id\':1,\'text\':\'是\'}],valueField:\'id\',textField:\'text\',panelHeight:\'auto\'"' +
      'labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addSortCode"  value="" label="优先级：" labelAlign="right" labelPosition="before" style="width:250px;" />' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<label>照片：</label>' +
      '<img id="roomTypeList_addPhoto" style="width: 100px; height: 100px" src="" />' +
      '<p style="padding-left:30px;padding-bottom:5px;color:red;">' +
      '<input type="button" style="width: 70px" value="上传图片" id="rtl_showUpFileBtn_add" />' +
      '</p>' +
      '<p style="padding-left:20px;padding-bottom:5px;color:red;">图片宽度为60~480像素,高度为60~480像素</p>' +
      '<p style="padding-left:20px;color:red;">格式可为\'jpg\', \'png\'</p>' +
      '<div id="hif_mapMask_addroomtype" style="position: fixed; margin: 0 auto; left: 0px; top: 0px; width: 100%; height: 100%;' +
      'background-color: gray; display: none;"></div>' +
      //<!-- 文件上传Div -->
      '<div id="upFileDiv_addroomtype"  style="position: absolute; left: 30%; top: 22%; margin-left: -250px; margin-top: -120px; ' +
      'z-index: 20; width: 83%; height: 520px; display: none; background-color: white; padding-top: 20px;">' +
      '<iframe src="../client/bootstrapFileUpload_addroomtype.jsp" name="iframe" width="800px" height="500px"></iframe>' +
      '</div>' +
      '<span class="upFileClose" id="upFileClose_addroomtype" style="background:url(../img/delete.png) no-repeat;background-size: 100%;border-radius:35px;z-index: 77; width: 28px; height: 28px; display: none;' +
      'position: absolute; right: 11%; top:0; cursor: pointer; color: red;"></span>' +
      '</div>' +
      '<div style="margin-bottom:20px">' +
      '<input id="roomTypeList_addRemark"   label="备注：" labelAlign="right" labelPosition="before"  style="width:250px;"/>' +
      '</div>' +
      '</div>'
    );
    $('#roomTypeList_addRoomtypeName').textbox({
      required: true,
      missingMessage: "房型名称不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomTypeList_addOverorderNumber').numberspinner({
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最多3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomTypeList_addRestRoom').combobox({

    });
    $('#roomTypeList_addLateRoom').combobox({

    });
    $('#roomTypeList_addSortCode').numberspinner({
      validType: ['number', 'maxLength[3]'],
      invalidMessage: "请输入数字，最多3位",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomTypeList_addRemark').textbox({
      multiline: true,
      validType: ['maxLength[28]'],
      invalidMessage: "最大输入长度为28个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //新增显示图片上传
    $('#rtl_showUpFileBtn_add').click(function () {
      $('#hif_mapMask_addroomtype').fadeTo(1, 0.3);
      $('#upFileDiv_addroomtype').show();
      $('#upFileClose_addroomtype').show();
    });

    $('#upFileClose_addroomtype').click(closeUpFileDiv_addroomtype);

    $('#roomTypeList_addOverorderNumber').numberspinner('setValue', 0);
    $('#roomTypeList_addRestRoom').combobox('setValue', 0);
    $('#roomTypeList_addLateRoom').combobox('setValue', 0);
    $('#roomTypeList_addSortCode').numberspinner('setValue', 100);
    $("#roomTypeList_addPhoto").attr("src", eapor.data.guestFileNoPictureUrl);
    let showAddRoomTypeListInfo_dialog = $('#div');
    showAddRoomTypeListInfo_dialog.dialog({
      title: '新增房间类型',
      width: 980,
      height: 610,
      closed: false,
      cache: false,
      modal: true,
      onClose: function () {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler: function () {
          if (!$('#roomTypeList_addRoomtypeName').textbox('isValid')) {
            $('#roomTypeList_addRoomtypeName').textbox('textbox').focus();
            return;
          }
          if (!$('#roomTypeList_addOverorderNumber').textbox('isValid')) {
            $('#roomTypeList_addOverorderNumber').textbox('textbox').focus();
            return;
          }
          if (!$('#roomTypeList_addSortCode').textbox('isValid')) {
            $('#roomTypeList_addSortCode').textbox('textbox').focus();
            return;
          }
          if (!$('#roomTypeList_addRemark').textbox('isValid')) {
            $('#roomTypeList_addRemark').textbox('textbox').focus();
            return;
          }
          let addRoomtypeName = $('#roomTypeList_addRoomtypeName').textbox('getValue');
          let addOverorderNumber = $('#roomTypeList_addOverorderNumber').numberspinner('getValue');
          let addSortCode = $('#roomTypeList_addSortCode').numberspinner('getValue');
          if (addOverorderNumber == "") {
            addOverorderNumber = 100;
          }
          if (addSortCode == "") {
            addSortCode = 100;
          }
          if (clickFlag_roomTypeList == false) {
            return;
          }
          clickFlag_roomTypeList = false;
          let that = $(this);
          that.addClass("l-btn-disabled");

          $.ajax({
            type: 'post',
            url: '../roomtype/add',
            data: {
              roomtypeName: addRoomtypeName,
              overorderNumber: Number(addOverorderNumber),
              restRoom: Number($('#roomTypeList_addRestRoom').combobox('getValue')),
              lateRoom: Number($('#roomTypeList_addLateRoom').combobox('getValue')),
              sortCode: Number(addSortCode),
              photo: $('#roomTypeList_addPhoto').attr('src').replace(/http:\/\/www.eapor.com\//, ""),
              remark: $('#roomTypeList_addRemark').textbox('getValue')
            },
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在同名的房间类型！', timeout: 2000, showType: 'slide' });
                return;
              }
              if (result > 0) {
                roomTypeList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddRoomTypeListInfo_dialog.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
            })
            .always(function () {
              clickFlag_roomTypeList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddRoomTypeListInfo_dialog.dialog('close');
        }
      }]
    })
  });
  roomTypeList.init();
})(window.jQuery, window.eapor);