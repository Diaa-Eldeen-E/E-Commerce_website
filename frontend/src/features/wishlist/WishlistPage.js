import Loading from "../../common/Loading";
import { Button, Container, Table, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "../api/apiSlice";
import { CURRENCY } from "../../app/constants";

const WishlistPage = function ()
{
    const { data: products, isLoading, isSuccess } = useGetWishlistQuery()
    const [removeFromWishlist, { isLoading: isRemoving, error }] = useRemoveFromWishlistMutation()

    return (
        isLoading ?
            <Loading />
            :
            products?.length > 0 ?
                <Container className='w-75 mt-5'>
                    <Table striped hover className='align-items-center justify-content-start'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                products.map((product, idx) =>
                                    <tr className='table-row' key={product.id}>
                                        <td>{idx + 1}</td>
                                        <td><Link to={'/product/' + product.id}>{product.name}</Link></td>
                                        <td>{product.price} {CURRENCY}</td>
                                        <td>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</td>
                                        <td>
                                            <Button variant='outline-danger' disabled={isRemoving}
                                                onClick={() => removeFromWishlist(product.id)}>
                                                x
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>

                </Container>

                :

                <h4>There is no listed items</h4>
    )
}

export default WishlistPage;