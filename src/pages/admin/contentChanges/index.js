import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import firebaseConfig from '../../../FirebaseConfig.js'
import { Link } from 'react-router-dom'

export default function ContentChange() {

    const [selectedOption, setSelectedOption] = useState('')
    const [selectedBanner, setSelectedBanner] = useState('')
    const [selectedCard, setSelectedCard] = useState('')
    const [selectedBannerToDelete, setSelectedBannerToDelete] = useState('')
    const [selectedCardToDelete, setSelectedCardToDelete] = useState('')
    const [selectedProductCardToDelete, setSelectedProductCardToDelete] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [alteredImageUrl, setAlteredImageUrl] = useState('')
    const [cardImageUrl, setCardImageUrl] = useState('')
    const [alteredCardImageUrl, setAlteredCardImageUrl] = useState('')
    const [alteredVideoUrl, setAlteredVideoUrl] = useState('')
    const [dataAlterText, setDataAlterText] = useState('')
    const [dataKeysBanner, setDataKeysBanner] = useState([])
    const [dataKeysCard, setDataKeysCard] = useState([])
    const [dataKeysProduct, setDataKeysProduct] = useState([])
    const [dataBanner, setDataBanner] = useState([])
    const [dataAbout, setDataAbout] = useState([])
    const [dataCard, setDataCard] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [dataProductCards, setDataProductCards] = useState([])
    const [selectedProduct, setSelectedProduct] = useState({})
    const [userIsLogged, setUserIsLogged] = useState(false)

    const [dataAlterBanner, setDataAlterBanner] = useState({

        imageSrc: '',
        title: '',

    })

    const [newDataBanner, setNewDataBanner] = useState({

        imageSrc: '',
        title: '',

    })

    const [dataAlterCard, setDataAlterCard] = useState({

        imageSrc: '',
        country: '',
        desc: '',

    })

    const [newDataCard, setNewDataCard] = useState({

        imageSrc: '',
        country: '',
        desc: '',

    })

    const [productCardText, setProductCardText] = useState({

        description: '',
        info: '',

    })

    const [loginData, setLoginData] = useState({

        email: '',
        password: ''

    })

    function makeLogin() {

        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
            .then(() => {

                var userEmail = localStorage.getItem('userEmail')

                firebase.database().ref('admins').get('/admins')
                    .then(function (snapshot) {

                        if (snapshot.exists()) {

                            var data = snapshot.val()
                            var temp = Object.keys(data).map((key) => data[key])

                            temp.map((item) => {

                                if (item.email === userEmail)
                                    setUserIsLogged(true)

                            })
                        }
                        else {
                            console.log("No data available");
                        }
                    })


                localStorage.setItem('userEmail', loginData.email)

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            });

    }

    function handleInputLoginChange(event) {

        const { name, value } = event.target

        setLoginData({

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

                        if (item.email === userEmail)
                            setUserIsLogged(true)

                    })
                }
                else {
                    console.log("No data available");
                }
            })

    }, []);

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('about/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataAbout(temp)
            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('aboutCards/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataCard(temp)
            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('items/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataProducts(temp)

            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('productsCard/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataProductCards(temp)

            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('banners/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataBanner(temp.sort((a, b) => {

                    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)

                }))
            }
            else {
                console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if (dataBanner) {

            var keys = []
            dataBanner.map((item) => keys.push(item.id))
            setDataKeysBanner(keys)
        }

    }, [dataBanner]);

    useEffect(() => {

        if (dataCard) {

            var keys = []
            dataCard.map((item) => keys.push(item.id))
            setDataKeysCard(keys)

        }

    }, [dataCard]);

    useEffect(() => {

        if (dataProductCards) {

            var keys = []
            dataProductCards.map((item) => keys.push(item.id))
            setDataKeysProduct(keys)

        }

    }, [dataProductCards]);

    function handleInputCardText(event) {

        const { name, value } = event.target

        setProductCardText({

            ...productCardText, [name]: value

        })

    }

    function handleInputBannerChange(event) {

        const { name, value } = event.target

        setNewDataBanner({

            ...newDataBanner, [name]: value

        })

    }

    function handleInputBannerChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterBanner({

            ...dataAlterBanner, [name]: value

        })

    }

    function handleInputCardChange(event) {

        const { name, value } = event.target

        setNewDataCard({

            ...newDataCard, [name]: value

        })

    }

    function handleInputCardChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterCard({

            ...dataAlterCard, [name]: value

        })

    }

    function handleSelectedOption(event) {

        setSelectedOption(event.target.value)

    }

    function handleSelectedBanner(event) {

        setSelectedBanner(event.target.value)

        setDataAlterBanner(dataBanner[event.target.value])

    }

    function handleSelectedCard(event) {

        setSelectedCard(event.target.value)

    }

    function insertNewBanner() {

        const id = firebase.database().ref().child('banners').push().key

        const data = {

            imageSrc: imageUrl,
            title: newDataBanner.title,
            id: id,

        }

        firebase.database().ref('banners/' + id)
            .set(data)
            .then(err => console.log(err))

        setNewDataBanner({

            imageSrc: '',
            title: '',

        })

        alert("Inserido com sucesso!")
        window.location.reload()

    }

    function updateBanner() {

        const newBanner = {

            imageSrc: alteredImageUrl !== '' ? alteredImageUrl : dataBanner[selectedBanner].imageSrc,
            title: dataAlterBanner.title !== '' ? dataAlterBanner.title : dataBanner[selectedBanner].title,

        }
        firebase.database()
            .ref('banners/' + dataKeysBanner[selectedBanner])
            .update(newBanner)
            .then(() => alert("Banner atualizado com sucesso!"))
        window.location.reload()

    }

    function deleteBanner() {

        firebase.database()
            .ref('banners/' + dataKeysBanner[selectedBannerToDelete])
            .remove()
            .then(() => alert("Banner removido com sucesso!"))

    }

    function deleteCard() {

        firebase.database()
            .ref('aboutCards/' + dataKeysBanner[selectedCardToDelete])
            .remove()
            .then(() => alert("Banner removido com sucesso!"))

    }

    function deleteProductCard() {

        firebase.database()
            .ref('productsCard/' + dataKeysProduct[selectedProductCardToDelete])
            .remove()
            .then(() => alert("Produto removido com sucesso!"))

    }

    function insertNewCard() {

        const id = firebase.database().ref().child('aboutCards').push().key

        const data = {

            imageSrc: cardImageUrl,
            country: newDataCard.country,
            desc: newDataCard.desc,
            id: id,

        }

        firebase.database().ref('aboutCards/' + id)
            .set(data)
            .then(err => console.log(err))

        setNewDataCard({

            imageSrc: '',
            country: '',
            desc: '',

        })

        alert("Inserido com sucesso!")
        window.location.reload()

    }

    function updateCard() {

        const newCard = {

            imageSrc: alteredCardImageUrl !== '' ? alteredCardImageUrl : dataCard[selectedCard].imageSrc,
            country: dataAlterCard.country !== '' ? dataAlterCard.country : dataCard[selectedCard].country,
            desc: dataAlterCard.desc !== '' ? dataAlterCard.desc : dataCard[selectedCard].desc,

        }
        firebase.database()
            .ref('aboutCards/' + dataKeysCard[selectedCard])
            .update(newCard)
            .then(() => alert("Atualizado com sucesso!"))
        window.location.reload()

    }

    function deleteCard() {

        firebase.database()
            .ref('aboutCards/' + dataKeysCard[selectedCardToDelete])
            .remove()
            .then(() => alert("Removido com sucesso!"))

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

    function uploadImageAltered(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('images/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setAlteredImageUrl(url))
            });

    }

    function uploadCardImage(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('images/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setCardImageUrl(url))
            });

    }

    function uploadCardImageAltered(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('images/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setAlteredCardImageUrl(url))
            });

    }

    function uploadVideoAltered(event) {

        const file = event.target.files[0]

        var storageRef = firebase.storage().ref();

        storageRef.child('videos/' + file.name.trim())
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(url => setAlteredVideoUrl(url))
            });

    }

    function updateAbout() {

        const newData = {

            videoSrc: alteredVideoUrl !== '' ? alteredVideoUrl : dataAbout[0].videoSrc,
            text: dataAlterText !== '' ? dataAlterText : dataAbout[0].text

        }
        firebase.database()
            .ref('about/data')
            .update(newData)
            .then(() => alert("Vídeo atualizado com sucesso!"))
        window.location.reload()

    }

    function handleSelectBannerToDelete(event) {

        setSelectedBannerToDelete(event.target.value)

    }

    function handleSelectCardToDelete(event) {

        setSelectedCardToDelete(event.target.value)

    }

    function handleSelectProductCardToDelete(event) {

        setSelectedProductCardToDelete(event.target.value)

    }

    function handleInputTextChangeAlter(event) {

        const text = event.target.value

        setDataAlterText(text)

    }

    function handleSelectedProduct(event) {

        setSelectedProduct(dataProducts[event.target.value])

    }

    function insertNewProductHome() {

        const id = firebase.database().ref().child('productsCard').push().key

        const productCard = {
            
            id: id,
            name: selectedProduct.title,
            imageSrc: selectedProduct.imageSrc,
            country: selectedProduct.country,
            type: selectedProduct.type,
            info: productCardText.info,
            description: productCardText.description,

        }

        firebase.database().ref('productsCard/' + id)
            .set(productCard)
            .then(err => console.log(err))

        alert("Inserido com sucesso!")
        window.location.reload()

        setProductCardText({

            info: '',
            description: '',

        })

    }

    if (userIsLogged) {

        return (

            <main>

                <Header />

                <section id="ContentChangesMain">

                    <section id="ChangesSection">

                        <h2>Selecione a página a ser alterada</h2>

                        <select onChange={(event) => handleSelectedOption(event)} >

                            <option selected disabled>Selecione o que deseja alterar</option>
                            <option value="Home">Alterar conteúdo da página "Início"</option>
                            <option value="Quem Somos">Alterar conteúdo da página "Quem Somos"</option>

                        </select>

                    </section>

                    <section id="OptionsSection">

                        <div>

                            {selectedOption === "Home" ?

                                <section id="HomeChanges">

                                    <h1>Banner</h1>

                                    <fieldset className="addBanner">

                                        <h3>Inserir novo banner</h3>

                                        <input name='title' onChange={handleInputBannerChange} placeholder='Título' value={newDataBanner.title} />
                                        <input type='file' onChange={uploadImage} accept="image/png, image/jpeg" placeholder='Imagem' />

                                        <div className="buttonChanges">

                                            <a onClick={() => { insertNewBanner() }} >Inserir</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="updateBanner">

                                        <h3>Alterar Banner</h3>

                                        <select onChange={(event) => handleSelectedBanner(event)} >

                                            <option selected disabled>Selecione o banner que deseja alterar</option>

                                            {dataBanner.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.title}</option>

                                                )

                                            })}

                                        </select>

                                        <h4>Preencha o que deseja alterar</h4>

                                        <input
                                            name='title'
                                            onChange={handleInputBannerChangeAlter}
                                            placeholder='Título'
                                            value={dataAlterBanner.title}
                                        />

                                        <input
                                            type='file'
                                            onChange={uploadImageAltered}
                                            accept="image/png, image/jpeg"
                                            placeholder='Imagem'
                                        />

                                        <div className="buttonChanges">

                                            <a onClick={() => { updateBanner() }} >Alterar</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="deleteBanner">

                                        <h3>Apagar banner</h3>

                                        <select onChange={handleSelectBannerToDelete} >

                                            <option>Selecione o banner</option>

                                            {dataBanner.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.title}</option>

                                                )

                                            })}

                                        </select>

                                        <div className="buttonChanges">

                                            <a onClick={() => { deleteBanner() }} >Apagar</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="addProductCard">

                                        <h1>Produtos em amostra</h1>

                                        <h3>Inserir novo produto</h3>

                                        <select onChange={(event) => handleSelectedProduct(event)} >

                                            <option selected disabled>Selecione o produto que deseja mostrar na página inicial</option>

                                            {dataProducts.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.title}</option>

                                                )

                                            })}

                                        </select>

                                        <input name='info' onChange={handleInputCardText} placeholder='Informação (desconto, novidade, etc)' value={productCardText.info}/>
                                        <input name='description' onChange={handleInputCardText} placeholder='Breve descrição do produto' value={productCardText.description}/>

                                        <div className="buttonChanges">

                                            <a onClick={() => { insertNewProductHome() }} >Inserir</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="deleteCardProduct">

                                        <h3>Apagar produto em amostra</h3>

                                        <select onChange={handleSelectProductCardToDelete} >

                                            <option>Selecione o produto</option>

                                            {dataProductCards.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.name}</option>

                                                )

                                            })}

                                        </select>

                                        <div className="buttonChanges">

                                            <a onClick={() => { deleteProductCard() }} >Apagar</a>

                                        </div>

                                    </fieldset>

                                </section>

                                :

                                <section id="AboutChanges">

                                    <fieldset className="updateHeroVideo">

                                        <h3>Alterar vídeo da página "Quem Somos"</h3>

                                        <input
                                            type='file'
                                            onChange={uploadVideoAltered}
                                            accept="video/*"
                                            placeholder='Vídeo'
                                        />

                                        <div className="buttonChanges">

                                            <a onClick={() => { updateAbout() }} >Alterar</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="updateIntroText">

                                        <h3>Alterar texto de Quem Somos</h3>

                                        <input
                                            name='title'
                                            onChange={handleInputTextChangeAlter}
                                            placeholder='Descrição'
                                        />

                                        <div className="buttonChanges">

                                            <a onClick={() => { updateAbout() }} >Alterar</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="addCardWine">

                                        <h3>Inserir descrição de países</h3>

                                        <input name='country' onChange={handleInputCardChange} placeholder='País' value={newDataCard.country} />
                                        <input name='desc' onChange={handleInputCardChange} placeholder='Descrição' value={newDataCard.desc} />
                                        <input type='file' onChange={uploadCardImage} accept="image/png, image/jpeg" placeholder='Imagem' />

                                        <div className="buttonChanges">

                                            <a onClick={() => { insertNewCard() }} >Inserir</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="updateCountries">

                                        <h3>Alterar descrição dos países</h3>

                                        <select className="alterCountryCard" onChange={(event) => handleSelectedCard(event)} >

                                            <option selected disabled>Selecione o país que deseja alterar</option>

                                            {dataCard.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.country}</option>

                                                )

                                            })}

                                        </select>

                                        <h3>Preencha o que deseja alterar</h3>

                                        <input
                                            name='country'
                                            onChange={handleInputCardChangeAlter}
                                            placeholder='País'
                                            value={dataAlterCard.country}
                                        />

                                        <input
                                            name='desc'
                                            onChange={handleInputCardChangeAlter}
                                            placeholder='Descrição'
                                            value={dataAlterCard.desc}
                                        />

                                        <input
                                            type='file'
                                            onChange={uploadCardImageAltered}
                                            accept="image/png, image/jpeg"
                                            placeholder='Imagem'
                                        />

                                        <div className="buttonChanges">

                                            <a onClick={() => { updateCard() }} >Alterar país</a>

                                        </div>

                                    </fieldset>

                                    <fieldset className="deleteDescription">

                                        <h3>Apagar descrição</h3>

                                        <select onChange={handleSelectCardToDelete} >

                                            <option>Selecione a descrição</option>

                                            {dataCard.map((item, index) => {

                                                return (

                                                    <option value={index} key={index}>{item.country}</option>

                                                )

                                            })}

                                        </select>

                                        <div className="buttonChanges">

                                            <a onClick={() => { deleteCard() }} >Apagar</a>

                                        </div>

                                    </fieldset>

                                </section>

                            }

                        </div>

                    </section>

                </section>

                <Footer />

            </main>

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
