const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class Doctor {
  constructor(DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE) {
    this.DAID = DAID;
    this.DNAME = DNAME;
    this.SPECIALITY = SPECIALITY;
    this.YEARS_OF_EXPERIENCE = YEARS_OF_EXPERIENCE;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_doctor(:DAID, :DNAME, :SPECIALITY, :YEARS_OF_EXPERIENCE); END;`,
      {
        DAID: this.DAID,
        DNAME: this.DNAME,
        SPECIALITY: this.SPECIALITY,
        YEARS_OF_EXPERIENCE: this.YEARS_OF_EXPERIENCE
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
        const result = await connection.execute(`SELECT * FROM doctor order by DAID`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async deleteById(DAID) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_doctor(:DAID); END;`,
        { DAID },
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
  static async updateById(DAID, DNAME, SPECIALITY, YEARS_OF_EXPERIENCE) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_doctor(:DAID, :DNAME, :SPECIALITY, :YEARS_OF_EXPERIENCE); END;`,
        {
          DAID,
          DNAME,
          SPECIALITY,
          YEARS_OF_EXPERIENCE
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
