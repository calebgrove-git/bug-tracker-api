function makeBug() {
  return {
    id: 1,
    name: 'bug',
    details: 'bug',
    steps: 'bug',
    version: 'v1.0',
    creator: 'admin',
    priority: 1,
    company: 'admin',
    completed: false,
  };
}

module.exports = {
  makeBug,
};
