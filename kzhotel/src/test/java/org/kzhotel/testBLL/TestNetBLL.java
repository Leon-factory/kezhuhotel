package org.kzhotel.testBLL;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.fastjson.JSON;

import net.kzhotel.BLLI.NetIBllReserve;
import net.kzhotel.per.PerShopList;

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:smybcom.xml","classpath:smybnet.xml"})
public class TestNetBLL {
	
	
	@Resource
	private NetIBllReserve netBllReserve;
	
	
	
	
	@Test
	public void junitTest1(){
		PerShopList perShopList = this.netBllReserve.getNearByHotel("", "");
		System.out.println(JSON.toJSONString(perShopList));
	}

}
