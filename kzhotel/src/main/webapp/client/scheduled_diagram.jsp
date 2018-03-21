<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预订-->预订态势图</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/scheduled_diagram.js"></script>
	<div class="easyui-layout" id="layout_scheduledDiagram" style="width:100%;">
		<div data-options="region:'north',height:'auto'" style="width:100%;padding:8px 20px; ">
			<span>起始日期：</span>
			<input class="easyui-datebox" id="datetime_startScheduledDiagram" data-options="editable: false"/>
			<a class="easyui-linkbutton" id="searchbydatetime_scheduledDiagram" data-options="iconCls:'icon-search'" style="padding:3px;margin-left:10px;">搜索</a>
		</div>
		<div data-options="region:'center'"   id="tabParent_div" style="width:100%;text-align:center;min-width:950px;">
			<table id="tab_scheduledDiagram" style="width:100%;border:1px solid #DDDDDD;">
			</table>
		</div>
	</div>
</body>
</html>