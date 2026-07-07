<script>
  /**
   * INTERFAZ: REPORTES Y GESTIÓN DE QUEJAS (Admin)
   * --------------------------------------------------
   * Funcionalidad: Generación de reportes descargables y atención de quejas.
   *
   * FRAMEWORK: SvelteKit + Svelte 5
   * JAVASCRIPT: Blob API para exportación JSON, lógica de estados de queja
   *
   * FUNCIONALIDADES IDENTIFICADAS:
   *   - Descargar reporte de Préstamos en formato JSON (Blob + URL.createObjectURL)
   *   - Descargar reporte de Inventario de libros en formato JSON
   *   - Descargar reporte de Sanciones y multas en formato JSON
   *   - Bandeja de quejas: ver todas las quejas de estudiantes
   *   - Flujo de atención: Recibido → En Proceso → Resuelto
   *
   * ALMACENAMIENTO LOCAL:
   *   - quejas.update() → persiste cambios de estado en localStorage
   *   - Reportes se generan leyendo directamente los stores ($prestamos, $libros, $sanciones)
   *
   * JSON UTILIZADO:
   *   - Los reportes exportados son el JSON serializado de los stores
   *   - Nombre de archivo incluye fecha actual: reporte_biblioteca_{tipo}_{fecha}.json
   */
  import { loggedUser, quejas, prestamos, libros, sanciones } from '$lib/store.js';
  import { goto } from '$app/navigation';

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

  // Descargar reporte simulado en JSON
  function downloadReport(type) {
    let data = [];
    if (type === 'prestamos') data = $prestamos;
    if (type === 'libros') data = $libros;
    if (type === 'sanciones') data = $sanciones;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_biblioteca_${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    triggerToast(`¡Reporte de ${type} descargado con éxito!`, "success");
  }

  // Actualizar Estado Queja
  function updateComplaintStatus(id, newStatus) {
    quejas.update(list => {
      const idx = list.findIndex(q => q.id === id);
      if (idx !== -1) {
        list[idx].estado = newStatus;
        triggerToast(`El reporte ${id} fue actualizado a '${newStatus}'.`, "success");
      }
      return list;
    });
  }
</script>

<svelte:head>
  <title>Reportes y Consultas - Admin ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Reportes y Gestión de Quejas</h2>
    <p>Consulta reportes operacionales del sistema y atiende las sugerencias de la comunidad universitaria</p>
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

<!-- Sección Descarga de Reportes -->
<div class="dashboard-card" style="margin-bottom: 30px;">
  <div class="card-title-bar">
    <h3>Descarga de Reportes de Control</h3>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px; text-align: center;">
      <div style="font-size: 32px; margin-bottom: 10px;">📦</div>
      <h4 style="margin-bottom: 8px;">Reporte de Préstamos</h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">Listado total de préstamos activos, devueltos y atrasados en formato de datos.</p>
      <button onclick={() => downloadReport('prestamos')} class="btn btn-outline btn-sm" style="width: 100%; justify-content: center; color: var(--secondary); border-color: var(--secondary);">Generar Reporte</button>
    </div>

    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px; text-align: center;">
      <div style="font-size: 32px; margin-bottom: 10px;">📖</div>
      <h4 style="margin-bottom: 8px;">Reporte de Inventario</h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">Estadísticas del catálogo, stock disponible, libros más leídos y categorías.</p>
      <button onclick={() => downloadReport('libros')} class="btn btn-outline btn-sm" style="width: 100%; justify-content: center; color: var(--secondary); border-color: var(--secondary);">Generar Reporte</button>
    </div>

    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px; text-align: center;">
      <div style="font-size: 32px; margin-bottom: 10px;">⚠️</div>
      <h4 style="margin-bottom: 8px;">Reporte de Fines y Faltas</h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">Listado de multas y sanciones aplicadas, recaudación y penalidades activas.</p>
      <button onclick={() => downloadReport('sanciones')} class="btn btn-outline btn-sm" style="width: 100%; justify-content: center; color: var(--secondary); border-color: var(--secondary);">Generar Reporte</button>
    </div>
  </div>
</div>

<!-- Tabla de Quejas Recibidas -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Bandeja de Quejas y Sugerencias de Estudiantes</h3>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Usuario</th>
          <th>Asunto</th>
          <th>Descripción Detallada</th>
          <th>Fecha de Reporte</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {#each $quejas as q}
          <tr>
            <td style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted);">{q.id}</td>
            <td style="font-weight: 600;">{q.userNombre}</td>
            <td style="font-weight: 600;">{q.asunto}</td>
            <td style="font-size: 0.85rem; max-width: 280px;" title={q.descripcion}>{q.descripcion}</td>
            <td>{q.fecha}</td>
            <td>
              <span class="badge {q.estado === 'Resuelto' ? 'badge-success' : q.estado === 'En Proceso' ? 'badge-info' : 'badge-warning'}">
                {q.estado}
              </span>
            </td>
            <td>
              {#if q.estado === 'Recibido'}
                <button onclick={() => updateComplaintStatus(q.id, 'En Proceso')} class="btn btn-outline btn-sm" style="color: var(--secondary); border-color: var(--secondary);">Atender</button>
              {:else if q.estado === 'En Proceso'}
                <button onclick={() => updateComplaintStatus(q.id, 'Resuelto')} class="btn btn-primary btn-sm">Marcar Resuelto</button>
              {:else}
                <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">Cerrada</span>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 25px;">
              No hay reportes de quejas o sugerencias en la bandeja.
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