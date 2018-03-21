<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>用户管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/employeeManage.js"></script>

<div id="layoutDiv_employeeManage" class="easyui-layout" style="width:100%;">   
    <div data-options="region:'north',height:'auto'" style="padding:8px;padding-left:30px;">
    	<span>用户组：</span>
		<span>
			<input style="width: 130px;" id="select_userGroup_employeeManage"/>
		</span>
		<a class="easyui-linkbutton"  id="search_btn_employeeManage" data-options="iconCls:'icon-search'">搜索</a>
    </div>   
    <div data-options="region:'center',title:'用户列表'">
    	<table id="tab_employeeManage"></table>
    </div>
    <%-- 新增dialog --%>
    <div id="addDialog_employeeManage" style="display:none;"></div> 
    <%-- 清除密码dialog --%> 
    <div id="editPwdDialog_employeeManage" style="display:none;"></div>  
</div> 
</body>
</html>