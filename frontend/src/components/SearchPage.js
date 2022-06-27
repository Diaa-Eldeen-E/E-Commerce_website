import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Col, Container, Row} from "react-bootstrap";
import ListProducts from "./ListProducts";
import PaginationList from "./PaginationList";
import {defaultPageSize} from "../constants";
import Loading from "./Loading";

const SearchPage = function () {

    const [searchResults, setSearchResults] = useState([]);
    const [totalCount, setTotalCount] = useState(10);
    const [isLoading, setIsLoading] = useState(true);


//    Extracting Page number, page size from the URL query params
    const [searchParams, setSearchParams] = useSearchParams();
    let query = searchParams.get('q') ? searchParams.get('q') : '';
    let pageNum = searchParams.get('pn') ? searchParams.get('pn') : 1;
    let pageSize = searchParams.get('ps') ? searchParams.get('ps') : defaultPageSize;
    let startIdx = (pageNum - 1) * pageSize;
    let endIdx = (pageNum * pageSize) - 1;


//    Fetch products in this category by page
    useEffect(() => {
        let params = 'q=' + query + '&s_idx=' + startIdx + '&e_idx=' + endIdx;
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/products/search?' + params).then((res) => {
                if (res.data.status === 200) {
                    setSearchResults(res.data.results);
                    setTotalCount(res.data.totalCount);
                }
                setIsLoading(false);
            })
        })

    }, [searchParams]);


    return (

        <>
            {
                isLoading ?
                    <Loading/>
                    :
                    searchResults?.length > 0 ?
                        <Container>
                            <Row className='justify-content-center mt-4'>
                                <Col className='col-sm-auto'>
                                    <h5>Search results for "{query}"</h5>
                                </Col>
                            </Row>

                            <ListProducts products={searchResults}/>
                            <PaginationList pgNum={pageNum} perPage={pageSize} totalItemsCount={totalCount}/>
                        </Container>
                        :
                        <h4>No results found</h4>
            }

        </>

    );
}

export default SearchPage;