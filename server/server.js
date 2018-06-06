const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const request = require('koa-http-request');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Bill = require('./models/index').Bill;
const router = new Router();
const Pug = require('koa-pug');
const apiKey = process.env.PROPUBLICA_KEY;
const password = process.env.IBOULDER_PASS;

const app = new Koa();

app.use(cors());

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

    let response = await ctx.get('/congress/v1/115/both/bills/introduced.json', null, {
        'X-API-Key': apiKey
    });

    billList = response.results[0].bills;
    let index = 0;
    let offset = 0;

    let bills = [];

    while (bills.length < 20) {

        if (index >= billList.length) {
            index = 0;
            offset+=20;
            response = await ctx.get(`/congress/v1/115/both/bills/introduced.json?offset=${offset}`, null, {
                'X-API-Key': apiKey
            });
            billList = response.results[0].bills;
        }

        const check = await Bill.findOne({
            where: {slug: billList[index].bill_slug}
        });

        if (!check) {
            bills.push(billList[index]);
        }

        index++;
    }

    ctx.render('index', {
        name: 'Test',
        bills: bills,
        page: 0,
        next: 1
    })
});

router.get('/index/:page', async(ctx, next) =>{

    const page = parseInt(ctx.params.page);

    let response = await ctx.get('/congress/v1/115/both/bills/introduced.json', null, {
        'X-API-Key': apiKey
    });

    billList = response.results[0].bills;
    let index = 0;
    let offset = 0;

    let bills = [];

    while (bills.length < 20 + page*20) {

        if (index >= billList.length) {
            index = 0;
            offset+=20;
            response = await ctx.get(`/congress/v1/115/both/bills/introduced.json?offset=${offset}`, null, {
                'X-API-Key': apiKey
            });
            billList = response.results[0].bills;
        }

        const check = await Bill.findOne({
            where: {slug: billList[index].bill_slug}
        });

        if (!check) {
            bills.push(billList[index]);
        }

        index++;
    }

    bills = bills.slice(page*20, page*20+20);

    const prev = page-1;
    const nex = page+1;

    ctx.render('index', {
        name: 'Test',
        bills: bills,
        prev: prev,
        page: page,
        next: nex
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

router.get('/bills', async(ctx, next) => {
    const bills = await Bill.findAll({
        limit: 20,
        offset: 0,
        order: [['"updatedAt"', 'DESC']],
        where: {
            check: true
        }
    });

    ctx.body = {
        bills: bills
}
});

router.get('/bills/:page', async(ctx, next) => {

    const page = parseInt(ctx.params.page);

    const bills = await Bill.findAll({
        limit: 20,
        offset: page*20,
        order: [['"updatedAt"', 'DESC']],
        where: {
            check: true
        }
    });

    ctx.body = {
        bills: bills
    }

});

router.post('/submit', async(ctx, next) => {

    let auth = true;

    if (ctx.request.body) {
        if (ctx.request.body.password===password) {
            submissions = Object.keys(ctx.request.body);
            for (const [key, value] of Object.entries(ctx.request.body)) {

                if (key !== 'password') {

                    let check = true;
                    let clean = key;

                    if (key.endsWith('_remove')) {
                        clean = key.replace('_remove', '');
                        check = false;
                    }

                    const response = await ctx.get('/congress/v1/bills/search.json?query=' + clean, null, {
                        'X-API-Key': apiKey
                    });

                    const create = response.results[0].bills[0];

                    Bill.create({slug: create.bill_slug, title: create.number + ' ' + create.title, check: check}).then(bill => {
                        console.log(bill.get('slug'));
                    });
                }
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