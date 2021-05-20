const sql = require('mssql');

const { databaseConfig } = require('./keys');

const poolPromise = new sql.ConnectionPool(databaseConfig)
   .connect()
   .then(pool => {
      console.log('Connected to MSSQL')
      return pool;
   })
   .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
   poolPromise, sql
};

