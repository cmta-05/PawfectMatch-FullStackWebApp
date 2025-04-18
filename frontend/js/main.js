// Sample pet data (in a real application, this would come from a backend)
const pets = [
    {
        id: 1,
        name: "Max",
        type: "Dog",
        breed: "Golden Retriever",
        age: "2 years",
        location: "New York, NY",
        description: "Max is a friendly and energetic Golden Retriever who loves playing fetch and going for long walks. He's great with kids and other pets.",
        images: [
            "images/pet1.jpg",
            "images/pet1-2.jpg",
            "images/pet1-3.jpg"
        ]
    },
    {
        id: 2,
        name: "Luna",
        type: "Dog",
        breed: "Labrador Retriever",
        age: "1 year",
        location: "Los Angeles, CA",
        description: "Luna is a sweet and playful Labrador who enjoys cuddling and playing with toys. She's house trained and up to date on all vaccinations.",
        images: [
            "images/pet2.jpg",
            "images/pet2-2.jpg",
            "images/pet2-3.jpg"
        ]
    }
];

// Authentication state
let isLoggedIn = false;

// Update UI based on authentication status
function updateAuthUI(isLoggedIn) {
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const logoutBtn = document.getElementById('logoutBtn');
    const addPetBtn = document.getElementById('showAddPetForm');
    const myPetsLink = document.querySelector('a[href="my-pets.html"]');
    const userProfileContainer = document.getElementById('userProfileContainer');

    if (isLoggedIn) {
        loginLinks.forEach(link => link.style.display = 'none');
        if (userProfileContainer) {
            const userId = localStorage.getItem('userId') || '';
            const userName = userId.split('@')[0] || 'User';
            
            // Get unread match requests count
            const matchRequests = JSON.parse(localStorage.getItem('matchRequests') || '[]');
            const unreadCount = matchRequests.filter(req => !req.read).length;
            const notificationBadge = unreadCount > 0 ? `<span class="badge rounded-pill bg-danger ms-2">${unreadCount}</span>` : '';
            
            userProfileContainer.innerHTML = `
                <div class="dropdown">
                    <a href="#" class="nav-link dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FFB031&color=012312&size=32" 
                            alt="Profile" 
                            class="rounded-circle"
                            style="width: 32px; height: 32px;">
                        <span class="d-none d-md-inline" style="color: #FFB031;">${userName}</span>
                        ${unreadCount > 0 ? `<span class="badge rounded-pill bg-danger">${unreadCount}</span>` : ''}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="my-pets.html"><i class="fas fa-paw me-2"></i>My Pets</a></li>
                        <li><a class="dropdown-item" href="#" onclick="showMatchRequests()">
                            <i class="fas fa-heart me-2"></i>Match Requests${notificationBadge}
                        </a></li>
                        <li><a class="dropdown-item" href="#" onclick="showFavorites()"><i class="fas fa-star me-2"></i>My Favorites</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            `;
            userProfileContainer.style.display = 'block';
        }
        if (addPetBtn) addPetBtn.style.display = 'block';
        if (myPetsLink) myPetsLink.style.display = 'block';
    } else {
        loginLinks.forEach(link => link.style.display = 'block');
        if (userProfileContainer) userProfileContainer.style.display = 'none';
        if (addPetBtn) addPetBtn.style.display = 'none';
        if (myPetsLink) myPetsLink.style.display = 'none';
    }
}

// Handle logout
function handleLogout() {
    // Clear all authentication-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('matchRequests');
    isLoggedIn = false;
    
    // Update UI
    updateAuthUI(false);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Verify authentication state
    if (isLoggedIn && !localStorage.getItem('userId')) {
        // Invalid state - clear authentication
        handleLogout();
        return;
    }
    
    updateAuthUI(isLoggedIn);

    // Get current page
    const currentPage = window.location.pathname.split('/').pop();

    // Initialize features based on current page
    if (currentPage === 'browse.html') {
        initializePetModal();
        initializeSearchAndFilter();
    }

    // Add authentication check for protected pages
    const protectedPages = ['my-pets.html'];
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'login.html?redirect=' + currentPage;
        return;
    }
});

// Handle login form submission
const loginForm = document.querySelector('#loginModal form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            // Set authentication state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', email);
            isLoggedIn = true;
            
            // Initialize empty match requests if not exists
            if (!localStorage.getItem('matchRequests')) {
                localStorage.setItem('matchRequests', '[]');
            }
            
            updateAuthUI(true);
            
            const modal = document.getElementById('loginModal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
            
            loginForm.reset();

            // Check for redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            if (redirect) {
                window.location.href = redirect;
            } else if (window.location.pathname.includes('login.html')) {
                window.location.href = 'my-pets.html';
            }
        }
    });
}

// Initialize pet modal functionality
function initializePetModal() {
    const petImages = document.querySelectorAll('.pet-image');
    if (!petImages.length) return;

    petImages.forEach(img => {
        img.addEventListener('click', function() {
            const petId = parseInt(this.dataset.petId);
            const pet = pets.find(p => p.id === petId);
            if (pet) {
                updatePetModal(pet);
            }
        });
    });

    const thumbnails = document.querySelectorAll('.pet-thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImage = document.querySelector('.main-pet-image');
            if (mainImage) {
                mainImage.src = this.src;
            }
        });
    });
}

// Initialize search and filter functionality
function initializeSearchAndFilter() {
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const petCards = document.querySelectorAll('.card');
            
            petCards.forEach(card => {
                const petName = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const petBreed = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                
                if (petName.includes(searchTerm) || petBreed.includes(searchTerm)) {
                    card.closest('.col').style.display = '';
                } else {
                    card.closest('.col').style.display = 'none';
                }
            });
        });
    }

    const breedFilter = document.querySelector('select:first-of-type');
    if (breedFilter) {
        breedFilter.addEventListener('change', function() {
            const selectedBreed = this.value.toLowerCase();
            const petCards = document.querySelectorAll('.card');
            
            petCards.forEach(card => {
                const petBreed = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                
                if (selectedBreed === 'filter by breed' || petBreed.includes(selectedBreed)) {
                    card.closest('.col').style.display = '';
                } else {
                    card.closest('.col').style.display = 'none';
                }
            });
        });
    }
}

// Update the pet modal with pet data
function updatePetModal(pet) {
    const mainImage = document.querySelector('.main-pet-image');
    if (mainImage) mainImage.src = pet.images[0];

    const thumbnails = document.querySelectorAll('.pet-thumbnail');
    pet.images.forEach((img, index) => {
        if (thumbnails[index]) {
            thumbnails[index].src = img;
        }
    });

    const elements = {
        name: document.querySelector('.pet-name'),
        type: document.querySelector('.pet-type'),
        age: document.querySelector('.pet-age'),
        location: document.querySelector('.pet-location'),
        description: document.querySelector('.pet-description')
    };

    if (elements.name) elements.name.textContent = pet.name;
    if (elements.type) elements.type.innerHTML = `<i class="fas fa-dog me-2"></i>${pet.breed}`;
    if (elements.age) elements.age.innerHTML = `<i class="fas fa-birthday-cake me-2"></i>${pet.age}`;
    if (elements.location) elements.location.innerHTML = `<i class="fas fa-map-marker-alt me-2"></i>${pet.location}`;
    if (elements.description) elements.description.textContent = pet.description;

    const actionButtons = document.querySelector('.modal-footer');
    if (!actionButtons) return;

    if (!isLoggedIn) {
        actionButtons.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-warning mb-3" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    You need to be logged in to interact with pets!
                </div>
                <div class="d-flex justify-content-center gap-3">
                    <a href="login.html" class="btn" style="background-color: #012312; color: white;">
                        <i class="fas fa-sign-in-alt me-2"></i>Login
                    </a>
                    <a href="login.html#register" class="btn" style="background-color: #FFB031; color: #012312;">
                        <i class="fas fa-user-plus me-2"></i>Register
                    </a>
                </div>
            </div>
        `;
    } else {
        actionButtons.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn" style="background-color: #012312; color: white;" onclick="sendMatchRequest(${pet.id})">
                <i class="fas fa-heart me-2"></i>Send Match Request
            </button>
            <button type="button" class="btn" style="background-color: #FFB031; color: #012312;" onclick="favoritePet(${pet.id})">
                <i class="fas fa-star me-2"></i>Favorite
            </button>
        `;
    }
}

// Handle match request
function sendMatchRequest(petId) {
    if (!isLoggedIn) {
        return;
    }
    alert('Match request sent! The pet owner will contact you soon.');
}

// Handle favorite pet
function favoritePet(petId) {
    if (!isLoggedIn) {
        return;
    }
    // Get user's favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(petId)) {
        favorites.push(petId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Pet added to favorites!');
    } else {
        alert('This pet is already in your favorites!');
    }
}

// Handle sort functionality
const sortSelect = document.querySelector('select:last-of-type');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const petContainer = document.querySelector('.row.row-cols-1');
        const petCards = Array.from(petContainer.querySelectorAll('.col'));
        
        petCards.sort((a, b) => {
            const aName = a.querySelector('.card-title').textContent;
            const bName = b.querySelector('.card-title').textContent;
            const aAge = parseInt(a.querySelector('.card-text').textContent);
            const bAge = parseInt(b.querySelector('.card-text').textContent);
            
            switch(sortBy) {
                case 'Name':
                    return aName.localeCompare(bName);
                case 'Age':
                    return aAge - bAge;
                default:
                    return 0;
            }
        });
        
        petCards.forEach(card => petContainer.appendChild(card));
    });
}

// Function to show favorites modal
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const modalHtml = `
        <div class="modal fade" id="favoritesModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">My Favorite Pets</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${favorites.length === 0 ? `
                            <div class="text-center py-5">
                                <i class="fas fa-heart text-muted mb-3" style="font-size: 3rem;"></i>
                                <p class="lead">You haven't favorited any pets yet.</p>
                                <a href="browse.html" class="btn" style="background-color: #012312; color: white;">
                                    Browse Pets
                                </a>
                            </div>
                        ` : `
                            <div class="row">
                                ${favorites.map(pet => `
                                    <div class="col-md-6 mb-4">
                                        <div class="card h-100">
                                            <div style="position: relative; padding-top: 100%; overflow: hidden;">
                                                <img src="${pet.profileImage || pet.images?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(pet.name)}&background=012312&color=ffffff`}" 
                                                    class="card-img-top position-absolute top-0 start-0 w-100 h-100" 
                                                    alt="${pet.name}"
                                                    style="object-fit: cover;">
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">${pet.name}</h5>
                                                <p class="card-text">
                                                    <i class="fas fa-dog me-2"></i>${pet.breed}<br>
                                                    <i class="fas fa-birthday-cake me-2"></i>${pet.age}<br>
                                                    <i class="fas fa-map-marker-alt me-2"></i>${pet.location}
                                                </p>
                                            </div>
                                            <div class="card-footer">
                                                <button class="btn btn-sm" style="background-color: #012312; color: white;" 
                                                    onclick="window.location.href='browse.html?pet=${pet.id}'">
                                                    <i class="fas fa-eye me-2"></i>View Details
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="removeFromFavorites(${pet.id})">
                                                    <i class="fas fa-heart-broken me-2"></i>Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('favoritesModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    modal.show();
}

// Function to remove pet from favorites
function removeFromFavorites(petId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(pet => pet.id !== petId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites(); // Refresh the modal
}

// Function to add pet to favorites
function toggleFavorite(petId) {
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const pet = pets.find(p => p.id === petId);
    
    if (!pet) return;

    const isFavorite = favorites.some(fav => fav.id === petId);
    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== petId);
    } else {
        favorites.push(pet);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    const btn = document.querySelector(`button[onclick="toggleFavorite(${petId})"]`);
    if (btn) {
        btn.innerHTML = `<i class="fas fa-star me-2"></i>${isFavorite ? 'Favorite' : 'Unfavorite'}`;
        btn.classList.toggle('active');
    }
}

// Function to show match requests modal
function showMatchRequests() {
    // Create modal if it doesn't exist
    let matchModal = document.getElementById('matchRequestsModal');
    if (!matchModal) {
        matchModal = document.createElement('div');
        matchModal.id = 'matchRequestsModal';
        matchModal.className = 'modal fade';
        matchModal.setAttribute('tabindex', '-1');
        
        const matchRequests = JSON.parse(localStorage.getItem('matchRequests') || '[]');
        const userPets = JSON.parse(localStorage.getItem('userPets') || '[]');
        const pets = JSON.parse(localStorage.getItem('pets') || '[]');
        
        // Mark all requests as read
        matchRequests.forEach(req => req.read = true);
        localStorage.setItem('matchRequests', JSON.stringify(matchRequests));
        
        // Create modal content
        matchModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Match Requests</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${matchRequests.length === 0 ? '<p class="text-center">No match requests yet.</p>' : 
                            matchRequests.map(request => {
                                const userPet = userPets.find(p => p.id == request.userPetId);
                                const targetPet = pets.find(p => p.id == request.targetPetId);
                                return `
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <h6 class="card-title mb-0">
                                                    Match Request: ${userPet?.name || 'Your Pet'} ↔️ ${targetPet?.name || 'Target Pet'}
                                                </h6>
                                                <span class="badge ${request.status === 'pending' ? 'bg-warning' : 
                                                                    request.status === 'accepted' ? 'bg-success' : 'bg-danger'}">
                                                    ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                            ${request.message ? `<p class="card-text">"${request.message}"</p>` : ''}
                                            <small class="text-muted">
                                                Sent on ${new Date(request.timestamp).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(matchModal);
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(matchModal);
    modal.show();
    
    // Update UI to reflect read notifications
    updateAuthUI(true);
}

// Update submitMatchRequest function to handle notifications
function submitMatchRequest() {
    const userPetId = document.getElementById('userPetSelect').value;
    const message = document.getElementById('matchMessage').value;

    if (!userPetId) {
        alert('Please select one of your pets to send a match request.');
        return;
    }

    // Store match request in localStorage
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests') || '[]');
    matchRequests.push({
        id: Date.now(),
        userPetId: userPetId,
        targetPetId: selectedPetId,
        message: message,
        status: 'pending',
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('matchRequests', JSON.stringify(matchRequests));

    // Hide the form and show success message
    cancelMatchRequest();
    alert('Match request sent successfully!');
    
    // Update the UI to show new notification
    updateAuthUI(true);
} 