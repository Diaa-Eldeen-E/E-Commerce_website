import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../common/Loading";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const removeFromWishlist = (product) =>
{
    axios.get('/sanctum/csrf-cookie').then((response) =>
    {
        axios.delete('/api/removefromwishlist?product_id=' + product.id).then((res) =>
        {
            if (res.data?.status === 200)
            {
                window.location.reload(false);
            }
        })
    })
}

const WishlistPage = function ()
{

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        axios.get('/sanctum/csrf-cookie').then((response) =>
        {
            axios.get('/api/wishlist').then((res) =>
            {
                if (res.data?.status === 200)
                    setProducts(res.data.products);

                setIsLoading(false);
            })
        })
    }, []);

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
                                        <td>{product.price}</td>
                                        <td>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</td>
                                        <td>
                                            <Button variant='outline-danger'
                                                onClick={() => removeFromWishlist(product)}>
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