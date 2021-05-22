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

async function getPrecio(){
   const section = document.getElementById('prod-prov').value;
   const cantidad = +document.getElementById('cantidad').value;
   const subtotal = document.getElementById('subtotal');
   const total = document.getElementById('total');
   const response = await fetch(`http://localhost:3000/Proveedores/compra/precio/${section}`);
   const precio = await response.json();
   subtotal.value = '';
   total.value=''
   subtotal.value = (cantidad * +precio[0].precio).toString();
   total.value = (cantidad * +precio[0].precio * 1.16).toString();
}