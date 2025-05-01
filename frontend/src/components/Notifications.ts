import { toast, ToastOptions } from "react-toastify";

export class notify {
  static defaultSettings: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  };

  static error(content: string, settings?: ToastOptions) {
    toast.error(content, { ...this.defaultSettings, ...settings });
  }

  static success(content: string, settings?: ToastOptions) {
    toast.success(content, { ...this.defaultSettings, ...settings });
  }

  static info(content: string, settings?: ToastOptions) {
    toast.info(content, { ...this.defaultSettings, ...settings });
  }

  static warning(content: string, settings?: ToastOptions) {
    toast.warning(content, { ...this.defaultSettings, ...settings });
  }
}
