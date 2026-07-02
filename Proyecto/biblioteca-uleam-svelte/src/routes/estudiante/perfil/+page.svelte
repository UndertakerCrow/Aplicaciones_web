<script>
  import { loggedUser, usuarios, actions } from '$lib/store.js';
  import { goto } from '$app/navigation';

  let showPasswordModal = false;

  // Campos editables del perfil
  let profNombre = $loggedUser ? $loggedUser.nombre : '';
  let profCarrera = $loggedUser ? $loggedUser.carrera : '';
  let profTelefono = $loggedUser ? $loggedUser.telefono : '';

  // Campos de contraseña modal
  let oldPassword = '';
  let newPassword = '';
  let confirmNewPassword = '';

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

  // Mantener campos sincronizados si cambia loggedUser
  $: {
    if ($loggedUser) {
      profNombre = $loggedUser.nombre;
      profCarrera = $loggedUser.carrera;
      profTelefono = $loggedUser.telefono;
    }
  }

  function saveProfile() {
    if (!profNombre.trim() || !profCarrera.trim() || !profTelefono.trim()) {
      triggerToast("Por favor, llena todos los campos editables.", "warning");
      return;
    }

    // Actualizar usuario en el listado
    usuarios.update(list => {
      const idx = list.findIndex(u => u.id === $loggedUser.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          nombre: profNombre.trim(),
          carrera: profCarrera.trim(),
          telefono: profTelefono.trim()
        };
      }
      return list;
    });

    // Actualizar loggedUser
    loggedUser.set({
      ...$loggedUser,
      nombre: profNombre.trim(),
      carrera: profCarrera.trim(),
      telefono: profTelefono.trim()
    });

    triggerToast("¡Tu perfil ha sido actualizado con éxito!", "success");
  }

  function openPasswordModal() {
    oldPassword = '';
    newPassword = '';
    confirmNewPassword = '';
    showPasswordModal = true;
  }

  function closePasswordModal() {
    showPasswordModal = false;
  }

  function changePassword() {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      triggerToast("Por favor, completa todos los campos de contraseña.", "warning");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      triggerToast("Las contraseñas nuevas no coinciden.", "danger");
      return;
    }

    closePasswordModal();
    triggerToast("¡Contraseña actualizada correctamente!", "success");
  }

  function handleLogout() {
    actions.logout();
    goto('/');
  }
</script>

<svelte:head>
  <title>Mi Perfil - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; align-items: start; flex-wrap: wrap;">
  <!-- Avatar y Acciones Rápidas -->
  <div class="dashboard-card" style="text-align: center;">
    <div class="avatar-container" style="width: 100px; height: 100px; font-size: 40px; margin: 0 auto 20px;">
      {($loggedUser?.nombre || '').charAt(0)}
    </div>
    <h3 style="font-weight: 700; margin-bottom: 5px;">{$loggedUser?.nombre}</h3>
    <p style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 25px;">
      {$loggedUser?.rol}
    </p>
    
    <button on:click={openPasswordModal} class="btn btn-outline" style="width: 100%; justify-content: center; margin-bottom: 10px;">
      🔑 Cambiar Contraseña
    </button>
    <button on:click={handleLogout} class="btn btn-danger" style="width: 100%; justify-content: center; background: transparent; border-color: var(--danger); color: var(--danger);">
      Cerrar Sesión
    </button>
  </div>

  <!-- Formulario de Información -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Información del Usuario</h3>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-wrap: wrap;">
      <div class="form-group">
        <label for="profId">Matrícula / ID</label>
        <input type="text" id="profId" value={$loggedUser?.id} readonly style="background: #f1f5f9; cursor: not-allowed; color: var(--text-muted);">
      </div>
      
      <div class="form-group">
        <label for="profEmail">Correo Institucional</label>
        <input type="email" id="profEmail" value={$loggedUser?.email} readonly style="background: #f1f5f9; cursor: not-allowed; color: var(--text-muted);">
      </div>
    </div>

    <div class="form-group">
      <label for="profNombre">Nombre Completo</label>
      <input type="text" id="profNombre" bind:value={profNombre} placeholder="Tu nombre completo">
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-wrap: wrap;">
      <div class="form-group">
        <label for="profCarrera">Carrera / Facultad</label>
        <input type="text" id="profCarrera" bind:value={profCarrera} placeholder="Ingeniería, Derecho, etc.">
      </div>

      <div class="form-group">
        <label for="profTelefono">Teléfono de Contacto</label>
        <input type="text" id="profTelefono" bind:value={profTelefono} placeholder="Ej. 0987654321">
      </div>
    </div>

    <div style="margin-top: 25px; display: flex; justify-content: flex-end;">
      <button on:click={saveProfile} class="btn btn-primary btn-lg">
        Guardar Cambios
      </button>
    </div>
  </div>
</div>

<!-- Modal Cambiar Contraseña -->
<div class="modal-overlay {showPasswordModal ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">
      <h4>Cambiar Contraseña</h4>
      <button class="btn-close" on:click={closePasswordModal}>&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="oldPassword">Contraseña Actual</label>
        <input type="password" id="oldPassword" bind:value={oldPassword} placeholder="••••••••">
      </div>
      <div class="form-group">
        <label for="newPassword">Nueva Contraseña</label>
        <input type="password" id="newPassword" bind:value={newPassword} placeholder="••••••••">
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">Confirmar Nueva Contraseña</label>
        <input type="password" id="confirmNewPassword" bind:value={confirmNewPassword} placeholder="••••••••">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" on:click={closePasswordModal}>Cancelar</button>
      <button class="btn btn-primary" on:click={changePassword}>Actualizar Contraseña</button>
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
