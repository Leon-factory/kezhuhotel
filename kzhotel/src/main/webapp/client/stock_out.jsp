<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>新出库</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/stock_out.js"></script>
	<div class="easyui-layout" id="layout_stockOut" style="width: 100%;">
		 <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectWarehouse_stockOut" style="width:190px;" 
				label="库名：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:130px;padding:4px;">
			<div>
    			<a id="addStock_stockOut" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">新增出库项</a>
    			<a id="delGoods_stockOut" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">删除</a>
    			<a id="editGoods_stockOut" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">编辑</a>
    			<a id="print_StockOut" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;" data-options="iconCls:'icon-print'">打印临时出库单</a>
    			<a id="submit_stockOut" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">确认出库</a>
    		</div>
    		<div id="appendDiv_stockOut"></div>
		</div>
		<%-- 明细 --%>
	    <div data-options="region:'center'">
	    	<div class="easyui-layout" style="width:100%;height:100%;">   
		    	<div data-options="region:'north',title:'',collapsible:false"  style="height:156px;">
		    		<div class="easyui-layout" style="width:100%;height:100%;">   
				    	<div data-options="region:'north',title:'简讯',collapsible:false" style="height:78px;">
				    		<table  id="shortInfo_stockOut"></table>
				    	</div>   
			    		<div data-options="region:'center',title:'汇总'">
			    			<table  id="countInfo_stockOut"></table>
			    		</div>   
					</div> 
		    	</div>   
	    		<div data-options="region:'center',title:'明细'">
	    			<table id="detailsInfo_stockOut"></table>
	    		</div>   
			</div> 
	    </div> 
	</div>
	
		<%--打印容器开始--%>
	<div class="table-responsive" style="padding-top: 20px;display: none;" id="outStockPrint">
	<style>
		.outStockPrintTab{
			margin:0 auto;table-layout:fixed; 
			empty-cells:show; 
			border-collapse: collapse; 
			margin:0 auto; 
			font-size:12px;  
			border:1px solid #DDDDDD; 
			color:#666;
		}
		.outStockPrintTh{
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
	<h5 style="text-align: center;" id="reportTitle_outStock"></h5>
      <table class="table table-bordered outStockPrintTab">
        <thead>
          <tr>
            <th class="outStockPrintTh" style="width:45px;">序号</th>
            <th class="outStockPrintTh">商品类别</th>
            <th class="outStockPrintTh">商品名称</th>
            <th class="outStockPrintTh">出库数量</th>
            <th class="outStockPrintTh">销售单价</th>
            <th class="outStockPrintTh">出库金额</th>
			<th class="outStockPrintTh">Reference</th>
            <th class="outStockPrintTh">备注</th>
          </tr>
        </thead>
        <tbody id="outStockPrintTbody"></tbody>
      </table>
    </div>
    <%--打印容器结束--%>
</body>
</html>