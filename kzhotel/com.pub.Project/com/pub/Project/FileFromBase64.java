package com.pub.Project;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Base64;

public class FileFromBase64 {

	/** 
     * @param bytes 
     * @return 
     */  
    public static byte[] decode(final byte[] bytes) {  
        return Base64.getDecoder().decode(bytes);  
    }  
  
    public static byte[] decode(final String strsource) {  
        return Base64.getDecoder().decode(strsource);  
    }  
    
    /** 
     * 二进制数据编码为BASE64字符串 
     * 
     * @param bytes 
     * @return 
     * @throws Exception 
     */  
    public static String encode(final byte[] bytes) {  
        return Base64.getEncoder().encodeToString(bytes);  
    }  
	
	/**
	  * 将文件转成base64 字符串
	  * @param path文件路径
	  * @return  * 
	  * @throws Exception
	  */

	 public static String encodeBase64File(String path) throws Exception {
	  File file = new File(path);;
	  FileInputStream inputFile = new FileInputStream(file);
	  byte[] buffer = new byte[(int) file.length()];
	  inputFile.read(buffer);
	  inputFile.close();
	  
	  return encode(buffer);

	 }

	 /**
	  * 将base64字符解码保存文件
	  * @param base64Code
	  * @param targetPath
	  * @throws Exception
	  */

	 public static void decoderBase64File(String base64Code, String targetPath)
	   throws Exception {
	  byte[] buffer =decode(base64Code);
	  FileOutputStream out = new FileOutputStream(targetPath);
	  out.write(buffer);
	  out.close();

	 }

	 /**
	  * 将base64字符保存文本文件
	  * @param base64Code
	  * @param targetPath
	  * @throws Exception
	  */

	 public static void toFile(String base64Code, String targetPath)
	   throws Exception {

	  byte[] buffer = base64Code.getBytes();
	  FileOutputStream out = new FileOutputStream(targetPath);
	  out.write(buffer);
	  out.close();
	 }

	 public static void main(String[] args) {
	  try {
	   String base64Code = encodeBase64File("/users/javadill/Desktop/photo.jpg");
	   System.out.println(base64Code);
	   decoderBase64File(base64Code, "/users/javadill/downloads/222.jpg");
	   toFile(base64Code, "/users/javadill/downloads/photob.txt");
	  } catch (Exception e) {
	   e.printStackTrace();

	  }

	 }
	 
}
