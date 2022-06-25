import {useEffect, useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Card, Col, Container, Row, Pagination} from "react-bootstrap";
import StarRatingComponent from 'react-star-rating-component';


// import 'bootstrap/dist/css/bootstrap.min.css';
import Rater from "react-rater";
// import
// import StarRating from 'bo';

const defaultPageSize = 7;
const productsPerRow = 3;

const AdminCategory = function () {
    const [productsState, setProductsState] = useState([]);
    const [rating, setRating] = useState(3);
    const [totalCount, setTotalCount] = useState(10);

    const onStarClick = (newRating) => {
        setRating(newRating);
    }
    // Category name to be shown
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

    const productItem = function (product, idx) {
        console.log(product.id);
        return (
            <>
                <Col md='4'>
                    <Card>
                        <Link to={'' + product.id}>
                            <Card.Img src={product.image_src}/>
                        </Link>
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>

                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col className='col-8'>
                                    <StarRatingComponent
                                        name="rate1"
                                        starCount={5}
                                        value={product.stars}
                                        onStarClick={(newRating) => {

                                            setProductsState((oldProducts) => {
                                                let idx = oldProducts.findIndex((p) => p.name == product.name);
                                                let tempProducts = oldProducts.slice();
                                                tempProducts[idx].stars = newRating;
                                                return tempProducts;
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className='col-4 text-danger'>
                                    {product.price}$
                                </Col>
                            </Row>
                        </Card.Footer>

                    </Card>
                </Col>
            </>
        );
    }

    const listRow = (products) => {
        return (
            <Row>
                {products.map(productItem)}
            </Row>
        );
    }

    const ListProducts = function ({products}) {
        const productsCount = products.length;
        let rowsProducts = [];
        for (let i = 0; i < products.length; i += productsPerRow) {
            const row = products.slice(i, i + productsPerRow);
            rowsProducts.push(row);
        }

        return (
            <Container className='mt-5'>
                {rowsProducts.map(listRow)}
            </Container>
        )
    }


    const PaginationList = ({pgNum, perPage, totalProdsCount}) => {

        let pagesCount = Math.ceil(totalProdsCount / perPage);

        let items = [];
        for (let i = 1; i <= pagesCount; i++) {
            items.push(
                <Pagination.Item key={i} active={i == pgNum}
                                 href={'/admin/category/' + catName + '?pn=' + (i) + '&ps=' + pageSize}
                >
                    {i}
                </Pagination.Item>,
            );
        }

        let startIdx = (pageNum - 1) * pageSize;
        let endIdx = (pageNum * pageSize) - 1;
        return (
            <Container className='w-75 mx-auto mt-5'>
                <Pagination className=''>
                    <Pagination.First disabled={pgNum == 1}
                                      href={'/admin/category/' + catName + '?pn=' + 1 + '&ps=' + pageSize}
                    />
                    <Pagination.Prev disabled={pgNum == 1}
                                     href={'/admin/category/' + catName + '?pn=' + (pageNum - 1) + '&ps=' + pageSize}
                    />

                    {items}

                    <Pagination.Next disabled={pgNum == pagesCount}
                                     href={'/admin/category/' + catName + '?pn=' + (pageNum + 1) + '&ps=' + pageSize}

                    />
                    <Pagination.Last disabled={pgNum == pagesCount}
                                     href={'/admin/category/' + catName + '?pn=' + pagesCount + '&ps=' + pageSize}
                    />
                </Pagination>
            </Container>
        )
    }

    return (
        <Container>

            {/*  Adding product form  */}
            <Link to='/admin/addproduct' className='position-absolute end-0 me-3 mt-3'>Add product</Link>

            {/*{catName + "  pageNum= " + pageNum + " pageSize= " + pageSize}*/}

            {/*  Products  */}
            <ListProducts products={productsState}/>

            <PaginationList pgNum={pageNum} perPage={pageSize} totalProdsCount={totalCount}/>
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