var nodes = null;
var edges = null;
var network = null;

var dom = document.getElementById("mynetwork");
var myChart = echarts.init(dom);

function draw() {
  // create people.
  // value corresponds with the age of the person
color_list =[
  "rgba(218,112,214,1)",
  "rgba(189,252,201,1)",
  "rgba(51,161,201,1)",
  "rgba(221,160,221,1)",
  "rgba(255,235,205,1)",
  "rgba(240,255,255,1)",
  "rgba(176,48,96,1)",
  "rgba(255,192,203,1)",
  "rgba(0,201,87,1)",
  "rgba(210,105,30,1)",
];

myChart.showLoading();
$.post("http://123.57.75.110/main/get_dc_topo",
function(res){

  myChart.hideLoading();
  var nodes = res.data.nodes;
  var edges = res.data.edges;
  var sflows = res.data.sflows;
  for (var i=0;i<nodes.length;i++){
      nodes[i].color = color_list[i];
  }
  for (var i=0;i<edges.length;i++){
      edges[i].value = 1;
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

  var boxul="";
  for (var i=0;i<nodes.length;i++){
    boxul+= "<li class=\"d-flex justify-content-between\">" +
            "<div class=\"left-col d-flex\">" +
            "<div class=\"icon\"><i class=\"icon-rss-feed\"></i></div>" +
            "<div class=\"title\">" +
            "<strong>"+ nodes[i].name +"</strong>" +
            "<p>BeiJing,China</p>" +
            "<p>DC内总流量：" + nodes[i].value.toFixed(4) +"G</p>" +
            "<p>状态：正常</p>" +
            "</div></div></div></li>";
  }

  $("#fuck").append(boxul);


  // Instantiate our network object.
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "dot",
      borderWidth:0,
      scaling: {
        customScalingFunction: function (min, max, total, value) {
          return value / total;
        },
        min: 5,
        max: 150,
      }
    },
    edges:{
      arrows:{
        to:{enabled:true,scaleFactor:0.5},
      },
      length:500,
    },
    interaction:{
      hover:true,
      hoverConnectedEdges: true,
      tooltipDelay: 300,
    }
  };
  network = new vis.Network(container, data, options);

     /**
     * 节点鼠标悬停（点击）获取到的信息
     * 因为hoverNode事件官方文档中给的信息悬停时只传了id值，想在鼠标悬停的时候显示该节点的信息拿不到值，所以遍历节点，相等的时候return改节点的信息
     * @param option-----鼠标悬停时取得的id
     * @returns {{flag, port, ip, name, ignore, id, type}|{flag, port, ip, name, ignore, model, id, type, mac, uptime}|{flag, port, ip, name, ignore, model, location, id, type, mac, account, uptime}|*}
     */
      function getNode(option) {
        for (var i = 0;i < nodes.length;i++){
            if (option == nodes[i].id){
                // console.log('i',nodes[i]);
                return nodes[i];
            }
        }
    }

    //todo  悬停在节点上--显示弹框
    network.on('hoverNode',function(properties){
        // console.log('悬停节点',properties);
        var hoveNodeList = getNode(properties.node);
        // console.log('hoveNodeList',hoveNodeList);
        

        var $ul = "<ul>"
            +"<li><span> 设备类型："+hoveNodeList.name+" </span> </li>"
            +"<li>BYTES："+ hoveNodeList.value+"</li>"
            +"</ul>";
        $("#divHoverNode").append($ul);

        $('#divHoverNode').css({
            'display': 'block',
            'left': properties.event.offsetX + 15,
            'top' : properties.event.offsetY + 15
        });
        $('#menuOperation').hide();
    });
    //todo  从节点移开---隐藏弹框
    network.on('blurNode',function(){
        $("#divHoverNode").hide();
        $("#divHoverNode").empty();//移除之后清空div
    });


    /**
     * 线悬停（点击）时两端节点的信息（与节点类似）
     * edges中加了id属性，代表线条指向，悬停时通过edges--id与nodes--id对比，将两端节点信息拼凑出来
     * @param option----鼠标悬停在线上时取得的id
     * @returns {Array}
     */
         function getEdge(option){
            var dataList = [];//存放线条两边的节点nodes数据
            var sid = option.toString();
            return edge_flow_list[sid];
        }
   //todo  悬停在边上--显示弹框
    network.on('hoverEdge',function(properties){
        // console.log('悬停边',properties);
        var hoveEdgeList = getEdge(properties.edge);
        var $ul = "<ul>";
        for (var i=0;i<hoveEdgeList.length;i++){
            $ul+="<li>服务类型："+ hoveEdgeList[i].psm +"；流量大小："+ hoveEdgeList[i].size +" GB/s</li>";
        }
        $ul+="</ul>";
        $("#divHoverNode").append($ul);
        $('#divHoverNode').css({
            'display': 'block',
            'left': properties.event.offsetX + 15,
            'top' : properties.event.offsetY + 15
        });
        $('#menuOperation').hide();
    });
    //todo  从边上移开---隐藏弹框
    network.on('blurEdge',function(properties){
        $("#divHoverNode").hide();
        $("#divHoverNode").empty();//移除之后清空div
    });

    
    //todo  点击的判断是否选中节点时候显示隐藏
    network.on('click',function(properties){
      var clickNode = getNode(properties.nodes[0]);
      // console.log('clickNodeList',clickNodeList);
      if (typeof(clickNode) == "undefined") {
          $('#menuOperation').hide();
      }else{
        var url="page2.html?name=" + clickNode.name;
        window.location.href = url;
      }
    });
  },"json");
}

window.addEventListener("load", () => {
  draw();
});        