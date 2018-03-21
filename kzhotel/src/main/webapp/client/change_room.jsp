<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>前台--换房</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/change_room.js"></script>
	
	<div class="easyui-layout" id="div_room_change" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding: 10px 0 10px 30px;">
				<a class="easyui-linkbutton" id="north_livingguest_changeroom" style="width:80px;padding:2px;" >在住房列表</a>
				<a class="easyui-linkbutton" id="north_roomlist_changeroom" style="width:80px;padding:2px;margin-left:15px;" >空净房列表</a>
			<div id="showalllivingguestsDiv_changeroomP" style="display:none;"></div>
			<div id="showallroomlistDiv_changeroomP" style="display:none;"></div>
		</div>

		<div data-options="region:'center'">
			<table id="tab_room_change" style="width: 100%"></table>
			<div style="padding:15px 0 0 30px;">
				<a class="easyui-linkbutton" id="south_changeroom_changeroom" style="width:70px;padding:2px;">换房</a>
				<a class="easyui-linkbutton" id="south_changeroomAndCreateCard_changeroom" style="width:100px;padding:2px;margin-left:15px;">换房并制卡</a>
			</div>
		</div>
	</div>
</body>
</html>