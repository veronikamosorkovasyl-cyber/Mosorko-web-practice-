import { Link } from 'react-router-dom';

export default function Button({ to, variant, className = '', children, ...rest }) {
  const cls = `btn${variant ? ` btn--${variant}` : ''} ${className}`.trim();
  if (to) return <Link className={cls} to={to} {...rest}>{children}</Link>;
  return <button className={cls} type="button" {...rest}>{children}</button>;
}
