import Loading from "../../common/Loading";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "../api/apiSlice";
import OrderTable from "./OrderTable";



const OrderPage = function ()
{
    const { orderID } = useParams();
    const { data: order, isLoading, isSuccess } = useGetOrderQuery(orderID)

    return (

        isLoading ?
            <Loading />
            :
            isSuccess ?
                <Container>

                    <OrderTable order={order} />

                    { /* Order status */}
                    <Row className="justify-content-center mt-5">
                        <h3 className="w-auto">Order status: {order.status}</h3>
                    </Row>
                </Container>

                :

                <h4>You have no orders</h4>
    )

}



export default OrderPage;