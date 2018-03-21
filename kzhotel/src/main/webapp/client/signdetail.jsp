<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>账务-- 》 签单明细</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/signdetail.js"></script>
	<div class="easyui-layout" style="width:100%;height:600px;">
		  <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
	    	<div>
	    		<a id="printBtn_signdetail" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">打印</a>
	    	</div>
	      </div>  
	      
	      <div data-options="region:'center'">
		    	<div  class="easyui-layout" style="width:100%;height:100%;">   
				    <div data-options="region:'north'" style="width:100%;height:155px;">
				    	<div class="easyui-layout" style="width:100%;height:100%;">   
					    	<div data-options="region:'north',title:'简讯',collapsible:false"  style="height:78px;">
					    		<table id="briefInfo_signdetail"></table> 
					    	</div>   
				    		<div data-options="region:'center',title:'汇总'">
				    			<table id="countInfo_signdetail"></table> 
				    		</div>
				    	</div>  
				    </div> 
				    <div data-options="region:'center',title:'明细'">
				    	<table id="detail_signdetail"></table>
				    </div>  
				</div>
		  </div> 
	</div>
	
	<%-- 打印容器开始 --%>
	<div id="printDiv_signdetail" style="display:none;" >
		<style>
			.signdetailPrintTh{
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
		<p>1、签单明细--简讯
		<table style="table-layout:fixed;empty-cells:show; border-collapse: collapse; 
						font-size:12px;border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th  class="signdetailPrintTh" style="min-width:50px;">客源</th>
				<th  class="signdetailPrintTh" style="min-width:50px;">宾客姓名</th>
				<th  class="signdetailPrintTh" style="min-width:130px;">宾客手机号</th>
				<th  class="signdetailPrintTh" style="min-width:130px;">登记时间</th>
				<th  class="signdetailPrintTh" style="min-width:50px;">结账时间</th>
				<th  class="signdetailPrintTh" style="min-width:130px;">房号</th>
				<th  class="signdetailPrintTh" style="min-width:130px;">账单状态</th>
				<th  class="signdetailPrintTh" style="min-width:130px;">备注</th>
			</tr>
			<tbody id="shortInfo_signdetailPrintTbody"></tbody>
		</table>
		<p>2、签单明细--汇总
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th  class="signdetailPrintTh" style="min-width:50px;">汇总</th>
			</tr>
			<tbody id="countAount_signdetailPrintTbody"></tbody>
		</table>
			<p>3、签单明细--明细
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th  class="signdetailPrintTh" style="min-width:40px;">分类</th>
				<th  class="signdetailPrintTh" style="min-width:150px;"">日期时间</th>
				<th  class="signdetailPrintTh" style="min-width:250px;">内容</th>
				<th  class="signdetailPrintTh" style="min-width:80px;">数量</th>
				<th  class="signdetailPrintTh" style="min-width:80px;">单价</th>
				<th  class="signdetailPrintTh" style="min-width:80px;">金额</th>
			</tr>
			<tbody id="details_signdetailPrintTbody"></tbody>
		</table>
	</div>
	<%-- 打印容器结束 --%>
</body>
</html>