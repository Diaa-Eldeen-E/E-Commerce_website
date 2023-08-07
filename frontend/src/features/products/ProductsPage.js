import { useParams, useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import PaginationList from "./PaginationList";
import ListProducts from "./ListProducts";
import Loading from "../../common/Loading";
import { defaultPageSize } from "../../app/constants";
import { useGetProductsQuery } from "../api/apiSlice";

const ProductsPage = function ()
{
    let { categoryID } = useParams();

    //    Extracting Page number, page size from the URL query params
    const [searchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;


    //    Fetch products in this category by page
    const { data: products, isLoading, isSuccess } = useGetProductsQuery({ categoryID, pageNum, pageSize })
    const productsArray = products?.data
    const totalCount = products?.total

    return (
        isLoading ? <Loading />
            :
            isSuccess ?
                <Container>

                    {/*  Products  */}
                    <ListProducts products={productsArray} />

                    <PaginationList currentPage={pageNum} perPage={pageSize} totalItemsCount={totalCount} />
                </Container>

                :
                <h1 className='text-danger'>No products found</h1>
    )

}


export default ProductsPage;


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