/**
 * @name宾客档案JS
 */
~(function(){
	"use strict";
//搜索btn
$('#search_guestFile').on('click',function(){
	if(!$('#phone_guestFile').textbox('isValid')){
		$('#phone_guestFile').textbox('textbox').focus();
		return;
	}
	if(!$('#idCard_guestFile').textbox('isValid')){
		$('#idCard_guestFile').textbox('textbox').focus();
		return;
	}
	var guestName_guestFile = $('#guestName_guestFile').textbox('getValue');
	var phone_guestFile = $('#phone_guestFile').textbox('getValue');
	var idCard_guestFile = $('#idCard_guestFile').textbox('getValue');
	var passport_guestFile = $('#passport_guestFile').textbox('getValue');
	var officerCertificate_guestFile = $('#officerCertificate_guestFile').textbox('getValue');
	if(!guestName_guestFile && !phone_guestFile && !idCard_guestFile 
			&& !passport_guestFile && !officerCertificate_guestFile){
		$.messager.show({title:'系统提示',msg:'搜索信息请至少输入一项！',timeout:3000,showType:'slide'});
		return;
	}
	$.ajax({
		type:'post',
		url:'../guest/lstginfo',
		data:{guestName:guestName_guestFile,strphone:phone_guestFile,identitycardnumber:idCard_guestFile
				,passportnumber:passport_guestFile,officercardnumber:officerCertificate_guestFile
		},
		dataType:'json',
		success:function(result){
			console.info(result);
			if(eapor.utils.ajaxCallBackErrInfo(result)){
				return;
			}
			if(typeof(result) === 'object' && result.length == 0){
				$.messager.show({title:'系统提示',msg:'未查询到相关信息！',timeout:5000,showType:'slide'});
				return;
			}
			var arr = [];
			
			for(let i=0;i<result.length;i++){
				arr.push(result[i]);
				arr.push({'guestName':'备注','phone':result[i].gnote})
			}
			console.info(arr);
			$('#briefInfo_guestFile').datagrid('loadData',arr);
		}
	});
});

eapor.guestFile = {
		guestId : -1,
		index : -1,
		sameFlag : "",
		updata : "",
		getRowInfo:function(index){
			return {
					guestId:this.getRowValue("guestId",index),
		            gnote:this.getRowValue("gnote",index),
		            guestName:this.getRowValue("guestName",index),
		            phone:this.getRowValue("phone",index),
		            bindingMemberPhone:this.getRowValue("bindingMemberPhone",index),
		            identityCardNumber:this.getRowValue("identityCardNumber",index),
		            homeCharge:this.getRowValue("homeCharge",index),
		            memberType:this.getRowValue("memberType",index),
		            intRFM:this.getRowValue("intRFM",index),
		            groupCode:this.getRowValue("groupCode",index),
		            dtneardissipate:this.getRowValue("dtneardissipate",index),
		            intnearmonetary:this.getRowValue("intnearmonetary",index),
		            strroomtype:this.getRowValue("strroomtype",index),
		            strroomid:this.getRowValue("strroomid",index),
		            strtourists:this.getRowValue("strtourists",index)
			};
		},
		getRowValue:function(key,index){
			if(index == undefined){
				index = 0;
			}
			var h = $('#briefInfo_guestFile').prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked');
			return $(h[index]).find('td[field="'+key+'"]').find('div:eq(0)').text();
		},
		getTdValue:function(key){
			return $('#briefInfo_guestFile').prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
						.find('td[field="'+key+'"]').find('div:eq(0)').text();
		},
		editCallBack :function(f){
			var datagrid = $('#briefInfo_guestFile');
			switch(f){
				case 1://姓名
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'guestName': eapor.guestFile.updata}});
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
						.find('td[field="guestName"]').find('div:eq(0)').text(eapor.guestFile.updata);
					break;
				case 4://手机 
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'phone': eapor.guestFile.updata}});
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
					.find('td[field="phone"]').find('div:eq(0)').text(eapor.guestFile.updata);
					break;
				case 5://是否绑定会员手机
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'bindingMemberPhone': eapor.guestFile.updata}});
					var v = -1;
					if(eapor.guestFile.updata == 0){v = "否";};
					if(eapor.guestFile.updata == 1){v = "是";};
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
					.find('td[field="bindingMemberPhone"]').find('div:eq(0)').text(v);
					break;
				case 6://身份证
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'identityCardNumber': eapor.guestFile.updata}});
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
					.find('td[field="identityCardNumber"]').find('div:eq(0)').text(eapor.guestFile.updata);
					break;
				case 11://vip/黑名单
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'groupCode': eapor.guestFile.updata}});
					var k = -1;
					if(eapor.guestFile.updata == 0){k = "--";};
					if(eapor.guestFile.updata == 1){k = "VIP！";};
					if(eapor.guestFile.updata == 2){k = "黑名单！";};
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
						.find('td[field="groupCode"]').find('div:eq(0)').text(k);
					break;
				case 12://备注
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index,row: {'phone': eapor.guestFile.updata}});
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
					.find('td[field="gnote"]').find('div:eq(0)').text(eapor.guestFile.updata);
					//datagrid.datagrid('updateRow',{index: eapor.guestFile.index+1,row: {'phone': eapor.guestFile.updata}});
					datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked').next()
					.find('td[field="phone"]').find('div:eq(0)').text(eapor.guestFile.updata);
					break;
			}
			//var r = JSON.stringify($('#briefInfo_guestFile').datagrid('getRows')[eapor.guestFile.index]);
			var d = {
					guestId: this.getTdValue("guestId"),
					gnote: this.getTdValue("gnote"),
					guestName: this.getTdValue("guestName"),
					phone: this.getTdValue("phone"),
					bindingMemberPhone: this.getTdValue("bindingMemberPhone"),
					identityCardNumber: this.getTdValue("identityCardNumber"),
					idaddress: this.getTdValue("idaddress"),
					homeCharge: this.getTdValue("homeCharge"),
					memberType: this.getTdValue("memberType"),
					intRFM: this.getTdValue("intRFM"),
					groupCode: this.getTdValue("groupCode"),
					dtneardissipate: this.getTdValue("dtneardissipate"),
					intnearmonetary: this.getTdValue("intnearmonetary"),
					strroomtype: this.getTdValue("strroomtype"),
					strroomid: this.getTdValue("strroomid"),
					strtourists: this.getTdValue("strtourists")
			};
			
			console.info(d);
			eapor.guestFile.showCallBack(d);
		},
		showCallBack : function(rr){
			$('#personalInfo_guestFile').datagrid('loadData',{total:0,rows:[]}); 
			$('#VIPAndConsumeInfo_guestFile').datagrid('loadData',{total:0,rows:[]}); 
			$('#remarkAndPictureInfo_guestFile').datagrid('loadData',{total:0,rows:[]}); 
			$('#driveInfo_guestFile').datagrid('loadData',{total:0,rows:[]}); 
			$('#invoiceInfo_guestFile').datagrid('loadData',{total:0,rows:[]}); 
	       if(typeof(rr)!="string"){
	    	   console.info(123);
	    	   var guestInfo = rr;
	       }else{
	    	   console.info(456);
	    	   var guestInfo = JSON.parse(rr);
	       }
			console.info(guestInfo);
			$.ajax({
				type:'post',
				url:'../guest/guestinfodetail',
				data:{guestId:eapor.guestFile.guestId},
				dataType:'json',
				success:function(result){
					console.info(result);
					console.info(result.fhotelinfo == "[]");
					console.info(result.fpubinfo);
					var hotelId = $('#indexhotelId').val();
					console.info(hotelId);
					/**@result.fpubinfo
					 * //宾客姓名pub1
						//性别pub2
						//绑定会员手机号码pub3
						//身份证号码pub4
						//身份证地址pub5
						//护照号码pub6
						//军官证号码pub7
						//备注pub8

						@result.fhotelinfo
						//称谓 pri1
						//宾客手机号码 pri2
						//电子邮件 pri3
						//快递地址 pri4
						//VIP/黑名单 pri5
					 * */
					
					//a 宾客姓名 、b 性别、  c 称谓、d 手机号码 、e 绑定会员手机 、f 身份证号码 、faddress 身份证地址、g 护照号码 、h 军官证号码
					//i 电子邮件 、j 快递地址、k VIP/黑名单
					
					//l 会员、m 本店储值金额、n 客户经理、oo RFM、p 最近消费时间、q 最近消费金额、r 2年内消费频次汇总
					//s 2年内消费金额汇总、t 最近入住房型、u 最近入住房号、v 最近客源
					
					//w 宾客备注 、x 宾客照片
					
					//y 厂商 、 z 车型、 aa 车牌
					
					//bb 公司名称、cc 公司税号、dd. 公司地址、ee 开户行、ff 账号
					
					console.info(guestInfo);
					
					var a = {},b = {},c = {},d = {},e = {},f = {},faddress = {},g = {},h = {},i = {},j= {},k = {},
					l = {},m ={},n = {},oo = {},p = {},q = {},r = {},s = {},t = {},u = {},v = {},
					w = {},x = {},
					y = {},z = {},aa = {},
					bb = {},cc = {},dd = {},ee = {},ff = {};
					if(result.fpubinfo && result.fpubinfo !== "[]"){
						//eapor.guestFile.guestInfo = "";
						var fpubinfo;
						try{
							fpubinfo = JSON.parse(result.fpubinfo);
						}catch(err){
							fpubinfo = [];
						}
						console.info(fpubinfo);
						for(let ii=0;ii<fpubinfo.length;ii++){
							var o = fpubinfo[ii];
							var key = o.k;
						switch(key){
							case "pub1":
								if(o.hotelId == hotelId){
									a.lastEditer = o.u;
									a.lastEditTime = o.t;
								}else{
									a.lastEditer = "***";
									a.lastEditTime = "***";
								}
								break;
							case "pub2":
								if(o.hotelId == hotelId){
									b.lastEditer = o.u;
									b.lastEditTime = o.t;
								}else{
									b.lastEditer = "***";
									b.lastEditTime = "***";
								}
								break;
							/*case "pub3":
								c.lastEditer = o.u;
								c.lastEditTime = o.t;
								break;
							case "a4":
								d.lastEditer = o.u;
								d.lastEditTime = o.t;
								break;*/
							case "pub3":
								if(o.hotelId == hotelId){
									e.lastEditer = o.u;
									e.lastEditTime = o.t;
								}else{
									e.lastEditer = "***";
									e.lastEditTime = "***";
								}
								break;
							case "pub4":
								if(o.hotelId == hotelId){
									f.lastEditer = o.u;
									f.lastEditTime = o.t;
								}else{
									f.lastEditer = "***";
									f.lastEditTime = "***";
								}
								break;
							case "pub6":
								if(o.hotelId == hotelId){
									g.lastEditer = o.u;
									g.lastEditTime = o.t;
								}else{
									g.lastEditer = "***";
									g.lastEditTime = "***";
								}
								break;
							case "pub7":
								if(o.hotelId == hotelId){
									h.lastEditer = o.u;
									h.lastEditTime = o.t;
								}else{
									h.lastEditer = "***";
									h.lastEditTime = "***";
								}
								break;
							case "pub8":
								if(o.hotelId == hotelId){
									w.lastEditer = o.u;
									w.lastEditTime = o.t;
								}else{
									w.lastEditer = "***";
									w.lastEditTime = "***";
								}
								break;
							}
						}
					}
					var fhotelinfo = [];
					if(result.fhotelinfo && result.fhotelinfo !== "[]"){
						fhotelinfo = JSON.parse(result.fhotelinfo);
						for(let iii_ = 0; iii_ < fhotelinfo.length; iii_++){
							var gg_ = fhotelinfo[iii_];
							var ggkey_ = gg_.k;
							switch(ggkey_){
								case "pri1":
									c.lastEditer = gg_.u;
									c.lastEditTime = gg_.t;
									break;
								case "pri2":
									d.lastEditer = gg_.u;
									d.lastEditTime = gg_.t;
									break;
								case "pri3":
									i.lastEditer = gg_.u;
									i.lastEditTime = gg_.t;
									break;
								case "pri4":
									j.lastEditer = gg_.u;
									j.lastEditTime = gg_.t;
									break;
								case "pri5":
									k.lastEditer = gg_.u;
									k.lastEditTime = gg_.t;
									break;
							}
					}
				}
					var gmark = [];
					if(result.gmark && result.gmark !== "[]" ){
						gmark = JSON.parse(result.gmark);
						for(let iii = 0; iii < gmark.length; iii++){
							var gg = gmark[iii];
							var ggkey = gg.k;
					switch(ggkey){
						case "zp":
							x.content = gg.v;
							if(gg.hotelId == hotelId){
								x.lastEditer = gg.u;
								x.lastEditTime = gg.t;
							}else{
								x.lastEditer = "***";
								x.lastEditTime = "***";
							}
							break;
						case "cs":
							y.content = gg.v;
							if(gg.hotelId == hotelId){
								y.lastEditer = gg.u;
								y.lastEditTime = gg.t;
							}else{
								y.lastEditer = "***";
								y.lastEditTime = "***";
							}
							break;
						case "cx":
							z.content = gg.v;
							if(gg.hotelId == hotelId){
								z.lastEditer = gg.u;
								z.lastEditTime = gg.t;
							}else{
								z.lastEditer = "***";
								z.lastEditTime = "***";
							}
							break;
						case "cp":
							aa.content = gg.v;
							if(gg.hotelId == hotelId){
								aa.lastEditer = gg.u;
								aa.lastEditTime = gg.t;
							}else{
								aa.lastEditer = "***";
								aa.lastEditTime = "***";
							}
							break;
						case "gsmc":
							bb.content = gg.v;
							if(gg.hotelId == hotelId){
								bb.lastEditer = gg.u;
								bb.lastEditTime = gg.t;
							}else{
								bb.lastEditer = "***";
								bb.lastEditTime = "***";
							}
							break;
						case "gssh":
							cc.content = gg.v;
							if(gg.hotelId == hotelId){
								cc.lastEditer = gg.u;
								cc.lastEditTime = gg.t;
							}else{
								cc.lastEditer = "***";
								cc.lastEditTime = "***";
							}
							break;
						case "gsdz":
							dd.content = gg.v;
							if(gg.hotelId == hotelId){
								dd.lastEditer = gg.u;
								dd.lastEditTime = gg.t;
							}else{
								dd.lastEditer = "***";
								dd.lastEditTime = "***";
							}
							break;
						case "khh":
							ee.content = gg.v;
							if(gg.hotelId == hotelId){
								ee.lastEditer = gg.u;
								ee.lastEditTime = gg.t;
							}else{
								ee.lastEditer = "***";
								ee.lastEditTime = "***";
							}
							break;
						case "zh":
							ff.content = gg.v;
							if(gg.hotelId == hotelId){
								ff.lastEditer = gg.u;
								ff.lastEditTime = gg.t;
							}else{
								ff.lastEditer = "***";
								ff.lastEditTime = "***";
							}
							break;
					    }
					 }
				  }
					a.item = "<i class='fa fa-user-o' aria-hidden='true'></i>&nbsp; 宾客姓名"; a.content = guestInfo.guestName; 
						b.item = "<i class='fa fa-genderless' aria-hidden='true'></i>&nbsp; 性别"; b.content = result.sexcode;
						if(b.content == 0){
							b.content = "男";
						}else{
							b.content = "女";
						}
						c.item = "<i class='fa fa-bookmark' aria-hidden='true'></i>&nbsp; 称谓";c.content = result.title;
						if(!c.content){c.content = "";};
						d.item = "<i class='fa fa-mobile' aria-hidden='true'></i>&nbsp; 手机号码"; d.content = guestInfo.phone;
					e.item = "<i class='fa fa-info' aria-hidden='true'></i>&nbsp; 绑定会员手机";
					e.content = guestInfo.bindingMemberPhone; 
					
		  		   	f.item = "<i class='fa fa-id-card' aria-hidden='true'></i>&nbsp; 身份证号码"; f.content = result.identitycardnumber;
		  		   	faddress.item = "<i class='fa fa-id-card' aria-hidden='true'></i>&nbsp; 身份证地址"; faddress.content = result.idaddress;
					g.item = "<i class='fa fa-address-book-o' aria-hidden='true'></i>&nbsp; 护照号码"; g.content = result.passportnumber;
					h.item = "<i class='fa fa-id-badge' aria-hidden='true'></i>&nbsp; 军官证号码"; h.content = result.officercardnumber;
					i.item = "<i class='fa fa-envelope-o' aria-hidden='true'></i>&nbsp; 电子邮件"; i.content = result.email;
					j.item = "<i class='fa fa-address-card-o' aria-hidden='true'></i>&nbsp; 快递地址"; j.content = result.expressaddress;
					k.item = "<i class='fa fa-info-circle' aria-hidden='true'></i>&nbsp; VIP/黑名单"; k.content = guestInfo.groupCode;
					if( k.content == 1){
						 k.content = "VIP！";
					}else if(k.content == 2){
						 k.content = "黑名单！";
					}else if(k.content == 0){
						k.content = "--";
					}
					var arrA = [];
					arrA.push(a);arrA.push(b);arrA.push(c);arrA.push(d);arrA.push(e);
					arrA.push(f);arrA.push(faddress);arrA.push(g);arrA.push(h);arrA.push(i);arrA.push(j);arrA.push(k);
					console.info(arrA);
					$('#personalInfo_guestFile').datagrid('loadData',arrA);
					//-------会员和消费tab-----
					
					l.item = "会员"; l.content = guestInfo.memberType; if(!l.content){l.content = "";};
					m.item = "本店储值金额"; m.content = NP.divide(guestInfo.homeCharge, 100);
					n.item = "客户经理"; n.content = "--";
					oo.item = "RFM"; oo.content = guestInfo.intRFM;
					p.item = "最近消费时间"; 
					if(guestInfo.dtneardissipate && guestInfo.dtneardissipate != "--"){
						p.content = getDate(guestInfo.dtneardissipate);
					}else{
						p.content = "--";
					}
					q.item = "最近消费金额";
				    if(typeof(rr)!="string"){
			    	    q.content = guestInfo.intnearmonetary;
			        }else{
			    	    q.content = NP.divide(guestInfo.intnearmonetary, 100);
			        }
					r.item = "2年内消费频次汇总"; r.content = "--";
					s.item = "2年内消费金额汇总"; s.content = "--";
					t.item = "最近入住房型"; t.content = guestInfo.strroomtype;
					u.item = "最近入住房号"; u.content = guestInfo.strroomid;
					v.item = "最近客源";
					var channenName = "";
					$.each(eapor.data.channelObj,function(i,item){
						console.info(item.channelId == guestInfo.strtourists)
         			   if(item.channelId == guestInfo.strtourists){
         				  v.content = item.channelName;
         				  return; 
         			   }
         		   });
					if(v.content == ""){
						v.content = guestInfo.strtourists;
					}
					var arrB = [];
					arrB.push(l);arrB.push(m);arrB.push(n);arrB.push(oo);arrB.push(p);arrB.push(q);
					arrB.push(r);arrB.push(s);arrB.push(t);arrB.push(u);arrB.push(v);
					$('#VIPAndConsumeInfo_guestFile').datagrid('loadData',arrB);
					//-------备注和照片----
					
					w.item = "宾客备注";w.content = guestInfo.gnote;
					x.item = "宾客照片";
					//x.content = "--";
					//x.lastEditer = "--";x.lastEditTime = "--";
					var arrC = [];
					console.info(x);
					arrC.push(w);arrC.push(x);
					$('#remarkAndPictureInfo_guestFile').datagrid('loadData',arrC);
					//--------驾车信息---------------
					
					y.item = "厂商";z.item = "车型";aa.item = "车牌";
					var arrD = [];
					arrD.push(y);arrD.push(z);arrD.push(aa);
					$('#driveInfo_guestFile').datagrid('loadData',arrD);
					//----------发票信息--------------
					
					bb.item = "公司名称";cc.item = "公司税号";dd.item = "公司地址";ee.item = "开户行";ff.item = "账号";
					var arrE = [];
					arrE.push(bb);arrE.push(cc);arrE.push(dd);arrE.push(ee);arrE.push(ff);
					$('#invoiceInfo_guestFile').datagrid('loadData',arrE);
				}
			});
		}
};
//显示btn
$('#show_guestFile').on('click',function(){
	var datagrid = $('#briefInfo_guestFile');//datagrid-row-hover
	var tr = datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked');
	var le1 = tr.length;

	if(le1 != 1){
		$.messager.show({title:'系统提示',msg:'请先选择一项要显示的信息！',timeout:3000,showType:'slide'});
		return;
	}
	var index = tr.index();
	var guestInfo = $('#briefInfo_guestFile').datagrid('getRows')[index];
	
	eapor.guestFile.index = datagrid.datagrid('getRowIndex',guestInfo);
	eapor.guestFile.guestId = guestInfo.guestId;
	var r = JSON.stringify(guestInfo);
	eapor.guestFile.showCallBack(r);
});
//编辑btn
$('#edit_guestFile').on('click',function(){
	var tab = $('#tabs_guestFile').tabs('getSelected');
	var datagridId = tab.children().children().children().find('table:eq(4)').attr('id');
	if( datagridId == "VIPAndConsumeInfo_guestFile"){
		$.messager.show({title:'系统提示',msg:'操作无效！会员和消费信息不可编辑！',timeout:3000,showType:'slide'});
		return;
	}
	var selected = $('#'+datagridId).datagrid('getSelected');
	if( !selected ){
		$.messager.show({title:'系统提示',msg:'请在明细中选择要编辑的信息！',timeout:3000,showType:'slide'});
		return;
	}
	var flag = 0;
	console.info(selected.item)
	switch(selected.item){
		case "<i class='fa fa-user-o' aria-hidden='true'></i>&nbsp; 宾客姓名":
			flag=1;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "<i class='fa fa-genderless' aria-hidden='true'></i>&nbsp; 性别":
			flag = 2;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="性别：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			var comdata = [];
			if(selected.content == "男"){
				comdata = [{'id':1,'text':'男',"selected":true},{'id':0,'text':'女'}]
	    	}else{
	    		comdata = [{'id':1,'text':'男'},{'id':0,'text':'女',"selected":true}]
	    	}
			$('#item').combobox({
				data:comdata,
				valueField:'id',    
			    textField:'text',
			    editable:false,
			    panelHeight:'auto'
			});
			break;
		case "<i class='fa fa-bookmark' aria-hidden='true'></i>&nbsp; 称谓":
			flag = 3;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="称谓：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "<i class='fa fa-mobile' aria-hidden='true'></i>&nbsp; 手机号码":
			flag = 4;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').numberbox({});
			$('#item').numberbox('setValue',selected.content);
			break;
		case "<i class='fa fa-info' aria-hidden='true'></i>&nbsp; 绑定会员手机":
			flag = 5;
			/*$('#appendDiv_guestFile').append(
					'<div id="div" style="padding:40px 0 0 30px;">'+
						'<div style="margin-bottom:10px;">'+
							'<input id="item"  style="width:220px;"'+
								'label="绑定会员手机：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
						'</div>'+
					'</div>'
				);
				$('#item').combobox({
					data:[{'id':0,'text':'否'},{'id':1,'text':'是'}],
					valueField:'id',    
				    textField:'text',
				    editable:false,
				    panelHeight:'auto',
				    onLoadSuccess:function(data){
				    	if(selected.content == "否"){
				    		$('#item').textbox('setValue',0);
				    		$('#item').textbox('setText',"否");
				    	}else{
				    		$('#item').textbox('setValue',1);
				    		$('#item').textbox('setText',"是");
				    	}
				    }
				});*/
			break;
		case "<i class='fa fa-id-card' aria-hidden='true'></i>&nbsp; 身份证号码":
			flag = 6;
			/*$('#appendDiv_guestFile').append(
					'<div id="div" style="padding:40px 0 0 10px;">'+
						'<div style="margin-bottom:10px;">'+
							'<input id="item"  style="width:240px;"'+
								'label="身份证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
						'</div>'+
					'</div>'
				);
				$('#item').textbox({});
				$('#item').textbox('setValue',selected.content);*/
			break;
		case "<i class='fa fa-id-card' aria-hidden='true'></i>&nbsp; 身份证地址":
			flag = 66;
			$('#appendDiv_guestFile').append(
					'<div id="div" style="padding:40px 0 0 10px;">'+
						'<div style="margin-bottom:10px;">'+
							'<input id="item"  style="width:240px;"'+
								'label="身份证地址：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
						'</div>'+
					'</div>'
				);
				$('#item').textbox({});
				$('#item').textbox('setValue',selected.content);
			break;
		case "<i class='fa fa-address-book-o' aria-hidden='true'></i>&nbsp; 护照号码":
			flag = 7;
			/*$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="护照号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);*/
			break;
		case "<i class='fa fa-id-badge' aria-hidden='true'></i>&nbsp; 军官证号码":
			flag = 8;
			/*$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 10px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:240px;"'+
							'label="军官证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);*/
			break;
		case "<i class='fa fa-envelope-o' aria-hidden='true'></i>&nbsp; 电子邮件":
			flag = 9;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="电子邮件：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "<i class='fa fa-address-card-o' aria-hidden='true'></i>&nbsp; 快递地址":
			flag = 10;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="快递地址：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "<i class='fa fa-info-circle' aria-hidden='true'></i>&nbsp; VIP/黑名单":
			flag = 11;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 20px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:220px;"'+
							'label="VIP/黑名单：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').combobox({
				data:[{'id':2,'text':"黑名单！"}
						,{'id':1,'text':"VIP！"}
						,{'id':0,'text':"--"}],
				valueField:'id',    
			    textField:'text',
			    editable:false,
			    panelHeight:'auto',
			    onLoadSuccess:function(data){
			    	if(selected.content == "黑名单！"){
			    		$('#item').combobox('setValue',2);
			    		$('#item').combobox('setText',"黑名单！");
			    	}else if(selected.content == "VIP！"){
			    		$('#item').combobox('setValue',1);
			    		$('#item').combobox('setText',"VIP！");
			    	}else{
			    		$('#item').combobox('setValue',0);
			    		$('#item').combobox('setText',"--");
			    	}
			    }
			});
			break;
			//----------------------------------
		case "宾客备注":
			flag = 12;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 10px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:250px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({multiline:true});
			$('#item').textbox('setValue',selected.content);
			break;
		case "宾客照片":
			flag = 13;
			var cont = selected.content;
			cont
				? (
						cont.includes('eapor.com') 
						? null
						: cont = `http://www.eapor.com/${cont}`
				) 
				: cont = eapor.data.guestFileNoPictureUrl;
			console.info("typeof(cont):",typeof(cont));
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:20px 0 0 30px;">'+
					'<span>'+selected.item+'：</span>'+
					'<img id="picture_guestFile" src="'+cont+'" style="height:80px;width:80px;margin:0 10px 0 10px;"/>'+
					'<input type="button" id="imputImg_guestFile" value="上传图片" class="upload-img-guest-file"/>'+
				'<div id="hif_editGuestPicture_guestFile" style="position: fixed; margin: 0 auto; left: 0px; top: 0px; width: 100%; height: 100%;'+
				 	'background-color: gray; display: none;">'+
				 '</div>'+
				//<!-- 文件上传Div margin:-300px -350px;  margin:-228px 263px;http://test.kezhu.net/upload/uploadHotel/2222.png-->
				'<div id="upFileDiv_guestFile"  style="position: fixed;  top:60px; margin-left:-350px;'+
						'z-index: 20; width: 830px; height: 520px; display: none; background-color: white; padding: 20px 0 0 20px;">'+
					'<iframe src="../client/bootstrapFileUpload_guestFile.jsp" name="iframe" width="800px" height="500px"></iframe>'+
				'</div>'+
				'<span class="upFileClose" id="upFileClose_guestFile" style="background:url(../img/delete.png) no-repeat;background-size: 100%;border-radius:35px;z-index: 77; width: 28px; height:28px; display: none;'+
					 'position: fixed;top:50px;margin-left:263px;  cursor: pointer; color: red;"></span>'+
				'</div>'
			);
			$('#imputImg_guestFile').on('click',function(){
				$('#hif_editGuestPicture_guestFile').fadeTo(1,0.3);
				$('#upFileDiv_guestFile').show();
				$('#upFileClose_guestFile').show();
			});
			$('#upFileClose_guestFile').on('click',function(){
				$('#hif_editGuestPicture_guestFile').hide();
				$('#upFileDiv_guestFile').hide();
				$('#upFileClose_guestFile').hide();
			});
			break;
		case "厂商":
			flag = 14;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "车型":
			flag = 15;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "车牌":
			flag = 16;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
			
		case "公司名称":
			flag = 17;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "公司税号":
			flag = 18;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "公司地址":
			flag = 19;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "开户行":
			flag = 20;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		case "账号":
			flag = 21;
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
			break;
		default:
			$('#appendDiv_guestFile').append(
				'<div id="div" style="padding:40px 0 0 30px;">'+
					'<div style="margin-bottom:10px;">'+
						'<input id="item"  style="width:200px;"'+
							'label="'+selected.item+'：" labelPosition="before" labelAlign="right" labelWidth="70"/>'+
					'</div>'+
				'</div>'
			);
			$('#item').textbox({});
			$('#item').textbox('setValue',selected.content);
	}
	if(flag == 5 || flag == 6 || flag == 7 || flag == 8){
		$.messager.show({title:'系统提示',msg:'该项不可编辑！',timeout:3000,showType:'slide'});
		return;
	}
	$('#div').dialog({
		title: '编辑',    
	    width: 300,    
	    height: 200,    
	    closed: false,    
	    cache: false, 
	    modal:true,
	    onClose:function(){
	    	$(this).dialog('destroy');
	    },
	    buttons:[{
	    	text:'确定',
	    	handler:function(){
	    		var data = {};
	    		var url = "";
	    		/*if(eapor.guestFile.guestInfo == undefined){
    				eapor.guestFile.guestInfo = "";
    			}*/
	    	switch(flag){
	    		case 1:
	    			eapor.guestFile.updata = $('#item').textbox('getValue');
	    			 data = {
	    				guestid : eapor.guestFile.guestId,
	    				guestname : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 2:
	    			var getSexCode = $('#item').combobox('getValue');
	    			if(getSexCode == "男"){getSexCode =1};
	    			if(getSexCode == "女"){getSexCode =0};
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				sexCode : getSexCode
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 3:
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				title : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 4:
	    			eapor.guestFile.updata = $('#item').textbox('getValue');
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				phone : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		/*case 5:
	    			var bindingMemberPhone = $('#item').combobox('getValue');
	    			eapor.guestFile.updata = bindingMemberPhone;
	    			if(bindingMemberPhone == "否"){bindingMemberPhone = 0};
	    			if(bindingMemberPhone == "是"){bindingMemberPhone = 1};
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				bindingMemberPhone : bindingMemberPhone
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;*/
	    		/*case 6:
	    			eapor.guestFile.updata = $('#item').textbox('getValue');
    				data = {
    					guestid : eapor.guestFile.guestId,
	    				identityCardNumber : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;*/
	    		case 66:
	    			eapor.guestFile.updata = $('#item').textbox('getValue');
    				data = {
    					guestid : eapor.guestFile.guestId,
	    				idaddress : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		/*case 7:
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				passportNumber : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;*/
	    		/*case 8:
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				officerCardNumber : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;*/
	    		case 9:
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				email : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 10:
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				expressAddress : $('#item').textbox('getValue')
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 11:
	    			var groupCode = $('#item').combobox('getValue');
	    			eapor.guestFile.updata = groupCode;
	    			console.info(groupCode);
	    			
	    			if(groupCode == "--"){
	    				groupCode = 0;
	    			}else if(groupCode == "VIP！"){
	    				groupCode = 1;
	    			}else if(groupCode == "黑名单！"){
	    				groupCode = 2;
	    			}
	    			data = {
	    				guestid : eapor.guestFile.guestId,
	    				groupCode : groupCode
	    			};
	    			 url = '../guest/updateguesterinfo';
	    			break;
	    		case 12://编辑备注
	    			var gnote = $('#item').textbox('getValue');
	    			eapor.guestFile.updata = gnote;
	    			data = {
	    					guestid : eapor.guestFile.guestId,
	    					gnote : gnote
	    			};
	    			url = '../guest/updateguesterinfo';
	    			break;
	    		case 13://编辑照片
	    			var zp = $('#picture_guestFile').attr('src');
	    			console.info(zp);
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "zp",
	    					strinfo : zp.replace(/http:\/\/www.eapor.com\//, '')
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 14://编辑厂商
	    			var cs = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "cs",
	    					strinfo : cs
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 15://编辑车型
	    			var cx = $('#item').textbox('getValue');
	    			data = {
	    					longid  : eapor.guestFile.guestId,
	    					strkey : "cx",
	    					strinfo : cx
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 16://编辑车牌
	    			var cp = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "cp",
	    					strinfo : cp
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 17://编辑公司名称
	    			var gsmc = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "gsmc",
	    					strinfo : gsmc
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 18://编辑公司税号
	    			var gssh = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "gssh",
	    					strinfo : gssh
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 19://编辑公司地址
	    			var gsdz = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "gsdz",
	    					strinfo : gsdz
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 20://编辑开户行
	    			var khh = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "khh",
	    					strinfo : khh
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		case 21://编辑账号
	    			var zh = $('#item').textbox('getValue');
	    			data = {
	    					longid : eapor.guestFile.guestId,
	    					strkey : "zh",
	    					strinfo : zh
	    			};
	    			url = '../guest/updatemark';
	    			break;
	    		}
	    		 console.info(data)
	    		$.ajax({
	    			type:'post',
	    			url:url,
	    			data:data,
	    			dataType:'json',
	    			success:function(result){
	    				console.info(result);
	    				if(result > 0){
	    					$.messager.show({title:'系统提示',msg:'编辑成功！',timeout:3000,showType:'slide'});
	    					if(flag < 13){
	    						eapor.guestFile.editCallBack(flag);
	    					}else{
	    						var d = {
	    								guestId: eapor.guestFile.getTdValue("guestId"),
	    								gnote: eapor.guestFile.getTdValue("gnote"),
	    								guestName: eapor.guestFile.getTdValue("guestName"),
	    								phone: eapor.guestFile.getTdValue("phone"),
	    								bindingMemberPhone: eapor.guestFile.getTdValue("bindingMemberPhone"),
	    								identityCardNumber: eapor.guestFile.getTdValue("identityCardNumber"),
	    								idaddress: eapor.guestFile.getTdValue("idaddress"),
	    								homeCharge: eapor.guestFile.getTdValue("homeCharge"),
	    								memberType: eapor.guestFile.getTdValue("memberType"),
	    								intRFM: eapor.guestFile.getTdValue("intRFM"),
	    								groupCode: eapor.guestFile.getTdValue("groupCode"),
	    								dtneardissipate: eapor.guestFile.getTdValue("dtneardissipate"),
	    								intnearmonetary: eapor.guestFile.getTdValue("intnearmonetary"),
	    								strroomtype: eapor.guestFile.getTdValue("strroomtype"),
	    								strroomid: eapor.guestFile.getTdValue("strroomid"),
	    								strtourists: eapor.guestFile.getTdValue("strtourists")
	    						};
	    						console.info(d);
	    						eapor.guestFile.showCallBack(d);
	    					}
	    					//var r = JSON.stringify($('#briefInfo_guestFile').datagrid('getRows')[eapor.guestFile.index]);
	    					//eapor.guestFile.showCallBack(r);
	    					return;
	    				}
	    			}
	    		});
	    		$('#div').dialog('close');
	    	}
	    },{
	    	text:'取消',
	    	handler:function(){
	    		$('#div').dialog('close');
	    	}
	    }]
	});
});
//新建btn
$('#create_guestFile').on('click',function(){
	$('#appendDiv_guestFile').append(
		'<div id="div" style="padding:20px 0 0 50px;">'+
			'<div style="margin-bottom:10px">'+
				'<input id="guestName_createGuestFile"  style="width:250px;"'+
					'label="<span style=\'color:red;\'>*</span>姓名：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="gender_createGuestFile" style="width:250px;"'+
			        'label="性别：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="title_createGuestFile"  style="width:250px;"'+
			        'label="称谓：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="phone_createGuestFile"  style="width:250px;"'+
			        'label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="idCard_createGuestFile" style="width:250px;"'+
			        'label="身份证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="passport_createGuestFile"  style="width:250px;"'+
			        'label="护照号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
			    '<input id="officerCode_createGuestFile" style="width:250px;"'+
			        'label="军官证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
				'<input id="email_createGuestFile"  style="width:250px;"'+
					'label="邮箱：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:10px">'+
				'<input id="address_createGuestFile"  style="width:250px;"'+
					'label="地址：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
			'<div style="margin-bottom:0px">'+
				'<input id="vipOrBlack_createGuestFile"  style="width:250px;"'+
					'label="VIP/黑名单：" labelPosition="before" labelAlign="right" labelWidth="90"/>'+
			'</div>'+
		'</div>'
	);
	//姓名
	$('#guestName_createGuestFile').textbox({
		required:true,
		delay:1000,
//		validType:'name',
		missingMessage:"姓名不能为空！",
//		invalidMessage:"姓名请输入中文或英文",
		validateOnCreate:false,
		validateOnBlur:true
	});
	//性别
	$('#gender_createGuestFile').combobox({
		 data:[{'id':0,'text':'男','selected':true},{'id':1,'text':'女'}]
		,valueField:'id'    
	    ,textField:'text'
	    ,editable:false
	    ,panelHeight:'auto'
	});
	//称谓
	$('#title_createGuestFile').textbox({
		
	});
	//手机
	$('#phone_createGuestFile').numberbox({
		validType:'mobilephone',
		invalidMessage:"手机号码格式不正确！",
		delay:1000,
		validateOnCreate:false,
		validateOnBlur:true
	});
	//身份证
	$('#idCard_createGuestFile').textbox({
		delay:1000,
		validateOnCreate:false,
		validateOnBlur:true,
		validType:"certificateType",
		invalidMessage:"身份证格式不正确！"
	});
	//护照
	$('#passport_createGuestFile').textbox({
		
	});
	//军官证
	$('#officerCode_createGuestFile').textbox({
		
	});
	//邮箱
	$('#email_createGuestFile').textbox({
		validType:'email',
		invalidMessage:"邮箱格式不正确！",
		delay:1000,
		validateOnCreate:false,
		validateOnBlur:true
	});
	//地址
	$('#address_createGuestFile').textbox({
		multiline:true,
		validateOnCreate:false,
		validateOnBlur:true,
		validType:'maxLength[32]',
		invalidMessage:"最多输入32个字符！",
		delay:1000
	});
	//VIP/黑名单
	$('#vipOrBlack_createGuestFile').combobox({
		 data:[{'id':0,'text':'--','selected':true},{'id':1,'text':'VIP'},{'id':2,'text':'黑名单'}]
		,valueField:'id'    
	    ,textField:'text'
	    ,editable:false
	    ,panelHeight:'auto'
	});
	$('#div').dialog({
		title: '新建',    
	    width: 400,    
	    height: 460,    
	    closed: false,    
	    cache: false, 
	    modal:true,
	    onClose:function(){
	    	$(this).dialog('destroy');
	    },
	    buttons:[{
			    	text:'确定',
			    	handler:function(){
			    		if(!$('#guestName_createGuestFile').textbox('isValid')){
							$('#guestName_createGuestFile').textbox('textbox').focus();
							return;
						}
						if(!$('#phone_createGuestFile').numberbox('isValid')){
							$('#phone_createGuestFile').numberbox('textbox').focus();
							return;
						}
						if(!$('#idCard_createGuestFile').textbox('isValid')){
							$('#idCard_createGuestFile').textbox('textbox').focus();
							return;
						}
						if(!$('#email_createGuestFile').textbox('isValid')){
							$('#email_createGuestFile').textbox('textbox').focus();
							return;
						}
						if(!$('#address_createGuestFile').textbox('isValid')){
							$('#address_createGuestFile').textbox('textbox').focus();
							return;
						}
			    		var data = {
			    				guestName:$('#guestName_createGuestFile').textbox('getValue'),
		    					sexCode:Number($('#gender_createGuestFile').combobox('getValue')),
	    						title:$('#title_createGuestFile').textbox('getValue'),
    							phone:$('#phone_createGuestFile').numberbox('getValue'),
								identityCardNumber:$('#idCard_createGuestFile').textbox('getValue'),
								passportNumber:$('#passport_createGuestFile').textbox('getValue'),
								officeCardNumber:$('#officerCode_createGuestFile').textbox('getValue'),
								email:$('#email_createGuestFile').textbox('getValue'),
								expressAddress:$('#address_createGuestFile').textbox('getValue'),
								group:Number($('#vipOrBlack_createGuestFile').combobox('getValue'))
			    		};
			    		console.info(data);
			    		$.ajax({
			    			type:'post',
			    			url:'../guest/addGuest',
			    			data:data,
			    			dataType:'json',
			    			success:function(result){
			    				console.info(result);
			    				if(eapor.utils.ajaxCallBackErrInfo(result)){
			    					return;
			    				}
			    				if(result > 0){
			    					$('#div').dialog('close');
			    					$.messager.show({
			    						title:'系统提示',msg:'新建成功！',timeout:2000,showType:'slide',height:'auto'});
			    					return;
			    				}
			    				if(result < 1){
			    					$.messager.show({
			    						title:'系统提示',msg:'新建失败！',timeout:2000,showType:'slide',height:'auto'});
			    					return;
			    				}
			    			}
			    		});
			    	}
			    }
			    ,{
			    	text:'取消',
			    	handler:function(){
			    		$('#div').dialog('close');
			    	}
			    }]
	});
});
function isValidateInfo(id1,id2){
	eapor.guestFile.sameFlag  = "";
	var arr = [];
	arr.push(id1);
	arr.push(id2);
	$.ajax({
		type:'post',
		url:'../guest/lstguestinfodetail',
		async:false,
		data:{'strlid': "{'Tpost':"+JSON.stringify(arr)+"}"},
		success:function(result){
			console.info(result);
			var s1 = result[0];
			var s2 = result[1];
			var gmark1 = [];
			var gmark2 = [];
			var y = {},x={};
			if(typeof(s1.gmark) === "string"){
				try{
					var gmark1 = JSON.parse(s1.gmark);
				}catch(err){
					gmark1 = [];
				}
				for(let iii=0;iii<gmark1.length;iii++){
					var gg = gmark1[iii];
					var ggkey = gg.k;
					console.info(ggkey);
			switch(ggkey){
				case "cs":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.cs = gg.v
					break;
				case "cx":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.cx = gg.v;
					break;
				case "cp":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.cp = gg.v;
					break;
				case "gsmc":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.gsmc = gg.v;
					break;
				case "gssh":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.gssh = gg.v;
					break;
				case "gsdz":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.gsdz = gg.v;
					break;
				case "khh":
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.khh = gg.v;
					break;
				case "zh":
					console.info(typeof(gg.v))
					if(typeof(gg.v) != "string"){
						gg.v = "";
					}
					y.zh = gg.v;
					break;
			    }
			 }
		  }
			if(typeof(s2.gmark) === "string"){
				try{
					var gmark2 = JSON.parse(s2.gmark);
				}catch(err){
					gmark2 = [];
				}
				for(let iii=0;iii<gmark2.length;iii++){
					var gg2 = gmark2[iii];
					var ggkey2 = gg2.k;
					switch(ggkey2){
					case "cs":
						if(typeof(gg2.v) != "string"){
							gg.v = "";
						}
						x.cs = gg2.v
						break;
					case "cx":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.cx = gg2.v;
						break;
					case "cp":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.cp = gg2.v;
						break;
					case "gsmc":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.gsmc = gg2.v;
						break;
					case "gssh":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.gssh = gg2.v;
						break;
					case "gsdz":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.gsdz = gg2.v;
						break;
					case "khh":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.khh = gg2.v;
						break;
					case "zh":
						if(typeof(gg2.v) != "string"){
							gg2.v = "";
						}
						x.zh = gg2.v;
						break;
					}
				}
			}
			console.info(typeof(y.zh));
			console.info(typeof(x.zh));
			console.info(y.zh);
			console.info(x.zh);
			if(typeof(y.zh) === "string" && typeof(x.zh) === "string" && (y.zh != x.zh)){
				eapor.guestFile.sameFlag = "zh";
			}
			if(typeof(y.khh) === "string" && typeof(x.khh) === "string" && (y.khh != x.khh)){
				eapor.guestFile.sameFlag = "khh";
			}
			if(typeof(y.gssh) === "string" && typeof(x.gssh) === "string" && (y.gssh != x.gssh)){
				eapor.guestFile.sameFlag = "gssh";
			}
			if(typeof(y.gsdz) === "string" && typeof(x.gsdz) === "string" && (y.gsdz != x.csgsdz)){
				eapor.guestFile.sameFlag = "gsdz";
			}
			if(typeof(y.gsmc) === "string" && typeof(x.gsmc) === "string" && (y.gsmc != x.gsmc)){
				eapor.guestFile.sameFlag = "gsmc";
			}
			if(typeof(y.cp) === "string" && typeof(x.cp) === "string" && (y.cs != x.cp)){
				eapor.guestFile.sameFlag = "cp";
			}
			if(typeof(y.cx) === "string" && typeof(x.cx) === "string" && (y.cs != x.cx)){
				eapor.guestFile.sameFlag = "cx";
			}
			if(typeof(y.cs) === "string" && typeof(x.cs) === "string" && (y.cs != x.cs)){
				eapor.guestFile.sameFlag = "cs";
			}
			
			if(typeof(s1.expressaddress) === "string" && typeof(s2.expressaddress) === "string" 
				&& (s1.expressaddress != s1.expressaddress)){
				eapor.guestFile.sameFlag = "expressaddress";
			}
			if(typeof(s1.email) === "string" && typeof(s2.email) === "string" && (s1.email != s1.email)){
				eapor.guestFile.sameFlag = "email";
			}
			if(typeof(s1.officerCardNumber) === "string" && typeof(s2.officerCardNumber) === "string" 
				&& (s1.officerCardNumber != s1.officerCardNumber)){
				eapor.guestFile.sameFlag = "officerCardNumber";
			}
			if(typeof(s1.passportNumber) === "string" && typeof(s2.passportNumber) === "string" 
				&& (s1.passportNumber != s1.passportNumber)){
				eapor.guestFile.sameFlag = "passportNumber";
			}
			if(typeof(s1.title) === "string" && typeof(s2.title) === "string" && (s1.title != s1.title)){
				eapor.guestFile.sameFlag = "title";
			}
			if(typeof(s1.sexCode) === "string" && typeof(s2.sexCode) === "string" && (s1.sexCode != s1.sexCode)){
				eapor.guestFile.sameFlag = "sexCode";
			}
			
		}
	});
	console.info(eapor.guestFile.sameFlag);
	return eapor.guestFile.sameFlag;
}
//console.info(isValidateInfo(4561,4562));
//合并btn
$('#merge_guestFile').on('click',function(){
	var datagrid = $('#briefInfo_guestFile');
	var tr = datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked');
	console.info(tr);
	var le1 = tr.length;
	console.info(le1);
	if(le1 != 2){
		$.messager.show({title:'系统提示',msg:'请仅选择两项要合并的信息！',timeout:3000,showType:'slide',height:'auto'});
		return;
	}
	var s1 = eapor.guestFile.getRowInfo(0);//selections[0];
	var s2 = eapor.guestFile.getRowInfo(1);//selections[1];
	console.info(s1);
	console.info(s2);
	var isSame = -1;
	if(s1.groupCode != s2.groupCode){
		isSame = 1;
	}
	if(s1.memberType != s2.memberType){
		isSame = 2;
	}
	if(s1.homeCharge != s2.homeCharge){
		isSame = 3;
	}
	/*if(typeof(s1.identityCardNumber) === "string" && typeof(s2.identityCardNumber) === "string" 
			&& s1.identityCardNumber != s2.identityCardNumber){
		isSame = 4;
	}*/
	if(s1.bindingMemberPhone != s2.bindingMemberPhone){
		isSame = 5;
	}
	if(typeof(s1.phone) === "string" && typeof(s2.phone) === "string" && s1.phone != s2.phone){
		isSame = 6;
	}
	if(s1.guestName != s2.guestName){
		isSame = 7;
	}
    console.info(isSame);
	$.messager.confirm('系统提示','您确认要合并该两项信息吗？',function(r){    
	    if (r){  
	    	if(isSame != -1){
	    		switch(isSame){
	    		case 7:
	    			$.messager.show({title:'系统提示',msg:'合并失败！宾客姓名信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		case 6:
	    			$.messager.show({title:'系统提示',msg:'合并失败！手机号码信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		case 5:
	    			$.messager.show({title:'系统提示',msg:'合并失败！是否绑定会员手机信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		/*case 4:
	    			$.messager.show({title:'系统提示',msg:'合并失败！证件号码信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;*/
	    		case 3:
	    			$.messager.show({title:'系统提示',msg:'合并失败！储值信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		case 2:
	    			$.messager.show({title:'系统提示',msg:'合并失败！会员信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		case 1:
	    			$.messager.show({title:'系统提示',msg:'合并失败！VIP/黑名单信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			break;
	    		}
	    	}
	    	if(isSame != -1){
	    		return;
	    	}
	    	var lnewId = s1.guestId;
	    	var loldId = s2.guestId;
	    	
	    	var tt = true;
	    	if(isValidateInfo(lnewId,loldId)){
		    	switch(eapor.guestFile.sameFlag){
		    	case "sexCode":
		    		$.messager.show({title:'系统提示',msg:'合并失败！性别信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "title":
		    		$.messager.show({title:'系统提示',msg:'合并失败！称谓信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "passportNumber":
		    		$.messager.show({title:'系统提示',msg:'合并失败！护照信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "officerCardNumber":
		    		$.messager.show({title:'系统提示',msg:'合并失败！军官证信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "email":
		    		$.messager.show({title:'系统提示',msg:'合并失败！邮箱信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "expressaddress":
		    		$.messager.show({title:'系统提示',msg:'合并失败！快递地址信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "cs":
		    		$.messager.show({title:'系统提示',msg:'合并失败！厂商信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "cx":
		    		$.messager.show({title:'系统提示',msg:'合并失败！车型信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "cp":
		    		$.messager.show({title:'系统提示',msg:'合并失败！车牌信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "gsmc":
		    		$.messager.show({title:'系统提示',msg:'合并失败！公司名称信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "gssh":
		    		$.messager.show({title:'系统提示',msg:'合并失败！公司税号信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "gsdz":
		    		$.messager.show({title:'系统提示',msg:'合并失败！公司地址信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
		    	case "khh":
		    		$.messager.show({title:'系统提示',msg:'合并失败！开户行信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
		    		tt = false;
		    		break;
	    		case "zh":
	    			$.messager.show({title:'系统提示',msg:'合并失败！账号信息不可冲突！',timeout:3000,showType:'slide',height:'auto'});
	    			tt = false;
	    			break;
	    			
		    	}
		    	if(!tt){
		    		return;
		    	}
	    	}
	    	var data = {
	    			lnewId : lnewId,
	    			loldId : loldId
	    	};
	    	console.info(data);
	    	$.ajax({
	    		type:'post',
	    		url:'../guest/updagtenewidbyoldid',
	    		data:data,
	    		dataType:'json',
	    		success:function(result){
	    			console.info(result);
	    			if(result > 0){
	    				$.messager.show({title:'系统提示',msg:'合并成功！',timeout:3000,showType:'slide'});
	    				$('#search_guestFile').click();
	    				return;
	    			}
    				const errTip = {
						'-2': '-2',
						'-3': '-3',
						'-4': '姓名不一致！',
						'-5': '手机号不一致！',
						'-9': '性别不一致！',
						'-10': '称谓不一致！',
						'-11': '身份证不一致！',
						'-12': '护照不一致！',
						'-13': '军官证不一致！',
						'-14': '邮箱不一致！',
						'-15': '照片不一致！',
						'-16': '厂商不一致！',
						'-17': '车型不一致！',
						'-18': '车牌不一致！',
						'-19': '公司名称不一致！',
						'-20': '公司税号不一致！',
						'-21': '公司地址不一致！',
						'-22': '开户行不一致！',
						'-23': '账号不一致！'		
    				}
    				$.messager.show({title:'系统提示',msg:'合并失败！' + errTip['' + result] ? errTip['' + result] : result,timeout:3000,showType:'slide'});
	    		}
	    	});
	    }    
	}); 
	
});
//清空btn
$('#empty_guestFile').on('click',function(){
	var tab = $('#tabs_guestFile').tabs('getSelected');
	var datagridId = tab.children().children().children().find('table:eq(4)').attr('id');
	if( datagridId == "VIPAndConsumeInfo_guestFile"){
		$.messager.show({title:'系统提示',msg:'操作无效！会员和消费信息不可编辑！',timeout:3000,showType:'slide'});
		return;
	}
	var selected = $('#'+datagridId).datagrid('getSelected');
	if( !selected ){
		$.messager.show({title:'系统提示',msg:'请先选择要编辑的信息！',timeout:3000,showType:'slide'});
		return;
	}
	var flag = 0;
	switch(selected.item){
		case "宾客姓名":
			flag=1;
			break;
		case "性别":
			flag = 2;
			break;
		case "称谓":
			flag = 3;
			break;
		case "手机号码":
			flag = 4;
			break;
		case "绑定会员手机":
			flag = 5;
			break;
		case "身份证号码":
			flag = 6;
			break;
		case "身份证地址":
			flag = 66;
			break;
		case "护照号码":
			flag = 7;
			break;
		case "军官证号码":
			flag = 8;
			break;
		case "电子邮件":
			flag = 9;
			break;
		case "快递地址":
			flag = 10;
			break;
		case "VIP/黑名单":
			flag = 11;
			break;
			//----------------------------------
		case "宾客备注":
			flag = 12;
			break;
		case "宾客照片":
			flag = 13;
			break;
		case "厂商":
			flag = 14;
			break;
		case "车型":
			flag = 15;
			break;
		case "车牌":
			flag = 16;
			break;
		case "公司名称":
			flag = 17;
			break;
		case "公司税号":
			flag = 18;
			break;
		case "公司地址":
			flag = 19;
			break;
		case "开户行":
			flag = 20;
			break;
		case "账号":
			flag = 21;
			break;
		default:
	}
	if(flag == 6 || flag == 7 || flag == 8){
		$.messager.show({title:'系统提示',msg:'该项不可进行清空操作！',timeout:3000,showType:'slide'});
		return;
	}
	var data = {};
	var url = "";
	/*if(eapor.guestFile.guestInfo == undefined){
		eapor.guestFile.guestInfo = "";
	}*/
	    	switch(flag){
	    		case 1://宾客姓名
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
	    			    	eapor.guestFile.updata = "";
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				guestName : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			}); 
	    			break;
	    		case 2://性别
	    			$.messager.show({title:'系统提示',msg:'该项不支持清空功能！',timeout:3000,showType:'slide'});
	    			break;
	    		case 3://称谓
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				title : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 4://手机号码
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
	    			    	eapor.guestFile.updata = "";
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				phone : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 5://绑定会员手机
	    			$.messager.show({title:'系统提示',msg:'该项不支持清空功能！',timeout:3000,showType:'slide'});
	    			break;
	    		case 6://身份证号码
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
	    			    	eapor.guestFile.updata = "";
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				identityCardNumber : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 7://护照号码
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				passportNumber : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 8://军官证号码
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				officerCardNumber : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 9://电子邮件
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				email : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 10://快递地址
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				expressAddress : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 11://VIP/黑名单
	    			$.messager.show({title:'系统提示',msg:'该项不支持清空功能！',timeout:3000,showType:'slide'});
	    			break;
	    		case 12://编辑备注
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
	    			    	eapor.guestFile.updata = "";
		   	    			data = {
		   	    				guestid : eapor.guestFile.guestId,
		   	    				gnote : ""
		   	    			};
		   	    			url = '../guest/updateguesterinfo'; 
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 13://编辑照片
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "zp",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark'; 
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 14://编辑厂商
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "cs",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 15://编辑车型
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "cx",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 16://编辑车牌
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "cp",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 17://编辑公司名称
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "gsmc",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 18://编辑公司税号
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "gssh",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark'; 
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 19://编辑公司地址
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "gsdz",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 20://编辑开户行
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "khh",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		case 21://编辑账号
	    			$.messager.confirm('系统提示','您确认要清空该项内容吗？',function(r){    
	    			    if (r){    
		   	    			data = {
		   	    				longid : eapor.guestFile.guestId,
		   	    				strkey : "zh",
		   	    				strinfo : ""
		   	    			};
		   	    			url = '../guest/updatemark';  
		   	    			aj(url,data,flag);
	    			    }    
	    			});
	    			break;
	    		}
	    		 console.info(data)
	    		 function aj(url,data,flag){
	    			 $.ajax({
	 	    			type:'post',
	 	    			url:url,
	 	    			data:data,
	 	    			dataType:'json',
	 	    			success:function(result){
	 	    				console.info(result);
	 	    				if(result > 0){
	 	    					if(flag < 13){
	 	    						eapor.guestFile.editCallBack(flag);
	 	    					}
	 	    					$.messager.show({title:'系统提示',msg:'编辑成功！',timeout:3000,showType:'slide'});
	 	    					return;
	 	    				}
	 	    			}
	 	    		});
	    		 }
});
//绑定/解绑会员手机btn 
$('#bind_guestFile').on('click',function(){
	var datagrid = $('#briefInfo_guestFile');//datagrid-row-hover
	var tr = datagrid.prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked');
	var le1 = tr.length;

	if(le1 != 1){
		$.messager.show({title:'系统提示',msg:'请先选择一项的宾客信息！',timeout:3000,showType:'slide'});
		return;
	}
	var index = tr.index();
	var guestInfo = $('#briefInfo_guestFile').datagrid('getRows')[index];
	
	if(guestInfo.bindingMemberPhone){
		//$.messager.show({title:'系统提示',msg:'该宾客已经绑定手机号！',timeout:3000,showType:'slide'});
		$.messager.confirm('系统提示', '您确认要解除该绑定的手机号码吗？',function(r){    
		    if (r){    
		    	function unbindPhone_guestFileCallback(result){
					console.info(result);
					if(eapor.utils.ajaxCallBackErrInfo(result)){
						return;
					}
					if(result > 0){
						$.messager.show({title:'系统提示',msg:'解绑成功！',timeout:3000,showType:'slide'});
						$('#search_guestFile').click();
						//$('#briefInfo_guestFile').prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
						//.find('td[field="bindingMemberPhone"]').find('div:eq(0)').text('');
						return;
					}
					$.messager.show({title:'系统提示',msg:'解绑失败！',timeout:3000,showType:'slide'});
				}
				
				eapor.utils.defaultAjax('../guest/bindPhone', {guestId: guestInfo.guestId, phone: ''},
						unbindPhone_guestFileCallback);  
		    }    
		}); 
		return;
	}
	
	$('#appendDiv_guestFile').append(`
			<div id="divDialog" style="padding:20px 0 0 30px;">
				<div style="margin-bottom:10px;">
					<input id="bindPhone_guestFile"  style="width:200px;"
						label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				</div>
			</div>
	`);
	$('#bindPhone_guestFile').numberbox({
		validType:'mobilephone',
		invalidMessage:"手机号码格式不正确！",
		required:true,
		missingMessage:"手机号码不能为空！",
		delay:1000,
		validateOnCreate:false,
		validateOnBlur:true
	});
	var divDialog = $('#divDialog');
	divDialog.dialog({
	   	title: '绑定手机号码',    
	    width: 300,    
	    height: 140,    
	    closed: false,    
	    cache: false,    
	    modal: true,
	    onClose:function(){
	    	$(this).dialog('destroy');
	    },
	    buttons:[
	             {
					text:'确定',
					handler:function(){
						if(!$('#bindPhone_guestFile').textbox('isValid')){
							$('#bindPhone_guestFile').textbox('textbox').focus();
							return;
						}
						function bindPhone_guestFileCallback(result){
							console.info(result);
							if(eapor.utils.ajaxCallBackErrInfo(result)){
								return;
							}
							//-1：宾客不存在
					  		//-2：该宾客已经绑定手机号
					  		//-3：该手机号已经被其他宾客绑定
							//-4：该手机号不是客主会员
							if(result == -1){
								$.messager.show({title:'系统提示',msg:'宾客不存在！',timeout:3000,showType:'slide'});
								return;
							}
							if(result == -2){
								$.messager.show({title:'系统提示',msg:'该宾客已经绑定手机号！',timeout:3000,showType:'slide'});
								return;
							}
							if(result == -3){
								$.messager.show({title:'系统提示',msg:'该手机号已经被其他宾客绑定！',timeout:3000,showType:'slide'});
								return;
							}
							if(result == -4){
								$.messager.show({title:'系统提示',msg:'该手机号不是客主会员！请先注册！',timeout:3000,showType:'slide'});
								return;
							}
							if(result > 0){
								divDialog.dialog('close');
								$.messager.show({title:'系统提示',msg:'绑定成功！',timeout:3000,showType:'slide'});
								$('#search_guestFile').click();
								/*$('#briefInfo_guestFile').prev('div[class="datagrid-view2"]').find('tr.datagrid-row-checked')
								.find('td[field="bindingMemberPhone"]').find('div:eq(0)').text(phone);*/
								return;
							}
							$.messager.show({title:'系统提示',msg:'绑定失败！',timeout:3000,showType:'slide'});
						}
						var phone = $('#bindPhone_guestFile').numberbox('getValue');
						eapor.utils.defaultAjax('../guest/bindPhone',
								{guestId:guestInfo.guestId,phone:phone},
								bindPhone_guestFileCallback);
					}
	             },{
					text:'取消',
					handler:function(){
						divDialog.dialog('close');
					}
	             }
	            ] 
	});
});
//简讯

$('#briefInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : false,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	checkOnSelect:false,
	//singleSelect:true,
	//checkOnSelect:false,
	fit:true,
	//rownumbers : true,
	data:[],
	onLoadSuccess:function(data){
		
    	//隐藏全选框
		$(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility="hidden";
		var heightPlus = 0;//datagrid的高度
	    $('#briefInfo_guestFile').parent().find('.datagrid-btable:eq(0)').each(function(){
	        if($(this).index()==0){
	            $(this).children().children("tr").each(function(){
	                heightPlus += $(this).height();
	            })
	        }
	    });
	    $(this).datagrid("clearSelections");
	    heightPlus += 2 * 26;//加表格标题36，加操作栏36
	    
	    for(let i=0;i<data.rows.length;i++){
	    	if(i == (data.rows.length-1)){
	    		$('#cc').layout('resize',{
					height: (heightPlus+416)
				});
	    		$('#layout_guestFile').layout('resize',{
					height: (heightPlus+460)
				});
	    		$('#cc').parent().height(heightPlus+436).parent().height(heightPlus+436);
	    	}
	    	if(i%2 == 0){
	    		$(this).datagrid('mergeCells',{
					index: i,
					field: 'ck',
					rowspan: 2
				});
	    	}else{
	    		$(this).datagrid('mergeCells',{
					index: i,
					field: 'phone',
					colspan: 12
				});
	    	}
	    }
	    for(let i=0,getrows = data.rows;i<getrows.length;i++){
    	 	var that = $(this).parent().find(".datagrid-td-merged").parent()[i];
			$(that).css("background-color","#FAFAFA").prev().css("background-color","#FAFAFA");
	    }
    },
	columns : [ [  //-----columns start-----
	               {field : 'guestId',title : "guestId",align : 'center',width:20,hidden:true},
	               {field : 'gnote',title : "备注",align : 'center',width:10,hidden:true},
	               {field : 'hotelid',title : "hotelid",align : 'center',width:10,hidden:true},
	               {field : 'doublestored',title : "doublestored",align : 'center',width:10,hidden:true}, 
	               {field : 'intmember',title : "intmember",align : 'center',width:10,hidden:true}, 
	               {field : 'ck',title : "",checkbox:true},
	               
	               {field : 'guestName',title : "宾客姓名",align : 'center',width:20,formatter:eapor.utils.defaultFormatter},
	               {field : 'phone',title : "手机号码",align : 'left',halign:'center',width:22,formatter:eapor.utils.defaultFormatter},
	               {field : 'bindingMemberPhone',title : "绑定会员手机",align : 'center',width:22
	            	   /*,formatter:function(value,row,index){
	            		   // 0未绑定，1绑定
	            		   if(value == 0){return "否";};
	            		   if(value == 1){return "是";};
	            		   return value;
	            	   }*/
	               },
	               {field : 'identityCardNumber',title : "证件号码",align : 'center',width:35},
	               {field : 'homeCharge',title : "储值",align : 'center',width:12,
	            	   formatter(value, row, index){
	            	       return value ? NP.divide(value, 100).toFixed(2) : '';
	               	   }
	               },
	               
	               {field : 'memberType',title : "会员",align : 'center',width:20},
	               {field : 'intRFM',title : "RFM",align : 'center',width:10},
	               {field : 'groupCode',title : "VIP/黑名单",align : 'center',width:20,
	            	   formatter:function(value,row,index){
	            		   //1VIP/2BLACKLIST
	            		   if(value == 1){return "VIP！";};
	            		   if(value == 2){return "黑名单！";};
	            		   return "--";
	            	   }
	               },
	               {field : 'dtneardissipate',title : "最近消费时间",align : 'center',width:30,
	            	   formatter:function(value){
	            		   if(typeof(value) != 'number'){
	            			   return "--";
	            		   }else{
	            			   return getDate(value);
	            		   }
	            	   }
	               },
	               {field : 'intnearmonetary',title : "最近消费金额",align : 'center',width:20,
	            	   formatter:function(value,row,index){
	            	   		if(!value){
	            	   			return "--";
	            	   		}else{
	            	   			return NP.divide(value, 100);
	            	   		}
	               	   }
	               },
	               {field : 'strroomtype',title : "最近入住房型",align : 'center',width:20},
	               {field : 'strroomid',title : "最近入住房号",align : 'center',width:20},
	               {field : 'strtourists',title : "最近入住客源",align : 'center',width:20,
	            	   formatter:function(value,row,index){
	            		   console.info(value);
	            		   $.each(eapor.data.channelObj,function(i,item){
	            			   if(item.channelId == value){
	            				   value = item.channelName;
	            				   return value; 
	            			   }
	            		   });
	            		   return value;
	            	   }
	               }
				]]
});
//明细--个人信息
$('#personalInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : true,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	singleSelect:true,
	fit:true,
	rownumbers : true,
	data:[],
	onLoadSuccess:function(){
		$(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility="hidden";  
    },
	columns : [ [  //-----columns start-----
	               {field : 'guestId',title : "guestId",align : 'center',width:20,hidden:true},
	               {field : 'ck',title : "",checkbox:true},
	               
	               {field : 'item',title : "项目",align : 'center',width:20},
	               {field : 'content',title : "内容",align : 'center',width:40},
	               {field : 'lastEditer',title : "最后编辑人",align : 'center',width:20},
	               {field : 'lastEditTime',title : "最后编辑时间",align : 'center',width:20}
	               ]]
});
//明细--会员和消费
$('#VIPAndConsumeInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : true,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	singleSelect:true,
	fit:true,
	rownumbers : true,
	data:[],
	columns : [ [  //-----columns start-----
	               {field : 'item',title : "项目",align : 'left',width:10},
	               {field : 'content',title : "内容",align : 'left',width:50}
	               ]]
});
//明细--备注和照片
$('#remarkAndPictureInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : true,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	singleSelect:true,
	fit:true,
	rownumbers : true,
	data:[],
	onLoadSuccess:function(){
		$(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility="hidden";  
    },
	columns : [ [  //-----columns start-----
	               {field : 'guestId',title : "guestId",align : 'center',width:20,hidden:true},
	               
	               {field : 'ck',title : "",checkbox:true},
	               
	               {field : 'item',title : "项目",align : 'center',width:20},
	               {field : 'content',title : "内容",align : 'center',width:40,
	            	   formatter:function(value,row,index){
	            		   if(index == 1){
	            			   console.info(value);
	            			 return  value ? ( value.includes('eapor.com') 
			       							? `<img style="height: 100px;width: 100px;border:1px solid #dedede;" src="${value}"/>`
			       							: `<img style="height: 100px;width: 100px;border:1px solid #dedede;" src="http://www.eapor.com/${value}"/>`
			       					) : `<img style="height: 100px;width: 100px;border:1px solid #dedede;" src="${eapor.data.guestFileNoPictureUrl}"/>`;
	            		   }else{
	            			   return value;
	            		   }
	            	   }
	               },
	               {field : 'lastEditer',title : "最后编辑人",align : 'center',width:20},
	               {field : 'lastEditTime',title : "最后编辑时间",align : 'center',width:20}
	               ]]
});
//明细--驾车信息
$('#driveInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : true,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	singleSelect:true,
	fit:true,
	rownumbers : true,
	data:[],
	onLoadSuccess:function(){
		$(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility="hidden";  
    },
	columns : [ [  //-----columns start-----
	               {field : 'guestId',title : "guestId",align : 'center',width:20,hidden:true},
	               
	               {field : 'ck',title : "",checkbox:true},
	               {field : 'item',title : "项目",align : 'center',width:20},
	               {field : 'content',title : "内容",align : 'center',width:40},
	               {field : 'lastEditer',title : "最后编辑人",align : 'center',width:20},
	               {field : 'lastEditTime',title : "最后编辑时间",align : 'center',width:20}
	               ]]
});
//明细--发票信息
$('#invoiceInfo_guestFile').datagrid({
	title : '', 		//表格标题
	iconCls : 'icon-list',  //表格图标
	nowrap : false, 		//是否只显示一行，即文本过多是否省略部分。
	striped : true,
	fitColumns : true, 		//防止水平滚动
	scrollbarSize : 0, 		//去掉右侧滚动条列
	collapsible : false,	//是否可折叠的 
	loadMsg : "loading....",
	singleSelect:true,
	fit:true,
	rownumbers : true,
	data:[],
	onLoadSuccess:function(){
		$(this).parent().find(".datagrid-header-check").children('input')[0].style.visibility="hidden";  
    },
	columns : [ [  //-----columns start-----
	               {field : 'guestId',title : "guestId",align : 'center',width:20,hidden:true},
	               
	               {field : 'ck',title : "",checkbox:true},
	               {field : 'item',title : "项目",align : 'center',width:20},
	               {field : 'content',title : "内容",align : 'center',width:40},
	               {field : 'lastEditer',title : "最后编辑人",align : 'center',width:20},
	               {field : 'lastEditTime',title : "最后编辑时间",align : 'center',width:20}
	               ]]
});

	
})();
/*var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");*/

/*function Line(x1,y1,x2,y2){
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
}
Line.prototype.drawWithArrowheads=function(ctx,type){

    // 设置箭头样式
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.lineWidth=3;
    
    // 画线
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.stroke();

    if(type == 1){
    	// 画向上的箭头
        var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/-180;
        this.drawArrowhead(ctx,this.x1,this.y1-5,startRadians);
    }else{
    	// 画向下的箭头
        var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/-180;
        this.drawArrowhead(ctx,this.x2,this.y2+5,endRadians);
	
    }
}
Line.prototype.drawArrowhead=function(ctx,x,y,radians){
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.lineTo(5,20);
    ctx.lineTo(-5,20);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}*/

/*// 创建一个新的箭头对象
var line=new Line(50,50,50,155);
var line1=new Line(60,50,60,155);
// 第二个参数为1则箭头向上，不为1则箭头向下
line.drawWithArrowheads(context,1);
line1.drawWithArrowheads(context,2);*/