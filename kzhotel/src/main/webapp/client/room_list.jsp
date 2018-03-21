<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->房间管理</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/roomList.js"></script>
<div>
	<div style="padding:8px 50px;">
		<span>房号:</span>
    	<span>
    		<input class="easyui-textbox" type="search" id="rl_roomInput" style="width:130px;"/>
    	</span>
		<span>房间类型:</span>
		<span>
			<input  id="rl_roomTypeSelect" style="width:130px;" />
		</span>
		<span>楼层选择:</span>
		<span>
			<input id="rl_floorSelect" style="width:130px;"/>
		</span>
		<a id="rl_searchRoom" class="easyui-linkbutton" style="height:30px;padding:0px 10px" 
			data-options="iconCls:'icon-search'">搜索</a>
		<a style="height:30px;padding:0px 10px" id="rl_addNewRoom" class="easyui-linkbutton"  >新增</a>
		<%-- 编辑 --%>
		<div id="showEditRoomListInfo" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddRoomListInfo" style="display: none;" ></div>
		<%-- 复制 --%>
		<div id="showCopyRoomListInfo" style="display: none;" ></div>
	</div>
	<div>
		<table id="roomListTable"></table>
	</div>
	<div id="page_roomList" style="margin-top:10px;"></div>
</div>
</body>
</html>