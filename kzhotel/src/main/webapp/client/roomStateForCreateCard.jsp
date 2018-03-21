<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>房态图菜单点击制卡页面dialog</title>
</head>
<body>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/roomStateForCreateCard.css" />
	<div class="ruzhu_infor" style="width: 410px;margin:0 auto;">
			<div class="line">
				<div class="fl">制门卡</div>
				<div class="fr"><span id="OrderNo"></span></div>
			</div>
			<div class="types">
				<ul>
					<li style="margin-right: 50px; display: inline">
						<label style="width: 50px">房号：</label>
						<p class="RoomNo"></p>
					</li>
					<li style="margin-right: 0px; display: inline">
						<label>房间类型：</label>
						<p class="RoomTypeName"></p>
					</li>
					<li style="margin-right: 50px; display: inline;" class="show">
						<label style="width: 50px">姓名：</label>
						<p class="Customer_Name"></p>
					</li>
					<li style="margin-right: 0px; display: inline;" class="show">
						<label>入住时间：</label>
						<p class="EnterDate"></p>
					</li>
					<li style="margin-right: 50px; display: inline;" class="show">
						<label style="width: 50px">客源：</label>
						<p class="Source"></p>
					</li>
					<li style="margin-right: 0px; display: inline;" class="show">
						<label>入住类型：</label>
						<p class="OpenTypeName"></p>
					</li>
				</ul>
			</div>
			<div class="types" style=" border: 1px solid #ddd"><!-- background: #EFEFEF; -->
				<ul>
					<li>
						<label style="width: 160px">将宾客卡使用时间更新至：</label>
						<select style="width: 60px" id="Days">
							<option value="1">1</option>
							<option value="2">2</option>
						</select>
						<label style="width: 20px">天</label>
					</li>
					<li>
						<input type="text" id="WantLeaveDate" value="">
					</li>
				</ul>
			</div>
		</div>
	
</body>
</html>