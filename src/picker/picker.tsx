import { useCallback, useEffect, useState } from 'react';
import { authResult, defaultConfiguration, PickerConfiguration } from './typeDefs';
import useInjectScript from './useInjectScript';

// Values injected into scope by google scripts
declare let google: any;
declare let window: any;

export default function useDrivePicker(): [
  (config: PickerConfiguration) => boolean | undefined,
  authResult | undefined
] {
  const defaultScopes = ['https://www.googleapis.com/auth/drive.readonly'];
  const [loaded, error] = useInjectScript('https://apis.google.com/js/api.js');
  const [loadedGsi, errorGsi] = useInjectScript('https://accounts.google.com/gsi/client');
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [openAfterAuth, setOpenAfterAuth] = useState(false);
  const [config, setConfig] = useState<PickerConfiguration>(defaultConfiguration);
  const [authRes, setAuthRes] = useState<authResult>();

  const createPicker = useCallback(
    ({
      token,
      appId = '',
      supportDrives = false,
      developerKey,
      viewId = 'DOCS',
      disabled,
      multiselect,
      showUploadView = false,
      showUploadFolders,
      setParentFolder = '',
      viewMimeTypes,
      customViews,
      locale = 'en',
      setIncludeFolders,
      setSelectFolderEnabled,
      disableDefaultView = false,
      callbackFunction,
    }: PickerConfiguration) => {
      if (disabled) return false;

      const view = new google.picker.DocsView(google.picker.ViewId[viewId]);
      if (viewMimeTypes) view.setMimeTypes(viewMimeTypes);
      if (setIncludeFolders) view.setIncludeFolders(true);
      if (setSelectFolderEnabled) view.setSelectFolderEnabled(true);

      const uploadView = new google.picker.DocsUploadView();
      if (viewMimeTypes) uploadView.setMimeTypes(viewMimeTypes);
      if (showUploadFolders) uploadView.setIncludeFolders(true);
      if (setParentFolder) uploadView.setParent(setParentFolder);

      const picker = new google.picker.PickerBuilder()
        .setAppId(appId)
        .setOAuthToken(token)
        .setDeveloperKey(developerKey)
        .setLocale(locale)
        .setCallback(callbackFunction);

      if (!disableDefaultView) {
        picker.addView(view);
      }

      if (customViews) {
        customViews.map((view) => picker.addView(view));
      }

      if (multiselect) {
        picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
      }

      if (showUploadView) picker.addView(uploadView);

      if (supportDrives) {
        picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
      }

      picker.build().setVisible(true);
      return true;
    },
    []
  );

  // get the apis from googleapis
  useEffect(() => {
    if (loaded && !error && loadedGsi && !errorGsi && !pickerApiLoaded) {
      // load the Drive picker api
      window.gapi.load('auth');
      window.gapi.load('picker', { callback: () => setPickerApiLoaded(true) });
    }
  }, [loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);

  // use effect to open picker after auth
  useEffect(() => {
    if (
      openAfterAuth &&
      config.token &&
      loaded &&
      !error &&
      loadedGsi &&
      !errorGsi &&
      pickerApiLoaded
    ) {
      createPicker(config);
      setOpenAfterAuth(false);
    }
  }, [openAfterAuth, config, loaded, error, loadedGsi, errorGsi, pickerApiLoaded, createPicker]);

  // open the picker
  const openPicker = (config: PickerConfiguration) => {
    // global scope given conf
    setConfig(config);

    // if we didn't get token generate token.
    if (!config.token) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: (config.customScopes
          ? [...defaultScopes, ...config.customScopes]
          : defaultScopes
        ).join(' '),
        callback: (tokenResponse: authResult) => {
          setAuthRes(tokenResponse);
          createPicker({ ...config, token: tokenResponse.access_token });
        },
      });

      client.requestAccessToken();
    }

    // if we have token and everything is loaded open the picker
    if (config.token && loaded && !error && pickerApiLoaded) {
      return createPicker(config);
    }
  };

  return [openPicker, authRes];
}
