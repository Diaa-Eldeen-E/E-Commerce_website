import StarRatingComponent from "react-star-rating-component";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import Loading from "../../common/Loading";
import { useSelector } from "react-redux";
import { useGetUserReviewQuery, useAddReviewMutation } from "../api/apiSlice";

const ProductReviewForm = ({ product }) =>
{
    const [inputs, setInputs] = useState({ 'product_id': product.id });
    const { userToken } = useSelector((state) => state.auth)

    const { data: review, isLoading, isSuccess } = useGetUserReviewQuery(product.id)
    const [addReview, { isLoading: isAdding, error }] = useAddReviewMutation()

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
        addReview(inputs);
    }

    return (

        isLoading ?
            <Loading />

            :

            // Is logged in
            userToken ?

                // Already reviewed -> Show review
                review?.rating ?
                    <>
                        <h5>Your review</h5>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={review.rating}
                        />
                        <p>{review.description}</p>
                    </>

                    // Not reviewed -> Show review form

                    :

                    <Form onSubmit={handleSubmit}>

                        {/*<p className='text-danger'>{errorMessage}</p>*/}
                        {/* Rating */}
                        <Row>
                            <Col className='col-sm-auto'>
                                <p className='mb-1'>Your rating</p>
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={inputs.rating}
                                    onStarClick={(newRating) => setInputs({ ...inputs, 'rating': newRating })}

                                />
                            </Col>
                        </Row>

                        {/* Review description */}
                        <Row className='mt-3'>
                            <Form.Group className='mb-3' controlId="formReview">
                                <Form.Label>Your review</Form.Label>
                                <Form.Control as='textarea' type='textarea' name='description'
                                    onChange={handleChange} />
                            </Form.Group>
                        </Row>

                        <Row className='mt-3'>
                            <Button type='submit' className='bg-danger'
                                disabled={isAdding}>
                                Add review
                            </Button>
                        </Row>
                    </Form>

                :

                <></>
    )

}

export default ProductReviewForm;