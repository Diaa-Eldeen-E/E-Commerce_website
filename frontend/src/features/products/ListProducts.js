import { Container, Row } from "react-bootstrap";
import { productsPerRow } from "../../app/constants";
import ProductItem from "./ProductItem";


const ListProducts = function ({ products, isAdmin })
{
    const productsCount = products.length;
    let rowsProducts = [];
    for (let i = 0; i < products.length; i += productsPerRow)
    {
        const row = products.slice(i, i + productsPerRow);
        rowsProducts.push(row);
    }

    const listRow = (products, idx) =>
    {
        return (
            <Row key={idx}>
                {
                    products.map((product) => <ProductItem key={product.id} product={product} isAdmin={isAdmin} />)
                }
            </Row>
        );
    }

    return (
        <Container className='mt-5'>
            {rowsProducts.map(listRow)}
        </Container>
    )
}

export default ListProducts;