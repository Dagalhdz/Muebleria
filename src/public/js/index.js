async function getMunicipios(){
   const loadMunicipios = document.getElementById('municipios')
   const option = document.querySelectorAll('#municipios option')
   const estados = +document.getElementById('estado').value;
   const response = await fetch(`http://localhost:3000/proveedores/municipios/${estados}`);
   const municipios = await response.json();
   
   option.forEach(o => {
      o.remove()
   });
   const add = document.createElement('option');
   add.value = '';
   add.text = 'Nada';
   loadMunicipios.add(add);

   municipios.map(data => {
      const add = document.createElement('option');
      add.value = data.id;
      add.text = `${data.clave} - ${data.nombre}`;
      loadMunicipios.add(add);
   })
   console.log(loadMunicipios);
}