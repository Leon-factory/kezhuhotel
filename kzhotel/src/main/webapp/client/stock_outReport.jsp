<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>出库报告</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_outReport.js"></script>
	<div class="easyui-layout" id="layout_stockOutReport" style="width: 100%;height:500px;">
		 <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouse_stockOutReport" style="width:190px;" 
				label="库名：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectStartTime_stockOutReport" style="width:270px;" 
				label="起始日期时间：" labelWidth="90px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectEndTime_stockOutReport" style="width:270px;" 
				label="截止日期时间：" labelWidth="90px" labelPosition="before" labelAlign="right"/>
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_stockOutReport">确定</a>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:4px;">
			<div>
    			<a id="show_stockOutReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">显示出库单</a>
    			<a id="saveForExcel_StockOutReport" data-options="iconCls:'icon-excel'" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">导出出库单</a>
    			<a id="print_stockOutReport" class="easyui-linkbutton" data-options="iconCls:'icon-print'" style="width:100%;height:38px;border:1px solid black;">打印出库单</a>
    		</div>
    		<div id="showReportList_stockOutReport" style="display:none;"></div>
		</div>
		<%-- 明细 --%>
		<div data-options="region:'center',title:'明细'" style="width: 100%;height:100%;">
	    	 <div style="width: 100%;height:350px;">
		   		 <div class="easyui-layout" style="width: 100%;height:100%;">
			   		 <div data-options="region:'center',title:''">
				   		 <table id="detailsInfo_stockOutReport"></table>
				     </div>
			   		 <div data-options="region:'south'" style="width: 100%;height:35px;">
			   		 	<div id="page_stockOutReport"></div>
			   		 </div>
		   		 </div>
	   		 </div>
	    </div> 
	</div>
	
	<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="outReportPrint">
	
	<style>
		.taboutReportPrint{
			margin:0 auto;table-layout:fixed; 
			empty-cells:show; 
			border-collapse: collapse; 
			margin:0 auto; 
			font-size:12px;  
			border:1px solid #DDDDDD; 
			color:#666;
		}
		.outReportPrint{
			border-top: 1px solid #DDDDDD;
			border-left: 1px solid #DDDDDD;
			border-right: 1px solid #DDDDDD;
			border-bottom: 2px solid #DDDDDD; 
			padding:0 1em 0; 
			background-repeat:repeat-x; 
			height:30px; 
			/* width:45px; */
			text-align: center;
			vertical-align: middle!important;
		}
	</style>
	
	<h5 style="text-align: center;" id="reportTitle_outStockReport"></h2>
      <table class="table table-bordered taboutReportPrint">
        <thead>
          <tr>
            <th class="outReportPrint" style="width:45px;">序号</th>
            <th class="outReportPrint">商品类别</th>
            <th class="outReportPrint">商品名称</th>
            <th class="outReportPrint">出库数量</th>
            <th class="outReportPrint">价格</th>
            <th class="outReportPrint">出库金额</th>
			<th class="outReportPrint">Reference</th>
            <th class="outReportPrint">备注</th>
          </tr>
        </thead>
        <tbody id="tbody_inStockReportPrint"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>