import { React } from 'react';
import { useState, useEffect } from 'react';

import Slider from "react-slick";

import rightArrow from '../../img/right-arrow.svg'

import vinhoImg from '../../img/vinho_periquita_tinto.png'
import vinhoImg2 from '../../img/vinho tinto.png'
import vinhoImg3 from '../../img/vinho rosé.png'
import vinhoImg4 from '../../img/vinho tinto 2.png'
import mapaLagos from '../../img/mapa.png';

import Header from '../../components/header'
import Footer from '../../components/footer'

import WhatsAppButton from '../../components/whatsappButton'
import AgePopup from '../../components/agePopup'
import ModalCountries from '../../components/modalCountries'

import './style.scss'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'
import { Link } from 'react-router-dom';

// import calculaFrete from '../../functions/CalculaFrete'

function Home() {

    const [data, setData] = useState([]);
    const [dataBanner, setDataBanner] = useState([]);
    const [displayModal, setDisplayModal] = useState("none");
    const [modalDataCountries, setModalDataCountries] = useState({});

    // const teste = async () => {

    //     const promisse = calculaFrete()
    //     // const promisse = await calculaFrete().then(
    //     //     console.log('promisse', promisse)
    //     // )

    // }

    useEffect(() => {

        // teste()

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

     function handleModalInfos(item) {

        setModalDataCountries(item)
        window.scrollTo(0, 0);
        displayModal === "none" ? setDisplayModal("flex") : setDisplayModal("none")

    }

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

                            return (

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

            <section id="homeText">

                <div className="leftSideHomeText">

                    <h1>Brinde os bons momentos!</h1>
                    <h1>Brinde com Armazém</h1>

                </div>

                <div className="rightSideHomeText">

                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.</p>

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

{/*                             
                <div style={{ display: displayModal }} role="dialog" className='divModalUser' >
    
                    <span onClick={closeModal}>X</span>
                    <ModalCountries displayProperty={displayModal} modalDataUsers={modalDataCountries} />
    
                </div> */}

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

            <section id="infosSection">

                <div className="infosPromoWrapper">
                    <h2>Nossa recomendação para você</h2>

                    <div className="textVinho">
                        <h3>Anciano</h3>
                        <p>Espanha • Tinto</p>
                    </div>
                    <div className="imageVinho">
                        <img src={vinhoImg4} alt="a" />
                    </div>
                    


                </div>

                <div className="infosHighlightWrapper">
                    <div className="infosCard">
                        <h3>Qualidade máxima</h3>
                        <p>Produtos selecionados a dedo</p>
                    </div>

                    <div className="infosCard">
                        <h3>O melhor para você</h3>
                        <p>Brindando todos os seus momentos</p>
                    </div>
                </div>

            </section>

            <WhatsAppButton />
            <Footer />

        </div>

    )

}

export default Home;