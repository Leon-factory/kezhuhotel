$(function () {
  var _fastClickFlag = false;

  $('a[title="站长统计"]').attr("tabindex", -1);
  //返回顶部JS
  function checkPosition(pos) {
    $(window).scrollTop() > pos ? $('#backtop').fadeIn() : $('#backtop').fadeOut();
  }
  $(window).on('scroll', function () {
    checkPosition(parseInt($(window).height() / 5));
  });

  checkPosition(parseInt($(window).height() / 5));
  //使用canvas，渲染返回顶部样式   
  var canvas = document.getElementById('cvs');
  var cxt = canvas.getContext('2d');
  cxt.beginPath();
  cxt.lineCap = 'round';
  cxt.moveTo(13, 22);
  cxt.lineTo(19, 14);
  cxt.lineTo(25, 22);
  cxt.strokeStyle = "#FBFBFB";
  cxt.lineWidth = 3;
  cxt.stroke();

  $("#cvs").click(function () {
    if ($(window).scrollTop() && !$('html,body').is(':animated')) {
      $('html,body').animate({
        scrollTop: 0
      }, 400);
    }
  });

  //点击滚动到‘关于’的位置
  $("#title_about").click(function () {
    $('html,body').animate({ scrollTop: $('#aboutEapor').offset().top }, 500);
  });
  $("#title_lianxi").click(function () {
    $('html,body').animate({ scrollTop: $('#lianxiEapor').offset().top }, 500);
  });

  //点击刷新验证码
  $('#verificationCode').click(function () {
    var time = new Date().getTime();
    if ((window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1')) {
      $(this).attr('src', 'validate/code?' + time);
    } else {
      $(this).attr('src', '../kzhotel/validate/code?' + time);
    }
  });
  //点击显示明文密码
  $('#showPWD').on('click', function () {
    $(this).toggleClass("black").toggleClass("ccc");
    var ty = $(this).prev().attr('type');
    if (ty === 'text') {
      $(this).prev().attr('type', 'password').focus();
    } else {
      $(this).prev().attr('type', 'text').focus();
    }
  });
  $('input[name="password"]').on('focus', function () {
    var This = $(this);
    var cla = This.next().hasClass('black');
    if (cla) {
      This.attr('type', 'password');
    } else {
      This.attr('type', 'text');
    }
  });
  //手动登录js
  function signIn() {
    $('#errTip').hide();
    if (_fastClickFlag) {
      return;
    }
    _fastClickFlag = true;
    $('#indexLogin').addClass('disabled');
    $('#logInImmediately').hide();
    $('#loggingIn').show();
    var _autoFlag = $("input[name='autoLoginCheck']").prop("checked");
    console.log({
      username: $('#username').val(),
      password: md5($('#password').val()),
      validateCode: $('#validate').val(),
      auto: _autoFlag ? 'auto' : '',
    });
    var url = '', href = '';
    console.log(window.location.hostname);
    if ((window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1')) {
      url = './user/newlogin';
      href = './hotelIndex/hotelHome.jsp';
    } else {
      url = './kzhotel/user/newlogin';
      href = './kzhotel/hotelIndex/hotelHome.jsp';
    }

    $.ajax({
      type: 'post',
      url: url,
      data: {
        username: $('#username').val(),
        password: md5($('#password').val()),
        validateCode: $('#validate').val(),
      },
      dataType: 'json',
    })
      .done(function (result) {
        console.log(result);
        _fastClickFlag = false;
        $('#indexLogin').removeClass('disabled');
        $('#loggingIn').hide();
        $('#logInImmediately').show();
        if (result.errCode >= 0) {
          if (_autoFlag) {
            localStorage.setItem('kzhotel_loadKey', JSON.stringify(result.data.user.loadKey));
            localStorage.setItem('kzhotel_lginfo', JSON.stringify(result.data));
          }
          sessionStorage.setItem('kzhotel_isLogin', 1);
          window.location.href = href;
          return;
        }
        var _errCode = {
          '-1': '验证码不正确',
          '-2': '账号或密码不能为空',
          '-3': '账号或密码错误',
          '-4': '数据连接错误',
        };
        var tip = (_errCode[result.errCode + '']);
        $('#errTip').text(tip ? tip : '登录失败').show();
      })
      .fail(function (error) {
        console.log(error);
        _fastClickFlag = false;
        $('#indexLogin').removeClass('disabled');
        $('#loggingIn').hide();
        $('#logInImmediately').show();
      });
  }
  //sign in
  $('#indexLogin').on('click', function () {
    signIn();
  });
  //auto sign in
  $('#autoLogin').on('click', function () {
    if (_fastClickFlag) {
      return;
    }
    _fastClickFlag = true;
    $.ajax({
      type: 'post',
      url: (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') ?
        './user/newAutoLogin' : './kzhotel/user/newAutoLogin',
      data: { loadkey: JSON.parse(localStorage.getItem('kzhotel_loadKey')) },
      dataType: 'json'
    })
      .done(function (result) {
        _fastClickFlag = false;
        console.info(result);
        if (result.errCode >= 0) {
          localStorage.setItem('kzhotel_loadKey', JSON.stringify(result.data.user.loadKey));
          localStorage.setItem('kzhotel_lginfo', JSON.stringify(result.data));
          sessionStorage.setItem('kzhotel_isLogin', 1);
          window.location.href = (window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') ?
            './hotelIndex/hotelHome.jsp' : './kzhotel/hotelIndex/hotelHome.jsp';
        } else {
          //$('#errTip').text(tip?tip:'登录失败').show();
          alert('自动登录失败，请手动登录！');
          localStorage.removeItem('kzhotel_loadKey');
          localStorage.removeItem('kzhotel_lginfo');
          window.location.reload();
        }
      })
      .fail(function (error) {
        console.log(error)
        _fastClickFlag = false;
      });
  });
  //sign out
  $('#signOut').on('click', function () {
    console.log('signOut')
    localStorage.removeItem('kzhotel_loadKey');
    localStorage.removeItem('kzhotel_lginfo');
    $("#hasCookie").hide();
    $("#nocookie").show();
  });
  $(document).keyup(function (event) {
    if (event.keyCode == 13) {
      var iptName = $('input[name="username"]');
      if (iptName.val() == "") {
        iptName.focus();
        return;
      }
      var iptPSW = $('input[name="password"]');
      if (iptPSW.val() == "") {
        iptPSW.focus();
        return;
      }
      var iptValidate = $('#validate');
      if (iptValidate.val() == "") {
        iptValidate.focus();
        return;
      }
      signIn();
    }
  });
  //判断是否自动登录localStorage.removeItem('kzhotel_loadKey')
  if (localStorage.getItem('kzhotel_loadKey')) {
    $("#hascookie_username").val(JSON.parse(localStorage.getItem('kzhotel_lginfo')).user.username);
    $("#hascookie_hotelname").val(JSON.parse(localStorage.getItem('kzhotel_lginfo')).hotel.hotelName);
    $("#hasCookie").show();
    $("#nocookie").hide();
  }
});