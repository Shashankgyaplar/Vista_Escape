

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Room booking functionality
    const bookButtons = document.querySelectorAll('.book-btn:not(.disabled)');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roomCard = this.closest('.room-card');
            const roomName = roomCard.querySelector('h3').textContent;
            const roomPrice = roomCard.querySelector('.price').textContent;
            
            showBookingModal(roomName, roomPrice);
        });
    });

    // Offer buttons
    const offerButtons = document.querySelectorAll('.offer-btn');
    offerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const offerCard = this.closest('.offer-card');
            const offerTitle = offerCard.querySelector('h3').textContent;
            const offerDescription = offerCard.querySelector('p').textContent;
            
            showOfferModal(offerTitle, offerDescription);
        });
    });

    // Dining reservation
    const reserveBtn = document.querySelector('.reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', function() {
            showReservationModal();
        });
    }

    // CTA button functionality
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            showBookingModal('Luxury Accommodation', 'Starting from ₹25,000');
        });
    }

    // Check rates button
    const checkRatesBtn = document.querySelector('.check-rates-btn');
    if (checkRatesBtn) {
        checkRatesBtn.addEventListener('click', function() {
            showRatesModal();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.room-card, .offer-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Room status indicators with pulse animation
    const availableRooms = document.querySelectorAll('.room-status.available');
    availableRooms.forEach(room => {
        room.style.animation = 'pulse 2s infinite';
    });

    // Add pulse animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
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
        
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
    `;
    document.head.appendChild(style);
});

// Modal functions
function showBookingModal(roomName, price) {
    const modal = createModal();
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h3>Book Your Stay</h3>
            <p>Experience luxury at Four Seasons Hotel Bengaluru</p>
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <strong>${roomName}</strong><br>
                <span style="color: #c4a661; font-size: 1.2rem;">${price} per night</span>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="proceedToBooking()">Proceed to Booking</button>
                <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
}

function showOfferModal(offerTitle, description) {
    const modal = createModal();
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h3>${offerTitle}</h3>
            <p>${description}</p>
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <strong>Special Benefits:</strong><br>
                • Exclusive rates and packages<br>
                • Priority booking<br>
                • Complimentary services<br>
                • Flexible cancellation
            </div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="applyOffer()">Apply Offer</button>
                <button class="modal-btn secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
}

function showReservationModal() {
    const modal = createModal();
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h3>Far & East Restaurant</h3>
            <p>Make a reservation at our award-winning Asian restaurant</p>
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <strong>Restaurant Details:</strong><br>
                📍 21st Floor<br>
                🍽️ Asian Cuisine<br>
                ⏰ Open Daily<br>
                📞 +91 (080) 4522-2222
            </div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="makeReservation()">Make Reservation</button>
                <button class="modal-btn secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
}

function showRatesModal() {
    const modal = createModal();
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h3>Check Rates & Availability</h3>
            <p>Discover our current rates and special offers</p>
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <strong>Room Rates (per night):</strong><br>
                🛏️ Deluxe Room: ₹25,000<br>
                🌆 Premier Room: ₹32,000<br>
                🏊 Club Room: ₹38,000<br>
                🏢 Cityscape Suite: ₹65,000<br>
                🌿 Garden Suite: ₹85,000<br>
                👑 Presidential Suite: ₹2,50,000
            </div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="checkAvailability()">Check Availability</button>
                <button class="modal-btn secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
}

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Action functions
function proceedToBooking() {
    showNotification('Redirecting to booking system...', 'success');
    setTimeout(() => {
        closeModal();
        // Here you would redirect to actual booking system
        window.location.href = 'luxury_booking_form.html';
    }, 1500);
}

function applyOffer() {
    showNotification('Offer applied successfully!', 'success');
    setTimeout(closeModal, 1500);
}

function makeReservation() {
    showNotification('Reservation request sent!', 'success');
    setTimeout(closeModal, 1500);
}

function checkAvailability() {
    showNotification('Checking availability...', 'info');
    setTimeout(closeModal, 1500);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    } else if (type === 'info') {
        notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add luxury hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.book-btn, .offer-btn, .reserve-btn, .cta-btn, .check-rates-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});
