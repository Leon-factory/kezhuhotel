/**
 *@jsname:餐宴预订图
 */
~(function () {
  "use strict";
  let searchFlag = false;
  //初始化
  //日期
  $('#hallDate_scheduledChart').datebox({ editable: false });
  //厅台号
  $('#hallNum_scheduledChart').textbox({

  });
  //位置
  $('#position_scheduledChart').combobox({
    url: "../banquet/listBanquetLocation",
    queryParams: { banquetLocationName: "", offset: 0, limit: 9999999 },
    valueField: 'banquetLocationId',
    textField: 'banquetLocationName',
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return [];
      }
      data.unshift({ "banquetLocationId": 0, "banquetLocationName": "全部" });
      return data;
    }
  });
  //初始化左键菜单绑定事件
  $('#menuHave_scheduledChart').menu({
    onClick(item) {
      doMenuClickEvent(item.name);
    }
  });
  $('#menuEmpty_scheduledChart').menu({
    onClick(item) {
      doMenuClickEvent(item.name);
    }
  });
  //执行菜单所点击的事件
  function doMenuClickEvent(name) {
    console.info(name);
    const data_ = JSON.parse($('#saveClickBlockData_scheduledChart').val());
    if (name == "createScheduled") {//创建预订
      createScheduled(data_.restaurantInfo);
    } else {//显示预订list， 【编辑预订，取消预订，设置失约，预订开台】
      showScheduledList(data_.banquetChartInfos);
    }
  }
  //创建预订
  function createScheduled(obj_) {
    console.info(obj_);
    $('#dialogParent_scheduledChart').append(`
			<div id="div" style="padding:30px 0 0 40px;">
				<div style="margin-bottom:10px">
					<input id="tableCode" style="width:230px;" disabled label="厅台号：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="expectedArrivalTime" style="width:230px;"  label="到店时间：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="peopleNumer" style="width:230px;" type="search" label="餐宴人数：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="contact" style="width:230px;" type="search" label="联系姓名：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="contactPhone" style="width:230px;" type="search" label="联系手机：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
				<div>
					<input id="remark" style="width:230px;"  label="预订备注：" labelPosition="before" 
						labelAlign="right" labelWidth="70"/>
				</div>
			</div>
		`);
    $('#tableCode').textbox({//厅台号

    });
    $('#tableCode').textbox('setValue', obj_.restaurantName);//id obj_.restaurantId
    let defaultTime = $('#hallDate_scheduledChart').datetimebox('getValue');
    if (defaultTime) {
      const t = new Date();
      const h = t.getHours();
      const m = t.getMinutes();
      const s = t.getSeconds();
      defaultTime = defaultTime + ' ' + h + ':' + m + ':' + s;
    }
    $('#expectedArrivalTime').datetimebox({//到店时间
      required: true,
      missingMessage: "时间不能为空！",
      delay: 1000,
      value: defaultTime,
      validateOnCreate: false,
      validateOnBlur: true,
      editable: false
    });


    $('#peopleNumer').numberspinner({//人数
      min: 1,
      value: 1,
    });
    $('#contact').textbox({//姓名

    });
    $('#contactPhone').numberbox({//手机号码
      validType: 'mobilephone',
      invalidMessage: "手机号码格式不正确！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });
    $('#remark').textbox({//备注
      multiline: true
    });
    const dialog = $('#div');
    dialog.dialog({
      title: '创建餐宴预订单',
      width: 350,
      height: 360,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler() {
          if (!$('#expectedArrivalTime').datetimebox('isValid')) {
            $('#expectedArrivalTime').datetimebox('textbox').focus();
            return;
          }
          if (!$('#contactPhone').numberbox('isValid')) {
            $('#contactPhone').numberbox('textbox').focus();
            return;
          }
          const submitData = {
            bqRestaurantId: obj_.restaurantId,	//餐宴 会馆id
            expectedArrivalTime: $('#expectedArrivalTime').datetimebox('getValue'),	//预计抵达时间
            peopleNumer: $('#peopleNumer').numberspinner('getValue'),	//人数
            contact: $('#contact').textbox('getValue'),	//联系人姓名
            contactPhone: $('#contactPhone').numberbox('getValue'),	//联系人手机
            remark: $('#remark').textbox('getValue')
          };
          function createScheduledCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '创建成功！', timeout: 3000, showType: 'slide' });
              dialog.dialog('close');
              getList();
              return;
            }
            if (result == -3) {
              $.messager.show({ title: '系统提示', msg: '创建失败！预计到达时间不正确！', timeout: 3000, showType: 'slide' });
              return;
            }
            $.messager.show({ title: '系统提示', msg: '创建失败！', timeout: 3000, showType: 'slide' });
          }
          console.info(submitData);
          eapor.utils.defaultAjax('../bqReserve/createBqReserve', submitData, createScheduledCallBack);
        }
      }, {
        text: '取消',
        handler() {
          dialog.dialog('close');
        }
      }]
    });
  }

  const menuTodo = {
    //编辑预订单
    updateScheduledItem() {
      const selected = $('#scheduledList_scheduledChart').datagrid('getSelected');
      console.info(selected);
      if (!selected) {
        $.messager.show({ title: '系统提示', msg: '请先选择预订单！', timeout: 3000, showType: 'slide' });
        return;
      }
      $('#dialogParent_scheduledChart').append(`
					<div id="editDiv" style="padding:30px 0 0 40px;">
						<div style="margin-bottom:10px">
							<input id="restaurant" style="width:230px;" label="厅台号：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
						<div style="margin-bottom:10px">
							<input id="expectedArrivalTime" style="width:230px;"  label="到店时间：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
						<div style="margin-bottom:10px">
							<input id="peopleNumer" style="width:230px;" type="search" label="餐宴人数：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
						<div style="margin-bottom:10px">
							<input id="contact" style="width:230px;" type="search" label="联系姓名：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
						<div style="margin-bottom:10px">
							<input id="contactPhone" style="width:230px;" type="search" label="联系手机：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
						<div>
							<input id="remark" style="width:230px;"  label="预订备注：" labelPosition="before" 
								labelAlign="right" labelWidth="70"/>
						</div>
					</div>
				`);
      $('#restaurant').combobox({//厅台号
        valueField: 'restaurantId',
        textField: 'restaurantName',
        url: '../banquet/listRestaurant',
        queryParams: {
          restaurantName: "",
          offset: 0,
          limit: 9999999,
          banquetLocationId: 0
        },
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 200,
        required: true,
        missingMessage: "厅台号不能为空！",
        //validType:['maxLength[32]'],
        //invalidMessage : "最大输入长度为32个字符",
        validateOnCreate: false,//为true时在创建该组件时就进行验证
        validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
        onLoadSuccess(data) {
          $(this).combobox('setValue', selected.bqRestaurantId);
          $(this).combobox('setText', selected.bqRestaurantName);
        }
      });
      $('#expectedArrivalTime').datetimebox({
        editable: false
      });
      $('#expectedArrivalTime').datetimebox('setValue', selected.expectedArrivalTime);
      $('#peopleNumer').textbox({});
      $('#peopleNumer').textbox('setValue', selected.peopleNumer);
      $('#contact').textbox({});
      $('#contact').textbox('setValue', selected.guestName);
      $('#contactPhone').numberbox({});
      $('#contactPhone').numberbox('setValue', selected.guestPhone);
      $('#remark').textbox({
        multiline: true
      });
      $('#remark').textbox('setValue', selected.remark);
      const dialog = $('#editDiv');
      dialog.dialog({
        title: '编辑餐宴预订单',
        width: 350,
        height: 360,
        closed: false,
        cache: false,
        modal: true,
        onClose() {
          $(this).dialog('destroy');
        },
        buttons: [{
          text: '确定',
          handler() {
            const submitData = {
              bqReserveId: selected.bqReserveId,
              bqRestaurantId: $('#restaurant').combobox('getValue'),	//餐宴 会馆id
              expectedArrivalTime: $('#expectedArrivalTime').datetimebox('getValue'),	//预计抵达时间
              peopleNumer: $('#peopleNumer').textbox('getValue'),	//人数
              contact: $('#contact').textbox('getValue'),	//联系人姓名
              contactPhone: $('#contactPhone').numberbox('getValue'),	//联系人手机
              remark: $('#remark').textbox('getValue')
            };
            function updateScheduledItemCallBack(result) {
              console.info(result);
              if (result > 0) {
                dialog.dialog('close');
                $('#div').dialog('close');
                getList();
                $.messager.show({ title: '系统提示', msg: '编辑成功！', timeout: 3000, showType: 'slide' });
                return;
              }
              if (result == -1) {
                $.messager.show({ title: '系统提示', msg: '编辑失败！预订单不存在！', timeout: 3000, showType: 'slide' });
                return;
              }
              $.messager.show({ title: '系统提示', msg: '编辑失败！', timeout: 3000, showType: 'slide' });
            }
            console.info(submitData);
            eapor.utils.defaultAjax('../bqReserve/updateBqReserve', submitData, updateScheduledItemCallBack);
          }
        }, {
          text: '取消',
          handler() {
            dialog.dialog('close');
          }
        }]
      });
    },
    //取消预订单
    cancelScheduledItem() {
      const selected = $('#scheduledList_scheduledChart').datagrid('getSelected');
      console.info(selected);
      if (!selected) {
        $.messager.show({ title: '系统提示', msg: '请先选择预订单！', timeout: 3000, showType: 'slide' });
        return;
      }
      $.messager.confirm('系统提示', '您确认要取消该预订单吗？', function (r) {
        if (r) {
          function cancelScheduledItemCallBack(result) {
            console.info(result);
            $('#div').dialog('close');
            //刷新。。。
            getList();
          }
          eapor.utils.defaultAjax('../bqReserve/updateBqReserve',
            { bqReserveId: selected.bqReserveId, orderState: 3 }, cancelScheduledItemCallBack);
        }
      });
    },
    //预订开单
    openScheduledItem() {
      const selected = $('#scheduledList_scheduledChart').datagrid('getSelected');
      console.info(selected);
      if (!selected) {
        $.messager.show({ title: '系统提示', msg: '请先选择预订单！', timeout: 3000, showType: 'slide' });
        return;
      }
      sessionStorage.setItem('banquentChartToCreateBillPage', JSON.stringify(selected));
      if ($('#kzmaintable').tabs('exists', '餐宴开单')) {
        $('#kzmaintable').tabs('close', '餐宴开单');
        $('#kzmaintable').tabs('add', {
          title: '餐宴开单',
          closable: true,
          plain: false,
          border: false,
          href: '../client/banquet_createBilling.jsp'
        });
      } else {
        $('#kzmaintable').tabs('add', {
          title: '餐宴开单',
          closable: true,
          plain: false,
          border: false,
          href: '../client/banquet_createBilling.jsp'
        });
      }
      $('#div').dialog('close');
    },
  };
  //显示预订list
  function showScheduledList(arr_) {
    console.info(arr_)
    $('#dialogParent_scheduledChart').append(`
			<div id="div">
				<table id="scheduledList_scheduledChart"></table>
			</div>
		`);
    let onlySelectedOneRowFlag_scheduledChart = 0,
      rowSelect_scheduledChart = null;
    $('#scheduledList_scheduledChart').datagrid({
      title: '', 		//表格标题
      iconCls: 'icon-list',  //表格图标
      nowrap: false, 		//是否只显示一行，即文本过多是否省略部分。
      fitColumns: true, 		//防止水平滚动
      scrollbarSize: 0, 		//去掉右侧滚动条列
      collapsible: false,	//是否可折叠的 
      loadMsg: "loading....",
      singleSelect: true,
      fit: true,
      data: arr_,
      rownumbers: true,
      checkOnSelect: false,//如果为false，当用户仅在点击该复选框的时候才会呗选中或取消。
      onLoadSuccess() {
        $(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility = "hidden";
      },
      onClickRow(rowIndex, rowData) {
        if (onlySelectedOneRowFlag_scheduledChart == 2) {
          onlySelectedOneRowFlag_scheduledChart = 0;
          return;
        } else {
          onlySelectedOneRowFlag_scheduledChart = 1;
        }
        const rows = $(this).datagrid('getChecked');
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
          rowSelect_scheduledChart = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_scheduledChart = null;
        }
        onlySelectedOneRowFlag_scheduledChart = 0;
      },
      onCheck(rowIndex, rowData) {
        if (onlySelectedOneRowFlag_scheduledChart == 2) {
          return;
        }
        if (onlySelectedOneRowFlag_scheduledChart == 1) {
          onlySelectedOneRowFlag_scheduledChart = 0;
          return;
        } else {
          onlySelectedOneRowFlag_scheduledChart = 2;
        }
        if (rowData != rowSelect_scheduledChart) {
          $(this).datagrid('checkRow', rowIndex);
          $(this).datagrid('selectRow', rowIndex);
          rowSelect_scheduledChart = $(this).datagrid('getSelected');
        } else {
          $(this).datagrid('uncheckRow', rowIndex);
          $(this).datagrid('unselectRow', rowIndex);
          rowSelect_scheduledChart = null;
        }
        onlySelectedOneRowFlag_scheduledChart = 0;
      },
      toolbar: [{
        text: '编辑预订',
        iconCls: 'icon-edit',
        handler() {
          menuTodo.updateScheduledItem();
        }
      }, '-', {
        text: '取消预订',
        iconCls: 'icon-remove',
        handler() {
          menuTodo.cancelScheduledItem();
        }
      }, '-', {
        text: '预订开台',
        iconCls: 'icon-save',
        handler() {
          menuTodo.openScheduledItem();
        }
      }],
      columns: [[
        { field: 'banquetReceptionId', title: 'banquetReceptionId', width: 20, align: 'center', hidden: true },
        { field: 'billAmount', title: 'billAmount', width: 20, align: 'center', hidden: true },

        { field: 'ck', title: '', checkbox: true },
        { field: 'expectedArrivalTime', title: '到店时间', width: 30, align: 'center' },
        {
          field: 'peopleNumer', title: '餐宴人数', width: 12, align: 'center',
          formatter(value, row, index) {
            return value + "人";
          }
        },
        { field: 'guestName', title: '联系姓名', width: 20, align: 'center' },
        { field: 'guestPhone', title: '联系手机', width: 20, align: 'center' },
        { field: 'remark', title: '预订备注', width: 25, align: 'center' },
        {
          field: 'st', title: '预订状态', width: 16, align: 'center',
          formatter(value, row, index) {
            return "有效";
          }
        }
      ]]
    });
    const dialog = $('#div');
    dialog.dialog({
      title: '预订单列表',
      width: 800,
      height: 460,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '取消',
        handler() {
          dialog.dialog('close');
        }
      }]
    });
  }
  //搜索
  $('#search_scheduledChart').on('click', function () {
    if (searchFlag) {
      return;
    }
    getList();
  });
  function getList() {
    const submitData = {
      date: $('#hallDate_scheduledChart').datebox('getValue') == "" ? getDate(new Date()).slice(0, 10) :
        $('#hallDate_scheduledChart').datebox('getValue'),
      bqRestaurantName: $('#hallNum_scheduledChart').textbox('getValue'),
      bqLocationId: $('#position_scheduledChart').combobox('getValue') == "" ? 0 :
        $('#position_scheduledChart').combobox('getValue')
    };
    console.info(submitData);
    searchFlag = true;
    $('#search_scheduledChart').linkbutton('disable');
    $('#srcontains_scheduledChart').append(`
			<div id="reloading_scheduledChart" style="font-size:150%;text-align:center;position: absolute;top: 0;
				width:100%;height:100%;background-color: rgba(227,227,227,0.5);">
				<i class="fa fa-spinner fa-spin"></i>&nbsp;加载中...
			</div>
		`);
    function getListCallBack(result) {
      searchFlag = false;
      $('#search_scheduledChart').linkbutton('enable');
      showChart(result);
    }
    eapor.utils.defaultAjax('../banquet/getBqReserveChart', submitData, getListCallBack);
  }
  function showChart(result) {
    //searchFlag = false;
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    const parentDiv = $('#srcontains_scheduledChart');
    parentDiv.empty();
    result.forEach(function (item, key, obj) {
      const restaurantDetails = item.restaurantDetails;
      if (restaurantDetails.length > 0) {
        let id_ = "scheduledFloor" + item.banquetLocationId;
        parentDiv.append(
          '<div id="scheduled' + id_ + '"></div>'
        );
        let block = $('#scheduled' + id_);
        restaurantDetails.forEach(function (i, k, o) {
          let restaurantInfo = i.restaurantInfo;//厅台信息obj
          let banquetChartInfos = i.banquetChartInfos;//预订单信息arr

          let blockId = "scheduledBlock" + restaurantInfo.restaurantId;
          let scheduledState = restaurantInfo.state == 1 ? "scheduledStateHave" : "scheduledStateEmpty";
          if (banquetChartInfos.length > 0) {
            block.append(`
						<div id='${blockId}' name="banquetChartBlock" class='${scheduledState}' 
							data-obj='${Base.encode(JSON.stringify(i))}'
					    	style="cursor:pointer;text-align:center;font-size:16px;color:white;float:left;
					    			width: 120px;min-height:120px;margin: 5px 5px;box-sizing: border-box;">
				    		<p>${restaurantInfo.restaurantName}</p>
							<p style="font-size:12px;">最大人数：${restaurantInfo.maxPeople}</p>
					`);
            banquetChartInfos.forEach(function (item, key, obj) {
              $('#' + blockId).append(`
								<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;
									border-top:1px solid #fff;">
									<i class="fa fa-calendar" aria-hidden="true">&nbsp;${item.expectedArrivalTime.slice(11, 16)}</i>
								</p>
								<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
									<i class="fa fa-male fa-lg" aria-hidden="true">&nbsp;${item.peopleNumer}</i>
								</p>
								<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
									<i class="fa fa-user-circle" aria-hidden="true">&nbsp;${item.guestName}</i>
								</p>
								<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
									 <i class="fa fa-phone" aria-hidden="true">&nbsp;${item.guestPhone}</i>
								</p>
								<p class="easyui-tooltip" title="${item.remark}" style="padding-top:2px;text-align: left;
									font-size: 12px;padding-left:5px;display: -webkit-box;-webkit-box-orient: vertical;
									-webkit-line-clamp: 2;overflow: hidden;padding-bottom:2px;">
									<i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;${item.remark}</i>
								</p>
						`);
            });
            block.append(`</div>`);
          } else {
            block.append(`
							 <div id='${blockId}' name="banquetChartBlock" class='${scheduledState}' 
								data-obj='${Base.encode(JSON.stringify(i))}'
							    	style="cursor:pointer;text-align:center;font-size:16px;color:black;float:left;
							    			width: 120px;height: 130px;margin: 5px 5px;box-sizing: border-box;">
							    	<p>${restaurantInfo.restaurantName}</p>
							    	<p style="font-size:12px;">最大人数：${restaurantInfo.maxPeople}</p>
						     </div>
						`);
          }
        });
        block.panel({
          title: '<span style="font-size:15px;margin-left:10px;">' + item.banquetLocationName + '</span>'
        });
      }
    });
    bindLeftClickMenu();
    if (!$("#srcontains_scheduledChart").html()) {
      $('#srcontains_scheduledChart').append(`
					 <div  style="width:100%;height:50px;color:red;font-size:24px;text-align:center;
					 vertical-align: middle;line-height: 50px;">未查询到相关信息！</div>
			 `);
    }
  }

  //block绑定菜单
  function bindLeftClickMenu() {
    $('#srcontains_scheduledChart .scheduledStateHave').on('click', function (e) {
      e.preventDefault();
      $('#saveClickBlockData_scheduledChart').val(Base.decode($(this).attr('data-obj')));
      $('#menuHave_scheduledChart').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    $('#srcontains_scheduledChart .scheduledStateEmpty')
      .on('click', function (e) {
        e.preventDefault();
        $('#saveClickBlockData_scheduledChart').val(Base.decode($(this).attr('data-obj')));
        $('#menuEmpty_scheduledChart').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      });
  }
  //根据 会馆id 局部刷新餐宴预订block数据
  window.scheduledChart_getOneBlockState = function (result) {
    console.info(result);

    const [banquetChartInfos, restaurantInfo] = [result.banquetChartInfos, result.restaurantInfo];
    const blockId = 'scheduledBlock' + restaurantInfo.restaurantId;
    const $block = $('#' + blockId);
    const scheduledState = restaurantInfo.state == 1 ? "scheduledStateHave" : "scheduledStateEmpty";
    $block.empty();
    $block.attr('class', '').addClass(scheduledState).removeAttr('data-obj');
    if (banquetChartInfos.length > 0) {
      $block.append(`
		    		<p>${restaurantInfo.restaurantName}</p>
					<p style="font-size:12px;">最大人数：${restaurantInfo.maxPeople}</p>
			`);
      banquetChartInfos.forEach(function (item, key, obj) {
        $block.append(`
						<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;
							border-top:1px solid #fff;">
							<i class="fa fa-calendar" aria-hidden="true">&nbsp;${item.expectedArrivalTime.slice(11, 16)}</i>
						</p>
						<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
							<i class="fa fa-male fa-lg" aria-hidden="true">&nbsp;${item.peopleNumer}</i>
						</p>
						<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
							<i class="fa fa-user-circle" aria-hidden="true">&nbsp;${item.guestName}</i>
						</p>
						<p style="text-align: left;font-size: 12px;padding-left:5px;padding-top:2px;">
							 <i class="fa fa-phone" aria-hidden="true">&nbsp;${item.guestPhone}</i>
						</p>
						<p class="easyui-tooltip" title="${item.remark}" style="padding-top:2px;text-align: left;
							font-size: 12px;padding-left:5px;display: -webkit-box;-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;overflow: hidden;padding-bottom:2px;">
							<i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;${item.remark}</i>
						</p>
				`).css({
            'cursor': 'pointer', 'text-align': 'center', 'font-size': '16px', 'color': 'white', 'float': 'left',
            'width': '120px', 'height': '130px', 'margin': '5px 5px', 'box-sizing': 'border-box'
          })
      });
    } else {
      $block.append(`
			    	<p>${restaurantInfo.restaurantName}</p>
			    	<p style="font-size:12px;">最大人数：${restaurantInfo.maxPeople}</p>
			`).css({
          'cursor': 'pointer', 'text-align': 'center', 'font-size': '16px', 'color': 'black', 'float': 'left',
          'width': '120px', 'height': '130px', 'margin': '5px 5px', 'box-sizing': 'border-box'
        });
    }
    $block.attr('data-obj', Base.encode(JSON.stringify(result))).off();
    bindLeftClickMenu();
  }

  $(function () {
    const [weekday, today] = [["周日", "周一", "周二", "周三", "周四", "周五", "周六"], new Date()];
    const [todayTime, oneDayTime] = [today.getTime(), 86400000];//24*60*60*1000
    const timeList = [
      todayTime, todayTime + 1 * oneDayTime, todayTime + 2 * oneDayTime, todayTime + 3 * oneDayTime,
      todayTime + 4 * oneDayTime, todayTime + 5 * oneDayTime, todayTime + 6 * oneDayTime,
      todayTime + 7 * oneDayTime, todayTime + 8 * oneDayTime, todayTime + 9 * oneDayTime,
      todayTime + 10 * oneDayTime, todayTime + 11 * oneDayTime, todayTime + 12 * oneDayTime,
      todayTime + 13 * oneDayTime
    ];
    $('#tdo').append(`
			<td data-date="${todayTime}">${today.getMonth() + 1 + "-" + today.getDate()}</td>
			<td data-date="${timeList[1]}">${getDateForHoliday(timeList[1]).slice(5)}</td>
			<td data-date="${timeList[2]}">${getDateForHoliday(timeList[2]).slice(5)}</td>
			<td data-date="${timeList[3]}">${getDateForHoliday(timeList[3]).slice(5)}</td>
			<td data-date="${timeList[4]}">${getDateForHoliday(timeList[4]).slice(5)}</td>
			<td data-date="${timeList[5]}">${getDateForHoliday(timeList[5]).slice(5)}</td>
			<td data-date="${timeList[6]}">${getDateForHoliday(timeList[6]).slice(5)}</td>
			<td data-date="${timeList[7]}">${getDateForHoliday(timeList[7]).slice(5)}</td>
			<td data-date="${timeList[8]}">${getDateForHoliday(timeList[8]).slice(5)}</td>
			<td data-date="${timeList[9]}">${getDateForHoliday(timeList[9]).slice(5)}</td>
			<td data-date="${timeList[10]}">${getDateForHoliday(timeList[10]).slice(5)}</td>
			<td data-date="${timeList[11]}">${getDateForHoliday(timeList[11]).slice(5)}</td>
			<td data-date="${timeList[12]}">${getDateForHoliday(timeList[12]).slice(5)}</td>
			<td data-date="${timeList[13]}">${getDateForHoliday(timeList[13]).slice(5)}</td>
			<td rowspan="2">日期<br>选择</td>
		`);
    $('#ttd').append(`
				<td data-date=${todayTime}>${weekday[new Date(todayTime).getDay()]}</td>
				<td data-date=${timeList[1]}>${weekday[new Date(timeList[1]).getDay()]}</td>
				<td data-date=${timeList[2]}>${weekday[new Date(timeList[2]).getDay()]}</td>
				<td data-date=${timeList[3]}>${weekday[new Date(timeList[3]).getDay()]}</td>
				<td data-date=${timeList[4]}>${weekday[new Date(timeList[4]).getDay()]}</td>
				<td data-date=${timeList[5]}>${weekday[new Date(timeList[5]).getDay()]}</td>
				<td data-date=${timeList[6]}>${weekday[new Date(timeList[6]).getDay()]}</td>
				<td data-date=${timeList[7]}>${weekday[new Date(timeList[7]).getDay()]}</td>
				<td data-date=${timeList[8]}>${weekday[new Date(timeList[8]).getDay()]}</td>
				<td data-date=${timeList[9]}>${weekday[new Date(timeList[9]).getDay()]}</td>
				<td data-date=${timeList[10]}>${weekday[new Date(timeList[10]).getDay()]}</td>
				<td data-date=${timeList[11]}>${weekday[new Date(timeList[11]).getDay()]}</td>
				<td data-date=${timeList[12]}>${weekday[new Date(timeList[12]).getDay()]}</td>
				<td data-date=${timeList[13]}>${weekday[new Date(timeList[13]).getDay()]}</td>
		`);
    $('#head_banquetSC').on('click', function (e) {
      const data = e.target.dataset.date;
      console.info(data);
      if (data) {
        $('#hallDate_scheduledChart').datebox('setValue', getDateForHoliday(data * 1));
      } else {
        $('#hallDate_scheduledChart').next().find('.textbox-icon.combo-arrow').trigger('click');
      }
    });
    //init chart
    (function () {
      searchFlag = true;
      $.ajax({
        type: 'post',
        url: '../banquet/getBqReserveChart',
        data: {
          date: getDate(new Date()).slice(0, 10),
          bqRestaurantName: "",
          bqLocationId: 0
        },
        dataType: 'json'
      })
        .done(function (data) {
          console.info(data);
          searchFlag = false;
          showChart(data);
        })
        .fail(function (err) {
          console.info(err);
        });
    })();
  });
})();