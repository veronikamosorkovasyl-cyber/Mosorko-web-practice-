export default function OrderSummary({ place, items, total }) {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Ваше замовлення</h2>
      <p className="summary__place">{place}</p>

      <ul id="selected-list" aria-live="polite">
        {items.length === 0 && <li className="summary__empty">Обрані місця будуть тут</li>}
        {items.map((s) => (
          <li key={s.key}>
            <span>Ряд {s.row}, місце {s.seat}</span>
            <span>{s.price} грн</span>
          </li>
        ))}
      </ul>

      <p>Всього: <output>{items.length}</output> квитків</p>
      <p className="summary__total">Сума: <output>{total}</output> грн</p>
      <button className="btn" type="submit" disabled={items.length === 0}>Продовжити</button>
    </aside>
  );
}
