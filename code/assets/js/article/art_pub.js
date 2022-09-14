$(function () {
    var layer = layui.layer
    var form = layui.form


    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义获取文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败!')
                }
                // 渲染模板引擎
                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要使用 form.render()方法重新渲染
                form.render()
            }
        })

    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件
    $('#chooseBtn').on('click', function () {
        $('#coverFile').click()
    })

    // 定义发布文章的状态  默认是已发布
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        // 点击了存为草稿按钮 将已发布改为  草稿
        art_state = '草稿'
    })
    // 为文件选择框 绑定change事件
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择文件的数组
        var files = e.target.files
        // 进行判断 用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 将拿到的文件 转换成 URL 地址 格式
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    // 为form 表单绑定 submit 事件
    $('#form-pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 将 form 表单的数据存入 FormData()对象里
        var fd = new FormData($(this)[0])
        // 循环遍历 fd 数组 拿到里面 键 值
        // 向FormData对象里追加已发布状态
        fd.append('state', art_state)
        // fd.forEach(function (v, k) {
        //     console.log(k, v)

        // })
        // 将裁剪区域的文件追加到 FormData 对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
   
    })

    // 发起 发布文章的 ajax 请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意 : 发送 FormData 格式的数据时
            // 必须配置以下两个选项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                // 跳转到文章列表页面
                location.href = '/code/article/art_list.html'
            }
        })
    }
})