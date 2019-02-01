const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const http2 = require('http2')

// const { uploadFile } = require('./utils/upload')

const axios = require('axios')
const _http = axios.create({
    timeout: 5000,
})


const app = new Koa()

app.use(async(ctx, next) => {
    // console.log('set headers')
    // ctx.set('Transfer-Encoding', 'chunked')
    // ctx.set('Access-Control-Allow-Origin', '*')

    // ctx.set('cache-control', 'max-age=600')
    // ctx.set('vary', 'Accept-Encoding')
    // ctx.set('via', '1.1 varnish')
    console.log('app')

    if(ctx.method === 'OPTIONS') {
        ctx.status = 200;
        return
    } else if (ctx.response.status === 404) {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
        return
    }

    next()
})


// router
const router = require('./router')
app.use(router.routes()).use(router.allowedMethods())


// 静态资源目录对于相对入口文件index.js的路径
const static = require('koa-static')
app.use(static(
    path.join( __dirname,  './static')
))



app.use( async ( ctx ) => {
    ctx.body = 'hello koa2'
})


// http1 服务
app.listen(8090)



// http2 服务
const options = {
    key: fs.readFileSync(__dirname + '/certificate/server.key'),
    cert:  fs.readFileSync(__dirname + '/certificate/server.crt')
}
http2.createSecureServer(options, app.callback()).listen(8091)

console.log('http://localhost:8090', 'https://localhost:8091')
