import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

import './style.scss';
import vinho from '../../img/vinho rosé.png'

import Header from '../../components/header';
import Footer from '../../components/footer';

function PaymentForm() {

  const [paidFor, setPaidForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {

    price: 200.00,
    description: "Descriçãoounn",
    img: vinho,

  }

  useEffect(() => {

    const script = document.createElement("script");
    script.src= "https://www.paypal.com/sdk/js?client-id=AZAsiBXlnYmk2HXDpGkZgYx7zWvFpak2iKq473EPHi9LrnM2lAbAHIzVaxns_-jmD34dYqpuTSaRFWy0"
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {

      setTimeout(() => {
      
        window.paypal
          .Buttons({

            createOrder: (data, actions) => {

              return actions.order.create({
                purchase_units: [
                  {
                    description: product.description,
                    amount: {
                      currency_code: "USD",
                      value: product.price
                    }
                  }
                ]
              })
            },
            onApprove: async (data, actions) => {

              const order = await actions.order.capture();
              setPaidForm(true)
              console.log(order)

            },

          })
          .render(paypalRef)
      })
    }
  })

  return (

    <div className="paymentForm">

      {paidFor ? (

        <div>

          <h2>Compra realizada com sucesso!</h2>

        </div>

      ) : (

        <>
          <img src={vinho} alt="Foto do produto" />
          <div ref={v => (paypalRef = v)} />
        </>

      )
    
    
    }

    </div>

  )


}

export default PaymentForm

// function PaymentForm() {

//   var axios = require('axios');
//   var qs = require('qs');

//   var data = qs.stringify({
//     'currency': '',
//     'itemId': '',
//     'itemDescription': 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAtristezaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
//     'itemAmount': '',
//     'itemQuantity': '',
//     'itemWeight': '',
//   });

//   var config = {
//     method: 'post',
//     url: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=higorb2000@gmail.com&token=683807F15631406FA20906CFA09C3763',
//     headers: { 
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     data: data
//   };






  // axios({
  //   method: 'post',
  //   url: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=higorb2000@gmail.com&token=683807F15631406FA20906CFA09C3763',
  //   headers: { 
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   data: {
  //     currency: 'BRL',
  //     itemId: '1',
  //     itemDescription: 'Heitor',
  //     itemAmount: '2500000.99',
  //     itemQuantity: '1',
  //     itemWeight: '500',
  //   }
  // })







//   axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response.data));
//   })

//   .catch(function (error) {
//     console.log(error);
//   });

//   return (

//     <section id="test">

//       <Header />

//         <button id="paymentBtn">Pagar</button>
        
//       <Footer />

//     </section>

//   )
// }
