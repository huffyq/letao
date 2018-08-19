$(function(){

  // 全局定义变量
  var currentPage = 1;
  var pageSize = 5;

  function render(){

    //1.分页渲染
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page: currentPage,
        pageSize: pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("firstTpl",info);
        $(".lt_content tbody").html(htmlStr);  
  
        // 2、分页功能实现
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
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

  //3.准备添加的模态框,点击添加按钮，弹出模态框
  $(".lt_content .add-btn").on("click",function(){
    $("#addModal").modal("show");
  });

  //4.添加分类表单校验
  $("#form").bootstrapValidator({
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields:{
      categoryName :{
        validators :{
          notEmpty:{
            message:"请输入一级分类名称"
          }
        }
      }
    },
  });

  // 5.表单校验成功,注册表单校验成功的事件，阻止默认提交，使用ajax提交
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
   
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        console.log(info);
        
        if(info.success){
          // 关闭模态框
          $("#addModal").modal("hide");
          // 重新渲染第一页（因为添加的数据在第一页）
          currentPage = 1;
          render();
          // 重置表单的数据和样式
          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  });





})