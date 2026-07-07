<script>
  /**
   * INTERFAZ: DASHBOARD ESTUDIANTE / DOCENTE
   * ------------------------------------------
   * Funcionalidad: Panel de inicio personalizado para el usuario autenticado.
   *
   * FRAMEWORK: SvelteKit + Svelte 5 ($derived runes)
   * JAVASCRIPT: Cálculos de fechas con Date API, filtrado reactivo
   *
   * FUNCIONALIDADES IDENTIFICADAS:
   *   - Tarjeta: cantidad de préstamos activos del usuario
   *   - Tarjeta: libros por devolver en los próximos 2 días (alerta temprana)
   *   - Tarjeta: total de multas pendientes en dólares
   *   - Sección de recomendaciones: libros con stock disponible (4 primeros)
   *   - Acceso rápido al catálogo completo
   *
   * ALMACENAMIENTO LOCAL:
   *   - Lee desde stores: $prestamos, $sanciones, $libros (filtrados por $loggedUser.id)
   *   - No realiza escritura directa (solo lectura reactiva)
   *
   * VALIDACIONES JAVASCRIPT:
   *   - Comparación de fechas para detectar vencimientos próximos
   *   - Filtros: userId, status, stock > 0
   */
  import { loggedUser, prestamos, sanciones, libros } from '$lib/store.js';
  import { goto } from '$app/navigation';
  
  // Calcular estadísticas dinámicamente suscribiéndose a los stores
  const userLoans = $derived($prestamos.filter(p => p.userId === $loggedUser?.id));
  const activeLoans = $derived(userLoans.filter(p => p.status === 'Activo' || p.status === 'Atrasado'));
  
  // Vencimiento pronto
  const nearDueLoans = $derived(() => {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);
    return activeLoans.filter(p => {
      const due = new Date(p.fechaDevolucion);
      return due >= today && due <= twoDaysLater;
    });
  });

  // Multas
  const userSanciones = $derived($sanciones.filter(s => s.userId === $loggedUser?.id && s.estado === 'Activa'));
  const totalFines = $derived(userSanciones.reduce((sum, s) => sum + s.monto, 0));

  // Catálogo recomendado (libros con stock > 0, tomamos 4 primeros)
  const recommended = $derived($libros.filter(l => l.stock > 0).slice(0, 4));
</script>

<svelte:head>
  <title>Inicio Estudiante - Biblioteca Inteligente ULEAM</title>
</svelte:head>

<!-- Tarjetas de Estadísticas -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon secondary">📚</div>
    <div class="stat-info">
      <h3>{activeLoans.length}</h3>
      <p>Préstamos Activos</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon warning">🕒</div>
    <div class="stat-info">
      <h3>{nearDueLoans.length}</h3>
      <p>Por Devolver Pronto</p>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon danger">💵</div>
    <div class="stat-info">
      <h3>${totalFines.toFixed(2)}</h3>
      <p>Multas Pendientes</p>
    </div>
  </div>
</div>

<!-- Sección Recomendados -->
<div class="dashboard-card">
  <div class="card-title-bar">
    <h3>Recomendaciones Inteligentes para ti</h3>
    <button class="btn btn-outline btn-sm" onclick={() => goto('/estudiante/catalogo')}>Ver Catálogo Completo</button>
  </div>

  <div class="books-grid">
    {#each recommended as l}
      <div class="book-card">
        <div class="book-cover-mock" style="background: {l.color}">
          <span class="category">{l.categoria}</span>
          <span class="cover-title">{l.titulo}</span>
        </div>
        <div class="book-details">
          <h4>{l.titulo}</h4>
          <p class="author">{l.autor}</p>
          <div class="meta">
            <span class="stock-badge available">Disp: {l.stock}</span>
            <button onclick={() => goto(`/estudiante/catalogo?search=${encodeURIComponent(l.titulo)}`)} class="btn btn-primary btn-sm">Ver Detalle</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>