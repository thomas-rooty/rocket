import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";
import registerUser from "../../api/registerUser";
import { login, logout } from "../../utils";
import { useHistory } from "react-router";
import { sha512 } from 'js-sha512';

export default function Login(props) {
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
            .then(data => {
                if (data.length > 0) {
                    history.push({
                        pathname: '/login'
                    })
                }
            })
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="pseudo">
                    <Form.Label>Pseudo</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Register
                </Button>
            </Form>
        </div>
    );
}
