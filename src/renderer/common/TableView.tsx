import styles from './TableView.module.css';

interface Props {
  children: React.ReactNode
}

export default function TableView({ children }: Props) {
  return (
    <table className={styles.table}>
      {children}
    </table>
  );
}
