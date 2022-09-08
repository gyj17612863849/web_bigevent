// 在 每次 发送 GET POST Ajax 请求时 会先调用这个 
//  ajaxPrefilter 这个函数
// 在这个函数中 我们可以拿到自己给 AJAX 配置的 url 
$.ajaxPrefilter(function(options){
    // console.log(options.url)
    // 将获取过来的 url 属性 进行 根路径拼接 在赋值给url
    options.url = 'http://www.liulongbin.top:3007'+options.url
    console.log(options.url)
})