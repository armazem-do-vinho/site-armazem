import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'
import { Link } from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../../FirebaseConfig'

function Stock() {

    const [items, setItems] = useState([])
    const [itemsBackUp, setItemsBackUp] = useState([])
    const [searchInput, setSearchInput] = useState([])
    const [selectedItem, setSelectedItem] = useState([])
    const [selectedAmount, setSelectedAmount] = useState([])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('items/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])

                temp.sort((a, b) => {

                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)

                })

                setItems(temp)
                setItemsBackUp(temp)

            }

        });

    }, [])

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);

    function handleSelectedItem(event) {

        setSelectedItem(event.target.value)

    }

    function handleSelectedAmount(event) {

        setSelectedAmount(event.target.value)

    }

    function alterProduct() {

        var product = []

        items.map(item => {

            if (item.id === selectedItem)
                product = item

        })

        firebase.database()
            .ref('items/' + selectedItem)
            .update({

                amount: product.amount,
                amountInStock: selectedAmount,
                country: product.country,
                desc: product.desc,
                id: product.id,
                imageSrc: product.imageSrc,
                itemAvailability: product.itemAvailability,
                price: product.price,
                sweetness: product.sweetness,
                title: product.title,
                type: product.type,

            })

            .then(() => alert(`Estoque de ${product.title} atualizado com sucesso!`))

    }

    function searchItem() {

        var itensTemp = []

        items.map((item) => {

            var title = item.title.toLowerCase()
            var search = searchInput.toLowerCase()

            if (title.includes(search))
                itensTemp.push(item)

        })

        setItems(itensTemp)

    }

    function clearSearchItem() {

        setItems(itemsBackUp)

    }

    function handleSearchInput(event) {

        if (event.key === 'Enter') {

            clearSearchItem()
            searchItem()

        }
        setSearchInput(event.target.value)

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

            <section id='Stock'>
    
                <Header />
    
                <div className="stockControl">
    
                    <div className="stockProductsSelect">
    
                        <h2>Alterar estoque de produtos</h2>
                        <h4 style={{margin: "1rem 0"}}>Insira abaixo a nova quantidade do estoque</h4>
    
                        <select onChange={handleSelectedItem}>
    
                            <option value='' >Selecionar produto</option>
    
                            {
                                items.map((item, index) => (
    
                                    <option value={item.id}>{item.title}: {item.amountInStock}</option>
    
                                ))
                            }
    
                        </select>
    
                        <input placeholder='Quantidade' type='number' onChange={handleSelectedAmount} />
    
                        <button onClick={() => { alterProduct() }}>Alterar</button>
    
                    </div>
    
                    <div className="stockProductsSearch">
    
                        <h2>Pesquisar produtos</h2>
    
                        <input placeholder='Pesquisar' onChange={handleSearchInput} />
    
                        <div className="stockProductsButtons">
    
                            <button onClick={() => { clearSearchItem() }}>Limpar pesquisa</button>
                            <button onClick={() => { searchItem() }}>Pesquisar</button>
    
                        </div>
    
                    </div>
    
                </div>
    
                <section id="stockProducts">
    
                    <h2>Produtos</h2>
    
                    <div className="stockProductsDisplay">
    
                        {
                            items.map(item => (
                                <div className="stockItens">
                                    <h4>{item.title}: {item.amountInStock}</h4>
                                </div>
                            ))
                        }
    
                    </div>
    
                </section>
    
                <Footer />
    
            </section>
    
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

export default Stock