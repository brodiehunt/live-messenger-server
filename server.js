const app = require('./app.js')
require('./config/database.js');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})