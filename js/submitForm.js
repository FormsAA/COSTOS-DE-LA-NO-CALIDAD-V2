document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pncForm");
    const manoObraCheckboxes = document.querySelectorAll(".manoObraCheckbox");
    const viaticos = document.getElementById("viaticos");
    const manoObraDetalles = document.getElementById("manoObraDetalles");
    const viaticosDetalles = document.getElementById("viaticosDetalles");
    const fechaInput = document.getElementById("fecha");

    // Establece la fecha actual en formato DD/MM/YYYY
 // Función para obtener la fecha actual en formato DD/MM/YYYY
 function obtenerFechaActual() {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
}

fechaInput.value = obtenerFechaActual();
fechaInput.disabled = true; // Desactivar el campo para evitar edición manual

    function limpiarFormulario() {
        form.reset();
        manoObraDetalles.innerHTML = "";
        viaticosDetalles.innerHTML = "";
        manoObraCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }

    manoObraCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const selectedCheckboxes = Array.from(manoObraCheckboxes).filter(cb => cb.checked);
            manoObraDetalles.innerHTML = "";

            selectedCheckboxes.forEach(checkbox => {
                manoObraDetalles.innerHTML += `
                    <div>
                        <label for="${checkbox.value}Personas">Cantidad de personas para ${checkbox.parentElement.textContent.trim()} *</label>
                        <input type="number" id="${checkbox.value}Personas" name="${checkbox.value}Personas" required>
                        <label for="${checkbox.value}Horas">Horas trabajadas por ${checkbox.parentElement.textContent.trim()} *</label>
                        <input type="number" id="${checkbox.value}Horas" name="${checkbox.value}Horas" required  step="0.01">
                    </div>
                `;
            });
        });
    });

    viaticos.addEventListener("change", () => {
        viaticosDetalles.innerHTML = "";
        if (viaticos.value === "hospedaje" || viaticos.value === "ambos") {
            viaticosDetalles.innerHTML += `
                <label for="cantidadHospedados">Cantidad de personas hospedadas *</label>
                <input type="number" id="cantidadHospedados" name="cantidadHospedados" required>
                <label for="diasHospedaje">Cantidad de días para hospedaje *</label>
                <input type="number" id="diasHospedaje" name="diasHospedaje" required>
            `;
        }
        if (viaticos.value === "alimentacion" || viaticos.value === "ambos") {
            viaticosDetalles.innerHTML += `
                <label for="cantidadAlimentacion">Cantidad de personas alimentadas *</label>
                <input type="number" id="cantidadAlimentacion" name="cantidadAlimentacion" required>
                <label for="cantidadComidas">Cantidad de comidas *</label>
                <input type="number" id="cantidadComidas" name="cantidadComidas" required>
            `;
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Recopilar los datos del formulario
        const data = {
            pncNumber: document.getElementById("pncNumber").value,
            fecha: document.getElementById("fecha").value,
            kilometraje: document.getElementById("kilometraje").value,
            montoRepuestos: document.getElementById("montoRepuestos").value,
            operariosPersonas: document.getElementById("operarioPersonas") ? document.getElementById("operarioPersonas").value : '',
            operariosHoras: document.getElementById("operarioHoras") ? document.getElementById("operarioHoras").value : '',
            ayudantesPersonas: document.getElementById("ayudantePersonas") ? document.getElementById("ayudantePersonas").value : '',
            ayudantesHoras: document.getElementById("ayudanteHoras") ? document.getElementById("ayudanteHoras").value : '',
            jefaturasPersonas: document.getElementById("jefaturaPersonas") ? document.getElementById("jefaturaPersonas").value : '',
            jefaturasHoras: document.getElementById("jefaturaHoras") ? document.getElementById("jefaturaHoras").value : '',
            viaticos: viaticos.value,
            cantidadHospedados: document.getElementById("cantidadHospedados") ? document.getElementById("cantidadHospedados").value : '',
            diasHospedaje: document.getElementById("diasHospedaje") ? document.getElementById("diasHospedaje").value : '',
            cantidadAlimentacion: document.getElementById("cantidadAlimentacion") ? document.getElementById("cantidadAlimentacion").value : '',
            cantidadComidas: document.getElementById("cantidadComidas") ? document.getElementById("cantidadComidas").value : '',
            oportunidadClientes: document.getElementById("oportunidadClientes").value,
            personasReunion: document.getElementById("personasReunion").value,
            horasReunion: document.getElementById("horasReunion").value,
            supervisiones: document.getElementById("supervisiones").value,
            asesorias: document.getElementById("asesorias").value
        };
        
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwmHuDIf_Quc_44dR4GQWDO9WaI9jM2Hu2jYAZJfHos7AOAvA7QFFdqoXvpCqbMgPYh/exec';

        // Enviar los datos al Apps Script
        fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(data)
        })
        .then(response => response.text())
        .then(response => {
            const responseMessage = document.getElementById('response-message');
            responseMessage.innerText = "Registro guardado exitosamente.";
            responseMessage.style.display = "block"; // Asegúrate de que el mensaje sea visible
        
            // Oculta el mensaje después de 3 segundos
            setTimeout(() => {
                responseMessage.style.display = "none";
            }, 3000);
            limpiarFormulario();
            fechaInput.value = obtenerFechaActual(); // Refresca la fecha
            fechaInput.disabled = true; // Desactiva el campo nuevamente
        })
        .catch(error => {
            const responseMessage = document.getElementById('response-message');
            responseMessage.innerText = "Error en el registro. Intenta de nuevo.";
            responseMessage.style.display = "block"; // Asegúrate de que el mensaje de error sea visible
            console.error('Error!', error);
        
            // Oculta el mensaje de error después de 3 segundos
            setTimeout(() => {
                responseMessage.style.display = "none";
            }, 3000);
        });
        
    });
});
