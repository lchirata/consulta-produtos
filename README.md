# ST IT Cloud - Development Test LV. 3


## Instruções para instalacão e execucão da API

  - npm i
  - npm start
  - definir palavra chave no .env (SECRET=XXX)
  

## Enpoints 
 ### `POST /login`

 - Body
 { "email": <USER_EMAIL>, "password": <USER_PASSWORD> }

 - Expected Response
 { "token": <JWT TOKEN> }


### `GET /products/:organizationName?tags=<tag1>,<tag2>,...`

  #### Header
  - x-access-token : token
  - Query : organizationName (exemplo: STUFF A)
  - tag (opicional) : tag (exeplo: Intelligent)

  --> exemplo de url : https://talent-data-api-lhirata.herokuapp.com//products/:organizationName?organizationName=STUFF%20A&tag=Intelligent&tag=Awesome


## Requisitos não-funcionais 

✅ A autenticacão do usuário deve ser feita através de alguma implementacão de JWT.  

✅ Se julgar necessário manter sessão, deve ser feito de forma independente de server.

✅ Instruções para instalacão e execucão da API, incluindo as dependências de libs, runtimes, e etc.

✅  A API deve ser escalável horizontalmente.

## Bonus! (Não obrigatório)

✅ Não carregar os dados do arquivo `products.txt` de forma integral em memória. SUGESTÃO: Utilize streams. </br>
⬜️ Implementacão de testes unitários.</br>
⬜️  Implementacão de testes integrados através de feature files.</br>
⬜️  Execucão em container.</br>
✅  Publicacão da API em algum servico cloud.


