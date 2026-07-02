<script>
  import { loggedUser, config, sanciones, usuarios, actions } from '$lib/store.js';
  import { goto } from '$app/navigation';

  // Variables para la configuración del sistema (Políticas)
  let cfgMulta = $config.multaDia;
  let cfgDias = $config.diasMaximo;
  let cfgMaxBooks = $config.limiteLibros;
  let cfgAutoSan = $config.sancionAutomatica;

  // Variables para aplicar una sanción manual
  let sanUserId = '';
  let sanTipo = 'Multa económica';
  let sanMonto = 0.00;
  let sanMotivo = '';

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

  // Lista de usuarios sancionables (no administradores)
  $: penalizableUsers = $usuarios.filter(u => u.rol !== 'Administrador');

  // Inicializar el select de usuarios si hay disponibles
  $: {
    if (penalizableUsers.length > 0 && !sanUserId) {
      sanUserId = penalizableUsers[0].id;
    }
  }

  function saveConfig() {
    const multaDia = parseFloat(cfgMulta);
    const diasMaximo = parseInt(cfgDias);
    const limiteLibros = parseInt(cfgMaxBooks);

    if (isNaN(multaDia) || isNaN(diasMaximo) || isNaN(limiteLibros)) {
      triggerToast("Por favor, ingresa valores válidos en la configuración.", "warning");
      return;
    }

    config.set({
      multaDia,
      diasMaximo,
      limiteLibros,
      sancionAutomatica: cfgAutoSan
    });

    triggerToast("¡Políticas de la Biblioteca Inteligente actualizadas correctamente!", "success");
  }

  function applySanction() {
    const userObj = penalizableUsers.find(u => u.id === sanUserId);
    if (!userObj) {
      triggerToast("Selecciona un usuario válido.", "warning");
      return;
    }

    if (!sanMotivo.trim()) {
      triggerToast("Por favor, ingresa el motivo de la sanción.", "warning");
      return;
    }

    actions.aplicarSancion({
      userId: sanUserId,
      userNombre: userObj.nombre,
      tipo: sanTipo,
      monto: parseFloat(sanMonto || 0),
      motivo: sanMotivo.trim()
    });

    triggerToast(`Sanción aplicada exitosamente a ${userObj.nombre}. El usuario fue bloqueado temporalmente.`, "success");

    sanMotivo = '';
    sanMonto = 0.00;
  }

  function processResolve(id) {
    if (confirm(`¿Levantar la penalidad ${id}? Si el usuario no tiene más sanciones activas, será reactivado.`)) {
      const success = actions.levantarSancion(id);
      if (success) {
        triggerToast("La penalidad fue levantada y se recalculó el estado del usuario.", "success");
      } else {
        triggerToast("Ocurrió un error al intentar levantar la sanción.", "danger");
      }
    }
  }
</script>

<svelte:head>
  <title>Gestión de Sanciones y Políticas - Admin ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Configuración de Políticas y Sanciones</h2>
    <p>Define multas por entrega tardía, plazos de préstamo y aplica/levanta sanciones a infractores</p>
  </div>
  
  {#if $loggedUser}
    <div class="user-profile-badge" on:click={() => goto('/estudiante/perfil')}>
      <div class="avatar-container">{($loggedUser.nombre || '').charAt(0)}</div>
      <div class="user-meta">
        <strong>{$loggedUser.nombre}</strong>
        <span>{$loggedUser.rol}</span>
      </div>
    </div>
  {/if}
</div>

<!-- Configuración de Políticas y Nueva Sanción -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; margin-bottom: 30px; flex-wrap: wrap;">
  <!-- Panel 1: Políticas de Préstamo -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Políticas de Préstamo y Multas</h3>
    </div>
    
    <div class="form-group">
      <label for="cfgMulta">Multa Diaria por Retraso ($)</label>
      <input type="number" id="cfgMulta" step="0.1" bind:value={cfgMulta} placeholder="Ej. 1.50">
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="form-group">
        <label for="cfgDias">Días Máx. Préstamo</label>
        <input type="number" id="cfgDias" bind:value={cfgDias} placeholder="Ej. 7">
      </div>
      <div class="form-group">
        <label for="cfgMaxBooks">Límite Libros Activos</label>
        <input type="number" id="cfgMaxBooks" bind:value={cfgMaxBooks} placeholder="Ej. 3">
      </div>
    </div>

    <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px; margin: 15px 0;">
      <input type="checkbox" id="cfgAutoSan" bind:checked={cfgAutoSan} style="width: auto; cursor: pointer;">
      <label for="cfgAutoSan" style="cursor: pointer; font-size: 0.9rem;">Habilitar Sanciones Automáticas por Retraso</label>
    </div>

    <button on:click={saveConfig} class="btn btn-primary" style="width: 100%; justify-content: center;">
      Guardar Políticas del Sistema
    </button>
  </div>

  <!-- Panel 2: Registrar Sanción Manual -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Aplicar Sanción Manual</h3>
    </div>
    
    <div class="form-group">
      <label for="sanUser">Seleccionar Infractor</label>
      <select id="sanUser" bind:value={sanUserId}>
        {#each penalizableUsers as u}
          <option value={u.id}>{u.nombre} ({u.rol} - ID: {u.id})</option>
        {/each}
      </select>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="form-group">
        <label for="sanTipo">Tipo de Penalidad</label>
        <select id="sanTipo" bind:value={sanTipo}>
          <option value="Multa económica">Multa económica</option>
          <option value="Suspensión temporal (7 días)">Suspensión temporal (7 días)</option>
          <option value="Suspensión temporal (15 días)">Suspensión temporal (15 días)</option>
          <option value="Bloqueo definitivo">Bloqueo definitivo</option>
        </select>
      </div>
      <div class="form-group">
        <label for="sanMonto">Monto de Multa ($)</label>
        <input type="number" id="sanMonto" step="0.5" bind:value={sanMonto}>
      </div>
    </div>

    <div class="form-group">
      <label for="sanMotivo">Motivo / Descripción de la Sanción</label>
      <input type="text" id="sanMotivo" bind:value={sanMotivo} placeholder="Ej. Retornó libro con páginas rotas...">
    </div>

    <button on:click={applySanction} class="btn btn-danger" style="width: 100%; justify-content: center;">
      Confirmar Aplicación de Sanción
    </button>
  </div>
</div>

<!-- Tabla Sanciones Activas -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Registro de Penalidades</h3>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Código Fine</th>
          <th>Usuario Afectado</th>
          <th>Tipo Sanción</th>
          <th>Fecha Emisión</th>
          <th>Monto Fijo</th>
          <th>Detalle / Motivo</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {#each $sanciones as s}
          <tr>
            <td style="font-weight: 700; font-size: 0.85rem; color: var(--danger);">{s.id}</td>
            <td style="font-weight: 600;">{s.userNombre}</td>
            <td>{s.tipo}</td>
            <td>{s.fecha}</td>
            <td><strong>${parseFloat(s.monto).toFixed(2)}</strong></td>
            <td style="font-size: 0.85rem; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title={s.motivo}>{s.motivo}</td>
            <td>
              <span class="badge {s.estado === 'Activa' ? 'badge-danger' : 'badge-success'}">
                {s.estado}
              </span>
            </td>
            <td>
              {#if s.estado === 'Activa'}
                <button on:click={() => processResolve(s.id)} class="btn btn-outline btn-sm" style="color: var(--primary); border-color: var(--primary);">
                  Levantar Penalidad
                </button>
              {:else}
                <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">Solucionado</span>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 25px;">
              No hay registro de sanciones vigentes en el sistema.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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