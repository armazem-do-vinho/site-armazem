const dataToSend = {
  "from": {
    "postal_code": "96020360"
  },
  "to": {
    "postal_code": "01018020"
  },
  "products": [
    {
      "id": "x",
      "width": 11,
      "height": 17,
      "length": 11,
      "weight": 0.3,
      "insurance_value": 10.1,
      "quantity": 1
    },
    {
      "id": "y",
      "width": 16,
      "height": 25,
      "length": 11,
      "weight": 0.3,
      "insurance_value": 55.05,
      "quantity": 2
    },
    {
      "id": "z",
      "width": 22,
      "height": 30,
      "length": 11,
      "weight": 1,
      "insurance_value": 30,
      "quantity": 1
    }
  ]
}

const calculaFrete =  async () => {
  await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUzMTRhMDI5OTYyOWYzMjcxNzcxNzM0NTg0ZGM3NGZmMTM2NWU1YjU3ZTBmNjQ0MDgwNmI3Y2I4NmUxYjk4ODkxNTE1MTUzNmRhNmU4OWZjIn0.eyJhdWQiOiIxIiwianRpIjoiNTMxNGEwMjk5NjI5ZjMyNzE3NzE3MzQ1ODRkYzc0ZmYxMzY1ZTViNTdlMGY2NDQwODA2YjdjYjg2ZTFiOTg4OTE1MTUxNTM2ZGE2ZTg5ZmMiLCJpYXQiOjE2MzYwNzAxMjQsIm5iZiI6MTYzNjA3MDEyNCwiZXhwIjoxNjY3NjA2MTI0LCJzdWIiOiI2ZTJlOTZiYS0xZGM0LTRkZTAtYmU1Yy0wMWU1ZTVjNzBlYjEiLCJzY29wZXMiOlsiZWNvbW1lcmNlLXNoaXBwaW5nIiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1jYWxjdWxhdGUiXX0.CvJeg2O4lz09tdHAyKi5l316Il7TbWpYzRs0GPGOKJ10VUhWy7twLeQAXhdH0ofleZNVIJzv8uJLLHoFjm6Fo99K0y426no10l7hyydye3sajLbMcb3fzrhx0HtDJ9PkKdLw2zcHQJDOfz0wXd6diRVyI1HnKypzt1r3H9d5xEQzIiPKdpPF-5ge9ufmHQ8E_NAer7N79h6jkHcA5tfBED9H2Dq8C1Fotjq-5FCsLBIn1XfM2eAPRdB6SQdk6umHDSww0apUlZl3XVSdZB13QmFxZkBOXdJhyNDpUG5A1ooF33OUCK5z6ba65Li8BKFevKDaRp5AxNNMzvYkFIGwfXzr9p0m0Iuq-DRm2O5PX8_kPUq1KpkNHLG_sdT8Da04ADMjVnsbZYrtiFcjPeKhT6yMhBkRk2xwoyTPXQJPiVwpExJ6WVkKLnjXjnptBANw4fM3sQfckFI0pNRe0a0YfGwiin9geJuiYNrezbLi2sCleL4GuAE7Vxc_S19Jo43OwseRuFeoC2EulCzYKjdKisbciNOjGa6P9BSyUphwaniXNKp4bt04BcuHuIeYMCicEDKG4ssGXNwPk2FzEgACfuMEkVt8mA0mhlBmfCc6MezgCbuLE-DEGQFsW-QdAExZtZV9nPfsZuT7P4sgKcuokvCXIJPhYdgSh-WkQYcjSoU',
      'User-Agent': 'Armazém teste higorb2000@gmail.com'
    },
    body: JSON.stringify(dataToSend)
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data)
  }).catch(err => console.log(err))
};

export default calculaFrete