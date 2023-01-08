import useDrivePicker from './picker';
import { CallbackDoc } from './typeDefs';

interface GooglePickerButtonProps {
  onSelected: (googleDriveID: CallbackDoc) => void;
}

export function GooglePickerButton({ onSelected }: GooglePickerButtonProps) {
  const [openPicker] = useDrivePicker();
  const handleOpenPicker = (view: 'DOCUMENTS' | 'FOLDERS') => {
    openPicker({
      clientId: process.env.REACT_APP_CLIENT_ID || '',
      developerKey: process.env.REACT_APP_API_KEY || '',
      viewId: view,
      // token: token, // pass oauth token in case you already have one
      setIncludeFolders: view === 'FOLDERS',
      setSelectFolderEnabled: true,
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: ({ action, docs }) => {
        if (action === 'picked' && docs.length === 1 && docs[0].id) {
          onSelected(docs[0]);
        }
      },
    });
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={() => handleOpenPicker('DOCUMENTS')}>Create Page from Document</button>
      <button onClick={() => handleOpenPicker('FOLDERS')}>Create Site from Folder</button>
    </div>
  );
}
