import {Container, Pagination} from "react-bootstrap";

const PaginationList = ({pageNum, perPage, totalItemsCount}) => {

    let pagesCount = Math.ceil(totalItemsCount / perPage);

    let items = [];
    for (let i = 1; i <= pagesCount; i++) {
        items.push(
            <Pagination.Item key={i} active={i == pageNum}
                             href={'?pn=' + (i) + '&ps=' + perPage}
            >
                {i}
            </Pagination.Item>,
        );
    }

    let startIdx = (pageNum - 1) * perPage;
    let endIdx = (pageNum * perPage) - 1;
    return (
        <Container className='w-75 mx-auto mt-5'>
            <Pagination className=''>
                <Pagination.First disabled={pageNum == 1}
                                  href={'?pn=' + 1 + '&ps=' + perPage}
                />
                <Pagination.Prev disabled={pageNum == 1}
                                 href={'?pn=' + (pageNum - 1) + '&ps=' + perPage}
                />

                {items}

                <Pagination.Next disabled={pageNum == pagesCount}
                                 href={'?pn=' + (pageNum + 1) + '&ps=' + perPage}

                />
                <Pagination.Last disabled={pageNum == pagesCount}
                                 href={'?pn=' + pagesCount + '&ps=' + perPage}
                />
            </Pagination>
        </Container>
    )
}

export default PaginationList;