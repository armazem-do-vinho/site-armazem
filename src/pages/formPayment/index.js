import React from 'react';
import { useState, useEffect } from 'react';

import Header from '../../components/header'
import Footer from '../../components/footer'

import mercadopago from 'mercadopago'

import './style.scss'

function PaymentForm() {

  useEffect(() => {
    const mercadopago = require ('mercadopago');

    mercadopago.configure({
      access_token:'TEST-7958052856366423-082721-e6e9735bff14c755b0c0f5af97bb4489-129407879'
    });

    let preference = {
      items: [
        {
          title: 'Meu produto',
          unit_price: 100,
          quantity: 1,
        }
      ]
    };
    
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor substituirá a string "<%= global.id %>" no seu HTML
      global.id = response.body.id;
    }).catch(function(error){
      console.log(error);
    });

  },[]);

  return (

    <section id="test">

      <Header />

        <button className="cho-container" >Pagar</button>
        
      <Footer />

    </section>

  )
}

export default PaymentForm
