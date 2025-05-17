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
            const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
            // Notification for received match requests
            const pendingReceived = parseInt(localStorage.getItem('pendingReceivedMatchRequests') || '0', 10);
            // Notification for sent match request status updates
            const pendingSentStatus = parseInt(localStorage.getItem('pendingSentStatusNotif') || '0', 10);
            const notifDot = (pendingReceived > 0 || pendingSentStatus > 0) ? `<span style=\"display:inline-block;width:10px;height:10px;background:#dc3545;border-radius:50%;margin-left:6px;vertical-align:middle;\"></span>` : '';
            userProfileContainer.innerHTML = `
                <div class="dropdown">
                    <a href="#" class="nav-link dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FFB031&color=012312&size=32" 
                            alt="Profile" 
                            class="rounded-circle"
                            style="width: 32px; height: 32px;">
                        <span class="d-none d-md-inline" style="color: #FFB031;">${userName}</span>
                        ${notifDot}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="my-pets.html"><i class="fas fa-paw me-2"></i>My Pets</a></li>
                        <li><a class="dropdown-item" href="#" onclick="showMatchRequests()">
                            <i class="fas fa-heart me-2"></i>Match Requests${notifDot}
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
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
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
        loadAndRenderBrowsePets();
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
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            // Set authentication state
            localStorage.setItem('isLoggedIn', 'true');
            // Fetch user by email to get MongoDB _id
            try {
                const response = await fetch(`/users/email/${encodeURIComponent(email)}`);
                if (!response.ok) throw new Error('User not found');
                const user = await response.json();
                localStorage.setItem('userId', user._id);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', user.email);
            } catch (err) {
                alert('Login failed: ' + err.message);
                return;
            }
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
    // Wait for the DOM and pet cards to be rendered
    // Delay to ensure cards are rendered
}

// Initialize search and filter functionality
function initializeSearchAndFilter() {
    const searchInput = document.querySelector('.modern-search-input');
    const breedFilter = document.querySelectorAll('.modern-select')[0];
    const genderFilter = document.querySelectorAll('.modern-select')[1];
    const sortFilter = document.querySelectorAll('.modern-select')[2];
    if (breedFilter) {
        breedFilter.addEventListener('change', function() {
            applyBrowseFilters();
        });
    }
    if (genderFilter) {
        genderFilter.addEventListener('change', function() {
            applyBrowseFilters();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyBrowseFilters();
        });
    }

    function applyBrowseFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedBreed = breedFilter ? breedFilter.value.toLowerCase() : '';
        const selectedGender = genderFilter ? genderFilter.value.toLowerCase() : '';
        const petCards = document.querySelectorAll('.card');
        petCards.forEach(card => {
            const petName = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const petBreed = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const petGender = card.querySelector('.card-text')?.innerText.toLowerCase().includes('gender: female') ? 'female' : (card.querySelector('.card-text')?.innerText.toLowerCase().includes('gender: male') ? 'male' : '');
            let show = true;
            if (searchTerm && !(petName.includes(searchTerm) || petBreed.includes(searchTerm))) show = false;
            if (selectedBreed && selectedBreed !== 'filter by breed' && !petBreed.includes(selectedBreed)) show = false;
            if (selectedGender && selectedGender !== 'filter by gender' && petGender !== selectedGender) show = false;
            card.closest('.col').style.display = show ? '' : 'none';
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortBy = this.value;
            const petContainer = document.querySelector('.pet-cards-grid');
            const petCards = Array.from(petContainer.querySelectorAll('.col'));
            petCards.sort((a, b) => {
                const aName = a.querySelector('.card-title').textContent;
                const bName = b.querySelector('.card-title').textContent;
                // Extract age values properly
                const aAgeText = a.querySelector('.card-text').textContent;
                const bAgeText = b.querySelector('.card-text').textContent;
                // Extract numeric age values using regex
                const aAgeMatch = aAgeText.match(/(\d+(?:\.\d+)?)\s*years?/);
                const bAgeMatch = bAgeText.match(/(\d+(?:\.\d+)?)\s*years?/);
                const aAge = aAgeMatch ? parseFloat(aAgeMatch[1]) : 0;
                const bAge = bAgeMatch ? parseFloat(bAgeMatch[1]) : 0;
                // Extract location values
                const aLocation = a.querySelector('.card-text').innerText.toLowerCase().match(/location:\s*([^\n]+)/);
                const bLocation = b.querySelector('.card-text').innerText.toLowerCase().match(/location:\s*([^\n]+)/);
                const aLoc = aLocation ? aLocation[1].trim() : '';
                const bLoc = bLocation ? bLocation[1].trim() : '';
                switch(sortBy) {
                    case 'Name':
                        return aName.localeCompare(bName);
                    case 'Age':
                        return aAge - bAge;
                    case 'Location':
                        return aLoc.localeCompare(bLoc);
                    default:
                        return 0;
                }
            });
            petCards.forEach(card => petContainer.appendChild(card));
        });
    }
}

// Update the pet modal with pet data
function updatePetModal(pet) {
    window.currentPet = pet;
    selectedPetId = String(pet._id || pet.id);
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
        gender: document.querySelector('.pet-gender'),
        location: document.querySelector('.pet-location'),
        description: document.querySelector('.pet-description')
    };

    if (elements.name) elements.name.textContent = pet.name;
    if (elements.type) elements.type.innerHTML = `<i class="fas fa-dog me-2"></i>${pet.breed}`;
    if (elements.age) elements.age.innerHTML = `<i class="fas fa-birthday-cake me-2"></i>${pet.age}`;
    if (elements.gender) {
        const genderSpan = elements.gender.querySelector('span');
         if (genderSpan) genderSpan.textContent = pet.gender;
    }
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
            <button type="button" class="btn" style="background-color: #012312; color: white;" onclick="sendMatchRequest('${pet._id}')">
                <i class="fas fa-heart me-2"></i>Send Match Request
            </button>
            <button type="button" class="btn favorite-btn" data-pet-id="${pet._id}" style="background-color: #FFB031; color: #012312;">
                <i class="fas fa-star me-2"></i>Add to Favorites
            </button>
        `;
    }

    // Update favorite button state and handler
    const favoriteBtn = actionButtons.querySelector('.favorite-btn');
    if (favoriteBtn) {
        const petId = favoriteBtn.getAttribute('data-pet-id');
        favoriteBtn.onclick = function() { 
            const id = this.getAttribute('data-pet-id');
            window.toggleFavorite(id); 
        };
    }
}

// Handle match request
function sendMatchRequest(petId) {
    if (!isLoggedIn) {
        return;
    }
    // Set the selected pet globally
    window.selectedPetId = petId;
    // Show the match request form (if exists)
    const form = document.getElementById('matchRequestForm');
    if (form) {
        form.style.display = 'block';
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
        // Optionally focus the first input
        const select = document.getElementById('userPetSelect');
        if (select) select.focus();
    } else {
        alert('Match request form not found on this page.');
    }
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
            
            // Extract age values properly
            const aAgeText = a.querySelector('.card-text').textContent;
            const bAgeText = b.querySelector('.card-text').textContent;
            
            // Extract numeric age values using regex
            const aAgeMatch = aAgeText.match(/(\d+(?:\.\d+)?)\s*years?/);
            const bAgeMatch = bAgeText.match(/(\d+(?:\.\d+)?)\s*years?/);
            
            const aAge = aAgeMatch ? parseFloat(aAgeMatch[1]) : 0;
            const bAge = bAgeMatch ? parseFloat(bAgeMatch[1]) : 0;
            
            // Extract location values
            const aLocation = a.querySelector('.card-text:nth-child(3)')?.textContent.replace(/.*marker-alt me-2">/, '').trim() || '';
            const bLocation = b.querySelector('.card-text:nth-child(3)')?.textContent.replace(/.*marker-alt me-2">/, '').trim() || '';
            
            switch(sortBy) {
                case 'Name':
                    return aName.localeCompare(bName);
                case 'Age':
                    return aAge - bAge;
                case 'Location':
                    return aLocation.localeCompare(bLocation);
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
                                            <div class="card-footer d-flex justify-content-between">
                                                <button class="btn btn-success view-details-btn" data-pet-id="${pet.id}" style="background-color: #012312; color: white;">
                                                    <i class="fas fa-eye me-2"></i>View Details
                                                </button>
                                                <button class="btn btn-danger remove-favorite-btn" data-pet-id="${pet.id}">
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

    // Add event listeners for remove and view details buttons
    setTimeout(() => {
        document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-pet-id');
                removeFromFavorites(petId, true); // true = show toast
            });
        });
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-pet-id');
                // Find the pet in favorites or global pets
                let pet = null;
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                pet = favorites.find(p => String(p._id || p.id) === String(petId));
                if (!pet && typeof pets !== 'undefined') {
                    pet = pets.find(p => String(p._id || p.id) === String(petId));
                }
                if (pet) {
                    // Hide favorites modal
                    const favModal = bootstrap.Modal.getInstance(document.getElementById('favoritesModal'));
                    if (favModal) favModal.hide();
                    // Show pet modal
                    if (typeof updatePetModal === 'function') {
                        updatePetModal({
                            id: pet._id || pet.id,
                            name: pet.name,
                            breed: pet.breed,
                            age: pet.age,
                            location: pet.location,
                            description: pet.description,
                            images: [pet.profileImage || (pet.images && pet.images[0]) || 'images/default-pet.jpg']
                        });
                        const petModal = new bootstrap.Modal(document.getElementById('petModal'));
                        petModal.show();
                    }
                }
            });
        });
    }, 300);
}

function showFavoriteToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1056';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header" style="background-color: #012312; color: white;">
                <i class="fas fa-check-circle me-2"></i>
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
}

// --- FAVORITES BACKEND SYNC ---
async function fetchFavoritesFromBackend() {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];
    try {
        const res = await fetch(`/api/favorites/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        // data is an array of { _id, userId, petId: { ...pet }, createdAt }
        // Map to localStorage/UI format
        const favorites = data.map(fav => {
            const pet = fav.petId;
            return {
                id: pet._id || pet.id,
                name: pet.name,
                breed: pet.breed,
                age: pet.age,
                location: pet.location,
                description: pet.description,
                profileImage: pet.profileImage || (pet.images && pet.images[0]) || 'images/default-pet.jpg',
                images: pet.images || []
            };
        });
    localStorage.setItem('favorites', JSON.stringify(favorites));
        return favorites;
    } catch (e) {
        return [];
    }
}

// On login/page load, always fetch from backend
if (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId')) {
    fetchFavoritesFromBackend();
}

async function toggleFavorite(petId) {
    console.log('toggleFavorite called with petId:', petId, 'window.pets:', window.pets);
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    const userId = localStorage.getItem('userId');
    let favorites = await fetchFavoritesFromBackend();
    // Always use string for comparison
    const pet = window.pets.find(p => String(p._id) === String(petId));
    if (!pet) {
        console.error('Pet not found in pets array for petId:', petId, 'window.pets:', window.pets);
        return;
    }
    const petObjectId = pet._id || pet.id;
    const isFavorite = favorites.some(fav => String(fav.id || fav._id) === String(petObjectId));
    if (isFavorite) {
        // Remove from backend (use query params)
        try {
            await fetch(`/api/favorites/remove?userId=${encodeURIComponent(userId)}&petId=${encodeURIComponent(petObjectId)}`, {
                method: 'DELETE'
            });
        } catch (e) {}
        showFavoriteToast('Removed from favorites!');
    } else {
        // Add to backend
        try {
            console.log('Sending POST /api/favorites/add', { userId, petId: petObjectId });
            const res = await fetch('/api/favorites/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, petId: petObjectId })
            });
            const data = await res.json();
            console.log('Add favorite response:', res.status, data);
            if (!res.ok) alert(data.message || 'Failed to add favorite');
        } catch (e) {
            console.error('Add favorite error:', e);
        }
        // Show animated success modal
        const favModalEl = document.getElementById('favoriteSuccessModal');
        const favModal = new bootstrap.Modal(favModalEl);
        favModal.show();
        setTimeout(() => {
          const viewBtn = document.getElementById('viewFavoritesBtn');
          if (viewBtn) {
            viewBtn.onclick = function() {
              favModal.hide();
              setTimeout(() => { if (typeof showFavorites === 'function') showFavorites(); }, 400);
            };
          }
        }, 200);
        setTimeout(() => {
          if (favModalEl.classList.contains('show')) {
            favModal.hide();
          }
        }, 1200);
    }
    // Always re-fetch from backend after add/remove
    favorites = await fetchFavoritesFromBackend();
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const btn = document.querySelector('.favorite-btn');
    const icon = btn.querySelector('i');
    const nowFavorite = favorites.some(fav => String(fav.id || fav._id) === String(petObjectId));
    if (!nowFavorite) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.backgroundColor = '#FFB031';
        btn.style.color = '#012312';
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.backgroundColor = '#012312';
        btn.style.color = 'white';
    }
}

async function removeFromFavorites(petId, showToast) {
    const userId = localStorage.getItem('userId');
    // Always use _id for pet
    const favorites = await fetchFavoritesFromBackend();
    const pet = favorites.find(p => (p._id || p.id) === petId || (p.id || p._id) === petId);
    const petObjectId = pet ? (pet._id || pet.id) : petId;
    // Remove from backend (use query params)
    try {
        await fetch(`/api/favorites/remove?userId=${encodeURIComponent(userId)}&petId=${encodeURIComponent(petObjectId)}`, {
            method: 'DELETE'
        });
    } catch (e) {}
    // Always re-fetch from backend after remove
    const newFavorites = await fetchFavoritesFromBackend();
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    showFavorites(); // Refresh the modal
    if (showToast) showFavoriteToast('Removed from favorites!');
}

// Patch showFavorites to always use backend-fetched favorites and _id
async function showFavorites() {
    const favorites = await fetchFavoritesFromBackend();
    localStorage.setItem('favorites', JSON.stringify(favorites));
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
                                            <div class="card-footer d-flex justify-content-between">
                                                <button class="btn btn-success view-details-btn" data-pet-id="${pet._id || pet.id}" style="background-color: #012312; color: white;">
                                                    <i class="fas fa-eye me-2"></i>View Details
                                                </button>
                                                <button class="btn btn-danger remove-favorite-btn" data-pet-id="${pet._id || pet.id}">
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
        const bsModal = bootstrap.Modal.getInstance(existingModal);
        if (bsModal) bsModal.hide();
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    modal.show();

    // Add event listeners for remove and view details buttons
    setTimeout(() => {
        document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-pet-id');
                removeFromFavorites(petId, true); // true = show toast
            });
        });
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-pet-id');
                // Find the pet in favorites or global pets
                let pet = null;
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                pet = favorites.find(p => String(p._id || p.id) === String(petId));
                if (!pet && typeof pets !== 'undefined') {
                    pet = pets.find(p => String(p._id || p.id) === String(petId));
                }
                if (pet) {
                    // Hide favorites modal
                    const favModal = bootstrap.Modal.getInstance(document.getElementById('favoritesModal'));
                    if (favModal) favModal.hide();
                    // Show pet modal
                    if (typeof updatePetModal === 'function') {
                        updatePetModal({
                            id: pet._id || pet.id,
                            name: pet.name,
                            breed: pet.breed,
                            age: pet.age,
                            location: pet.location,
                            description: pet.description,
                            images: [pet.profileImage || (pet.images && pet.images[0]) || 'images/default-pet.jpg']
                        });
                        const petModal = new bootstrap.Modal(document.getElementById('petModal'));
                        petModal.show();
                    }
                }
            });
        });
    }, 300);
}

// --- MATCH REQUEST BACKEND INTEGRATION ---
async function submitMatchRequest() {
    const userPetId = document.getElementById('userPetSelect').value;
    const message = document.getElementById('matchMessage').value;
    const submitBtn = document.getElementById('submitMatchBtn');

    if (!userPetId) {
        alert('Please select one of your pets to send a match request.');
        return;
    }

    // Find sender (current user) and senderPet
    const userId = localStorage.getItem('userId'); // This should be MongoDB _id
    const userPets = JSON.parse(localStorage.getItem('userPets') || '[]');
    const senderPet = userPets.find(p => p._id === userPetId || p.id === userPetId);
    if (!senderPet) {
        alert('Could not find your selected pet.');
        return;
    }

    // Find receiverPet and receiver (target pet and its owner)
    const allPets = JSON.parse(localStorage.getItem('pets') || '[]');
    const receiverPet = allPets.find(p => p._id === window.selectedPetId || p.id === window.selectedPetId);
    if (!receiverPet) {
        alert('Could not find the target pet.');
        return;
    }
    const receiverId = receiverPet.userId;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Sending...';

    // Prepare payload
    const payload = {
        sender: userId,
        senderPet: senderPet._id || senderPet.id,
        receiver: receiverId,
        receiverPet: receiverPet._id || receiverPet.id,
        message
    };
    console.log('Submitting match request payload:', payload);

    // Send to backend
    try {
        const response = await fetch('/api/match-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Backend response:', data);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send match request');
        }
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Send Request';
        cancelMatchRequest();
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '5';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header" style="background-color: #012312; color: white;">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong class="me-auto">Success</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Match request sent successfully!
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3000);
        updateAuthUI(true);
        await updateMatchRequestNotification();
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Send Request';
        alert(error.message || 'Failed to send match request.');
        console.error('Match request error:', error);
    }
}

// Show match requests modal with backend data
let matchModal = null;
async function showMatchRequests() {
     if (matchModal) {
        const bsModal = bootstrap.Modal.getInstance(matchModal);
        if (bsModal) bsModal.hide();
        matchModal.remove();
    }
    matchModal = document.createElement('div');
    matchModal.id = 'matchRequestsModal';
    matchModal.className = 'modal fade';
    matchModal.setAttribute('tabindex', '-1');

    // Always fetch latest pets and userPets
    let allPets = [];
    let userPets = [];
    try {
        const petsRes = await fetch('/api/pets');
        allPets = await petsRes.json();
        const userId = localStorage.getItem('userId');
        console.log('Current userId:', userId); // Debug log
        userPets = allPets.filter(p => p.userId === userId);
        localStorage.setItem('pets', JSON.stringify(allPets));
        localStorage.setItem('userPets', JSON.stringify(userPets));
    } catch (e) {
        allPets = JSON.parse(localStorage.getItem('pets') || '[]');
        userPets = JSON.parse(localStorage.getItem('userPets') || '[]');
    }

    // Fetch match requests from backend
    const userId = localStorage.getItem('userId');
    console.log('Current userId:', userId); // Debug log
    let requests = [];
    try {
        const res = await fetch(`/api/match-requests?userId=${userId}`);
        requests = await res.json();
        console.log('Fetched match requests:', requests); // Debug log
        if (!Array.isArray(requests)) requests = [];
    } catch (e) {
        requests = [];
    }

    // Split requests into sent and received (robust comparison for ObjectId or string)
    const sentRequests = requests.filter(r => String(r.sender?._id || r.sender?.$oid || r.sender) === String(userId));
    const receivedRequests = requests.filter(r => String(r.receiver?._id || r.receiver?.$oid || r.receiver) === String(userId));

    // Modal content
    matchModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #012312; color: white;">
                    <h5 class="modal-title">
                        <i class="fas fa-heart me-2"></i>Match Requests
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h6 class="mb-3">Sent Requests</h6>
                    ${sentRequests.length === 0 ?
                        `<div class='text-muted mb-4'>No sent match requests.</div>` :
                        sentRequests.map(request => {
                            let receiverPetName = request.receiverPet?.name || 'Target Pet';
                            let senderPetName = request.senderPet?.name || 'Your Pet';
                            return `
                                <div class="card mb-2 border-0 shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h6 class="card-title mb-0">
                                                <i class="fas fa-paw me-2" style="color: #FFB031;"></i>
                                                ${senderPetName} → ${receiverPetName}
                                            </h6>
                                            <span class="badge ${request.status === 'pending' ? 'bg-warning' : request.status === 'accepted' ? 'bg-success' : 'bg-danger'} px-3 py-2">
                                                <i class="fas ${request.status === 'pending' ? 'fa-clock' : request.status === 'accepted' ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                                                ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        ${request.message ?
                                            `<div class="card-text bg-light p-3 rounded mb-2">
                                                <i class="fas fa-quote-left me-2" style="color: #FFB031;"></i>
                                                ${request.message}
                                            </div>` : ''}
                                        <small class="text-muted">
                                            <i class="far fa-clock me-1"></i>
                                            Sent on ${new Date(request.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                    <hr/>
                    <h6 class="mb-3">Received Requests</h6>
                    ${receivedRequests.length === 0 ?
                        `<div class='text-muted mb-4'>No received match requests.</div>` :
                        receivedRequests.map(request => {
                            let senderPetName = request.senderPet?.name || 'Sender Pet';
                            let receiverPetName = request.receiverPet?.name || 'Your Pet';
                            return `
                                <div class="card mb-2 border-0 shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h6 class="card-title mb-0">
                                                <i class="fas fa-paw me-2" style="color: #FFB031;"></i>
                                                ${senderPetName} → ${receiverPetName}
                                            </h6>
                                            <span class="badge ${request.status === 'pending' ? 'bg-warning' : request.status === 'accepted' ? 'bg-success' : 'bg-danger'} px-3 py-2">
                                                <i class="fas ${request.status === 'pending' ? 'fa-clock' : request.status === 'accepted' ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                                                ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        ${request.message ?
                                            `<div class="card-text bg-light p-3 rounded mb-2">
                                                <i class="fas fa-quote-left me-2" style="color: #FFB031;"></i>
                                                ${request.message}
                                            </div>` : ''}
                                        <small class="text-muted">
                                            <i class="far fa-clock me-1"></i>
                                            Sent on ${new Date(request.createdAt).toLocaleDateString()}
                                        </small>
                                        ${request.status === 'pending' ? `
                                            <div class="mt-3 d-flex gap-2">
                                                <button class="btn btn-success btn-sm" onclick="handleMatchRequestAction('${request._id}','accepted')">
                                                    <i class="fas fa-check me-1"></i>Accept
                                                </button>
                                                <button class="btn btn-danger btn-sm" onclick="handleMatchRequestAction('${request._id}','rejected')">
                                                    <i class="fas fa-times me-1"></i>Reject
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Close
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(matchModal);
    const modal = new bootstrap.Modal(matchModal);
    modal.show();
    updateAuthUI(true);
}
window.showMatchRequests = showMatchRequests;

// Add handler for accept/reject actions
window.handleMatchRequestAction = async function(requestId, action) {
    try {
        const res = await fetch(`/api/match-requests/${requestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: action })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update request');
        // Optionally show a toast/alert
        showMatchRequests(); // Refresh modal
        await updateMatchRequestNotification();
    } catch (err) {
        alert(err.message || 'Failed to update match request.');
    }
}

// --- PETS BACKEND INTEGRATION ---

// Fetch pets from backend
async function fetchPets() {
    const res = await fetch('/pets');
    if (!res.ok) return [];
    return await res.json();
}

// Add a new pet to backend
async function addPet(petData) {
    const res = await fetch('/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData)
    });
    return await res.json();
}

// Update a pet in backend
async function updatePet(id, petData) {
    const res = await fetch(`/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData)
    });
    return await res.json();
}

// Delete a pet in backend
async function deletePet(id) {
    // Use the correct backend API endpoint
    const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    return await res.json();
}

// Render pets on My Pets page
async function renderMyPets() {
    const container = document.getElementById('myPetsContainer');
    if (!container) return;
    
    // Fetch from backend instead of localStorage
    try {
        const userId = localStorage.getItem('userId');
        const res = await fetch(`/api/pets?userId=${userId}`);
        const pets = await res.json();
        const userPets = pets.filter(pet => pet.userId === userId);

        if (userPets.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">You haven't added any pets yet.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = userPets.map(renderPetCard).join('');

        // Update localStorage for consistency
        localStorage.setItem('userPets', JSON.stringify(userPets));
    } catch (error) {
        container.innerHTML = `<div class="col-12 text-center"><p class="text-danger">Failed to load pets.</p></div>`;
        console.error('Error loading pets:', error);
    }
}

// Centralized pet card renderer
function renderPetCard(pet) {
    // Only show the Edit button for My Pets if not on browse.html
    const currentPage = window.location.pathname.split('/').pop();
    const editButton = currentPage === 'my-pets.html'
        ? `<button class="btn" style="background-color: #FFB031; color: #012312;" onclick="editPet('${pet._id}')">
                <i class="fas fa-edit me-2"></i>Edit
           </button>`
        : '';
    const deleteButton = currentPage === 'my-pets.html'
        ? `<button class="btn btn-danger" onclick="handleDeletePet('${pet._id}')">
                <i class="fas fa-trash me-2"></i>Delete
           </button>`
        : '';
    // Fun badge phrases for My Pets
    const funBadges = ['My Buddy', 'Best Friend', 'Cuddle Pro', 'Fur Star', 'Snuggle Champ', 'Pawfect Pal', 'Top Dog'];
    const badgeText = funBadges[Math.floor(Math.random() * funBadges.length)];
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 position-relative">
                <span class="fun-badge">${badgeText}</span>
                <img src="${pet.profileImage}" 
                     class="card-img-top" 
                     alt="${pet.name}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${pet.name}</h5>
                    <p class="card-text">
                        <strong>Breed:</strong> ${pet.breed}<br>
                        <strong>Age:</strong> ${pet.age}<br>
                        <strong>Gender:</strong> ${pet.gender}<br>
                        <strong>Location:</strong> ${pet.location}
                    </p>
                    <p class="card-text">${pet.description}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <div class="d-flex justify-content-between">
                        ${editButton}
                        ${deleteButton}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners for add/edit/delete
async function handleAddPet(e) {
    e.preventDefault();
    
    const name = document.getElementById('dogName').value;
    const breed = document.getElementById('breed').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    
    // Handle image upload
    const profileImage = document.getElementById('profileImage').files[0];
    
    // Convert image to base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    
    try {
        const profileImageBase64 = profileImage ? await getBase64(profileImage) : null;
        
        const petData = {
            name,
            type,
            breed,
            age,
            gender,
            location,
            description,
            images: [profileImageBase64].filter(Boolean),
            userId: localStorage.getItem('userId')
        };
        
        // Send to backend
        const response = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add pet');
        }
        // Reset form and hide it
        e.target.reset();
        document.getElementById('addPetForm').style.display = 'none';
        document.getElementById('showAddPetForm').style.display = 'block';
        document.getElementById('imagePreview').innerHTML = '';
        // Refresh the pets display
        await renderMyPets();
    } catch (error) {
        console.error('Error adding pet:', error);
        // Removed alert to avoid unnecessary error message to user
    }
}

async function handleDeletePet(id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        try {
            const response = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                let errorMsg = 'Failed to delete pet.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {}
                alert(errorMsg);
                return;
            }
            // Success: refresh pets
            await renderMyPets();
            // Always refresh match requests list
            await showMatchRequests();
        } catch (err) {
            alert('Error deleting pet. See console for details.');
            console.error('Delete error:', err);
        }
    }
}

window.handleDeletePet = handleDeletePet;

// Attach listeners on DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'my-pets.html') {
        renderMyPets();
    }
    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', handleAddPet);
    }
});

// Add/Edit Pet Modal
let editPetModal = null;
function showEditPetForm(id) {
    fetch(`/api/pets/${id}`)
        .then(res => res.json())
        .then(pet => {
            // Parse age as number for the input
            let ageValue = pet.age;
            if (typeof ageValue === 'string') {
                const match = ageValue.match(/\d+/);
                ageValue = match ? match[0] : '';
            }
            // Create modal HTML if not exists
            if (!editPetModal) {
                editPetModal = document.createElement('div');
                editPetModal.className = 'modal fade';
                editPetModal.id = 'editPetModal';
                editPetModal.tabIndex = -1;
                document.body.appendChild(editPetModal);
            }
            editPetModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Pet</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form id="editPetForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" name="name" value="${pet.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Age</label>
                                 <input type="number" class="form-control" name="age" value="${ageValue}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Breed</label>
                                <input type="text" class="form-control" name="breed" value="${pet.breed}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Gender</label>
                                <select class="form-select" name="gender" required>
                                    <option value="Male" ${pet.gender === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${pet.gender === 'Female' ? 'selected' : ''}>Female</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-control" name="location" value="${pet.location}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="3" required>${pet.description}</textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                        </form>
                    </div>
                </div>
            `;
            const modal = new bootstrap.Modal(editPetModal);
            modal.show();
            document.getElementById('editPetForm').onsubmit = async function(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedPet = Object.fromEntries(formData.entries());
                 updatedPet.age = Number(updatedPet.age); // Ensure age is a number
                try {
                    await updatePet(id, updatedPet);
                    modal.hide();
                     await renderMyPets();
                    // Remove modal from DOM after hiding
                    setTimeout(() => {
                        if (editPetModal) {
                            editPetModal.remove();
                            editPetModal = null;
                        }
                    }, 500);
                } catch (err) {
                    alert('Error updating pet.');
                    console.error(err);
                }
            };
        })
        .catch(err => {
            alert('Error loading pet for editing.');
            console.error(err);
        });
}
window.showEditPetForm = function(){}; // Disable modal edit for my-pets.html

// Handle image preview
function handleImagePreview(input, previewContainer) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-thumbnail';
            img.style.width = '150px';
            img.style.height = '150px';
            img.style.objectFit = 'cover';
            img.style.margin = '5px';
            
            // Clear previous previews
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle multiple image preview
function handleMultipleImagePreview(input, previewContainer) {
    if (input.files) {
        // Clear previous previews
        previewContainer.innerHTML = '';
        
        // Limit to 3 images
        const files = Array.from(input.files).slice(0, 3);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'img-thumbnail';
                img.style.width = '150px';
                img.style.height = '150px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showAlert(data.message || 'Error sending message', 'error');
            }
        } catch (error) {
            showAlert('Error sending message. Please try again.', 'error');
        }
    });
}

window.toggleFavorite = toggleFavorite;

// Add this function to fetch and update received match request notification
async function updateMatchRequestNotification() {
    if (!localStorage.getItem('isLoggedIn') || !localStorage.getItem('userId')) return;
    try {
        const userId = localStorage.getItem('userId');
        const res = await fetch(`/api/match-requests?userId=${userId}`);
        let requests = await res.json();
        if (!Array.isArray(requests)) requests = [];
        // Only count received and pending requests
        const receivedRequests = requests.filter(r => String(r.receiver?._id || r.receiver?.$oid || r.receiver) === String(userId) && r.status === 'pending');
        localStorage.setItem('pendingReceivedMatchRequests', receivedRequests.length);
    } catch (e) {
        localStorage.setItem('pendingReceivedMatchRequests', 0);
    }
    updateAuthUI(localStorage.getItem('isLoggedIn') === 'true');
}

// On page load, fetch and update match request notification
if (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId')) {
    updateMatchRequestNotification();
}

// Add this function to fetch and update notifications for sent match requests that have been updated (accepted/rejected)
async function updateSentMatchRequestStatusNotification() {
    if (!localStorage.getItem('isLoggedIn') || !localStorage.getItem('userId')) return;
    try {
        const userId = localStorage.getItem('userId');
        const res = await fetch(`/api/match-requests?userId=${userId}`);
        let requests = await res.json();
        if (!Array.isArray(requests)) requests = [];
        // Only count sent requests that are accepted/rejected and not yet seen
        let seenStatus = JSON.parse(localStorage.getItem('seenSentStatus') || '{}');
        const sentRequests = requests.filter(r => String(r.sender?._id || r.sender?.$oid || r.sender) === String(userId));
        const updatedSent = sentRequests.filter(r => (r.status === 'accepted' || r.status === 'rejected') && !seenStatus[r._id]);
        localStorage.setItem('pendingSentStatusNotif', updatedSent.length);
    } catch (e) {
        localStorage.setItem('pendingSentStatusNotif', 0);
    }
    updateAuthUI(localStorage.getItem('isLoggedIn') === 'true');
}

// On page load, fetch and update both notifications
if (localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId')) {
    updateMatchRequestNotification();
    updateSentMatchRequestStatusNotification();
}

// Patch submitMatchRequest and handleMatchRequestAction only once
const originalSubmitMatchRequest = submitMatchRequest;
submitMatchRequest = async function() {
    await originalSubmitMatchRequest.apply(this, arguments);
    await updateMatchRequestNotification();
    await updateSentMatchRequestStatusNotification();
};

const originalHandleMatchRequestAction = window.handleMatchRequestAction;
window.handleMatchRequestAction = async function(requestId, action) {
    await originalHandleMatchRequestAction.apply(this, arguments);
    await updateMatchRequestNotification();
    await updateSentMatchRequestStatusNotification();
};

// Mark sent status notifications as seen when opening the modal
const originalShowMatchRequests = window.showMatchRequests;
window.showMatchRequests = async function() {
    await originalShowMatchRequests.apply(this, arguments);
    // Mark all accepted/rejected sent requests as seen
    try {
        const userId = localStorage.getItem('userId');
        const res = await fetch(`/api/match-requests?userId=${userId}`);
        let requests = await res.json();
        if (!Array.isArray(requests)) requests = [];
        let seenStatus = JSON.parse(localStorage.getItem('seenSentStatus') || '{}');
        const sentRequests = requests.filter(r => String(r.sender?._id || r.sender?.$oid || r.sender) === String(userId));
        sentRequests.forEach(r => {
            if ((r.status === 'accepted' || r.status === 'rejected')) {
                seenStatus[r._id] = true;
            }
        });
        localStorage.setItem('seenSentStatus', JSON.stringify(seenStatus));
        await updateSentMatchRequestStatusNotification();
    } catch (e) {}
};

// --- FETCH AND RENDER PETS FOR BROWSE PAGE ---
async function loadAndRenderBrowsePets() {
    const petGrid = document.querySelector('.pet-cards-grid');
    if (!petGrid) return;
    try {
        const res = await fetch('/api/pets');
        window.pets = await res.json(); // Ensure pets is always global
        renderBrowsePets(window.pets);
    } catch (e) {
        petGrid.innerHTML = `<div class='col-12 text-center'><p class='text-danger'>Failed to load pets.</p></div>`;
    }
}

function renderBrowsePets(pets) {
    const petGrid = document.querySelector('.pet-cards-grid');
    if (!petGrid) return;
    if (!pets || pets.length === 0) {
        petGrid.innerHTML = `<div class='col-12 text-center'><p class='text-muted'>No pets found.</p></div>`;
        return;
    }
    petGrid.innerHTML = '';
    const funBadges = ['Adopt Me!', 'Woof!', 'New Friend!', 'So Cute!', 'Let\'s Play!', 'Pick Me!', 'Best Buddy!', 'Cuddle Me!'];
    pets.forEach((pet, idx) => {
        const card = document.createElement('div');
        card.className = 'col';
        const badgeText = funBadges[Math.floor(Math.random() * funBadges.length)];
        card.innerHTML = `
            <div class="card h-100 position-relative">
                <span class="fun-badge">${badgeText}</span>
                <img src="${pet.profileImage || 'images/default-pet.jpg'}" class="card-img-top pet-image" alt="${pet.name}" data-pet-id="${pet._id || pet.id}" onerror="this.onerror=null;this.src='images/default-pet.jpg';">
                <div class="card-body">
                    <h5 class="card-title">${pet.name}</h5>
                    <p class="card-text">
                        <strong>Breed:</strong> ${pet.breed}<br>
                        <strong>Age:</strong> ${pet.age}<br>
                        <strong>Gender:</strong> ${pet.gender}<br>
                        <strong>Location:</strong> ${pet.location}
                    </p>
                    <p class="card-text">${pet.description}</p>
                </div>
            </div>
        `;
        petGrid.appendChild(card);
    });
    // Add event listeners to each pet image to open modal with correct details
    const petImages = petGrid.querySelectorAll('.pet-image');
    petImages.forEach(img => {
        img.addEventListener('click', function(e) {
            const petId = this.getAttribute('data-pet-id');
            // Only open modal if pets are loaded
            if (!window.pets || !Array.isArray(window.pets) || window.pets.length === 0) return;
            const pet = window.pets.find(p => String(p._id || p.id) === String(petId));
            if (pet) {
                if (!pet.images || !Array.isArray(pet.images) || pet.images.length === 0) {
                    pet.images = [pet.profileImage || 'images/default-pet.jpg'];
                }
                updatePetModal(pet);
                // Show the modal programmatically
                const petModal = new bootstrap.Modal(document.getElementById('petModal'));
                petModal.show();
            }
        });
    });
}