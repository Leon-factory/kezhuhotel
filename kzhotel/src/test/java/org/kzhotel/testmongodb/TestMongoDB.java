package org.kzhotel.testmongodb;

import static org.junit.Assert.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kezhu.mongo.converter.MapTargetWebBinder;
import com.kezhu.mongo.converter.TargetMapConverter;
import com.kezhu.mongo.dto.UsersDto;
import com.kezhu.mongo.dto.Impl.UserDaoImpl;
import com.kezhu.mongo.entity.Users;
import com.kezhu.mongo.entity.rentCard;
import com.mongodb.BasicDBList;

import me.persevere.util.MongoHandler;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-mongodb.xml" })
public class TestMongoDB {
	
	@Autowired
	private UsersDto userdtoservice;
	
	
//	//新增数据
//	@Test
//	public void testInsert() {
//		Users user = new Users(null, "FF", 25, user.class.getName());
//		this.userdtoservice.insertUser(user,"user");
//	}
	
	//查询所有
	@Test
	public void testFindAll() {
		
		List<Users> userlist = userdtoservice.findAll();
		for(int i = 0;i<userlist.size();i++) {
			System.out.println(userlist.get(i));
		}
	}
	
	//删除指定names的集合
	@Test
	public void testRemove() {
		this.userdtoservice.removeUser("CC");
	}
	
	//根据指定条件查询
	@Test
	public void testChooseFind() {
		Users userlist = this.userdtoservice.findForRequery("CC");
		System.out.println(userlist);
	}
	
	//修改的条件参数要和Mongo字段名称保持一致
	@Test
	public void testUpdate() {
		Users user = new Users("4", "FF", 12, "ssss");
		this.userdtoservice.updateUser(user);
	}
	
	//分组查询
	@Test
	public void testmongoGroup() {
		BasicDBList basicDBList = userdtoservice.mongoGroup();
		System.out.println(basicDBList.size());
		for(int i=0;i<basicDBList.size();i++) {
			BasicDBList basicDBList2 = (BasicDBList) basicDBList.get(i);
			Object name = basicDBList2.get("name");
			Object age = basicDBList2.get("age");
			System.out.println(name+"   "+age);
		}
	}

	@RequestMapping("/inputIdCard")
	@ResponseBody
	@Test
	public void inputIdCard(){
		Map<String, Object> map = new HashMap<String,Object>();
		String text = "C:/kezhuhtoel/";
		text=text.replace(".", "%dian%").replace("$", "%dollar%");
		map.put("info", text);
		map.put("creatime", new SimpleDateFormat("yy-mm-dd hh:mm:ss").format(new Date()));
		userdtoservice.insertUser(map, "idCardInfo");
//		Integer intresult = MongoHandler.insertMongoByMaps("idCardInfo", map);
//		if(intresult==1){
//			Document document = MongoHandler.findOneMongo("idCardInfo", "info", text);
//			return (String)document.get("createtime");
//		}
		
//		return intresult.toString();
		
	}
	
	/**
	 * create:2017-03-14
	 * 门卡应急
	 * @param text
	 */
	@RequestMapping("/inputRent")
	@ResponseBody
	@Test
	public void inputRent(){
		Map<String, String> map = new HashMap<String,String>();
		String text="C:/kezhu/";
		text=text.replace(".", "%dian%").replace("$", "%dollar%");
		map.put("info", text);
		map.put("createtime", new SimpleDateFormat("yy-mm-dd hh:mm:ss").format(new Date()));
		int intresult = userDaoService.insert(map, "rentCard");
		System.out.println(intresult);
		System.out.println(text);
		if(intresult==1){
			rentCard user = userDaoService.findOne(text);
			System.out.println(user);
		}
	}
	
	@Test
	public void converter() {
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("_id", "12");
		map.put("name", "federik");
		map.put("age", 45);
		Users user = new Users();
		Users users = TargetMapConverter.mapToBean(map, new Users());
		System.out.println(users);
	}
	
	@Test
	public void testTargetResolve() throws InstantiationException, IllegalAccessException {
		MapTargetWebBinder<Users> map = (new MapTargetWebBinder<Users>() {});
		Users user = new Users("4", "CC", 78, "sss");
		Map<String, Object> maps = map.getFieldMap(user);
		System.out.println(maps);
	}
		
	
	/**
	 * 
	 * 
	 * 
	 * --------- 0 -----------------
	 * 
	 * 
	 * 
	 * **/
	@Autowired
	private UserDaoImpl userDaoService;
	//add
	@Test
	public void testInsert() {
		Users user = new Users("4", "DD", 20,"151140");
		userDaoService.insert(user, "user");
	}
	
	//delete
	@Test
	public void testRemove1() {
		userDaoService.remove("CC");
	}
	
	//select
	@Test
	public void testFindAll1() {
		System.out.println(userDaoService.finAll().get(0));
	}
	
	//selectOne
	@Test
	public void testFindOne() {
		Users user = userDaoService.finOne("FF");
		System.out.println(user);
	}
	
	//update
	@Test
	public void testUpdate1() {
		Users users = new Users("4", "FF", 44, "4444");
		userDaoService.update(users);
	}
	
}