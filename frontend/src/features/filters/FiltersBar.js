import CategoryLink from "../categories/CategoryLink";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FiltersBar = function ({ category })
{
    const [inputs, setInputs] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) =>
    {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({ ...inputs, [Name]: Value });
        console.log("Name: " + Name, "Value: " + Value);

        setValidationErrors({})
    }

    const handleSubmit = function (event)
    {
        event.preventDefault();

        // Input validation
        const minPrice = parseInt(inputs?.min_price)
        const maxPrice = parseInt(inputs?.max_price)
        console.log(minPrice);
        if (!Number.isInteger(minPrice))
        {
            setValidationErrors({ ...validationErrors, min_price: 'Enter a valid integer' });
            return;
        }

        if ((!Number.isInteger(maxPrice)) || maxPrice <= minPrice)
        {
            setValidationErrors({ ...validationErrors, max_price: 'Enter a valid integer' });
            return;
        }

        navigate('/search?page=1&size=10&category=' + category.id
            + '&min_price=' + minPrice
            + '&max_price=  ' + maxPrice);
    }

    return (
        <>
            {category ?
                <>
                    <CategoryLink category={category} />

                    <ul style={{ listStyleType: "none" }} className="p-3">
                        {
                            category?.children?.map((category) => <CategoryLink category={category} key={category.id} />)
                        }

                    </ul>
                </>
                :
                <p>All categories</p>
            }
            <Form className='w-auto' onSubmit={handleSubmit}>

                <Form.Label>Price</Form.Label>
                <InputGroup controlId="formPrice">

                    <Form.Control
                        style={{ width: '55px' }}
                        placeholder="min"
                        aria-label="min"
                        name='min_price'
                        size="sm"
                        onChange={handleChange}
                        isInvalid={validationErrors?.min_price}
                    />
                    <Form.Control.Feedback
                        type='invalid'>{validationErrors?.min_price}</Form.Control.Feedback>

                    <Form.Control
                        style={{ width: '55px' }}
                        placeholder="max"
                        aria-label="max"
                        name='max_price'
                        size="sm"
                        onChange={handleChange}
                        isInvalid={validationErrors?.max_price}

                    />
                    <Form.Control.Feedback
                        type='invalid'>{validationErrors?.max_price}</Form.Control.Feedback>

                </InputGroup>
                <Button className='bg-secondary mt-2' type="submit">
                    Apply
                </Button>

            </Form >
        </>
    );
}

export default FiltersBar;