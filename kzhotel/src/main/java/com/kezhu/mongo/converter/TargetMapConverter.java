package com.kezhu.mongo.converter;

import java.util.Map;

import org.springframework.cglib.beans.BeanMap;

public class TargetMapConverter{
		
	/** 
	 * 将map装换为javabean对象 
	 * @param map 
	 * @param bean 
	 * @return 
	 */  
	public static <T> T mapToBean(Map<String, Object> map,T bean) {  
	    BeanMap beanMap = BeanMap.create(bean);  
	    beanMap.putAll(map);
	    return bean;  
	} 

}
