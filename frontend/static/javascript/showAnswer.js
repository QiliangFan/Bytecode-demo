base_url_str = 'http://localhost:5000'
function return_studentIndex() {
    $('#ret-student-index-btn').click(function () {
        window.location.href = base_url_str + '/studentIndex/'
    })

}

$(document).ready(function () {
    return_studentIndex()
})