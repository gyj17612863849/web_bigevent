$(function () {
    var layer = layui.layer
    var form = layui.form
    artcateList()
    // 获取文章分类的列表
    function artcateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                var htmlStr = template('tp', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var htmladd = null
    // 为添加类别绑定点击事件
    $('#addbtn').on('click', function () {
        var htmladd = layer.open({
            title: ['添加文章分类', 'font-size:18px'],
            type: 1,
            area: ['500px', '300px'],
            anim: 5,
            content: $('#addhtml').html() //这里content是一个普通的String
        });
    })
    // 为添加类别表单添加submit 提交事件  
    $('body').on('submit', '#addtext', function (e) {
        e.preventDefault()
        // console.log('1')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) return layer.msg('发布失败!'),
                    artcateList()
                layer.msg('发布成功')
                layer.close(htmladd)
            }
        })
    })
    var html_bj = null
    // 为编辑按钮绑定click 事件
    $('body').on('click', '#data-bj', function () {
        // console.log('1');
        var html_bj = layer.open({
            title: ['编辑文章分类', 'font-size:18px'],
            type: 1,
            area: ['500px', '300px'],
            anim: 5,
            content: $('#bj').html() //这里content是一个普通的String
        });
        var id = $(this).attr('data-id')
        // console.log(id)
        // 发起ajax请求获取对应Id 的 值
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                form.val("formTest", res.data)
            }

        })
    })
    // 为编辑表单绑定 submit 提交事件
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起 表单提交事件
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data:$(this).serialize(),
            success: function (res) {
                // console.log(res)
                if(res.status!==0) return layer.msg('修改信息失败!') 
                artcateList()
                layer.msg('修改信息成功!')
                // 成功后关闭弹出层
                layer.close(html_bj)

            }


        })
    })
    // 为删除按钮绑定点击事件
    $('body').on('click','#sc_btn',function(){
        // console.log('ok')
        var id = $(this).attr('data-id')
        // console.log(id)
        // 弹出询问框 是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res) {
                    console.log(res)
                    if(res.status!==0) return layer.msg('删除失败!')
                    artcateList()
                    layer.msg('删除成功!')
                    layer.close(index)
                }
            })
            
          
          });
    })

})