import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ListNestedCategories from "./ListNestedCategories";
import ListCategories from "./ListCategories";
import Loading from "../../common/Loading";
import { useGetNestedCategoriesQuery } from "../api/apiSlice";

const CategoriesPage = function ({ isAdmin })
{
    // Load categories from database
    const { data: categories, isLoading, isSuccess, isError, error } = useGetNestedCategoriesQuery()

    return (
        <Container className="my-4">

            {
                isAdmin ?

                    <Link to='/addcategory' className='position-absolute end-0 me-3 mt-3'>Add category</Link>

                    :

                    <></>
            }

            {/* Categories lists*/}
            <Row className='w-75 mx-auto'>
                {
                    isLoading ? <Loading />

                        :

                        isSuccess ?
                            isAdmin ?
                                <ListNestedCategories categories={categories} isAdmin={isAdmin} displayButtons={isAdmin} />
                                :
                                <ListCategories categories={categories} />

                            :

                            <p>No categories found</p>
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