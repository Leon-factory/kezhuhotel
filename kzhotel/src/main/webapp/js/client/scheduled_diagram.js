/**
 *@JSname:预订态势图
 */
~(function () {
  "use strict";
  eapor.utils.layoutHeightSetAuto("layout_scheduledDiagram");

  eapor.scheduledDiagram = {
    weeklist: [],
    holidaylist: [],
    /**
     * @use:得到周末设置arr
     * @return:周末设置arr ["5","6"]  -->表示设置的周末为 周六、周日
     */
    getWeekArray() {
      const _this = this;
      $.ajax({
        type: 'post',
        url: '../syspara/getWeekEnd',
        dataType: 'json',
        data: { weekendCodeList: "" }
      })
        .done(function (data) {
          let strs = [];
          if (data != undefined) {
            strs = data.split("");
          }
          //return strs;
          _this.weeklist = data;

          _this.getHolidayArray()
        });
    },
		/**
		 * @use:得到设置的节假日Arr
		 * @return: 节假日arr
		 */
    getHolidayArray() {
      const _this = this;
      $.ajax({
        type: 'post',
        url: '../specialday/pglist',
        dataType: 'json',
        data: { specialdayName: "", limit: 999999, offset: 0 }
      })
        .done(function (result) {
          _this.holidaylist = result;

          _this.init();

        });
    },
		/**
		 * @use：判断是否是设置里的节假日
		 * @parameter：data [格式如：“2017-06-02”]
		 * @return： 是节假日 ：true  /  不是节假日 ：false
		 */
    isHoliday(date) {
      let flag = false;
      let hol = this.holidaylist;
      for (let i = 0; i < hol.length; i++) {
        let a = Date.parse(getDateForHoliday(hol[i].startTime));
        let b = Date.parse(getDateForHoliday(hol[i].endTime));
        if (a <= Date.parse(date) && b >= Date.parse(date)) {
          flag = true;
          break;
        }
      }
      return flag;
    },
		/**
		 * @use:根据日期得到对应星期几 
		 * @parameter: date 如：'2017-01-23';
		 * @direction:周末加上‘*’ 符号 ， 节假日加上 ‘**’ 符号
		 */
    getWeekByDay(riqi) {
      var getWeek = "";
      var arys1 = new Array();
      arys1 = riqi.split('-');     //日期为输入日期，格式为 2013-3-10
      var ssdate = new Date(arys1[0], Number(arys1[1] - 1), arys1[2]);
      var f = this.isHoliday(getDateForHoliday(ssdate));
      getWeek = ssdate.getDay();  //得到星期几
      var a = "";
      var b = Number(getWeek);
      if (b == 0) {
        b = 6;
      } else {
        b -= 1;
      }
      for (let i = 0; i < this.weeklist.length; i++) {
        if (this.weeklist[i] == b) {
          a = "<span style='color:red;font-size:18px;font-weight: bolder;'>*</span>";
          break;
        }
      }

      if (f) {
        a = "<span style='color:red;font-size:18px;font-weight: bolder;'>*</span><span style='color:red;font-size:18px;font-weight: bolder;'>*</span>";
      }
      switch (getWeek) {
        case 1:
          getWeek = "周一" + a;
          break;
        case 2:
          getWeek = "周二" + a;
          break;
        case 3:
          getWeek = "周三" + a;
          break;
        case 4:
          getWeek = "周四" + a;
          break;
        case 5:
          getWeek = "周五" + a;
          break;
        case 6:
          getWeek = "周六" + a;
          break;
        case 0:
          getWeek = "周日" + a;
          break;
      }
      return getWeek;
    },
		/**
		 * @use:日期加上天数得到新的日期  
		 * @parameter:dateTemp 需要参加计算的日期，days要添加的天数
		 * @return:返回新的日期，日期格式：YYYY-MM-DD  
		 */
    getNewDayAndWeek(dateTemp, days) {
      dateTemp = dateTemp.split("-");
      //转换为MM-DD-YYYY格式    
      let nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]);

      let arrDay = [];
      let arrWeek = [];
      let dataAll = {};
      let data = "";
      let weekInfo = "";
      for (let i = 0; i < days; i++) {
        let millSeconds = Math.abs(nDate) + (i * 86400000); //24 * 60 * 60 * 1000);  
        let rDate = new Date(millSeconds);
        let year = rDate.getFullYear();
        let month = rDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        let date = rDate.getDate();
        if (date < 10) date = "0" + date;
        data = year + "-" + month + "-" + date;
        weekInfo = this.getWeekByDay(data);
        arrDay.push(data);
        arrWeek.push(weekInfo);
      }
      dataAll.arrDay = JSON.stringify(arrDay);
      dataAll.arrWeek = JSON.stringify(arrWeek);
      return dataAll;
    },
    init() {
      //搜索按钮
      $('#searchbydatetime_scheduledDiagram').click(function () {
        const dateValue = $('#datetime_startScheduledDiagram').datebox('getValue');
        if (dateValue == "") {
          $.messager.show({ title: '系统提示', msg: '请输入查询时间！', timeout: 2000, showType: 'slide' });
          return;
        }
        $('#tab_scheduledDiagram').remove();
        $('#tabParent_div').append('<div id="tab_scheduledDiagram" style="margin-left:20px;"></div>');
        var tab = $('#tab_scheduledDiagram').css('font-family', "Helvetica Neue").css('font-size', '14px');
        tab.append(`
					<div style="font-size:130%;text-align:center;width:100%;">
						<i class="fa fa-spinner fa-spin"></i>&nbsp;加载中...
					</div>
				`);
        $('#searchbydatetime_scheduledDiagram').linkbutton('disable');
        $.ajax({
          type: "post",
          url: "../reserve/reserveSituation",
          data: { date: dateValue, dateRange: 14 },
          dataType: "json"
        })
          .done(function (obj) {
            $('#searchbydatetime_scheduledDiagram').linkbutton('enable');
            tab.empty();
            tab.append('<ul style="float:left;width:6.5%;height:30px;border-top:1px solid #DDDDDD;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;background-color:#F2F2F2;font-weight: bolder;">'
              + '<li style="float: left;width:28%;height:30px;line-height: 30px;border-left:1px solid #DDDDDD;text-align:center;">'
              + '</li>'
              + '<li style="float: left;width:62%;height:30px;line-height: 30px;text-align:right;">'
              + '日期</li>'
              + '</ul>');
            const arrDayData = JSON.parse(eapor.scheduledDiagram.getNewDayAndWeek(dateValue, 14).arrDay);
            $.each(arrDayData, function (i, item) {
              var ul = '';
              ul += '<ul style="float:left;width:6.5%;height:30px;line-height: 30px;border-top:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;border-right:1px solid #DDDDDD;background-color:#F2F2F2;font-weight: bolder;">';
              ul += '<li style="float: left;width:100%;height:30px;line-height: 30px;text-align:center;">' + item.substr(5) + '</li>';//eq:1
              ul += '</ul>';
              tab.append(ul);
            }
            );
            tab.append('<ul style="float:left;width:6.5%;height:30px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;text-align:right;">'
              + '<li style="float: left;width:60%;height:30px;line-height: 30px;border-left:1px solid #DDDDDD;text-align:left;padding-left:5px;">'
              + '房型</li>'
              + '<li style="float: left;width:37%;height:30px;line-height: 30px;text-align:center;">'
              + '</li>'
              + '</ul>');
            const arrWeekData = JSON.parse(eapor.scheduledDiagram.getNewDayAndWeek(dateValue, 14).arrWeek);
            $.each(arrWeekData, function (i, item) {
              var ul1 = '';
              ul1 += '<ul style="float:left;width:6.5%;height:30px;line-height: 30px;border-right:1px solid #DDDDDD;border-bottom:1px solid #DDDDDD;">';
              ul1 += '<li style="float: left;width:100%;height:30px;line-height: 30px;text-align:center;">' + item + '</li>';//eq:1
              ul1 += '</ul>';
              tab.append(ul1);
            }
            );
            for (let i = 0; i < obj.length; i++) {
              tab.append('<ul style="float:left;width:6.5%;height:75px;border-bottom:1px solid #DDDDDD;border-right:1px solid #DDDDDD;text-align:right:">'
                + '<li style="float: left;display: flex;align-items: center;justify-content: center;width:48%;height:75px;line-height: 24px;text-align:center;border-right:1px solid #DDDDDD;border-left:1px solid #DDDDDD;">'
                + obj[i].roomtypeName
                + '</li>'
                + '<li style="float: left;width:48%;height:75px;line-height: 24px;text-align:center;">'
                + '在住<br>可订<br>已订</li>'
                + '</ul>');
              for (let j = 0; j < obj[i].availableList.length; j++) {
                var ul3 = '';
                ul3 += '<ul style="float:left;width:6.5%;height:75px;line-height: 75px;border-bottom:1px solid #DDDDDD;border-right:1px solid #DDDDDD;">';
                ul3 += '<li style="float: left;width:100%;height:24px;line-height: 24px;text-align:center;">' + obj[i].stayList[j] + '</li>';//eq:1
                ul3 += '<li style="float: left;width:100%;height:24px;line-height: 24px;text-align:center;">' + obj[i].availableList[j] + '</li>';//eq:1
                ul3 += '<li style="float: left;width:100%;height:24px;line-height: 24px;text-align:center;">' + obj[i].reserveList[j] + '</li>';//eq:1
                ul3 += '</ul>';
                tab.append(ul3);
              }
            }
          });
      });

      $('#datetime_startScheduledDiagram').datebox({});
      $('#datetime_startScheduledDiagram').datebox('setValue', getDateForHoliday(new Date()));
      $('#searchbydatetime_scheduledDiagram').trigger('click');
    }
  }
  eapor.scheduledDiagram.getWeekArray();
})();