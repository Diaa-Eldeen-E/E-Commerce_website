import CategoryItem from "./CategoryItem";
import { Container, Row } from "react-bootstrap";

const ListCategories = ({ categories, isAdmin, displayButtons }) =>
{

    const listChildren = (category) =>
    {
        return (
            <li key={category.id} className='list-group-item-action'>
                <CategoryItem category={category} isAdmin={isAdmin} displayButtons={displayButtons} />
            </li>
        );
    }


    if (categories?.length > 0)
    {
        return (
            <Container className='mt-5'>
                <Row className="justify-content-start g-4 " xl={5} md={3}>
                    {
                        categories.map((category) => <CategoryItem key={category.id} category={category} isAdmin={isAdmin} displayButtons={displayButtons} />)
                    }
                </Row>
            </Container>
        )
    } else
        return (<div>No categories found</div>);
}


export default ListCategories;