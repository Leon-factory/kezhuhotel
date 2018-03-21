<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>驿宝首页</title>
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
    <link rel="Shortcut Icon" href="img/eapolog.ico" />
    <!-- <link href="home/css/style.css" rel="stylesheet" />    
    <link href="home/css/home.css" rel="stylesheet" /> -->
    <link href="https://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">
</head>
<body>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
 <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.34.5/js/bootstrap-dialog.min.js"></script>
 
 <i class="fa fa-user" aria-hidden="true"></i>姓名
 <i class="fa fa-transgender" aria-hidden="true"></i>性别
 <i class="fa fa-id-card" aria-hidden="true"></i>id-card
 <form action="upfile/uploadGuestPhoto" enctype="multipart/form-data" method="post">
	<input type="file" name="file">	<br>
	<input type="submit"/>
</form>
	
<script type="text/javascript">

/* bp.Lpost.lid[0]=22
bp.Lpost.lid[1]=33 */
/* var x=[22,33] */

var a={}
a.lid=22;

var bp={};
bp.Lpost=[];
bp.Lpost.push(a);

var b={};
b.lid=33;
bp.Lpost.push(b);

var xx=[22,33];

var abc=JSON.stringify(xx);

//console.info(abc);
//'{bp:{"Lpost":[{"lid":22},{"lid":33}]}}'
$(function(){
	/* var timePrice = {
			actualAmount:0
	}
	var data = {
			breakfastNumber:2,
			channelId:2,
			comment:"",
			guarantee_amount:0,
			isBreakfast:1,
			linkByReserve:false,
			linkReceptionId:0,
			livingguestList:[
			                 {
			                	 guestName:"bvdfgs",
			                	 firstName:"bvdfgs",
			                	 lastName:"",
			                	 phone:"13016996325",
			                	 sexCode:0,
			                	 email:"",
			                	 address:"",
			                	 photo:"",
			                	 certificateType:"1",
			                	 certificateCode:"500102199308027093",
			                	 guestId:0,
			                	 roomId:2,
			                	 roomCode:"A102"
			                 }],
			memberPhone:"",
			paymentList:[
			             {
			            	 paymethodCode:"1",
			            	 paymethodName:"现金",
			            	 amount:"500000",
			            	 scene:"入住"
			            	}
			             ],
			             rentplanId:1,
			             useChannelCredit:0,
			             rentList:[
			                       {
			                    	   checkinType:1,
			                    	   checkoutOperator:"wyx",
			                    	   expectedLeaveTime:"2017-10-24T04:00:00.000Z",
			                    	   roomId:2,
			                    	   roomCode:"A102",
			                    	   roomtypeId:1,
			                    	   roomtypeName:"单人间",
			                    	   expectedStayNumber:"1",
			                    	   reserveDetailId:0
			                       }],
			                       timePriceRange:{
			                    	   actualAmount:0,
			                    	   priceList:[1,2,3,4],
			                    	   actualPriceList:[1,2,3,4],
			                    	   checkinTypeList:[2,3],
			                    	   numberList:[5.22,4.5],
			                    	   timeList:["2017-10-24 04:00:00"],
			                    	   hasPrice:[false,true]
	
			                       }
			             
			
			
	};
	console.info(data); */
	var data = {
			str: "ok"
	}
	$.ajax({
		type:'get',
		url:'/kzhotel/test/testSpring',
		data:data,
		dataType:'json',
		contentType:'application/json;charset=utf-8',
		success:function(result){
			console.info(result);
		},
		error:function(err){
			console.warn('err');
			console.info(err);
		}
	})
})
</script>
   
   
</body>
</html>