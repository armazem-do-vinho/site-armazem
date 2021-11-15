import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import FirebaseConfig from '../../../FirebaseConfig'

function ProviderProducts() {

    const [wasChangedProduct, setWasChangedProduct] = useState(false)

    const [selectProvider, setSelectProvider] = useState('')

    const [selectedUnity, setSelectedUnity] = useState('')

    const [imageUrl, setImageUrl] = useState('')
    const [dataAlterProduct, setDataAlterProduct] = useState({

        amount: '',
        country: '',
        imageSrc: '',
        sweetness: '',
        title: '',
        buyPrice: '',
        sellPrice: '',
        type: '',
        id: ''

    })

    const [selectProductToAlter, setSelectProductToAlter] = useState([])

    const [selectProductToDelete, setSelectProductToDelete] = useState('')

    const [dataKeysAdm, setDataKeysAdm] = useState([])
    const [dataProvider, setDataProvider] = useState([])

    const [newDataProduct, setNewDataProduct] = useState({

        amount: '',
        country: '',
        imageSrc: '',
        sweetness: '',
        title: '',
        buyPrice: '',
        sellPrice: '',
        type: '',

    })

    function handleInputProductChange(event) {

        const { name, value } = event.target

        setNewDataProduct({

            ...newDataProduct, [name]: value

        })

    }

    function handleInputProductChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterProduct({

            ...dataAlterProduct, [name]: value

        })

    }

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        var firebaseRef = firebase.database().ref('providers/');

        firebaseRef.on('value', (snapshot) => {

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

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        var ref = firebase.database().ref('providers/').child('products/')

        var productKeys = []

        ref.orderByKey().on("child_added", function (snapshot) {
            productKeys.push(snapshot.key);
        });


    }, []);

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(FirebaseConfig);

        firebase.database().ref('providers').get('/products')
            .then(function (snapshot) {

                if (snapshot.exists()) {

                    var data = snapshot.val()
                    var temp = Object.keys(data).map((key) => data[key])

                    var dataProductTemp = []

                    temp.map(item => {

                        if (item.products !== undefined)
                            dataProductTemp.push(item.products)

                    })

                } else {
                    console.log("No data available");
                }
            })

    }, [])

    function handleSelectProductToDelete(event) {

        setSelectProductToDelete(event.target.value)
        console.log(event.target.value)

    }

    function handleSelectProvider(event) {

        setSelectProvider(event.target.value)

    }

    function insertNewProduct() {

        const id = firebase.database().ref().child('posts').push().key

        const data = {

            id: id,
            title: newDataProduct.title,
            imageSrc: imageUrl,
            country: newDataProduct.country,
            sweetness: newDataProduct.sweetness,
            buyPrice: newDataProduct.buyPrice,
            sellPrice: newDataProduct.sellPrice,
            type: newDataProduct.type,
            amount: newDataProduct.amount

        }

        firebase.database().ref('providers/' + dataKeysAdm[selectProvider])
            .child('products/' + id)
            .set(data)
            .then(err => console.log(err))
        setNewDataProduct({

            amount: '',
            country: '',
            imageSrc: '',
            sweetness: '',
            title: '',
            buyPrice: '',
            sellPrice: '',
            type: '',

        })

        alert("Produto cadastrado com sucesso!")

    }

    const [itemsOfProvider, setItemsOfProvider] = useState([])

    function handleSelectProviderProducts(event) {

        var position = event.target.value

        setSelectProvider(position)

        var data = dataProvider[position].products

        if (data !== undefined && data !== null) {

            var items = Object.keys(data).map((key) => data[key])
            var temp = []

            items.map((products) => {

                temp.push(products)
                console.log(products)

            })

            setItemsOfProvider(temp)

        } else

            setItemsOfProvider([])

    }

    function handleSelectProduct(event) {

        var position = event.target.value

        setSelectProductToAlter(itemsOfProvider[position].id)
        console.log(itemsOfProvider[position].product)

    }

    function updateProduct() {

        if (wasChangedProduct) {

            var products = dataProvider[selectProvider].products

            products[selectProductToAlter] = {
                
                type: dataAlterProduct.type !== '' ? dataAlterProduct.type : products[selectProductToAlter].type,
                country: dataAlterProduct.country !== '' ? dataAlterProduct.country : products[selectProductToAlter].country,
                amount: dataAlterProduct.amount !== '' ? dataAlterProduct.amount : products[selectProductToAlter].amount,
                buyPrice: dataAlterProduct.buyPrice !== '' ? dataAlterProduct.buyPrice : products[selectProductToAlter].buyPrice,
                imageSrc: dataAlterProduct.imageSrc !== '' ? dataAlterProduct.imageSrc : products[selectProductToAlter].imageSrc,
                title: dataAlterProduct.title !== '' ? dataAlterProduct.title : products[selectProductToAlter].title,
                sellPrice: dataAlterProduct.sellPrice !== '' ? dataAlterProduct.sellPrice : products[selectProductToAlter].sellPrice,
                sweetness: dataAlterProduct.sweetness !== '' ? dataAlterProduct.sweetness : products[selectProductToAlter].sweetness,
                id: products[selectProductToAlter].id

            }

            firebase.database()
                .ref('providers/' + dataKeysAdm[selectProvider])
                .update({

                    city: dataProvider[selectProvider].city,
                    corporateName: dataProvider[selectProvider].corporateName,
                    id: dataProvider[selectProvider].id,
                    email: dataProvider[selectProvider].email,
                    district: dataProvider[selectProvider].district,
                    ownerName: dataProvider[selectProvider].ownerName,
                    phone: dataProvider[selectProvider].phone,
                    address: dataProvider[selectProvider].address,
                    cnpj: dataProvider[selectProvider].cnpj,
                    tradeName: dataProvider[selectProvider].tradeName,
                    products: products

                })
                .then(() => alert("Item atualizado com sucesso!"))
        }

    }

    function deleteProduct() {

        var products = dataProvider[selectProvider].products
        var temp = Object.keys(products).map((key) => products[key])

        firebase.database()
            .ref('providers/'+ dataProvider[selectProvider].id)
            .child('products/' + temp[selectProductToDelete].id)
            .remove()
            .then(() => alert("Item removido com sucesso!"))
    }

    function uploadImage(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('images/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setImageUrl(url))
            });

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

            <div className='ProviderProducts'>
    
                <Header />
    
                <main id='mainProviderProducts' >
    
                    <div className='titleProviderProducts' >
    
                        <h1>Painel de cadastro de produto dos fornecedores</h1>
    
                        <div className='optionProvider'>
    
                            <ul>
    
                                <Link to='/AdminFornecedor'>Voltar para painel de cadastro de fornecedores</Link>
    
                            </ul>
    
                        </div>
    
                    </div>
    
                    <div className='providerProductsOptions' >
    
                        <fieldset>
    
                            <legend>
                                <h2>Cadastrar produto</h2>
                                <h5>Selecione o fornecedor e preencha os dados do produto abaixo.</h5>
                            </legend>
    
                            <select onChange={handleSelectProvider} >
    
                                <option>Selecione o fornecedor</option>
    
                                {dataProvider.map((providers, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{providers.tradeName}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <legend>
                                <h3>Insira os dados do produto</h3>
                            </legend>
    
                            <input name='title' onChange={handleInputProductChange} placeholder='Nome' value={newDataProduct.title} />
    
                            <input name='amount' onChange={handleInputProductChange} placeholder='Quantidade' value={newDataProduct.amount} />
    
                            <input name='sweetness' onChange={handleInputProductChange} placeholder='Doçura' value={newDataProduct.sweetness} />
    
                            <input name='type' onChange={handleInputProductChange} placeholder='Tipo' value={newDataProduct.type} />
    
                            <input name='country' onChange={handleInputProductChange} placeholder='País' value={newDataProduct.country} />
                    
                            <input type='file' onChange={uploadImage} accept="image/png, image/jpeg" placeholder='Imagem' />
    
                            <input name='buyPrice' onChange={handleInputProductChange} placeholder='Preço de compra' value={newDataProduct.buyPrice} />
    
                            <input name='sellPrice' onChange={handleInputProductChange} placeholder='Preço de venda' value={newDataProduct.sellPrice} />
    
    
                        </fieldset>
    
                        <div className="linkProductRegister">
                            <a onClick={() => { insertNewProduct() }} >Inserir</a>
                        </div>
    
                        <fieldset>
    
                            <legend>
                                <h2>Alterar dados dos produtos</h2>
                            </legend>
    
                            <select onChange={handleSelectProviderProducts} >
    
                                <option>Selecione o fornecedor</option>
    
                                {dataProvider.map((providers, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{providers.tradeName}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <select onChange={handleSelectProduct} >
    
                                <option>Selecione o produto</option>
    
                                {itemsOfProvider.map((products, index) => (
    
                                    <option value={index} key={index}>{products.product}</option>
    
                                ))}
    
                            </select>
    
                            <h5>Preencha o que deseja alterar</h5>
    
                            <input name='title' onChange={handleInputProductChangeAlter} placeholder='Nome' />
    
                            <input name='amount' onChange={handleInputProductChange} placeholder='Quantidade'/>
    
                            <input name='sweetness' onChange={handleInputProductChange} placeholder='Doçura'/>
    
                            <input name='type' onChange={handleInputProductChange} placeholder='Tipo'/>
    
                            <input name='country' onChange={handleInputProductChange} placeholder='País'/>
    
                            <input name='imageSrc' onChange={handleInputProductChangeAlter} placeholder='Imagem' />
    
                            <input name='sellPrice' onChange={handleInputProductChangeAlter} placeholder='Valor de venda' />
    
                            <input name='buyPrice' onChange={handleInputProductChangeAlter} placeholder='Valor de compra' />
    
                        </fieldset>
    
                        <div className="linkProductRegister">
                            <a onClick={() => { setWasChangedProduct(true); updateProduct(); }} >Alterar</a>
                        </div>
    
                        <fieldset>
    
                            <legend>
                                <h2>Apagar produto</h2>
                            </legend>
    
                            <select onChange={handleSelectProviderProducts} >
    
                                <option>Selecione o fornecedor</option>
    
                                {dataProvider.map((providers, index) => {
    
                                    return (
    
                                        <option key={index} value={index} >{providers.tradeName}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <select onChange={handleSelectProductToDelete} >
    
                                <option>Selecione o produto</option>
    
                                {itemsOfProvider.map((products, index) => (
    
                                    <option value={index} key={index}>{products.product}</option>
    
                                ))}
    
                            </select>
    
                        </fieldset>
    
                        <div className="linkProductRegister">
                            <a onClick={() => { deleteProduct() }} >Apagar</a>
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

export default ProviderProducts