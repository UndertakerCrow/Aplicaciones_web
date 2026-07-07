<script>
  /**
   * INTERFAZ: GESTIÓN DE PRÉSTAMOS (Admin)
   * -----------------------------------------
   * Funcionalidad: Registro manual de préstamos y procesamiento de devoluciones.
   *
   * FRAMEWORK: SvelteKit + Svelte 5
   * JAVASCRIPT: Integración con actions del store para lógica de negocio
   *
   * FUNCIONALIDADES IDENTIFICADAS:
   *   - Listar todos los préstamos con búsqueda y filtro por estado
   *   - Registrar préstamo manual (selección de usuario y libro disponible)
   *   - Registrar devolución → calcula multa automática si hay retraso
   *   - Indicadores visuales de estado: Activo, Atrasado, Devuelto
   *
   * VALIDACIONES DE CAMPOS (JavaScript):
   *   - Requiere selección de usuario elegible (activo, no admin)
   *   - Requiere selección de libro con stock > 0
   *   - Delegada a actions.solicitarPrestamo() y actions.devolverPrestamo()
   *     que verifican: stock, límite de préstamos, estado del usuario
   *
   * ALMACENAMIENTO LOCAL:
   *   - prestamos store → actualizado vía actions (persiste en localStorage)
   *   - libros store → stock se decrementa/incrementa automáticamente
   *   - sanciones store → multas generadas se guardan automáticamente
   */
  import { loggedUser, prestamos, usuarios, libros, actions } from '$lib/store.js';
  import { goto } from '$app/navigation';

  let search = '';
  let statusFilter = '';
  let showModal = false;

  // Campos de modal manual
  let lnUserId = '';
  let lnBookId = '';

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

  // Filtrado reactivo de préstamos
  const filteredLoans = $derived($prestamos.filter(p => {
    const matchesSearch =
      (p.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.userNombre || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.bookTitulo || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  // Usuarios elegibles (activos y que no sean administrador)
  const eligibleUsers = $derived($usuarios.filter(u => u.estado === 'Activo' && u.rol !== 'Administrador'));

  // Libros con stock disponible
  const availableBooks = $derived($libros.filter(l => l.stock > 0));

  function showNewLoanModal() {
    if (eligibleUsers.length === 0) {
      triggerToast("No hay usuarios activos elegibles para préstamos.", "warning");
      return;
    }
    if (availableBooks.length === 0) {
      triggerToast("No hay libros disponibles con stock en catálogo.", "warning");
      return;
    }

    lnUserId = eligibleUsers[0].id;
    lnBookId = availableBooks[0].id.toString();
    showModal = true;
  }

  function closeLoanModal() {
    showModal = false;
  }

  function saveManualLoan() {
    if (!lnUserId || !lnBookId) {
      triggerToast("Por favor selecciona un usuario y un libro.", "warning");
      return;
    }

    const res = actions.solicitarPrestamo(lnBookId, lnUserId);
    closeLoanModal();

    if (res.success) {
      triggerToast("¡Préstamo registrado correctamente en el sistema!", "success");
    } else {
      triggerToast(res.message, "danger");
    }
  }

  function processReturn(loanId) {
    if (confirm(`¿Registrar devolución manual para el préstamo ${loanId}?`)) {
      const res = actions.devolverPrestamo(loanId);
      if (res.success) {
        if (res.multa > 0) {
          triggerToast(`Devolución registrada. Se generó automáticamente una multa de $${res.multa.toFixed(2)} por entrega tardía.`, "warning");
        } else {
          triggerToast("Devolución procesada con éxito y stock incrementado.", "success");
        }
      } else {
        triggerToast(res.message, "danger");
      }
    }
  }
</script>

<svelte:head>
  <title>Gestión de Préstamos - Admin ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Registro General de Préstamos</h2>
    <p>Supervisa las entregas activas, vencidas y registra salidas manuales de material</p>
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

<!-- Tabla Préstamos -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Préstamos en el Sistema</h3>
    <button class="btn btn-primary" onclick={showNewLoanModal}>➕ Registrar Salida Manual</button>
  </div>

  <div style="margin-bottom: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
    <div style="flex-grow: 1; min-width: 250px;">
      <input type="text" bind:value={search} placeholder="Buscar por código, usuario o libro...">
    </div>
    <div style="width: 200px;">
      <select bind:value={statusFilter}>
        <option value="">Todos los estados</option>
        <option value="Activo">Activos (Al día)</option>
        <option value="Atrasado">Atrasados (Vencidos)</option>
        <option value="Devuelto">Devueltos</option>
      </select>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Usuario / Prestatario</th>
          <th>Título del Libro</th>
          <th>Fecha Salida</th>
          <th>Fecha Límite</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredLoans as p}
          <tr>
            <td style="font-weight: 700; font-size: 0.85rem; color: var(--primary-dark);">{p.id}</td>
            <td style="font-weight: 600;">{p.userNombre}</td>
            <td>{p.bookTitulo}</td>
            <td>{p.fechaPrestamo}</td>
            <td><strong>{p.fechaDevolucion}</strong></td>
            <td>
              <span class="badge {p.status === 'Activo' ? 'badge-success' : p.status === 'Atrasado' ? 'badge-danger' : 'badge-info'}">
                {p.status}
              </span>
            </td>
            <td>
              {#if p.status !== 'Devuelto'}
                <button onclick={() => processReturn(p.id)} class="btn btn-outline btn-sm" style="color: var(--primary); border-color: var(--primary);">
                  Registrar Entrega
                </button>
              {:else}
                <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">Satisfecho</span>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 25px;">
              No se registraron préstamos con los criterios ingresados.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Modal Registrar Préstamo Manual -->
<div class="modal-overlay {showModal ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">
      <h4>Registrar Préstamo Manual</h4>
      <button class="btn-close" onclick={closeLoanModal}>&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label for="lnUser">Seleccionar Usuario</label>
        <select id="lnUser" bind:value={lnUserId}>
          {#each eligibleUsers as u}
            <option value={u.id}>{u.nombre} ({u.rol})</option>
          {/each}
        </select>
      </div>
      <div class="form-group">
        <label for="lnBook">Seleccionar Libro</label>
        <select id="lnBook" bind:value={lnBookId}>
          {#each availableBooks as l}
            <option value={l.id.toString()}>{l.titulo} - Stock: {l.stock}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick={closeLoanModal}>Cancelar</button>
      <button class="btn btn-primary" onclick={saveManualLoan}>Registrar Préstamo</button>
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