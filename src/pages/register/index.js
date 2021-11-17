import React from 'react'
import { useEffect, useState } from 'react'

import InputMask from 'react-input-mask';

import Header from '../../components/header'
import Footer from '../../components/footer'
import WhatsAppButton from '../../components/whatsappButton'

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../FirebaseConfig.js'

import { Link, Redirect } from "react-router-dom";

import imgVinho from '../../img/vinhoTaça.jpg';
import googleLogo from '../../img/google.svg';
import facebookLogo from '../../img/facebook.svg';

import './style.scss'

function Register() {

    const [ufs, setUfs] = useState([])
    const [selectedUf, setSelectedUf] = useState([])
    const [city, setCity] = useState([])
    const [selectedCity, setSelectedCity] = useState([])

    const [registerData, setRegisterData] = useState({

        name: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        cepNumber: '',
        address: '',
        street: '',
        city: '',
        state: '',
        houseNumber: '',
        district: '',
        complement: '',
        password: '',
        passwordConfirm: '',

    })

    const [selectedOption, setSelectedOption] = useState('');
    const [userIsLogged, setUserIsLogged] = useState(false);
    const [registerDone, setRegisterDone] = useState(false);

    function makeRegister() {

        firebase.auth()
            .createUserWithEmailAndPassword(registerData.email, registerData.password)
            .then((user) => {

                const id = firebase.database().ref().child('posts').push().key

                firebase.database().ref('users/' + id).set({

                    name: registerData.name,
                    email: registerData.email,
                    phoneNumber: registerData.phoneNumber,
                    birthDate: registerData.birthDate,
                    cepNumber: registerData.cepNumber,
                    address: registerData.address,
                    city: selectedCity,
                    state: selectedUf,
                    houseNumber: registerData.houseNumber,
                    district: registerData.district,
                    complement: registerData.complement,
                    id: id

                })

                localStorage.setItem('id', id)

                alert('Cadastro realizado com sucesso!')

                setRegisterDone(true)

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            });

    }

    function handleInputRegisterChange(event) {

        const { name, value } = event.target

        setRegisterData({

            ...registerData, [name]: value

        })

    }

    function handleSelect(event) {

        const { name, value } = event.target

        setSelectedOption(value)

    }

    function onAuthStateChanged(user) {

        firebase.auth().onAuthStateChanged((user) => {
            if (user)
                setUserIsLogged(true)
        });


    }

    useEffect(() => {

        window.scrollTo(0, 0);
        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig)
        onAuthStateChanged();

    }, []);

    function getLocales() {

        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(async (res) => await res.json())
            .then((json) => {

                const names = json.map(uf => uf.sigla)
                setUfs(names)

            })

    }

    function handleSelectedUf(event) {

        setSelectedUf(event.target.value)

    }

    function setCities() {

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(async (res) => await res.json())
            .then((json) => {

                const names = json.map(uf => uf.nome)
                setCity(names)

            })

    }

    function handleSelectedCity(event) {

        setSelectedCity(event.target.value)

    }

    useEffect(() => {

        getLocales();

    }, [])

    useEffect(() => {

        setCities();

    }, [selectedUf])

    function makeVerifications() {

        var counter = 0

        registerData.name !== '' ? counter = counter + 1 : counter = counter
        registerData.email !== '' ? counter++ : counter = counter
        registerData.password !== '' ? counter++ : counter = counter
        registerData.passwordConfirm !== '' ? counter++ : counter = counter
        registerData.phoneNumber !== '' ? counter++ : counter = counter
        registerData.birthDate !== '' ? counter++ : counter = counter
        registerData.cepNumber !== '' ? counter++ : counter = counter
        registerData.city !== '' ? counter++ : counter = counter
        registerData.state !== '' ? counter++ : counter = counter
        registerData.houseNumber !== '' ? counter++ : counter = counter
        registerData.district !== '' ? counter++ : counter = counter
        registerData.complement !== '' ? counter++ : counter = counter

        if (counter === 10) {

            if (registerData.password !== registerData.passwordConfirm) {

                alert('As senhas não são iguais!');

            }

            else {

                makeRegister();

            }

        }
        else {

            alert('Você precisa preencher todos os campos!')
            console.log(counter)

        }

    }

    if (userIsLogged) {

        return (

            <Redirect to='/' />

        )

    } else {

        if (registerDone) {

            return (

                <Redirect to='/' />

            )

        } else {

            return (

                <div className="Register">

                    <Header />

                    <section id="registerForms">

                        <div className="formsWrapper">

                            <div className="leftSideRegisterForms">

                                <div className="forms">

                                    <div className="formsText">

                                        <div className="loginOption">

                                            <h1>Criar conta</h1>

                                            <div className="loginAlternative">

                                                <img src={googleLogo} alt="logo google" />
                                                <img src={facebookLogo} alt="logo facebook" />

                                            </div>

                                            <p>Por favor, insira os dados abaixo para realizar o cadastro de sua conta</p>

                                        </div>

                                        <div className="formRegister">

                                            <input id='name' name='name' onChange={handleInputRegisterChange} placeholder='Nome completo' />
                                            <input id='email' name='email' onChange={handleInputRegisterChange} placeholder='E-mail' />

                                            <div className="passwordDiv">

                                                <input id='password' name='password' type="password" onChange={handleInputRegisterChange} placeholder='Senha' />
                                                <input id='passwordConfirm' name='passwordConfirm' type="password" onChange={handleInputRegisterChange} placeholder='Confirmação de senha' />

                                            </div>

                                            {/* <input id='phoneNumber' name='phoneNumber' onChange={handleInputRegisterChange} placeholder='Telefone' /> */}
                                            <InputMask id='phoneNumber' name='phoneNumber' type='tel' mask="(99) 99999-9999" maskChar="" onChange={handleInputRegisterChange} placeholder='Telefone com DDD' />
                                            {/* <input id='birthDate' name='birthDate' type='date' onChange={handleInputRegisterChange} placeholder='Data de nascimento' /> */}
                                            <InputMask id='birthDate' name='birthDate' type='text' mask="99/99/9999" maskChar="" onChange={handleInputRegisterChange} placeholder="Data de nascimento" />
                                            {/* <input id='cepNumber' name='cepNumber' onChange={handleInputRegisterChange} placeholder='CEP' /> */}
                                            <InputMask id='cepNumber' name="cepNumber" type='text' mask="99999-999" maskChar="" onChange={handleInputRegisterChange} placeholder="CEP" />

                                            <div className="cityDiv">

                                                <select name="state" id="uf" onChange={handleSelectedUf}>

                                                    {/* <option diabled selected value="0" >Estado</option>

                                                    {ufs.map(uf => (

                                                        <option key={uf} value={uf} >{uf}</option>

                                                    ))} */}

                                                    <option diabled selected value="0" >Estado</option>

                                                    <option value="AC">AC</option>
                                                    <option value="AL">AL</option>
                                                    <option value="AP">AP</option>
                                                    <option value="AM">AM</option>
                                                    <option value="BA">BA</option>
                                                    <option value="CE">CE</option>
                                                    <option value="DF">DF</option>
                                                    <option value="ES">ES</option>
                                                    <option value="GO">GO</option>
                                                    <option value="MA">MA</option>
                                                    <option value="MT">MT</option>
                                                    <option value="MS">MS</option>
                                                    <option value="MG">MG</option>
                                                    <option value="PA">PA</option>
                                                    <option value="PB">PB</option>
                                                    <option value="PR">PR</option>
                                                    <option value="PE">PE</option>
                                                    <option value="PI">PI</option>
                                                    <option value="RJ">RJ</option>
                                                    <option value="RN">RN</option>
                                                    <option value="RS">RS</option>
                                                    <option value="RO">RO</option>
                                                    <option value="RR">RR</option>
                                                    <option value="SC">SC</option>
                                                    <option value="SP">SP</option>
                                                    <option value="SE">SE</option>
                                                    <option value="TO">TO</option>

                                                </select>

                                                <input name="city" id="localidade" onChange={handleSelectedCity} value={selectedCity} placeholder="Cidade" />

                                                {/* <select name="city" id="localidade" onChange={handleSelectedCity} value={selectedCity} >

                                                    <option value="0">Selecione uma cidade</option>

                                                    {city.map(city => (

                                                        <option key={city} value={city} >{city}</option>

                                                    ))}

                                                </select> */}

                                            </div>
                                            <input id='address' name='address' onChange={handleInputRegisterChange} placeholder='Endereço' />
                                            <input id='houseNumber' name='houseNumber' onChange={handleInputRegisterChange} placeholder='Número da residência' />
                                            <input id='district' name='district' onChange={handleInputRegisterChange} placeholder='Bairro' />
                                            <input id='complement' name='complement' onChange={handleInputRegisterChange} placeholder='Complemento' />

                                        </div>

                                    </div>

                                    <button onClick={() => { makeVerifications() }}>Cadastrar</button>

                                </div>

                            </div>

                            <div className="rightSideRegisterForms">

                                <div className="wrapperDiv">

                                    <img src={imgVinho} alt="imagem vinho" />

                                </div>

                            </div>

                        </div>

                    </section>

                    <WhatsAppButton />
                    <Footer />

                </div>

            );

        }

    }
}

export default Register;