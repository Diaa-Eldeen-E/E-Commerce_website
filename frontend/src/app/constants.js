export const defaultPageSize = 10;
export const productsPerRow = 5;
export const maxProductImageHeight = 200;
export const maxProductImageWidth = 500;
export const baseURL = 'http://localhost:8000';
export const CURRENCY = '$'



// used for dubegging
export function sleep_ms(miliseconds)
{
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime())
    {
    }
}