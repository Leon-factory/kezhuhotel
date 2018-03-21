<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>房价方案管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/roompriceplan.js"></script>
<div>
	<div style="padding:8px 20px">
		<input id="roomPricePlanName" class="easyui-textbox" type="search" label="方案名称："  labelWidth="80px;"  labelAlign="right"  labelPosition="before" style="width:200px;" />
		<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="roomPricePlanSearch">搜索</a>
		<div id="roomPricePlanAddDialog" style="display:none;"></div>
		<div id="roomPricePlanEditDialog" style="display:none;"></div>
	</div>
	<div>
		<table id="roomPricePlanList"></table>
	</div>
	<div id="roomPricePlan_page" style="margin-top:10px;"></div>
</div>
</body>
</html>