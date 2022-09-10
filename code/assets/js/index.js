// 入口函数 等页面结构加载完成就执行里面的代码 不需要等待其他外部资源加载
$(function () {
    // 调用 getUserInfo() 获取用户信息
    getUserInfo()
    // 点击退出按钮实现退出功能 
    $('#outLogin').on('click', function () {
        // console.log(66)
        layer.confirm('呜呜&nbsp&nbsp确定退出登录?', { icon: 3, title: '友情提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = '../../../login.html'




            // 关闭退出登录
            layer.close(index);
        })
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 成功接收到数据后进行用户信息渲染
            renderAvatar(res.data)
        },
        // // 在发起请求后  无论是成功还是失败 都是执行 complete() 回调函数
        // complete: function (res) {
        //     console.log('执行了 complete函数')
        //     console.log(res)
        //   if(res.responseJSON.status===1 && res.responseJSON.message==='身份认证失败！') {
        //     localStorage.removeItem('token')
        //     location.href = '/login.html'
        //   }
        // }
    })
}
// 渲染用户信息
function renderAvatar(user) {
    // 如果有 nickname 就获取  否则 获取username
    var name = user.nickname || user.username
    // 渲染用户名
    $('#welcome').html(`欢迎&nbsp;&nbsp;` + name)
    // 渲染用户头像
    if (user.user_pic !== null) {
        // 字母头像隐藏
        $('.textavatar').hide()
        // 用户头像添加 src 属性 
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 将用户名的第一位字母大写
        var first = name[0].toUpperCase()
        // 字母头像显示
        $('.textavatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}