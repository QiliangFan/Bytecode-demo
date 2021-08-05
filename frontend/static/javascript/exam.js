base_url_str = 'http://localhost:5000'

// 提交试卷提示框
function submit() {
    $('#submit').click(function () {
        if (check_finished() == true)
            $('#submit_modal').modal('show')
    })
}


// 放弃考试提示框
function giveup() {
    $('#give_up').click(function () {
        $('#giveup_modal').modal('show')
    })
}

function giveupbutton() {
    $('#giveup_button').click(function () {
        window.location.href = base_url_str
    })
}


// 获取选择的答案
function submit_paper() {
    var answers = {}
    var exam_id = document.getElementById('exam-id-span').innerText
    $("#submit_paper").click(function () {
        $('input[type=radio]:checked').each(function () {
            answers[$(this).attr('name')] = $(this).val()
        })
        $('input[type=checkbox]:checked').each(function () {
            var name = $(this).attr('name')
            if (answers[name]) {
                answers[name] = answers[name] + $(this).val()
            } else {
                answers[name] = $(this).val()
            }
        })
        // alert('hello')
        var textarea_array = document.getElementsByClassName('textarea');
        for (var i=0; i<textarea_array.length; i++)
        {
            var name = textarea_array[i].getAttribute('name');
            var content = textarea_array[i].value;
            answers[name] = content;
            // alert(name + content);
        }
        // $('textarea[type=textarea]').each(function () {
        //     answers[$(this).attr('name')] = $(this).val()
        // })
        $.ajax({
            url: base_url_str + '/submit_paper/',
            type: 'post',
            async: false,
            data: {
                'answers': JSON.stringify(answers),
                'exam_id': exam_id,
            },
            success: function (data) {
                console.log(data)
                window.location.href = base_url_str + '/student_history/'
            }
        })
    })
}

$(document).ready(function () {
    submit()
    giveup()
    giveupbutton()
    submit_paper()
})