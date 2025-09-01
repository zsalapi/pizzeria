$(document).ready(function () {
  //Modal létrehozása, ha nincs mert később ezt használjuk a kategóriák adatainak megjelenítésére
  if (typeof categoryModal === "undefined") {
    var categoryModal = new bootstrap.Modal(
      document.getElementById("categoryModal")
    );
  }

  //kategóriák betöltése
  function loadCategories() {
    $.get(
      "categories/list.php",
      function (data) {
        const rows = data.map(
          (cat) => `
          <tr>
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>
              <button class="btn btn-sm btn-primary editBtn" data-id="${cat.id}">Szerkesztés</button>
              <button class="btn btn-sm btn-danger deleteBtn" data-id="${cat.id}">Törlés</button>
            </td>
          </tr>
        `
        );
        $("#categoryTable tbody").html(rows.join(""));
      },
      "json"
    );
  }

  loadCategories();

  //kategória hozzáadása
  $("#addCategoryBtn").click(() => {
    $("#categoryForm")[0].reset();
    $("input[name='id']").val("");
    categoryModal.show();
  });

  //kategória adatainak betöltése Modal megfelelő mezőibe és Modal megjelenítése
  $("#categoryTable").on("click", ".editBtn", function () {
    const id = $(this).data("id");
    $.get(
      `categories/get.php?id=${id}`,
      function (cat) {
        $("input[name='id']").val(cat.id);
        $("input[name='name']").val(cat.name);
        categoryModal.show();
      },
      "json"
    );
  });

  //kategória törlése, kategóriák újra betöltése
  $("#categoryTable").on("click", ".deleteBtn", function () {
    if (confirm("Biztosan törlöd a kategóriát?")) {
      const id = $(this).data("id");
      $.post("categories/delete.php", { id }, loadCategories);
    }
  });

  //frissítés vagy hozzáadás attól függően hogy ki van-e töltve az id, majd Modal elrejtése hiszen végeztünk, és kategóriák újra betöltése
  $("#categoryForm").submit(function (e) {
    e.preventDefault();
    const url = $("input[name='id']").val()
      ? "categories/update.php"
      : "categories/add.php";
    $.post(url, $(this).serialize(), function () {
      categoryModal.hide();
      loadCategories();
    });
  });
});
