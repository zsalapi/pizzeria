$(document).ready(function () {
  //Modal létrehozása, ha nincs mert később ezt használjuk a felhasználó adatainak megjelenítésére
  //userModal az a réteg ami akkor jelenik meg amikor valamit csinálunk a user-el itt
  if (typeof userModal === "undefined") {
    var userModal = new bootstrap.Modal(document.getElementById("userModal"));
  }

  function loadUsers() {
    $.get(
      "users/list.php",
      function (data) {
        // csak adminokat listázunk === 'admin'
        // mindenkit listázunk most ez a helyezet jó ha mindenkit tud módosítani az admin
        const admins = data.filter((u) => u.role !== "all");

        const rows = admins.map(
          (u) => `
          <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.role}</td>
            <td>
              <button class="btn btn-sm btn-primary editBtn" data-id="${u.id}">Szerkesztés</button>
              <button class="btn btn-sm btn-danger deleteBtn" data-id="${u.id}">Törlés</button>
            </td>
          </tr>
        `
        );
        $("#usersTable tbody").html(rows.join(""));
      },
      "json"
    );
  }

  loadUsers();

  //új felhasználó készítése
  $("#addUserBtn").click(() => {
    $("#userForm")[0].reset();
    $("input[name='id']").val("");
    userModal.show();
  });

  //felhasználó adatainak betöltése a userModal-ban vannak az elemek amiket kitöltünk itt, hogy később módosításíthassuk a userForm-nál ha submit történik
  $("#usersTable").on("click", ".editBtn", function () {
    const id = $(this).data("id");
    $.get(
      `users/get.php?id=${id}`,
      function (u) {
        $("input[name='id']").val(u.id);
        $("input[name='name']").val(u.name);
        $("select[name='role']").val(u.role);
        $("input[name='password']").val("");
        userModal.show();
      },
      "json"
    );
  });

  //felhasználó törlése
  $("#usersTable").on("click", ".deleteBtn", function () {
    if (confirm("Biztosan törlöd a felhasználót?")) {
      const id = $(this).data("id");
      $.post(
        "users/delete.php",
        { id },
        function (res) {
          if (res.success) {
            alert("Felhasználó törölve");
            loadUsers();
          } else {
            alert("Hiba történt a törlés során");
          }
        },
        "json"
      );
    }
  });

  //Felhasználó mentése
  $("#userForm").submit(function (e) {
    e.preventDefault();
    const id = $("input[name='id']").val();
    //ha van id akkor módosítunk ha nincs akkkor újat adunk hozzá
    const url = id ? "users/update.php" : "users/add.php";

    // Ha új jelszó nem lett megadva update esetén, akkor ne küldjük át csak a többi adatot amit megadtak
    let formData = $(this).serializeArray();
    if (id && !$("input[name='password']").val()) {
      formData = formData.filter((f) => f.name !== "password");
    }

    $.post(
      url,
      $.param(formData),
      function (res) {
        if (res.success) {
          alert("Sikeres mentés");
          userModal.hide();
          loadUsers();
        } else {
          alert("Hiba: " + (res.error || "Ismeretlen hiba"));
        }
      },
      "json"
    );
  });
});
