<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>酒店信息</title>
</head>
<body> 
<style type="text/css">
	#him_ul_name li {
		margin-bottom: 8px;
	}
	
	#him_ul_value li {
		margin-bottom: 8px;
	}
</style>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/upbusiness.js"></script>
	
	<div class="easyui-layout" id="hotelInfo_layout" style="width: 98%;padding-top:10px;overflow:auto;">
			<input id="province_hotelInfo" type="hidden">
			<input id="city_hotelInfo" type="hidden">
			<input id="district_hotelInfo" type="hidden">
			<div id="hif_mapMask" style="position: fixed; margin: 0 auto; left: 0px; top: 0px; width: 100%; height: 100%;
					 background-color: gray; display: none;z-index:8;"></div>
			 <%-- 地图Div --%>
			<div id="mapDiv" style="position:absolute; top: 1%; /*margin-left: -250px; margin-top: -110px; */
					 z-index: 20; width: 50%; height: 500px; display: none; background-color: white;"></div>
			<span class="mapClose" id="mapClose" style="background:url(../img/delete.png) no-repeat;background-size: 100%;z-index: 77; width: 28px; height: 28px; display: none;
					 position: absolute; top: 0px; cursor: pointer; color: red;border-radius:35px;"></span>
			 <%-- 文件上传Div --%>
			<div id="upFileDiv"  style="position: absolute;  top: 2%;/* margin-left: -250px; margin-top: -110px;*/ 
					z-index: 20; width:880px; height:520px; display: none; background-color: white; padding-top: 10px;padding-left: 20px;">
					<p class="upFileClose"   id="upFileClose" style="position: absolute; top: -12px; right:-12px;background:url(../img/delete.png) no-repeat;background-size: 100%;border-radius:35px;z-index: 77; width: 28px; height: 28px; display: none;
					  cursor: pointer; color: red;float: right;"></p>
				<iframe src="../client/bootstrapFileUpload_hotelInfo.jsp" name="iframe" width="800px" height="500px"></iframe>
				
			</div>
			
			<div>
				<div class="left">
					<ul id="him_ul_name">
						<li>酒店名称：</li>
						<li>联系人：</li>
						<li>联系电话：</li>
						<li>邮箱：</li>
						<li  style="height:35px;">地址：</li>
						<li>经度：</li>
						<li>纬度：</li>
						<li>省市区：</li>
						<li></li>
						<li>预定电话：</li>
						<li style="height:100px;"><p  style="line-height:18px;">酒店形象图片：</p><p style="font-size:12px;line-height:18px;color:#777;">（图片格式为jpg、png，<br>不超过480*480像素，<br>不超过100KB）</p></li>
						<li></li>
						<li style="height:180px;"><p style="line-height:18px;">酒店文字简介：</p><p style="font-size:12px;line-height:18px;color:#777;">（140字以内）</p></li>
						<li >门禁发卡器标识：</li>
					</ul>
				</div>
				<div class="right">

					<form id="himform" method="POST">
						<ul id="him_ul_value">
							<li>
								<input id="hotel_id" name="hotel_id" type="hidden"/> 
								<input class="easyui-textbox"  id="hotel_name" name="hotel_name"  style="height:32px;"/>
							</li>
							<li>
								<input class="easyui-textbox" id="hotel_con" name="hotel_con"  style="height:32px;"/>
							</li>
							<li>
								<input  class="easyui-numberbox"  id="hotel_mobile" name="hotel_mobile" data-options="validType:['mobilephone'],validateOnCreate:false,validateOnBlur:true"  style="height:32px;"/>
							</li>
							<li>
								<input class="easyui-textbox" id="hotel_email" name="hotel_email" data-options="validType:['email']"  style="height:32px;"/>
							</li>
							<li style="height:35px;">
								<input class="easyui-textbox" id="hotel_add" name="hotel_add" data-options="validType:['maxLength[32]'],multiline:true"/>
							</li>
							<li>
								<input class="easyui-numberbox" id="hotel_long" name="hotel_long"   data-options="precision:7" style="height:32px;"/>
							</li>
							<li>
								<input class="easyui-numberbox" id="hotel_lat" name="hotel_lat"   data-options="precision:7" style="height:32px;"/>
							</li>
							<li>
								<input class="easyui-textbox" disabled id="hotel_prov_city" name="hotel_prov_city" style="height:32px;"/>
							</li>
							<li>
								<input style="width: 175px;height:30px;" class="easyui-linkbutton" value="显示地图(点击地图获取坐标)"id="hif_showMap" /> 
							</li>
							<li>
								<input class="easyui-textbox" id="hotel_reserveTel" name="hotel_reserveTel" style="height:32px;"/>
							</li>
							<li style="height: 100px;">
								<img id="hotel_photo" style="width: 100px; height: 100px;border:1px solid #ccc;" src="" alt="酒店形象图片"/>
							</li>
							<li style="height: 30px;">
								<input class="easyui-linkbutton" id="hif_showUpFileBtn" style="width: 70px;height:30px;" value="上传图片"  />
							</li>
							<li style="height: 180px;">
								<input class="easyui-textbox" style="height:180px;" id="hotel_description" name="hotel_description" type="text" data-options="multiline:true,validType:['maxLength[140]'],invalidMessage:'最大输入长度为140个字符'"  />
							</li>
							<li>
								<input class="easyui-textbox" id="hotel_hotelIdentity" name="hotel_hotelIdentity" data-options="validType:['hotelIdentity']" type="text"  style="height:32px;"/>
							</li>
						</ul>

						<input class="easyui-linkbutton" id="businessSubmit"  value="提交" style="width: 80px; height: 30px" /> 
						<input class="easyui-linkbutton" type="reset" value="清空" style="width: 80px; height: 30px"/>
					</form>
				</div>
			</div>
	</div>
</body>
</html>