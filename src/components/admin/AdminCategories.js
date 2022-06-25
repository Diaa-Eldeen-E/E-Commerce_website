import axios from "axios";
import {useEffect, useState} from "react";
import {Button, Col, Container, Fade, Form, Row, ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";


const AdminCategories = function () {
    const [refreshData, setRefreshData] = useState(true);
    const [categsState, setCategsState] = useState([]);
    const [categsChildrenState, setCategsChildrenState] = useState([]);

    // Load categories from database
    useEffect(() => {
        if (!refreshData)
            return;
        setRefreshData(false);
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/categories').then((res) => {

                    // Data preprocessing
                    let categories = res.data;
                    let minIdx = 9999999;
                    categories.forEach((cat) => {
                        if (cat.id < minIdx)
                            minIdx = cat.id;
                    });

                    let tempCategs = [];
                    let tempCategsChildren = [];
                    categories.forEach((cat) => {
                        cat.id -= (minIdx - 1);
                        if (cat.parent_id > 0)
                            cat.parent_id -= (minIdx - 1);
                        else
                            cat.parent_id = 0;

                        // Add it in categories array
                        tempCategs[cat.id] = cat;

                        // Push this category in its parent array of children
                        if (tempCategsChildren[cat.parent_id]?.length >= 1)
                            tempCategsChildren[cat.parent_id].push(cat.id);
                        else
                            tempCategsChildren[cat.parent_id] = [cat.id];
                    });

                    setCategsState(tempCategs);
                    setCategsChildrenState(tempCategsChildren);
                }
            )
        });
    }, [refreshData]);


    const deleteCategory = function (catName) {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.delete('/api/category?' + catName).then((res) => {
                if (res.data.status === 200)
                    setRefreshData(true);
                else
                    console.log('Failed to delete item');
            })
        })
    }


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

    const handleSubmit = function (event) {
        event.preventDefault();

        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/category', inputs).then((res) => {
                    // Category added successfully
                    if (res.data.status === 200) {
                        setRefreshData(true);
                        setErrorMessage('');
                        setValidationErrors('');
                        setIsAdd(true);
                        setTimeout(() => setIsAdd(false), 2000);
                    }
                    // Failed
                    else {
                        // Show error message
                        setErrorMessage(res.data.message);
                        setValidationErrors(res.data.validation_errors);
                    }
                }
            )
        })
    }

    const ListItem = function ({category}) {
        return (
            <li key={category.id} className='list-group-item-action'>
                <Row className='align-items-center'>

                    {/* Category name*/}
                    <Col className='col-md-9'>
                        <Link to={'/admin/category/' + category.name}><p className='my-auto'> {category.name}</p></Link>
                    </Col>

                    {/* Buttons */}
                    <Col>
                        <Link to={'/admin/updatecategory/' + category.name}>
                            <Button variant='outline-primary' className='mx-1 my-1'>Update</Button></Link>
                        <Button variant='outline-danger' className='mx-1 my-1'
                                onClick={() => deleteCategory(category.name)}>Delete</Button>
                    </Col>

                </Row>
            </li>
        )
    }

    // Listing nested categories
    const Nested = ({parent_id, categs, categsChildren}) => {

        const listChildren = (cat_id) => {
            return (
                <>
                    <ListItem category={categs[cat_id]}/>
                    {categsChildren[cat_id]?.length > 0 &&
                        <Nested parent_id={cat_id} categs={categsState} categsChildren={categsChildrenState}/>}
                </>
            );
        }


        if (categsChildren[parent_id]?.length > 0) {
            return (
                <ul style={{listStyleType: "none"}}>
                    {categsChildren[parent_id].map(listChildren)}
                </ul>
            )
        } else
            return (<div></div>);
    }

    return (
        <Container className="my-4">

            {/* AdminCategories lists*/}
            <Row className='w-75 mx-auto'>
                <Nested parent_id={0} categs={categsState} categsChildren={categsChildrenState}/>
            </Row>

            {/* Adding category form*/}
            <Row className='w-75 mx-auto mt-3'>
                <Form onSubmit={handleSubmit}>

                    {/*<p className='text-danger'>{errorMessage}</p>*/}
                    <Row>
                        {/* Category name input */}
                        <Form.Group as={Col} md='4' className='mb-3' controlId="formCategory">
                            <Form.Control type='text' name='name' placeholder='Category name' onChange={handleChange}
                                          isInvalid={validationErrors.name}/>
                            <Form.Control.Feedback type='invalid'>{validationErrors.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Category parent select options*/}
                        <Col className='col-md-4'>
                            <Form.Select aria-label="Default select example" name='parent' onChange={handleChange}>
                                <option value="">None</option>
                                {/* List all categories as possible parent categories*/}
                                {categsState?.map(
                                    (category) =>
                                        <option value={category.name} key={category.id}>{category.name}</option>)}
                            </Form.Select>
                        </Col>
                        <Col className='col-md-4'>
                            <Button type='submit' className='bg-primary'>Add category</Button>
                        </Col>

                        <Fade in={isAdd} className='text-success '><p>Category added</p></Fade>

                    </Row>
                </Form>
            </Row>

        </Container>
    );
}

export default AdminCategories;


//
//
//
//
//
// Trash

// Transform categories from category, parent form into category, children form
// const transCategory = function (cats) {
//     let categs = [];
//     let categsChildren = [];
//     cats.forEach((cat) => {
//         // Add it in categories array
//         categs[cat.id] = cat;
//
//         // Push this category in its parent array of children
//         if (categsChildren[cat.parent_id]?.length >= 1)
//             categsChildren[cat.parent_id].push(cat.id);
//         else
//             categsChildren[cat.parent_id] = [cat.id];
//     })
//
//     return {categs, categsChildren}
// }

// const createListItem = (item, idx) => {
//     return (
//         <li key={idx} className='list-group-item-action align-items-center'>
//             <Row className='align-items-center'>
//                 <Col className='col-md-9'>
//                     <p className='my-auto'> {item.name}</p>
//                 </Col>
//                 <Col>
//                     <Button variant='outline-primary' className='mx-1 my-1'>Update</Button>
//                     <Button variant='outline-danger' className='mx-1 my-1'
//                             onClick={() => deleteCategory(item.name)}>Delete</Button>
//                 </Col>
//             </Row>
//         </li>
//     );
// }
//
// const CategoriesList = ({cats}) => {
//     return (
//         <ul>
//             {cats?.map(createListItem)}
//         </ul>
//     );
// }


// Add the category to the list
// let cat = res.data.category;
// Concatenate the added category to previous categories or just return this category
// setCategories((cats) => cats?.concat([cat]) || [cat]);

// setCategsState((cats) => cats?.concat([cat]) || [cat]);
// let categsChildrenTemp = categsChildrenState.slice();
// if (categsChildrenTemp[cat.parent_id]?.length > 0)
//     categsChildrenTemp[cat.parent_id]?.concat(cat.id)
// else
//     categsChildrenTemp[cat.parent_id] = [cat.id];
//
// setCategsChildrenState(categsChildrenTemp);

// Delete the category from the list
// setCategories((oldCategories) => {
//     let cats = oldCategories.slice();   // Create a mutable copy of the old array
//     cats.splice(cats.findIndex((item) => item.name == catName), 1); // Delete item
//     return cats;    // Return the new array
// });

// let idx = categsState.findIndex((item) => item?.name == catName);
// let catsTemp = categsState.slice();
// let catsChildrenTemp = categsChildrenState.slice();
// console.log('temp children');
// console.log(catsChildrenTemp);
//
// // Empty its children array at its index, empty its parent array from its index
// let childIdx = categsChildrenState[categsState[idx].parent_id].indexOf(idx);
// catsChildrenTemp[categsState[idx].parent_id].splice(childIdx, 1);
// let delArray = catsChildrenTemp[categsState[idx]];
// catsChildrenTemp[categsState[idx]] = [];
//
// // Remove it from categs, remove each child of it from categs
// if (delArray?.length > 0)
//     delArray.push(idx);
// else
//     delArray = [idx];
// delArray.sort((a, b) => a - b); // Sort in ascending order
// delArray.reverse();
// catsTemp.splice(idx, 1);
// delArray.forEach((i) => catsTemp.splice(i, 1));
//
// setCategsState(catsTemp);
// setCategsChildrenState(catsChildrenTemp);

// Update transformed categories
// useEffect(() => {
//     console.log('Categores effect');
//     let tempCategs = [];
//     let tempCategsChildren = [];
//     categories.forEach((cat) => {
//         // Add it in categories array
//         tempCategs[cat.id] = cat;
//
//         // Push this category in its parent array of children
//         if (tempCategsChildren[cat.parent_id]?.length >= 1)
//             tempCategsChildren[cat.parent_id].push(cat.id);
//         else
//             tempCategsChildren[cat.parent_id] = [cat.id];
//     });
//     setCategsState(tempCategs);
//     setCategsChildrenState(tempCategsChildren);
// }, [categories]);

// <div className="Container" dangerouslySetInnerHTML={{__html: nested(0, so(categories))}}></div>

// No more children
// if (parentCats[cat_id]?.length < 1 || !Array.isArray(parentCats[cat_id])) {
//     return (
//         <li key={idx}> {categs[cat_id].name} </li>
//     );
// }
// Still have more children
// if (parentCats[cat_id]?.length > 0) {
//     return (
//         <>
//             <li key={idx}> {categs[cat_id].name} </li>
//             <Nested parent_id={cat_id} cats={so(categories)}/>
//         </>
//     );
//
// }

// const nested = (parent_id, cats) => {
//     let {categs, parentCats} = cats;
//     let html = "";
//     if (parentCats[parent_id]?.length > 0) {
//         console.log('pare');
//         console.log(parentCats[parent_id]);
//         html += "<ul>\n";
//         parentCats[parent_id].forEach((cat_id) => {
//             // No more children
//             if (parentCats[cat_id]?.length < 1 || !Array.isArray(parentCats[cat_id])) {
//                 console.log('parentCats');
//                 console.log(parentCats[cat_id]);
//                 html += "<li>" + categs[cat_id].name + "</li> \n";
//             }
//             // Still have more children
//             if (parentCats[cat_id]?.length > 0) {
//                 html += "<li>" + categs[cat_id].name + "</li>\n";
//                 html += nested(cat_id, cats);
//                 // html += "</li> \n";
//             }
//         });
//
//         html += "</ul> \n";
//     }
//     console.log(html);
//     return html;
// }