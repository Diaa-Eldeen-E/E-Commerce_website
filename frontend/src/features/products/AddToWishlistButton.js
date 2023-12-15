import { Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useIsListedQuery, useAddToWishlistMutation } from "../api/apiSlice";

const AddToWishlistButton = function ({ product })
{

    // const [isListed, setIsListed] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);

    const { data: res, isLoading } = useIsListedQuery(product.id)
    const isListed = res?.islisted
    const [addToWishlist, { isLoading: isListing, error }] = useAddToWishlistMutation()

    const handleAddToWishList = function ()
    {
        addToWishlist({ 'product_id': product.id }).unwrap()
            .then(() => console.log("add to wishlist success: "))
            .catch(error =>
            {
                console.log("add to wishlist error: ", error);
            })
    }

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
                            style={{ width: "auto", height: "22px" }} />
                        <small className='text-success'>Listed</small>
                    </Link>
                </>
                :
                <Button className='bg-white text-warning w-auto border-0'
                    onClick={handleAddToWishList} disabled={isListing}>
                    <img
                        // src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaeHgal3lISF-dxsbKPPQd3slM_w5THC0QEQ&usqp=CAU'
                        src='/assets/add-to-wishlist-icon.png'
                        style={{ width: "auto", height: "22px" }} />
                    <small id='add-wishlist' className='ms-2'>Add to wishlist</small>
                </Button>
    )
}

export default AddToWishlistButton;