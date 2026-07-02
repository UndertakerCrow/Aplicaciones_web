<script>
  let libros = [
    { titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", año: 1967, categoria: "Literatura Latinoamericana" },
    { titulo: "El Amor en los Tiempos del Cólera", autor: "Gabriel García Márquez", año: 1985, categoria: "Romance" },
    { titulo: "Crónica de una Muerte Anunciada", autor: "Gabriel García Márquez", año: 1981, categoria: "Novela" },
    { titulo: "1984", autor: "George Orwell", año: 1949, categoria: "Distopía" },
    { titulo: "Rebelión en la Granja", autor: "George Orwell", año: 1945, categoria: "Política" },
    { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", año: 1943, categoria: "Literatura Infantil" },
    { titulo: "Rayuela", autor: "Julio Cortázar", año: 1963, categoria: "Literatura Experimental" },
    { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", año: 1605, categoria: "Clásico Español" },
    { titulo: "La Casa de los Espíritus", autor: "Isabel Allende", año: 1982, categoria: "Realismo Mágico" },
    { titulo: "Ficciones", autor: "Jorge Luis Borges", año: 1944, categoria: "Literatura Fantástica" },
    // ... (más de 100 libros del archivo)
    { titulo: "Siddhartha", autor: "Hermann Hesse", año: 1922, categoria: "Espiritualidad" },
    { titulo: "Demian", autor: "Hermann Hesse", año: 1919, categoria: "Novela" }
  ];

  function registrarNuevo() {
    alert("✅ Nuevo libro registrado correctamente.");
  }
</script>

<svelte:head>
  <title>Administrar Catálogo - Admin ULEAM</title>
</svelte:head>

<div class="app">
  <aside class="sidebar">
    <div class="logo">⚙️ Admin ULEAM</div>
    <nav>
      <a href="/admin">🏠 Dashboard</a>
      <a href="/admin/gestion-usuarios">👥 Gestión de Usuarios</a>
      <a href="/admin/catalogo" class="active">📖 Catálogo</a>
      <a href="/admin/prestamos">📚 Préstamos</a>
      <a href="/admin/sanciones">⚠️ Sanciones</a>
      <a href="/admin/reportes">📊 Reportes</a>
    </nav>
    <button class="logout" on:click={() => window.location.href = '/'}>Cerrar Sesión</button>
  </aside>

  <main>
    <header>
      <h1>Administrar Catálogo</h1>
    </header>

    <div class="form-card">
      <h3>Registrar Nuevo Libro</h3>
      <input type="text" placeholder="Título del libro" />
      <input type="text" placeholder="Autor" />
      <input type="text" placeholder="ISBN" />
      <input type="number" placeholder="Año de publicación" />
      <select>
        <option>Literatura</option>
        <option>Ciencia</option>
        <option>Historia</option>
        <option>Tecnología</option>
      </select>
      <button on:click={registrarNuevo}>Registrar Libro</button>
    </div>

    <h3>Libros Registrados ({libros.length})</h3>
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Autor</th>
          <th>Año</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each libros as libro}
          <tr>
            <td>{libro.titulo}</td>
            <td>{libro.autor}</td>
            <td>{libro.año}</td>
            <td>{libro.categoria}</td>
            <td>
              <button>Editar</button>
              <button style="background:#C8102E;">Eliminar</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </main>
</div>

<style>
  /* Estilos iguales a los anteriores */
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 260px; background: #006633; color: white; padding: 20px; }
  .logo { font-size: 1.8rem; font-weight: bold; margin-bottom: 30px; }
  nav a { display: block; padding: 14px 20px; color: white; text-decoration: none; border-radius: 10px; margin-bottom: 6px; }
  nav a.active, nav a:hover { background: rgba(255,255,255,0.2); }
  .logout { margin-top: auto; width: 100%; padding: 12px; background: #C8102E; color: white; border: none; border-radius: 10px; cursor: pointer; }
  main { flex: 1; padding: 30px; }
  .form-card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); margin-bottom: 30px; }
  input, select { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  th, td { padding: 14px; border-bottom: 1px solid #eee; }
  th { background: #006633; color: white; }
</style>