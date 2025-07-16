const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class Prescription {
  constructor(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY) {
    this.DOCTOR = DOCTOR;
    this.PATIENT = PATIENT;
    this.PHARMA_COMPANY = PHARMA_COMPANY;
    this.DRUG_NAME = DRUG_NAME;
    this.PRESCRIPTION_DATE = new Date(PRESCRIPTION_DATE);
    this.QUANTITY = QUANTITY;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_prescription(:DOCTOR, :PATIENT, :PHARMA_COMPANY, :DRUG_NAME, :PRESCRIPTION_DATE, :QUANTITY); END;`,
      {
        DOCTOR: this.DOCTOR,
        PATIENT: this.PATIENT,
        PHARMA_COMPANY: this.PHARMA_COMPANY,
        DRUG_NAME: this.DRUG_NAME,
        PRESCRIPTION_DATE: this.PRESCRIPTION_DATE,
        QUANTITY: this.QUANTITY
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
        const result = await connection.execute(`SELECT * FROM prescription order by DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async deletePrescription(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_prescription(:DOCTOR, :PATIENT, :PHARMA_COMPANY, :DRUG_NAME); END;`,
        {
          DOCTOR,
          PATIENT,
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
      console.error("Error deleting pharmacy:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
  static async updatePrescription(DOCTOR, PATIENT, PHARMA_COMPANY, DRUG_NAME, PRESCRIPTION_DATE, QUANTITY) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_prescription(:DOCTOR, :PATIENT, :PHARMA_COMPANY, :DRUG_NAME, :PRESCRIPTION_DATE, :QUANTITY); END;`,
        {
          DOCTOR, 
          PATIENT, 
          PHARMA_COMPANY, 
          DRUG_NAME, 
          PRESCRIPTION_DATE, 
          QUANTITY
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
