export default function Card({ children, className = '', hover = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={[
        'rounded-[26px] glass-card border border-[var(--border-card)] shadow-[0_6px_28px_rgba(0,0,0,0.22)] transition-all duration-300',
        hover ? 'card-bouncy cursor-pointer' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
