package com.pub.Project;

import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;

import java.util.logging.Logger;

import org.apache.commons.dbcp.BasicDataSource;

import com.PubJavadill.CoreBase64;

public class CryptDataSource extends BasicDataSource {
	
    public CryptDataSource() {
        // TODO Auto-generated constructor stub
        super();
    }
    
    @Override
    public void setPassword(String password){
        try{
            this.password =CoreBase64.strMyB64Decode(password);
        }catch(Exception e){
            
        }
    }
	
}
