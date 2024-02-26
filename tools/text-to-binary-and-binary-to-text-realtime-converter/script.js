function textToBinary() {
  const inputText = document.getElementById("inputText").value;
  const binaryString = inputText.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
  document.getElementById("inputBinary").value = binaryString;
}
function binaryToText() {
  const inputBinary = document.getElementById("inputBinary").value;
  const text = inputBinary.split(' ').map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
  document.getElementById("inputText").value = text;
}
document.getElementById("copyright-year").textContent = new Date().getFullYear();
