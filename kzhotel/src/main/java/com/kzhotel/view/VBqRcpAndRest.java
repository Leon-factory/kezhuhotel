package com.kzhotel.view;

import com.eapor.bean.PerBanquetReception;
import com.eapor.bean.PerBanquetRestaurant;

/**
 * 局部更新餐宴图所返回的类
 * @author Administrator
 *
 */
public class VBqRcpAndRest {
	
	
	private PerBanquetRestaurant pbRestaurant;
	
	private PerBanquetReception pbReception;

	public PerBanquetRestaurant getPbRestaurant() {
		return pbRestaurant;
	}

	public void setPbRestaurant(PerBanquetRestaurant pbRestaurant) {
		this.pbRestaurant = pbRestaurant;
	}

	public PerBanquetReception getPbReception() {
		return pbReception;
	}

	public void setPbReception(PerBanquetReception pbReception) {
		this.pbReception = pbReception;
	}
	
	

}
