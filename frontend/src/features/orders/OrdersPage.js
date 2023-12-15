import Loading from "../../common/Loading";
import { Table, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../api/apiSlice";
import OrderTable from "./OrderTable";



const OrdersPage = function ()
{
    const { data: orders, isLoading, isSuccess } = useGetOrdersQuery()
    const ordersCount = orders?.length

    return (

        isLoading ?
            <Loading />
            :
            ordersCount > 0 ?
                <Container>
                    {
                        orders?.map((order, idx) =>
                            <OrderTable order={order} key={idx} />)
                    }
                </Container>

                :

                <h4>You have no orders</h4>
    )

}



export default OrdersPage;