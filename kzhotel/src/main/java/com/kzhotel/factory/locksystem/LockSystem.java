package com.kzhotel.factory.locksystem;

import java.lang.reflect.Field;

/**
 * 门锁系统的超类
 * @author WPersevere
 *
 */
public class LockSystem {
	
	public static String spell(LockSystem ls){
		if(ls == null){
			return "";
		}
		//利用反射拼接所有字段
		try {
			Class<? extends LockSystem> clazz = ls.getClass();
			Field[] fields = clazz.getDeclaredFields();
			StringBuilder sb = new StringBuilder();
			for(int i = 0; i < fields.length; i++){
				if("lockType".equals(fields[i].getName())){
					continue;
				}
				fields[i].setAccessible(true);
				sb.append(fields[i].get(ls));
				if(i + 1 < fields.length){
					sb.append(",");
				}
			}
			return sb.toString();
		} catch (IllegalArgumentException e) {
			System.err.println(e.getMessage());
			return "";
		} catch (IllegalAccessException e) {
			System.err.println(e.getMessage());
			return "";
		}
	}

}
