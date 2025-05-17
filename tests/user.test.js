const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const { expect } = require('chai');

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'user'
};

// Clear database before and after tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('User API Tests', () => {
    let createdUserId;

    // Test creating a user
    test('POST /api/users - Create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send(testUser)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(testUser.name);
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.role).toBe(testUser.role);

        createdUserId = response.body._id;
    });

    // Test getting all users
    test('GET /api/users - Get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test getting a single user
    test('GET /api/users/:id - Get single user', async () => {
        const response = await request(app)
            .get(`/api/users/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body._id).toBe(createdUserId);
        expect(response.body.name).toBe(testUser.name);
    });

    // Test updating a user
    test('PUT /api/users/:id - Update user', async () => {
        const updatedData = {
            name: 'Updated Test User',
            email: 'updated@example.com'
        };

        const response = await request(app)
            .put(`/api/users/${createdUserId}`)
            .send(updatedData)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.email).toBe(updatedData.email);
    });

    // Test deleting a user
    test('DELETE /api/users/:id - Delete user', async () => {
        await request(app)
            .delete(`/api/users/${createdUserId}`)
            .expect(200);

        // Verify user is deleted
        const response = await request(app)
            .get(`/api/users/${createdUserId}`)
            .expect(404);
    });

    // Test error cases
    test('GET /api/users/:id - Get non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await request(app)
            .get(`/api/users/${nonExistentId}`)
            .expect(404);
    });

    test('POST /api/users - Create user with invalid data', async () => {
        const invalidUser = {
            name: 'Invalid User'
            // Missing required fields
        };

        await request(app)
            .post('/api/users')
            .send(invalidUser)
            .expect(400);
    });
}); 