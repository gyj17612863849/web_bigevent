$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化事件的过滤器
    template.defaults.imports.datazero = function (data) {
        const dt = new Date(data)
        const y = zero(dt.getFullYear())
        const m = zero(dt.getMonth() + 1)
        const d = zero(dt.getDay())

        const hh = zero(dt.getHours())
        const mm = zero(dt.getMinutes())
        const ss = zero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function zero(n) {
        n < 10 ? n + '0' : n
    }
    // 定义一个查询参数的变量  将来要发送给服务器的请求数据
    var q = {
        pagenum: 1, //页面值 默认是第一页
        pagesize: 2, //每页显示多少条数据 默认是2条
        cate_id: '', //文章分类的 Id
        state: ''  // 文章的状态
    }
    initTable()
    initTextSelect()
    initEditor()
    // 初始化富文本编辑器
    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败!')
                // console.log(res)
                // 进行模板引擎数据渲染
                var htmlStr = template('list', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类下拉菜单的方法
    function initTextSelect() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章类别失败!')
                var htmlStr = template('cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })

    }
    // 为筛选表单 绑定 submit 提交事件
    $('#form-sx').on('submit', function (e) {
        e.preventDefault()
        // 获取分类选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 将获取过来的值赋值给 q 对象
        q.cate_id = cate_id
        q.state = state
        // 重新渲染
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum,  //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {  //jump 分页回调
                // 把最新的页码 值赋值给q
                q.pagenum = obj.curr  // 得到当前页
                // 把最新的条目数 ,赋值给q 的查询对象
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })

    }
    // 删除 文字绑定点击事件
    $('tbody').on('click', '#btn-remove', function () {
        // 获取删除按钮的总数
        var len = $('#btn-remove').length
        // 获取当前删除按钮对应的自义定 id值
        var id = $(this).attr('data-id')
        // 发起 ajax 请求
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章失败!')
                    layer.msg('删除文章成功!')
                    // bug 如果点击删除了所有数据则不会得到当前页码的数据 而是空白  原因是因为点击删除最后一个时 页面值还是处于被删除页码值,如果这时重新渲染页面 则请求回来的当前页码的值就为空
                    // 解决方案:
                    // 1. 先获取当前页面删除按钮的总数 
                    // 2. 进行判断 当点击删除按钮时 如果length 长度等于1 则表示删除完后页面为空
                    if (len === 1) {
                        //注意: 页码值最小要为 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 3. 对页面值减一
                    // 4. 再调用initTable()方法

                    initTable()
                }
            })

            layer.close(index);
        })
    })

    // 为编辑按钮绑定点击事件
    $('tbody').on('click', '#btn-bj2', function () {
        layer.open({
            type: 1,
            title: ['文章编辑', 'font-size:18px;'],
            area: ['100%', '100%'],
            content: $('#tcc-bj').html() //这里content是一个普通的String
        });

    })
   

})