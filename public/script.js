document.getElementById('conceptoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    const nombreConcepto = document.getElementById('nombreConcepto').value;
    const descripcion = document.getElementById('descripcion').value;
    const data = { 
        nombre: nombreConcepto, 
        descripcion: descripcion 
    };

    fetch('/api/conceptos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert("Concepto agregado exitosamente.");
    })
    .catch(error => {
        console.error("Error al agregar concepto:", error);
        alert("Error al agregar concepto.");
    });
});
