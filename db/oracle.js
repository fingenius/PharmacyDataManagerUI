require('dotenv').config();
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: 'C:\\app\\shant\\product\\instantclient-basic-windows.x64-23.8.0.25.04\\instantclient_23_8' });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function initPool() {
  await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1
  });
  console.log("Oracle connection pool created");
}

async function getConnection() {
  return await oracledb.getConnection();
}

module.exports = {initPool, getConnection };
