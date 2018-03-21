<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴项目管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_item_manager.js"></script>
<div>
	<div style="padding:8px 50px;">
		<span>餐宴类别:</span>
		<span>
			<input class="easyui-combobox"  id="banquetType_BIM" style="width:130px;" />
		</span>
		<span>餐宴名称:</span>
		<span>
			<input class="easyui-textbox"  type="search" id="banquetItemName_BIM" style="width:130px;" />
		</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="search_BIM"
				data-options="iconCls: 'icon-search'" >搜索</a>
		<%-- 编辑 --%>
		<div id="showEditDialog_BIM" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddDialog_BIM" style="display: none;" ></div>
	</div>
	
	<div>
		<table id="table_BIM"></table>
	</div>
	<div id="page_BIM" style="margin-top: 10px;"></div>
</div>
</body>
</html>