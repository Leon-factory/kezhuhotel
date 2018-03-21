<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>权限管理</title>
</head>
<body>
<script type="text/javascript" src="../js/client/permision_manager.js"></script>
	<div class="easyui-layout" id="layout_permision" style="width:100%;">
		<div data-options="region:'center'">
			<ul id="permisionManager_tree" class="easyui-tree"></ul>
		</div>
		<div data-options="region:'east'" style="width:49%">
			<table id="permision_userGroupList"></table>
		</div>
		<div id="permission_addUserGroupDialog" style="display:none;" >
		</div>
	</div>
	<input type="hidden" id="permission_hasRoleData"/>
	<input type="hidden" id="permission_roleTypeData"/>
</body>
</html>