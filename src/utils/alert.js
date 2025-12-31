export function showAlert(message, type = "success") {
  const alertBox = document.getElementById("customAlert");
  const alertMsg = document.getElementById("alertMessage");

  if (!alertBox || !alertMsg) return;

  alertMsg.innerText = message;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000);
}
