<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>用户组管理</title>
</head>
<body>

<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/user_group.js"></script>
<div class="easyui-layout" id="layout_userGroup" style="width:100%;">
	<div data-options="region:'center'">
		<table id="userGroup_list"></table>
		<div id="userGroup_perimissionDialog">
			<div class="easyui-layout" data-options="fit:true">
					<div data-options="region:'north'" style="height:30px">
						<input id="userGroup_userGroupName" class="easyui-textbox"  label="用户组名称：" labelPosition="before" data-options="disabled:true" style="width:200px;height:30px">
					</div>
					<div data-options="region:'west'" style="width:48%;">
						<table id="userGroup_hasPermissionList"></table>
					</div>
					<div data-options="region:'center',iconCls:'icon-ok'">
						<ul id="userGroup_hasPermissionTree"></ul>
					</div>
					<%-- 新增  --%>
					<div id="userGroup_add" style="display:none;"></div>
					<%-- 编辑  --%>
					<div id="userGroup_edit" style="display:none;"></div>
			</div>
		</div>
	</div>
</div>
</body>
</html>