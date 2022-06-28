import {Card, Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";

const ProductItem = function ({product, isAdmin}) {

    return (
        <>
            <Col style={{maxWidth: "500px"}}>
                <Card>
                    <Link to={(isAdmin ? '/admin' : '') + '/product/' + product.id}>
                        <Card.Img src={product.image_src}
                                  style={{maxHeight: "200px", maxWidth: "500px", width: "auto"}}/>
                    </Link>
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>

                    </Card.Body>
                    <Card.Footer>
                        <Row>
                            <Col>
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={Math.ceil(product.rating / product.raters_count)}
                                    // onStarClick={(newRating) => {
                                    //
                                    //     setProductsState((oldProducts) => {
                                    //         let idx = oldProducts.findIndex((p) => p.name == product.name);
                                    //         let tempProducts = oldProducts.slice();
                                    //         tempProducts[idx].stars = newRating;
                                    //         return tempProducts;
                                    //     })
                                    // }
                                    //}
                                />
                            </Col>
                            <Col className='text-danger'>
                                {product.price}$
                            </Col>
                        </Row>
                    </Card.Footer>

                </Card>
            </Col>
        </>
    );
}

export default ProductItem;