import Swal from "sweetalert2";
import { useEffect } from "react";
// ------------------------------------------------Swal------------------------------------------------

const toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export function fireSwalConfirm(callbackFunction) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3F51B5",
    cancelButtonColor: "#F50057",
    confirmButtonText: "Yes, delete it!",
  }).then(result => {
    if (result.isConfirmed) {
      callbackFunction();
    }
  });
}
export function fireToast(icon, title) {
  toast.fire({
    icon,
    title,
  });
}
export function fireSwal(icon, title) {
  Swal.fire({
    icon,
    title,
  });
}
export function fileIsValid(file) {
  const fileName = file.name;
  const fileSizeInMB = file.size / 1024 / 1024;
  const reg = /(.*?)\.(jpg|bmp|jpeg|png|gif)$/;
  return fileName.match(reg) && fileSizeInMB <= 2 ? true : false;
}
// ------------------------------------------------Hooks------------------------------------------------
// hook for changing the document title
export const useTitle = title => {
  useEffect(() => {
    document.title = title ? `${title}  | ConnecTo` : "ConnecTo";
  });
};
