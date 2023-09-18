import { useParams, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Offcanvas, Button, Alert } from "react-bootstrap";
import PaginationList from "./PaginationList";
import ListProducts from "./ListProducts";
import Loading from "../../common/Loading";
import { defaultPageSize } from "../../app/constants";
import { useGetProductsQuery, useGetCategoryQuery } from "../api/apiSlice";
import CategoryLink from "../categories/CategoryLink";
import ListSuperCategories from "./ListSuperCategories";
import { useState } from "react";
import FiltersBar from "../filters/FiltersBar";

const ProductsPage = function ()
{
    let { categoryID } = useParams();

    //    Extracting Page number, page size from the URL query params
    const [searchParams] = useSearchParams();
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;

    const { data: category } = useGetCategoryQuery(categoryID)

    //    Fetch products in this category by page
    const { data: products, isLoading, isSuccess } = useGetProductsQuery({ categoryID, pageNum, pageSize })
    const productsArray = products?.data
    const totalCount = products?.total

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        isLoading ? <Loading />
            :
            isSuccess && productsArray?.length > 0 ?
                <Container>


                    <Row className=" mt-3">

                        {/* Left-side bar (sub-categories and filters) */}
                        <Col className="col-auto mt-5">

                            <Col className="d-lg-block d-none">
                                <FiltersBar category={category} />
                            </Col>

                            <Button variant="primary" className="d-lg-none" onClick={handleShow}>
                                Filters
                            </Button>

                            <Offcanvas show={show} onHide={handleClose} responsive="lg">
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <FiltersBar category={category} />
                                </Offcanvas.Body>
                            </Offcanvas>
                        </Col>

                        <Col>
                            <Row>
                                <ListSuperCategories superCategories={[category, ...category?.ancestors]} />
                            </Row>

                            {/*  Products  */}
                            <Row>
                                <ListProducts products={productsArray} />
                            </Row>
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-5">
                        <PaginationList currentPage={pageNum} perPage={pageSize} totalItemsCount={totalCount} />
                    </Row>
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