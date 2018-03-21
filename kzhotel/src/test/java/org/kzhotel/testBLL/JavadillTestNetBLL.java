/**
 * 
 */
/**
 * @author javadill
 *
 */
package org.kzhotel.testBLL;



import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.TreeSet;

import javax.annotation.Resource;

import org.apache.log4j.Logger;

import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alibaba.fastjson.JSON;



public class JavadillTestNetBLL {


	@Test
	public void testBLL() {

		  List<Bill> list = new ArrayList<Bill>();  
        Bill b = new Bill();  
        b.setType("A");  
        b.setMoney(1);  
        list.add(b);  
        b = new Bill();  
        b.setType("B");  
        b.setMoney(2);  
        list.add(b);  
        b = new Bill();  
        b.setType("C");  
        b.setMoney(3);  
        list.add(b);  
        b = new Bill();  
        b.setType("A");  
        b.setMoney(1);  
        list.add(b);  
        b = new Bill();  
        b.setType("B");  
        b.setMoney(2);  
        list.add(b);  
        b = new Bill();  
        b.setType("C");  
        b.setMoney(3);  
        list.add(b);  
  
        for (Bill bill : list) {  
            System.out.println(bill.getType() +"    " +bill.getMoney());  
        } 
        List<Bill> bi = new ArrayList<Bill>();  
        for (Bill bill : list) {  
            boolean state = false;  
            for (Bill bills : bi) {  
                if(bills.getType().equals(bill.getType())){  
                    int money = bills.getMoney();  
                    money += bill.getMoney();  
                    bills.setMoney(money);  
                    state = true;  
                }  
            }  
            if(!state){  
                bi.add(bill);  
            }  
        }  
        for (Bill bill : bi) {  
            System.out.println(bill.getType() +"    " +bill.getMoney());  
        }  

	}
	
	class Bill {  
	    String type;  
	    int money;  
	      
	    public Bill() {  
	          
	    }  
	      
	    public String getType() {  
	        return type;  
	    }  
	    public void setType(String type) {  
	        this.type = type;  
	    }  
	    public int getMoney() {  
	        return money;  
	    }  
	    public void setMoney(int money) {  
	        this.money = money;  
	    }  
	      
	}
	
	@Test
	public void testBLLaa() {
		

      
		clsgroupList clst=new clsgroupList();
		clst.clscomp();

	}
	 
	public class clsgroupList{  
	    public void clscomp() {  
	        List<Bill> lb = new ArrayList<Bill>();  
	       
	        for(int i = 0; i < 20; i ++) {  
	        	Bill b = new Bill();  
	            if(i % 2 == 0)   
	                b.setType("t1");  
	            else   
	                b.setType("t2");  
	            b.setMoney(i + 1000);  
	            lb.add(b);  
	        }
	        
	        for(Bill bill : lb ) {  
	            System.out.println(bill.getType() + " - " + bill.getMoney());  
	        }
	        
	        
	        
	        HashSet<String> tss = new HashSet<String>(); 
//	        List<T> lstlbt=new ArrayList<T>();
//	        for(Bill bi : lb) {
//	        	//tss.add(bi.getType());  
//	          
//	        } 
	      
	       for(int intindextmp=0;intindextmp< lb.size();intindextmp++) 
	       {
	        	//tss.add(bi.getType());  
	    	   try {
	    	   Class<?> c = lb.get(intindextmp).getClass();
	    	   Method m2 = c.getMethod("getType");
	    	   String stro=m2.invoke(lb.get(intindextmp)).toString();
	    	   tss.add(stro);  
	    	   }
	    	   catch( Exception ex)
	    	   {}
	    	   
	        } 
	       
	       
	       
	       
	        for(String t : tss) {
	            System.out.println(t + " - yyyy" );  
	        }
	        
//	        Class<?> herosClass = Heros.class;
//	        Method[] methods = herosClass.getMethods();
//	        for (Method method : methods) {
//	            System.out.println(method);
//	        }
	        
	        List<Bill> lbs = new ArrayList<Bill>();  
	        int total = 0;  
	        for(String t : tss) {  
	        	Bill b = new Bill();  
	            b.setType(t);  
	            total=0;
	            for(Bill bl : lb) {  
	                if(t.equals(bl.getType())) {  
	                    total += bl.getMoney();  
	                }  
	            }  
	            b.setMoney(total);  
	            lbs.add(b);  
	        }  
	        
	        for(Bill bill : lbs ) {  
	            System.out.println(bill.getType() + " - " + bill.getMoney());  
	        }  
	    }  
	      
	}
	
}
