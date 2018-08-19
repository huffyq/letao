$(function(){

  // 全局定义变量
  var currentPage = 1;
  var pageSize = 5;

  // 定义currentId
  var currentId;
  var isDelete; // 标记用户状态

  function render(){

    //1.渲染页面
    $.ajax({  
      type:"get",
      url:"/user/queryUser",
      data:{
        page: currentPage,
        pageSize: pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("tpl",info);
        $(".lt_content tbody").html(htmlStr);

        // 2.分页功能
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            //更新当前页
            render();
          }
        })
      }
    })
  }
  render();

  //3.给所有启用禁用按钮, 添加点击事件(通过事件委托绑定), 显示模态框
  $("tbody").on("click",".btn",function(){
    $("#submitModal").modal("show");

    // 3.1通过自定义属性, 获取td中存的用户id, 并保存在全局变量中
    currentId = $(this).parent().data("id");
    
    // 3.2  通过判断类名, 决定需要传递给后台 isDelete,  1 启用, 0 禁用 
    // 如果是禁用按钮, 想要禁用该用户, 就是将该用户状态, 变成 0, 传 0
    isDelete = $(this).hasClass("btn-danger")? "0" : "1";
  });

  //4.点击模态框的确定按钮, 实现启用禁用切换
  $("#submitModal").on("click",function(){
    console.log(77);

    $.ajax({
      type:"post",
      url:"/user/updateUser",
      data:{
        id:currentId,
        isDelete:isDelete
      },
      success:function(info){
        console.log(info);
        // 成功的时候，关闭模态框，重新渲染页面
        if(info.success){
          $("#submitModal").modal("hide");
        }
        render();
      }

    })
  });



})