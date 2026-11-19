export default function SeatMap({ hall, selected, onToggle }) {
  const rows = Array.from({ length: hall.rows }, (_, i) => i + 1);
  const seats = Array.from({ length: hall.seatsPerRow }, (_, i) => i + 1);

  return (
    <>
      <figure className="hall">
        <div className="screen" aria-hidden="true">Екран</div>

        {rows.map((row) => {
          const vip = hall.vipRows.includes(row);
          const price = vip ? hall.prices.vip : hall.prices.standard;
          return (
            <fieldset key={row} className={`hall-row${vip ? ' hall-row--vip' : ''}`}>
              <legend>Ряд {row}{vip && ' (VIP)'}</legend>
              {seats.map((n) => {
                const key = `${row}-${n}`;
                const taken = hall.taken.includes(key);
                const id = `r${row}s${n}`;
                return (
                  <span key={key} style={{ display: 'contents' }}>
                    <input id={id} type="checkbox" name="seat" value={key}
                           checked={selected.includes(key)} disabled={taken}
                           onChange={() => onToggle(key, price)} />
                    <label htmlFor={id} className={`seat${vip ? ' seat--vip' : ''}`}>
                      <span aria-hidden="true">{n}</span>
                      <span className="visually-hidden">
                        {`Ряд ${row}, місце ${n}, ${price} грн${taken ? ', зайняте' : ''}`}
                      </span>
                    </label>
                  </span>
                );
              })}
            </fieldset>
          );
        })}

        <figcaption>Ряди 1–{hall.rows - 1} — звичайні місця, ряд {hall.rows} — VIP.</figcaption>
      </figure>

      <h3>Умовні позначення</h3>
      <ul className="legend">
        <li><span className="swatch swatch--free" aria-hidden="true"></span> Вільне</li>
        <li><span className="swatch swatch--selected" aria-hidden="true"></span> Обране</li>
        <li><span className="swatch swatch--taken" aria-hidden="true"></span> Зайняте</li>
        <li><span className="swatch swatch--vip" aria-hidden="true"></span> VIP — {hall.prices.vip} грн</li>
        <li><span className="swatch swatch--free" aria-hidden="true"></span> Одне місце — {hall.prices.standard} грн</li>
      </ul>
    </>
  );
}
