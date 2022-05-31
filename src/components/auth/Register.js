import {Form, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {useAuth} from "./AuthProvider";

const Register = function () {

    const [inputs, setInputs] = useState({});
    const {onRegister, errorMessage, validationErrors} = useAuth();

    const handleSubmit = async function (event) {
        event.preventDefault();

        try {
            onRegister(inputs);

        } catch (err) {
            console.log("Error occurred during registration, " + err);
        }
    }

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});

        console.log("Name:" + Name, ", Value:" + Value);
    }

    return (
        <Container className='mt-5 w-50'>
            <Form onSubmit={handleSubmit}>
                <p className='text-danger'>{errorMessage}</p>
                <Form.Group className='mb-3' controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' name='username' placeholder='Username' onChange={handleChange}
                                  isInvalid={validationErrors.username}/>
                    <Form.Control.Feedback type='invalid'>{validationErrors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" name='email' placeholder="Email" onChange={handleChange}
                                  isInvalid={validationErrors.email}/>
                    <Form.Control.Feedback type='invalid'>{validationErrors.email}</Form.Control.Feedback>
                    {/*<Form.Text className="text-muted">*/}
                    {/*    We'll never share your email with anyone else.*/}
                    {/*</Form.Text>*/}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={handleChange}
                                  isInvalid={validationErrors.password}/>
                    <Form.Control.Feedback type='invalid'>{validationErrors.password}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )


}


export default Register;