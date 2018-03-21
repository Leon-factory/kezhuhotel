<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>房价管理</title>
</head>
<body>
<script type="text/javascript" src="../js/client/roomPriceManage.js?v=1.0.0"></script>
<div>
	<div style="padding:8px 20px;">
		<input labelWidth="70" id="roomPriceManage_roomtype" class="easyui-combobox" label="房间类型：" labelAlign="right" labelPosition="before" style="width:200px;">
		<input labelWidth="70" id="roomPriceManage_rtp" class="easyui-combobox" label="房价方案：" labelAlign="right" labelPosition="before" style="width:200px;">
		
		<select labelWidth="90" id="roomPriceManage_checkinType" class="easyui-combobox" labelAlign="right" label="房间消费类型：" labelPosition="before" style="width:220px;" 
			data-options="panelMaxHeight:200, panelHeight:'auto', editable:false">
			<option value="">全部</option>
			<option value="1">全日房</option>
			<option value="2">钟点房</option>
			<option value="3">晚房</option>
		</select>
		<select labelWidth="70" id="roomPriceManage_timeinterval" class="easyui-combobox" labelAlign="right" label="入住时段：" labelPosition="before" style="width:200px;" 
			data-options="panelMaxHeight:200, panelHeight:'auto', editable:false">
			<option value="">全部</option>
			<option value="1">平日</option>
			<option value="2">周末</option>
			<option value="3">节假日</option>
		</select>
		<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="roomPrice_search">搜索</a>
		<%-- 新增 --%>
		<div id="roomPrice_AddDialog" style="display:none;"></div>
		<%--  编辑 --%> 
		<div id="roomPrice_EditDialog" style="display:none;"></div>
	</div>
	<div>
		<table id="roomPriceList"></table>
		<div id="roomPriceManage_page" style="margin-top:10px;"></div>
	</div>
</div>
</body>
</html>