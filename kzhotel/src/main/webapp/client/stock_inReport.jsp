<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>新入库</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_inReport.js"></script>
	<div class="easyui-layout" id="layout_stockInReport" style="width: 100%;">
		 <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouse_stockInReport" style="width:190px;" 
				label="库名：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectStartTime_stockInReport" style="width:270px;" 
				label="起始日期时间：" labelWidth="90px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectEndTime_stockInReport" style="width:270px;" 
				label="截止日期时间：" labelWidth="90px" labelPosition="before" labelAlign="right"/>
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="search_stockInReport">确定</a>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:4px;">
			<div>
    			<a id="show_stockInReport" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">显示入库单</a>
    			<a id="saveForExcel_StockInReport" data-options="iconCls:'icon-excel'" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">导出入库单</a>
    			<a id="print_stockInReport" class="easyui-linkbutton" data-options="iconCls:'icon-print'" style="width:100%;height:38px;border:1px solid black;">打印入库单</a>
    		</div>
    		<div id="showReportList_stockInReport" style="display:none;"></div>
		</div>
		<%-- 明细 --%>
		<div data-options="region:'center',title:'明细'" style="width: 100%;height:100%;">
	    	 <div style="width: 100%;height:350px;">
		   		 <div class="easyui-layout" style="width: 100%;height:100%;">
			   		 <div data-options="region:'center',title:''">
				   		 <table id="detailsInfo_stockInReport"></table>
				     </div>
			   		 <div data-options="region:'south'" style="width: 100%;height:35px;">
			   		 	<div id="page_stockInReport"></div>
			   		 </div>
		   		 </div>
	   		 </div>
	    </div> 
	</div>
	<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="inStockReportPrint">
	
	<style>
		.inReportPrint{
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
		.tinReport{
			margin:0 auto;table-layout:fixed; 
			empty-cells:show; 
			border-collapse: collapse; 
			margin:0 auto; 
			font-size:12px;  
			border:1px solid #DDDDDD; 
			color:#666;
		}
	</style>
	
	<h5 style="text-align: center;" id="reportTitle_inStockReportPrint"></h2>
      <table class="table table-bordered tinReport">
        <thead>
          <tr>
            <th class="inReportPrint" style="width:45px;">序号</th>
            <th class="inReportPrint">商品类别</th>
            <th class="inReportPrint">商品名称</th>
            <th class="inReportPrint">供应商</th>
            <th class="inReportPrint">入库数量</th>
            <th class="inReportPrint">进价</th>
            <th class="inReportPrint">入库金额</th>
            <th class="inReportPrint">备注</th>
          </tr>
        </thead>
        <tbody id="tbody_inStockReportPrint"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>