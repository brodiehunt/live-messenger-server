const app = require('./app.js')

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})