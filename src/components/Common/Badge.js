/**
 * Badge Component
 * Display status badges with different variants
 */
function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const baseStyles = 'font-medium rounded-full inline-flex items-center';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const badgeClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
}

export default Badge;
