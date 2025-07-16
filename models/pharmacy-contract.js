const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class PharmacyContract {
  constructor(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR) {
    this.PHANAME = PHANAME;
    this.PHA_ADDRESS = PHA_ADDRESS;
    this.PHARMA_COMPANY = PHARMA_COMPANY;
    this.START_DATE = new Date(START_DATE);
    this.END_DATE = new Date(END_DATE);
    this.CONTENT = CONTENT;
    this.SUPERVISOR = SUPERVISOR;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_pharmacy_contract(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY, :START_DATE, :END_DATE, :CONTENT, :SUPERVISOR); END;`,
      {
        PHANAME: this.PHANAME,
        PHA_ADDRESS: this.PHA_ADDRESS,
        PHARMA_COMPANY: this.PHARMA_COMPANY,
        START_DATE: this.START_DATE,
        END_DATE: this.END_DATE,
        CONTENT: this.CONTENT,
        SUPERVISOR: this.SUPERVISOR
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
        const result = await connection.execute(`SELECT * FROM pharmacy_contract order by PHANAME, PHA_ADDRESS, PHARMA_COMPANY`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async fetchByDetails(pharmacy_name, pharmacy_address, pharmaceutical_company_name) {
    const connection = await getConnection();
    try {
        const result = await connection.execute(`
          SELECT *
          FROM PHARMACY_CONTRACT
          WHERE phaname = :pharmacy_name and pha_address = :pharmacy_address and pharma_company = :pharmaceutical_company_name
          `,
        {
          pharmacy_name,
          pharmacy_address,
          pharmaceutical_company_name
        });
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  
  static async deletePharmacyContract(PHANAME, PHA_ADDRESS, PHARMA_COMPANY) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_pharmacy_contract(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY); END;`,
        {
          PHANAME,
          PHA_ADDRESS,
          PHARMA_COMPANY
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
      console.error("Error deleting pharmacy contract:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
  static async updatePharmacyContract(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, START_DATE, END_DATE, CONTENT, SUPERVISOR) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_pharmacy_contract(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY, :START_DATE, :END_DATE, :CONTENT, :SUPERVISOR); END;`,
        {
          PHANAME,
          PHA_ADDRESS,
          PHARMA_COMPANY,
          START_DATE,
          END_DATE,
          CONTENT,
          SUPERVISOR
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
      console.error("Error updating pharmacy contract:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
};
