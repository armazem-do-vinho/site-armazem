import React from 'react'
import { useEffect, useState } from 'react'
import "./style.scss";

import firebase from 'firebase/app'
import 'firebase/auth'
import FirebaseConfig from '../../FirebaseConfig.js'

function ModalCountries(props) {

    const { displayProperty, modalDataCountries } = props;

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        firebase.database().ref('aboutCards').get('/aboutCards')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                }
                else {
                    console.log("No data available");
                }
            })

    }, [])

    return (

        <div style={{ display: displayProperty }} className='modalCountries' >

            <main>

                <div className="countryInfos">

                    <div className="imgFlagWrapper">

                        <img src={modalDataCountries.imageSrc} alt="Bandeira do país" />

                    </div>

                    <h2>{modalDataCountries.country}</h2>

                    <p>{modalDataCountries.desc}</p>

                </div>

            </main>

        </div>

    )
}

export default ModalCountries;