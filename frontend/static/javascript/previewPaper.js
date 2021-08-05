base_url_str = 'http://localhost:5000'
function return_teacherIndex() {
    $('#ret-teacher-index-btn').click(function () {
        window.location.href = base_url_str + '/teacherIndex'
    })

}

$(document).ready(function () {
    return_teacherIndex()
})