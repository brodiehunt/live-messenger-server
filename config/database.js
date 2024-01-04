const mongoose = require('mongoose');


async function connectDB() {
  
  let mongoDBURI = process.env.NODE_ENV == 'development' ? process.env.DEV_DB : process.env.PROD_DB;

  // Shut down server if no mongoDBURI is configured in dotenv file.
  if (!mongoDBURI) {
    console.error("MongoDB URI not set in env file");
    process.exit(1);
  }

  await mongoose.connect(mongoDBURI)
}

connectDB()
  .then(() => console.log('successsfully connected to the db'))
  .catch(error => console.log(error));