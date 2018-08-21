$(function () {

  var currentPage = 1;
  var pageSize = 2;

  // 定义用来存储已上传图片的数组
  var picArr = [];

  function render() {

    //1.页面渲染
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("tpl", info);
        $(".lt_content tbody").html(htmlStr);

        //2.分页功能
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),

          // 拓展：配置按钮文本
          itemTexts: function (type, page, current) {
            switch (type) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          //拓展：配置页码title提示信息
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            };
          },
          //拓展：使用bobtstrap的提示框组件
          useBootstrapTooltip: true,

          // 给页码注册点击事件
          onPageClicked: function (event, originalEvent, type, page) {
            currentPage = page;
            render();
          }

        })
      }

    })
  }
  render();

  // 3.点击添加按钮，弹出模态框
  $(".lt_content .add-btn3").on("click", function () {
    $("#addModal3").modal("show");

    //4.下拉框的渲染
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
        $(".dropdown-menu").html(htmlStr);
      }
    });


    //5.给二级下拉菜单下面的ul 里的 a 注册 事件委托事件
    $(".dropdown-menu").on("click", "a", function () {
      // 设置文本
      var txt = $(this).text();
      // 赋值给二级菜单
      $("#dropdownText").text(txt);

      // 设置id,并给隐藏域
      var id = $(this).data("id");
      $('[name="brandId"]').val(id);

      //重置校验状态为valid
      $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    });


    //6.多文件上传
    //(插件会便历选中的图片，发送多次请求到服务器，将来响应多次，每次响应都会调用一次done方法)
    $("#fileupload").fileupload({
      // 返回的数据格式
      dataType: "json",
      //文件上传完成时调用的回调函数
      done: function (e, data) {
        //data.result 是后台响应的内容
        console.log(data.result);

        //往数组的最前面追加 图片对象
        picArr.unshift(data.result);

        // 往imgBox 最前面追加img元素
        $(".imgBox").prepend('<img src="' + data.result.picAddr + '" width="100" alt="">');

        // 判断数组长度，如果大于3，将数组中的最后一项移除
        if (picArr.length > 3) {
          picArr.pop();

          //移除imgBox中的最后一张图片  
          //-index,下标为负值表示从最后一个元素开始倒数
          $(".imgBox img").eq(-1).remove();
        }
        console.log(picArr);//数组


        //如果处理后，图片数组的长度为3，那么就通过校验，手动将picStatus重置为VALID
        if (picArr.length === 3) {
          $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
        }

      }
    });


    //7.进行表单校验
    $("#form").bootstrapValidator({
      excluded: [],

      //设置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: "请选择二级分类"
            }
          }
        },
        // 商品名称
        proName: {
          validators: {
            notEmpty: {
              message: "请输入商品名称"
            }
          }
        },
        // 商品描述
        proDesc: {
          validators: {
            notEmpty: {
              message: "请输入商品描述"
            }
          }
        },
        // 商品库存
        // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
        // 数字: \d
        // + 表示一个或多个
        // * 表示零个或多个
        // ? 表示零个或1个
        // {n} 表示出现 n 次
        num: {
          validators: {
            notEmpty: {
              message: "请输入商品库存"
            },
            //正则校验
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '商品库存格式, 必须是非零开头的数字'
            }
          }
        },
        // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
        size: {
          validators: {
            notEmpty: {
              message: "请输入商品尺码"
            },
            //正则校验
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: "尺码格式, 必须是 32-40"
            }
          }
        },
        // 商品价格
        price: {
          validators: {
            notEmpty: {
              message: "请输入商品价格"
            }
          }
        },
        // 商品原价
        oldPrice: {
          validators: {
            notEmpty: {
              message: "请输入商品原价"
            }
          }
        },

        //补充：标记图片是否上传满三张
        picStatus: {
          validators: {
            notEmpty: {
              message: "请上传3张图片"
            }
          }
        }
      }

    });


    //8.校验成功，发送请求添加商品，阻止浏览器摸人的提交
    $("#form").on("success.form.bv", function (e) {
      e.preventDefault();

      //获取的是表单元素的数据
      var Str = $("#form").serialize();
      //还需要拼接上图片的数据      
      Str += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
      Str += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
      Str += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

      $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: Str,
        success: function (info) {
          console.log(info);
          if (info.success) {
            // 关闭模态框
            $("#addModal3").modal("hide");
            // 重置校验状态和文本内容
            $("#form").data("bootstrapValidator").resetForm(true);
            // 重新渲染第一页
            currentPage = 1;
            render();

            // 手动重置, 下拉菜单
            $("#dropdownText").text("请选择二级分类");
            // 删除结构中的所有图片
            $('#imgBox img').remove();
            // 重置数组 picArr
            picArr = [];
          }
        }
      })


    });


  })





})