const app = require('../../app');
const request = require('supertest');
const User = require('../../models/User');
const authServices = require('../../services/authServices');
// jest.mock('../../services/authServices');

describe('POST - /auth/signin  - happy path', () => {
  const userInfo = {name: 'testname', username: 'testusername', email: 'test@example.com', password: 'PassTest.1'}
  
  beforeEach(async () => {
    const newUser = await User.create(userInfo);
  })

  afterEach(async () => {
    await User.deleteMany({});
  })

  it('should respond with status 200 and user object', async () => {

    const response = await request(app)
      .post('/auth/signin')
      .send({email: userInfo.email, password: userInfo.password});

    expect(response.statusCode).toBe(200);
  })

  it('should respond with message "successful login". ', async () => {

    const response = await request(app)
      .post('/auth/signin')
      .send({email: userInfo.email, password: userInfo.password});

    expect(response.body.message).toBe('Successful login');
  })

  it('should respond with a cookie set in the header.', async () => {

    const response = await request(app)
      .post('/auth/signin')
      .send({email: userInfo.email, password: userInfo.password});

    expect(response.headers['set-cookie']).toBeDefined();
  })

  it('should return a complete user document', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({email: userInfo.email, password: userInfo.password});

    expect(response.body.data.name).toBe(userInfo.name);
    expect(response.body.data.email).toBe(userInfo.email);
    expect(response.body.data.username).toBe(userInfo.username);
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.data.updatedAt).toBeDefined();
    expect(response.body.data.accountSettings).toBeDefined();
    expect(response.body.data.accountSettings.isPrivate).toBe(false);
    expect(response.body.data.accountSettings.allowNonFriendMessages).toBe(true);
  })

  it('should not return the user password', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({email: userInfo.email, password: userInfo.password});

    expect(response.body.data.password).toBeUndefined();
  })
})

describe('POST /auth/login - input doesnt meet validation requirements', () => {

  it('should respond with a 422 error when no email or password provided', async () => {
    
    const response = await request(app)
      .post('/auth/signin')
      .send({email: '', password: ''})

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.email).toBe('Invalid email');
    expect(response.body.error.password).toBe('Invalid password');
  })

  it('should respond with a 422 error when invalid email but valid password provided', async () => {
    
    const response = await request(app)
      .post('/auth/signin')
      .send({email: '', password: 'PassTest.1'})

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.email).toBe('Invalid email');
    expect(response.body.error.password).toBeUndefined();
  })

  it('should respond with a 422 error when valid email but invalid password provided', async () => {
    
    const response = await request(app)
      .post('/auth/signin')
      .send({email: 'test@test.com', password: 'PassTest'})

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.email).toBeUndefined();
    expect(response.body.error.password).toBe('Invalid password');
  })
});

describe('POST /auth/login - correct email but incorrect password responds with a 409 status', () => {

  it('should respond with a 409 error when the email is correct and password does not match', async () => {
    
    const response = await request(app)
      .post('/auth/signin')
      .send({email: 'test@example.com', password: 'Testpass.1'})
    
    expect(response.status).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  
  })

})