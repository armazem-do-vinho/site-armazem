import { useEffect, useState } from 'react'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import firebaseConfig from '../../../FirebaseConfig.js'

import { Link } from 'react-router-dom'

function Items() {

    const [wasChanged, setWasChanged] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [alteredImageUrl, setAlteredImageUrl] = useState('')
    const [dataAlterItem, setDataAlterItem] = useState({

        imageSrc: '',
        title: '',
        desc: '',
        price: '',
        itemAvailability: 0,
        country: '',
        type: '',
        sweetness: '',
        amountInStock: '',
        itemWeight: '',
        itemWidth: '',
        itemHeight: '',
        itemLength: '',

    })

    const [selectItem, setSelectItem] = useState('')
    const [selectItemToDelete, setSelectItemToDelete] = useState('')

    const [dataAdmin, setDataAdmin] = useState([])
    const [dataKeysAdm, setDataKeysAdm] = useState([])
    const [newDataAdmin, setNewDataAdmin] = useState({

        imageSrc: '',
        title: '',
        desc: '',
        price: '',
        itemAvailability: 0,
        country: '',
        type: '',
        sweetness: '',
        amountInStock: '',
        itemWeight: '',
        itemWidth: '',
        itemHeight: '',
        itemLength: '',

    })

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('items/');

        firebaseRef.on('value', (snapshot) => {
    
            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setDataAdmin(temp.sort((a,b)=> {

                  return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)

                }))
            }
            else {
              console.log("No data available");
            }
        })

    }, [])

    useEffect(() => {

        if(dataAdmin) {

            var keys = []
            dataAdmin.map((item) => keys.push(item.id))
            setDataKeysAdm(keys)
        }

    }, [dataAdmin]);

    function handleInputAdminChange(event) {

        const { name, value } = event.target

        setNewDataAdmin({

            ...newDataAdmin, [name]: value

        })

    }

    function handleInputAdminChangeAlter(event) {

        const { name, value } = event.target

        setDataAlterItem({

            ...dataAlterItem, [name]: value

        })

    }

    function handleSelectItem(event) {

        setSelectItem(event.target.value)
  
        setDataAlterItem(dataAdmin[event.target.value])

        // console.log(dataAdmin[event.target.value])
  
      }

    function handleSelectItemToDelete(event) {

        setSelectItemToDelete(event.target.value)

    }

    function insertNewItem() {

        const id = firebase.database().ref().child('items').push().key

        const data = {

            imageSrc: imageUrl,
            title: newDataAdmin.title,
            desc: newDataAdmin.desc,
            price: newDataAdmin.price,
            id: id,
            itemAvailability: newDataAdmin.itemAvailability,
            itemWeight: newDataAdmin.itemWeight,
            itemWidth: newDataAdmin.itemWidth,
            itemHeight: newDataAdmin.itemHeight,
            itemLength: newDataAdmin.itemLength,
            country: newDataAdmin.country,
            type: newDataAdmin.type,
            sweetness: newDataAdmin.sweetness,
            amountInStock: newDataAdmin.amountInStock,
            amount: 0

        }

        firebase.database().ref('items/' + id)
        .set(data)
        .then(err => console.log(err))

        setNewDataAdmin({

            imageSrc: '',
            title: '',
            desc: '',
            price: '',
            itemAvailability: 0,
            itemWeight: '',
            itemWidth: '',
            itemHeight: '',
            itemLength: '',
            country: '',
            type: '',
            sweetness: '',

        })

        alert("Item inserido com sucesso!")
        window.location.reload()

    }

    function updateItem() {

        const newItem = {

        imageSrc: alteredImageUrl !== '' ? alteredImageUrl : dataAdmin[selectItem].imageSrc,
        title: dataAlterItem.title !== '' ? dataAlterItem.title : dataAdmin[selectItem].title,
        desc: dataAlterItem.desc !== '' ? dataAlterItem.desc : dataAdmin[selectItem].desc,
        itemWeight: dataAlterItem.itemWeight !== '' ? dataAlterItem.itemWeight : dataAdmin[selectItem].itemWeight,
        itemWidth: dataAlterItem.itemWidth !== '' ? dataAlterItem.itemWidth : dataAdmin[selectItem].itemWidth,
        itemHeight: dataAlterItem.itemHeight !== '' ? dataAlterItem.itemHeight : dataAdmin[selectItem].itemHeight,
        itemLength: dataAlterItem.itemLength !== '' ? dataAlterItem.itemLength : dataAdmin[selectItem].itemLength,
        price: dataAlterItem.price !== 0 ? dataAlterItem.price : dataAdmin[selectItem].price,
        itemAvailability: dataAlterItem.itemAvailability !== 0 ? dataAlterItem.itemAvailability : dataAdmin[selectItem].itemAvailability,
        country: dataAlterItem.country !== 0 ? dataAlterItem.country : dataAdmin[selectItem].country,
        type: dataAlterItem.type !== 0 ? dataAlterItem.type : dataAdmin[selectItem].type,
        sweetness: dataAlterItem.sweetness !== 0 ? dataAlterItem.sweetness : dataAdmin[selectItem].sweetness,
        amountInStock: dataAlterItem.amountInStock !== 0 ? dataAlterItem.amountInStock : dataAdmin[selectItem].amountInStock,
        }
        firebase.database()
        .ref('items/' + dataKeysAdm[selectItem])
        .update(newItem)
        .then(() => alert("Item atualizado com sucesso!"))
        window.location.reload()


    }

    function deleteItem() {

        firebase.database()
            .ref('items/' + dataKeysAdm[selectItemToDelete])
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

    function handleInputLoginChange(event) {

        const {name, value} = event.target

        setLoginData ({

            ...loginData, [name]: value

        })
        
    }

    if (userIsLogged) {
        return (

            <div className='AdminItems'>
    
                <Header />
    
                <main id='mainItems' >
    
                    <div className='itemsOptions' >
    
                        <h1>Cadastro de produtos</h1>
    
                        <fieldset>
    
                            <legend>
                                <h2>Inserir novo item</h2>
                            </legend>
    
                            <input name='title' onChange={handleInputAdminChange} placeholder='Nome' value={newDataAdmin.title} />
    
                            <input name='desc' onChange={handleInputAdminChange} placeholder='Descrição' value={newDataAdmin.desc} />
    
                            <input name='itemWeight' onChange={handleInputAdminChange} placeholder='Peso (em kg)' type='number' value={newDataAdmin.itemWeight} />
    
                            <input name='itemWidth' onChange={handleInputAdminChange} placeholder='Largura (em cm)' type='number' value={newDataAdmin.itemWidth} />
    
                            <input name='itemHeight' onChange={handleInputAdminChange} placeholder='Altura (em cm)' type='number' value={newDataAdmin.itemHeight} />
    
                            <input name='itemLength' onChange={handleInputAdminChange} placeholder='Comprimento (em cm)' type='number' value={newDataAdmin.itemLength} />
    
                            <input name='price' onChange={handleInputAdminChange} placeholder='Valor' type='number' value={newDataAdmin.price} />
    
                            <input name='amountInStock' onChange={handleInputAdminChange} placeholder='Quantidade em estoque' type='number' value={newDataAdmin.amountInStock} />
    
                            <input type='file' onChange={uploadImage} accept="image/png, image/jpeg" placeholder='Imagem' />
    
                            <select onChange={handleInputAdminChange} name='itemAvailability' >
    
                                <option value={0} >Disponibilidade</option>
                                <option value={true} >Disponível</option>
                                <option value={false} >Indisponível</option>
    
                            </select>
    
                            <select onChange={handleInputAdminChange} name='country' value={newDataAdmin.country} >
    
                                <option value={0} >País</option>
                                <option value="Argentina" >Argentina</option>
                                <option value="Brasil" >Brasil</option>
                                <option value="Chile" >Chile</option>
                                <option value="Espanha" >Espanha</option>
                                <option value="França" >França</option>
                                <option value="Portugal" >Portugal</option>
    
                            </select>
    
                            <select onChange={handleInputAdminChange} name='type' value={newDataAdmin.type} >
    
                                <option value={0} >Tipo</option>
                                <option value="Branco" >Branco</option>
                                <option value="Espumante" >Espumante</option>
                                <option value="Rosé" >Rosé</option>
                                <option value="Tinto" >Tinto</option>
                                <option value="Kits" >Kits</option>
                                <option value="Outros" >Outros</option>
    
                            </select>
    
                            <select onChange={handleInputAdminChange} name='sweetness' value={newDataAdmin.sweetness} >
    
                                <option value={0} >Doçura</option>
                                <option value="Seco" >Seco</option>
                                <option value="Suave" >Suave</option>
    
                            </select>
    
                            <div className="buttonProducts">
    
                                <a onClick={() => { insertNewItem() }} >Inserir</a>
    
                            </div>
    
                        </fieldset>
    
                        <fieldset>
    
                            <legend>
                                <h2>Alterar item</h2>
                            </legend>
    
                            <select onChange={(e)=>handleSelectItem(e)} >
    
                                <option>Selecione o item</option>
    
                                {dataAdmin.map((item, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{item.title}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <h4>Preencha o que deseja alterar</h4>
    
                            <input 
                                name='title' 
                                onChange={handleInputAdminChangeAlter} 
                                placeholder='Nome'
                                value={dataAlterItem.title}
                            />
    
                            <input
                                name='desc'
                                onChange={handleInputAdminChangeAlter}
                                placeholder='Descrição'
                                value={dataAlterItem.desc}
                            />
    
                            <input
                                name='itemWeight'
                                onChange={handleInputAdminChangeAlter}
                                placeholder='Peso (em kg)'
                                value={dataAlterItem.itemWeight}
                            />
    
                            <input
                                name='itemWidth'
                                onChange={handleInputAdminChangeAlter}
                                placeholder='Largura (em cm)'
                                value={dataAlterItem.itemWidth}
                            />
    
                            <input
                                name='itemHeight'
                                onChange={handleInputAdminChangeAlter}
                                placeholder='Altura (em cm)'
                                value={dataAlterItem.itemHeight}
                            />
    
                            <input
                                name='itemLength'
                                onChange={handleInputAdminChangeAlter}
                                placeholder='Comprimento (em cm)'
                                value={dataAlterItem.itemLength}
                            />
    
                            <input
                                name='price'
                                type='number'
                                placeholder='Preço'
                                value={dataAlterItem.price}
                                onChange={handleInputAdminChangeAlter}
                            />
    
                            <input 
                              type='file'
                              onChange={uploadImageAltered}
                              accept="image/png, image/jpeg"
                              placeholder='Imagem'
                            />
    
                            <input
                              name='amountInStock'
                              onChange={handleInputAdminChangeAlter}
                              placeholder='Quantidade em estoque'
                              value={dataAlterItem.amountInStock}
                            />
    
                            <select onChange={handleInputAdminChangeAlter} name='itemAvailability' >
               
                                <option value={0} >Disponibilidade</option>
                                <option value={true} >Disponível</option>
                                <option value={false} >Indisponível</option>
                            
                            </select>
    
                            <select onChange={handleInputAdminChangeAlter} name='country' value={dataAdmin[selectItem]?.country} >
    
                                <option value="Argentina" >Argentina</option>
                                <option value="Brasil" >Brasil</option>
                                <option value="Chile" >Chile</option>
                                <option value="Espanha" >Espanha</option>
                                <option value="França" >França</option>
                                <option value="Portugal" >Portugal</option>
    
                            </select>
    
                            <select onChange={handleInputAdminChangeAlter} name='type' value={dataAdmin[selectItem]?.type} >
    
                                <option value={0} >Tipo</option>
                                <option value="Branco" >Branco</option>
                                <option value="Espumante" >Espumante</option>
                                <option value="Rosé" >Rosé</option>
                                <option value="Tinto" >Tinto</option>
                                <option value="Kits" >Kits</option>
                                <option value="Outros" >Outros</option>
    
                            </select>
    
                            <select onChange={handleInputAdminChangeAlter} name='sweetness' value={dataAdmin[selectItem]?.sweetness} >
                            
                                <option value={0} >Doçura</option>
                                <option value="Seco" >Seco</option>
                                <option value="Suave" >Suave</option>
    
                            </select>
                            
                            <div className="buttonProducts">
    
                                <a onClick={() => { setWasChanged(true); updateItem(); }} >Alterar</a>
    
                            </div>
    
                        </fieldset>
    
                        <fieldset>
    
                            <legend>
                                <h2>Apagar item</h2>
                            </legend>
    
                            <select onChange={handleSelectItemToDelete} >
    
                                <option>Selecione o item</option>
    
                                {dataAdmin.map((item, index) => {
    
                                    return (
    
                                        <option value={index} key={index}>{item.title}</option>
    
                                    )
    
                                })}
    
                            </select>
    
                            <div className="buttonProducts">
    
                                <a id="deleteButton" onClick={() => { deleteItem() }} >Apagar</a>
    
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

export default Items