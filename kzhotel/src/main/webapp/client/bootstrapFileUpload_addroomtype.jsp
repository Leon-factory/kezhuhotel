<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>房型列表-->新增图片上传</title>
</head>
<body>
	<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath }/css/fileinput.min.css" media="all" rel="stylesheet" type="text/css" />
	
	
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/jquery-3.1.1.min.js" ></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath }/js/bsupload/fileinput.min.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath }/js/bsupload/es.js" type="text/javascript"></script>
    <script src="${pageContext.request.contextPath }/js/bsupload/zh.js" type="text/javascript"></script>

		<input id="file-addroomtype" name="file" class="file" type="file" multiple data-min-file-count="1"/>
		<script>
	$("#file-addroomtype").fileinput({
		allowedFileExtensions : [ 'jpg', 'png'],
		showUpload : true,
		showRemove : false,
		language : 'zh',
		allowedPreviewTypes : [ 'image' ],
		allowedFileTypes : [ 'image' ],
		maxFileCount : 1,
		maxFileSize : 100,

		minImageWidth : 60, //图片的最小宽度
		minImageHeight : 60,//图片的最小高度
		maxImageWidth : 480,//图片的最大宽度
		maxImageHeight : 480//图片的最大高度
		,uploadUrl :'../upfile/uploadRoomTypeFile'
	});
	$('#file-addroomtype').on('fileuploaded',function(event, data, previewId, index) {
		var form = data.form, 
		files = data.files,
		extra = data.extra,
		response = data.response,
		reader = data.reader;
		parent.document.getElementById("roomTypeList_addPhoto").setAttribute("src",parent.eapor.data.bootStrapFileUploadUrl+"/upload/uploadRoomtype/"+ response.statusMsg);
		parent.closeUpFileDiv_addroomtype();//关闭图片上传组件
		
		$('.kv-file-remove').trigger('click');
	});
</script>
</body>
</html>