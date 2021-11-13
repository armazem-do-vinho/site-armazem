import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../../FirebaseConfig.js'

import DeliveryModal from '../../../components/modalDelivery'

import closeIcon from '../../../img/removeIconWhite.png'

function Request() {

    const [dataAdmin, setDataAdmin] = useState([])
    const [selectItem, setSelectItem] = useState('')
    const [noteAdmin, setNoteAdmin] = useState('')
    const [displayModal, setDisplayModal] = useState("none");
    const [heightPageWhenOpenModal, setHeightPageWhenOpenModal] = useState(0)
    const [modalData, setModalData] = useState({});

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('requests/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                console.log(temp)
                setDataAdmin(temp)

            }

        });

    }, [])

    function handleIdSelected(event) {

        setSelectItem(event.target.value)

    }

    function finishOrder() {

        firebase.database()
            .ref('requests/' + selectItem)
            .remove()
            .then(() => alert("Pedido finalizado com sucesso!"))

    }

    function removeItemOfClient(indexItem,indexListItem) {

        var dataTemp = dataAdmin
        var item = dataTemp[indexItem]

        var confirm = window.confirm("Tem certeza que deseja remover este item?")

        if(confirm) {

            const totalValue = Number(item.totalValue)
            const productPrice = Number(item.listItem[indexListItem].price)
            const productAmount = Number(item.listItem[indexListItem].amount)
            const newTotalValue = ( totalValue - (productPrice * productAmount))
            
            // console.log(newTotalValue)
            item.listItem.splice(indexListItem,1)

            firebase.database()
            .ref('requests/' + dataTemp[indexItem].id)
            .update({

                id: item.id,
                listItem:  item.listItem,
                totalValue: newTotalValue,
                userName:  item.userName,
                phoneNumber: item.phoneNumber,
                address: item.address,
                houseNumber: item.houseNumber,
                district:  item.district,
                cepNumber:  item.cepNumber,
                complement: item.complement,
                paymentType: item.paymentType,
                clientNote: item.clientNote,
                userEmail: item.userEmail,
                adminNote: item.adminNote

            }).then(()=>{
                alert('Item removido com sucesso')
            })
            
        }

    }

    function handleModalInfos(item) {

        setModalData(item)
        setHeightPageWhenOpenModal(document.body.getBoundingClientRect().top)
        window.scrollTo(0, 0);
        displayModal === "none" ? setDisplayModal("flex") : setDisplayModal("none")

    }

    function handleInputNote(event) {

        setNoteAdmin(event.target.value)

    }

    function closeModal() {

        if (displayModal === "none")
            setDisplayModal("flex")
        else {
            window.scrollTo(-heightPageWhenOpenModal, - heightPageWhenOpenModal)
            setDisplayModal("none");
        }
    }

    function sendNoteAdmin(indexItem) {

        var dataTemp = dataAdmin

        firebase.database()
        .ref('requests/' + dataTemp[indexItem].id)
        .update({

            id: dataTemp[indexItem].id,
            listItem: dataTemp[indexItem].listItem,
            totalValue: dataTemp[indexItem].totalValue,
            userName: dataTemp[indexItem].userName,
            phoneNumber: dataTemp[indexItem].phoneNumber,
            address: dataTemp[indexItem].address,
            houseNumber: dataTemp[indexItem].houseNumber,
            district: dataTemp[indexItem].district,
            cepNumber: dataTemp[indexItem].cepNumber,
            complement: dataTemp[indexItem].complement,
            paymentType: dataTemp[indexItem].paymentType,
            clientNote: dataTemp[indexItem].clientNote,
            userEmail: dataTemp[indexItem].userEmail,
            adminNote: noteAdmin


        }).then(()=>{
            alert("Recado enviado!")
        })
        setNoteAdmin('')

    }

    const [loginData,setLoginData] = useState({

        email: '',
        password: ''

    })
    const [userIsLogged, setUserIsLogged] = useState(false);


    function makeLogin () {

        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
        .then(() => {

            var userEmail = localStorage.getItem('userEmail')
        
            firebase.database().ref('admins').get('/admins')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                    temp.map((item) => {

                        if(item.email === userEmail)
                            setUserIsLogged(true)

                    })
                }
                else {
                    console.log("No data available");
                }
            })
            
            
            localStorage.setItem('userEmail',loginData.email)

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        }); 
        
    }

    function handleInputLoginChange(event) {

        const {name, value} = event.target

        setLoginData ({

            ...loginData, [name]: value

        })
        
    }

    useEffect(() => {

        var userEmail = localStorage.getItem('userEmail')
        
        firebase.database().ref('admins').get('/admins')
        .then(function (snapshot) {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])

                temp.map((item) => {

                    if(item.email === userEmail)
                        setUserIsLogged(true)

                })
            }
            else {
                console.log("No data available");
            }
        })

    }, []);

    if (userIsLogged) {
        return (

            <div className='Request'>
    
                <Header />
    
                <div style={{ display: displayModal }} tabindex="-1" role="dialog" className='modalDelivery' >
                    <span onClick={closeModal}>X</span>
                    <DeliveryModal displayProperty={displayModal} modalData={modalData} />
                </div>
    
                <main id='mainRequest' >
    
                    {dataAdmin.map((item, indexItem) => (
    
                        <div className="boxOrder">
    
                            <div className="leftSizeBoxOrder" >
    
                                <div className="rowItens">
                                    <p>Nome:</p>
                                    <b>{item.userName}</b>
                                </div>
    
                                <div className="rowItens">
                                    <p>Telefone: </p>
                                    <b>{item.phoneNumber}</b>
                                </div>
    
                                <div className="rowItens">
                                    <p>Rua:</p>
                                    <b>{item.address}</b>
                                </div>
    
                                <div className="rowItens">
                                    <p>Bairro:</p>
                                    <b>{item.district}</b>
                                </div>
    
                                <div className="rowItens">
                                    <p>Número da casa:</p>
                                    <b>{item.houseNumber}</b>
                                </div>
    
                                <div className="rowItens">
                                    <p>CEP:</p>
                                    <b>{item.cepNumber}</b>
                                </div>
    
                            </div>
    
                            <div className="rightSizeBoxOrder" >
    
                                {item.seller !== undefined ? <p>Vendedor: {item.seller}</p> : ''}
    
                                <p>Itens:</p>
    
                                <ul>
    
                                    { 
                                        item.listItem.length > 1 ?
    
                                            item.listItem.map((item, indexListItem) => (
    
                                                <div className='flexDisplayRequestPage' >
    
                                                    <li><b>{item.title}</b> ({item.amount})</li>
    
                                                    <img src={closeIcon}
                                                        className="imgRemoveIconCart"
                                                        alt='opção de remover item'
                                                        onClick={() => {
                                                            removeItemOfClient(indexItem,indexListItem)
                                                        }}
                                                    />
    
                                                </div>
    
                                            ))
                                        :
                                            <div className='flexDisplayRequestPage' >
    
                                                <li><b>{item.listItem[0].title}</b> ({item.listItem[0].amount})</li>
    
                                                <img src={closeIcon}
                                                    className="imgRemoveIconCart"
                                                    alt='opção de remover item'
                                                    onClick={() => {
                                                        removeItemOfClient(indexItem,0)
                                                    }}
                                                />
    
                                            </div>
                                                
                                    }
    
                                </ul>
    
                                <p>Tipo de pagamento: <b>{item.paymentType}</b></p>
    
                                {
    
                                    item.clientNote !== '' ?
                                        <p>Observações do cliente: <b>{item.clientNote}</b></p>
                                        : ''
    
                                }
    
                                <p>ID do pedido: <b>{item.id}</b></p>
                                <p>Valor Total: <b>R$ {Number(item.totalValue).toFixed(2)}</b></p>
                                
                                {
                                    item.deliveryman !== undefined ?
                                    <p>Entregador: <b>{item.deliveryman}</b></p>
                                    : ''
    
                                }
    
                                {
    
                                item.adminNote !== '' ?
                                    <p>Observações do Armazém: <b>{item.adminNote}</b></p>
                                    : ''
    
                                }
    
                                <div className="clientMessage">
                                    <input 
                                        placeholder='Recado para cliente'
                                        onChange={handleInputNote} 
                                    />
                                        
                                    <div className="sendMessage"> 
                                        <a onClick={()=>{sendNoteAdmin(indexItem)}} >Enviar Recado</a>
                                        {/* <a onClick={() => { handleModalInfos(item) }}>Designar Entregador</a> */}
                                    </div>
                                </div>
    
                            </div>
    
                        </div>
    
                    ))}
    
                    <div className="finalizarPedido">
                        <h3 className="texTripRequest" >Finalizar pedido</h3>
    
                        <select onChange={handleIdSelected} className="selectFinishOrder" >
    
                            <option className="optionSelectOrder" >Selecionar</option>
    
                            {dataAdmin.map((item) => (
                                <option className="optionSelectOrder" value={item.id} key={item.id}>{item.userName.split(' ')[0]}: {item.id}</option>
                            ))}
    
                        </select>
    
                        <a className="finishButton" onClick={() => finishOrder()} >Finalizar</a>
                    </div>
    
                </main>
    
                <Footer />
            </div>
    
        )
    } else {

        return (

            <div className='Admin'>

                <Header />

                    <main id='mainRegister'> 

                        <div className='adminRegister'>

                            <div className='titleAdmin' >
                                <h1>Bem vindos, equipe Armazém do Vinho 🍷</h1>
                            </div>

                            <fieldset>

                                <h1>Entrar</h1>

                                <input name='email' onChange={handleInputLoginChange} placeholder='E-mail' />

                                <input name='password' type='password' onChange={handleInputLoginChange} placeholder='Senha' />

                            </fieldset>

                            <div className='buttonsFormRegister' >

                                <Link id='enterButtonSignIn' onClick={makeLogin}>Entrar</Link>

                            </div>

                        </div>

                    </main>

                <Footer />
                
            </div>

        )
    
    }

    

}

export default Request