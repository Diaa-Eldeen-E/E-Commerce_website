
import { useSearchParams } from "react-router-dom";
import { Col, Container, Row, Offcanvas, Button } from "react-bootstrap";
import ListProducts from "../products/ListProducts";
import PaginationList from "../products/PaginationList";
import { defaultPageSize } from "../../app/constants";
import Loading from "../../common/Loading";
import { useSearchProductsQuery, useGetCategoryQuery } from "../api/apiSlice";
import { useState } from "react";
import FiltersBar from "../filters/FiltersBar";

const SearchPage = function ({ isAdmin })
{
    //    Extracting Page number, page size from the URL query params
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') ? searchParams.get('q') : '';
    const pageNum = searchParams.get('page') ? searchParams.get('page') : 1;
    const pageSize = searchParams.get('size') ? searchParams.get('size') : defaultPageSize;
    const categoryID = searchParams.get('category') ? searchParams.get('category') : null;
    const minPrice = searchParams.get('min_price') ? searchParams.get('min_price') : null;
    const maxPrice = searchParams.get('max_price') ? searchParams.get('max_price') : null;

    // Fetch search results 
    const { data: products, isLoading, isSuccess } = useSearchProductsQuery({
        query: query,
        pageNum: pageNum,
        pageSize: pageSize,
        category: categoryID,
        min_price: minPrice,
        max_price: maxPrice
    })
    const searchResults = products?.data
    const totalCount = products?.total

    const { data: category } = useGetCategoryQuery(categoryID, { skip: categoryID ? 0 : 1 })

    // off canvas (filter bar) controls
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (

        <>
            {
                isLoading ?
                    <Loading />
                    :
                    searchResults?.length > 0 ?
                        <Container>


                            <Row className=" mt-3">

                                {/* Left-side bar (sub-categories and filters) */}
                                <Col className="col-auto pt-5" style={{ backgroundColor: "whitesmoke" }}>

                                    <Col className="d-lg-block d-none">
                                        <FiltersBar category={category} />
                                    </Col>

                                    <Button variant="primary" className="d-lg-none" onClick={handleShow}>
                                        Filters
                                    </Button>

                                    <Offcanvas show={show} onHide={handleClose} responsive="lg">
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title>Filters</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            <FiltersBar category={category} />
                                        </Offcanvas.Body>
                                    </Offcanvas>
                                </Col>

                                <Col>
                                    {/* Show search results count */}
                                    <Row className="justify-content-center">
                                        {totalCount} search results {query ? 'for \'' + query + '\'' : ''}
                                    </Row>

                                    {/*  List products  */}
                                    <Row>
                                        <ListProducts products={searchResults} />
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="justify-content-center mt-5">
                                <PaginationList currentPage={pageNum} perPage={pageSize} totalItemsCount={totalCount} />
                            </Row>
                        </Container>

                        :
                        <h4>No results found</h4>
            }

        </>

    );
}

export default SearchPage;