package com.kzhotel.factory;

import com.kzhotel.factory.locksystem.Jundatai;
import com.kzhotel.factory.locksystem.LiRong;
import com.kzhotel.factory.locksystem.LockSystem;
/**
 * 门锁系统工厂类
 * @author WPersevere
 *
 */
public class LockSystemFactory {
	
	public static LockSystem newInstanceLiRong(){
		return new LiRong();
	}
	
	public static LockSystem newInstanceLiRong(String roomLockCode, String startTime, String expectedLeaveTime, String fansuo, String cardId, String cardNum){
		return new LiRong(roomLockCode, startTime, expectedLeaveTime,fansuo, cardId, cardNum);
	}
	
	public static LockSystem newInstanceJundatai(){
		return new Jundatai();
	}
	
	public static LockSystem newInstanceJundatai(Long roomId, String hotelIdentity, String roomLockCode, String startTime,
			String expectedLeaveTime){
		return new Jundatai(roomId, hotelIdentity, roomLockCode, startTime, expectedLeaveTime);
	}
	

}
