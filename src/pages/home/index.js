import { React } from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import Slider from "react-slick";

import rightArrow from '../../img/right-arrow.svg'

import vinhoImg from '../../img/vinho_periquita_tinto.png'
import vinhoImg2 from '../../img/vinho tinto.png'
import vinhoImg3 from '../../img/vinho rosé.png'
import vinhoImg4 from '../../img/vinho tinto 2.png'
import mapaLagos from '../../img/mapa.png';

import banner from '../../img/banner.png'
import banner2 from '../../img/banner 2.png'

import Header from '../../components/header'
import Footer from '../../components/footer'
import WhatsAppButton from '../../components/whatsappButton'
import AgePopup from '../../components/agePopup'

import './style.scss'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'
import { Link } from 'react-router-dom';


import calculaFrete from '../../functions/CalculaFrete'

function Home() {

    const [data, setData] = useState([]);
    const [dataBanner, setDataBanner] = useState([]);

    const teste = async () => {

        const promisse = calculaFrete()
        // const promisse = await calculaFrete().then(
        //     console.log('promisse', promisse)
        // )

    }

    useEffect(() => {

        teste()

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('items/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setData(temp)

            }
            else {
                console.log("No data available");
            }

        });

    }, []);

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('banners/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataBanner(temp)
                // console.log(temp)

            }
            else {
                console.log("No data available");
            }

        });

    }, []);

    var carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        adaptiveHeight: true,
    };

    return (

        <div className="HomePage">

            <Header />

            <AgePopup />

            <section id="heroSection">
{/* 
                <div className="optionsHero">

                    <span>Tintos</span>
                    <span>Brancos</span>
                    <span>Rosés</span>
                    <span>Espumantes</span>
                    <span>Seco</span>
                    <span>Suave</span>
                    <span>Kits</span>
                    <span>Outros</span>

                </div> */}

                <div className="heroWrapper">

                    <Slider {...carouselSettings}>
                        {/* <div className="sliderImg">
                            <img src={banner} alt="banner dia dos pais" />
                        </div>
                        <div className="sliderImg">
                            <img src={banner2} alt="banner kits" />
                        </div> */}

                        {dataBanner.map((item) => {

                            return(

                            <div className="sliderImg">

                                <img src={item.imageSrc} alt="Banner" />
                                
                            </div>

                            )

                        })}

                    </Slider>

                </div>

            </section>

            <section id="featuredProdutcsSection">

                <div className="featuredProductsText">

                    <h4>Confira alguns de nossos produtos</h4>

                    <Link to='/produtos' className="viewAll">

                        <h4>Ver tudo</h4>
                        <img src={rightArrow} alt="Todos os produtos" />

                    </Link>

                </div>

                <div className="featuredProducts">

                    <div className="featuredProductsCard">

                        <div className="imgFeaturedWrapper">

                            <img src={vinhoImg} alt="Imagem do vinho" />

                        </div>

                        <div className="featuredTag">

                            <h6>Informação</h6>

                        </div>

                        <div className="featuredTextWrapper">

                            <h5>Vinho Periquita tinto</h5>

                            <span>Espanha • Tinto</span>

                        </div>

                    </div>

                    <div className="featuredProductsCard">

                        <div className="imgFeaturedWrapper">

                            <img id="imgVinho" src={vinhoImg2} alt="Imagem do vinho" />

                        </div>

                        <div className="featuredTag">

                            <h6>Informação</h6>

                        </div>

                        <div className="featuredTextWrapper">

                            <h5>Vinho Don Simon</h5>

                            <span>Espanha • Tinto</span>

                        </div>

                    </div>

                    <div className="featuredProductsCard">

                        <div className="imgFeaturedWrapper">

                            <img id="imgVinho" src={vinhoImg3} alt="Imagem do vinho" />

                        </div>

                        <div className="featuredTag">

                            <h6>Informação</h6>

                        </div>

                        <div className="featuredTextWrapper">

                            <h5>Vinho Viñapeña</h5>

                            <span>Espanha • Rosé</span>

                        </div>

                    </div>

                    <div className="featuredProductsCard">

                        <div className="imgFeaturedWrapper">

                            <img id="imgVinho" src={vinhoImg4} alt="Imagem do vinho" />

                        </div>

                        <div className="featuredTag">

                            <h6>Informação</h6>

                        </div>

                        <div className="featuredTextWrapper">

                            <h5>Vinho Anciano</h5>

                            <span>Espanha • Tinto</span>

                        </div>

                    </div>

                </div>

            </section>

            <section id="optionSection">

                <h4>Sinta o sabor de diversos países sem sair de casa</h4>

                <div className="optionsInfos">

                    <div className="optionsWrapper">

                        <img src={mapaLagos} alt="Mapa" />

                    </div>

                    <div className="optionsSelection">

                        <div className="cardsOptionsSelection">

                            <h3>Argentina</h3>

                        </div>
                        <div className="cardsOptionsSelection">

                            <h3>Chile</h3>

                        </div>
                        <div className="cardsOptionsSelection">

                            <h3>Portugal</h3>

                        </div>
                        <div className="cardsOptionsSelection">

                            <h3>Espanha</h3>

                        </div>
                        <div className="cardsOptionsSelection">

                            <h3>França</h3>

                        </div>
                        <div className="cardsOptionsSelection">

                            <h3>Brasil</h3>

                        </div>

                    </div>

                </div>

            </section>

            <WhatsAppButton />
            <Footer />

        </div>

    )

}

export default Home;