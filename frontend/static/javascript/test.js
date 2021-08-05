var nodes = null;
var edges = null;
var network = null;

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

  nodes = [
    //value 流量总和 label、name：数据中心名称
    { id: 1, value: 2, label: "Algie", color: color_list[1],name:'DATACENTER1' },
    { id: 2, value: 31, label: "Alston", color: color_list[2],name:'DATACENTER2' },
    { id: 3, value: 12, label: "Barney" ,color: color_list[2],name:'DATACENTER3'},
    { id: 4, value: 16, label: "Coley" , color: color_list[3]},
    { id: 5, value: 17, label: "Grant" , color: color_list[3]},
    { id: 6, value: 15, label: "Langdon", color: color_list[3]},
    { id: 7, value: 6, label: "Lee" ,color: color_list[7]},
    { id: 8, value: 5, label: "Merlin", color: color_list[7]},
    { id: 9, value: 30, label: "Mick", color: color_list[7] },
    { id: 10, value: 18, label: "Tod", color: color_list[7] },
  ];

  // create connections between people
  // value corresponds with the amount of contact between two people
  edges = [
    //from  为src id, to 为dst id ,value 为该link流量总和，label为value转换成GBPS后的值
    { from: 2, to: 8, value: 2 ,id: 1},
    { from: 2, to: 9, value: 2 },
    { from: 2, to: 10, value: 2 },
    { from: 4, to: 6, value: 2 },
    { from: 5, to: 7, value: 2 },
    { from: 4, to: 5, value: 2 },
    { from: 9, to: 10, value: 2 },
    { from: 2, to: 3, value: 2 ,id:"2>3"},
    { from: 3, to: 9, value: 2 },
    { from: 5, to: 3, value: 2 },
    { from: 2, to: 7, value: 2 },
    { from: 7, to: 2, value: 2 },
    { from: 1, to: 2, value: 2 },
  ];

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
      }
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
            var linkId = option;
            var linkIdFirst = linkId.substring(0,1);//截取第一位
            var linkIdLast = linkId.substring(linkId.length-1,linkId.length);//截取最后一位
            var dataList = [];//存放线条两边的节点nodes数据
            for (var j =0;j<nodes.length;j++){
                if (linkIdFirst == nodes[j].id || linkIdLast == nodes[j].id){
                    dataList.push(nodes[j]);
                }
            }
            return dataList;
        }
   //todo  悬停在边上--显示弹框
    network.on('hoverEdge',function(properties){
        // console.log('悬停边',properties);
        var hoveEdgeList = getEdge(properties.edge);
        // console.log('hoveEdgeList',hoveEdgeList);
        var $ul = "<ul>"
            +"<li>链路信息："+ hoveEdgeList[0].name+"->"+hoveEdgeList[1].name+"</li>"
            +"<li>服务类型："+ "视频 ；流量大小：5Gbps"+"</li>"
            +"</ul>";
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


}

window.addEventListener("load", () => {
  draw();
});        