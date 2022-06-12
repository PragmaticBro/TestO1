# TestO1

# Project Setup

- npm install

- setup env variables
  - mongodb connection string
  - apilayer key [apilayer](https://apilayer.com) [docs](https://apilayer.com/api_details/number_verification)
- npm start

- server will listen on  8080
  - validator service will listen on port 3000
  - customer service will listen on port 8000

# {GET] lists all customers

``` bash
curl --location --request GET 'localhost:8080/customers'
```

# [POST] Adds a customer
``` bash
curl --location --request POST 'localhost:8080/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Muhammad",
    "phoneNumber": "7006982023",
    "callingCode": "91",
    "address": "Gulab"
}'
```

# [DELETE] deletes a customer 
```bash
curl --location --request DELETE 'localhost:8080/customers/62a58b29804eea52b1670e68'
```

# [PUT] Updates a customer
```bash
curl --location --request PUT 'localhost:8080/customers/62a58b29804eea52b1670e68' \
--header 'Content-Type: application/json' \
--data-raw '{
     "name": "Muhammad",
    "callingCode": "44",
    "phoneNumber": "7760967789",
    "address": "Hulab",
    "country": "India (Republic of)",
    "operator": "Reliance Jio Infocomm Ltd (RJIL)"
}'
```