import React, { useEffect, useState } from 'react'
import { Link, Redirect } from "react-router-dom"


import Header from '../../components/header'
import Footer from '../../components/footer'
import WhatsAppButton from '../../components/whatsappButton'

import './style.scss'
import taca_armazem from '../../img/taca_armazem.png'

import firebase from 'firebase/app'
import 'firebase/auth'
import FirebaseConfig from '../../FirebaseConfig.js'

function SignIn() {

    const [loginData,setLoginData] = useState({

        email: '',
        password: ''

    })

    const [userIsLogged, setUserIsLogged] = useState(false);
    const [requestData, setRequestData] = useState([{}]);

    function makeLogin () {

        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
        .then((userCredential) => {
            var user = userCredential.user;
            localStorage.setItem('userEmail',loginData.email)

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        }); 
        
    }

    function handleInputLoginChange(event) {

        const {name, value} = event.target

        setLoginData ({

            ...loginData, [name]: value

        })
        
    }

    function onAuthStateChanged(user) {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) 
              setUserIsLogged(true)
          });

        
    }
    
    useEffect(() => {
        
        window.scrollTo(0, 0);

        if(!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig)
        onAuthStateChanged();

    }, []);
    
    useEffect(() => {
        
        firebase.database().ref('requests').get('/requests')
        .then(function (snapshot) {

            if (snapshot.exists()) {

                // var phoneNumber = localStorage.getItem('userPhoneNumber')

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])

                var requestDataTemp = []

                temp.map((item) => {

                    if(item.phoneNumber === '12345678')
                        requestDataTemp.push(item)

                })
                setRequestData(requestDataTemp)
            }
            else {
                console.log("No data available");
            }
        })

    }, []);

    if (userIsLogged) {

        return (

            <Redirect to='/Perfil' />

        )
        
    }
    else {

        return (

            <div className="Register">

                <Header />

                <div className="container">
                    <img src={taca_armazem} alt="Taça de vinho" />
                    <main id='mainRegister'> 

                        <div className='formsRegister'>

                            <h2>Seja bem-vindo! Faça seu login:</h2>

                            <fieldset>

                                <input name='email' onChange={handleInputLoginChange} placeholder='E-mail' />

                                <input name='password' type='password' onChange={handleInputLoginChange} placeholder='Senha' />

                            </fieldset>

                            <div className='buttonsFormRegister' >
                                <Link id='enterButtonSignInPage' onClick={makeLogin}>Entrar</Link>
                            </div>

                            <div className='haveAccount' >
                                <h5>Ainda não tem uma conta? </h5>
                                <Link to='/cadastrar' >Cadastrar-se</Link>
                            </div>

                            <div className='passwordRecover' >
                               <h5>Esqueceu sua senha? <Link to='/RecuperarSenha' >Recuperar senha</Link></h5> 
                            </div>

                        </div>

                    </main>

                </div>
                
                <WhatsAppButton />
                <Footer />

            </div>

        );

    }
}

export default SignIn;