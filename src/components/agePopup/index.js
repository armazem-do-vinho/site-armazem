import React, { useState } from 'react';
import './style.scss'

function AgePopup() {

    const [displayPopup, setDisplayPopup] = useState('flex');
    const ageVerify = localStorage.getItem('userAge')

    function changeModal() {

        localStorage.setItem('userAge', true)
        setDisplayPopup('none')

    }

    if(ageVerify == 'true') {

        return null

    } else {

        return (

            <div id="ageWrapper">
    
                <div className="agePopup">
    
                    <h2>Seja bem-vindo(a) ao Armazém do vinho!</h2>
                    <h3>Você tem mais de 18 anos?</h3>
    
                    <div className="buttonsPopup" style={{ display: displayPopup }}>
    
                        <a onClick={() => {changeModal()}} id="ageHigher">Sim</a>
                        <a href="https://google.com" id="ageLower">Não</a>
    
                    </div>
    
                </div>
    
            </div>
    
        )

    }

}

export default AgePopup;