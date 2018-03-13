const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const request = require('koa-http-request');
const bodyParser = require('koa-bodyparser');
const Bill = require('./models/index').Bill;
const router = new Router();
const Pug = require('koa-pug');
const apiKey = process.env.PROPUBLICA_KEY;
const password = process.env.IBOULDER_PASS;

const app = new Koa();

const pug = new Pug({
    viewPath: './server/views',
    baseDir: './server/views',
    app: app
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err.message);
    }
});

app.use(request({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: 'https://api.propublica.org'
}));

router.get('/index', async(ctx, next) => {

    const response = await ctx.get('/congress/v1/115/both/bills/introduced.json', null, {
        'X-API-Key': apiKey
    });

    let bills = [];

    for (let bill of response.results[0].bills) {

        const check = await Bill.findOne({
            where: {slug: bill.bill_slug}
        });

        if (!check) {
            bills.push(bill);
        }
    }

    ctx.render('index', {
        name: 'Test',
        bills: bills
    })
});

router.get('/bill/:slug', async(ctx, next) => {

    const response = await ctx.get('/congress/v1/bills/search.json?query='+ctx.params.slug, null, {
        'X-API-Key': apiKey
    });

    ctx.body = {
        response: response
    };
});

router.post('/submit', async(ctx, next) => {

    let auth = true;

    if (ctx.request.body) {
        if (ctx.request.body.password===password) {
            submissions = Object.keys(ctx.request.body);
            for (let slug of submissions) {
                const response = await ctx.get('/congress/v1/bills/search.json?query=' + slug, null, {
                    'X-API-Key': apiKey
                });

                const create = response.results[0].bills[0];

                Bill.create({slug: create.bill_slug, title: create.number + ' ' + create.title}).then(bill => {
                    console.log(bill.get('slug'));
                })
            }
        } else {
            auth=false;
        }
    }

    ctx.redirect('/index');

    if (!auth) {
        ctx.redirect('/unauthorized');
    }

});

router.get('/unauthorized', async(ctx, next) => {
    ctx.render('unauthorized');
});

router.get('*', async(ctx, next) => {
    ctx.redirect('/index');
});

router.get('/', async(ctx, next) => {
    ctx.redirect('index');
});

app.use(bodyParser());
app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Running on port: ', 3000);
}).setTimeout(10000);