import axios from 'axios';
export const loadImageData = (seq) => axios.get('https://jsonplaceholder.typicode.com/photos/' + seq);