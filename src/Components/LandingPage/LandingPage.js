import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import "./LandingPage.css";
import { useHistory } from "react-router";

export default function LandingPage(props) {
    const history=useHistory();
    return (
        <div className="landingContainer">
            <div className="landingChoice">
                <button onClick={()=>{history.push('/Login')}}>
                    LOGIN
                </button >
                <button onClick={()=>{history.push('/Register')}}>
                    REGISTER
                </button>
            </div>
        </div>
    )
}