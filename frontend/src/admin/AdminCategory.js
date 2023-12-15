import { Link, useParams, useSearchParams } from "react-router-dom";
import { Container, Button, Table, Row } from "react-bootstrap";
import PaginationList from "../features/products/PaginationList";
import { defaultPageSize } from "../app/constants";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import { useGetProductsQuery, useDeleteProductMutation } from "../features/api/apiSlice";


const AdminCategory = function ()
{
    const navigate = useNavigate()
    let { categoryID } = useParams();

    //    Extracting Page number, page size from the URL query params
    const [searchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;

    //    Fetch products in this category by page
    const { data: products, isLoading, isSuccess } = useGetProductsQuery({ categoryID, pageNum, pageSize })
    const productsArray = products?.data
    const totalCount = products?.total

    const [deleteProduct, { isDeleting }] = useDeleteProductMutation()

    return (

        isLoading ? <Loading />
            :
            isSuccess ?
                <Container>

                    <Link to='/addproduct' className='position-absolute end-0 me-3 mt-3'>Add product</Link>

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
                                productsArray.map((product, idx) =>

                                    <tr className='table-row' key={product.id}>
                                        <td>{idx + 1}</td>
                                        <td><Link to={'/admin/product/' + product.id}>{product.name}</Link></td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>

                                        <td align='end'>
                                            <Button variant='outline-primary' disabled={isDeleting}
                                                onClick={() => navigate('/updateproduct/' + product.id)}>
                                                Update
                                            </Button>
                                            <Button variant='outline-danger' className='mx-2'
                                                disabled={isDeleting}
                                                onClick={() => deleteProduct(product.id)}>
                                                x
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                    <Row className="justify-content-center mt-5">
                        <PaginationList currentPage={pageNum} perPage={pageSize} totalItemsCount={totalCount} />
                    </Row>
                </Container>

                :

                <h1 className='text-danger'>No products found</h1>
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