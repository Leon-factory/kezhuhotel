<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>库存-->盘点</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_check.js"></script>
	<div class="easyui-layout" id="layout_stockCheck" style="width:100%;">
		<div data-options="region:'north',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouse_stockCheck" style="width:190px;" 
				label="库名：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:4px;">
			<div>
    			<a id="edit_stockCheck" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">编辑</a>
    			<a id="submit_stockCheck" class="easyui-linkbutton" style="width:100%;height:38px;
    			border-left:1px solid black;border-right:1px solid black;border-bottom:1px solid black;">确认生成盘点报告</a>
    		</div>
    		<div id="appendDiv_stockCheck"></div>
		</div>
		<%-- 明细 --%>
	    <div data-options="region:'center'">
	    	<div class="easyui-layout" style="width:100%;height:100%;">   
		    	<div data-options="region:'north',title:'',collapsible:false"  style="height:156px;">
		    		<div class="easyui-layout" style="width:100%;height:100%;">   
				    	<div data-options="region:'north',title:'简讯',collapsible:false" style="height:78px;">
				    		<table  id="shortInfo_stockCheck"></table>
				    	</div>   
			    		<div data-options="region:'center',title:'汇总'">
			    			<table  id="countInfo_stockCheck"></table>
			    		</div>   
					</div> 
		    	</div>   
	    		<div data-options="region:'center',title:'明细'">
	    			<table id="detailsInfo_stockCheck"></table>
	    		</div>   
			</div> 
	    </div> 
	</div>
</body>
</html>