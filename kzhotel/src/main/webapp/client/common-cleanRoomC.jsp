<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>在住房间列表</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/common-cleanRoom.js"></script>
<div class="easyui-layout" style="width:100%;height:500px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 0 8px 0; ">
			<input id="cleanRoom_roomName"  type="search"  class="easyui-textbox" labelAlign="right" labelWidth="60" label="房间号：" labelPosition="before" style="width:160px">
			<input id="cleanRoom_roomType" class="easyui-combobox" labelAlign="right" labelWidth="50" label="房型：" labelPosition="before" style="width:150px">
			<input id="cleanRoom_floor" class="easyui-combobox" labelAlign="right" labelWidth="50" label="位置：" labelPosition="before" style="width:150px">
			<input id="cleanRoom_roomState" class="easyui-combobox" labelAlign="right" labelWidth="70" label="房间状态：" labelPosition="before" style="width:170px">
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" data-options="iconCls: 'icon-search'" id="loadCleanRoomList">搜索</a>
		</div>
		<div data-options="region:'center'">
			<table class="easyui-datagrid" id="cleanRoom_list"></table>
		</div>
	</div>
</body>
</html>