import {Container, Row} from "react-bootstrap";
import {productsPerRow} from "../constants";
import ProductItem from "./ProductItem";

const listRow = (products) => {
    return (
        <Row>
            {products.map(ProductItem)}
        </Row>
    );
}

const ListProducts = function ({products}) {
    const productsCount = products.length;
    let rowsProducts = [];
    for (let i = 0; i < products.length; i += productsPerRow) {
        const row = products.slice(i, i + productsPerRow);
        rowsProducts.push(row);
    }

    return (
        <Container className='mt-5'>
            {rowsProducts.map(listRow)}
        </Container>
    )
}

export default ListProducts;