import { useEffect, useState } from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { Link } from 'react-router-dom'
import './style.scss'

import firebase from 'firebase/app'
import 'firebase/auth'

function Admin() {

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

            <div className='Admin'>

                <Header />

                <div id='mainAdmin' >

                    <div className='titleAdmin' >
                        <h1>Bem vindos, equipe Armazém do Vinho 🍷</h1>
                    </div>

                    <div className='titleAdmin' >
                        <h3>O que deseja fazer?</h3>
                    </div>

                    <div className='optionAdminPage' >

                        <ul>

                            <Link to="/Pedidos" >Pedidos em andamento</Link>
                            <Link to="/AdminItems" >Cadastro/alteração de itens</Link>
                            {/* <Link to="/AdminVendedor" >Cadastro/alteração de vendedores</Link> */}
                            {/* <Link to="/AdminFornecedor" >Cadastro/alteração de fornecedores </Link> */}
                            {/* <Link to='/AdminProdutoFornecedor' >Cadastro/alteração de produtos dos fornecedores</Link> */}
                            {/* <Link to='/PedidoFornecedor' >Realizar pedido do fornecedor</Link> */}
                            <Link to="/ListaDeClientes" >Listagem de clientes</Link>
                            <Link to="/AdminRelatorios" >Relatórios</Link>
                            <Link to="/AdminEstoque" >Estoque</Link>
                            <Link to="/AdminCupons" >Gerenciar cupons</Link>
                            <Link to="/AlterarConteudos" >Alterar conteúdos</Link>
                            
                        </ul>

                    </div>

                </div>

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

export default Admin