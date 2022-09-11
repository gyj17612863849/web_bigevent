$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function (value) {
            if (value === $('[name=oldpwd]').val()) {
                return '新旧密码不能相同!'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newpwd]').val()) {
                return '两次密码不一致!'
            }
        }





    })
    // 提交更新密码表单
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res)
               if(res.status!==0) return layer.msg('更新密码失败')
               layer.msg('更新密码成功')
            }
        })
    })
})