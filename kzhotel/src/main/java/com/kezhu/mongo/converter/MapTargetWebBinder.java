package com.kezhu.mongo.converter;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.Map;


/**
 * 反射泛型参数装入 Map 集合中
 * @author Administrator
 * 
 * **/
public class MapTargetWebBinder<T>{
	
	private Class<T> clazz;
	private Map<String, Object> map = new HashMap<>();
	private T target;
	
	@SuppressWarnings("unchecked")
	//获取泛型T的类型
	public MapTargetWebBinder() {
		// TODO Auto-generated constructor stub
		 clazz =  (Class<T>) ((ParameterizedType) getClass()  
	                .getGenericSuperclass()).getActualTypeArguments()[0];
	}
	
	//获取泛型T的实例
	@Deprecated
	public T getNewInstance(Class<T> clazz) throws InstantiationException, IllegalAccessException{
		target = clazz.newInstance();
		return target;
	}
	
	//获取泛型 T 的所有属性
	public Map<String,Object> getFieldMap(Object obj) throws IllegalArgumentException, IllegalAccessException {
		if(obj != null ) {
			Field[] field = clazz.getDeclaredFields();
			for(int i = 0;i<field.length;i++) {
				field[i].setAccessible(true);
				map.put(field[i].getName(), field[i].get(obj));
			}
		}
		return map;
	}
	
	public Class<T> getClazz() {
		return clazz;
	}

}
