const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {

  // set up test db before each file
  await mongoose.connect(process.env.TEST_DB)
});

afterAll(async () => {
  await mongoose.disconnect();
})