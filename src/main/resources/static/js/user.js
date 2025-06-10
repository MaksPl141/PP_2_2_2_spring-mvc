async function loadUserData() {
    try {
        const response = await fetch('/api/user/current' , {
            credentials: 'include'});
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login.html';
                return;
            }
            throw new Error('Failed to load user data');
        }

        const user = await response.json();

        document.getElementById('userId').textContent = user.id ?? '';
        document.getElementById('userUsername').textContent = user.username ?? '';
        document.getElementById('userLastname').textContent = user.lastname ?? '';
        document.getElementById('userAge').textContent = user.age ?? '';
        document.getElementById('userEmail').textContent = user.email ?? '';
        document.getElementById('userEmailHeader').textContent = user.email ?? '';

        const rolesNames = (Array.isArray(user.roles) ? user.roles : []).map(r => r.name.replace('ROLE_', '')).join(', ');
        document.getElementById('userRoleHeader').textContent = rolesNames;

        const rolesElement = document.getElementById('userRoles');
        rolesElement.innerHTML = '';
        if (Array.isArray(user.roles) && user.roles.length > 0) {
            user.roles.forEach(role => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-1';
                badge.textContent = role.name ?? '';
                rolesElement.appendChild(badge);
            });
        } else {
            rolesElement.textContent = 'No roles assigned';
        }

        const backBtn = document.getElementById('backToAdminBtn');
        backBtn.style.display = 'none';

        const roles = (user.roles || []).map(r => r.name);
        if (roles.includes('ROLE_ADMIN')) {
            backBtn.style.display = 'inline-block';

            backBtn.onclick = () => {
                window.location.href = '/admin.html';
            };
        } else {
            backBtn.style.display = 'none';
            backBtn.onclick = null;
        }

        document.getElementById('logoutForm').addEventListener('submit', function(event) {
            event.preventDefault();
            fetch('/api/logout', { method: 'POST' ,
                credentials: "include" })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/login.html';
                    } else {
                        alert('Ошибка при выходе');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка при выходе');
                });
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Error loading user data');
    }
}

document.addEventListener('DOMContentLoaded', loadUserData);