package com.kzhotel.view;

import java.util.List;

import com.eapor.bean.PerBanquetConsumeItemDetail;
import com.eapor.bean.PerBanquetPayment;

public class VBanquetConsume {
	
	List<PerBanquetConsumeItemDetail> pbcds;
	
	PerBanquetPayment pbp;
	
	

	public PerBanquetPayment getPbp() {
		return pbp;
	}

	public void setPbp(PerBanquetPayment pbp) {
		this.pbp = pbp;
	}

	public List<PerBanquetConsumeItemDetail> getPbcds() {
		return pbcds;
	}

	public void setPbcds(List<PerBanquetConsumeItemDetail> pbcds) {
		this.pbcds = pbcds;
	}
	
	

}
