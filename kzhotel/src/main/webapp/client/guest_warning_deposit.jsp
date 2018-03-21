<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>宾客押金预警</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/guest_warning_deposit.js"></script>

	<div class="easyui-layout" style="width: 100%; height: 600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="roomCode_gwd" class="easyui-textbox" style="width:200px;" type="search"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="guestName_gwd" class="easyui-textbox" style="width:200px;" type="search"
				label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a id="search_gwd" class="easyui-linkbutton" data-options="iconCls: 'icon-search'"
				 style="height: 30px; padding: 0px 10px">搜索</a>
				<a id="gwd_continueRoom" class="easyui-linkbutton" style="height: 30px; padding: 0px 10px">续房收款</a>
				<a id="gwd_exitRoom" class="easyui-linkbutton" style="height: 30px; padding: 0px 10px">退房结账</a>
				<a id="print_gwd" class="easyui-linkbutton" style="height: 30px; padding: 0px 10px">宾客账单打印</a>
				<div id="showDetailsDialog_gwa" style="display:none;"></div>
		</div>
		<div data-options="region:'center'">
			<table  id="guest_warning_deposit"></table>
		</div>
</body>
</html>