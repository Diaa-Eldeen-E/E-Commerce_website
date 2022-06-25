import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import {useEffect, useState} from "react";
import axios from "axios";

import {useAuth} from "./auth/AuthProvider";


const Product = function () {

    const {catName, productID} = useParams();
    const [product, setProduct] = useState({});
    const {getToken} = useAuth();

    //    Fetch the product from the database
    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/product?' + productID).then((res) => {
                if (res.data.status === 200)
                    setProduct(res.data.product);
            })
        })

    }, [])
    

    return (
        <Container>
            <Row>

                <Col md='4'>
                    <Card>
                        <Link to={'' + product.id}>
                            <Card.Img src={product.image_src}/>
                        </Link>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>

                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col className='col-8'>
                                    <StarRatingComponent
                                        name="rate1"
                                        starCount={5}
                                        value={product.stars}
                                        onStarClick={(newRating) => {

                                            setProduct((oldProducts) => {
                                                let idx = oldProducts.findIndex((p) => p.name == product.name);
                                                let tempProducts = oldProducts.slice();
                                                tempProducts[idx].stars = newRating;
                                                return tempProducts;
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className='col-4 text-danger'>
                                    {product.price}$
                                </Col>
                            </Row>
                        </Card.Footer>

                    </Card>
                </Col>

            </Row>

            <Form>
                {getToken() ? <Button>Add to cart</Button> : <></>}
            </Form>
        </Container>
    )
}

export default Product;