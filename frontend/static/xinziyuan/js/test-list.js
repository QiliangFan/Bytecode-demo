
var vm = new Vue({
  el:'#app',
  data:{
    myinfo: '',
    testlist : '',
    testhistory: ''
  },
  methods:{
    enter_test:function(paperid){
      //window.open("testing.html?paperid=" + paperid);
      window.location.href = "test-testing.html?paperid=" + paperid;
    },
    get_test_list:function(){
      this.$http.get(backend_server + 'paper-get-list-stu/', {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          tests = dataret.list;
          taken = dataret.taken;
          for (var i=0; i<tests.length; i++)
          {
            for (var j=0; j<taken.length; j++)
            {
              if (tests[i]['pid'] == taken[j]['pid'])
              {
                tests[i]['taken'] = true;
                break;
              }
            }
          }
          this.testlist = tests;
        }
        else
        {
          alert('获取试题列表失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('获取试题列表失败(2)');
      });
    },
  },
  created:function(){
    this.get_test_list();
  }
})
