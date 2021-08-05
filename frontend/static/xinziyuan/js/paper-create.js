
var vm = new Vue({
  // 
  el: '#app',
  data:{
    newpaper: ''
  },
  methods:{
    create:function(){
      if (this.newpaper == '')
      {
        alert('试题名不能为空！');
        return;
      }
      // send the name of new paper
      postdata = {
        papername: this.newpaper,
        action: 'create'
      };
      this.$http.post(backend_server + 'paper-manage/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('创建试题成功，试卷名：' + dataret.papername );
          window.location = "paper-manage.html";
        }
        else
        {
          alert('创建试题失败（1）');
          //location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('创建试题失败（2）');
        //location.reload();
      });
    }
  }
})