package com.kzhotel.view;

import java.util.List;

public class VBqTransfer {
	/*需要转移的消费项*/
	private List<Long> bqReceptionDetailIds;
	/*转入方账单id*/
	private long inReceptionId;
	/**/
	private int receptionType;
	
	
	

	public int getReceptionType() {
		return receptionType;
	}

	public void setReceptionType(int receptionType) {
		this.receptionType = receptionType;
	}

	public List<Long> getBqReceptionDetailIds() {
		return bqReceptionDetailIds;
	}

	public void setBqReceptionDetailIds(List<Long> bqReceptionDetailIds) {
		this.bqReceptionDetailIds = bqReceptionDetailIds;
	}

	public long getInReceptionId() {
		return inReceptionId;
	}

	public void setInReceptionId(long inReceptionId) {
		this.inReceptionId = inReceptionId;
	}
	
	

}
