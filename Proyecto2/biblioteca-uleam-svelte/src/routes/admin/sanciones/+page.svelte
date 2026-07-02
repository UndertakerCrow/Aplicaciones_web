<script>
  let sanciones = [
    { 
      usuario: "Carlos Mendoza", 
      tipo: "Suspensión temporal (7 días)", 
      fecha: "03/05/2026", 
      motivo: "Retraso en devolución de libro" 
    },
    { 
      usuario: "Ana Rodríguez", 
      tipo: "Multa económica", 
      fecha: "28/04/2026", 
      motivo: "Daño al libro" 
    },
    { 
      usuario: "Luis García", 
      tipo: "Suspensión temporal (15 días)", 
      fecha: "20/04/2026", 
      motivo: "Préstamo no devuelto" 
    },
    { 
      usuario: "Sofía Morales", 
      tipo: "Advertencia", 
      fecha: "15/04/2026", 
      motivo: "Daño menor al material" 
    }
  ];

  function aplicarSancion() {
    alert("✅ Sanción aplicada correctamente.");
  }

  function levantarSancion(index) {
    if (confirm("¿Levantar esta sanción?")) {
      sanciones.splice(index, 1);
      sanciones = sanciones;
    }
  }
</script>

<svelte:head>
  <title>Sanciones - Admin ULEAM</title>
</svelte:head>

<div class="app">
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo">📖 Catálogo</a>
      <a href="/admin/prestamos">📚 Préstamos</a>
      <a href="/admin/sanciones" class="active">⚠️ Sanciones</a>
      <a href="/admin/reportes">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <main>
    <header>
      <h1>Gestión de Sanciones ({sanciones.length} activas)</h1>
    </header>

    <!-- Formulario -->
    <div class="form-card">
      <h3>Aplicar Nueva Sanción</h3>
      <select>
        <option>Juan Pérez López</option>
        <option>María López Ramírez</option>
        <option>Carlos Mendoza</option>
        <option>Ana Rodríguez</option>
      </select>
      <select>
        <option>Suspensión temporal (7 días)</option>
        <option>Suspensión temporal (15 días)</option>
        <option>Multa económica</option>
        <option>Bloqueo definitivo</option>
        <option>Advertencia</option>
      </select>
      <textarea placeholder="Motivo de la sanción..."></textarea>
      <button on:click={aplicarSancion}>Aplicar Sanción</button>
    </div>

    <!-- Lista de sanciones -->
    <h3>Sanciones Activas</h3>
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Motivo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each sanciones as sancion, index}
          <tr>
            <td>{sancion.usuario}</td>
            <td>{sancion.tipo}</td>
            <td>{sancion.fecha}</td>
            <td>{sancion.motivo}</td>
            <td>
              <button on:click={() => levantarSancion(index)}>Levantar Sanción</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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
  .form-card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); margin-bottom: 30px; }
  select, textarea { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  th, td { padding: 14px; border-bottom: 1px solid #eee; }
  th { background: #006633; color: white; }
</style>