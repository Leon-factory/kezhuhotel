<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>账务-->客源应收款管理</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/accountant_customerReceivableManagement.js"></script>
	<div style="padding:8px 20px;">
		<span>客源单位：</span>
		<input  id="channel_customerReceivableManagement" />
		<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="searchByChannel_customerReceivableManagement">搜索</a>
		<!-- <div style="width:80px;padding:3px;display:inline-block;"> -->
	  		<a id="searchDetails_customerReceivableManagement"  class="easyui-linkbutton" style="margin-left:6px;">查询明细</a>
	  	<!-- </div> -->
	</div>
  	<div>
	  	<table id="tab_customerReceivableManagement"></table>
		<div id="page_customerReceivableManagement" style="margin-top:10px;height:50px;"></div>
  	</div>
	<!-- <div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px; ">
			<span>客源单位：</span>
			<input  id="channel_customerReceivableManagement" />
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search'" id="searchByChannel_customerReceivableManagement">搜索</a>
		</div>
		<div data-options="region:'west',title:'功能导航',split:true,height:'auto'"  style="width:80px;padding:3px;">
			<div>
	    		<a id="searchDetails_customerReceivableManagement"  class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">查询明细</a>
	    	</div>
		</div>
		<div data-options="region:'center',title:'详情'"  style="width:100%;">
			<table id="tab_customerReceivableManagement"></table>
			<div id="page_customerReceivableManagement" style="margin-top:10px;height:50px;"></div>
		</div>
	</div> -->
</body>
</html>