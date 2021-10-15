import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";
import verifyLogin from "../../api/verifyLogin";
import { login, logout} from "../../utils";
import { useHistory } from "react-router";
import { sha512 } from 'js-sha512';

export default function Login(props) {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        verifyLogin(email, sha512(password))
        .then(data=>{
            if (data.length > 0) {
                login(data[0].UserID);
                setTimeout(() => {
                  history.push({
                    pathname : '/player'
                  })
                }, 500)
            } else {
                alert("Renseignez des identifiants valides !");
            }
        })
    }

    return (
        <div className="ContainerLogin">
            <div className="Login">
                <Form onSubmit={handleSubmit}>
                    <div className="champ">
                        <Form.Group size="lg" controlId="email">
                            <Form.Control
                                placeholder="Email Adress"
                                autoFocus
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div className="champ" >
                    <Form.Group size="lg" controlId="password" style={{borderRadius: '5px!important'}}>
                        <Form.Control
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    </div>
                    <button block size="lg" type="submit" disabled={!validateForm()}>
                        Login
                    </button>
                </Form>
            </div>
        </div>
    );
}
