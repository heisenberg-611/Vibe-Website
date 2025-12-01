document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.15, // Trigger a bit later for better effect
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to elements
    // Note: Timeline items have their own specific CSS transitions
    const animatedElements = document.querySelectorAll('.card, .rule-item, .eval-category, .timeline-item, .award-card');
    
    // For non-timeline items, we can set a default fade-up style via JS or CSS
    // Let's add a generic fade-up class to non-timeline items for consistency
    document.querySelectorAll('.card, .rule-item, .eval-category, .award-card').forEach(el => {
        el.classList.add('fade-up-element');
        observer.observe(el);
    });

    // Observe timeline items specifically
    document.querySelectorAll('.timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Add global class for generic fade-up animation
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-up-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-up-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });

    // Advanced Mouse Movement Parallax & 3D Tilt
    const hero = document.querySelector('.hero');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const tiltCard = document.querySelector('.tilt-card');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            // Parallax Layers (Translation + Rotation)
            parallaxLayers.forEach(layer => {
                const speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
                const rotateFactor = parseFloat(layer.getAttribute('data-rotate')) || 0;
                
                const xOffset = x * speed * 20;
                const yOffset = y * speed * 20;
                const rotation = x * rotateFactor * 10;

                layer.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`;
            });

            // 3D Tilt Effect for Content
            // Calculate rotation based on cursor position relative to center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.pageX - centerX;
            const mouseY = e.pageY - centerY;

            // Max rotation degrees
            const maxRotateX = 10;
            const maxRotateY = 10;

            const rotateX = -1 * (mouseY / centerY) * maxRotateX; // Invert Y for natural tilt
            const rotateY = (mouseX / centerX) * maxRotateY;

            if (tiltCard) {
                tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        // Reset on mouse leave
        hero.addEventListener('mouseleave', () => {
            parallaxLayers.forEach(layer => {
                layer.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                layer.style.transition = 'transform 0.5s ease-out';
            });
            
            if (tiltCard) {
                tiltCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }

            // Remove transition after it's done
            setTimeout(() => {
                parallaxLayers.forEach(layer => {
                    layer.style.transition = 'none';
                });
            }, 500);
        });
    }

    // --- Backend Integration ---
    const API_URL = 'http://localhost:3000/api';

    // 1. Viewers Count
    async function fetchViewers() {
        try {
            const res = await fetch(`${API_URL}/viewers`);
            const data = await res.json();
            document.getElementById('viewers-count').innerText = data.count;
            
            // Increment count on first load (optional, or handled by backend session)
            // For simple demo, we just increment on every page load
            await fetch(`${API_URL}/viewers`, { method: 'POST' });
        } catch (error) {
            console.error('Error fetching viewers:', error);
            document.getElementById('viewers-count').innerText = 'Err';
        }
    }
    fetchViewers();

    // 2. Authentication (Modal & Logic)
    const loginBtn = document.getElementById('login-btn');
    const modal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const authForm = document.getElementById('auth-form');
    const authMessage = document.getElementById('auth-message');
    const loginSubmit = document.getElementById('login-submit');
    const registerSubmit = document.getElementById('register-submit');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            authMessage.innerText = '';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
            authMessage.innerText = '';
        }
    });

    async function handleAuth(endpoint) {
        const username = authForm.username.value;
        const password = authForm.password.value;
        
        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                authMessage.style.color = 'var(--primary)';
                authMessage.innerText = endpoint === 'login' ? `Welcome, ${data.username}!` : 'Registered! Please login.';
                if (endpoint === 'login') {
                    // Save token and role
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    
                    setTimeout(() => {
                        modal.style.display = 'none';
                        updateNavbar();
                    }, 1500);
                }
            } else {
                authMessage.style.color = '#ff4444';
                authMessage.innerText = data.message;
            }
        } catch (error) {
            authMessage.innerText = 'Server error';
        }
    }

    // Update Navbar based on Auth State
    function updateNavbar() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        const navLogin = document.getElementById('nav-login');
        const navRegister = document.getElementById('nav-register');
        const navProfile = document.getElementById('nav-profile');
        const navAdmin = document.getElementById('nav-admin');
        const navLogout = document.getElementById('nav-logout');

        if (token) {
            if (navLogin) navLogin.style.display = 'none';
            if (navRegister) navRegister.style.display = 'none';
            if (navProfile) navProfile.style.display = 'block';
            if (navLogout) navLogout.style.display = 'block';
            
            if (role === 'admin' && navAdmin) {
                navAdmin.style.display = 'block';
            } else if (navAdmin) {
                navAdmin.style.display = 'none';
            }
        } else {
            if (navLogin) navLogin.style.display = 'block';
            if (navRegister) navRegister.style.display = 'block';
            if (navProfile) navProfile.style.display = 'none';
            if (navAdmin) navAdmin.style.display = 'none';
            if (navLogout) navLogout.style.display = 'none';
        }
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            updateNavbar();
            window.location.href = 'index.html'; // Redirect to home
        });
    }

    // Initial Navbar Update
    updateNavbar();

    if (loginSubmit) {
        loginSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            handleAuth('login');
        });
    }

    if (registerSubmit) {
        registerSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            handleAuth('register');
        });
    }

    // 3. Timeline Search & Sort
    const timelineContainer = document.getElementById('timeline-container');
    const searchInput = document.getElementById('timeline-search');
    const sortSelect = document.getElementById('timeline-sort');

    async function loadTimeline() {
        if (!timelineContainer) return;
        
        const search = searchInput ? searchInput.value : '';
        const sort = sortSelect ? sortSelect.value : 'default';

        try {
            const res = await fetch(`${API_URL}/timeline?search=${encodeURIComponent(search)}&sort=${sort}`);
            const items = await res.json();

            timelineContainer.innerHTML = ''; // Clear current

            items.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = `timeline-item ${item.side}`;
                // Add animation class with delay
                setTimeout(() => div.classList.add('animate-in'), index * 200);

                div.innerHTML = `
                    <div class="content">
                        <div class="time-badge">${item.time}</div>
                        <i class="${item.icon} timeline-icon"></i>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `;
                timelineContainer.appendChild(div);
                
                // Re-observe for scroll animation if needed (though we force animate-in here)
                // observer.observe(div); 
            });
        } catch (error) {
            console.error('Error loading timeline:', error);
            timelineContainer.innerHTML = '<p style="text-align:center; color:white;">Failed to load events.</p>';
        }
    }

    // Initial Load
    loadTimeline();

    // Event Listeners for Search/Sort
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Debounce could be added here
            loadTimeline();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', loadTimeline);
    }

    // --- Profile Page Logic ---
    const profileDetails = document.getElementById('profile-details');
    if (profileDetails) {
        async function loadProfile() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'index.html';
                return;
            }

            try {
                const res = await fetch(`${API_URL}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    document.getElementById('profile-username').innerText = data.username;
                    document.getElementById('profile-role').innerText = data.role;
                    document.getElementById('profile-joined').innerText = new Date(data.joined).toLocaleDateString();
                } else {
                    alert('Failed to load profile. Please login again.');
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        }
        loadProfile();
    }

    // --- Admin Page Logic ---
    const usersTable = document.getElementById('users-table');
    const adminAddUserForm = document.getElementById('admin-add-user-form');
    const adminMessage = document.getElementById('admin-message');

    if (usersTable) {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'admin') {
            alert('Access Denied: Admins only.');
            window.location.href = 'index.html';
        } else {
            loadUsers();
        }

        async function loadUsers() {
            try {
                const res = await fetch(`${API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const users = await res.json();
                
                const tbody = usersTable.querySelector('tbody');
                tbody.innerHTML = '';
                
                users.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>${new Date(user.joined).toLocaleDateString()}</td>
                        <td>
                            ${user.username !== 'admin' ? `<button class="action-btn delete-btn" data-username="${user.username}">Delete</button>` : ''}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                // Attach delete listeners
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        if (confirm(`Delete user ${btn.dataset.username}?`)) {
                            await deleteUser(btn.dataset.username);
                        }
                    });
                });

            } catch (error) {
                console.error('Error loading users:', error);
            }
        }

        async function deleteUser(username) {
            try {
                const res = await fetch(`${API_URL}/users/${username}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    loadUsers();
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }

        if (adminAddUserForm) {
            adminAddUserForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('new-username').value;
                const password = document.getElementById('new-password').value;
                const role = document.getElementById('new-role').value;

                try {
                    const res = await fetch(`${API_URL}/users`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ username, password, role })
                    });
                    
                    const data = await res.json();
                    if (res.ok) {
                        adminMessage.style.color = 'var(--primary)';
                        adminMessage.innerText = 'User added successfully!';
                        adminAddUserForm.reset();
                        loadUsers();
                    } else {
                        adminMessage.style.color = '#ff4444';
                        adminMessage.innerText = data.message;
                    }
                } catch (error) {
                    adminMessage.innerText = 'Error adding user';
                }
            });
        }
    }
});
