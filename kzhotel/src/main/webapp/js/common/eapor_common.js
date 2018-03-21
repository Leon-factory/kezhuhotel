/**
 * @JS名称：公共JS
 * @说明： utils等 初始化数据的加载 
 */
/**
 * JS名称：两进制计算
 * javadill  2017
 * kz co
 */
~(function (window, $) {
  const PubHexbin = {//intsource:如定义的房态图编号为1 则传1   intBit : 第几位
    BBitBinValue(intsource, intBit) {
      let bresult = false;
      const inttmpcmpvaule = 1 << intBit;
      const intresult = intsource & inttmpcmpvaule;
      if (intresult == inttmpcmpvaule) {
        bresult = true;
      }
      return bresult;
    },
    intBitBinValue(intsource, intBit, btrueisone) {//设置有权限，则 btrueisone 为 true 无权限则false
      let intresult = 0;
      if (btrueisone) {
        intresult = intsource | (1 << intBit);
      } else {
        intresult = intsource & (~(1 << intBit));
      }
      return intresult;
    },
    getpostition(intBit) {
      const intbsize = 31;
      const resultobj = {
        quotient: parseInt(intBit / intbsize),
        remainder: intBit % intbsize
      };
      return resultobj;
    },
    Bgetbitvalue(lstarry, intBit) {
      const resultobj = PubHexbin.getpostition(intBit);
      if (resultobj.quotient >= lstarry.length) {
        return false;
      }
      return PubHexbin.BBitBinValue(lstarry[resultobj.quotient], resultobj.remainder);
    }
  };
  //console.info(PubHexbin.BBitBinValue(2147483647,5));
  //console.info(PubHexbin.intBitBinValue(2147483647,5,false));
  //console.info(PubHexbin.BBitBinValue(3,0));
  //console.info(PubHexbin.intBitBinValue(0,30,true));

  window.eapor = {
    createCard: 　{
      hrefUrl_open: "javascript:;",
      hrefUrl_open2: "javascript:;",
      hrefUrl_open3: "javascript:;",
      hrefUrl_open4: "javascript:;",//包价早餐JSP读房卡 查询宾客信息
      loadDataArr: [],
      data: {},
      loadData: {}
    },
		/**
		 * @判断是否有权限.而.显示菜单
		 * @result:teue 有权限，false 无权限
		 */
    getIsMenu(name) {
      return PubHexbin.Bgetbitvalue(eapor.roleList, eapor.roleMap[name]);
    },
		/**
		 * @获得window宽
		 */
    w: window.innerWidth,
		/**
		 * @获得window高
		 */
    h: window.innerHeight,
		/**
		 * @公共的空净房JSP中用于判断连入哪个页面的flag
		 */
    dlgcleanflag: "",
		/**
		 * @点击按钮设置flag.防止多次发送请求
		 * 		点击后改变flag的值，在ajax result里重新将该值该为-1
		 * 		在发送ajax前 判断该值是否为-1
		 */
    clickFlag: true,
    data: {
      hotel: "",
      getNewPaymethodAddOtherPaymenthod: [],
      //选择宾客账单公共页面JS
      //搜索loader函数
      receptionState: 0,
      receptionType: 0,
      createDate: "",
      checkoutDate: "",
      /************------缓存数据------------------------------*************************************/
      receId_getBill: "",//打印前 根据 receId_getBill 得到账页list,用于选择打印哪页账页 （宾客已结账单）
      //存房价，用于开房JSP页，空净房hover显示房价
      rpvip: [], // 会员 全日房 平日价
      rp: [],   // 非会员 全日房 平日价
			/**
			 * @房型
			 */
      allRoomType: [],
      /************------------------------------------*************************************/
      //预离宾客页面跳转到宾客账单、退房页面，退房并结账按钮，
      exitRoomAndGetBill: "",

			/**
			 * 名称：GuestShouldLeaveJSPToExitRoomJSP
			 * 说明：宾客应离店JSP、宾客押金预警JSP 退房btn到退房页面 预存账单信息
			 * 最后编辑时间 2017年4月7日15:08:01
			 */
      GuestShouldLeaveJSPToExitRoomJSP: "",
      index_refreshRoomType: "",
      index_eventCode: "",
      //location  
      exenum: 0,
      wsnum: 0,
      //宾客账单搜索功能
      searceReceptionFlag: "",
			/**
			 * @名称 ：bootStrapFileUploadUrl
			 * @说明：上传文件路径变量
			 */
      bootStrapFileUploadUrl: "http://www.eapor.com",
      //宾客档案无照片显示路径
      guestFileNoPictureUrl: "http://www.eapor.com/upload/NoPic/mmoren.jpg",
      indexEntourageList: "",//房态图鼠标点击选择 住客列表 时候 缓存 对象
      index_roomPriceData: {},//所有房价 缓存对象 
      ReportForm: [{
        "id": 999,
        "text": "日报",
        "children": [{
          'id': 'reportDay_openRoomDetails',
          'text': '开房明细日报'
        }, {
          'id': 'reportDay_changeRoomDetails',
          'text': '换房明细日报'
        }, {
          'id': 'reportDay_continueRoomDetails',
          'text': '续房明细日报'
        }, {
          'id': 'reportDay_checkOutRoomDetails',
          'text': '退房明细日报'
        }, {
          'id': 'reportDay_guestConsumptionDetails',
          'text': '宾客消费明细日报'
        }, {
          'id': 'report_banquetDetails',
          'text': '餐宴消费明细日报'
        }, {
          'id': 'reportDay_goodsConsumptionDetails',
          'text': '商品消费明细日报'
        }, {
          'id': 'reportDay_serviceConsumptionDetails',
          'text': '服务消费明细日报'
        }, {
          'id': 'reportDay_receiveRefundDetails',
          'text': '收退款明细日报'
        }, {
          'id': 'reportDay_guestBillDetails',
          'text': '宾客结账明细日报'
        }, {
          'id': 'reportDay_membersStoredValueDetails',
          'text': '会员储值明细日报'
        }, {
          'id': 'reportDay_receivablesDetails',
          'text': '应收款明细日报'
        }, {
          'id': 'reportDay_receivablesCollectionDetails',
          'text': '应收款收款明细日报'
        }, {
          "id": "reportDay_memberDevelopmentDetails",
          "text": "会员发展明细日报"
        }, {
          "id": "reportDay_memberClosingDetails",
          "text": "会员结账明细日报"
        }]
      }, {
        "id": 998,
        "text": "汇总"
        , "children": [{
          'id': 'summary_guestCheckout',
          'text': '宾客结账汇总表'
        }, {
          'id': 'summary_collection',
          'text': '收款汇总表'
        }, {
          'id': 'summary_guestConsumption',
          'text': '宾客消费汇总表'
        }, {
          'id': 'summary_roomConsumption',
          'text': '房间消费汇总表'
        }, {
          'id': 'summary_banquet',
          'text': '餐宴消费汇总表'
        }, {
          'id': 'summary_goodsConsumption',
          'text': '商品消费汇总表'
        }, {
          'id': 'summary_serviceConsumption',
          'text': '服务消费汇总表'
        }, {
          'id': 'summary_membershipValue',
          'text': '会员储值汇总表'
        }, {
          'id': 'summary_shouldCollection',
          'text': '应收款汇总表'
        }, {
          'id': 'summary_collectionOfReceivables',
          'text': '应收款收款汇总表'
        }, {
          'id': 'summary_memberDevelopment',
          'text': '会员发展汇总表'
        }, {
          'id': 'summary_memberClosing',
          'text': '会员结账汇总表'
        }]
      }, {
        "id": 997,
        "text": "分析",
        "children": [{
          'id': 'analysis_specificRoomConsumption',
          'text': '特定房型消费分析'
        }, {
          'id': 'analysis_banquetConsumption',
          'text': '特定餐宴消费分析',
        }, {
          'id': 'analysis_specificGoodsConsumption',
          'text': '特定商品消费分析'
        }, {
          'id': 'analysis_specificServiceConsumption',
          'text': '特定服务消费分析'
        }, {
          'id': 'analysis_specificChannelConsumption',
          'text': '特定客源消费分析'
        }, {
          'id': 'analysis_RFMOfGuestConsumption',
          'text': '宾客消费RFM分析'
        }, {
          'id': 'analysis_RFMOfMemberConsumption',
          'text': '会员消费RFM分析'
        }, {
          'id': 'analysis_accountManagerPerformance',
          'text': '客户经理业绩分析'
        }, {
          'id': 'analysis_customerValueManager',
          'text': '客户经理储值分析'
        }, {
          'id': 'analysis_accountsReceivableCollection',
          'text': '客户经理应收款收款分析'
        }, {
          'id': 'analysis_memberDevelopment',
          'text': '会员发展分析'
        }]
      }],
      //--------------------------------------------------
      chmenutest: [{
        "id": 1,
        "text": "物业设置",
        "children": [{
          'id': 'hotel_info_manage',
          'text': '酒店基本信息'
        }, {
          'id': 'set_floor',
          'text': '房间位置设置'
        }, {
          'id': 'room_type_list',
          'text': '房型管理'
        }, {
          'id': 'room_list',
          'text': '房间管理'
        }]
      }, {
        "id": 3,
        "text": "房价设置",
        "children": [{
          'id': 'set_weekend_holiday',
          'text': '周末节假设置'
        }, {
          'id': 'room_price_plan',
          'text': '房价方案管理'
        }, {
          'id': 'room_price_manage',
          'text': '房价管理'
        }]
      }, {
        "id": 99,
        "text": "库/商品/服务设置",
        "children": [{
          'id': 'set_warehouse',
          'text': '库管理'
        }, {
          'id': 'supplier',
          'text': '供应商管理'
        }, {
          'id': 'goods_type_list',
          'text': '商品类别管理'
        }, {
          'id': 'goods_list',
          'text': '商品管理'
        }, {
          'id': 'server_type_list',
          'text': '服务类别管理'
        }, {
          'id': 'server_list',
          'text': '服务管理'
        }]
      }, {
        "id": 97,
        "text": "餐宴设置",
        "children": [{
          'id': 'banquet_position_manager',
          'text': '餐宴位置管理'
        }, {
          'id': 'banquet_hall_manager',
          'text': '餐厅会馆管理'
        }, {
          'id': 'banquet_type_manager',
          'text': '餐宴类别管理'
        }, {
          'id': 'banquet_item_manager',
          'text': '餐宴项目管理'
        }]
      }, {
        "id": 98,
        "text": "账号管理",
        "children": [{
          'id': 'user_group',
          'text': '用户组管理'
        }, {
          'id': 'permision_manager',
          'text': '权限管理'
        }, {
          'id': 'employee_manage',
          'text': '用户管理'
        }]
      }, {
        "id": 'set_rule',
        "text": '规则设置',
        "data": "",
        "controller": "syspara"
      }],
      //-----------------------------
			/**
			 * @名称：BillDetailsForDatagridColumns
			 * @说明：用于datagrid的columns中(宾客已结账单、宾客账单、宾客未结账单)
			 * @使用了的JS文件为：1、newGetBill_getBill 2、get_bill.js 3、getUnBill_inquire.js
			 * @最后修改时间：2017年4月7日12:38:19 
			 */
      BillDetailsForDatagridColumns: [
        { field: 'isBreakfast', title: "isBreakfast", align: 'center', width: 15, hidden: true },
        { field: 'breakfastCount', title: "breakfastCount", align: 'center', width: 15, hidden: true },

        { field: 'ck', title: '', checkbox: true },
        {
          field: 'typename', title: "分类", align: 'center', width: 15,
          formatter(value, row, index) {
            if (typeof value !== 'undefined') {
              return value;
            } else {
              return "";
            }
          }
        },
        {
          field: 'date', title: "日期时间", align: 'center', width: 30,
          formatter(value, row, index) {
            if (row.consumeTypeId == 1) {//房间明细显示时间无时分秒
              return getDateForHoliday(value);
            } else {
              return getDateNoSS(value);
            }
          }
        },
        {
          field: 'folio', title: "账页", align: 'center', width: 20,
          formatter(value, row, index) {//row.type 为3 签单 4 坏账 5 免单 6 转出 7转入
            if (row.lockFolio == 1 || row.type == 3 || row.type == 4 || row.type == 5 || row.type == 6) {
              return value + "*";
            } else {
              return value;
            }
          }
        },
        {
          field: 'consumeTypeName', title: "内容", align: 'center', width: 35,
          formatter(value, row, index) {
            if (row.type == 2 && row.consumeTypeId == 1) {//房费
              if (row.isBreakfast) {//0不含 1含有包价早餐
                return value + "/" + row.roomtypeName + "/" + row.roomCode + "/包价早餐" + row.breakfastCount;
              } else {
                return value + "/" + row.roomtypeName + "/" + row.roomCode;
              }
            } else if (row.type == 2 && row.consumeTypeId == 2) {//商品消费
              return value;
            } else if (row.type == 2 && row.consumeTypeId == 3) {//商品消费
              return value;
            } else if (row.type == 2 && row.consumeTypeId == 4) {//餐宴消费
              return "餐费/早餐/" + value + "/" + row.roomCode;
            } else if (row.type == 1) {//支付
              if (row.scene == "退款") {
                if (row.paymethodId == 5) {
                  return "退款/代收（" + row.paymethodName + "）";
                }
                return "退款/" + row.paymethodName;
              } else if (row.scene == "收款") {
                if (row.paymethodId == 5) {
                  return "收款/代收（" + row.paymethodName + "）";
                }
                return "收款/" + row.paymethodName;
              } else {
                if (typeof row.scene === 'undefined') {
                  if (row.paymethodId == 5) {
                    return "收款/代收（" + row.paymethodName + "）";
                  }
                  return "收款/" + row.paymethodName;
                } else 　if (row.paymethodId == 5) {
                  return "收款/" + row.scene + "/代付（" + row.paymethodName + "）";
                } else {
                  return "收款/" + row.scene + "/" + row.paymethodName;
                }
              }
            } else if (row.type == 3 && row.money > 0) {//签单
              return "签单/" + row.creaditChannelName;
            } else if (row.type == 3 && row.money < 0) {//撤销签单
              return "撤销签单/" + row.creaditChannelName;
            } else if (row.type == 4 && row.money > 0) {//坏账
              return "坏账";
            } else if (row.type == 4 && row.money < 0) {//撤销坏账
              return "撤销坏账";
            } else if (row.type == 5 && row.money > 0) {//免单
              return "免单";
            } else if (row.type == 5 && row.money < 0) {//免单
              return "撤销免单";
            } else if (row.type == 6 && row.cancelTransfer == 0) {//cancelTransfer  0非撤销 1撤销
              return "转出";
            } else if (row.type == 6 && row.cancelTransfer == 1) {//撤销
              return "撤销转出";
            } else if (row.type == 7 && row.cancelTransfer == 0) {//
              let conName = "";
              if (row.consumeTypeId == 1) {
                let breakfast = '';
                if (row.breakfastCount > 0) {
                  breakfast = '/包价早餐' + row.breakfastCount;
                }
                return "转入/" + row.consumeTypeName + "/" + row.roomtypeName + "/" + row.roomCode + breakfast;
              } else if (row.consumeTypeId == 2) {
                conName = "商品消费/";
              } else if (row.consumeTypeId == 3) {
                conName = "服务消费/";
              }
              return "转入/" + conName + row.consumeTypeName;
            } else if (row.type == 7 && row.cancelTransfer == 1) {//撤销
              return "撤销转入";
            } else {
              return value;
            }
          }
        },
        {
          field: 'number', title: "数量", align: 'center', width: 10,
          formatter(value, row, index) {
            if (typeof value === 'undefined' || row.type == 6) {
              return "--";
            } else if (row.type == 7 && row.cancelTransfer == 1) {
              return value * -1;
            } else if (row.money < 0 && (row.consumeTypeId == 2 || row.consumeTypeId == 3)) {
              return value;
            } else if (row.money < 0) {
              return value * -1;
            } else {
              return value;
            }
          }
        },
        {
          field: 'price', title: "单价", align: 'center', width: 10,
          formatter(value, row, index) {
            if (value && value != -1) {
              return NP.divide(value, 100);
            } else {
              return "--";
            }
          }
        },
        {
          field: 'money', title: "金额", align: 'center', width: 10,
          formatter(value, row, index) {
            if (row.type == 1 || row.type == 3 || row.type == 4 || row.type == 5 || (row.type == 6 && row.cancelTransfer == 0)) {
              return NP.divide(value, -100);
            } else {
              return NP.divide(value, 100);
            }
          }
        },
        { field: 'remark', title: "备注", align: 'center', width: 20 }],
      //-----------------------------------------------
			/**
			 * 名称：BillDetailsForDatagridColumns_common
			 * 说明：用于datagrid的columns中(宾客押金预警详情按钮、宾客住宿历史详情按钮)
			 * 最后修改时间：2017年4月7日12:38:19 
			 */
      BillDetailsForDatagridColumns_common: [
        {
          field: 'typename', title: "分类", align: 'center', width: 15,
          formatter(value, row, index) {
            if (typeof value !== 'undefined') {
              return value;
            } else {
              return "";
            }
          }
        },
        {
          field: 'date', title: "日期时间", align: 'center', width: 30,
          formatter(value, row, index) {
            if (row.consumeTypeId == 1) {//房间明细显示时间无时分秒
              return getDateForHoliday(value);
            } else {
              return getDateNoSS(value);
            }
          }
        },
        {
          field: 'folio', title: "账页", align: 'center', width: 20,
          formatter(value, row, index) {
            if (row.lockFolio == 1) {
              return value + "*";
            } else if (row.type == 3 || row.type == 4 || row.type == 5 || row.type == 6) {
              return value + "*";
            } else if (row.lockFolio == 0) {
              return value;//row.type 为3 签单 4 坏账 5 免单 6 转出
            } else {
              return value;
            }
          }
        },
        {
          field: 'consumeTypeName', title: "内容", align: 'center', width: 35,
          formatter(value, row, index) {
            if (row.consumeTypeId == 1 && row.type == 2) {//房费
              if (row.isBreakfast) {//0不含 1含有包价早餐
                return value + "/" + row.roomtypeName + "/" + row.roomCode + "/包价早餐" + row.breakfastCount;
              } else {
                return value + "/" + row.roomtypeName + "/" + row.roomCode;
              }
            } else if (row.consumeTypeId == 2 && row.type == 2) {//商品消费
              return value;
            } else if (row.consumeTypeId == 3 && row.type == 2) {//商品消费
              return value;
            } else if (row.consumeTypeId == 4 && row.type == 2) {//餐宴消费
              return "餐费/早餐/" + value + "/" + row.roomCode;
            } else if (row.type == 1) {//支付
              if (row.scene == "退款") {
                if (row.paymethodId == 5) {
                  return "退款/代收（" + row.paymethodName + "）";
                }
                return "退款/" + row.paymethodName;
              } else if (row.scene == "收款") {
                if (row.paymethodId == 5) {
                  return "收款/代收（" + row.paymethodName + "）";
                }
                return "收款/" + row.paymethodName;
              } else {
                if (typeof row.scene === 'undefined') {
                  if (row.paymethodId == 5) {
                    return "收款/代收（" + row.paymethodName + "）";
                  } else {
                    return "收款/" + row.paymethodName;
                  }
                } else 　if (row.paymethodId == 5) {
                  return "收款/" + row.scene + "/代付（" + row.paymethodName + "）";
                } else {
                  return "收款/" + row.scene + "/" + row.paymethodName;
                }
              }
            } else if (row.type == 3 && row.money > 0) {//签单
              return "签单/" + row.creaditChannelName;
            } else if (row.type == 3 && row.money < 0) {//撤销签单
              return "撤销签单/" + row.creaditChannelName;
            } else if (row.type == 4 && row.money > 0) {//坏账
              return "坏账";
            } else if (row.type == 4 && row.money < 0) {//撤销坏账
              return "撤销坏账";
            } else if (row.type == 5 && row.money > 0) {//免单
              return "免单";
            } else if (row.type == 5 && row.money < 0) {//免单
              return "撤销免单";
            } else if (row.type == 6 && row.cancelTransfer == 0) {//cancelTransfer  0非撤销 1撤销
              return "转出";
            } else if (row.type == 6 && row.cancelTransfer == 1) {//撤销
              return "撤销转出";
            } else if (row.type == 7 && row.cancelTransfer == 0) {//
              let conName = "";
              if (row.consumeTypeId == 1) {
                return "转入/" + row.consumeTypeName + "/" + row.roomtypeName + "/" + row.roomCode;
              } else if (row.consumeTypeId == 2) {
                conName = "商品消费/";
              } else if (row.consumeTypeId == 3) {
                conName = "服务消费/";
              }
              return "转入/" + conName + row.consumeTypeName;
            } else if (row.type == 7 && row.cancelTransfer == 1) {//撤销
              return "撤销转入";
            } else {
              return value;
            }
          }
        },
        {
          field: 'number', title: "数量", align: 'center', width: 10,
          formatter(value, row, index) {
            if (typeof value === 'undefined') {
              return "--";
            } else if (row.type == 6) {
              return "--";
            } else if (row.type == 7 && row.cancelTransfer == 1) {
              return value * -1;
            } else if (row.money < 0 && row.consumeTypeId == 2) {
              return value;
            } else if (row.money < 0 && row.consumeTypeId == 3) {
              return value;
            } else if (row.money < 0) {
              return -1 * value;
            } else {
              return value;
            }
          }
        },
        {
          field: 'price', title: "单价", align: 'center', width: 10,
          formatter(value, row, index) {
            if (typeof value === 'undefined') {
              return "--";
            } else if (value != -1) {
              return NP.divide(value, 100);
            } else {
              return "--";
            }
          }
        },
        {
          field: 'money', title: "金额", align: 'center', width: 10,
          formatter(value, row, index) {
            if (row.type == 4 || row.type == 1 || row.type == 5 || row.type == 3) {
              return NP.divide(value, -100);
            } else if (row.type == 6 && row.cancelTransfer == 0) {
              return NP.divide(value, -100);
            } else if (row.type == 7 && row.cancelTransfer == 1) {
              return NP.divide(value, 100);
            } else {
              return NP.divide(value, 100);
            }
          }
        },
        { field: 'remark', title: "备注", align: 'center', width: 20 }],
      //---------------------------
			/**
			 * @菜单data
			 */
      _menu: [{
        roomStatus:
          [{
            'id': 'room_status',
            'name': '房态图'
          }, {
            'id': 'room_open',
            'name': '开房'
          }, {
            'id': 'add_reception',
            'name': '加单'
          }, {
            'id': 'exit_room',
            'name': '退房',
          }, {
            'id': 'continue_room',
            'name': '续房',
          }, {
            'id': 'change_room',
            'name': '换房'
          }, {
            'id': 'get_bill',
            'name': '宾客账单'
          }, {
            'id': 'Entourage',
            'name': '住客查询添加'
          }, {
            'id': 'createCard',
            'name': '制卡销卡'
          }],
        banquet:
          [{
            'id': 'banquet_packageBreakfast',
            'name': '包价早餐'
          }, {
            'id': 'banquet_createBilling',
            'name': '餐宴开单'
          }, {
            'id': 'banquet_bill',
            'name': '餐宴账单'
          }, {
            'id': 'banquet_chart',
            'name': '餐宴图',
          }, {
            'id': 'banquet_scheduledChart',
            'name': '餐宴预订图',
          }],
        scheduled:
          [{
            'id': 'scheduled_new',
            'name': '预订新建'
          }, {
            'id': 'scheduled_edit',
            'name': '有效预订管理'
          }, {
            'id': 'scheduled_inquire',
            'name': '历史预订查询'
          }, {
            'id': 'scheduled_diagram',
            'name': '预订态势图'
          }],
        guestInfo:
          [{
            'id': 'living_guest',
            'name': '在住宾客'
          }, {
            'id': 'arrival_guest',
            'name': '预抵宾客'
          }, {
            'id': 'expected_leave_guest',
            'name': '预离宾客'
          }, {
            'id': 'early_warning_guest',
            'name': '宾客失约预警'
          }, {
            'id': 'guest_arlywarning_shouldleavehotel',
            'name': '宾客应离店预警'
          }, {
            'id': 'guest_warning_deposit',
            'name': '宾客押金预警'
          }, {
            'id': 'history_guest',
            'name': '宾客住宿历史'
          }],
        menuidrelationcustom:
          [{
            'id': 'guest_file',
            'name': '宾客档案'
          }, {
            'id': 'client_memberConsumption',
            'name': '会员消费'
          }, {
            'id': 'client_memberRecharge',
            'name': '会员充值'
          }, {
            'id': 'client_SearchVipAndStoredValue',
            'name': '会员和储值管理'
          }, {
            'id': 'source_group',
            'name': '客源组管理'
          }, {
            'id': 'guest_manage',
            'name': '客源基础管理'
          }, {
            'id': 'client_guestHighLevel_manage',
            'name': '客源高级管理'
          }, {
            'id': 'client_promotion_push',
            'name': '促销推送'
          }, {
            'id': 'client_promotion_push_recording',
            'name': '促销推送记录'
          }],
        onduty:
          [{
            'id': 'accept_onduty',
            'name': '开班和接款'
          }, {
            'id': 'onstatus_onduty',
            'name': '当班记录'
          }, {
            'id': 'audit_onduty',
            'name': '审核'
          }],
        transaction:
          [{
            'id': 'guestUnBill_inquire',
            'name': '宾客未结账单'
          }, {
            'id': 'newGetBill_getBill',
            'name': '宾客已结账单'
          }, {
            'id': 'accountant_balanceOfReceivablesFromCustomers',
            'name': '客源应收款余额统计'
          }, {
            'id': 'accountant_customerReceivableManagement',
            'name': '客源应收款管理'
          }, {
            'id': 'accountant_receivablesReceivablesEntryList',
            'name': '客源应收款收款录入和列表'
          }],
        stock:
          [{
            'id': 'stock_inventory',
            'name': '库存'
          }, {
            'id': 'stock_check',
            'name': '盘点'
          }, {
            'id': 'stock_checkReport',
            'name': '盘点报告'
          }, {
            'id': 'stock_in',
            'name': '入库'
          }, {
            'id': 'stock_inReport',
            'name': '入库报告'
          }, {
            'id': 'stock_out',
            'name': '出库'
          }, {
            'id': 'stock_outReport',
            'name': '出库报告'
          }, {
            'id': 'stock_transfer',
            'name': '调拨'
          }, {
            'id': 'stock_transferReport',
            'name': '调拨报告'
          }],
        hiddenmenu:
          [{
            'id': 'useapplicationlist',
            'name': '使用申请管理'
          }, {
            'id': 'accountmanage',
            'name': '账户管理'
          }]
      }]
    },
    init() {


    },
    //酒店
    hotel: {
      //库名list
      getStockName: [],
      //商品类别list
      getGoodsCategoryName: [],
      //规则obj
      ruleObj: "",
      //所有已设置的房价方案List
      roomPriceManageList: [],
      //服务类别
      getServerName: [],
      //证件类型
      certificateTypeObj: [],
      //是否是节假日周末
      isSpecial: 0,

      /**************缓存数据 start*********************/
			/**
			 * @支付方式
			 */

			/**
			 * @证件类型
			 */

			/**
			 * @楼层位置
			 */

			/**
			 * @房间类型
			 */
      getAllRoomType() {
        if (eapor.data.allRoomType.length != 0) {
          return
        }
        eapor.data.allRoomType = $.ajax({
          type: 'post',
          url: '../roomtype/lrtc',
          data: { limit: 99999, offset: 0, roomtypeName: '' },
          async: false,
          dataType: 'json'
        }).responseJSON;
        return eapor.data.allRoomType;
      }
			/**
			 * @房间状态
			 */

			/**
			 * @客源
			 */
			/**
			 * @库名
			 */

			/**
			 * @商品类型
			 */

			/**
			 * @商品名称
			 */

			/**
			 * @服务类型
			 */

			/**
			 * @服务名称
			 */

			/**
			 * @房价
			 */




      /**************缓存数据 end*********************/
    },
    //用户(操作员)
    user: {

    },
    //宾客
    guest: {

    },
    //初始化
    init: {


    },
    //方法
    utils: {
			/**
			 * @默认的ajax
			 */
      defaultAjax(url, data, callback) {
        $.ajax({
          type: 'post',
          data,
          dataType: 'json',
          url
        })
          .done(function (data, textStatus, jqXHR) {
            if (data == -3335) {
              $.messager.show({
                title: '系统提示', msg: '<span style="color:red;font-size:18px;">网络已断开，请重新登录!</span>', showType: 'slide', timeout: 2800,
                style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
              });
              return;
            }
            if (data == -3333) {
              console.info(data);
              $.messager.show({
                title: '系统提示', msg: '<span style="color:red;font-size:18px;">权限不足，请授权后再访问!</span>', showType: 'slide', timeout: 2800,
                style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
              });
              return;
            }
            callback(data);
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error(url, 'error');
            $.messager.alert("系统提示", "网络连接中断");
            return;
          });
      },
      defaultAjaxHasContentType(url, data, callback) {
        $.ajax({
          type: 'post',
          data,
          dataType: 'json',
          url,
          contentType: 'application/json'
        })
          .done(function (data, textStatus, jqXHR) {
            if (data == -3335) {
              $.messager.show({
                title: '系统提示', msg: '<span style="color:red;font-size:18px;">网络已断开，请重新登录!</span>', showType: 'slide', timeout: 2800,
                style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
              });
              return;
            }
            if (data == -3333) {
              console.info(978);
              $.messager.show({
                title: '系统提示', msg: '<span style="color:red;font-size:18px;">权限不足，请授权后再访问!</span>', showType: 'slide', timeout: 2800,
                style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
              });
              return;
            }
            callback(data);
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error(url, 'error');
            $.messager.alert("系统提示", "网络连接中断");
            return;
          });
      },
			/**
			 * @设置JSP使得layout高度适应屏幕高度
			 */
      layoutHeightSetAuto(layoutDivId) {
        const layoutDiv = window.document.getElementById(layoutDivId);
        layoutDiv.style.height = (eapor.h - 57) + "px";
        layoutDiv.style.minHeight = 580 + "px";
      },
      addPanel(obj) {
        const tbtitlefromhtml = $(obj).text();
        const id = obj.id;
        const bill_receptionId = sessionStorage.getItem('Bill_reception');
        if ($('#kzmaintable').tabs('exists', tbtitlefromhtml)) {//判断菜单tabs是否存在
          //存在的tab为 宾客账单情况下，
          if (tbtitlefromhtml == "宾客账单") {
            //若宾客账单内无数据
            if (!bill_receptionId) {
              //直接选中
              $('#kzmaintable').tabs('select', tbtitlefromhtml);
            } else {
              //若已存在数据，进行提示
              $.messager.confirm('系统提示', tbtitlefromhtml + '页面已存在，是否继续跳转？', function (r) {
                let rId, rCode;

                if (eapor.data.exitRoomAndGetBill) {
                  console.info('111***:', JSON.parse(eapor.data.exitRoomAndGetBill));
                  rId = JSON.parse(eapor.data.exitRoomAndGetBill).receptionId;
                  rCode = JSON.parse(eapor.data.exitRoomAndGetBill).roomCode;
                }
                if ($('#getBillData').val()) {
                  console.info('22****:', JSON.parse($('#getBillData').val()));
                  rId = JSON.parse($('#getBillData').val()).receptionId;
                  rCode = JSON.parse($('#getBillData').val()).roomCode;
                }

                if ($('#index_pubRoomData').val()) {
                  console.info('33****:', JSON.parse($('#index_pubRoomData').val()));
                  rId = JSON.parse($('#index_pubRoomData').val()).receptionId;
                  rCode = JSON.parse($('#index_pubRoomData').val()).roomCode ?
                    JSON.parse($('#index_pubRoomData').val()).roomCode :
                    JSON.parse($('#index_pubRoomData').val()).roomName;
                }
                console.info('**///***:', rId, rCode);
                if (rId == bill_receptionId || typeof rId === 'undefined') {
                  $('#kzmaintable').tabs('select', tbtitlefromhtml);
                } else {
                  eapor.utils.setBillReceptionIdRoomCode(rId, rCode);
                  eapor.utils.defaultAjax('../reception/getReceptionInfo', { receptionId: rId }, eapor.utils.shortInfoAndPoolCallBack);
                  eapor.utils.defaultAjax('../reception/getPaymentAndConsumeByReceptionId', { receptionId: rId }, eapor.utils.detailsCallBack);
                  $('#kzmaintable').tabs('select', tbtitlefromhtml);
                }
              });
            }
          } else {
            $('#kzmaintable').tabs('select', tbtitlefromhtml);
          }
        } else {
          $('#kzmaintable').tabs('add', {
            title: tbtitlefromhtml,
            closable: true,
            plain: false,
            border: false,
            href: '../client/' + id + '.jsp'
          });
        }
      },
			/**
			 * @菜单中生成报表菜单的方法
			 */
      index_topReport() {
        let newmenuchild = "";
        $.each(eapor.data.ReportForm, function (j, menutmp) {
          let _tmp = "";
          if (menutmp.hasOwnProperty("children")) {
            let menuchtmpchild = menutmp.children;
            $.each(menuchtmpchild, function (i, menuchtmp) {
              if (eapor.getIsMenu(menuchtmp.id)) {
                _tmp += " <div id='" + menuchtmp.id + "' name='addPanel_menu'>" + menuchtmp.text + "</div> ";
              }
            });
            if (_tmp) {
              newmenuchild = newmenuchild + "<div><span>" + menutmp.text + "</span>" + "<div style=width:180px;>" +
                _tmp + "</div></div>";
            }
          } else {
            if (eapor.getIsMenu(menutmp.id)) {
              _tmp += " <div id='" + menutmp.id + "' name='addPanel_menu'>" + menutmp.text + "</div> ";
            }
            if (_tmp) {
              newmenuchild = newmenuchild + "<div id='" + menutmp.id + "' name='addPanel_menu'>" + menutmp.text + "</div>";
            }
          }
        });
        if (newmenuchild) {
          newmenuchild = "<div id='mc11' class='easyui-menu'>" + newmenuchild + "</div>";
        }
        return newmenuchild;
      },
			/**
			 * @use:菜单中生成设置菜单的方法
			 */
      index_topSet() {
        let newmenuchild = "";
        $.each(eapor.data.chmenutest, function (j, menutmp) {
          let _tmp = "";
          if (menutmp.hasOwnProperty("children")) {
            let menuchtmpchild = menutmp.children;
            $.each(menuchtmpchild, function (i, menuchtmp) {
              if (eapor.getIsMenu(menuchtmp.id)) {
                _tmp += "<div id='" + menuchtmp.id + "' name='addPanel_menu'>" + menuchtmp.text + "</div>";
              }
            });
            if (_tmp) {
              newmenuchild = newmenuchild + "<div><span>" + menutmp.text + "</span>" + "<div style=width:150px;>" +
                _tmp + "</div></div>";
            }
          } else {
            if (eapor.getIsMenu(menutmp.id)) {
              _tmp += " <div  id='" + menutmp.id + "' name='addPanel_menu'>" + menutmp.text + "</div> ";
            }
            if (_tmp) {
              newmenuchild = newmenuchild + "<div id='" + menutmp.id + "' name='addPanel_menu'>" + menutmp.text + "</div>";
            }
          }
        });
        if (newmenuchild) {
          newmenuchild = "<div id='mc10' class='easyui-menu'>" + newmenuchild + "</div>";
        }
        return newmenuchild;
      },
			/**
			 * 方法名称：从大到小排序
			 * 调用方式：数组.sort(compareBigToSmall('balance'));
			 * 说明：property为数组中要排序的key 如 'balance'【在接口给到的result中根据某个字段进行排序，后将该排序后的结果显示与datagrid中】
			 * 创建时间：2017年4月13日11:53:12
			 * 编辑时间：2017年4月13日11:53:12
			 */
      compareBigToSmall(property) {
        return function (a, b) {
          const value1 = a[property];
          const value2 = b[property];
          return value2 - value1;
        }
      },
			/**
			 * @n：从小到大排序
			 * @use:调用方式：数组.sort(compareBigToSmall('balance'));
			 * @ps : property为数组中要排序的key 如 'balance'【在接口给到的result中根据某个字段进行排序，后将该排序后的结果显示与datagrid中】
			 */
      compareSmallToBig(property) {
        return function (a, b) {
          const value1 = a[property];
          const value2 = b[property];
          return value1 - value2;
        }
      },
			/**
			 * @use:默认的datagrid中转化样式
			 */
      defaultFormatter(value) {
        if (typeof value === 'undefined' || value == "") {
          return "--";
        } else {
          return value;
        }
      },
      commonFunctionByAddFollowGuestInfo(value) {
        if (value == 1) {

        } else {
          $('#hidden_roomOpenJSPAddGuestInfo').val('');
        }

        if ($('#adden_name').textbox('getValue') == "") {
          $.messager.show({ title: '系统提示', msg: '请输入姓名！', timeout: 2000, showType: 'slide' });
          return;
        }
        const enData = {
          guestName: $('#adden_name').textbox('getValue'),
          firstName: $('#adden_name').textbox('getValue'),
          lastName: "",
          phone: $('#adden_phone').numberbox('getValue'),
          address: $('#adden_address').val(),
          certificateType: $('#adden_cardtype').combobox('getValue'),
        };

        let value_ = 1;
        $.each(eapor.hotel.certificateTypeObj, function (i, item) {
          if (enData.certificateType == item.certificate_type_name) {
            value_ = item.certificate_type_code;
            return;
          }
        });
        enData.certificateType = value_;

        if ($('#adden_cardcode').textbox('getValue') == "") {
          $.messager.show({ title: '系统提示', msg: '请输入证件号码！', timeout: 2000, showType: 'slide' });
          return;
        }
        enData.certificateCode = $('#adden_cardcode').textbox('getValue');
        if ($('#hidden_followGuestInfoByReadCard').val() != "") {
          const info = JSON.parse($('#hidden_followGuestInfoByReadCard').val());
          enData.nation = getNationIdReturnNationName(info.nation);
          enData.startTimeLimit = new Date(getDateForHoliday(info.effectiveBeginTime) + " 00:00:00");
          enData.stopTimeLimit = new Date(getDateForHoliday(info.effectiveEndTime) + " 00:00:00");
          enData.issuedOffice = info.idIssue;  // 签发机关
          enData.birthday = new Date(getDateForHoliday(info.birthDay) + " 00:00:00");
          enData.photo = "";
          $('#hidden_followGuestInfoByReadCard').val("");
        } else {
          enData.nation = "";
          enData.startTimeLimit = new Date("1970-01-01 00:00:00");
          enData.stopTimeLimit = new Date("1970-01-01 00:00:00");
          enData.issuedOffice = "";  // 签发机关
          enData.birthday = new Date("1970-01-01 00:00:00");
          enData.photo = "";
        }
        enData.guestId = 0;
        return enData;
      },
			/**
			 * @functionName:指定列求和
			 * @param datagridName
			 * @param colName
			 * @returns
			 */
      compute(datagridName, colName) {
        const rows = $('#' + datagridName).datagrid('getRows');
        let total = 0;
        if (rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            total += parseFloat(rows[i][colName]);
          }
        }
        return total;
      },
			/**
			 * @functionName:根据指定列 求种类的和
			 * @param datagridName
			 * @param colName
			 * @returns
			 */
      computeType(datagridName, colName) {
        const rows = $('#' + datagridName).datagrid('getRows');
        const total = [];
        if (rows.length == 1) {
          return 1;
        } else if (rows.length > 1) {
          for (let i = 0; i < rows.length; i++) {
            if (total.indexOf(rows[i][colName]) == -1) {
              total.push(rows[i][colName]);
            }
          }
        }
        return total.length;
      },
			/**
			 * @use:用于制房卡页面，选择房卡有效时间控件，对时间控件下的btn的增加设置，
			 */
      update_date_utils: {
        _addm(_b4f, f, n) {
          const c = $(_b4f).datetimebox("calendar");
          const t = $(_b4f).datetimebox("spinner");
          const date = c.calendar("options").current;
          let h = t.timespinner("getHours");
          if (f == "H") {
            h += n;
          }
          let m = t.timespinner("getMinutes");
          let x = m % 10;
          if (x > 0 && x < 5) {//1,2,3,4
            m -= x;
          } else if (x > 5 && x < 10) {//6,7,8,9
            m += (10 - x);
          }
          if (f == "M") {
            m += n;
          }
          const s = 0;//t.timespinner("getSeconds");
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
        },
        _b52(_b55, _b56, _b57) {
          const opts = $.data(_b55, "datetimebox").options;
          $(_b55).combo("setValue", _b56);
          if (!_b57) {
            if (_b56) {
              const date = opts.parser.call(_b55, _b56);
              $(_b55).combo("setText", opts.formatter.call(_b55, date));
              $(_b55).combo("setValue", opts.formatter.call(_b55, date));
            } else {
              $(_b55).combo("setText", _b56);
            }
          }
          const date = opts.parser.call(_b55, _b56);
          $(_b55).datetimebox("calendar").calendar("moveTo", date);
          $(_b55).datetimebox("spinner").timespinner("setValue", _b58(date));
          function _b58(date) {
            function _b59(_b5a) {
              return (_b5a < 10 ? "0" : "") + _b5a;
            };
            let tt = [_b59(date.getHours()), _b59(date.getMinutes())];
            if (opts.showSeconds) {
              tt.push(_b59(date.getSeconds()));
            }
            return tt.join($(_b55).datetimebox("spinner").timespinner("options").separator);
          };
        },
        _b53(_b54) {
          const opts = $.data(_b54, "datetimebox").options;
          //放在最外面时(即 window下调用)，去掉this
          const date = this._b4e(_b54);
          //放在最外面时（即 window下调用），去掉this
          this._b52(_b54, opts.formatter.call(_b54, date));
          $(_b54).combo("hidePanel");
        },
        _b4e(_b4f) {
          const c = $(_b4f).datetimebox("calendar");
          const t = $(_b4f).datetimebox("spinner");
          const date = c.calendar("options").current;
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), t.timespinner("getHours"), t.timespinner("getMinutes"), t.timespinner("getSeconds"));
        }
      },//update_date_utils  【end】
      //判断是否是节假日周末
      isSpecial(t) {
        const time = t;
        $.ajax({
          type: 'post', url: '../specialday/isSpecialDay', data: { sometime: time },
          success(result) {
            if (result == 0) {
              $.ajax({
                type: 'post', url: '../specialday/isWeekEnd', data: { sometime: time },
                success(result) {
                  if (result == 0) {
                    eapor.hotel.isSpecial = 1;
                  } else {
                    eapor.hotel.isSpecial = 2;
                  }
                }
              })
            } else {
              eapor.hotel.isSpecial = 3;
            }
          }
        })
      },
			/**
			 * @use : 判断入住方式有无晚房
			 * @parameter : 获取所有房价方案，传入 3个参数【房型、房价方案名称、入住时段】
			 * @return : 入住方式list
			 */
      isEveningRoom(roomTypeId, roomPricePlanId, checkInTimeId) {
        //
        /*console.info(roomTypeId)
        console.info(roomPricePlanId)
        console.info(checkInTimeId)*/
        if (eapor.hotel.roomPriceManageList) {
          const arr = [];
          $.each(eapor.hotel.roomPriceManageList, function (i, item) {
            if (item.rentplanId == roomPricePlanId
              && item.roomtypeId == roomTypeId
              && item.timeinterval == checkInTimeId) {
              //console.info(item);
              arr.push(item.checkinTypeName)
            }
          });

        } else {
          $.messager.show({ title: '系统提示', msg: '未查询到房价方案！', timeout: 5000, showType: 'slide' });
        }
        return arr;
      },
			/**
			 * 根据时间戳 转化为 系统规则设置里的 【下午退房时间】
			 */
      getDateForAfternoonCheckOutTime(time) {
        if (!time) {
          return;
        }
        const date = new Date(time);
        const seperator1 = "-";
        const seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let h = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getHours();
        let m = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getMinutes();
        let s = new Date("1970-01-01 " + JSON.parse($('#index_ruleData').val()).afternoonCheckoutTime).getSeconds();
        if (h >= 0 && h <= 9) {
          h = "0" + h;
        }
        if (m >= 0 && m <= 9) {
          m = "0" + m;
        }
        if (s >= 0 && s <= 9) {
          s = "0" + s;
        }
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + h + seperator2 + m + seperator2 + s;
        return currentdate;
      },
			/**名称：用于搜索提示--》显示 未查询到相关信息 到datagrid表中 进行提示
			 * datagridName:datagrid的tabId
			 * fieldName:datagrid显示的第一个字段名称
			 * colspanNum:合并的列数
			 * shuowInfoNum:显示提示信息编号
			 */
      messagerInfoBySearchEmpty(datagridName, fieldName, colspanNum, showInfoNum) {
        const showInfo = [
          '<span style="color:red;font-size:18px;">未查询到相关信息！</span>'
        ];
        const name = fieldName;
        const datagrid = $('#' + datagridName);
        let data = {};
        data[fieldName] = showInfo[showInfoNum];
        datagrid.datagrid('insertRow', { index: 0, row: data });
        datagrid.datagrid('mergeCells', { index: 0, field: fieldName, colspan: colspanNum });
        datagrid.parent().find(".datagrid-td-rownumber").css("background-color", "#FAFAFA").css("border-color", "#FAFAFA").children('div').html("");
        datagrid.parent().find(".datagrid-td-merged").css("border-bottom-color", "#FAFAFA").parent().css("background-color", "#FAFAFA");
      },
			/**
			 * 权限不足时，显示提示信息
			 */
      noAuthorityMessagerInfo() {
        console.info("权限不足")
        return $.messager.show({
          title: '系统提示', msg: '<span style="color:red;font-size:18px;">权限不足，请授权后再访问!</span>', showType: 'slide', timeout: 2800,
          style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
        });
      },
			/**
			 * 当后台未拿到userId时，接口返回-3335，显示提示信息
			 */
      noGetUserIdMessagerInfo() {
        return $.messager.show({
          title: '系统提示', msg: '<span style="color:red;font-size:18px;">网络已断开，请重新登录!', showType: 'slide', timeout: 2800,
          style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
        });
      },
			/**
			 * @接口返回的信息 ，进行错误信息集中判断
			 */
      ajaxCallBackErrInfo(result) {
        if (result == -3333) {
          console.info("1422")
          $.messager.show({
            title: '系统提示', msg: '<span style="color:red;font-size:18px;">权限不足，请授权后再访问!</span>', showType: 'slide', timeout: 2800,
            style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
          });
          return true;
        }
        if (result == -3335) {
          $.messager.show({
            title: '系统提示', msg: '<span style="color:red;font-size:18px;">网络已断开，请重新登录!', showType: 'slide', timeout: 2800,
            style: { right: '', top: document.body.scrollTop + document.documentElement.scrollTop, bottom: '' }, height: 'auto'
          });
          return true;
        }
        if (result == -101 || result == -102 || result == -111 || result == -112 || result == -113 || result == -201 || result == -202
          || result == -301 || result == -401 || result == -501 || result == -601 || result == -701 || result == -801
          || result == -901) {
          $.messager.show({ title: '系统提示', msg: '参数错误！' + result, timeout: 2800 });
          return true;
        }
        return false;
      },
			/**
			 * @数组根据下标删除数据
			 * @使用：eapor.utils.arrDelByLenId.call(data,i);
			 * @by cxt 2017-07-13  
			 */
      arrDelByLenId(index) {
        if (isNaN(index) || index >= this.length) {
          return false;
        }
        for (let i = 0, n = 0; i < this.length; i++) {
          if (this[i] != this[index]) {
            this[n++] = this[i];
          }
        }
        this.length -= 1;
      },
			/**
			 * @根据comboboxId得到payId和payName
			 */
      getPayIdAndName(comboxId) {
        const payTypeData = $('#' + comboxId).combobox('getData');
        const paymethodName = $('#' + comboxId).combobox('getText');
        let paymethodCode = 0;
        $.each(payTypeData, function (i, item) {
          if (paymethodName == item.paymethod_name) {
            paymethodCode = item.paymethod_code;
            return;
          }
        });
        const srRoomDetailsPayData = {
          paymethodCode,
          paymethodName: $('#' + comboxId).combobox('getText')
        };

        if (paymethodCode == 5) {
          $.each(payTypeData, function (i, item) {
            if (item.paymethodName == srRoomDetailsPayData.paymethodName) {
              srRoomDetailsPayData.creditChannelId = item.channelId;
              return;
            }
          });
        }
        return srRoomDetailsPayData;
      },
			/**
			 * @如果存在制卡销卡页面则重开该页面
			 */
      ifHaveJSPThenCloseThis() {
        if ($('#kzmaintable').tabs('exists', '制卡销卡')) {
          $('#kzmaintable').tabs('close', '制卡销卡');
          $('#kzmaintable').tabs('add', {
            title: '制卡销卡',
            closable: true,
            plain: false,
            border: false,
            href: '../client/createCard.jsp'
          });
        } else {
          $('#kzmaintable').tabs('add', {
            title: '制卡销卡',
            closable: true,
            plain: false,
            border: false,
            href: '../client/createCard.jsp'
          });
        }
      },
			/**
			 * @局部刷新房态
			 */
      roomOpen_successRefreshRoomType(roomId1, roomId2) {
        console.info("roomOpen_successRefreshRoomType");
        console.info(roomId1);
        console.info(roomId2);
        $.ajax({
          type: 'post',
          url: '../message/chat',
          data: { msg1: roomId1 + "", msg2: roomId2 + "" },
          dataType: 'json'
        });
      },
			/**
			 * @局部刷新餐宴图
			 */
      banquetChart_successRefreshType(bqRestaurantId) {
        console.info("banquetChart_successRefreshType");
        console.info(bqRestaurantId);
        eapor.utils.freshChart_banquet_scheduled(JSON.stringify([{ type: -2, bqRestaurantId }]));
        //				$.ajax({
        //					type:'post',
        //					//url:'../message/bqSend',
        //					url:'../message/bqMessage',
        //					data:{bqRestaurantId: bqRestaurantId},
        //					dataType:'json'
        //				});[{type:-2,id:1},{type:-3,id:2}]
      },
			/**
			 * @局部刷新餐宴预订图
			 */
      scheduledChart_successRefreshType(bqRestaurantId) {
        console.info("scheduledChart_successRefreshType");
        console.info(bqRestaurantId);
        eapor.utils.freshChart_banquet_scheduled(JSON.stringify([{ type: -3, bqRestaurantId }]))
        //				$.ajax({
        //					type:'post',
        //					//url:'../message/bqReserveSend',
        //					url:'../message/bqMessage',
        //					data:{type: ,bqRestaurantId: bqRestaurantId},
        //					dataType:'json'
        //				});
      },
			/**
			 * @局部刷新餐宴图/餐宴预订图
			 */
      freshChart_banquet_scheduled(data) {
        console.info("freshChart_banquet_scheduled");
        console.info(data);
        console.info(data instanceof Array);
        $.ajax({
          type: 'post',
          url: '../message/bqMessage',
          data: { array: data instanceof Array ? JSON.stringify(data) : data },
          dataType: 'json'
        });
      },
			/**右键tabs显示的菜单：快捷关闭tabs功能
			 * @
			 */
      closeTab(menu, type) {
        const allTabs = $("#kzmaintable").tabs('tabs');
        const len = allTabs.length;
        const index = $(menu).data("index");
        console.info(index);
        if ('cur' == type) {
          $("#kzmaintable").tabs("close", index);
        } else if ('all' == type) {//关闭所有tabs
          for (let i = 0; i < len; i++) {//循环关闭第一个tab
            $('#kzmaintable').tabs('close', 0);
          }
        } else if ('oth' == type) {//关闭其他tab
          for (let i = 0; i < len; i++) {
            index > i ? $('#kzmaintable').tabs('close', 0) : $('#kzmaintable').tabs('close', 1);
          }
        }
      }
    }
  };

  $.ajax({
    type: 'post',
    dataType: "json",
    url: '../warehouse/listWarehouse',
    data: {
    	offset: 0,
    	limit: 99999999,
    	warehouseId: 0
    }
  })
    .done(function (result) {
      eapor.hotel.getStockName = result;
    });
  //商品类别
  $.ajax({
    type: 'post',
    dataType: "json",
    url: '../Goodscategory/listGoodscategoryPage',
    data: { limit: 99999, offset: 0, goodsCategoryName: '' }
  })
    .done(function (result) {
      eapor.hotel.getGoodsCategoryName = result;
    });
  //商品名称
  $.ajax({
    type: 'post',
    dataType: "json",
    url: '../Goods/listGoodsPage',
    data: {
      offset: 0,
      limit: 9999999,
      goodsName: "",
      goodsCategoryId: 0,
      saleState: 0//经营状态   1上架 2下架  0全部
    }
  })
    .done(function (result) {
      eapor.hotel.goodsListName = result;
    });
  //房价方案List
  $.ajax({
    type: 'post',
    dataType: "json",
    url: '../rentprice/pglist',
    data: {
      offset: 0,
      limit: 999999,
      rentplanId: 0,//方案id，0表示全部
      roomtypeId: 0,//房型id，0表示全部
      checkinType: 0,//入住方式，0表示全部，1全日房，2钟点房，3晚房
      timeinterval: 0//时段，0表示全部，1平日，2周末，3节日
    }
  })
    .done(function (result) {
      eapor.hotel.roomPriceManageList = result;
    });
  //服务类别
  $.ajax({
    type: 'post',
    url: '../Servicetype/listServicetypePage',
    data: { serviceTypeName: "", limit: 9999, offset: 0 },
    dataType: 'json'
  })
    .done(function (result) {
      eapor.hotel.getServerName = result;
    });
  /*证件类型Obj*/  //#####2016年12月19日15:07:50##### -----last edit by cxt
  $.ajax({
    type: 'post',
    url: "../syspara/getCertificateTypeJson",
    dataType: 'json'
  })
    .done(function (result) {
      eapor.hotel.certificateTypeObj = result;
    });
  //----------------存房价，用于开房JSP页，空净房hover显示房价--------
  $.ajax({
    type: 'post',
    url: '../rentplan/pglist',//非会员 全日房 平日
    data: { offset: 0, limit: 9999, rentplanName: '' },
    dataType: 'json'
  })
    .done(function (result) {
      if (result < 0) {
        return;
      }
      console.info(eapor.utils.ajaxCallBackErrInfo(result));
      if (eapor.utils.ajaxCallBackErrInfo(result)) {
        return;
      }
      result.forEach(function (item, key, obj) {
        if (item.rentplanName === '会员价') {
          $.ajax({
            type: 'post',
            url: '../rentprice/pglist',//会员 全日房 平日
            data: { offset: 0, limit: 9999, rentplanId: item.rentplanId, roomtypeId: 0, checkinType: 1, timeinterval: 1 },
            dataType: 'json'
          })
            .done(function (result_) {
              eapor.data.rpvip = result_;
            });
        }
        if (item.rentplanName === '非会员价') {
          $.ajax({
            type: 'post',
            url: '../rentprice/pglist',//非会员 全日房 平日
            data: { offset: 0, limit: 9999, rentplanId: item.rentplanId, roomtypeId: 0, checkinType: 1, timeinterval: 1 },
            dataType: 'json'
          })
            .done(function (_result) {
              eapor.data.rp = _result;
            });
        }
      });
    });
})(window, window.jQuery);