import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Mercado', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://api-desafio-qa.onrender.com';""
    let idMercado = null;

    p.request.setDefaultTimeout(30000);

    beforeAll(() => p.reporter.add(rep));
    afterAll(() => p.reporter.end());

    describe('Mercado', () => {
        it('Cadastra um mercado', async () => {
            const response = await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.CREATED)
                .withBody({
                    cnpj: (Math.random() * 100000000000000).toFixed(0),
                    endereco: faker.location.streetAddress(),
                    nome: faker.company.name()
                })
                .returns('mercado.id');

                idMercado = response;
            console.log(`${idMercado}`);
        });

        it('Busca mercado pelo codigo cadastrado (id)', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/${idMercado}`)
                .expectStatus(StatusCodes.OK);
        });

        
        it('Falha ao tentar cadastrar um mercado com CNPJ inválido (Menor que os 14 digitos obrigatórios)', async () => {
            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .withBody({
                    cnpj: '452', 
                    endereco: faker.location.streetAddress(),
                    nome: faker.company.name()
                });
        });



        it('Trazer os mercados cadastrados', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike([{
                    id: /.*/,
                    nome: /.*/,
                    endereco: /.*/,
                    cnpj: /.*/
                }]);
        });


        it('Atualizar um mercado pelo codigo cadastrado (id)', async () => {
            const updatedData = {
                cnpj: (Math.random() * 100000000000000).toFixed(0),
                endereco: faker.location.streetAddress(),
                nome: faker.company.name()
            };

            await p
                .spec()
                .put(`${baseUrl}/mercado/${idMercado}`)
                .expectStatus(StatusCodes.OK)
                .withBody(updatedData)
                .returns('');

            console.log(`${idMercado}`);
        });


        it('Falhar ao tentar buscar um mercado inexistente pelo codigo cadastrado (id)', async () => {
            const idInvalido = 99999; 
            await p
                .spec()
                .get(`${baseUrl}/mercado/${idInvalido}`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });




        it('Remover um mercado pelo codigo cadastrado (id)', async () => {
            const idMercado = 3;
            await p
                .spec()
                .delete(`${baseUrl}/mercado/${idMercado}`)
                .expectStatus(StatusCodes.OK);
            console.log(`Mercado com ID ${idMercado} removido.`);
        });




        it('Falha ao tentar remover um mercado inexistente pelo codigo cadastrado (id)', async () => {
            const idInvalido = 99999; 
            await p
                .spec()
                .delete(`${baseUrl}/mercado/${idInvalido}`)
                .expectStatus(StatusCodes.NOT_FOUND);
        });

        it('Falha ao tentar atualizar um mercado inexistente', async () => {
            const idInvalido = 99999; 
            await p
                .spec()
                .put(`${baseUrl}/mercado/${idInvalido}`)
                .expectStatus(StatusCodes.NOT_FOUND)
                .withBody({
                    cnpj: (Math.random() * 100000000000000).toFixed(0),
                    endereco: faker.location.streetAddress(),
                    nome: faker.company.name()
                });
        });


        it('Valida a estrutura dos dados retornados na busca dos mercados', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike([{
                    id: /.*/,
                    nome: /.*/,
                    endereco: /.*/,
                    cnpj: /.*/
                }]);
        });

        
        it('Falha ao tentar cadastrar um mercado sem nome', async () => {
            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.BAD_REQUEST)
                .withBody({
                    cnpj: (Math.random() * 100000000000000).toFixed(0),
                    endereco: faker.location.streetAddress(),
                    nome: '' 
                });
        });



        it('Cadastra múltiplos mercados e valida a contagem', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(
                    p.spec()
                    .post(`${baseUrl}/mercado`)
                    .expectStatus(StatusCodes.CREATED)
                    .withBody({
                        cnpj: (Math.random() * 100000000000000).toFixed(0),
                        endereco: faker.location.streetAddress(),
                        nome: faker.company.name()
                    })
                );
            }
            await Promise.all(promises);
            const response = await p.spec().get(`${baseUrl}/mercado`).expectStatus(StatusCodes.OK);
            expect(response.length).toBeGreaterThan(5); 
        });

        it('Traz um mercado e todas suas informações', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/${idMercado}`)
                .expectStatus(StatusCodes.OK)
                .expectJsonLike({
                    id: idMercado,
                    nome: /.*/,
                    endereco: /.*/,
                    cnpj: /.*/
                });
        });     
        
    });
});
