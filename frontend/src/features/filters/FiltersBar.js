import CategoryLink from "../categories/CategoryLink";

const FiltersBar = function ({ category })
{

    // [Todo: more filters]

    return (
        <>
            <CategoryLink category={category} />

            <ul style={{ listStyleType: "none" }} className="p-3">
                {
                    category?.children?.map((category) => <CategoryLink category={category} key={category.id} />)
                }

            </ul>
        </>
    );
}

export default FiltersBar;