import { Container, Row } from "react-bootstrap";
import { productsPerRow } from "../../app/constants";
import ProductItem from "./ProductItem";


const ListProducts = function ({ products, isAdmin })
{

    return (
        <Container className='mt-5'>
            {/* {rowsProducts.map(listRow)} */}
            <Row className="justify-content-start g-4 " xl={5} md={3} xs={1}>  {/* 5 per row on XL screen, and 1 per row for xs*/}
                {
                    products.map((product) => <ProductItem key={product.id} product={product} isAdmin={isAdmin} />)
                }
            </Row>
        </Container>
    )
}

export default ListProducts;



// const productsCount = products.length;
//     let rowsProducts = [];
//     for (let i = 0; i < products.length; i += productsPerRow)
//     {
//         const row = products.slice(i, i + productsPerRow);
//         rowsProducts.push(row);
//     }


// const listRow = (products, idx) =>
// {
//     return (
//         <Row key={idx} className="justify-content-start g-4 " xl={5} md={3}>
//             {
//                 products.map((product) => <ProductItem key={product.id} product={product} isAdmin={isAdmin} />)
//             }
//         </Row>
//     );
// }