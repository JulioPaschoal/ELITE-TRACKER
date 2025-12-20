import { PaperPlaneRight, Trash } from '@phosphor-icons/react';

import { Sidebar } from '../sidebar';
import styles from './styles.module.css';

export function Habits() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.content}>
          <header>
            <h1>Hábitos Diários</h1>
            <span>Hoje, 29 de Novembro</span>
          </header>
          <div className={styles.input}>
            <input type="text" placeholder="Digite aqui um novo hábito" />
            <PaperPlaneRight />
          </div>
          <div className={styles.habits}>
            <div className={styles.habit}>
              <p>Estudar Inglês</p>
              <div>
                <input type="checkbox" name="" id="" />
                <Trash />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
