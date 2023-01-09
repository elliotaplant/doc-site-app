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
    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
      <button
        className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
        onClick={() => handleOpenPicker('DOCUMENTS')}
      >
        Create Page from Document
      </button>
      <button
        className="border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
        onClick={() => handleOpenPicker('FOLDERS')}
      >
        Create Site from Folder
      </button>
    </div>
  );
}
