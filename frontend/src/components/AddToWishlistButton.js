import {Button} from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const AddToWishlistButton = function ({product}) {

    const [isListed, setIsListed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const addToWishlist = () => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.post('/api/addtowishlist', {'product_id': product.id}).then((res) => {
                // ProductPage added successfully
                if (res.data.status === 200) {
                    setIsListed(true);
                }
            })
        })
    }

    useEffect(() => {
        axios.get('/sanctum/csrf-cookie').then((response) => {
            axios.get('/api/islisted?product_id=' + product.id).then((res) => {
                if (res.data?.islisted)
                    setIsListed(true);
                else
                    setIsListed(false);
                setIsLoading(false);
            })
        })
    }, []);

    return (
        isLoading ?
            <>
            </>
            :
            isListed ?
                <>
                    <Link to='/wishlist'>
                        <img
                            // src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaeHgal3lISF-dxsbKPPQd3slM_w5THC0QEQ&usqp=CAU'
                            src='/assets/listed-wishlist-icon.png'
                            style={{width: "auto", height: "22px"}}/>
                        <small className='text-success'>Listed</small>
                    </Link>
                </>
                :
                <Button className='bg-white text-warning w-auto border-0' onClick={addToWishlist}>
                    <img
                        // src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaeHgal3lISF-dxsbKPPQd3slM_w5THC0QEQ&usqp=CAU'
                        src='/assets/add-to-wishlist-icon.png'
                        style={{width: "auto", height: "22px"}}/>
                    <small id='add-wishlist' className='ms-2'>Add to wishlist</small>
                </Button>
    )
}

export default AddToWishlistButton;