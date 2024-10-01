import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the showToast function outside the component so that it can be used anywhere
export const showToast = (
  message: string,
  type: "success" | "error",
  options?: ToastOptions
) => {
  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  }
};

// Toast component just renders the ToastContainer. It should be placed at a high level in your app.
const Toast: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  );
};

export default Toast;
