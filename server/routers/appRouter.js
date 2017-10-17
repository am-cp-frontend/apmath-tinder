const Router = require('koa-router')
const send = require('koa-send')
const appRouter = new Router() 

const config = require('../config')
const mentorGet = require('../func/mentor/mentorGet')
const mentorQuery = require('../func/mentor/mentorQuery')
const mentorUpdate = require('../func/mentor/mentorUpdate')

const magicLinkGet = require('../func/magicLink/magicLinkGet')

appRouter
    //wouldn't bother with security right now
    .get('/auth/:token', async (ctx, next) => {
        config.logger.log('auth attemot with', ctx.params.token)

        const tokenResult = await magicLinkGet(ctx.params.token)
        const user = {}
        let authError = false


        if(tokenResult.ok) {
            ctx.session.token = ctx.params.token
            user.type = tokenResult.data.type
            user.id = tokenResult.data.targetId
        } else {
            authError = tokenResult.data
        }
 
        ctx.cookies.set('user', JSON.stringify(user), {httpOnly:false, overwrite: true})
        ctx.cookies.set('authError', authError, {httpOnly:false, overwrite: true})

        await next()
    })
    .get('/data/mentors', async (ctx, next) => {
        const result = await mentorQuery()
        ctx.responceType = 'json'

        if(result.ok) ctx.body = result.data
        else ctx.body = {error: result.data}
 
    })
    .get('/data/mentor/:id', async (ctx, next) => {
        const result = await mentorGet(ctx.params.id)
        ctx.responceType = 'json'

        if(result.ok) ctx.body = result.data
        else ctx.body = {error: result.data}
    })
    .post('/update/mentor/:id', async (ctx, next) => {
        //verification
        if(ctx.session.token) {
            const tokenResult = await magicLinkGet(ctx.session.token)
            
            if(tokenResult.ok && tokenResult.data.type === 'mentor' 
               && tokenResult.data.targetId.toString() === ctx.params.id) {
                //update
                const result = await mentorUpdate(ctx.params.id, ctx.request.body)
                ctx.responceType = 'html'
                
                ctx.body = result
            } else {
                ctx.body = {
                    ok: false,
                    data: {
                        type: 401,
                        error: 'No rights'
                    }
                }
            }
        } else {
            ctx.body = {
                ok: false,
                data: {
                    type: 401,
                    error: 'No login'
                }
            }
        }
    })
    .get('/*', async (ctx, next) => {
        await send(ctx, config.path.dist + '/index.html', { root: '/' })
    })

module.exports = appRouter