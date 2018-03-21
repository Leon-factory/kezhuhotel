<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>显示读二代身份证后的结果 展示页面</title>
</head>
<body>
	<div id="readCard_div" style="background:url('../img/idCardBG.jpg') no-repeat 65% 100%;">
		<style>
			.container-readCard{min-height:310px;max-width:560px;padding:0px 20px 20px 80px;box-sizing: border-box;font-size:14px;}
			.line-readCard{height: 30px;line-height: 30px;vertical-align: middle;}
		    .label-readCard{display: inline-block;width: 40px;color:rgb(0, 112, 255);}
		    .label-readCard-line{display: inline-block;width: 90px;color:rgb(0, 112, 255);}
		    .mag{margin-left:40px;margin-right: 5px;}
		    .photo-container{display:inline-block;padding-top:20px;position: relative;top: 10px;left:15px;}
		    .img-readCard{width:96px; height:118px;}
		    .inloneblock-readCard{display:inline-block;}
		    .last-readCard{width:70px;}
		</style>
		<div class="container-readCard">
			<div class="inloneblock-readCard">
				<div class="line-readCard"><label class="label-readCard">姓名</label><span id="name_readCardResult"></span></div>
				<div class="line-readCard"><label class="label-readCard">性别</label><span id="sex_readCardResult"></span>
					 <label class="label-readCard mag">民族</label><span id="nation_readCardResult"></span></div>
				<div class="line-readCard"><label class="label-readCard">出生</label><span id="birthDay_readCardResult"></span></div>
				<div class="line-readCard"><label class="label-readCard">住址</label><span id="address_readCardResult"></span></div>
			</div>
			<div class="photo-container">
				<img id="photoInfo_readCardResult" name="Photo" class="img-readCard"/>
			</div>
			<div class="line-readCard"><label class="label-readCard-line">公民身份号码</label><span id="idCode_readCardResult"></span></div>
			<div class="line-readCard"><label class="label-readCard-line last-readCard">签发机关</label><span id="idIssue_readCardResult"></span></div>
			<div class="line-readCard"><label class="label-readCard-line last-readCard">有效期限</label><span id="effectiveBeginTime_readCardResult"></span> - <span id="effectiveEndTime_readCardResult"></span></div>
		</div>
	</div>
</body>
</html>