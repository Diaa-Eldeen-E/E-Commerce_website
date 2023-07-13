import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Container, Row, Pagination, Button, Table } from "react-bootstrap";
import StarRatingComponent from 'react-star-rating-component';
import PaginationList from "../features/products/PaginationList";
import { defaultPageSize, productsPerRow } from "../app/constants";
import ListProducts from "../features/products/ListProducts";

const AdminCategory = function ()
{
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(10);

    // ProductsPage name to be shown
    let { categoryID } = useParams();

    // console.log(catName);
    // const [catName, setcatName] = useState(catNam);

    //    Extracting Page number, page size from the URL query params
    const [searchParams, setSearchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;
    let startIdx = (pageNum - 1) * pageSize;
    let endIdx = (pageNum * pageSize) - 1;


    //    Fetch products in this category by page
    useEffect(() =>
    {
        let query = 'category_id=' + categoryID + '&s_idx=' + startIdx + '&e_idx=' + endIdx;
        axios.get('/sanctum/csrf-cookie').then((response) =>
        {
            axios.get('/api/products?' + query).then((res) =>
            {
                if (res.data.status === 200)
                {
                    setProducts(res.data.products);
                    setTotalCount(res.data.totalProductsCount);
                }
            })
        })

    }, [categoryID]);

    const deleteProduct = function (product)
    {
        axios.get('/sanctum/csrf-cookie').then((response) =>
        {
            axios.delete('/api/product/' + product.id).then((res) =>
            {
                if (res.data.status === 200)
                    window.location.reload(false);
                else
                    console.log('Failed to delete item');
            })
        })
    }

    return (
        <Container>

            <Link to='/admin/addproduct' className='position-absolute end-0 me-3 mt-3'>Add product</Link>

            {/*  Products  */}
            {/*<ListProducts products={productsState} isAdmin={true}/>*/}
            <Table striped hover className='align-items-center justify-content-start w-75 mx-auto mt-4'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        products.map((product, idx) =>

                            <tr className='table-row' key={product.id}>
                                <td>{idx + 1}</td>
                                <td><Link to={'/admin/product/' + product.id}>{product.name}</Link></td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>

                                <td align='end'>
                                    <Button variant='outline-primary' href={'/admin/updateproduct/' + product.id}>
                                        Update
                                    </Button>
                                    <Button variant='outline-danger' className='mx-2'
                                        onClick={() => deleteProduct(product)}>
                                        x
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <PaginationList pageNum={pageNum} perPage={pageSize} totalItemsCount={totalCount} />
        </Container>
    )

}


export default AdminCategory;


// TRash

// wew
// {/*<StarRating*/}
// {/*    defaultValue={3}*/}
// {/*    showCaption={false}*/}
// {/*    showClear={false}*/}
// {/*    size={4}*/}
// {/*    min={0}*/}
// {/*    max={5}*/}
// {/*    step={1}*/}
// {/*    onRatingChange={(x, newStarRating) => document.cookie = "stars=" + newStarRating}/>*/}