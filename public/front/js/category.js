$(function(){

  // 1.左侧一级导航渲染
  $.ajax({
    type:"get",
    url:" /category/queryTopCategory",
    // data:
    dataType:"json",
    success:function(info){
      console.log(info);
      var htmlStr = template("leftTpl",info);
      $(".cate_left ul").html(htmlStr);

      // 一进入页面，渲染第一个一级分类所对应的二级分类
      renderSecondById(info.rows[0].id);
    }
  });

  //3.右侧二级导航渲染
  //点击一级分类, 渲染二级分类
  $(".cate_left").on("click","a",function(){

    // 给自己加上 current, 移除其他的 current
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    
    // 获取 id, 通过 id 进行二级分类渲染
    var id = $(this).data("id");
    renderSecondById(id);

  });



  // 2.封装一个方法，专门用于根据一级分类id去渲染二级分类
  function renderSecondById(id){

    $.ajax({
      type:"get",
      url:"/category/querySecondCategory",
      data:{
        id:id
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("rightTpl",info);
        console.log(htmlStr);
        $(".cate_right ul").html(htmlStr);
      }
    })

  };



})