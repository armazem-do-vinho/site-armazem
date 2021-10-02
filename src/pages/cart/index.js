import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom'

import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'

import trashCan from '../../img/trash.svg'

function Cart() {

    const [data, setData] = useState([]);
    const [seller, setSeller] = useState([]);
    const [dataUsers, setDataUsers] = useState([]);
    const [isSeller, setIsSeller] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [dataAccount, setDataAccount] = useState([]);
    const [dataExists, setDataExists] = useState(false);
    const [userIsLogged, setUserIsLogged] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');
    const [clientNote, setClientNote] = useState('');
    const [displayButtonClear, setDisplayButtonClear] = useState('none');
    const [selectedPayment, setSelectedPayment] = useState('');

    const [paidFor, setPaidForm] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [redirect, setRedirect] = useState(useHistory());

    function onAuthStateChanged(user) {

        firebase.auth().onAuthStateChanged((user) => {
            if (user)
                setUserIsLogged(true)
        });

    }

    useEffect(async () => {

        const verify = await JSON.parse(localStorage.getItem('products'))

        if (verify !== null) {

            var temp = Object.keys(verify).map((key) => verify[key])

            setData(temp)
            setDataExists(true)
            setDisplayButtonClear('block')

            console.log(verify)

            var total = 0

            temp.map((item) => {

                var value = (Number(item.price) * Number(item.amount))
                total = value + total

                setTotalValue(total)
            })

        }
        else
            setDataExists(false)

    }, [])

    useEffect(() => {

        window.scrollTo(0, 0);

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);
        onAuthStateChanged()

    }, [])

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

        firebase.database().ref('sellers/').get('/sellers')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                    temp.map((item) => {

                        if (item.email === userEmail) {
                            setSeller(item)
                            setIsSeller(true)
                        }

                    })

                } else
                    console.log("No data available");

            })

    }, []);

    function sendOrder() {

        if (userIsLogged) {

            if (selectedPayment !== '') {

                const id = firebase.database().ref().child('posts').push().key
                const now = new Date()

                const dataToSend = {

                    id: id,
                    listItem: data,
                    totalValue: totalValue.toFixed(2),
                    userName: dataAccount.name,
                    phoneNumber: dataAccount.phoneNumber,
                    address: dataAccount.address,
                    houseNumber: dataAccount.houseNumber,
                    district: dataAccount.district,
                    cepNumber: dataAccount.cepNumber,
                    complement: dataAccount.complement,
                    paymentType: selectedPayment,
                    clientNote: clientNote,
                    userEmail: dataAccount.email,
                    // adminNote: '',
                    dateToCompare: new Date().toDateString(),
                    date: `${now.getUTCDate()}/${now.getMonth()}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

                }

                firebase.database().ref('requests/' + id).set(dataToSend)
                    .then(() => {
                        localStorage.setItem('products', '{}')
                    })

                firebase.database().ref('reportsSales/' + id).set(dataToSend)
                    .then(() => {
                        localStorage.setItem('products', '{}')
                        alert("Pedido finalizado com sucesso!.")
                    })

            } else alert('Você precisa selecionar o tipo de pagamento!')

        }
        else {

            var confirm = window.confirm("Você precisa ter uma conta para finalizar um pedido!.")

            if (confirm)
                redirect.push("/Cadastrar")

        }

        return 0;

    }

    function sendOrderPaypal() {

        if (userIsLogged) {

                const id = firebase.database().ref().child('posts').push().key
                const now = new Date()

                const dataToSend = {

                    id: id,
                    listItem: data,
                    totalValue: totalValue.toFixed(2),
                    userName: dataAccount.name,
                    phoneNumber: dataAccount.phoneNumber,
                    address: dataAccount.address,
                    houseNumber: dataAccount.houseNumber,
                    district: dataAccount.district,
                    cepNumber: dataAccount.cepNumber,
                    complement: dataAccount.complement,
                    paymentType: 'Paypal',
                    clientNote: clientNote,
                    userEmail: dataAccount.email,
                    // adminNote: '',
                    dateToCompare: new Date().toDateString(),
                    date: `${now.getUTCDate()}/${now.getMonth()}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

                }

                firebase.database().ref('requests/' + id).set(dataToSend)
                    .then(() => {
                        localStorage.setItem('products', '{}')
                    })

                firebase.database().ref('reportsSales/' + id).set(dataToSend)
                    .then(() => {
                        localStorage.setItem('products', '{}')
                        alert("Pedido finalizado com sucesso!.")
                    })

        }
        else {

            var confirm = window.confirm("Você precisa ter uma conta para finalizar um pedido!.")

            if (confirm)
                redirect.push("/Cadastrar")

        }

        return 0;

    }

    function sendOrderSeller() {

        const id = firebase.database().ref().child('posts').push().key

        firebase.database().ref('requests/' + id).set({

            id: id,
            listItem: data,
            totalValue: totalValue.toFixed(2),
            userName: dataUsers[selectedClient].name,
            phoneNumber: dataUsers[selectedClient].phoneNumber,
            street: dataUsers[selectedClient].street,
            houseNumber: dataUsers[selectedClient].houseNumber,
            district: dataUsers[selectedClient].district,
            cepNumber: dataUsers[selectedClient].cepNumber,
            complement: dataUsers[selectedClient].complement,
            paymentType: selectedPayment,
            seller: seller.name

        }).then(() => {
            localStorage.setItem('products', '[{}]')
            alert("Pedido finalizado com sucesso!.")
        })

    }

    function cleanCart() {

        var confirm = window.confirm('Tem certeza que deseja esvaziar o carrinho?')

        if (confirm) {

            localStorage.setItem('products', null)
            setDataExists(false)
            window.location.reload()

        }

    }

    function handleSelectPayment(event) {

        setSelectedPayment(event.target.value)

    }

    function handleSelectedClient(event) {

        setSelectedClient(event.target.value)

    }

    function handleClientNote(event) {

        setClientNote(event.target.value)

    }

    function removeItemInCart(index) {

        var confirm = window.confirm('Tem certeza que deseja remover este item ?')

        if (confirm) {

            data.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(data))
            window.location.reload()

            // localStorage.setItem('totalValue', totalValue.toFixed(2))

        }

    }

    let paypalRef = useRef();

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AZAsiBXlnYmk2HXDpGkZgYx7zWvFpak2iKq473EPHi9LrnM2lAbAHIzVaxns_-jmD34dYqpuTSaRFWy0&currency=BRL"
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);

        if (loaded) {

            setTimeout(() => {

                window.paypal
                    .Buttons({

                        createOrder: (data, actions) => {

                            return actions.order.create({
                                purchase_units: [
                                    {
                                        // description: product.description,
                                        amount: {
                                            currency_code: "BRL",
                                            value: totalValue
                                        }
                                    }
                                ]
                            })
                        },
                        onApprove: async (data, actions) => {

                            const order = await actions.order.capture();
                            setPaidForm(true)
                            sendOrderPaypal();

                        },

                    })
                    .render(paypalRef)
            })
        }
    })

    if (dataExists) {

        return (

            <>

                <div className="paymentForm">

                    {paidFor ? (

                        <main>

                            <section id="purchaseDetails">

                                <h1>Compra confirmada com sucesso!</h1>

                                    <div className="purchaseWrapper">

                                        <h5>Detalhes da compra</h5>

                                        <table>

                                            <tr>

                                                <td>Produto</td>
                                                <td>Quantidade</td>
                                                <td>Valor</td>

                                            </tr>

                                            <tr>

                                                <td>A</td>
                                                <td>3</td>
                                                <td>44,55</td>

                                            </tr>

                                        </table>

                                        <h3>Total: R$ 999,99</h3>

                                    </div>

                            </section>

                        </main>


                    ) : (

                        <>

                            <section id="CartSection">

                                <Header />

                                <div className="cartPage">

                                    <div className="cartIntro">

                                        <h3>Após revisar os itens, clique no botão para prosseguir com a sua compra</h3>

                                    </div>

                                    <section id='SectionCartProducts'>

                                        {
                                            data.map((item, index) => {

                                                return (

                                                    <div className="showCartContainer">

                                                        <div className="showProductCardCart">

                                                            <div className="imageProductWrapperCart">

                                                                <img src={item.imageSrc} alt="" />

                                                            </div>

                                                            <div className="descriptionProductCart">

                                                                <h4>{item.title}</h4>

                                                                <p>{item.desc}</p>

                                                                <span>{item.country} • {item.type} • {item.sweetness} </span>

                                                            </div>

                                                            <div className='priceProductCard'>

                                                                <h5>Quantidade: {item.amount}</h5>
                                                                <h4>Valor: R$ {((item.price) * item.amount).toFixed(2)}</h4>

                                                            </div>

                                                            <div className="trashCanWrapper">

                                                                <img
                                                                    src={trashCan}
                                                                    className="imgRemoveIconCart"
                                                                    alt='Remover item'
                                                                    onClick={() => {
                                                                        removeItemInCart(index)
                                                                    }}
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>
                                                )

                                            })
                                        }

                                        <div className="cartProductsFinal">

                                            <button style={{ display: displayButtonClear }} onClick={() => cleanCart()}>Esvaziar carrinho</button>

                                            <h3>Valor total: R$ {totalValue.toFixed(2)}</h3>

                                        </div>

                                    </section>

                                    <div className="finishOrder">

                                        <select className="paymentSelect" onChange={handleSelectPayment} >

                                            <option value=''>Selecione o tipo de pagamento</option>
                                            <option value="Dinheiro" >Dinheiro</option>
                                            <option value="Débito" >Cartão de débito (máquina)</option>
                                            <option value="Crédito" >Cartão de crédito (máquina)</option>
                                            <option value="Pix" >PIX</option>

                                        </select>

                                        <h3>Pague com PayPal sem sair do conforto de sua casa</h3>

                                        <div className="paypalButtons" ref={v => (paypalRef = v)} />

                                        <input className="clientNoteInput" onChange={handleClientNote} placeholder='Escreva aqui alguma observação sobre seu pedido (opcional)' />

                                    </div>

                                    <div className='checkOut' >

                                        <Link to='/produtos'>Continuar comprando</Link>

                                        <button onClick={() => sendOrder()} >Finalizar pedido</button>

                                    </div>

                                </div>

                                <Footer />

                            </section>
                        </>

                    )


                    }
                </div>
            </>
        )

    } else {

        return (

            <div className="CartPage">

                <Header />

                <div className="emptyCart" style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    <h2>Seu carrinho de compras está vazio 😧 </h2>
                </div>

                <Footer />

            </div>

        )

    }
}

export default Cart