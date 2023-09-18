import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";

const ProductItem = function ({ product, isAdmin })
{

    return (
        <>
            <Col className="d-flex">
                <Card className="text-center">
                    <Link to={(isAdmin ? '/admin' : '') + '/product/' + product.id + '/' + product.slug}>
                        <Card.Img src={product.image_src}
                            style={{ maxWidth: "160px" }} />
                    </Link>
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={Math.ceil(product.rating / product.raters_count)}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <p className='text-danger'>
                            {product.price}$
                        </p>
                    </Card.Footer>

                </Card>
            </Col>
        </>
    );
}

export default ProductItem;