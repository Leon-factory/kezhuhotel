<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>随住客人</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/Entourage.js"></script>

<div class="easyui-layout"  style="width:100%;height:520px;">
	<input type="hidden" id="entourage_roomInfo"/>
		<div data-options="region:'north',height:'auto'" style="padding:8px">
			<a id="entourage_showLivingRoomBtn"  class="easyui-linkbutton">显示在住房间列表</a>
		</div>
		<div id="entourage_showLivingRoomListP"></div>
		<div id="entourage_addEntourageDialogP"></div>
		<div data-options="region:'center'">
			<table id="entourage_livingGuestList"></table>
		</div>
	</div>
</body>
</html>