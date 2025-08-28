// Luxury Booking Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Room prices mapping
    const roomPrices = {
        'deluxe': 25000,
        'premier': 32000,
        'club': 38000,
        'cityscape': 65000,
        'garden': 85000,
        'presidential': 250000
    };

    // Room names mapping
    const roomNames = {
        'deluxe': 'Deluxe Room',
        'premier': 'Premier Room',
        'club': 'Club Room',
        'cityscape': 'Four Seasons Cityscape Suite',
        'garden': 'Garden Suite',
        'presidential': 'Presidential Suite'
    };

    // Form elements
    const form = document.getElementById('bookingForm');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const roomTypeInputs = document.querySelectorAll('input[name="roomType"]');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Summary elements
    const summaryRoom = document.getElementById('summaryRoom');
    const summaryCheckIn = document.getElementById('summaryCheckIn');
    const summaryCheckOut = document.getElementById('summaryCheckOut');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryTotal = document.getElementById('summaryTotal');

    // Set minimum date for check-in (today)
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    // Event listeners
    checkInInput.addEventListener('change', updateSummary);
    checkOutInput.addEventListener('change', updateSummary);
    roomTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateRoomSelection();
            updateSummary();
        });
    });

    // Room option click handlers
    const roomOptions = document.querySelectorAll('.room-option');
    roomOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            updateRoomSelection();
            updateSummary();
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmission);

    // Update room selection styling
    function updateRoomSelection() {
        roomOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedRoom = document.querySelector('input[name="roomType"]:checked');
        if (selectedRoom) {
            const selectedOption = selectedRoom.closest('.room-option');
            selectedOption.classList.add('selected');
        }
    }

    // Update booking summary
    function updateSummary() {
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const selectedRoom = document.querySelector('input[name="roomType"]:checked');

        // Update check-in date
        if (checkIn) {
            summaryCheckIn.textContent = formatDate(checkIn);
            // Set minimum check-out date to check-in date
            checkOutInput.min = checkIn;
        } else {
            summaryCheckIn.textContent = 'Not selected';
        }

        // Update check-out date
        if (checkOut) {
            summaryCheckOut.textContent = formatDate(checkOut);
        } else {
            summaryCheckOut.textContent = 'Not selected';
        }

        // Update room type
        if (selectedRoom) {
            const roomType = selectedRoom.value;
            summaryRoom.textContent = roomNames[roomType];
        } else {
            summaryRoom.textContent = 'Not selected';
        }

        // Calculate duration and total
        if (checkIn && checkOut && selectedRoom) {
            const duration = calculateDuration(checkIn, checkOut);
            const roomType = selectedRoom.value;
            const pricePerNight = roomPrices[roomType];
            const total = duration * pricePerNight;

            summaryDuration.textContent = `${duration} night${duration > 1 ? 's' : ''}`;
            summaryTotal.textContent = `₹${total.toLocaleString()}`;
        } else {
            summaryDuration.textContent = '0 nights';
            summaryTotal.textContent = '₹0';
        }
    }

    // Calculate duration between two dates
    function calculateDuration(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Handle form submission
    function handleFormSubmission(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        loadingSpinner.style.display = 'inline-block';

        // Simulate booking process
        setTimeout(() => {
            showBookingConfirmation();
        }, 2000);
    }

    // Form validation
    function validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const selectedRoom = document.querySelector('input[name="roomType"]:checked');

        // Clear previous error messages
        clearErrors();

        let isValid = true;

        // Validate required fields
        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        }

        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (!checkIn) {
            showError('checkIn', 'Check-in date is required');
            isValid = false;
        }

        if (!checkOut) {
            showError('checkOut', 'Check-out date is required');
            isValid = false;
        } else if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
            showError('checkOut', 'Check-out date must be after check-in date');
            isValid = false;
        }

        if (!selectedRoom) {
            showError('roomType', 'Please select a room type');
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#e74c3c';
    }

    // Clear all error messages
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Show booking confirmation
    function showBookingConfirmation() {
        const formData = new FormData(form);
        const bookingData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            adults: formData.get('adults'),
            children: formData.get('children'),
            roomType: formData.get('roomType'),
            specialRequests: formData.get('specialRequests')
        };

        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                    <h3>Booking Confirmed!</h3>
                    <p>Thank you for choosing Four Seasons Hotel Bengaluru</p>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                        <h4>Booking Details:</h4>
                        <p><strong>Guest:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
                        <p><strong>Room:</strong> ${roomNames[bookingData.roomType]}</p>
                        <p><strong>Check-in:</strong> ${formatDate(bookingData.checkIn)}</p>
                        <p><strong>Check-out:</strong> ${formatDate(bookingData.checkOut)}</p>
                        <p><strong>Duration:</strong> ${calculateDuration(bookingData.checkIn, bookingData.checkOut)} nights</p>
                        <p><strong>Total:</strong> ₹${(calculateDuration(bookingData.checkIn, bookingData.checkOut) * roomPrices[bookingData.roomType]).toLocaleString()}</p>
                    </div>
                    
                    <p style="color: #666; font-size: 0.9rem;">
                        A confirmation email has been sent to ${bookingData.email}
                    </p>
                </div>
                
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="window.location.href='index.html'">Return to Hotel</button>
                    <button class="modal-btn secondary" onclick="closeConfirmationModal()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        // Reset form
        form.reset();
        updateSummary();
        updateRoomSelection();

        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking';
        loadingSpinner.style.display = 'none';
    }

    // Close confirmation modal
    window.closeConfirmationModal = function() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };

    // Add fadeIn animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }
        
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        .modal h3 {
            color: #1a1a1a;
            margin-bottom: 20px;
            font-family: 'Playfair Display', serif;
        }
        
        .modal p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        
        .modal-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-btn.primary {
            background: linear-gradient(135deg, #c4a661, #b8945a);
            color: white;
        }
        
        .modal-btn.secondary {
            background: #f8f8f8;
            color: #666;
        }
        
        .modal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    // Initialize summary
    updateSummary();
});
