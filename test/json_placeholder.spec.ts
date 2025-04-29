import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Json Placeholder', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'http://200.150.97.186:6662/rest';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('POSTS', () => {
    it('criar um novo post', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/oauth2/v1/token`)
        .withQueryParams('grant_type', 'password')
        .withQueryParams('username', 'mateus.zanin')
        .withQueryParams('password','1234')
        .expectStatus(StatusCodes.CREATED);
    });
  });
});
