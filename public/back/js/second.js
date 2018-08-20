$(function () {

  var currentPage = 1;
  var pageSize = 5;

  function render() {

    //1.页面渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $(".lt_content tbody").html(htmlStr);

        // 2.分页功能实现
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (event, originalEvent, type, page) {
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

  //3.点击添加按钮，显示模态框
  $(".lt_content .add-btn2").on("click", function () {
    $("#addModal2").modal("show");

    // 4.发送ajax请求, 获取所有的一级分类数据, 进行动态渲染下拉框
    // 通过获取一级分类接口(带分页的) 模拟 获取全部一级分类的接口
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    })

  });


  //5.给下拉列表的 a 添加点击事件(通过事件委托绑定),让下拉框可以选择上去
  $(".dropdown-menu").on("click", "a", function () {
    // 获取 a 的文本
    var txt = $(this).text();
    // 设置 给下拉按钮
    $("#dropdownText").text(txt);

    // 获取 a 标签存储的 分类 id
    var id = $(this).data("id");

    //赋值给name = "categoryId"的表单元素
    $("[name ='categoryId']").val(id);


    // 更新校验状态为 校验通过状态
    // updateStatus(字段名称, 校验状态, 校验规则(可以配置提示信息) )
    $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
  
  });


    //6.文件上传(插件)    
    $("#fileupload").fileupload({
      dataType: "json",
      //文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
      //第二个参数就有上传的结果 data.result
      done: function (e, data) {
        //console.log("图片上传完成拉");
        //console.log(data);
        //console.log(data.result.picAddr);

        //获取地址
        var imgUrl = data.result.picAddr;
        //设置给img
        $(".imgBox img").attr("src", imgUrl);

        //将地址设置给 name = "brandLogo"的input
        $("[name='brandLogo']").val(imgUrl);
        //设置隐藏域的校验状态为 VALID
        $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");

      }
    });



    //7.表单校验
    $("#form").bootstrapValidator({

      // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
      // 默认插件不对隐藏域进行校验, 现在需要对隐藏域进行校验
      excluded:[],

      //设置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

      fields:{
        categoryId:{
          validators:{
            notEmpty:{
              message:"请选择一级分类"
            }
          }
        },
        brandName:{
          validators:{
            notEmpty:{
              message:"请输入二级分类名称"
            }
          }
        },
        brandLogo:{
          validators:{
            notEmpty:{
              message:"请选择上传图片"
            }
          }
        }
      }

    });

    //表单校验成功,注册表单校验成功的事件，阻止默认提交，使用ajax提交
    $("#form").on("success.form.bv",function(e){
      e.preventDefault();
     
      $.ajax({
        type:"post",
        url:"/category/addSecondCategory",
        data:$("#form").serialize(),
        dataType:"json",
        success:function(info){
          console.log(info);

          if(info.success){
            $("#addModal2").modal("hide"); 
            currentPage = 1;
            render();

            $("#form").data("bootstrapValidator").resetForm(true);
            // 下拉按钮的文本, 图片不是表单元素, 需要手动重置
            $("#dropdownText").text("请选择一级分类");
            $(".imgBox img").attr("src","./images/none.png");
          }
          
        }
      })

    })























})