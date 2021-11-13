import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import ProviderInfo from '../../../components/providerInfo'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import FirebaseConfig from '../../../FirebaseConfig'

function Provider() {

    const [wasChanged, setWasChanged] = useState(false)
    const [data, setData] = useState([]);
    const [dataAlterProvider, setDataAlterProvider] = useState({

        corporateName: '',
        tradeName: '',
        ownerName: '',
        cnpj: '',
        email: '',
        address: '',
        district: '',
        city: '',
        phone: '',
        products: data

    })

    const [selectProvider, setSelectProvider] = useState('')
    const [selectProviderToDelete, setSelectProviderToDelete] = useState('')

    const [dataKeysAdm, setDataKeysAdm] = useState([])
    const [dataProvider, setDataProvider] = useState([])

    const [newDataProvider, setNewDataProvider] = useState({

        corporateName: '',
        tradeName: '',
        ownerName: '',
        cnpj: '',
        email: '',
        address: '',
        district: '',
        city: '',
        phone: '',
        products: []

    })

    function handleInputProviderChange(event) {

        const { name, value } = event.target

        setNewDataProvider({

            ...newDataProvider, [name]: value,

        })

    }

    function handleInputProviderChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterProvider({

            ...dataAlterProvider, [name]: value

        })

    }

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        firebase.database().ref('providers').get('/providers')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])
                    setDataProvider(temp)

                } else {
                    console.log("No data available");
                }
            })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        var ref = firebase.database().ref("providers");

        var keys = []

        ref.orderByKey().on("child_added", function (snapshot) {
            keys.push(snapshot.key);
        });

        setDataKeysAdm(keys)

    }, []);
    

    function handleSelectProvider(event) {

        setSelectProvider(event.target.value)

    }

    function handleSelectProviderToDelete(event) {

        setSelectProviderToDelete(event.target.value)

    }

    function insertNewProvider() {

        const id = firebase.database().ref().child('posts').push().key

        firebase.database().ref('providers/' + id).set({

            corporateName: newDataProvider.corporateName,
            tradeName: newDataProvider.tradeName,
            ownerName: newDataProvider.ownerName,
            cnpj: newDataProvider.cnpj,
            email: newDataProvider.email,
            address: newDataProvider.address,
            complement: newDataProvider.complement,
            establishmentNumber: newDataProvider.establishmentNumber,
            district: newDataProvider.district,
            city: newDataProvider.city,
            phone: newDataProvider.phone,
            id: id,
            products: [{}]

        }).then(err => console.log(err))
        setNewDataProvider({

            corporateName: '',
            tradeName: '',
            ownerName: '',
            cnpj: '',
            email: '',
            address: '',
            complement: '',
            establishmentNumber: '',
            district: '',
            city: '',
            phone: '',

        })

        alert("Fornecedor cadastrado com sucesso!");

    }

    function updateProvider() {

        if (wasChanged) {

            firebase.database().ref('providers/' + dataKeysAdm[selectProvider]).update({

                corporateName: dataAlterProvider.corporateName !== '' ? dataAlterProvider.corporateName : dataProvider[selectProvider].corporateName,
                tradeName: dataAlterProvider.tradeName !== '' ? dataAlterProvider.tradeName : dataProvider[selectProvider].tradeName,
                ownerName: dataAlterProvider.ownerName !== '' ? dataAlterProvider.ownerName : dataProvider[selectProvider].ownerName,
                cnpj: dataAlterProvider.cnpj !== '' ? dataAlterProvider.cnpj : dataProvider[selectProvider].cnpj,
                email: dataAlterProvider.email !== '' ? dataAlterProvider.email : dataProvider[selectProvider].email,
                address: dataAlterProvider.address !== '' ? dataAlterProvider.address : dataProvider[selectProvider].address,
                complement: dataAlterProvider.complement !== '' ? dataAlterProvider.complement : dataProvider[selectProvider].complement,
                establishmentNumber: dataAlterProvider.establishmentNumber !== '' ? dataAlterProvider.establishmentNumber : dataProvider[selectProvider].establishmentNumber,
                district: dataAlterProvider.district !== '' ? dataAlterProvider.district : dataProvider[selectProvider].district,
                city: dataAlterProvider.city !== '' ? dataAlterProvider.city : dataProvider[selectProvider].city,
                phone: dataAlterProvider.phone !== '' ? dataAlterProvider.phone : dataProvider[selectProvider].phone,

            })
            .then(() => alert("Item atualizado com sucesso!"))
        }

    }

    function deleteProvider() {

        firebase.database()
            .ref('providers/' + dataKeysAdm[selectProviderToDelete])
            .remove()
            .then(() => alert("Item removido com sucesso!"))

    }

    const [displayHistory, setDisplayHistory] = useState("none");
    const [HistoryData, setHistoryData] = useState({});
    const [pageHeight, setPageHeight] = useState(0);

    useEffect(() => {

        window.scrollTo(0, 0);
        setPageHeight(window.screen.height)

    }, []);

    function handleHistoryInfos() {

        setHistoryData();

        displayHistory === "none" ? setDisplayHistory("flex") : setDisplayHistory("none")

    }

    function closeHistory() {

        displayHistory === "none" ? setDisplayHistory("flex") : setDisplayHistory("none")

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

            <div className='Provider'>
    
                <Header />
    
                <div style={{ display: displayHistory }} tabindex="-1" role="dialog" className='divHistory' >
                    <span onClick={closeHistory}>X</span>
                    <ProviderInfo displayProperty={displayHistory} HistoryData={HistoryData} />
                </div>
    
                <main id='mainProvider' >
    
                    <div className='titleProvider' >
    
                        <h2>Painel de cadastro de fornecedores</h2>
    
                        <div className="optionProvider">
    
                            <ul>
    
                                <a onClick={() => { handleHistoryInfos() }}>Informação dos fornecedores</a>
                                <Link to='/AdminProdutoFornecedor' >Cadastrar produtos dos fornecedores</Link>
    
                            </ul>
    
                        </div>
    
                    </div>
    
                    <div className='providerOptions' >
    
                        <div className='providerRegister'> 
    
                            <fieldset className='registerSection' >
    
                                <div className="registerTitle">
                                    <h2>Cadastrar fornecedor</h2>
                                    <h5>Preencha os dados do fornecedor abaixo.</h5>
                                </div>
    
                                <input name='corporateName' onChange={handleInputProviderChange} type='text' placeholder='Razão social da empresa' value={newDataProvider.corporateName}/>
    
                                <input name='tradeName' onChange={handleInputProviderChange} placeholder='Nome fantasia da empresa' value={newDataProvider.tradeName}/>
    
                                <input name='ownerName' onChange={handleInputProviderChange} placeholder='Pessoa responsável' value={newDataProvider.ownerName} />
    
                                <input name='cnpj' onChange={handleInputProviderChange} type='number' placeholder='CNPJ' value={newDataProvider.cnpj} />
    
                                <input name='city' onChange={handleInputProviderChange} placeholder='Município' value={newDataProvider.city}/>
    
                                <input name='district' onChange={handleInputProviderChange} placeholder='Bairro' value={newDataProvider.district} />
    
                                <input name='address' onChange={handleInputProviderChange} placeholder='Rua' value={newDataProvider.address} />
    
                                <input name='complement' onChange={handleInputProviderChange} placeholder='Complemento' value={newDataProvider.complement} />
    
                                <input name='establishmentNumber' onChange={handleInputProviderChange} type='number' placeholder='Nº' value={newDataProvider.establishmentNumber} />
    
                                <input name='email' onChange={handleInputProviderChange} placeholder='E-mail' value={newDataProvider.email} />
    
                                <input name='phone' onChange={handleInputProviderChange} type='number' placeholder='Telefone com DDD' value={newDataProvider.phone} />
                        
                            </fieldset>
                                <p>
                                    <a onClick={() => { insertNewProvider() }} >Cadastrar</a>
                                </p>
                        </div>
    
    
                        <div className='providerChange'> 
    
                            <fieldset>
    
                                <h2>Alterar dados de fornecedor</h2>
                                
                                <select onChange={handleSelectProvider} >
    
                                    <option>Selecione o fornecedor</option>
    
                                    {dataProvider.map((providers, index) => {
    
                                        return (
    
                                            <option style={{color: 'black'}} value={index} key={index}>{providers.tradeName}</option>
    
                                        )
    
                                    })}
    
                                </select>
    
                                <h5>Preencha o que deseja alterar</h5>
    
                                <input name='corporateName' onChange={handleInputProviderChangeAlter} placeholder='Razão social da empresa' />
    
                                <input name='tradeName' onChange={handleInputProviderChangeAlter} placeholder='Nome fantasia da empresa' />
    
                                <input name='ownerName' onChange={handleInputProviderChangeAlter} placeholder='Pessoa responsável' />
    
                                <input name='cnpj' onChange={handleInputProviderChange} type='number' placeholder='CNPJ'/>
    
                                <input name='city' onChange={handleInputProviderChangeAlter} placeholder='Município' />
    
                                <input name='district' onChange={handleInputProviderChangeAlter} placeholder='Bairro' />
    
                                <input name='address' onChange={handleInputProviderChangeAlter} placeholder='Rua' />
    
                                <input name='complement' onChange={handleInputProviderChange} placeholder='Complemento' />
    
                                <input name='establishmentNumber' onChange={handleInputProviderChange} type='number' placeholder='Nº' />
    
                                <input name='email' onChange={handleInputProviderChangeAlter} placeholder='E-mail' />
    
                                <input name='phone' onChange={handleInputProviderChangeAlter} placeholder='Telefone com DDD' />
    
    
                            </fieldset>
                                <p>
                                    <a onClick={() => { setWasChanged(true); updateProvider() }} >Alterar</a>  
                                </p>
                        </div>
    
                        <div className='providerDelete'> 
                            <fieldset>
    
                                    <h2>Apagar fornecedor</h2>
    
                                <select onChange={handleSelectProviderToDelete} >
    
                                    <option>Selecione o fornecedor</option>
    
                                    {dataProvider.map((providers, index) => {
    
                                        return (
    
                                            <option style={{color: 'black'}} key={index} value={index}>{providers.tradeName}</option>
    
                                        )
    
                                    })}
    
                                </select>
    
    
                            </fieldset>
                                <p>
                                    <a onClick={() => { deleteProvider() }} >Apagar</a>
                                </p>
    
                        </div>
    
    
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

export default Provider