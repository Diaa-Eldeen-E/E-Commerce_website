import {Spinner} from "react-bootstrap";

const Loading = function ({isSmall}) {
    return (
        <Spinner animation="border" variant='primary' role="status" size={isSmall ? "sm" : ''}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}

export default Loading;