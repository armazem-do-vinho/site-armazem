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

function ChangeInfos() {

    const [dataAccount, setDataAccount] = useState([]);
    const [displayDivAlterInfos, setDisplayDivAlterInfos] = useState("none");
    const [displayDivPedidos, setDisplayDivPedidos] = useState("none");
    const [requestData, setRequestData] = useState([{}]);
    const [ufs, setUfs] = useState([])
    const [selectedUf, setSelectedUf] = useState([])
    const [city, setCity] = useState([])
    const [selectedCity, setSelectedCity] = useState([])
    const [registerData, setRegisterData] = useState({

        name: '',
        email: '',
        state: '',
        address: '',
        district: '',
        complement: '',
        cepNumber: '',
        phoneNumber: '',
        houseNumber: '',

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

    function handleInputEmailChange(event) {

        const { name, value } = event.target

        setRegisterData({

            ...registerData, [name]: value

        })

        const user = firebase.auth().currentUser;

        user.updateEmail(registerData.email).then(() => {
            console.log(registerData.email)
        }).catch((error) => {
            // An error occurred
        });

    }

    function getLocales() {

        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(async (res) => await res.json())
            .then((json) => {

                const names = json.map(uf => uf.sigla)
                setUfs(names)
                console.log(names)

            })

    }

    function handleSelectedUf(event) {

        setSelectedUf(event.target.value)

    }
    

    function setCities() {

        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(async (res) => await res.json())
            .then((json) => {

                const names = json.map(uf => uf.nome)
                setCity(names)

            })

    }

    // function handleSelectedCity(event) {

    //     setSelectedCity(event.target.value)
    //     console.log(selectedCity)

    // }

    useEffect(() => {

        getLocales();

    }, [])

    useEffect(() => {

        setCities();

    }, [selectedUf])

    function updateRegister() {

        firebase.database().ref('users/' + dataAccount.id).update({

            name: registerData.name !== '' ? registerData.name : dataAccount.name,
            email: dataAccount.email,
            state: registerData.state !== '' ? registerData.state : dataAccount.state,
            city: registerData.city !== undefined ? registerData.city : dataAccount.city,
            address: registerData.address !== '' ? registerData.address : dataAccount.address,
            district: registerData.district !== '' ? registerData.district : dataAccount.district,
            complement: registerData.complement !== '' ? registerData.complement : dataAccount.complement,
            houseNumber: registerData.houseNumber !== '' ? registerData.houseNumber : dataAccount.houseNumber,
            cepNumber: registerData.cepNumber !== '' ? registerData.cepNumber : dataAccount.cepNumber,
            phoneNumber: registerData.phoneNumber !== '' ? registerData.phoneNumber : dataAccount.phoneNumber,
            birthDate: registerData.birthDate !== undefined ? registerData.birthDate : dataAccount.birthDate,
            id: dataAccount.id

        })
            .then(() => alert("Cadastro atualizado com sucesso!"))
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
            });

    }

    return (

        <div className="changeDataPage">

            <Header />

            <section className="changeSection">

                <SideBar />

                <div className="userDataChange">

                    <h3>Clique nos campos de texto abaixo e preencha <strong>apenas</strong> o que deseja alterar</h3>

                    <div className="cardDataChange">

                        <h4>Dados da conta</h4>

                        <div className="profileDataChange">

                            <span>
                                <strong>Usuário:
                                    <input
                                        name='name'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Nome completo'
                                    />
                                </strong>
                            </span>

                            {/* <span>
                                <strong>E-mail:
                                    <input
                                        name='email'
                                        onChange={handleInputEmailChange}
                                        placeholder='E-mail'
                                    />
                                </strong>
                            </span> */}

                        </div>

                        <h4 id="personalData">Dados pessoais</h4>

                        <div className="profileDataChange">

                            <span>

                                <strong>Estado:

                                    {/* <select name="uf" id="uf" onChange={handleSelectedUf}>

                                        onChange={handleInputAdminChangeAlter} name='unity' value={dataAdmin[selectItem]?.state}

                                        <option disabled selected>{dataAccount.state}</option>

                                        {ufs.map(uf => (

                                            <option key={uf} value={uf} >{uf}</option>

                                        ))}

                                    </select> */}

                                    <select name='state' id='uf' onChange={handleInputRegisterChange}>

                                        <option disabled selected>{dataAccount.state}</option>
                                        <option value="Acre">Acre</option>
                                        <option value="Alagoas">Alagoas</option>
                                        <option value="Amapá">Amapá</option>
                                        <option value="Amazonas">Amazonas</option>
                                        <option value="Bahia">Bahia</option>
                                        <option value="Ceará">Ceará</option>
                                        <option value="Distrito Federal">Distrito Federal</option>
                                        <option value="Espírito Santo">Espírito Santo</option>
                                        <option value="Centro-Oeste">Centro-Oeste</option>
                                        <option value="Maranhão">Maranhão</option>
                                        <option value="Mato Grosso">Mato Grosso</option>
                                        <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                                        <option value="Minas Gerais">Minas Gerais</option>
                                        <option value="Pará">Pará</option>
                                        <option value="Paraíba">Paraíba</option>
                                        <option value="Paraná">Paraná</option>
                                        <option value="Pernambuco">Pernambuco</option>
                                        <option value="Piauí">Piauí</option>
                                        <option value="Rio de Janeiro">Rio de Janeiro</option>
                                        <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                                        <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                                        <option value="Rondônia">Rondônia</option>
                                        <option value="Roraima">Roraima</option>
                                        <option value="Santa Catarina">Santa Catarina</option>
                                        <option value="São Paulo">São Paulo</option>
                                        <option value="Sergipe">Sergipe</option>
                                        <option value="Tocantins">Tocantins</option>

                                    </select>

                                </strong>

                            </span>

                            <span>

                                <strong>Cidade:

                                    {/* <select name="city" id="localidade" onChange={handleSelectedCity}>

                                        onChange={handleInputAdminChangeAlter} name='unity' value={dataAdmin[selectItem]?.state}

                                        <option disabled selected>{dataAccount.city}</option>

                                        {city.map(city => (

                                            <option key={city} value={city} >{city}</option>

                                        ))}

                                    </select> */}

                                    <input
                                        name='city'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Cidade'
                                    />

                                </strong>
                            </span>

                            <span>
                                <strong>Endereço:
                                    <input
                                        name='address'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar endereço'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>Bairro:
                                    <input
                                        name='district'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar bairro'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>Complemento:
                                    <input
                                        name='complement'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar complemento'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>Nº:
                                    <input
                                        name='houseNumber'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar número de residência'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>CEP:
                                    <input
                                        name='cepNumber'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar CEP'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>Telefone:
                                    <input
                                        type="tel"
                                        data-mask="(00) 0000-0000"
                                        data-mask-selectonfocus="true"
                                        name='phoneNumber'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Alterar telefone'
                                    />
                                </strong>
                            </span>

                            <span>
                                <strong>Nascimento:

                                    <input
                                        type="date"
                                        id='birthDate'
                                        name='birthDate'
                                        onChange={handleInputRegisterChange}
                                        placeholder='Data de nascimento'
                                    />

                                </strong>
                            </span>

                        </div>

                    </div>

                    <button onClick={() => updateRegister()}>Alterar dados</button>

                </div>

            </section>

            <Footer />

        </div>

    )

}

export default ChangeInfos;