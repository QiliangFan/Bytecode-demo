
window.onload = function(){
  var verify = new Vue({
    el:'#verify',
    data:{
      loginuser : ''
    },
    methods:{
      logout:function(){
        //发送 post 请求
        this.$http.get(backend_server + 'logout/', {credentials: true}).then(function(res){
          //document.write(res.bodyText);  
          console.log(res.bodyText);
          var dataret = JSON.parse(res.bodyText);
          if (dataret.code == 200)
          {
            console.log(dataret.redirect);
            window.location.href = 'index.html';
          }
          else
          {
            alert('登录错误！');
          }
          //console.log(res);
          //console.log(JSON.parse(res.bodyText));
          //window.location.href='http://www.ddhbb.com';
        },function(res){
          console.log(res.status);
        });
      }
    },
    created:function(){
      this.$http.get(backend_server + 'login/', {credentials: true}).then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.loginuser = dataret.username;
        }
        else
        {
          this.loginuser = dataret.info;
          window.location.href = 'error.html';
        }
      },function(res){
        console.log(res.status);
      });
    }
  })
}

//var backend_server = 'http://localhost:8000/'

function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); 
  return null; 
} 

/* show or hide the div over the page *
 * which div is named `overdiv` with  *
 * an empty div named `over`          */

function show_div()
{
  var overdiv = document.getElementById('overdiv');
  var over = document.getElementById('over');
  overdiv.style.display = "block";
  over.style.display = "block";
}

function hide_div()
{
  var overdiv = document.getElementById('overdiv');
  var over = document.getElementById('over');
  overdiv.style.display = "none";
  over.style.display = "none";
}

/* scroll to the top of the current page */
function smoothscroll(){
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
}
