import { React } from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import Header from '../../components/header'
import Footer from '../../components/footer'
import addButton from '../../img/plus.svg'
import removeButton from '../../img/minus.svg'

import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../FirebaseConfig.js'

function Products() {

    const [data, setData] = useState([])
    const [dataBackup, setDataBackup] = useState([])
    const [searchInput, setSearchInput] = useState([])
    const [minProductPrice, setMinProductPrice] = useState(0)
    const [maxProductPrice, setMaxProductPrice] = useState(999)
    const [displaySearchResult, setDisplaySearchResult] = useState('none')
    const [displayMobileSearch, setDisplayMobileSearch] = useState('none')
    const [displayButtonFinishOrder, setDisplayButtonFinishOrder] = useState('none')
    const [totalValue, setTotalValue] = useState(0)
    const [selectedProduct, setSelectedProduct] = useState('')
    const [totalProducts, setTotalProducts] = useState(0)

    useEffect(() => {

        if (!firebase.apps.length)
            firebase.initializeApp(firebaseConfig);

        var firebaseRef = firebase.database().ref('items/');

        firebaseRef.on('value', (snapshot) => {

            if (snapshot.exists()) {

                var data = snapshot.val()
                var temp = Object.keys(data).map((key) => data[key])
                setData(temp)
                setDataBackup(temp)

            }
            else {
                console.log("No data available");
            }

        });

    }, []);

    useEffect(() => {

        if (totalValue == 0) {

            setDisplayButtonFinishOrder('none')

        }

    })

    function searchItem() {

        var itens = []

        data.map((item) => {

            var title = item.title.toLowerCase()
            var desc = item.desc.toLowerCase()
            var search = searchInput.toLowerCase()

            // if (title.includes(searchInput) || desc.includes(searchInput))
            if (title.includes(search))
                itens.push(item)

        })

        setData(itens)
        setDisplaySearchResult('flex')

    }

    function handleSearchInput(event) {

        if (event.key === 'Enter') {

            clearSearchItem()
            searchItem()

        }
        setSearchInput(event.target.value)

    }

    function filterItemByPrice() {

        var itens = []

        data.map((item) => {

            if (Number(item.price) >= minProductPrice && Number(item.price) <= maxProductPrice)
                itens.push(item)

        })

        setData(itens)
        setDisplaySearchResult('flex')

    }

    function clearSearchItem() {

        setDisplaySearchResult('none')
        setData(dataBackup)
        setSelectedProduct('')

    }

    function handleDisplaySearchMobile() {

        if (displayMobileSearch === 'none')
            setDisplayMobileSearch('flex')
        else
            setDisplayMobileSearch('none')

    }

    function handleMinProductPrice(event) {

        if (event.key === 'Enter')
            filterItemByPrice()

    }

    function handleMaxProductPrice(event) {

        if (event.key === 'Enter')
            filterItemByPrice()

    }

    function add(index) {

        var dataTemp = data
        dataTemp[index].amount = dataTemp[index].amount + 1

        var totalValueTemp = Number(dataTemp[index].price) + totalValue

        setData(dataTemp)
        setTotalValue(totalValueTemp)
        setDisplayButtonFinishOrder('block')

    }

    function remove(index) {

        var dataTemp = data

        if (dataTemp[index].amount > 0) {

            dataTemp[index].amount = dataTemp[index].amount - 1
            var totalValueTemp = totalValue - Number(dataTemp[index].price)

            setData(dataTemp)
            setTotalValue(totalValueTemp)

        }

    }

    let history = useHistory();

     function addToCart() {

        const temp = JSON.parse(localStorage.getItem('products'))
        var listOfItems = temp !== null ? Object.keys(temp).map((key) => temp[key]) : []

        const newItems = []

        data.map((item) => {

            if (item.amount > 0)
                newItems.push(item)

        })

        if (listOfItems.length > 0) {

            newItems.map(item=>listOfItems.push(item))

            console.log('listOfItems',listOfItems)
            
            localStorage.setItem('products', JSON.stringify(listOfItems))

        }
        else {

            newItems.map(item=>listOfItems.push(item))
            localStorage.setItem('products', JSON.stringify(listOfItems))

        }

        history.push('/Carrinho')

    }

    function handleSelectedProduct(event) {

        setSelectedProduct(event.target.innerText)

        var counter = 0

        setTotalProducts(counter)
    
    }

    useEffect(() => {

        var counter = 0

        data.map((item) => {

            if (selectedProduct === item.type || selectedProduct === item.sweetness || selectedProduct === item.country) {

                counter ++
                
            } else if (selectedProduct === '') {

                counter ++

            }

        })

        setTotalProducts(counter)

    })
        
    // newItems.map(newItems => {

    //     listOfItems.map(listItems => {

    //         if (newItems.id === listItems.id) {

    //             listItems.amount = newItems.amount
    //             newItems.map(item=>listOfItems.push(item))


    //         }

    //     })

    // })

    return (

        <div className="Products">

            <Header />

            <section id="productsSelectList">

                <ul className="optionsList">

                    <li onClick={handleSelectedProduct}>Tinto</li>
                    <li onClick={handleSelectedProduct}>Branco</li>
                    <li onClick={handleSelectedProduct}>Rosé</li>
                    <li onClick={handleSelectedProduct}>Espumante</li>
                    <li onClick={handleSelectedProduct}>Seco</li>
                    <li onClick={handleSelectedProduct}>Suave</li>
                    <li onClick={handleSelectedProduct}>Kits</li>
                    <li onClick={handleSelectedProduct}>Espanha</li>
                    <li onClick={handleSelectedProduct}>Argentina</li>
                    <li onClick={handleSelectedProduct}>Portugal</li>
                    <li onClick={handleSelectedProduct}>Chile</li>
                    <li onClick={handleSelectedProduct}>França</li>
                    <li onClick={handleSelectedProduct}>Brasil</li>
                    <li onClick={handleSelectedProduct}>Outros</li>

                </ul>

            </section>

            <section id="productsSearchSection">

                <div className="leftSideProducts">

                    <div className="textInfoProducts">

                        {selectedProduct !== '' ? <h1>{selectedProduct}</h1> : <h1>Todos produtos</h1>}
                        {totalProducts > 1 ? <span>{totalProducts} produtos encontrados</span> : <span>{totalProducts} produto encontrado</span>}

                    </div>

                    <div className="searchProduct">

                        <div className='filterProducts'>

                            <h4>Pesquisar produto</h4>

                            <div className='search'>

                                <input type="text" placeholder="Procurar" onKeyDown={handleSearchInput} />

                            </div>

                            <h4>Preço</h4>

                            <div className='filtersInputs'>

                                <input
                                    placeholder='Mín'
                                    type='number'
                                    onChange={(event) => setMinProductPrice(Number(event.target.value))}
                                    onKeyDown={handleMinProductPrice} />

                                <input
                                    placeholder='Max'
                                    type='number'
                                    onChange={(event) => setMaxProductPrice(Number(event.target.value))}
                                    onKeyDown={handleMaxProductPrice} />

                            </div>

                            <div className="buttonClearSearch">

                                <button onClick={() => { clearSearchItem() }}>Limpar pesquisa</button>

                            </div>

                        </div>

                        <div className="buttonFinishOrder" style={{ display: displayButtonFinishOrder }}>

                            <button onClick={() => addToCart()}>Finalizar Pedido - R$ {totalValue.toFixed(2)}</button>
                            
                        </div>

                    </div>

                </div>

                <div className="rightSideProducts">

                    {
                        data.map((item, index) => {

                            if (item.itemAvailability === 'true' && (selectedProduct === item.type || selectedProduct === item.sweetness || selectedProduct === item.country)) { 
                                
                                return (
                                    
                                    <div className="showProductContainer">

                                        <div className="showProductCard">

                                            <div className="imageProductWrapper">

                                                <img src={item.imageSrc} alt="" />

                                            </div>

                                            <div className="descriptionProduct">

                                                <h4>{item.title}</h4>

                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam praesentium atque itaque!</p>

                                                <span>{item.country} • {item.type} • {item.sweetness} </span>

                                            </div>

                                            <div className="priceProduct">

                                                <h3>R$ {Number(item.price).toFixed(2)}</h3>

                                                <div className='amountProduct' >

                                                    <div className="removeButton">

                                                        <img
                                                            src={removeButton}
                                                            onClick={() => { remove(index) }}
                                                            alt="Remover item"
                                                        />

                                                    </div>

                                                    <b>{item.amount}</b>

                                                    <div className="addButton">

                                                        <img
                                                            src={addButton}
                                                            onClick={() => { add(index) }}
                                                            alt="Adicionar item"
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )

                            } else if (item.itemAvailability === 'true' && selectedProduct === '') {

                                return (

                                    <div className="showProductContainer">

                                        <div className="showProductCard">

                                            <div className="imageProductWrapper">

                                                <img src={item.imageSrc} alt="" />

                                            </div>

                                            <div className="descriptionProduct">

                                                <h4>{item.title}</h4>

                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam praesentium atque itaque!</p>

                                                <span>{item.country} • {item.type} • {item.sweetness} </span>

                                            </div>

                                            <div className="priceProduct">

                                                <h3>R$ {Number(item.price).toFixed(2)}</h3>

                                                <div className='amountProduct' >

                                                    <div className="removeButton">

                                                        <img
                                                            src={removeButton}
                                                            onClick={() => { remove(index) }}
                                                            alt="Remover item"
                                                        />

                                                    </div>

                                                    <b>{item.amount}</b>

                                                    <div className="addButton">

                                                        <img
                                                            src={addButton}
                                                            onClick={() => { add(index) }}
                                                            alt="Adicionar item"
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )

                            }

                        })
                    }

                </div>

            </section>

            <Footer />

        </div>

    )

}

export default Products;