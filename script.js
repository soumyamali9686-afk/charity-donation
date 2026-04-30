// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.cause-card, .impact-card, .donate-wrapper');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));


// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));


// ===== CAUSE CARDS (visual only) =====
document.querySelectorAll('.cause-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.cause-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const cause = card.dataset.cause;
    // Sync to form
    document.querySelectorAll('.cause-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.val === cause);
    });
    document.getElementById('selectedCause').value = cause;
    document.getElementById('donate').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// ===== CAUSE BUTTONS IN FORM =====
document.querySelectorAll('.cause-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cause-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('selectedCause').value = btn.dataset.val;
  });
});


// ===== AMOUNT BUTTONS =====
const customAmountInput = document.getElementById('customAmount');
const selectedAmountInput = document.getElementById('selectedAmount');

document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.amt === 'custom') {
      customAmountInput.classList.remove('hidden');
      selectedAmountInput.value = '';
      customAmountInput.focus();
    } else {
      customAmountInput.classList.add('hidden');
      customAmountInput.value = '';
      selectedAmountInput.value = btn.dataset.amt;
    }
  });
});

customAmountInput.addEventListener('input', () => {
  selectedAmountInput.value = customAmountInput.value;
});


// ===== FORM VALIDATION =====
function getVal(id) {
  return document.getElementById(id).value.trim();
}

function setError(fieldId, errId, msg) {
  const el = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (msg) {
    el.classList.add('error');
    err.textContent = msg;
  } else {
    el.classList.remove('error');
    err.textContent = '';
  }
  return !!msg;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let hasError = false;

  if (!getVal('firstName')) {
    hasError = setError('firstName', 'firstNameErr', 'First name is required.') || hasError;
  } else {
    setError('firstName', 'firstNameErr', '');
  }

  if (!getVal('lastName')) {
    hasError = setError('lastName', 'lastNameErr', 'Last name is required.') || hasError;
  } else {
    setError('lastName', 'lastNameErr', '');
  }

  if (!getVal('email')) {
    hasError = setError('email', 'emailErr', 'Email is required.') || hasError;
  } else if (!validateEmail(getVal('email'))) {
    hasError = setError('email', 'emailErr', 'Enter a valid email address.') || hasError;
  } else {
    setError('email', 'emailErr', '');
  }

  if (!getVal('address')) {
    hasError = setError('address', 'addressErr', 'Address is required.') || hasError;
  } else {
    setError('address', 'addressErr', '');
  }

  if (!getVal('city')) {
    hasError = setError('city', 'cityErr', 'City is required.') || hasError;
  } else {
    setError('city', 'cityErr', '');
  }

  const amt = selectedAmountInput.value;
  const amountErr = document.getElementById('amountErr');
  if (!amt || isNaN(amt) || parseFloat(amt) <= 0) {
    amountErr.textContent = 'Please select or enter a valid donation amount.';
    hasError = true;
  } else {
    amountErr.textContent = '';
  }

  return !hasError;
}


// ===== FORM SUBMISSION =====
document.getElementById('donationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  // Simulate processing
  setTimeout(() => {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');

    const name = getVal('firstName');
    const amount = parseFloat(selectedAmountInput.value).toLocaleString('en-IN');
    const cause = document.getElementById('selectedCause').value;
    const anonymous = document.getElementById('anonymous').checked;

    const modalMsg = document.getElementById('modalMsg');
    if (anonymous) {
      modalMsg.textContent = `An anonymous donation of ₹${amount} has been made to the ${cause} cause. Your generosity will change lives!`;
    } else {
      modalMsg.textContent = `${name}, your donation of ₹${amount} to the ${cause} cause has been received. Your generosity will change lives!`;
    }

    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('donationForm').reset();

    // Reset UI state
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-amt="500"]').classList.add('active');
    selectedAmountInput.value = '500';
    customAmountInput.classList.add('hidden');

    document.querySelectorAll('.cause-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cause-btn[data-val="Education"]').classList.add('active');
    document.getElementById('selectedCause').value = 'Education';

  }, 2000);
});


// ===== CLOSE MODAL =====
function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});


// ===== LIVE INPUT VALIDATION =====
['firstName', 'lastName', 'email', 'address', 'city'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => {
    const errId = id + 'Err';
    if (!getVal(id)) {
      setError(id, errId, `${id === 'firstName' ? 'First name' : id === 'lastName' ? 'Last name' : id.charAt(0).toUpperCase() + id.slice(1)} is required.`);
    } else if (id === 'email' && !validateEmail(getVal(id))) {
      setError(id, errId, 'Enter a valid email address.');
    } else {
      setError(id, errId, '');
    }
  });
});


// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 80;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav a[href="#${sec.id}"]`);
    if (link) {
      link.style.color = (y >= top && y < bottom) ? 'var(--primary)' : '';
    }
  });
});
