const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class Patient {
  constructor(PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN) {
    this.PAID = PAID;
    this.PNAME = PNAME;
    this.PADDRESS = PADDRESS;
    this.PAGE = PAGE;
    this.PRIMARY_PHYSICIAN = PRIMARY_PHYSICIAN;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_patient(:PAID, :PNAME, :PADDRESS, :PAGE, :PRIMARY_PHYSICIAN); END;`,
      {
        PAID: this.PAID,
        PNAME: this.PNAME,
        PADDRESS: this.PADDRESS,
        PAGE: this.PAGE,
        PRIMARY_PHYSICIAN: this.PRIMARY_PHYSICIAN
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
        const result = await connection.execute(`SELECT * FROM patient order by PAID`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async fetchByDoctorId(DID) {
    const connection = await getConnection();
    try {
        const result = await connection.execute(
        `SELECT P.PAID, P.PNAME, P.PADDRESS, P.PAGE, P.PRIMARY_PHYSICIAN
        FROM PRESCRIPTION PR
        JOIN PATIENT P ON PR.patient = P.paid
        WHERE PR.doctor = :DID`, 
        { DID }
      );
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async deleteById(PAID) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_patient(:PAID); END;`,
        { PAID },
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
      console.error("Error deleting doctor:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
  static async updateById(PAID, PNAME, PADDRESS, PAGE, PRIMARY_PHYSICIAN) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_patient(:PAID, :PNAME, :PADDRESS, :PAGE, :PRIMARY_PHYSICIAN); END;`,
        {
          PAID,
          PNAME,
          PADDRESS,
          PAGE,
          PRIMARY_PHYSICIAN
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
      console.error("Error updating doctor:", err);
      throw err;
    } finally {
      await connection.close();
    }
  }
};
