<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->房间位置管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/set_floor.js"></script>
<div>
	<div style="padding:8px 50px;">
		<a class="easyui-linkbutton" style="width:70px;display:none;" href="../client/index.html">跳转html</a>
		<span>位置名称:</span>
		<span>
			<input class="easyui-textbox" type="search" id="sf_floorName" style="width:130px;" />
		</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="sf_searchFloor"
				data-options="iconCls: 'icon-search'" >搜索</a>
		<a style="height:30px;padding:0px 10px" id="sf_addNewFloor" class="easyui-linkbutton"  >新增</a>
		
		<%-- 编辑 --%>
		<div id="showEditFloorInfo" style="display: none;" ></div>
		
		<%-- 新增 --%>
		<div id="showAddFloorInfo" style="display: none;" ></div>
	</div>
	<div>
    	<table id="floorTable"></table>
    </div>
	<div id="floorListPage" style="margin-top:10px;"></div>
</div>
</body>
</html>