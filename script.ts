interface Vehicle {
  name: string,
  plate: string,
  timeIn: string | Date,
}

(function (){
  const saveButtonElement: HTMLButtonElement | null = (<HTMLButtonElement> document.getElementById("save"));
  const nameInputElement: HTMLInputElement | null = (<HTMLInputElement> document.getElementById("name"));
  const plateInputElement: HTMLInputElement | null = (<HTMLInputElement> document.getElementById("plate"));
  const tableElement: HTMLTableElement | null = (<HTMLTableElement> document.getElementById("table"));

  function parkingLot() {
    function save(vehicles: Vehicle[]) {
      localStorage.setItem("parkingLot", JSON.stringify(vehicles));
    }
    
    function remove(plate: string) {
      const {timeIn, name} = getState().find((vehicle) => vehicle.plate === plate);
      const timeSpent = new Date().getTime() - new Date(timeIn).getTime();
      if(!confirm(`Vehicle stayed ${Math.floor(timeSpent / (1000 * 60))} minutes`)) return;
      save(getState().filter((vehicle) => vehicle.plate !== plate));
      render();
    }

    function add(vehicle: Vehicle, render: boolean = false): void {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.timeIn}</td>
        <td>
          <button class="remove" data-plate="${vehicle.plate}"> X </button>
        </td>
      `;
      row.querySelector(".remove")?.addEventListener("click", function (){
        remove(this.dataset.plate);
      })
      tableElement?.appendChild(row);
      if(render){
        save([...getState(), vehicle]);
      }
    }

    function getState(): Vehicle[] {
      return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
    }

    function render() {
      tableElement!.innerHTML = "";
      const parkingLot = getState();
      if(parkingLot.length > 0){
        parkingLot.forEach((vehicle) => add(vehicle));
      }
    }

    return {getState, add, remove, save, render}
  }

  saveButtonElement?.addEventListener("click", () => {
    const name = nameInputElement?.value;
    const plate = plateInputElement?.value;
    if(!name || !plate){
      alert("Name and plate are required");
      return;
    }
    parkingLot().add({name, plate, timeIn: new Date().toISOString()}, true);
  })

  parkingLot().render();
})();