import {Spinner} from "react-bootstrap";

const Loading = function () {
    return (
        <Spinner animation="border" variant='primary' role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}

export default Loading;