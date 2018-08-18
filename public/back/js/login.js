$(function () {

  //1.登录校验
  $("#form").bootstrapValidator({

    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields: {

      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名必须是2-6位"
          },
          callback:{  // 专门用于配置回调提示的规则
            message:"用户名不存在"
          }          
        }
      },

      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码必须是6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  });


  // 2.表单校验成功,注册表单校验成功的事件，阻止默认提交，使用ajax提交
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();//阻止浏览器的默认提交
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);

        // 处理响应结果
        if (info.success) {
          // 如果是success,需要跳转到首页
          location.href = "index.html";
        }

        if (info.error === 1000) {
          // 如果error是1000，提示用户名错误
          $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }

        // error是1001，提示密码错误
        if (info.error === 1001) {
          $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }

    })

  });


  //3.重置表单
  $("[type=reset]").click(function(){  //c3方式获取元素，也可以取类名
    // 重置表单，并且会隐藏所有的错误提示和图标
    $("#form").data("bootstrapValidator").resetForm();
  }); 


})
