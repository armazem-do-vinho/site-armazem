import React  from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about'
import SignIn from './pages/signIn'
import PaymentForm from './pages/formPayment'
import Requests from './pages/requests'
import Admin from './pages/admin'
import Register from './pages/register'
import Request from './pages/admin/requests'
import userProfile from './pages/userProfile'
import Items from './pages/admin/items'
import ChangeInfo from './pages/dataChange'
import ClientsList from './pages/admin/clientsList'
import Products from './pages/products'
import Cart from './pages/cart'
import ProviderRegister from './pages/admin/providersRegister'
import Stock from './pages/admin/stock'
import Reports from './pages/admin/reports'
import Vouchers from './pages/admin/vouchers'
import ProviderProducts from './pages/admin/providersProducts'

const Routes = () => {

    return (

        <BrowserRouter>

            <Route component={Home} path='/' exact />
            <Route component={About} path='/quemsomos' />
            <Route component={Contact} path='/contato'/>
            <Route component={SignIn} path='/entrar'/>
            <Route component={Admin} path='/admin'/>
            <Route component={Register} path='/cadastrar'/>
            <Route component={Request} path='/Pedidos' />
            <Route component={userProfile} path='/Perfil' />
            <Route component={Items} path='/AdminItems' />
            <Route component={ChangeInfo} path='/AlterarDados' />
            <Route component={ClientsList} path='/ListaDeClientes' />
            <Route component={Products} path='/Produtos' />
            <Route component={Cart} path='/Carrinho' />
            <Route component={ProviderRegister} path='/AdminFornecedor' />
            <Route component={Stock} path='/AdminEstoque' />
            <Route component={Reports} path='/AdminRelatorios' />
            <Route component={ProviderProducts} path='/AdminProdutoFornecedor' />
            <Route component={PaymentForm} path='/formPayment' />
            <Route component={Requests} path='/MeusPedidos' />
            <Route component={Vouchers} path='/AdminCupons' />

        </BrowserRouter>

    )

}

export default Routes;