const request = require('supertest');
const app = require('../app');



test('Fetch the RabbitMq Message', async () => {
    await request(app)
        .get('/')
        .send()
        .expect(200)
})

test('Start the RabbitMq publish', async () => {
    await request(app)
        .post('/?mode=start')
        .send()
        .expect(200)
})

test('Stop the RabbitMq publish', async () => {
    await request(app)
        .get('/?mode=stop')
        .send()
        .expect(200)
})