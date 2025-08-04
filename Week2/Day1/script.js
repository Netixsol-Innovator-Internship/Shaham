document.getElementById('age-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput = document.getElementById('year');

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  const today = new Date();

  // Clear all errors first
  clearError(dayInput, 'day-error');
  clearError(monthInput, 'month-error');
  clearError(yearInput, 'year-error');

  let hasError = false;

  // Validate empty
  if (!day || day < 1 || day > 31) {
    showError(dayInput, 'day-error', 'Must be a valid day');
    hasError = true;
  }

  if (!month || month < 1 || month > 12) {
    showError(monthInput, 'month-error', 'Must be a valid month');
    hasError = true;
  }

  if (!year || year > today.getFullYear()) {
    showError(yearInput, 'year-error', 'Must be in the past');
    hasError = true;
  }

  // Check if date exists
  const date = new Date(year, month - 1, day);
  if (
    !hasError &&
    (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year)
  ) {
    showError(dayInput, 'day-error', 'Must be a valid date');
    showError(monthInput, 'month-error', '');
    showError(yearInput, 'year-error', '');
    hasError = true;
  }

  if (hasError) return;

  // Calculate difference
  const now = new Date();
  let years = now.getFullYear() - year;
  let months = now.getMonth() - (month - 1);
  let days = now.getDate() - day;

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  animateNumber('years', years);
  animateNumber('months', months);
  animateNumber('days', days);

  // Confetti after result is shown
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#3b82f6', '#10b981'],
    });
  }, 1000); // delay matches animation duration
});

function showError(inputEl, errorId, message) {
  inputEl.classList.add('border-red-400');
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('opacity-0');
  }
}

function clearError(inputEl, errorId) {
  inputEl.classList.remove('border-red-400');
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.classList.add('opacity-0');
  }
}

function animateNumber(id, finalValue) {
  const element = document.getElementById(id);
  let start = 0;
  const duration = 1000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    element.textContent = Math.floor(progress * finalValue);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}