/**
 * 
 */
/**
 * @author javadill
 *
 */
package org.kzhotel.testBLL;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.bson.Document;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.PubJavadill.ClsBeanToJson;
import com.PubJavadill.ClsBinHex;
import com.PubJavadill.CoreBase64;
import com.alibaba.fastjson.JSON;
import com.eapor.BLLI.IBllBanquetReception;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllWarehouse;
import com.kzhotel.BLLModel.BeanPostValue;
import com.kzhotel.join.guestinfodetail;
import com.kzhotel.join.guestmemberinfo;

import com.kzhotel.model.GoodsStoreState;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

import net.kzhotel.BLLI.NetIBllShops;
import net.kzhotel.pojo.roomnet;
import net.kzhotel.pojo.shops;

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类

@ContextConfiguration(locations = {"classpath:smybcom.xml","classpath:smybnet.xml"})

public class JavadillTestBLL {
	private static Logger logger = Logger.getLogger(JavadillTestBLL.class);

	@Resource
	private IBllGuest bllGuest;
	
	@Resource
	private IBllBanquetReception bill;
	

	public void testw()
	{
		com.kzhotel.join.guestidchange gi=new com.kzhotel.join.guestidchange();
		gi.setLnewId(4561l);
		gi.setLoldId(4562l);;
		
		//int intr= bllGuest.chktwoguest( gi);
		//int intr= bllGuest.updagtenewidbyoldid( gi,"abc");
		//System.out.println("intrintr="+intr);
		
	}
	
	@Test
	public void testBLL() {
		
//		 ClassPathResource resource = new ClassPathResource("classpath:smybnet.xml");
//		 
//		String strvv= resource.toString();
//		
//		System.out.println("sss="+strvv);
//		
		int i=this.bill.checkOutBqReception(160L, 11);
		System.out.println("okk"+i);
		
	}

	  
	
	
}
