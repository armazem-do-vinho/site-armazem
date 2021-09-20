import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import './style.scss';

import Header from '../../components/header';
import Footer from '../../components/footer';

function PaymentForm() {

  var axios = require('axios');
  var qs = require('qs');

  var data = qs.stringify({
    'currency': '',
    'itemId': '',
    'itemDescription': 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAtristezaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'itemAmount': '',
    'itemQuantity': '',
    'itemWeight': '',
  });

  var config = {
    method: 'post',
    url: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=higorb2000@gmail.com&token=683807F15631406FA20906CFA09C3763',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data
  };

  axios({
    method: 'post',
    url: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=higorb2000@gmail.com&token=683807F15631406FA20906CFA09C3763',
    data: {
      currency: 'BRL',
      itemId: '1',
      itemDescription: 'Heitor',
      itemAmount: '2500000.99',
      itemQuantity: '1',
      itemWeight: '500',
    }
  })

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })

  .catch(function (error) {
    console.log(error);
  });

  return (

    <section id="test">

      <Header />

        <button id="paymentBtn">Pagar</button>
        
      <Footer />

    </section>

  )
}

export default PaymentForm