package com.kzhotel.controller.conversion;

import java.util.List;

public class ConversionTimePriceRange {

	private Integer actualAmount;
	
	private List<Integer> priceList;
	
	private List<Integer> actualPriceList;
	
	private List<Integer> checkinTypeList;
	
	private List<Double> numberList;
	
	private List<String> timeList;//时间转化
	
	/*是否存在房价*/
	private List<Boolean> hasPrice;

	public Integer getActualAmount() {
		return actualAmount;
	}

	public void setActualAmount(Integer actualAmount) {
		this.actualAmount = actualAmount;
	}

	public List<Integer> getPriceList() {
		return priceList;
	}

	public void setPriceList(List<Integer> priceList) {
		this.priceList = priceList;
	}

	public List<Integer> getActualPriceList() {
		return actualPriceList;
	}

	public void setActualPriceList(List<Integer> actualPriceList) {
		this.actualPriceList = actualPriceList;
	}

	public List<Integer> getCheckinTypeList() {
		return checkinTypeList;
	}

	public void setCheckinTypeList(List<Integer> checkinTypeList) {
		this.checkinTypeList = checkinTypeList;
	}

	public List<Double> getNumberList() {
		return numberList;
	}

	public void setNumberList(List<Double> numberList) {
		this.numberList = numberList;
	}

	public List<String> getTimeList() {
		return timeList;
	}

	public void setTimeList(List<String> timeList) {
		this.timeList = timeList;
	}

	public List<Boolean> getHasPrice() {
		return hasPrice;
	}

	public void setHasPrice(List<Boolean> hasPrice) {
		this.hasPrice = hasPrice;
	}
	
	
}
