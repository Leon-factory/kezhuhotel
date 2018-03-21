<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>审核</title>
</head>
<body>
<script type="text/javascript"src="${pageContext.request.contextPath }/js/client/audit_onduty.js"></script>
		<div class="easyui-layout" id="layout_auditOnduty" style="width: 100%;">
		 <div data-options="region:'north',height:'auto'" style="width:100%;padding:8px;">
	    	<input  id="selectState_auditOnduty" style="width:190px;"
				label="状态：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectUserNum_auditOnduty" style="width:190px;" 
				label="账号：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
	    	<input  id="selectTime_auditOnduty" style="width:240px;"
				label="日期：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
			<a class="easyui-linkbutton pd-2" data-options="iconCls:'icon-search'"  id="search_auditOnduty">确定</a>
			<div id="append_auditOnduty" style="display:none;"></div>
	    </div>
		<%-- 功能导航--%>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:4px;">
			<div>
    			<a id="printbtn_auditOnduty" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">打印</a>
    			<a id="checkAmount_auditOnduty" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    				border-left:1px solid black;border-right:1px solid black;">审核缴款/领款</a>
    			<a id="checkList_auditOnduty" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">审核当班记录</a>
    		</div>
    		<div id="appendDiv_auditOnduty"></div>
		</div>
		<%-- 明细 --%>
	    <div data-options="region:'center'">
	    	<div class="easyui-layout" style="width:100%;height:100%;">   
		    	<div data-options="region:'north',title:'',collapsible:false"  style="height:156px;">
		    		<div class="easyui-layout" style="width:100%;height:100%;">   
				    	<div data-options="region:'north',title:'简讯',collapsible:false" style="height:78px;">
				    		<table  id="shortInfo_auditOnduty"></table>
				    	</div>   
			    		<div data-options="region:'center',title:'汇总'">
			    			<table  id="countInfo_auditOnduty"></table>
			    		</div>   
					</div> 
		    	</div>   
	    		<div data-options="region:'center',title:'明细'">
	    			<table id="detailsInfo_auditOnduty"></table>
	    		</div>   
			</div> 
	    </div> 
	</div>
	
	<%-- 打印容器开始 --%>
	<div id="printDiv_auditOnduty" style="display:none;">
		<p>1、审核--简讯
		<table style="table-layout:fixed;empty-cells:show; border-collapse: collapse; 
						font-size:12px;border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th  style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">当班账号</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">当班状态</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:130px;">开班时间</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:130px;">结班时间</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">审核账号</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:130px;">审核时间</th>
			</tr>
			<tbody id="shortInfo_auditOndutyPrintTbody"></tbody>
		</table>
		<p>2、审核--汇总
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">现金</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">银联</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">微信支付</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">支付宝</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">储值</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">积分</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">坏账</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">免单</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">转应收款</th>
			</tr>
			<tbody id="countAount_auditOndutyPrintTbody"></tbody>
		</table>
			<p>3、审核--明细
		<table  style="table-layout:fixed; empty-cells:show; border-collapse: collapse; 
						font-size:12px;  border:1px solid #DDDDDD; color:#666;">
			<tr>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:40px;">分类</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:150px;">日期时间</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:250px;">内容</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:100px;">交易方</th>
				<th style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;border-bottom: 2px solid #DDDDDD; 
				padding:0 1em 0;background-repeat:repeat-x; height:30px; text-align: center;
				vertical-align: middle!important;min-width:50px;">金额</th>
			</tr>
			<tbody id="details_auditOndutyPrintTbody"></tbody>
		</table>
	</div>
	<%-- 打印容器结束 --%>
</body>
</html>