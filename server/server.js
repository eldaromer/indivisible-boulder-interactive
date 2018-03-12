const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const request = require('koa-http-request');
const router = new Router();
const Pug = require('koa-pug');


const app = new Koa();

const pug = new Pug({
    viewPath: './server/views',
    baseDir: './server/views',
    app: app
});

app.use(request({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: 'https://api.propublica.org'
}));

router.get('/index', async(ctx, next) => {

    //const response = await ctx.get()

    ctx.render('index', {
        name: 'Test'
    })
});

router.get('/bill/:slug', async(ctx, next) => {
    console.log(ctx.params.slug);

    const response = await ctx.get('/congress/v1/bills/search.json?query='+ctx.params.slug, null, {
        'X-API-Key': 'NNmNjh1IsJT4QUZLwJYiKdBf7Kc0pEL00tjVAlRB'
    });

    ctx.body = {
        response: response
    };
});

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Running on port: ', 3000);
});