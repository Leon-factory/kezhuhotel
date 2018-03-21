<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系-----客源高级信息管理</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_guestHighLevel_manage.js"></script>

	<div class="easyui-layout" style="width: 100%; height: 400px;">
		<div data-options="region:'north',height:'auto'" style="padding: 10px;">
				<input id="ipt_guestName_guest_manage_highLevel" class="easyui-textbox" type="search" style="width:200px;"
					label="客源名称:" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton"
				id="searchGuestManage_highLevel" data-options="iconCls: 'icon-search'">搜索</a> 
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="setCredit_highLevel" >信用额度设定</a> 
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="setUser_highLevel" >客户经理指定</a> 
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" id="setIsThirdPartPayment_highLevel" >代收设定</a>
				
			<div id="setCredits_div" style="display:none;"></div>
			<div id="setAccountManager_div" style="display:none;"></div>
			<div id="setIsThirdPartPayment_div" style="display:none;"></div>
		</div>

		<div data-options="region:'center'" style="border: 0; height: 100%">
			<table id="tab_client_guestHighLevel_manage" style="border: 0"></table>
		</div>
		
		<div data-options="region:'south'" style="border:0;height:30px">
			<div id="channelListPage_guestHeightManage"></div>
		</div>
	</div>
</body>
</html>