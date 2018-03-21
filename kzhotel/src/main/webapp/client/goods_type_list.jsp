<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>商品类别管理</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/goodsTypeList.js"></script>
<div>
	<div>
		<%-- 编辑 --%>
		<div id="showEditGoodsTypeListInfo" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddGoodsTypeListInfo" style="display: none;" ></div>
		
		<table id="goodsTypeListTable" ></table>
		<div id="page_goodsTypeList" style="margin-top: 10px;"></div>
	</div>
</div>
</body>
</html>