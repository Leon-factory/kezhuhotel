<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>报表-->分析-->会员消费RFM分析</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/analysis_RFMOfMemberConsumption.js"></script>
	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north'" style="width:100%;padding:8px 20px; ">
			<span>R：</span>
			<input id="R_RFMOfMemberConsumption"/>
			<span>F：</span>
			<input id="F_RFMOfMemberConsumption"/>
			<span>M：</span>
			<input id="M_RFMOfMemberConsumption"/>
			<a class="easyui-linkbutton" id="search_RFMOfMemberConsumption" data-options="iconCls:'icon-search'"  style="padding:2px;margin-left:5px;">确定</a>
			<a class="easyui-linkbutton" id="createReport_RFMOfMemberConsumption" data-options="iconCls:'icon-excel'" 
				style="padding:2px;margin-left:5px;">生成报表</a><br>
			<p>（R、F、M范围：1-5）</p><br>
			<p>说明：</p>
			<p>R（Recency）:最近一次消费的时间，R越高的宾客对商家的营销信息越可能有反应;</p>
			<p>F（Freqquency）:消费频率，F越高，宾客的忠诚度、满意度越高;</p>
			<p>M（Monetary）:消费金额，消费金额越高，客户价值越大。</p>
		</div>
		<div data-options="region:'center'"  style="width:100%;">
			<table id="tab_RFMOfMemberConsumption"></table>
		</div>
	</div>
</body>
</html>