package com.kzhotel.factory.locksystem;

/**
 * 君达泰门锁系统 
 * @author WPersevere
 *
 */
public class Jundatai extends LockSystem {
	
	/**
	 * 门锁系统类型
	 */
	public final Integer lockType = 0;
	
	/**
	 * 酒店标识
	 */
	private String hotelIdentity;
	
	/**
	 * 房间id
	 */
	private Long roomId;
	
	/**
	 * 房间锁号
	 */
	private String roomLockCode;
	
	/**
	 * 起始时间
	 */
	private String startTime;
	
	/**
	 * 预计离开时间
	 */
	private String expectedLeaveTime;
	
	public Jundatai(Long roomId, String hotelIdentity, String roomLockCode, String startTime,
			String expectedLeaveTime) {
		super();
		this.roomId = roomId;
		this.hotelIdentity = hotelIdentity;
		this.roomLockCode = roomLockCode;
		this.startTime = startTime;
		this.expectedLeaveTime = expectedLeaveTime;
	}

	public Jundatai() {
		super();
	}

	public String getHotelIdentity() {
		return hotelIdentity;
	}

	public void setHotelIdentity(String hotelIdentity) {
		this.hotelIdentity = hotelIdentity;
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

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}
		
		

}
