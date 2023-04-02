import { Dispatch, SetStateAction } from 'react';

import styles from './FormField.module.css';

interface Props {
  label: string,
  placeholder: string,
  onChange: Dispatch<SetStateAction<string>>
}

export default function FormField({ label, placeholder, onChange }: Props) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input type='text' placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
