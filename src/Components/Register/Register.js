import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Register.css";
import registerUser from "../../api/registerUser";
import { login, logout } from "../../utils";
import { useHistory } from "react-router";
import { sha512 } from 'js-sha512';

export default function Register(props) {
    const history = useHistory();
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return pseudo.length > 0 && email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        registerUser(pseudo, email, sha512(password))
            .then(
                history.push({
                    pathname: '/login'
                })
            )
    }

    return (
        <div className="ContainerLogin">
            <div className="Login">
                <Form onSubmit={handleSubmit}>
                    <div className="champ">
                        <Form.Group size="lg" controlId="pseudo">
                            <Form.Control
                                autoFocus
                                type="text"
                                value={pseudo}
                                placeholder="Pseudo"
                                onChange={(e) => setPseudo(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div className="champ">
                        <Form.Group size="lg" controlId="email">
                            <Form.Control
                                autoFocus
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div className="champ">
                        <Form.Group size="lg" controlId="password">
                            <Form.Control
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <button block size="lg" type="submit" disabled={!validateForm()}>
                        Register
                    </button>
                </Form>
            </div>
        </div>
    );
}
