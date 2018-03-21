/**
 *@jsname:餐宴图
 */
~(function () {
  "use strict";
  //初始化
  //厅台号
  $('#hallNum_banquetChart').textbox({

  });
  //位置
  $('#position_banquetChart').combobox({
    valueField: 'banquetLocationId',
    textField: 'banquetLocationName',
    url: '../banquet/listBanquetLocation',
    queryParams: {
      banquetLocationName: '',
      offset: 0,
      limit: 9999999
    },
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200,
    loadFilter(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return [];
      }
      data.unshift({ banquetLocationId: 0, banquetLocationName: '全部' });
      return data;
    }
  });
  //厅台状态 0全部  1净台  2开台  3脏台 /
  $('#hallState_banquetChart').combobox({
    valueField: 'id',
    textField: 'text',
    data: [{
      "id": 0,
      "text": "全部",
      "selected": true
    }, {
      "id": 1,
      "text": "净台"
    }, {
      "id": 2,
      "text": "开台"
    }, {
      "id": 3,
      "text": "脏台"
    }],
    editable: false,
    panelHeight: 'auto',
    panelMaxHeight: 200

  });
  //执行菜单所点击的事件
  function doMenuClickEvent(name, state, comboboxData) {
    console.info(name);
    console.info(state);
    console.info(comboboxData);
    switch (name) {
      case "createBill_banquetChart":
        const obj1 = $('#saveClickBlockData_banquetChart').val();
        sessionStorage.setItem('banquentChartToCreateBillPage', obj1);
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
        break;
      case "showBill_banquetChart":
        console.info("showBill");
        const obj2 = $('#saveClickBlockData_banquetChart').val();
        console.info(obj2);
        if (!JSON.parse(obj2).guestObj) {
          $.messager.alert('系统提示', '该厅台未查询到宾客账单！');
          return;
        }
        sessionStorage.setItem('banquentChartToBillPage', obj2);
        if ($('#kzmaintable').tabs('exists', '餐宴账单')) {
          $.messager.confirm('系统提示', '餐宴账单页面已存在，是否继续跳转 ？', function (r) {
            if (r) {
              $('#kzmaintable').tabs('close', '餐宴账单');
              $('#kzmaintable').tabs('add', {
                title: '餐宴账单',
                closable: true,
                plain: false,
                border: false,
                href: '../client/banquet_bill.jsp'
              });
            }
          });
        } else {
          $('#kzmaintable').tabs('add', {
            title: '餐宴账单',
            closable: true,
            plain: false,
            border: false,
            href: '../client/banquet_bill.jsp'
          });
        }
        break;
      case "remark_banquetChart":
        const obj3 = $('#saveClickBlockData_banquetChart').val();
        if (!JSON.parse(obj3).guestObj) {
          $.messager.alert('系统提示', '该厅台未查询到宾客账单！');
          return;
        }
        editRemark(obj3);
        break;
      case "updateState_banquetChart":
        updateState(state, comboboxData);
        break;
    }

  }
  function editRemark(obj) {
    const O = JSON.parse(obj);
    const RObj = JSON.parse(O.obj);
    const guestObj = JSON.parse(O.guestObj);

    $('#updateStateDialog_banquetChart').append(`
			<div id="div" style="padding:20px 0 0 30px;">
				<input id="remark"  style="width:200px;"
						label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
		`);
    $('#remark').textbox({
      multiline: true,
      validType: ['maxLength[32]'],
      invalidMessage: "最大输入长度为32个字符",
      validateOnCreate: false,//为true时在创建该组件时就进行验证
      validateOnBlur: true,  //为true时在该组件失去焦点的时候进行验证
      delay: 1000
    });
    $('#remark').textbox('setValue', guestObj.remark);
    const dialog = $('#div');
    dialog.dialog({
      title: '编辑备注',
      width: 300,
      height: 160,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler() {
          if (!$('#remark').textbox('isValid')) {
            $('#remark').textbox('textbox').focus();
            return;
          }
          const submitData = {
            banquetReceptionId: guestObj.banquetReceptionId,
            remark: $('#remark').textbox('getValue')
          };
          function editRemarkCallBack(result) {
            console.info(result);
            if (result > 0) {
              $.messager.show({ title: '系统提示', msg: '操作成功！', timeout: 3000 });
              dialog.dialog('close');
              //刷新...
              console.info(RObj);
              eapor.utils.banquetChart_successRefreshType(RObj.restaurantId);
              return;
            }
            $.messager.show({ title: '系统提示', msg: '操作失败！', timeout: 3000 });
          }
          console.info(submitData);
          eapor.utils.defaultAjax("../banquetBill/updateBqReceptionLetters", submitData, editRemarkCallBack);
        }
      }, {
        text: '取消',
        handler() {
          dialog.dialog('close');
        }
      }]
    });
  }
  //初始化左键菜单绑定事件
  $('#menuClean_banquetChart').menu({
    onClick(item) {
      let comboboxData = [{ "id": 2, "text": "开台" }, { "id": 3, "text": "脏台" }];
      doMenuClickEvent(item.name, 1, comboboxData);
    }
  });
  $('#menuDirty_banquetChart').menu({
    onClick(item) {
      let comboboxData = [{ "id": 2, "text": "开台" }, { "id": 1, "text": "净台" }];
      doMenuClickEvent(item.name, 2, comboboxData);
    }
  });
  $('#menuCreate_banquetChart').menu({
    onClick(item) {
      //let comboboxData = [];
      doMenuClickEvent(item.name, 3, []);
    }
  });
  $('#menuCreateNoBill_banquetChart').menu({
    onClick(item) {
      let comboboxData = [{ "id": 3, "text": "脏台" }];
      doMenuClickEvent(item.name, 3, comboboxData);
    }
  });
  /*	$('#menuOrder_banquetChart').menu({    
        onClick:function(item){  
          //let comboboxData = [{"id":3,"text":"开台"}];
          doMenuClickEvent(item.name, 4);
        }    
    });
    $('#menuSelf_banquetChart').menu({    
        onClick:function(item){  
          let comboboxData = [{ "id":1,"text":"净台"},{"id":2,"text":"脏台"}];
          doMenuClickEvent(item.name, 5, comboboxData);
        }    
    });*/

  //修改状态fun
  function updateState(state, comboboxData) {
    let parentDiv = $('#updateStateDialog_banquetChart'),
      obj = JSON.parse($('#saveClickBlockData_banquetChart').val());
    parentDiv.append(`
			<div id="div" style="padding:20px 0 0 30px;">
				<div style="margin-bottom:10px">
					<input id="tableCode" style="width:230px;" disabled label="厅台号：" labelPosition="before" 
						labelAlign="right" labelWidth="100"/>
				</div>
				<div>
					<input id="afterUpdateState" style="width:230px;" label="修改后状态：" labelPosition="before" 
						labelAlign="right" labelWidth="100"/>
				</div>
			</div>
		`);
    let tableCode = $('#tableCode'),
      afterUpdateState = $('#afterUpdateState'),
      dialogDiv = $('#div');

    tableCode.textbox({});
    let _restaurantName = "";
    if (obj.obj) {
      _restaurantName = JSON.parse(obj.obj).restaurantName;
    } else {
      _restaurantName = obj.restaurantName;
    }
    tableCode.textbox('setValue', _restaurantName);
    afterUpdateState.combobox({
      data: comboboxData,
      valueField: 'id',
      textField: 'text',
      editable: false,
      panelHeight: 'auto',
      panelMaxHeight: 200,
      required: true,
      missingMessage: "修改后的状态不能为空！",
      delay: 1000,
      validateOnCreate: false,
      validateOnBlur: true
    });

    dialogDiv.dialog({
      title: '修改状态',
      width: 350,
      height: 180,
      closed: false,
      cache: false,
      modal: true,
      onClose() {
        $(this).dialog('destroy');
      },
      buttons: [{
        text: '确定',
        handler() {
          if (!afterUpdateState.combobox('isValid')) {
            afterUpdateState.combobox('textbox').focus();
            $.messager.show({ title: '系统提示', msg: '修改后的状态不能为空！', timeout: 3000, showType: 'slide' });
            return;
          }
          let submitState = afterUpdateState.combobox('getValue');
          console.info(obj);
          let _restaurantId = 0;
          if (obj.obj) {
            _restaurantId = JSON.parse(obj.obj).restaurantId;
          } else {
            _restaurantId = obj.restaurantId;
          }
          let submitData = {
            banquetRestaurantId: _restaurantId,
            updateState: 1 * submitState
          };
          console.info(submitData);
          $.ajax({
            type: 'post',
            url: '../banquet/updateChartState',
            data: submitData,
            dataType: 'json'
          })
            .done(function (data) {
              console.info(data);
              if (data > 0) {
                eapor.utils.banquetChart_successRefreshType(_restaurantId);
                $.messager.show({ title: '系统提示', msg: '修改成功！', timeout: 3000, showType: 'slide' });
                const itemBlock = $('#banquetBlock' + _restaurantId);
                refreshBlockLeftClick({ state: submitState, blockObj: itemBlock });
                dialogDiv.dialog('close');
              } else {
                $.messager.show({ title: '系统提示', msg: '修改失败！', timeout: 3000, showType: 'slide' });
              }
            })
            .fail(function (data) {
              console.info(data);
            });
          /*修改餐宴会馆状态
          url：banquet/updateChartState
          method：POST
          参数：	long banquetRestaurantId,厅台id
              int updateState修改后的状态
          返回值类型：int
          返回值：
                -1：该会馆不存在
                  -2：不符合关系，不允许修改
            
                  修改关系：
                  1净台  ->  3脏台  4预订  5自用
                  2开台  ->  3脏台
                  3脏台  ->  1净台  4预订  5自用
                  4预订  ->
                  5自用  ->  1净台  3脏台  4预订*/
        }
      }, {
        text: '取消',
        handler() {
          dialogDiv.dialog('close');
        }
      }]
    });
  }

  function showSearch(se) {
    let inputHallNum = $('#hallNum_banquetChart').textbox('getValue'),
      inputPosition = $('#position_banquetChart').combobox('getValue'),
      inputHallState = $('#hallState_banquetChart').combobox('getValue');
    getChart(inputHallNum, inputPosition, inputHallState);
  }
  //搜索 
  let searchFlag = false;
  $('#search_banquetChart').on('click', function () {

    if (searchFlag) {
      return;
    } else {
      showSearch();
      searchFlag = true;
      $(this).linkbutton('disable');
    }
  });

  //restaurantName,/厅台名称，可为""/
  //long banquetLocationId,/位置id，可为0/
  //int restaurantState/厅台状态，0全部  1净台  2开台  3脏台 /

  function showChart(result) {
    console.info(result);
    if (eapor.utils.ajaxCallBackErrInfo(result)) {
      return;
    }
    let parentDiv = $('#srcontains_banquetChart');
    parentDiv.empty();
    result.forEach(function (item, key, obj) {
      let restaurantDetails = item.restaurantDetails;
      if (restaurantDetails.length > 0) {
        let id_ = "banquetFloor" + item.banquetLocationId;
        parentDiv.append(
          '<div id=' + id_ + '></div>'
        );
        let block = $('#' + id_);
        restaurantDetails.forEach(function (i, k, o) {
          let restaurantInfo = i.restaurantInfo;
          let banquetChartInfos = i.banquetChartInfos;

          let blockId = "banquetBlock" + restaurantInfo.restaurantId;
          let strBlock = restaurantInfo;
          let classState = restaurantInfo.state;
          if (classState == 5) {
            classState = 6;
          } else if (classState == 2) {
            classState = 3;
          } else if (classState == 3) {
            classState = 2;
          }
          if (banquetChartInfos.length > 0) {
            block.append(`
							 <div id='${blockId}' name='banquetChartBlockHasBill' class=${'back' + classState} data-obj='${Base.encode(JSON.stringify(strBlock))}'
								data-guestObj='${JSON.stringify(banquetChartInfos[0])}'
							    	style="cursor:pointer;text-align:center;font-size:16px;color:white;float:left;
							    			width: 120px;height: 120px;margin: 5px 5px;box-sizing: border-box;">
							    	<p>${restaurantInfo.restaurantName}</p>
									<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
										<i class="fa fa-user-circle" aria-hidden="true">&nbsp;${banquetChartInfos[0].guestName}</i>
									</p>
									<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
										 <i class="fa fa-phone" aria-hidden="true">&nbsp;${banquetChartInfos[0].guestPhone}</i>
									</p>
									<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
										<i class="fa fa-male fa-lg" aria-hidden="true">&nbsp;${banquetChartInfos[0].peopleNumer}</i>
									</p>
									<p class="easyui-tooltip" title="${banquetChartInfos[0].remark}" style="margin-top:2px;text-align: left;font-size: 14px;padding-left:5px;
									display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden">
										<i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;${banquetChartInfos[0].remark}</i>
									</p>
							    </div>
						`);
          } else {
            block.append(`
							 <div id="${blockId}" name="banquetChartBlockNoBill" class=${'back' + classState} data-obj='${Base.encode(JSON.stringify(strBlock))}'
							    	style="cursor:pointer;text-align:center;font-size:16px;color:white;float:left;
							    			width: 120px;height: 120px;margin: 5px 5px;box-sizing: border-box;">
							    	<p>${restaurantInfo.restaurantName}</p>
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

    if (!$("#srcontains_banquetChart").html()) {
      $('#srcontains_banquetChart').append(`
					 <div  style="width:100%;height:50px;color:red;font-size:24px;text-align:center;
					 vertical-align: middle;line-height: 50px;">未查询到相关信息！</div>
			 `);
    }
  }

  //给每种状态绑定鼠标左键事件
  function bindLeftClickMenu() {
    $('#srcontains_banquetChart .back1').on('click', function (e) {
      e.preventDefault();
      $('#saveClickBlockData_banquetChart').val(Base.decode($(this).attr('data-obj')));
      $('#menuClean_banquetChart').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    $('#srcontains_banquetChart .back2').on('click', function (e) {
      e.preventDefault();
      $('#saveClickBlockData_banquetChart').val(Base.decode($(this).attr('data-obj')));
      $('#menuDirty_banquetChart').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    $('#srcontains_banquetChart .back3[name="banquetChartBlockHasBill"]').on('click', function (e) {
      e.preventDefault();
      let data = {
        obj: Base.decode($(this).attr('data-obj')),
        guestObj: $(this).attr('data-guestObj')
      };
      $('#saveClickBlockData_banquetChart').val(JSON.stringify(data));
      $('#menuCreate_banquetChart').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
    $('#srcontains_banquetChart .back3[name="banquetChartBlockNoBill"]').on('click', function (e) {
      e.preventDefault();
      let data = {
        obj: Base.decode($(this).attr('data-obj')),
        guestObj: $(this).attr('data-guestObj')
      };
      $('#saveClickBlockData_banquetChart').val(JSON.stringify(data));
      $('#menuCreateNoBill_banquetChart').menu('show', {
        left: e.pageX,
        top: e.pageY
      });
    });
  }
  //根据搜索条件得到 餐宴图
  function getChart(inputHallNum, inputPosition, inputHallState) {
    let subData = {
      restaurantName: inputHallNum,
      banquetLocationId: inputPosition ? inputPosition : 0,
      restaurantState: inputHallState ? inputHallState : 0
    };
    console.info(subData);
    $.ajax({
      type: 'post',
      url: '../banquet/getBanquetChart',
      data: subData,
      dataType: 'json'
    })
      .done(function (data) {
        searchFlag = false;
        $('#search_banquetChart').linkbutton('enable');
        if ($('#loading_banquetChart').is(':visible')) {
          $('#loading_banquetChart').hide();
        }
        showChart(data);
      })
      .fail(function (err) {
        console.info(err);
      });
  }
  function refreshBlockLeftClick(param) {
    console.info(param);
    const classState = param.state;
    const itemBlock = param.blockObj;
    if (classState == 1) {
      itemBlock.on('click', function (e) {
        e.preventDefault();
        $('#saveClickBlockData_banquetChart').val(Base.decode($(this).attr('data-obj')));
        $('#menuClean_banquetChart').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      });
    } else if (classState == 2) {
      itemBlock.on('click', function (e) {
        e.preventDefault();
        $('#saveClickBlockData_banquetChart').val(Base.decode($(this).attr('data-obj')));
        $('#menuDirty_banquetChart').menu('show', {
          left: e.pageX,
          top: e.pageY
        });
      });
    } else if (classState == 3) {
      if (itemBlock.attr('name') == 'banquetChartBlockNoBill') {
        itemBlock.on('click', function (e) {
          e.preventDefault();
          let data = {
            obj: Base.decode($(this).attr('data-obj')),
            guestObj: $(this).attr('data-guestObj')
          };
          $('#saveClickBlockData_banquetChart').val(JSON.stringify(data));
          $('#menuCreateNoBill_banquetChart').menu('show', {
            left: e.pageX,
            top: e.pageY
          });
        });
      } else {
        itemBlock.on('click', function (e) {
          e.preventDefault();
          let data = {
            obj: Base.decode($(this).attr('data-obj')),
            guestObj: $(this).attr('data-guestObj')
          };
          $('#saveClickBlockData_banquetChart').val(JSON.stringify(data));
          $('#menuCreate_banquetChart').menu('show', {
            left: e.pageX,
            top: e.pageY
          });
        });
      }
    }
  }
  //根据单个block信息 更新餐宴图block 数据
  window.banquetChart_getOneBlockState = function (result) {
    console.info(result);
    if ($.isEmptyObject(result)) {
      return;
    }
    const pbReception = result.pbReception;
    const pbRestaurant = result.pbRestaurant;
    let classState = pbRestaurant.state;
    if (classState == 5) {
      classState = 6;
    } else if (classState == 2) {
      classState = 3;
    } else if (classState == 3) {
      classState = 2;
    }
    const itemBlock = $('#banquetBlock' + pbRestaurant.restaurantId);
    const pLenth = itemBlock.find('p').length;
    console.info(pLenth);
    if (pLenth !== 1) {
      const rName = $(itemBlock.find('p')[0]).text();
      itemBlock.empty().append(`<p>${rName}</p>`);
    }
    itemBlock.attr('class', '')
      .addClass('back' + classState)
      .attr('data-obj', Base.encode(JSON.stringify(pbRestaurant)))
      .off('click')
      .attr('name', 'banquetChartBlockNoBill');
    if (pbReception) {//未开单情况下，修改state pbReception为 undefined 
      itemBlock
        .append(
          `<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
					<i class="fa fa-user-circle" aria-hidden="true">&nbsp;${pbReception.guestName}</i>
					</p>
					<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
					<i class="fa fa-phone" aria-hidden="true">&nbsp;${pbReception.guestPhone}</i>
					</p>
					<p style="text-align: left;font-size: 14px;padding-left:5px;margin-top:2px;">
					<i class="fa fa-male fa-lg" aria-hidden="true">&nbsp;${pbReception.peopleNumber}</i>
					</p>
					<p class="easyui-tooltip" title="${pbReception.remark}" style="margin-top:2px;text-align: left;
					font-size: 14px;padding-left:5px;
					display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden">
					<i class="fa fa-pencil-square-o" aria-hidden="true">&nbsp;${pbReception.remark}</i>
					</p>`
        )
        .attr('data-guestObj', JSON.stringify(pbReception))
        .attr('name', 'banquetChartBlockHasBill');
    }
    refreshBlockLeftClick({ state: classState, blockObj: itemBlock });
  }
  getChart("");
})();