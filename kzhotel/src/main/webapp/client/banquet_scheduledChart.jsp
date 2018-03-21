<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴预订图</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_scheduledChart.js"></script>
	<div class="easyui-layout" style="width:100%;height:620px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 0 8px 20px;min-height:120px;font-size:14px;">
			<div>
				<table id="head_banquetSC" cellspacing="0px">
					<tr id="tdo"></tr>
					<tr id="ttd"></tr>
				</table>
			</div>
			<div style="margin-top:10px;">
				<input id="hallDate_scheduledChart" type="search"  labelAlign="right" labelWidth="70" label="日期：" 
					labelPosition="before" style="width:200px">
				<input id="hallNum_scheduledChart" type="search"  labelAlign="right" labelWidth="70" label="厅台号：" 
					labelPosition="before" style="width:200px">
				<input id="position_scheduledChart"  labelAlign="right" labelWidth="50" label="位置：" 
					labelPosition="before" style="width:200px">
				<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_scheduledChart">搜索</a>
				<input id="saveClickBlockData_scheduledChart" type="hidden"/>
				<div id="dialogParent_scheduledChart"></div>
			</div>
		</div>
		<div data-options="region:'center'" id="srcontains_scheduledChart" style="width:100%;padding-bottom:30px;">
			<div id="loading_scheduledChart" style="font-size:150%;text-align:center;width:100%;">
				<i class="fa fa-spinner fa-spin"></i>&nbsp;加载中...
			</div>
		</div>
	</div>
	<div id="menuHave_scheduledChart" class="easyui-menu" style="width:150px;display:none">
		<div data-options="name:'createScheduled'">新建预定</div>
		<div data-options="name:'updateScheduled'">编辑预定</div>
		<div data-options="name:'cancelScheduled'">取消预定</div>
		<!-- <div data-options="name:'setMiss'">设置失约</div> -->
		<div data-options="name:'createOrder'">预定开台</div>
	</div>
	<div id="menuEmpty_scheduledChart" class="easyui-menu" style="width:150px;display:none">
		<div data-options="name:'createScheduled'">新建预定</div>
	</div>
	<div class="exp">
		<div class="spare" style="background-color: #ddd;color:black;font-weight: bold;">非预定状态</div>
		<div class="spare" style="background-color: green">预定状态</div>
	</div>
</body>
</html>