<script>
  import { actions, usuarios } from '$lib/store.js';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let showRegister = false;
  let toastMessage = '';
  let toastType = 'success';
  let toastVisible = false;

  // Variables del Modal de registro
  let regId = '';
  let regNombre = '';
  let regCarrera = '';
  let regTelefono = '';
  let regEmail = '';
  let regRol = 'Estudiante';

  function triggerToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    toastVisible = true;
    setTimeout(() => {
      toastVisible = false;
    }, 3500);
  }

  function handleLogin() {
    if (!email.trim()) {
      triggerToast("Ingresa tu correo institucional.", "warning");
      return;
    }
    const res = actions.login(email.trim());
    if (res.success) {
      triggerToast(`¡Hola de nuevo, ${res.user.nombre}!`, "success");
      setTimeout(() => {
        if (res.user.rol === 'Administrador') {
          goto('/admin');
        } else {
          goto('/estudiante');
        }
      }, 800);
    } else {
      triggerToast(res.message, "danger");
    }
  }

  function setQuickLogin(usrEmail) {
    email = usrEmail;
    password = '123456';
    handleLogin();
  }

  function handleRegister() {
    if (!regId.trim() || !regNombre.trim() || !regCarrera.trim() || !regTelefono.trim() || !regEmail.trim()) {
      triggerToast("Por favor completa todos los campos de registro.", "warning");
      return;
    }

    let userExists = false;
    usuarios.subscribe(list => {
      userExists = list.some(u => u.id === regId.trim() || u.email.toLowerCase() === regEmail.trim().toLowerCase());
    })();

    if (userExists) {
      triggerToast("Este ID o Correo ya se encuentra registrado.", "danger");
      return;
    }

    usuarios.update(list => {
      list.push({
        id: regId.trim(),
        nombre: regNombre.trim(),
        carrera: regCarrera.trim(),
        telefono: regTelefono.trim(),
        email: regEmail.trim().toLowerCase(),
        rol: regRol,
        estado: "Activo"
      });
      return list;
    });

    triggerToast("¡Registro completo! Ya puedes ingresar.", "success");
    email = regEmail;
    password = '';
    showRegister = false;
  }
</script>

<svelte:head>
  <title>Iniciar Sesión - Biblioteca ULEAM</title>
</svelte:head>

<div class="login-body">
  <div class="login-card">
    <div class="login-header">
      <div style="font-size: 40px; margin-bottom: 10px;">📚</div>
      <h1>Biblioteca Inteligente</h1>
      <p>Universidad Laica Eloy Alfaro de Manabí</p>
    </div>
    
    <div class="login-form">
      <h2 style="text-align: center; margin-bottom: 25px; font-weight: 700; color: var(--text-main); font-size: 1.4rem;">Iniciar Sesión</h2>
      
      <div class="quick-access-box">
        <h5>Acceso Rápido Svelte</h5>
        <div class="quick-access-buttons">
          <button type="button" on:click={() => setQuickLogin('estudiante@uleam.edu.ec')}>Estudiante</button>
          <button type="button" on:click={() => setQuickLogin('docente@uleam.edu.ec')}>Docente</button>
          <button type="button" on:click={() => setQuickLogin('admin@uleam.edu.ec')}>Admin</button>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Correo Institucional</label>
        <input type="email" id="email" bind:value={email} placeholder="ejemplo@uleam.edu.ec">
      </div>

      <div class="form-group" style="margin-bottom: 25px;">
        <label for="password">Contraseña</label>
        <input type="password" id="password" bind:value={password} placeholder="••••••••">
      </div>

      <button on:click={handleLogin} class="btn btn-primary btn-lg" style="width: 100%; justify-content: center;">
        Ingresar al Sistema
      </button>

      <p style="text-align: center; margin-top: 20px; font-size: 0.85rem; color: var(--text-muted);">
        ¿No tienes cuenta? 
        <button on:click={() => showRegister = true} style="background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; padding: 0;">
          Regístrate aquí
        </button>
      </p>
    </div>
  </div>
</div>

<!-- Modal de Registro -->
<div class="modal-overlay {showRegister ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">
      <h4>Registrar Nuevo Usuario</h4>
      <button class="btn-close" on:click={() => showRegister = false}>&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="regId">Cédula / ID</label>
        <input type="text" id="regId" bind:value={regId} placeholder="Ej. 1003">
      </div>
      <div class="form-group">
        <label for="regNombre">Nombre Completo</label>
        <input type="text" id="regNombre" bind:value={regNombre} placeholder="Ej. Ana María Castro">
      </div>
      <div class="form-group">
        <label for="regCarrera">Carrera / Área</label>
        <input type="text" id="regCarrera" bind:value={regCarrera} placeholder="Ej. Enfermería">
      </div>
      <div class="form-group">
        <label for="regTelefono">Teléfono</label>
        <input type="text" id="regTelefono" bind:value={regTelefono} placeholder="Ej. 0991122334">
      </div>
      <div class="form-group">
        <label for="regEmail">Correo Institucional</label>
        <input type="email" id="regEmail" bind:value={regEmail} placeholder="Ej. ana.castro@uleam.edu.ec">
      </div>
      <div class="form-group">
        <label for="regRol">Rol</label>
        <select id="regRol" bind:value={regRol}>
          <option value="Estudiante">Estudiante</option>
          <option value="Docente">Docente</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" on:click={() => showRegister = false}>Cancelar</button>
      <button class="btn btn-primary" on:click={handleRegister}>Registrarse</button>
    </div>
  </div>
</div>

<!-- Toast Alert -->
<div class="toast-container">
  {#if toastVisible}
    <div class="toast {toastType} show">
      <span>
        {#if toastType === 'success'}✅{/if}
        {#if toastType === 'danger'}❌{/if}
        {#if toastType === 'warning'}⚠️{/if}
        {#if toastType === 'info'}💡{/if}
      </span>
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>