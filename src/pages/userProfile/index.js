import { React, createRef } from 'react'
import { useEffect, useState } from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from '../../FirebaseConfig.js'

import { Link, useHistory } from "react-router-dom";
import SideBar from '../../components/sideBar'

function UserProfile() {

    const [dataAccount, setDataAccount] = useState([]);
    const [displayDivAlterInfos, setDisplayDivAlterInfos] = useState("none");
    const [displayDivPedidos, setDisplayDivPedidos] = useState("none");
    const [requestData, setRequestData] = useState([{}]);
    const [registerData, setRegisterData] = useState({

        name: '',
        phoneNumber: '',
        street: '',
        houseNumber: '',
        complement: '',
        district: '',
        cepNumber: '',

    })

    let history = useHistory();

    useEffect(() => {

        window.scrollTo(0, 0);

        const userEmail = localStorage.getItem('userEmail')

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig)

        firebase.database().ref('users/').get('/users')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                    temp.map((item) => {

                        if (item.email === userEmail)
                            setDataAccount(item)

                    })

                } else {
                    console.log("No data available");
                }
            })

    }, []);

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

                        if (item.userEmail === userEmail)
                            requestDataTemp.push(item)

                    })
                    setRequestData(requestDataTemp)

                } else {
                    console.log("No data available");
                }
            })

    }, []);

    function signOut() {

        firebase.auth().signOut()
        localStorage.setItem('userEmail', '')
        history.push('/')

    }

    function handleDisplayDivAlterInfos() {

        if (displayDivAlterInfos === "none")
            setDisplayDivAlterInfos("flex")
        else
            setDisplayDivAlterInfos("none")

    }

    function handleDisplayDivPedidos() {

        if (displayDivPedidos === "none")
            setDisplayDivPedidos("flex")
        else
            setDisplayDivPedidos("none")

    }

    function handleInputRegisterChange(event) {

        const { name, value } = event.target

        setRegisterData({

            ...registerData, [name]: value

        })

    }

    function updateRegister() {

        firebase.database().ref('users/' + dataAccount.id).update({

            name: registerData.name !== '' ? registerData.name : dataAccount.name,
            phoneNumber: registerData.phoneNumber !== '' ? registerData.phoneNumber : dataAccount.phoneNumber,
            personWhoIndicated: dataAccount.personWhoIndicated,
            whoIndicated: dataAccount.whoIndicated,
            street: registerData.street !== '' ? registerData.street : dataAccount.street,
            houseNumber: registerData.houseNumber !== '' ? registerData.houseNumber : dataAccount.houseNumber,
            complement: registerData.complement !== '' ? registerData.complement : dataAccount.complement,
            district: registerData.district !== '' ? registerData.district : dataAccount.district,
            cepNumber: registerData.cepNumber !== '' ? registerData.cepNumber : dataAccount.cepNumber,
            email: dataAccount.email,
            id: dataAccount.id

        })
            .then(() => alert("Cadastro atualizado com sucesso!"))
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
            });

    }

    const [isChecked, setIsChecked] = useState(false);

    const menuMobile = createRef()

    function showMenuMobile() {

        if (isChecked)
            menuMobile.current.style.display = 'none';
        else
            menuMobile.current.style.display = 'flex';

    }

    return (

        <div className="profilePage">

            <Header />

            <section className="dataSection">
                    
                <SideBar />

                <div className="userData">

                    <h3>Esses são seus dados. Para alterá-los, acesse a página <Link to='/AlterarDados'>Alterar Dados</Link></h3>

                    <div className="cardData">

                        <h4>Dados da conta</h4>

                        <div className="profileData">

                            <span><strong>Usuário: </strong>{dataAccount.name}</span>
                            <span><strong>E-mail: </strong>{dataAccount.email}</span>

                        </div>

                        <h4 id="personalData">Dados pessoais</h4>

                        <div className="profileData">

                            <span><strong>Endereço: </strong>{dataAccount.address} - {dataAccount.houseNumber}, {dataAccount.district}</span>
                            <span><strong>Complemento: </strong>{dataAccount.complement}</span>
                            <span><strong>Cidade: </strong>{dataAccount.city}, {dataAccount.state}</span>
                            <span><strong>CEP: </strong>{dataAccount.cepNumber}</span>
                            <span><strong>Telefone: </strong>{dataAccount.phoneNumber}</span>
                            <span><strong>Data de nascimento: </strong>{dataAccount.birthDate}</span>

                        </div>

                    </div>

                </div>

            </section>

            {/* <div className="dataUser">

                <ul>

                    <h1>Dados do usuário</h1>

                </ul>

            </div> */}

            <Footer />

        </div>


    )

}

export default UserProfile;


//     return (

//         <div className="clientProfile">

//             <Header />

//             <div className='dataClient'>

//                 <ul>
//                     <h2>Dados da conta</h2>
//                     <li>
//                         <p>Nome</p>
//                         <p>{dataAccount.name}</p>
//                     </li>
//                     <li>
//                         <p>E-mail:</p>
//                         <p>{dataAccount.email}</p>
//                     </li>
//                     <li>
//                         <p>Telefone:</p>
//                         <p>{dataAccount.phoneNumber}</p>
//                     </li>
//                     <li>
//                         <p>Endereço:</p>
//                         <p>{dataAccount.address}, {dataAccount.district} - {dataAccount.houseNumber}</p>
//                     </li>
//                 </ul>

//             </div>

//             <div>
//                 <h4 className="textAlterInfosProfile" onClick={() => handleDisplayDivAlterInfos()} >Deseja alterar alguma informação? <span>clique aqui</span></h4>

//                 <div style={{ display: displayDivAlterInfos }} className="divAlterInfos" >

//                     <h2 className="arrowToDownUserProfile"> ⇣ </h2>

//                     <p>Preencha apenas o que deseja atualizar</p>

//                     <fieldset>

//                         <legend>
//                             <h2>Informações pessoais</h2>
//                         </legend>

//                         <input name='name' onChange={handleInputRegisterChange} placeholder='Nome completo' />

//                         <input name='phoneNumber' type='tel' onChange={handleInputRegisterChange} placeholder='Telefone com DDD' />

//                     </fieldset>

//                     <fieldset>

//                         <legend>
//                             <h2>Endereço</h2>
//                         </legend>

//                         <input name='street' onChange={handleInputRegisterChange} placeholder='Nome da rua' />

//                         <input name='houseNumber' type='number' onChange={handleInputRegisterChange} placeholder='N° da casa/apto' />

//                         <input name='complement' onChange={handleInputRegisterChange} placeholder='Complemento' />

//                         <input name='district' onChange={handleInputRegisterChange} placeholder='Bairro' />

//                         <input name='cepNumber' onChange={handleInputRegisterChange} placeholder='CEP' />

//                     </fieldset>

//                     <a className="defaultButtonUserProfile" style={{ marginBottom: "5vh" }} onClick={() => updateRegister()}>Atualizar Informações</a>

//                 </div>

//                 <div className="singnOutButton" >
//                     <a onClick={() => signOut()} className="defaultButtonUserProfile" >SAIR</a>
//                 </div>

//             </div>


//             <section>

//                 <h4 className="textAlterInfosProfile" onClick={() => handleDisplayDivPedidos()} >Quer acompanhar seus pedidos? <span>clique aqui</span></h4>

//                 <div style={{ display: displayDivPedidos }} className="divPedidos" >


//                     <div className="divPedidos" >

//                         {requestData.map((item) => {

//                             return <>

//                                 {item.listItem !== undefined ?

//                                     item.listItem.map(item => {

//                                         return (
//                                             <div className="acompanhaPedidos">
//                                                 <div className="acomPedidosTitle">
//                                                     <h3>Nome do item:</h3>
//                                                     <h2>{item.title}</h2>
//                                                 </div>
//                                                 <div className="acomPedidosTitle">
//                                                     <h3>Unidade:</h3>
//                                                     <h2>{item.unity}</h2>
//                                                 </div>
//                                                 <div className="acomPedidosTitle">
//                                                     <h3>Quantidade:</h3>
//                                                     <h2>{item.amount}</h2>
//                                                 </div>
//                                                 <div className="acomPedidosTitle">
//                                                     <h3>Preço:</h3>
//                                                     <h2>R$ {item.price}</h2>
//                                                 </div>
//                                                 <div className="acomPedidosTitle">
//                                                     <h3>ID do item</h3>
//                                                     <h4>{item.id}</h4>
//                                                 </div>
//                                             </div>

//                                         )

//                                     })
//                                     : <p></p>}
//                             </>

//                         })}


//                     </div>

//                 </div>

//             </section>

//             <Footer />
//         </div>

//     )
// }

// export default UserProfile;
