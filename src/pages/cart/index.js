import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom'

import InputMask from 'react-input-mask';

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
    const [dataUsers, setDataUsers] = useState([]);
    const [dataVoucher, setDataVoucher] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [finalValue, setFinalValue] = useState(0);
    const [voucherValue, setVoucherValue] = useState(0);
    const [dataAccount, setDataAccount] = useState([]);
    const [dataExists, setDataExists] = useState(false);
    const [userIsLogged, setUserIsLogged] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');
    const [clientNote, setClientNote] = useState('');
    const [displayButtonClear, setDisplayButtonClear] = useState('none');
    const [displayTransport, setDisplayTransport] = useState('none');
    const [displayCepDiv, setDisplayCepDiv] = useState('flex');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [pickupSelect, setPickupSelect] = useState('');
    const [userVoucher, setUserVoucher] = useState('');
    const [userDiscount, setUserDiscount] = useState(0);
    const [transportValue, setTransportValue] = useState(0);
    const [dataProduct, setDataProduct] = useState([]);
    const [customerCep, setCustomerCep] = useState('');
    const [transportData, setTransportData] = useState([]);
    const [selectedTransportData, setSelectedTransportData] = useState({});
    const [displayCepSearch, setDisplayCepSearch] = useState('none');
    const [displayPopup, setDisplayPopup] = useState('none');
    const [choosedVoucher, setChoosedVoucher] = useState('');
    const [displayAddressForms, setDisplayAddressForms] = useState('none');
    const [transportDataVerify, setTransportDataVerify] = useState(false);
    const [purchasedProductData, setPurchasedProductData] = useState([]);

    const [paidForm, setPaidForm] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [redirect, setRedirect] = useState(useHistory());

    const [newDataReceiver, setNewDataReceiver] = useState({

        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        receiverHouseNumber: '',
        receiverComplement: '',
        receiverDistrict: '',
        receiverCity: '',
        receiverCpf: '',

    })

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

            var total = 0

            temp.map((item) => {

                var value = (Number(item.price) * Number(item.amount))
                total = value + total

                setTotalValue(total)
                setFinalValue(total)

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

    useEffect(async () => {

        const verify = await JSON.parse(localStorage.getItem('products'))

        if (verify != null) {

            var temp = Object.keys(verify).map((key) => verify[key])

            let aux = [];

            temp.map((product) => {

                const productInfos = {

                    "id": product.id,
                    "width": product.itemWidth,
                    "height": product.itemHeight,
                    "length": product.itemLength,
                    "weight": product.itemWeight,
                    "insurance_value": product.price,
                    "quantity": product.amount,

                }

                aux.push(productInfos)
                setDataProduct(aux)

            })
        }

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('vouchers/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataVoucher(temp.sort((a, b) => {

                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)

                }))
            }
            else {
                console.log("No data available");
            }
        })

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
                            console.log(item)
                        }

                    })

                } else
                    console.log("No data available");

            })

    }, []);

    function sendOrder() {

        if (userIsLogged) {

            if (selectedPayment !== '' && pickupSelect !== '') {

                if (transportDataVerify === true && pickupSelect !== 'Retirada física') {

                    const id = firebase.database().ref().child('posts').push().key
                    const now = new Date()

                    const dataToSend = {

                        id: id,
                        listItem: data,
                        totalValue: finalValue.toFixed(2),
                        userName: newDataReceiver.receiverName,
                        phoneNumber: newDataReceiver.receiverPhone,
                        address: newDataReceiver.receiverAddress,
                        houseNumber: newDataReceiver.receiverHouseNumber,
                        complement: newDataReceiver.receiverComplement,
                        district: newDataReceiver.receiverDistrict,
                        city: newDataReceiver.receiverCity,
                        cpf: newDataReceiver.receiverCpf,
                        cepNumber: customerCep,
                        paymentType: selectedPayment,
                        clientNote: clientNote,
                        userEmail: dataAccount.email,
                        voucher: choosedVoucher,
                        pickupOption: pickupSelect,
                        paymentProof: '',
                        adminNote: '',
                        requestStatus: '',
                        selectedTransport: selectedTransportData,
                        dateToCompare: new Date().toDateString(),
                        date: `${now.getUTCDate()}/${now.getMonth()}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

                    }

                    firebase.database().ref('requests/' + id).set(dataToSend)
                        .then(() => {
                            setPurchasedProductData(dataToSend)
                            localStorage.setItem('products', '{}')
                        })

                    firebase.database().ref('reportsSales/' + id).set(dataToSend)
                        .then(() => {
                            localStorage.setItem('products', '{}')
                            alert("Pedido finalizado com sucesso!.")
                        })

                    setPaidForm(true)

                } else if (transportDataVerify === true && pickupSelect === 'Retirada física') {

                    const id = firebase.database().ref().child('posts').push().key
                    const now = new Date()

                    const dataToSend = {

                        id: id,
                        listItem: data,
                        totalValue: finalValue.toFixed(2),
                        userName: dataAccount.name,
                        phoneNumber: dataAccount.phoneNumber,
                        address: dataAccount.address,
                        houseNumber: dataAccount.houseNumber,
                        complement: dataAccount.complement,
                        district: dataAccount.district,
                        city: dataAccount.city,
                        cepNumber: dataAccount.cepNumber,
                        paymentType: selectedPayment,
                        clientNote: clientNote,
                        userEmail: dataAccount.email,
                        voucher: choosedVoucher,
                        pickupOption: pickupSelect,
                        paymentProof: '',
                        adminNote: '',
                        requestStatus: '',
                        dateToCompare: new Date().toDateString(),
                        date: `${now.getUTCDate()}/${now.getMonth()}/${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

                    }

                    firebase.database().ref('requests/' + id).set(dataToSend)
                        .then(() => {
                            setPurchasedProductData(dataToSend)
                            console.log('dataToSend', dataToSend)
                            localStorage.setItem('products', '{}')
                        })

                    firebase.database().ref('reportsSales/' + id).set(dataToSend)
                        .then(() => {
                            setPurchasedProductData(dataToSend)
                            localStorage.setItem('products', '{}')
                            alert("Pedido finalizado com sucesso!.")
                        })

                    setPaidForm(true)

                }

                else alert('Você precisa preencher todos os campos!')

            } else alert('Você precisa selecionar todos os campos!')

        }
        else {

            var confirm = window.confirm("Você precisa ter uma conta para finalizar um pedido!")

            if (confirm)
                redirect.push("/Cadastrar")

        }

        return 0;

    }

    useEffect(() => {

        var counter = 0

        newDataReceiver.receiverName != '' ? counter = counter + 1 : counter = counter
        newDataReceiver.receiverPhone != '' ? counter++ : counter = counter
        newDataReceiver.receiverAddress != '' ? counter++ : counter = counter
        newDataReceiver.receiverHouseNumber != '' ? counter++ : counter = counter
        newDataReceiver.receiverComplement != '' ? counter++ : counter = counter
        newDataReceiver.receiverDistrict != '' ? counter++ : counter = counter
        newDataReceiver.receiverCity != '' ? counter++ : counter = counter
        newDataReceiver.receiverCpf != '' ? counter++ : counter = counter

        if (counter == 8) {

            setTransportDataVerify(true)

        } else if (counter !== 8 || pickupSelect !== 'Retirada física') {

            setTransportDataVerify(false)

        }

    }, [newDataReceiver])

    function cleanCart() {

        var confirm = window.confirm('Tem certeza que deseja esvaziar o carrinho?')

        if (confirm) {

            localStorage.setItem('products', null)
            setDataExists(false)
            window.location.reload()

        }

    }

    function verifyVoucher() {

        var verify = false

        dataVoucher.map((item) => {

            if (userVoucher === item.title) {

                verify = true

                setUserDiscount(item.discount)
                setChoosedVoucher(item.title)
                setDisplayCepDiv('none')

                setVoucherValue(totalValue + transportValue - ((totalValue + transportValue) * (item.discount / 100)))
                setFinalValue(totalValue + transportValue - ((totalValue + transportValue) * (item.discount / 100)))

                window.alert('Cupom inserido com sucesso!')

            }

        })

        if (verify === false) {

            window.alert('O cupom inserido é inválido ou não está mais disponível')

        }

    }

    function handleSelectPayment(event) {

        let payment = event.target.value

        setSelectedPayment(payment)

        if (payment === 'Pix') {

            setDisplayPopup('flex')

        } else {

            setDisplayPopup('none')

        }

    }

    function handlePickupSelect(event) {

        const pickup = event.target.value

        setPickupSelect(pickup)

        if (pickup === 'Frete') {

            setDisplayCepSearch('flex');

        } else {

            setDisplayCepSearch('none');

        }

        if (pickup !== 'Retirada física') {

            setDisplayAddressForms('flex');

        } else {

            setDisplayAddressForms('none');
            setTransportDataVerify(true)

        }

    }

    function handleSelectedTransport(item, event) {

        setSelectedTransportData(event)
        console.log(event)
        // const value = finalValue

        setTransportValue(Number(event.custom_price))

        if (voucherValue) {

            setFinalValue(voucherValue + (Number(event.custom_price) - (Number(event.custom_price) * userDiscount / 100)))

        } else {

            setFinalValue(totalValue + Number(event.custom_price))

        }

    }

    function handleClientNote(event) {

        setClientNote(event.target.value)

    }

    function handleInputCep(event) {

        setCustomerCep(event.target.value)

    }

    function handleVoucher(event) {

        setUserVoucher(event.target.value)

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

    function handleInputInfosChange(event) {

        const { name, value } = event.target

        setNewDataReceiver({

            ...newDataReceiver, [name]: value

        })

    }

    function closePopup() {

        setDisplayPopup('none')

    }

    const dataToSend = {
        "from": {
            "postal_code": "28909120"
        },
        "to": {
            "postal_code": customerCep
        },
        "products": dataProduct
    }

    const calculaFrete = async () => {

        await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_BEARER_KEY} `,
                'User-Agent': 'Armazém teste higorb2000@gmail.com'
            },
            body: JSON.stringify(dataToSend)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setTransportData(data)
            setDisplayTransport('flex')
            console.log(data)
        }).catch(err => console.log(err))
    };

    let paypalRef = useRef();

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AVdZOvhSTEekVtepWxObjC6L1Yrm8ng37lrDLna1AbkBBZej8x3KQEiLfZyUhOJ1aqtG0mnddL63lDQX&currency=BRL"
        // script.src = "https://www.paypal.com/sdk/js?client-id=AZAsiBXlnYmk2HXDpGkZgYx7zWvFpak2iKq473EPHi9LrnM2lAbAHIzVaxns_-jmD34dYqpuTSaRFWy0&currency=BRL"
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);

        if (loaded) {

            if (selectedPayment === 'PayPal' || selectedPayment === 'Cartão') {

                if (pickupSelect !== '' && transportDataVerify === true) {

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
                                                    value: finalValue.toFixed(2)
                                                }
                                            }
                                        ]
                                    })
                                },
                                onApprove: async (data, actions) => {

                                    const order = await actions.order.capture();
                                    sendOrder();
                                    setPaidForm(true)

                                },

                            })
                            .render(paypalRef)
                    }, 100)
                } else {
                    window.alert("Você precisa preencher todos os campos antes de finalizar seu pedido")
                }

            }

        }
    })

    if (dataExists) {

        return (

            <>

                <div className="paymentForm">

                    {paidForm ? (

                        <main id="mainPaid">

                            <Header />

                            <section id="purchaseDetails">

                                <div className="receiverDetails">

                                    <h4>Resumo da compra</h4>

                                    <ul>

                                        {

                                            purchasedProductData.id ?

                                                <li><strong>Código de identificação da compra: </strong>{purchasedProductData.id}</li>

                                                :

                                                <li></li>

                                        }

                                        {

                                            purchasedProductData.address ?

                                                <li><strong>Endereço: </strong>{purchasedProductData.address} - {purchasedProductData.houseNumber}, {purchasedProductData.district}</li>

                                                :

                                                <li></li>

                                        }

                                        {

                                            purchasedProductData.paymentType === 'Pix' ?

                                                <>

                                                    <li><strong>Pagamento: </strong>{purchasedProductData.paymentType}</li>
                                                    <span><strong>Chave Pix: </strong>(22) 98112 9219 - Envie seu comprovante em <Link to='/MeusPedidos'>Meus pedidos</Link></span>

                                                </>

                                                :

                                                <li><strong>Pagamento: </strong>{purchasedProductData.paymentType}</li>

                                        }

                                        {

                                            purchasedProductData.voucher ?

                                                <li><strong>Cupom de desconto: </strong>{purchasedProductData.voucher}</li>

                                                :

                                                <li></li>

                                        }

                                        <li><strong>Como deseja receber: </strong>{purchasedProductData.pickupOption}</li>

                                        {

                                            purchasedProductData.selectedTransport ?

                                                <>

                                                    <li><strong>Transportadora: </strong>{purchasedProductData.selectedTransport.company.name} ({purchasedProductData.selectedTransport.name})</li>
                                                    <li><strong>Valor do frete: </strong>R$ {purchasedProductData.selectedTransport.price}</li>
                                                    <li><strong>Prazo de entrega: </strong>{purchasedProductData.selectedTransport.delivery_time} dias úteis após a postagem</li>

                                                </>

                                                :

                                                <li></li>

                                        }

                                    </ul>

                                    {console.log(purchasedProductData)}

                                </div>

                                <div className='purchasedProductsDetails' >

                                    <h4>Você comprou: </h4>

                                    <ul>

                                        {purchasedProductData.listItem ?

                                            (
                                                purchasedProductData.listItem.map((item) => {

                                                    return (

                                                        <div className="purchasedItensInfos">

                                                            <li>

                                                                <div className="purchasedItensImgWrapper">

                                                                    <img src={item.imageSrc} alt="Imagem do produto" />

                                                                </div>

                                                                <div className="itensText">

                                                                    <span><strong>{item.title}</strong> ({item.amount})</span>

                                                                    {

                                                                        item.desc ?

                                                                            <span>{item.desc}</span>

                                                                            :

                                                                            <span></span>

                                                                    }

                                                                    <span>{item.country} • {item.sweetness} • {item.type}</span>

                                                                </div>

                                                            </li>

                                                        </div>

                                                    )

                                                })
                                            )

                                            :

                                            (
                                                <p></p>
                                            )

                                        }

                                    </ul>

                                    <h4>Valor total: R$ {purchasedProductData.totalValue}</h4>

                                </div>

                            </section>

                            <Footer />

                        </main>


                    ) : (

                        <>

                            <section id="CartSection">

                                <div style={{ display: displayPopup }} className='popupWrapper'>

                                    <div className='popupContent'>

                                        <h3>Finalize seu pedido e realize o pagamento para a chave apresentada na descrição de sua compra</h3>
                                        <h4>Após isso, envie seu comprovante através da seção "meus produtos" em seu perfil.</h4>

                                        <button onClick={() => closePopup()}>Confirmar</button>

                                    </div>

                                </div>

                                <Header />

                                <div className="cartPage">

                                    <div className="cartIntro">

                                        <h3>Após revisar os itens, clique no botão de finalizar para prosseguir com a sua compra</h3>

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

                                                            <div className="adjustItens">

                                                                <div className="descriptionProductCart">

                                                                    <h4>{item.title}</h4>

                                                                    <p>{item.desc}</p>

                                                                    <span>{item.country} • {item.type} • {item.sweetness} </span>

                                                                </div>

                                                                <div className="adjustItens2">
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

                                                        </div>

                                                    </div>
                                                )

                                            })
                                        }

                                        <div className="cartProductsFinal">

                                            <button style={{ display: displayButtonClear }} onClick={() => cleanCart()}>Esvaziar carrinho</button>

                                            <h3>Valor total: R$ {finalValue.toFixed(2)}</h3>

                                            {userDiscount ?

                                                <>
                                                    <h3>Desconto: {userDiscount}%</h3>
                                                </>

                                                :

                                                <h3></h3>

                                            }

                                        </div>

                                    </section>

                                    <div className="finishOrder">

                                        <div style={{ display: displayCepDiv }} className="cepInputDiv">

                                            <label for="voucherInput">Inserir cupom de desconto</label>

                                            <input onChange={handleVoucher} id="voucherInput" placeholder="Cupom" />

                                            <button onClick={() => verifyVoucher()}>Inserir cupom</button>

                                        </div>

                                        <input className="clientNoteInput" onChange={handleClientNote} placeholder='Observação sobre seu pedido (opcional)' />

                                        <select className="pickupSelect" onChange={handlePickupSelect} >

                                            <option value=''>Selecione como deseja receber sua encomenda</option>
                                            <option value="Motoboy" >Entrega por motoboy (apenas região)</option>
                                            <option value="Frete" >Entrega por transportadora</option>
                                            <option value="Retirada física" >Retirada em ponto físico</option>

                                        </select>

                                        {/* <input style={{ display: displayCepSearch }} onChange={handleInputCep} placeholder="CEP" /> */}
                                        <label style={{ display: displayCepSearch }} for="cepNumber">Insira o CEP abaixo</label>
                                        <InputMask id="cepNumber" name='cepNumber' type='text' mask="99999-999" maskChar="" style={{ display: displayCepSearch }} onChange={handleInputCep} placeholder="CEP" />

                                        <button style={{ display: displayCepSearch }} onClick={() => { calculaFrete() }}>Calcular frete</button>

                                        <div className="transportInfos" style={{ display: displayTransport }}>

                                            <h1>Selecione a opção de envio abaixo</h1>

                                            {transportData.map((item, index) => {

                                                if (item.id === 1 || item.id === 2 || item.id === 3) {

                                                    if (!item.error) {

                                                        return (

                                                            <div className="optionsTransport">

                                                                <div className="radioButton">

                                                                    <input onClick={(e) => handleSelectedTransport(e, item, index)} type="radio" name="selectedTransport" key={item.id} value={item.name} />

                                                                </div>

                                                                <div className="transportLogoWrapper">

                                                                    <img src={item.company.picture} alt={item.company.name} />

                                                                </div>

                                                                <div className="textTransportInfos">

                                                                    <span>{item.company.name} ({item.name})</span>
                                                                    <span><strong>R$ {item.custom_price}</strong></span>
                                                                    <span>Prazo de entrega: <strong>{item.custom_delivery_time} dias úteis</strong></span>

                                                                </div>

                                                            </div>

                                                        )
                                                    }
                                                }

                                            })}

                                        </div>

                                        <div style={{ display: displayAddressForms }} className="transportDiv">

                                            <h2>Insira os dados para entrega abaixo</h2>

                                            <div className="userInfos">

                                                <input name='receiverName' onChange={handleInputInfosChange} placeholder='Nome do destinatário' value={newDataReceiver.receiverName} />

                                                {/* <input name='receiverPhone' onChange={handleInputInfosChange} placeholder='Telefone' value={newDataReceiver.receiverPhone} /> */}
                                                <InputMask
                                                    id="receiverPhone"
                                                    name='receiverPhone'
                                                    type='text'
                                                    mask="(99) 99999-9999"
                                                    maskChar=""
                                                    onChange={handleInputInfosChange}
                                                    placeholder='Telefone'
                                                    value={newDataReceiver.receiverPhone}
                                                />

                                                <input name='receiverAddress' onChange={handleInputInfosChange} placeholder='Endereço de entrega' value={newDataReceiver.receiverAddress} />

                                                <input name='receiverHouseNumber' onChange={handleInputInfosChange} placeholder='Número da residência' value={newDataReceiver.receiverHouseNumber} />

                                                <input name='receiverComplement' onChange={handleInputInfosChange} placeholder='Complemento' value={newDataReceiver.receiverComplement} />

                                                <input name='receiverDistrict' onChange={handleInputInfosChange} placeholder='Bairro' value={newDataReceiver.receiverDistrict} />

                                                <input name='receiverCity' onChange={handleInputInfosChange} placeholder='Cidade' value={newDataReceiver.receiverCity} />

                                                {/* <input name='receiverCpf' onChange={handleInputInfosChange} placeholder='CPF' value={newDataReceiver.receiverCpf} /> */}
                                                <InputMask
                                                    id="receiverCpf"
                                                    name='receiverCpf'
                                                    type='text'
                                                    mask="999.999.999-99"
                                                    maskChar=""
                                                    onChange={handleInputInfosChange}
                                                    placeholder='CPF'
                                                    value={newDataReceiver.receiverCpf}
                                                />

                                            </div>

                                        </div>

                                        <select className="paymentSelect" onChange={handleSelectPayment} >

                                            <option value=''>Selecione o tipo de pagamento</option>
                                            <option value="Dinheiro" >Dinheiro (apenas para entregas na região)</option>
                                            <option value="Débito (máquina)" >Cartão de débito (máquina)</option>
                                            <option value="Crédito (máquina)" >Cartão de crédito (máquina)</option>
                                            <option value="PayPal" >PayPal </option>
                                            <option value="Cartão" >Cartão </option>
                                            <option value="Pix" >Pix</option>

                                        </select>

                                        <div className="paypalButtons" ref={v => (paypalRef = v)} />

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

                <div className="emptyCart" style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }} >
                    <h2>Seu carrinho de compras está vazio 😧 </h2>
                </div>

                <Footer />

            </div>

        )

    }
}

export default Cart