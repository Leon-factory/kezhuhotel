<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
  <meta name="keywords" content="驿宝" />
  <title>驿宝</title>
  <script>
    !function () {
      if (navigator.userAgent.toLowerCase().indexOf("chrome") === -1) {
        alert('请使用谷歌浏览器，否则相关功能将不能正常使用！点击确定后，将自动跳转到下载页面，点击普通下载，进行下载安装！');
        window.location.href = "https://www.baidu.com/s?wd=chrome";
      }
      if (!sessionStorage.getItem('kzhotel_isLogin')) {
        alert('检测到您未登录，请登录后访问！');
        window.location.href = "http://www.eapor.com";
      }
    }();
  </script>
  <%--引用百度地图APIdefer async="true"--%>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=PDzweVAQXotI9pGAyDjzeQWN3U66LS2S&s=1"></script>
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/img/eapolog.ico" />
    <link rel="stylesheet" href="${pageContext.request.contextPath }/js/jquery-easyui-1.5/themes/metro-green/easyui.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath }/js/jquery-easyui-1.5/themes/icon.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath }/css/kzhotel_account_css.css?v=20180120201603" />
    <!-- <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script> -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/md5.min.js"></script>
    <script type="text/javascript" defer async="true" src="${pageContext.request.contextPath }/js/utils/jquery.PrintArea.js"></script>
    <%-- bootstrap文件上传 js引用文件--%>
      <script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
      <!-- <script type="text/javascript" src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.js"></script> -->
      <!-- <script  type="text/javascript" src="//cdn.bootcss.com/bootstrap-fileinput/4.3.7/js/fileinput.js"></script> -->
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/bsupload/fileinput.min.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/bsupload/es.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/bsupload/zh.js"></script>
      <!-- <script type="text/javascript" src="//cdn.bootcss.com/bootstrap-fileinput/4.3.7/js/locales/es.js"></script>
      <script type="text/javascript" src="//cdn.bootcss.com/bootstrap-fileinput/4.3.7/js/locales/zh.js"></script> -->
      <%--字体图标  --%>
      <!-- <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> -->
      <link href="http://libs.baidu.com/fontawesome/4.0.3/css/font-awesome.css" rel="stylesheet" />
      <%-- easyui --%>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/jquery-easyui-1.5/jquery.easyui.min.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/jquery-easyui-1.5/locale/easyui-lang-zh_CN.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/common/my-easyui-validation.js?v=20171106155230"></script>
      <%-- util-js --%>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/base64.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath}/js/utils/csv.js"></script>
      <%-- util-时间转化js --%>
      <script type="text/javascript" src="${pageContext.request.contextPath}/js/utils/moment.min.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath}/js/utils/moment-zh-cn.js"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath}/js/utils/numer-precision.js"></script>
      <%-- 用于显示菜单栏里数据，封装的算法，根据权限不同，显示不同菜单的作用 --%>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/common/helper_common.js?v=20171215181100"></script>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/common/eapor_common.js?v=20171226143837"></script>
      <%-- indexjs--%>
      <script type="text/javascript" src="${pageContext.request.contextPath }/js/common/index.js?v=20171221121102"></script>
      <%--引用百度地图API--%>
      <%-- <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=PDzweVAQXotI9pGAyDjzeQWN3U66LS2S"></script> --%>
      <!-- <script type="text/javascript" defer async="true" src="https://api.map.baidu.com/getscript?v=2.0&ak=caqG8Gdfe7ahDQcDjTKTUldzcqC4REnW"></script> -->
</head>

<body id="kezhunetmainindex" style="margin:0;min-height:100vh;">
  <div style="padding:10px 0 10px 0 ;position: relative;">
    <div>
      <div class="north_menu_left">
        <img alt="" height="20px" width="20px" src="${pageContext.request.contextPath }/img/eapolog.png" />
      </div>
      <div class="north_menu_center">
        <a id="menuidfrontroom">前台</a>
        <a id="menuidbanquet">餐宴</a>
        <a id="menuidbooking">预订</a>
        <a id="menuidguest">宾客</a>
        <a id="menuidrelationcustom">客户关系</a>
        <a id="menuidonduty">当班</a>
        <a id="menuidtransaction">账务</a>
        <a id="menuidstock">库存</a>
        <a id="menuidreport">报表</a>
        <a id="menuidset">设置</a>
        <c:if test="${userinfo.hotelId==1 }">
          <a id="menuidhiddenmenu">内部菜单</a>
        </c:if>
        <audio id="audio" src="http://www.eapor.com/upload/newrecvoice.mp3">
          您的浏览器不支持 audio 标签
        </audio>
      </div>
      <div class="north_menu_right">
        <%-- ${hotelName } --%>
          <span style="margin-right: 10px;">酒店：
            <span id="menu_hotelName"></span>，欢迎您：${userinfo.username}</span>
          <span id="indexquit" class="indexquitcurrent" title="退出系统">
            <i class="fa fa-sign-out fa-lg"></i>退出</span>
      </div>
      <div class="clear"></div>
    </div>

    <div id="index_close" class="easyui-menu" style="display: none;">
      <div id="index_closeCurrentTab" name="cur">关闭当前</div>
      <div id="index_closeAllTab" name="all">关闭全部</div>
      <div id="index_closeOtherTab" name="oth">关闭其他</div>
    </div>
  </div>
  <div class="clear"></div>
  <div style="width:100%;">
    <div id="kzmaintable" class="easyui-tabs" style="width:99%;"></div>
  </div>
  <div style="display:none;">


    <input type="hidden" id="roleList" value="${roleList }" />
    <input type="hidden" id="roleMap" value='${roleMap }' />

    <input type="hidden" id="indexuserId" value="${userinfo.userId }" />
    <input type="hidden" id="indexusername" value="${userinfo.username }" />
    <input type="hidden" id="indexhotelId" value="${userinfo.hotelId }" />
    <input type="hidden" id="succession" value="${succession.successionId }" />
    <input type="hidden" id="successionState" value="${succession.successionState }" />
    <input type="hidden" id="indexmd5" value="${mdCode }" />
    <%--2017-02-06 by wyx 开房卡接口第一步通讯号 --%>
    <input type="hidden" id="indexReceptionId" />
    <%-- 2017-01-10 by wyx  --%>
    <input type="hidden" id="getBill_receptionData" />
    <input type="hidden" id="openRoom_roomData" />
    <input type="hidden" id="openRoomData" />
    <%-- edit by cxt 2016年12月20日10:08:07 --%>
    <input type="hidden" id="exitRoomData" />
    <input type="hidden" id="continueRoomData" />
    <input type="hidden" id="changeRoomData" />
    <input type="hidden" id="index_ruleData" />
    <input type="hidden" id="index_pubRoomData" />
    <input type="hidden" id="index_rightClickData" />
    <%-- roon_open.js 其他页面开房按钮进入 room open 页面时 存储 roomtypeid 以便选择对应房型 --%>
    <input type="hidden" id="index_roomTypeIdByOtherBtnToOpenRoom" />
    <input type="hidden" id="hidden_openRoom_guestInfo" />
    <%-- 存储开房宾客等信息 --%>
    <input type="hidden" id="hidden_outRoom_roomInfo" />
    <%-- 存储开房选择的房间的信息 --%>
    <input type="hidden" id="hidden_lockCode" />
    <%-- 门锁号 --%>
    <input type="hidden" id="hidden_roomId" value="" />
    <%-- 房Id --%>
    <input type="hidden" id="hidden_setHref" value="" />
    <%-- 开房预订单按钮 存值 判断是否是开房页预订单按钮href来的 用于href到预订查询页时 进行当天预订的加载--%>
    <input type="hidden" id="hidden_setHrefIdTime" value="" />
    <%-- 预订查询页面ID 中的时间戳存值--%>
    <input type="hidden" id="hidden_createCardFlag" />
    <%-- 开房页面跳转到制卡页面Flag,制卡完成情空内容   1为开房按钮后选择 进入 制卡页面--%>
    <input type="hidden" id="hidden_roomOpenJSPAddGuestInfo" />
    <%-- 开房页面添加随住客人按钮 ， 确实后保存添加的信息，用于之后开房按钮能取到随住客人信息--%>
    <%-- 房态图鼠标左右键点击制卡菜单时，存取房间信息，在roomStatus_index.js 和 rsRightClick.js 里鼠标左右键房态图时预存的信息 --%>
    <input type="hidden" id="hidden_roomInfoFromRoomStatusByMouseLeftOrRightClick" />
    <input type="hidden" id="hidden_roomStatusToCreateCardFlag" />
    <%-- 房态图 进入制卡 的flag --%>
    <input type="hidden" id="hidden_followGuestInfoByReadCard" />
    <%-- 读二代身份证成功后 onmessage 返回 身份信息 ，存于此处  【 用于暂存读取的信息的】 --%>
    <input type="hidden" id="hidden_roomOpenCutReadInfoFromReadCard" />
    <%-- 开房JSP页面第一次读二代身份证成功后 第一个dialog确认按钮 得到的信息进行预存，在传给接口时使用  --%>
    <input type="hidden" id="hidden_livingRoom_notleave" />
    <%-- 在住房间非预离 勾的flag 空为勾上，非空为 不选择 在一开始进入页面的时候  --%>
  </div>
  <%--打印容器开始--%>
    <div id="print" style="display: none;">
      <style>
        body,
        html,
        ul {
          margin: 0;
          padding: 0;
        }
      </style>
      <h1 style="width: 100%;font-size: 20px;color: #000;text-align: center;float: left;line-height: 45px;">宾客账单</h1>
      <div id="printDivHead" style="width:100%">
        <ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 43%;float: left;">酒店名称：
            <span id="hotelName_printGetBill"></span>
          </li>
          <li style="width: 57%;float: left;">打印日期：
            <span id="printTime_printGetBill"></span>
          </li>
        </ul>
        <ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 43%;float: left;">宾客姓名：
            <span id="guestName_printGetBill"></span>
          </li>
          <li style="width: 57%;float: left;">登记时间：
            <span id="enterTime_printGetBill"></span>
          </li>
        </ul>
        <ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 43%;float: left;">手机号码：
            <span id="phone_printGetBill"></span>
          </li>
          <li style="width: 57%;float: left;">结账时间：
            <span id="leaveTime_printGetBill"></span>
          </li>
        </ul>
        <ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 43%;float: left;">客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：
            <span id="channelName_printGetBill"></span>
          </li>
          <li style="width: 57%;float: left;">房间类型：
            <span id="roomtypeName_printGetBill"></span>
          </li>
        </ul>
        <ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 43%;float: left;">宾客账单：
            <span id="receptionCode_printGetBill"></span>
          </li>
          <li style="width: 57%;float: left;">房间号码：
            <span id="roomCode_printGetBill"></span>
          </li>
        </ul>
      </div>
      <div style="width:100%">
        <ul style="width:100%;font-size:14px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
          <li style="width: 27%;float: left;border-bottom:2px solid #000;">日期/时间</li>
          <li style="width: 5%;text-align:center;float: left;border-bottom:2px solid #000;">页</li>
          <li style="width: 42%;text-align:center;float: left;border-bottom:2px solid #000;">内容</li>
          <li style="width: 14%;text-align:center;float: left;border-bottom:2px solid #000;">数量*单价</li>
          <li style="width: 10%;text-align:center;float: left;border-bottom:2px solid #000;">小计</li>
        </ul>
        <ul id="payDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
        <ul id="consumeDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
        <ul id="billDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
        <ul id="debtDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
        <ul id="freeDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
        <ul id="tranferDetails_printGetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
      </div>
      <div>
        <ul style="width:100%;list-style: none;font-size:12px;float: left;margin-bottom:3px;margin-top:0px;">
          <li style="width: 25%;float: left;">
            <label>支付合计：</label>
            <span id="pay_printGetBill"></span>
          </li>
          <li style="width: 25%;float: left;">
            <label>消费合计：</label>
            <span id="consume_printGetBill"></span>
          </li>
          <li style="width: 25%;float: left;">
            <label>签单合计：</label>
            <span id="bill_printGetBill"></span>
          </li>
          <li style="width: 15%;float: left;">
            <label>余额：</label>
            <span id="printBalance_printGetBill"></span>
          </li>
        </ul>
        <ul style="width:100%;list-style: none;font-size:12px;float: left;margin-bottom:3px;margin-top:20px;">
          <li style="width:50%;float: left;">
            <label>接待员：</label>
            <span id="handler_printGetBill"></span>
          </li>
          <li style="width:49%;float: left;">
            <label>客户签字：</label>
            <span style="display:inline-block;width:130px;border-bottom:1px solid #000;"></span>
          </li>
        </ul>
      </div>
    </div>
    <%--打印容器结束--%>

      <%--打印容器开始--%>
        <div id="printSmall" style="display: none;">
          <style>
            body,
            html,
            ul,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              margin: 0;
              padding: 0;
            }

            .title-printSmall {
              width: 100%;
              font-size: 16px;
              color: #000;
              text-align: center;
              display: block;
            }

            .ul-printSmall {
              width: 100%;
              text-decoration-style: none;
              font-size: 12px;
              line-height: 1.5;
              margin-top: 10px;
            }

            .printSmall li {
              list-style: none;
            }

            .printSmall li~span {
              font-size: 12px;
            }

            #payDetails_printGetBillSmall li,
            #consumeDetails_printGetBillSmall li,
            #billDetails_printGetBillSmall li,
            #debtDetails_printGetBillSmall li,
            #freeDetails_printGetBillSmall li,
            #tranferDetails_printGetBillSmall li,
              {
              list-style: none;
            }
          </style>
          <span class="title-printSmall" id="hotelName_printGetBillSmall"></span>
          <span class="title-printSmall">宾客账单</span>
          <ul class="ul-printSmall">
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印时间:</span>
              <span id="printTime_printGetBillSmall"></span>
            </li>
            <li>
              <span id="receptionCodeTitle_printGetBillSmall">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账单号码:</span>
              <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span id="receptionCode_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宾客姓名:</span>
              <span id="guestName_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源:</span>
              <span id="channelName_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;房间类型:</span>
              <span id="roomtypeName_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;房间号码:</span>
              <span id="roomCode_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号码:</span>
              <span id="phone_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登记时间:</span>
              <span id="enterTime_printGetBillSmall"></span>
            </li>
            <li>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结账时间:</span>
              <span id="leaveTime_printGetBillSmall"></span>
            </li>
          </ul>
          <hr>
          <div id="content_printGetBillSmall">
            <ul class="ul-printSmall" style="display:none;display:block;font-size:12px;">
              <li style="list-style:none;display:inline-block;width:50%;text-align:center;border-bottom:1px solid #000;">内容</li>
              <li style="list-style:none;display:inline-block;width:30%;text-align:center;border-bottom:1px solid #000;">数量*单价</li>
              <li style="list-style:none;display:inline-block;width:20%;text-align:left;border-bottom:1px solid #000;">金额</li>
            </ul>
            <ul id="payDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
            <ul id="consumeDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
            <ul id="billDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
            <ul id="debtDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
            <ul id="freeDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
            <ul id="tranferDetails_printGetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
          </div>
          <div style="clear:both;"></div>
          <div>
            <ul class="ul-printSmall">
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付合计:</span>
                <span id="pay_printGetBilSmall"></span>
              </li>
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费合计:</span>
                <span id="consume_printGetBillSmall"></span>
              </li>
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签单合计:</span>
                <span id="bill_printGetBillSmall"></span>
              </li>
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;余额:</span>
                <span id="printBalance_printGetBillSmall"></span>
              </li>
            </ul>
            <hr>
            <ul class="ul-printSmall">
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接待员:</span>
                <span id="handler_printGetBillSmall"></span>
              </li>
              <li style="height:10px;">

              </li>
              <li>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户签字:</span>
                <span style="display:inline-block;width:130px;border-bottom:1px solid #000;"></span>
              </li>
            </ul>
          </div>
        </div>
        <%--打印容器结束--%>
</body>

</html>