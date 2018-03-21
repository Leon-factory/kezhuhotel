<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>账务-->客源应收款收款列表</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/accountant_receivablesReceivablesEntryList.js"></script>
		<div class="easyui-layout" id="layout_receivablesReceivableEntry" style="width: 100%;">
			<div data-options="region:'north',height:'auto'" style="padding:8px 20px; ">
				<span>客源单位：</span>
				<input id="channel_receivablesReceivablesList" />
				<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="searchByChannel_receivablesReceivablesList">搜索</a>
			</div>
			<div data-options="region:'west',title:'应收款收款录入'"  style="width:300px;padding:10px;">
				<div style="margin-bottom:10px;">
					<input id="channel_receivablesReceivableEntry" disabled class="easyui-textbox" label="客源单位：" labelPosition="before" 
						labelAlign="right" style="width:250px;"/>
				</div>
				<div style="margin-bottom:10px;">
					<input id="paymethodCode_receivablesReceivableEntry" label="收款方式：" labelPosition="before" 
						labelAlign="right" style="width:250px;"/>
				</div>
				<div style="margin-bottom:10px;">
					<input id="accessAmount_receivablesReceivableEntry" label="收款：" labelPosition="before" 
						labelAlign="right" style="width:250px;"/>
				</div>
				<div style="margin-bottom:10px">
					<input id="rechargeAmount_receivablesReceivableEntry"  label="冲抵应收款：" 
						labelPosition="before" labelAlign="right" style="width:250px;" />
				</div>
				<div style="margin-bottom:10px">
					<input id="remark_receivablesReceivableEntry"  label="备注：" 
						labelPosition="before" labelAlign="right" style="width:250px;"/>
				</div>
				<div style="width:200px;height:40px;padding-left:90px;">
					<a class="easyui-linkbutton" id="submit_receivablesReceivableEntry" style="width: 80px;height: 30px">提交</a>
					<a class="easyui-linkbutton" id="reset_receivablesReceivableEntry" style="width: 80px;height: 30px">清空</a>
				</div>
			</div>
			<div data-options="region:'center',title:'应收款收款列表'">
				<table id="tab_receivablesReceivablesList"></table>
				<div id="page_receivablesReceivablesList" style="margin-top: 10px;"></div>
			</div>
	</div>
</body>
</html>