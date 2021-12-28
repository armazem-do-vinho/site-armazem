
//   var productInfos = {};
//   var data = [];

//   const cartProducts = JSON.parse(localStorage.getItem('products'))
  
//   if(cartProducts !== null) {

//     cartProducts.map((product) => {

//       productInfos = {

//       "id": product.id,
//       "width": product.itemWidth,
//       "height": product.itemHeight,
//       "length": product.itemLength,
//       "weight": product.itemWeight,
//       "insurance_value": product.price,
//       "quantity": product.amount,

//     }

//     data.push(productInfos)

//   })

// }


//   // const dataToSend = {
//   //   "from": {
//   //     "postal_code": "96020360"
//   //   },
//   //   "to": {
//   //     "postal_code": "01018020"
//   //   },
//   //   "products": [
//   //     {
//   //       "id": "x",
//   //       "width": 11,
//   //       "height": 17,
//   //       "length": 11,
//   //       "weight": 0.3,
//   //       "insurance_value": 10.1,
//   //       "quantity": 1
//   //     },
//   //     {
//   //       "id": "y",
//   //       "width": 16,
//   //       "height": 25,
//   //       "length": 11,
//   //       "weight": 0.3,
//   //       "insurance_value": 55.05,
//   //       "quantity": 2
//   //     },
//   //     {
//   //       "id": "z",
//   //       "width": 22,
//   //       "height": 30,
//   //       "length": 11,
//   //       "weight": 1,
//   //       "insurance_value": 30,
//   //       "quantity": 1
//   //     }
//   //   ]
//   // }

//     const dataToSend = {
//       "from": {
//         "postal_code": "28909120"
//       },
//       "to": {
//         "postal_code": "28055230"
//       },
//       "products": data
//     }

//   const calculaFrete = async () => {

//     await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.REACT_APP_BEARER_KEY} `,
//         'User-Agent': 'Armazém teste higorb2000@gmail.com'
//       },
//       body: JSON.stringify(dataToSend)
//     }).then((response) => {
//       return response.json();
//     }).then((data) => {
//       console.log(data)
//     }).catch(err => console.log(err))
//   };

// export default calculaFrete