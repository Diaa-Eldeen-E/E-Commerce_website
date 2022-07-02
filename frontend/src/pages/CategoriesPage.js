import axios from "axios";
import {useEffect, useState} from "react";
import {Button, Col, Container, Fade, Form, Row, ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import ListNestedCategories from "../components/ListNestedCategories";
import Loading from "../components/Loading";

const CategoriesPage = function () {
    const [refreshData, setRefreshData] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Load categories from database
    useEffect(() => {
        if (!refreshData)
            return;
        setRefreshData(false);
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/nestedcategories').then((res) => {

                    setCategories(res.data);
                    setIsLoading(false);
                }
            )
        });
    }, [refreshData]);


    // Adding category form
    const [inputs, setInputs] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [isAdd, setIsAdd] = useState(false);

    const handleChange = (event) => {
        const Name = event.target.name;
        const Value = event.target.value;

        setInputs({...inputs, [Name]: Value});
        console.log("Name: " + Name, "Value: " + Value);
    }


    return (
        <Container className="my-4">

            {/* Categories lists*/}
            <Row className='w-75 mx-auto'>
                {
                    isLoading ? <Loading/> : <ListNestedCategories categories={categories}/>
                }
            </Row>


        </Container>
    );
}

export default CategoriesPage;


// Trash

// Structuring categories into parent, children

// Data preprocessing
// let categories = res.data;
// let minIdx = 9999999;
// categories.forEach((cat) => {
//     if (cat.id < minIdx)
//         minIdx = cat.id;
// });
//
// let tempCategs = [];
// let tempCategsChildren = [];
// categories.forEach((cat) => {
//     cat.id -= (minIdx - 1);
//     if (cat.parent_id > 0)
//         cat.parent_id -= (minIdx - 1);
//     else
//         cat.parent_id = 0;
//
//     // Add it in categories array
//     tempCategs[cat.id] = cat;
//
//     // Push this category in its parent array of children
//     if (tempCategsChildren[cat.parent_id]?.length >= 1)
//         tempCategsChildren[cat.parent_id].push(cat.id);
//     else
//         tempCategsChildren[cat.parent_id] = [cat.id];
// });
//
// setCategsState(tempCategs);
// setCategsChildrenState(tempCategsChildren);


// const ListItem = function ({category}) {
//     return (
//         <li key={category.id} className='list-group-item-action'>
//             <Row className='align-items-center'>
//
//                 {/* ProductsPage name*/}
//                 <Col className='col-md-9'>
//                     <Link to={'/category/' + category.name}><p className='my-auto'> {category.name}</p></Link>
//                 </Col>
//
//
//             </Row>
//         </li>
//     )
// }

// Listing nested categories
// const Nested = ({parent_id, categs, categsChildren}) => {
//
//     const listChildren = (cat_id) => {
//         return (
//             <>
//                 <ListItem category={categs[cat_id]}/>
//                 {categsChildren[cat_id]?.length > 0 &&
//                     <Nested parent_id={cat_id} categs={categsState} categsChildren={categsChildrenState}/>}
//             </>
//         );
//     }
//
//
//     if (categsChildren[parent_id]?.length > 0) {
//         return (
//             <ul style={{listStyleType: "none"}}>
//                 {categsChildren[parent_id].map(listChildren)}
//             </ul>
//         )
//     } else
//         return (<div></div>);
// }