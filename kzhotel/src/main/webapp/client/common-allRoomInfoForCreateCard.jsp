<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>制卡选择公共页面</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/common-allRoomInfoForCreateCard.js"></script>
<div id="layoutDiv_employeeManage_common" class="easyui-layout" style="width:100%;height:575px;">   
    <div data-options="region:'north',title:''" style="height:50px;padding-top:8px;padding-left:50px;">
    	<span>房号:</span>
    	<span>
    		<input class="easyui-textbox" id="rl_roomInput_common" style="width:130px;"/>
    	</span>
		<span>房间类型:</span>
		<span>
			<input class="easyui-combobox" id="rl_roomTypeSelect_common" style="width:130px;" />
		</span>
		<span>楼层选择:</span>
		<span>
			<input class="easyui-combobox" id="rl_floorSelect_common" style="width:130px;"/>
		</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="rl_searchRoom_common"
			data-options="iconCls: 'icon-search'" href="javascript:void(0)">搜索</a>
    </div>   
    <div data-options="region:'center',title:''" style="padding:0px;">
    	<table id="roomListTable_common" style="width:100%;"></table>
    </div>
</div>
</body>
</html>