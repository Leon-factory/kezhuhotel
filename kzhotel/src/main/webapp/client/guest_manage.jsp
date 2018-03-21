<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系----客源基本信息管理</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/guest_manage.js"></script>
	<div class="easyui-layout" style="width:100%;height:400px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 50px;">
			<input id="ipt_guestName_guest_manage" class="easyui-textbox" type="search" style="width:210px;margin-bottom:20px;"
						label="客源名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="searchGuestManage_guestManage"
				data-options="iconCls: 'icon-search'">搜索</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="addGuestManage_guestManage">新增</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="edit_gm">编辑</a>
			<%-- 新增 --%>
			<div id="addGuestManageDiv" style="display:none;"></div>
			<%-- 编辑 --%>
			<div id="editGuestManageDiv" style="display:none;"></div>
		</div>
		
		<div data-options="region:'center'" style="border:0;height:100%">
			<table class="easyui-datagrid" id="tab_guest_manage"></table>
		</div>
		<div data-options="region:'south'" style="height:30px">
			<div id="channelListPage"></div>
		</div>
	</div>
</body>
</html>