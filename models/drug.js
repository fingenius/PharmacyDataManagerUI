const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class Drug {
  constructor(PHCOMPANY, TRADE_NAME, FORMULA) {
    this.PHCOMPANY = PHCOMPANY;
    this.TRADE_NAME = TRADE_NAME;
    this.FORMULA = FORMULA;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_drug(:PHCOMPANY, :TRADE_NAME, :FORMULA); END;`,
      {
        PHCOMPANY: this.PHCOMPANY,
        TRADE_NAME: this.TRADE_NAME,
        FORMULA: this.FORMULA
      },
      { autoCommit: true }
    );

    //   Capture DBMS_OUTPUT
    const output = [];
    while (true) {
      const result = await connection.execute(
        `BEGIN DBMS_OUTPUT.GET_LINE(:line, :status); END;`,
        {
          line: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      if (result.outBinds.status !== 0) break;
      output.push(result.outBinds.line);
    }

    return output.join('\n');

  } catch (err) {
    console.error("PL/SQL procedure failed:", err);
    throw err;
  } finally {
    await connection.close();
  }
}
  static async fetchAll() {
    const connection = await getConnection();
    try {
        const result = await connection.execute(`SELECT * FROM drug order by PHCOMPANY, TRADE_NAME`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }

  static async fetchByCompany(PHARMACEUTICAL_COMPANY_NAME) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT * FROM DRUG WHERE PHCOMPANY = :company`,
        { company: PHARMACEUTICAL_COMPANY_NAME }
      );
      return result.rows; 
    } finally {
      await connection.close();
    }
  }

  static async deleteByCompanyTrade(PHCOMPANY, TRADE_NAME) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_drug(:PHCOMPANY, :TRADE_NAME); END;`,
        {
          PHCOMPANY,
          TRADE_NAME
        },
        { autoCommit: true }
      );
      const output = [];
    while (true) {
      const result = await connection.execute(
        `BEGIN DBMS_OUTPUT.GET_LINE(:line, :status); END;`,
        {
          line: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      if (result.outBinds.status !== 0) break;
      output.push(result.outBinds.line);
    }

    return output.join('\n');
    } catch (err) {
      console.error("Error deleting pharmacy:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
  static async updateByCompanyTrade(PHCOMPANY, TRADE_NAME, FORMULA) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_drug(:PHCOMPANY, :TRADE_NAME, :FORMULA); END;`,
        {
          PHCOMPANY,
          TRADE_NAME,
          FORMULA
        },
        { autoCommit: true }
      );
      const output = [];
      while (true) {
        const result = await connection.execute(
          `BEGIN DBMS_OUTPUT.GET_LINE(:line, :status); END;`,
          {
            line: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
            status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
          }
        );
        if (result.outBinds.status !== 0) break;
        output.push(result.outBinds.line);
      }
      return output.join('\n');
    } catch (err) {
      console.error("Error updating pharmacy:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
};
