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
    const [paymentFile, setPaymentFile] = useState('');

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

    function sendPaymentProof(requestIndex) {

        if (paymentFile !== '') {

            const newRequestData = {

                address: requestData[requestIndex].address,
                adminNote: requestData[requestIndex].adminNote,
                cepNumber: requestData[requestIndex].cepNumber,
                city: requestData[requestIndex].city,
                clientNote: requestData[requestIndex].clientNote,
                complement: requestData[requestIndex].complement,
                cpf: requestData[requestIndex].cpf,
                date: requestData[requestIndex].date,
                dateToCompare: requestData[requestIndex].dateToCompare,
                district: requestData[requestIndex].district,
                houseNumber: requestData[requestIndex].houseNumber,
                id: requestData[requestIndex].id,
                listItem: requestData[requestIndex].listItem,
                paymentProof: paymentFile,
                paymentType: requestData[requestIndex].paymentType,
                phoneNumber: requestData[requestIndex].phoneNumber,
                pickupOption: requestData[requestIndex].pickupOption,
                requestStatus: requestData[requestIndex].requestStatus,
                selectedTransport: requestData[requestIndex].selectedTransport,
                totalValue: requestData[requestIndex].totalValue,
                userEmail: requestData[requestIndex].userEmail,
                userName: requestData[requestIndex].userName,
                voucher: requestData[requestIndex].voucher,

            }
            firebase.database()
                .ref('requests/' + requestData[requestIndex].id)
                .update(newRequestData)
                .then(() => alert("Comprovante enviado com sucesso!"))

            setPaymentFile('')

        } else {

            window.alert("Comprovante não enviado. Aguarde alguns segundos e tente novamente. Se o error persistir, verifique o formato do arquivo inserido ou sua conexão.")

        }

    }

    function uploadPaymentProof(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('paymentProofs/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setPaymentFile(url))
            });

    }

    return (

        <main>

            <Header />

            <section className="requestsSection">

                <SideBar />

                <div className="requestsData">

                    <h3>Informações dos pedidos</h3>

                    <div>

                        {requestData.map((request, requestIndex) => {

                            return <>

                                {request.listItem != undefined ?

                                    <div className="boxRequestsList">

                                        <div className="controlInfos">

                                            <span><b>ID do pedido:</b> {request.id}</span>

                                            <span><b>Pedido realizado em:</b> {request.date.slice(0, -3)}h</span>

                                            <ul>

                                                {

                                                    request.address ?

                                                        <li><strong>Endereço: </strong>{request.address} - {request.houseNumber}, {request.district}</li>

                                                        :

                                                        <li></li>

                                                }

                                                <li><strong>Como deseja receber: </strong>{request.pickupOption}</li>

                                                {

                                                    request.selectedTransport ?

                                                        <li><strong>Transportadora: </strong>{request.selectedTransport}</li>

                                                        :

                                                        <li></li>

                                                }


                                            </ul>

                                            {

                                                request.requestStatus ?

                                                    (
                                                        <span><b>Status do pedido:</b> {request.requestStatus}</span>
                                                    ) :

                                                    (
                                                        <span><b>Status do pedido:</b> Aguardando</span>
                                                    )

                                            }


                                            {

                                                request.adminNote ?

                                                    <span><b>Recado do Armazém: </b>{request.adminNote}</span>

                                                    :

                                                    <p></p>

                                            }

                                        </div>

                                        <div className="requestItensWrapper">

                                            {request.listItem.map((item) => {

                                                return (

                                                    <div className="requestItens">

                                                        <b>{item.title} <span>({item.amount}) - R$ {Number(item.price).toFixed(2)} </span></b>

                                                    </div>

                                                )

                                            })}

                                            <h3>Valor total: <strong>R$ {request.totalValue}</strong></h3>
                                            <h3>Forma de pagamento: <strong> {request.paymentType}</strong></h3>

                                            {

                                                request.paymentType === 'Pix' ?

                                                    <div className="selectedPaymentInfos">

                                                        <span>Inserir comprovante</span>
                                                        <input type='file' onChange={uploadPaymentProof} accept="image/png, image/jpeg, application/pdf" placeholder='Comprovante' />
                                                        <button onClick={() => { sendPaymentProof(requestIndex) }}>Enviar comprovante</button>

                                                    </div>

                                                    :

                                                    <p></p>

                                            }

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