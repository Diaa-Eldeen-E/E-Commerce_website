import { Table, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CURRENCY } from "../../app/constants";


const OrderTable = function ({ order })
{
    const productsArray = order?.products
    const totalAmount = order?.total_price

    return (
        <Container className='w-75 mt-5'>
            <Row>

                <h4>Order date</h4>
                <p>{order?.created_at}</p>
                <Col md={'auto'}>
                    <Link to={'/order/' + order?.id}>Order details</Link>
                </Col>
                <Col></Col>
                <Col md={'auto'}>
                    <a target='_blank' rel='noopener noreferrer' // Open in new tab
                        href={order?.invoice ? order?.invoice : '#'}>
                        Invoice
                    </a>
                </Col>
            </Row>
            <Table striped hover className='align-items-center justify-content-start'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Cost</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        productsArray?.map((product, idx) =>
                            <tr className='table-row' key={product.id}>
                                <td>{idx + 1}</td>
                                <td><Link to={'/product/' + product.id}>{product.name}</Link></td>
                                <td>{product.price}</td>
                                <td>{product.pivot.quantity}</td>
                                <td>{product.pivot.quantity * product.price} {CURRENCY}</td>
                            </tr>
                        )
                    }
                    <tr>
                        <td></td><td></td><td></td><td></td>
                        <td>{totalAmount} {CURRENCY}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}


export default OrderTable;