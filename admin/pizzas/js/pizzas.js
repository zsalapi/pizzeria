$(document).ready(function () {
  //Modal létrehozása, ha nincs mert később ezt használjuk a termék adatainak megjelenítésére
  if (typeof pizzaModal === "undefined") {
    var pizzaModal = new bootstrap.Modal(document.getElementById("pizzaModal"));
  }

  //az összes termék betöltése
  function loadPizzas() {
    $.get(
      "pizzas/list.php",
      function (data) {
        const rows = data.map(
          (pizza) => `
            <tr>
              <td>${pizza.id}</td>
              <td>${pizza.name}</td>
              <td>${pizza.category_name}</td>
              <td>${pizza.price}</td>
              <td><img src="${pizza.picture}" width="60"></td>
              <td>
                <button class="btn btn-sm btn-primary editBtn" data-id="${pizza.id}">Szerkesztés</button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${pizza.id}">Törlés</button>
              </td>
            </tr>
          `
        );
        $("#pizzaTable tbody").html(rows.join(""));
      },
      "json"
    );
  }

  //kategóriák betöltése options constans-ba amit beleteszünk a category_id nevű select elem-be
  function loadCategories() {
    $.get(
      "categories/list.php",
      function (data) {
        const options = data.map(
          (cat) => `<option value="${cat.id}">${cat.name}</option>`
        );
        $("select[name='category_id']").html(options.join(""));
      },
      "json"
    );
  }

  loadPizzas();
  loadCategories();

  //üres Modal új Pizza vagy más termék hozzáadásához
  $("#addPizzaBtn").click(() => {
    $("#pizzaForm")[0].reset();
    $("input[name='id']").val("");
    $("input[name='old_picture']").val("");
    $("#currentImage").hide();
    pizzaModal.show();
  });

  //betöltjük módosításra az adatokat és Modal megjelenítése
  $("#pizzaTable").on("click", ".editBtn", function () {
    const id = $(this).data("id");
    $.get(
      `pizzas/get.php?id=${id}`,
      function (pizza) {
        $("input[name='id']").val(pizza.id);
        $("input[name='name']").val(pizza.name);
        $("input[name='price']").val(pizza.price);
        $("select[name='category_id']").val(pizza.category_id);
        $("input[name='old_picture']").val(pizza.picture);

        if (pizza.picture) {
          $("#currentImage img").attr("src", "/pizzeria/imgs/" + pizza.picture);
          $("#currentImage").show();
        } else {
          $("#currentImage").hide();
        }

        pizzaModal.show();
      },
      "json"
    );
  });
  //adott id-jú pizza vagy más termék törlése
  $("#pizzaTable").on("click", ".deleteBtn", function () {
    if (confirm("Biztosan törlöd a pizzát?")) {
      const id = $(this).data("id");
      $.post("pizzas/delete.php", { id }, loadPizzas);
    }
  });

  //Form-ban lévő adatok módosítása vagy létrehozás belőlük   isEdit-be ha tudunk id-t tölteni akkor módosítás
  $("#pizzaForm").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isEdit = !!formData.get("id");

    $.ajax({
      url: isEdit ? "pizzas/update.php" : "pizzas/create.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function () {
        pizzaModal.hide();
        loadPizzas();
      },
      error: function (xhr) {
        alert("Hiba: " + xhr.responseText);
      },
    });
  });
});
