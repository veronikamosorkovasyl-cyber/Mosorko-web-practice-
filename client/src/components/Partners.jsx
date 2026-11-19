const LOCATIONS = [
  { name: 'Локація А', address: 'вул. Приклад, 1, Івано-Франківськ' },
  { name: 'Локація Б', address: 'вул. Приклад, 2, Івано-Франківськ' },
  { name: 'Локація В', address: 'вул. Приклад, 3, Івано-Франківськ' },
];

export default function Partners() {
  return (
    <aside className="partners" aria-labelledby="partners-title">
      <h2 id="partners-title">Кінотеатри, з якими ми працюємо</h2>
      <ul className="location-list">
        {LOCATIONS.map((l) => (
          <li key={l.name}>
            <address><strong>{l.name}</strong><br />{l.address}</address>
          </li>
        ))}
      </ul>
    </aside>
  );
}
