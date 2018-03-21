<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐厅会馆管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_hall_manager.js"></script>
<div>
	<div style="padding:8px 50px;">
		<span>餐厅会馆名称:</span>
		<span>
			<input class="easyui-textbox" type="search" id="restaurantName_BHM" style="width:130px;" />
		</span>
		<span>位置选择:</span>
		<span>
			<input class="easyui-combobox"  id="positionName_BHM" style="width:130px;" />
		</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="search_BHM"
				data-options="iconCls: 'icon-search'" >搜索</a>
		<a style="height:30px;padding:0px 10px" id="add_BHM" class="easyui-linkbutton"  >新增</a>
		
		<%-- 编辑 --%>
		<div id="showEditDialog_BHM" style="display: none;" ></div>
		
		<%-- 新增 --%>
		<div id="showAddDialog_BHM" style="display: none;" ></div>
	</div>
	<div>
		<table id="table_BHM"></table>
	</div>
	<div id="page_BHM" style="margin-top:10px;"></div>
</div>
</body>
</html>