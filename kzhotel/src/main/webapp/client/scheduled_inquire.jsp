<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预订查询</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/scheduled_inquire.js"></script>
	<div class="easyui-layout"  id="layout_scheduledInquire" style="width:100%;height:580px;">
		<div data-options="region:'north',height:'auto'"  style="width:100%;padding:8px 30px;">
			<!-- <span>时间选择：</span>
			<input class="easyui-combobox" id="timeSearch" data-options='data:[{"id":1,"text":"今日"},{"id":2,"text":"昨日"}
				,{"id":3,"text":"本周"},{"id":4,"text":"上周"},{"id":5,"text":"本月"},{"id":6,"text":"上月"}]
				,valueField:"id",textField:"text",panelHeight:"auto",panelMaxHeight:200'/> -->
			<div id="northDiv_scheduledInquire">
				<span>起始日期(计划到店)：</span>
				<input class="easyui-datebox" id="ipt_startTime" data-options="editable:false"/>
				<span>结束日期(计划到店)：</span>
				<input class="easyui-datebox" id="ipt_stopTime" data-options="editable:false"/>
				<span>状态选择：</span>
				<input class="easyui-combobox" id="statusSearch" data-options='data:[{"id":4,"text":"入住","selected":true}
						,{"id":2,"text":"解除"},{"id":3,"text":"失约"}]
						,valueField:"id",textField:"text", editable: false,panelHeight:"auto",panelMaxHeight:200'/>
				<a class="easyui-linkbutton" id="search_scheduledInquire">搜索</a>
				<a class="easyui-linkbutton" id="history_scheduledInquire">历史订单查询</a>
			</div>
		</div>
		<div data-options="region:'center'" style="width:100%;height:97%;">
			<table id="tab_scheduledInquire" style="width:100%;height:97%;"></table>
		</div>
	</div>
</body>
</html>