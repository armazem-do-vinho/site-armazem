import { React, useEffect, useState } from 'react'
import './style.scss'
import Header from '../../components/header'
import Footer from '../../components/footer'
import WhatsAppButton from '../../components/whatsappButton'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import firebaseConfig from '../../FirebaseConfig.js'

import logoArmazem from '../../img/logo-armazem-do-vinho.png'
import taca_armazem from '../../img/taca_armazem.png'
import portugal from '../../img/portugal.png'
import argentina from '../../img/argentina.png'
import chile from '../../img/chile.png'
import brasil from '../../img/brasil.png'
import frança from '../../img/franca.png'
import espanha from '../../img/espanha.png'

function About() {

    const [dataAbout, setDataAbout] = useState([])
    const [dataCards, setDataCards] = useState([])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('about/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataAbout(temp)
            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('aboutCards/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataCards(temp)
            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    return (

        <div className="App">

            <Header />

            <div className="aboutContainer">
                {/* <video src="./videos/brindeVinho.mp4" autoPlay loop muted/> */}

                {dataAbout.map((item) => {

                    return (

                        <video src={item.videoSrc} autoPlay loop muted />

                    )

                })}

                <h1>BRINDE OS BONS MOMENTOS</h1>

            </div>

            <div className="aboutText">
                <img src={logoArmazem} alt="logo" />

                <div className="topbar"></div>
                {/* <p><span className="firstLetter">C</span>riado por Nelson e Paulo no ano 1000... Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi consequatur similique ullam laborum sequi velit repudiandae a non, alias delectus animi deleniti sunt consequuntur nihil aut modi. Repellendus, natus ad. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum unde aliquam molestiae delectus hic accusamus, magni sit illo quaerat deleniti quidem voluptatibus sunt minus eligendi, dolore minima quos non architecto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus nostrum iure facilis ducimus beatae exercitationem distinctio tempora, commodi illo! Explicabo deserunt delectus quas ab veniam. Autem amet repellat aperiam fuga!</p> */}
                {dataAbout.map((item) => {

                    return (

                        <p><span className="firstLetter">C</span>{item.text}</p>

                    )

                })}

            </div>

            <div className="aboutCard">

                <div className="cardContainer">
                    <div className="card">
                        <h3>1.</h3>
                        <p>
                            Vinhos selecionados à dedo para marcar presença em todos os seus momentos.
                        </p>
                    </div>
                    <div className="card">
                        <h3>2.</h3>
                        <p>
                            Atendimento personalizado para o seu conforto e confiança totais.
                        </p>
                    </div>
                    <div className="card">
                        <h3>3.</h3>
                        <p>
                            Entregas rápidas e eficientes para nunca deixar passar em branco uma data especial.
                        </p>
                    </div>
                </div>

                <div className="aboutWine">
                    <h2>Carta de vinhos</h2>
                    <div className="wineContainer">

                        {dataCards.map((item) => {

                            return(

                            <div className="wineCard">

                                <div className="wineCircle"><h4>{item.country}</h4></div>

                                <div className="content">
                                    <h2>{item.country}</h2>
                                    <h3>Trapezzio, Latitud33</h3>
                                    <p><span className="firstLetter">O</span>{item.desc}</p>
                                    <a href="/">Comprar</a>
                                </div>

                                <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                                <img className="bandeira" src={item.imageSrc} alt="Portugal" />
                            </div>
                            
                            )

                        })}

                        {/* <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Portugueses</h4></div>

                            <div className="content">
                                <h2>Portugal</h2>
                                <h3>Trapezzio, Latitud33</h3>
                                <p><span className="firstLetter">O</span>s vinhos portugueses são de qualidade incomparável, etc etc.. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                <a href="/">Comprar</a>
                            </div>

                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                            <img className="bandeira" src={portugal} alt="Portugal" />
                        </div>

                        <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Argentinos</h4></div>
                            <div className="content">

                                <h2>Argentina</h2>
                                <h3>Monte da Raposinha</h3>
                                <p><span className="firstLetter">V</span>inhos argentinos são ideais para celebrar o mais simples dos momentos. Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
                                <a href="/">Comprar</a>

                            </div>
                            <img className="bandeira" src={argentina} alt="Argentina" />
                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                        </div>

                        <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Chilenos</h4></div>

                            <div className="content">
                                <h2>Chile</h2>
                                <h3>Trapezzio, Latitud33</h3>
                                <p><span className="firstLetter">O</span>s vinhos portugueses são de qualidade incomparável, etc etc.. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                <a href="/">Comprar</a>
                            </div>

                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                            <img className="bandeira" src={chile} alt="Chile" />
                        </div>

                        <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Espanhóis</h4></div>

                            <div className="content">
                                <h2>Espanha</h2>
                                <h3>Trapezzio, Latitud33</h3>
                                <p><span className="firstLetter">O</span>s vinhos portugueses são de qualidade incomparável, etc etc.. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                <a href="/">Comprar</a>
                            </div>

                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                            <img className="bandeira" src={espanha} alt="Espanha" />
                        </div>

                        <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Franceses</h4></div>

                            <div className="content">
                                <h2>França</h2>
                                <h3>Trapezzio, Latitud33</h3>
                                <p><span className="firstLetter">O</span>s vinhos portugueses são de qualidade incomparável, etc etc.. Lorem ipsum dolor sit amet consectetur adipisicing elit.  </p>
                                <a href="/">Comprar</a>
                            </div>

                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                            <img className="bandeira" src={frança} alt="França" />
                        </div>

                        <div className="wineCard">

                            <div className="wineCircle"><h4>Vinhos Brasileiros</h4></div>

                            <div className="content">
                                <h2>Brasil</h2>
                                <h3>Trapezzio, Latitud33</h3>
                                <p><span className="firstLetter">O</span>s vinhos portugueses são de qualidade incomparável, etc etc.. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                <a href="/">Comprar</a>
                            </div>

                            <img className="tacaVinho" src={taca_armazem} alt="Taça de vinho" />
                            <img className="bandeira" src={brasil} alt="Brasil" />
                        </div> */}

                    </div>
                </div>

            </div>

            <WhatsAppButton />
            <Footer />
        </div>
    )
}

export default About;
