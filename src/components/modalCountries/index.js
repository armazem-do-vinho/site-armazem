// import React from 'react'
// import { useEffect } from 'react'
// import "./style.scss";

// import firebase from 'firebase/app'
// import 'firebase/auth'
// import FirebaseConfig from '../../FirebaseConfig.js'

// function ModalCountries(props) {

//     const { displayProperty, modalDataCountries } = props;

//     useEffect(() => {

//         if (!firebase.apps.length)
//             firebase.initializeApp(FirebaseConfig);

//         firebase.database().ref('aboutCards').get('/aboutCards')
//             .then(function (snapshot) {

//                 if (snapshot.exists()) {

//                     var data = snapshot.val()
//                     var temp = Object.keys(data).map((key) => data[key])
//                 }
//                 else {
//                     console.log("No data available");
//                 }
//             })

//     }, [])

//     function handleModalInfos(item) {

//         setModalDataCountries(item)
//         displayModal === "none" ? setDisplayModal("flex") : setDisplayModal("none")

//     }

//     return (

//         <div style={{ display: displayProperty }} className='modalCountries' >

//             <main>

//                 <div className="CountryInfos">

//                     {console.log(data)}

//                 </div>

//             </main>

//         </div>

//     )
// }

// export default ModalCountries;