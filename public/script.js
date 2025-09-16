const form = document.getElementById('conceptoForm');
const lista = document.getElementById('listaConceptos');

// Cargar lista al abrir la página
window.addEventListener('DOMContentLoaded', fetchConceptos);

// Manejar el envío del formulario mediante fetch API POST
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nombreConcepto = document.getElementById('nombreConcepto').value;
  const descripcion = document.getElementById('descripcion').value;
  const data = { nombre: nombreConcepto, descripcion: descripcion };

  fetch('/api/conceptos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      fetchConceptos(); // refrescar la lista
      form.reset();
    })
    .catch(error => {
      console.error("Error al agregar concepto:", error);
      alert("Error al agregar concepto.");
    });
});

// Función para obtener y mostrar la lista de conceptos
function fetchConceptos() {
  fetch('/api/conceptos')
    .then(response => response.json())
    .then(conceptos => {
      renderLista(conceptos);
    })
    .catch(error => {
      console.error("Error obteniendo conceptos:", error);
    });
}

// Renderizar la lista de conceptos
function renderLista(conceptos) {
  lista.innerHTML = '';

  if (conceptos.length === 0) {
    lista.innerHTML = '<li>No hay conceptos aún</li>';
    return;
  }

  conceptos.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.id}: ${c.nombre} - ${c.descripcion}`;
    lista.appendChild(li);
  });
}

// Para eliminar todos los conceptos
document.getElementById('eliminarTodoBtn').addEventListener('click', function() {
  if (confirm("¿Estás seguro de que deseas eliminar todos los conceptos?")) {
    fetch('/api/delete/conceptos', { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        alert(result.mensaje);
        fetchConceptos();
      })
      .catch(error => {
        console.error("Error al eliminar conceptos:", error);
        alert("Error al eliminar los conceptos.");
      });
  }
});

// Para eliminar un concepto por ID
document.getElementById('eliminarForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const id = document.getElementById('idConceptoEliminar').value;
  if (!id) {
    alert("Por favor ingresa un ID válido.");
    return;
  }
  fetch(`/api/delete/conceptos/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      alert(result.mensaje);
      fetchConceptos();
    })
    .catch(error => {
      console.error("Error al eliminar concepto:", error);
      alert("Error al eliminar concepto.");
    });
  document.getElementById('eliminarForm').reset();
});

// Para buscar un concepto por ID
document.getElementById('buscarForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const id = document.getElementById('idConceptoBuscar').value;
    if (!id) {
    alert("Por favor ingresa un ID válido.");
    return;
  }
  fetch(`/api/conceptos/${id}`)
    .then(response => response.json())
    .then(concepto => {
      if (concepto.error) {
        alert(concepto.error);
      } else {
        alert(`Concepto encontrado: ${concepto.nombre} - ${concepto.descripcion}`);
      }
    })
    .catch(error => {
      console.error("Error al buscar concepto:", error);
      alert("Error al buscar concepto.");
    });
});