import Loading from "../../common/Loading";
import { Table, Container, Button, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useGetCartQuery, useRemoveFromCartMutation } from "../api/apiSlice";
import { defaultPageSize, CURRENCY } from "../../app/constants";
import PaginationList from "../products/PaginationList";
import axios from "axios";
import { useState } from "react";


// import CheckoutForm from "./CartCheckout";
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe('pk_test_51O5QszLKQgcrUNY7G53YhOufp79n1HBvM23Cjq25KHIULcVePh5wZ0Hs4XifjvOSHgulaEeKWDI60H0WD2c7WQWX00u3N2E5qm');
// const options = {
//     mode: 'payment',
//     currency: 'usd',
//     amount: 1000,
//     // Customizable appearance API.
//     appearance: {
//     },
// };


const CartPage = function ()
{

    //    Extracting Page number, page size from the URL query params
    const [searchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;

    const { data: products, isLoading, isSuccess } = useGetCartQuery(pageSize)
    const productsArray = products?.data
    const productsCount = products?.total ? products?.total : 0
    const [removeFromCart, { isLoading: isRemoving, error }] = useRemoveFromCartMutation()
    let totalAmount = 0
    const [isRedirecting, setIsRedirecting] = useState(false)

    const redirectToCheckout = async function ()
    {
        setIsRedirecting(true);
        axios.post('/api/cart-checkout').then((res) =>
            window.location.href = res?.data?.stripe_checkout_url   // Redirect
        ).catch(error =>
        {
            setIsRedirecting(false)
            console.log('caught error during checkout redirectionL ', error);
        })

    }

    return (

        isLoading ?
            <Loading />
            :
            productsCount > 0 ?
                <Container className='w-75 mt-5'>
                    <Table striped hover className='align-items-center justify-content-start'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                productsArray.map((product, idx) =>
                                    <tr className='table-row' key={product.id}>
                                        <td>{idx + 1}</td>
                                        <td><Link to={'/product/' + product.id}>{product.name}</Link></td>
                                        <td>{product.price} {CURRENCY}</td>
                                        <td>{product.pivot.quantity}</td>
                                        <td>{product.pivot.quantity * product.price} {CURRENCY}</td>
                                        <td>
                                            <Button variant='outline-danger' disabled={isRemoving}
                                                onClick={() => removeFromCart(product.id)}>
                                                x
                                            </Button>
                                        </td>
                                        <td className='d-none'>{totalAmount += product.pivot.quantity * product.price}$</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td></td><td></td><td></td><td></td>
                                <td>{totalAmount} {CURRENCY}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Row className="justify-content-center mt-5">
                        <PaginationList currentPage={pageNum} perPage={pageSize} totalItemsCount={productsCount} />
                    </Row>

                    {/*  Proceed to checkout  */}
                    <Row className='justify-content-center mt-5'>
                        <Button variant="danger" className="w-auto"
                            onClick={() => redirectToCheckout()} disabled={isRedirecting}>
                            Proceed to checkout
                        </Button>
                    </Row>

                    <Row className='mt-5'>
                        {/* <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm />
                        </Elements> */}
                    </Row>

                </Container>

                :

                <h4>The cart is empty</h4>
    )

}



export default CartPage;