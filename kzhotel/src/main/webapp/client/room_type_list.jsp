<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->房型管理</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/roomTypeList.js"></script>
<script>
/*编辑 关闭upFileDiv*/
var closeUpFileDiv_editroomtype = function(){
	$('#hif_mapMask_editroomtype').hide();
	$('#upFileDiv_editroomtype').hide();
	$('#upFileClose_editroomtype').hide();
};
/*新增 关闭upFileDiv*/
var closeUpFileDiv_addroomtype = function(){
	$('#hif_mapMask_addroomtype').hide();
	$('#upFileDiv_addroomtype').hide();
	$('#upFileClose_addroomtype').hide();
};
</script>
<div>
	<div style="padding:8px 50px;">
		<span>房型名称:</span>
		<span>
			<input  id="rtl_roomTypeName" style="width:130px;" />
		</span>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="rtl_searchroomtype"
				data-options="iconCls: 'icon-search'" >搜索</a>
		<a style="height:30px;padding:0px 10px" id="rtl_addNewRoomType" class="easyui-linkbutton"  >新增</a>
		
		<%-- 编辑 --%>
		<div id="showEditRoomTypeListInfo" style="display: none;" ></div>
		
		<%-- 新增 --%>
		<div id="showAddRoomTypeListInfo" style="display: none;" ></div>
	</div>
	<div>
		<table id="roomTypeListTable"></table>
	</div>
	<div id="page_roomTypeList" style="margin-top:10px;"></div>
</div>
</body>
</html>