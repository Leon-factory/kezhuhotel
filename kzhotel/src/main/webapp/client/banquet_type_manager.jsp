<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴类别管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_type_manager.js"></script>
<div>
	<div>
	   	<%-- 编辑 --%>
		<div id="showEditDialog_BTM" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddDialog_BTM" style="display: none;" ></div>
	
		<table id="table_BTM" ></table>
	</div>
	<div id="page_BTM" style="margin-top: 10px;"></div>
</div>
</body>
</html>