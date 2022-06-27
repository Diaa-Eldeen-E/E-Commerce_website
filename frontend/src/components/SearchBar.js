import {Button, Form, FormControl, Image, InputGroup} from "react-bootstrap";
import {useState} from "react";

const SearchBar = function () {

    const [searchText, setSearchText] = useState('');

    const handleChange = (event) => {
        setSearchText(event.target.value);
    }

    const search = function () {
        console.log(searchText);
    }

    return (
        <Form className="">
            <InputGroup className='h-100'>
                <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-0 border-end-0 rounded-0 rounded-start"
                    aria-label="Search"
                    onChange={handleChange}
                />
                <Button className='p-0 border-0' onClick={search}>
                    <Image
                        src={'/assets/search-logo.png'} className="w-auto rounded-end"
                        style={{maxHeight: "40px"}}/>
                </Button>
            </InputGroup>
        </Form>
    );
}

export default SearchBar;