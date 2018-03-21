<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>历史宾客</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/history_guest.js"></script>

	<div class="easyui-layout" style="width: 100%; height: 600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="ipt_roomCode_history_guest" class="easyui-textbox" style="width:200px;" type="search"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="ipt_guestName_history_guest" class="easyui-textbox" style="width:200px;" type="search"
				label="姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="ipt_timeStart_history_guest" class="easyui-datetimebox" style="width:300px;"  data-options="editable:false"
				label="起始时间（退房）:" labelPosition="before" labelAlign="right" labelWidth="120"/>
			<input id="ipt_timeEnd_history_guest" class="easyui-datetimebox" style="width:300px;"  data-options="editable:false"
				label="结束时间（退房）:" labelPosition="before" labelAlign="right" labelWidth="120"/>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="searchBtn_history_guest"
				data-options="iconCls: 'icon-search'">搜索</a>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="print_hg">宾客账单打印</a>
			<div id="showDetailsDialog_hg" style="display:none;"></div>
		</div>
		<div data-options="region:'center'">
			<table  id="tab_history_guest"></table>
		</div>
	</div>
</body>
</html>