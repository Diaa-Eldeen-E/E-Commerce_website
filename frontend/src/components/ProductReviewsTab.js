import {Col, Row} from "react-bootstrap";
import StarRatingComponent from "react-star-rating-component";
import ProductReviewForm from "./ProductReviewForm";

const ProductReviewsTab = ({product}) => {
    return (


        <Row className='mt-5'>


            <Col>
                {
                    product.raters_count > 0 ?
                        <div>
                            <p>Based on {product.raters_count} reviews</p>

                            <StarRatingComponent
                                name="rate1"
                                starCount={5}
                                value={Math.ceil(product.rating / product.raters_count)}
                            />

                            <h4 className='text-warning'>{(product.rating / product.raters_count).toFixed(1)}</h4>

                            {/*TODO: Show raters count for each star rating */}

                        </div>

                        :
                        
                        <h4>Not rated yet</h4>
                }
            </Col>


            <Col>
                <ProductReviewForm product={product}/>
            </Col>


        </Row>

    )
}

export default ProductReviewsTab;