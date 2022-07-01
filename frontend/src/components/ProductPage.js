import {Button, Card, Col, Container, Form, Row, Nav} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import {useEffect, useState} from "react";
import axios from "axios";
import {maxProductImageHeight, maxProductImageWidth} from "../constants";
import AddToCartForm from "./AddToCartForm";

import {useAuth} from "./auth/AuthProvider";
import AddToWishlistButton from "./AddToWishlistButton";
import Loading from "./Loading";
import ProductReviewsTab from "./ProductReviewsTab";


const ProductPage = function () {

    const {catName, productID} = useParams();
    const [product, setProduct] = useState({});
    const {getToken} = useAuth();
    const [isDescriptionActive, setIsDescriptionActive] = useState(true);
    const [isReviewsActive, setIsReviewsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //    Fetch the product from the database
    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/product?q=' + productID).then((res) => {
                if (res.data.status === 200)
                    setProduct(res.data.product);

                setIsLoading(false);
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

        <>
            {
                isLoading ?
                    <Loading/>
                    :
                    product?.id > 0 ?
                        <Container className='justify-content-center w-75 mx-auto mt-5'>
                            <Row>

                                {/* ProductPage image */}
                                <Col className='col-sm-auto'>

                                    <Link to={'/product/' + product.id}>
                                        <Card.Img src={product.image_src}
                                                  style={productImageStyle}
                                        />
                                    </Link>
                                </Col>

                                {/* ProductPage name, price, add to cart, wishlist, etc*/}
                                <Col className='ms-8'>
                                    <Container>
                                        <Row>
                                            <h2>{product.name}</h2>
                                        </Row>

                                        <Row className='mt-3'>
                                            <AddToWishlistButton product={product}/>
                                        </Row>
                                        <Row className='mt-3'>
                                            <p className='text-danger'>{product.price}$</p>
                                        </Row>


                                        {
                                            getToken() ?
                                                <Row className='mt-3'>
                                                    <AddToCartForm product={product}/>
                                                </Row>
                                                :
                                                <></>
                                        }
                                    </Container>
                                </Col>


                            </Row>

                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>

                            {/* Description and reviews*/}
                            <Row>
                                <Nav variant="tabs" defaultActiveKey='description' onSelect={handleSelect}
                                     className='bg-white p-0'
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
                                            <p dangerouslySetInnerHTML={{__html: product.description}}/>
                                        </div>
                                        :
                                        <ProductReviewsTab product={product}/>
                                }

                            </Row>
                        </Container>

                        :

                        <h4 className='text-danger'>Error, not found</h4>
            }
        </>
    )
}

export default ProductPage;