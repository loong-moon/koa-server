const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const static = require('koa-static')

const axios = require('axios')
const http = require('http')

const { uploadFile } = require('./utils/upload')


const app = new Koa()

const _http = axios.create({
    timeout: 5000,
})

app.use(async(ctx, next) => {
    // console.log('set headers')
    await next()
    ctx.set('Transfer-Encoding', 'chunked')
    ctx.set('Access-Control-Allow-Origin', '*')

    if ( ctx.url === '/' && ctx.method === 'GET' ) {

        ctx.body = 'hello koa'

    } else if ( ctx.url === '/common/upload?type=1' ) {
        // 上传文件请求处理
        console.log(ctx.method)
        if(ctx.method === 'OPTIONS'){
            ctx.status = 200;
            return
        }

        let result = { success: false }
        let serverFilePath = path.join( __dirname, 'upload-files' )

        // 上传文件事件
        result = await uploadFile( ctx, {
            fileType: 'album', // common or album
            path: serverFilePath
        })

        ctx.body = result

    } else if ( ctx.url === '/relay' ) { //转发
        // 上传文件请求处理
        // console.log(ctx.method)

        let log = await _http.get('http://192.168.200.70:8080/info')
            .then((response) => {
                let resData = response.data
                // console.log(resData)
                return resData

            })
            .catch((error) => {
                console.log(error)
            });

        ctx.status = 200;
        ctx.body = log


    } else {
        console.log(ctx.url)
        // 其他请求显示404
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }
    // ctx.set('cache-control', 'max-age=600')
    // ctx.set('vary', 'Accept-Encoding')
    // ctx.set('via', '1.1 varnish')
})


// 静态资源目录对于相对入口文件index.js的路径
app.use(static(
    path.join( __dirname,  './static')
))



// app.use( async ( ctx ) => {
//     ctx.body = 'hello koa2'
// })

app.listen(8090)
console.log('http://localhost:8090')
