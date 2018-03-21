<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预订--->新建预订</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/scheduled_new.js"></script>

	<div class="easyui-layout" id="layout_scheduledNew">
		<input type="hidden" id="hidden_rentplanId_schedluedNew"/>
		<div data-options="region:'center'"  style="width: 100%;">
			<table  id="tab_createScheduled" ></table>
		</div>
		<div id="showSearchScheduledGuestList_new" style="display: none;"></div>
		<div id="showPaymethod_scheduledNew_div" style="display: none;"></div>
	</div>
</body>
</html>