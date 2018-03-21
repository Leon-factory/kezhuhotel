<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>房态图</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/room_status.js"></script>
	<div class="easyui-layout" style="width:100%;height:620px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="roomState_topSearch_roomCode" type="search" class="easyui-textbox" labelAlign="right" labelWidth="60" label="房间号：" labelPosition="before" style="width:200px">
			<input id="roomState_topSearch_floor" class="easyui-combobox" labelAlign="right" labelWidth="50" label="位置：" labelPosition="before" style="width:200px">
			<input id="roomState_topSearch_roomType" class="easyui-combobox" labelAlign="right" labelWidth="80" label="房间类型：" labelPosition="before" style="width:210px">
			<input id="roomState_topSearch_roomState" class="easyui-combobox" labelAlign="right" labelWidth="80" label="房间状态：" labelPosition="before" style="width:210px">
			<a id="roomState_search" class="easyui-linkbutton" data-options="iconCls:'icon-search'" style="margin-left: 5px;">搜索</a>
			<a id="roomState_printBtn" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="margin-left: 5px;">房态表打印</a>
		</div>
		<div data-options="region:'center'" id="srcontains" style="color:white;width:100%;padding-bottom:30px;overflow-x: hidden;"></div>
	</div>
	
	<input id="srroominfo" type="hidden" />
	<input id="srfloorinfo" type="hidden" />
	<div class="exp">
		<div class="spare" style="background-color: green;">空净房</div>
		<div class="spare" style="background-color: gray">空脏房</div>
		<div class="spare" style="background-color: gold;">在住净房</div>
		<div class="spare" style="background-color: goldenrod;">在住脏房</div>
		<div class="spare" style="background-color: red;">维修房</div>
		<div class="spare" style="background-color: blue;">自用房</div>
	</div>
	
	<%-- 空净房菜单 --%>
	<div id="getRoomMenuClean" class="easyui-menu" style="width:150px;display:none">
		<div data-options="name:'openRoom'">开房</div>
		<div data-options="name:'createRoomCard'">制房卡</div>
		<div data-options="name:'updateRoomState'">修改房间状态</div>
	</div>
	<%-- 空脏房菜单 --%>
	<div id="getRoomMenuDirty" class="easyui-menu" style="width:150px;display:none">
		<div data-options="name:'updateRoomState'">修改房间状态</div>
	</div>
	
	<%-- 在住净房菜单 --%>
	<div id="getRoomMenuAlready"  class="easyui-menu" style="width:150px;display:none">
		 <div data-options="name:'guestReceptionList'" >宾客账单</div>
		 <div data-options="name:'guestList'" >住客列表</div>
		 <div data-options="name:'createRoomCard'">制房卡</div>
		 <div data-options="name:'addReceoption'" >加单</div>
		<div data-options="name:'exitRoom'" >退房</div>
		<div data-options="name:'continueRoom'" >续房</div>
		<div data-options="name:'changeRoom'" >换房</div>
	</div>
	
	<%-- 在住脏房菜单 --%>
	<div id="getRoomMenuLivingDirty"  class="easyui-menu" style="width:150px;display:none">
		 <div data-options="name:'guestReceptionList'">宾客账单</div>
		 <div data-options="name:'guestList'" >住客列表</div>
		 <div data-options="name:'createRoomCard'">制房卡</div>
		 <div data-options="name:'addReceoption'" >加单</div>
		<div data-options="name:'exitRoom'" >退房</div>
		<div data-options="name:'continueRoom'">续房</div>
		<div data-options="name:'changeRoom'">换房</div>
		<div data-options="name:'updateRoomState'">修改房间状态</div>
	</div>
	
	<%-- 自用房菜单 --%>
	<div id="getRoomMenuSelf"  class="easyui-menu" style="width:150px;display:none">
		 <div data-options="name:'createRoomCard'">制房卡</div>
		 <div data-options="name:'updateRoomState'">修改房间状态</div>
	</div>
	
	<div id="guestListMenuP"></div>
	<div id="rentListMenuP"></div>
	<div id="goodsConsumeListMenuP"></div>
	<div id="serviceConsumeListMenuP"></div>
	<div id="updataRoomStateDialog" style="display:none;"></div><%--用于修改房态状态 追加显示dialog的父div --%>
	<%--打印容器开始--%>
    <div id="printRoomStatus" style="display: none;">
      <style>
        body,
        html,
        ul {
          margin: 0;
          padding: 0;
        }
        table.roomStatus-printTable,table.roomStatus-printTable tr th, table.roomStatus-printTable tr td {
	      border-collapse: collapse;
	      border: 1px solid #000;
	    }
	    table.roomStatus-printTable th,table.roomStatus-printTable td{
	      padding: 5px 8px;
	      text-align: center;
	      font-size:14px;
	    }
      </style>
      <table class="roomStatus-printTable">
	    <thead>
	      <tr>
	        <th style="width:12%;">位置</th>
	        <th style="width:12%;">房型</th>
	        <th style="width:12%;">房号</th>
	        <th style="width:12%;">入住类型</th>
	        <th style="width:12%;">预离</th>
	        <th style="width:12%;">押金</th>
	        <th style="width:12%;">房态</th>
	        <th style="width:12%;">备注</th>
	      </tr>
	    </thead>
	    <tbody id="printRoomStatus_tbody">
	    </tbody>
	  </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>