/**
 * @JSname:酒店基本信息
 */
~(function () {
  "use strict";
  const hotelInfo = {
    init() {
      this.render();
      this.bind();
      //初始酒店信息
      eapor.utils.defaultAjax("../hotel/hotelbyid", {}, this.businessGetJson);
    },
    render() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const w2 = w / 2;
      const mapDiv = window.document.getElementById("hotelInfo_layout");
      mapDiv.style.height = (h + 57) + "px";
      mapDiv.style.minHeight = 810 + "px";
      const mapDiv1 = window.document.getElementById("mapDiv");
      mapDiv1.style.left = ((w - w2) / 2) + "px";

      const mapClose = window.document.getElementById("mapClose");
      mapClose.style.left = ((w + w2) / 2 - 30) + "px";

      const upFileDiv = window.document.getElementById("upFileDiv");
      upFileDiv.style.left = ((w - 1000) / 2) + "px";
    },
    bind() {
      const _this = this;
      //关闭地图
      $('#mapClose').on('click', function () {
        $('#hif_mapMask').hide();
        $('#mapDiv').hide();
        $('#mapClose').hide();
      });
      //显示upFileDiv
      $('#hif_showUpFileBtn').on('click', function () {
        $('#hif_mapMask').fadeTo(1, 0.3);
        $('#upFileDiv').show();
        $('#upFileClose').show();
      });
      //关闭upFileDiv
      $('#upFileClose').on("click", function () {
        $('#hif_mapMask').hide();
        $('#upFileDiv').hide();
        $('#upFileClose').hide();
      });
      //点击显示地图
      $('#hif_showMap').on('click', function () {
        $('#hif_mapMask').fadeTo(1, 0.3);
        $('#mapDiv').show();
        $('#mapClose').show();
        $('#mapDiv').load("../client/map.jsp");
      });

      //修改商家信息
      $('#businessSubmit').on('click', function () {
        if (!$('#hotel_mobile').textbox('isValid')) {
          $('#hotel_mobile').textbox('textbox').focus();
          return;
        }
        if (!$('#hotel_email').textbox('isValid')) {
          $('#hotel_email').textbox('textbox').focus();
          return;
        }
        if (!$('#hotel_add').textbox('isValid')) {
          $('#hotel_add').textbox('textbox').focus();
          return;
        }
        if (!$('#hotel_description').textbox('isValid')) {
          $('#hotel_description').textbox('textbox').focus();
          return;
        }
        if (!$('#hotel_hotelIdentity').textbox('isValid')) {
          $('#hotel_hotelIdentity').textbox('textbox').focus();
          return;
        }
        $('#himform').removeAttr('action');
        $('#himform').removeAttr('enctype');
        const ppmb = {
          businessId: Number($('#hotel_id').val() === '' ? 0 : $('#hotel_id').val()),
          businessName: $('#hotel_name').textbox("getValue"),
          businessContact: $('#hotel_con').textbox("getValue"),
          businessMobile: $('#hotel_mobile').numberbox("getValue"),
          businessEmali: $('#hotel_email').textbox("getValue"),
          businessLat: $('#hotel_lat').numberbox("getValue") === '' ? 0 :
            $('#hotel_lat').numberbox("getValue"),
          businessLong: $('#hotel_long').numberbox("getValue") === '' ? 0 :
            $('#hotel_long').numberbox("getValue"),
          businessAdd: $('#hotel_add').textbox("getValue"),
          businessPhoto: $('#hotel_photo').attr('src').replace(/http:\/\/www.eapor.com\//, ""),
          businessReserveTel: $('#hotel_reserveTel').textbox("getValue"),
          businessBri: $('#hotel_description').textbox('getValue'),
          hotelIdentity: $('#hotel_hotelIdentity').textbox("getValue"),
          province: $('#province_hotelInfo').val(),   //省
          city: $('#city_hotelInfo').val(),//市
          district: $('#district_hotelInfo').val()//区
        };
        eapor.utils.defaultAjax("../hotel/upinfobyid", ppmb, _this.businessCallBack);
      });
    },
    //----------酒店信息JS---------------
    businessCallBack(data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      if (data > 0) {
        $.messager.alert('系统提示', '修改成功！');
        console.info($('#hotel_name').textbox('getValue'));
        $('#menu_hotelName').text($('#hotel_name').textbox('getValue'));
        //初始酒店信息
        eapor.utils.defaultAjax("../hotel/hotelbyid", {}, hotelInfo.businessGetJson);
        return;
      }
      $.messager.alert('系统提示', '修改失败！');
    },
    //获取酒店信息
    businessGetJson: function (data) {
      if (eapor.utils.ajaxCallBackErrInfo(data)) {
        return;
      }
      console.info(data);
      $('#hotel_id').val(data.businessId);
      $('#hotel_name').textbox("setValue", data.businessName);
      $('#hotel_con').textbox("setValue", data.businessContact);
      $('#hotel_mobile').numberbox("setValue", data.businessMobile);
      $('#hotel_email').textbox("setValue", data.businessEmali);
      $('#hotel_add').textbox("setValue", data.businessAdd);
      $('#hotel_long').numberbox("setValue", data.businessLong);
      $('#hotel_lat').numberbox("setValue", data.businessLat);
      $('#hotel_prov_city').textbox("setValue",
        (data.province ? data.province : '') +
        (data.city ? data.city : '') +
        (data.district ? data.district : ''));
      $('#hotel_reserveTel').textbox("setValue", data.businessReserveTel);
      $('#hotel_photo').attr('src', data.businessPhoto
        ? (
          data.businessPhoto.includes('eapor.com')
            ? data.businessPhoto
            : ('http://www.eapor.com/' + data.businessPhoto)
        )
        : eapor.data.guestFileNoPictureUrl);
      $('#hotel_description').textbox("setValue", data.businessBri);
      $('#hotel_hotelIdentity').textbox("setValue", data.hotelIdentity);
      $('#province_hotelInfo').val(data.province);
      $('#city_hotelInfo').val(data.city);
      $('#district_hotelInfo').val(data.district);
    },
  };
  hotelInfo.init();
})();