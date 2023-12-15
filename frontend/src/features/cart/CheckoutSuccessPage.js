import Loading from "../../common/Loading";
import { Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useGetCheckoutOrderQuery } from "../api/apiSlice";
import OrderTable from "../orders/OrderTable";



const CheckoutSuccessPage = function ()
{
    //    Extracting session id from the URL query params
    const [searchParams] = useSearchParams();
    let sessionID = searchParams.get('session_id') ? searchParams.get('session_id') : '';

    const { data: order, isLoading, isSuccess } = useGetCheckoutOrderQuery(sessionID)
    console.log('retrieved order:  ', order);

    return (
        isLoading ?
            <Loading />
            :
            isSuccess ?

                <Container className='w-75 mt-5'>
                    <Row className="justify-content-center my-5">
                        <h1 className='text-success w-auto'>Payment Success</h1>
                    </Row>

                    <OrderTable order={order} />

                </Container>
                :
                <h2>Not found</h2>

    )

}



export default CheckoutSuccessPage;