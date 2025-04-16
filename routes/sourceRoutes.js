const express = require("express");
const router = express.Router();
const {
  getClickHouseTables,
  getClickHouseColumns,
  getFlatFileColumns,
} = require("../controllers/sourceController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/list-clickhouse-tables", getClickHouseTables);
router.post("/get-flatfile-columns", upload.single("file"), getFlatFileColumns);
router.post("/ingest-clickhouse-flatfile", ingestClickHouseToFlatFile);
router.post(
  "/ingest-flatfile-clickhouse",
  upload.single("file"),
  ingestFlatFileToClickHouse
);

module.exports = router;
