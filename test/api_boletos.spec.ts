import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API TOKEN PROTHEUS', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'http://200.150.97.186:6662/rest';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Consumir token PROTHEUS', async () => {
    await p
      .spec()
      .post(`${baseUrl}/api/oauth2/v1/token`)
      .withQueryParams('grant_type', 'password')
      .withQueryParams('username', 'mateus.zanin')
      .withQueryParams('password', '1234')
      .expectStatus(StatusCodes.CREATED)
      .stores('accessToken', 'access_token');;
  });
  it('Credencial invalida PROTHEUS', async () => {
    await p
      .spec()
      .post(`${baseUrl}/api/oauth2/v1/token`)
      .withQueryParams('grant_type', 'password')
      .withQueryParams('username', 'mateus.zanin')
      .withQueryParams('password', '12345')
      .expectStatus(StatusCodes.UNAUTHORIZED);
  });
  it('Consultar titulos em aberto PROTHEUS', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletos/`)
      .withQueryParams('cgc', '22215133000118')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.OK);
  });
  it('Buscar PDF de boleto onde nao foi possivel gerar o boleto', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletospdf/`)
      .withQueryParams('filial', '01010')
      .withQueryParams('notaFiscal', '000102170')
      .withQueryParams('parcela', '00')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });
  it('Consultar titulos em aberto PROTHEUS com CNPJ invalido', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletos/`)
      .withQueryParams('cgc', '1234567891111')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });
  it('Consultar titulos em aberto PROTHEUS em que o CNPJ nao existe na base de dados', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletos/`)
      .withQueryParams('cgc', '08929195903')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.NOT_ACCEPTABLE);
  });
  it('Consultar titulos em aberto PROTHEUS em que o CNPJ nao foi enviado', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletos/`)
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  it('Buscar PDF de boleto', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletospdf/`)
      .withQueryParams('filial', '333301')
      .withQueryParams('notaFiscal', '000023094')
      .withQueryParams('parcela', '03')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.OK);
  });
  it('Buscar PDF de boleto onde nao foi possivel gerar o boleto', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletospdf/`)
      .withQueryParams('filial', '010101')
      .withQueryParams('notaFiscal', '000102170')
      .withQueryParams('parcela', '00')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
  it('Buscar PDF de boleto onde nao foi enviado a chave filial', async () => {
    await p
      .spec()
      .get(`${baseUrl}/boletospdf/`)
      .withQueryParams('notaFiscal', '000102170')
      .withQueryParams('parcela', '00')
      .withHeaders('Authorization', `Bearer $S{accessToken}`)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });
});   
