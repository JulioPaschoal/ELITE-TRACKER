import { ListChecks, SignOut } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import styles from './styles.module.css';

export function Sidebar() {
  return (
    <div className={styles.container}>
      <img src="https://github.com/JulioPaschoal.png" alt="Julio Paschoal" />
      <div className={styles.links}>
        <Link to="/">
          <ListChecks />
        </Link>
      </div>
      <SignOut className={styles.signOut} />
    </div>
  );
}
