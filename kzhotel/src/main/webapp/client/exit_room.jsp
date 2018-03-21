<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>前台--退房</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/exit_room.js"></script>
	
	<div class="easyui-layout" id="div_room_exit" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding: 10px 0 10px 30px;">
				<a class="easyui-linkbutton" style="width:120px;padding:2px;" id="north_livingguest_exitroom">显示全部在住客人</a>
				<div id="showalllivingguestsDivP" style="display:none;"></div>
		</div>

		<div data-options="region:'center'" style="width: 100%; height: 100%;">
			<table id="tab_room_exit"></table>
			<div style="padding: 20px 0 0 30px;">
				<a class="easyui-linkbutton" id="south_exitroom_exitroom" style="width:100px;padding:2px;">退房但不结账</a>
				<a class="easyui-linkbutton" id="south_exitroomandgetbill_exitroom" style="width:100px;padding:2px;margin-left:10px;">退房并结账</a>
				<a class="easyui-linkbutton" id="south_exitroomcard_exitroom" style="width:90px;padding:2px;margin-left:10px;">签收门卡</a>
			</div>
		</div>
		<input type="hidden" id="hiddenGetRentId"/><%-- rentId --%>
		<input type="hidden" id="hiddenGetAmount"/><%-- 押金  --%>
	</div>
</body>
</html>