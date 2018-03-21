package com.kzhotel.controller;



import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.PubJavadill.CoreBase64;
import com.PubJavadill.CoreMD5;
import com.PubJavadill.CoreUrl;
import com.PubJavadill.java.ClsHttpVisit;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.BootstrapResult;
import com.kzhotel.pojo.BootstrapStatus;

@Controller
@RequestMapping("/upfile")
public class UploadController {
	
	@Resource
	private IBllUser bllUser;
	
	//用于改变上传路径的方法
	private String location(){
		String location = "";
		switch (UserController.serverNum) {
		case 1:location="http://www.eapor.com/";break;
		case 2:location="http://test.kezhu.net/";break;
		case 3:location="http://127.0.0.1/";break;
		}
		return location;
	}
	
	private String filePath(){
		String path = "";
		switch (UserController.serverNum) {
		case 1:
			//正式
			path="/javadill/ppht";
			break;
		case 2:
			//测试和本机
			path="D:\\eapor_upload";
			break;
		}
		return path;
	}
	
	@RequestMapping(value = "/uploadIdCard",method=RequestMethod.POST)
	@ResponseBody
    public String uploadIdCard(String idnum,String strfile){
	  if(strfile==null || "".equals(strfile)){
		  return "";
	  }
	  String fileName = idnum + System.currentTimeMillis() + ".jpg";
		
	  //String path="D:\\eapor_upload\\IDcard";
	  String path = filePath() + "/IDcard";
	  File targetFile = new File(path);  
	  if(!targetFile.exists()){  
		  targetFile.mkdirs();  
	  }
	  File serverFile = new File(targetFile.getAbsolutePath() + File.separator + fileName);
	  String strresult = "";
	  //保存  
	  try { 
		  byte[] bytes = CoreBase64.byteMyB64Decode(strfile.getBytes());
		  FileOutputStream out = new FileOutputStream(serverFile);
		  out.write(bytes);
		  out.close();
		  strresult=fileName;
	  } catch (Exception e) {  
		  e.printStackTrace();  
		  strresult="error";
	  }  
       
	  return strresult; 
    }  
	  
    /**
     * Upload single file using Spring Controller
     */
    @RequestMapping(value = "/uploadHotel", method = RequestMethod.POST, produces = "application/json;charset=utf8")
    @ResponseBody
    public String uploadFileHandler(@RequestParam("file") MultipartFile file,HttpServletRequest request) throws IOException {
    	
        if (!file.isEmpty()) {
            InputStream in = null;
            OutputStream out = null;
            try {
            	//String path="D:\\eapor_upload";
            	String path=filePath();
            	String fileName = new Date().getTime()+(int)(1000+Math.random()*(9999-1000+1))+""; 
            	fileName=CoreMD5.strMD5Encode16(fileName).toLowerCase()+".jpg";
                File dir = new File(path + File.separator + "uploadHotel");
                
                if (!dir.exists()) dir.mkdirs();
                
                File serverFile = new File(dir.getAbsolutePath() + File.separator + fileName);
                in = file.getInputStream();
                out = new FileOutputStream(serverFile);
                byte[] b = new byte[1024];
                int len = 0;
                while ((len = in.read(b)) > 0) {
                    out.write(b, 0, len);
                }
                out.flush();
                out.close();
                in.close();
                return fileName;
            } catch (Exception e) {
            	return "exception";
            } finally {
                if (out != null) {
                    out.close();
                    out = null;
                }
                if (in != null) {
                    in.close();
                    in = null;
                }
            }
        } else {
        	return "error";
        }
    }
	    
	    
	    
    /**
     * Upload single file using Spring Controller
     */
    @RequestMapping(value = "/uploadRoomType",method=RequestMethod.POST, produces = "application/json;charset=utf8")
    @ResponseBody
    public String bstrapUploadRoomtype(@RequestParam("file") MultipartFile file,HttpServletRequest request
    		) throws IOException {
        if (!file.isEmpty()) {
            InputStream in = null;
            OutputStream out = null;
            try {
            	//String path="D:\\eapor_upload";
            	String path=filePath();
            	String fileName = new Date().getTime()+(int)(1000+Math.random()*(9999-1000+1))+""; 
            	fileName=CoreMD5.strMD5Encode16(fileName).toLowerCase()+".jpg";
                File dir = new File(path + File.separator + "uploadRoomtype");
                
                if (!dir.exists())dir.mkdirs();
                
                File serverFile = new File(dir.getAbsolutePath() + File.separator + fileName);
                in = file.getInputStream();
                out = new FileOutputStream(serverFile);
                byte[] b = new byte[1024];
                int len = 0;
                while ((len = in.read(b)) > 0) {
                    out.write(b, 0, len);
                }
                out.flush();
                out.close();
                in.close();
                return fileName;
            } catch (Exception e) {
            	return "exception";
            } finally {
                if (out != null) {
                    out.close();
                    out = null;
                }
                if (in != null) {
                    in.close();
                    in = null;
                }
            }
        }else {
            return "error";
        }
    }
    
    
    @RequestMapping(value = "/uploadGuest",method=RequestMethod.POST, produces = "application/json;charset=utf8")
    @ResponseBody
    public String uploadGuest(@RequestParam("file") MultipartFile file,HttpServletRequest request
    		) throws IOException {
        if (!file.isEmpty()) {
            InputStream in = null;
            OutputStream out = null;
            try {
            	//String path="D:\\eapor_upload";
            	String path=filePath();
            	String fileName = new Date().getTime()+(int)(1000+Math.random()*(9999-1000+1))+""; 
            	fileName=CoreMD5.strMD5Encode16(fileName).toLowerCase()+".jpg";
                File dir = new File(path + File.separator + "uploadGuest");
                
                if (!dir.exists())dir.mkdirs();
                
                File serverFile = new File(dir.getAbsolutePath() + File.separator + fileName);
                in = file.getInputStream();
                out = new FileOutputStream(serverFile);
                byte[] b = new byte[1024];
                int len = 0;
                while ((len = in.read(b)) > 0) {
                    out.write(b, 0, len);
                }
                out.flush();
                out.close();
                in.close();
                b=null;
                serverFile=null;
                return fileName;
            } catch (Exception e) {
            	return "exception";
            } finally {
                if (out != null) {
                    out.close();
                    out = null;
                }
                if (in != null) {
                    in.close();
                    in = null;
                }
            }
        }else {
            return "error";
        }
    }
    
    
   /**
    * 上传房型图片
    * @param file
    * @return
    * @throws IOException
    */
   @RequestMapping(value="/uploadRoomTypeFile")
   @ResponseBody
   public BootstrapResult uploadRoomTypeFile(@RequestParam("file")MultipartFile file) throws IOException{
	   /*int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "uploadRoomTypeFile")){
			return "-3333";
		}*/
	   String fileName = mdo(file,1);
	   BootstrapResult br = new BootstrapResult();
	   if("exception".equals(fileName)){
		   br.setError("error");
		   br.setStatus(BootstrapStatus.ERROR);
	   }else if("error".equals(fileName)){
		   br.setError("error");
		   br.setStatus(BootstrapStatus.ERROR);
	   }else {
		   br.setStatus(BootstrapStatus.SUCCESS);
		   br.setStatusMsg(fileName);
	   }
	   return br;
   }
	   
   /**
    * 上传酒店图片
    * @param file
    * @return
    * @throws IOException
    */
   @RequestMapping(value="/uploadHotelFile")
   @ResponseBody
   public BootstrapResult uploadHotelFile(@RequestParam("file")MultipartFile file) throws IOException{
	   /*int intselfuid=clspubcontrollerfunc.intNowUserId(request);
	   if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "uploadHotelFile")){
			return "-3333";
	   }*/
	   String fileName = mdo(file,2);
	   BootstrapResult br = new BootstrapResult();
	   if("exception".equals(fileName)){
		   br.setError("error");
		   br.setStatus(BootstrapStatus.ERROR);
	   }else if("error".equals(fileName)){
		   br.setError("error");
		   br.setStatus(BootstrapStatus.ERROR);
	   }else {
		   br.setStatus(BootstrapStatus.SUCCESS);
		   br.setStatusMsg(fileName);
	   }
	   return br;
   }
	   
	   
   public String uploadIDCardFile(String idnum,String strfile){
	   Map<String, Object> maps = new HashMap<String , Object>();
	   maps.put("idnum", idnum);
	   maps.put("strfile", strfile);
	   String strmap = CoreUrl.strMapToUrl(maps, 0);
	   String url = location()+"kzhotel/upfile/uploadIdCard";
	   String result = ClsHttpVisit.strPostJsonStr(url, strmap);
	   return result;
   }
	   
    private String mdo(MultipartFile multfile,int type) throws IOException{  
    	File file = new File(filePath()+"/tmp");
    	if(!file.exists())file.mkdirs();
    	Random random = new Random();
    	int num = random.nextInt(8999)+1000;
        File tmpFile = new File(filePath()+"/tmp/"+System.currentTimeMillis()+"_"+num+".tmp");  
        multfile.transferTo(tmpFile);
        
        FileInputStream fStream = new FileInputStream(tmpFile);
        String result  = "";
        switch (type) {
		case 1:result = ClsHttpVisit.UploadFile(location()+"kzhotel/upfile/uploadRoomType","", fStream);break;
		case 2:result = ClsHttpVisit.UploadFile(location()+"kzhotel/upfile/uploadHotel","", fStream);break;
		case 3:result = ClsHttpVisit.UploadFile(location()+"kzhotel/upfile/uploadGuest","", fStream);break;
		}
        if(fStream!=null)
        {
    	fStream.close();
    	fStream=null;
        }
        if(tmpFile.exists())tmpFile.delete();
        return result;
        
     
    }
    
    
    /**
     * 上传宾客照片
     * @param file
     * @return
     * @throws IOException
     */
    @RequestMapping(value="/uploadGuestPhoto")
    @ResponseBody
    public BootstrapResult uploadGuestPhoto(@RequestParam("file")MultipartFile file) throws IOException{
 	   /*int intselfuid=clspubcontrollerfunc.intNowUserId(request);
 		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "uploadRoomTypeFile")){
 			return "-3333";
 		}*/
 	   String fileName = mdo(file,3);
 	   BootstrapResult br = new BootstrapResult();
 	   if("exception".equals(fileName)){
 		   br.setError("error");
 		   br.setStatus(BootstrapStatus.ERROR);
 	   }else if("error".equals(fileName)){
 		   br.setError("error");
 		   br.setStatus(BootstrapStatus.ERROR);
 	   }else {
 		   br.setStatus(BootstrapStatus.SUCCESS);
 		   br.setStatusMsg(fileName);
 	   }
 	   return br;
    }
}
