import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import styles from './BookDetail.module.scss';

function BookDetail() {
    let location = useLocation();

    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    return <h2>BookDetail page</h2>;
}

export default BookDetail;
