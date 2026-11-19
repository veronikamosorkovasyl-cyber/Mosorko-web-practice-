export default function Field({ id, label, error, hint, as: Tag = 'input', ...props }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && <small id={`${id}-error`} role="alert" style={{ color: 'var(--color-error)' }}>{error}</small>}
    </p>
  );
}
