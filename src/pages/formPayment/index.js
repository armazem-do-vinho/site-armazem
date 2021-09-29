import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'

import './style.scss';
import vinho from '../../img/vinho rosé.png'

import Header from '../../components/header';
import Footer from '../../components/footer';

function PaymentForm() {

  const [paidFor, setPaidForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [data, setData] = useState([]);
  const [seller, setSeller] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [dataAccount, setDataAccount] = useState([]);
  const [dataExists, setDataExists] = useState(false);
  const [userIsLogged, setUserIsLogged] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [displayButtonClear, setDisplayButtonClear] = useState('none');

  let paypalRef = useRef();

  function onAuthStateChanged(user) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user)
            setUserIsLogged(true)
    });

}

  useEffect(async () => {

    const verify = await JSON.parse(localStorage.getItem('products'))

    if (verify !== null) {

      var temp = Object.keys(verify).map((key) => verify[key])

      setData(temp)
      setDataExists(true)
      setDisplayButtonClear('block')

      var total = 0

      temp.map((item) => {

        var value = (Number(item.price) * Number(item.amount))
        total = value + total

        setTotalValue(total)
      })

    }
    else
      setDataExists(false)

  }, [])

  useEffect(() => {

    window.scrollTo(0, 0);

    if (!firebase.apps.length)
      firebase.initializeApp(firebaseConfig);
    onAuthStateChanged()

  }, [])

  useEffect(() => {

    const userEmail = localStorage.getItem('userEmail')

    firebase.database().ref('users/').get('/users')
      .then(function (snapshot) {

        if (snapshot.exists()) {

          var data = snapshot.val()
          var temp = Object.keys(data).map((key) => data[key])

          setDataUsers(temp)

          temp.map((item) => {

            if (item.email === userEmail) {
              setDataAccount(item)
            }

          })

        } else

          console.log("No data available");

      })

    firebase.database().ref('sellers/').get('/sellers')
      .then(function (snapshot) {

        if (snapshot.exists()) {

          var data = snapshot.val()
          var temp = Object.keys(data).map((key) => data[key])

          temp.map((item) => {

            if (item.email === userEmail) {
              setSeller(item)
              setIsSeller(true)
            }

          })

        } else

          console.log("No data available");

      })

  }, []);

  const product = {

    price: 200.00,
    description: "Descriçãoounn",
    img: vinho,

  }

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AZAsiBXlnYmk2HXDpGkZgYx7zWvFpak2iKq473EPHi9LrnM2lAbAHIzVaxns_-jmD34dYqpuTSaRFWy0&currency=BRL"
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
                    // description: product.description,
                    amount: {
                      currency_code: "BRL",
                      value: totalValue
                    }
                  }
                ]
              })
            },
            onApprove: async (data, actions) => {

              const order = await actions.order.capture();
              setPaidForm(true)

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
