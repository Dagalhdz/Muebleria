var venta = [];
var factura = [];

async function getMunicipios() {
   const loadMunicipios = document.getElementById("municipios");
   const option = document.querySelectorAll("#municipios option");
   const estados = +document.getElementById("estado").value;
   const response = await fetch(
      `http://localhost:3000/proveedores/municipios/${estados}`
   );
   const municipios = await response.json();

   option.forEach((o) => {
      o.remove();
   });
   const add = document.createElement("option");
   add.value = "";
   add.text = "Nada";
   loadMunicipios.add(add);

   municipios.map((data) => {
      const add = document.createElement("option");
      add.value = data.id;
      add.text = `${data.clave} - ${data.nombre}`;
      loadMunicipios.add(add);
   });
   console.log(loadMunicipios);
}

async function getPrecio() {
   const section = document.getElementById("prod-prov").value;
   const cantidad = +document.getElementById("cantidad").value;
   const subtotal = document.getElementById("subtotal");
   const total = document.getElementById("total");
   const response = await fetch(
      `http://localhost:3000/Proveedores/compra/precio/${section}`
   );
   const precio = await response.json();
   subtotal.value = "";
   total.value = "";
   subtotal.value = (cantidad * +precio[0].precio).toString();
   total.value = (cantidad * +precio[0].precio * 1.16).toString();
}

async function calcularTotalVentas() {
   const productoId = document.getElementById("prducto").value;
   const cantidad = document.getElementById("cantidad").value;
   const descuento = document.getElementById("descuento").value;
   const iptSubtotal = document.getElementById("subtotal");
   const iptTotal = document.getElementById("total");
   const response = await fetch(
      `http://localhost:3000/ventas/all/${productoId}`
   );
   const precio = await response.json(response);

   const subtotal = +cantidad * +precio.precio;
   const total = subtotal - subtotal * (+descuento / 100);

   iptSubtotal.value = subtotal.toString();
   iptTotal.value = total.toString();
}

function addProd() {
   const value = [];
   const producto = document.getElementById("prducto").value;
   const inputs = document.querySelectorAll("input");
   inputs.forEach((input) => {
      value.push(input.value);
   });
   venta.push({
      id: value[0],
      id_producto: producto,
      cantidad: value[1],
      subtotal: value[2],
      descuento: value[3],
      total: value[4],
   });
   console.log(value);
   console.log(venta);
   inputs.forEach((a) => {
      a.value = "";
   });
}

function addFactura() {
   const value = [];
   const butonFactura = document.getElementById("factura");
   const inputs = document.querySelectorAll("input");
   inputs.forEach((input) => {
      value.push(input.value);
   });
   factura = {
      id: value[5],
      nombre: value[6],
      apellido: value[7],
   };
   console.log(factura);
   butonFactura.disabled = true;
}

async function sendVenta() {
   const data = {
      producto: venta,
      factura: factura,
   };
   const example = {
      nombre: "juan",
      apellido: "Hernandez",
   };
   console.log(JSON.stringify(example));

   fetch("http://localhost:3000/ventas", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   })
      .then((response) => response.json())
      .then((data) => {
         console.log("Success:", data);
      })
      .catch((error) => {
         console.error("Error:", error);
      });
   window.location.reload(); 
}
