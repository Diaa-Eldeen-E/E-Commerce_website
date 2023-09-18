import CategoryLink from "../categories/CategoryLink";


const ListNestedCategories = ({ categories, isAdmin, displayButtons }) =>
{

    const listChildren = (category) =>
    {
        return (
            <li key={category.id} className='list-group-item-action'>
                <CategoryLink category={category} isAdmin={isAdmin} displayButtons={displayButtons} />
                {
                    category?.children?.length > 0 &&
                    <ListNestedCategories categories={category.children} isAdmin={isAdmin}
                        displayButtons={displayButtons} />
                }
            </li>
        );
    }


    if (categories?.length > 0)
    {
        return (
            <ul style={{ listStyleType: "none" }}>
                {categories.map(listChildren)}
            </ul>
        )
    } else
        return (<div>No categories found</div>);
}


export default ListNestedCategories;