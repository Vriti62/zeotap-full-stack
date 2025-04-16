const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const { getClickHouseClient } = require("../services/clickHouseService");

// ClickHouse: Fetch list of tables
const getClickHouseTables = async (req, res) => {
  try {
    const { host, port, database, user, jwtToken } = req.body;
    const clickhouse = getClickHouseClient({ host, port, database, user, jwtToken });

    const query = `SHOW TABLES FROM ${database}`;
    const result = await clickhouse.query(query).toPromise();
    const tables = result.map(row => Object.values(row)[0]);

    res.json({ success: true, tables });
  } catch (err) {
    console.error("Error fetching ClickHouse tables:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch tables." });
  }
};

// ClickHouse: Fetch columns from selected table
const getClickHouseColumns = async (req, res) => {
  try {
    const { host, port, database, user, jwtToken, table } = req.body;
    const clickhouse = getClickHouseClient({ host, port, database, user, jwtToken });

    const query = `DESCRIBE TABLE ${database}.${table}`;
    const result = await clickhouse.query(query).toPromise();

    const columns = result.map(row => row.name); // or row['name']
    res.json({ success: true, columns });
  } catch (err) {
    console.error("Error fetching columns:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch columns." });
  }
};

// Flat File: Parse column headers from CSV
const getFlatFileColumns = (req, res) => {
  try {
    const { filePath, delimiter = "," } = req.body;
    const fullPath = path.resolve(filePath);

    const headers = [];
    let readStream = fs.createReadStream(fullPath);

    readStream
      .pipe(csvParser({ separator: delimiter }))
      .on("headers", (headerList) => {
        headerList.forEach(h => headers.push(h));
        readStream.destroy(); // stop after first row
      })
      .on("close", () => {
        res.json({ success: true, columns: headers });
      })
      .on("error", (err) => {
        console.error("Flat file parsing error:", err.message);
        res.status(500).json({ success: false, error: "Failed to read flat file." });
      });
  } catch (err) {
    console.error("Flat file error:", err.message);
    res.status(500).json({ success: false, error: "Error processing flat file." });
  }
};

module.exports = {
  getClickHouseTables,
  getClickHouseColumns,
  getFlatFileColumns,
};
