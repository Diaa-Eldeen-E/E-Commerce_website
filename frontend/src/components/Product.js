import {Button, Card, Col, Container, Form, Row, Nav} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import {useEffect, useState} from "react";
import axios from "axios";
import {maxProductImageHeight, maxProductImageWidth} from "../constants";
import AddToCartForm from "./AddToCartForm";

import {useAuth} from "./auth/AuthProvider";


const ProductReviewsTab = ({product}) => {
    return (
        <>
            {/*     Rating it */}
            <Row className='mt-5'>
                <Col>
                    <h3>Rate the product</h3>
                    <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={Math.ceil(product.rating / product.raters_count)}
                    />

                    <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={Math.ceil(product.rating / product.raters_count)}
                    />
                </Col>
            </Row>
        </>
    )
}


const Product = function () {

    const {catName, productID} = useParams();
    const [product, setProduct] = useState({});
    const {getToken} = useAuth();
    const [isDescriptionActive, setIsDescriptionActive] = useState(true);
    const [isReviewsActive, setIsReviewsActive] = useState(false);

    //    Fetch the product from the database
    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/product?q=' + productID).then((res) => {
                if (res.data.status === 200)
                    setProduct(res.data.product);
            })
        })

    }, [])

    let productImageStyle = {
        maxHeight: maxProductImageHeight,
        maxWidth: maxProductImageWidth,
        width: "auto"
    }

    const handleSelect = (eventKey) => {

        console.log(eventKey);
        if (eventKey == 'description') {
            setIsDescriptionActive(true);
            setIsReviewsActive(false);

        } else if (eventKey == 'reviews') {
            setIsDescriptionActive(false);
            setIsReviewsActive(true);

        }
    }

    return (
        <Container className='justify-content-center w-75 mx-auto mt-5'>
            <Row>

                <Col className='col-sm-auto'>

                    <Link to={'/product/' + product.id}>
                        <Card.Img src={product.image_src}
                                  style={productImageStyle}
                        />
                    </Link>
                </Col>
                <Col className='ms-5'>

                    <Container>
                        <Row>
                            <h2>{product.name}</h2>
                        </Row>

                        <Row className='mt-5'>
                            <Button className='bg-white text-warning w-auto border-0'>
                                Add to wishlist
                            </Button>
                        </Row>
                        <Row className='mt-5'>
                            <p>{product.price}</p>
                        </Row>


                        {
                            getToken() ?
                                <Row className='mt-5'>
                                    <AddToCartForm product={product}/>
                                </Row>
                                :
                                <></>
                        }
                    </Container>
                </Col>


                <Col className=''>

                </Col>


            </Row>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            {/* Description and reviews*/}
            <Row>
                <Nav variant="tabs" defaultActiveKey='description' onSelect={handleSelect} className='bg-white p-0'
                    // justify={true}
                     fill={true}>
                    <Nav.Item key={1}>
                        <Nav.Link eventKey='description'>
                            <h3>Description</h3>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="reviews">
                            <h3>Reviews</h3>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {
                    isDescriptionActive ?
                        <div className='mt-3'>
                            <p>{product.description}</p>
                        </div>
                        :
                        <ProductReviewsTab product={product}/>
                }

            </Row>

        </Container>
    )
}

export default Product;