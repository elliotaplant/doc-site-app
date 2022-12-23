import useDrivePicker from './picker/picker';

interface GooglePickerButtonProps {
  onSelected: (googleDriveID: string) => void;
}

export function GooglePickerButton({ onSelected }: GooglePickerButtonProps) {
  const [openPicker] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.REACT_APP_CLIENT_ID || '',
      developerKey: process.env.REACT_APP_API_KEY || '',
      viewId: 'DOCUMENTS',
      // token: token, // pass oauth token in case you already have one
      setIncludeFolders: true,
      setSelectFolderEnabled: true,
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: ({ action, docs }) => {
        if (action === 'picked' && docs.length === 1 && docs[0].id) {
          onSelected(docs[0].id);
        }
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}
