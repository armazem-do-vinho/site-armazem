import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'
import { Link } from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import firebaseConfig from '../../../FirebaseConfig.js'

function Vouchers() {

    const [wasChanged, setWasChanged] = useState(false)
    const [dataAlterVoucher, setDataAlterVoucher] = useState({

        title: '',
        discount: '',

    })

    const [selectVoucher, setSelectVoucher] = useState('')
    const [selectVoucherToDelete, setSelectVoucherToDelete] = useState('')

    const [dataVoucher, setDataVoucher] = useState([])
    const [dataKeysVoucher, setDataKeysVoucher] = useState([])
    const [newDataVoucher, setNewDataVoucher] = useState({

        title: '',
        discount: '',

    })

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('vouchers/');

        firebaseRef.on('value', (snapshot) => {
    
            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataVoucher(temp.sort((a,b)=> {

                  return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)

                }))
            }
            else {
              console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if(dataVoucher) {

            var keys = []
            dataVoucher.map((item) => keys.push(item.id))
            setDataKeysVoucher(keys)
        }

    }, [dataVoucher]);

    function handleInputVoucherChange(event) {

        const { name, value } = event.target

        setNewDataVoucher({

            ...newDataVoucher, [name]: value

        })

    }

    function handleInputVoucherChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterVoucher({

            ...dataAlterVoucher, [name]: value

        })

    }

    function handleSelectVoucher(event) {

        setSelectVoucher(event.target.value)
  
        setDataAlterVoucher(dataVoucher[event.target.value])

    }

    function handleSelectVoucherToDelete(event) {

        setSelectVoucherToDelete(event.target.value)

    }

    function insertNewVoucher() {

        const id = firebase.database().ref().child('vouchers').push().key

        const data = {

            title: newDataVoucher.title,
            discount: newDataVoucher.discount,
            id: id,

        }

        firebase.database().ref('vouchers/' + id)
        .set(data)
        .then(err => console.log(err))

        setNewDataVoucher({

            title: '',
            discount: '',

        })

        alert("Cupom inserido com sucesso!")
        window.location.reload()

    }

    function updateVoucher() {

        const newVoucher = {

            title: dataAlterVoucher.title !== '' ? dataAlterVoucher.title : dataVoucher[selectVoucher].title,
            discount: dataAlterVoucher.discount !== '' ? dataAlterVoucher.discount : dataVoucher[selectVoucher].discount,

        }

        firebase.database()
        .ref('vouchers/' + dataKeysVoucher[selectVoucher])
        .update(newVoucher)
        .then(() => alert("Cupom atualizado com sucesso!"))
        window.location.reload()

    }

    function deleteVoucher() {

        firebase.database()
            .ref('vouchers/' + dataKeysVoucher[selectVoucherToDelete])
            .remove()
            .then(() => alert("Cupom removido com sucesso!"))

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

            <div className='AdminVouchers'>
    
                <Header />
    
                <main id='mainItems' >
    
                    <div className='vouchersOptions' >
    
                        <h1>Cadastro de cupom</h1>
    
                        <fieldset>
    
                            <legend>
                                <h2>Inserir novo cupom</h2>
                            </legend>
    
                            <input name='title' onChange={handleInputVoucherChange} placeholder='Cupom' value={newDataVoucher.title} />
    
                            <input name='discount' type='number' onChange={handleInputVoucherChange} placeholder='Desconto (em %)' value={newDataVoucher.discount} />
    
                            <div className="buttonVoucher">
    
                                <a onClick={() => { insertNewVoucher() }} >Inserir</a>
    
                            </div>
    
                        </fieldset>
    
                        <fieldset>
    
                            <legend>
                                <h2>Alterar cupom</h2>
                            </legend>
    
                            <select onChange={(e)=>handleSelectVoucher(e)} >
    
                                <option>Selecione o cupom</option>
    
                                {dataVoucher.map((item, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{item.title}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <h4>Preencha o que deseja alterar</h4>
    
                            <input 
                                name='title' 
                                onChange={handleInputVoucherChangeAlter} 
                                placeholder='Cupom'
                                value={dataAlterVoucher.title}
                            />
    
                            <input
                                name='discount'
                                type='number'
                                onChange={handleInputVoucherChangeAlter}
                                placeholder='Desconto (em %)'
                                value={dataAlterVoucher.discount}
                            />
                            
                            <div className="buttonVoucher">
    
                                <a onClick={() => { setWasChanged(true); updateVoucher(); }} >Alterar</a>
    
                            </div>
    
                        </fieldset>
    
                        <fieldset>
    
                            <legend>
                                <h2>Apagar cupom</h2>
                            </legend>
    
                            <select onChange={handleSelectVoucherToDelete} >
    
                                <option>Selecione o cupom</option>
    
                                {dataVoucher.map((item, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{item.title}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <div className="buttonVoucher">
    
                                <a id="deleteButton" onClick={() => { deleteVoucher() }} >Apagar</a>
    
                            </div>
    
                        </fieldset>
    
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

export default Vouchers