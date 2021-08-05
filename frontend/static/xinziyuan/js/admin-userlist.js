
var vm = new Vue({
  el:'#usermanage',
  data:{
    user: {
      username: '', password: '', usertype: ''
    },
    userlist: [
      {username: 'user1', password: 'u1', usertype: 'student'},
      {username: 'user2', password: 'u2', usertype: 'teacher'},
    ],
    postdata: {
      username: '',
      password: '',
      usertype: '',
      batch_names: ''
    },
  },
  methods:{
    insert:function(){
      console.log(this.postdata);
      if (this.postdata.username == '' || this.postdata.password == '' || this.postdata.usertype == '')
      {
        alert('用户信息不能有缺省');
        return;
      }
      this.$http.post(backend_server + 'user-add/', this.postdata, {emulateJSON: true, credentials: true}).then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('添加用户成功');
          location.reload();
        }
        else
        {
          alert('添加用户失败(' + dataret.info +')');
        }
      },function(res){
        console.log(res.status);
        alert('添加用户失败(unknown error)');
      });
    },
    remove:function(username){
      console.log(username + ' is to be deleted.');
      this.$http.post(backend_server + 'user-delete/', {"username": username}, {emulateJSON: true, credentials: true}).then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('删除用户成功');
          location.reload();
        }
        else
        {
          alert('删除用户失败(' + dataret.info +')');
        }
      },function(res){
        console.log(res.status);
        alert('删除用户失败(未知错误)');
      });
    },
    get_userlist:function(){
      this.$http.get(backend_server + 'user-list/', {credentials: true}).then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.userlist = dataret.userlist
        }
        else
        {
          alert('获取用户列表失败(' + dataret.info +')');
        }
      },function(res){
        console.log(res.status);
        alert('获取用户列表失败(未知错误)');
      });
    }
  },
  created:function(){
    this.get_userlist();
  }
})
