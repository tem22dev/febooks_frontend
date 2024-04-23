import clsx from 'clsx';

import styles from './Header.module.scss';

function Header() {
    return <h2 className={clsx(styles.wrapper)}>Header</h2>;
}

export default Header;
