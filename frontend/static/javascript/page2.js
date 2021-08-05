//import * as echarts from 'echarts';

var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};

var option;
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return("false");
}

var sname=getQueryVariable("name");
if (sname=="false") sname="DATACENTER1";
//alert(namep);
myChart.showLoading();

$.ajax({
    url : "http://123.57.75.110/main/get_dc_inner_topo",
    method : "post",
    dataType : "json",
    headers:{
        contentType : "text/plain",
    },
    data: JSON.stringify({"name": sname}),
    success: function(res) {
    myChart.hideLoading();
    var nodes = res.data.nodes;
    var edgelist = res.data.edges;
    var sflows = res.data.sflows;
    var categories =[];

    for (var i=0;i<10;i++){
        categories.push({name:"innerDC_s"+i});
    }
    for (var i=0;i<nodes.length;i++){
        nodes[i].category = i%10;
        nodes[i].symbolSize = 20;
    }
    var edges=[];
    for (var i=0;i<edgelist.length;i++){
        edges.push(
            {
                id:edgelist[i].id,
                source:edgelist[i].from.toString(),
                target:edgelist[i].to.toString(),
            }
            );
    }
  
    function NumAscSort(a,b)  
    {  
     return b.size - a.size;  
    }  
  
    var edge_flow_list=[];
    for (var i=0;i<sflows.length;i++){
        var string_id = sflows[i].edge_id.toString();
  
        if (edge_flow_list[string_id]===undefined){
          edge_flow_list[string_id]=[{psm:sflows[i].psm, size: sflows[i].GB}];
        } 
        else if (edge_flow_list[string_id].length<10){
            edge_flow_list[string_id].push({psm:sflows[i].psm, size: sflows[i].GB});
        }
        else{
          edge_flow_list[string_id].sort(NumAscSort);
          if (edge_flow_list[string_id][9].size < sflows[i].GB){
            edge_flow_list[string_id].pop();
            edge_flow_list[string_id].push({psm:sflows[i].psm, size: sflows[i].GB});
          }
        }
        edge_flow_list[string_id].sort(NumAscSort);
    }
  
    option = {
        tooltip: {
            formatter:function(params){
                if (params.data.symbolSize !==undefined) return "";
                var slist = edge_flow_list[params.data.id.toString()];
                var res = "<div class='menu'><ul>";
                res+="<li><span>" + params.name+ "</span></li>";
                for (var i=0;i<slist.length;i++){
                    res += "<li>PSM类型：" + slist[i].psm + "; Size：" + slist[i].size +"GB</li> ";
                } 
                res+="</ul></div>";
                return res;
            }
        },
        legend: [{
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        series: [
            {
                name: 'inner DC Topology',
                type: 'graph',
                layout: 'circular',
                data: nodes,
                links: edges,
                categories: categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        ]
    };

    myChart.setOption(option);
    }
});

if (option && typeof option === 'object') {
    myChart.setOption(option);
}
