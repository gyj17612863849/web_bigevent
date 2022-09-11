$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value > 6) {
                return '昵称长度必须在1~~6位字符'
            }
        }
    })
    initUserInfo()
    //   初始化用户信息
    function initUserInfo() {
        $.ajax({
            method:"GET",
            url:'/my/userinfo',
            success : function(res) {
               if(res.status!==0) {
                return layer.msg('获取用户信息失败!')
               }
            //    console.log(res)
            form.val('formuserinfo',res.data)
            }
        })
    }
    // 重置按钮
    $('#btnreset').on('click',function(e){
        // 阻止表单默认重置行为
        e.preventDefault()
        // 重新调用获取初始化用户信息函数
        initUserInfo()
    })
    // 提交用户信息按钮
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            // 快速获取表单内容
            data:$(this).serialize(),
            success: function(res) {
                if(res.status!==0) {
                    return layer.msg('更新用户数据失败!!!')
                }
                layer.msg('更新用户信息成功!!!')
                // 因为此表单在 iframe 标签打开 此标签也是属于html框架的一种 window代表当前表单的html 
                window.parent.getUserInfo()
            }
        })
    })
})