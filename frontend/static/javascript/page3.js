
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};

var option;



setTimeout(function () {

    option = {
        legend: {},
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: [
                ['product', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00','20:00-22:00', '22:00-24:00'],
                ['DATA-AML', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                ['HDFS', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                ['TCE', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                ['SYS', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '55%'},
        series: [
            {type: 'bar', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'bar', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'bar', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            {type: 'bar', smooth: true, seriesLayoutBy: 'row', emphasis: {focus: 'series'}},
            
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                emphasis: {focus: 'data'},
                label: {
                    formatter: '{b}: {@12:00-14:00} ({d}%)'
                },
                encode: {
                    itemName: 'product',
                    value: '12:00-14:00',
                    tooltip: '12:00-14:00'
                }
            }
        ]
    };

    myChart.on('updateAxisPointer', function (event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });

    myChart.setOption(option);

});

if (option && typeof option === 'object') {
    myChart.setOption(option);
}