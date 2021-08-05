
var vm = new Vue({
  el:'#app',
  data:{
    paperid: '',
    stuid: '',
    paper: '',
    count: 0,
    anslist: '',
    answer_to_show: '',
    question_to_show: '',
    confirmed: 'no'
  },
  methods:{
    showpro:function(content){
      show_div();
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
          alert('获取试题列表失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('获取试题列表失败(2)');
      });
    },
    get_zhuguan_answers:function(){
      postdata = {
        action: 'getans',
        paperid: this.paperid,
        stuid: this.stuid
      };
      this.$http.post(backend_server + 'judge-zhuguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          templist = dataret.list;
          judge_data = dataret.judge;    
          // for each answer   
          for (var i=0; i<templist.length; i++)
          {
            if (dataret.has_judge == 1)
            {
              for (var j=0; j<judge_data.length; j++)
              {
                //console.log(judge_data[j]['id'] + "#" + templist[i]['id']);
                if (judge_data[j]['id'] == templist[i]['id'])
                {
                  templist[i]['score'] = judge_data[j]['grade'];
                  break;
                }
              }
            }
            else
            {
              templist[i]['score'] = 0;
            }
          }
          this.count = dataret.count;
          this.anslist = templist;
          this.confirmed = dataret.confirmed;
        }
        else
        {
          alert('获取主观题答案列表失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('获取主观题答案列表失败(2)');
      });
    },
    submit:function(action){
      detail = [];
      grade = 0;
      for (var i=0; i<this.anslist.length; i++)
      {
        obj = {
          "id": this.anslist[i].id,
          "grade": parseInt(this.anslist[i].score)
        };
        detail.push(obj);
        grade += parseInt(this.anslist[i].score)
      }
      console.log(grade);
      console.log(detail);
      postdata = {
        action: 'submit',
        paperid: this.paperid,
        stuid: this.stuid,
        detail: detail,
        score: grade
      };
      this.$http.post(backend_server + 'judge-zhuguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          alert('保存主观题评分成功');
          if (action == 'back')
          {
            window.history.back(-1);
          }
          else if (action == 'next')
          {
            this.get_nextid();
          }
        }
        else
        {
          alert('保存主观题评分失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('保存主观题评分失败(2)');
      });
    },
    get_nextid:function(){
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
        console.log(res.status);
        alert('获取下个学生失败(2)');
      });
    },
    this_zero:function(index){
      this.anslist[index]['score'] = 0;
    },
    this_full:function(index){
      this.anslist[index]['score'] = this.anslist[index]['point'];
    },
    show_pro:function(id){
      postdata = {
        action: 'getpro',
        paperid: this.paperid,
        proid: parseInt(id)
      };
      this.$http.post(backend_server + 'judge-zhuguan/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.question_to_show = dataret.problem;
          this.answer_to_show = dataret.right;
          show_div();
        }
        else
        {
          alert('获取题目失败(1)');
        }
      },function(res){
        console.log(res.status);
        alert('获取题目失败(2)');
      });
      console.log(this.paper)
    },
    back_to_list:function(){
      window.location.href = "paper-answers.html?paperid=" + this.paperid;
    }
  },
  created:function(){
    this.paperid = getQueryString('paperid');
    this.stuid = getQueryString('stuid');
    this.get_paper_detail();
    //this.get_student_answers();
    this.get_zhuguan_answers();
  }
})
