import Swal from "sweetalert2";
window.Swal = Swal;

export function Alert(string, icon = "success") {
  Swal.fire({
    title: string,
    icon: icon,
    timer: 3000,
    toast: true,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export default alert;
