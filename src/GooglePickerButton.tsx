import GooglePicker from 'react-google-picker';
import useDrivePicker from './picker/picker';

function pickerCallback(data: any) {
  console.log('data', data);
  let url = 'nothing';
  if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
    let doc = data[google.picker.Response.DOCUMENTS][0];
    url = doc[google.picker.Document.URL];
  }
  console.log(`You picked: ${url}`);
}

export function GooglePickerButton() {
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
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        }
        console.log(data);
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export function GooglePickerButton1() {
  const googlePickerThing = async () => {
    // get auth token from backend
    const resp = await fetch('/.netlify/functions/auth-token');
    const { accessToken } = await resp.json();
    console.log('accessToken', accessToken);

    // show the picker?

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setDeveloperKey(process.env.REACT_APP_API_KEY || '')
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  return <button onClick={googlePickerThing}>Lol wut</button>;
}

export function GooglePickerButton0() {
  return (
    <GooglePicker
      clientId={process.env.REACT_APP_CLIENT_ID || ''}
      developerKey={process.env.REACT_APP_API_KEY || ''}
      scope={['https://www.googleapis.com/auth/drive.readonly']}
      onChange={(data) => console.log('on change:', data)}
      onAuthFailed={(data) => console.log('on auth failed:', data)}
      multiselect={false}
      navHidden={false}
      authImmediate={false}
      mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
      query={'*.txt'}
      viewId={'DOCS'}
    >
      <button>Lol wut</button>
    </GooglePicker>
  );
}
