<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>库管设置</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/set_warehouse.js"></script>
<div>
	<div style="padding:8px 30px;">
		<span>库名称：</span>
		<input id="inputwarehouseId" style="width:150px;"/>
		<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_warehouse">搜索</a>
		<div id="addWarehouse" style="display:none;"></div>
		<div id="updateWarehouse" style="display:none;"></div>
	</div>
	<div>
		<table id="warehouseManage"></table>
		<div id="page_warehouseManage" style="margin-top: 10px;"></div>
	</div>
</div>
</body>
</html>