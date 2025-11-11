export interface RootManifest {
  AppIdentifier?: string;
  Device: {
    Model: string;
    UUID: string;
  };
  Name: string;
  Pages: {
    Current: string;
    Default: string;
    Pages: string[];
  };
  Version: string;
}

export interface PageManifest {
  Controllers: {
    Actions: {
      [key: string]: Action;
    } | null;
    Type: string;
  }[];
  Icon: string;
  Name: string;
}

export interface Action {
  ActionID: string;
  LinkedTitle: boolean;
  Name: string;
  Plugin: Plugin;
  Settings: Settings | {};
  State: number;
  States: State[] | [{}];
  UUID: string;
}

export interface Plugin {
  Name: string;
  UUID: string;
  Version: string;
}

export interface Settings {
  Coalesce: boolean;
  Hotkeys: Hotkey[];
}

export interface Hotkey {
  KeyCmd: boolean;
  KeyCtrl: boolean;
  KeyModifiers: number;
  KeyOption: boolean;
  KeyShift: boolean;
  NativeCode: number;
  QTKeyCode: number;
  VKeyCode: number;
}

export interface State {
  FontFamily: string;
  FontSize: number;
  FontStyle: string;
  FontUnderline: boolean;
  Image: string;
  OutlineThickness: number;
  ShowTitle: boolean;
  Title: string;
  TitleAlignment: string;
  TitleColor: string;
}
