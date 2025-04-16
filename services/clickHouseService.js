const { ClickHouse } = require("clickhouse");

function getClickHouseClient({ host, port, database, user, jwtToken }) {
  const protocol = port === 9440 || port === 8443 ? "https" : "http";
  return new ClickHouse({
    url: `${protocol}://${host}`,
    port: port,
    basicAuth: {
      username: user,
      password: jwtToken,
    },
    isUseGzip: false,
    format: "json",
    config: {
      database: database,
    },
  });
}

module.exports = { getClickHouseClient };
