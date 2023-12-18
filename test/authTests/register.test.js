const app = require('../../app');
const request = require('supertest');
const User = require('../../models/User');
const authServices = require('../../services/authServices');

describe('POST - /auth/register - happy path', () => {

  const userInfo = {name: 'testname', username: 'testusername', email: 'test@example.com', password: 'PassTest.1'};

  afterEach(async () => {
    await User.deleteMany({});
  })

  it('Should create a new user when valid information is provided and respond with 201', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send(userInfo);
    expect(response.statusCode).toBe(201);
  });

  it('Should respond with a success message', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(userInfo);
    expect(response.body.message).toBe('Registration successful');
  });

  it('Should respond with a full user object', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(userInfo);

    expect(response.body.data.name).toBe(userInfo.name);
    expect(response.body.data.email).toBe(userInfo.email);
    expect(response.body.data.username).toBe(userInfo.username);
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.data.updatedAt).toBeDefined();
    expect(response.body.data.accountSettings).toBeDefined();
    expect(response.body.data.accountSettings.isPrivate).toBe(false);
    expect(response.body.data.accountSettings.allowNonFriendMessages).toBe(true);
  })

  it('should respond with a cookie set in the header.', async () => {

    const response = await request(app)
      .post('/auth/register')
      .send(userInfo);

    expect(response.headers['set-cookie']).toBeDefined();
  })

})

describe('POST - /auth/register - validation checks', () => {
  const invalidInfo = {username: '', email: '', name: '', password: ''}
  const validInfo = {name: 'testname', username: 'testusername', email: 'test@example.com', password: 'PassTest.1'};

  it('should respond with a status 422 when empty fields are submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(invalidInfo);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBeDefined();
  })

  it('should respond with a status 422 when invalid passwords are submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, password: 'test'});

    expect(response.statusCode).toBe(422);
    expect(response.body.error.password).toBe('Invalid password');
  })

  it('should respond with a status 422 when invalid emails are submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, email: 'test'});

    expect(response.statusCode).toBe(422);
    expect(response.body.error.email).toBe('Invalid email');
  })

  it('should respond with a status 422 when invalid names are submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, name: 'tt'});

    expect(response.statusCode).toBe(422);
    expect(response.body.error.name).toBe('Name must be more than 2 and less than 20 characters');
  })

  it('should respond with a status 422 when invalid usernames are submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, username: 'tt'});

    expect(response.statusCode).toBe(422);
    expect(response.body.error.username).toBe('Invalid Username');
  })
})

describe('POST - /auth/register - should return 401 when conflicts exist (existing email or username)', () => {
  const validInfo = {name: 'testname', username: 'testusername', email: 'test@example.com', password: 'PassTest.1'};

  beforeEach(async () => {
    await User.create(validInfo);
  })

  afterEach(async () => {
    await User.deleteMany({});
  })

  it('should respond with a status 401 existing username is submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, email: 'test@email.com'});

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Username is already in use');
  })

  it('should respond with a status 401 existing email is submitted', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({...validInfo, username: 'deifferent'});

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Email is already in use');
  })
})