export default function Card({ children, className = '', hover = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={[
        'rounded-xl border border-stone-200/80 dark:border-stone-800/80',
        'bg-white dark:bg-[#1a1a18]',
        'shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
        hover ? 'transition-all duration-150 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-[0_3px_10px_rgba(0,0,0,0.04)]' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
