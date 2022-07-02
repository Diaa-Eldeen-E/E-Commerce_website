import StarRatingComponent from "react-star-rating-component";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import Loading from "./Loading";
import {useAuth} from "../auth/AuthProvider";

const ProductReviewForm = ({product}) => {

    const [inputs, setInputs] = useState({'product_id': product.id});
    const [review, setReview] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {getToken} = useAuth();

    useEffect(() => {
        console.log('here');
        getToken() ?
            axios.get('/sanctum/csrf-cookie').then((response) => {
                axios.get('/api/review?product_id=' + product.id).then((res) => {
                    if (res.data?.review)
                        setReview(res.data.review);

                    setIsLoading(false);
                })
            })

            :
            setIsLoading(false);
    }, [])

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
    }

    const handleSubmit = function (event) {
        event.preventDefault();

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/review', inputs).then((res) => {
                // Review added successfully
                if (res.data.status === 200) {
                    setReview(inputs);
                    window.location.reload(false);
                }
            })
        })
    }

    return (

        isLoading ?
            <Loading/>

            :

            // Is logged in
            getToken() ?

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

                    // Show review form

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
                                    onStarClick={(newRating) => setInputs({...inputs, 'rating': newRating})}

                                />
                            </Col>
                        </Row>

                        {/* Review description */}
                        <Row className='mt-3'>
                            <Form.Group className='mb-3' controlId="formReview">
                                <Form.Label>Your review</Form.Label>
                                <Form.Control as='textarea' type='textarea' name='description'
                                              onChange={handleChange}/>
                            </Form.Group>
                        </Row>

                        <Row className='mt-3'>
                            <Button type='submit' className='bg-danger'>Add review</Button>
                        </Row>
                    </Form>

                :

                <></>
    )

}

export default ProductReviewForm;