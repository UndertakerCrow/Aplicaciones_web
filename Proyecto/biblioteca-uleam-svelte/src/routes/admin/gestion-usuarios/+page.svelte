<script>
  /**
   * INTERFAZ: GESTIÓN DE USUARIOS (Admin)
   * ----------------------------------------
   * Funcionalidad: CRUD completo de usuarios del sistema.
   *
   * FRAMEWORK: SvelteKit + Svelte 5
   * JAVASCRIPT: Validaciones de formulario, búsqueda reactiva, control de estado
   *
   * FUNCIONALIDADES IDENTIFICADAS:
   *   - Listar usuarios con búsqueda por nombre, email, ID o rol
   *   - Agregar nuevo usuario (ID, nombre, carrera, teléfono, email, rol, estado)
   *   - Editar datos de usuario existente
   *   - Eliminar usuario (no puede eliminarse el usuario activo)
   *   - Bloquear / Desbloquear usuario manualmente
   *
   * VALIDACIONES DE CAMPOS (JavaScript):
   *   - ID y email: requeridos + verificación de duplicados en el store
   *   - nombre, carrera, teléfono: requeridos (trim + length)
   *   - No permite eliminar al propio administrador logueado
   *
   * ALMACENAMIENTO LOCAL:
   *   - usuarios.update() → persiste en localStorage
   *   - loggedUser.set()  → actualiza sesión activa si se edita el propio perfil
   *   - filteredUsers ($derived) → filtrado reactivo sin afectar el store
   */
  import { loggedUser, usuarios } from '$lib/store.js';
  import { goto } from '$app/navigation';

  let search = '';
  let showModal = false;
  let isEditing = false;

  // Campos del formulario modal
  let usrId = '';
  let usrNombre = '';
  let usrCarrera = '';
  let usrTelefono = '';
  let usrEmail = '';
  let usrRol = 'Estudiante';

  // Toast
  let toastMessage = '';
  let toastType = 'success';
  let toastVisible = false;

  function triggerToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    toastVisible = true;
    setTimeout(() => {
      toastVisible = false;
    }, 3500);
  }

  // Filtrado reactivo de usuarios
  const filteredUsers = $derived($usuarios.filter(u => {
    return (
      (u.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.rol || '').toLowerCase().includes(search.toLowerCase())
    );
  }));

  function showAddUserModal() {
    isEditing = false;
    usrId = '';
    usrNombre = '';
    usrCarrera = '';
    usrTelefono = '';
    usrEmail = '';
    usrRol = 'Estudiante';
    showModal = true;
  }

  function showEditUserModal(user) {
    isEditing = true;
    usrId = user.id;
    usrNombre = user.nombre;
    usrCarrera = user.carrera;
    usrTelefono = user.telefono;
    usrEmail = user.email;
    usrRol = user.rol;
    showModal = true;
  }

  function closeUserModal() {
    showModal = false;
  }

  function saveUser() {
    if (!usrId.trim() || !usrNombre.trim() || !usrCarrera.trim() || !usrTelefono.trim() || !usrEmail.trim()) {
      triggerToast("Por favor, llena todos los campos.", "warning");
      return;
    }

    if (!isEditing) {
      // Registrar nuevo usuario
      let userExists = false;
      const currentUsers = $usuarios;
      userExists = currentUsers.some(u => u.id === usrId.trim() || u.email.toLowerCase() === usrEmail.trim().toLowerCase());

      if (userExists) {
        triggerToast("El ID o Correo ya se encuentra registrado.", "danger");
        return;
      }

      usuarios.update(list => {
        list.push({
          id: usrId.trim(),
          nombre: usrNombre.trim(),
          carrera: usrCarrera.trim(),
          telefono: usrTelefono.trim(),
          email: usrEmail.trim().toLowerCase(),
          rol: usrRol,
          estado: "Activo"
        });
        return list;
      });
      triggerToast("¡Usuario registrado con éxito!", "success");
    } else {
      // Editar usuario existente
      usuarios.update(list => {
        const idx = list.findIndex(u => u.id === usrId);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            nombre: usrNombre.trim(),
            carrera: usrCarrera.trim(),
            telefono: usrTelefono.trim(),
            email: usrEmail.trim().toLowerCase(),
            rol: usrRol
          };
        }
        return list;
      });

      // Si editamos al usuario actual, refrescar loggedUser
      if ($loggedUser && $loggedUser.id === usrId) {
        loggedUser.set({
          ...$loggedUser,
          nombre: usrNombre.trim(),
          carrera: usrCarrera.trim(),
          telefono: usrTelefono.trim(),
          email: usrEmail.trim().toLowerCase(),
          rol: usrRol
        });
      }
      triggerToast("¡Usuario actualizado correctamente!", "success");
    }

    closeUserModal();
  }

  function toggleBlock(id) {
    if ($loggedUser && $loggedUser.id === id) {
      triggerToast("No puedes bloquear tu propio usuario administrador.", "danger");
      return;
    }

    usuarios.update(list => {
      const idx = list.findIndex(u => u.id === id);
      if (idx !== -1) {
        const nextState = list[idx].estado === 'Activo' ? 'Bloqueado' : 'Activo';
        list[idx].estado = nextState;
        triggerToast(`El usuario ${list[idx].nombre} ha sido ${nextState === 'Activo' ? 'desbloqueado' : 'bloqueado'} con éxito.`, "success");
      }
      return list;
    });
  }

  function deleteUser(id) {
    if ($loggedUser && $loggedUser.id === id) {
      triggerToast("No puedes eliminar tu propio usuario administrador.", "danger");
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario con ID ${id}? Esta acción no se puede deshacer.`)) {
      usuarios.update(list => list.filter(u => u.id !== id));
      triggerToast("Usuario eliminado del sistema.", "success");
    }
  }
</script>

<svelte:head>
  <title>Gestión de Usuarios - Admin ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Gestión de Usuarios</h2>
    <p>Registra nuevos usuarios, bloquea estudiantes sancionados y administra roles</p>
  </div>
  
  {#if $loggedUser}
    <div class="user-profile-badge" onclick={() => goto('/estudiante/perfil')}>
      <div class="avatar-container">{($loggedUser.nombre || '').charAt(0)}</div>
      <div class="user-meta">
        <strong>{$loggedUser.nombre}</strong>
        <span>{$loggedUser.rol}</span>
      </div>
    </div>
  {/if}
</div>

<!-- Tabla y Acciones -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Usuarios Registrados</h3>
    <button class="btn btn-primary" onclick={showAddUserModal}>➕ Registrar Usuario</button>
  </div>

  <div style="margin-bottom: 20px;">
    <input type="text" bind:value={search} placeholder="Buscar por ID, nombre o correo...">
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredUsers as u}
          <tr>
            <td style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted);">{u.id}</td>
            <td style="font-weight: 600;">{u.nombre}</td>
            <td>{u.email}</td>
            <td><strong>{u.rol}</strong></td>
            <td>
              <span class="badge {u.estado === 'Activo' ? 'badge-success' : 'badge-danger'}">
                {u.estado}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 8px;">
                <button onclick={() => showEditUserModal(u)} class="btn btn-outline btn-sm">Editar</button>
                {#if u.id !== $loggedUser?.id}
                  <button onclick={() => toggleBlock(u.id)} class="btn btn-outline btn-sm" style="{u.estado === 'Activo' ? 'color: var(--danger); border-color: var(--danger);' : 'color: var(--success); border-color: var(--success);'}">
                    {u.estado === 'Activo' ? 'Bloquear' : 'Desbloquear'}
                  </button>
                  <button onclick={() => deleteUser(u.id)} class="btn btn-danger btn-sm">Eliminar</button>
                {:else}
                  <span style="color: var(--text-muted); font-size: 0.8rem; padding: 6px 12px; font-weight: 500;">(Tú)</span>
                {/if}
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 25px;">
              No se encontraron usuarios coincidentes.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal Crear/Editar Usuario -->
<div class="modal-overlay {showModal ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">
      <h4>{isEditing ? `Editar Usuario: ${usrNombre}` : 'Registrar Nuevo Usuario'}</h4>
      <button class="btn-close" onclick={closeUserModal}>&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="usrId">Cédula / ID de Usuario</label>
        <input type="text" id="usrId" bind:value={usrId} placeholder="Ej. 1003" readonly={isEditing} style={isEditing ? 'background: #f1f5f9; cursor: not-allowed;' : ''}>
      </div>
      <div class="form-group">
        <label for="usrNombre">Nombre Completo</label>
        <input type="text" id="usrNombre" bind:value={usrNombre} placeholder="Ej. Ana María Castro">
      </div>
      <div class="form-group">
        <label for="usrCarrera">Carrera / Área</label>
        <input type="text" id="usrCarrera" bind:value={usrCarrera} placeholder="Ej. Enfermería">
      </div>
      <div class="form-group">
        <label for="usrTelefono">Teléfono</label>
        <input type="text" id="usrTelefono" bind:value={usrTelefono} placeholder="Ej. 0991122334">
      </div>
      <div class="form-group">
        <label for="usrEmail">Correo Institucional</label>
        <input type="email" id="usrEmail" bind:value={usrEmail} placeholder="Ej. ana.castro@uleam.edu.ec">
      </div>
      <div class="form-group">
        <label for="usrRol">Rol del Sistema</label>
        <select id="usrRol" bind:value={usrRol}>
          <option value="Estudiante">Estudiante</option>
          <option value="Docente">Docente</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick={closeUserModal}>Cancelar</button>
      <button class="btn btn-primary" onclick={saveUser}>Guardar Usuario</button>
    </div>
  </div>
</div>

<!-- Toast Container -->
<div class="toast-container">
  {#if toastVisible}
    <div class="toast {toastType} show">
      <span>
        {#if toastType === 'success'}✅{/if}
        {#if toastType === 'danger'}❌{/if}
        {#if toastType === 'warning'}⚠️{/if}
      </span>
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>