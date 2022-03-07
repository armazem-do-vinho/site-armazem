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
    const [dataKeysAdm, setDataKeysAdm] = useState([])
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

    const [isChecked, setIsChecked] = useState(false);

    const menuMobile = createRef()

    function showMenuMobile() {

        if (isChecked)
            menuMobile.current.style.display = 'none';
        else
            menuMobile.current.style.display = 'flex';

    }

    function deleteUser() {

        const user = firebase.auth().currentUser;

        user.delete().then(() => {
        
            window.alert("Usuário deletado com sucesso")

            firebase.auth().signOut()
            localStorage.setItem('userEmail', '')
            history.push('/')

            firebase.database()
            .ref('users/' + dataAccount.id)
            .remove()

        }).catch((error) => {
        
            if(error) {

                window.alert("Ocorreu um erro na tentativa de deletar sua conta. Tente novamente")

            }

        }); 

        // firebase.database().ref('users/' + dataAccount.id).then(() => {
           
        //     window.alert("Conta deletada com sucesso")

        // }).catch((error) => {
            
        //     if(error) {

        //         window.alert("Ocorreu um erro na tentativa de deletar sua conta. Tente novamente")

        //     }            

        // });

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

                    <div className="deleteUser">
                    
                        <button onClick={() => deleteUser()}>Excluir conta</button>

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