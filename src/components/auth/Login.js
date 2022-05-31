import {Form, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {useAuth} from "./AuthProvider";

const Login = function () {

    const [inputs, setInputs] = useState({});
    const {onLogin, errorMessage} = useAuth();

    const handleSubmit = async function (event) {
        event.preventDefault();

        try {
            onLogin(inputs);

        } catch (err) {
            console.log("Error occurred during login, " + err);
        }
    }

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
    }


    return (
        <Container className='mt-5 w-50'>
            <Form onSubmit={handleSubmit}>
                <p className='text-danger'>{errorMessage}</p>
                <Form.Group className='mb-3' controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' name='username' placeholder='Username' onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={handleChange}/>
                </Form.Group>

                {/*<Form.Group className="mb-3" controlId="formBasicCheckbox">*/}
                {/*    <Form.Check type="checkbox" label="Check me out"/>*/}
                {/*</Form.Group>*/}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )

}


export default Login;