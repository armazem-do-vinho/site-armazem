import { React } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/header'
import Footer from '../../components/footer'
import WhatsAppButton from '../../components/whatsappButton'

import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'

function Requests() {

    return (

        <h1>Ola, mundo!</h1>

    )

}

export default Requests
