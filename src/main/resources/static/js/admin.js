// admin.js - Полностью самодостаточный JS без HTML

// ===== Глобальные переменные =====
let currentUser = null;

// ===== Инициализация приложения =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = '<div id="app"></div>';
    checkAuthStatus();
});

// ===== Аутентификация =====
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return showLoginForm();

    try {
        const res = await fetch('/api/auth/check', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        currentUser = res.ok ? await res.json() : null;
        if (currentUser) renderAdminPanel();
        else showLoginForm();
    } catch {
        showLoginForm();
    }
}

function showLoginForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-form">
            <h2>Вход в систему</h2>
            <form id="loginForm">
                <input type="text" placeholder="Логин" required>
                <input type="password" placeholder="Пароль" required>
                <button type="submit">Войти</button>
            </form>
            <div id="loginError" class="error"></div>
        </div>
    `;

    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const [username, password] = e.target.querySelectorAll('input');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.value, password: password.value })
            });

            if (res.ok) {
                const { token, user } = await res.json();
                localStorage.setItem('token', token);
                currentUser = user;
                renderAdminPanel();
            } else {
                throw new Error('Неверные данные');
            }
        } catch (err) {
            document.getElementById('loginError').textContent = err.message;
        }
    };
}

// ===== Админ-панель =====
function renderAdminPanel() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="admin-panel">
            <header>
                <h1>Админ-панель</h1>
                <button id="logoutBtn">Выйти</button>
            </header>
            <div class="toolbar">
                <button id="refreshBtn">Обновить</button>
                <button id="createUserBtn">+ Новый пользователь</button>
            </div>
            <div class="user-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Роли</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody"></tbody>
                </table>
            </div>
        </div>
        <div id="modal" class="modal hidden"></div>
    `;

    // Навешиваем обработчики
    document.getElementById('logoutBtn').onclick = logout;
    document.getElementById('refreshBtn').onclick = loadUsers;
    document.getElementById('createUserBtn').onclick = showCreateModal;

    loadUsers();
}

// ===== Работа с пользователями =====
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="5">Загрузка...</td></tr>';

    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const users = await res.json();

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(', ')}</td>
                <td>
                    <button class="edit" data-id="${user.id}">✏️</button>
                    <button class="delete" data-id="${user.id}">🗑️</button>
                </td>
            </tr>
        `).join('');

        // Вешаем обработчики кнопок
        document.querySelectorAll('.edit').forEach(btn => {
            btn.onclick = () => showEditModal(btn.dataset.id);
        });
        document.querySelectorAll('.delete').forEach(btn => {
            btn.onclick = () => deleteUser(btn.dataset.id);
        });

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5">Ошибка: ${err.message}</td></tr>`;
    }
}

// ===== Модальные окна =====
function showCreateModal() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Создать пользователя</h3>
            <form id="userForm">
                <input name="username" placeholder="Логин" required>
                <input name="email" type="email" placeholder="Email" required>
                <input name="password" type="password" placeholder="Пароль" required>
                <div class="roles">
                    <label><input type="checkbox" name="roles" value="USER" checked> User</label>
                    <label><input type="checkbox" name="roles" value="ADMIN"> Admin</label>
                </div>
                <button type="submit">Сохранить</button>
                <button type="button" class="cancel">Отмена</button>
            </form>
        </div>
    `;
    modal.classList.remove('hidden');

    modal.querySelector('.cancel').onclick = () => modal.classList.add('hidden');
    modal.querySelector('form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            roles: formData.getAll('roles')
        };

        try {
            await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            modal.classList.add('hidden');
            loadUsers();
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };
}

async function showEditModal(userId) {
    const modal = document.getElementById('modal');
    modal.innerHTML = '<div class="modal-content">Загрузка...</div>';
    modal.classList.remove('hidden');

    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const user = await res.json();

        modal.innerHTML = `
            <div class="modal-content">
                <h3>Редактировать</h3>
                <form id="userForm">
                    <input name="username" value="${user.username}" required>
                    <input name="email" type="email" value="${user.email}" required>
                    <div class="roles">
                        <label><input type="checkbox" name="roles" value="USER" ${user.roles.some(r => r.name === 'ROLE_USER') ? 'checked' : ''}> User</label>
                        <label><input type="checkbox" name="roles" value="ADMIN" ${user.roles.some(r => r.name === 'ROLE_ADMIN') ? 'checked' : ''}> Admin</label>
                    </div>
                    <button type="submit">Сохранить</button>
                    <button type="button" class="cancel">Отмена</button>
                </form>
            </div>
        `;

        modal.querySelector('.cancel').onclick = () => modal.classList.add('hidden');
        modal.querySelector('form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                roles: formData.getAll('roles')
            };

            try {
                await fetch(`/api/admin/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });
                modal.classList.add('hidden');
                loadUsers();
            } catch (err) {
                alert(`Ошибка: ${err.message}`);
            }
        };
    } catch (err) {
        modal.innerHTML = `<div class="modal-content">Ошибка: ${err.message}</div>`;
    }
}

// ===== Вспомогательные функции =====
async function deleteUser(userId) {
    if (!confirm('Удалить пользователя?')) return;
    try {
        await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadUsers();
    } catch (err) {
        alert(`Ошибка: ${err.message}`);
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    showLoginForm();
}

// ===== Добавляем базовые стили =====
const style = document.createElement('style');
style.textContent = `
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    #app { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .login-form { max-width: 300px; margin: 50px auto; }
    .admin-panel header { display: flex; justify-content: space-between; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
    button { cursor: pointer; padding: 5px 10px; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; padding: 20px; border-radius: 5px; }
    .hidden { display: none; }
    .error { color: red; }
`;
document.head.appendChild(style);