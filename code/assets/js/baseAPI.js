// 在 每次 发送 GET POST Ajax 请求时 会先调用这个 
//  ajaxPrefilter 这个函数
// 在这个函数中 我们可以拿到自己给 AJAX 配置的 url 
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    // 将获取过来的 url 属性 进行 根路径拼接 在赋值给url
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
    // 给需要访问权限的接口 统一 添加 header  Authorization 请求头
    // indexOf() 寻找元素首次出现的位置  找不到返回-1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization:localStorage.getItem('token'||'')
        }
    }
    // 统一给 complete 函数 执行代码
    // 在发起请求后  无论是成功还是失败 都是执行 complete() 回调函数
    options.complete= function (res) {
        // console.log('执行了 complete函数')
        // console.log(res)
      if(res.responseJSON.status===1 && res.responseJSON.message==='身份认证失败！') {
        localStorage.removeItem('token')
        location.href = '/login.html'
      }
    }
})