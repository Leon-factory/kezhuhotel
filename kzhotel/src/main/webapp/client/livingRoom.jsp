<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>在住房间列表</title>
</head>
<body>
	<div class="easyui-layout" style="width:100%;height:500px;">
		<div data-options="region:'north'" style="padding:8px 0 8px 15px;">
			<input id="livingRoom_guestName" class="easyui-textbox" labelAlign="right" labelWidth="70" label="住客姓名：" labelPosition="before" style="width:200px;">
			<input id="livingRoom_roomType"  type="hidden" > 
			<input id="livingRoom_channel" class="easyui-combobox" labelAlign="right" labelWidth="50" label="客源：" labelPosition="before" style="width:200px;">
			<input id="livingRoom_date" class="easyui-datetimebox" labelAlign="right" labelWidth="70" label="入住时间：" labelPosition="before" style="width:230px;" data-options="editable:false">
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton"
				data-options="iconCls: 'icon-search'" id="loadLivingRoomList">搜索</a><br/>
			<input  id="livingRoom_leave" type="checkbox" checked="checked" style="position: relative;top: 2px" />预离
			<input id="livingRoom_notleave" type="checkbox" checked="checked" style="position: relative;top: 2px"  />非预离
		</div>
		<div data-options="region:'center'">
			<table id="livingRoom_list"></table>
		</div>
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/livingRoom.js"></script>
</body>
</html>