//公共部分js
  //1.进度条功能（全局事件）
  $(document).ajaxStart(function(){
    // ajaxStart在开始一个ajax请求时触发
    // 开启进度条    
    NProgress.start();
  });

  $(document).ajaxStop(function(){
    // ajaxStop在最后一个ajax请求结束时触发
    // 关闭进度条(设置一个定时器，延迟500毫秒)
    setTimeout(function(){
      NProgress.done();      
    }, 500);
    
  });

  //2.登陆拦截功能
  // (1)用户已登录，啥都不用做
  // (2)用户未登录，拦截到登录页
  if(location.href.indexOf("login.html") === -1){
    //地址栏中没有login.html，说明不是登录页，需要进行登录拦截
    $.ajax({
      type:"get",
      url:"/employee/checkRootLogin",
      dataType:"json",
      success:function(info){
        if(info.success){
          console.log("登录成功");        
        }
        if(info.error === 400){
          console.log("未登录");
          location.href = "login.html";
        }
      }
    })
  }




  //首页
  $(function(){
    //1.左侧侧边栏的切换功能
    $(".icon_menu").click(function(){
      $(".lt_aside").toggleClass("hidemenu");
      $(".lt_main").toggleClass("hidemenu");
      $(".lt_topbar").toggleClass("hidemenu");
    });

    // 2.分类管理的切换功能
    $(".nav .category").click(function(){
      $(".nav .child").stop().slideToggle();
    });

    //3.点击退出按钮，模态框弹出
    $(".icon_logout").click(function(){
      $("#logoutModal").modal("show");
    });

    //4.点击模态框的退出按钮，退出
    $(".logoutBtn").click(function(){
      $.ajax({
        type:"get",
        url:"/employee/employeeLogout",
        dataType:"json",
        success:function(info){
          console.log(info);
          if(info.success){
            location.href = "login.html";
          }
        }
      })
    });

  })

