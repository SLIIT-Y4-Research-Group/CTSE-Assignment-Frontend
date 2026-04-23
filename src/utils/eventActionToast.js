import toast from "react-hot-toast";

const DEFAULT_TOAST_STYLE = {
  borderRadius: "12px",
  background: "#0f172a",
  color: "#f8fafc",
  padding: "12px 14px",
};

export const getApiErrorMessage = (error, fallbackMessage) => {
  const backendMessage = error?.response?.data?.message;
  const isNetworkOrCorsError =
    error?.code === "ERR_NETWORK" ||
    (!error?.response && error?.message === "Network Error");

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  if (isNetworkOrCorsError) {
    return "Request blocked by server/CORS. Check backend CORS or gateway config.";
  }

  return fallbackMessage;
};

export const runEventActionToast = async ({
  action,
  messages,
  onSuccess,
  toastOptions,
}) => {
  const {
    loading,
    success,
    errorFallback = "Request failed. Please try again.",
  } = messages;

  return toast.promise(
    action(),
    {
      loading,
      success: () => {
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        return success;
      },
      error: (error) => getApiErrorMessage(error, errorFallback),
    },
    {
      style: DEFAULT_TOAST_STYLE,
      success: {
        iconTheme: {
          primary: "#10b981",
          secondary: "#f8fafc",
        },
      },
      error: {
        iconTheme: {
          primary: "#ef4444",
          secondary: "#f8fafc",
        },
      },
      ...toastOptions,
    },
  );
};
