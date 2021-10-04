import React, {useState, createRef} from 'react'
import { useEffect } from "react";
import { Link } from "react-router-dom";
import './style.scss'

import logoArmazem from '../../img/logo-armazem-do-vinho2.png'

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../FirebaseConfig.js'

export default function Header (props) {

    const [isChecked,setIsChecked] = useState(false)
    const [userIsLogged, setUserIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dataUsers, setDataUsers] = useState([]);
    const [dataAccount, setDataAccount] = useState([]);

    const menuMobile = createRef()

    function onAuthStateChanged(user) {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) 
              setUserIsLogged(true)
          });

        
    }

    function showMenuMobile() {

        if (isChecked)
            menuMobile.current.style.display = 'none'
        else
            menuMobile.current.style.display = 'flex'
        
    }

    useEffect(() => {
        
        if(!firebase.apps.length)
            firebase.initializeApp(firebaseConfig)
        onAuthStateChanged();

    }, []);

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

        firebase.database().ref('admins/').get('/admins')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                    temp.map((item) => {

                        if (item.email === userEmail) {
                            setIsAdmin(true)
                        }

                    })

                } else
                    console.log("No data available");

            })

    }, []);

    return (

        <div>

            <header>
                

                <div className='logo' >

                    <Link to='/'> <img src={logoArmazem} alt="" /> </Link>

                </div>

                <div className='menu' >

                    {isAdmin ?
                        <>

                            <ul>

                                <li> <Link to='/' > Início </Link> </li>
                                <li> <Link to='/Admin'> Admin </Link> </li>
                                <li> <Link to='/quemsomos'> Quem Somos </Link> </li>
                                <li> <Link to='/carrinho'> Carrinho </Link> </li>
                                <li> <Link to='/contato'> Contato </Link> </li>
                                <li> <Link to='/entrar'> Login/Perfil </Link> </li>

                            </ul>

                        </>

                        :

                        <>
                            <ul>
                                <li> <Link to='/' > Início </Link> </li>
                                <li> <Link to='/quemsomos'> Quem Somos </Link> </li>
                                <li> <Link to='/carrinho'> Carrinho </Link> </li>
                                <li> <Link to='/contato'> Contato </Link> </li>
                                <li> <Link to='/entrar'> Login/Perfil </Link> </li>
                            </ul>
                        </>

                    }
                    
                </div>

                <div className="sandwich" >

                    <input type="checkbox" id="checkbox" onClick={ () => {

                        setIsChecked(!isChecked);
                        showMenuMobile()

                    }} />

                    <label htmlFor="checkbox" >

                        <span></span>
                        <span></span>
                        <span></span>

                    </label>

                </div>

            </header>

            <div className='menu-mobile' ref = {menuMobile} >

                {isAdmin ?
                    <>

                        <ul>

                            <a href="/"> Início </a>
                            <a href='/Admin'> Admin </a>
                            <a href="/quemsomos"> Quem Somos </a>
                            <a href="/Carrinho"> Carrinho </a>
                            <a href="/Contato"> Contato </a>
                            <a href="/Entrar"> Login/Perfil </a>

                        </ul>

                    </>

                    :

                    <>
                        <ul>

                            <a href="/"> Início </a>
                            <a href="/quemsomos"> Quem Somos </a>
                            <a href="/Contato"> Contato </a>
                            <a href="/Carrinho"> Carrinho </a>
                            <a href="/Entrar"> Login/Perfil </a>

                        </ul>
                    </>

                }

            </div>

        </div>

    )
}

