import { Link } from "react-router-dom";

const ListSuperCategories = function ({ superCategories })
{
    let descendingOrder = [...superCategories].reverse()

    return (
        <ul id='parentList'>
            {
                descendingOrder?.map(
                    (category, idx, categories) =>
                        <span key={idx}>

                            <li><Link to={'/product-category/' + category.id}>{category.name}</Link></li>
                            {idx < (categories.length - 1) && <li>></li>}

                        </span>
                )
            }
        </ul >
    )

}


export default ListSuperCategories;