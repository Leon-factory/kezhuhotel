//自定义验证
$.extend($.fn.validatebox.defaults.rules, {
  //验证最小长度
  minLength: {
    validator: function (value, param) {
      return value.length >= param[0];
    },
    message: '请输入至少{0}个字符'
  },
  //验证最大长度
  maxLength: {
    validator: function (value, param) {
      return value.length <= param[0];
    },
    message: '最多输入{0}个字符'
  },
  notZero: 　{
    validator: function (value, param) {

      return value != 0;
    },
    message: '请输入大于0的数字'
  },
  //验证手机号码
  mobilephone: {
    validator: function (value) {
      var rex = /^1[34578]\d{9}$/;
      if (rex.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入正确的手机格式，如：13700001234'
  },
  //验证姓名，中文加英文
  name: {
    validator: function (value) {
      var rex1 = /^([\u4e00-\u9fa5]){2,32}$/;
      var rex2 = /^([a-zA-Z]{2,32})$/;
      if (rex1.test(value) || rex2.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入正确的姓名格式'
  },
  //验证hotel_hotelIdentity，中文加英文
  hotelIdentity: {
    validator: function (value) {
      var rex = /^([0123456789]|[a-zA-Z]){0,30}$/;
      if (rex.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入数字、英文格式'
  },
  //验证身份证号码
  certificateType: {
    validator: function (value) {//\d{14}[[0-9],0-9xX]
      isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      //身份证正则表达式(18位) 
      isIDCard2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (isIDCard1.test(value) || isIDCard2.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入正确的证件格式'
  },
  //军官证
  officerCertificate: {
    validator: function (value) {
      var reg = /南字第(\d{8})号|北字第(\d{8})号|沈字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号/;
      value = value.replace(/(^\s*)|(\s*$)/g, "");
      if (reg.text(value) === false) {
        return false;
      } else {
        return true;
      }
    },
    message: "请输入正确的军官证号"
  },
  //验证数字和小数,最多两位小数[用于金额验证]
  numMaxTwoDecimal: {//var isNum=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    validator: function (value) {///^\d+(\.\d+)?$/;
      var rex = /^\d+(\.\d{1,2})?$/;
      if (rex.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入正确的数字,最多两位小数'
  },
  //验证是否为整数
  number: {
    validator: function (value) {
      var rex = /^-?\d+$/;
      if (rex.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    message: '请输入整数'
  },
  //验证非负数
  noNegativeNumber: {
    validator: function (value) {
			/*var rex=/^[0-9]+([.][0-9]+){0,1}$/;
			if(rex.test(value)){
				return true;
			}else{
				return false;
			}*/
      return !(value < 0);
    },
    message: '不能输入负数'
  },
  getKeZhuPhoneCode: {
    validator: function (value) {
      console.info(value);
      console.info(value.length);

      function getPhoneCodeCallBack(result) {
        console.info(result);
        if (result.phone) {
          $('#phone_memberRecharge').numberbox('setValue', result.phone);
        }
        if (result.matchCode) {
          $('#num_memberRecharge').textbox('setValue', result.matchCode);
        }
        if (result < 0) {
          $.messager.alert('系统提示', '此实体卡不存在');
        }
      }
      if (value.length === 18) {
        const val = sessionStorage.getItem('cardCode');
        if (!val) {
          sessionStorage.setItem('cardCode', value);
          eapor.utils.defaultAjax('../hotel/getPhoneAndMatchCode', { entity: value }, getPhoneCodeCallBack);
        } else {
          if (val == value) {
            return true;
          } else {
            sessionStorage.setItem('cardCode', value);
            eapor.utils.defaultAjax('../hotel/getPhoneAndMatchCode', { entity: value }, getPhoneCodeCallBack);
            return true;
          }
        }
      }
      return true;
    }/*,
		message: ''*/
  },
  getKeZhuPhoneCode_memberConsumption: {
    validator: function (value) {
      console.info(value);
      console.info(value.length);

      function getPhoneCodeCallBack(result) {
        console.info(result);
        if (result.phone) {
          $('#phone_memberConsumption').numberbox('setValue', result.phone);
        }
        if (result.matchCode) {
          $('#num_memberConsumption').textbox('setValue', result.matchCode);
        }
        if (result < 0) {
          $.messager.alert('系统提示', '此实体卡不存在');
        }
      }
      if (value.length === 18) {
        const val = sessionStorage.getItem('cardCode_memberConsumption');
        if (!val) {
          sessionStorage.setItem('cardCode_memberConsumption', value);
          eapor.utils.defaultAjax('../hotel/getPhoneAndMatchCode', { entity: value }, getPhoneCodeCallBack);
        } else {
          if (val == value) {
            return true;
          } else {
            sessionStorage.setItem('cardCode_memberConsumption', value);
            eapor.utils.defaultAjax('../hotel/getPhoneAndMatchCode', { entity: value }, getPhoneCodeCallBack);
            return true;
          }
        }
      }
      return true;
    }/*,
		message: ''*/
  }
});

/*
	1.验证用户名和密码：（"^[a-zA-Z]\w{5,15}$"）正确格式："[A-Z][a-z]_[0-9]"组成,并且第一个字必须为字母6~16位；
	2.验证电话号码：（"^(\d{3,4}-)\d{7,8}$"）正确格式：xxx/xxxx-xxxxxxx/xxxxxxxx；
	3.验证手机号码："^1[3|4|5|7|8][0-9]{9}$"；
	4.验证身份证号（15位或18位数字）："\d{14}[[0-9],0-9xX]"；
	5.验证Email地址：("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")；
	6.只能输入由数字和26个英文字母组成的字符串：("^[A-Za-z0-9]+$")；
	7.整数或者小数：^[0-9]+([.][0-9]+){0,1}$
	8.只能输入数字："^[0-9]*$"。
	9.只能输入n位的数字："^\d{n}$"。
	10.只能输入至少n位的数字："^\d{n,}$"。
	11.只能输入m~n位的数字："^\d{m,n}$"。
	12.只能输入零和非零开头的数字："^(0|[1-9][0-9]*)$"。
	13.只能输入有两位小数的正实数："^[0-9]+(\.[0-9]{2})?$"。
	14.只能输入有1~3位小数的正实数："^[0-9]+(\.[0-9]{1,3})?$"。
	15.只能输入非零的正整数："^\+?[1-9][0-9]*$"。
	16.只能输入非零的负整数："^\-[1-9][0-9]*$"。
	17.只能输入长度为3的字符："^.{3}$"。
	18.只能输入由26个英文字母组成的字符串："^[A-Za-z]+$"。
	19.只能输入由26个大写英文字母组成的字符串："^[A-Z]+$"。
	20.只能输入由26个小写英文字母组成的字符串："^[a-z]+$"。
	21.验证是否含有^%&',;=?$\"等字符："[%&',;=?$\\^]+"。
	22.只能输入汉字："^[\u4e00-\u9fa5]{0,}$"。
	23.验证URL："^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$"。
	24.验证一年的12个月："^(0?[1-9]|1[0-2])$"正确格式为："01"～"09"和"10"～"12"。
	25.验证一个月的31天："^((0?[1-9])|((1|2)[0-9])|30|31)$"正确格式为；"01"～"09"、"10"～"29"和“30”~“31”。
	26.获取日期正则表达式：\\d{4}[年|\-|\.]\d{\1-\12}[月|\-|\.]\d{\1-\31}日?
	评注：可用来匹配大多数年月日信息。
	27.匹配双字节字符(包括汉字在内)：[^\x00-\xff]
	评注：可以用来计算字符串的长度（一个双字节字符长度计2，ASCII字符计1）
	28.匹配空白行的正则表达式：\n\s*\r
	评注：可以用来删除空白行
	29.匹配HTML标记的正则表达式：<(\S*?)[^>]*>.*?</>|<.*? />
	评注：网上流传的版本太糟糕，上面这个也仅仅能匹配部分，对于复杂的嵌套标记依旧无能为力
	30.匹配首尾空白字符的正则表达式：^\s*|\s*$
	评注：可以用来删除行首行尾的空白字符(包括空格、制表符、换页符等等)，非常有用的表达式
	31.匹配网址URL的正则表达式：[a-zA-z]+://[^\s]*
	评注：网上流传的版本功能很有限，上面这个基本可以满足需求
	32.匹配帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)：^[a-zA-Z][a-zA-Z0-9_]{4,15}$
	评注：表单验证时很实用
	33.匹配腾讯QQ号：[1-9][0-9]{4,}
	评注：腾讯QQ号从10 000 开始
	34.匹配中国邮政编码：[1-9]\\d{5}(?!\d)
	评注：中国邮政编码为6位数字
	35.匹配ip地址：([1-9]{1,3}\.){3}[1-9]。
	评注：提取ip地址时有用
	36.匹配MAC地址：([A-Fa-f0-9]{2}\:){5}[A-Fa-f0-9] 
  
 */