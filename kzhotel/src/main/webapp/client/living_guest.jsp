<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>在住宾客</title>
</head>
<body>
<input type="hidden" id="livingGuest_hiddenCardType"/>
	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="ipt_roomId_livingGuest" class="easyui-textbox" style="width:200px;" type="search"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="ipt_guestName_livingGuest" class="easyui-textbox" style="width:200px;" type="search"
				label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="searchLivingGuestByRoomIdOrGuestName"
				data-options="iconCls: 'icon-search'" href="javascript:void(0)">搜索</a><input type="hidden" id="hidden_getCertificateTypeJson"/>
		</div>
		
		<div data-options="region:'center'">
			<table  id="tab_livingguest"></table>
		</div>
		
		<div data-options="region:'south'" style="width:100%;height:40px;padding-left:70%;padding-top:3px;">
			<a style="height:30px;padding:0px 10px" id="addfollowguest1" class="easyui-linkbutton" href="javascript:void(0)">添加随住客人</a>
			<a style="height:30px;padding:0px 10px" id="addfollowguest2"  class="easyui-linkbutton" href="javascript:void(0)">添加随住客人并制卡</a>
			<div id="addFollowGuestDiv"></div>
		</div>
	</div>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/living_guest.js"></script>
</body>
</html>