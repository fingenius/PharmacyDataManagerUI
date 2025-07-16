const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class PharmacyContract {
  constructor(PHANAME, PHA_ADDRESS, PHARMA_COMPANY,DRUG_NAME, PRICE) {
    this.PHANAME = PHANAME;
    this.PHA_ADDRESS = PHA_ADDRESS;
    this.PHARMA_COMPANY = PHARMA_COMPANY;
    this.DRUG_NAME = DRUG_NAME;
    this.PRICE = PRICE;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_pharmacy_drug(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY, :DRUG_NAME, :PRICE); END;`,
      {
        PHANAME: this.PHANAME,
        PHA_ADDRESS: this.PHA_ADDRESS,
        PHARMA_COMPANY: this.PHARMA_COMPANY,
        DRUG_NAME: this.DRUG_NAME,
        PRICE: this.PRICE
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
        const result = await connection.execute(`SELECT * FROM pharmacy_drugs order by PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async deletePharmacyDrug(PHANAME, PHA_ADDRESS, PHARMA_COMPANY, DRUG_NAME) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_pharmacy_drug(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY, :DRUG_NAME); END;`,
        {
          PHANAME,
          PHA_ADDRESS,
          PHARMA_COMPANY,
          DRUG_NAME
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
      console.error("Error deleting pharmacy drug:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
  static async updatePharmacyDrug(PHANAME, PHA_ADDRESS, PHARMA_COMPANY,DRUG_NAME, PRICE) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_pharmacy_drug(:PHANAME, :PHA_ADDRESS, :PHARMA_COMPANY, :DRUG_NAME, :PRICE); END;`,
        {
          PHANAME,
          PHA_ADDRESS,
          PHARMA_COMPANY,
          DRUG_NAME,
          PRICE
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
      console.error("Error updating pharmacy drug:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
};
