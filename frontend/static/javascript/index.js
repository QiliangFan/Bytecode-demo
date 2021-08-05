base_url_str = 'http://localhost:5000'

function getWindowHeight() {
    return $(window).height()
}

function getWindowWidth() {
    return $(window).width()
}

// 控制透明的div
function controlDivHover() {
    if (getWindowWidth() > 540) {
        var img = $('#img-hover')
        var div_height = img.height() - 56
        $('#div-hover').height(div_height)
        $('#div-hover').css('top', '56px')
    } else {
        var img = $('#img-hover')
        var div_height = img.height()
        $('#div-hover').height(div_height)
        $('#div-hover').css('top', '0px')
    }
}

// 控制标题
function controlTitle() {
    var div_title = $('#div-title')
    if (getWindowWidth() > 540) {
        div_title.css('top', '23%')
        div_title.css('font-size', '40px')

    } else {
        div_title.css('top', '30%')
        div_title.css('font-size', '30px')
    }


    var window_width = getWindowWidth()

    var left = (window_width - div_title.width()) / 2
    div_title.css('left', left)

}

// 控制背景的动画: 聚焦时放大
function controlImage() {
    $('#left-button').hover(function () {
        $('#img-hover').attr('style', 'transition: transform 1s;transform: scale(1.2);')
    }, function () {
        $('#img-hover').attr('style', 'transition: transform 1s;transform: scale(1);')

    })

    $('#right-button').hover(function () {
        $('#img-hover').attr('style', 'transition: transform 1s;transform: scale(1.2);')
    }, function () {
        $('#img-hover').attr('style', 'transition: transform 1s;transform: scale(1);')

    })
}

// 控制上面的navbar因为手机和电脑的显示效果不同
function controlNavbar() {
    if (getWindowWidth() <= 540) {
        $('#my-navbar').removeClass('fixed-top')
        $('#my-navbar').removeClass('navbar-dark')
        $('#my-navbar').addClass('navbar-light')
        $('#my-navbar').addClass('bg-light')
    } else {
        $('#my-navbar').addClass('fixed-top')
        $('#my-navbar').addClass('navbar-dark')
        $('#my-navbar').removeClass('navbar-light')
        $('#my-navbar').removeClass('bg-light')
    }
}

//首页顶栏的登录按钮响应事件
function loginModal() {
    $('#login-button').click(function () {
        // alert('login-button is clicked')
        $('#login-modal').modal('show')
    })
}

// 登录表单验证
function loginCheck() {
    $('#loginCheck').click(function (event) {
        var loginForm = document.getElementById("LoginForm")
        if (loginForm.checkValidity() == false) {
            event.preventDefault()
            event.stopPropagation()
            $(loginForm).addClass('was-validated')
        }
        else {
            var userIDLogin = $('#UserIDLogin').val()
            var passwordLogin = $('#PasswordLogin').val()
            login(userIDLogin, passwordLogin)
        }
    })
}
//调用后台登录函数:login
function login(id, password) {
    console.log(id, password)
    // 下面的两个监听是用于，之前如果提示密码错误，可以即时清除提示.
    $('#PasswordLogin').bind('input', function () {
        $('#passwordError').text('')
    })
    $('#StudentIDLogin').bind('input', function () {
        $('#passwordError').text('')
    })
    $.ajax(
        {
            type: 'post',
            url: base_url_str + '/login/',
            async: true,
            data: {
                'UserIDLogin': id,
                'PasswordLogin': password
            },
            success: function (data) {
                if (data['success'] == 1) {
                    $('#login-modal').modal('hide')
                    var username = data['user_name']
                    var usertype = data['user_type']
                    var str = '老师';
                    if (usertype === 'STUDENT')
                        str = '同学'
                    else if (usertype === 'ADMIN')
                        str = ''
                    alert('欢迎使用南航在线考试系统，' + username + str)
                    // window.location.reload()
                    if (usertype === 'STUDENT')
                        goto_student()
                    else if (usertype === 'TEACHER')
                        goto_teacher()
                    else if (usertype ==='ADMIN')
                        goto_admin()
                    else
                        window.location.href = 'https://www.baidu.com'

                }
                else if (data['success'] == 0) {
                    $('#passwordError').text('密码错误，请检查。')
                }
                else if (data['success'] == -1) {
                    $('#passwordError').text('学号/工号错误，请检查。')
                }
                else {
                    $('#passwordError').text('ID或者密码错误，请检查。')
                }

            }

        }
    )
}
//顶栏注册按钮
function registerModal() {
    $('#register-button').click(function () {
        alert('register-button is clicked')
        $('#register-modal').modal('show')
    })
}
//检查注册时输入的学号/工号是否已被注册
function checkUserIDRegister() {
    $('#UserIDRegister').bind('change', function () {
        $.ajax(
            {
                type: 'post',
                url: base_url_str + '/check_id/',
                async: true,
                data: {
                    user_id: $('#UserIDRegister').val()
                },
                success: function (data) {
                    if (data['has'] == 1) {
                        // alert('该学号/工号已被注册，请直接登录。')
                        $('#UserIDHas').text('该学号/工号已被注册，请直接登录。')
                        $('#registerCheck').addClass('disabled')
                    }
                    else {
                        $('#UserIDHas').text('该学号/工号未注册，请继续完善信息。')
                        $('#registerCheck').removeClass('disabled')
                    }
                }
            }
        )

    })
}

//注册表单验证
function registerCheck() {
    checkUserIDRegister()
    $('#registerCheck').click(function (event) {
        var registerForm = document.getElementById('registerForm')
        if (registerForm.checkValidity() == false) {
            event.preventDefault()
            event.stopPropagation()
            $(registerForm).addClass('was-validated')
        }
        else {
            register()
        }

    })
}

//注册操作，写数据库
function register() {
    var user_id = $('#UserIDRegister').val()
    var user_name = $('#username').val()
    var user_email = $('#EmailRegister').val()
    var password = $('#PasswordRegister').val()

    $.ajax({
        type: 'post',
        url: base_url_str + '/register/',
        async: true,
        data:{
          'user_id': user_id,
          'user_name': user_name,
          'user_email': user_email,
          'password': password
        },
        success: function (data) {
            if (data['success'] == 1)
            {
                $('#register-modal').modal('hide')
                alert('注册成功！')
            }
            else
            {
                alert('注册失败，请检查输入的账户信息！')
            }

        }
    })

}

// 注销按钮
function logout()
{
    $('#logout-button').click(function () {
        $.ajax({
            type: 'post',
            url: base_url_str + '/logout/',
            async: true,
            success: function (data) {
                if (data['success'] == 1)
                {
                    window.location.reload()
                }
                else {
                    alert('注销失败，请清除缓存后重新进入页面。')
                }
            }
        })
    })
}

// 跳转到教师页面
function goto_teacher()
{
    window.location.href = 'teacherIndex'
}

//跳转到学生页面
function goto_student()
{
    window.location.href = 'studentIndex'
}

// 跳转到管理员页面
function goto_admin()
{
    window.location.href = 'adminIndex'
}


function goto_about_more()
{
    window.location.href = 'https://github.com/NUAA-SoftwareEngineeringCourse/exam-online'
}

function goto_index(){
    window.location.href = base_url_str
}





$(document).ready(function () {
    controlDivHover()
    controlTitle()
    controlImage()
    controlNavbar()
    loginModal()
    loginCheck()
    registerModal()
    registerCheck()
    logout()
})

// 改变窗口大小监听
$(window).resize(function () {
    controlDivHover()
    controlTitle()
    controlDivHover()
    controlNavbar()
})