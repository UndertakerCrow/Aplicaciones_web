// app-state.js
// Manejo del estado centralizado en localStorage para la Biblioteca Inteligente ULEAM

const DEFAULT_BOOKS = [
  { id: 1, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", anio: 1967, categoria: "Literatura Latinoamericana", isbn: "978-0307474728", paginas: 496, precio: 15.99, stock: 5, color: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { id: 2, titulo: "El Amor en los Tiempos del Cólera", autor: "Gabriel García Márquez", anio: 1985, categoria: "Romance", isbn: "978-0307474773", paginas: 368, precio: 14.50, stock: 3, color: "linear-gradient(135deg, #ec4899, #be185d)" },
  { id: 3, titulo: "Crónica de una Muerte Anunciada", autor: "Gabriel García Márquez", anio: 1981, categoria: "Novela", isbn: "978-1400034956", paginas: 120, precio: 10.99, stock: 4, color: "linear-gradient(135deg, #ef4444, #b91c1c)" },
  { id: 4, titulo: "1984", autor: "George Orwell", anio: 1949, categoria: "Distopía", isbn: "978-0451524935", paginas: 328, precio: 9.99, stock: 2, color: "linear-gradient(135deg, #4b5563, #1f2937)" },
  { id: 5, titulo: "Rebelión en la Granja", autor: "George Orwell", anio: 1945, categoria: "Política", isbn: "978-8420658421", paginas: 144, precio: 8.50, stock: 6, color: "linear-gradient(135deg, #10b981, #047857)" },
  { id: 6, titulo: "El Principito", autor: "Antoine de Saint-Exupéry", anio: 1943, categoria: "Literatura Infantil", isbn: "978-0156012195", paginas: 96, precio: 6.99, stock: 8, color: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { id: 7, titulo: "Rayuela", autor: "Julio Cortázar", anio: 1963, categoria: "Literatura Experimental", isbn: "978-0307474735", paginas: 600, precio: 18.50, stock: 3, color: "linear-gradient(135deg, #8b5cf6, #6d28d9)" },
  { id: 8, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", anio: 1605, categoria: "Clásico Español", isbn: "978-8420668291", paginas: 1024, precio: 22.00, stock: 4, color: "linear-gradient(135deg, #f59e0b, #b45309)" },
  { id: 9, titulo: "La Casa de los Espíritus", autor: "Isabel Allende", anio: 1982, categoria: "Realismo Mágico", isbn: "978-0307474759", paginas: 432, precio: 13.99, stock: 3, color: "linear-gradient(135deg, #10b981, #065f46)" },
  { id: 10, titulo: "Ficciones", autor: "Jorge Luis Borges", anio: 1944, categoria: "Literatura Fantástica", isbn: "978-1400030040", paginas: 224, precio: 12.00, stock: 2, color: "linear-gradient(135deg, #6366f1, #4338ca)" },
  { id: 11, titulo: "El Alquimista", autor: "Paulo Coelho", anio: 1988, categoria: "Ficción Espiritual", isbn: "978-0062315007", paginas: 208, precio: 12.99, stock: 5, color: "linear-gradient(135deg, #eab308, #ca8a04)" },
  { id: 12, titulo: "Dune", autor: "Frank Herbert", anio: 1965, categoria: "Ciencia Ficción", isbn: "978-0441172719", paginas: 600, precio: 16.99, stock: 4, color: "linear-gradient(135deg, #d97706, #78350f)" },
  { id: 13, titulo: "Sapiens: De Animales a Dioses", autor: "Yuval Noah Harari", anio: 2011, categoria: "Historia", isbn: "978-0062316097", paginas: 512, precio: 19.99, stock: 3, color: "linear-gradient(135deg, #14b8a6, #0f766e)" },
  { id: 14, titulo: "El Arte de la Guerra", autor: "Sun Tzu", anio: -500, categoria: "Estrategia", isbn: "978-1590302255", paginas: 128, precio: 7.99, stock: 10, color: "linear-gradient(135deg, #ef4444, #7f1d1d)" },
  { id: 15, titulo: "Un Mundo Feliz", autor: "Aldous Huxley", anio: 1932, categoria: "Distopía", isbn: "978-0060850524", paginas: 288, precio: 11.50, stock: 3, color: "linear-gradient(135deg, #84cc16, #4d7c0f)" },
  { id: 16, titulo: "La Metamorfosis", autor: "Franz Kafka", anio: 1915, categoria: "Existencialismo", isbn: "978-8420651361", paginas: 96, precio: 5.99, stock: 5, color: "linear-gradient(135deg, #6b7280, #374151)" }
];

const DEFAULT_USERS = [
  { id: "1001", nombre: "Juan Pérez López", carrera: "Ingeniería en Sistemas", telefono: "0987654321", email: "estudiante@uleam.edu.ec", rol: "Estudiante", estado: "Activo" },
  { id: "1002", nombre: "María González", carrera: "Derecho", telefono: "0981234567", email: "docente@uleam.edu.ec", rol: "Docente", estado: "Activo" },
  { id: "9001", nombre: "Carlos Mendoza", carrera: "Administración", telefono: "0998765432", email: "admin@uleam.edu.ec", rol: "Administrador", estado: "Activo" }
];

const DEFAULT_CONFIG = {
  multaDia: 1.50,
  limiteLibros: 3,
  diasMaximo: 7,
  sancionAutomatica: true
};

// Generar préstamos iniciales
const getInitialLoans = () => {
  const today = new Date();
  const dateStr = (d) => d.toISOString().split('T')[0];

  const loan1Date = new Date();
  loan1Date.setDate(today.getDate() - 3); // Hace 3 días
  const loan1Due = new Date();
  loan1Due.setDate(today.getDate() + 4); // En 4 días

  const loan2Date = new Date();
  loan2Date.setDate(today.getDate() - 10); // Hace 10 días
  const loan2Due = new Date();
  loan2Due.setDate(today.getDate() - 3); // Atrasado por 3 días

  return [
    {
      id: "PRE-001",
      userId: "1001",
      userNombre: "Juan Pérez López",
      bookId: 1,
      bookTitulo: "Cien Años de Soledad",
      fechaPrestamo: dateStr(loan1Date),
      fechaDevolucion: dateStr(loan1Due),
      status: "Activo"
    },
    {
      id: "PRE-002",
      userId: "1001",
      userNombre: "Juan Pérez López",
      bookId: 4,
      bookTitulo: "1984",
      fechaPrestamo: dateStr(loan2Date),
      fechaDevolucion: dateStr(loan2Due),
      status: "Atrasado"
    }
  ];
};

const DEFAULT_SANCIONES = [
  {
    id: "SAN-001",
    userId: "1002",
    userNombre: "María González",
    tipo: "Suspensión temporal (7 días)",
    fecha: "2026-06-28",
    monto: 0.00,
    motivo: "Devolución de material en mal estado físico.",
    estado: "Activa"
  },
  {
    id: "SAN-002",
    userId: "1001",
    userNombre: "Juan Pérez López",
    tipo: "Multa económica (Retraso)",
    fecha: "2026-06-30",
    monto: 4.50, // 3 días * 1.50
    motivo: "Retraso de 3 días en el libro '1984'.",
    estado: "Activa"
  }
];

const DEFAULT_QUEJAS = [
  {
    id: "QUE-001",
    userId: "1001",
    userNombre: "Juan Pérez López",
    asunto: "Lentitud en el escáner de entrega",
    descripcion: "El escáner automático de la entrada tardó más de 5 minutos en registrar la devolución de mi libro.",
    fecha: "2026-06-29",
    estado: "Recibido"
  }
];

// Inicializar base de datos local
function initDB() {
  if (!localStorage.getItem("libros")) {
    localStorage.setItem("libros", JSON.stringify(DEFAULT_BOOKS));
  }
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("config")) {
    localStorage.setItem("config", JSON.stringify(DEFAULT_CONFIG));
  }
  if (!localStorage.getItem("prestamos")) {
    localStorage.setItem("prestamos", JSON.stringify(getInitialLoans()));
  }
  if (!localStorage.getItem("sanciones")) {
    localStorage.setItem("sanciones", JSON.stringify(DEFAULT_SANCIONES));
  }
  if (!localStorage.getItem("quejas")) {
    localStorage.setItem("quejas", JSON.stringify(DEFAULT_QUEJAS));
  }
  
  // Establecer usuario logueado por defecto si no hay uno
  if (!localStorage.getItem("loggedUser")) {
    localStorage.setItem("loggedUser", JSON.stringify(DEFAULT_USERS[0])); // Juan Pérez
  }
}

// Ejecutar inicialización inmediatamente
initDB();

// API del Estado del Proyecto
const AppState = {
  // Libros
  getLibros() {
    return JSON.parse(localStorage.getItem("libros"));
  },
  addLibro(libro) {
    const libros = this.getLibros();
    const id = libros.length > 0 ? Math.max(...libros.map(l => l.id)) + 1 : 1;
    
    // Asignar color gradiente aleatorio para portada
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      "linear-gradient(135deg, #10b981, #047857)",
      "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      "linear-gradient(135deg, #ec4899, #be185d)",
      "linear-gradient(135deg, #f59e0b, #d97706)",
      "linear-gradient(135deg, #14b8a6, #0f766e)"
    ];
    const color = gradients[Math.floor(Math.random() * gradients.length)];
    
    const nuevoLibro = { id, ...libro, color };
    libros.push(nuevoLibro);
    localStorage.setItem("libros", JSON.stringify(libros));
    return nuevoLibro;
  },
  updateLibro(id, updatedFields) {
    const libros = this.getLibros();
    const idx = libros.findIndex(l => l.id === parseInt(id));
    if (idx !== -1) {
      libros[idx] = { ...libros[idx], ...updatedFields };
      localStorage.setItem("libros", JSON.stringify(libros));
      return libros[idx];
    }
    return null;
  },
  deleteLibro(id) {
    const libros = this.getLibros();
    const filtrados = libros.filter(l => l.id !== parseInt(id));
    localStorage.setItem("libros", JSON.stringify(filtrados));
  },

  // Usuarios
  getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios"));
  },
  addUsuario(usuario) {
    const usuarios = this.getUsuarios();
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return usuario;
  },
  updateUsuario(id, updatedFields) {
    const usuarios = this.getUsuarios();
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], ...updatedFields };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      // Si actualizamos el usuario activo, actualizar loggedUser
      const logged = this.getLoggedUser();
      if (logged && logged.id === id) {
        localStorage.setItem("loggedUser", JSON.stringify(usuarios[idx]));
      }
      return usuarios[idx];
    }
    return null;
  },
  toggleBlockUsuario(id) {
    const usuarios = this.getUsuarios();
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      usuarios[idx].estado = usuarios[idx].estado === "Activo" ? "Bloqueado" : "Activo";
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      return usuarios[idx];
    }
    return null;
  },

  // Préstamos
  getPrestamos() {
    return JSON.parse(localStorage.getItem("prestamos"));
  },
  solicitarPrestamo(bookId, userId) {
    const config = this.getConfig();
    const libros = this.getLibros();
    const libro = libros.find(l => l.id === parseInt(bookId));
    
    if (!libro) return { success: false, message: "Libro no encontrado" };
    if (libro.stock <= 0) return { success: false, message: "Sin stock disponible en este momento" };

    const prestamos = this.getPrestamos();
    const prestamosActivos = prestamos.filter(p => p.userId === userId && (p.status === "Activo" || p.status === "Atrasado"));
    
    if (prestamosActivos.length >= config.limiteLibros) {
      return { success: false, message: `Has alcanzado el límite máximo de ${config.limiteLibros} préstamos activos.` };
    }

    const usuario = this.getUsuarios().find(u => u.id === userId);
    if (usuario && usuario.estado === "Bloqueado") {
      return { success: false, message: "Tu usuario está bloqueado debido a sanciones pendientes." };
    }

    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + config.diasMaximo);

    const dateStr = (d) => d.toISOString().split('T')[0];
    const id = "PRE-" + Math.floor(100 + Math.random() * 900);

    const nuevoPrestamo = {
      id,
      userId,
      userNombre: usuario ? usuario.nombre : "Usuario",
      bookId: libro.id,
      bookTitulo: libro.titulo,
      fechaPrestamo: dateStr(today),
      fechaDevolucion: dateStr(due),
      status: "Activo"
    };

    // Reducir stock del libro
    this.updateLibro(libro.id, { stock: libro.stock - 1 });

    prestamos.push(nuevoPrestamo);
    localStorage.setItem("prestamos", JSON.stringify(prestamos));
    return { success: true, prestamo: nuevoPrestamo };
  },
  devolverPrestamo(loanId) {
    const prestamos = this.getPrestamos();
    const idx = prestamos.findIndex(p => p.id === loanId);
    if (idx !== -1) {
      const p = prestamos[idx];
      if (p.status === "Devuelto") return { success: false, message: "Ya ha sido devuelto." };

      // Incrementar stock
      const libros = this.getLibros();
      const libro = libros.find(l => l.id === p.bookId);
      if (libro) {
        this.updateLibro(libro.id, { stock: libro.stock + 1 });
      }

      // Si estaba atrasado, o si se devuelve tarde, marcar sanción si aplica
      const config = this.getConfig();
      const today = new Date();
      const due = new Date(p.fechaDevolucion);
      
      let multaGenerada = 0;
      if (today > due) {
        const diffTime = Math.abs(today - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        multaGenerada = diffDays * config.multaDia;

        // Registrar multa si es mayor a 0 y automatico
        if (multaGenerada > 0 && config.sancionAutomatica) {
          this.aplicarSancion({
            userId: p.userId,
            userNombre: p.userNombre,
            tipo: "Multa económica (Retraso)",
            monto: multaGenerada,
            motivo: `Retraso de ${diffDays} días en la devolución de '${p.bookTitulo}'.`
          });
        }
      }

      prestamos[idx].status = "Devuelto";
      localStorage.setItem("prestamos", JSON.stringify(prestamos));
      return { success: true, multa: multaGenerada };
    }
    return { success: false, message: "Préstamo no encontrado" };
  },

  // Sanciones
  getSanciones() {
    return JSON.parse(localStorage.getItem("sanciones"));
  },
  aplicarSancion(sancion) {
    const sanciones = this.getSanciones();
    const id = "SAN-" + Math.floor(100 + Math.random() * 900);
    const today = new Date().toISOString().split('T')[0];

    const nuevaSancion = {
      id,
      userId: sancion.userId,
      userNombre: sancion.userNombre,
      tipo: sancion.tipo || "Multa económica",
      fecha: today,
      monto: parseFloat(sancion.monto || 0),
      motivo: sancion.motivo || "Incumplimiento de políticas",
      estado: "Activa"
    };

    sanciones.push(nuevaSancion);
    localStorage.setItem("sanciones", JSON.stringify(sanciones));

    // Bloquear al usuario si la política lo exige o si tiene multas pendientes
    this.updateUsuario(sancion.userId, { estado: "Bloqueado" });

    return nuevaSancion;
  },
  levantarSancion(id) {
    const sanciones = this.getSanciones();
    const idx = sanciones.findIndex(s => s.id === id);
    if (idx !== -1) {
      sanciones[idx].estado = "Resuelta";
      localStorage.setItem("sanciones", JSON.stringify(sanciones));

      // Comprobar si el usuario tiene más sanciones activas
      const userId = sanciones[idx].userId;
      const activas = sanciones.filter(s => s.userId === userId && s.estado === "Activa");
      if (activas.length === 0) {
        // Desbloquear usuario
        this.updateUsuario(userId, { estado: "Activo" });
      }
      return true;
    }
    return false;
  },

  // Quejas
  getQuejas() {
    return JSON.parse(localStorage.getItem("quejas"));
  },
  enviarQueja(asunto, descripcion, userId) {
    const user = this.getUsuarios().find(u => u.id === userId);
    const quejas = this.getQuejas();
    const id = "QUE-" + Math.floor(100 + Math.random() * 900);
    const today = new Date().toISOString().split('T')[0];

    const nuevaQueja = {
      id,
      userId,
      userNombre: user ? user.nombre : "Usuario",
      asunto,
      descripcion,
      fecha: today,
      estado: "Recibido"
    };

    quejas.push(nuevaQueja);
    localStorage.setItem("quejas", JSON.stringify(quejas));
    return nuevaQueja;
  },

  // Configuración
  getConfig() {
    return JSON.parse(localStorage.getItem("config"));
  },
  updateConfig(newConfig) {
    const config = { ...this.getConfig(), ...newConfig };
    localStorage.setItem("config", JSON.stringify(config));
    return config;
  },

  // Auth / Sesión
  getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
  },
  login(email) {
    const usuarios = this.getUsuarios();
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (usuario) {
      localStorage.setItem("loggedUser", JSON.stringify(usuario));
      return { success: true, user: usuario };
    }
    return { success: false, message: "Correo institucional no registrado o incorrecto." };
  },
  logout() {
    localStorage.removeItem("loggedUser");
  }
};

// Exponer AppState a nivel global
window.AppState = AppState;
