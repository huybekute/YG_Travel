import Swal from "sweetalert2";

const topEndToast = (icon, title) =>{
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000, 
        timerProgressBar: true, 
        customClass: {
            container: 'mt-16 mr-2'
        }
    }).fire({
        icon: icon,
        title: title
    })
};

const errorToast = (title, message) => {
    Swal.fire ({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Đóng'
    })
}

const successToast = (title, message) => {
    Swal.fire ({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Đóng'
    })
}

const warningToast = (title, message) => {
    Swal.fire ({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Đóng'
    })
}

const confirmRequestToast = (icon, title, text) => {
    return Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonColor: '#2563eb', 
        cancelButtonColor: '#d33',   
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        reverseButtons: true,
        allowOutsideClick: false 
    });
};

export default { topEndToast, errorToast, successToast, confirmRequestToast, warningToast }