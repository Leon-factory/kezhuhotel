<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>报表--》分析--》客户经理应收款收款分析</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath}/js/client/analysis_accountsReceivableCollection.js"></script>
	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north'" style="width:100%;height:50px;padding:8px 20px; ">
			<span>起始日期：</span>
			<input class="easyui-datebox" id="datetime_startAccountsReceivableCollection" data-options="editable: false"/>
			<span>结束日期：</span>
			<input class="easyui-datebox" id="datetime_endAccountsReceivableCollection" data-options="editable: false"/>
			<span>客户经理：</span>
			<input class="easyui-combobox" id="searchSalarUser_accountsReceivableCollection" data-options="editable: false"/>
			<a class="easyui-linkbutton" id="searchbydatetime_accountsReceivableCollection" data-options="iconCls:'icon-search'" 
				style="padding:2px;margin-left:5px;">确定</a>
			<a class="easyui-linkbutton" id="createReport_accountsReceivableCollection" data-options="iconCls:'icon-excel'"
				 style="padding:2px;margin-left:5px;">生成报表</a>
		</div>
		<div data-options="region:'center'">
			<table id="tab_accountsReceivableCollection"></table>
		</div>
	</div>
</body>
</html>