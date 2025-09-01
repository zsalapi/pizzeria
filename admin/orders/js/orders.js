$(document).ready(function () {
  //Rendelések listájának betöltése
  function loadOrders() {
    $.get(
      "orders/list.php",
      function (data) {
        const rows = data.map((order) => {
          // státusz dropdown select
          const statusOptions = ["Folyamatban", "Teljesítve", "Lemondva"]
            .map(
              (s) => `
                <option value="${s}" ${order.status === s ? "selected" : ""}>${
                s.charAt(0).toUpperCase() + s.slice(1)
              }</option>
              `
            )
            .join("");

          //a trükk hogy az ID-t egy kattintható gombként jelenítem meg amire ha kattint bejönnek a termékek amiket rendelt később event
          return `
              <tr>
                <td>
                  <button class="btn btn-link viewProductsBtn" data-id="${order.id}">
                      ${order.id}
                  </button>
                </td>
                <td>${order.name}</td>
                <td>${order.phone}</td>
                <td>${order.address}</td>
                <td>${order.created_at}</td>
                <td>
                  <select class="form-select form-select-sm statusSelect" data-id="${order.id}">
                    ${statusOptions}
                  </select>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger deleteBtn" data-id="${order.id}">Törlés</button>
                </td>
              </tr>`;
        });
        $("#ordersTable tbody").html(rows.join(""));
      },
      "json"
    );
  }

  loadOrders();

  // Státusz változtatás
  $("#ordersTable").on("change", ".statusSelect", function () {
    const id = $(this).data("id");
    const status = $(this).val();
    $.post(
      "orders/update_status.php",
      { id, status },
      function (res) {
        if (res.success) {
          alert("Státusz frissítve!");
          loadOrders();
        } else {
          alert("Hiba történt a frissítéskor!");
        }
      },
      "json"
    );
  });

  // Rendelés törlése
  $("#ordersTable").on("click", ".deleteBtn", function () {
    if (confirm("Biztosan törlöd a rendelést?")) {
      const id = $(this).data("id");
      $.post(
        "orders/delete.php",
        { id },
        function (res) {
          if (res.success) {
            alert("Rendelés törölve.");
            loadOrders();
          } else {
            alert("Hiba történt a törléskor!");
          }
        },
        "json"
      );
    }
  });
});

// Termékek lekérése és megjelenítése Modalban - ID-re kattintva hívódik meg
$("#ordersTable").on("click", ".viewProductsBtn", function () {
  const orderId = $(this).data("id");
  $("#productsModalBody").html("<p>Betöltés...</p>");
  const modal = new bootstrap.Modal(document.getElementById("productsModal"));
  modal.show();

  $.get(
    "orders/details.php",
    { order_id: orderId },
    function (data) {
      if (data.length === 0) {
        $("#productsModalBody").html(
          "<p>Nincs termék ehhez a rendeléshez.</p>"
        );
        return;
      }

      const rows = data
        .map(
          (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.count}</td>
          <td>${item.price} Ft</td>
        </tr>`
        )
        .join("");

      let sum = 0;
      data.map((item) => {
        sum = sum + item.price * item.count;
      });

      $("#productsModalBody").html(`
      <table class="table table-bordered">
        <thead><tr><th>ID</th><th>Név</th><th>Darab</th><th>Ár</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <hr>
      <b>Összesen: ${sum}</b>
    `);
    },
    "json"
  );
});
