<script>
  /**
   * INTERFAZ: DASHBOARD ADMINISTRADOR
   * ------------------------------------
   * Funcionalidad: Panel de control con métricas en tiempo real del sistema.
   *
   * FRAMEWORK: SvelteKit + Svelte 5 (runes mode)
   * JAVASCRIPT/SVELTE: $derived para cómputo reactivo desde stores
   *
   * ESTADÍSTICAS REACTIVAS (se actualizan automáticamente con los stores):
   *   - totalUsers     → Total de usuarios registrados
   *   - totalBooks     → Total de libros en el catálogo
   *   - activeLoans    → Préstamos con status 'Activo' o 'Atrasado'
   *   - activeSanciones → Sanciones en estado 'Activa'
   *   - recentLoans    → Últimos 5 préstamos activos
   *   - recentQuejas   → Últimas 3 quejas recibidas
   *
   * ALMACENAMIENTO: Lee desde stores reactivos (localStorage)
   * INTERFACES RELACIONADAS: Catálogo, Préstamos, Sanciones, Reportes, Usuarios
   */
  import { loggedUser, usuarios, libros, prestamos, sanciones, quejas } from '$lib/store.js';
  import { goto } from '$app/navigation';

  // Reactivos
  const totalUsers = $derived($usuarios.length);
  const totalBooks = $derived($libros.length);
  const activeLoans = $derived($prestamos.filter(p => p.status === 'Activo' || p.status === 'Atrasado'));
  const activeSanciones = $derived($sanciones.filter(s => s.estado === 'Activa'));

  // Préstamos recientes (hasta 5)
  const recentLoans = $derived(activeLoans.slice(0, 5));

  // Quejas recientes (hasta 3)
  const recentQuejas = $derived($quejas.slice(0, 3));
</script>

<svelte:head>
  <title>Dashboard Administrador - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<!-- Header -->
<div class="page-header">
  <div class="page-title">
    <h2>Panel Administrativo General</h2>
    <p>Supervisa usuarios, inventario, sanciones y políticas del sistema autónomo</p>
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

<!-- Tarjetas de Estadísticas -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon secondary">👥</div>
    <div class="stat-info">
      <h3>{totalUsers}</h3>
      <p>Usuarios Registrados</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon primary">📖</div>
    <div class="stat-info">
      <h3>{totalBooks}</h3>
      <p>Libros en Catálogo</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon warning">📦</div>
    <div class="stat-info">
      <h3>{activeLoans.length}</h3>
      <p>Préstamos Activos</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon danger">⚠️</div>
    <div class="stat-info">
      <h3>{activeSanciones.length}</h3>
      <p>Sanciones Activas</p>
    </div>
  </div>
</div>

<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; align-items: start; flex-wrap: wrap;">
  <!-- Préstamos Recientes -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Préstamos Activos Recientes</h3>
      <button class="btn btn-outline btn-sm" onclick={() => goto('/admin/prestamos')}>Ver Todos</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Libro</th>
            <th>Fecha Límite</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {#each recentLoans as p}
            <tr>
              <td style="font-weight: 600;">{p.userNombre}</td>
              <td>{p.bookTitulo}</td>
              <td>{p.fechaDevolucion}</td>
              <td>
                <span class="badge {p.status === 'Atrasado' ? 'badge-danger' : 'badge-success'}">
                  {p.status}
                </span>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">
                No hay préstamos activos registrados.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Quejas y Sugerencias Recientes -->
  <div class="dashboard-card">
    <div class="card-title-bar">
      <h3>Reportes Recientes</h3>
      <button class="btn btn-outline btn-sm" onclick={() => goto('/admin/reportes')}>Ver Historial</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 15px;">
      {#each recentQuejas as q}
        <div style="background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong style="font-size: 0.9rem; color: var(--text-main);">{q.asunto}</strong>
            <span class="badge {q.estado === 'Resuelto' ? 'badge-success' : q.estado === 'En Proceso' ? 'badge-info' : 'badge-warning'}" style="font-size: 0.65rem;">
              {q.estado}
            </span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; line-height: 1.3;">
            {q.descripcion}
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
            <span>Por: {q.userNombre}</span>
            <span>{q.fecha}</span>
          </div>
        </div>
      {:else}
        <div style="text-align: center; color: var(--text-muted); padding: 20px;">
          No hay reportes de usuarios registrados.
        </div>
      {/each}
    </div>
  </div>
</div>