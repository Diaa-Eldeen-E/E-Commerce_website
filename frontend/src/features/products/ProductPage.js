import { Card, Col, Container, Row, Nav } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { maxProductImageHeight, maxProductImageWidth } from "../../app/constants";
import AddToCartForm from "./AddToCartForm";
import { useSelector } from "react-redux";
import AddToWishlistButton from "./AddToWishlistButton";
import Loading from "../../common/Loading";
import ProductReviewsTab from "./ProductReviewsTab";
import ListSuperCategories from "./ListSuperCategories"
import { useGetProductQuery } from "../api/apiSlice";





const ProductPage = function ()
{

    const { productID } = useParams();
    const { userToken } = useSelector((state) => state.auth)
    const [isDescriptionActive, setIsDescriptionActive] = useState(true);
    const [isReviewsActive, setIsReviewsActive] = useState(false);

    // Load product from database
    const { data: product, isLoading, isSuccess } = useGetProductQuery(productID)


    let productImageStyle = {
        maxHeight: maxProductImageHeight,
        maxWidth: maxProductImageWidth,
        width: "auto"
    }

    const handleSelect = (eventKey) =>
    {

        if (eventKey === 'description')
        {
            setIsDescriptionActive(true);
            setIsReviewsActive(false);

        } else if (eventKey === 'reviews')
        {
            setIsDescriptionActive(false);
            setIsReviewsActive(true);
        }
    }

    return (

        isLoading ?
            <Loading />
            :
            isSuccess ?

                <Container>
                    <Row>
                        <ListSuperCategories superCategories={product.parentCategories} />
                    </Row>

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

                                    {
                                        userToken ?

                                            <Row className='mt-3'>
                                                <AddToWishlistButton product={product} />
                                            </Row>

                                            :
                                            <></>
                                    }
                                    <Row className='mt-3'>
                                        <p className='text-danger'>{product.price}$</p>
                                    </Row>


                                    {
                                        userToken ?
                                            <Row className='mt-3'>
                                                <AddToCartForm product={product} />
                                            </Row>
                                            :
                                            <></>
                                    }
                                </Container>
                            </Col>


                        </Row>

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

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
                                        <p>{product.description}</p>
                                    </div>
                                    :
                                    <ProductReviewsTab product={product} />
                            }

                        </Row>
                    </Container>
                </Container>
                :

                <h1 className='text-danger'>Error, not found</h1>
    )
}

export default ProductPage;