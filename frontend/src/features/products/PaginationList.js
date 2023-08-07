import { Container, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaginationList = ({ currentPage, perPage, totalItemsCount }) =>
{
    const navigate = useNavigate()
    currentPage = Number(currentPage)
    let pagesCount = Math.ceil(totalItemsCount / perPage);

    const goToPage = (pageNumber) =>
    {
        navigate(`?pn=` + pageNumber + '&ps=' + perPage)
    }

    let items = [];
    for (let i = 1; i <= pagesCount; i++)
    {
        items.push(
            <Pagination.Item key={i} active={i === currentPage}
                onClick={() => goToPage(i)}
            >
                {i}
            </Pagination.Item>,
        );
    }

    return (
        <Container className='w-75 mx-auto mt-5'>
            <Pagination className=''>
                <Pagination.First disabled={currentPage === 1}
                    // href={'?pn=' + 1 + '&ps=' + perPage}
                    onClick={() => goToPage(1)}
                />
                <Pagination.Prev disabled={currentPage === 1}
                    // href={'?pn=' + (currentPage - 1) + '&ps=' + perPage}
                    onClick={() => goToPage(currentPage - 1)}
                />

                {items}

                <Pagination.Next disabled={currentPage === pagesCount}
                    // href={'?pn=' + (currentPage + 1) + '&ps=' + perPage}
                    onClick={() => goToPage(currentPage + 1)}

                />
                <Pagination.Last disabled={currentPage === pagesCount}
                    // href={'?pn=' + pagesCount + '&ps=' + perPage}
                    onClick={() => goToPage(pagesCount)}
                />
            </Pagination>
        </Container>
    )
}

export default PaginationList;