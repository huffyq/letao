$(function () {


  //1. 基于准备好的dom，初始化echarts实例
  var myChart1 = echarts.init(document.getElementById('box1'));

  // 指定图表的配置项和数据
  var option1 = {
    title: {//标题文本
      text: '2017年注册人数'
    },
    tooltip: {}, //提示框组件
    legend: {    //图例
      data: ['人数']
    },
    xAxis: {    //x轴刻度
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {},  //y轴刻度，一般不设置根据数据动态生成
    series: [{
      name: '人数',
      type: 'bar',   //类型-柱状图
      data: [1000, 1500, 1800, 1200, 1000, 500]
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart1.setOption(option1);


  //2. 基于准备好的dom，初始化echarts实例
  var myChart2 = echarts.init(document.getElementById('box2'));

  var option2 = {
    title: {  
      text: '热门品牌销售',   //大标题
      subtext: '2017年6月',  //副标题
      x: 'center'  //控制标题位置
    },
    tooltip: {
      trigger: 'item',  //坐标轴触发
      formatter: "{a} <br/>{b} : {c} ({d}%)" //
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克', '阿迪', '新百伦', '李宁', '阿迪王']
    },
    series: [
      {
        name: '品牌',
        type: 'pie',
        radius: '50%',  //指定圆的直径
        center: ['50%', '60%'],  //圆心的坐标
        data: [
          { value: 335, name: '耐克' },
          { value: 310, name: '阿迪' },
          { value: 234, name: '新百伦' },
          { value: 135, name: '李宁' },
          { value: 1548, name: '阿迪王' }
        ],
        itemStyle: {   //可以添加阴影效果
          emphasis: {
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 1)'
          }
        }
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option2);



})