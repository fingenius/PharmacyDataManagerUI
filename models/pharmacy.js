const oracledb = require("oracledb");
const {getConnection} = require("../db/oracle");

module.exports = class Patient {
  constructor(PHNAME, PHADDRESS, PHPHONE) {
    this.PHNAME = PHNAME;
    this.PHADDRESS = PHADDRESS;
    this.PHPHONE = PHPHONE;
  }

  async saveViaProcedure() {
    const connection = await getConnection();
  try {
    //   Enable DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    //   Call PL/SQL procedure
    await connection.execute(
      `BEGIN add_pharmacy(:PHNAME, :PHADDRESS, :PHPHONE); END;`,
      {
        PHNAME: this.PHNAME,
        PHADDRESS: this.PHADDRESS,
        PHPHONE: this.PHPHONE
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
        const result = await connection.execute(`SELECT * FROM pharmacy order by PHNAME,PHADDRESS`);
        return result.rows;
    } finally {
        await connection.close();
    }
  }
  static async deleteByNameAddress(PHNAME,PHADDRESS) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN delete_pharmacy(:PHNAME,:PHADDRESS); END;`,
        {   
          PHNAME ,
          PHADDRESS  
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
  static async updateByNameAddress(PHNAME,PHADDRESS,PHPHONE) {
    const connection = await getConnection();
    try {
      await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
      await connection.execute(
        `BEGIN update_pharmacy(:PHNAME, :PHADDRESS, :PHPHONE); END;`,
        {
         PHNAME,
         PHADDRESS,
         PHPHONE
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
