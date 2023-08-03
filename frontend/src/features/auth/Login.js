import { Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";

import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "./authActions";

const AlertTimeout = 1000;


const Login = function ()
{

    const { loading, error, userInfo } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // In react-router-dom v6 useHistory() is replaced by useNavigate().
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({});

    const [alert, setAlert] = useState({ 'show': false, 'message': '' });

    const handleSubmit = async function (event)
    {
        event.preventDefault();
        dispatch(userLogin(inputs)).unwrap()
            .then((response) =>
            {
                console.log('Login success, ', response);
                setAlert({ 'show': true, 'message': 'Logged in successfully' });

                // if (response?.isAdmin === 1)
                //     setTimeout(() => navigate('/admin'), AlertTimeout);
                // else
                setTimeout(() => navigate('/'), AlertTimeout);
            })
            .catch((error) => console.log("unwrapped error during login: ", error))

    }


    const handleChange = (event) =>
    {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({ ...inputs, [Name]: Value });
        console.log("Name: " + Name, "Value: " + Value);
    }


    return (

        <Container className='mt-5 w-50'>
            <SweetAlert show={alert.show} title='Success' success
                onConfirm={() => setAlert({ ...alert, 'show': false })}>{alert.message}</SweetAlert>
            <Form onSubmit={handleSubmit}>
                <p className='text-danger'>{error}</p>
                <Form.Group className='mb-3' controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' name='username' placeholder='Username' onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={handleChange} />
                </Form.Group>

                {/*<Form.Group className="mb-3" controlId="formBasicCheckbox">*/}
                {/*    <Form.Check type="checkbox" label="Check me out"/>*/}
                {/*</Form.Group>*/}
                <Button variant="primary" type="submit" disabled={loading}>
                    Submit
                </Button>
            </Form>
        </Container>
    )

}


export default Login;


// Old handle login submit button (Before redux)
// const handleSubmit = function (event)
//     {
//         event.preventDefault();

//         // TODO: Save previous location, and redirect to it after login
//         // https://github.com/gitdagray/react_protected_routes/blob/main/src/components/Login.js
//         // https://www.youtube.com/watch?v=oUZjO00NkhY

//         try
//         {
//             // onLogin(inputs);

//             axios.get('/sanctum/csrf-cookie').then((response) =>
//             {
//                 axios.post('/api/login', inputs).then((res) =>
//                 {
//                     console.log(res);
//                     if (res.data.status === 200)
//                     {
//                         localStorage.setItem('auth_name', res.data.username);
//                         localStorage.setItem('auth_token', res.data.token);
//                         // setToken(res.data.token);
//                         // if (res.data.isAdmin == 1)
//                         // setIsAdmin(true);
//                         // dispatch(login(res.data))
//                         setAlert({ 'show': true, 'message': res.data.message });
//                         if (res.data?.isAdmin == 1)
//                             setTimeout(() => navigate('/admin'), AlertTimeout);
//                         else
//                             setTimeout(() => navigate('/'), AlertTimeout);

//                     } else if (res.data.status === 401)
//                     {
//                         setErrorMessage(res.data.message);
//                     } else
//                     {
//                         console.log('Login error');
//                         setErrorMessage(res.data.message);
//                         navigate('/login');
//                     }
//                 })
//             })

//         } catch (err)
//         {
//             console.log("Error occurred during login, " + err);
//         }
//     }