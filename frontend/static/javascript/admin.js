function deleteU(uid) {

    $.ajax({
        type: 'post',
        url: '/deleteUser',
        async: true,
        data: {
            'user_id': uid,
        },
        success: function (data) {
            alert("删除成功!")
            window.location.reload()
        }
    })
}

function deleteE(eid) {
    alert("试卷即将删除")
    $.ajax({
        type: 'post',
        url: '/deleteExam',
        async: true,
        data: {
            'exam_id': eid,
        },
        success: function (data) {
            alert("删除成功!")
            window.location.reload()
        }
    })
}


function deleteQ(qid, qtype) {
    alert("试题即将删除")
    $.ajax({
        type: 'post',
        url: '/deleteQuestion',
        async: true,
        data: {
            'q_id': qid,
            'q_type': qtype,
        },
        success: function (data) {
            alert("删除成功!")
            window.location.reload()
        }
    })
}

function choiceModal() {
    $('#choice-modal').modal('show')
}

function judgeModal() {
    $('#judge-modal').modal('show')
}

function subjectiveModal() {
    $('#subjective-modal').modal('show')
}


function add_xuanze() {
    var desc = $('#choice_q').val()
    var value = $('#choice_value').val()
    var answer = $('#choice_ans').val()
    var diff = $('#choice_diff').val()
    var q_A = $('#q_A').val()
    var q_B = $('#q_B').val()
    var q_C = $('#q_C').val()
    var q_D = $('#q_D').val()
    var q_class = $('#choice_class').val()

    $.ajax({
        type: 'post',
        url: '/admin_addchoice',
        async: true,
        data: {
            'q_desc': desc,
            'q_answer': answer,
            'q_value': value,
            'q_diff': diff,
            'q_A': q_A,
            'q_B': q_B,
            'q_C': q_C,
            'q_D': q_D,
            'q_class': q_class
        },
        success: function (data) {
            alert("添加成功!")
            window.location.reload()
        }
    })
}

function add_judge() {
    var desc = $('#judge_q').val()
    var value = $('#judge_value').val()
    var answer = $('#judge_ans').val()
    var diff = $('#judge_diff').val()
    var q_class = $('#judge_class').val()
    $.ajax({
        type: 'post',
        url: '/add_A_question',
        async: true,
        data: {
            'q_type': 2,
            'q_desc': desc,
            'q_answer': answer,
            'q_value': value,
            'q_diff': diff,
            'q_class': q_class
        },
        success: function (data) {
            alert("添加成功!")
            window.location.reload()
        }
    })
}

function add_subj() {
    var desc = $('#subj_q').val()
    var value = $('#subj_value').val()
    var answer = $('#subj_ans').val()
    var diff = $('#subj_diff').val()
    var q_class = $('#subj_class').val()
    $.ajax({
        type: 'post',
        url: '/add_A_question',
        async: true,
        data: {
            'q_type': 3,
            'q_desc': desc,
            'q_answer': answer,
            'q_value': value,
            'q_diff': diff,
            'q_class': q_class
        },
        success: function (data) {
            alert("添加成功!")
            window.location.reload()
        }
    })
}


function showQ(qid) {
    var cname = '#choice-modal-' + qid
    var desc = '#choice_q_' + qid
    var qvalue = '#choice_value_' + qid
    var ans = '#choice_ans_' + qid
    var q_A = '#q_A_' + qid
    var q_B = '#q_B_' + qid
    var q_C = '#q_C_' + qid
    var q_D = '#q_D_' + qid
    var diff = '#choice_diff_' + qid
    var type = '#choice_type_' + qid

    var f1 = "#td_desc_" + qid
    $(desc).val($(f1).text());
    var f2 = "#td_value_" + qid
    $(qvalue).val($(f2).text());
    var f3 = "#td_ans_" + qid
    $(ans).val($(f3).text());
    var f4 = "#td_A_" + qid
    $(q_A).val($(f4).text());
    var f5 = "#td_B_" + qid
    $(q_B).val($(f5).text());
    var f6 = "#td_C_" + qid
    $(q_C).val($(f6).text());
    var f7 = "#td_D_" + qid
    $(q_D).val($(f7).text());
    var f8 = "#td_diff_" + qid
    $(diff).val($(f8).text());
    var f9 = "#td_type_" + qid
    $(type).val($(f9).text());
    $(cname).modal('show')
}

function modify_choice(qid) {
    var desc = '#choice_q_' + qid
    desc = $(desc).val()
    var qvalue = '#choice_value_' + qid
    qvalue = $(qvalue).val()
    var answer = '#choice_ans_' + qid
    answer = $(answer).val()
    var q_A = '#q_A_' + qid
    q_A = $(q_A).val()
    var q_B = '#q_B_' + qid
    q_B = $(q_B).val()
    var q_C = '#q_C_' + qid
    q_C = $(q_C).val()
    var q_D = '#q_D_' + qid
    q_D = $(q_D).val()
    var diff = '#choice_diff_' + qid
    diff = $(diff).val()
    var type = '#choice_type_' + qid
    type = $(type).val()
    $.ajax({
        type: 'post',
        url: '/modify_choice',
        async: true,
        data: {
            'q_id': qid,
            'q_desc': desc,
            'q_answer': answer,
            'q_value': qvalue,
            'q_diff': diff,
            'q_type': type,
            'q_A': q_A,
            'q_B': q_B,
            'q_C': q_C,
            'q_D': q_D,
        },
        success: function (data) {
            alert("修改成功！")
            window.location.reload()
        }
    })
}
