<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>当班记录</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/onstatus_onduty.js"></script>
	<div style="height:30px;padding:8px 0 8px 30px;">
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="print_onstatusOnduty" data-options="iconCls:'icon-print'">打印</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="addDeliverCash_onstatusOnduty">交款</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="acceptMoney_onstatusOnduty">接款</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="payment_onstatusOnduty">缴款</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="collarMoney_onstatusOnduty">领款</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="close_onstatusOnduty">结班</a>
		<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="cancelClose_onstatusOnduty">撤销结班</a>
		<div id="appendDiv_onduty"></div>
	</div>
	<div class="easyui-layout" id="layout_onduty" style="width:100%;height:600px;">   
	    <div data-options="region:'north',title:'简讯',collapsible:false" style="width:100%;height:78px;">
	    	<table id="shortInfo_onstatusOnduty"></table>
	    </div>   
	    <div data-options="region:'center',title:'汇总'"">
	    	<table id="countAount_onstatusOnduty"></table>
	    </div>   
	    <div data-options="region:'south',title:'明细',collapsible:false" style="height:446px;">
	    	<table id="details_onstatusOnduty"></table>
	    </div>   
	</div> 
	
	<%-- 打印容器开始 --%>
	<div id="print_onstatusOnduty" style="display:none;">
	<style>
		.onstatusOndutyPrintTh{
				border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;
		}
	</style>
		<p>1、当班记录简讯
		<table style="table-layout:fixed;empty-cells:show; border-collapse: collapse; 
						font-size:12px;border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">当班账号</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">当班状态</th>
				<th class="onstatusOndutyPrintTh" style="min-width:130px;">开班时间</th>
				<th class="onstatusOndutyPrintTh" style="min-width:130px;">结班时间</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">审核账号</th>
				<th class="onstatusOndutyPrintTh" style="min-width:130px;">审核时间</th>
			</tr>
			<tbody id="shortInfo_onstatusOndutyPrintTbody"></tbody>
		</table>
		<p>2、当班记录汇总
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">现金</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">银联</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">微信支付</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">支付宝</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">储值</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">积分</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">坏账</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">免单</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">转应收款</th>
			</tr>
			<tbody id="countAount_onstatusOndutyPrintTbody"></tbody>
		</table>
			<p>3、当班记录明细
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th class="onstatusOndutyPrintTh" style="min-width:40px;">分类</th>
				<th class="onstatusOndutyPrintTh" style="min-width:150px;">日期时间</th>
				<th class="onstatusOndutyPrintTh" style="min-width:250px;">内容</th>
				<th class="onstatusOndutyPrintTh" style="min-width:100px;">交易方</th>
				<th class="onstatusOndutyPrintTh" style="min-width:50px;">金额</th>
			</tr>
			<tbody id="details_onstatusOndutyPrintTbody"></tbody>
		</table>
	</div>
	<%-- 打印容器结束 --%>
</body>
</html>