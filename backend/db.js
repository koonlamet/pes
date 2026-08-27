const knex = require('knex');

const db = knex({
    client:'mysql2',
    connection:{
        host:'mysql_db',
        port:3306,
        user:'root',
        password:'root1234',
        database:'db',
    },
    pool:{min:2 ,max:10}
})

module.exports = db