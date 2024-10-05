let numbers = [
  "'Add' to add", "click to 'remove'", 
];

const wheel = document.getElementById('rouletteWheel');
const resultText = document.getElementById('result');
let totalRotation = 0;

function createPieSegments() {
  const totalNumbers = numbers.length;
  const degreePerNumber = 360 / totalNumbers;
  let wheelBackground = '';

  // List of distinct colors
  const colors = [
    '#ff3cac', '#2b86c5', '#784ba0', '#34e89e', '#ffcc70', '#fc466b',
    '#1c92d2', '#f7971e', '#c33764', '#6a82fb', '#fc4a1a', '#4facfe',
    '#f1c40f', '#e74c3c', '#3498db', '#8e44ad'
  ];

  let lastColorIndex = -1; // To track the last color used

  for (let i = 0; i < totalNumbers; i++) {
    let colorIndex;

    // Ensure adjacent pies have different colors
    do {
      colorIndex = Math.floor(Math.random() * colors.length);
    } while (colorIndex === lastColorIndex);

    const color = colors[colorIndex];
    lastColorIndex = colorIndex; // Update last used color index

    const startDegree = i * degreePerNumber;
    const endDegree = (i + 1) * degreePerNumber;

    wheelBackground += `${color} ${startDegree}deg ${endDegree}deg, `;
  }

  // Apply the conic gradient to the wheel background
  wheel.style.background = `conic-gradient(${wheelBackground.slice(0, -2)})`;
}


function createNumberElements() {
  const numberList = document.querySelector('.numbers');
  numberList.innerHTML = ''; // Clear existing numbers/texts
  const degreePerNumber = 360 / numbers.length;

  numbers.forEach((number, index) => {
      const li = document.createElement('li');
      li.innerText = number;

      // Click event to remove the number/text when the pie segment is clicked
      li.addEventListener('click', function () {
          removeNumber(index);
      });

      const rotation = (index * degreePerNumber) + (degreePerNumber/2);
      li.style.transform = `rotate(${rotation}deg) translate(0, -220px) rotate(-${rotation}deg)`; 
      numberList.appendChild(li);
  });
}

function removeNumber(index) {
  numbers.splice(index, 1);
  createPieSegments();  // Update pie segments
  createNumberElements(); // Update wheel
}

function clearResult() {
  resultText.innerText = ''; // Clear result message
}

// Spin the wheel
document.getElementById('spinButton').addEventListener('click', function() {
  clearResult(); // Clear result when spin button is clicked
  const totalNumbers = numbers.length;
  const degreePerNumber = 360 / totalNumbers;

  const randomIndex = Math.floor(Math.random() * totalNumbers);
  const randomDegree = randomIndex * degreePerNumber;

  const extraSpins = 10 * 360; // Extra spins to make it spin faster
  totalRotation += randomDegree + extraSpins; // Accumulate rotation

  wheel.style.transition = "none";  // Reset the transition before reapplying
  setTimeout(() => {
      wheel.style.transition = "transform 4s ease-out";  // Set the spin animation duration
      wheel.style.transform = `rotate(${totalRotation}deg)`;  // Spin the wheel
  }, 10);

  setTimeout(function() {
      const currentRotation = totalRotation % 360;  // Get the final rotation within 360 degrees
      const index = Math.floor((360 - currentRotation) / degreePerNumber) % totalNumbers;

      const resultNumber = numbers[index];
      resultText.innerText = `The wheel landed on "${resultNumber}"`;
  }, 4000);
});

// Add number/text button
document.getElementById('addButton').addEventListener('click', function() {
  clearResult(); // Clear result when add button is clicked
  const newItem = prompt('Enter a new number or text to add:');
  if (newItem !== null && newItem.trim() !== '') {
      numbers.push(newItem);
      createPieSegments();  // Update pie segments
      createNumberElements(); // Update wheel
  }
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', function() {
  clearResult(); // Clear result when reset button is clicked
  numbers = [
    "click 'Add' to add", "click option to 'remove'", 
  ];
  totalRotation = 0;  // Reset total rotation
  resultText.innerText = ''; // Clear previous result
  createPieSegments();  // Create pie segments for the initial wheel
  createNumberElements(); // Reset the wheel numbers
});

// Clear result when the wheel itself is clicked
wheel.addEventListener('click', function() {
  clearResult(); // Clear result when the wheel is clicked
});

// Initial setup
createPieSegments();  // Create pie segments for the initial wheel
createNumberElements();
