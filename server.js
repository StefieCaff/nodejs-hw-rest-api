const app = require('./app')
const db = require('./config');

db.once('open', () => {
  app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000")
  });
});