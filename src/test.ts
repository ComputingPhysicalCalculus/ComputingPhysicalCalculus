let numberInput: HTMLInputElement;
let printButton: HTMLButtonElement;
let printValue: HTMLOutputElement;

window.onload = setup;

function setup(): void {
    numberInput = document.getElementById("number_input") as HTMLInputElement;
    printButton = document.getElementById("print_btn") as HTMLButtonElement;
    printValue = document.getElementById("entered_number") as HTMLOutputElement;

    printButton.addEventListener("click", printEnteredValue);
}


function printEnteredValue(): void {
    const num1 = parseFloat(numberInput.value);
    printValue.textContent = num1.toString();
    console.log("num1");
}
