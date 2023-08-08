const app = require('./app')
const db = require('./config');

db.once('open', () => {
  app.listen(3000, () => {
    console.log("Database connection successful")
  });
});