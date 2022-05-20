window.addEventListener("load", function(){
  document.getElementById("loader").classList.toggle("loader2")
})
const bootCards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const cards = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    printCarrito();
  }
});
bootCards.addEventListener("click", (e) => {
  addCarrito(e);
});
items.addEventListener("click", (e) => {
  buttonAction(e);
});
const fetchData = async () => {
  try {
    const respuesta = await fetch("app.json");
    const data = await respuesta.json();
    console.log(data);
    print(data);
  } catch (error) {
    console.log(error);
  }
};
const print = (data) => {
  data.forEach((producto) => {
    cards.querySelector("h5").textContent = producto.titulo;
    cards.querySelector("p").textContent = producto.precio;
    cards.querySelector("img").setAttribute("src", producto.img);
    cards.querySelector(".btn-primary").dataset.id = producto.id;
    const clon = cards.cloneNode(true);
    fragment.appendChild(clon);
  });
  bootCards.appendChild(fragment);
};
const addCarrito = (e) => {
  if (e.target.classList.contains("btn-primary")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};
const setCarrito = (obj) => {
  const producto = {
    id: obj.querySelector(".btn-primary").dataset.id,
    titulo: obj.querySelector("h5").textContent,
    precio: obj.querySelector("p").textContent,
    stock: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.stock = carrito[producto.id].stock + 1;
  }
  carrito[producto.id] = { ...producto };
  printCarrito();
};
const printCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.titulo;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.stock;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.stock * producto.precio;
    const clon = templateCarrito.cloneNode(true);
    fragment.appendChild(clon);
  });
  items.appendChild(fragment);
  printFooter();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
const printFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comenzar a comprar!</th>
        `;
    return;
  }
  const cantidad = Object.values(carrito).reduce(
    (acc, { stock }) => acc + stock,
    0
  );
  const precio = Object.values(carrito).reduce(
    (acc, { stock, precio }) => acc + stock * precio,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = cantidad;
  templateFooter.querySelector("span").textContent = precio;
  const clon = templateFooter.cloneNode(true);
  fragment.appendChild(clon);
  footer.appendChild(fragment);
  const vaciar = document.getElementById("vaciar-carrito");
  vaciar.addEventListener("click", () => {
    carrito = {};
    printCarrito();
  });
};
const buttonAction = (e) => {
  if(e.target.classList.contains("btn-info")){
    const producto = carrito[e.target.dataset.id]
    producto.stock++
    carrito[e.target.dataset.id] = { ...producto}
    printCarrito();
  }
  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.stock--;
    if (producto.stock === 0) {
      delete carrito[e.target.dataset.id];
    }
    printCarrito();
  }
  e.stopPropagation();
  }
  function comprar(){
    Swal.fire({
      title:"Compra realizada con éxito!",
      icon:"success",
      timer:5000,
      timerProgressBar: true
    })
  }
