<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>账务-->客源应收款余额统计</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/accountant_balanceOfReceivablesFromCustomers.js"></script>
	<div class="easyui-layout" style="height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<span>客源：</span>
			<input  id="channel_balanceOfReceivablesFromCustomers" />
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="searchByChannel_balanceOfReceivablesFromCustomers">搜索</a>
		</div>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
			<div>
	    		<a id="searchDetails_balanceOfReceivablesFromCustomers" class="easyui-linkbutton" style="width:100%;height:38px;
	    			border-top:1px solid black;border-left:1px solid black;border-right:1px solid black;">查询明细</a>
	    		<a id="toGuestHighLevelManage_balanceOfReceivablesFromCustomers" class="easyui-linkbutton" style="width:100%;height:38px;
	    			border:1px solid black;">高级管理</a>
	    	</div>
		</div>
		<div data-options="region:'center'"  style="width:100%;height:100%;">
			<div class="easyui-layout" style="width:100%;height:100%;">
				<div data-options="region:'north',title:'汇总',collapsible:false" style="width:100%;height:78px;">
					<table id="tabSummary_balanceOfReceivablesFromCustomers"></table>
				</div>
				<div data-options="region:'center',title:'明细'"  style="width:100%;">
					<table id="tab_balanceOfReceivablesFromCustomers"></table>
				</div>
				<div data-options="region:'south'"  style="width:100%;height:50px;">
					<div id="page_balanceOfReceivablesFromCustomers" style="margin-top:10px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>