// 入口函数
$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()

    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()

    })
})
// 从 layui 中 获取 form 对象
var form = layui.form
var layer = layui.layer
// 通过 form.verify() 这个函数定义规则
form.verify({
    psd: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格'
    ],
    // 检查两次密码是否一致
    repsd: function (value) {
        // 首先获取确认密码的内容
        // 在获取输入密码的内容
        // 进行不等于判断
        // 如果不相等 return 提示用户
        // [] 属性选择器
        var pwd = $('.reg-box [name=password]').val()
        if (pwd !== value) return '两次密码不一致'

    }
})
// 监听注册表单的提交事件
$('#form-reg').on('submit', function (e) {
    // 阻止默认表单提交行为
    e.preventDefault()
    const data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }

    $.post('/api/reguser', data, (res) => {
        // 如果注册失败提示用户
        if (res.status !== 0) return layer.msg(res.message, { icon: 6 });
        layer.msg('注册成功', { icon: 6 })
        // 注册成功  模拟用户点击去登录
        $('#link_login').click()
    })
})
// 监听登录表单的提交事件
$('#form-login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/api/login',
        // 快速获取表单所有数据  必须有 name 属性 才可以获取
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message, { icon: 5 })
            layer.msg(res.message, { icon: 6 })
            // 将登录成功后 服务器返还给我们的 token 字符串存储在本地 方便下次访问有权限的网页时 不用在此身份认证
            localStorage.setItem('token', res.token) //setitem() 方法是用来 设置数据存储地址的
            // 跳转到主页
            location.href = '../../../index.html'
            console.log('测试远程仓库')
        }
    })
})
