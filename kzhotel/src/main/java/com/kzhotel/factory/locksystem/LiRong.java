package com.kzhotel.factory.locksystem;

/**
 * 丽荣门锁系统 
 * @author WPersevere
 *
 */
public class LiRong extends LockSystem {
	
	/**
	 * 门锁系统类型
	 */
	public final Integer lockType = 1;
	
	/**
	 * 房间锁号
	 */
	private String roomLockCode;
	
	/**
	 * 起始时间
	 */
	private String startTime;
	
	/**
	 * 预计离开事件
	 */
	private String expectedLeaveTime;
	
	/**
	 * 反锁标识 00不能开反锁  01能开反锁
	 */
	private String fansuo;
	
	/**
	 * 卡号 01到99
	 */
	private String cardId;
	
	/**
	 * 卡系列号 
	 */
	private String cardNum;
	
	public LiRong(String roomLockCode, String startTime, String expectedLeaveTime, String fansuo, String cardId, String cardNum){
		super();
		this.roomLockCode = roomLockCode;
		this.startTime = startTime;
		this.expectedLeaveTime = expectedLeaveTime;
		this.fansuo = fansuo;
		this.cardId = cardId;
		this.cardNum = cardNum;
	}
	
	public LiRong() {
		super();
	}


	public String getRoomLockCode() {
		return roomLockCode;
	}
	public void setRoomLockCode(String roomLockCode) {
		this.roomLockCode = roomLockCode;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getExpectedLeaveTime() {
		return expectedLeaveTime;
	}
	public void setExpectedLeaveTime(String expectedLeaveTime) {
		this.expectedLeaveTime = expectedLeaveTime;
	}
	public String getFansuo() {
		return fansuo;
	}
	public void setFansuo(String fansuo) {
		this.fansuo = fansuo;
	}
	public String getCardId() {
		return cardId;
	}
	public void setCardId(String cardId) {
		this.cardId = cardId;
	}
	public String getCardNum() {
		return cardNum;
	}
	public void setCardNum(String cardNum) {
		this.cardNum = cardNum;
	}
	public Integer getLockType() {
		return lockType;
	}
	
	
	

	
	
}
