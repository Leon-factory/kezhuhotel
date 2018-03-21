<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>库存</title>
</head>
<body>
	<div id="layoutDiv_stockInventory" class="easyui-layout" style="width:100%;">   
	    <div data-options="region:'north',height:'auto'" style="padding:8px 10px;">
			<input id="si_stockName"  style="width:200px;" 
				label="库名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="si_goodsTypeName"  style="width:200px;" 
				label="商品类别：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="si_goodsName"  style="width:200px;" 
				label="商品名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="si_isWarning"  style="width:200px;" 
				label="是否警示：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="si_search" data-options="iconCls: 'icon-search'" >搜索</a>
	    </div>
	    <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:6px;">
	    	<div>
	    		<a id="showReportForExcel_inventoryStock" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
	    			border-left:1px solid black;border-right:1px solid black;" data-options="iconCls:'icon-excel'" >导出库存报告</a>
	    		<a id="printReport_inventoryStock" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;" data-options="iconCls:'icon-print'" >打印库存报告</a>
	    	</div>
	    </div> 
	    <div data-options="region:'center'">
	    	<div class="easyui-layout" style="width:100%;height:100%;">   
		    	<div data-options="region:'north',title:'',collapsible:false"  style="height:156px;">
		    		<div class="easyui-layout" style="width:100%;height:100%;">   
				    	<div data-options="region:'north',title:'简讯',collapsible:false" style="height:78px;">
				    		<table  id="shortInfo_si"></table>
				    	</div>   
			    		<div data-options="region:'center',title:'汇总'">
			    			<table  id="countInfo_si"></table>
			    		</div>   
					</div> 
		    	</div>   
	    		<div data-options="region:'center',title:'明细'">
	    			<table id="currentStock"></table>
	    		</div>   
			</div> 
	    </div>      
	</div>
	
	<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="inventoryReportPrint">
	
	<style>
		.tabinveReportPrint{
			margin:0 auto;table-layout:fixed; 
			empty-cells:show;
			border-collapse: collapse; 
			margin:0 auto; 
			font-size:12px;  
			border:1px solid #DDDDDD; 
			color:#666;
		}
		.inveReportPrint{
			border-top: 1px solid #DDDDDD;
			border-left: 1px solid #DDDDDD;
			border-right: 1px solid #DDDDDD;
			border-bottom: 2px solid #DDDDDD; 
			padding:0 1em 0; 
			background-repeat:repeat-x; 
			height:30px; 
			text-align: center;
			vertical-align: middle!important;
		}
	</style>
	
	<h5 style="text-align: center;" id="reportTitle_inventoryStockReport"></h5>
      <table class="table table-bordered tabinveReportPrint">
        <thead>
          <tr>
            <th class="inveReportPrint" style="width:45px;">序号</th>
            <th class="inveReportPrint">商品名称</th>
            <th class="inveReportPrint">库存数量</th>
            <th class="inveReportPrint">是否警示</th>
            <th class="inveReportPrint">最新进价</th>
            <th class="inveReportPrint">库存金额</th>
          </tr>
        </thead>
        <tbody id="inventoryStockPrintTbody"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_inventory.js"></script>
</body>
</html>