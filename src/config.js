module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgres://qalglrrkgyrzzm:3aba28c0504b948101666e426730c4e46995c9ea9d53c1be042fd4a51b365e96@ec2-52-44-235-121.compute-1.amazonaws.com:5432/df9ghv3a645og3',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://qalglrrkgyrzzm:3aba28c0504b948101666e426730c4e46995c9ea9d53c1be042fd4a51b365e96@ec2-52-44-235-121.compute-1.amazonaws.com:5432/df9ghv3a645og3'
};
