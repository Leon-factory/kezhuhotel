<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->供应商管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/supplier.js"></script>
<div>
	<div style="padding:8px 30px;">
		<span>供应商名称:</span>
		<span>
			<input id="select_supplier" style="width: 130px;"/>
		</span>
		<a class="easyui-linkbutton"  id="search_btn_supplier" data-options="iconCls:'icon-search'">搜索</a>
		<%-- 新增dialog --%>
	    <div id="addDialog_supplier" style="display:none;"></div> 
	    
	    <%-- 编辑dialog --%> 
	    <div id="editDialog_supplier" style="display:none;"></div> 
	</div>
	<div>
		<table id="tab_supplier"></table>
		<div id="page_supplier" style="margin-top: 10px;"></div>
	</div>
</div>
</body>
</html>