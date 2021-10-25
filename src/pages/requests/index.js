import { React } from 'react'
import { useEffect, useState } from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../FirebaseConfig.js'

import SideBar from '../../components/sideBar'

function Requests() {

    const [requestData, setRequestData] = useState([{}]);

    useEffect(() => {

        const userEmail = localStorage.getItem('userEmail')

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig)

        firebase.database().ref('requests/').get('/requests')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])
                    var requestDataTemp = []

                    temp.map((item) => {

                        if (item.userEmail == userEmail)
                            requestDataTemp.push(item)

                    })
                    setRequestData(requestDataTemp)

                } else {
                    console.log("No data available");
                }
            })

    }, []);

    return (

        <main>

            <Header />

            <section className="requestsSection">

                <SideBar />

                <div className="requestsData">

                    <h3>Informações dos pedidos</h3>

                    <div>

                        {requestData.map((request) => {

                            return <>

                                {request.listItem != undefined ?

                                    <div className="boxRequestsList">

                                        <h4><span>ID do pedido: {request.id}</span></h4>

                                        <div className="requestItensWrapper">

                                        {request.listItem.map(item => {

                                            return (

                                                <>


                                                    <div className="requestItens">

                                                        <b>{item.title} <span>({item.amount}) - R$ {item.price} </span></b>

                                                    </div>


                                                </>

                                            )

                                        })}

                                    <h3>Valor total: R$ {request.totalValue}</h3>

                                    </div>

                                    </div>

                                    : <p></p>}
                            </>

                        })}

                    </div>

                </div>

            </section>

            <Footer />

        </main>

    )

}

export default Requests;