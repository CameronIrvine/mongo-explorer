import styles from './Modal.module.css';

interface Props {
  heading: string,
  children: React.ReactNode,
  onNext: () => void;
  onCancel: () => void;
}

export default function Modal({ heading, children, onNext, onCancel }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.heading}>{heading}</h1>
        {children}
        <div className={styles.footer}>
          <button type='button' onClick={onCancel}>Cancel</button>
          <button type='button' onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
}
