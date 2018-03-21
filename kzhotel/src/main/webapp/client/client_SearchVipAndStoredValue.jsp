<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系------会员和储值查询</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_SearchVipAndStoredValue.js"></script>

	<div class="easyui-layout" style="width: 100%; height: 450px;">
		<div data-options="region:'north'" style="padding: 8px 0 8px 30px;">
			<span>会员昵称： </span>
			<input id="iptName_svasv" class="easyui-textbox"  type="search" style="width:130px;"/>
			<span> 手机号码： </span>
			<input id="iptPhone_svasv" class="easyui-numberbox"  type="search" 
				data-options="validType:'mobilephone',tipPosition:'top',delay:1000" style="width:130px;"/> 
			<a id="searchVIPInfo" class="easyui-linkbutton" style="height: 30px; padding: 0px 10px" 
				data-options="iconCls: 'icon-search'">搜索</a>
			<div id="showSearchVipInfoDialog_SearchVipAndStoredValue"></div>
			<div id="showCreateCardDialog_SearchVipAndStoredValue" style="display:none;"></div>
			<div id="showSetManagerDialog_SearchVipAndStoredValue" style="display:none;"></div>
		</div>
		
		 <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:120px;padding:3px;">
	    	<div>
	    		<a id="createOrCancelCard_svasv" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
	    			border-left:1px solid black;border-right:1px solid black;">制卡/注销</a>
	    		<a id="setChannelId_svasv"  class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">客户经理指定</a>
	    	</div>
	    </div>
		
		<div data-options="region:'center',title:'明细'" style="height:100%;">
			<div data-options="region:'center'" style="height:90%;text-align:center;">
				<span id="loading_svasv" style="font-size:150%;"><i class="fa fa-spinner fa-spin"></i>&nbsp;数据查询中...</span>
				<table  id="tab_client_SearchVipAndStoredValue" style="height:100%;"></table>
			</div>
			<div data-options="region:'south'" style="height:30px;">
				<div id="listPage_searchVipAndStoredValue"></div>
			</div>
		</div>
	</div>
</body>
</html>