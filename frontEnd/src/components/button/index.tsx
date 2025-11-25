import type { ReactNode } from 'react';

import styles from './styles.module.css';

interface ButtonProps {
  children: ReactNode;
}
export function Button({ children }: ButtonProps) {
  return <button className={styles.container}>{children}</button>;
}
