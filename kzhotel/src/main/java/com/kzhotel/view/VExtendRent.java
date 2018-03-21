package com.kzhotel.view;


import com.kzhotel.controller.conversion.ConversionTimePriceRange;

public class VExtendRent {

	private long rentId;/*租住id*/
	private double newExpectedStayNumber;/*逗留数*/
	private String newExpectedLeaveTime;/*新的预离时间*/
	private String paymentList;   /*补交支付 list json*/
	private ConversionTimePriceRange timePriceRange;
	
	
	public long getRentId() {
		return rentId;
	}
	public void setRentId(long rentId) {
		this.rentId = rentId;
	}
	public double getNewExpectedStayNumber() {
		return newExpectedStayNumber;
	}
	public void setNewExpectedStayNumber(double newExpectedStayNumber) {
		this.newExpectedStayNumber = newExpectedStayNumber;
	}
	public String getNewExpectedLeaveTime() {
		return newExpectedLeaveTime;
	}
	public void setNewExpectedLeaveTime(String newExpectedLeaveTime) {
		this.newExpectedLeaveTime = newExpectedLeaveTime;
	}
	
	public String getPaymentList() {
		return paymentList;
	}
	public void setPaymentList(String paymentList) {
		this.paymentList = paymentList;
	}
	public ConversionTimePriceRange getTimePriceRange() {
		return timePriceRange;
	}
	public void setTimePriceRange(ConversionTimePriceRange timePriceRange) {
		this.timePriceRange = timePriceRange;
	}
	
	
}
