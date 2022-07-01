import {Button, Col, FloatingLabel, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useState, useEffect} from "react";

const AddToCartForm = function ({product}) {

    const [inputs, setInputs] = useState({'product_id': product.id});
    const [cartQty, setCartQty] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/iscarted?product_id=' + product.id).then((res) => {
                if (res.data?.iscarted)
                    setCartQty(res.data.quantity);
                else
                    setCartQty(0);
                setIsLoading(false);
            })
        })
    }, []);

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
        console.log(cartQty);
        console.log(product.stock);
    }

    const handleSubmit = function (event) {
        event.preventDefault();
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/addtocart', inputs).then((res) => {
                if (res.data.status === 200) {

                    window.location.reload(false);
                }
            })
        })
    }

    const selectOptions = function (count) {
        let rows = [];
        for (let idx = 1; idx <= count; idx++) {
            rows.push(<option value={idx} key={idx}>{idx}</option>);
        }
        return rows;
    }


    return (
        isLoading ?
            <>
            </>
            :
            product.stock - cartQty > 0 ?

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group controlId="formX">
                                <Form.Select aria-label="Default select example" name='quantity'
                                             onChange={handleChange}
                                >
                                    <option value="">Quantity</option>
                                    {
                                        selectOptions(product.stock - cartQty)
                                    }
                                </Form.Select>

                            </Form.Group>
                        </Col>
                        <Col>
                            <Button type='submit'>Add to cart</Button>
                        </Col>
                    </Row>
                </Form>

                :

                <p className='text-danger'>Not available</p>
    );
}

export default AddToCartForm;