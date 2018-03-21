<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预订--->预订编辑</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/scheduled_edit.js"></script>

	<div class="easyui-layout" id="layout_schedulEdit" style="width: 100%;">
		<div data-options="region:'north',height:'auto'" style="padding: 8px 20px;">
			<input type="hidden" id="hidden_rentplanId_schedluedEdit"/>
			<span>计划到店日期：</span>
			<input class="easyui-datebox" id="ipt_startTime_scheduledEdit" data-options="editable:false"/>
			<span>姓名:</span>
			<span>
				<input  class="easyui-textbox" style="width: 130px;" id="ipt_guestName_scheduled_edit" />
			</span>
			<span>联系手机:</span>
			<span>
				<input data-options="validType:'mobilephone',delay:1000,tipPosition:'top'" class="easyui-textbox" 
						id="ipt_guestPhone_scheduled_edit" style="width: 130px;" />
			</span>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="searchScheduledGuest_edit"
				 data-options="iconCls: 'icon-search'">搜索</a>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="openRoom_scheduledEdit">开房</a>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="click_scheduledRemove">解除</a>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="click_scheduledMissApp">失约</a>
			<div id="showEditScheduledEditInfo" style="display: none;"></div>
		</div>

		<div data-options="region:'center'">
			<table  id="tab_scheduled_edit" ></table>
		</div>
	</div>
</body>
</html>