(function () {
    const saveButtonElement = document.getElementById("save");
    const nameInputElement = document.getElementById("name");
    const plateInputElement = document.getElementById("plate");
    const tableElement = document.getElementById("table");
    function parkingLot() {
        function save(vehicles) {
            localStorage.setItem("parkingLot", JSON.stringify(vehicles));
        }
        function remove(plate) {
            const { timeIn, name } = getState().find((vehicle) => vehicle.plate === plate);
            const timeSpent = new Date().getTime() - new Date(timeIn).getTime();
            if (!confirm(`Vehicle stayed ${Math.floor(timeSpent / (1000 * 60))} minutes`))
                return;
            save(getState().filter((vehicle) => vehicle.plate !== plate));
            render();
        }
        function add(vehicle, render = false) {
            var _a;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.timeIn}</td>
        <td>
          <button class="remove" data-plate="${vehicle.plate}"> X </button>
        </td>
      `;
            (_a = row.querySelector(".remove")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            tableElement === null || tableElement === void 0 ? void 0 : tableElement.appendChild(row);
            if (render) {
                save([...getState(), vehicle]);
            }
        }
        function getState() {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }
        function render() {
            tableElement.innerHTML = "";
            const parkingLot = getState();
            if (parkingLot.length > 0) {
                parkingLot.forEach((vehicle) => add(vehicle));
            }
        }
        return { getState, add, remove, save, render };
    }
    saveButtonElement === null || saveButtonElement === void 0 ? void 0 : saveButtonElement.addEventListener("click", () => {
        const name = nameInputElement === null || nameInputElement === void 0 ? void 0 : nameInputElement.value;
        const plate = plateInputElement === null || plateInputElement === void 0 ? void 0 : plateInputElement.value;
        if (!name || !plate) {
            alert("Name and plate are required");
            return;
        }
        parkingLot().add({ name, plate, timeIn: new Date().toISOString() }, true);
    });
    parkingLot().render();
})();
