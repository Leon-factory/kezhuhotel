<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>调拨报告</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_transferReport.js"></script>
	<div class="easyui-layout" id="layout_stockTransferReport" style="width: 100%;">
		 <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouseStart_stockTransferReport" style="width:190px;" 
				label="起始库：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectWarehouseEnd_stockTransferReport" style="width:190px;" 
				label="终点库：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectStartTime_stockTransferReport" style="width:280px;" 
				label="起始日期时间：" labelWidth="100px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectEndTime_stockTransferReport" style="width:280px;" 
				label="截止日期时间：" labelWidth="100px" labelPosition="before" labelAlign="right"/>
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_stockTransferReport">确定</a>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true" style="width:120px;padding:4px;height:200px;">
			<div>
    			<a id="show_stockTransferReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">显示调拨单</a>
    			<a id="saveForExcel_StockTransferReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;" data-options="iconCls:'icon-excel'">导出调拨单</a>
    			<a id="print_stockTransferReport" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;" data-options="iconCls:'icon-print'">打印调拨单</a>
    		</div>
    		<div id="showReportList_stockTransferReport" style="display:none;"></div>
		</div>
		<%-- 明细 --%>
	    <div data-options="region:'center',title:'明细'" style="width: 100%;height:100%;">
	    	 <div style="width: 100%;height:350px;">
		   		 <div class="easyui-layout" style="width: 100%;height:100%;">
			   		 <div data-options="region:'center',title:''">
				   		 <table id="detailsInfo_stockTransferReport"></table>
				     </div>
			   		 <div data-options="region:'south'" style="width: 100%;height:35px;">
			   		 	<div id="page_stockTransferReport"></div>
			   		 </div>
		   		 </div>
	   		 </div>
	    </div> 
	</div>
	
	<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="transferReportPrint">
	
	<style>
		.tabtransferReportPrint{
			margin:0 auto;table-layout:fixed; 
			empty-cells:show; 
			border-collapse: collapse; 
			margin:0 auto; 
			font-size:12px;  
			border:1px solid #DDDDDD; 
			color:#666;
		}
		.transferReportPrint{
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
	
	<h5 style="text-align: center;" id="reportTitle_transferReportStockReport"></h5>
      <table  class="tabtransferReportPrint">
        <thead>
          <tr>
            <th class="transferReportPrint" style="width:45px;">序号</th>
            <th class="transferReportPrint">商品类别</th>
            <th class="transferReportPrint">商品名称</th>
            <th class="transferReportPrint">调拨数量</th>
            <th class="transferReportPrint">最新进价</th>
            <th class="transferReportPrint">调拨金额</th>
            <th class="transferReportPrint">备注</th>
          </tr>
        </thead>
        <tbody id="transferReportStockPrintTbody"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>