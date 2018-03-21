package org.kzhotel.testmybatis;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllPrint;
import com.kzhotel.per.PerPrintReception;
import com.kzhotel.pojo.floor;
import com.kzhotel.service.IFloorService;
import com.kzhotel.service.IRentPlanService;



@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:spring-mybatis.xml"})

public class TestService {
	private static Logger logger = Logger.getLogger(TestService.class);
//	private ApplicationContext ac = null;
	@Resource
	private IFloorService floorService = null;
	
	@Resource
	private IRentPlanService rentPlanService = null;
	
	@Resource
	private IBllPrint bllprint;
	@Test
	public void testservice() {

		//logger.info(JSON.toJSONString(rentPlanService.AddRentPlan("纟纟x虎皮baacacc1", (long)1, "test", "")));
		
		
	}
	
	@Test
	public void testservice2() {
		List<floor> lstpf = this.floorService.floorPageList( 0,  100,  1,  "");
		 logger.info(lstpf);
		
		logger.info(JSON.toJSONString(lstpf));
	}
	
	@Test
	public void testprintReception() {
		PerPrintReception perPrintReceptions = this.bllprint.printReception(450, 0, 4834, "javadill",26l);
		System.out.println( JSON.toJSONString(perPrintReceptions) );
	}
}
