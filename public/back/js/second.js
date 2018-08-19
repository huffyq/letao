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
          pageSize: Math.ceil(info.total / info.size),
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
  })

  // 4.发送ajax请求, 获取所有的一级分类数据, 进行动态渲染下拉框
  // 通过获取一级分类接口(带分页的) 模拟 获取全部一级分类的接口
  $.ajax({
    type: "get",
    url: "/category/querySecondCategoryPaging",
    data: {
      page: 1,
      pageSize: 100
    },
    dataType: "json",
    success: function (info) {
      console.log(info);
      var htmlStr = template("dropdownTpl", info);
      $("#addModal2 .dropdown-menu").html(htmlStr);
    }
  });

  //5.给下拉列表的 a 添加点击事件(通过事件委托绑定),让下拉框可以选择上去
  $(".dropdown-menu").on("click", "a", function () {
    // 获取 a 的文本
    var txt = $(this).text();
    // 设置 给下拉按钮
    $("#dropdownText").text(txt);

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
      }
    });

  })



















})