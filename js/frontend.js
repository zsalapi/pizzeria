$(document).ready(function () {
  // Kosár rétegének kezelése show/hide
  $("#cart").click(function () {
    const isVisible = $("#cartView").is(":visible");

    if (isVisible) {
      // Ha látható, elrejtjük és visszahozzuk a terméklistát
      $("#cartView").hide();
      $(".mb-3, #productsContainer").show();
    } else {
      // Ha nem látható, megjelenítjük a kosarat és elrejtjük a többit
      $(".mb-3, #productsContainer").hide();
      $("#cartView").show();
      renderCartOnly();
    }
  });

  //ez a szemafor véd a többszörös submit ellen a rendelésnél
  let sendingOrder = false;

  // Rendelés
  $("#orderFormCart").submit(function (e) {
    e.preventDefault();
    console.log("Submit event triggered");
    if (sendingOrder) {
      console.log("Order is already sending, aborting.");
      return;
    }

    const cart = getCart();

    // Üres kosár figyelése nem lehet üres
    if (!cart || Object.keys(cart).length === 0) {
      alert("A kosár üres, nem lehet rendelést leadni.");
      return;
    }

    sendingOrder = true;
    console.log("Sending order with cart:", cart);

    //kosár items-be
    const items = Object.entries(cart).map(([product_id, count]) => ({
      product_id: parseInt(product_id),
      count,
    }));

    //rendelési adatok plusz kosár
    const data = {
      name: $("#nameCart").val(),
      phone: $("#phoneCart").val(),
      address: $("#addressCart").val(),
      items: items,
    };

    //cart-ból product id-k kiszedése és products lekérdezése ezekkel
    $.ajax({
      url: "api/product_by_ids.php?ids=" + Object.keys(cart).join(","),
      dataType: "json",
      success: function (products) {
        console.log("Products fetched for order summary:", products);
        //product berakása tömbbe
        const productMap = {};
        products.forEach((p) => (productMap[p.id] = p));

        let orderSummary = "";
        let total = 0;

        //összegzés elkészítése a rendelésről
        items.forEach(({ product_id, count }) => {
          const product = productMap[product_id];
          if (!product) return;
          const subtotal = product.price * count;
          total += subtotal;
          orderSummary += `- ${product.name} (${count} db) – ${subtotal} Ft\n`;
        });
        // ez lesz majd a visszajelzésben a rendelésről
        orderSummary += `\nÖsszesen: ${total} Ft`;

        // Megrendelés küldése
        $.ajax({
          url: "api/order.php",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function (res) {
            console.log("Order response:", res);
            sendingOrder = false;
            if (res.success) {
              // visszajelzés a rendelésről
              alert("Rendelés sikeres!\n\n" + orderSummary);
              // kosarat tároló cookie törlése
              document.cookie =
                "cart=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
              //kosár megjelenítése már üresen
              renderCartOnly();
              //rendelést végző űrlap törlése üres a következő rendeléshez
              $("#orderFormCart")[0].reset();
            } else {
              alert("Hiba: " + (res.error || "Ismeretlen hiba"));
            }
          },
          error: function (xhr) {
            sendingOrder = false;
            let message = "Ismeretlen hiba történt a rendelés során.";
            try {
              const json = JSON.parse(xhr.responseText);
              if (json.error) message = json.error;
            } catch (e) {
              console.error(
                "Nem sikerült értelmezni a hibaválaszt:",
                xhr.responseText
              );
            }
            alert("Hiba: " + message);
          },
        });
      },
      error: function () {
        sendingOrder = false;
        alert("Nem sikerült az árak lekérése.");
      },
    });
  });

  // KOSÁR - Kosár renderelés csak a cartView-hoz
  function renderCartOnly() {
    const cart = getCart();
    const productIds = Object.keys(cart);
    if (productIds.length === 0) {
      $("#cartOnlyContainer").html("<p>Üres a kosár.</p>");
      return;
    }

    $.ajax({
      url: "api/product_by_ids.php?ids=" + productIds.join(","),
      dataType: "json",
      success: function (products) {
        let html = `<table class="table table-sm table-bordered">
               <thead>
                 <tr>
                   <th>Név</th>
                   <th>Ár</th>
                   <th>Darab</th>
                   <th>Összeg</th>
                   <th>Művelet</th>
                 </tr>
               </thead>
               <tbody>`;
        let total = 0;
        products.forEach((product) => {
          const count = cart[product.id];
          const sum = product.price * count;
          total += sum;
          html += `<tr>
                 <td>${product.name}</td>
                 <td>${product.price} Ft</td>
                 <td>
                   <input type="number" min="1" class="form-control form-control-sm cart-count-input"
                     data-id="${product.id}" value="${count}" style="width:70px;" />
                 </td>
                 <td>${sum} Ft</td>
                 <td>
                   <button class="btn btn-sm btn-danger removeFromCartBtn" data-id="${product.id}">Törlés</button>
                 </td>
               </tr>`;
        });
        html += `<tr>
               <td colspan="3" class="text-end fw-bold">Összesen:</td>
               <td class="fw-bold">${total} Ft</td>
               <td></td>
             </tr>`;
        html += "</tbody></table>";
        $("#cartOnlyContainer").html(html);
      },
      error: function () {
        $("#cartOnlyContainer").html("<p>Hiba a kosár betöltésekor.</p>");
      },
    });
  }

  // Kosár kezelése cookie-ban JSON stringként (cookie neve: "cart")
  //később az event-ek részben használjuk ezeket a kosár eseményeinél mint építőkockákat az adott művelethez
  //kiolvasás a kosárból a json vissza alakításával
  function getCart() {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart="));
    if (!cookie) return {};
    try {
      return JSON.parse(decodeURIComponent(cookie.split("=")[1])) || {};
    } catch {
      return {};
    }
  }

  //írás a kosárba json formátumban
  function setCart(cart) {
    const d = new Date();
    d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 nap múlva lejár
    document.cookie =
      "cart=" +
      encodeURIComponent(JSON.stringify(cart)) +
      "; path=/; expires=" +
      d.toUTCString();
  }
  //ADD kosárba belerak
  function addToCart(productId) {
    let cart = getCart();
    cart[productId] = (cart[productId] || 0) + 1;
    setCart(cart);
    renderCart();
  }
  //REMOVE kosárból eltávolít
  function removeFromCart(productId) {
    let cart = getCart();
    delete cart[productId];
    setCart(cart);
    renderCart();
  }
  //UPDATE kosár módosítása
  function updateCartItem(productId, count) {
    let cart = getCart();
    if (count <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = count;
    }
    setCart(cart);
    renderCart();
  }

  // --- Kategóriák betöltése ---
  function loadCategories() {
    $.ajax({
      url: "api/categories.php",
      dataType: "json",
      success: function (response) {
        console.log("categories response:", response);
        let categories = response;
        //ha több dimenziós kiszedjük a második dimenziót illetve minden szinten ha nem tömb akkor hiba
        if (!Array.isArray(categories) && categories.categories) {
          categories = categories.categories;
        }
        if (!Array.isArray(categories)) {
          console.error("A kategóriák nem tömbök.");
          return;
        }
        let options = '<option value="">Összes</option>';
        categories.forEach((cat) => {
          options += `<option value="${cat.id}">${cat.name}</option>`;
        });
        //betöltjük a megfelelő select elembe a kategóriákat
        $("#categorySelect").html(options);
      },
      error: function (xhr, status, error) {
        console.error("Hiba a kategóriák betöltésekor:", error);
      },
    });
  }

  let allProducts = []; // cache

  //termékek betöltése vagy adott kategóriára szűkítve vagy az összeset,
  // majd termékek, kosár megjelenítésének a meghívása
  function loadProducts(categoryId = "") {
    let url = "api/products.php";
    if (categoryId) url += "?category_id=" + categoryId;
    $.get(url, function (products) {
      allProducts = products;
      renderProducts(products);
      renderCart();
    });
  }

  //betöltött termékek megjelenítése
  function renderProducts(products) {
    if (products.length === 0) {
      $("#productsContainer").html("<p>Nincs megjeleníthető termék.</p>");
      return;
    }
    let html = "";
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (i % 3 === 0) html += '<div class="row gy-4">'; // új sor 3 elemnek
      html += `
         <div class="col-md-4">
           <div class="card product-card">
             <img src="/pizzeria/imgs/${p.picture}" class="image-box"
                    alt="${p.name}" />
             <div class="card-body d-flex flex-column">
               <h5 class="card-title">${p.name}</h5>
               <p class="card-text fw-bold">${p.price} Ft</p>
               <button style="color: white; background-color: #ff7300; border: none;" class="btn btn-primary mt-auto addToCartBtn" data-id="${p.id}">Kosárba</button>
             </div>
           </div>
         </div>
       `;
      //mert 3db van 1 sorban
      if (i % 3 === 2 || i === products.length - 1) html += "</div>"; // záró sor
    }
    $("#productsContainer").html(html);
  }

  // --- Kosár megjelenítése ---
  function renderCart() {
    const cart = getCart();
    //cart sütiből id-k kiolvasása ezekkel kérdezünk be majd később
    const productIds = Object.keys(cart);
    if (productIds.length === 0) {
      $("#cartContainer").html("<p>Üres a kosár.</p>");
      return;
    }

    $.ajax({
      url: "api/product_by_ids.php?ids=" + productIds.join(","),
      dataType: "json",
      success: function (products) {
        if (!Array.isArray(products)) {
          $("#cartContainer").html(
            "<p>Hiba történt a kosár betöltésekor (érvénytelen válasz).</p>"
          );
          return;
        }

        let html = `<table class="table table-bordered">
         <thead>
           <tr><th>Név</th><th>Ár</th><th>Darab</th><th>Összeg</th><th>Műveletek</th></tr>
         </thead>
         <tbody>`;

        let total = 0;

        // ID alapú gyors elérés
        const productMap = {};
        products.forEach((p) => {
          productMap[p.id] = p;
        });

        let cartChanged = false;

        productIds.forEach((id) => {
          const product = productMap[id];
          const count = cart[id];

          if (!product) {
            // Ha nem található a termék, töröljük a kosárból
            delete cart[id];
            cartChanged = true;
            return;
          }

          const sum = product.price * count;
          total += sum;

          html += `
           <tr>
             <td>${product.name}</td>
             <td>${product.price} Ft</td>
             <td><input type="number" min="1" class="form-control form-control-sm cart-count-input" data-id="${id}" value="${count}" style="width:70px;" /></td>
             <td>${sum} Ft</td>
             <td><button class="btn btn-sm btn-danger removeFromCartBtn" data-id="${id}">Törlés</button></td>
           </tr>`;
        });

        html += `<tr>
         <td colspan="3" class="text-end fw-bold">Összesen:</td>
         <td colspan="2" class="fw-bold">${total} Ft</td>
       </tr></tbody></table>`;

        if (cartChanged) {
          setCart(cart); // mentjük a módosított kosarat
        }

        if (total === 0) {
          $("#cartContainer").html("<p>Üres a kosár.</p>");
        } else {
          $("#cartContainer").html(html);
        }
      },
      error: function (xhr, status, error) {
        console.error("Kosár betöltési hiba:", error);
        $("#cartContainer").html("<p>Hiba történt a kosár betöltésekor.</p>");
      },
    });
  }

  // --- Event kezelők ---

  loadCategories();
  loadProducts();

  //kategória-ra szűrése a termékeknek megjelenítés e szerint
  $("#categorySelect").change(function () {
    loadProducts($(this).val());
  });
  //termék kosárba rakása
  $("#productsContainer").on("click", ".addToCartBtn", function () {
    const id = $(this).data("id");
    addToCart(id);
  });

  // Interaktív kosárkezelés a #cartOnlyContainer-en belül - ha módosítunk a kosárban ezek hajtják végre
  //töröljük a kosárból a terméket
  $("#cartOnlyContainer").on("click", ".removeFromCartBtn", function () {
    const id = $(this).data("id");
    removeFromCart(id);
    renderCartOnly();
  });
  //frissítjük a darabszámot a kosárban
  $("#cartOnlyContainer").on("change", ".cart-count-input", function () {
    const id = $(this).data("id");
    let val = parseInt($(this).val());
    if (isNaN(val) || val < 1) val = 1;
    updateCartItem(id, val);
    renderCartOnly();
  });
});
