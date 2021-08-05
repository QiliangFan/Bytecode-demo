
var vm = new Vue({
  el:'#app',
  data:{
    takenlist : '',
  },
  methods:{
    get_taken_list:function(){
      this.$http.get(backend_server + 'test-history/', {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.takenlist = dataret.list;
        }
        else
        {
          alert('获取考试记录失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('获取考试记录失败(2)');
      });
    },
  },
  created:function(){
    this.get_taken_list();
  }
})
