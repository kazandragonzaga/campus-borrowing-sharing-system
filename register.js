const form = document.getElementById('register-form');
const message = document.getElementById('register-message');

function showMessage(text, kind = 'error') {
  message.textContent = text;
  message.className = 'sm:col-span-2 rounded-xl p-3 text-sm';
  message.classList.add(kind === 'success' ? 'bg-emerald-50' : 'bg-rose-50', kind === 'success' ? 'text-emerald-800' : 'text-rose-800');
  message.classList.remove('hidden');
}

function setInvalid(input, invalid) {
  if (invalid) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

document.querySelectorAll('[data-toggle-password]').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.togglePassword);
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    button.innerHTML = reveal ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
  });
});

form.querySelectorAll('input, select').forEach(input => {
  input.addEventListener('input', () => setInvalid(input, false));
  input.addEventListener('change', () => setInvalid(input, false));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  message.classList.add('hidden');
  const fullName = document.getElementById('full-name');
  const studentId = document.getElementById('student-id');
  const email = document.getElementById('school-email');
  const course = document.getElementById('course');
  const year = document.getElementById('year-level');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');
  const terms = document.getElementById('terms');
  const fields = [fullName, studentId, email, course, year, password, confirm, terms];
  fields.forEach(field => setInvalid(field, !field.checkValidity()));

  if (!fullName.value.trim() || !studentId.value.trim() || !course.value || !year.value || !terms.checked) {
    showMessage('Please complete all required fields and accept the confirmation checkbox.');
    return;
  }
  if (!email.checkValidity() || !email.value.trim().toLowerCase().endsWith('@rtu.edu.ph')) {
    setInvalid(email, true);
    showMessage('Please enter a valid official RTU email ending in @rtu.edu.ph.');
    email.focus();
    return;
  }
  if (password.value.length < 12) {
    setInvalid(password, true);
    showMessage('For this prototype, use a password with at least 12 characters.');
    password.focus();
    return;
  }
  if (password.value !== confirm.value) {
    setInvalid(confirm, true);
    showMessage('The passwords do not match. Please check them and try again.');
    confirm.focus();
    return;
  }

  // Do not store account credentials in JavaScript or localStorage. This is only front-end validation.
  showMessage('The form looks valid, but no account has been created yet. Next, connect this form to a PHP endpoint that checks the RTU email, validates the student record, hashes the password, and sends a verification email.', 'success');
});
