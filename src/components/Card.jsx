export default function Card({ children, className = '', hover = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={[
        'rounded-2xl glass-card shadow-[0_4px_24px_rgba(0,0,0,0.20)]',
        hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
