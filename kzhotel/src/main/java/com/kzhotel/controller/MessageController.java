package com.kzhotel.controller;



import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.TextMessage;

import com.PubJavadill.java.ClsHttpVisit;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLL.MessageHandler;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.service.IRentService;

import me.persevere.util.MongoHandler;


@Controller
@RequestMapping("/message")
public class MessageController {
	
	@Autowired
	private MessageHandler handler;
	@Resource
	private IRentService rentService;
	@Resource
	private IBllUser bllUser;
	

	/**
	 * 用于局部修改房态
	 * @param msg1
	 * @param msg2
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/chat",method=RequestMethod.POST)
	@ResponseBody
	public String send(long msg1,long msg2,HttpServletRequest request) throws Exception{
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "chat")){
			//return -3333;
            return "-3333";
		}
		
		Document document = MongoHandler.findOneMongo("loginLog", "mdCode", (String)request.getSession().getAttribute("mdCode"));
		String hotelId = document.getString("hotelId");
		List<Document> documents = MongoHandler.select("loginLog", "hotelId", hotelId);
		documents = documents.stream().filter((doc) -> "true".equals(doc.getString("isCollection"))).collect(Collectors.toList());
		for(Document doc : documents){
			List<Long> longs = new ArrayList<Long>();
			longs.add(msg1);
			longs.add(msg2);
			longs.add(-1l);//代表住房
			handler.toSelf(new TextMessage(JSON.toJSONString(longs)), doc.getString("mdCode"));
//			ClsHttpVisit.GetByUrl(
//					doc.getString("protocol") + 
//					"://" + 
//					doc.getString("serverName") + 
//					":" + 
//					doc.getString("serverPort") + 
//					"/kzhotel/message/sendMessage?msg1="+msg1+"&msg2="+msg2+"&comCode=" + doc.getString("mdCode")
//					);
		}
		return JSON.toJSONString("success");
//		
//		List<Document> documents = MongoHandler.findAllMongo("IPList");
//		if(documents.isEmpty()){
//			return null;
//		}
//		
//		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
//		for(Document document : documents){
//			
//			String mongo = document.getString("mongo");
//			if(mongo == null){
//				continue;
//			}
//			String hotelId2 = mongo.split("MONGO")[0];
//			if(hotelId == Integer.valueOf(hotelId2).intValue()){
//				String ip = document.getString("localIP");
//				String head = document.getString("uri").split("/")[0];
//				String comCode = document.getString("comCode");
//				String host = "";
//				if(ip.contains("KzEapor")){
//					host = "test.kezhu.net";
//				}else if("/0:0:0:0:0:0:0:1".equals(ip)){
//					host = "localhost:8080";
//				}else if("localhost/127.0.0.1".equals(ip)){
//					host = "www.eapor.com";
//				}else{
//					host = ip.substring(1);
//				}
//				if(host == null || "".equals(host)){
//					return JSON.toJSONString("error");
//				}
//				ClsHttpVisit.GetByUrl(head + "//" + host + "/kzhotel/message/sendMessage?msg1="+msg1+"&msg2="+msg2+"&comCode="+comCode);
//				
//			}
//		}
//		
//		return JSON.toJSONString("success");
	}
	
	/**
	 * 发送消息
	 * @param msg1
	 * @param msg2
	 * @param username
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/sendMessage",method=RequestMethod.GET)
	@ResponseBody
	public String chat(long msg1,long msg2,String comCode) throws Exception{
		List<Long> longs = new ArrayList<Long>();
		longs.add(msg1);
		longs.add(msg2);
		longs.add(-1l);//代表住房
		handler.toSelf(new TextMessage(JSON.toJSONString(longs)), comCode);
		return msg1+";"+msg2;
	}
	
	/**
	 * create:2017-08-04
	 * 改变设置，更新页面
	 * @param request
	 * @return
	 */
	@RequestMapping(value = {"/refreshPageByWebsocket"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int refreshPageByWebsocket(
			HttpServletRequest request
			){
		List<Document> documents = MongoHandler.findAllMongo("IPList");
		if(documents.isEmpty()){
			return 0;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		int count = 0;
		for(Document document : documents){
			String hotelId2 = document.getString("mongo").split("MONGO")[0];
			if(hotelId == Integer.valueOf(hotelId2).intValue()){
				String communicationCode = document.getString("comCode");
				handler.toSelf(new TextMessage(JSON.toJSONString("-3336")), communicationCode);
				count ++;
			}
		}
		return count;
	}
	
	
	/**
	 * 餐宴更新餐宴预订图\餐宴图
	 * @param bqRestaurantId
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/bqMessage",method=RequestMethod.POST)
	@ResponseBody
	public int bqMessage(String array, HttpServletRequest request) throws Exception{
		Document document = MongoHandler.findOneMongo("loginLog", "mdCode", (String)request.getSession().getAttribute("mdCode"));
		String hotelId = document.getString("hotelId");
		List<Document> documents = MongoHandler.select("loginLog", "hotelId", hotelId);
		documents = documents.stream().filter((doc) -> "true".equals(doc.getString("isCollection"))).collect(Collectors.toList());
		String baseArray = Base64.getEncoder().encodeToString(array.getBytes());
		for(Document doc : documents){
			ClsHttpVisit.GetByUrl(
					doc.getString("protocol") + 
					"://" + 
					doc.getString("serverName") + 
					":" + 
					doc.getString("serverPort") + 
					"/kzhotel/message/bqMessageSend?array=" + baseArray + "&comCode=" + doc.getString("mdCode")
					);
		}
		return 1;
		
//		List<Document> documents = MongoHandler.findAllMongo("IPList");
//		if(documents.isEmpty()){
//			return -1;//mongo中不存在数据
//		}
//		
//		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
//		for(Document document : documents){
//			
//			String mongo = document.getString("mongo");
//			if(mongo == null){
//				continue;
//			}
//			String hotelId2 = mongo.split("MONGO")[0];
//			if(hotelId == Integer.valueOf(hotelId2).intValue()){
//				String ip = document.getString("localIP");
//				String head = document.getString("uri").split("/")[0];
//				String comCode = document.getString("comCode");
//				String host = "";
//				if(ip.contains("KzEapor")){
//					host = "test.kezhu.net";
//				}else if("/0:0:0:0:0:0:0:1".equals(ip)){
//					host = "localhost:8080";
//				}else{
//					host = ip.substring(1);
//				}
//				if(host == null || "".equals(host)){
//					return -2;//错误
//				}
//				String baseArray = Base64.getEncoder().encodeToString(array.getBytes());
//				ClsHttpVisit.GetByUrl(head + "//" + host + "/kzhotel/message/bqMessageSend?array=" + baseArray + "&comCode=" + comCode);
//				
//			}
//		}
//		
//		return 1;
	}
	
	
	/**
	 * 餐宴发送信息接口
	 * @param bqRestaurantId
	 * @param comCode
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/bqMessageSend",method=RequestMethod.GET)
	@ResponseBody
	public String bqMessageSend(String array,String comCode) throws Exception{
		array = new String(Base64.getDecoder().decode(array.getBytes()),"utf-8");
		handler.toSelf(new TextMessage(array), comCode);
		return "1";
	}
	
	
	@RequestMapping(value="/haveNewOrder",method=RequestMethod.GET)
	@ResponseBody
	public int haveNewOrder(long hotelId){
		
		List<Document> documents = MongoHandler.select("loginLog", "hotelId", String.valueOf(hotelId));
		documents = documents.stream()
				.filter(d -> d.getString("isCollection").equals("true"))
				.collect(Collectors.toList()); 
		
		for(Document d : documents){
			String comCode = d.getString("mdCode");
			handler.toSelf(new TextMessage("haveNewOrder"), comCode);
		}
		return 1;
	}
	
	
	

}
