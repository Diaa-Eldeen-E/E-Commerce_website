import {Button, Form, FormControl, Image, InputGroup, OverlayTrigger, Popover, Overlay} from "react-bootstrap";
import {useState, useRef, useLayoutEffect, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

const searchItem = (item) => {
    return (
        <li key={item.id}>{item.name}</li>
    );
}

const SearchBar = function () {

    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
        setSearchText(event.target.value);

        let query = 'q=' + event.target.value + '&s_idx=' + 0 + '&e_idx=' + 9;
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/products/search?' + query).then((res) => {
                    if (res.data.status === 200)
                        setSearchResults(res.data.results);
                    else
                        setSearchResults([]);
                }
            )
        });

    }


    const search = function (searchQuery) {

        let query = 'q=' + searchQuery + '&s_idx=' + 0 + '&e_idx=' + 9;
        navigate('/admin/search?' + query);
    }

    const ref = useRef(null);

    const [popoverStyle, setPopoverStyle] = useState({});

    const handleFoucs = (e) => {
        setPopoverStyle({
            width: ref?.current?.offsetWidth,
            maxWidth: ref?.current?.offsetWidth,
        });
    }

    const handleBlur = (e) => {
        setSearchResults([]);
        e.target.value = '';
        setSearchText('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        search(searchText);
    }
    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className='h-100'>
                <OverlayTrigger
                    trigger="focus"
                    show={searchResults?.length > 0}
                    placement='bottom'
                    overlay={
                        <Popover id='popover-contained' style={popoverStyle}>
                            <Popover.Body>
                                <ul>
                                    {
                                        searchResults?.length && searchResults?.map(searchItem)
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
                        style={{maxHeight: "40px"}}/>
                </Button>

            </InputGroup>
        </Form>
    );
}

export default SearchBar;