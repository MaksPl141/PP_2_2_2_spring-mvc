let allRoles = [];
let currentUser = null;
let csrfToken = '';

document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    loadUsers();
    loadRoles();
    setupEventListeners();
});

function loadCurrentUser() {
    fetch('/api/user/current' , { credentials: 'include' })
        .then(response => response.json())
        .then(user => {
            currentUser = user;
            document.getElementById('currentUserInfo').textContent =
                `${user.username} with roles: ${user.roles.map(r => r.name.replace('ROLE_', '')).join(' ')}`;
        })
        .catch(error => console.error('Error loading current user:', error));
}

function loadUsers() {
    fetch('/api/admin/users', { credentials: 'include' })
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(', ')}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-btn" data-user-id="${user.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-user-id="${user.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => showEditUserModal(btn.dataset.userId));
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => showDeleteConfirmation(btn.dataset.userId));
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showAlert('Error loading users', 'danger');
        });
}

// Load all roles
function loadRoles() {
    fetch('/api/admin/roles', { credentials: 'include' })
        .then(response => response.json())
        .then(roles => {
            allRoles = roles;
            renderRoleCheckboxes('newRolesContainer');
            renderRoleCheckboxes('editRolesContainer');
        })
        .catch(error => {
            console.error('Error loading roles:', error);
            showAlert('Error loading roles', 'danger');
        });
}

function renderRoleCheckboxes(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="row"></div>';
    const row = container.querySelector('.row');

    allRoles.forEach(role => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        col.innerHTML = `
            <div class="form-check">
                <input class="form-check-input role-checkbox" type="checkbox" 
                       id="${containerId}-${role.id}" value="${role.id}">
                <label class="form-check-label" for="${containerId}-${role.id}">
                    ${role.name.replace('ROLE_', '')}
                </label>
            </div>
        `;
        row.appendChild(col);
    });
}

function showEditUserModal(userId) {
    fetch(`/api/admin/users/${userId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('displayId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editLastname').value = user.lastname;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;

            document.querySelectorAll('#editRolesContainer .role-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            user.roles.forEach(role => {
                const checkbox = document.getElementById(`editRolesContainer-${role.id}`);
                if (checkbox) checkbox.checked = true;
            });

            const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error loading user:', error);
            showAlert('Error loading user data', 'danger');
        });
}

function updateUser(event) {
    event.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const lastname = document.getElementById('editLastname').value;
    const age = document.getElementById('editAge').value;
    const email = document.getElementById('editEmail').value;
    const password = document.getElementById('editPassword').value;

    const selectedRoles = [];
    document.querySelectorAll('#editRolesContainer .role-checkbox:checked').forEach(checkbox => {
        selectedRoles.push({ id: parseInt(checkbox.value) });
    });

    const userData = {
        username,
        lastname,
        age: parseInt(age),
        email,
        password: password || undefined,
        roles: selectedRoles
    };

    fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(() => {
            showAlert('User updated successfully', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            loadUsers();
        })
        .catch(error => {
            console.error('Error updating user:', error);
            showAlert(error.message || 'Error updating user', 'danger');
        });
}

function showNewUserModal() {
    document.getElementById('newUserForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('newUserModal'));
    modal.show();
}

function createUser(event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const lastname = document.getElementById('newLastname').value;
    const age = document.getElementById('newAge').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    const selectedRoles = [];
    document.querySelectorAll('#newRolesContainer .role-checkbox:checked').forEach(checkbox => {
        selectedRoles.push({ id: parseInt(checkbox.value) });
    });

    const userData = {
        username,
        lastname,
        age: parseInt(age),
        email,
        password,
        roles: selectedRoles
    };

    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(() => {
            showAlert('User created successfully', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('newUserModal'));
            modal.hide();
            loadUsers();
        })
        .catch(error => {
            console.error('Error creating user:', error);
            showAlert(error.message || 'Error creating user', 'danger');
        });
}

function showDeleteConfirmation(userId) {
    fetch(`/api/admin/users/${userId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(user => {
            document.getElementById('deleteUserIdDisplay').textContent = user.id;
            document.getElementById('deleteUserUsername').textContent = user.username;
            document.getElementById('deleteUserLastName').textContent = user.lastname;
            document.getElementById('deleteUserAge').textContent = user.age;
            document.getElementById('deleteUserEmail').textContent = user.email;
            document.getElementById('deleteUserRoles').textContent =
                user.roles.map(r => r.name.replace('ROLE_', '')).join(', ');

            const confirmBtn = document.getElementById('confirmDeleteBtn');
            confirmBtn.dataset.userId = user.id;

            const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error loading user:', error);
            showAlert('Error loading user data', 'danger');
        });
}

function deleteUser() {
    const userId = document.getElementById('confirmDeleteBtn').dataset.userId;

    fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response;
        })
        .then(() => {
            showAlert('User deleted successfully', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            modal.hide();
            loadUsers();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            showAlert(error.message || 'Error deleting user', 'danger');
        });
}

function setupEventListeners() {
    document.getElementById('editUserForm').addEventListener('submit', updateUser);
    document.getElementById('newUserForm').addEventListener('submit', createUser);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteUser);
    document.getElementById('logoutForm').addEventListener('submit', function(event) {
        event.preventDefault();

        fetch('/api/logout', {
            method: 'POST'
        })
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

    document.getElementById('newUserBtn').addEventListener('click', showNewUserModal);
}

function logout(event) {
    event.preventDefault();
    fetch('/logout', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    })
        .then(() => {
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Error logging out:', error);
            showAlert('Error logging out', 'danger');
        });
}

function showAlert(message, type) {
    const alertContainer = document.querySelector('.alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}