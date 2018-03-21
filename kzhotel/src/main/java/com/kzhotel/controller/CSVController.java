package com.kzhotel.controller;

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.CSVutils;

import com.PubJavadill.java.ClsJsonToBean;
import com.PubJavadill.CoreMD5;
import com.PubJavadill.StrUtils;
import com.alibaba.fastjson.JSON;
import com.google.gson.reflect.TypeToken;

import net.kzhotel.pojo.users;
import net.kzhotel.service.IUsersService;

@Controller
@RequestMapping("/csv")
public class CSVController {
	//private static final org.apache.commons.logging.Log LOG = LogFactory.getLog(CSVutils.class);
	
	
	@Resource
	private IUsersService netUsersSerivce;
	
	@RequestMapping("/export")
	@ResponseBody
	public String exportCSV(String head,String body,String name){
		
		List<Map<String, String>> exportData = new ArrayList<Map<String,String>>();
		//头信息
		List<String> headlst =ClsJsonToBean.LstFromJson(head, new TypeToken<ArrayList<String>>(){}.getType());
		LinkedHashMap<String,String> map = new LinkedHashMap<String,String>();
		int headsize = headlst.size();
		for(int i=0;i<headsize;i++){
			map.put((i+1)+"",headlst.get(i));
		}
		
		//具体数据
		List<String> bodylst = ClsJsonToBean.LstFromJson(body, new TypeToken<ArrayList<String>>(){}.getType());
		//List<Object> objlst = new ArrayList<Object>();
		//objlst.add(bodylst);
		
		for(int x=0;x<bodylst.size()/headsize;x++){
			Map<String,String> row1 = new LinkedHashMap<String, String>();
			for(int i=0;i<headsize;i++){
				row1.put((i+1)+"",bodylst.get(x*headsize+i));
				if(i==headsize-1){
					exportData.add(row1);
					//row1 = new LinkedHashMap<String, String>();
					break;
				}
			}
		}
		
		
		
		 
		 /*row1 = new LinkedHashMap<String, String>();
		 row1.put("1", "11");
		 row1.put("2", "12");
		 row1.put("3", "13");
		 row1.put("4", "14");
		// exportData.add(row1);
		 row1.put("5", "15");
		 row1.put("6", "16");
		 row1.put("7", "17");
		 row1.put("8", "18");
		 exportData.add(row1);
		*/
		/* map.put("1", "第一列");
		 map.put("2", "第二列");
		 map.put("3", "第三列");
		 map.put("4", "第四列");*/
		 
		

		 String path = "D:\\eapor_upload\\report";
		 String fileName = new Date().getTime()+(int)(1000+Math.random()*(9999-1000+1))+""; 
    	 fileName=CoreMD5.strMD5Encode16(fileName).toLowerCase();
		 //String fileName = name;
		 File file = CSVutils.createCSVFile(exportData,map, path, fileName);
		 String fileName2 = file.getName();
		// LOG.debug("文件名称：" + fileName2);
		 
		 return JSON.toJSONString(fileName2);
		 
	}
	
	
	
	
	@RequestMapping(value="/kzUser")
	@ResponseBody
	public String kzUser(){
		List<String> head = new ArrayList<String>();
		try {
			Class<?> cla = Class.forName("net.kzhotel.pojo.users");
			Field[] fields = cla.getDeclaredFields();
			for(Field f : fields) {
				if(!"serialVersionUID".equals(f.getName())){
					 head.add(f.getName());//打印每个属性的类型名字
				}
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Map<String, String>> exportData = new ArrayList<Map<String,String>>();
		LinkedHashMap<String,String> map = new LinkedHashMap<String,String>();
		int headsize = head.size();
		for(int i=0;i<headsize;i++){
			map.put((i+1)+"",head.get(i));
		}
		
		List<String> body = new ArrayList<String>();
		for(int i=0;i<5000;i++){
			
			users users = netUsersSerivce.getUsersById((long)i);
			if(users!=null){
				body.add(StrUtils.strNullToBlank(users.getId().toString()));
				body.add(StrUtils.strNullToBlank(users.getUserNo()));
				body.add(StrUtils.strNullToBlank(users.getUsername()));
				body.add(StrUtils.strNullToBlank(users.getUserType()));
				body.add(StrUtils.strNullToBlank(users.getPassword()));
				body.add(StrUtils.strNullToBlank(users.getNickname()));
				body.add(StrUtils.strNullToBlank(users.getPhone()));
				body.add(StrUtils.strNullToBlank(users.getSex()));
				body.add(StrUtils.strNullToBlank(users.getEmail()));
				body.add(StrUtils.strNullToBlank(users.getAddress()));
				body.add(StrUtils.strNullToBlank(users.getIdCard()));
				body.add(StrUtils.strNullToBlank(users.getWechatOpenid()));
				body.add(StrUtils.strNullToBlank(users.getInviterId()));
				body.add(StrUtils.strNullToBlank(users.getShopId()));
				body.add(StrUtils.strNullToBlank(users.getPoints()));
				body.add(StrUtils.strNullToBlank(users.getPointsFrozened()));
				body.add(StrUtils.strNullToBlank(users.getPointsReturned()));
				body.add(StrUtils.strNullToBlank(users.getPointsConsumed()));
				body.add(StrUtils.strNullToBlank(users.getPointsInvite()));
				body.add(StrUtils.strNullToBlank(users.getMatchCode()));
				body.add(StrUtils.strNullToBlank(users.getMatchTime()));
				body.add(StrUtils.strNullToBlank(users.getFrozened()));
				body.add(StrUtils.strNullToBlank(users.getFrozenId()));
				body.add(StrUtils.strNullToBlank(users.getLastVisit()));
				body.add(StrUtils.strNullToBlank(users.getPlatform()));
				body.add(StrUtils.strNullToBlank(users.getPushId()));
				body.add(StrUtils.strNullToBlank(users.getPushRule()));
				body.add(StrUtils.strNullToBlank(users.getFailNum()));
				body.add(StrUtils.strNullToBlank(users.getCreateTime()));
				body.add(StrUtils.strNullToBlank(users.getVipcard()));
				body.add(StrUtils.strNullToBlank(users.getVipcardface()));
				body.add(StrUtils.strNullToBlank(users.getPhoto()));
				body.add(StrUtils.strNullToBlank("0"));
				body.add(StrUtils.strNullToBlank(users.getClientmanagerName()));
				body.add(StrUtils.strNullToBlank(users.getWechatUnionid()));
				body.add(StrUtils.strNullToBlank(users.getShopWechatId()));
			}
		}
		
		
		for(int x=0;x<body.size()/headsize;x++){
			Map<String,String> row1 = new LinkedHashMap<String, String>();
			for(int i=0;i<headsize;i++){
				row1.put((i+1)+"",body.get(x*headsize+i));
				if(i==headsize-1){
					exportData.add(row1);
					//row1 = new LinkedHashMap<String, String>();
					break;
				}
			}
		}
		
		
		 String path = "D:\\eapor_upload\\report";
		 String fileName = new Date().getTime()+(int)(1000+Math.random()*(9999-1000+1))+""; 
    	 fileName=CoreMD5.strMD5Encode16(fileName).toLowerCase();
		 //String fileName = name;
		 File file = CSVutils.createCSVFile(exportData,map, path, fileName);
		 String fileName2 = file.getName();
		 
		 return fileName2;
	}
}
