document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pncForm");
    const manoObraCheckboxes = document.querySelectorAll(".manoObraCheckbox");
    const viaticos = document.getElementById("viaticos");
    const manoObraDetalles = document.getElementById("manoObraDetalles");
    const viaticosDetalles = document.getElementById("viaticosDetalles");

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
                        <input type="number" id="${checkbox.value}Horas" name="${checkbox.value}Horas" required>
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
            operariosPersonas: document.getElementById("operariosPersonas") ? document.getElementById("operariosPersonas").value : '',
            operariosHoras: document.getElementById("operariosHoras") ? document.getElementById("operariosHoras").value : '',
            ayudantesPersonas: document.getElementById("ayudantesPersonas") ? document.getElementById("ayudantesPersonas").value : '',
            ayudantesHoras: document.getElementById("ayudantesHoras") ? document.getElementById("ayudantesHoras").value : '',
            jefaturasPersonas: document.getElementById("jefaturasPersonas") ? document.getElementById("jefaturasPersonas").value : '',
            jefaturasHoras: document.getElementById("jefaturasHoras") ? document.getElementById("jefaturasHoras").value : '',
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

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxEaUd_qABuyW4J4rn_re8nwD20K025my22aCtK29917ef21FZYySq85e3jE_DWZNAX/exec';

        // Enviar los datos al Apps Script
        fetch(scriptURL, {
            method: 'POST',
            body: new URLSearchParams(data)
        })
        .then(response => response.text())
        .then(response => {
            document.getElementById('response-message').innerText = "Registro guardado exitosamente.";
            limpiarFormulario();
        })
        .catch(error => {
            document.getElementById('response-message').innerText = "Error en el registro. Intenta de nuevo.";
            console.error('Error!', error);
        });
    });
});
