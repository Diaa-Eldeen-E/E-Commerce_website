import
{
    Button,
    Form,
    FormControl,
    Image,
    InputGroup,
    OverlayTrigger,
    Popover,
    NavDropdown
} from "react-bootstrap";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSearchProductsQuery, useGetNestedCategoriesQuery } from "../api/apiSlice";
import ListCategories from "../categories/ListCategories";


const SearchBar = function ({ isAdmin })
{
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState(false);
    const ref = useRef(null);

    // Fetch search results if the user writes any text
    const { data: products, isLoading, isSuccess } = useSearchProductsQuery({ query: searchText }, { skip: !Boolean(searchText) })
    const searchResults = products?.data

    const handleChange = (event) =>
    {
        setSearchText(event.target.value);
    }

    const search = function (searchQuery)
    {
        navigate('/search?page=1&size=9&q=' + searchQuery);
    }

    const [popoverStyle, setPopoverStyle] = useState({});
    const handleFoucs = (e) =>
    {
        // Adjust the search results popover to the size of the input text
        setPopoverStyle({
            width: ref?.current?.offsetWidth,
            maxWidth: ref?.current?.offsetWidth,
        });
    }

    const handleBlur = (e) =>
    {
        // Hide search results, when the search bar is not focused
        e.target.value = '';
        setSearchText('');
    }

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        search(searchText);
    }

    const searchItem = (item) =>
    {
        return (
            <li key={item.id}><Link to={(isAdmin ? '/admin' : '') + '/product/' + item.id}>{item.name}</Link></li>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className='h-100'>

                <OverlayTrigger
                    trigger="focus"
                    show={searchText && searchResults?.length > 0}
                    placement='bottom'
                    overlay={
                        <Popover id='popover-contained' style={popoverStyle}>
                            <Popover.Body>
                                <ul style={{ listStyleType: "none" }}>
                                    {
                                        searchResults?.length > 0 && searchResults?.map(searchItem)
                                    }
                                </ul>
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-0 border-end-0 rounded-0 rounded-start"
                        aria-label="Search"
                        onChange={handleChange}
                        onFocus={handleFoucs}
                        onBlur={handleBlur}
                        ref={ref}
                    />
                </OverlayTrigger>

                <Button className='p-0 border-0' type='submit'>
                    <Image
                        src={'/assets/search-logo.png'} className="w-auto rounded-end"
                        style={{ maxHeight: "40px" }} />
                </Button>

            </InputGroup>
        </Form>
    );
}

export default SearchBar;