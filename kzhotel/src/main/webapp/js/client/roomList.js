/**
 * @设置-->房间管理JS
 */
~(function () {
  "use strict";
  let clickFlag_roomList = true;
  const roomList = {
    //	clickFlag_roomList: true,
    search_roomtypeId: 0,
    search_roomCode: '',
    search_floorId: 0,
    init() {
      this.render();
      this.renderTable();
      this.bind();
      this.getList();
    },
    render() {
      $('#rl_roomTypeSelect').combobox({
        url: '../roomtype/lrtc',
        queryParams: { limit: 9999999, offset: 0, roomtypeName: '' },
        valueField: 'roomtypeId',
        textField: 'roomtypeName',
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        //			onShowPanel () {
        //				$(this).combobox('reload');
        //			},
        loadFilter(result) {
          if (result != -3333 && result != -3335) {
            result.unshift({ roomtypeId: 0, roomtypeName: "全部" });
          }
          return result;
        }
      });
      $('#rl_floorSelect').combobox({
        url: "../floor/pglist",
        queryParams: { limit: 9999999, offset: 0, floorName: '' },
        valueField: 'floorId',
        textField: 'floorName',
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        //			onShowPanel () {
        //				$(this).combobox('reload');
        //			},
        loadFilter(result) {
          if (result != -3333 && result != -3335) {
            result.unshift({ floorId: 0, floorName: "全部" });
          }
          return result;
        }
      });
    },

    bind() {
      $('#rl_searchRoom').click(() => {
        this.search_roomCode = $('#rl_roomInput').textbox('getValue');
        this.search_roomtypeId = $('#rl_roomTypeSelect').combobox('getValue') === "全部" ||
          $('#rl_roomTypeSelect').combobox('getValue') === ""
          ? 0 : $('#rl_roomTypeSelect').combobox('getValue');
        this.search_floorId = $('#rl_floorSelect').combobox('getValue') === "全部" ||
          $('#rl_floorSelect').combobox('getValue') === ""
          ? 0 : $('#rl_floorSelect').combobox('getValue');
        this.getList();
      });
    },
    getRefreshList() {
      eapor.utils.defaultAjax('../room/getRoomCount',
        {
          roomtypeId: this.search_roomtypeId,
          roomCode: this.search_roomCode,
          floorId: this.search_floorId
        },
        $.proxy(this.countRefreshCallBack, this));
    },
    countRefreshCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      $('#page_roomList').pagination({
        total: result
      });
      const pageSize = $('#page_roomList').pagination('options').pageSize;
      const pageNumber = $('#page_roomList').pagination('options').pageNumber;
      eapor.utils.defaultAjax('../room/listRoomPage',
        {
          offset: pageSize * (pageNumber - 1) < 0 ? 0 : pageSize * (pageNumber - 1),
          limit: pageSize,
          roomtypeId: this.search_roomtypeId,
          roomCode: this.search_roomCode,
          floorId: this.search_floorId
        },
        $.proxy(this.listRerefshCallBack, this));
    },
    listRerefshCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#roomListTable').datagrid('loadData', result);
      }
    },
    getList() {
      eapor.utils.defaultAjax('../room/getRoomCount',
        {
          roomtypeId: this.search_roomtypeId,
          roomCode: this.search_roomCode,
          floorId: this.search_floorId
        },
        $.proxy(this.countCallBack, this));
    },
    countCallBack(result) {
      console.info(result);
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }

      const page_div = $('#page_roomList');
      page_div.pagination({
        total: result,
        loading: true,
        showRefresh: false,
        pageSize: 10,
        onSelectPage: (pageNumber, pageSize) => {
          if (pageNumber === 0) { return; }
          eapor.utils.defaultAjax('../room/listRoomPage',
            {
              offset: pageSize * (pageNumber - 1),
              limit: pageSize,
              roomtypeId: this.search_roomtypeId,
              roomCode: this.search_roomCode,
              floorId: this.search_floorId
            },
            $.proxy(this.listCallBack, this));
        }
      });
      eapor.utils.defaultAjax('../room/listRoomPage',
        {
          offset: 0,
          limit: page_div.pagination('options').pageSize,
          roomtypeId: this.search_roomtypeId,
          roomCode: this.search_roomCode,
          floorId: this.search_floorId
        },
        $.proxy(this.firstlistCallBack, this));
    },
    firstlistCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        //			this.nextPushTime(result.data.length > 0 ? result.data[0].pushTime : '1900-01-01 : 00:00:00');
        //			this.maxId = result.maxId;
        $('#roomListTable').datagrid('loadData', result);
      }
    },
    listCallBack(result) {
      console.info(result);
      if (Array.isArray(result)) {
        $('#roomListTable').datagrid('loadData', result);
      }
    },
    renderTable() {
      let rowSelect_roomList = null,
        onlySelectedOneRowFlag = 0;

      $('#roomListTable').datagrid({
        title: '房间列表', 		//表格标题
        iconCls: 'icon-list',  //表格图标
        nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
        striped: true,
        data: [],//firstloader_roomList,
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
            eapor.utils.messagerInfoBySearchEmpty('roomListTable', 'roomCode', 6, 0);
            $(this).parent().find("td[field='ck']")[1].style.visibility = "hidden";
          }
          $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
          //编辑按钮
          $('a[name="editRoomList_roomList"]').on('click', function () {
            let row_ = $(this).attr('data-val');
            editRoomList(row_);
          });
          //删除按钮
          $('a[name="deleteRoomList_roomList"]').on('click', function () {
            let index = $(this).attr('data-val');
            deleteRoomList(index);
          });
          //复制按钮
          $('a[name="copyRoomList_roomList"]').on('click', function () {
            let index = $(this).attr('data-val');
            copyRoomList(index);
          });

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
            rowSelect_roomList = $(this).datagrid('getSelected');
          }
          else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_roomList = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        onCheck(rowIndex, rowData) {
          if (onlySelectedOneRowFlag === 2) {
            return;
          }

          if (onlySelectedOneRowFlag === 1) {
            onlySelectedOneRowFlag = 0;
            return;
          } else {
            onlySelectedOneRowFlag = 2;
          }

          if (rowData != rowSelect_roomList) {
            $(this).datagrid('checkRow', rowIndex);
            $(this).datagrid('selectRow', rowIndex);
            rowSelect_roomList = $(this).datagrid('getSelected');
          } else {
            $(this).datagrid('uncheckRow', rowIndex);
            $(this).datagrid('unselectRow', rowIndex);
            rowSelect_roomList = null;
          }

          onlySelectedOneRowFlag = 0;
        },
        columns: [[  //-----columns start-----
          { field: 'ck', title: '', checkbox: true },
          { field: 'roomState', title: "roomState", align: 'center', width: 100, hidden: true },
          { field: 'unitedState', title: "unitedState", align: 'center', width: 100, hidden: true },
          { field: 'roomtypeId', title: "roomtypeId", align: 'center', width: 100, hidden: true },
          { field: 'roomId', title: "roomId", align: 'center', width: 100, hidden: true },
          { field: 'restRoom', title: "restRoom", align: 'center', width: 100, hidden: true },
          { field: 'rentId', title: "rentId", align: 'center', width: 100, hidden: true },
          { field: 'receptionId', title: "receptionId", align: 'center', width: 100, hidden: true },
          { field: 'lateRoom', title: "lateRoom", align: 'center', width: 100, hidden: true },
          { field: 'hotelId', title: "hotelId", align: 'center', width: 100, hidden: true },
          { field: 'floorId', title: "floorId", align: 'center', width: 100, hidden: true },
          { field: 'creator', title: "creator", align: 'center', width: 100, hidden: true },
          { field: 'reateTime', title: "reateTime", align: 'center', width: 100, hidden: true },

          { field: 'roomCode', title: "房号", align: 'center', width: 20 },
          { field: 'roomtypeName', title: "房间类型", align: 'center', fitColumns: true, width: 20 },
          { field: 'floorName', title: "楼层", align: 'center', fitColumns: true, width: 20 },
          { field: 'lockCode', title: "门锁号", align: 'center', fitColumns: true, width: 20 },
          { field: 'description', title: "备注", align: 'center', fitColumns: true, width: 20 },
          {
            field: 'id5', title: '操作', width: 20, align: 'center', formatter: function (value, row, index) {
              let row_ = JSON.stringify(row);
              return `<a class='dryColor' name='editRoomList_roomList' data-val='${row_}' style='cursor:pointer;'>[编辑] </a>
				        				<a class='dryColor' name='copyRoomList_roomList' data-val='${row_}' style='cursor:pointer;'>[复制] </a>
				        				<a class='dryColor' name='deleteRoomList_roomList' data-val='${index}' style='cursor:pointer;'> [删除]</a>`;
            }
          }
        ]]
      });
    },
  };

  //复制按钮
  function copyRoomList(row_) {
    console.info(row_)
    const row = JSON.parse(row_);
    $('#showCopyRoomListInfo').append(`
			<div id="div" style="padding:20px 20px 20px 30px;">
				<label><span style="color:red;">*</span>复制数量：<input id="copyNumber" style="width:130px;"/></label>
			</div>
		`);
    $('#copyNumber').textbox({
      required: true,
      missingMessage: '复制数量不能为空',
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true,
    });
    const dialog = $('#div');
    dialog.dialog({
      title: '复制房间',
      width: 300,
      height: 150,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler() {
            const copyNumber = $('#copyNumber');
            if (!copyNumber.textbox('isValid')) {
              copyNumber.textbox('textbox').focus();
              return;
            }
            console.info({ roomCode: row.roomCode, copyNumber: copyNumber.textbox('getValue') })
            eapor.utils.defaultAjax('../room/copyRoom',
              {
                roomCode: row.roomCode,
                copyNumber: copyNumber.textbox('getValue')
              },
              copyRoomCallBack);
            function copyRoomCallBack(result) {
              console.info(result);

              $('#showCopyRoomListInfo').append(`
									<div id="tabel_copyRoom" style="padding:20px;">
										<h3>系统生成的房号为：</h3><hr>
										<div style="width:240px;height:150px;word-wrap:break-word"><h3>${result}</h3></div>
									</div>
								`);
              const tabel_copyRoom = $('#tabel_copyRoom');
              tabel_copyRoom.dialog({
                title: '系统生成的房号',
                width: 300,
                height: 300,
                closed: false,
                cache: false,
                modal: true,
                onClose() {
                  $(this).dialog('destroy');
                },
                buttons: [
                  {
                    text: '确定',
                    handler() {
                      function batchAddRoomCallBack(result) {
                        console.info(result);
                        if (result > 0) {
                          $('#srcontains').empty();
                          initAllRoomState();//更新房态
                          //															pubjsonfirst_roomList = {};
                          //															$('#roomListTable').datagrid("options").loader=firstloader_roomList;
                          //															$("#roomListTable").datagrid("reload"); 
                          roomList.getRefreshList();
                          $.messager.show({ title: '系统提示', msg: `复制成功！`, timeout: 2000, showType: 'slide' });
                          tabel_copyRoom.dialog('close');
                          dialog.dialog('close');
                          return;
                        }
                        if (result === -1) {
                          $.messager.show({ title: '系统提示', msg: '复制失败！该房型不存在！', timeout: 2000, showType: 'slide' });
                          return;
                        }
                        if (result === -2) {
                          $.messager.show({ title: '系统提示', msg: '复制失败！该楼层不存在！', timeout: 2000, showType: 'slide' });
                          return;
                        }
                        if (result === 0) {
                          $.messager.show({ title: '系统提示', msg: '复制失败！已存在相同的房间号！', timeout: 2000, showType: 'slide' });
                          return;
                        }
                        $.messager.show({ title: '系统提示', msg: `复制失败！${result}`, timeout: 2000, showType: 'slide' });

                      }
                      eapor.utils.defaultAjax('../room/batchAddRoom',
                        {
                          roomCodeList: JSON.stringify(result),
                          roomTypeId: row.roomtypeId,
                          floorId: row.floorId
                        },
                        batchAddRoomCallBack);
                    }
                  },
                  {
                    text: '取消',
                    handler() {
                      tabel_copyRoom.dialog('close');
                    }
                  }]
              });
            }
          }
        },
        {
          text: '取消',
          handler() {
            dialog.dialog('close');
          }
        }]
    });

  }

  //编辑按钮
  function editRoomList(row_) {
    let row = JSON.parse(row_);
    $('#showEditRoomListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:40px;">
				<div style="margin-bottom:20px">
					<input id="roomList_EditRoomCode" label="<span style='color:red;'>*</span>房号：" labelAlign="right" labelWidth="80px;" labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_EditRoomTypeId"  label="<span style='color:red;'>*</span>房间类型：" labelAlign="right" labelWidth="80px;"  labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_EditFloorId"  label="<span style='color:red;'>*</span>楼层：" labelAlign="right" labelWidth="80px;"  labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_EditLockCode"  label="门锁号：" labelWidth="80px;"  labelAlign="right" labelPosition="before" style="width:200px;"/>
				</div>
				<div>
					<input id="roomList_EditDescription" label="备注：" labelAlign="right" labelWidth="80px;" labelPosition="before" style="width:200px;">
				</div>
			</div>
		`);

    //编辑
    $('#roomList_EditRoomCode').textbox({
      required: true,
      missingMessage: "房号不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomList_EditRoomTypeId').combobox({
      url: '../roomtype/lrtc',
      queryParams: { limit: 9999, offset: 0, roomtypeName: '' },
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      //			onShowPanel:function(){
      //				$(this).combobox('reload');
      //			},
      missingMessage: "房型不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomList_EditFloorId').combobox({
      url: "../floor/pglist",
      queryParams: { limit: 9999, offset: 0, floorName: '' },
      valueField: 'floorId',
      textField: 'floorName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      //			onShowPanel:function(){
      //				$(this).combobox('reload');
      //			},
      required: true,
      missingMessage: "楼层不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });

    $('#roomList_EditLockCode').textbox({
			/*required:true,
			missingMessage : "锁号不能为空！",
			validType:['number','maxLength[8]','minLength[8]'],
			invalidMessage : "请输入8位数字",
			validateOnCreate:false,//为true时在创建该组件时就进行验证
			validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/		});

    $('#roomList_EditDescription').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    //已选择-->取到要修改的数据到弹框上
    $('#roomList_EditRoomCode').textbox('setValue', row.roomCode);
    $('#roomList_EditRoomTypeId').combobox('setValue', row.roomtypeId);
    $('#roomList_EditRoomTypeId').combobox('setText', row.roomtypeName);
    console.info(row);
    $('#roomList_EditFloorId').combobox('setValue', row.floorId);
    $('#roomList_EditFloorId').combobox('setText', row.floorName);
    $('#roomList_EditLockCode').textbox('setValue', row.lockCode);
    $('#roomList_EditDescription').textbox('setValue', row.description);

    let showEditRoomListInfo_dialog = $('#div');
    showEditRoomListInfo_dialog.dialog({
      title: '编辑',
      width: 330,
      height: 380,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [
        {
          text: '确定',
          handler() {
            if (!$('#roomList_EditRoomCode').textbox('isValid')) {
              $('#roomList_EditRoomCode').textbox('textbox').focus();
              return;
            }
            if (!$('#roomList_EditRoomTypeId').combobox('isValid')) {
              $('#roomList_EditRoomTypeId').combobox('textbox').focus();
              return;
            }
            if (!$('#roomList_EditFloorId').combobox('isValid')) {
              $('#roomList_EditFloorId').combobox('textbox').focus();
              return;
            }
            if (!$('#roomList_EditLockCode').textbox('isValid')) {
              $('#roomList_EditLockCode').textbox('textbox').focus();
              return;
            }
            if (!$('#roomList_EditDescription').textbox('isValid')) {
              $('#roomList_EditDescription').textbox('textbox').focus();
              return;
            }

            if (clickFlag_roomList == false) {
              return;
            }
            clickFlag_roomList = false;
            const that = $(this);
            that.addClass("l-btn-disabled");
            $.ajax({
              type: 'post',
              url: '../room/edit',
              data: {
                roomId: +row.roomId,
                roomCode: $('#roomList_EditRoomCode').textbox('getValue'),
                floorId: +($('#roomList_EditFloorId').combobox('getValue')),
                roomtypeId: +($('#roomList_EditRoomTypeId').combobox('getValue')),
                description: $('#roomList_EditDescription').textbox('getValue'),
                lockCode: $('#roomList_EditLockCode').textbox('getValue')
              },
              dataType: "json"
            })
              .done(function (data) {
                console.info(data);
                if (eapor.utils.ajaxCallBackErrInfo(data)) {
                  return;
                }
                //-3；该房间不存在
                //-4；房间在入住状态下不允许修改任何房间信息
                if (data == -3 || data == -2) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！该房间未查找到！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data == -4) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！该房间尚未退房！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data == 0) {
                  $.messager.show({ title: '系统提示', msg: '编辑失败！已存在相同房号的房间！', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data == -1) {
                  $.messager.show({ title: '系统提示', msg: '删除失败！已存在相同房号!', timeout: 2000, showType: 'slide' });
                  return;
                }
                if (data > 0) {
                  eapor.utils.roomOpen_successRefreshRoomType(+row.roomId, 0);
                  //pubjsonfirst_roomList = {};
                  //$('#roomListTable').datagrid("options").loader=firstloader_roomList;
                  //$("#roomListTable").datagrid("reload");
                  roomList.getRefreshList();
                  $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 3000, showType: 'slide' });
                  showEditRoomListInfo_dialog.dialog('close');
                  return;
                }
                $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 3000, showType: 'slide' });
              })
              .always(function () {
                clickFlag_roomList = true;
                that.removeClass("l-btn-disabled");
              });
          }
        }, {
          text: '取消',
          handler: function () {
            showEditRoomListInfo_dialog.dialog('close');
          }
        }]
    })
  };
  //删除
  function deleteRoomList(index) {
    $.messager.confirm('确认', '您确认想要删除该记录吗？', function (r) {
      if (r) {
        $.ajax({
          type: 'post',
          url: '../room/del',
          data: { roomId: $('#roomListTable').datagrid('getData').rows[index].roomId },
          success: function (result) {
            if (eapor.utils.ajaxCallBackErrInfo(result)) {
              return;
            }
            //-3：该房间不存在
            //-4：房间在入住状态下不允许进行删除操作
            if (result == -3) {
              $.messager.show({ title: '系统提示', msg: '删除失败！该房间未查找到!', timeout: 2000, showType: 'slide' });
              return;
            }
            if (result == -4) {
              $.messager.show({ title: '系统提示', msg: '删除失败！该房间未退房!', timeout: 2000, showType: 'slide' });
              return;
            }
            if (result > 0) {
              $('#srcontains').empty();
              initAllRoomState();//更新房态
              roomList.getRefreshList();
              //		    				$('#roomListTable').datagrid('deleteRow',index);   
              //		    				$('#roomListTable').datagrid('reload');
              $.messager.show({ title: '系统提示', msg: '删除成功！', timeout: 2000, showType: 'slide' });
              return;
            }

            $.messager.show({ title: '系统提示', msg: '删除失败！', timeout: 2000, showType: 'slide' });
          }
        })
      }
    });
  }
  //新增
  $('#rl_addNewRoom').click(function () {
    $('#showAddRoomListInfo').append(`
			<div id="div" style="padding-top:30px;padding-left:40px;">
				<div style="margin-bottom:20px">
					<input id="roomList_AddRoomCode" label="<span style='color:red;'>*</span>房号：" labelAlign="right" labelWidth="80px;" labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_AddRoomTypeId"  label="<span style='color:red;'>*</span>房间类型：" labelAlign="right" labelWidth="80px;"  labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_AddFloorId"  label="<span style='color:red;'>*</span>楼层：" labelAlign="right" labelWidth="80px;"  labelPosition="before" style="width:200px;">
				</div>
				<div style="margin-bottom:20px">
					<input id="roomList_AddLockCode" label="门锁号："  labelWidth="80px;"  labelAlign="right" labelPosition="before" style="width:200px;"/>
				</div>
				<div>
					<input id="roomList_AddDescription" label="备注：" labelAlign="right" labelWidth="80px;" labelPosition="before" style="width:200px;">
				</div>
			</div>
		`);
    $('#roomList_AddRoomCode').textbox({
      required: true,
      missingMessage: "房号不能为空！",
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomList_AddRoomTypeId').combobox({
      url: '../roomtype/lrtc',
      queryParams: { limit: 9999999, offset: 0, roomtypeName: '' },
      valueField: 'roomtypeId',
      textField: 'roomtypeName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      //			onShowPanel:function(){
      //				$(this).combobox('reload');
      //			},
      onLoadSuccess: function (data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].roomtypeId);
          $(this).combobox('setText', data[0].roomtypeName);
        }
      },
      required: true,
      missingMessage: "房间类型不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomList_AddFloorId').combobox({
      url: "../floor/pglist",
      queryParams: { limit: 9999999, offset: 0, floorName: '' },
      valueField: 'floorId',
      textField: 'floorName',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      //			onShowPanel () {
      //				$(this).combobox('reload');
      //			},
      onLoadSuccess(data) {
        if (data.length > 0) {
          $(this).combobox('setValue', data[0].floorId);
          $(this).combobox('setText', data[0].floorName);
        }
      },
      required: true,
      missingMessage: "楼层不能为空！",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    $('#roomList_AddLockCode').textbox({
			/*required:true,
			missingMessage : "锁号不能为空！",*/
			/*validType:['number','maxLength[8]','minLength[8]'],
			invalidMessage : "请输入8位数字",*/
			/*validateOnCreate:false,//为true时在创建该组件时就进行验证
			validateOnBlur:true  //为true时在该组件失去焦点的时候进行验证
*/		});
    $('#roomList_AddDescription').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true  //为true时在该组件失去焦点的时候进行验证
    });
    let showAddRoomListInfo_dialog = $('#div');
    showAddRoomListInfo_dialog.dialog({
      title: '新增房间',
      width: 330,
      height: 380,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler() {
          if (!$('#roomList_AddRoomCode').textbox('isValid')) {
            $('#roomList_AddRoomCode').textbox('textbox').focus();
            return;
          }
          if (!$('#roomList_AddRoomTypeId').combobox('isValid')) {
            $('#roomList_AddRoomTypeId').combobox('textbox').focus();
            return;
          }
          if (!$('#roomList_AddFloorId').combobox('isValid')) {
            $('#roomList_AddFloorId').combobox('textbox').focus();
            return;
          }
          if (!$('#roomList_AddLockCode').textbox('isValid')) {
            $('#roomList_AddLockCode').textbox('textbox').focus();
            return;
          }
          if (!$('#roomList_AddDescription').textbox('isValid')) {
            $('#roomList_AddDescription').textbox('textbox').focus();
            return;
          }

          if (clickFlag_roomList == false) {
            return;
          }
          clickFlag_roomList = false;
          const that = $(this);
          that.addClass("l-btn-disabled");
          $.ajax({
            type: 'post',
            url: '../room/addroom',
            data: {
              roomCode: $('#roomList_AddRoomCode').textbox('getValue'),
              roomtypeId: $('#roomList_AddRoomTypeId').combobox('getValue'),
              floorId: $('#roomList_AddFloorId').combobox('getValue'),
              lockCode: $('#roomList_AddLockCode').textbox('getValue'),
              description: $('#roomList_AddDescription').textbox('getValue')
            },
            dataType: 'json'
          })
            .done(function (result) {
              if (eapor.utils.ajaxCallBackErrInfo(result)) {
                return;
              }
              if (result == 0) {
                $.messager.show({ title: '系统提示', msg: '新增失败！已存在房号相同的房间！', timeout: 2000, showType: 'slide' });
                return;
              }
              if (result > 0) {
                $('#srcontains').empty();
                initAllRoomState();//更新房态
                //pubjsonfirst_roomList = {};
                //$('#roomListTable').datagrid("options").loader=firstloader_roomList;
                //$("#roomListTable").datagrid("reload");
                roomList.getRefreshList();
                $.messager.show({ title: '系统提示', msg: '新增成功！', timeout: 2000, showType: 'slide' });
                showAddRoomListInfo_dialog.dialog('close');
                return;
              }
              $.messager.show({ title: '系统提示', msg: '新增失败！', timeout: 2000, showType: 'slide' });
            })
            .always(function () {
              clickFlag_roomList = true;
              that.removeClass("l-btn-disabled");
            });
        }
      }, {
        text: '取消',
        handler: function () {
          showAddRoomListInfo_dialog.dialog('close');
        }
      }]
    })
  });
  roomList.init();
})();