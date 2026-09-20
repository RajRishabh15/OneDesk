export default function Card({ children, className = '', hover = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={[
        'rounded-2xl glass-card shadow-[0_4px_24px_rgba(0,0,0,0.20)]',
        hover ? 'card-bouncy cursor-pointer' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
