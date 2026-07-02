<script>
  let stats = [
    { label: "Total Usuarios", value: "1,847", color: "#006633" },
    { label: "Libros en Catálogo", value: "8,942", color: "#006633" },
    { label: "Préstamos Activos", value: "387", color: "#d97706" },
    { label: "Multas Pendientes", value: "24", color: "#C8102E" }
  ];
</script>

<svelte:head>
  <title>Panel de Administración - Biblioteca ULEAM</title>
</svelte:head>

<div class="app">
  <!-- Sidebar Admin -->
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin" class="active">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo">📖 Catálogo</a>
      <a href="/admin/prestamos">📚 Préstamos</a>
      <a href="/admin/sanciones">⚠️ Sanciones</a>
      <a href="/admin/reportes">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <!-- Main Content -->
  <main>
    <header>
      <h1>Panel de Administración</h1>
    </header>

    <div class="stats-grid">
      {#each stats as stat}
        <div class="stat-card">
          <h3>{stat.label}</h3>
          <p class="value" style="color: {stat.color};">{stat.value}</p>
        </div>
      {/each}
    </div>

    <h2 style="margin-top: 40px;">Acciones Rápidas</h2>
    <div class="actions-grid">
      <div class="action-card" on:click={() => alert('Gestión de Usuarios')}>
        👥 Gestión de Usuarios
      </div>
      <div class="action-card" on:click={() => alert('Administrar Catálogo')}>
        📖 Administrar Catálogo
      </div>
      <div class="action-card" on:click={() => alert('Ver Reportes')}>
        📊 Reportes y Estadísticas
      </div>
    </div>
  </main>
</div>

<style>
  .app { display: flex; min-height: 100vh; }
  .sidebar {
    width: 260px;
    background: #006633;
    color: white;
    padding: 20px;
  }
  .logo { font-size: 1.8rem; font-weight: bold; margin-bottom: 30px; }
  nav a {
    display: block;
    padding: 14px 20px;
    color: white;
    text-decoration: none;
    border-radius: 10px;
    margin-bottom: 6px;
  }
  nav a.active, nav a:hover { background: rgba(255,255,255,0.2); }
  .logout {
    margin-top: auto;
    width: 100%;
    padding: 12px;
    background: #C8102E;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  main { flex: 1; padding: 30px; }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  .stat-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  .value {
    font-size: 2.8rem;
    font-weight: bold;
    margin-top: 10px;
  }
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  .action-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    cursor: pointer;
    font-size: 1.2rem;
  }
  .action-card:hover {
    transform: translateY(-5px);
  }
</style>