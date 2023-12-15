import { Button, Col, Fade, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useIsCartedQuery, useAddToCartMutation } from "../api/apiSlice";

const AddToCartForm = function ({ product })
{

    const [inputs, setInputs] = useState({ 'product_id': product.id });
    const [isSuccess, setIsSuccess] = useState(false);

    const { data: productInCart, isLoading } = useIsCartedQuery(product.id)
    const [addToCart, { isLoading: isCarting, error }] = useAddToCartMutation()


    const handleChange = (event) =>
    {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({ ...inputs, [Name]: Value });
        console.log("Name: " + Name, "Value: " + Value);
    }

    const handleSubmit = function (event)
    {
        event.preventDefault();
        addToCart(inputs).unwrap()
            .then(() => setIsSuccess(true))
            .catch(error =>
            {
                console.log("add to cart error: ", error);
            })
    }

    const selectOptions = function (count)
    {
        let rows = [];
        for (let idx = 1; idx <= count; idx++)
        {
            rows.push(<option value={idx} key={idx}>{idx}</option>);
        }
        return rows;
    }

    return (
        isLoading ?
            <>
            </>
            :
            product.stock - (productInCart?.quantity ? productInCart.quantity : 0) ?

                <Form onSubmit={handleSubmit}>

                    {/* Add to cart flash message */}
                    <Fade in={isSuccess} onEntered={() => setTimeout(() => setIsSuccess(false), 1500)}
                        className='text-success'><p>Item added to cart</p></Fade>

                    <Row>
                        <Col>
                            <Form.Group controlId="formX">
                                <Form.Select aria-label="Default select example" name='quantity'
                                    onChange={handleChange}
                                >
                                    <option value="">Quantity</option>
                                    {
                                        selectOptions(product.stock - (productInCart?.quantity ? productInCart.quantity : 0))
                                    }
                                </Form.Select>

                            </Form.Group>
                        </Col>
                        <Col>
                            <Button type='submit' disabled={isCarting}>Add to cart</Button>
                        </Col>
                    </Row>
                </Form>

                :

                <p className='text-danger'>Not available</p>
    );
}

export default AddToCartForm;