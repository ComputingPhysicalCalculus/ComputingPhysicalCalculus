var numberInput;
var printButton;
var printValue;
window.onload = setup;
function setup() {
    numberInput = document.getElementById("number_input");
    printButton = document.getElementById("print_btn");
    printValue = document.getElementById("entered_number");
    printButton.addEventListener("click", printEnteredValue);
}
function printEnteredValue() {
    var num1 = parseFloat(numberInput.value);
    printValue.textContent = num1.toString();
    console.log("num1");
}
//# sourceMappingURL=test.js.map