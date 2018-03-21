package com.kzhotel.controller.conversion;

import java.util.Date;

public class ConversionRent {
	
	private Long rentId;

    private Long receptionId;

    private Long roomId;

    private String roomCode;

    private Long roomtypeId;

    private String roomtypeName;

    private Integer checkinType;

    private Date enterTime;

    private Date leaveTime;

    private Double expectedStayNumber;

    private Date expectedLeaveTime;

    private Integer expectedRentAmount;

    private Integer livingState;

    private Date accountDateStart;

    private Long createUserId;

    private String createUsername;

    private Date createTime;

    private String checkoutOperator;

    private Long reserveDetailId;

    private Long modifyUserId;

    private String modifyUsername;

    private Date modifyTime;

    private Long hotelId;

    private Integer version;

	public Long getRentId() {
		return rentId;
	}

	public void setRentId(Long rentId) {
		this.rentId = rentId;
	}

	public Long getReceptionId() {
		return receptionId;
	}

	public void setReceptionId(Long receptionId) {
		this.receptionId = receptionId;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public String getRoomCode() {
		return roomCode;
	}

	public void setRoomCode(String roomCode) {
		this.roomCode = roomCode;
	}

	public Long getRoomtypeId() {
		return roomtypeId;
	}

	public void setRoomtypeId(Long roomtypeId) {
		this.roomtypeId = roomtypeId;
	}

	public String getRoomtypeName() {
		return roomtypeName;
	}

	public void setRoomtypeName(String roomtypeName) {
		this.roomtypeName = roomtypeName;
	}

	public Integer getCheckinType() {
		return checkinType;
	}

	public void setCheckinType(Integer checkinType) {
		this.checkinType = checkinType;
	}

	public Date getEnterTime() {
		return enterTime;
	}

	public void setEnterTime(Date enterTime) {
		this.enterTime = enterTime;
	}

	public Date getLeaveTime() {
		return leaveTime;
	}

	public void setLeaveTime(Date leaveTime) {
		this.leaveTime = leaveTime;
	}

	public Double getExpectedStayNumber() {
		return expectedStayNumber;
	}

	public void setExpectedStayNumber(Double expectedStayNumber) {
		this.expectedStayNumber = expectedStayNumber;
	}

	public Date getExpectedLeaveTime() {
		return expectedLeaveTime;
	}

	public void setExpectedLeaveTime(Date expectedLeaveTime) {
		this.expectedLeaveTime = expectedLeaveTime;
	}

	public Integer getExpectedRentAmount() {
		return expectedRentAmount;
	}

	public void setExpectedRentAmount(Integer expectedRentAmount) {
		this.expectedRentAmount = expectedRentAmount;
	}

	public Integer getLivingState() {
		return livingState;
	}

	public void setLivingState(Integer livingState) {
		this.livingState = livingState;
	}

	public Date getAccountDateStart() {
		return accountDateStart;
	}

	public void setAccountDateStart(Date accountDateStart) {
		this.accountDateStart = accountDateStart;
	}

	public Long getCreateUserId() {
		return createUserId;
	}

	public void setCreateUserId(Long createUserId) {
		this.createUserId = createUserId;
	}

	public String getCreateUsername() {
		return createUsername;
	}

	public void setCreateUsername(String createUsername) {
		this.createUsername = createUsername;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCheckoutOperator() {
		return checkoutOperator;
	}

	public void setCheckoutOperator(String checkoutOperator) {
		this.checkoutOperator = checkoutOperator;
	}

	public Long getReserveDetailId() {
		return reserveDetailId;
	}

	public void setReserveDetailId(Long reserveDetailId) {
		this.reserveDetailId = reserveDetailId;
	}

	public Long getModifyUserId() {
		return modifyUserId;
	}

	public void setModifyUserId(Long modifyUserId) {
		this.modifyUserId = modifyUserId;
	}

	public String getModifyUsername() {
		return modifyUsername;
	}

	public void setModifyUsername(String modifyUsername) {
		this.modifyUsername = modifyUsername;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public Long getHotelId() {
		return hotelId;
	}

	public void setHotelId(Long hotelId) {
		this.hotelId = hotelId;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "ConversionRent [rentId=" + rentId + ", receptionId=" + receptionId + ", roomId=" + roomId
				+ ", roomCode=" + roomCode + ", roomtypeId=" + roomtypeId + ", roomtypeName=" + roomtypeName
				+ ", checkinType=" + checkinType + ", enterTime=" + enterTime + ", leaveTime=" + leaveTime
				+ ", expectedStayNumber=" + expectedStayNumber + ", expectedLeaveTime=" + expectedLeaveTime
				+ ", expectedRentAmount=" + expectedRentAmount + ", livingState=" + livingState + ", accountDateStart="
				+ accountDateStart + ", createUserId=" + createUserId + ", createUsername=" + createUsername
				+ ", createTime=" + createTime + ", checkoutOperator=" + checkoutOperator + ", reserveDetailId="
				+ reserveDetailId + ", modifyUserId=" + modifyUserId + ", modifyUsername=" + modifyUsername
				+ ", modifyTime=" + modifyTime + ", hotelId=" + hotelId + ", version=" + version + "]";
	}
	
	
	
	
    
    
    

}
