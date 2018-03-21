package com.kzhotel.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.ClsHttpVisit;
import com.alibaba.fastjson.JSON;
import com.kzhotel.pojo.hotel;
import com.kzhotel.service.IHotelService;
import com.kzhotel.view.VOpenRoom;

import me.persevere.util.MongoHandler;
import me.persevere.util.WeChatUtils;
import net.kzhotel.pojo.users;
import net.kzhotel.service.IUsersService;





@Controller
@RequestMapping("/test")
public class TestController {
	
	@Resource
	private IHotelService hotelSerivce;
	
	@Resource
	private IUsersService usersService;
	
	
	
	@RequestMapping("/test")
	public void test(){
		
		//new MyWebSocket();
		
		//ApplicationContext context=new ClassPathXmlApplicationContext(new String[]{"kzeb.xml"});
		
		//clsbeantest cls=context.getBean("abctest",clsbeantest.class);
		//String strt=cls.getTestddd();
		
		//System.out.println("aaaa="+strt);
		
		return;
		//String id = request.getParameter("id");
		
		//request.setAttribute("id", id);
		
		//HttpSession session = request.getSession();
		//Session  session  
		
		
		//String strtest = "abc";
		//session.addMessageHandler(MessageHandler);
		
		
		//session.setMaxIdleTimeout(11L);
		//websocket.onOpen(null);
		//websocket.onMessage("ok1",null);
		//websocket.onClose(null);
		
		/*websocket2.onOpen(null);
		websocket2.onMessage("ok2");
		websocket2.onClose(null);*/
		
		
		//attrs.addAttribute("abc", strtest);
		
		
		
		//return "/websocket";
		
		//return "redirect:/testNetCon/testNet";
		
	}
	
	
	
	@RequestMapping(value="/testMongo")
	@ResponseBody
	public String testMongo(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<1000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testMongo", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	
	
	@RequestMapping(value="/ram")
	@ResponseBody
	public String ram(){
		long start = System.currentTimeMillis();
		List<Document> documents = new ArrayList<Document>();
		int count = 0;
		for(int i=0;i<1000000;i++){
			Document document = MongoHandler.findOneMongo("testMongo", "id", i);
			if(document!=null){
				count++;
				MongoHandler.insertMongo("count", count);
			}
			documents.add(document);
		}
		
		long stop = System.currentTimeMillis();
		return "数据读取完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/update")
	@ResponseBody
	public String update(){
		long start = System.currentTimeMillis();
		long result = MongoHandler.updateLT("testMongo", "number", 10, "number", 20);
		long stop = System.currentTimeMillis();
		return "修改完毕，共："+result+"条，花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/sum")
	@ResponseBody
	public String sum(){
		long start = System.currentTimeMillis();
		long sum=0l;
		for(int i=0;i<1000000;i++){
			Document document = MongoHandler.findOneMongo("testMongo", "number", 20);
			sum+=document.getInteger("number");
		}
		long stop = System.currentTimeMillis();
		return "sum="+sum+"，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/a")
	@ResponseBody
	public String tableA(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<20000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testA", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/b")
	@ResponseBody
	public String tableB(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<50000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testB", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/c")
	@ResponseBody
	public String tableC(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<100000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testC", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/d")
	@ResponseBody
	public String tableD(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<500000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testD", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/e")
	@ResponseBody
	public String tableE(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<1000000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testE", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	@RequestMapping(value="/suf",method=RequestMethod.GET)
	@ResponseBody
	public int suffix(String id){
		int result = 0;
		if(!"".equals(id) && id!=null){
			Map<String, String> map = new HashMap<String,String>();
			map.put("suf", id);
			MongoHandler.insertMongoByMaps("suffix", map);
			result=1;
		}
		return result;
	}
	
	
	
	@RequestMapping(value="/f")
	@ResponseBody
	public String tableF(){
		long start = System.currentTimeMillis();
		int count = 0;
		for(int i=0;i<10000000;i++){
			Map<String, Integer> map = new HashMap<String,Integer>();
			map.put("id", i);
			map.put("number", new Random().nextInt(10));
			MongoHandler.insertMongoByMaps("testF", map);
			count++;
		}
		long stop = System.currentTimeMillis();
		return "数据写入完毕，共"+count+"条，总共花费"+(stop-start)/1000+"秒";
	}
	
	
	
	@RequestMapping("/testlogic")
	@ResponseBody
	public String testlogic(String id){
		System.out.println("id:"+id);
		hotel hotel = this.hotelSerivce.getHotelById(1);
		users users = this.usersService.getUserByPhone("17301767224");
		return JSON.toJSONString(hotel) + ";" + JSON.toJSONString(users);
	}
	
	
	@RequestMapping(value = "/testparam")
	@ResponseBody
	public int testParam(
			@RequestBody VOpenRoom vOpenRoom
			){
		System.out.println(JSON.toJSONString(vOpenRoom));
		return 0;
	}
	
	
	
	@RequestMapping(value = "/tuisong")
	@ResponseBody
	public String tuisong(String message){
		//获取accesstoken
		String accessToken = WeChatUtils.getAccessToken("wx268e2990d99e8f87","a9ad0b86768eec83d5ee5b415c10e240");
		//请求地址https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN
		if(message == null || "".equals(message)){
			message = "o8LBQxHrtvWU09Gk6bsR1z4Ywqn0";
		}
		//post请求参数
		String msg = "{\"touser\":\"o8LBQxG3Cv7Tl0MiARevgFp1ZIdM\",\"template_id\":\"1A9Q7v8TY4UNzUUKAeP8HL9z4YVMDfj_DVowgMcIifk\",\"url\":\"urlurl\", \"data\":{\"first\": {"+
                " \"value\":\"您好，您已成功进行话费充值。\", \"color\":\"#173177\"},\"accountType\":{\"value\":\"手机号：\", \"color\":\"#173177\"}, \"account\": {"+
                "\"value\":\"13012345678\", \"color\":\"#173177\"},\"amount\": { \"value\":\"500元\", \"color\":\"#173177\" },\"result\": { \"value\":\"充值成功\","+
               "  \"color\":\"#173177\" },  \"remark\":{ \"value\":\"备注：如有疑问，请致电13912345678联系我们\", \"color\":\"#173177\" } }}";
	
	
		
		String url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + accessToken;
		
		String msgTempResult = ClsHttpVisit.strPostJsonStr(url, msg);
		
		return msgTempResult;
		
	}
	
	@RequestMapping(value = {"/testSpring"}, method = {RequestMethod.GET},consumes = {"application/json"}, produces = {"application/json;charset=utf-8"})
	@ResponseBody
	public String testSpring(String str){
		return str;
	}
	
	
	
	
	
}
