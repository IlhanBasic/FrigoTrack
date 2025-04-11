import "./table.css";
const TABLEHEADERS = {
  _id: "ID",
  roomNumber: "Broj Sobe",
  location: "Lokacija",
  temperature: "Temperatura (°C)",
  capacityKg: "Kapacitet (KG)",
  currentLoadKg: "Tezina (KG)",
  type: "Tip",
  isActive: "Aktivan",
  createdAt: "Datum kreiranja",
  updatedAt: "Datum azuriranja",
  email: "Email",
  address: "Adresa",
  phone: "Telefon",
  pibOrJmbg: "PIB/JMBG",
  isVATRegistered: "Registracija PDV-a",
  accountNumber: "Broj racuna",
  bankName: "Banka",
  startDate: "Datum pocetka",
  endDate: "Datum kraja",
  fileUrl: "URL fajla",
  name: "Ime",
  variety: "Vrsta",
  harvestYear: "Godina",
  sku: "SKU",
  purchasePrice: "Cena kupovine (RSD)",
  sellingPrice: "Cena prodaje (RSD)",
  vatRate: "PDV (%)",
  currentStockKg: "Tezina na stanju (KG)",
  minStockKg: "Minimalna tezina na stanju (KG)",
  sugarContent: "Kolicina sećera (%)",
  acidity: "Kiselost (°pH)",
  brix: "Brix (%)",
  freezingMethod: "Metoda zamrzavanja",
  expiryDate: "Datum isteka",
  documentNumber: "Broj dokumenta",
  date: "Datum",
  driverName: "Ime vozaca",
  vehiclePlate: "Registarska oznaka vozila",
  cost: "Trosak prevoza (RSD)",
  notes: "Opis",
  status: "Status",
  amountPaid: "Placeno (RSD)",
  paymentDate: "Datum placanja",
  method: "Metoda placanja",
};
export default function Table({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <>
        <p>Tabela je prazna.</p>
        <hr />
      </>
    );
  }

  const headers = Object.keys(items[0]);

  return (
    <table className="table">
      <thead>
        <tr>
          {headers
            .filter(
              (key) =>
                typeof items[0][key] !== "object" &&
                !["_id", "createdAt", "updatedAt", "__v"].includes(key)
            )
            .map((key) => (
              <th key={key}>{TABLEHEADERS[key] || key}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item._id || index}>
            {headers
              .filter(
                (key) =>
                  typeof item[key] !== "object" &&
                  !["_id", "createdAt", "updatedAt", "__v"].includes(key)
              )
              .map((key) => (
                <td key={key}>
                  {[
                    "date",
                    "startDate",
                    "endDate",
                    "expiryDate",
                    "paymentDate",
                  ].includes(key)
                    ? new Intl.DateTimeFormat("hr-HR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(item[key]))
                    : String(item[key])}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
