import styles from './SearchBar.module.css';

interface Props {
  placeholder: string,
  onInputChange?: (input: string) => void
}

export default function SearchBar({ placeholder, onInputChange }: Props) {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      onChange={(e) => onInputChange && onInputChange(e.target.value)} />
  );
}
