import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import { useGetProductQuery } from "../features/api/apiSlice";
import Loading from "../common/Loading";

const AdminProduct = function ()
{

    const { productID } = useParams();

    // Load product from database
    const { data: product, isLoading, isSuccess } = useGetProductQuery(productID)


    return (
        isLoading ? <Loading />
            :
            isSuccess ?
                <Container>
                    <Row>

                        <Col md='4'>
                            <Card>
                                <Link to={'/admin/product/' + product?.id}>
                                    <Card.Img src={product?.image_src} />
                                </Link>
                                <Card.Body>
                                    <Card.Title>{product?.name}</Card.Title>
                                    <Card.Text>{product?.description}</Card.Text>

                                </Card.Body>
                                <Card.Footer>
                                    <Row>
                                        <Col className='col-8'>
                                            <StarRatingComponent
                                                name="rate1"
                                                starCount={5}
                                                value={Math.ceil(product?.rating / product?.raters_count)}
                                            />
                                        </Col>
                                        <Col className='col-4 text-danger'>
                                            {product?.price}$
                                        </Col>
                                    </Row>
                                </Card.Footer>

                            </Card>
                        </Col>

                    </Row>


                </Container>
                :
                <h1 className='text-danger'>Error, not found</h1>
    )
}

export default AdminProduct;


// trash
// <StarRatingComponent attritubte:
// onStarClick={(newRating) => {
//
//     setProduct((oldProducts) => {
//         let idx = oldProducts.findIndex((p) => p.name == product.name);
//         let tempProducts = oldProducts.slice();
//         tempProducts[idx].stars = newRating;
//         return tempProducts;
//     })
// }}