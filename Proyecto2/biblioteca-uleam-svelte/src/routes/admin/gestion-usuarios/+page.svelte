<script>
  let usuarios = [
    { id: 1001, nombre: "Juan Pérez", correo: "estudiante@uleam.edu.ec", rol: "Estudiante", estado: "Activo" },
    { id: 1002, nombre: "María López", correo: "docente@uleam.edu.ec", rol: "Docente", estado: "Activo" },
    { id: 1003, nombre: "Carlos Mendoza", correo: "cmendoza@uleam.edu.ec", rol: "Estudiante", estado: "Bloqueado" }
  ];
</script>

<svelte:head>
  <title>Gestión de Usuarios - Admin ULEAM</title>
</svelte:head>

<div class="app">
  <!-- Sidebar (reutilizable) -->
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios" class="active">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo">📖 Catálogo</a>
      <a href="/admin/prestamos">📚 Préstamos</a>
      <a href="/admin/sanciones">⚠️ Sanciones</a>
      <a href="/admin/reportes">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <!-- Main -->
  <main>
    <header>
      <h1>Gestión de Usuarios</h1>
    </header>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each usuarios as usuario}
          <tr>
            <td>{usuario.id}</td>
            <td>{usuario.nombre}</td>
            <td>{usuario.correo}</td>
            <td>{usuario.rol}</td>
            <td>
              <span class="estado" class:active={usuario.estado === 'Activo'}>
                {usuario.estado}
              </span>
            </td>
            <td>
              <button class="btn-edit">Editar</button>
              <button class="btn-block">Bloquear</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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
  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  th { background: #006633; color: white; }
  .estado {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  .estado.active { background: #d1fae5; color: #10b981; }
  .btn-edit {
    background: #006633;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    margin-right: 8px;
    cursor: pointer;
  }
  .btn-block {
    background: #C8102E;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
</style>