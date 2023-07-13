import CategoryItem from "./CategoryItem";

const ListNestedCategories = ({ categories, isAdmin, displayButtons }) =>
{

    const listChildren = (category) =>
    {
        return (
            <div key={category.id}>
                <CategoryItem category={category} isAdmin={isAdmin} displayButtons={displayButtons} />
                {
                    category?.children?.length > 0 &&
                    <ListNestedCategories categories={category.children} isAdmin={isAdmin}
                        displayButtons={displayButtons} />
                }
            </div>
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