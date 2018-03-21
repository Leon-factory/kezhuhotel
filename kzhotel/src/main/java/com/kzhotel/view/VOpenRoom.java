package com.kzhotel.view;


import com.kzhotel.controller.conversion.ConversionTimePriceRange;

public class VOpenRoom {
	
	
	private long linkReceptionId;/*联入的客单id或订单客单id；不联入已有客单为<=0*/
	private boolean linkByReserve;/*预订单联入为true；联房联入为false*/
	private long channelId;/*客源组下的渠道id。联入已有客单时为0*/
	private String memberPhone;/*客主会员手机号。联入已有客单时为null*/
	private int useChannelCredit;/*渠道是否挂账，联入已有客单时为0*/
	private String rentList;/*租住房间列表*/
	private String livingguestList;/*住客明细。标记第一条记录为主客，联入已有客单时不用标记主客*/
	private int guarantee_amount;//信用担保
	private String paymentList;/*支付列表*/
	private long rentplanId;/*房价方案id.联入已有客单时为0*/
	private String comment;//备注
	private int isBreakfast;/*是否含有包价早餐 0否 1是*/
	private int breakfastNumber;/*包价早餐的数量*/
	private ConversionTimePriceRange timePriceRange;
	
	public long getLinkReceptionId() {
		return linkReceptionId;
	}
	public void setLinkReceptionId(long linkReceptionId) {
		this.linkReceptionId = linkReceptionId;
	}
	public boolean isLinkByReserve() {
		return linkByReserve;
	}
	public void setLinkByReserve(boolean linkByReserve) {
		this.linkByReserve = linkByReserve;
	}
	public long getChannelId() {
		return channelId;
	}
	public void setChannelId(long channelId) {
		this.channelId = channelId;
	}
	public String getMemberPhone() {
		return memberPhone;
	}
	public void setMemberPhone(String memberPhone) {
		this.memberPhone = memberPhone;
	}
	public int getUseChannelCredit() {
		return useChannelCredit;
	}
	public void setUseChannelCredit(int useChannelCredit) {
		this.useChannelCredit = useChannelCredit;
	}
	public String getRentList() {
		return rentList;
	}
	public void setRentList(String rentList) {
		this.rentList = rentList;
	}
	public String getLivingguestList() {
		return livingguestList;
	}
	public void setLivingguestList(String livingguestList) {
		this.livingguestList = livingguestList;
	}
	public int getGuarantee_amount() {
		return guarantee_amount;
	}
	public void setGuarantee_amount(int guarantee_amount) {
		this.guarantee_amount = guarantee_amount;
	}
	public String getPaymentList() {
		return paymentList;
	}
	public void setPaymentList(String paymentList) {
		this.paymentList = paymentList;
	}
	public long getRentplanId() {
		return rentplanId;
	}
	public void setRentplanId(long rentplanId) {
		this.rentplanId = rentplanId;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public int getIsBreakfast() {
		return isBreakfast;
	}
	public void setIsBreakfast(int isBreakfast) {
		this.isBreakfast = isBreakfast;
	}
	public int getBreakfastNumber() {
		return breakfastNumber;
	}
	public void setBreakfastNumber(int breakfastNumber) {
		this.breakfastNumber = breakfastNumber;
	}
	public ConversionTimePriceRange getTimePriceRange() {
		return timePriceRange;
	}
	public void setTimePriceRange(ConversionTimePriceRange timePriceRange) {
		this.timePriceRange = timePriceRange;
	}
	
	
	

}
