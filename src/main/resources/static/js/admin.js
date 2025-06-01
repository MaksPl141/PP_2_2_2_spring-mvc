// Обработчик открытия модального окна редактирования
document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('editUserModal');
    if (editModal) {
        editModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const modal = this;

            modal.querySelector('#editUserId').value = button.getAttribute('data-user-id');
            modal.querySelector('#displayId').value = button.getAttribute('data-user-id');
            modal.querySelector('#editUsername').value = button.getAttribute('data-user-username');
            modal.querySelector('#editLastname').value = button.getAttribute('data-user-lastname');
            modal.querySelector('#editAge').value = button.getAttribute('data-user-age');
            modal.querySelector('#editEmail').value = button.getAttribute('data-user-email');

            modal.querySelectorAll('.role-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            const roles = button.getAttribute('data-user-roles').split(',');
            modal.querySelectorAll('.role-checkbox').forEach(checkbox => {
                if (roles.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        });
    }

    const deleteModal = document.getElementById('deleteUserModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const modal = this;

            modal.querySelector('#deleteUserName').textContent = button.getAttribute('data-user-username');
            modal.querySelector('#deleteUserId').value = button.getAttribute('data-user-id');
            modal.querySelector('#deleteUserForm').action = '/admin/delete/' + button.getAttribute('data-user-id');
        });
    }

    const editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const userId = formData.get('id');
            const url = '/admin/update/' + userId;

            const data = {
                id: formData.get('id'),
                username: formData.get('username'),
                lastname: formData.get('lastname'),
                age: formData.get('age'),
                email: formData.get('email'),
                password: formData.get('password'),
                roles: Array.from(document.querySelectorAll('#editUserModal input[name="roles"]:checked'))
                    .map(checkbox => checkbox.value)
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Error updating user');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error updating user');
                });
        });
    }
});

function showAlert(message, type) {
    const alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) return;

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