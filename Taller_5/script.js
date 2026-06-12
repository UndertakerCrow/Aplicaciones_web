    const storageKey = 'estudiantes';
    const form = document.getElementById('studentForm');
    const messages = document.getElementById('messages');
    const studentTable = document.getElementById('studentTable');

    const patterns = {
      cedula: /^\d{10}$/, 
      apellidos: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/, 
      nombres: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/, 
      direccion: /^.{5,100}$/, 
      telefono: /^\+?\d{7,15}$/, 
      correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      facultad: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/, 
      nivel: /^[1-9][0-9]?$/, 
      paralelo: /^[A-Za-z0-9]{1,5}$/ 
    };

    function loadStudents() {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    }

    function saveStudents(students) {
      localStorage.setItem(storageKey, JSON.stringify(students));
    }

    function showMessage(text, type) {
      messages.textContent = text;
      messages.className = type;
    }

    function renderStudents() {
      const students = loadStudents();
      studentTable.innerHTML = '';
      if (students.length === 0) {
        studentTable.innerHTML = '<tr><td colspan="6">No hay estudiantes registrados.</td></tr>';
        return;
      }
      students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.cedula}</td>
          <td>${student.apellidos}</td>
          <td>${student.nombres}</td>
          <td>${student.facultad}</td>
          <td>${student.nivel}</td>
          <td>${student.paralelo}</td>
        `;
        studentTable.appendChild(row);
      });
    }

    function validateField(name, value) {
      return patterns[name].test(value.trim());
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const student = {};
      const errors = [];

      for (const [key, value] of formData.entries()) {
        if (!validateField(key, value)) {
          errors.push(key);
        }
        student[key] = value.trim();
      }

      if (errors.length > 0) {
        showMessage('Por favor corrige los campos: ' + errors.join(', '), 'error');
        return;
      }

      const students = loadStudents();
      students.push(student);
      saveStudents(students);
      renderStudents();
      showMessage('Estudiante guardado correctamente.', 'success');
      form.reset();
    });

    window.addEventListener('DOMContentLoaded', renderStudents);
