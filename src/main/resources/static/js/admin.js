document.addEventListener('DOMContentLoaded', () => {
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');

    editUserModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        const userId = button.getAttribute('data-user-id');
        const username = button.getAttribute('data-user-username');
        const lastname = button.getAttribute('data-user-lastname');
        const age = button.getAttribute('data-user-age');
        const email = button.getAttribute('data-user-email');
        const rolesStr = button.getAttribute('data-user-roles');

        document.getElementById('editUserId').value = userId;
        document.getElementById('displayId').value = userId;
        document.getElementById('editUsername').value = username;
        document.getElementById('editLastname').value = lastname;
        document.getElementById('editAge').value = age;
        document.getElementById('editEmail').value = email;
        document.getElementById('editPassword').value = '';

        const form = editUserModal.querySelector('form');
        form.setAttribute('action', `/admin/update/${userId}`);

        document.querySelectorAll('.role-checkbox').forEach(chk => chk.checked = false);

        if (rolesStr) {
            const rolesIds = rolesStr.split(',');
            rolesIds.forEach(roleId => {
                const checkbox = document.getElementById(`editRole-${roleId.trim()}`);
                if (checkbox) checkbox.checked = true;
            });
        }
    });

    const deleteUserModal = document.getElementById('deleteUserModal');
    const deleteUserForm = document.getElementById('deleteUserForm');

    deleteUserModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;

        const userId = button.getAttribute('data-user-id');
        const username = button.getAttribute('data-user-username');
        const lastname = button.getAttribute('data-user-lastname');
        const age = button.getAttribute('data-user-age');
        const email = button.getAttribute('data-user-email');
        const rolesStr = button.getAttribute('data-user-roles');

        document.getElementById('deleteUserIdDisplay').textContent = userId;
        document.getElementById('deleteUserFirstName').textContent = username;
        document.getElementById('deleteUserLastName').textContent = lastname;
        document.getElementById('deleteUserAge').textContent = age;
        document.getElementById('deleteUserEmail').textContent = email;
        document.getElementById('deleteUserRoles').textContent = rolesStr;

        document.getElementById('deleteUserId').value = userId;
    });

    deleteUserForm.addEventListener('submit', async e => {
        e.preventDefault();

        const userId = document.getElementById('deleteUserId').value;
        const csrfToken = deleteUserForm.querySelector('input[name="_csrf"]').value;

        try {
            const response = await fetch(`/admin/delete/${userId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            const modalInstance = bootstrap.Modal.getInstance(deleteUserModal);
            modalInstance.hide();

            setTimeout(() => {
                window.location.reload();
            }, 300);

        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message || 'Error deleting user');
        }
    });
});