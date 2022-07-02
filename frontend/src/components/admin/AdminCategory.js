import {useEffect, useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Card, Col, Container, Row, Pagination} from "react-bootstrap";
import StarRatingComponent from 'react-star-rating-component';
import PaginationList from "../PaginationList";
import {defaultPageSize, productsPerRow} from "../../constants";
import ListProducts from "../ListProducts";

const AdminCategory = function () {
    const [productsState, setProductsState] = useState([]);
    const [rating, setRating] = useState(3);
    const [totalCount, setTotalCount] = useState(10);

    const onStarClick = (newRating) => {
        setRating(newRating);
    }
    // ProductsPage name to be shown
    let {catName} = useParams();

    console.log(catName);
    // const [catName, setcatName] = useState(catNam);

//    Extracting Page number, page size from the URL query params
    const [searchParams, setSearchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;
    let startIdx = (pageNum - 1) * pageSize;
    let endIdx = (pageNum * pageSize) - 1;


//    Fetch products in this category by page
    useEffect(() => {
        let query = 'cat_name=' + catName + '&s_idx=' + startIdx + '&e_idx=' + endIdx;
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/products?' + query).then((res) => {
                if (res.data.status === 200) {
                    setProductsState(res.data.products);
                    setTotalCount(res.data.totalProductsCount);
                }
            })
        })

    }, [catName]);


    return (
        <Container>

            <Link to='/admin/addproduct' className='position-absolute end-0 me-3 mt-3'>Add product</Link>

            {/*  Products  */}
            <ListProducts products={productsState} isAdmin={true}/>

            <PaginationList pageNum={pageNum} perPage={pageSize} totalItemsCount={totalCount}/>
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