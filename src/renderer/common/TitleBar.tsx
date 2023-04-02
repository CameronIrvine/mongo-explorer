import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faMinus } from '@fortawesome/free-solid-svg-icons';

import styles from './TitleBar.module.css';
import Commands from '../../commands';

interface Props {
  title: string
}

export default function TitleBar({ title }: Props) {
  function executeCommand(command: Commands.CloseWindow | Commands.MinimizeWindow) {
    window.electron.ipcRenderer.invoke(command);
  }

  return (
    <div className={styles.titleBar}>
      {title}
      {window.electron.platform !== 'darwin' &&
        <div className={styles.windowButtons} onClick={() => executeCommand(Commands.MinimizeWindow)}>
          <button type='button'>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button className={styles.closeBtn} type='button' onClick={() => executeCommand(Commands.CloseWindow)}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      }
    </div>
  );
}
