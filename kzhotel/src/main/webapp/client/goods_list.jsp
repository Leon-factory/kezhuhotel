<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>设置-->商品管理</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/goodsList.js"></script>
<div>
	<div style="padding:8px 20px;">
		<input id="gl_goodsCategoryNameSelect"  style="width:200px;"
			label="商品类别：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		<input id="gl_goodsNameSelect"  style="width:200px;"  
			label="商品名称：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="gl_searchGoods" data-options="iconCls: 'icon-search'" >搜索</a>
		<%-- 编辑 --%>
		<div id="showEditGoodsListInfo" style="display: none;" ></div>
		<%-- 新增 --%>
		<div id="showAddGoodsListInfo" style="display: none;" ></div>
	</div>
	<div>
		<table id="goodsListTable"></table>
		<div id="page_goodsList" style="margin-top: 10px;"></div>
	</div>
</div>
</body>
</html>