const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // seu usuário do PostgreSQL
  host: 'localhost',
  database: 'DB',         // nome do banco que você criou
  password: '32322872',  // senha definida na instalação
  port: 5432,             // porta padrão
});

module.exports = pool;
