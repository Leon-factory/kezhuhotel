<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>选择宾客账簿的公共页面</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/common-getReceptionList.js"></script>
<div class="easyui-layout" id="layout_common_getReceptionList" style="width:100%;height:480px;">
	<div data-options="region:'north'" id="north_common-getReceptionList" style="width:100%;padding:8px;">
		<span>客单状态：</span>
		<select class="easyui-combobox" id="guestReceptionStatus" data-options="editable:false,panelHeight:'auto'" style="width:80px;">
			<option value="0">全部</option>
			<option value="1">未结</option>
			<option value="2">已结</option>
		</select>
		<span>客单类型：</span>
		<select class="easyui-combobox" id="guestReceptionType" data-options="editable:false,panelHeight:'auto'"  style="width:100px;">
			<option value="0">全部</option>
			<option value="1">住客客单</option>
			<option value="2">非住客客单</option>
		</select>
		<span>创建客单日期：</span>
		<input class="easyui-datebox" id="createReceptionDate" data-options="editable:false"/>
		<span>客单结账日期：</span>
		<input class="easyui-datebox" id="getBillReceptionDate" data-options="editable:false"/>
		<a class="easyui-linkbutton" id="searchReception">搜索</a>
	</div>
	<div data-options="region:'center'" style="width:100%;">
		<table id="allReception_list"></table>
	</div>
</div>
</body>
</html>