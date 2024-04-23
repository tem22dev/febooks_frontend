import clsx from 'clsx';

import Header from '../components/Header';
import styles from './HeaderOnly.module.scss';

function HeaderOnly({ children }) {
    return (
        <div className={clsx(styles.wrapper)}>
            <Header />
            <div className={clsx(styles.container)}>{children}</div>
        </div>
    );
}

export default HeaderOnly;
