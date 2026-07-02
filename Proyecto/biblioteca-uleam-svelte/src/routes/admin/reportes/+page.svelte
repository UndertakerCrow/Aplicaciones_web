<script>
  let reportes = [
    { titulo: "Préstamos por Mes", valor: "428", unidad: "préstamos", color: "#006633" },
    { titulo: "Libros Más Prestados", valor: "Cien Años de Soledad", unidad: "42 préstamos", color: "#006633" },
    { titulo: "Usuarios Sancionados", valor: "12", unidad: "usuarios", color: "#C8102E" },
    { titulo: "Tasa de Devolución", valor: "94%", unidad: "a tiempo", color: "#10b981" }
  ];
</script>

<svelte:head>
  <title>Reportes - Admin ULEAM</title>
</svelte:head>

<div class="app">
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo">📖 Catálogo</a>
      <a href="/admin/prestamos">📚 Préstamos</a>
      <a href="/admin/sanciones">⚠️ Sanciones</a>
      <a href="/admin/reportes" class="active">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <main>
    <header>
      <h1>Reportes y Estadísticas</h1>
    </header>

    <div class="reports-grid">
      {#each reportes as reporte}
        <div class="report-card">
          <h3>{reporte.titulo}</h3>
          <p class="big-value" style="color: {reporte.color};">{reporte.valor}</p>
          <p class="unit">{reporte.unidad}</p>
        </div>
      {/each}
    </div>

    <div class="center">
      <button on:click={() => alert('📄 Reporte completo generado (PDF)')}>
        Generar Reporte Completo (PDF)
      </button>
    </div>
  </main>
</div>

<style>
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 260px; background: #006633; color: white; padding: 20px; }
  .logo { font-size: 1.8rem; font-weight: bold; margin-bottom: 30px; }
  nav a { display: block; padding: 14px 20px; color: white; text-decoration: none; border-radius: 10px; margin-bottom: 6px; }
  nav a.active, nav a:hover { background: rgba(255,255,255,0.2); }
  .logout { margin-top: auto; width: 100%; padding: 12px; background: #C8102E; color: white; border: none; border-radius: 10px; cursor: pointer; }
  main { flex: 1; padding: 30px; }
  .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  .report-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    text-align: center;
  }
  .big-value {
    font-size: 3rem;
    font-weight: bold;
    margin: 15px 0;
  }
  .center {
    text-align: center;
    margin-top: 40px;
  }
  button {
    background: #006633;
    color: white;
    padding: 16px 40px;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    cursor: pointer;
  }
</style>