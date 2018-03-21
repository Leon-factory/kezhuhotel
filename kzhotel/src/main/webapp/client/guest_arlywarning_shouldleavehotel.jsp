<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>宾客应离店预警</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/guest_arlywarning_shouldleavehotel.js"></script>

	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:10px 0 10px 30px;">
			<span>房号: </span><span><input id="roomCode_gas" type="search" style="width:130px;"/></span>
			<a id="search_gas" class="easyui-linkbutton"  style="height:30px;padding:0px 10px" 
				data-options="iconCls: 'icon-search'">搜索</a>
			<a id="gasl_exitRoomAndGetBillClick" class="easyui-linkbutton" style="height:30px;padding:0px 10px">退房并结账</a>
			<a id="gasl_exitRoom" class="easyui-linkbutton" style="height:30px;padding:0px 10px">退房</a>
			<a id="gasl_continueRoom" class="easyui-linkbutton" style="height:30px;padding:0px 10px">续住</a>
			<div id="showGuestInfoHiddenDiv_gas"></div>
		</div>
		
		<div data-options="region:'center'" style="height:100%">
			<table  id="tab_guestarlywarningshouldleavehotel"></table>
		</div>
	</div>
</body>
</html>