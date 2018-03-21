<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴图</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_chart.js"></script>
	<div class="easyui-layout" style="width:100%;height:620px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;">
			<input id="hallNum_banquetChart" type="search"  labelAlign="right" labelWidth="60" label="厅台号：" labelPosition="before" style="width:200px">
			<input id="position_banquetChart" class="easyui-combobox" labelAlign="right" labelWidth="50" label="位置：" labelPosition="before" style="width:200px">
			<input id="hallState_banquetChart" class="easyui-combobox" labelAlign="right" labelWidth="80" label="厅台状态：" labelPosition="before" style="width:210px">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_banquetChart">搜索</a>
			<input type="hidden" id="saveClickBlockData_banquetChart"/>
		</div>
		<div data-options="region:'center'" id="srcontains_banquetChart" style="width:100%;padding-bottom:30px;">
				<div id="loading_banquetChart" style="font-size:150%;text-align:center;width:100%;">
					<i class="fa fa-spinner fa-spin"></i>&nbsp;加载中...
				</div>
			
			<%-- 净台 --%>
			<div id="menuClean_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				 <div data-options="name:'createBill_banquetChart'" >开单</div>
				<!--  <div data-options="name:'remark_banquetChart'" >备注</div> -->
				 <div data-options="name:'updateState_banquetChart'" >修改状态</div>
			</div>
			
			<%-- 脏台 --%>
			<div id="menuDirty_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				 <div data-options="name:'createBill_banquetChart'" >开单</div>
				 <!-- <div data-options="name:'remark_banquetChart'" >备注</div> -->
				 <div data-options="name:'updateState_banquetChart'" >修改状态</div>
			</div>
			
			<%-- 开台有账单 --%>
			<div id="menuCreate_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				 <div data-options="name:'showBill_banquetChart'" >餐宴账单</div>
				 <div data-options="name:'remark_banquetChart'" >备注</div>
				 <!-- <div data-options="name:'updateState_banquetChart'" >修改状态</div> -->
			</div>
			<%-- 开台没有账单 --%>
			<div id="menuCreateNoBill_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				<!--  <div data-options="name:'showBill_banquetChart'" >餐宴账单</div>
				 <div data-options="name:'remark_banquetChart'" >备注</div> -->
				 <div data-options="name:'updateState_banquetChart'" >修改状态</div>
			</div>
			<%-- 预定 --%>
			<!-- <div id="menuOrder_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				 <div data-options="name:'createBill_banquetChart'" >开单</div>
				 <div data-options="name:'remark_banquetChart'" >备注</div>
			</div> -->
			
			<%-- 自用 --%>
			<!-- <div id="menuSelf_banquetChart"  class="easyui-menu" style="width:150px;display:none;">
				 <div data-options="name:'createBill_banquetChart'" >开单</div>
				 <div data-options="name:'remark_banquetChart'" >备注</div>
				 <div data-options="name:'updateState_banquetChart'" >修改状态</div>
			</div> -->
		</div>
	</div>
	<div class="exp">
		<div class="spare" style="background-color: green;">净台</div>
		<div class="spare" style="background-color: gold">开台</div>
		<div class="spare" style="background-color: gray;">脏台</div>
		<!-- <div class="spare" style="background-color: goldenrod;">预定</div>
		<div class="spare" style="background-color: blue;">自用</div> -->
	</div>
	<div id="updateStateDialog_banquetChart" style="display:none;"></div>
</body>
</html>