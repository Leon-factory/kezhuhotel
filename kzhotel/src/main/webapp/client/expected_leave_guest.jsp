<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预离宾客</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/expected_leave_guest.js"></script>

	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="ipt_roomId_expectedLeaveGuest" class="easyui-textbox" style="width:200px;" type="search"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="searchExpectedLeaveGuestByRoomId"
				data-options="iconCls: 'icon-search'" href="javascript:void(0)">搜索</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="btn_exitroomAndGetBill" href="javascript:void(0)">退房并结账</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="btn_exitroom" href="javascript:void(0)">退房</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="btn_continue" href="javascript:void(0)">续住</a>
			<div id="showGuestInfoHiddenDiv"></div>
		</div>
		
		<div data-options="region:'center'">
			<table  id="tab_expectedleaveguest"></table>
		</div>
	</div>
</body>
</html>