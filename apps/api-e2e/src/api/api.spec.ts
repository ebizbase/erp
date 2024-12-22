import axios from 'axios';
import { GenericContainer, Wait } from "testcontainers";

describe('GET /api', () => {


  beforeAll(async () => {
    if (process.env.BASE_URL) {
      axios.defaults.baseURL = process.env.BASE_URL;
    } else {
      const container = await new GenericContainer("api")
        .withExposedPorts(3000)
        .withLogConsumer((stream) => {
          stream.on('data', data => process.stdout.write(data));
        })
        .withWaitStrategy(Wait.forLogMessage('API is running on: http://localhost'))
        .start();
      axios.defaults.baseURL = `http://${container.getHost()}:${container.getMappedPort(3000)}`;
    }
  }, 120_000)

  it('should return a message', async () => {
    const res = await axios.get(`/`);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
})
