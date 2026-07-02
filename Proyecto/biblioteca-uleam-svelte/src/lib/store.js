import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Datos por defecto (Libros, usuarios, configuración, etc.)
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

const getInitialLoans = () => {
  const today = new Date();
  const dateStr = (d) => d.toISOString().split('T')[0];

  const loan1Date = new Date();
  loan1Date.setDate(today.getDate() - 3);
  const loan1Due = new Date();
  loan1Due.setDate(today.getDate() + 4);

  const loan2Date = new Date();
  loan2Date.setDate(today.getDate() - 10);
  const loan2Due = new Date();
  loan2Due.setDate(today.getDate() - 3);

  return [
    { id: "PRE-001", userId: "1001", userNombre: "Juan Pérez López", bookId: 1, bookTitulo: "Cien Años de Soledad", fechaPrestamo: dateStr(loan1Date), fechaDevolucion: dateStr(loan1Due), status: "Activo" },
    { id: "PRE-002", userId: "1001", userNombre: "Juan Pérez López", bookId: 4, bookTitulo: "1984", fechaPrestamo: dateStr(loan2Date), fechaDevolucion: dateStr(loan2Due), status: "Atrasado" }
  ];
};

const DEFAULT_SANCIONES = [
  { id: "SAN-001", userId: "1002", userNombre: "María González", tipo: "Suspensión temporal (7 días)", fecha: "2026-06-28", monto: 0.00, motivo: "Devolución de material en mal estado físico.", estado: "Activa" },
  { id: "SAN-002", userId: "1001", userNombre: "Juan Pérez López", tipo: "Multa económica (Retraso)", fecha: "2026-06-30", monto: 4.50, motivo: "Retraso de 3 días en el libro '1984'.", estado: "Activa" }
];

const DEFAULT_QUEJAS = [
  { id: "QUE-001", userId: "1001", userNombre: "Juan Pérez López", asunto: "Lentitud en el escáner de entrega", descripcion: "El escáner automático de la entrada tardó más de 5 minutos en registrar la devolución de mi libro.", fecha: "2026-06-29", estado: "Recibido" }
];

// Helper para crear stores sincronizados con localStorage en el navegador
function createPersistentStore(key, defaultValue) {
  const initialValue = browser && localStorage.getItem(key) 
    ? JSON.parse(localStorage.getItem(key)) 
    : defaultValue;
    
  const store = writable(initialValue);
  
  if (browser) {
    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
  
  return store;
}

// Stores reactivos
export const libros = createPersistentStore('libros', DEFAULT_BOOKS);
export const usuarios = createPersistentStore('usuarios', DEFAULT_USERS);
export const prestamos = createPersistentStore('prestamos', getInitialLoans());
export const sanciones = createPersistentStore('sanciones', DEFAULT_SANCIONES);
export const quejas = createPersistentStore('quejas', DEFAULT_QUEJAS);
export const config = createPersistentStore('config', DEFAULT_CONFIG);
export const loggedUser = createPersistentStore('loggedUser', DEFAULT_USERS[0]);

// Métodos lógicos encapsulados
export const actions = {
  login(email) {
    let matched = null;
    usuarios.update(list => {
      const u = list.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (u) matched = u;
      return list;
    });
    
    if (matched) {
      loggedUser.set(matched);
      return { success: true, user: matched };
    }
    return { success: false, message: "Correo institucional no registrado." };
  },
  
  logout() {
    loggedUser.set(null);
  },
  
  solicitarPrestamo(bookId, userId) {
    let result = { success: false, message: "Error desconocido" };
    
    // Obtener valores actuales de los stores
    let currentConfig;
    config.subscribe(v => currentConfig = v)();
    
    let currentBooks;
    libros.subscribe(v => currentBooks = v)();
    
    let currentLoans;
    prestamos.subscribe(v => currentLoans = v)();
    
    let currentUser;
    usuarios.subscribe(list => currentUser = list.find(u => u.id === userId))();
    
    const libro = currentBooks.find(l => l.id === parseInt(bookId));
    if (!libro) return { success: false, message: "Libro no encontrado" };
    if (libro.stock <= 0) return { success: false, message: "Sin stock disponible." };
    
    const activos = currentLoans.filter(p => p.userId === userId && (p.status === "Activo" || p.status === "Atrasado"));
    if (activos.length >= currentConfig.limiteLibros) {
      return { success: false, message: `Límite alcanzado de ${currentConfig.limiteLibros} préstamos.` };
    }
    
    if (currentUser && currentUser.estado === "Bloqueado") {
      return { success: false, message: "Usuario bloqueado debido a sanciones pendientes." };
    }
    
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + currentConfig.diasMaximo);
    
    const dateStr = (d) => d.toISOString().split('T')[0];
    const id = "PRE-" + Math.floor(100 + Math.random() * 900);
    
    const nuevoPrestamo = {
      id,
      userId,
      userNombre: currentUser ? currentUser.nombre : "Usuario",
      bookId: libro.id,
      bookTitulo: libro.titulo,
      fechaPrestamo: dateStr(today),
      fechaDevolucion: dateStr(due),
      status: "Activo"
    };
    
    // Actualizar stock del libro
    libros.update(list => {
      const idx = list.findIndex(l => l.id === libro.id);
      if (idx !== -1) list[idx].stock -= 1;
      return list;
    });
    
    // Agregar préstamo
    prestamos.update(list => {
      list.push(nuevoPrestamo);
      return list;
    });
    
    return { success: true, prestamo: nuevoPrestamo };
  },
  
  devolverPrestamo(loanId) {
    let result = { success: false, message: "No encontrado", multa: 0 };
    
    let currentConfig;
    config.subscribe(v => currentConfig = v)();
    
    prestamos.update(list => {
      const idx = list.findIndex(p => p.id === loanId);
      if (idx !== -1) {
        const p = list[idx];
        if (p.status === "Devuelto") {
          result = { success: false, message: "Ya fue devuelto anteriormente." };
          return list;
        }
        
        // Devolver stock
        libros.update(bList => {
          const bIdx = bList.findIndex(b => b.id === p.bookId);
          if (bIdx !== -1) bList[bIdx].stock += 1;
          return bList;
        });
        
        // Calcular multa de ser necesario
        const today = new Date();
        const due = new Date(p.fechaDevolucion);
        let multaGenerada = 0;
        
        if (today > due) {
          const diffTime = Math.abs(today - due);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          multaGenerada = diffDays * currentConfig.multaDia;
          
          if (multaGenerada > 0 && currentConfig.sancionAutomatica) {
            this.aplicarSancion({
              userId: p.userId,
              userNombre: p.userNombre,
              tipo: "Multa económica (Retraso)",
              monto: multaGenerada,
              motivo: `Retraso de ${diffDays} días en la devolución de '${p.bookTitulo}'.`
            });
          }
        }
        
        list[idx].status = "Devuelto";
        result = { success: true, multa: multaGenerada };
      }
      return list;
    });
    
    return result;
  },
  
  aplicarSancion(sancion) {
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
    
    sanciones.update(list => {
      list.push(nuevaSancion);
      return list;
    });
    
    // Bloquear usuario
    usuarios.update(list => {
      const idx = list.findIndex(u => u.id === sancion.userId);
      if (idx !== -1) list[idx].estado = "Bloqueado";
      return list;
    });
    
    // Si el usuario sancionado es el activo, actualizar loggedUser
    loggedUser.update(current => {
      if (current && current.id === sancion.userId) {
        current.estado = "Bloqueado";
      }
      return current;
    });
    
    return nuevaSancion;
  },
  
  levantarSancion(id) {
    let userId = null;
    sanciones.update(list => {
      const idx = list.findIndex(s => s.id === id);
      if (idx !== -1) {
        list[idx].estado = "Resuelta";
        userId = list[idx].userId;
      }
      return list;
    });
    
    if (userId) {
      let activeSancionesCount = 0;
      sanciones.subscribe(list => {
        activeSancionesCount = list.filter(s => s.userId === userId && s.estado === 'Activa').length;
      })();
      
      if (activeSancionesCount === 0) {
        usuarios.update(list => {
          const idx = list.findIndex(u => u.id === userId);
          if (idx !== -1) list[idx].estado = "Activo";
          return list;
        });
        
        loggedUser.update(current => {
          if (current && current.id === userId) {
            current.estado = "Activo";
          }
          return current;
        });
      }
      return true;
    }
    return false;
  },
  
  enviarQueja(asunto, descripcion, userId, userNombre) {
    const id = "QUE-" + Math.floor(100 + Math.random() * 900);
    const today = new Date().toISOString().split('T')[0];
    
    const nuevaQueja = {
      id,
      userId,
      userNombre,
      asunto,
      descripcion,
      fecha: today,
      estado: "Recibido"
    };
    
    quejas.update(list => {
      list.push(nuevaQueja);
      return list;
    });
    
    return nuevaQueja;
  }
};
