const Router = require('koa-router')
const path = require('path')

const { uploadFile } = require('./utils/upload')

let router = new Router()

router.get('/', async (ctx, next) => {
    console.log(ctx.url, 'router')
    ctx.body = 'hello koa'

    next()
})

// 转发请求
router.get('/relay', async (ctx, next) => {
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

    next()
})

// 上传文件请求处理
router.all('/common/upload?type=1', async (ctx, next) => {
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

    next()
})


module.exports = router
