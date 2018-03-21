<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>盘点报告</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_checkReport.js"></script>
	<div class="easyui-layout" id="layout_stockCheckReport" style="width: 100%;">
		 <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouse_stockCheckReport" style="width:190px;" 
				label="库名：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:4px;">
			<div>
    			<a id="show_stockCheckReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">显示盘点报告</a>
    			<a id="showExcel_stockCheckReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;" data-options="iconCls:'icon-excel'">导出盘点报告</a>
    			<a id="print_stockCheckReport" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;" data-options="iconCls:'icon-print'">打印盘点报告</a>
    		</div>
    		<div id="showReportList_stockCheckReport" style="display:none;"></div>
		</div>
		<%-- 明细 --%>
	    <div data-options="region:'center',title:'明细'">
	   		 <table id="detailsInfo_stockCheckReport"></table>
	    </div> 
	</div>
	
	<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="checkReportPrint">
	
	<style>
		.checkReportPrint{
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
	
	<h5 style="text-align: center;" id="reportTitle_checkStockReport"></h5>
      <table class="table table-bordered" style="margin:0 auto;table-layout:fixed; 
			empty-cells:show;border-collapse: collapse;margin:0 auto;font-size:12px;border:1px solid #DDDDDD;color:#666;">
        <thead>
          <tr>
            <th class="checkReportPrint" style="width:45px;">序号</th>
            <th class="checkReportPrint">商品名称</th>
            <th class="checkReportPrint">库存数量</th>
            <th class="checkReportPrint">实际数量</th>
            <th class="checkReportPrint">盘增/盘损数量</th>
            <th class="checkReportPrint">最新进价</th>
            <th class="checkReportPrint">盘增/盘损金额</th>
            <th class="checkReportPrint">盘点后库存金额</th>
          </tr>
        </thead>
        <tbody id="checkStockPrintTbody"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>