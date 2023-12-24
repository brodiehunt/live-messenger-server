const { faker } = require('@faker-js/faker');
// import { faker } from '@faker-js/faker';
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();



const connectToDB = async () => {
  await mongoose.connect(process.env.DEV_DB);
  console.log('connected to db');
}

const seedDB = async () => {
  await User.deleteMany({}); // Clear existing users

  const mainUserInfo = {
    name: 'brodie',
    username: 'brodiehunt',
    email: 'brodie@test.com',
    password: 'Brodie1',
    avatarUrl: faker.image.avatarGitHub()
  }
  const mainUser = new User(mainUserInfo);
  await mainUser.save()
  for (let i = 0; i < 200; i++) {
      const name = faker.person.firstName().slice(0, 10) + i;
      const username = faker.internet.userName({firstName: name}).slice(0,15);
      const email = faker.internet.email({firstName: name});
      const password = 'Brodie1';
      const avatarUrl = faker.image.avatarGitHub();
      const user = new User({ name, username, email, password, avatarUrl});
      await user.save();
  }
  console.log("Database seeded");
};

const runSeeder = async () => {
  await connectToDB();
  await seedDB();
  mongoose.connection.close();
  console.log("Disconnected from MongoDB");
};

runSeeder().catch(err => {
  console.error("An error occurred:", err);
  mongoose.connection.close();
});