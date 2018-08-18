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

