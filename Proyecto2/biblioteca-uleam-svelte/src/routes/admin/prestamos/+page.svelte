<script>
  let prestamos = [
    { libro: "Cien Años de Soledad", usuario: "Juan Pérez López", fechaPrestamo: "28/04/2026", fechaDevolucion: "12/05/2026", estado: "Activo" },
    { libro: "1984", usuario: "María López Ramírez", fechaPrestamo: "25/04/2026", fechaDevolucion: "09/05/2026", estado: "Activo" },
    { libro: "El Principito", usuario: "Carlos Mendoza", fechaPrestamo: "20/04/2026", fechaDevolucion: "04/05/2026", estado: "Por vencer" },
    { libro: "Rayuela", usuario: "Ana Rodríguez", fechaPrestamo: "15/04/2026", fechaDevolucion: "29/04/2026", estado: "Activo" },
    { libro: "Don Quijote de la Mancha", usuario: "Luis García", fechaPrestamo: "10/04/2026", fechaDevolucion: "24/04/2026", estado: "Devuelto" },
    { libro: "La Casa de los Espíritus", usuario: "Sofía Morales", fechaPrestamo: "05/04/2026", fechaDevolucion: "19/04/2026", estado: "Activo" },
    { libro: "Ficciones", usuario: "Pedro Sánchez", fechaPrestamo: "01/04/2026", fechaDevolucion: "15/04/2026", estado: "Por vencer" },
    { libro: "El Alquimista", usuario: "Laura Torres", fechaPrestamo: "28/03/2026", fechaDevolucion: "11/04/2026", estado: "Activo" }
  ];

  function marcarDevuelto(index) {
    if (confirm("¿Marcar como devuelto?")) {
      prestamos[index].estado = "Devuelto";
      prestamos = prestamos;
    }
  }
</script>

<svelte:head>
  <title>Préstamos - Admin ULEAM</title>
</svelte:head>

<div class="app">
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo">📖 Catálogo</a>
      <a href="/admin/prestamos" class="active">📚 Préstamos</a>
      <a href="/admin/sanciones">⚠️ Sanciones</a>
      <a href="/admin/reportes">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <main>
    <header>
      <h1>Préstamos Activos ({prestamos.length})</h1>
    </header>

    <table>
      <thead>
        <tr>
          <th>Libro</th>
          <th>Usuario</th>
          <th>Fecha Préstamo</th>
          <th>Fecha Devolución</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each prestamos as prestamo, index}
          <tr>
            <td>{prestamo.libro}</td>
            <td>{prestamo.usuario}</td>
            <td>{prestamo.fechaPrestamo}</td>
            <td>{prestamo.fechaDevolucion}</td>
            <td>
              <span class="estado" class:activo={prestamo.estado === 'Activo'} class:porvencer={prestamo.estado === 'Por vencer'}>
                {prestamo.estado}
              </span>
            </td>
            <td>
              {#if prestamo.estado !== 'Devuelto'}
                <button on:click={() => marcarDevuelto(index)}>Marcar Devuelto</button>
              {/if}
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
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  th, td { padding: 14px; border-bottom: 1px solid #eee; }
  th { background: #006633; color: white; }
  .estado { padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; }
  .estado.activo { background: #d1fae5; color: #10b981; }
  .estado.porvencer { background: #fef3c7; color: #d97706; }
</style>