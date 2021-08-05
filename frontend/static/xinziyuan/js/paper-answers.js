
var vm = new Vue({
  el:'#app',
  data:{
    paperid: '',
    paper: '',
    anslist: '',
    answer_content: '',
    stuid_to_show: '',
    answer_to_show: '',
  },
  methods:{
    showans:function(stuid, answer_str){
      console.log(answer_str);
      answer_json = JSON.parse(answer_str)
      console.log(answer_json.answer_list);
      this.stuid_to_show = stuid;
      this.answer_to_show = answer_json.answer_list;
      html = '';
      for (i=0; i<answer_json.answer_list.length; i++) {
        console.log(answer_json.answer_list[i]);
        html += '<tr>';
        html += '<td>' + answer_json.answer_list[i].id + '</td>';
        if (answer_json.answer_list[i].type == "keguan")
        {
          html += '<td>客观题</td>';
        }
        else
        {
          html += '<td>主观题</td>';
        }
        
        html += '<td>' + answer_json.answer_list[i].point + '</td>';
        html += '<td>' + answer_json.answer_list[i].answer + '</td>';
        html += '</tr>';
      }
      document.getElementById("show_record").innerHTML = html;
      console.log(html);
      show_div();
    },
    delans:function(stuid){
      postdata = {
        action: 'delans',
        paperid: this.paperid,
        stuname: stuid
      };
      this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('删除成功');
          location.reload();
        }
        else
        {
          alert('删除学生提交记录失败(1)');
          location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('删除学生提交记录失败(2)');
      });
    },
    get_paper_detail:function(){
      this.$http.get(backend_server + 'paper-get-detail/?id=' + this.paperid, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.paper = dataret.info;
        }
        else
        {
          this.prolist = '获取试题列表失败(1)';
        }
      },function(res){
        console.log(res.status);
        this.prolist = '获取试题列表失败(2)';
      });
    },
    get_student_answers:function(){
      postdata = {
        action: 'getans',
        paperid: this.paperid
      };
      this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.anslist = dataret.anslist;
        }
        else
        {
          this.prolist = '获取试题列表失败(1)';
        }
      },function(res){
        console.log(res.status);
        this.prolist = '获取试题列表失败(2)';
      });
    },
    judge_keguan:function(){
      // TODO: Send command to backend and refresh
      postdata = {
        action: 'judge_keguan',
        paperid: this.paperid
      };
      this.$http.post(backend_server + 'judge-keguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('客观题判定成功');
          location.reload();
        }
        else
        {
          alert('自动判定客观题失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('自动判定客观题失败(2)');
      });
    },
    clean_keguan:function(){
      // Send command to backend and refresh
      postdata = {
        action: 'clean_keguan',
        paperid: this.paperid
      };
      this.$http.post(backend_server + 'judge-keguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('客观题判定结果清除成功');
          location.reload();
        }
        else
        {
          alert('客观题判定结果清除失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('客观题判定结果清除失败(2)');
      });
    },
    judge_zhuguan:function(stuid, paperid){
      window.location.href = 'judge-zhuguan.html?paperid=' + paperid + '&stuid=' + stuid;
    },
    clean_zhuguan:function(){
      postdata = {
        action: 'clean_zhuguan',
        paperid: this.paperid
      };
      this.$http.post(backend_server + 'judge-zhuguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('主观题判定结果清除成功');
          location.reload();
        }
        else
        {
          alert('主观题判定结果清除失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('主观题判定结果清除失败(2)');
      });
    },
    start_zhuguan:function(){
      postdata = {
        action: 'nextid',
        paperid: this.paperid,
      };
      this.$http.post(backend_server + 'judge-zhuguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          window.location.href = "judge-zhuguan.html?paperid=" + this.paperid 
            + "&stuid=" + dataret.nextid;
        }
        else if (dataret.code == 201)
        {
          alert('所有学生均已有主观题分数');
          window.location.href = "paper-answers.html?paperid=" + this.paperid;
        }
        else
        {
          alert('获取下个学生失败(1)');
        }
      },function(res){
        console .log(res.status);
        alert('获取下个学生失败(2)');
      });
    },
    submit_grade:function(){
      postdata = {
        action: 'submit',
        paperid: this.paperid,
      };
      this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('成绩提交成功');
          location.reload();
        }
        else
        {
          alert('成绩提交失败(1)');
        }
      },function(res){
        console .log(res.status);
        alert('成绩提交失败(2)');
      });
    }
  },
  created:function(){
    this.paperid = getQueryString('paperid');
    this.get_paper_detail();
    this.get_student_answers();
  }
})
