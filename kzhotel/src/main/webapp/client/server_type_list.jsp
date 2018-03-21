<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->服务类别管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/serverTypeList.js"></script>
<div>
	<div style="padding:8px 30px;">
		<span>服务类别名称:</span>
    	<span>
    		<input class="easyui-textbox" type="search" id="serverTypeList_serverTypeName" style="width:130px;"/>
    	</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="searchServerType_serverTypeList"
			data-options="iconCls: 'icon-search'" >搜索</a>
			
		<%-- 编辑 --%>
		<div id="showEditServerTypeListInfo" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddServerTypeListInfo" style="display: none;" ></div>
	</div>
	<div>
		<table id="serverTypeListTable"></table>
		<div id="page_serverTypeList" style="margin-top: 10px;"></div>
	</div>
</div>
</body>
</html>